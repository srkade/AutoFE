import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiX, FiCheck, FiGlobe, FiInfo, FiAlertCircle, FiKey, FiEye, FiEyeOff } from 'react-icons/fi';
import '../Styles/ModelManagement.css';
import { API_BASE_URL as API_BASE_URL_BACKEND } from '../config';

interface Company {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  activeModelsCount?: number;
  deactivatedModelsCount?: number;
  deletedModelsCount?: number;
  modelCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthorInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

interface CompanyManagementProps {
  token: string | null;
}

const API_BASE_URL = API_BASE_URL_BACKEND;

const CompanyManagement: React.FC<CompanyManagementProps> = ({ token }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [authorEdit, setAuthorEdit] = useState({ email: '', newPassword: '' });
  const [showAuthorPassword, setShowAuthorPassword] = useState(false);
  const [fetchingAuthor, setFetchingAuthor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [authorCredentials, setAuthorCredentials] = useState<{
    email: string;
    temporaryPassword: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  const fetchCompanies = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      } else {
        showMessage('error', 'Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      showMessage('error', 'Error loading companies');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showMessage('error', 'Company name is required');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingCompany
        ? `${API_BASE_URL}/api/companies/${editingCompany.id}`
        : `${API_BASE_URL}/api/companies`;

      const method = editingCompany ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: editingCompany?.id,
          createdAt: editingCompany?.createdAt,
          updatedAt: editingCompany?.updatedAt
        })
      });

      if (response.ok) {
        if (!editingCompany) {
          // NEW company (POST) — response has JSON with authorCredentials
          const responseData = await response.json().catch(() => ({}));
          if (responseData.authorCredentials) {
            setAuthorCredentials(responseData.authorCredentials);
            setShowCredentials(true);
            showMessage('success', 'Company and author user created successfully!');
          } else {
            showMessage('success', 'Company created successfully');
          }
        } else {
          // UPDATE company (PUT) — response body is empty (Void), do NOT call .json()
          // If author fields were also changed, update them via the author endpoint
          if (authorEdit.email.trim() || authorEdit.newPassword.trim()) {
            const authorPayload: Record<string, string> = {};
            if (authorEdit.email.trim()) authorPayload.email = authorEdit.email.trim();
            if (authorEdit.newPassword.trim()) authorPayload.password = authorEdit.newPassword.trim();

            const authorRes = await fetch(`${API_BASE_URL}/api/companies/${editingCompany.id}/author`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(authorPayload)
            });

            if (!authorRes.ok) {
              const errData = await authorRes.json().catch(() => ({}));
              showMessage('error', errData.error || 'Company updated but failed to update author credentials');
            } else {
              showMessage('success', 'Company and author credentials updated successfully!');
            }
          } else {
            showMessage('success', 'Company updated successfully');
          }
        }

        await fetchCompanies();
        resetForm();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showMessage('error', errorData.message || errorData.error || 'Failed to save company');
      }
    } catch (error) {
      console.error('Error saving company:', error);
      showMessage('error', 'Error saving company');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchCompanyAuthor = async (companyId: string) => {
    setFetchingAuthor(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/companies/${companyId}/author`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const author: AuthorInfo = await res.json();
        setAuthorEdit({ email: author.email, newPassword: '' });
      } else {
        setAuthorEdit({ email: '', newPassword: '' });
      }
    } catch {
      setAuthorEdit({ email: '', newPassword: '' });
    } finally {
      setFetchingAuthor(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description || '',
      isActive: company.isActive
    });
    setAuthorEdit({ email: '', newPassword: '' });
    setShowAuthorPassword(false);
    setShowForm(true);
    fetchCompanyAuthor(company.id);
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}"? This will also delete all associated models and users. This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('success', 'Company deleted successfully');
        await fetchCompanies();
      } else {
        showMessage('error', 'Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      showMessage('error', 'Error deleting company');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', isActive: true });
    setAuthorEdit({ email: '', newPassword: '' });
    setShowAuthorPassword(false);
    setEditingCompany(null);
    setShowForm(false);
  };

  const closeCredentialsModal = () => {
    setShowCredentials(false);
    setAuthorCredentials(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="company-management">
      {/* Message Alert */}
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="alert-close">
            <FiX />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FiGlobe size={32} />
          </div>
          <div className="header-text">
            <h2>Company Management</h2>
            <p>Create and manage companies (tenants) for multi-tenant access control</p>
          </div>
        </div>
        <button
          className="btn btn-primary btn-add"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <FiPlus />
          <span>Add New Company</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingCompany ? (
                  <>
                    <FiEdit2 /> Edit Company
                  </>
                ) : (
                  <>
                    <FiPlus /> Create New Company
                  </>
                )}
              </h3>
              <button className="btn-close" onClick={resetForm}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="company-form">
              <div className="form-group">
                <label htmlFor="company-name">
                  Company Name <span className="required">*</span>
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Acme Corporation"
                  required
                  maxLength={100}
                  autoFocus
                />
                <small className="form-hint">Enter a unique company name</small>
              </div>

              <div className="form-group">
                <label htmlFor="company-description">
                  Description <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="company-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the company..."
                  rows={4}
                  maxLength={500}
                />
                <small className="form-hint">{formData.description.length}/500 characters</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="checkbox-custom">
                    {formData.isActive && <FiCheck />}
                  </span>
                  <span className="checkbox-text">
                    Active Company
                  </span>
                </label>
                <small className="form-hint">Inactive companies cannot create new models</small>
              </div>

              {/* Author Credentials Section — only shown when editing */}
              {editingCompany && (
                <div style={{
                  marginTop: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'white'
                  }}>
                    <FiKey size={16} />
                    <strong style={{ fontSize: '14px' }}>Author Credentials</strong>
                    <span style={{ fontSize: '12px', opacity: 0.85, marginLeft: 'auto' }}>
                      Leave password blank to keep unchanged
                    </span>
                  </div>

                  <div style={{ padding: '16px', background: 'var(--bg-secondary, #f8fafc)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {fetchingAuthor ? (
                      <div style={{ textAlign: 'center', padding: '8px', color: '#64748b', fontSize: '13px' }}>
                        Loading author info…
                      </div>
                    ) : (
                      <>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label htmlFor="author-email" style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                            Author Email
                          </label>
                          <input
                            id="author-email"
                            type="email"
                            value={authorEdit.email}
                            onChange={(e) => setAuthorEdit({ ...authorEdit, email: e.target.value })}
                            placeholder="author@company.com"
                            style={{ marginTop: '6px' }}
                          />
                          <small className="form-hint">Change the author's login email</small>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label htmlFor="author-new-password" style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                            New Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                          </label>
                          <div style={{ position: 'relative', marginTop: '6px' }}>
                            <input
                              id="author-new-password"
                              type={showAuthorPassword ? 'text' : 'password'}
                              value={authorEdit.newPassword}
                              onChange={(e) => setAuthorEdit({ ...authorEdit, newPassword: e.target.value })}
                              placeholder="Leave blank to keep current password"
                              style={{ paddingRight: '44px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowAuthorPassword(p => !p)}
                              style={{
                                position: 'absolute', right: '10px', top: '50%',
                                transform: 'translateY(-50%)', background: 'none',
                                border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'
                              }}
                              title={showAuthorPassword ? 'Hide password' : 'Show password'}
                            >
                              {showAuthorPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                          <small className="form-hint">Set a new password for the author account</small>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !formData.name.trim()}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      {editingCompany ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingCompany ? <FiCheck /> : <FiPlus />}
                      {editingCompany ? 'Update Company' : 'Create Company'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Author Credentials Modal */}
      {showCredentials && authorCredentials && (
        <div className="modal-overlay" onClick={closeCredentialsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <h3 style={{ color: 'white' }}>
                <FiCheck /> Author Credentials Created
              </h3>
              <button className="btn-close" onClick={closeCredentialsModal} style={{ color: 'white' }}>
                <FiX />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <FiAlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#92400e', display: 'block', marginBottom: '4px' }}>Important: Save These Credentials!</strong>
                    <span style={{ color: '#78350f', fontSize: '14px' }}>
                      Share these credentials with the company author. They should change the password on first login.
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Author Email
                  </label>
                  <div style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#1e293b',
                    fontWeight: 600
                  }}>
                    {authorCredentials.email}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Temporary Password
                  </label>
                  <div style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#dc2626',
                    fontWeight: 600
                  }}>
                    {authorCredentials.temporaryPassword}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Role
                  </label>
                  <div style={{
                    background: 'white',
                    border: '2px solid #10b981',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '14px',
                    color: '#10b981',
                    fontWeight: 600,
                    display: 'inline-block'
                  }}>
                    Author (Company Admin)
                  </div>
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <strong style={{ color: '#1e40af', display: 'block', marginBottom: '8px' }}>Next Steps:</strong>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#1e3a8a', fontSize: '14px', lineHeight: '1.8' }}>
                  <li>Copy the email and password above</li>
                  <li>Share securely with the company author</li>
                  <li>Author logs in with these credentials</li>
                  <li>Author can create models for their company</li>
                  <li>Author should change password after first login</li>
                </ol>
              </div>

              <button
                className="btn btn-primary"
                onClick={closeCredentialsModal}
                style={{ width: '100%', padding: '12px' }}
              >
                <FiCheck /> I've Saved the Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Companies Table */}
      <div className="table-section">
        <div className="table-header">
          <h3>
            <FiGlobe />
            Companies ({companies.length})
          </h3>
          <button className="btn btn-outline btn-refresh" onClick={fetchCompanies}>
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {companies.length === 0 ? (
          <div className="empty-state">
            <FiGlobe size={48} />
            <h4>No Companies Yet</h4>
            <p>Get started by creating your first company</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FiPlus /> Create First Company
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-company">Company Name</th>
                  <th className="col-description">Description</th>
                  <th className="col-status">Status</th>
                  <th className="col-models">Active Models</th>
                  <th className="col-models">Deactivated</th>
                  <th className="col-models">Deleted</th>
                  <th className="col-created">Created</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className={!company.isActive ? 'row-inactive' : ''}>
                    <td className="col-company">
                      <div className="company-name-cell">
                        <FiGlobe className="company-icon" />
                        <span className="company-name-text">{company.name}</span>
                      </div>
                    </td>
                    <td className="col-description">
                      <span className="description-text">
                        {company.description || <em className="text-muted">No description</em>}
                      </span>
                    </td>
                    <td className="col-status">
                      {company.isDeleted ? (
                        <span className="status-badge status-rejected" style={{ background: '#fee2e2', color: '#dc2626', borderColor: '#fecaca' }}>
                          <FiTrash2 /> Deleted
                        </span>
                      ) : (
                        <span className={`status-badge ${company.isActive ? 'status-active' : 'status-inactive'}`}>
                          {company.isActive ? (
                            <><FiCheck /> Active</>
                          ) : (
                            <><FiX /> Inactive</>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="col-models">
                      <span className="badge-count status-active" style={{ minWidth: '30px', textAlign: 'center' }}>
                        {company.activeModelsCount || 0}
                      </span>
                    </td>
                    <td className="col-models">
                      <span className="badge-count status-inactive" style={{ minWidth: '30px', textAlign: 'center' }}>
                        {company.deactivatedModelsCount || 0}
                      </span>
                    </td>
                    <td className="col-models">
                      <span className="badge-count status-rejected" style={{ minWidth: '30px', textAlign: 'center', background: '#fee2e2', color: '#dc2626' }}>
                        {company.deletedModelsCount || 0}
                      </span>
                    </td>
                    <td className="col-created">
                      <span className="date-text">
                        {new Date(company.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(company)}
                          title="Edit Company"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(company.id, company.name)}
                          title="Delete Company"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
