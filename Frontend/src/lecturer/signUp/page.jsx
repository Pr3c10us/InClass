import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Input from "./components/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const LecturerSignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        const { fullName: name, matricNumber, email, password } = values;
        console.log("object");
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}auth/lecturer/register`,
          {
            name,
            email,
            password,
          },
        );

        toast.success(response.data.msg || "Account created successfully");

        setTimeout(() => {
          navigate(`/lecturer/login`);
        }, 3000);
      } catch (error) {
        console.log(error);

        if (error.response) {
          const errorMsg = error.response.data.msg;
          toast.error(errorMsg);
        }
      }
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required(" "),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1}).*$/,
          "use 8+ chars, mix of letters, numbers & symbols",
        )
        .required(" "),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required(" "),
    }),
  });
  return (
    <main className="flex flex-col items-center gap-12 p-6 pt-[10vh]">
      <section className="flex w-full flex-col items-center gap-4">
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
        <h1 className="text-xl font-medium">Create your Lecturer account</h1>
      </section>
      <form
        onSubmit={formik.handleSubmit}
        className="grid w-full max-w-2xl gap-4 md:grid-cols-2"
      >
        <Input
          inputFor={`fullName`}
          touched={formik.touched.name}
          error={formik.errors.name}
          handleChange={formik.handleChange}
          values={formik.values.name}
          handleBlur={formik.handleBlur}
          placeholder={"Full Name"}
        />
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
        <Input
          inputFor={`confirmPassword`}
          touched={formik.touched.confirmPassword}
          error={formik.errors.confirmPassword}
          handleChange={formik.handleChange}
          values={formik.values.confirmPassword}
          handleBlur={formik.handleBlur}
          placeholder={"Confirm Password"}
        />

        <div className=" mt-6 flex flex-col  items-center md:col-span-2">
          <button
            type="submit"
            disabled={!formik.isValid}
            className="w-1/2 rounded bg-primary py-2 text-white"
          >
            Sign Up
          </button>
          <Link to={"/lecturer/login"} className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <span className="font-semibold text-primary">Login</span>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default LecturerSignUp;
