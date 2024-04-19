//Firebase.jsx
// Firebase.jsx
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ0RBKnLzZLd5lJDbzCFJWgl-L19DuE-c",
  authDomain: "swim-food-app.firebaseapp.com",
  projectId: "swim-food-app",
  storageBucket: "swim-food-app.appspot.com",
  messagingSenderId: "182496757772",
  appId: "1:182496757772:web:308883764d99a490de8629",
  measurementId: "G-GEB14X654C",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
