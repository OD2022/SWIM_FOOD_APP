import React, { useState, useEffect } from "react";
import Header from "./Header";
//parent component
const User = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch userId from backend API
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      // Make API call to fetch userId
      const response = await fetch("http://localhost/api/user.php");
      if (!response.ok) {
        throw new Error("Failed to fetch userId");
      }
      const data = await response.json();
      console.log("Fetched userId:", data.userId); // Log the userId value
      setUserId(data.userId);
    } catch (error) {
      console.error("Error fetching userId:", error);
    }
  };

  return (
    <div>
      {/* Pass userId as a prop to Header component */}
      <Header userId={userId} />
      {/* Other components and content */}
    </div>
  );
};

export default User;
