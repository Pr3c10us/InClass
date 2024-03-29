import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "../redux/store";
import Home from "./home/page";
import StudentSignUp from "./student/signUp/page";
import StudentLogin from "./student/login/page";
import LecturerSignUp from "./lecturer/signUp/page";
import LecturerLogin from "./lecturer/login/page";
import StudentHome from "./student/home/page";
import Student from "./student/page";
import StudentCourses from "./student/courses/page";
import StudentCourseView from "./student/courses/course/page";
import Lecturer from "./lecturer/page";
import LecturerHome from "./lecturer/home/page";
import LecturerCourseView from "./lecturer/course/page";
import LecturerAttendance from "./lecturer/attendance/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "student",
    element: <Student />,
    children: [
      {
        path: "signUp",
        element: <StudentSignUp />,
      },
      {
        path: "login",
        element: <StudentLogin />,
      },
      {
        path: "home",
        element: <StudentHome />,
      },
      {
        path: "courses",
        element: <StudentCourses />,
        children: [
          {
            path: ":course",
            element: <StudentCourseView />,
          },
        ],
      },
    ],
  },
  {
    path: "lecturer",
    element: <Lecturer />,
    children: [
      {
        path: "signUp",
        element: <LecturerSignUp />,
      },
      {
        path: "login",
        element: <LecturerLogin />,
      },
      {
        path: "dashboard",
        element: <LecturerHome />,
      },
      {
        path: "course/:course",
        element: <LecturerCourseView />,
      },
      {
        path: "attendance/:attendance",
        element: <LecturerAttendance />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
