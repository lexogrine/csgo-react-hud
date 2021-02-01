import React from 'react';
import './tournament.scss';
import { actions } from '../../App';
import * as I from './../../api/interfaces';
import api from '../../api/api';
import Ladder from './Ladder';
interface State {
    tournament: I.Tournament | null,
    teams: I.Team[],
    matches: I.Match[],
    show: boolean,
}
export default class Tournament extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            tournament: null,
            matches: [],
            teams: [],
            show: false
        }
    }
    async componentDidMount() {
        const { tournament } = await api.tournaments.get();
        if(tournament){
            actions.on("showTournament", async (show: string) => {
                if(show !== "show"){
                    return this.setState({show: false});
                }
                
                this.setState({tournament}, () => {
                    this.setState({show:true})
                });
            });
            
            Promise.all([api.match.get(), api.teams.get()]).then(([matches, teams]) =>{
                this.setState({matches, teams});
            });
        }
    }
	render() {
        const { tournament, matches, teams, show } = this.state;
        if(!tournament) return null;
		return (
			<div className={`ladder-container ${show ? 'show':''}`}>
                <div className="tournament-data">
                    { tournament.logo ? <img src={`data:image/jpeg;base64,${tournament.logo}`} alt={tournament.name} /> : null }
                    <div className="tournament-name">
                        {tournament.name}
                    </div>
                </div>
                <Ladder
                    tournament={tournament}
                    matches={matches}
                    teams={teams}
                />

            </div>
		);
	}

}
