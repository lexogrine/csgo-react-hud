import { Instance, SignalData } from 'simple-peer';
import api from '../../api/api';
import { socket as Socket } from "../../App";
const Peer = require('simple-peer');

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

type OfferData = {
    offer: SignalData,
}

type PeerInstance = Instance & { _remoteStreams: MediaStream[] }

type MediaStreamPlayer = {
    peerConnection: PeerInstance | null;
    steamid: string;
}

type ListenerType = ({ listener: (stream: MediaStream) => void, event: 'create', steamid: string } | ({ listener: () => void, event: 'destroy', steamid: string }));

type MediaStreamManager = {
    blocked: string[];
    blockedListeners: ((blocked: string[]) => void)[],
    players: MediaStreamPlayer[];
    onStreamCreate: (listener: (stream: MediaStream) => void, steamid: string) => void;
    onStreamDestroy: (listener: () => void, steamid: string) => void;
    onBlockedUpdate: (listener: (steamids: string[]) => void) => void;
    removeListener: (listener: any) => void;
    listeners: ListenerType[];
}

const mediaStreams: MediaStreamManager = {
    blocked: [],
    blockedListeners: [],
    players: [],
    listeners: [],
    onStreamCreate: (listener: (stream: MediaStream) => void, steamid: string) => {
        mediaStreams.listeners.push({ listener, event: "create", steamid });
    },
    onBlockedUpdate: (listener: (blocked: string[]) => void) => {
        mediaStreams.blockedListeners.push(listener);
    },
    onStreamDestroy: (listener: () => void, steamid: string) => {
        mediaStreams.listeners.push({ listener, event: "destroy", steamid });
    },
    removeListener: (listenerToRemove: any) => {
        mediaStreams.listeners = mediaStreams.listeners.filter(listener => listener !== listenerToRemove);
        mediaStreams.blockedListeners = mediaStreams.blockedListeners.filter(listener => listener !== listenerToRemove);
    }
};

const getConnectionInfo = (steamid: string) => mediaStreams.players.find(player => player.steamid === steamid) || null;

const closeConnection = (steamid: string) => {
    const connectionInfo = getConnectionInfo(steamid);
    try {
        if(connectionInfo){
            if(connectionInfo.peerConnection){
                connectionInfo.peerConnection.removeAllListeners();
                connectionInfo.peerConnection.destroy();
            }
            connectionInfo.peerConnection = null;
        }
    } catch {

    }
        
    for(const listener of mediaStreams.listeners.filter(listener => listener.steamid === steamid)){
        if(listener.event === "destroy") listener.listener();
    }
    mediaStreams.players = mediaStreams.players.filter(player => player.steamid !== steamid);
    console.log(mediaStreams.players)
}

const initiateConnection = async () => {
    const socket = Socket as SocketIOClient.Socket;
    const camera = await api.camera.get();
    await wait(1000);

    socket.emit("registerAsHUD", camera.uuid);

    socket.on('playersCameraStatus', (players: { steamid: string, label: string, allow: boolean, active: boolean }[]) => {
        const blockedSteamids = players.filter(player => !player.allow).map(player => player.steamid);
        mediaStreams.blocked = blockedSteamids;

        for(const listener of mediaStreams.blockedListeners){
            listener(blockedSteamids);
        }
    });

    socket.on('offerFromPlayer', async (roomId: string, offerData: OfferData, steamid: string) => {
        // It's not from available player, ignore incoming request
        /*if(!camera.availablePlayers.find(player => player.steamid === steamid)){
            console.log("Wrong player");
            return;
        }*/
        const currentConnection = getConnectionInfo(steamid);
        
        // Connection already made, ignore incoming request
        if(currentConnection){
            console.log("Connection has been made already");
            return;
        }

        if (camera.uuid !== roomId) return;
        
        const peerConnection: PeerInstance = new Peer({ initiator: false, trickle: false });

        const mediaStreamPlayer: MediaStreamPlayer = { peerConnection, steamid };

        mediaStreams.players.push(mediaStreamPlayer);

        peerConnection.on('signal', answer => {
            console.log("SIGNAL COMING IN");
            const offer = JSON.parse(JSON.stringify(answer)) as RTCSessionDescriptionInit;
            socket.emit("offerFromHUD", roomId, { offer }, steamid);
        });

        peerConnection.on('error', (err) => {
            console.log(err)
            closeConnection(steamid);
        });
        
        peerConnection.on('stream', () => {
            console.log("STREAM COMING IN");
            const currentConnection = getConnectionInfo(steamid);
            if(!currentConnection){
                console.log("Connection not established");
                closeConnection(steamid);
                return;
            }
            if(peerConnection._remoteStreams.length === 0){
                console.log('no stream?');
                return;
            }
            for(const listener of mediaStreams.listeners.filter(listener => listener.steamid === steamid)){
                if(listener.event === "create") listener.listener(peerConnection._remoteStreams[0]);
            }
        });

        peerConnection.on('close', () => {
            console.log("CLOSE COMING IN");
            const currentConnection = getConnectionInfo(steamid);
            if (!currentConnection) return;

            closeConnection(steamid);
        });
        console.log("Sending offer");
        peerConnection.signal(offerData.offer);
    });
}

export { mediaStreams, initiateConnection };