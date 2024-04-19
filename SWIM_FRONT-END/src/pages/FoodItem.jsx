import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../hooks/Modal";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { toast } from "react-toastify";

const FoodItemDetails = () => {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const requesterId = user.userId;

  useEffect(() => {
    fetchFoodItem(id);
  }, [id]);

  const fetchFoodItem = async (id) => {
    try {
      const response = await fetch(
        `https://swimfoodapp.uc.r.appspot.com/get_food/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch food item details");
      }
      const data = await response.json();
      setFoodItem(data.foodPosting);
    } catch (error) {
      console.error("Error fetching food item details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://swimfoodapp.uc.r.appspot.com/request_food",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requester_id: requesterId,
            food_id: foodItem._id,
            donor_id: foodItem.donor_id,
            proposed_pick_up_time: pickupTime,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to make food request");
      }

      setShowModal(false);

      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === "Request submitted successfully") {
        navigate("/receive");
        toast.success("Failed Request Submission");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error making food request:", error);
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
      {foodItem ? (
        <>
          <div>
            <h2 className="text-3xl font-semibold mb-4">
              {foodItem.item_name} Details
            </h2>
            <div className="border p-4 rounded-lg shadow-md">
              <img
                src={foodItem.image_url}
                alt={foodItem.item_name}
                className="h-64 object-cover mb-4"
              />
              <p className="text-lg font-semibold mb-2 text-[#228B22]">
                Description:
              </p>
              <p className="text-gray-700 mb-4 ">{foodItem.description}</p>
              <p className="text-lg font-semibold mb-2 text-[#228B22] ">
                Quantity:
              </p>
              <p className="text-gray-700 mb-4">{foodItem.item_quantity}</p>
              <p className="text-lg font-semibold mb-2 text-[#228B22] ">
                Location:
              </p>
            </div>
        
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FoodItemDetails;
