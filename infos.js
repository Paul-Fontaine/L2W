document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const collecteName = params.get("collecte");

    const container = document.querySelector(".collecte-info");
    const form = document.getElementById("registrationForm");

    let data = null;

    fetch("events.json")
        .then(response => response.json())
        .then(json => {
            // Charger depuis localStorage si existe
            data = JSON.parse(localStorage.getItem("eventsData")) || json;

            if (!collecteName) {
                container.innerHTML += "<p>Aucune collecte spécifiée.</p>";
                return;
            }

            const collecte = data.events[collecteName];

            if (!collecte) {
                container.innerHTML += `<p>Collecte "${collecteName}" non trouvée.</p>`;
                return;
            }

            // Affichage
            container.innerHTML += `
                <h2>${collecteName}</h2>
                <p><strong>Organisateur :</strong> ${collecte.organisateur}</p>
                <p><strong>Email :</strong> ${collecte.mail}</p>
                <p><strong>Téléphone :</strong> ${collecte.telephone}</p>
                <p><strong>Option :</strong> ${collecte.option || "Aucune"}</p>
                <p><strong>Thème :</strong> ${collecte.theme || "Aucun"}</p>
                <p><strong>Description :</strong> ${collecte.description}</p>
                <h3>Participants :</h3>
                <ul id="participantsList">
                    ${Object.keys(collecte.participants).map(name => `<li>${name}</li>`).join("")}
                </ul>
            `;
        });

    // Gestion du formulaire
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!data || !collecteName) return;

            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const nombre = document.getElementById("nombre").value.trim();

            if (!firstName || !lastName) return;

            const participantKey = `${firstName} ${lastName}`;

            data.events[collecteName].participants[participantKey] = nombre;

            localStorage.setItem("eventsData", JSON.stringify(data));

            alert("Inscription enregistrée !");
            location.reload();
        });
    }
});