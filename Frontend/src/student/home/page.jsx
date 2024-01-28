import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import toast from "react-hot-toast";
import QR from "./components/qrcode";

const StudentHome = () => {
  const ref = useRef();
  const [token, setToken] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    ref.current.focus();
    return;
  }, []);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      setSubmitting(true);
      axios
        .patch(`${import.meta.env.VITE_BACKEND_URL}attendance/authorize`, {
          code: values.code,
        })
        .then((response) => {
          console.log(response.data);
          setToken(response.data.token);
          setShowQR(true);
        })
        .catch((error) => {
          if (error.response) {
            const errorMsg = error.response.data.msg;
            toast.error(errorMsg);
          }
          setSubmitting(false);
        });
    },

    validationSchema: Yup.object({
      code: Yup.string("Please enter a valid 6 digits attendance code")
        .matches(
          /^[0-9a-zA-Z]{6}$/,
          "Please enter a valid 6 digits attendance code",
        )
        .required("Please provide the attendance code"),
    }),
  });
  return (
    <main>
      {showQR && <QR token={token} setShowQR={setShowQR} />}
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="text-3xl">
            <p>Generate your QR Code</p>
          </div>
          <div className="flex max-w-[500px] flex-col text-sm font-medium text-gray-400">
            <p>{`Enter the 6 digit code for course attendance`}</p>
            <p></p>
          </div>
        </div>
        <div className="mb-4 h-full w-full">
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              className={`xmd:text-4xl h-14 w-full max-w-sm rounded border bg-inherit px-2 py-2 text-center text-3xl tracking-widest transition duration-300 focus:border-2 ${
                formik.errors.code && formik.touched.code
                  ? "border-red-500 focus:border-red-500 focus:outline-none"
                  : "border-gray-300 focus:border-primary focus:outline-none"
              } `}
              type="text"
              onChange={formik.handleChange}
              value={formik.values.code}
              onBlur={formik.handleBlur}
              name="code"
              autoComplete="off"
              maxLength="6"
            />
          </div>
          <p className="flex min-h-[2rem] items-center justify-center text-center text-sm text-red-500">
            {formik.touched.code && formik.errors.code ? (
              <span className="flex items-center gap-1">
                <BsFillExclamationTriangleFill /> {formik.errors.code}
              </span>
            ) : (
              ""
            )}
          </p>
        </div>{" "}
        <div className="flex w-full flex-col items-center justify-center space-y-2">
          <button
            // disabled={formik.isSubmitting || showQR}
            type="submit"
            className="flex w-full max-w-[16rem] items-center justify-center rounded bg-primary py-2 text-base text-white focus:outline-none"
          >
            Generate
          </button>
        </div>
      </form>
    </main>
  );
};

export default StudentHome;
