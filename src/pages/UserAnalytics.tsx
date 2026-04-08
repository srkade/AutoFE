import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api';
import { 
  getAuthorCount, 
  getTotalUploads, 
  getUploadSuccessRate, 
  getRecentActivity, 
  getActivityDistribution,
  getActiveUserTrends,
  getUploadsPerUser
} from '../services/superAdminApi';
import { User } from '../components/Schematic/SchematicTypes';
import { FiUsers, FiUploadCloud, FiActivity, FiZap, FiTrendingUp, FiPieChart, FiBarChart2, FiCalendar } from 'react-icons/fi';

interface UploadsPerUser {
  userId: string;
  username: string;
  email: string;
  uploadCount: number;
  authorName?: string;
}

interface GroupedUsers {
  [authorId: string]: User[];
}

export default function UserAnalytics() {
  const [authorCount, setAuthorCount] = useState<number | null>(null);
  const [totalUploads, setTotalUploads] = useState<number | null>(null);
  const [uploadSuccessRate, setUploadSuccessRate] = useState<number>(0);
  const [uploadsPerUser, setUploadsPerUser] = useState<UploadsPerUser[]>([]);
  const [activityDistribution, setActivityDistribution] = useState<Record<string, number>>({});
  const [userTrends, setUserTrends] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [
        countAuthors, 
        countUploads, 
        successRate, 
        perUser, 
        distribution, 
        trends
      ] = await Promise.all([
        getAuthorCount(),
        getTotalUploads(),
        getUploadSuccessRate(),
        getUploadsPerUser(),
        getActivityDistribution(),
        getActiveUserTrends(7)
      ]);

      setAuthorCount(countAuthors);
      setTotalUploads(countUploads);
      
      // Handle successRate format
      if (successRate && typeof successRate === 'object' && 'successRate' in successRate) {
        setUploadSuccessRate(successRate.successRate);
      } else {
        setUploadSuccessRate(successRate || 0);
      }

      setUploadsPerUser(perUser || []);
      setActivityDistribution(distribution || {});
      setUserTrends(trends.trends || {});
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#64748b' }}>
        <FiActivity size={48} className="animate-pulse" style={{ marginBottom: '16px', color: '#3b82f6' }} />
        <h3>Gathering Neural Analytics...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 10px', animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .analytics-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .trend-bar { transition: height 0.3s ease, background-color 0.2s; cursor: pointer; }
        .trend-bar:hover { background-color: #2563eb !important; }
      `}</style>

      <div style={{ marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>User Intelligence & Performance</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Behavioral insights, engagement metrics, and system-wide usage trends.</p>
      </div>

      {/* Hero Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="analytics-card" style={{ borderBottom: '4px solid #3b82f6' }}>
          <FiUsers color="#3b82f6" size={20} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{authorCount?.toLocaleString() || "0"}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Authors</div>
        </div>

        <div className="analytics-card" style={{ borderBottom: '4px solid #10b981' }}>
          <FiUploadCloud color="#10b981" size={20} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{totalUploads?.toLocaleString() || "0"}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Files Processed</div>
        </div>

        <div className="analytics-card" style={{ borderBottom: '4px solid #f59e0b' }}>
          <FiZap color="#f59e0b" size={20} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{uploadSuccessRate}%</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Efficiency</div>
        </div>

        <div className="analytics-card" style={{ borderBottom: '4px solid #8b5cf6' }}>
          <FiActivity color="#8b5cf6" size={20} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{Object.values(activityDistribution).reduce((a, b) => a + b, 0).toLocaleString()}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Interaction events</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Engagement Trends */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTrendingUp color="#3b82f6" /> Daily Engagement Trends
            </h3>
            <span style={{ fontSize: '12px', padding: '4px 12px', background: '#eff6ff', borderRadius: '20px', color: '#3b82f6', fontWeight: '600' }}>Last 7 Days</span>
          </div>
          
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
            {Object.entries(userTrends).map(([date, count], index) => {
              const max = Math.max(...Object.values(userTrends), 1);
              const height = (count / max) * 180;
              return (
                <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', gap: '8px' }}>
                  <div style={{ position: 'relative', width: '24px' }}>
                     <div 
                       className="trend-bar"
                       style={{ 
                         height: `${height}px`, 
                         width: '100%', 
                         backgroundColor: '#3b82f6', 
                         borderRadius: '4px 4px 0 0',
                         minHeight: '2px'
                       }} 
                     />
                     <div style={{ position: 'absolute', top: -25, left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: '700', color: '#1e293b' }}>{count}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', marginTop: '10px' }}>
                    {date.split('-').slice(1).join('/')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Distribution */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiPieChart color="#8b5cf6" /> Action Distribution
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(activityDistribution).sort((a: any, b: any) => b[1] - a[1]).map(([action, count]: [string, any], idx: number) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
              const color = colors[idx % colors.length];
              const total = Object.values(activityDistribution).reduce((a, b) => a + b, 0);
              const percent = ((count / total) * 100).toFixed(1);
              
              return (
                <div key={action}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#475569', fontWeight: '600' }}>{action}</span>
                      <span style={{ color: '#1e293b', fontWeight: '800' }}>{count} logs ({percent}%)</span>
                   </div>
                   <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: color }} />
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="analytics-card">
         <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiBarChart2 color="#10b981" /> Contributions per Administrator
         </h3>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
                  <th style={{ padding: '16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '14px' }}>Author Name</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '14px' }}>Identity / Email</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '14px', textAlign: 'center' }}>Total Files</th>
                  <th style={{ padding: '16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '14px' }}>Contribution Level</th>
                </tr>
              </thead>
              <tbody>
                {uploadsPerUser.map((user, idx) => (
                  <tr key={`${user.userId}-${user.email}-${idx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#1e293b' }}>{user.authorName || (user as any).username || 'N/A'}</td>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>{user.email || 'N/A'}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '800', color: '#3b82f6' }}>{user.uploadCount || 0}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'inline-block', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '700',
                        backgroundColor: user.uploadCount > 10 ? '#dcfce7' : user.uploadCount > 5 ? '#eff6ff' : '#f8fafc',
                        color: user.uploadCount > 10 ? '#166534' : user.uploadCount > 5 ? '#1d4ed8' : '#475569'
                      }}>
                        {user.uploadCount > 10 ? 'Power User' : user.uploadCount > 5 ? 'Active' : 'Contributor'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}