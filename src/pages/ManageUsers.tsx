import React, { useState, useEffect, useRef } from "react";
import "../Styles/ManageUsers.css";
import { FiSearch, FiFilter, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import RegisterForm from "./RegistrationForm";
import { User } from "../components/Schematic/SchematicTypes";
import { fetchUsers, updateUser, deleteUserById, registerUser, updateUserStatus as apiUpdateUserStatus } from "../services/api";

export default function ManageUsersModern() {
  const [users, setUsers] = useState<User[]>([]);

  const STATUS_OPTIONS: User["status"][] = [
    "Active",
    "Inactive",
    "Pending",
    "Suspended",
    "Banned",
  ];
  const [statusEditingUserId, setStatusEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();

        // Map backend fields to match table
        const mappedUsers = data.map((u: any) => ({
          ...u,
          //  FIX: Ensure fallback for null dates
          joined: u.createdAt || new Date().toISOString(),
          lastActive: u.updatedAt || new Date().toISOString(),
          // FIX: Ensure string fields are never null
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          status: u.status || "Pending", // Default to Pending if null
          role: u.role || "User"         // Default to User if null
        }));

        // Sort users by joined date (optional, newest first)
        mappedUsers.sort((a: any, b: any) => new Date(b.joined).getTime() - new Date(a.joined).getTime());

        setUsers(mappedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    loadUsers();
  }, []);

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState<"role" | "status" | "date" | null>(null);
  const [roleFilter, setRoleFilter] = useState<User["role"] | null>(null);
  const [statusFilter, setStatusFilter] = useState<User["status"] | null>(null);
  const [dateFilter, setDateFilter] = useState<"Last 7 days" | "Last 30 days" | "Last year" | null>(null);

  // Save users to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("users", JSON.stringify(users));
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
  const handleSaveUser = async (savedUser: any) => {
    try {
      if (editingUser) {
        // ------- UPDATE USER -------
        const payload = {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          role: savedUser.role,
          status: savedUser.role === "admin" ? "Active" : savedUser.status,
        };

        const updated = await updateUser(editingUser.id, payload);

        const mappedUpdated = {
          ...updated,
          joined: updated.createdAt || new Date().toISOString(),
          lastActive: updated.updatedAt || new Date().toISOString(),
        };

        setUsers(prev =>
          prev.map(u => (u.id === updated.id ? mappedUpdated : u))
        );

      } else {
        // ------- CREATE USER -------
        const payload = {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          password: savedUser.password,
          confirmPassword: savedUser.confirmPassword,
          role: savedUser.role,
          status: savedUser.status,
        };

        const created = await registerUser(payload);

        const mappedCreated = {
          ...created,
          joined: created.createdAt || new Date().toISOString(),
          lastActive: created.updatedAt || new Date().toISOString(),
        };

        setUsers(prev => [...prev, mappedCreated]); // UI updates instantly
      }

      setEditingUser(null);
      setShowRegisterForm(false);

    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  // Delete user
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserById(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleStatusChange = async (id: string, status: User["status"]) => {
    try {
      const token = sessionStorage.getItem("token") || "";
      await apiUpdateUserStatus(id, status, token);

      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, status } : u)
      );

      setStatusEditingUserId(null);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };


  const filteredUsers = users.filter(u => {
    //  FIX: Use (field || "") to prevent crashes during search
    const matchesSearch =
      ((u.firstName || "").toLowerCase().includes(searchTerm.toLowerCase())) ||
      ((u.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())) ||
      ((u.email || "").toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesStatus = statusFilter ? u.status === statusFilter : true;

    const matchesDate = (() => {
      if (!dateFilter || !u.joined) return true;
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

  const handleApproveUser = async (id: string) => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`/api/auth/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Active" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve user");
      }

      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, status: "Active" } : u)
      );

    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleRejectUser = async (id: string) => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`/api/auth/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Rejected" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reject user");
      }

      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, status: "Rejected" } : u)
      );

    } catch (err) {
      console.error("Reject failed:", err);
    }
  };


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
                {["admin", "user"].map(role => (
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
            <th>First Name</th><th>Last Name</th><th>Email</th><th>Status</th><th>Role</th><th>Joined</th><th>Last Active</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>
                {statusEditingUserId === u.id ? (
                  <select
                    value={u.status}
                    autoFocus
                    onChange={(e) =>
                      handleStatusChange(u.id, e.target.value as User["status"])
                    }
                    onBlur={() => setStatusEditingUserId(null)}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`status-chip ${(u.status || "pending").toLowerCase()}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setStatusEditingUserId(u.id)}
                  >
                    {u.status}
                  </span>
                )}
              </td>
              <td>{u.role || "User"}</td>
              <td>{u.joined ? new Date(u.joined).toLocaleString() : "-"}</td>
              <td>{u.lastActive ? new Date(u.lastActive).toLocaleString() : "-"}</td>
              <td className="actions">
                <FiEdit2 className="edit-icon" onClick={() => editUser(u)} />
                <FiTrash2 className="delete-icon" onClick={() => handleDeleteUser(u.id)} />
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
            isAuthor={true}
          />
        </div>
      )}
    </div>
  );
}