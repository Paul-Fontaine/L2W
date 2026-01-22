const dbName = "users";

function saveData(data) {
    localStorage.setItem(dbName, JSON.stringify(data));
}

function getData() {
    const data = localStorage.getItem(dbName);
    if (data) {
        return JSON.parse(data);
    } else {
        console.log("no users")
        return []
    }
}

function addPoints(email, points = 1) {
    const users = getData(); 

    const user = users.find(u => u.email === email);
    
    if (user) {
        user.points += points;
        saveData(users);
    } else {
        console.warn(`User with email ${email} not found. can't add points`);
    }
}

raw_user = localStorage.getItem("current_user");
if (raw_user) {
    current_user = JSON.parse(raw_user);
    addPoints(current_user.email, points=100);
}

function getBadges(points) {
    if (points >= 20) return "🥇 Or";
    if (points >= 10) return "🥈 Argent";
    if (points >= 5) return "🥉 Bronze";
    return "Débutant";
}