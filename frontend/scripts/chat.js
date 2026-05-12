const messagesEl = document.getElementById('messages');
const usernameEl = document.getElementById('username');
const messageEl = document.getElementById('message');

async function sendMessage() {
    if (!usernameEl.value) return;
    if (!messageEl.value) return;

    // TODO: json body perhaps
    const message = await fetch(`${apiBaseUrl}/chat?${new URLSearchParams({
        content: messageEl.value,
        username: usernameEl.value
    }).toString()}`, { method: 'POST' }).then(res => res.json());

    addMessage(message);
}

function addMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');

    const dateEl = document.createElement('span');
    dateEl.classList.add('message-date');
    dateEl.textContent = new Date(message.date).toLocaleString();

    const usernameEl = document.createElement('span');
    usernameEl.classList.add('message-username');
    usernameEl.textContent = message.username;
    
    const contentEl = document.createElement('span');
    contentEl.classList.add('message-content');
    contentEl.textContent = message.content;

    messageEl.appendChild(dateEl);
    messageEl.appendChild(usernameEl);
    messageEl.appendChild(contentEl);

    messagesEl.appendChild(messageEl);
}