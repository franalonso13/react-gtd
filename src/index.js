import React from "react";
import ReactDOM from "react-dom";
//import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDNJIa3VYqtLI4LOs6ZYcYDZbsQpKcUW-c",
  authDomain: "tfg-proyect.firebaseapp.com",
  databaseURL: "https://tfg-proyect.firebaseio.com",
  projectId: "tfg-proyect",
  storageBucket: "tfg-proyect.appspot.com",
  messagingSenderId: "964870376777",
  appId: "1:964870376777:web:089d60e652f3b988f3de98",
  measurementId: "G-CSPLBXW7YT",
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
