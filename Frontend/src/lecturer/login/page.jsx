import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Input from "./components/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const LecturerLogin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        console.log("object");
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}auth/lecturer/login`,
          {
            email,
            password,
          },
        );

        toast.success(response.data.msg || "Login successful");

        setTimeout(() => {
          navigate(`/lecturer/dashboard`);
        }, 3000);
      } catch (error) {
        console.log(error);

        if (error.response) {
          const errorMsg = error.response.data.msg;
          toast.error(errorMsg);
        }
      }
    },
  });
  return (
    <main className="flex flex-col items-center gap-12 p-6 pt-[10vh]">
      <section className="flex w-full flex-col gap-4 md:items-center">
        <Link
          to={"/"}
          className="flex items-center text-4xl font-semibold capitalize text-primary md:text-6xl"
        >
          <img
            src="/logo.svg"
            alt="logo"
            className="aspect-square w-14 md:w-20"
          />
          <span>InClass</span>
        </Link>
        <h1 className="text-lg font-medium">Login to your Lecturer account</h1>
      </section>
      <form
        onSubmit={formik.handleSubmit}
        className="grid w-full max-w-sm gap-4"
      >
        <Input
          inputFor={`email`}
          touched={formik.touched.email}
          error={formik.errors.email}
          handleChange={formik.handleChange}
          values={formik.values.email}
          handleBlur={formik.handleBlur}
          placeholder={"Email"}
        />
        <Input
          inputFor={`password`}
          touched={formik.touched.password}
          error={formik.errors.password}
          handleChange={formik.handleChange}
          values={formik.values.password}
          handleBlur={formik.handleBlur}
          placeholder={"Password"}
        />

        <div className=" mt-6 flex flex-col  items-center">
          <button
            type="submit"
            disabled={!formik.isValid}
            className="w-full rounded bg-primary py-2 text-white md:w-2/3"
          >
            Login
          </button>
          <Link to={"/lecturer/signUp"} className="mt-2 text-center text-sm">
            Don't have an account?{" "}
            <span className="font-semibold text-primary">SignUp</span>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default LecturerLogin;
