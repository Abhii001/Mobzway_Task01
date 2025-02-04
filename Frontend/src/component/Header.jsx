import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">TASKS</Link>
        </div>

        <div className="space-x-4 flex items-center">
          <Link
            to="/liveUsers"
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200 flex items-center"
          >
            Live
            <span className="ml-2 w-3 h-3 rounded-full animate-blink"></span>
          </Link>
          <style>
            {`
              .animate-blink {
                background-color: red;
                animation: blink 5s infinite alternate;
              }

              @keyframes blink {
                0% {
                  background-color: red;
                }
                50% {
                  background-color: green;
                }
                100% {
                  background-color: red;
                }
              }
            `}
          </style>
        </div>
      </nav>
    </header>
  );
};

export default Header;
