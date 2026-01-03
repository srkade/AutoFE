import React, { useState } from "react";
import logo from "../assets/Images/logo.png";
import { loginUser } from "../services/api";

interface LoginPageProps {
  onLoginSuccess: (role: "superadmin" | "author" | "user",user:any) => void;
  onRegisterClick: () => void;
  setToken: (token: string) => void;
}

export default function LoginPage({ onLoginSuccess, onRegisterClick,setToken }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check for hardcoded super admin credentials
    if (username === "superadmin@example.com" && password === "SuperAdmin123!") {
      // Hardcoded super admin credentials
      const superAdminResponse = {
        token: "hardcoded-superadmin-token",
        user: {
          firstName: "Super",
          lastName: "Admin",
          email: "superadmin@example.com",
          role: "Super Admin",
          status: "Active"
        }
      };
      
      // Store token in sessionStorage
      sessionStorage.setItem("token", superAdminResponse.token);
      setToken(superAdminResponse.token);
      
      // Call parent callback with superadmin role
      onLoginSuccess("superadmin", superAdminResponse.user);
      return;
    }
    
    try {
      const response = await loginUser({ email: username, password });
      console.log("LoginResponse:", response);

      // Check user status
      if (response.status?.toLowerCase() !== "active") {
        setError("Your account is pending admin approval.");
        return; 
      }

      // Store token in sessionStorage (or state)
      sessionStorage.setItem("token", response.token);
      setToken(response.token);
      // window.location.reload();

      // Call parent callback with role from backend
      const userRole = response.role?.toLowerCase();
      
      onLoginSuccess(
        userRole === "author" ? "author" : 
        userRole === "admin" ? "author" : 
        userRole === "super admin" || response.role === "Super Admin" ? "superadmin" : 
        "user",
        response
      );
    } catch (err: any) {
      console.error("Login failed:", err);
      
      // Check if the error response contains specific information about account status
      if (err?.response?.data) {
        // Check various possible response formats for account status
        const errorData = err.response.data;
        
        // Check for message field
        if (errorData.message && typeof errorData.message === 'string') {
          if (errorData.message.toLowerCase().includes('pending') || 
              errorData.message.toLowerCase().includes('approval') ||
              errorData.message.toLowerCase().includes('inactive') ||
              errorData.message.toLowerCase().includes('not active') ||
              errorData.message.toLowerCase().includes('not activated')) {
            setError("Your account is pending admin approval.");
            return;
          } else {
            setError(errorData.message);
            return;
          }
        }
        
        // Check for other possible field names that might contain status info
        if (errorData.error && typeof errorData.error === 'string') {
          if (errorData.error.toLowerCase().includes('pending') || 
              errorData.error.toLowerCase().includes('approval') ||
              errorData.error.toLowerCase().includes('inactive') ||
              errorData.error.toLowerCase().includes('not active') ||
              errorData.error.toLowerCase().includes('not activated')) {
            setError("Your account is pending admin approval.");
            return;
          } else {
            setError(errorData.error);
            return;
          }
        }
        
        // Check if response contains status field
        if (errorData.status && typeof errorData.status === 'string') {
          if (errorData.status.toLowerCase().includes('pending') || 
              errorData.status.toLowerCase().includes('approval') ||
              errorData.status.toLowerCase().includes('inactive') ||
              errorData.status.toLowerCase().includes('not active') ||
              errorData.status.toLowerCase().includes('not activated')) {
            setError("Your account is pending admin approval.");
            return;
          }
        }
      }
      
      // Check response status codes
      if (err?.response?.status === 401) {
        // Check if it's a 401 Unauthorized error
        setError("Invalid email or password");
      } else if (err?.response?.status === 403) {
        // 403 might indicate account is inactive/pending
        setError("Your account is pending admin approval.");
      } else {
        // Default error message for other errors
        setError("Login failed. Please try again.");
      }
    }

  };


  return (
    <div
      style={{
        background: "#f4f6f9",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main Card (two sections) */}
      <div
        style={{
          display: "flex",
          width: "900px",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        {/* Left Portion */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >

          <div
            style={{
              width: "120px",
              height: "auto",
              marginBottom: "20px",
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          <h1 style={{ fontSize: "34px", marginBottom: "15px" }}>Welcome To CRAZYBEES</h1>
          <p
            style={{
              fontSize: "20px",
              textAlign: "center",
              maxWidth: "300px",
              lineHeight: "1.5",
              fontWeight: "bold"
            }}
          >
            Design. Analyze. Perfect — your schematic journey starts here.
          </p>
        </div>

        {/* Right Portion (Login Form) */}
        <div
          style={{
            flex: 1,
            background: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          <form
            onSubmit={handleLogin}
            style={{
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <h2
              style={{
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              Login
            </h2>
            <p style={{ color: "#666", fontSize: "13px", marginBottom: "20px" }}>
              Welcome! Login to continue.
            </p>

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <button
                type="submit"
                style={{
                  width: "60%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#007bff",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "5px"
                }}
              >
                LOGIN
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
                fontSize: "13px",
              }}
            >
              <p>
                New User?{" "}
                <span
                  style={{ color: "#007bff", cursor: "pointer" }}
                  onClick={onRegisterClick}
                >
                  SignUp
                </span>
              </p>
              <p style={{ color: "#007bff", cursor: "pointer" }}>
                Forgot Password?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
