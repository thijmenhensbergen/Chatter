const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

async function loadRooms() {
    try {
        const response = await fetch('http://localhost:3000/api/rooms');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const rooms = await response.json();

        const roomList = document.getElementById('mainRoomList');
        roomList.innerHTML = '';

        rooms.forEach(room => {
            appendRoom(room.ID, room.Tag);
        });
    } catch (err) {
        console.error('No rooms found :( - ', err);
    }
}

async function appendRoom(roomID, tag) {
    const roomHTML = `
        <div class="col d-flex justify-content-center">
            <a href="/room?room=${roomID}"><div class="dot">${tag}</div></a>
        </div>
    `;
    const roomList = document.getElementById('mainRoomList');
    roomList.insertAdjacentHTML('beforeend', roomHTML);
}
document.getElementById('accountButton').addEventListener('click', async (e) => {
    window.location.href = window.location.origin + "/account";
})
loadRooms();