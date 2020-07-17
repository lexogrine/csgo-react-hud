import React from "react";
import "./../Styles/maps.css";
import { isDev } from './../../api/api';
import { CSGO } from "csgogsi";
import LexoRadarContainer from './LexoRadar/LexoRadarContainer';



interface Props { radarSize: number, game: CSGO }
interface State {
    showRadar: boolean,
    radarSize: number,
    loaded: boolean,
    boltobserv:{
        css: boolean,
        maps: boolean
    }
}

export default class Radar extends React.Component<Props, State> {
    state = {
        showRadar: true,
        radarSize: 300,
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
            size={400}
            mapName={map.name.substring(map.name.lastIndexOf('/')+1)}
        />
        /*const { boltobserv, loaded } = this.state;
        if(!loaded) return null;
        let url = `/radar`;
        if(isDev){
            url = `http://localhost:${port}/radar`;
            url += `?devCSS=${boltobserv.css.toString()}`;
            url += `&devMaps=${boltobserv.maps.toString()}`;

        } else if(name) {
            url += "?hud="+name;
        }
        return <div id="radar_container" style={{width: `${this.props.radarSize}px`, height: `${this.props.radarSize}px`}}>
            <iframe src={url} height={`${this.props.radarSize}px`} width={`${this.props.radarSize}px`} id="iframe_radar" title="Boltobserv Radar">
            </iframe>
        </div>;*/
    }
}
