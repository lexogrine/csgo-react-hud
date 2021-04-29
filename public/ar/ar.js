/* eslint-disable no-undef */
//const degreeToRadian = (degree) => degree * Math.PI / 180;


const startARModule = (scene, _camera, _renderer, GSI) => {
    let lastContent = '';
    function createCSS3DObject(content) 
    {
      // convert the string to dome elements
      var wrapper = document.createElement('div');
      wrapper.innerHTML = content;
      var div = wrapper.firstChild;

      // set some values on the div to style it.
      // normally you do this directly in HTML and 
      // CSS files.
      div.style.width = '370px';
      div.style.height = '370px';
      div.style.opacity = 0.7;
      div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

      // create a CSS3Dobject and return it.
      var object = new THREE.CSS3DObject(div);
      return object;
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
        //if(!data || !data.map || !data.map.name.includes("cache")) return;
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
            const obj = createCSS3DObject(lastContent);

            obj.position.set(-150, 1900, -150);
            scene.add(obj);
        }
    });
}
const cleanUpARModule = (scene, GSI) => {
   /* if (mesh) {
        scene.remove(mesh);
    }
    const playerScoreboardCanvas = document.getElementById("playerCanvas");
    if (playerScoreboardCanvas) {
        playerScoreboardCanvas.remove();
    }*/
    GSI.removeAllListeners("data");
}
export { startARModule, cleanUpARModule };