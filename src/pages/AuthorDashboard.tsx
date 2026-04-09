import React, { useState } from "react";
import "../Styles/AuthorNavigationTabs.css";
import ManageUsers from "./ManageUsers";
import ImportFiles from "./ImportedFiles";
import { useEffect } from "react";
import AuthorNavigationTabs from "./AuthorNavigationTabs";

export default function AuthorDashboard({ token }: { token: string | null }) {
    const [activeTab, setActiveTab] = useState("manage-users");
    const [userInfo, setUserInfo] = useState<{
        name: string;
        username: string;
        email: string;
        role: string;
    } | null>(null);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

    const handleLogout = () => {
    };

    const renderContent = () => {
        switch (activeTab) {
            case "manage-users":
                return <ManageUsers />;
            case "import-files":
                return <div>View Schematic Page Content</div>;
            case "view-schematic":
                return <div>View Schematic Page Content</div>;
            default:
                return <div>Please select a tab. Current tab: {activeTab}</div>;
        }
    };

    return (
        <div className="admin-container">
            <AuthorNavigationTabs
                active={activeTab}
                onChange={setActiveTab}
                onLogout={handleLogout}
                user={userInfo}
                isPanelCollapsed={isPanelCollapsed}
                onPanelCollapse={setIsPanelCollapsed}
            />
            <div className="content-panel">
                {renderContent()}
            </div>
        </div>
    );
}
