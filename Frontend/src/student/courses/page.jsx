import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Default from "./components/default";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleEffect = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}course/student`,
      );
      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
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
        <>
          {location.pathname == "/student/courses" ||
          location.pathname == "/student/courses/" ? (
            <Default courses={courses} />
          ) : (
            <Outlet />
          )}
        </>
      )}
    </>
  );
};

export default StudentCourses;
