import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const UserTable = ({ users, updateUser, deleteUser, role, loading }) => {
    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <LoadingSpinner size="large" overlay={false} />
                <p style={{ marginTop: '1rem', color: '#718096' }}>Loading users...</p>
            </div>
        );
    }

    if (!Array.isArray(users) || users.length === 0) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No users found</h3>
                <p style={{ color: '#718096' }}>
                    {role === 'admin' ? 'Start by adding your first user.' : 'No users to display.'}
                </p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleBadge = (userRole) => {
        const isAdmin = userRole === 'admin';
        return (
            <span 
                className={`user-role ${isAdmin ? 'admin' : 'user'}`}
                style={{
                    background: isAdmin ? '#667eea' : '#48bb78',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                }}
            >
                {userRole}
            </span>
        );
    };

    const getStatusBadge = (user) => {
        const isActive = user.isActive !== false;
        const isVerified = user.emailVerified;
        
        if (!isActive) {
            return <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>Inactive</span>;
        }
        
        if (!isVerified) {
            return <span style={{ color: '#ed8936', fontSize: '0.875rem' }}>Unverified</span>;
        }
        
        return <span style={{ color: '#48bb78', fontSize: '0.875rem' }}>Active</span>;
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        {role === 'admin' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id || user.id}>
                            <td>
                                <div>
                                    <div style={{ fontWeight: '500', color: '#2d3748' }}>
                                        {user.name}
                                    </div>
                                    {user.lastLogin && (
                                        <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                                            Last login: {formatDate(user.lastLogin)}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div style={{ color: '#4a5568' }}>
                                    {user.email}
                                </div>
                            </td>
                            <td>
                                <div style={{ color: '#4a5568' }}>
                                    {user.phone}
                                </div>
                            </td>
                            <td>
                                {getRoleBadge(user.role)}
                            </td>
                            <td>
                                {getStatusBadge(user)}
                            </td>
                            <td>
                                <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                                    {formatDate(user.createdAt)}
                                </div>
                            </td>
                            {role === 'admin' && (
                                <td className="action-buttons">
                                    <button
                                        className="update-btn"
                                        onClick={() => updateUser(user)}
                                        title="Edit user"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteUser(user._id || user.id)}
                                        title="Delete user"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;