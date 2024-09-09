import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});

const logStream = fs.createWriteStream('server.log', { flags: 'a' });
// Override console.log to write to both the file and the console
const originalConsoleLog = console.log;
console.log = (...args) => {
    logStream.write(args.join(' ') + '\n');
    originalConsoleLog(...args);
};

app.get('/', (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Hello\nNode is running\nMade with ❤️ from Dots....");
});
app.get('/node', (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Hello\nNode is running\nMade with ❤️ from Dots....");
});

app.post('/sendNotice', (req, res) => {
    const { user, data } = req.body;
    console.log(JSON.stringify(req.body));
    io.emit('receiveNotificationToUser_' + user, data);
    res.sendStatus(200);
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('sendNotice', (obj) => {
        socket.broadcast.emit('receiveNotificationToUser_' + obj.user, obj.data);
    });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
