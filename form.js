const form = document.getElementById('propositionForm');
const successMessage = document.getElementById('successMessage');

if (form) {
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
        
        // Lire les données existantes
        let data = { events: {} };
        const existingData = localStorage.getItem('eventsData');
        if (existingData) {
            data = JSON.parse(existingData);
        }
        
        // Créer le nouvel événement
        data.events[eventTitle] = {
            "lieu": lieu,
            "date": date,
            "organisateur": organisateur,
            "mail": mail,
            "numéro de téléphone": telephone,
            "adapté PMR": adaptePMR,
            "description": description,
            "participants": {}
        };
        
        // Sauvegarder dans localStorage
        localStorage.setItem('eventsData', JSON.stringify(data));
        
        console.log(`Événement "${eventTitle}" ajouté avec succès !`);
        console.log('Données complètes :', data);
        
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
}