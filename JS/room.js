const socket = io('http://localhost:3000');
const messageList = document.querySelector('.mainTextList');

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

socket.on('new_message', (data) => {
    const url = new URL(window.location.href);
    const roomID = url.searchParams.get("room");

    console.log('New message:', data);

    if (data.RoomID == roomID) {
        appendMessage(data.username, data.text);
    }
});

async function getAccountByID(id) {
    const response = await fetch(
        `http://localhost:3000/api/getprofilebyid?id=${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

async function loadExistingMessages() {
    const url = new URL(window.location.href);
    const roomID = url.searchParams.get("room");

    try {
        const response = await fetch(
            `http://localhost:3000/api/messages?RoomID=${encodeURIComponent(roomID)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const messages = await response.json();

        messageList.innerHTML = '';

        for (const msg of messages) {
            try {
                const account = await getAccountByID(msg.AccountID);

                appendMessage(
                    account.Name,
                    msg.Body
                );
            } catch (err) {
                console.error('Could not get account:', err);
                appendMessage('Unknown User', msg.Body);
            }
        }

    } catch (err) {
        console.error('No msgs found :( - ', err);
    }
}

function appendMessage(username, text) {
    const container = document.createElement('div');
    container.className = 'd-flex flex-row mb-3';

    const img = document.createElement('img');
    img.src = 'https://picsum.photos/32';
    img.width = 32;
    img.height = 32;
    img.className = 'rounded';

    const content = document.createElement('div');
    content.className = 'd-flex flex-column text-light ms-2 mt-1';

    const usernameElement = document.createElement('p');
    usernameElement.className = 'fw-bold mb-0';
    usernameElement.textContent = username;

    const messageElement = document.createElement('p');
    messageElement.className = 'mb-0';
    messageElement.textContent = text;

    content.appendChild(usernameElement);
    content.appendChild(messageElement);

    container.appendChild(img);
    container.appendChild(content);

    messageList.appendChild(container);

    messageList.scrollTop = messageList.scrollHeight;
}

document.getElementById('sendbutton').addEventListener('click', async () => {
    const input = document.getElementById('textinput');
    const messageText = input.value.trim();

    const url = new URL(window.location.href);
    const roomID = url.searchParams.get("room");

    console.log("Message:", messageText);
    console.log("Room ID:", roomID);

    if (!messageText) {
        return;
    }

    if (!roomID) {
        console.error("No room ID in URL!");
        return;
    }

    const token = localStorage.getItem('accountToken');

    console.log("Token:", token);

    if (!token) {
        console.error("No account token found!");
        return;
    }

    try {
        const profileResponse = await fetch(`http://localhost:3000/api/getprofilebytoken?token=${encodeURIComponent(token)}`);

        if (!profileResponse.ok) {
            const errorText = await profileResponse.text();
            console.error("Profile error:", errorText);

            throw new Error(`Profile HTTP error: ${profileResponse.status}`);
        }

        const profile = await profileResponse.json();

        if (!profile.ID) {
            throw new Error("Profile does not contain an ID");
        }

        const response = await fetch('http://localhost:3000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    AccountID: profile.ID,
                    message_text: messageText,
                    roomID: roomID
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error("Message server error:", errorText);

            throw new Error(
                `HTTP error: ${response.status} - ${errorText}`
            );
        }

        input.value = '';

    } catch (err) {
        console.error('Error', err);
    }
});


document.getElementById('roomListButton').addEventListener('click', () => {
    window.location.href = window.location.origin;
});

loadExistingMessages();