import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "./input";

const Students = ({
  setViewStudent,
  students,
  code,
  id,
  setAttendance,
  setCourse,
}) => {
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      studentMatric: "",
    },
    onSubmit: async (values) => {
      try {
        const { studentMatric } = values;
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}course/${id}/student`,
          {
            studentMatric,
          },
        );

        toast.success(response.data.msg || "student added successfully");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}course/${id}`,
        );
        setCourse(res.data.course);
        const attendance = res.data.course.attendance;
        let newAttendance = attendance.map((att, i) => {
          const date = new Date(att.createdAt);

          return {
            ...att,
            date: date.toLocaleString(),
            signed: att?.students.length,
          };
        });
        setAttendance(newAttendance);
      } catch (error) {
        console.log(error);

        if (error.response) {
          const errorMsg = error.response.data.msg;
          toast.error(errorMsg);
        }
      }
    },

    validationSchema: Yup.object({
      studentMatric: Yup.string().required(" "),
    }),
  });

  const handleDelete = async (studentMatric) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}course/${id}/student`,
        {
          data: {
            studentMatric,
          },
        },
      );
      toast.success(response.data.msg || "student removed successfully");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}course/${id}`,
      );
      setCourse(res.data.course);
      const attendance = res.data.course.attendance;
      let newAttendance = attendance.map((att, i) => {
        const date = new Date(att.createdAt);

        return {
          ...att,
          date: date.toLocaleString(),
          signed: att?.students.length,
        };
      });
      setAttendance(newAttendance);
    } catch (error) {
      console.log(error);

      if (error.response) {
        const errorMsg = error.response.data.msg;
        toast.error(errorMsg);
      }
    }
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const text = await file.text();
      const lines = text.split("\n");
      const studentMatrics = lines.filter((line) => {
        console.log(line);
        return line;
      });
      const newStudentMatrics = studentMatrics.map((item) => item.trim());

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}course/${id}/students`,
        {
          studentMatrics: newStudentMatrics,
        },
      );
      toast.success(response.data.msg || "students added successfully");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}course/${id}`,
      );
      setCourse(res.data.course);
      const attendance = res.data.course.attendance;
      let newAttendance = attendance.map((att, i) => {
        const date = new Date(att.createdAt);

        return {
          ...att,
          date: date.toLocaleString(),
          signed: att?.students.length,
        };
      });
      setAttendance(newAttendance);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        const errorMsg = error.response.data.msg;
        toast.error(errorMsg);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };
  return (
    <section className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 z-10 backdrop-blur-lg"
        onClick={() => {
          setViewStudent(false);
        }}
      />
      <form
        onSubmit={formik.handleSubmit}
        className="z-20  mx-4 max-h-[80vh] w-full max-w-5xl space-y-4 overflow-auto rounded-lg border-2 bg-white p-4"
      >
        <article className="text-sm md:text-base">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-medium md:text-xl">Students</h1>
            <div
              onClick={() => {
                setViewStudent(false);
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

          <p>
            Heres a list of all student that have been registered to{" "}
            <span className="font-medium">{code}</span>
            {". "}
          </p>
        </article>
        <div className="flex flex-col-reverse">
          <label className="text-xs">
            Upload a CSV file of student matric numbers
          </label>
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </div>
        <p>or</p>
        <div className="flex items-end gap-4">
          <Input
            inputFor={`studentMatric`}
            touched={formik.touched.studentMatric}
            error={formik.errors.studentMatric}
            handleChange={formik.handleChange}
            values={formik.values.studentMatric}
            handleBlur={formik.handleBlur}
            placeholder={"Students Matric number"}
          />
          <div>
            <button
              type="submit"
              className="mb-1 flex w-full items-center gap-1 rounded bg-primary px-4 py-3 text-xs text-white md:text-sm"
            >
              Add <span className="hidden md:block ">Student</span>
            </button>
          </div>
        </div>
        <div>
          <div className="mb-2 flex justify-between border-b pb-2 text-sm font-medium md:text-base">
            <p className="w-full">Full Name</p>
            <p className="w-full text-end md:text-start">Matric Number</p>
            <p className="hidden w-full md:block">Email</p>
            <button className="ml-2 aspect-square w-8 md:w-12"></button>
          </div>
          {students.map((student) => {
            return (
              <div className="flex justify-between text-sm md:text-base">
                <p className="w-full">
                  {student.name.length > 20
                    ? `${student.name.slice(0, 20)}...`
                    : student.name}
                </p>
                <p className="w-full text-end uppercase md:text-start">
                  {student.matricNumber}
                </p>
                <p className="hidden w-full md:block">
                  {student.email.length > 26
                    ? `${student.email.slice(0, 26)}...`
                    : student.email}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // ask user to confirm with alert before running handleDelete
                    const confirm = window.confirm(
                      "Are you sure you want to remove this student?",
                    );

                    if (confirm) {
                      handleDelete(student.matricNumber);
                    }

                    return;
                  }}
                  className="ml-2 aspect-square w-8 md:w-12"
                >
                  <img
                    src="/icons/minus.svg"
                    alt="minus icon"
                    className="aspect-square w-full"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </form>
    </section>
  );
};

export default Students;
