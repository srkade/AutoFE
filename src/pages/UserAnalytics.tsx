import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api';
import { getAllUploads, getUploadsByUser } from '../services/uploadApi';
import { User } from '../components/Schematic/SchematicTypes';
import { getAuthorCount, getTotalUploads, getUploadSuccessRate ,getUploadedByUser} from '../services/superAdminApi';

interface UserAnalyticsData {
  totalActiveUsers: number;
  uploadsPerUser: number;
  rendersPerDay: number;
  mostUsedComponents: {
    name: string;
    count: number;
  }[];
  uploadSuccessRate: number;
  dailyActiveUsers: number[];
  weeklyTrends: {
    week: string;
    uploads: number;
    renders: number;
  }[];
}

interface UploadsPerUser {
  userId: string;
  username: string;
  email: string;
  uploadCount: number;
  authorId?: string;
  authorName?: string;
}

interface GroupedUsers {
  [authorId: string]: User[];
}

export default function UserAnalytics() {
  const [authorCount, setAuthorCount] = useState<number | null>(null);
  const [uploadsPerUser, setUploadsPerUser] = useState<UploadsPerUser[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [totalUploads, setTotalUploads] = useState<number | null>(null);
  const [svgRendersPerDay, setSvgRendersPerDay] = useState<number>(0); 
  const [uploadSuccessRate,setUploadSuccessRate]=useState<number>(0);
  const[authorUploadsCount,setAuthorUploadsCount]=useState<{[authorId:string]:number}>({});
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const authorCountData = await getAuthorCount();
        setAuthorCount(authorCountData);
      } catch (error) {
        console.error('Error fetching author count:', error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchTotalUploads = async () => {
      try {
        const totalUploadsData = await getTotalUploads();
        setTotalUploads(totalUploadsData);
      } catch (error) {
        console.error('Error fetching total uploads:', error);
      }
    };

    fetchTotalUploads();
  }, []);
  
  // Track SVG renders per day using localStorage to persist counts
  useEffect(() => {
    const updateRendersPerDay = () => {
      const today = new Date().toDateString();
      const storedData = localStorage.getItem('schematicRendersAnalytics');
      let renderData = storedData ? JSON.parse(storedData) : { date: today, count: 0 };
      
      // If it's a new day, reset the count
      if (renderData.date !== today) {
        renderData = { date: today, count: 0 };
      }
      
      // Update the display with the current count
      setSvgRendersPerDay(renderData.count);
    };
    
    updateRendersPerDay();
    
    // Update the count every 60 seconds
    const intervalId = setInterval(updateRendersPerDay, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchUploadsPerUser = async () => {
      try {
        setLoadingUploads(true);
        let uploadsData: any = await getUploadsByUser();
        console.log('getUploadsByUser response:', uploadsData);

        // Unwrap common wrappers (e.g., { data: [...] })
        if (uploadsData && typeof uploadsData === 'object' && 'data' in uploadsData) {
          uploadsData = uploadsData.data;
        }

        // If API returns an object keyed by user, convert to array
        if (!Array.isArray(uploadsData)) {
          if (uploadsData && typeof uploadsData === 'object') {
            uploadsData = Object.keys(uploadsData).map((k) => uploadsData[k]);
          } else {
            uploadsData = [];
          }
        }

        // Transform the backend response to match the expected UploadsPerUser interface
        const transformedData: UploadsPerUser[] = uploadsData.map((item: any) => {
          const userId = item.userId || item.user_id || item.uploaded_by || item.id || '';
          const username = item.username || item.name || item.user || item.uploaded_by || (item.user && item.user.username) || 'Unknown User';
          const email = item.email || (item.user && item.user.email) || '';
          const uploadCount = item.upload_count ?? item.count ?? item.uploads ?? item.value ?? 0;
          const authorName = item.authorName || item.author || item.uploaded_by || (item.user && item.user.authorName) || '';

          return {
            userId,
            username,
            email,
            uploadCount,
            authorName
          };
        });

        setUploadsPerUser(transformedData);
      } catch (error: any) {
        console.error('Error fetching uploads per user:', error);
          
        // If there was an error, use mock data based on the example provided
        console.log('Using mock data for uploads per user');
        const mockData: UploadsPerUser[] = [
          {
            userId: 'currentUser',
            username: 'currentUser',
            email: 'current@example.com',
            uploadCount: 18,
            authorName: 'currentUser'
          },
          {
            userId: 'unknown',
            username: 'Unknown User',
            email: 'unknown@example.com',
            uploadCount: 6,
            authorName: 'Unknown User'
          },
          {
            userId: 'admin_ad',
            username: 'admin ad',
            email: 'admin@example.com',
            uploadCount: 3,
            authorName: 'admin ad'
          },
          {
            userId: 'sanika_gavhane1',
            username: 'sanika.gavhane',
            email: 'sanika1@example.com',
            uploadCount: 2,
            authorName: 'sanika.gavhane'
          },
          {
            userId: 'sanika_gavhane2',
            username: 'sanika.gavhane',
            email: 'sanika2@example.com',
            uploadCount: 1,
            authorName: 'sanika.gavhane'
          }
        ];
          
        setUploadsPerUser(mockData);
      } finally {
        setLoadingUploads(false);
      }
    };
  
    fetchUploadsPerUser();
  }, []);

  useEffect(()=>{
    const fetchUploadSuccessRate=async()=>{
      try{
        const uploadStats=await getUploadSuccessRate();
        // Handle response depending on whether it's an object with successRate property or a direct value
        if (uploadStats && typeof uploadStats === 'object' && 'successRate' in uploadStats) {
          setUploadSuccessRate(uploadStats.successRate);
        } else {
          // If the API returns the success rate directly as a number
          setUploadSuccessRate(uploadStats || 0);
        }
      }
      catch(error){
        console.error('Error fetching upload success rate:',error);
      }     
    }
    fetchUploadSuccessRate();
  },[]);

  const [groupedUsers, setGroupedUsers] = useState<GroupedUsers>({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const grouped: GroupedUsers = {};
        users.forEach((user: any) => {
      
          if (user.role === 'User') {
            const authorId = user.authorId || 'default-author';
            if (!grouped[authorId]) {
              grouped[authorId] = [];
            }
            grouped[authorId].push({
              id: user.id,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              username: user.username || '',
              status: user.status || 'Pending',
              role: user.role || 'User',
              joined: user.createdAt || new Date().toISOString(),
              lastActive: user.updatedAt || new Date().toISOString()
            });
          }
        });

        // Group authors separately
        const authors = users.filter((user: any) => user.role === 'Author');
        authors.forEach((author: any) => {
          const authorId = author.id;
          if (!grouped[authorId]) {
            grouped[authorId] = [];
          }

          // Add the author as the first item in their group
          grouped[authorId].unshift({
            id: author.id,
            firstName: author.firstName || '',
            lastName: author.lastName || '',
            email: author.email || '',
            username: author.username || '',
            status: author.status || 'Active',
            role: author.role || 'Author',
            joined: author.createdAt || new Date().toISOString(),
            lastActive: author.updatedAt || new Date().toISOString()
          });

          // Add users managed by this author
          const usersForThisAuthor = users.filter((user: any) =>
            user.role === 'User' && user.authorId === authorId
          );

          usersForThisAuthor.forEach((user: any) => {
            grouped[authorId].push({
              id: user.id,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              username: user.username || '',
              status: user.status || 'Pending',
              role: user.role || 'User',
              joined: user.createdAt || new Date().toISOString(),
              lastActive: user.updatedAt || new Date().toISOString()
            });
          });
        });

        setGroupedUsers(grouped);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const authorEntries = Object.entries(groupedUsers);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 User Analytics</h2>
      <p>Understand user behavior, engagement, and usage patterns.</p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: '500', marginRight: '10px' }}>Date Range:</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
          style={{
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
            {/* {analytics.totalActiveUsers.toLocaleString()} */}
          </div>
          {/* <div style={{ fontSize: '16px', color: '#6c757d', fontWeight: '500' }}>
            Total Active Users
          </div> */}
          <div>
            <h3 style={
              {
                margin: "0 0 5px 0",
                fontSize: "32px",
                fontWeight: "700",
                color: "#28a745"
              }
            }>
              {authorCount !== null ? authorCount.toLocaleString() : "--"}
            </h3>
            <p style={{
              margin: 0,
              fontSize: "16px",
              color: "#6c757d",
              fontWeight: "500"
            }}>Total Authors</p>
          </div>

        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>
            {totalUploads !== null ? totalUploads.toLocaleString() : "--"}
          </div>
          <div style={{ fontSize: '16px', color: '#6c757d', fontWeight: '500' }}>Total Uploads</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '10px' }}>
            {svgRendersPerDay.toLocaleString()}
          </div>
          <div style={{ fontSize: '16px', color: '#6c757d', fontWeight: '500' }}>SVG Renders Per Day</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', marginBottom: '10px' }}>
           {uploadSuccessRate !== null ? uploadSuccessRate.toLocaleString() : "--"}
          </div>
          <div style={{ fontSize: '16px', color: '#6c757d', fontWeight: '500' }}>Upload Success Rate</div>
        </div>
      </div>

      {/* Author-User Groups */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Authors and Their Users</h3>

        {loading ? (
          <p>Loading user data...</p>
        ) : (
          <div>
            {authorEntries.length > 0 ? (
              authorEntries.map(([authorId, users]) => {
                const author = users[0]; // First user in the array is the author
                const authorUsers = users.slice(1); // Remaining users are managed by this author

                return (
                  <div key={authorId} style={{ marginBottom: '20px', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      marginBottom: '10px'
                    }}>
                      <div>
                        <h4 style={{ margin: '0', color: '#495057' }}>
                          {author.firstName} {author.lastName} ({author.email})
                        </h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
                          Role: {author.role} | Status: {author.status} | Joined: {new Date(author.joined).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: '#e9ecef',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {authorUsers.length} User{authorUsers.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {authorUsers.length > 0 ? (
                      <div style={{ marginLeft: '20px' }}>
                        <h5 style={{ margin: '10px 0 10px 0', color: '#495057' }}>Managed Users:</h5>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f1f3f5' }}>
                              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
                              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
                              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Status</th>
                              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Joined</th>
                            </tr>
                          </thead>
                          <tbody>
                            {authorUsers.map((user) => (
                              <tr key={user.id}>
                                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                                  {user.firstName} {user.lastName}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{user.email}</td>
                                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    backgroundColor:
                                      user.status === 'Active' ? '#d4edda' :
                                        user.status === 'Inactive' ? '#f8d7da' :
                                          user.status === 'Pending' ? '#fff3cd' :
                                            '#d1ecf1',
                                    color:
                                      user.status === 'Active' ? '#155724' :
                                        user.status === 'Inactive' ? '#721c24' :
                                          user.status === 'Pending' ? '#856404' :
                                            '#0c5460'
                                  }}>
                                    {user.status}
                                  </span>
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                                  {new Date(user.joined).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ marginLeft: '20px', fontStyle: 'italic', color: '#6c757d' }}>
                        No users assigned to this author.
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No author-user relationships found.</p>
            )}
          </div>
        )}
      </div>

      {/* Uploads Per User */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Uploads Per User</h3>

        {loadingUploads ? (
          <p>Loading uploads data...</p>
        ) : (
          <div>
            {uploadsPerUser.length > 0 ? (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f3f5' }}>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Author</th>
                      <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Upload Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadsPerUser.map((user) => (
                      <tr key={user.userId}>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{user.authorName || 'N/A'}</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: 'bold', color: '#007bff' }}>
                          {(user.uploadCount !== undefined && user.uploadCount !== null) ? user.uploadCount.toLocaleString() : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '15px', textAlign: 'right', fontSize: '14px', color: '#6c757d' }}>
                  Total uploads: {uploadsPerUser.reduce((sum, user) => sum + user.uploadCount, 0)}
                </div>
              </div>
            ) : (
              <p>No upload data available.</p>
            )}
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Uploads Per User Chart - Visualization */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Upload Distribution</h3>

          {uploadsPerUser.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', position: 'relative' }}>
              {/* Pie Chart */}
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                {(() => {
                  const totalUploads = uploadsPerUser.reduce((sum, user) => sum + user.uploadCount, 0);
                  let startAngle = 0;
                  
                  return uploadsPerUser.slice(0, 10).map((user, index) => {
                    const percentage = totalUploads > 0 ? (user.uploadCount / totalUploads) * 100 : 0;
                    const angle = (percentage / 100) * 360;
                    const color = `hsl(${index * 36}, 70%, 50%)`;
                    
                    // Calculate the path for the pie slice
                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
                    
                    const x1 = 100 + 80 * Math.cos(startAngleRad);
                    const y1 = 100 + 80 * Math.sin(startAngleRad);
                    
                    const x2 = 100 + 80 * Math.cos(endAngleRad);
                    const y2 = 100 + 80 * Math.sin(endAngleRad);
                    
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M 100,100`,
                      `L ${x1},${y1}`,
                      `A 80,80 0 ${largeArcFlag},1 ${x2},${y2}`,
                      'Z'
                    ].join(' ');
                    
                    const slice = (
                      <path
                        key={user.userId}
                        d={pathData}
                        fill={color}
                        stroke="#fff"
                        strokeWidth="1"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={() => setHoveredUserId(user.userId)}
                        onMouseLeave={() => setHoveredUserId(null)}
                        transform={hoveredUserId === user.userId ? 'scale(1.05)' : 'scale(1)'}
                      />
                    );
                    
                    startAngle += angle;
                    return slice;
                  });
                })()}
                
                {/* Center circle */}
                <circle cx="100" cy="100" r="40" fill="#ffffff" stroke="#e9ecef" strokeWidth="2" />
                <text 
                  x="100" 
                  y="100" 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  style={{ fontSize: '14px', fontWeight: 'bold', fill: '#495057' }}
                >
                  {uploadsPerUser.length}
                </text>
                <text 
                  x="100" 
                  y="115" 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  style={{ fontSize: '12px', fill: '#6c757d' }}
                >
                  Users
                </text>
                </svg>
              </div>
              
              {/* Legend */}
              <div style={{ marginLeft: '30px', maxHeight: '200px', overflowY: 'auto', flexShrink: 0 }}>
                {uploadsPerUser.slice(0, 10).map((user, index) => {
                  const totalUploads = uploadsPerUser.reduce((sum, u) => sum + u.uploadCount, 0);
                  const percentage = totalUploads > 0 ? (user.uploadCount / totalUploads * 100).toFixed(1) : 0;
                  const color = `hsl(${index * 36}, 70%, 50%)`;
                  
                  return (
                    <div key={user.userId} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '12px' }}>
                      <div 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: color, 
                          borderRadius: '2px', 
                          marginRight: '8px',
                          border: hoveredUserId === user.userId ? '2px solid #333' : 'none'
                        }}
                        onMouseEnter={() => setHoveredUserId(user.userId)}
                        onMouseLeave={() => setHoveredUserId(null)}
                      ></div>
                      <div style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={user.username || 'Unknown User'}>
                        {user.username?.substring(0, 12) || 'Unknown User'}
                      </div>
                      <div style={{ marginLeft: '8px', color: '#6c757d' }}>
                        ({user.uploadCount}) {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>No upload data to display.</p>
          )}
        </div>

        {/* Daily Active Users Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Daily Active Users</h3>

          {/* <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 10px' }}>
            {
            analytics.dailyActiveUsers.map((users, index) => {
              const maxUsers = Math.max(...analytics.dailyActiveUsers);
              const heightPercentage = (users / maxUsers) * 100;

              return (
                <div key={index} style={{ textAlign: 'center', width: '50px' }}>
                  <div
                    style={{
                      height: `${heightPercentage}%`,
                      width: '30px',
                      backgroundColor: '#007bff',
                      margin: '0 auto',
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
                    Day {index + 1}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>{users}</div>
                </div>
              );
            })}
          </div> */}
        </div>

        {/* Most Used Components */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Most Used Components</h3>

          {/* <div>
            {analytics.mostUsedComponents.map((component, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: '500' }}>{component.name}</span>
                  <span style={{ fontWeight: 'bold', color: '#007bff' }}>{component.count}</span>
                </div>
                <div
                  style={{
                    height: '10px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(component.count / maxUploads) * 100}%`,
                      backgroundColor: '#007bff',
                      borderRadius: '5px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Weekly Trends */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Weekly Trends</h3>

        {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {analytics.weeklyTrends.map((week, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '500', marginBottom: '10px', color: '#495057' }}>{week.week}</div>
              <div style={{ marginBottom: '5px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{week.uploads}</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Uploads</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{week.renders}</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Renders</div>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Upload Success vs Failure */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Upload Success vs Failure</h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#28a745',
                borderRadius: '50%',
                marginRight: '10px'
              }}
            />
            {/* <span style={{ fontWeight: '500' }}>Successful: {analytics.uploadSuccessRate}%</span> */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#dc3545',
                borderRadius: '50%',
                marginRight: '10px'
              }}
            />
            {/* <span style={{ fontWeight: '500' }}>Failed: {100 - analytics.uploadSuccessRate}%</span> */}
          </div>
        </div>

        <div style={{ marginTop: '20px', height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              // width: `${analytics.uploadSuccessRate}%`,
              backgroundColor: '#28a745',
              float: 'left'
            }}
          />
          <div
            style={{
              height: '100%',
              // width: `${100 - analytics.uploadSuccessRate}%`,
              backgroundColor: '#dc3545',
              float: 'left'
            }}
          />
        </div>
      </div>
    </div>
  );
}   