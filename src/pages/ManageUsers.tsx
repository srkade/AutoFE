import React, { useState } from "react";
import "../Styles/ManageUsers.css"; 

export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState<{ name: string; email: string; role: "admin" | "user" }>({ name: "", email: "", role: "user" });
    const [editId, setEditId] = useState<number | null>(null);

    const handleSubmit = () => {
        if (!form.name || !form.email) {
            alert("Please fill all fields");
            return;
        }

        if (editId !== null) {
            setUsers(users.map((u) => (u.id === editId ? { ...u, ...form } : u)));
            setEditId(null);
        } else {
            setUsers([...users, { id: Date.now(), ...form }]);
        }

        setForm({ name: "", email: "", role: "user" });
    };

    const handleEdit = (user: User) => {
        setEditId(user.id);
        setForm({ name: user.name, email: user.email, role: user.role });
    };
    const handleDelete = (id: number) => setUsers(users.filter((u) => u.id !== id));

    return (
        <div className="manage-users-container">
            <div className="header">
                <h2>Manage Users</h2>
                <p className="user-count">Total Users: <b>{users.length}</b></p>
            </div>

            {/* Form */}
            <div className="form-card">
                <h3>{editId ? "Edit User" : "Add User"}</h3>
                <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "user" })}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={handleSubmit}>{editId ? "Update User" : "Add User"}</button>
            </div>

            {/* Users Table */}
            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan={4} className="empty">No users found.</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
