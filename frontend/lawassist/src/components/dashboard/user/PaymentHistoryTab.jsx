import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import {
  CreditCard,
  Loader2,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";
import DashboardCard from "../DashboardCard";
import { PaymentReceipt } from "../../payment/PaymentPage";
import generateInvoice from "../../../utils/generateInvoice";

const StatusBadge = ({ status }) => {
  if (status === "Success")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle size={11} />
        Success
      </span>
    );
  if (status === "Failed")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <XCircle size={11} />
        Failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      <Clock size={11} />
      Pending
    </span>
  );
};

const PaymentHistoryTab = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [userInfo, setUserInfo] = useState({ userName: "", userEmail: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/payments/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo({
          userName: res.data.name || "",
          userEmail: res.data.email || "",
        });
      } catch {
        // non-critical — invoice will use defaults
      }
    };

    fetchPayments();
    fetchUser();
  }, []);

  const handleDownload = (p) => {
    generateInvoice({
      transactionId: p.transactionId,
      paymentDate: p.createdAt,
      paymentMethod: p.paymentMethod,
      amount: p.amount,
      expertName: p.expertName,
      expertSpecialization: p.expertSpecialization || "Legal Expert",
      upiId: p.upiId,
      cardLast4: p.cardLast4Digits,
      userName: userInfo.userName,
      userEmail: userInfo.userEmail,
    });
  };

  if (loading) {
    return (
      <DashboardCard title="Payment History" icon={CreditCard}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#1E3A8A] animate-spin" />
        </div>
      </DashboardCard>
    );
  }

  if (payments.length === 0) {
    return (
      <DashboardCard title="Payment History" icon={CreditCard}>
        <div className="text-center py-12 text-gray-500 text-sm">
          No payments yet.
        </div>
      </DashboardCard>
    );
  }

  return (
    <>
      <DashboardCard title="Payment History" icon={CreditCard}>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-3 pr-4 font-medium">Transaction ID</th>
                <th className="pb-3 pr-4 font-medium">Expert</th>
                <th className="pb-3 pr-4 font-medium">Method</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr
                  key={p.paymentId}
                  className="text-gray-700 hover:bg-gray-50/60 transition"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500">
                    {p.transactionId || p.paymentId}
                  </td>
                  <td className="py-3 pr-4 font-medium">{p.expertName}</td>
                  <td className="py-3 pr-4">
                    {p.paymentMethod === "UPI"
                      ? `UPI${p.upiId ? ` (${p.upiId})` : ""}`
                      : `Card ****${p.cardLast4Digits || "****"}`}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-800">
                    ₹{p.amount}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={p.paymentStatus} />
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3">
                    {p.paymentStatus === "Success" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="flex items-center gap-1 text-xs text-[#1E3A8A] font-medium hover:underline transition"
                        >
                          <Receipt size={13} />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(p)}
                          className="flex items-center gap-1 text-xs text-gray-500 font-medium hover:text-[#1E3A8A] transition"
                          title="Download Invoice PDF"
                        >
                          <Download size={13} />
                          PDF
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {payments.map((p) => (
            <div
              key={p.paymentId}
              className="border border-gray-200 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                  {p.expertName}
                </span>
                <StatusBadge status={p.paymentStatus} />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {p.paymentMethod === "UPI"
                    ? "UPI"
                    : `Card ****${p.cardLast4Digits || "****"}`}
                </span>
                <span className="font-bold text-gray-800">₹{p.amount}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono">
                  {p.transactionId || p.paymentId}
                </span>
                <span>
                  {new Date(p.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {p.paymentStatus === "Success" && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setSelectedPayment(p)}
                    className="flex items-center gap-1 text-xs text-[#1E3A8A] font-medium hover:underline transition"
                  >
                    <Receipt size={13} />
                    View Receipt
                  </button>
                  <button
                    onClick={() => handleDownload(p)}
                    className="flex items-center gap-1 text-xs text-gray-500 font-medium hover:text-[#1E3A8A] transition"
                  >
                    <Download size={13} />
                    Download Invoice
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Receipt Modal */}
      {selectedPayment && (
        <PaymentReceipt
          transactionId={selectedPayment.transactionId}
          paymentDate={selectedPayment.createdAt}
          paymentMethod={selectedPayment.paymentMethod}
          amount={selectedPayment.amount}
          expertName={selectedPayment.expertName}
          upiId={selectedPayment.upiId}
          cardLast4={selectedPayment.cardLast4Digits}
          onClose={() => setSelectedPayment(null)}
          onDownload={() => handleDownload(selectedPayment)}
        />
      )}
    </>
  );
};

export default PaymentHistoryTab;
