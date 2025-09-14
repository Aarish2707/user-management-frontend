import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import Notification from "./components/Notification";
import "./styles/styles.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Show notification
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Fetch users with pagination and search
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users?page=${page}&limit=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("Failed to fetch users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE_URL, showNotification]);

  // Get user info from token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
          name: payload.name
        });
        fetchUsers();
      } catch (error) {
        console.error('Invalid token:', error);
        handleLogout();
      }
    }
  }, [token, fetchUsers]);

  const addUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchUsers();
        setShowForm(false);
        showNotification("User created successfully", "success");
      } else {
        throw new Error(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error("Error adding user:", error);
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setEditingUser(userData);
    setShowForm(true);
  };

  const saveUpdatedUser = async (updatedUser) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchUsers();
        setShowForm(false);
        setEditingUser(null);
        showNotification("User updated successfully", "success");
      } else {
        throw new Error(result.error || 'Failed to update user');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok) {
          await fetchUsers();
          showNotification("User deleted successfully", "success");
        } else {
          throw new Error(result.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        showNotification(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUsers([]);
    showNotification("Logged out successfully", "info");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (!token) {
    return (
      <ErrorBoundary>
        <Login setToken={setToken} showNotification={showNotification} />
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          {loading && <LoadingSpinner />}
          
          {notification && (
            <Notification 
              message={notification.message} 
              type={notification.type} 
              onClose={() => setNotification(null)} 
            />
          )}

          <Routes>
            <Route path="/dashboard" element={
              <Dashboard 
                user={user}
                users={users}
                pagination={pagination}
                onLogout={handleLogout}
                onShowForm={() => setShowForm(true)}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
                onFetchUsers={fetchUsers}
                loading={loading}
              />
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Modal for User Form */}
          {showForm && (
            <div className="modal-overlay" onClick={handleCloseForm}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
                  <button className="close-btn" onClick={handleCloseForm}>
                    &times;
                  </button>
                </div>
                <UserForm 
                  addUser={editingUser ? saveUpdatedUser : addUser} 
                  editingUser={editingUser}
                  onCancel={handleCloseForm}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;