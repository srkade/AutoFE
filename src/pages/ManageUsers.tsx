import React, { useState, useEffect, useRef } from "react";
import "../Styles/ManageUsers.css";
import { FiSearch, FiFilter, FiCalendar, FiEdit2, FiTrash2, FiShield } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import RegisterForm from "./RegistrationForm";
import { User } from "../components/Schematic/SchematicTypes";
import { fetchUsers, updateUser, deleteUserById, registerUser, updateUserStatus as apiUpdateUserStatus, updateUserRole } from "../services/api";
import AssignModelsModal from "../components/AssignModelsModal";

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
  const [roleEditingUserId, setRoleEditingUserId] = useState<string | null>(null);

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
  const [assigningModelsUser, setAssigningModelsUser] = useState<{id: string, name: string} | null>(null);

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
          status: savedUser.status || "Active",
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

        setUsers(prev => [mappedCreated, ...prev]); // UI updates instantly (prepend for newest first)
        alert("User registration successful.");
      }

      setEditingUser(null);
      setShowRegisterForm(false);

    } catch (err: any) {
      console.error("Failed to save user:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);

      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save user";
      alert(`Error: ${errorMessage}`);
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

      // Update user status with API call
      const updatedUser = await apiUpdateUserStatus(id, status, sessionStorage.getItem("token") || "");


      // Update the local state with the new status
      setUsers(prev => {
        const newUsers = prev.map(u => u.id === id ? { ...u, status } : u);
        return newUsers;
      });

      setStatusEditingUserId(null);
    } catch (err: any) {
      console.error("Status update failed:", err);
      console.error("Error details:", err.response?.data);

      // Fallback to general update if status endpoint doesn't exist
      try {
        const updatedUser = await updateUser(id, { status });
        setUsers(prev =>
          prev.map(u => u.id === id ? { ...u, status } : u)
        );
        setStatusEditingUserId(null);
      } catch (fallbackErr: any) {
        console.error("Fallback status update also failed:", fallbackErr);
        alert("Failed to update status: " + (fallbackErr.response?.data?.message || fallbackErr.message));
      }
    }
  };

  const handleRoleChange = async (id: string, role: User["role"]) => {
    try {
      // Update user role with dedicated endpoint
      const updatedUser = await updateUserRole(id, role);

      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, role } : u)
      );

      setRoleEditingUserId(null);
    } catch (err: any) {
      console.error("Role update failed:", err);
      // Fallback to general update if role endpoint doesn't exist
      try {
        const updatedUser = await updateUser(id, { role });
        setUsers(prev =>
          prev.map(u => u.id === id ? { ...u, role } : u)
        );
        setRoleEditingUserId(null);
      } catch (fallbackErr: any) {
        console.error("Fallback role update also failed:", fallbackErr);
      }
    }
  };


  const filteredUsers = users.filter(u => {
    //  FIX: Use (field || "") to prevent crashes during search
    const matchesSearch =
      ((u.firstName || "").toLowerCase().includes(searchTerm.toLowerCase())) ||
      ((u.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())) ||
      ((u.email || "").toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter ? (u.role || "").toLowerCase() === roleFilter.toLowerCase() : true;
    const matchesStatus = statusFilter ? (u.status || "").toLowerCase() === statusFilter.toLowerCase() : true;

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
    <div className="manage-users-container">
      <div className="header-section">
        <div>
          <h1 className="title">User Management</h1>
          <p className="subtitle">
            Manage all users in one place. Control access, assign roles, and monitor activity.
          </p>
        </div>
        <div className="toolbar">
          <div className="search-bar-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={handleAddUser}>
            + Add User
          </button>
        </div>
      </div>

      <div className="filter-wrapper" ref={filterRef} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* ROLE FILTER */}
        <div className="filter-chip" onClick={() => setActiveFilter(prev => prev === "role" ? null : "role")} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', cursor: 'pointer', position: 'relative', color: 'var(--text-primary)' }}>
          <FiFilter /> Role <IoIosArrowDown />
          {activeFilter === "role" && (
            <div className="filter-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 10, padding: '8px', boxShadow: 'var(--card-shadow)', minWidth: '120px' }}>
              {["User", "Author"].map(role => (
                <div key={role} onClick={() => { setRoleFilter(role as User["role"]); setActiveFilter(null); }} style={{ padding: '8px', cursor: 'pointer' }}>
                  {role}
                </div>
              ))}
              <div onClick={() => { setRoleFilter(null); setActiveFilter(null); }} style={{ padding: '8px', cursor: 'pointer', borderTop: '1px solid #f1f5f9' }}>Clear</div>
            </div>
          )}
        </div>

        {/* STATUS FILTER */}
        <div className="filter-chip" onClick={() => setActiveFilter(prev => prev === "status" ? null : "status")} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', cursor: 'pointer', position: 'relative', color: 'var(--text-primary)' }}>
          <FiFilter /> Status <IoIosArrowDown />
          {activeFilter === "status" && (
            <div className="filter-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 10, padding: '8px', minWidth: '120px', boxShadow: 'var(--card-shadow)' }}>
              {["Active", "Inactive", "Pending", "Banned", "Suspended"].map(status => (
                <div key={status} onClick={() => { setStatusFilter(status as User["status"]); setActiveFilter(null); }} style={{ padding: '8px', cursor: 'pointer' }}>
                  {status}
                </div>
              ))}
              <div onClick={() => { setStatusFilter(null); setActiveFilter(null); }} style={{ padding: '8px', cursor: 'pointer', borderTop: '1px solid #f1f5f9' }}>Clear</div>
            </div>
          )}
        </div>

        {/* DATE FILTER */}
        <div className="filter-chip" onClick={() => setActiveFilter(prev => prev === "date" ? null : "date")} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', cursor: 'pointer', position: 'relative', color: 'var(--text-primary)' }}>
          <FiCalendar /> Date <IoIosArrowDown />
          {activeFilter === "date" && (
            <div className="filter-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 10, padding: '8px', minWidth: '150px', boxShadow: 'var(--card-shadow)' }}>
              {["Last 7 days", "Last 30 days", "Last year"].map(date => (
                <div key={date} onClick={() => { setDateFilter(date as any); setActiveFilter(null); }} style={{ padding: '8px', cursor: 'pointer' }}>
                  {date}
                </div>
              ))}
              <div onClick={() => { setDateFilter(null); setActiveFilter(null); }} style={{ padding: '8px', cursor: 'pointer', borderTop: '1px solid #f1f5f9' }}>Clear</div>
            </div>
          )}
        </div>
      </div>

      {/* USER TABLE */}
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th className="hide-mobile">Email</th>
              <th>Status</th>
              <th>Role</th>
              <th className="hide-mobile">Joined</th>
              <th className="hide-mobile">Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td className="hide-mobile">{u.email}</td>
                <td>
                  {statusEditingUserId === u.id ? (
                    <select
                      value={u.status}
                      autoFocus
                      onChange={(e) =>
                        handleStatusChange(u.id, e.target.value as User["status"])
                      }
                      onBlur={() => setStatusEditingUserId(null)}
                      style={{ padding: '4px', borderRadius: '4px' }}
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
                      style={{ cursor: "pointer", padding: '4px 8px', borderRadius: '12px', fontSize: '11px' }}
                      onClick={() => setStatusEditingUserId(u.id)}
                    >
                      {u.status}
                    </span>
                  )}
                </td>
                <td>
                  {roleEditingUserId === u.id ? (
                    <select
                      value={u.role || "User"}
                      autoFocus
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as User["role"])
                      }
                      onBlur={() => setRoleEditingUserId(null)}
                      style={{ padding: '4px', borderRadius: '4px' }}
                    >
                      <option value="User">User</option>
                      <option value="Author">Author</option>
                    </select>
                  ) : (
                    <span
                      style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "4px", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontSize: '11px', border: "1px solid var(--border-color)" }}
                      onClick={() => setRoleEditingUserId(u.id)}
                    >
                      {u.role || "User"}
                    </span>
                  )}
                </td>
                <td className="hide-mobile">{u.joined ? new Date(u.joined).toLocaleDateString() : "-"}</td>
                <td className="hide-mobile">{u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "-"}</td>
                <td className="actions">
                  <FiShield className="edit-icon" title="Assign Models" onClick={() => setAssigningModelsUser({id: u.id, name: `${u.firstName} ${u.lastName}`})} style={{ marginRight: '8px', cursor: 'pointer', color: '#10b981' }} />
                  <FiEdit2 className="edit-icon" title="Edit User" onClick={() => editUser(u)} style={{ marginRight: '8px', cursor: 'pointer', color: '#3b82f6' }} />
                  <FiTrash2 className="delete-icon" title="Delete User" onClick={() => handleDeleteUser(u.id)} style={{ cursor: 'pointer', color: '#ef4444' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REGISTER / EDIT FORM MODAL */}
      {showRegisterForm && (
        <div className="form-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
            <RegisterForm
              userToEdit={editingUser}
              onSave={handleSaveUser}
              onBackToLogin={() => {
                setShowRegisterForm(false);
                setEditingUser(null);
              }}
              showLeftPanel={false}
              showCloseButton={true}
              customHeight="650px"
              isAuthor={true}
            />
          </div>
        </div>
      )}

      {/* ASSIGN MODELS MODAL */}
      {assigningModelsUser && (
        <AssignModelsModal 
          userId={assigningModelsUser.id}
          userName={assigningModelsUser.name}
          onClose={() => setAssigningModelsUser(null)}
          onSave={() => alert("Model assignments updated successfully.")}
        />
      )}
    </div>
  );
}