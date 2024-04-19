import React, { useEffect, useRef, useState } from 'react';

const FoodMap = () => {
  const mapRef = useRef(null);
  const directionsService = useRef(new window.google.maps.DirectionsService());
  const directionsRenderer = useRef(new window.google.maps.DirectionsRenderer());
  const [startAddress, setStartAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const autocompleteStart = new window.google.maps.places.Autocomplete(document.getElementById('startAddress'));
    const autocompleteDestination = new window.google.maps.places.Autocomplete(document.getElementById('destinationAddress'));

    const displayFoodItems = () => {
      fetch('https://swimfoodapp.uc.r.appspot.com/get_all_foods')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const items = data.allFoods;
          if (!items || items.length === 0) {
            alert("No food items available.");
            return;
          }

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              position => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                const map = new window.google.maps.Map(mapRef.current, {
                  zoom: 12,
                  center: userLocation
                });

                directionsRenderer.current.setMap(map);

                const geocoder = new window.google.maps.Geocoder();

                items.forEach(item => {
                  const itemLocation = item.item_location;

                  // Create a custom HTML content for the marker's info window
                  const infoWindowContent = `
                    <div>
                      <h3>${item.item_name}</h3>
                      <p>Address: ${itemLocation}</p>
                      <p>Donor ID: ${item.donor_id}</p>
                      <p>Quantity: ${item.item_quantity}</p>
                      <p>Pick-up Date: ${item.pick_up_date}</p>
                    </div>
                  `;

                  // Geocode the food item's location
                  geocoder.geocode({ address: itemLocation }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                      // Get the coordinates of the food item's location
                      const location = results[0].geometry.location;

                      // Create a marker for the food item's location
                      const marker = new window.google.maps.Marker({
                        position: location,
                        map: map
                      });

                      // Create an info window for the marker
                      const infoWindow = new window.google.maps.InfoWindow({
                        content: infoWindowContent
                      });

                      // Add click event listener to open the info window when marker is clicked
                      marker.addListener('click', () => {
                        infoWindow.open(map, marker);

                        // Calculate route from marker to user's location
                        calculateAndDisplayRoute(marker.getPosition(), userLocation);
                      });
                    } else {
                      console.error("Geocode was not successful for the following reason: " + status);
                    }
                  });
                });
              },
              error => {
                console.error('Error getting user location:', error);
                // Fallback to default location (Accra, Ghana)
                const defaultLocation = { lat: 5.6037, lng: -0.1870 };
                const map = new window.google.maps.Map(mapRef.current, {
                  zoom: 8,
                  center: defaultLocation
                });
              }
            );
          } else {
            console.error('Geolocation is not supported by this browser.');
            // Fallback to default location (Accra, Ghana)
            const defaultLocation = { lat: 5.6037, lng: -0.1870 };
            const map = new window.google.maps.Map(mapRef.current, {
              zoom: 8,
              center: defaultLocation
            });
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          alert('Failed to fetch food items. Please try again later.');
        });
    };

    displayFoodItems();
  }, []);

  const handleCalculateDistance = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address: startAddress }, (startResults, startStatus) => {
          if (startStatus === window.google.maps.GeocoderStatus.OK && startResults[0]) {
            const startLocation = startResults[0].geometry.location;

            geocoder.geocode({ address: destinationAddress }, (destResults, destStatus) => {
              if (destStatus === window.google.maps.GeocoderStatus.OK && destResults[0]) {
                const destinationLocation = destResults[0].geometry.location;

                const request = {
                  origin: startLocation,
                  destination: destinationLocation,
                  travelMode: 'DRIVING'
                };

                directionsService.current.route(request, (response, status) => {
                  if (status === 'OK') {
                    directionsRenderer.current.setDirections(response);
                    const route = response.routes[0];
                    setDistance(route.legs[0].distance.text);
                    setDuration(route.legs[0].duration.text);
                  } else {
                    console.error('Directions request failed due to ' + status);
                  }
                });
              } else {
                console.error('Geocode was not successful for the following reason: ' + destStatus);
              }
            });
          } else {
            console.error('Geocode was not successful for the following reason: ' + startStatus);
          }
        });
      },
      error => {
        console.error('Error getting user location:', error);
      }
    );
  };

  const handleStartAddressChange = event => {
    setStartAddress(event.target.value);
  };

  const handleDestinationAddressChange = event => {
    setDestinationAddress(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleCalculateDistance();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-4 mb-4">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="startAddress"
            value={startAddress}
            onChange={handleStartAddressChange}
            placeholder="Enter start address"
            className="rounded-md border-gray-400 border-solid border-2 p-2 mr-2"
          />
          <input
            type="text"
            id="destinationAddress"
            value={destinationAddress}
            onChange={handleDestinationAddressChange}
            placeholder="Enter destination address"
            className="rounded-md border-gray-400 border-solid border-2 p-2"
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded ml-2">Calculate Distance</button>
        </form>
      </div>
      <div>
        <p>Distance: {distance}</p>
        <p>Duration: {duration}</p>
      </div>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

export default FoodMap;
