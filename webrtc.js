const peers = {}; // Store connected peers
let localConnection;

// Initialize a peer connection
export function createConnection(peerId, signalingCallback) {
    const connection = new RTCPeerConnection();

    // Data channel for communication
    const dataChannel = connection.createDataChannel('data');
    dataChannel.onmessage = (event) => console.log(`Message from ${peerId}:`, event.data);

    connection.onicecandidate = (event) => {
        if (event.candidate) {
            signalingCallback(peerId, JSON.stringify({ candidate: event.candidate }));
        }
    };

    connection.ondatachannel = (event) => {
        event.channel.onmessage = (msg) => console.log(`Received from ${peerId}: ${msg.data}`);
    };

    peers[peerId] = { connection, dataChannel };

    return connection;
}

// Send a message to all peers
export function broadcastMessage(message) {
    Object.values(peers).forEach(({ dataChannel }) => {
        if (dataChannel.readyState === 'open') {
            dataChannel.send(message);
        }
    });
}
