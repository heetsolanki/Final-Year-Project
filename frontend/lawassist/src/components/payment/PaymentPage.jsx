import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  Clock,
  AlertCircle,
  Receipt,
  Download,
} from "lucide-react";
import generateInvoice from "../../utils/generateInvoice";

// ─── UPI PROVIDERS ───
const VALID_UPI_PROVIDERS =
  "ybl|ibl|axl|okhdfcbank|okaxis|oksbi|upi|paytm|apl|airtel|jio|idfcbank|icici|hdfcbank|kotak|axisbank";

const UPI_REGEX = new RegExp(
  `^[a-zA-Z0-9._-]{2,256}@(${VALID_UPI_PROVIDERS})$`,
);

const validateUPIValue = (value) => {
  if (!value.trim())
    return "Please enter a valid UPI address (example: username@ybl)";
  if (!UPI_REGEX.test(value.trim())) return "Invalid UPI ID format";
  return "";
};

// ─── UPI FORM ───
const UPIForm = ({ upiId, onChange, error, disabled }) => (
  <div>
    <label className="text-sm font-medium">
      UPI ID <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={upiId}
      onChange={(e) => onChange(e.target.value)}
      placeholder="username@ybl"
      disabled={disabled}
      className={`mt-1 w-full rounded border p-2.5 text-sm transition outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
          : upiId && !error
            ? "border-green-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
            : "border-gray-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-200"
      }`}
    />
    {error ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} />
        {error}
      </p>
    ) : upiId ? (
      <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
        <CheckCircle size={12} />
        Valid UPI ID
      </p>
    ) : null}
    <p className="mt-1 text-xs text-gray-400">
      Supported: @ybl, @oksbi, @okaxis, @paytm, @upi, @hdfcbank &amp; more
    </p>
  </div>
);

// ─── CARD FORM ───
const CardPaymentForm = ({ cardData, setCardData, errors, disabled }) => {
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const getCardType = (number) => {
    const digits = number.replace(/\s/g, "");
    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits)) return "Mastercard";
    if (/^6[0-9]/.test(digits) || /^81/.test(digits)) return "RuPay";
    return null;
  };

  const cardType = getCardType(cardData.cardNumber);

  const inputClass = (field) =>
    `mt-1 w-full rounded border p-2.5 text-sm transition outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
        : "border-gray-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-200"
    }`;

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} />
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">
          Cardholder Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={cardData.cardholderName}
          onChange={(e) =>
            setCardData({ ...cardData, cardholderName: e.target.value })
          }
          placeholder="Name on card"
          disabled={disabled}
          className={inputClass("cardholderName")}
        />
        <FieldError field="cardholderName" />
      </div>

      <div>
        <label className="text-sm font-medium">
          Card Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) =>
              setCardData({
                ...cardData,
                cardNumber: formatCardNumber(e.target.value),
              })
            }
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            disabled={disabled}
            className={inputClass("cardNumber")}
          />
          {cardType && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
              {cardType}
            </span>
          )}
        </div>
        <FieldError field="cardNumber" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">
            Month <span className="text-red-500">*</span>
          </label>
          <select
            value={cardData.expiryMonth}
            onChange={(e) =>
              setCardData({ ...cardData, expiryMonth: e.target.value })
            }
            disabled={disabled}
            className={inputClass("expiryMonth")}
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => {
              const m = String(i + 1).padStart(2, "0");
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </select>
          <FieldError field="expiryMonth" />
        </div>

        <div>
          <label className="text-sm font-medium">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            value={cardData.expiryYear}
            onChange={(e) =>
              setCardData({ ...cardData, expiryYear: e.target.value })
            }
            disabled={disabled}
            className={inputClass("expiryYear")}
          >
            <option value="">YYYY</option>
            {Array.from({ length: 10 }, (_, i) => {
              const y = new Date().getFullYear() + i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
          <FieldError field="expiryYear" />
        </div>

        <div>
          <label className="text-sm font-medium">
            CVV <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={cardData.cvv}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 3);
              setCardData({ ...cardData, cvv: val });
            }}
            placeholder="123"
            maxLength={3}
            disabled={disabled}
            className={inputClass("cvv")}
          />
          <FieldError field="cvv" />
        </div>
      </div>
    </div>
  );
};

// ─── PAYMENT LOADER ───
const PaymentLoader = () => (
  <div className="global-modal-overlay">
    <div className="bg-white w-full max-w-[360px] rounded-2xl shadow-2xl p-8 text-center">
      <div className="flex justify-center mb-5">
        <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        Processing your payment...
      </h2>
      <p className="text-sm text-gray-500">Please do not close this window.</p>
    </div>
  </div>
);

// ─── PAYMENT RECEIPT ───
// Also exported so PaymentHistoryTab can reuse it as a modal
export const PaymentReceipt = ({
  transactionId,
  paymentDate,
  paymentMethod,
  amount,
  expertName,
  availabilityWindow,
  upiId,
  cardLast4,
  onStart,
  onClose,
  onDownload,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const rows = [
    { label: "Transaction ID", value: transactionId, mono: true },
    {
      label: "Date",
      value: new Date(paymentDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
    {
      label: "Payment Method",
      value:
        paymentMethod === "UPI"
          ? `UPI${upiId ? ` (${upiId})` : ""}`
          : `Card ending ****${cardLast4 || "****"}`,
    },
    { label: "Amount Paid", value: `₹${amount}`, highlight: true },
    { label: "Expert", value: expertName },
    { label: "Availability", value: availabilityWindow || "Not set" },
    { label: "Status", value: "Success", badge: true },
  ];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E3A8A] px-6 py-5 text-center text-white shrink-0">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold">Payment Successful</h2>
          <p className="text-blue-200 text-sm mt-1">
            Your consultation session is confirmed
          </p>
        </div>

        {/* Receipt Body — scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <Receipt size={15} className="text-[#1E3A8A]" />
            Payment Receipt
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50/50 divide-y divide-gray-100">
            {rows.map(({ label, value, mono, highlight, badge }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-gray-500 shrink-0 mr-4">{label}</span>
                {badge ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <CheckCircle size={11} />
                    {value}
                  </span>
                ) : (
                  <span
                    className={`font-medium text-gray-800 text-right ${
                      highlight ? "text-[#1E3A8A] text-base font-bold" : ""
                    } ${mono ? "font-mono text-xs" : ""}`}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 flex flex-col gap-2 shrink-0 border-t border-gray-100">
          {onDownload && (
            <button
              onClick={onDownload}
              className="w-full flex items-center justify-center gap-2 border border-[#1E3A8A] text-[#1E3A8A] py-2.5 rounded-xl text-sm font-medium transition hover:bg-blue-50"
            >
              <Download size={15} />
              Download Invoice
            </button>
          )}
          <div className="flex gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition hover:bg-gray-50"
              >
                Close
              </button>
            )}
            {onStart && (
              <button
                onClick={onStart}
                className="flex-1 bg-[#1E3A8A] text-white py-2.5 rounded-xl text-sm font-medium transition hover:bg-[#162e6d]"
              >
                Start Consultation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─── PAYMENT FAILURE MODAL ───
const PaymentFailureModal = ({ onRetry, onCancel }) => (
  <div className="global-modal-overlay">
    <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-red-100 p-4 rounded-full">
          <XCircle className="text-red-600 w-8 h-8" />
        </div>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
        Payment Failed
      </h2>
      <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5">
        Something went wrong while processing the payment.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-medium transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onRetry}
          className="flex-1 bg-[#1E3A8A] text-white py-3 rounded-xl text-sm font-medium transition hover:bg-[#162e6d]"
        >
          Retry Payment
        </button>
      </div>
    </div>
  </div>
);

// ─── EXPERT CONSULTATION CARD ───
const ExpertConsultationCard = ({ expert, amount, isFollowUp }) => (
  <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 shadow-sm text-center space-y-3">
    <div className="w-16 h-16 mx-auto rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-2xl font-bold">
      {expert.name?.charAt(0)?.toUpperCase() || "E"}
    </div>
    <h3 className="text-lg font-bold text-gray-800">{expert.name}</h3>
    <p className="text-indigo-600 font-medium text-sm">
      {expert.specialization}
    </p>
    {expert.city && expert.state && (
      <p className="text-xs text-gray-500">
        {expert.city}, {expert.state}
      </p>
    )}
    <div className="border-t border-gray-200 pt-3 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {isFollowUp ? "Follow-Up Fee" : "Consultation Fee"}
        </span>
        <span className="text-xl font-bold text-gray-800">
          ₹{amount}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Availability</span>
        <span className="font-medium text-gray-700 flex items-center gap-1">
          <Clock size={14} />
          {expert?.availability?.startTime && expert?.availability?.endTime
            ? `${expert.availability.startTime} - ${expert.availability.endTime}`
            : "Not set"}
        </span>
      </div>
    </div>
  </div>
);

// ─── PAYMENT METHOD SELECTOR ───
const PaymentMethodSelector = ({ method, setMethod, disabled }) => (
  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
    <button
      type="button"
      onClick={() => !disabled && setMethod("UPI")}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed ${
        method === "UPI"
          ? "bg-[#1E3A8A] text-white"
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Smartphone size={16} />
      UPI
    </button>
    <button
      type="button"
      onClick={() => !disabled && setMethod("CARD")}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed ${
        method === "CARD"
          ? "bg-[#1E3A8A] text-white"
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <CreditCard size={16} />
      Credit / Debit Card
    </button>
  </div>
);

// ─── MAIN PAYMENT PAGE ───
const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get("expertId");
  const followUpConsultationId = searchParams.get("followUpConsultationId");
  const token = localStorage.getItem("token");

  const [expert, setExpert] = useState(null);
  const [expertError, setExpertError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState(
    followUpConsultationId ? "followup" : "initial",
  );

  // UPI — live validation
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const upiValid = upiId.trim() !== "" && upiError === "";

  // Card
  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});

  // Result
  const [showReceipt, setShowReceipt] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [consultationId, setConsultationId] = useState("");
  const [userInfo, setUserInfo] = useState({ userName: "", userEmail: "" });

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  const fetchExpert = useCallback(async () => {
    if (!expertId || !token || paymentMode !== "initial") return;
    try {
      const res = await axios.get(
        `${API_URL}/api/payments/expert-info/${expertId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setExpert(res.data);
      setPaymentAmount(res.data.consultationFee || 0);
      setExpertError("");
    } catch (error) {
      setExpertError(error?.response?.data?.message || "Expert not found or unavailable.");
    } finally {
      setLoading(false);
    }
  }, [expertId, token, paymentMode]);

  const fetchFollowUpInfo = useCallback(async () => {
    if (!followUpConsultationId || !token || paymentMode !== "followup") return;
    try {
      const res = await axios.get(
        `${API_URL}/api/payments/followup-info/${followUpConsultationId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setExpert(res.data.expert);
      setPaymentAmount(res.data.followUpFee || 0);
      setExpertError("");
    } catch (error) {
      setExpertError(error?.response?.data?.message || "Follow-up session unavailable.");
    } finally {
      setLoading(false);
    }
  }, [followUpConsultationId, token, paymentMode]);

  const fetchUserInfo = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo({
        userName: res.data.name || "",
        userEmail: res.data.email || "",
      });
    } catch {
      // non-critical — invoice will fall back to defaults
    }
  }, [token]);

  useEffect(() => {
    fetchExpert();
    fetchFollowUpInfo();
    fetchUserInfo();
  }, [fetchExpert, fetchFollowUpInfo, fetchUserInfo]);

  useEffect(() => {
    if (!expertId && !followUpConsultationId) {
      setExpertError("Invalid payment request.");
      setLoading(false);
    }
  }, [expertId, followUpConsultationId]);

  // Live UPI validation on every keystroke
  const handleUpiChange = (value) => {
    setUpiId(value);
    setUpiError(value ? validateUPIValue(value) : "");
  };

  const validateCard = () => {
    const errs = {};
    const digits = cardData.cardNumber.replace(/\s/g, "");

    if (!cardData.cardholderName.trim())
      errs.cardholderName = "Cardholder name is required";
    if (!digits || !/^\d{16}$/.test(digits))
      errs.cardNumber = "Card number must be 16 digits";
    if (!cardData.expiryMonth) errs.expiryMonth = "Required";
    if (!cardData.expiryYear) errs.expiryYear = "Required";

    if (cardData.expiryMonth && cardData.expiryYear) {
      const expiry = new Date(
        Number(cardData.expiryYear),
        Number(cardData.expiryMonth),
        0,
      );
      if (expiry < new Date()) {
        errs.expiryMonth = "Card expired";
        errs.expiryYear = "Card expired";
      }
    }

    if (!cardData.cvv || !/^\d{3}$/.test(cardData.cvv))
      errs.cvv = "Must be 3 digits";

    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePayment = async () => {
    if (paymentMethod === "UPI") {
      const err = validateUPIValue(upiId);
      if (err) { setUpiError(err); return; }
    }
    if (paymentMethod === "CARD" && !validateCard()) return;

    setProcessing(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 1000),
    );

    try {
      const cardDigits = cardData.cardNumber.replace(/\s/g, "");
      const endpoint =
        paymentMode === "followup"
          ? `${API_URL}/api/payments/process-followup`
          : `${API_URL}/api/payments/process`;

      const payload =
        paymentMode === "followup"
          ? {
              consultationId: followUpConsultationId,
              paymentMethod,
              upiId: paymentMethod === "UPI" ? upiId.trim() : undefined,
              cardLast4Digits:
                paymentMethod === "CARD" ? cardDigits.slice(-4) : undefined,
            }
          : {
              expertId,
              amount: paymentAmount,
              paymentMethod,
              upiId: paymentMethod === "UPI" ? upiId.trim() : undefined,
              cardLast4Digits:
                paymentMethod === "CARD" ? cardDigits.slice(-4) : undefined,
            };

      const res = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProcessing(false);

      if (res.data.success) {
        setConsultationId(res.data.consultationId);
        setReceiptData({
          transactionId: res.data.transactionId,
          paymentDate: new Date().toISOString(),
          paymentMethod,
          amount: paymentAmount,
          expertName: expert.name,
          availabilityWindow:
            expert?.availability?.startTime && expert?.availability?.endTime
              ? `${expert.availability.startTime} - ${expert.availability.endTime}`
              : "Not set",
          expertSpecialization: expert.specialization || "Legal Expert",
          upiId: paymentMethod === "UPI" ? upiId.trim() : undefined,
          cardLast4:
            paymentMethod === "CARD" ? cardDigits.slice(-4) : undefined,
        });
        setShowReceipt(true);
      } else {
        setShowFailure(true);
      }
    } catch {
      setProcessing(false);
      setShowFailure(true);
    }
  };

  const handleRetry = () => setShowFailure(false);
  const handleCancel = () => navigate(-1);
  const handleStartConsultation = () => navigate(`/chat/${consultationId}`);

  const handleDownloadInvoice = () => {
    if (!receiptData) return;
    generateInvoice({
      ...receiptData,
      userName: userInfo.userName,
      userEmail: userInfo.userEmail,
    });
  };

  // Disable Pay button for UPI when input is empty or invalid
  const isPayDisabled =
    processing || (paymentMethod === "UPI" && !upiValid);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin" />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">{expertError || "Expert not found or unavailable."}</p>
        <button
          onClick={() => navigate("/experts")}
          className="text-[#1E3A8A] font-medium hover:underline"
        >
          Browse Experts
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12 sm:pb-16 px-4">
        <div className="mx-auto w-full max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-[#1E3A8A] hover:text-yellow-500 transition-all duration-200 mb-6"
          >
            <ArrowLeft size={16} /> Back to Expert Profile
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT — Expert Info */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 transition hover:shadow-lg sticky top-28">
                <ExpertConsultationCard
                  expert={expert}
                  amount={paymentAmount}
                  isFollowUp={paymentMode === "followup"}
                />

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center">
                  <Shield size={14} />
                  Secure Simulated Payment
                </div>
              </div>
            </div>

            {/* RIGHT — Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 md:p-8 transition hover:shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                  Payment Details
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {paymentMode === "followup"
                    ? "Complete the reduced follow-up fee to reactivate your consultation chat."
                    : "Complete the payment to start your consultation session."}
                </p>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Payment Method
                  </label>
                  <PaymentMethodSelector
                    method={paymentMethod}
                    setMethod={(m) => {
                      setPaymentMethod(m);
                      setUpiError("");
                    }}
                    disabled={processing}
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:p-5 mb-6">
                  {paymentMethod === "UPI" ? (
                    <UPIForm
                      upiId={upiId}
                      onChange={handleUpiChange}
                      error={upiError}
                      disabled={processing}
                    />
                  ) : (
                    <CardPaymentForm
                      cardData={cardData}
                      setCardData={(val) => {
                        setCardData(val);
                        setCardErrors({});
                      }}
                      errors={cardErrors}
                      disabled={processing}
                    />
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isPayDisabled}
                  className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 hover:bg-[#162e6d] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing
                    ? "Processing..."
                    : paymentMethod === "UPI"
                      ? `Pay ₹${paymentAmount} via UPI`
                      : `Pay ₹${paymentAmount}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {processing && <PaymentLoader />}

      {showReceipt && receiptData && (
        <PaymentReceipt
          {...receiptData}
          onStart={handleStartConsultation}
          onDownload={handleDownloadInvoice}
        />
      )}

      {showFailure && (
        <PaymentFailureModal onRetry={handleRetry} onCancel={handleCancel} />
      )}
    </>
  );
};

export default PaymentPage;
