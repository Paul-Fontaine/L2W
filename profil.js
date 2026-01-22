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
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".card__btn");

    logoutButton.addEventListener("click", () => {
        // Clear the current user from localStorage
        localStorage.removeItem("current_user");

        // Redirect to the login page
        window.location.href = "connexion.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("loginLink");

    const rawUser = localStorage.getItem("current_user");

    if (rawUser) {
        // If a user is logged in, change the text and behavior of the link
        loginLink.textContent = "Déconnexion";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default link behavior
            localStorage.removeItem("current_user"); // Log out the user
            window.location.reload(); // Reload the page to reflect changes
        });
    } else {
        // If no user is logged in, redirect to the login page
        loginLink.addEventListener("click", () => {
            window.location.href = "connexion.html";
        });
    }
});
