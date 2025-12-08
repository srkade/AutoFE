import { useState } from "react";
import React from "react";
import { User } from "../components/Schematic/SchematicTypes";

interface RegisterPageProps {
  onBackToLogin: () => void;
  onSave?: (newUser: User) => void;
  userToEdit?: User | null;
  showLeftPanel?: boolean;
  showCloseButton?: boolean;
  customHeight?: string;
}

export default function RegisterForm({
  onBackToLogin,
  onSave,
  userToEdit,
  showLeftPanel = true,
  showCloseButton = false,
  customHeight = "650px",
}: RegisterPageProps) {
  // ---------------- FIELDS ----------------
  const [fullName, setFullName] = useState(userToEdit?.name || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  const [username, setUsername] = useState(userToEdit?.username || "");
  const [status, setStatus] = useState(userToEdit?.status || "Active");
  const [role, setRole] = useState(userToEdit?.role || "User");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    const newUser: User = {
      id: userToEdit ? userToEdit.id : Date.now(),
      name: fullName,
      email,
      username,
      status,
      role,
      joined: userToEdit ? userToEdit.joined : new Date().toLocaleDateString(),
      lastActive: userToEdit ? userToEdit.lastActive : "Just now",
    };

    if (onSave) onSave(newUser);
    onBackToLogin();
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: showLeftPanel ? "900px" : "500px",  // auto resize when left hidden
          height: "customHeight",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        {/* LEFT SECTION */}
        {showLeftPanel && (
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
              Join Us Today!
            </h1>
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                fontWeight: "bold",
                maxWidth: "280px",
              }}
            >
              Create your account to design, analyze, and perfect your
              schematics efficiently.
            </p>

            <p style={{ marginTop: "30px", fontSize: "14px", maxWidth: "280px" }}>
              Already have an account? Click below to go back to login.
            </p>

            <button
              onClick={onBackToLogin}
              style={{
                marginTop: "20px",
                backgroundColor: "#ffffff",
                color: "#4facfe",
                fontWeight: "bold",
                padding: "12px 28px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </div>
        )}

        {/* RIGHT SECTION */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            position: "relative",
          }}
        >
          {showCloseButton && (
            <button
              onClick={onBackToLogin}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              ✖
            </button>
          )}

          <form
            style={{
              width: "100%",
              maxWidth: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onSubmit={handleSubmit}
          >
            <h2 style={{ color: "#007bff", marginBottom: "10px" }}>
              {userToEdit ? "Edit User" : "Create Account"}
            </h2>

            {/* FULL NAME */}
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                setUsername(val.split("@")[0]); // auto username
              }}
              style={inputStyle}
            />

            {/* USERNAME */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />

            {/* STATUS */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as User["status"])}
              style={inputStyle}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
              <option>Banned</option>
              <option>Suspended</option>
            </select>

            {/* ROLE */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as User["role"])}
              style={inputStyle}
            >
              <option>User</option>
              <option>Admin</option>
            </select>

            {/* PASSWORD (only in create mode) */}
            {!userToEdit && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
              </>
            )}

            {/* TERMS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <span style={{ color: "#007bff" }}>Terms & Conditions</span>
              </span>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {userToEdit ? "Save Changes" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// INPUT STYLES
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
