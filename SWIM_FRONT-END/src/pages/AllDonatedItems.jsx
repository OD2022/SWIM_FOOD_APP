import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/AuthContext";

const AllDonatedItems = () => {
  const { user } = useAuth();
  const [donatedItems, setDonatedItems] = useState([]);
  const navigate = useNavigate();

  const donorId = user.userId;
  useEffect(() => {
    const fetchDonatedItems = async () => {
      try {
        const response = await fetch(
          `https://swimfoodapp.uc.r.appspot.com/donor_get_all_food_requests`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ donorId }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data.allFoodRequests)) {
          setDonatedItems(data.allFoodRequests);
        } else {
          console.error("API response is not an array:", data);
          setDonatedItems([]);
        }
      } catch (error) {
        console.error("Error fetching donated items:", error);
        toast.error("Failed to fetch donated items");
      }
    };

    fetchDonatedItems();
  }, [donorId]);

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://swimfoodapp.uc.r.appspot.com/delete_food_posting/${itemId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Item deleted successfully, remove it from the UI
          setDonatedItems(donatedItems.filter((item) => item._id !== itemId));
          toast.success("Item deleted successfully");
        } else {
          // Handle HTTP error
          toast.error("Failed to delete item");
        }
      } catch (error) {
        // Handle other errors
        console.error("Error deleting item:", error);
        toast.error("An error occurred while deleting the item");
      }
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
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#228b22]">
          Your Donated Items
        </h2>
        <ul>
          {donatedItems.map((item) => (
            <li key={item._id} className="mb-4">
              <Link to={`/food/${item._id}`}>
                <p className="text-gray-600 mb-1">
                  <strong>Item Name:</strong> {item.item_name}
                </p>
              </Link>
              <p>
                <strong>Category:</strong> {item.item_category}
              </p>
              <p>
                <strong>Quantity:</strong> {item.item_quantity}
              </p>
              <p>
                <strong>Description:</strong> {item.description}
              </p>
              <p>
                <strong>Location:</strong> {item.item_location}
              </p>
              <p>
                <strong>Image:</strong> <br />
                <img src={item.image_url} alt="Item" className="max-w-xs" />
              </p>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllDonatedItems;
