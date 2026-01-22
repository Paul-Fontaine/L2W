// Source GEMINI 

async function initialiserCarteEtEvenements() {
    // 1. Initialisation de la carte (Brest par défaut)
    const map = L.map('map').setView([48.3904, -4.4861], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Icône personnalisée pour vos événements
    const iconEvenement = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    try {
        // 2. Récupération des données fusionnées
        const response = await fetch("events.json");
        const jsonData = await response.json();
        let mergedEvents = { ...jsonData.events };

        const storedData = localStorage.getItem("eventsData");
        if (storedData) {
            const parsedStored = JSON.parse(storedData);
            if (parsedStored.events) {
                mergedEvents = { ...mergedEvents, ...parsedStored.events };
            }
        }

        // 3. Géocodage avec Nominatim (OpenStreetMap)
        const eventsArray = Object.values(mergedEvents);

        for (const event of eventsArray) {
            if (event.lieu) {
                await ajouterMarqueurNominatim(map, event, iconEvenement);
                // Pause de 1 seconde entre les requêtes pour respecter la politique de Nominatim
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function ajouterMarqueurNominatim(map, event, icon) {
    // Nominatim nécessite un User-Agent ou un paramètre email pour les identifier
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(event.lieu)}&limit=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;

            L.marker([lat, lon], { icon: icon })
                .addTo(map)
                .bindPopup(`
                    <strong>${event.nom || "Événement"}</strong><br>
                    ${event.lieu}<br>
                    <small>${event.date || ""}</small>
                `);
        }
    } catch (error) {
        console.warn("Erreur de géocodage pour : " + event.lieu, error);
    }
}

document.addEventListener("DOMContentLoaded", initialiserCarteEtEvenements);