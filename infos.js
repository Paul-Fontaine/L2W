document.addEventListener("DOMContentLoaded", () => {
    const collecteInfoSection = document.querySelector(".collecte-info");
    const inscriptionBox = document.querySelector(".inscription-box");
    const desinscriptionBox = document.querySelector(".desinscription-box");
    const registrationForm = document.getElementById("registrationForm");
    const unregistrationForm = document.getElementById("unregistrationForm");

    // Récupérer les paramètres de l'URL
    const params = new URLSearchParams(window.location.search);
    const collecteName = params.get("collecte");

    if (!collecteName) {
        collecteInfoSection.innerHTML = "<p>Aucune collecte spécifiée.</p>";
        return;
    }

    // Charger les données : fusionner events.json avec localStorage
    const dataPromise = fetch("events.json")
        .then((response) => response.json())
        .then((jsonData) => {
            // Charger localStorage s'il existe
            let mergedData = { events: { ...jsonData.events } };

            try {
                const storedData = localStorage.getItem("eventsData");
                if (storedData) {
                    const parsedStored = JSON.parse(storedData);
                    if (parsedStored && parsedStored.events) {
                        // Fusionner : events.json en base, localStorage en complément
                        mergedData.events = { ...jsonData.events, ...parsedStored.events };
                    }
                }
            } catch (e) {
                console.warn("Erreur lors du chargement de localStorage, utilisation de events.json uniquement", e);
            }

            return mergedData;
        });

    dataPromise
        .then((data) => {
            const collecte = data.events[collecteName];

            if (!collecte) {
                collecteInfoSection.innerHTML = `<p>Collecte "${collecteName}" non trouvée.</p>`;
                return;
            }

            afficherInfosCollecte(collecte, collecteName);
            gererAffichageFormulaires(collecte);

            // Gestion des formulaires
            if (registrationForm) {
                registrationForm.addEventListener("submit", (e) => inscrireParticipant(e, data, collecteName));
            }

            if (unregistrationForm) {
                unregistrationForm.addEventListener("submit", (e) => desinscrireParticipant(e, data, collecteName));
            }
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des données :", error);
            collecteInfoSection.innerHTML = "<p>Erreur lors du chargement des données.</p>";
        });

    // Afficher les informations de la collecte
    function afficherInfosCollecte(collecte, collecteName) {
        collecteInfoSection.innerHTML = `
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
                ${Object.entries(collecte.participants || {}).map(([name, details]) => {
            // Gérer les deux formats : objet {nombre, telephone} ou string
            let nombre, telephone;
            if (typeof details === 'object' && details !== null) {
                nombre = details.nombre || details;
                telephone = details.telephone || "";
            } else {
                nombre = details;
                telephone = "";
            }
            return `
                    <li>
                        ${name} (${nombre} personne${parseInt(nombre) > 1 ? 's' : ''})
                        ${telephone ? `- Téléphone : ${telephone}` : ''}
                    </li>
                `;
        }).join("")}
            </ul>
        `;
    }

    // Gérer l'affichage des formulaires en fonction de la date
    function gererAffichageFormulaires(collecte) {
        const collecteDate = new Date(collecte.date_debut.split("/").reverse().join("-"));
        const currentDate = new Date();

        if (currentDate > collecteDate) {
            // Si la date est passée, afficher les résultats
            inscriptionBox.style.display = "none";
            desinscriptionBox.style.display = "none";

            // Display the results
            const results = collecte.resultat || {};
            collecteInfoSection.innerHTML += `
            <h3>Résultats de la collecte</h3>
            <ul>
                <li><strong>Déchets totaux collectés :</strong> ${results.dechet_total_kg || 0} kg</li>
                <li><strong>Déchets recyclés :</strong> ${results.dechet_recycle_kg || 0} kg</li>
                <li><strong>Déchets non recyclés :</strong> ${results.dechet_non_recycle_kg || 0} kg</li>
                <li><strong>Nombre total de participants :</strong> ${results.nombre_participants || 0}</li>
            </ul>
        `;
        } else {
            // Si la date n'est pas passée, afficher les formulaires
            inscriptionBox.style.display = "block";
            desinscriptionBox.style.display = "block";
        }
    }

    // Inscrire un participant
    function inscrireParticipant(e, data, collecteName) {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const nombre = document.getElementById("nombre").value.trim() || "1";
        const telephone = document.getElementById("telephone").value.trim() || "";

        if (!firstName || !lastName) {
            alert("Veuillez remplir le prénom et le nom.");
            return;
        }

        // S'assurer que la collecte existe et a un objet participants
        if (!data.events[collecteName]) {
            alert("Erreur : collecte introuvable.");
            return;
        }

        if (!data.events[collecteName].participants) {
            data.events[collecteName].participants = {};
        }

        const participantKey = `${firstName} ${lastName}`;

        // Créer ou mettre à jour le participant avec le format objet
        data.events[collecteName].participants[participantKey] = {
            nombre: nombre,
            telephone: telephone
        };

        // Sauvegarder dans localStorage (fusionné avec events.json)
        localStorage.setItem("eventsData", JSON.stringify(data));

        alert("Inscription enregistrée !");
        location.reload();
    }

    // Désinscrire un participant
    function desinscrireParticipant(e, data, collecteName) {
        e.preventDefault();

        const firstName = document.getElementById("unregFirstName").value.trim();
        const lastName = document.getElementById("unregLastName").value.trim();

        if (!firstName || !lastName) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const participantKey = `${firstName} ${lastName}`;
        const collecte = data.events[collecteName];

        if (!collecte.participants[participantKey]) {
            alert("Vous n'êtes pas inscrit à cet événement.");
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir vous désinscrire de "${collecteName}" ?`)) {
            delete collecte.participants[participantKey];
            localStorage.setItem("eventsData", JSON.stringify(data));

            alert("Désinscription réussie !");
            location.reload();
        }
    }
});
