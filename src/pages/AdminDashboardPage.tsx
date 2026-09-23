import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, LogOut, Eye, RefreshCw
} from 'lucide-react';
import type { RentalApplication, ApplicationStatus } from '../types';
import { store } from '../services/store';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Verify auth session
  useEffect(() => {
    const user = store.getAdminUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(user);
    loadApplications();
  }, [navigate]);

  const loadApplications = async () => {
    setLoading(true);
    const data = await store.getApplications();
    setApplications(data);
    setLoading(false);
  };

  const handleLogout = () => {
    store.adminLogout();
    navigate('/admin/login');
  };

  // Status quick update
  const handleStatusChange = async (id: string, newStatus: ApplicationStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    await store.updateApplicationStatus(id, newStatus);
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus, updated_at: new Date().toISOString() } : app))
    );
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = applications.length;
    const countNew = applications.filter((a) => a.status === 'New').length;
    const countReview = applications.filter((a) => a.status === 'Under Review').length;
    const countApproved = applications.filter((a) => a.status === 'Approved').length;
    const countRejected = applications.filter((a) => a.status === 'Rejected').length;
    return { total, countNew, countReview, countApproved, countRejected };
  }, [applications]);

  // Unique properties list for filtering
  const propertyNames = useMemo(() => {
    const names = applications.map((a) => a.property_name).filter(Boolean);
    return Array.from(new Set(names));
  }, [applications]);

  // Filtered & sorted applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = `${app.first_name} ${app.last_name}`.toLowerCase().includes(q);
        const matchesEmail = app.email.toLowerCase().includes(q);
        const matchesPhone = app.phone.toLowerCase().includes(q);
        const matchesRef = app.reference_number.toLowerCase().includes(q);
        const matchesProp = app.property_name.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesRef && !matchesProp) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // Property
      if (propertyFilter !== 'all' && app.property_name !== propertyFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [applications, search, statusFilter, propertyFilter, sortOrder]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'New':
        return <span className="badge badge-status-new">New</span>;
      case 'Under Review':
        return <span className="badge badge-status-review">Under Review</span>;
      case 'Approved':
        return <span className="badge badge-status-approved">Approved</span>;
      case 'Rejected':
        return <span className="badge badge-status-rejected">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '5rem' }}>
      {/* Admin Top Navigation */}
      <header style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-inverse)',
        borderBottom: '1px solid var(--border-dark)',
        padding: '0.85rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 500, color: '#FFFFFF' }}>
              OpenLeasewithus
            </span>
            <span style={{
              fontSize: '0.7rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              Staff Admin
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8125rem' }}>
            <span style={{ color: '#A6A095' }}>
              Logged in as <strong style={{ color: '#FFFFFF' }}>{adminUser?.username || 'Staff Administrator'}</strong>
            </span>
            <Link to="/" style={{ color: '#D4CEBF' }}>
              View Public Site
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#E07A5F',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8125rem',
                padding: '0.25rem 0.5rem'
              }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Dashboard Title & Quick Actions */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Leasing Applications Dashboard</h1>
            <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
              Review, verify, and manage all incoming residential lease submissions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: store.isConfigured() ? 'var(--status-approved-bg)' : 'var(--status-review-bg)',
              color: store.isConfigured() ? 'var(--status-approved)' : 'var(--status-review)',
              fontWeight: 500,
              border: `1px solid ${store.isConfigured() ? 'rgba(46, 125, 50, 0.2)' : 'rgba(180, 83, 9, 0.2)'}`
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: store.isConfigured() ? 'var(--status-approved)' : 'var(--status-review)'
              }} />
              {store.isConfigured() ? 'Supabase Live' : 'Local Storage Mode'}
            </span>

            <button
              onClick={loadApplications}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh Queue
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {/* Total */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Applications
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {metrics.total}
            </div>
          </div>

          {/* New */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            borderLeft: '3px solid var(--status-new)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-new)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              New Submissions
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {metrics.countNew}
            </div>
          </div>

          {/* Under Review */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            borderLeft: '3px solid var(--status-review)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-review)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Under Review
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {metrics.countReview}
            </div>
          </div>

          {/* Approved */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            borderLeft: '3px solid var(--status-approved)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-approved)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Approved
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {metrics.countApproved}
            </div>
          </div>

          {/* Rejected */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            borderLeft: '3px solid var(--status-rejected)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-rejected)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Rejected
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {metrics.countRejected}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }}>
              <Search size={14} />
            </span>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses ({applications.length})</option>
              <option value="New">New ({metrics.countNew})</option>
              <option value="Under Review">Under Review ({metrics.countReview})</option>
              <option value="Approved">Approved ({metrics.countApproved})</option>
              <option value="Rejected">Rejected ({metrics.countRejected})</option>
            </select>
          </div>

          {/* Property Filter */}
          <div>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              {propertyNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="newest">Sort: Newest Submissions</option>
              <option value="oldest">Sort: Oldest Submissions</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading applications queue...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No applications found</div>
              <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or filters.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Applicant</th>
                  <th>Property</th>
                  <th>Monthly Income</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const dateStr = new Date(app.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={app.id}
                      onClick={() => navigate(`/admin/applications/${app.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <strong style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                          {app.reference_number}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.first_name} {app.last_name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{app.email}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{app.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{app.property_name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Move-in: {app.preferred_move_in}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>${app.monthly_income?.toLocaleString()}/mo</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Via {app.preferred_payment_method}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8125rem' }}>{dateStr}</div>
                      </td>
                      <td>
                        {getStatusBadge(app.status)}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.775rem', width: 'auto' }}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus, e as any)}
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <Link
                          to={`/admin/applications/${app.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye size={12} />
                          Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
