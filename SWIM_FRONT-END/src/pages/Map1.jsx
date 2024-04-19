// Import necessary dependencies
import React, { useRef, useState, useEffect } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";

// Define the Map component
const Map = ({ markers }) => {
  // Define state variables
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [origin, setOrigin] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const destinationRef = useRef();
  const googleMapsApiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  // Effect to load Google Maps API and user location
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setOrigin("My Location");
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to calculate route
  async function calculateRoute(destination) {
    console.log("Calculate route");
    if (origin === "" || destination === "" || !markers) {
      console.error("Origin, destination, or markers are not properly set.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin === "My Location" ? userLocation : origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
  }

  // Function to clear route
  function clearRoute() {
    setDirectionsResponse(null);
    setOrigin("");
    destinationRef.current.value = "";
  }

  // Function to handle marker hover
  const handleMarkerHover = (marker) => {
    setHoveredMarker(marker);
    const destination = `${marker.position.lat},${marker.position.lng}`;
    calculateRoute(destination);
  };

  // Return loading state if still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Return the map component and controls
  return (
    <div className="flex flex-col items-center relative h-screen w-screen z-10">
      <div className="absolute inset-0 z-10">
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
          {markers &&
            markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(150, 140),
                }}
                onMouseOver={() => handleMarkerHover(marker)}
                onMouseOut={() => setHoveredMarker(null)}
              >
                {hoveredMarker === marker && map && (
                  <InfoWindow
                    position={marker.position}
                    map={map}
                    onCloseClick={() => setHoveredMarker(null)}
                  >
                    <div>
                      <p>
                        Distance:{" "}
                        {directionsResponse?.routes[0]?.legs[0]?.distance?.text}
                      </p>
                      <p>
                        Duration:{" "}
                        {directionsResponse?.routes[0]?.legs[0]?.duration?.text}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
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
                  setSelectedPlace(null);
                  setOrigin("");
                } else {
                  setSelectedPlace(place);
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
              value={
                selectedPlace
                  ? selectedPlace.formatted_address
                  : origin === "My Location"
                  ? origin
                  : ""
              }
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
                calculateRoute(place.geometry.location);
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
              onClick={clearRoute}
            >
              Clear Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Map component
export default Map;
