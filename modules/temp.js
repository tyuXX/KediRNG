var notifications = [];
const notificationInterval = 5000;
const notificationContainerDiv = document.getElementById("notifications");

function displayNotifications() {
    notificationContainerDiv.innerHTML = "";
    notifications.forEach((notification) => {
        const notificationDiv = document.createElement("div");
        notificationDiv.classList.add("notification");
        notificationDiv.innerHTML = `
            <p>${notification.text}</p>
            <button onclick="closeNotification(${notification.id})">Close</button>
        `;
        notificationContainerDiv.appendChild(notificationDiv);
    });
}

function closeNotification(id) {
    notifications = notifications.filter((notification) => notification.id !== id);
    displayNotifications();
}

function notify(text) {
    const notification = { id: Math.random(), text };
    notifications.push(notification);
    displayNotifications();

    setTimeout(() => {
        closeNotification(notification.id);
    }, notificationInterval);
}


notify("Cheese");
notify("Cheese");