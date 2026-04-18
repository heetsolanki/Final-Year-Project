import API_URL from "../api";

export const toAbsoluteDocumentUrl = (url = "") => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${API_URL}${url}`;
};

export const toPdfOpenUrl = (url = "") => {
  const absoluteUrl = toAbsoluteDocumentUrl(url);
  if (!absoluteUrl) return "";

  // Cloudinary raw assets often force download. Route PDFs via an embeddable
  // viewer URL so clicking "Open" consistently displays the document.
  const lower = absoluteUrl.toLowerCase();
  const looksLikePdf =
    lower.endsWith(".pdf") ||
    lower.includes("/raw/upload/") ||
    lower.includes("filetype=pdf");

  if (!looksLikePdf) return absoluteUrl;

  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(absoluteUrl)}`;
};