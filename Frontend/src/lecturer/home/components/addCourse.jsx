import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "./input";

const AddCourse = ({ setAdd }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      courseCode: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const { title, courseCode, description } = values;
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}course`,
          {
            title,
            courseCode,
            description,
          },
        );

        toast.success(response.data.msg || "course created successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);

        if (error.response) {
          const errorMsg = error.response.data.msg;
          toast.error(errorMsg);
        }
      }
    },

    validationSchema: Yup.object({
      title: Yup.string().required(" "),
      courseCode: Yup.string().required(" "),
      description: Yup.string().required(" "),
    }),
  });
  return (
    <section className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 z-10 backdrop-blur-lg"
        onClick={() => {
          setAdd(false);
        }}
      />
      <form
        onSubmit={formik.handleSubmit}
        className="z-20  w-full max-w-2xl space-y-4 rounded-lg border-2 bg-white p-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Add Course</h1>
          <div
            onClick={() => {
              setAdd(false);
            }}
            className="  aspect-square w-6 cursor-pointer"
          >
            <img
              src="/icons/times.svg"
              alt="times icon"
              className="aspect-square w-6"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            inputFor={`title`}
            touched={formik.touched.title}
            error={formik.errors.title}
            handleChange={formik.handleChange}
            values={formik.values.title}
            handleBlur={formik.handleBlur}
            placeholder={"Title of course"}
          />
          <Input
            inputFor={`courseCode`}
            touched={formik.touched.courseCode}
            error={formik.errors.courseCode}
            handleChange={formik.handleChange}
            values={formik.values.courseCode}
            handleBlur={formik.handleBlur}
            placeholder={"Course Code - AAA 000"}
          />
          <Input
            inputFor={`description`}
            touched={formik.touched.description}
            error={formik.errors.description}
            handleChange={formik.handleChange}
            values={formik.values.description}
            handleBlur={formik.handleBlur}
            placeholder={"Course description"}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full rounded bg-primary py-2 text-white"
          >
            Add Course
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddCourse;
