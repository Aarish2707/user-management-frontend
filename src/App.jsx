import React, { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import "./styles/styles.css";

function App() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null); // State to track which user is being edited
    const [showForm, setShowForm] = useState(false); // Show/hide user form

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("https://user-management-backend-2-9ynl.onrender.com/api/users");
            const data = await response.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("API returned non-array data:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
    };

    const addUser = async (user) => {
        try {
            const response = await fetch("https://user-management-backend-2-9ynl.onrender.com/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                fetchUsers();
                setShowForm(false); // Hide form after adding user
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    // ✅ Function to handle user update (Open form with user data)
    const updateUser = (user) => {
        setEditingUser(user); // Set user data in state
        setShowForm(true); // Show the form
    };

    // ✅ Function to save the updated user details
    const saveUpdatedUser = async (updatedUser) => {
        try {
            const response = await fetch(`https://user-management-backend-2-9ynl.onrender.com/api/users/${updatedUser.id || updatedUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                fetchUsers(); 
                setShowForm(false); 
                setEditingUser(null); 
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // ✅ Function to delete a user
    const deleteUser = async (id) => {
        console.log("Deleting user with ID:", id); // ✅ Debugging line
    
        if (!id) {
            console.error("Error: Invalid user ID received for deletion.");
            return;
        }
    
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`https://user-management-backend-2-9ynl.onrender.com/api/users/${id}`, {
                    method: "DELETE",
                });
    
                if (!response.ok) {
                    throw new Error(`Error deleting user: ${response.status}`);
                }
    
                setUsers(users.filter(user => user.id !== id && user._id !== id)); // ✅ Remove user from state
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };
    

    return (
        <div className="container">
            <h1>User Management System</h1>

            {/* New User Button */}
            <button onClick={() => setShowForm(true)} className="new-user-btn">
                {editingUser ? "Edit User" : "New User"}
            </button>

            {/* Modal for User Form */}
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setShowForm(false)}>&times;</span>
                        <UserForm 
                            addUser={editingUser ? saveUpdatedUser : addUser} 
                            editingUser={editingUser} 
                        />
                    </div>
                </div>
            )}

            {/* User Table */}
            <UserTable users={users} updateUser={updateUser} deleteUser={deleteUser} />
        </div>
    );
}

export default App;
