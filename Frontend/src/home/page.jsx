import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="flex flex-col justify-center items-center gap-4 min-h-screen">
      <Link to="/lecturer/login" className="bg-primary rounded py-2 text-lg text-white w-full max-w-xs text-center">
        Lecturer{" "}
      </Link>
      <Link to="/student/login" className="border-primary text-primary rounded py-2 text-lg border w-full max-w-xs text-center">
        Student{" "}
      </Link>
    </main>
  );
};

export default Home;
