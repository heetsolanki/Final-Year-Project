import React, { useRef, useState } from "react";
import axios from "axios";
import { Paperclip } from "lucide-react";
import API_URL from "../../api";

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const FileUploadButton = ({ onUploadSuccess, onError, disabled }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // Reset so the same file can be picked again
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_MIMES.includes(file.type)) {
      onError("Invalid file type. Only JPG, PNG, PDF, DOC, DOCX are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      onError("File too large. Maximum size is 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/upload/consultation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUploadSuccess(res.data);
    } catch (err) {
      onError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileRef.current.click()}
        disabled={disabled || uploading}
        title={uploading ? "Uploading file..." : "Attach file"}
        className={`p-2 rounded-xl transition ${
          disabled || uploading
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
        ) : (
          <Paperclip size={20} />
        )}
      </button>
    </>
  );
};

export default FileUploadButton;
