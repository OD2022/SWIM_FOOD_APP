import axios from "axios";

const geocodeAddress = async (address) => {
    try {
       const googleMapsApiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
      
      {
        params: {
          address: address,
          key: googleMapsApiKey,
        },
      }
    );
    // console.log("Geocoding API Response:", response.data); 
    const { results } = response.data;
    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};


export default geocodeAddress;
