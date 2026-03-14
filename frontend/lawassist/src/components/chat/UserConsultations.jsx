import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const UserConsultations = () => {
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
    <div className="bg-white rounded-2xl shadow-sm p-6 transition hover:shadow-lg">
      <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
        <MessageCircle size={18} />
        My Consultations
      </h3>

      {consultations.length === 0 ? (
        <p className="text-sm text-gray-500">
          You haven't started any consultations yet.
        </p>
      ) : (
        <div className="space-y-3">
          {consultations.map((c) => (
            <div
              key={c.consultationId}
              onClick={() => navigate(`/chat/${c.consultationId}`)}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">
                  Consultation {c.consultationId}
                </p>

                <p className="text-xs text-gray-500">
                  Started {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  c.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserConsultations;
