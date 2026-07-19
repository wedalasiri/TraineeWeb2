import { db } from "./firebase.js";
import { LocationManager } from "./CoreLocationManager.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const username = sessionStorage.getItem("username");
const employeeId = sessionStorage.getItem("employeeId");
const department = sessionStorage.getItem("department");
const workLocation = sessionStorage.getItem("workLocation");


const locationManager = new LocationManager();

locationManager.setAssignedLocation(workLocation);

document.getElementById("username").textContent = username;

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.onclick = () => {

    sidebar.classList.add("active");
    overlay.classList.add("active");

}

closeMenu.onclick = closeSidebar;
overlay.onclick = closeSidebar;

function closeSidebar(){

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

}

const statusText = document.getElementById("statusText");
const checkInSpan = document.getElementById("checkIn");
const checkOutSpan = document.getElementById("checkOut");
const locationDot = document.getElementById("locationDot");
const locationStatus = document.getElementById("locationStatus");
const attendanceBtn = document.getElementById("attendanceBtn");

let didCheckIn = false;
let didCheckOut = false;
let canCheckOut = false;

const todayKey = new Date().toLocaleDateString("en-GB",{
    day:"2-digit",
    month:"short",
    year:"numeric"
});

// ================================
// Load today's attendance
// ================================

loadTodayRecord();

async function loadTodayRecord() {

    const ref = doc(
        db,
        "attendance",
        username,
        "records",
        todayKey
    );

    const snap = await getDoc(ref);

    if (!snap.exists()) {

        updateUI();

        return;

    }

    const data = snap.data();

    checkInSpan.textContent = data.checkIn || "--:--";

    checkOutSpan.textContent = data.checkOut || "--:--";

    didCheckIn = data.checkIn != null;

    didCheckOut =
        data.checkOut &&
        data.checkOut !== "--:--";

    if (data.checkInTimestamp) {

        const checkInDate =
            data.checkInTimestamp.toDate();

        canCheckOut =
            (Date.now() - checkInDate.getTime())
            >=
            15 * 60 * 1000;

    }

    updateUI();

}


// ================================
// Update Screen
// ================================

function updateUI() {

    if (!didCheckIn) {

        statusText.textContent =
            "Not Checked In";

        attendanceBtn.textContent =
            "Check In";

    }

    else if (!didCheckOut) {

        statusText.textContent =
            "Checked In";

        attendanceBtn.textContent =
            canCheckOut
            ? "Check Out"
            : "Check Out";

    }

    else {

        statusText.textContent =
            "Checked Out";

        attendanceBtn.textContent =
            "Have a nice day";

        attendanceBtn.disabled = true;

    }

}
// ================================
// Attendance Button
// ================================

attendanceBtn.onclick = async () => {


    const ref = doc(
        db,
        "attendance",
        username,
        "records",
        todayKey
    );


    const snap = await getDoc(ref);



    // ================= CHECK IN =================

   // ================= CHECK IN =================

if(!didCheckIn){


    // فحص الموقع قبل تسجيل الحضور

    const inside =
    await locationManager.startLocationUpdates();



  try {

    const inside = await locationManager.startLocationUpdates();

    if (!inside) {
        alert("You are outside the work location.");
        return;
    }

} catch (error) {

    alert("Please enable location services.");
    return;

}

    const now = new Date();


    const time =
    now.toLocaleTimeString("en-US",{
        hour:"numeric",
        minute:"2-digit"
    });



    await setDoc(ref,{

        fullName: username,

        employeeId: employeeId,

        department: department,

        workLocation: workLocation,

        date: todayKey,

        checkIn: time,

        checkOut:"--:--",

        status:"Present",

        checkInTimestamp:
        Timestamp.now()

    });


    checkInSpan.textContent = time;


    didCheckIn = true;


    updateUI();


    return;

}

    // ================= CHECK OUT =================


    if(didCheckIn && !didCheckOut){


        if(!canCheckOut){


            alert(
            "You can check out after 15 minutes from check in."
            );


            return;

        }



        const now = new Date();


        const time =
        now.toLocaleTimeString("en-US",{

            hour:"numeric",
            minute:"2-digit"

        });



        await updateDoc(ref,{


            checkOut: time


        });



        checkOutSpan.textContent = time;


        didCheckOut = true;


        updateUI();


        return;

    }



};