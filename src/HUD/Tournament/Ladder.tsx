import React from 'react';
import * as I from './../../api/interfaces';

interface MatchData {
	left: { name: string; score: string | number; logo: string };
	right: { name: string; score: string | number; logo: string };
}
interface Props {
    tournament: I.Tournament,
    matches: I.Match[],
    teams: I.Team[]
}

export default class Ladder extends React.Component<Props> {
	joinParents = (matchup: I.TournamentMatchup, matchups: I.TournamentMatchup[]) => {
		const { tournament } = this.props;
		if (!tournament || !matchup) return matchup;

		if (matchup.parents.length) return matchup;

		const parents = matchups.filter(m => m.winner_to === matchup._id || m.loser_to === matchup._id);
		if (!parents.length) return matchup;
		matchup.parents.push(...parents.map(parent => this.joinParents(parent, matchups)));

		return matchup;
	};

	copyMatchups = (): I.DepthTournamentMatchup[] => {
		if (!this.props.tournament) return [];
		const matchups = JSON.parse(JSON.stringify(this.props.tournament.matchups)) as I.DepthTournamentMatchup[];
		return matchups;
	};

	setDepth = (matchups: I.DepthTournamentMatchup[], matchup: I.DepthTournamentMatchup, depth: number, force = false) => {
		const getParents = (matchup: I.DepthTournamentMatchup) => {
			return matchups.filter(parent => parent.loser_to === matchup._id || parent.winner_to === matchup._id);
		};

		if (!matchup.depth || force) {
			matchup.depth = depth;
			getParents(matchup).forEach(matchup => this.setDepth(matchups, matchup, depth + 1));
		}
		if (matchup.depth <= depth - 1) {
			this.setDepth(matchups, matchup, depth - 1, true);
		}
		return matchup;
	};

	getMatch = (matchup: I.TournamentMatchup) => {
		const { matches } = this.props;
		const matchData: MatchData = {
			left: { name: 'TBD', score: '-', logo: '' },
			right: { name: 'TBD', score: '-', logo: '' }
		};
		const match = matches.find(match => match.id === matchup.matchId);
		if (!match) return matchData;
		const teams = [
			this.props.teams.find(team => team._id === match.left.id),
			this.props.teams.find(team => team._id === match.right.id)
		];
		if (teams[0]) {
			matchData.left.name = teams[0].name;
			matchData.left.score = match.left.wins;
			matchData.left.logo = teams[0].logo;
		}
		if (teams[1]) {
			matchData.right.name = teams[1].name;
			matchData.right.score = match.right.wins;
			matchData.right.logo = teams[1].logo;
		}
		return matchData;
	};

	renderBracket = (
		matchup: I.DepthTournamentMatchup | null | undefined,
		depth: number,
		fromChildId: string | undefined,
		childVisibleParents: number,
		isLast = false
	) => {
		const { tournament, matches } = this.props;
		if (!matchup || !tournament) return null;
		const match = this.getMatch(matchup);

		if (fromChildId === matchup.loser_to) return null;
		const parentsToRender = matchup.parents.filter(matchupParent => matchupParent.loser_to !== matchup._id);
		if (matchup.depth > depth) {
			return (
				<div className="empty-bracket">
					{this.renderBracket(matchup, depth + 1, fromChildId, parentsToRender.length)}
					<div className="connector"></div>
				</div>
			);
        }
        const currentMatch = matches.find(mtch => mtch.current);
        const isCurrent = currentMatch && currentMatch.id === matchup.matchId;
		return (
			<div className={`bracket depth-${depth}`}>
				<div className="parent-brackets">
					{this.renderBracket(matchup.parents[0], depth + 1, matchup._id, parentsToRender.length)}
					{this.renderBracket(matchup.parents[1], depth + 1, matchup._id, parentsToRender.length)}
				</div>
				<div className="bracket-details">
					<div
						className={`match-connector ${
							!matchup.parents.length || parentsToRender.length === 0 ? 'first-match' : ''
							} ${isLast ? 'last-match' : ''}`}
					></div>
					{parentsToRender.length === 1 ? <div className="loser-parent-indicator"></div> : null}
					<div className={`match-details ${isCurrent ? 'current':''}`}>
						<div className="team-data">
							<div className="team-logo">
								{match.left.logo ? <img src={match.left.logo} alt="Logo" /> : null}
							</div>
							<div className="team-name">{match.left.name}</div>
							<div className="team-score">{match.left.score}</div>
						</div>
						<div className="team-data">
							<div className="team-logo">
								{match.right.logo ? <img src={match.right.logo} alt="Logo" /> : null}
							</div>
							<div className="team-name">{match.right.name}</div>
							<div className="team-score">{match.right.score}</div>
						</div>
					</div>
				</div>

				{childVisibleParents === 2 ? (
					<div className={`connector amount-${parentsToRender.length}`}></div>
				) : null}
			</div>
		);
	};

	render() {
		const { tournament } = this.props;
		if (!tournament) return null;
		const matchups = this.copyMatchups();
		const gf = matchups.find(matchup => matchup.winner_to === null);
		if (!gf) return null;
		const joinedParents = this.joinParents(gf, matchups);
		const matchupWithDepth = this.setDepth(matchups, joinedParents as I.DepthTournamentMatchup, 0);
		return this.renderBracket(matchupWithDepth, 0, undefined, 2, true);
	}
}
