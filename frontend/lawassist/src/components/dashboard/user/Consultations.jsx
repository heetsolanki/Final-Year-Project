import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import DashboardCard from "../DashboardCard";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/consultations/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConsultations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConsultations();

    const interval = setInterval(fetchConsultations, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardCard title="My Consultations" icon={MessageCircle}>
      {consultations.length === 0 ? (
        <div className="text-sm text-gray-500">
          You haven't started any consultations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map((c) => (
            <div
              key={c.consultationId}
              onClick={() => navigate(`/chat/${c.consultationId}`)}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer
              hover:bg-gray-50 transition"
            >
              {/* Left side */}
              <div>
                <p className="font-medium text-gray-800">
                  Consultation {c.consultationId}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Started {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Status */}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full
                ${
                  c.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default Consultations;
