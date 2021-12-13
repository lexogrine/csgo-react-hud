import { Player } from "csgogsi-socket";
import PlayerCamera from "./../Camera/Camera";
import "./index.scss";
type Props = {
    players: Player[],
    visible: boolean;
}

const PlayerFaces = ({ players, visible }: Props) => {
    return <div className={`player-faces ${visible ? 'visible':''}`}>
        {players.map(player => (
            <PlayerCamera steamid={player.steamid} visible={true} />
        ))}
    </div>
}

export default PlayerFaces;