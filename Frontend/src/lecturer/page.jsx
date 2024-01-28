import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Default from "./components/default";

const Lecturer = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname == "/lecturer/login" ||
      location.pathname == "/lecturer/login/" ||
      location.pathname == "/lecturer/signUp" ||
      location.pathname == "/lecturer/signUp/" ? (
        <Outlet />
      ) : (
        <Default Outlet={Outlet} />
      )}
    </>
  );
};

export default Lecturer;
