import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./navBar";
import { useDispatch, useSelector } from "react-redux";
import { setStudent } from "../../../redux/redux";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import { Link, useNavigate } from "react-router-dom";
import MobileNavBar from "./mobileNavBar";
import { AnimatePresence } from "framer-motion";

const Default = ({ Outlet }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hideMenu, setHideMenu] = useState(true);

  const handleEffect = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}profile/student`,
      );
      dispatch(setStudent(response.data.student));
      // send error if no user
      if (!response.data) {
        navigate("/student/login");
      }
      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/student/login");
          return toast.error("Unauthorized");
        }
        toast.error(error.response.data.msg);
        navigate("/student/login");
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
        <AnimatePresence>
          <main className="flex h-screen">
            {/* <NavBar /> */}
            <MobileNavBar hideMenu={hideMenu} setHideMenu={setHideMenu} />
            <div className="relative flex h-full w-full flex-col overflow-y-scroll px-4">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setHideMenu(!hideMenu);
                  }}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/icons/menu.svg"
                    alt="menu icon"
                    className="aspect-square w-5"
                  />
                </button>
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
