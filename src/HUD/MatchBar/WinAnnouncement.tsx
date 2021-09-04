import React from 'react';
import "./win_announcement.scss";

interface IProps {
    team_name: string;
    side: "CT" | "T";
    show: boolean;
}

export default class WinAnnouncement extends React.Component<IProps> {
    render() {
        const {team_name, side, show} = this.props;
        return <div className={`win_announcement_container ${show ? 'show' : ''} ${side}`}>
            <div className={`parallelogram bottom-left below`}/>
            <div className={`parallelogram middle`}>
                <div className={`team_name_container`}>{team_name}</div>
                <div className={`win_text`}>WINS THE ROUND</div>
            </div>
            <div className={`parallelogram top-right below`}/>
        </div>
    }
}
