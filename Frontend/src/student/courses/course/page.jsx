import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../../components/loading";
import axios from "axios";
import { useSelector } from "react-redux";

const StudentCourseView = () => {
  const location = useLocation();
  const courseId = location.pathname.split("/")[3];
  const [course, setCourse] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const student = useSelector((state) => state.redux.student);

  const handleEffect = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}course/${courseId}`,
      );
      setCourse(response.data.course);
      const attendance = response.data.course.attendance;
      console.log(attendance);
      let newAttendance = attendance.map((att, i) => {
        const signed = att?.students.find((s) => s === student._id);
        console.log(att);
        const date = new Date(att.createdAt);
        console.log(date.toLocaleString());
        if (signed) {
          return { date: date.toLocaleString(), signed: true };
        } else {
          return {
            date: date.toLocaleString(),
            signed: false,
          };
        }
      });
      setAttendance(newAttendance);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/student/login");
          return toast.error("Unauthorized");
        }
        toast.error(error.response.data.msg);
        navigate("/student/home");
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
          <article className="flex flex-col gap-2">
            <h1 className="text-xl font-medium capitalize md:mb-4 md:text-3xl">
              {course.title}
            </h1>
            <div className="flex flex-col gap-x-4 md:flex-row">
              <h3 className="">Course Code:</h3>
              <p className="text-lg font-medium">{course.courseCode}</p>
            </div>
            <div className="flex flex-col gap-x-4 md:flex-row">
              <h3 className="">Course Lecturer:</h3>
              <p className="text-lg font-medium">{course.lecturer.name}</p>
            </div>
            <div className="flex flex-col gap-x-4 md:flex-row">
              <h3 className="">Course Description:</h3>
              <p className="text-sm font-medium">{course.description}</p>
            </div>
          </article>
          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <h1 className="text-lg font-medium underline lg:col-span-2">
              Your Attendance
            </h1>
            {attendance.map((att) => {
              return (
                <div className="flex justify-between rounded border px-4 py-4 text-base ">
                  <h3 className="flex capitalize leading-tight">
                    <span className="mr-1 text-base font-medium capitalize leading-tight ">
                      {att.date}
                    </span>
                  </h3>
                  <h3 className="flex capitalize leading-tight">
                    <span
                      className={`text-sm  capitalize ${att.signed ? "text-green-500" : "text-red-500"}`}
                    >
                      {att.signed ? "Signed" : "Not Signed"}
                    </span>
                  </h3>
                </div>
              );
            })}
            {attendance.length === 0 && (
              <h1 className="text-lg lg:col-span-2">
                No attendance has been taken yet
              </h1>
            )}
          </section>
        </main>
      )}
    </>
  );
};

export default StudentCourseView;
