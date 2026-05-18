import React, { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiUpload, FiPlay, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { demoVideoApi, DemoVideoDTO } from "../services/demoVideoApi";
import "../Styles/ImageManagement.css"; // Reuse styles for consistency

export default function VideoManagement() {
    const [videos, setVideos] = useState<DemoVideoDTO[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<DemoVideoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Upload State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const data = await demoVideoApi.getAllVideos();
            setVideos(data);
            setFilteredVideos(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch videos");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile || !title) {
            setError("Title and Video file are required");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", videoFile);
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
        formData.append("uploadedBy", localStorage.getItem("userEmail") || "admin");

        try {
            await demoVideoApi.uploadVideo(formData);
            setSuccessMessage("Video uploaded successfully");
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnailFile(null);
            fetchVideos();
        } catch (err: any) {
            setError(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            await demoVideoApi.deleteVideo(id);
            setSuccessMessage("Video deleted successfully");
            fetchVideos();
        } catch (err: any) {
            setError(err.message || "Delete failed");
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await demoVideoApi.updateStatus(id, !currentStatus);
            fetchVideos();
        } catch (err: any) {
            setError(err.message || "Status update failed");
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = videos.filter(v => 
            v.title.toLowerCase().includes(query.toLowerCase()) || 
            v.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredVideos(filtered);
    };

    return (
        <div className="asset-management-page">
            <div className="im-header">
                <h1 className="title">Demo Video Management</h1>
                <p className="subtitle">Manage demo videos for new users</p>
            </div>

            {error && <div className="im-alert im-alert-error">{error}</div>}
            {successMessage && <div className="im-alert im-alert-success">{successMessage}</div>}

            <div className="im-upload-section">
                <div className="im-card" style={{ width: "100%" }}>
                    <div className="im-card-header">
                        <h2>Upload New Demo Video</h2>
                    </div>
                    <form className="im-card-body" onSubmit={handleUpload}>
                        <div className="im-form-group" style={{ marginBottom: "15px" }}>
                            <label>Video Title</label>
                            <input 
                                type="text" 
                                className="im-input" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Enter video title"
                                required
                            />
                        </div>
                        <div className="im-form-group" style={{ marginBottom: "15px" }}>
                            <label>Description</label>
                            <textarea 
                                className="im-input" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                placeholder="Enter video description"
                                rows={3}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
                            <div className="im-form-group" style={{ flex: 1 }}>
                                <label>Video File (.mp4)</label>
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    required
                                />
                            </div>
                            <div className="im-form-group" style={{ flex: 1 }}>
                                <label>Thumbnail Image (Optional)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="im-btn im-btn-primary" 
                            disabled={uploading}
                            style={{ width: "200px" }}
                        >
                            {uploading ? "Uploading..." : <><FiUpload /> Upload Video</>}
                        </button>
                    </form>
                </div>
            </div>

            <div className="im-search-filter">
                <div className="im-search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="im-table-container">
                <table className="im-table">
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Title & Description</th>
                            <th>Status</th>
                            <th>Uploaded At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="im-loading">Loading...</td></tr>
                        ) : filteredVideos.length === 0 ? (
                            <tr><td colSpan={5} className="im-empty-state">No videos found</td></tr>
                        ) : (
                            filteredVideos.map((video) => (
                                <tr key={video.id}>
                                    <td>
                                        {video.thumbnailUrl ? (
                                            <img src={video.thumbnailUrl} alt={video.title} style={{ width: "80px", borderRadius: "4px" }} />
                                        ) : (
                                            <div style={{ width: "80px", height: "45px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <FiPlay size={20} color="#999" />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{video.title}</strong>
                                        <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>{video.description}</p>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => toggleStatus(video.id, video.isActive)}
                                            style={{ background: "none", border: "none", cursor: "pointer" }}
                                            title={video.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {video.isActive ? <FiCheckCircle color="green" size={20} /> : <FiXCircle color="red" size={20} />}
                                        </button>
                                    </td>
                                    <td style={{ fontSize: "12px" }}>
                                        {new Date(video.uploadedAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="im-btn im-btn-secondary" style={{ padding: "5px 10px" }}>
                                                <FiPlay />
                                            </a>
                                            <button onClick={() => handleDelete(video.id)} className="im-btn im-btn-danger" style={{ padding: "5px 10px" }}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
