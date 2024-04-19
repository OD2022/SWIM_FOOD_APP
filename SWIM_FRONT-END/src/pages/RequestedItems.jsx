import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";

const FoodItemList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const requesterId = user.userId;
  const fileBaseUrl = "http://localhost/api/apis/";
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://swimfoodapp.uc.r.appspot.com/receiver_get_all_food_requests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ requesterId }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.allFoodRequests && Array.isArray(data.allFoodRequests)) {
          const updatedItems = await Promise.all(
            data.allFoodRequests.map(async (item) => {
              const foodResponse = await fetch(
                `https://swimfoodapp.uc.r.appspot.com/get_food/${item.food_id}`
              );
              if (!foodResponse.ok) {
                throw new Error("Failed to fetch food details");
              }
              const foodData = await foodResponse.json();
              return { ...item, foodName: foodData.foodPosting.item_name };
            })
          );
          setItems(updatedItems);
        } else {
          console.error("API response is not as expected:", data);
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [requesterId]);

  return (
    <div
      className="h-full bg-gray-100 p-8"
      style={{
        position: "absolute",
        top: 50,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#AFE1AF",
        padding: "1.5rem",
      }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-[#228B22]">
        Requested Food Items
      </h2>
      <div className="overflow-auto w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item._id} className="py-4 border-b border-gray-200">
                <Link to={`/food/${item.food_id}`}>
                  <img
                    src={fileBaseUrl + item.image}
                    alt={item.itemName}
                    className="w-20 h-20 mr-4 rounded-full cursor-pointer float-left"
                  />
                </Link>
                <div className="ml-24">
                  <Link to={`/food/${item.food_id}`}>
                    <h3 className="text-xl font-semibold mb-2 cursor-pointer">
                      {item.foodName}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-1">
                    <strong>Pickup Time: </strong> {item.proposed_pick_up_time}
                  </p>
                  <button
                    onClick={() => cancelRequest(item._id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Cancel Request
                  </button>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="py-4 text-gray-500">
                No requested food items found.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FoodItemList;
