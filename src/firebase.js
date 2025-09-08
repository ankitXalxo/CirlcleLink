import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC61j9NPbeMu0O7qkVsfH4czOJF2Wetcug",
  authDomain: "whatsapp-clone-react-fir-66a0b.firebaseapp.com",
  projectId: "whatsapp-clone-react-fir-66a0b",
  storageBucket: "whatsapp-clone-react-fir-66a0b.appspot.com",
  messagingSenderId: "55985504927",
  appId: "1:55985504927:web:f923cbf8a71c1601e258aa",
  measurementId: "G-TYW8ME1JJK",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
