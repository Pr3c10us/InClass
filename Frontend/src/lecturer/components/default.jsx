import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLecturer } from "../../../redux/redux";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Default = ({ Outlet }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = React.useState(false);
  const lecturer = useSelector((state) => state.redux.lecturer);

  const typeRef = useRef(null);
  // Sample transaction data
  const handleEffectRef = async () => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  };
  useEffect(() => {
    handleEffectRef();
  }, [typeRef]);

  const handleEffect = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}profile/lecturer`,
      );
      dispatch(setLecturer(response.data.lecturer));
      // send error if no user
      if (!response.data) {
        navigate("/lecturer/login");
      }
      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/lecturer/login");
          return toast.error("Unauthorized");
        }
        toast.error(error.response.data.msg);
        navigate("/lecturer/login");
        setLoading(false);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    handleEffect();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}auth/student/logout`,
      );
      navigate("/lecturer/login");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.msg);
      }
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <AnimatePresence>
          <main className="flex h-screen">
            <div className="relative flex h-full w-full flex-col px-4">
              <div className="flex justify-between items-center">
                <Link
                  to={"/"}
                  className="flex h-[10vh] w-max items-center justify-end text-lg font-semibold capitalize text-primary md:text-xl"
                >
                  <img
                    src="/logo.svg"
                    alt="logo"
                    className="aspect-square w-6 md:w-8"
                  />
                  <span>InClass</span>
                </Link>
                <div
                  ref={typeRef}
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                  className="relative flex items-center gap-1 h-max text-sm md:text-base cursor-pointer"
                >
                  <div className="flex aspect-square w-8 items-center justify-center rounded-full bg-accent">
                    <img
                      src={"/icons/profile.svg"}
                      className="aspect-square w-4"
                      alt="profile icon"
                    />
                  </div>
                  <h1 className="font-medium">{lecturer.name.split(" ")[0]}</h1>
                  <h1 className="font-medium">{lecturer.name.split(" ")[1]}</h1>
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        key={`menu`}
                        className="absolute top-[120%] z-50 w-full rounded-lg bg-background "
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Link
                          to={`/lecturer/dashboard`}
                          className="flex cursor-pointer items-center gap-2 px-3 py-2"
                        >
                          <img
                            src="/icons/home.svg"
                            alt="home icon"
                            className="aspect-square w-6"
                          />
                          <span>Home</span>
                        </Link>
                        <div
                          onClick={handleLogout}
                          className="flex cursor-pointer items-center gap-2 px-3 py-2"
                        >
                          <img
                            src="/icons/door.svg"
                            alt="door icon"
                            className="aspect-square w-6"
                          />{" "}
                          Logout{" "}
                        </div>
                      </motion.div>
                    )}{" "}
                  </AnimatePresence>
                </div>
              </div>
              <Outlet />
            </div>
          </main>
        </AnimatePresence>
      )}
    </>
  );
};

export default Default;
