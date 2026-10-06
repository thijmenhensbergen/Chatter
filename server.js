const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

async function queryDatabase(sql, params = []) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'bit_academy',
        password: 'bit_academy',
        database: 'chatter'
    });
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } finally {
        await connection.end();
    }
}

io.on('connection', (socket) => {
    console.log('User Conntected:', socket.id);
});

app.get('/api/messages', async (req, res) => {
    const roomID = req.query.RoomID; 
    
    console.log('trying to get messages for roomID: ' + roomID);
    
    if (!roomID) {
        return res.status(400).json({ error: "RoomID is needed" });
    }

    try {
        const sql = `SELECT * FROM messages WHERE RoomID = ? ORDER BY id ASC`;
        const messages = await queryDatabase(sql, [roomID]);
        
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/messages', async (req, res) => {
    const { username, message_text, roomID } = req.body;
    try {
        await queryDatabase(
            'INSERT INTO messages (accountid, body, RoomID) VALUES (?, ?, ?)', 
            [username, message_text, roomID]
        );
        
        io.emit('new_message', { username, text: message_text, RoomID: roomID });
        
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/rooms', async (req, res) => {
    console.log("trying to get rooms");
    try {
        const rooms = await queryDatabase('SELECT * FROM rooms ORDER BY ID ASC');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/verifytoken', async (req, res) => {
    const token = req.query.RoomID; 
    console.log("verifying token");
    try {
        const token = await queryDatabase(`SELECT * FROM users WHERE token = ${token}`);
        if (token) {
            res.json(true); // Ver successss!!!!
        } else {
            res.json(false); // Ver failed :(((
        }
    } catch (error) {
        res.status(500).json({ error: err.message });        
    }
})


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
