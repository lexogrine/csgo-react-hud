/* eslint-disable no-undef */
//const degreeToRadian = (degree) => degree * Math.PI / 180;

let mesh = null;

const startARModule = (scene, _camera, _renderer, GSI) => {
    let lastContent = '';
    let scoreboardObject = null;

    function updateScoreboard(content) {
        const wrapper = scoreboardObject || document.createElement('div');
        if(!wrapper.id){
            wrapper.id = 'playerCanvas'
        }
        wrapper.innerHTML = content;
        if (!scoreboardObject) {
            scoreboardObject = wrapper;

            const object = new THREE.CSS3DObject(wrapper);
            mesh = object;

            object.position.set(-150, 1900, -150);
            scene.add(object);
        }
        return wrapper;
    }

    fetch('/api/match/current').then(res => res.json()).then(match => {
        if (!match) return;
        let isReversed = false;
        if (GSI.last) {
            const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
            const current = match.vetos.find(veto => veto.mapName === mapName);
            if (current && current.reverseSide) {
                isReversed = true;
            }
        }
        fetch('/api/teams').then(res => res.json()).then(teams => {
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
        }).catch(() => { });
    }).catch(() => { });
    GSI.on('data', (data) => {
        if(!data || !data.map || !data.map.name || !data.map.name.toLowerCase().includes("cache")) return;
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
            updateScoreboard(htmlEntry);
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