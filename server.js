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
    console.log('User Connected:', socket.id);
});

app.get('/api/messages', async (req, res) => {
    const roomID = req.query.RoomID;

    console.log('Trying to get messages for roomID:', roomID);

    if (!roomID) {
        return res.status(400).json({error: 'RoomID is needed'});
    }

    try {
        const messages = await queryDatabase('SELECT * FROM messages WHERE RoomID = ? ORDER BY id ASC', [roomID]);

        res.json(messages);

    } catch (err) {
        console.error(err);

        res.status(500).json({error: err.message});
    }
});

app.post('/api/messages', async (req, res) => {
    const {
        AccountID,
        message_text,
        roomID
    } = req.body;

    if (!AccountID || !message_text || !roomID) {
        return res.status(400).json({error: 'AccountID, message_text and roomID are required'});
    }

    try {
        await queryDatabase('INSERT INTO messages (accountid, body, RoomID) VALUES (?, ?, ?)', [AccountID, message_text, roomID]);

        const users = await queryDatabase('SELECT Name FROM users WHERE ID = ?', [AccountID]);

        if (users.length === 0) {
            return res.status(404).json({error: 'User not found'});
        }

        io.emit('new_message', {
            AccountID: AccountID,
            username: users[0].Name,
            text: message_text,
            RoomID: roomID
        });

        res.status(201).json({
            success: true
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({error: err.message});
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await queryDatabase('SELECT * FROM rooms ORDER BY ID ASC');

        res.json(rooms);

    } catch (err) {
        console.error(err);

        res.status(500).json({error: err.message});
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const rooms = await queryDatabase('SELECT ID, Name, PFPURL, Admin FROM users');
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
});

app.get('/api/verifytoken', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.json(false);
    }

    try {
        const users = await queryDatabase(
            'SELECT ID FROM users WHERE token = ?',
            [token]
        );

        res.json(users.length > 0);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/api/getprofilebytoken', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({
            error: 'Token is required'
        });
    }

    try {
        const users = await queryDatabase(
            'SELECT * FROM users WHERE token = ?',
            [token]
        );

        if (users.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(users[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/api/getprofilebyid', async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            error: 'ID is required'
        });
    }

    try {
        const users = await queryDatabase(
            'SELECT * FROM users WHERE ID = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(users[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.post('/api/updateAccount', async (req, res) => {
    const {
        NewUsername,
        NewPFPURL,
        Token
    } = req.body;

    try {
        await queryDatabase(
            'UPDATE users SET Name = ?, PFPURL = ? WHERE Token = ?',
            [
                NewUsername,
                NewPFPURL,
                Token
            ]
        );

        res.status(201).json({
            success: true
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
