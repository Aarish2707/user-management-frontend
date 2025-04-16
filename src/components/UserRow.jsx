import React from "react";

const UserRow = ({ user, updateUser, deleteUser }) => {
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td className="action-buttons">
                <button className="update-btn" onClick={() => updateUser(user.id, user)}>Update</button>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
            </td>
        </tr>
    );
};

export default UserRow;
