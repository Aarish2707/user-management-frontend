import React from "react";

const UserTable = ({ users, updateUser, deleteUser }) => {
    if (!Array.isArray(users)) {
        console.error("Error: `users` is not an array:", users);
        return <p>No users available.</p>;
    }

    return (
        <div className="table-container">
            <table cellPadding={10} cellSpacing={10}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        console.log("User object:", user); // ✅ Debugging line
                        return (
                            <tr key={user.id || user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td className="action-buttons">
                                    <button className="update-btn" onClick={() => updateUser(user)}>Update</button>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => deleteUser(user.id || user._id)} // ✅ Ensure a valid ID is passed
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;

