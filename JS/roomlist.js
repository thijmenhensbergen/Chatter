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
            <a href="/room?room=${roomID}" class="room-link">
                <div class="dot">
                    <span class="dot-text">${tag}</span>
                </div>
            </a>
        </div>
    `;
    const roomList = document.getElementById('mainRoomList');
    roomList.insertAdjacentHTML('beforeend', roomHTML);
}
document.getElementById('accountButton').addEventListener('click', async (e) => {
    window.location.href = window.location.origin + "/account";
})
async function checkIfAdminButtonShouldExist() {
    const response = await verifyAdmin();
    if (response == true) {
        console.log("Admin button created");
        const Button = document.createElement("button");
        const List = document.getElementById("buttonList");
        Button.classList = "btn btn-primary";
        Button.innerText = "ADMIN";
        Button.onclick = function() {window.location.href = window.location.origin + "/admin"}
        List.appendChild(Button);
    }
}
async function getAccountByToken() {
    const token = localStorage.getItem('accountToken');
    const response = await fetch(`http://localhost:3000/api/getprofilebytoken?token=${encodeURIComponent(token)}`);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

async function loadUserInfo()
{
    const user = await getAccountByToken();
    const pfpIcon = document.getElementById('pfpicon');
    pfpIcon.src = user.PFPURL;
}
checkIfAdminButtonShouldExist();
loadRooms();
loadUserInfo();