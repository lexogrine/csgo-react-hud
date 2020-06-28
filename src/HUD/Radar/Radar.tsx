import React from "react";
import "./../Styles/maps.css";
import {port, isDev } from './../../api/api';

const href = window.location.href;
let name = '';
if (href.indexOf('/huds/') !== -1) {
    const segment = href.substr(href.indexOf('/huds/') + 6);
    name = segment.substr(0, segment.lastIndexOf('/'));
}

interface Props { radarSize: number }
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
        if(isDev){
            const response = await fetch('hud.json');
            const hud = await response.json();
            const boltobserv = {
                css: Boolean(hud && hud.boltobserv && hud.boltobserv.css),
                maps: Boolean(hud && hud.boltobserv && hud.boltobserv.maps)
            }
            this.setState({boltobserv, loaded: true});
        }
    }

    render() {
        const { boltobserv, loaded } = this.state;
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
        </div>;
    }
}
