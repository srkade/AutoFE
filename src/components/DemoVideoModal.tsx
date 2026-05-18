import React, { useState, useEffect } from "react";
import { FiX, FiPlay, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { demoVideoApi, DemoVideoDTO } from "../services/demoVideoApi";

interface DemoVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
    const [videos, setVideos] = useState<DemoVideoDTO[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchVideos();
            setShowPrompt(true);
        }
    }, [isOpen]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const data = await demoVideoApi.getAllVideos(true);
            setVideos(data);
        } catch (err) {
            console.error("Failed to fetch demo videos", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const currentVideo = videos[currentIndex];

    const nextVideo = () => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    const prevVideo = () => {
        setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    };

    return (
        <div className="modal-overlay" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            backdropFilter: "blur(5px)"
        }}>
            <div className="modal-content" style={{
                backgroundColor: "#1e293b",
                width: "90%",
                maxWidth: "1000px",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                color: "white"
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        color: "white",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 10,
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                    title="Close Demo"
                >
                    <FiX size={28} />
                </button>

                <div style={{ padding: "40px 30px" }}>
                    {showPrompt ? (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <div style={{ 
                                width: "80px", 
                                height: "80px", 
                                background: "rgba(59, 130, 246, 0.1)", 
                                borderRadius: "50%", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                color: "#3b82f6"
                            }}>
                                <FiPlay size={40} />
                            </div>
                            <h2 style={{ marginBottom: "16px", fontSize: "28px", fontWeight: "700" }}>Welcome to Schematic App!</h2>
                            <p style={{ marginBottom: "32px", color: "#94a3b8", fontSize: "18px", maxWidth: "600px", margin: "0 auto 32px" }}>
                                Would you like to watch a quick demo to learn how to use the platform effectively?
                            </p>
                            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                                <button 
                                    onClick={() => setShowPrompt(false)}
                                    style={{
                                        background: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 32px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}
                                >
                                    Watch Demo
                                </button>
                                <button 
                                    onClick={onClose}
                                    style={{
                                        background: "transparent",
                                        color: "#cbd5e1",
                                        border: "1px solid #475569",
                                        padding: "12px 32px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                        e.currentTarget.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#cbd5e1";
                                    }}
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ marginBottom: "10px", fontSize: "24px", fontWeight: "700" }}>Platform Demo</h2>
                            <p style={{ marginBottom: "20px", color: "#94a3b8" }}>Watch these videos to get started.</p>

                            {loading ? (
                                <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div className="loader">Loading videos...</div>
                                </div>
                            ) : videos.length === 0 ? (
                                <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <p>No demo videos available at the moment.</p>
                                </div>
                            ) : (
                                <div style={{ position: "relative" }}>
                                    <div style={{ position: "relative", paddingTop: "56.25%", background: "black", borderRadius: "12px", overflow: "hidden" }}>
                                        <video 
                                            key={currentVideo.id}
                                            src={currentVideo.videoUrl} 
                                            controls 
                                            autoPlay
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%"
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>{currentVideo.title}</h3>
                                            <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6" }}>{currentVideo.description}</p>
                                        </div>
                                        
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", marginLeft: "20px" }}>
                                            {videos.length > 1 && (
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <button onClick={prevVideo} style={navBtnStyle}><FiChevronLeft size={24} /></button>
                                                    <button onClick={nextVideo} style={navBtnStyle}><FiChevronRight size={24} /></button>
                                                </div>
                                            )}
                                            <button 
                                                onClick={onClose}
                                                style={{
                                                    background: "rgba(239, 68, 68, 0.1)",
                                                    color: "#ef4444",
                                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                                    padding: "8px 16px",
                                                    borderRadius: "6px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    fontSize: "13px",
                                                    transition: "all 0.2s"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = "#ef4444";
                                                    e.currentTarget.style.color = "white";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                                                    e.currentTarget.style.color = "#ef4444";
                                                }}
                                            >
                                                Close Video
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "8px" }}>
                                        {videos.map((_, idx) => (
                                            <div 
                                                key={idx}
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    background: idx === currentIndex ? "#3b82f6" : "#475569",
                                                    transition: "all 0.3s ease"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                {!showPrompt && (
                    <div style={{ 
                        padding: "15px 30px", 
                        background: "#0f172a", 
                        display: "flex", 
                        justifyContent: "flex-end"
                    }}>
                        <button 
                            onClick={onClose}
                            style={{
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                padding: "10px 24px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const navBtnStyle = {
    background: "#334155",
    color: "white",
    border: "none",
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s"
};
