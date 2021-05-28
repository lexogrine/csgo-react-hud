/* eslint-disable no-undef */

import { api } from './api.js';

let mesh = null;
// if cl_showpos 1 is 3300 -200 2100, then array should be:
// [-200, 2100, 3300]
// last element of the array is rotation in degrees
const positions = {
    de_cache: [-200, 2100, 3300, 180],
    de_mirage: [-2100, 159, -1970, 0],
    de_dust2: [-450, 350, 727, 180],
    de_inferno: [10, 141, -1866, 0],
    de_train: [641, 125, -1800, 90],
    de_overpass: [-1519, 475, -1105, 115],
    de_nuke: [-3025, -10, 490, 90],
    de_vertigo: [-615, 12605, -448, 0],
}
const startARModule = (scene, _camera, _renderer, GSI, actions) => {

    let lastContent = '';
    let scoreboardObject = null;

    function updateScoreboard(content, map) {
        if(!(map in positions)){
            return;
        }
        const wrapper = scoreboardObject || document.createElement('div');
        if(!wrapper.id){
            wrapper.id = 'playerCanvas'
        }
        wrapper.innerHTML = content;
        if (!scoreboardObject) {
            scoreboardObject = wrapper;

            const object = new THREE.CSS3DObject(wrapper);
            mesh = object;
            
            const position = positions[map];

            object.position.set(position[0], position[1], position[2]);
            object.rotateY(THREE.Math.degToRad(position[3]));
            scene.add(object);

            
            actions.on('arState', arState => {
                const isHidden = arState === "hide";
                wrapper.classList.toggle('hide', isHidden);
            });
        }
        return wrapper;
    }

    api.match.getCurrent().then(match => {
        if (!match) return;
        let isReversed = false;
        if (GSI.last) {
            const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
            const current = match.vetos.find(veto => veto.mapName === mapName);
            if (current && current.reverseSide) {
                isReversed = true;
            }
        }
        api.teams.get().then(teams => {
            if (match.left && match.left.id) {
                const left = teams.find(team => team._id === match.left.id);
                if (left) {
                    const gsiTeamData = { id: left._id, name: left.name, country: left.country, logo: left.logo, map_score: match.left.wins, extra: left.extra };

                    if (!isReversed) {
                        GSI.teams.left = gsiTeamData;
                    }
                    else GSI.teams.right = gsiTeamData;
                }
            }
            if (match.right && match.right.id) {
                const right = teams.find(team => team._id === match.right.id);
                if (right) {
                    const gsiTeamData = { id: right._id, name: right.name, country: right.country, logo: right.logo, map_score: match.right.wins, extra: right.extra };

                    if (!isReversed) {
                        GSI.teams.right = gsiTeamData;
                    }
                    else GSI.teams.left = gsiTeamData;
                }
            }
        });
    });


    GSI.on('data', (data) => {
        if(!data || !data.map || !data.map.name) return;
        const mapName = data.map.name.substring(data.map.name.lastIndexOf('/') + 1);
        if(!mapName || !(mapName in positions)) return;
        const { players } = data;

        const playersLeft = players.filter(player => player.team.orientation === "left");
        const playersRight = players.filter(player => player.team.orientation === "right");

        const leftTeam = playersLeft[0].team;
        const rightTeam = playersRight[0].team;

        if (!leftTeam || !rightTeam) return;
        let htmlEntry = ``;
        htmlEntry += `<div class="teamContainer"><div class="teamName ${leftTeam.side}">${leftTeam.name}</div>${playersLeft.map(player => `
		<div class="playerEntry">
			<div class="playerUsername">${player.name}</div>
			<div class="playerStats">${player.stats.kills}</div>
			<div class="playerStats">${player.stats.assists}</div>
			<div class="playerStats">${player.stats.deaths}</div>
		</div>
	`).join('')}</div>`;
        htmlEntry += `<div class="teamContainer"><div class="teamName ${rightTeam.side}">${rightTeam.name}</div>${playersRight.map(player => `
    <div class="playerEntry">
        <div class="playerUsername">${player.name}</div>
        <div class="playerStats">${player.stats.deaths}</div>
        <div class="playerStats">${player.stats.assists}</div>
        <div class="playerStats">${player.stats.kills}</div>
    </div>
`).join('')}</div>`;
        if (lastContent !== htmlEntry) {
            lastContent = htmlEntry;
            updateScoreboard(htmlEntry, mapName);
        }
    });
}
const cleanUpARModule = (scene, GSI) => {
    if (mesh) {
        scene.remove(mesh);
    }
    GSI.removeAllListeners("data");
}
export { startARModule, cleanUpARModule };