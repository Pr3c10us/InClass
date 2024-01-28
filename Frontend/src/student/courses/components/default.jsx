import React from "react";
import { Link } from "react-router-dom";

const Default = ({ courses }) => {
  return (
    <main className="space-y-8 md:px-4">
      <article className="space-y-1">
        <h2 className="text-2xl font-medium">Courses</h2>
        <p className="text-xs md:text-base">
          Here is a list of all the courses you have been added to. Click on any
          course to view more details.
        </p>
      </article>
      <section className="grid gap-4 xl:grid-cols-2">
        {courses.map((course) => (
          <Link
            to={`/student/courses/${course._id}`}
            className="flex flex-col justify-between rounded border px-4 py-2 text-sm transition-all duration-200 hover:border-primary active:border-primary md:text-base "
          >
            <h3 className="flex capitalize leading-tight">
              <span className="mt-1 basis-[25%]">Course Title: </span>
              <div className="m-0 basis-[75%] p-0">
                <span className="mr-1 text-base font-bold capitalize leading-tight ">
                  {course.title || `loading...`}
                </span>
                -
                <span className="ml-1 text-xs uppercase md:text-sm">
                  {course.courseCode || `loading...`}
                </span>
              </div>
            </h3>
            <h3 className="flex capitalize leading-tight">
              <span className="basis-[25%]">Lecturer: </span>
              <span className="basis-[75%] text-base font-medium capitalize">
                {course.lecturer.name || `loading...`}
              </span>
            </h3>
          </Link>
        ))}
        {courses.length == 0 && (
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-sm font-medium">You have not been added to any course yet</span>
          </div>
        )}
      </section>
    </main>
  );
};

export default Default;
