const prenom_field = document.getElementById("prenom");
const nom_field = document.getElementById("nom");

const rawUser = localStorage.getItem("current_user");

if (rawUser) {
    const user = JSON.parse(rawUser);
    prenom_field.textContent = user.prenom ?? "";
    nom_field.textContent = user.nom ?? "";
}
