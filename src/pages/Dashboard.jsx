import React, { useState } from 'react';
import UserTable from '../components/UserTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Dashboard = ({ 
  user, 
  users, 
  pagination, 
  onLogout, 
  onShowForm, 
  onUpdateUser, 
  onDeleteUser, 
  onFetchUsers,
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    onFetchUsers(1, term);
  };

  const handlePageChange = (page) => {
    onFetchUsers(page, searchTerm);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>User Management System</h1>
            <p className="welcome-text">Welcome back, {user?.name}!</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-role">{user?.role}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-controls">
          <div className="controls-left">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search users by name or email..."
              loading={loading}
            />
          </div>
          <div className="controls-right">
            {user?.role === 'admin' && (
              <button onClick={onShowForm} className="add-user-btn">
                <span className="btn-icon">+</span>
                Add New User
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-content">
          <div className="users-section">
            <div className="section-header">
              <h2>Users ({pagination.total})</h2>
            </div>
            
            <UserTable 
              users={users} 
              updateUser={onUpdateUser} 
              deleteUser={onDeleteUser}
              role={user?.role}
              loading={loading}
            />

            {pagination.pages > 1 && (
              <Pagination 
                current={pagination.current}
                total={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;