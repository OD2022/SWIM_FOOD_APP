// Header.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import { useUserId } from "../hooks/useUserId";
import { useAuth } from "../hooks/AuthContext";




const Header = () =>
{
  const { user } = useAuth();
  // const { userId } = useUserId() || {};
  const userId = user?.userId;
  console.log("Authenticated user:", user);

  useEffect(() => {
    console.log("Header userId:", userId);
  }, [userId]);

  return (
    <header className="bg-[#228B22] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <Link to="/" className="text-xl font-semibold">
        SWIM-Food Climate Solutions
      </Link>
      <nav>
        <ul className="flex space-x-4">
          {userId && ( // Check if userId is not null
            <li>
              <Link to="/donate" className="hover:text-gray-200">
                Donate
              </Link>
            </li>
          )}
          {userId && ( // Check if userId is not null
            <li>
              <Link to="/receive" className="hover:text-gray-200">
                Receive
              </Link>
            </li>
          )}

          <li>
            <Link to="/login" className="hover:text-gray-200">
              login
            </Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-gray-200">
              Register
            </Link>
          </li>

          {userId && ( // Check if userId is not null
            <li>
              <Link to={`/profile/${userId}`} className="hover:text-gray-200">
                Profile
              </Link>
            </li>
          )}

          {userId && (
            <li>
              <Link
                to={`/receiver_get_all_food_requests`}
                className="hover:text-gray-200"
              >
                My Requests
              </Link>
            </li>
          )}

          {userId && (
            <li>
              <Link
                to={`/donor_get_all_food_requests`}
                className="hover:text-gray-200"
              >
                Donated Items
              </Link>
            </li>
          )}

          {userId && (
            <li>
              <Link to="/logout" className="hover:text-gray-200">
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
