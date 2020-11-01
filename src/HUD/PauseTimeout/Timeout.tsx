import React from "react";
import { Map, PhaseRaw } from "csgogsi-socket";

function stringToClock(time: string | number, pad = true) {
    if (typeof time === "string") {
        time = parseFloat(time);
    }
    const countdown = Math.abs(Math.ceil(time));
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown - minutes * 60;
    if (pad && seconds < 10) {
        return `${minutes}:0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

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
