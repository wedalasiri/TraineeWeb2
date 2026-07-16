// Import Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


// Firebase Config

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Services

export const db = getFirestore(app);

export const auth = getAuth(app);


// Anonymous Login
export async function firebaseLogin(){

    try{

        await signInAnonymously(auth);

        console.log("Firebase Connected");

    }

    catch(error){

        console.error(error);

        throw error;

    }

}