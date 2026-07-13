import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6_AyS_0wQPESUYsY96osLoUlObFW6-ys",
  authDomain: "twiller-priya.firebaseapp.com",
  projectId: "twiller-priya",
  storageBucket: "twiller-priya.firebasestorage.app",
  messagingSenderId: "194325770064",
  appId: "1:194325770064:web:8657644f32b5570e66c655",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;