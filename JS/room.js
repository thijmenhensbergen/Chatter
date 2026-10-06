const socket = io('http://localhost:3000');

const messageList = document.querySelector('.mainTextList');

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

socket.on('new_message', (data) => {
    var url = new URL(window.location.href);
    const roomID = url.searchParams.get("room");
    console.log('New message:', data);
    if (data.RoomID == roomID) {
        appendMessage(data.username, data.text);
    }
});

async function loadExistingMessages() {
    var url = new URL(window.location.href);
    const roomID = url.searchParams.get("room");
    try {
        const response = await fetch('http://localhost:3000/api/messages?RoomID=' + roomID);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const messages = await response.json();

        messageList.innerHTML = '';

        messages.forEach(msg => {
            appendMessage(msg.AccountID, msg.Body);
        });
    } catch (err) {
        console.error('No msgs found :( - ', err);
    }
}

function appendMessage(username, text) {
    const messageHTML = `
        <div class="d-flex flex-row mb-3">
            <img src="https://picsum.photos/32" width="32" height="32" class="rounded">
            <div class="d-flex flex-column text-light ms-2 mt-1">
                <p class="fw-bold mb-0">${username}</p>
                <p class="mb-0">${text}</p>
            </div>
        </div>
    `;

    messageList.insertAdjacentHTML('beforeend', messageHTML);
    window.scrollTo(0, document.body.scrollHeight);
}

document.getElementById('sendbutton').addEventListener('click', async (e) => {
    const input = document.getElementById('textinput');
    const messageText = input.value.trim();
    var url = new URL(window.location.href);
    const roomID = url.searchParams.get("room");
    if (!messageText) return;

    try {
        const response = await fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'ph',
                message_text: messageText,
                roomID: roomID
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        input.value = '';
    } catch (err) {
        console.error('Error', err);
    }
});

document.getElementById('roomListButton').addEventListener('click', async (e) => {
    window.location.href = window.location.origin;
})


loadExistingMessages();
