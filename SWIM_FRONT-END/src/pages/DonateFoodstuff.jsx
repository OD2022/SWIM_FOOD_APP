import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Autocomplete } from "@react-google-maps/api";
import { useUserId } from "../hooks/useUserId";
import Modal from "react-modal";
import ImageUploader from "./ImageUploader";
import { useAuth } from "../hooks/AuthContext";

Modal.setAppElement("#root");

const DonateFoodstuff = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const { userId } = useUserId() || {};

  useEffect(() => {}, [userId]);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const [autocompleteInstance, setAutocompleteInstance] = useState(null);

  // const handleImageUpload = (url) => {
  //   console.log("Image URL received:", url);
  //   setImageUrl(url);
  // };

  const handleImageUpload = (url) => {
    setImageUrl(url);
    closeModal(); // Close the modal after the image is uploaded
  };

  const isValidate = () => {
    let isProceed = true;
    let errorMessage = [];

    // Validate itemName
    if (itemName.length === 0) {
      isProceed = false;
      errorMessage.push("Please enter item name");
    }

    // Validate itemCategory
    // Assuming itemCategory is required and has a predefined list of options
    if (
      itemCategory.length === 0 ||
      ![
        "Fruits",
        "Vegetables",
        "Cooking Oils",
        "Carbohydrates",
        "Proteins",
        "Others",
      ].includes(itemCategory)
    ) {
      isProceed = false;
      errorMessage.push("Please select a valid item category");
    }

    // Validate itemQuantity
    if (
      itemQuantity.length === 0 ||
      isNaN(itemQuantity) ||
      parseInt(itemQuantity) <= 0
    ) {
      isProceed = false;
      errorMessage.push("Please enter a valid item quantity");
    }

    const currentDate = new Date();
    const selectedExpirationDate = new Date(expirationDate);
    selectedExpirationDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (!expirationDate || selectedExpirationDate < currentDate) {
      isProceed = false;
      errorMessage.push("Please select a valid expiration date");
    }

    // Validate pickupLocation
    if (pickupLocation.length === 0) {
      isProceed = false;
      errorMessage.push("Please enter pickup location");
    }

    if (
      startTime.length === 0 ||
      endTime.length === 0 ||
      startTime >= endTime
    ) {
      isProceed = false;
      errorMessage.push("Please select valid pickup time range");
    }

    if (description.length === 0) {
      isProceed = false;
      errorMessage.push("Please enter description");
    }

    const selectedPickupDate = new Date(pickupDate);
    if (!pickupDate || selectedPickupDate < currentDate) {
      isProceed = false;
      errorMessage.push("Please select a valid pickup date in the future");
    }

    if (submitted && !imageUrl) {
      isProceed = false;
      errorMessage.push("Please upload an image");
    }

    if (!isProceed) {
      errorMessage.forEach((errorMessage) => toast.warn(errorMessage));
      console.log(errorMessage);
    }

    return isProceed;
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidate()) {
      console.log("Invalid");
      return;
    }

    const requestBody = {
      donor_id: userId,
      item_name: itemName,
      item_category: itemCategory,
      item_quantity: itemQuantity,
      description: description,
      item_location: pickupLocation,
      pick_up_start_time: startTime,
      pick_up_end_time: endTime,
      pick_up_date: pickupDate,
      item_expiration_date: expirationDate,
      image_url: imageUrl,
    };

    try {
      const responseDonate = await fetch(
        "https://swimfoodapp.uc.r.appspot.com/add_food_posting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (responseDonate.ok) {
        const dataDonate = await responseDonate.json();
        console.log("Data received: ", dataDonate);

        if (dataDonate.message === "Food posting added successfully") {
          // Donation successful, navigate to receive page
          console.log("Done");
          navigate("/receive");
        } else {
          // Donation failed, display error message
          toast.error(dataDonate.error || "Donation failed");
        }
      } else {
        // HTTP error handling
        console.error("HTTP error:", responseDonate.status);
        toast.error("An error occurred during form submission");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred during form submission");
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
      <div className="border border-[#000000] shadow-sm rounded-md bg-[#AFE1AF] p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#008000]">
          Donate Foodstuff
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
          encType="multipart/form-data"
        >
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-[#008000]">
              Foodstuff Name
            </label>
            <input
              type="text"
              id="itemName"
              placeholder="Enter Foodstuff Name"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          {/* Other form fields */}
          <div className="mb-4">
            <label htmlFor="itemCategory" className="block text-[#008000]">
              Foodstuff Category
            </label>
            <select
              id="itemCategory"
              className="form-select mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              required
            >
              <option value="">Select category...</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Cooking Oils">Cooking Oils</option>
              <option value="Carbohydrates">Carbohydrates</option>
              <option value="Proteins">Proteins</option>
              <option value="Others">Others</option>
            </select>
          </div>
          {/* End of other form fields */}
          <div className="mb-4">
            <label htmlFor="itemQuantity" className="block text-[#008000]">
              Quantity of Food
            </label>
            <input
              type="number"
              id="itemQuantity"
              placeholder="Enter food quantity"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemQuantity}
              onChange={(e) => {
                const newValue = Math.max(0, parseInt(e.target.value)); // Ensure positive number
                setItemQuantity(newValue);
              }}
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expirationDate" className="block text-[#008000]">
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationDate"
              placeholder="Select expiration date"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-[#008000]">
              Item Location
            </label>
            <Autocomplete
              onLoad={(autocomplete) => {
                console.log("Autocomplete loaded:", autocomplete);
                setAutocompleteInstance(autocomplete);
              }}
              onPlaceChanged={() => {
                if (autocompleteInstance !== null) {
                  const place = autocompleteInstance.getPlace();
                  console.log("Selected place:", place);
                  setPickupLocation(place.formatted_address);
                } else {
                  console.error("Autocomplete instance is not available.");
                }
              }}
            >
              <input
                type="text"
                id="pickupLocation"
                placeholder="Enter pickup location"
                className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
              />
            </Autocomplete>
          </div>
          <div className="mb-4">
            <label htmlFor="pickupDate" className="block text-[#008000]">
              Pickup Date
            </label>
            <input
              type="date"
              id="pickupDate"
              placeholder="Select pickup date"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-[#008000]">
              Pickup Start Time
            </label>
            <input
              type="time"
              id="startTime"
              placeholder="Select pickup start time"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-[#008000]">
              Pickup End Time
            </label>
            <input
              type="time"
              id="endTime"
              placeholder="Select pickup end time"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-[#008000]">
              Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Enter description"
              className="form-input mt-1 block w-full border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="button" onClick={openModal}>
              Select Image
            </button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Image Uploader"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
                content: {
                  maxWidth: "80%",
                  maxHeight: "80%",
                  margin: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                },
              }}
            >
              <div className="max-w-md mx-auto p-4 md-white rounded-md">
                <ImageUploader onUploadComplete={handleImageUpload} />
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </Modal>

            {imageUrl && (
              <div className="mt-4">
                <img
                  src={imageUrl}
                  alt="Uploaded Foodstuff"
                  className="max-w-xs"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-[#008000] text-white rounded-md hover:bg-[#008000] focus:outline-none focus:bg-[#008000]"
          >
            {submitted ? "Donation Submitted!" : "Submit Donation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonateFoodstuff;
