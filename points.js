
raw_user = localStorage.getItem("current_user");

if (raw_user) {
    current_user = JSON.parse(raw_user);
}
function addPoints(userKey, points) {

    current_user.points += points;
}

function getBadges(points) {
    if (points >= 20) return "🥇 Or";
    if (points >= 10) return "🥈 Argent";
    if (points >= 5) return "🥉 Bronze";
    return "Débutant";
}