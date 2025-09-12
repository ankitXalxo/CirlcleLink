import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBUtE437loyrqcLQB9uPLOtUO96-IwASuw",
  authDomain: "circlelink-ca24c.firebaseapp.com",
  projectId: "circlelink-ca24c",
  storageBucket: "circlelink-ca24c.firebasestorage.app",
  messagingSenderId: "250520899789",
  appId: "1:250520899789:web:133f1f8e1cfb914c6b5984",
  measurementId: "G-SFM08RG9JD",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
