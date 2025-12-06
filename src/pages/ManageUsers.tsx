import React, { useState, useEffect } from "react";
import "../Styles/ManageUsers.css";
import { FiSearch, FiFilter, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  status: "Active" | "Inactive" | "Pending" | "Banned" | "Suspended";
  role: "Admin" | "User" | "Guest" | "Moderator";
  joined: string;
  lastActive: string;
}

export default function ManageUsersModern() {
  // Load users from localStorage or start empty
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Save users to localStorage whenever they change
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a new user
  const addUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: "New User",
      email: "newuser@example.com",
      username: "newuser",
      status: "Active",
      role: "User",
      joined: new Date().toLocaleDateString(),
      lastActive: "Just now",
    };
    setUsers(prev => [...prev, newUser]);
  };

  // Edit user
  const editUser = (user: User) => {
    setEditingUser(user);
  };

  const saveUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null);
  };

  // Delete user
  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="users-page">

      {/* HEADER */}
      <h1 className="title">User Management</h1>
      <p className="subtitle">
        Manage all users in one place. Control access, assign roles, and monitor activity.
      </p>

      {/* FILTER BAR */}
      <div className="toolbar">

        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-chip"><FiFilter /> Role <IoIosArrowDown /></div>
        <div className="filter-chip"><FiFilter /> Status <IoIosArrowDown /></div>
        <div className="filter-chip"><FiCalendar /> Date <IoIosArrowDown /></div>

        <div className="toolbar-right">
          <button className="export-btn">Export</button>
          <button className="add-btn" onClick={addUser}>+ Add User</button>
        </div>
      </div>

      {/* TABLE */}
      <table className="user-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Status</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td><input type="checkbox" /></td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td><span className={`status-chip ${u.status.toLowerCase()}`}>{u.status}</span></td>
              <td>{u.role}</td>
              <td>{u.joined}</td>
              <td>{u.lastActive}</td>
              <td className="actions">
                <FiEdit2 className="edit-icon" onClick={() => editUser(u)} />
                <FiTrash2 className="delete-icon" onClick={() => deleteUser(u.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <span>Rows per page</span>
        <select>
          <option>10</option>
          <option>20</option>
        </select>

        <span className="page-number">1 of {Math.ceil(filteredUsers.length / 10)}</span>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              placeholder="Full Name"
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="text"
              value={editingUser.username}
              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
              placeholder="Username"
            />
            <select
              value={editingUser.status}
              onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
              <option>Banned</option>
              <option>Suspended</option>
            </select>
            <select
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
            >
              <option>Admin</option>
              <option>User</option>
              <option>Guest</option>
              <option>Moderator</option>
            </select>
            <div className="modal-actions">
              <button onClick={() => saveUser(editingUser)}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
