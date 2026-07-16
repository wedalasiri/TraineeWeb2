// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


// Firebase Configuration

const firebaseConfig = {

    apiKey: "AIzaSyDX9n_L5MsuTCP5FiBk9mbZtlpYj0MqRvM",

    authDomain: "saudico-trainee.firebaseapp.com",

    projectId: "saudico-trainee",

    storageBucket: "saudico-trainee.firebasestorage.app",

    messagingSenderId: "410401427797",

    appId: "1:410401427797:web:0e84d5d249802f1dafdfdc"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Firestore

const db = getFirestore(app);


// Authentication

const auth = getAuth(app);


// Export

export {

    db,

    auth

};