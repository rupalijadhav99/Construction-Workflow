import React from "react";

const MediaGallery = ({ media = [], onUpload, onRemove, disabled }) => {
  const handleFileChange = (e) => {
    if (!onUpload) return;
    const files = Array.from(e.target.files).map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      id: Date.now() + Math.random(), 
    }));
    onUpload(files);
  };

  return (
    <div>
      <div className="media-gallery">
        {media.map(file => (
          <div key={file.id} style={{ position: "relative" }}>
            <img
              className="media-img"
              src={file.url}
              alt={file.name}
              title={file.name}
            />
            {!disabled && (
              <button
                onClick={() => onRemove(file.id)}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(216, 55, 55, 0.8)",
                  border: "none",
                  color: "white",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                title="Remove Photo"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      {!disabled && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ marginTop: 10 }}
        />
      )}
    </div>
  );
};

export default MediaGallery;
