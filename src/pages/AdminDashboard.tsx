import React, { useState } from "react";
import AdminNavigationTabs from "./AdminNavigationTabs";
import "../Styles/AdminNavigationTabs.css";
import ManageUsers from "./ManageUsers";
import ImportFiles from "./ImportedFiles";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("manage-users");

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "manage-users":
                return <ManageUsers />;  // Render ManageUsers component
            case "import-files":
                return <ImportFiles />;  // Render ImportFiles component
            case "view-schematic":
                return <div>View Schematic Page Content</div>;
            default:
                return <div>Please select a tab</div>;
        }
    };

    return (
        <div className="admin-container" style={{ display: "flex", flexDirection: "column" }}>
            <AdminNavigationTabs
                active={activeTab}
                onChange={setActiveTab}
                onLogout={handleLogout}
            />
            <div
                className="content-panel"
                style={{ flex: 1, padding: 20, border: "1px solid red" }}
            >
                {renderContent()}
            </div>
        </div>
    );
}
