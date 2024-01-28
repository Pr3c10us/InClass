import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import axios from "axios";
import toast from "react-hot-toast";


const LecturerCourseView = () => {
  const location = useLocation();
  const courseId = location.pathname.split("/")[3];
  const [course, setCourse] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const lecturer = useSelector((state) => state.redux.lecturer);
  const navigate = useNavigate();

  const handleEffect = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}course/${courseId}`,
      );
      setCourse(response.data.course);
      const attendance = response.data.course.attendance;
      let newAttendance = attendance.map((att, i) => {
        const date = new Date(att.createdAt);

        return {
          ...att,
          date: date.toLocaleString(),
          signed: att?.students.length,
        };
      });
      setAttendance(newAttendance);
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

  const handleStartAttendance = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}attendance`,
        {
          courseId: courseId,
        },
      );
      toast.success(response.data.msg || "attendance started successfully");
      navigate(`/lecturer/attendance/${response.data.attendance._id}`);
    } catch (error) {
      console.log(error);

      if (error.response) {
        const errorMsg = error.response.data.msg;
        toast.error(errorMsg);
      }
    }
  };
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
            {/* <div className="flex flex-col gap-x-4 md:flex-row">
              <h3 className="">Course Lecturer:</h3>
              <p className="text-lg font-medium">{course.lecturer.name}</p>
            </div> */}
            <div className="flex flex-col gap-x-4 md:flex-row">
              <h3 className="">Course Description:</h3>
              <p className="text-sm font-medium">{course.description}</p>
            </div>
          </article>
          <div className="my-4 flex h-max items-center gap-4">
            <h1 className="text-lg font-medium underline lg:col-span-2">
              Your Attendance
            </h1>
            <button
              onClick={handleStartAttendance}
              className="rounded border border-black px-4 py-1 transition-all duration-200 hover:border-primary hover:text-primary"
            >
              Start New Attendance
            </button>
          </div>
          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            {attendance.map((att) => {
              return (
                <Link
                  to={`/lecturer/attendance/${att._id}`}
                  className="flex justify-between rounded border px-4 py-4 text-base transition-all duration-200 hover:border-accent "
                >
                  <h3 className="flex capitalize leading-tight">
                    <span className="mr-1 text-base font-medium capitalize leading-tight ">
                      {att.date}
                    </span>
                  </h3>
                  <h3 className="flex capitalize leading-tight">
                    <span
                      className={`text-sm  capitalize ${att.signed ? "text-green-500" : "text-red-500"}`}
                    >
                      {att.signed}
                    </span>
                  </h3>
                </Link>
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

export default LecturerCourseView;
