const form = document.getElementById('propositionForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    successMessage.style.display = 'block';
    form.reset();
    
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 5000);

    /*

    // Read JSON
    const fs = require('fs');
    const fichierJson = fs.readFileSync('events.json', 'utf8');

    // Parse JSON dile
    let data = JSON.parse(fichierJson);

    // Data recovery
    const eventTitle = nameInput.value;

    const newEvent = {
        "lieu": lieuInput.value,
        "date": dateInput.value,
        "organisateur": nameInput.value,
        "mail": emailInput.value,
        "numéro de téléphone": phoneInput.value,
        "option": optionInput.value, 
        "theme": themeInput.value, 
        "description": descriptionInput.value,
        "participants": "" // empty at first
    };

    // add newEvent
    data.events[eventTitle] = newEvent;

    // Write new data
    const contenuFichier = JSON.stringify(data, null, 2);
    fs.writeFileSync('events.json', contenuFichier, 'utf8');

    // Verif 
    console.log(`Événement "${eventTitle}" ajouté avec succès !`);
    */

    
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});