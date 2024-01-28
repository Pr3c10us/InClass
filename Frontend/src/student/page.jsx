import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Default from "./components/default";

const Student = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname == "/student/login" ||
      location.pathname == "/student/login/" ||
      location.pathname == "/student/signUp" ||
      location.pathname == "/student/signUp/" ? (
        <Outlet />
      ) : (
        <Default Outlet={Outlet} />
      )}
    </>
  );
};

export default Student;
