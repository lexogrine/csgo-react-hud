import React, { useEffect, useState } from "react";
import PlayerCamera from "./Camera";
import api from "../../api/api";
import "./index.scss";



const CameraContainer = ({ observedSteamid }: { observedSteamid: string | null }) => {
    const [ players, setPlayers ] = useState<string[]>([]);

    useEffect(() => {
        api.camera.get().then(response => {
            setPlayers(response.availablePlayers.map(player => player.steamid));
        });
    }, []);

    return <div id="cameras-container">
        {
            players.map(steamid => (<PlayerCamera key={steamid} steamid={steamid} visible={observedSteamid === steamid} />))
        }
    </div>
}

export default CameraContainer;