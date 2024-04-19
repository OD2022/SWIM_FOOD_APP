import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import { toast } from "react-toastify";
import { useUserId } from "../hooks/useUserId";
import { useAuth } from "../hooks/AuthContext";

const RequestFoodStuff = () => {
  const { userId } = useUserId() || {};
  const { id } = useParams();
  const [contact, setContact] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [location, setLocation] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user.userId;

  useEffect(() => {
    // Fetch start and end times of the food item when the component mounts
    const fetchFoodItemDetails = async () => {
      try {
        const response = await fetch(
          `https://swimfoodapp.uc.r.appspot.com/get_food_item_details.php?food_item_id=${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setStartTime(data.start_time);
          setEndTime(data.end_time);
        } else {
          setError(data.error || "Failed to fetch food item details");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch food item details");
      }
    };

    fetchFoodItemDetails();
  }, [id]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=VITE_APP_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setLocation(address);
        setError(null);
      } else {
        setError(
          "No address found for the provided coordinates. Please enter a location."
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const displayError = (errorMessage) => {
    // Display error message using a modal or a custom alert dialog
    alert(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      displayError(
        "No address found using live location. Type a location instead."
      );
      return;
    }
    try {
      const response = await fetch("http://localhost/api/submit_request.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: userId,
          item_id: id,
          contact,
          preferredTime,
          location,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === "Request submitted successfully") {
        navigate("/profile/uid"); // Pass userId as state
        toast.success("Failed Request Submission");
      } else {
        // Login failed, display error message
        toast.error(data.message || "Login failed");
      }
      // Handle response here (e.g., show success message)
    } catch (error) {
      console.error("Error:", error);
      // Handle error here (e.g., show error message)
    }
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        position: "absolute",
        top: 20,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#AFE1AF",
        padding: "1.5rem",
      }}
    >
      <div>
        <h2>Start Time: {start_time}</h2>
        <h2>End Time: {end_time}</h2>
      </div>
      <div className="border border-gray-300 shadow-sm rounded-md bg-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Request Food Stuff
        </h2>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-gray-700">
              Enter Phone Number
            </label>
            <input
              type="text"
              id="contact"
              placeholder="Enter a callable contact"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="preferredTime" className="block text-gray-700">
              Preferred Pickup Time
            </label>
            <input
              type="time"
              id="preferredTime"
              placeholder="Select preferred pickup time"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700">
              Pickup Location
            </label>
            <div className="flex items-center">
              <Autocomplete
                onLoad={(autocomplete) => {
                  console.log("Autocomplete loaded:", autocomplete);
                  setAutocomplete(autocomplete); // Save autocomplete instance
                }}
                onPlaceChanged={() => {
                  if (autocomplete) {
                    const place = autocomplete.getPlace();
                    console.log("Selected place:", place);
                    // Update the pickup location state with the selected place
                    setLocation(place.formatted_address);
                    setError(null);
                  }
                }}
              >
                <input
                  type="text"
                  id="location"
                  placeholder="Enter pickup location or use current location"
                  className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Autocomplete>
              <button
                className="ml-2 p-2 rounded-full bg-blue-500 text-white"
                onClick={getCurrentLocation}
              >
                📍
              </button>
            </div>
            {/* {error && <p className="text-red-500">{error}</p>} */}
          </div>
          <div className="mb-4 text-center">
            <Link to={`/maps/${id}`} className="text-blue-500">
              Check Distance
            </Link>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestFoodStuff;
