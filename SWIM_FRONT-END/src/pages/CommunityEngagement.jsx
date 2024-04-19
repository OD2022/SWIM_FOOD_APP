import React, { useState } from "react";

const CommunityEngagement = () => {
  // Dummy data for feedbacks
  const dummyFeedbacks = [
    {
      id: 1,
      name: "John Doe",
      comment: "Great app! Really helpful.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      comment: "Needs improvement in user interface.",
      rating: 3,
    },
    {
      id: 3,
      name: "Alice Johnson",
      comment: "Could use more features.",
      rating: 4,
    },
  ];

  const [feedbacks, setFeedbacks] = useState(dummyFeedbacks);
  const [newFeedback, setNewFeedback] = useState({
    name: "",
    comment: "",
    rating: 0,
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({
      ...newFeedback,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a random id for the new feedback
    const id = Math.floor(Math.random() * 1000) + 1;
    const feedback = { ...newFeedback, id };
    // Add the new feedback to the list of feedbacks
    setFeedbacks([...feedbacks, feedback]);
    // Clear the form fields after submission
    setNewFeedback({
      name: "",
      comment: "",
      rating: 0,
    });
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        position: "absolute",
        top: "25px",
        left: 0,
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#AFE1AF",
      }}
    >
      <h2 className="text-3xl font-semibold mb-4 text-[#228B22]">
        Community Engagement
      </h2>
      <button
        onClick={toggleFormVisibility}
        className="bg-[#228B22] text-white py-2 px-4 rounded-md mb-4"
      >
        {showForm ? "Hide Feedback Form" : "Submit Feedback"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          {/* Form fields for submitting feedback */}
          {/* Name input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block font-semibold mb-2 text-[#228B22]"
            >
              Your Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newFeedback.name}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
          {/* Comment input */}
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block font-semibold mb-2 text-[#228B22]"
            >
              Your Feedback:
            </label>
            <textarea
              id="comment"
              name="comment"
              value={newFeedback.comment}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full"
              rows={4}
              required
            />
          </div>
          {/* Rating input */}
          <div className="mb-4">
            <label
              htmlFor="rating"
              className="block font-semibold mb-2 text-[#228B22]"
            >
              Rating:
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={newFeedback.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="1"
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="bg-[#228B22] text-white py-2 px-4 rounded-md"
          >
            Submit Feedback
          </button>
        </form>
      )}
      {/* Existing feedbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="border p-4 rounded-lg shadow-md text-[#228B22]"
          >
            <p className="font-semibold">Name: {feedback.name}</p>
            <p className="mt-2">Comment: {feedback.comment}</p>
            <p className="mt-2">Rating: {feedback.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityEngagement;
