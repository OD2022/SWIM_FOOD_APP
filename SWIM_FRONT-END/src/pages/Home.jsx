import React from "react";
import { Link } from "react-router-dom";
import foodImage1 from "../photos/food.jpeg";
import foodImage2 from "../photos/food2.jpeg";
import foodImage3 from "../photos/food3.jpeg";
import foodImage4 from "../photos/food4.jpeg";
import foodImage5 from "../photos/food6.png";

const Home = () => {
  const headerStyle = {
    backgroundImage: `url(${foodImage5})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "100px 0",
    textAlign: "center",
    color: "white",
  };

  return (
    <div>
      <div className="flex justify-center" style={headerStyle}>
        <div className="flex justify-center z-0 bg-[#228B22] p-10 w-7/12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to SWIM-Food Climate Solutions!
            </h1>
            <p className="text-lg mb-8">
              SDG 2: Zero Hunger <br /> Tackle Food Waste & Post-Harvest Loss.
              Reduce Climate Change
            </p>
            <div className="flex justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-lg mr-4"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-[#0BDA51] text-white font-semibold py-2 px-6 rounded-lg"
              >
               Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <img
              src={foodImage1}
              alt="Food Donation"
              className="w-full mb-4 rounded-lg"
            />
            <h2 className="text-lg font-semibold mb-4">The Problem?</h2>
            <p className="text-sm text-gray-600">
              Food waste and post-harvest losses contribute to climate change by
              releasing greenhouse gases such as methane as organic matter
              decomposes in landfills, while also squandering the resources
              invested in food production, including water, energy, and land.
            </p>
            <Link
              to="/why-donate"
              className="block mt-4 text-blue-500 font-semibold hover:underline"
            >
              Learn More
            </Link>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <img
              src={foodImage2}
              alt="Food Donation"
              className="w-full mb-4 rounded-lg"
            />
            <h2 className="text-lg font-semibold mb-4">Our Solution</h2>
            <p className="text-sm text-gray-600">
              SWIM-Food Climate Solutions leverages innovative technology to
              tackle the pressing environmental challenge of climate change. It
              tackles climate change by solving SDG 2: Zero Hunger. By focusing
              on reducing food waste and post-harvest losses, the web
              application aims to mitigate greenhouse gas emissions, thereby
              promoting sustainability in the food supply chain and safeguarding
              the health of our planet for future generations.
            </p>
            {/* <Link
              to="/mission"
              className="block mt-4 text-blue-500 font-semibold hover:underline"
            >
              Explore
            </Link> */}
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <img
              src={foodImage4}
              alt="Food Donation"
              className="w-full mb-4 rounded-lg"
            />
            <h2 className="text-lg font-semibold mb-4">Get Involved</h2>
            <p className="text-sm text-gray-600">
              We link donors and recipients of foodstuff via this application.
              Get involved Join us either as a donor or recipient!
            </p>
            {/* <Link
              to="/get-involved"
              className="block mt-4 text-blue-500 font-semibold hover:underline"
            >
              Get Started
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
