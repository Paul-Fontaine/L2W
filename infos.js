document.addEventListener("DOMContentLoaded", () => {
    // Récupérer le paramètre "collecte" dans l'URL
    const params = new URLSearchParams(window.location.search);
    const collecteName = params.get("collecte");

    const container = document.body;

    if (collecteName) {
        fetch("events.json")
            .then(response => response.json())
            .then(data => {
                const collecte = data.events[collecteName];
                if (collecte) {
                    const html = `
                                    <h2>${collecteName}</h2>
                                    <p><strong>Organisateur:</strong> ${collecte.organisateur}</p>
                                    <p><strong>Email:</strong> ${collecte.mail}</p>
                                    <p><strong>Téléphone:</strong> ${collecte["numéro de téléphone"]}</p>
                                    <p><strong>Option:</strong> ${collecte.option || "Aucune"}</p>
                                    <p><strong>Thème:</strong> ${collecte.theme || "Aucun"}</p>
                                    <p><strong>Description:</strong> ${collecte.description}</p>
                                    <h3>Participants:</h3>
                                    <ul>
                                        ${Object.entries(collecte.participants).map(([name, count]) => `<li>${name}: ${count}</li>`).join("")}
                                    </ul>
                                `;
                    container.innerHTML += html;
                } else {
                    container.innerHTML += `<p>Collecte "${collecteName}" non trouvée.</p>`;
                }
            })
            .catch(error => {
                console.error("Erreur lors du chargement du JSON:", error);
                container.innerHTML += `<p>Erreur lors du chargement des données.</p>`;
            });
    } else {
        container.innerHTML += `<p>Aucune collecte spécifiée dans l'URL.</p>`;
    }
});