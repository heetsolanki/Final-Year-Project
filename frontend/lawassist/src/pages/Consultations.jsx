import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const endpoint =
          role === "legalExpert"
            ? "/api/consultations/expert"
            : "/api/consultations/user";

        const res = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConsultations(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchConsultations();
  }, [role, token]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Consultations
        </h1>

        <div className="bg-white rounded-xl shadow-md divide-y">
          {consultations.map((c) => (
            <div
              key={c.consultationId}
              onClick={() => navigate(`/chat/${c.consultationId}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Consultation {c.consultationId}
                </p>
                <p className="text-sm text-gray-500">{c.status}</p>
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
      </div>

      <Footer />
    </>
  );
};

export default Consultations;