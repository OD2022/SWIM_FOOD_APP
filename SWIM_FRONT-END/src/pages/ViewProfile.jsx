import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import profile from "../photos/profile.jpg";

const ViewProfile = () => {
  const { user } = useAuth();
  const uid = user.userId;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails(uid);
  }, [uid]);

  const fetchUserDetails = async (uid) => {
    try {
      const response = await fetch(
        `https://swimfoodapp.uc.r.appspot.com/user/${uid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();

      // Update the structure to match the response
      const { name, lastname, gender, email } = data.user_profile;

      setUserDetails({ name, lastname, gender, email });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {userDetails ? (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={profile}
            alt="Food Donation"
            className="w-full h-64 object-cover object-center"
          />
          <div className="p-6">
            <h2 className="text-3xl font-semibold mb-4">User Details</h2>
            <div className="border p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold mb-2">First Name:</p>
              <p className="text-gray-700 mb-4">{userDetails.name}</p>
              <p className="text-lg font-semibold mb-2">Last Name:</p>
              <p className="text-gray-700 mb-4">{userDetails.lastname}</p>
              <p className="text-lg font-semibold mb-2">Gender:</p>
              <p className="text-gray-700 mb-4">{userDetails.gender}</p>
              <p className="text-lg font-semibold mb-2">Email:</p>
              <p className="text-gray-700 mb-4">{userDetails.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewProfile;
