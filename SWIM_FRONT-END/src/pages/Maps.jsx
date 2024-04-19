import React, { useEffect, useRef, useState } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";

const Maps = () => {
  const { id: itemId } = useParams(); // Get itemId from URL path
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState("My Location");
  const [autocomplete, setAutocomplete] = useState(null); // Add state for Autocomplete
  const destinationRef = useRef();

  useEffect(() => {
    const googleMapsApiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);

    // Fetch user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Fetch item location data from backend
    if (itemId) {
      fetchItemLocation(itemId);
    } else {
      console.error("Item ID is missing.");
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [itemId]);

  const fetchItemLocation = async (itemId) => {
    try {
      const response = await fetch("http://localhost/api/itemlocation.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: itemId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch item location");
      }
      const data = await response.json();
      if (data.item_location) {
        setOrigin(data.item_location);
      } else {
        console.error("No item location found for item ID:", itemId);
      }
    } catch (error) {
      console.error("Error fetching item location:", error);
    }
  };

  async function calculateRoute() {
    if (!map || !origin || !destinationRef.current.value) return;

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin === "My Location" ? userLocation : origin,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    destinationRef.current.value = "";
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center relative h-screen w-screen">
      <div className="absolute inset-0">
        <GoogleMap
          center={userLocation}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          {userLocation && <Marker position={userLocation} />}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="p-4 rounded-lg m-4 bg-white shadow-md min-w-[24rem] z-1">
        <div className="flex items-center space-x-2 justify-between z-10">
          <Autocomplete
            className="flex items-center space-x-2 justify-between z-10"
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
            onPlaceChanged={() => {
              if (autocomplete !== null) {
                const place = autocomplete.getPlace();
                if (place.formatted_address === "") {
                  setOrigin("My Location");
                } else {
                  setOrigin(place.formatted_address);
                }
              } else {
                console.warn("Autocomplete is not loaded yet!");
              }
            }}
          >
            <input
              type="text"
              placeholder="Origin"
              value={origin === "My Location" ? origin : ""}
              readOnly
              className="px-3 py-2 border rounded-md w-full z-10"
            />
          </Autocomplete>
          <Autocomplete
            className="flex items-center space-x-2 justify-between z-10"
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
            onPlaceChanged={() => {
              if (autocomplete !== null) {
                const place = autocomplete.getPlace();
                destinationRef.current.value = place.formatted_address;
              } else {
                console.warn("Autocomplete is not loaded yet!");
              }
            }}
          >
            <input
              type="text"
              placeholder="Destination"
              ref={destinationRef}
              className="px-3 py-2 border rounded-md w-full z-10"
            />
          </Autocomplete>
          <div className="space-x-2 z-10">
            <button
              className="px-4 py-2 bg-pink-500 text-white rounded-md z-10"
              onClick={calculateRoute}
            >
              Calculate Route
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-200 z-10"
              onClick={clearRoute}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 space-x-4 z-10">
          <span className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 z-10">
            Distance: {distance}
          </span>
          <span className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 z-10">
            Duration: {duration}
          </span>
          <button
            className="p-2 rounded-full hover:bg-gray-200 z-10"
            onClick={() => {
              if (map && userLocation) {
                map.panTo(userLocation);
                map.setZoom(15);
              }
            }}
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maps;
