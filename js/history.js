import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const container = document.getElementById("historyContainer");
const loader = document.getElementById("loader");

// ---------------- MENU ----------------

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("show");
    overlay.classList.add("show");
});

closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
});

// ---------------- LOAD HISTORY ----------------

loadHistory();

async function loadHistory() {

    loader.classList.add("show");

    try {

        const username = sessionStorage.getItem("username");

        if (!username) {
            loader.classList.remove("show");
            container.innerHTML = "<h2>this is for testing </h2>";
            return;
        }

        const q = query(
            collection(db, "attendance", username, "records"),
            orderBy("checkInTimestamp", "desc")
        );

        const snapshot = await getDocs(q);

        container.innerHTML = "";

        if (snapshot.empty) {

            container.innerHTML = `
                <div class="card">
                    <div class="status">
                        No attendance history
                    </div>
                </div>
            `;

            loader.classList.remove("show");
            return;
        }

        snapshot.forEach(doc => {

            const data = doc.data();

            container.innerHTML += `
                <div class="card">

                    <div class="date">
                        ${data.date ?? "--"}
                    </div>

                    <div class="status">
                        ${data.status ?? "--"}
                    </div>

                    <div class="times">
                        <div>Check In : ${data.checkIn ?? "--:--"}</div>
                        <div>Check Out : ${data.checkOut ?? "--:--"}</div>
                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="card">
                <div class="status">
                    Failed to load history.
                </div>
            </div>
        `;

    } finally {

        loader.classList.remove("show");

    }

}