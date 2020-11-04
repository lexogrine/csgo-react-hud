import React from "react";
import { Map, PhaseRaw } from "csgogsi-socket";


interface IProps {
    phase: PhaseRaw | null,
    map: Map
}

export default class Timeout extends React.Component<IProps> {
    render() {
        const { phase, map } = this.props;
        const time = phase && Math.abs(Math.ceil(parseFloat(phase.phase_ends_in)));
        const team = phase && phase.phase === "timeout_t" ? map.team_t : map.team_ct;
        
        return (
            <div id={`timeout`} className={`${time && time > 2 && phase && (phase.phase === "timeout_t" || phase.phase === "timeout_ct") ? 'show' : ''} ${phase && (phase.phase === "timeout_t" || phase.phase === "timeout_ct") ? phase.phase.substr(8): ''}`}>
                { team.name } TIMEOUT
            </div>
        );
    }
}
