const dbName = "eventsData";

function saveData(data) {
    localStorage.setItem(dbName, JSON.stringify(data));
}

function getData() {
    const data = localStorage.getItem(dbName);
    return data ? JSON.parse(data) : []; // Return empty array if no data exists
}

function addEvent(event) {
    const events = getData();
    events.push(event);
    saveData(events);
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
    
    new_event = {
        "organisateur": organisateur,
        "mail" : mail,
        "telephone" : telephone,
        "option": adaptePMR,
        "lieu": lieu,
        "date_debut": date,
        "theme": "",
        "adresse": "",
        "description": description,
        "participants": {}
    };
    
    addEvent(new_event);
    
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
