import React, { useState, useEffect, useRef } from "react";
import "../Styles/ManageUsers.css";
import { FiSearch, FiFilter, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import RegisterForm from "./RegistrationForm";
import { User } from "../components/Schematic/SchematicTypes";

export default function ManageUsersModern() {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState<"role" | "status" | "date" | null>(null);
  const [roleFilter, setRoleFilter] = useState<User["role"] | null>(null);
  const [statusFilter, setStatusFilter] = useState<User["status"] | null>(null);
  const [dateFilter, setDateFilter] = useState<"Last 7 days" | "Last 30 days" | "Last year" | null>(null);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add new user
  const handleAddUser = () => {
    setEditingUser(null);
    setShowRegisterForm(true);
  };

  // Edit existing user
  const editUser = (user: User) => {
    setEditingUser(user);
    setShowRegisterForm(true);
  };

  // Save user (add or edit)
  const handleSaveUser = (savedUser: User) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => (u.id === savedUser.id ? savedUser : u)));
    } else {
      setUsers(prev => [...prev, savedUser]);
    }
    setEditingUser(null);
    setShowRegisterForm(false);
  };

  // Delete user
  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesStatus = statusFilter ? u.status === statusFilter : true;

    const matchesDate = (() => {
      if (!dateFilter) return true;
      const joinedDate = new Date(u.joined);
      const now = new Date();
      const diff = now.getTime() - joinedDate.getTime();
      if (dateFilter === "Last 7 days") return diff <= 7 * 24 * 60 * 60 * 1000;
      if (dateFilter === "Last 30 days") return diff <= 30 * 24 * 60 * 60 * 1000;
      if (dateFilter === "Last year") return diff <= 365 * 24 * 60 * 60 * 1000;
      return true;
    })();

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  return (
    <div className="users-page">
      <h1 className="title">User Management</h1>
      <p className="subtitle">
        Manage all users in one place. Control access, assign roles, and monitor activity.
      </p>

      {/* TOOLBAR */}
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

        <div className="filter-wrapper" ref={filterRef}>
          {/* ROLE FILTER */}
          <div className="filter-chip" onClick={() => setActiveFilter(prev => prev === "role" ? null : "role")}>
            <FiFilter /> Role <IoIosArrowDown />
            {activeFilter === "role" && (
              <div className="filter-dropdown">
                {["Admin", "User"].map(role => (
                  <div key={role} onClick={() => { setRoleFilter(role as User["role"]); setActiveFilter(null); }}>
                    {role}
                  </div>
                ))}
                <div onClick={() => { setRoleFilter(null); setActiveFilter(null); }}>Clear</div>
              </div>
            )}
          </div>

          {/* STATUS FILTER */}
          <div className="filter-chip" onClick={() => setActiveFilter(prev => prev === "status" ? null : "status")}>
            <FiFilter /> Status <IoIosArrowDown />
            {activeFilter === "status" && (
              <div className="filter-dropdown">
                {["Active", "Inactive", "Pending", "Banned", "Suspended"].map(status => (
                  <div key={status} onClick={() => { setStatusFilter(status as User["status"]); setActiveFilter(null); }}>
                    {status}
                  </div>
                ))}
                <div onClick={() => { setStatusFilter(null); setActiveFilter(null); }}>Clear</div>
              </div>
            )}
          </div>

          {/* DATE FILTER */}
          <div className="filter-chip" onClick={() => setActiveFilter(prev => prev === "date" ? null : "date")}>
            <FiCalendar /> Date <IoIosArrowDown />
            {activeFilter === "date" && (
              <div className="filter-dropdown">
                {["Last 7 days", "Last 30 days", "Last year"].map(date => (
                  <div key={date} onClick={() => { setDateFilter(date as any); setActiveFilter(null); }}>
                    {date}
                  </div>
                ))}
                <div onClick={() => { setDateFilter(null); setActiveFilter(null); }}>Clear</div>
              </div>
            )}
          </div>
        </div>

        {/* ADD USER BUTTON */}
        <div className="toolbar-right">
          <button className="add-btn" onClick={handleAddUser}>+ Add User</button>
        </div>
      </div>

      {/* USER TABLE */}
      <table className="user-table">
        <thead>
          <tr>
            <th /><th>Full Name</th><th>Email</th><th>Username</th><th>Status</th><th>Role</th><th>Joined</th><th>Last Active</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
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

      {/* REGISTER / EDIT FORM MODAL */}
      {showRegisterForm && (
        <div className="form-modal">
          <RegisterForm
            userToEdit={editingUser}
            onSave={handleSaveUser}
            onBackToLogin={() => {
              setShowRegisterForm(false);
              setEditingUser(null);
            }}
            showLeftPanel={false}
            showCloseButton={true}
            customHeight="200px"
          />
        </div>
      )}
    </div>
  );
}
