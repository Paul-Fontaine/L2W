const nom_field = document.getElementById("nom");
const mail_field = document.getElementById("mail");
const points_field = document.getElementById("points");

const rawUser = localStorage.getItem("current_user");

if (rawUser) {
    const user = JSON.parse(rawUser);
    const fullName = `${user.prenom} ${user.nom}`;
    nom_field.textContent = fullName ?? "";
    mail_field.textContent = user.email
    points_field.textContent = user.points
}
