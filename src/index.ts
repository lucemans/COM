import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const wss = new WebSocket.Server({ port: 8080 });

const devices: Device[] = [];

export default class Device {
    id: string;
    ws: WebSocket
    labels: string[]
}

wss.on('connection', function connection(ws) {
    let device;

    ws.on('message', function incoming(message) {
        const msg = message.toString().replace('\n', '');
        const words = msg.split(' ');
        console.log("> " + msg);
        switch (words[0].toUpperCase()) {
            case 'AUTH':
                if (words.length == 1) {
                    console.log('Invalid Auth Args');
                    ws.send('500 invalid auth');
                    break;
                }
                if (words[1] != process.env.SECRET) {
                    console.log('Invalid Token Presented ');
                    ws.send('403 Forbidden');
                    break;
                }
                console.log('AUTH ATTEMPT');
                ws.send('200 OK');

                const _device = new Device();
                _device.ws = ws;
                device = _device;
                devices.push(device);
                break;
            case 'ID':
                if (!!!device) {
                    console.log('Device attempted to set ID but wasnt authorized');
                    ws.send('500 invalid id');
                    break;
                }
                if (device.id) {
                    console.log('Device already had ID');
                    ws.send('500 You already have an ID');
                    break;
                }
                if (words.length == 1) {
                    console.log('Device did not send ID');
                    ws.send('500 invalid id');
                    break;
                }
                devices.forEach((a) => {
                    if (a.id == words[1]) {
                        // DISCONNECT DEVICE
                        a.ws.send('500 ID Re-Registered');
                        a.ws.close();
                        a.ws.terminate();
                    }
                });
                device.id = words[1];
                break;
            case 'LABEL':

                break;
            case 'DEVICES':
                devices.forEach((a) => {
                    ws.send("DEVICE " + a.id);
                });
                break;
            default:
                ws.send('500 undefined command');
                break;
        }
    });

    ws.send('something');
});