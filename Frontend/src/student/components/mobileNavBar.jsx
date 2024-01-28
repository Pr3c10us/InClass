import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuSlide } from "../../components/anim";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MobileNavBar = ({ hideMenu, setHideMenu }) => {
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
    <AnimatePresence mode="wait">
      {!hideMenu && (
        <>
          <motion.nav
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed left-0 z-[100] flex h-screen w-3/5 flex-col gap-y-16 bg-background px-4 pb-4  pt-[10vh] shadow"
          >
            <div
              onClick={() => {
                setHideMenu(true);
              }}
              className="absolute right-4 top-4 aspect-square w-6"
            >
              <img
                src="/icons/times.svg"
                alt="times icon"
                className="aspect-square w-6"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
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
              <Link
                onClick={() => setHideMenu(true)}
                to={`/student/home`}
                className="flex items-center gap-2"
              >
                <img
                  src="/icons/home.svg"
                  alt="home icon"
                  className="aspect-square w-5"
                />
                <span>Home</span>
              </Link>
              <Link
                onClick={() => setHideMenu(true)}
                to={`/student/courses`}
                className="flex items-center gap-2"
              >
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
          </motion.nav>
          <div
            className="fixed inset-0 z-[90] md:hidden"
            onClick={() => setHideMenu(true)}
          ></div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavBar;
