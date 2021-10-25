import React from 'react';
import Layout from './HUD/Layout/Layout';
import api, { port, isDev } from './api/api';
import { loadAvatarURL } from './api/avatars';
import ActionManager, { ConfigManager } from './api/actionManager';

import { CSGO, PlayerExtension, GSISocket } from "csgogsi-socket";
import { Match } from './api/interfaces';

export const { GSI, socket } = GSISocket(isDev ? `localhost:${port}` : '/', "update");

export const actions = new ActionManager();
export const configs = new ConfigManager();

export const hudIdentity = {
	name: '',
	isDev: false
};

interface DataLoader {
	match: Promise<void> | null
}

const dataLoader: DataLoader = {
	match: null
}

class App extends React.Component<any, { match: Match | null, game: CSGO | null, steamids: string[], checked: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
			game: null,
			steamids: [],
			match: null,
			checked: false
		}
	}

	verifyPlayers = async (game: CSGO) => {
		const steamids = game.players.map(player => player.steamid);
		steamids.forEach(steamid => {
			loadAvatarURL(steamid);
		})

		if (steamids.every(steamid => this.state.steamids.includes(steamid))) {
			return;
		}

		const loaded = GSI.players.map(player => player.steamid);

		const notCheckedPlayers = steamids.filter(steamid => !loaded.includes(steamid));

		const extensioned = await api.players.get(notCheckedPlayers);

		const lacking = notCheckedPlayers.filter(steamid => extensioned.map(player => player.steamid).includes(steamid));

		const players: PlayerExtension[] = extensioned
			.filter(player => lacking.includes(player.steamid))
			.map(player => (
				{
					id: player._id,
					name: player.username,
					realName: `${player.firstName} ${player.lastName}`,
					steamid: player.steamid,
					country: player.country,
					avatar: player.avatar,
					extra: player.extra,
				})
			);

		const gsiLoaded = GSI.players;

		gsiLoaded.push(...players);
		
		GSI.players = gsiLoaded;
		this.setState({ steamids });
	}


	componentDidMount() {
		this.loadMatch();
		const href = window.location.href;
		socket.emit("started");
		let isDev = false;
		let name = '';
		if (href.indexOf('/huds/') === -1) {
			isDev = true;
			name = (Math.random() * 1000 + 1).toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
			hudIdentity.isDev = true;
		} else {
			const segment = href.substr(href.indexOf('/huds/') + 6);
			name = segment.substr(0, segment.lastIndexOf('/'));
			hudIdentity.name = name;
		}

		socket.on("readyToRegister", () => {
			socket.emit("register", name, isDev);
		});
		socket.on(`hud_config`, (data: any) => {
			configs.save(data);
		});
		socket.on(`hud_action`, (data: any) => {
			actions.execute(data.action, data.data);
		});
		socket.on('keybindAction', (action: string) => {
			actions.execute(action);
		});

		socket.on("refreshHUD", () => {
			window.top.location.reload();
		});

		socket.on("update_mirv", (data: any) => {
			GSI.digestMIRV(data);
		})
		GSI.on('data', game => {
			if (!this.state.game || this.state.steamids.length) this.verifyPlayers(game);
			this.setState({ game }, () => {
				if (!this.state.checked) this.loadMatch();
			});
		});
		socket.on('match', () => {

			this.loadMatch(true);
		});

	}

	loadMatch = async (force = false) => {
		if (!dataLoader.match || force) {
			dataLoader.match = new Promise((resolve) => {
				api.match.getCurrent().then(match => {
					if (!match) {
						//dataLoader.match = null;
						return;
					}
					this.setState({ match });

					let isReversed = false;
					if (GSI.last) {
						const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
						const current = match.vetos.filter(veto => veto.mapName === mapName)[0];
						if (current && current.reverseSide) {
							isReversed = true;
						}
						this.setState({ checked: true });
					}
					if (match.left.id) {
						api.teams.getOne(match.left.id).then(left => {
							const gsiTeamData = { id: left._id, name: left.name, country: left.country, logo: left.logo, map_score: match.left.wins, extra: left.extra };

							if (!isReversed) {
								GSI.teams.left = gsiTeamData;
							}
							else GSI.teams.right = gsiTeamData;
						});
					}
					if (match.right.id) {
						api.teams.getOne(match.right.id).then(right => {
							const gsiTeamData = { id: right._id, name: right.name, country: right.country, logo: right.logo, map_score: match.right.wins, extra: right.extra };

							if (!isReversed) GSI.teams.right = gsiTeamData;
							else GSI.teams.left = gsiTeamData;
						});
					}



				}).catch(() => {
					//dataLoader.match = null;
				});
			});
		}
	}
	render() {
		if (!this.state.game) return null;
		return (
			<Layout game={this.state.game} match={this.state.match} />
		);
	}

}
export default App;
