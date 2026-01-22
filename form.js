const form = document.getElementById('propositionForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    successMessage.style.display = 'block';
    form.reset();
    
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 5000);
    
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});