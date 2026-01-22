const dbName = "users";

function saveData(data) {
    localStorage.setItem(dbName, JSON.stringify(data));
}

function getData() {
    const data = localStorage.getItem(dbName);
    return data ? JSON.parse(data) : [];
}

function addUser(user) {
    users = getData();
    users.push(user);
    saveData(users);
}

// Basculer entre les formulaires
const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');
const showSignin = document.getElementById('showSignin');
const showSignup = document.getElementById('showSignup');

showSignin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
});

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

// signup form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const prenom = document.getElementById('name').value.trim();
    const nom = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();

    const new_user = {
        "prenom": prenom,
        "nom": nom,
        "email": email
    }

    addUser(new_user)
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
})

// signin form submission
signinForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email_con').value.trim();

    users_list = getData()
    user = users_list.filter(user => user.email === email)[0]
    
    localStorage.setItem("current_user", JSON.stringify(user))
    
    
})