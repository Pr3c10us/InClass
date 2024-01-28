import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const student = useSelector((state) => state.redux.student);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}auth/student/logout`,
      );
      navigate("/student/login");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <nav className="hidden h-full basis-[20%] flex-col gap-y-16 bg-background px-4 pb-4 pt-[10vh]  shadow md:flex">
      <div className="flex gap-2">
        <div className="flex aspect-square w-10 h-10 items-center justify-center rounded-full bg-accent text-white">
          {student.name[0] || ` `}
        </div>
        <div className="">
          <h3 className="text-base font-medium">
            {student.name || `loading...`} 
          </h3>
          <h3 className="text-xs uppercase">
            {student.matricNumber || `loading...`}
          </h3>
        </div>
      </div>
      <div className="space-y-4 font-medium">
        <Link to={`/student/home`} className="flex items-center gap-2">
          <img
            src="/icons/home.svg"
            alt="home icon"
            className="aspect-square w-5"
          />
          <span>Home</span>
        </Link>
        <Link to={`/student/courses`} className="flex items-center gap-2">
          <img
            src="/icons/form.svg"
            alt="form icon"
            className="aspect-square w-5"
          />
          <span>Courses</span>
        </Link>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-medium"
        >
          <img
            src="/icons/door.svg"
            alt="door icon"
            className="aspect-square w-5"
          />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
