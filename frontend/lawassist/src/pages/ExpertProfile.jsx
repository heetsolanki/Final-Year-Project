import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";
import AlertPopup from "../components/ui/AlertPopup";
import { generateBio } from "../services/aiService";
import {
  Scale,
  MapPin,
  Languages,
  Briefcase,
  BadgeCheck,
  ArrowLeft,
  ShieldAlert,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  states,
  specializations,
  indianLanguages,
  expertiseBySpecialization,
} from "../data";

const ID_DOCUMENT_TYPES = [
  { value: "aadhaar", label: "Aadhaar Card", placeholder: "1234-5678-9012", hint: "12 digits (auto-formatted)" },
  { value: "pan", label: "PAN Card", placeholder: "ABCDE1234F", hint: "Format: ABCDE1234F" },
  { value: "passport", label: "Passport", placeholder: "A1234567", hint: "Format: A1234567" },
  { value: "voter_id", label: "Voter ID", placeholder: "ABC1234567", hint: "Format: ABC1234567" },
  { value: "driving_license", label: "Driving License", placeholder: "MH02 12345678901", hint: "Format: MH02 12345678901" },
];

const idValidationRules = {
  aadhaar: { regex: /^\d{4}-\d{4}-\d{4}$/, msg: "Aadhaar must be exactly 12 digits" },
  pan: { regex: /^[A-Z]{5}\d{4}[A-Z]$/, msg: "PAN must be in format: ABCDE1234F" },
  passport: { regex: /^[A-Z]\d{7}$/, msg: "Passport must be in format: A1234567" },
  voter_id: { regex: /^[A-Z]{3}\d{7}$/, msg: "Voter ID must be in format: ABC1234567" },
  driving_license: { regex: /^[A-Z]{2}\d{2}\s?\d{11}$/, msg: "Driving License must be in format: MH02 12345678901" },
};

// Format Aadhaar number with hyphens: XXXX-XXXX-XXXX
const formatAadhaar = (value) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  // Limit to 12 digits
  const limited = digits.slice(0, 12);
  // Add hyphens after every 4 digits
  const parts = [];
  for (let i = 0; i < limited.length; i += 4) {
    parts.push(limited.slice(i, i + 4));
  }
  return parts.join("-");
};

const ExpertProfile = () => {
  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [bioError, setBioError] = useState("");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    barCouncilId: "",
    specialization: "",
    otherSpecialization: "",
    experience: "",
    consultationFee: "",
    followUpFee: "",
    state: "",
    city: "",
    languages: [],
    expertiseAreas: [],
    bio: "",
    idDocumentType: "",
    idNumber: "",
    idProofUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expert/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setProfileCompletion(data.profileCompletion || 0);
      setVerificationStatus(data.verificationStatus || "");
      setRejectionReason(data.rejectionReason || "");

      // Format Aadhaar number if it exists and is not already formatted
      let idNumber = data.idNumber || "";
      if (data.idDocumentType === "aadhaar" && idNumber && !idNumber.includes("-")) {
        idNumber = formatAadhaar(idNumber);
      }

      setFormData({
        barCouncilId: data.barCouncilId || "",
        specialization: data.specialization || "",
        otherSpecialization: "",
        experience: data.experience || "",
        consultationFee: data.consultationFee ?? data.consultationCharges ?? "",
        followUpFee: data.followUpFee ?? "",
        state: data.state || "",
        city: data.city || "",
        languages: data.languages || [],
        expertiseAreas: data.expertiseAreas || [],
        bio: data.bio || "",
        idDocumentType: data.idDocumentType || "",
        idNumber: idNumber,
        idProofUrl: data.idProofUrl || "",
      });
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");

    if (name === "state") {
      setFormData({ ...formData, state: value, city: "" });
    } else if (name === "specialization") {
      const nextOptions = expertiseBySpecialization[value] || [];
      setFormData((prev) => ({
        ...prev,
        specialization: value,
        expertiseAreas: prev.expertiseAreas.filter((area) =>
          nextOptions.includes(area),
        ),
      }));
    } else if (name === "idDocumentType") {
      // Reset ID number when type changes
      setFormData({ ...formData, idDocumentType: value, idNumber: "" });
    } else if (name === "idNumber" && formData.idDocumentType === "aadhaar") {
      // Format Aadhaar number with hyphens
      const formatted = formatAadhaar(value);
      setFormData({ ...formData, idNumber: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelect = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Bar Council ID
    if (!formData.barCouncilId.trim()) {
      newErrors.barCouncilId = "Bar Council ID is required";
    } else if (!/^[A-Z]{2}\/[0-9]{4}\/[0-9]{4}$/.test(formData.barCouncilId)) {
      newErrors.barCouncilId = "Format must be XX/1234/2020 (uppercase state code)";
    }

    // Experience
    if (!formData.experience && formData.experience !== 0) {
      newErrors.experience = "Experience is required";
    } else {
      const exp = Number(formData.experience);
      if (isNaN(exp) || exp < 1) {
        newErrors.experience = "Minimum 1 year of experience required";
      } else if (exp > 50) {
        newErrors.experience = "Maximum 50 years allowed";
      }
    }

    // Specialization
    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required";
    }
    if (formData.specialization === "Other" && !formData.otherSpecialization.trim()) {
      newErrors.otherSpecialization = "Please specify your specialization";
    }

    // State & City
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";

    // Languages
    if (formData.languages.length === 0) {
      newErrors.languages = "Select at least one language";
    }

    // Expertise
    if (formData.expertiseAreas.length === 0) {
      newErrors.expertiseAreas = "Select at least one area of expertise";
    }

    // ID Document Type
    if (!formData.idDocumentType) {
      newErrors.idDocumentType = "Select a document type";
    }

    // ID Number with type-specific validation
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "ID number is required";
    } else if (formData.idDocumentType) {
      const rule = idValidationRules[formData.idDocumentType];
      if (rule && !rule.regex.test(formData.idNumber.trim())) {
        newErrors.idNumber = rule.msg;
      }
    }

    // ID Proof URL
    if (!formData.idProofUrl.trim()) {
      newErrors.idProofUrl = "ID proof document URL is required";
    } else {
      try {
        new URL(formData.idProofUrl);
      } catch {
        newErrors.idProofUrl = "Enter a valid URL";
      }
    }

    const consultationFee = Number(formData.consultationFee);
    const followUpFee = Number(formData.followUpFee);

    if (!Number.isFinite(consultationFee) || consultationFee <= 0) {
      newErrors.consultationFee = "Consultation fee must be greater than 0";
    }

    if (!Number.isFinite(followUpFee) || followUpFee < 0) {
      newErrors.followUpFee = "Follow-up fee must be 0 or more";
    }

    if (
      Number.isFinite(consultationFee) &&
      Number.isFinite(followUpFee) &&
      followUpFee > consultationFee
    ) {
      newErrors.followUpFee = "Follow-up fee cannot exceed consultation fee";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      // Strip hyphens from Aadhaar before sending to backend
      const idNumberToSend = formData.idDocumentType === "aadhaar"
        ? formData.idNumber.replace(/-/g, "")
        : formData.idNumber;

      await axios.post(
        `${API_URL}/api/expert/complete-profile`,
        {
          ...formData,
          idNumber: idNumberToSend,
          specialization:
            formData.specialization === "Other"
              ? formData.otherSpecialization
              : formData.specialization,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setShowProfilePopup(true);
      fetchProfile();
    } catch (error) {
      const msg = error.response?.data?.message || "Error updating profile";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateBio = async () => {
    setBioError("");
    if (!formData.specialization || !formData.experience) {
      setBioError("Please fill in Specialization and Experience before generating a bio.");
      return;
    }
    try {
      setGeneratingBio(true);
      const bio = await generateBio({
        name: formData.name || "Legal Expert",
        specialization:
          formData.specialization === "Other"
            ? formData.otherSpecialization
            : formData.specialization,
        expertiseAreas: formData.expertiseAreas,
        languages: formData.languages,
        experience: formData.experience,
        city: formData.city,
        state: formData.state,
      });
      setFormData((prev) => ({ ...prev, bio }));
    } catch {
      setBioError("Failed to generate bio. Please try again.");
    } finally {
      setGeneratingBio(false);
    }
  };

  const selectedDocType = ID_DOCUMENT_TYPES.find(
    (d) => d.value === formData.idDocumentType,
  );

  const specializationExpertiseOptions =
    expertiseBySpecialization[formData.specialization] || [];

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} />
        {errors[field]}
      </p>
    ) : null;

  const inputClass = (field) =>
    `mt-1 w-full rounded border p-2 text-sm sm:text-base transition ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
        : "border-gray-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-200"
    } outline-none`;

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12 sm:pb-16 px-4">
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-5 sm:p-8 md:p-10 shadow-lg">
          <div className="mb-6">
            <button
              onClick={() => navigate("/legal-expert-dashboard")}
              className="flex items-center gap-2 text-sm font-medium text-[#1E3A8A] hover:underline"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <Scale className="text-[#1E3A8A]" />
            <h1 className="text-2xl font-semibold">
              Complete Legal Expert Profile
            </h1>
          </div>

          {/* Profile Completion */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">
              Profile Completion:{" "}
              <span className="font-semibold">{profileCompletion}%</span>
            </p>

            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-[#1E3A8A] transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>

            <p className="mt-2 text-sm">
              Status:{" "}
              {verificationStatus === "active" ? (
                <span className="text-green-600 font-semibold inline-flex items-center gap-1">
                  <BadgeCheck size={16} /> Verified
                </span>
              ) : verificationStatus === "under_review" ? (
                <span className="text-yellow-600 font-semibold">Under Review</span>
              ) : verificationStatus === "rejected" ? (
                <span className="text-red-600 font-semibold">Rejected</span>
              ) : verificationStatus === "blocked" ? (
                <span className="text-gray-600 font-semibold">Blocked</span>
              ) : (
                <span className="text-orange-500 font-semibold">Incomplete</span>
              )}
            </p>

            {verificationStatus === "rejected" && rejectionReason && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                  <ShieldAlert size={16} />
                  Rejection Reason
                </div>
                <p className="mt-1 text-sm text-red-600">{rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            {/* ── Professional Details ── */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Briefcase size={16} className="text-[#1E3A8A]" />
                Professional Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar Council ID */}
                <div>
                  <label className="text-sm font-medium">
                    Bar Council ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="barCouncilId"
                    placeholder="MH/1234/2020"
                    value={formData.barCouncilId}
                    onChange={handleChange}
                    className={inputClass("barCouncilId")}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Format: XX/1234/2020 (state code / number / year)
                  </p>
                  <FieldError field="barCouncilId" />
                </div>

                {/* Experience */}
                <div>
                  <label className="text-sm font-medium">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    min="1"
                    max="50"
                    value={formData.experience}
                    onChange={handleChange}
                    className={inputClass("experience")}
                    placeholder="1 - 50"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Minimum 1, maximum 50 years
                  </p>
                  <FieldError field="experience" />
                </div>

                {/* Specialization */}
                <div>
                  <label className="text-sm font-medium">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={inputClass("specialization")}
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <FieldError field="specialization" />

                  {formData.specialization === "Other" && (
                    <>
                      <input
                        type="text"
                        name="otherSpecialization"
                        placeholder="Enter specialization"
                        value={formData.otherSpecialization}
                        onChange={handleChange}
                        className={`${inputClass("otherSpecialization")} mt-2`}
                      />
                      <FieldError field="otherSpecialization" />
                    </>
                  )}
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="text-sm font-medium">
                    Consultation Fee (INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    min="1"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className={inputClass("consultationFee")}
                  />
                  <FieldError field="consultationFee" />
                </div>

                {/* Follow-Up Fee */}
                <div>
                  <label className="text-sm font-medium">
                    Follow-Up Fee (INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="followUpFee"
                    min="0"
                    value={formData.followUpFee}
                    onChange={handleChange}
                    className={inputClass("followUpFee")}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Follow-up fee should not exceed consultation fee
                  </p>
                  <p className="text-xs text-gray-400">
                    Recommended: 20%-50% of consultation fee
                  </p>
                  <FieldError field="followUpFee" />
                </div>
              </div>
            </div>

            {/* ── Location ── */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-[#1E3A8A]" />
                Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State */}
                <div>
                  <label className="text-sm font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={inputClass("state")}
                  >
                    <option value="">Select State</option>
                    {Object.keys(states).map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                  <FieldError field="state" />
                </div>

                {/* City */}
                <div>
                  <label className="text-sm font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass("city")}
                  >
                    <option value="">Select City</option>
                    {states[formData.state]?.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                  <FieldError field="city" />
                </div>
              </div>
            </div>

            {/* ── Expertise & Bio ── */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Languages size={16} className="text-[#1E3A8A]" />
                Expertise & Bio
              </h3>

              {/* Languages */}
              <div>
                <label className="text-sm font-medium">
                  Languages <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2 sm:gap-3">
                  {indianLanguages.map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => handleMultiSelect("languages", lang)}
                      className={`rounded border px-2 sm:px-3 py-1 text-xs sm:text-sm transition ${
                        formData.languages.includes(lang)
                          ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <FieldError field="languages" />
              </div>

              {/* Expertise Areas */}
              <div>
                <label className="text-sm font-medium">
                  Areas of Expertise <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-2 sm:gap-3">
                  {specializationExpertiseOptions.map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => handleMultiSelect("expertiseAreas", area)}
                      className={`rounded border px-2 sm:px-3 py-1 text-xs sm:text-sm transition ${
                        formData.expertiseAreas.includes(area)
                          ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <FieldError field="expertiseAreas" />
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-medium">Professional Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className={inputClass("bio")}
                />

                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={generatingBio}
                  className="mt-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {generatingBio ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating bio...
                    </>
                  ) : (
                    <>✨ Generate with AI</>
                  )}
                </button>

                {bioError && (
                  <p className="mt-1 text-xs text-red-500">{bioError}</p>
                )}
              </div>
            </div>

            {/* ── Identity Verification ── */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={16} className="text-[#1E3A8A]" />
                Identity Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Document Type */}
                <div>
                  <label className="text-sm font-medium">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="idDocumentType"
                    value={formData.idDocumentType}
                    onChange={handleChange}
                    className={inputClass("idDocumentType")}
                  >
                    <option value="">Select Document Type</option>
                    {ID_DOCUMENT_TYPES.map((doc) => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </select>
                  <FieldError field="idDocumentType" />
                </div>

                {/* ID Number */}
                <div>
                  <label className="text-sm font-medium">
                    Document Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    placeholder={selectedDocType?.placeholder || "Select document type first"}
                    value={formData.idNumber}
                    onChange={handleChange}
                    disabled={!formData.idDocumentType}
                    maxLength={formData.idDocumentType === "aadhaar" ? 14 : undefined}
                    className={`${inputClass("idNumber")} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {selectedDocType && (
                    <p className="mt-1 text-xs text-gray-400">
                      {selectedDocType.hint}
                    </p>
                  )}
                  <FieldError field="idNumber" />
                </div>
              </div>

              {/* ID Proof URL */}
              <div>
                <label className="text-sm font-medium">
                  Upload Document (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="idProofUrl"
                  placeholder="https://drive.google.com/..."
                  value={formData.idProofUrl}
                  onChange={handleChange}
                  className={inputClass("idProofUrl")}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Upload your document to Google Drive or similar and paste the shared link
                </p>
                <FieldError field="idProofUrl" />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#1E3A8A] py-3 text-sm sm:text-base font-medium text-white hover:bg-[#162e6d] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving Profile..." : "Save Profile"}
              </button>
            </div>
            <AlertPopup
              show={showProfilePopup}
              type="success"
              title="Profile Updated"
              description="Your profile has been updated successfully."
              redirectTo="/legal-expert-dashboard"
              onClose={() => setShowProfilePopup(false)}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ExpertProfile;
