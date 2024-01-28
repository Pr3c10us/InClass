import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Loading from "../../components/loading";
import ScanQr from "./components/scanQr";

const LecturerAttendance = () => {
  const location = useLocation();
  const attendanceId = location.pathname.split("/")[3];
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const handleEffect = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}attendance/${attendanceId}`,
      );
      let attendance = response.data.attendance;
      const date = new Date(attendance.createdAt);
      attendance.date = date.toLocaleString();
      setAttendance(attendance);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/lecturer/login");
          return toast.error("Unauthorized");
        }
        toast.error(error.response.data.msg);
        navigate("/lecturer/home");
        setLoading(false);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEffect();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <ScanQr setAttendance={setAttendance} id={attendance._id} />
          <article className="mb-2 flex flex-col gap-2">
            <h2 className="capitalize md:text-xl">
              Time Started -{" "}
              <span className="text-xl font-medium md:text-3xl">
                {attendance.date}
              </span>
            </h2>
            <h3 className="text-sm md:text-lg">
              Attendance Code -{" "}
              <span className="text-lg font-medium md:text-2xl">
                {attendance.code}
              </span>
            </h3>
          </article>
          <section className="mt-4 flex flex-col gap-4">
            <h2 className="capitalize underline md:text-xl">
              Attendance Taken
            </h2>
            <div className="xl grid gap-2 lg:grid-cols-2">
              {attendance.students.map((student) => {
                return (
                  <div className="flex items-center justify-between rounded border px-4 py-2">
                    <p className="text-sm md:text-base">{student.name}</p>
                    <p className="text-sm uppercase md:text-base">
                      {student.matricNumber}
                    </p>
                  </div>
                );
              })}
              {attendance.students.length === 0 && (
                <p className="text-sm md:text-base">
                  No student has signed in yet.
                </p>
              )}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default LecturerAttendance;
