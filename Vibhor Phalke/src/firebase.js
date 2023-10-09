import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCHQuDMdiYMW7g2H0X53VUgvJnEpEOW_Jg",
    authDomain: "svelte-chatapp-e9788.firebaseapp.com",
    projectId: "svelte-chatapp-e9788",
    storageBucket: "svelte-chatapp-e9788.appspot.com",
    messagingSenderId: "109128334050",
    appId: "1:109128334050:web:bbec0f2bd1e593c1c4fcbb"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
