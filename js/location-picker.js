const locations = [

    "Head Office",

    "DGDA-Infra A",

    "DGDA-pendry SuperBlock",

    "DGDA-Ritz Carlton",

    "Misk City-Al Mishraq",

    "Misk City-Art Institute"

];

const container = document.getElementById("locations");
const confirmBtn = document.getElementById("confirmBtn");

let selectedLocation = "";

locations.forEach(location => {

    const card = document.createElement("div");

    card.className = "location-card";

    card.innerHTML = `

        <span class="location-name">${location}</span>

    

    `;

    card.onclick = () => {

        document.querySelectorAll(".location-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

        selectedLocation = location;

        confirmBtn.disabled = false;

    };

    container.appendChild(card);

});

confirmBtn.onclick = () => {

    localStorage.setItem(
        "workLocation",
        selectedLocation
    );

    sessionStorage.setItem(
        "workLocation",
        selectedLocation
    );

    window.location.href = "dashboard.html";

};