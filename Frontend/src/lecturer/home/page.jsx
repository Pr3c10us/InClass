import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AddCourse from "./components/addCourse";
import axios from "axios";
import toast from "react-hot-toast";


const LecturerHome = () => {
  const lecturer = useSelector((state) => state.redux.lecturer);
  const [add, setAdd] = useState(false);
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}course/${id}`,
      );
      toast.success(response.data.msg || "course deleted successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);

      if (error.response) {
        const errorMsg = error.response.data.msg;
        toast.error(errorMsg);
      }
    }
  };

  return (
    <main className="py- space-y-8">
      <article>
        <h1 className="mb-1 text-3xl font-medium">Courses</h1>
        <p>Here is a list of all the courses you have created.</p>
      </article>
      <section className="grid gap-4 xl:grid-cols-2">
        {lecturer?.courses.map((course) => {
          return (
            <div className="flex flex-col md:flex-row gap-y-4 items-center justify-between rounded border px-4 py-2 text-sm md:text-base ">
              <div className="flex w-full flex-col justify-between md:text-base ">
                <h3 className="flex capitalize leading-tight">
                  {/* <span className="mt-1 max-w-28 basis-[25%]">
                    Course Title:{" "}
                  </span> */}
                  <div className="m-0 basis-[75% p-0">
                    <span className="mr-1 text-base font-bold capitalize leading-tight ">
                      {course.title || `loading...`}
                    </span>
                  </div>
                </h3>
                <h3 className="flex capitalize leading-tight">
                  {/* <span className="max-w-28 basis-[25%]">Course code: </span> */}
                  <span className="basis-[75% text-base font-medium capitalize">
                    {course.courseCode || `loading...`}
                  </span>
                </h3>
              </div>
              <div className=" flex w-full items-center justify-end gap-2">
                <button
                  onClick={() => {
                    // ask user to confirm with alert before running handleDelete
                    const confirm = window.confirm(
                      "Are you sure you want to delete this course?",
                    );

                    if (confirm) {
                      handleDelete(course._id);
                    }

                    return;
                  }}
                  className="rounded border border-red-500 px-4 py-1.5 font-medium text-red-500"
                >
                  Delete
                </button>
                <Link
                  to={`/lecturer/course/${course._id}`}
                  className="rounded border border-black px-4 py-1.5 font-medium"
                >
                  view
                </Link>
              </div>
            </div>
          );
        })}
      </section>
      {lecturer?.courses.length == 0 && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-sm font-medium">
            You have not added any course yet
          </span>
        </div>
      )}
      <section>
        {add ? (
          <AddCourse setAdd={setAdd} />
        ) : (
          <section
            onClick={() => {
              setAdd(!add);
            }}
            className="absolute bottom-4 right-4 cursor-pointer rounded-full bg-accent p-4 shadow-lg"
          >
            <img
              src="/icons/timesWhite.svg"
              alt="time icon"
              className="rotate-45"
            />
          </section>
        )}
      </section>
    </main>
  );
};

export default LecturerHome;
