import { useState } from "react";
import React from "react";
import { User } from "../components/Schematic/SchematicTypes";
import { registerUser } from "../services/api";

interface RegisterPageProps {
  onBackToLogin: () => void;
  onSave?: (newUser: User) => void;
  userToEdit?: User | null;
  showLeftPanel?: boolean;
  showCloseButton?: boolean;
  customHeight?: string;
  isAuthor?: boolean;
}

export default function RegisterForm({
  onBackToLogin,
  onSave,
  userToEdit,
  showLeftPanel = true,
  showCloseButton = false,
  customHeight = "650px",
  isAuthor = false,
}: RegisterPageProps) {
  // ---------------- FIELDS ----------------
  const [firstName, setFirstName] = useState(userToEdit?.firstName || "");
  const [lastName, setLastName] = useState(userToEdit?.lastName || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  const [username, setUsername] = useState(userToEdit?.username || "");
  const [status, setStatus] = useState(userToEdit?.status || "");
  const [role, setRole] = useState(userToEdit?.role || "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ---------------- Validation ----------------
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    if (!userToEdit && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // ---------------- Payload ----------------
    const payload: any = {
      firstName,
      lastName,
      email,
      role,
      status: role === "Author" ? "Active" : "Pending", // Author active by default, user pending
    };

    if (!userToEdit) {
      payload.password = password;
      payload.confirmPassword = confirmPassword;
    }

    try {
      if (userToEdit && onSave) {
        // ---------------- EDIT MODE ----------------
        const updatedUser: User = {
          ...userToEdit,
          ...payload,
          joined: userToEdit.joined,
          lastActive: new Date().toISOString(),
        };
        await onSave(updatedUser);
        alert("User updated successfully!");
      } else {
        // ---------------- CREATE MODE ----------------
        const res = await registerUser(payload);
        console.log("Registration Success:", res);

        // ---------------- CONDITIONAL ALERT ----------------
        if (role === "Author") {
          alert("Author registration successful.");
        } else {
          alert(
            "Your account has been created and is pending author approval. You will be able to login once approved."
          );
        }

        onBackToLogin();
      }
    }
    catch (err: any) {
      console.error("Registration Error:", err);

      if (err.response?.status === 409) {
        alert("Email already exists. Please use a different email.");
      } else if (err.response?.status === 403 && err.response?.data?.error) {
        // Show backend pending approval message
        alert(err.response.data.error);
      } else {
        alert(
          "Operation failed: " +
          (err.response?.data?.message || "Invalid data or server error")
        );
      }
    }
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

            {/* First NAME */}
            <input
              type="text"
              placeholder="Fistrname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />

            {/* LASTNAME */}
            <input
              type="text"
              placeholder="Lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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

            {/* ROLE */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as User["role"])}
              style={inputStyle}
              required
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="User">User</option>
              <option value="Author">Author</option>
            </select>

            {/* STATUS */}
            {isAuthor && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as User["status"])}
                style={inputStyle}
                required
              >
                <option value="" disabled hidden>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Banned">Banned</option>
                <option value="Suspended">Suspended</option>
              </select>
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
