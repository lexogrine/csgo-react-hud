import React from 'react';
import { Team } from 'csgogsi-socket';

export default class WinIndicator extends React.Component<{ team: Team | null, show: boolean }> {
    render() {
        const {team, show} = this.props;
        if (!team) return null;
        return <div className={`win_round_container ${show ? 'show' : 'show'} ${team.orientation} ${team.side}`}>
            <div className={`color_parallelogram`}/>
            <div className={`win_text_container`}>
                <div className={`win_text`}>WINS THE ROUND</div>
            </div>
        </div>
    }
}
