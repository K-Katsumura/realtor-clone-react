// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrEeB6wUczo9KX4EJwhjPTHeMOA6u77MQ",
  authDomain: "realtor-clone-react-7338b.firebaseapp.com",
  projectId: "realtor-clone-react-7338b",
  storageBucket: "realtor-clone-react-7338b.appspot.com",
  messagingSenderId: "551411396220",
  appId: "1:551411396220:web:447b59d11d83edda6523f9"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();