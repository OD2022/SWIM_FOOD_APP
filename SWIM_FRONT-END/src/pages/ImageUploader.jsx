import React, { useState } from "react";
import PropTypes from "prop-types";
import { storage } from "./Firebase"; // Ensure this import aligns with your Firebase configuration export
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ImageUploader = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const imageRef = ref(storage, "images/" + image.name); // Create a reference directly using ref()
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress tracking
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Error handling
          console.error("Error uploading image:", error);
        },
        () => {
          // Upload completed successfully
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImageUrl(url);
            console.log("File available at", url);
            onUploadComplete(url);
          });
        }
      );
    } else {
      console.warn("No image selected for upload.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

ImageUploader.propTypes = {
  onUploadComplete: PropTypes.func.isRequired,
};

export default ImageUploader;
