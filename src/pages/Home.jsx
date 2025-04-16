import { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../api/userApi";

const Home = () => {
    const [users, setUsers] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const handleAddUser = async (user) => {
        await addUser(user);
        fetchUsers();
    };

    const handleUpdateUser = async (id, updatedUser) => {
        await updateUser(id, updatedUser);
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    return(
        <div>
            <h2>User Management System</h2>
            <UserForm addUser={handleAddUser} />
            <UserTable users={users} updateUser={handleUpdateUser} deleteUser={handleDeleteUser} />
        </div>
    )
}

export default Home;