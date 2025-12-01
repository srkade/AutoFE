import React from "react";

interface RegisterPageProps {
  onBackToLogin: () => void;
}

export default function RegisterForm({ onBackToLogin }: RegisterPageProps) {
  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      
      <div
        style={{
          display: "flex",
          width: "900px",
          height: "550px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
        }}
      >

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
          <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Join Us Today!</h1>
          <p style={{ fontSize: "18px", lineHeight: 1.5, fontWeight: "bold", maxWidth: "280px" }}>
            Create your account to design, analyze, and perfect your schematics efficiently.
          </p>
          <p style={{ marginTop: "20px", fontSize: "14px", maxWidth: "280px" }}>
            Already have an account? Click the button below to go back to login.
          </p>
          <button
            onClick={onBackToLogin}
            style={{
              marginTop: "25px",
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

        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <form
            style={{
              width: "100%",
              maxWidth: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h2 style={{ color: "#007bff", marginBottom: "10px" }}>Create Account</h2>
            <p style={{ color: "#666", fontSize: "13px", marginBottom: "15px" }}>
              Fill in the form to get started.
            </p>

            <input
              type="text"
              placeholder="First Name"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              placeholder="Email Address"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <input type="checkbox" />
              <span>
                I agree to the <span style={{ color: "#007bff" }}>Terms and Conditions</span>
              </span>
            </div>

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
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
