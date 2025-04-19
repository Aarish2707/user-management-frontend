// import React, { useState, useEffect } from "react";

// const UserForm = ({ addUser, editingUser }) => {
//     const [user, setUser] = useState({ name: "", email: "", phone: "" });

//     // ✅ Prefill form when editing a user
//     useEffect(() => {
//         if (editingUser) {
//             setUser(editingUser);
//         }
//     }, [editingUser]);

//     const handleChange = (e) => {
//         setUser({ ...user, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!user.name || !user.email || !user.phone) {
//             alert("All fields are required!");
//             return;
//         }
//         addUser(user); 
//         setUser({ name: "", email: "", phone: "" }); 
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="text" name="name" placeholder="Enter Name" value={user.name} onChange={handleChange} required />
//             <input type="email" name="email" placeholder="Enter Email" value={user.email} onChange={handleChange} required />
//             <input type="text" name="phone" placeholder="Enter Phone" value={user.phone} onChange={handleChange} required />
//             <button type="submit" className="add-btn">{editingUser ? "Update User" : "Add User"}</button>
//         </form>
//     );
// };

// export default UserForm;

import React, { useState, useEffect } from "react";

const UserForm = ({ addUser, editingUser }) => {
    const [user, setUser] = useState({ name: "", email: "", phone: "", password:"" });

    // Pre-fill form when editing a user
    useEffect(() => {
        if (editingUser) {
            setUser(editingUser);
        }
    }, [editingUser]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user.name || !user.email || !user.phone) {
            alert("All fields are required!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not authenticated!");
            return;
        }

        addUser(user); // Call passed-in addUser or updateUser
        setUser({ name: "", email: "", phone: "", password:"" }); // Clear form
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={user.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={user.email}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={user.phone}
                onChange={handleChange}
                required
            />
            <input type="password"
            name="password"
            placeholder="Enter Password"
            value={user.password}
            onChange={handleChange}
            required />
            <button type="submit" className="add-btn">
                {editingUser ? "Update User" : "Add User"}
            </button>
        </form>
    );
};

export default UserForm;

