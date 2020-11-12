import React from 'react';
import * as I from '../../api/interfaces';
import "./teamoverview.scss";

interface IProps {
    team: I.Team,
    show: boolean,
    veto: I.Veto | null
}

export default class TeamOverview extends React.Component<IProps> {
	render() {
        if(!this.props.team) return null;
		return (
            null
        );
	}
}
