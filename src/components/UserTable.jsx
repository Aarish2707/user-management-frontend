import React from "react";

const UserTable = ({ users, updateUser, deleteUser,role }) => {
    console.log("Role abtained: ",role);
    if (!Array.isArray(users)) {
        console.error("Error: users is not an array:", users);
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
                        {role === "admin" && <th>Actions</th>}                     </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id || user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            {/* <td className="action-buttons">
                                <button
                                    className="update-btn"
                                    onClick={() => updateUser(user)}
                                >
                                    Update
                                </button>
                                <span style={{ marginLeft: "8px" }} />
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteUser(user._id || user.id)}
                                >
                                    Delete
                                </button>
                            </td> */}
                            {role === "admin" && (
                <td className="action-buttons">
                    <button className="update-btn" onClick={() => updateUser(user)}>Update</button>
                    <button className="delete-btn" onClick={() => deleteUser(user._id)}>Delete</button>
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
