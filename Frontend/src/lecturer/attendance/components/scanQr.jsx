import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
import { QrScanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScanQr = ({ id, setAttendance }) => {
  const [rest, setRest] = useState(false);
  const navigate = useNavigate();
  const mark = async (result) => {
    if (rest) return;
    try {
      setRest(true);
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}attendance/add/${id}`,
        { token: result },
      );
      toast.success(data.msg);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}attendance/${id}`,
      );
      let attendance = response.data.attendance;
      const date = new Date(attendance.createdAt);
      attendance.date = date.toLocaleString();
      setAttendance(attendance);
      setTimeout(() => {
        setRest(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/student/login");
          return toast.error("Unauthorized");
        }
        toast.error(error.response.data.msg);
        setTimeout(() => {
          setRest(false);
        }, 2000);
      }
      setTimeout(() => {
        setRest(false);
      }, 2000);
    }
  };
  return (
    <section className="mb-8 flex w-full items-center justify-center">
      <div className="w-full max-w-sm aspect-square overflow-hidden rounded-lg bg-black">
        {!rest && (
          <QrScanner
            onDecode={(result) => mark(result)}
            onError={(error) => toast.error(error?.message)}
          />
        )}
      </div>
    </section>
  );
};

export default ScanQr;
