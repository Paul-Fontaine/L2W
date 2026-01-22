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
            console.log("Données chargées :", data);
            if (!collecteName) {
                container.innerHTML += "<p>Aucune collecte spécifiée.</p>";
                return;
            }

            const collecte = data.events[collecteName];

            console.log("Données de la collecte :", collecte);

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
                <p><strong>Adresse de rencontre :</strong> ${collecte.adresse}</p>
                <p><strong>Date :</strong> ${collecte.date_debut}</p>
                <p><strong>Option :</strong> ${collecte.option || "Aucune"}</p>
                <p><strong>Thème :</strong> ${collecte.theme || "Aucun"}</p>
                <p><strong>Description :</strong> ${collecte.description}</p>
                <h3>Participants :</h3>
                <ul id="participantsList">
                    ${Object.keys(collecte.participants).map(name => `<li>${name} (${collecte.participants[name]} personne${collecte.participants[name] > 1 ? 's' : ''})</li>`).join("")}
                </ul>
            `;
        });

    // Gestion du formulaire d'inscription
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

    // Gestion du formulaire de désinscription
    const unregForm = document.getElementById("unregistrationForm");
    if (unregForm) {
        unregForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!data || !collecteName) return;

            const firstName = document.getElementById("unregFirstName").value.trim();
            const lastName = document.getElementById("unregLastName").value.trim();

            if (!firstName || !lastName) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            const participantKey = `${firstName} ${lastName}`;
            const collecte = data.events[collecteName];

            // Vérifier que le participant existe
            if (!collecte.participants[participantKey]) {
                alert("Vous n'êtes pas inscrit à cet événement.");
                return;
            }

            // Demander confirmation
            if (confirm(`Êtes-vous sûr de vouloir vous désinscrire de "${collecteName}" ?`)) {
                // Supprimer le participant
                delete collecte.participants[participantKey];

                // Sauvegarder dans localStorage
                localStorage.setItem("eventsData", JSON.stringify(data));

                alert("Désinscription réussie !");
                location.reload();
            }
        });
    }
});