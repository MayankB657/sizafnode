import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import fs from 'fs';
import bodyParser from "body-parser";
import { checkKeyM } from './checkkey.js'; 

const app = express().use(bodyParser.json());
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});

const logStream = fs.createWriteStream('server.log', { flags: 'a' });
const originalConsoleLog = console.log;
console.log = (...args) => {
    logStream.write(args.join(' ') + '\n');
    originalConsoleLog(...args);
};
checkKeyM(app);
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
app.get('/node', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/received', (req, res) => {
    const { user, data } = req.body;
    console.log(user);
    io.sockets.emit('receivedfor_' + user, data);
    res.sendStatus(200);
});

io.on('connection', (socket) => {
    socket.on('received', (data) => {
        io.sockets.emit('receivedfor_' + data.user, data);
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
