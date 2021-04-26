/* eslint-disable no-undef */
const degreeToRadian = (degree) => degree * Math.PI / 180;

let mesh = null;

const startARModule = (scene, _camera, _renderer, GSI) => {
    const playerScoreboardCanvas = document.getElementById("playerCanvas");
    if(!playerScoreboardCanvas){
        const newCanvas = document.createElement("div");
        newCanvas.id = "playerCanvas";
        document.body.appendChild(newCanvas);
    }
    GSI.on('data', (data) => {
        const { players } = data;
        const playerScoreboardCanvas = document.getElementById("playerCanvas");
        const playersT = players.filter(player => player.team.side === "T");
        const htmlEntry = `<div class="teamName T">Terrorists</div>` + playersT.map(player => `
		<div class="playerEntry">
			<div class="playerUsername">${player.name}</div>
			<div class="playerStats">${player.stats.kills}</div>
			<div class="playerStats">${player.stats.assists}</div>
			<div class="playerStats">${player.stats.deaths}</div>
		</div>
	`).join('');
        if (playerScoreboardCanvas.innerHTML !== htmlEntry) {
            playerScoreboardCanvas.innerHTML = htmlEntry;
            html2canvas(playerScoreboardCanvas).then(canvas => {
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;
                const scoreboard = new THREE.Mesh(
                    new THREE.PlaneGeometry(canvas.width / 10, canvas.height / 10, 1),
                    new THREE.MeshBasicMaterial({
                        opacity: 0.5,
                        map: texture
                        //color: 0xffff00, side: THREE.DoubleSide
                    }));
                scoreboard.position.set(150, 1900, 150);
                scoreboard.rotateY(degreeToRadian(90));
                if(mesh) scene.remove(mesh);
                scene.add(scoreboard);
                mesh = scoreboard;
            });
        }
    });
}
const cleanUpARModule = (scene, GSI) => {
    if(mesh){
        scene.remove(mesh);
    }
    const playerScoreboardCanvas = document.getElementById("playerCanvas");
    if(playerScoreboardCanvas){
        playerScoreboardCanvas.remove();
    }
    GSI.removeAllListeners("data");
}
export { startARModule, cleanUpARModule };