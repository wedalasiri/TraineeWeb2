import { db, auth } from "./firebase.js";

import {
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

loginBtn.addEventListener("click", login);

async function login() {

    error.innerHTML = "";
    loginBtn.disabled = true;
btnText.textContent = "Signing in...";
loader.classList.add("show");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

   if(username === "" || password === ""){

    error.innerHTML = "Please enter username and password";

    loginBtn.disabled = false;
    btnText.textContent = "Login";
    loader.classList.remove("show");

    return;
}

    try{

        const token = await getMoodleToken(username,password);

       if(!token){

    error.innerHTML="Incorrect username or password";

    loginBtn.disabled = false;
    btnText.textContent = "Login";
    loader.classList.remove("show");

    return;

}

        const user = await getUserInfo(token,username);

      if(!user){

    error.innerHTML="Unable to load user information from moodle";

    loginBtn.disabled = false;
    btnText.textContent = "Login";
    loader.classList.remove("show");

    return;

}
        const job = getCustomField(user,"job");

        if(!job.toLowerCase().includes("trainee")){

    error.innerHTML="Access denied";

    loginBtn.disabled = false;
    btnText.textContent = "Login";
    loader.classList.remove("show");

    return;

}

        await signInAnonymously(auth);

        const fullName =
            user.firstname + " " + (user.lastname ?? "");

        const employeeId = user.username;

        const department =
            getCustomField(user,"department");

        const location =
            getCustomField(user,"location");

        sessionStorage.setItem("username",fullName);
        sessionStorage.setItem("employeeId",employeeId);
        sessionStorage.setItem("department",department);
        sessionStorage.setItem("workLocation",location);
        sessionStorage.setItem("token",token);

        window.location.href="dashboard.html";

    }

    catch(e){

    console.log(e);

    error.innerHTML = "Login Failed";

    loginBtn.disabled = false;
    btnText.textContent = "Login";
    loader.classList.remove("show");

}

}




// =========================================
// Get Moodle Token
// =========================================

async function getMoodleToken(username, password) {

    const url =
        `https://elearning.saudico.com.sa/login/token.php?` +
        `username=${encodeURIComponent(username)}` +
        `&password=${encodeURIComponent(password)}` +
        `&service=moodle_mobile_app`;

    const response = await fetch(url);

    const data = await response.json();

    return data.token ?? null;

}


// =========================================
// Get User Information
// =========================================

async function getUserInfo(token, username) {

    const url =
        `https://elearning.saudico.com.sa/webservice/rest/server.php?` +
        `wstoken=${token}` +
        `&wsfunction=core_user_get_users_by_field` +
        `&field=username` +
        `&values[0]=${encodeURIComponent(username)}` +
        `&moodlewsrestformat=json`;

    const response = await fetch(url);

    const users = await response.json();

    if (!Array.isArray(users) || users.length === 0) {

        return null;

    }

    return users[0];

}

// =========================================
// Read Moodle Custom Fields
// =========================================

function getCustomField(user, fieldName) {

    if (!user.customfields)
        return "";

    const field = user.customfields.find(f => {

        const name = (f.name || "").toLowerCase();

        const shortname = (f.shortname || "").toLowerCase();

        return (
            name.includes(fieldName.toLowerCase()) ||
            shortname === fieldName.toLowerCase()
        );

    });

    return field ? field.value : "";

}