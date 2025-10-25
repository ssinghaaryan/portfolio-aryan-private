import React, { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";

const PhotoUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  // ✅ Explicit authenticator function
  const authenticator = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth");
      const data = await response.json();
      return data; // must contain { token, expire, signature }
    } catch (error) {
      console.error("Auth error:", error);
      throw error;
    }
  };

  return (
    <IKContext
      publicKey="public_L9euM/Nfb6sl8cb4UeImo4bCsik="
      urlEndpoint="https://ik.imagekit.io/aryans"
      authenticator={authenticator} // ✅ Directly pass the function
    >
      <div style={{ display: "flex", justifyContent: "flex-end", width: "94%" }}>
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#515152",
          color: "#fff",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          fontFamily: "Menlo",
        }}
      >
        + Upload
      </button>
      </div>

      <IKUpload
        ref={fileInputRef}
        fileName={`photo_${Date.now()}.jpg`}
        folder="/photos"
        onSuccess={(res) => {
          console.log("✅ Uploaded:", res.url);
          onUpload(res.url);
        }}
        onError={(err) => console.error("❌ Upload error:", err)}
        style={{ display: "none" }}
      />
    </IKContext>
  );
};

export default PhotoUpload;
