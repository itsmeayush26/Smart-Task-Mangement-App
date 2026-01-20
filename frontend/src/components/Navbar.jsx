import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav className="bg-blue-600 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LEFT  */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white hover:text-gray-200 transition-colors duration-200">
              TaskManager
            </span>
            
          </Link>

          {/* RIGHT – DESKTOP normal for large screen si */}
          <div className="hidden md:flex justify-center items-center gap-6">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200
              bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md
              hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Dashboard</span>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200
              bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md
              hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Analytics</span>
              </div>
            </Link>

            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-8 gap-4 mx-4 px-4">
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.fullName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded font-bold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* MOBILE PROFILE BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE MENU  */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-4 py-4 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-800">{user?.fullName}</span>
          <button onClick={() => setOpen(false)} className="text-xl">
            ×
          </button>
        </div>

        <div className="flex flex-col">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="px-4 py-3 hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link
            to="/analytics"
            onClick={() => setOpen(false)}
            className="px-4 py-3 hover:bg-gray-100"
          >
            Analytics
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-3 text-left text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </nav>
  );
};

export default Navbar;
