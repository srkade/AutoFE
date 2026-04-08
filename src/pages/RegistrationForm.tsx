import React, { useState } from "react";
import { User } from "../components/Schematic/SchematicTypes";
import { registerUser } from "../services/api";
import { useMediaQuery } from "../hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
  const [showTermsModal, setShowTermsModal] = useState(false);

  // ---------------- TERMS MODAL CONTENT ----------------
  const TermsModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={() => setShowTermsModal(false)}
    >
      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "var(--card-shadow)",
          position: "relative",
          lineHeight: "1.6",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowTermsModal(false)}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          ✖
        </button>
        <h3 style={{ color: "var(--accent-primary)", marginBottom: "20px", borderBottom: "2px solid var(--border-color)", paddingBottom: "10px" }}>Terms & Conditions</h3>
        <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
          <p>Welcome to <b>CRAZYBEES</b>. By creating an account, you agree to the following terms:</p>
          <ol style={{ paddingLeft: "20px" }}>
            <li><b>Usage:</b> This platform is provided for design and analysis of schematics. Unauthorized use is prohibited.</li>
            <li><b>Data Security:</b> We value your privacy. Your data will be stored securely but we are not liable for user-side security breaches.</li>
            <li><b>Account Approval:</b> All standard user accounts are subject to review and approval by authorized personnel.</li>
            <li><b>Prohibited Acts:</b> Any attempt to reverse engineer or disrupt the service will lead to immediate account suspension.</li>
            <li><b>Modifications:</b> These terms may be updated at any time without prior notice.</li>
          </ol>
          <p style={{ marginTop: "20px" }}>By checking the box on the registration page, you acknowledge that you have read and understood these terms.</p>
        </div>
        <button
          onClick={() => setShowTermsModal(false)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          I Understand
        </button>
      </div>
    </div>
  );

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
    };

    // Only set status default for new users, use form value for editing
    if (!userToEdit) {
      if (isAuthor && status) {
        payload.status = status;
      } else {
        payload.status = role === "Author" ? "Active" : "Pending"; // Author active by default, user pending
      }
    } else {
      payload.status = status; // Use the selected status when editing
    }

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
        if (onSave) {
          // Delegate to parent (ManageUsers handles API + State)
          await onSave(payload);
        } else {
          // Self-registration flow (App.tsx doesn't pass onSave)
          const res = await registerUser(payload);

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
        backgroundColor: showCloseButton ? "transparent" : "var(--bg-primary)",
        minHeight: showCloseButton ? "auto" : "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Verdana, sans-serif",
      }}
    >
      {showTermsModal && <TermsModal />}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "90%" : (showLeftPanel ? "900px" : "500px"),
          minHeight: isMobile ? "auto" : customHeight,
          height: "auto",
          padding: isMobile ? "20px 0" : "0",
          maxHeight: showCloseButton ? "90vh" : "none",
          borderRadius: "12px",
          overflowY: "auto",
          boxShadow: "var(--card-shadow)",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)"
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
            <h1 style={{ fontSize: isMobile ? "24px" : "32px", marginBottom: "20px" }}>
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
            backgroundColor: "var(--bg-secondary)",
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
                color: "var(--text-primary)",
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
            <h2 style={{ color: "var(--accent-primary)", marginBottom: "10px" }}>
              {userToEdit ? "Edit User" : "Create Account"}
            </h2>

            {/* First NAME */}
            <input
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />

            {/* LASTNAME */}
            <input
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email Address"
              required
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
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
                id="terms-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="terms-checkbox" style={{ cursor: "pointer" }}>
                I agree to the{" "}
                <span
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0056b3")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#007bff")}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                >
                  Terms & Conditions
                </span>
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={!agreeTerms}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: agreeTerms ? "#007bff" : "#ccc",
                color: "#fff",
                fontWeight: "bold",
                cursor: agreeTerms ? "pointer" : "not-allowed",
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
  border: "1px solid var(--border-color)",
  backgroundColor: "var(--bg-primary)",
  color: "var(--text-primary)",
};
