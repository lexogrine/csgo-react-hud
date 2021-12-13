import React, { useEffect, useState } from "react";
import PlayerCamera from ".";
import api from "../../api/api";
import { socket } from "../../App";
import "./index.scss";



const CameraContainer = ({ observedSteamid }: { observedSteamid: string | null }) => {
    const [sock, setSocket] = useState<SocketIOClient.Socket | null>(null);
    const [room, setRoom] = useState('');
    const [ players, setPlayers ] = useState<string[]>([]);

    useEffect(() => {
        const sock = socket as SocketIOClient.Socket;
        api.camera.get().then(response => {
            setTimeout(() => {
                sock.emit("registerAsHUD", response.uuid);
            }, 1000);
            setPlayers(response.availablePlayers.map(player => player.steamid));
            setRoom(response.uuid);
        });

        setSocket(sock);
    }, []);

    if (!sock || !room || !players.length) {
        return null;
    }

    return <div id="cameras-container">
        {
            players.map(steamid => (<PlayerCamera key={steamid} roomId={room} steamid={steamid} socket={sock} visible={observedSteamid === steamid} />))
        }
    </div>
}

export default CameraContainer;