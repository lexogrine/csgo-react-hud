import React from "react";
import "./radar.scss";
import { Match } from "../../api/interfaces";
import { Map, CSGO } from 'csgogsi-socket';
import { actions } from '../../App';
import Radar from './Radar'

interface Props { match: Match | null, map: Map, game: CSGO}
interface State { showRadar: boolean, radarSize: number }

export default class RadarMaps extends React.Component<Props, State> {
    state = {
        showRadar: true,
        radarSize: 400
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
        return (
            <div id={`radar_maps_container`} className={`${!this.state.showRadar ? 'hide':''}`}>
                <Radar radarSize={this.state.radarSize} game={this.props.game}/>
            </div>
        );
    }
}