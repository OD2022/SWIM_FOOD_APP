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
        top: 30,
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
            <button
              onClick={() => setShowModal(true)}
              className="transition duration-200 bg-green-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block mt-4"
            >
              Make a Request
            </button>
            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                <h2 className="text-2xl font-semibold mb-4">Request Food</h2>
                <h3 className="text-lg font-semibold mb-4">
                  <span className="block text-[#008000]">
                    Donor Pickup Start Time:{" "}
                  </span>
                  {foodItem.pick_up_start_time}
                </h3>
                <h3 className="text-lg font-semibold mb-4">
                  <span className="block text-[#008000]">
                    Donor Pickup End Time :{" "}
                  </span>
                  {foodItem.pick_up_end_time}
                </h3>

                <form onSubmit={handleSubmit}>
                  {/* <label className="block mb-2">
                    Preferred Pickup Time:
                    <input
                      type="text"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="form-input mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter preferred pickup time"
                      required
                    />
                  </label> */}
                  <div className="mb-4">
                    <label htmlFor="startTime" className="block text-[#008000]">
                      Preferred Pickup Time:
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      placeholder="Select pickup start time"
                      className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="transition duration-200 bg-green-600 hover:bg-green-600 focus:bg-green-600focus:shadow-sm focus:ring-4 focus:ring-bg-green-600 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                  >
                    Submit Request
                  </button>
                </form>
              </Modal>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FoodItemDetails;
