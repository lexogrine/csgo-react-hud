import React from "react";
import "./../Styles/maps.css";
import { Match, Veto } from "../../api/interfaces";
import { Map } from 'csgogsi';
import { actions } from './../../App';
import Radar from './Radar'

interface Props { match: Match | null, map: Map }
interface State { showRadar: boolean, radarSize: number }

export default class RadarMaps extends React.Component<Props, State> {
    state = {
        showRadar: true,
        radarSize: 350
    }
    componentDidMount() {
        actions.on('radarBigger', () => this.radarChangeSize(20));
        actions.on('radarSmaller', () => this.radarChangeSize(-20));
        actions.on('toggleRadar', () => { this.setState(state => ({ showRadar: !state.showRadar })) });
    }
    radarChangeSize = (delta: number) => {
		const newSize = this.state.radarSize+delta;
		this.setState({radarSize:newSize > 0 ? newSize : this.state.radarSize});
	}
    render() {
        const { match } = this.props;
        return (
            <div id={`radar_maps_container`} className={`${!this.state.showRadar ? 'hide':''}`}>
                <Radar radarSize={this.state.radarSize}/>
                {match ? <MapsBar match={this.props.match} map={this.props.map} />:null}
            </div>
        );
    }
}

class MapsBar extends React.PureComponent<Props> {
    render(){
        const { match, map } = this.props;
        if(!match || !match.vetos.length) return '';
        const picks = match.vetos.filter(veto => veto.type !== "ban");
        if(picks.length > 3) {
            const current = picks.find(veto => map.name.includes(veto.mapName));
            if(!current) return null;
            return <div id="maps_container">
                {<MapEntry veto={current} map={map} logo={current.type === "decider" ? null : map.team_ct.id === current.teamId ? map.team_ct.logo : map.team_t.logo}/>}
            </div>
        }
        return <div id="maps_container">
            {match.vetos.filter(veto => veto.type !== "ban").filter(veto => veto.teamId || veto.type === "decider").map(veto => <MapEntry key={veto.mapName} veto={veto} map={this.props.map} logo={veto.type === "decider" ? null : map.team_ct.id === veto.teamId ? map.team_ct.logo : map.team_t.logo}/>)}
        </div>
    }
}

class MapEntry extends React.PureComponent<{veto: Veto, map: Map, logo: string | null}> {
    render() {
        const { veto, map } = this.props;
        return <div className="veto_entry">
            <div className="team_logo">{this.props.logo ? <img src={`data:image/jpeg;base64,${this.props.logo}`} alt={map.name} /> : null}</div>
            <div className={`map_name ${map.name.includes(veto.mapName) ? 'active':''}`}>{veto.mapName}</div>
        </div>
    }
}