import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { API_BASE_URL as CONFIG_API_BASE_URL } from "../../config";

const API_BASE_URL = process.env.REACT_APP_API_URL || CONFIG_API_BASE_URL;

interface LocationImageTabProps {
  itemId: string | null;
  itemType: "component" | "connector" | "splice";
  isActive: boolean;
}

// Simple cache for location images
const locationImageCache = new Map<string, string[]>();

export default function LocationImageTab({
  itemId,
  itemType,
  isActive,
}: LocationImageTabProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Only load when tab is active and we haven't loaded yet
    if (!isActive || !itemId || hasLoaded.current) return;

    const loadLocationImages = async () => {
      setLoading(true);
      setError(false);

      // Check cache first
      const cacheKey = `${itemType}-${itemId}`;
      if (locationImageCache.has(cacheKey)) {
        setImages(locationImageCache.get(cacheKey)!);
        setLoading(false);
        hasLoaded.current = true;
        return;
      }

      try {
        // Map itemType to entity type for API
        const entityTypeMap: Record<string, string> = {
          component: "COMPONENT",
          connector: "CONNECTOR",
          splice: "SPLICE",
        };
        const entityType = entityTypeMap[itemType];

        // Try to fetch location images from new API
        const response = await fetch(
          `${API_BASE_URL}/location-images/entity/${itemId}/${entityType}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            const imageUrls = data.data.map((img: any) => img.imageUrl);
            setImages(imageUrls);
            locationImageCache.set(cacheKey, imageUrls);
          } else {
            // Fallback to default location image path
            const defaultPath = `/images/location/${itemType}s/${itemId}.png`;
            setImages([defaultPath]);
            locationImageCache.set(cacheKey, [defaultPath]);
          }
        } else {
          // Fallback to default location image path
          const defaultPath = `/images/location/${itemType}s/${itemId}.png`;
          setImages([defaultPath]);
          locationImageCache.set(cacheKey, [defaultPath]);
        }
      } catch (err) {
        // Fallback to default location image path
        const defaultPath = `/images/location/${itemType}s/${itemId}.png`;
        setImages([defaultPath]);
        locationImageCache.set(cacheKey, [defaultPath]);
      } finally {
        setLoading(false);
        hasLoaded.current = true;
      }
    };

    loadLocationImages();
  }, [isActive, itemId, itemType]);

  // Reset when item changes
  useEffect(() => {
    if (itemId) {
      hasLoaded.current = false;
      setImages([]);
      setError(false);
    }
  }, [itemId]);

  if (!isActive) return null;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          color: "var(--text-secondary)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "3px solid var(--border-color)",
            borderTop: "3px solid var(--accent-primary)",
            animation: "spin 0.8s linear infinite",
            marginBottom: "12px",
          }}
        />
        <span style={{ fontSize: "14px" }}>Loading location images...</span>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          borderRadius: "8px",
          border: "1px dashed var(--border-color)",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-secondary)",
        }}
      >
        <MapPin
          size={48}
          style={{
            strokeWidth: 1.5,
            marginBottom: "12px",
            color: "var(--text-secondary)",
          }}
        />
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          No location images available
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {images.length === 1 ? (
        // Single image display
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={images[0]}
            alt={`${itemType} location`}
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              objectFit: "contain",
            }}
            onClick={() => {
              window.open(images[0], "_blank");
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith(".png")) {
                target.src = target.src.replace(".png", ".jpg");
              } else if (target.src.endsWith(".jpg")) {
                target.src = target.src.replace(".jpg", ".jpeg");
              }
            }}
          />
        </div>
      ) : (
        // Multiple images display as thumbnails
        <>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            {images.length} Location Image{images.length > 1 ? "s" : ""}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "12px",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onClick={() => {
                  window.open(image, "_blank");
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "var(--card-shadow)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src={image}
                  alt={`${itemType} location ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith(".png")) {
                      target.src = target.src.replace(".png", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".jpeg");
                    }
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    fontSize: "11px",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Click image to open full resolution in new tab
      </div>
    </div>
  );
}
