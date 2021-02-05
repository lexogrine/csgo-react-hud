import React from 'react';
import { actions, configs } from '../../App';
import * as I from '../../api/interfaces';
import PlayerOverview from '../PlayerOverview/PlayerOverview';
import MatchOverview from '../MatchOverview/MatchOverview';
import TeamOverview from '../TeamOverview/TeamOverview';
import { Map, Player } from 'csgogsi';
import api from '../../api/api';

interface IState {
    player: {
        data: I.Player | null,
        show: boolean
    },
    match: {
        data: I.Match | null,
        show: boolean,
        teams: I.Team[],
    },
    team: {
        data: I.Team | null,
        show: boolean
    }
}

interface IProps {
    match: I.Match | null,
    map: Map,
    players: Player[]
}

export default class Overview extends React.Component<IProps, IState> {
    constructor(props: IProps){
        super(props);
        this.state = {
            player: {
                data: null,
                show: false
            },
            match: {
                data: null,
                show: false,
                teams: []
            },
            team: {
                data: null,
                show: false,
            }
        }
    }
    loadTeams = async () => {
        const { match } = this.state;
        if(!match.data || !match.data.left.id || !match.data.right.id) return;
        const teams = await Promise.all([api.teams.getOne(match.data.left.id), api.teams.getOne(match.data.right.id)]);
        if(!teams[0] || !teams[1]) return;
        this.setState(state => {
            state.match.teams = teams;
            return state;
        });
    }
    componentDidMount() {
        configs.onChange((data: any) => {
            if(!data || !data.preview_settings) return;
            this.setState({
                player: {
                    data: (data.preview_settings.player_preview && data.preview_settings.player_preview.player) || null,
                    show: Boolean(data.preview_settings.player_preview_toggle)
                },
                team: {
                    data: (data.preview_settings.team_preview && data.preview_settings.team_preview.team) || null,
                    show: Boolean(data.preview_settings.team_preview_toggle)
                },
                match: {
                    data: (data.preview_settings.match_preview && data.preview_settings.match_preview.match) || null,
                    show: Boolean(data.preview_settings.match_preview_toggle),
                    teams: this.state.match.teams
                }
            }, this.loadTeams);
        });
        actions.on("toggleUpcomingMatch", () => {
            this.setState(state => {
                state.match.show = !state.match.show;
                return state;
            })
        })
        actions.on("togglePlayerPreview", () => {
            this.setState(state => {
                state.player.show = !state.player.show;
                return state;
            })
        })
    }
    getVeto = () => {
        const { map, match } = this.props;
        if(!match) return null;
        const mapName = map.name.substring(map.name.lastIndexOf('/')+1);
        const veto = match.vetos.find(veto => veto.mapName === mapName);
        if(!veto) return null;
        return veto;
    }
    renderPlayer = () => {
        const { player } = this.state;
        if(!player.data) return null;
        return <PlayerOverview round={this.props.map.round + 1} player={player.data} players={this.props.players} show={player.show} veto={this.getVeto()} />
    }
    renderMatch = () => {
        const { match } = this.state;
        if(!match.data || !match.teams[0] || !match.teams[1]) return null;
        return <MatchOverview match={match.data} show={match.show} veto={this.getVeto()} teams={match.teams}/>
    }
    renderTeam = () => {
        const { team } = this.state;
        if(!team.data) return null;
        return <TeamOverview team={team.data} show={team.show} veto={this.getVeto()} />
    }
	render() {
		return (
            <>
                {this.renderPlayer()}
                {this.renderMatch()}
                {this.renderTeam()}
            </>
        );
	}
}
