import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">My Tasks</Link>
        </div>

        <div className="space-x-4">
          <Link
            to="/"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 01
          </Link>
          <Link
            to="/liveUsers"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 02
          </Link>
          <Link
            to="/task03"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 03
          </Link>
          <Link
            to="/task04"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 04
          </Link>
          <Link
            to="/task05"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 05
          </Link>
          <Link
            to="/task06"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 06
          </Link>
          <Link
            to="/task07"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Task 07
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
