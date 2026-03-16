import React, { useState } from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import API_URL from "../../api";

const IMAGE_TYPES = ["jpg", "jpeg", "png"];

const FileMessage = ({ fileUrl, fileName, fileType, isMine }) => {
  const fullUrl = `${API_URL}${fileUrl}`;
  const isImage = IMAGE_TYPES.includes(fileType?.toLowerCase());
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(fullUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // silently fail — file may not be available
    } finally {
      setDownloading(false);
    }
  };

  if (isImage) {
    return (
      <a href={fullUrl} target="_blank" rel="noreferrer">
        <img
          src={fullUrl}
          alt={fileName}
          className="max-w-[220px] max-h-[200px] object-cover rounded-xl border shadow-sm cursor-pointer hover:opacity-90 transition"
        />
      </a>
    );
  }

  const cardBase = isMine
    ? "border-indigo-400 bg-indigo-500 text-white"
    : "border-gray-200 bg-gray-50 text-gray-700";

  const btnBase = isMine
    ? "border-indigo-300 hover:bg-indigo-400 text-white"
    : "border-gray-300 hover:bg-gray-200 text-gray-600";

  return (
    <div
      className={`flex flex-col gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${cardBase}`}
    >
      {/* File name row */}
      <div className="flex items-center gap-2">
        <FileText size={16} className="shrink-0" />
        <span className="truncate max-w-[180px]">{fileName}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition no-underline ${btnBase}`}
        >
          <ExternalLink size={12} />
          Open
        </a>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition ${btnBase} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {downloading ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={12} />
          )}
          {downloading ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
};

export default FileMessage;

