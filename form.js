const dbName = "eventsData";

function saveData(data) {
    localStorage.setItem(dbName, JSON.stringify(data));
}

function getData() {
    const data = localStorage.getItem(dbName);
    return data ? JSON.parse(data) : null;
}

// Charger les données de base depuis events.json et fusionner avec localStorage
async function loadAndMergeData() {
    try {
        // Charger events.json
        const response = await fetch("events.json");
        const jsonData = await response.json();
        
        // Charger localStorage s'il existe
        const storedData = getData();
        
        // Fusionner les données
        let mergedData = { events: { ...jsonData.events } };
        
        if (storedData && storedData.events) {
            // Fusionner les événements du localStorage avec ceux de events.json
            mergedData.events = { ...jsonData.events, ...storedData.events };
        }
        
        return mergedData;
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // En cas d'erreur, utiliser localStorage ou structure vide
        const storedData = getData();
        return storedData || { events: {} };
    }
}

function addEvent(eventName, eventData) {
    loadAndMergeData().then(mergedData => {
        // Ajouter le nouvel événement
        mergedData.events[eventName] = eventData;
        // Sauvegarder dans localStorage
        saveData(mergedData);
    });
}

const form = document.getElementById('propositionForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();
        
    // Récupération des données du formulaire
    const eventTitle = document.getElementById('event-name').value.trim();
    const lieu = document.getElementById('event-place').value.trim();
    const date = document.getElementById('date').value.trim();
    const organisateur = document.getElementById('name').value.trim();
    const mail = document.getElementById('email').value.trim();
    const telephone = document.getElementById('phone').value.trim();
    const adaptePMR = document.getElementById('PMR').checked;
    const description = document.getElementById('description').value.trim();
    
    if (!eventTitle || !lieu || !date || !organisateur || !mail || !description) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const new_event = {
        "organisateur": organisateur,
        "mail" : mail,
        "telephone" : telephone,
        "option": adaptePMR ? "Adapté aux PMR" : "",
        "lieu": lieu,
        "date_debut": date,
        "theme": "",
        "adresse": "",
        "description": description,
        "participants": {}
    };
    
    // Ajouter l'événement en fusionnant avec les données existantes
    loadAndMergeData().then(mergedData => {
        // Ajouter le nouvel événement
        mergedData.events[eventTitle] = new_event;
        // Sauvegarder dans localStorage
        saveData(mergedData);
        
        console.log(`Événement "${eventTitle}" ajouté avec succès !`);
        console.log(new_event);
        
        // Afficher le message de succès
        successMessage.style.display = 'block';
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Cacher le message et rediriger après 2 secondes
        setTimeout(function() {
            successMessage.style.display = 'none';
            window.location.href = 'liste_collecte.html';
        }, 2000);
        
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    addPoints(10);
    
    return; // Empêcher l'exécution du code suivant
    
});
