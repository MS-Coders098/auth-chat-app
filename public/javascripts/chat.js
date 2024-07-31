const socket = io("/chat");
// const { Buffer } = require("buffer")

// Retrieve user from the server and store in localStorage
socket.on("send-user", (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));
});

document.addEventListener("DOMContentLoaded", function () {
    // Load messages when the chat window is opened
    socket.emit("load-messages");

    socket.on("messages-loaded", (messages) => {
        messages.forEach((msg, index) => {
            const position = msg.user._id === JSON.parse(localStorage.getItem('user'))._id ? 'right' : 'left';
            sendMessage(msg.message, position, msg.user, msg._id);

            if (index === messages.length - 1) {
                const messageElements = document.querySelectorAll('.message');
                const lastMessage = messageElements[messageElements.length - 1];
                lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        });
    });
})

// Handle sent message (from self)
socket.on("message-sender", (data) => {
    sendMessage(data.message, 'right', data.user);
});

// Handle received message (from others)
socket.on("message-receiver", (data) => {
    sendMessage(data.message, 'left', data.user);
});

// Send message
function handleSendMessage(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(message)

    socket.emit("send-message", { message, user });
    document.getElementById('message').value = '';
}

// Function to add a message to the chat
function sendMessage(msg, position, user, id) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', position);

    const userDetailsDiv = document.createElement('div');
    userDetailsDiv.classList.add('flex', 'items-center', 'gap-5');

    const userImage = document.createElement('img');
    const buffer = new Uint8Array(user.profilePic.data); // Replace ... with the rest of the buffer
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    userImage.src = url;
    userImage.alt = 'user';
    userImage.classList.add('rounded-full', 'h-12', 'w-12', 'object-cover');

    const userNameSpan = document.createElement('span');
    userNameSpan.classList.add('user-name', 'text-lg', 'font-bold');
    userNameSpan.textContent = user.fullname; // Use actual user name

    const date = new Date();

    const dateSpan = document.createElement("span")
    dateSpan.classList.add('date', 'text-md', 'font-light');
    dateSpan.textContent = date.toLocaleDateString();

    userDetailsDiv.appendChild(userImage);
    userDetailsDiv.appendChild(userNameSpan);
    userDetailsDiv.appendChild(dateSpan);

    const paragraph = document.createElement('p');
    paragraph.classList.add('text');
    paragraph.textContent = msg;

    messageContainer.appendChild(userDetailsDiv);
    messageContainer.appendChild(paragraph);

    document.getElementById('chat-messages').appendChild(messageContainer);

    const messageElements = document.querySelectorAll('.message');
    const lastMessage = messageElements[messageElements.length - 1];
    lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
}