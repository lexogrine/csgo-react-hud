import React from "react";
import { isDev } from './../../api/api';
import { CSGO } from "csgogsi-socket";
import LexoRadarContainer from './LexoRadar/LexoRadarContainer';



interface Props { radarSize: number, game: CSGO }
interface State {
    showRadar: boolean,
    loaded: boolean,
    boltobserv:{
        css: boolean,
        maps: boolean
    }
}

export default class Radar extends React.Component<Props, State> {
    state = {
        showRadar: true,
        loaded: !isDev,
        boltobserv: {
            css: true,
            maps: true
        }
    }
    async componentDidMount(){
        /*if(isDev){
            const response = await fetch('hud.json');
            const hud = await response.json();
            const boltobserv = {
                css: Boolean(hud && hud.boltobserv && hud.boltobserv.css),
                maps: Boolean(hud && hud.boltobserv && hud.boltobserv.maps)
            }
            this.setState({boltobserv, loaded: true});
        }*/
    }

    render() {
        const { players, player, bomb, grenades, map } = this.props.game; 
        return <LexoRadarContainer
            players={players}
            player={player}
            bomb={bomb}
            grenades={grenades}
            size={this.props.radarSize}
            mapName={map.name.substring(map.name.lastIndexOf('/')+1)}
        />
    }
}
