import React from 'react';
import { Player, Bomb } from 'csgogsi-socket';
import maps, { ScaleConfig } from './maps';
import LexoRadar from './LexoRadar';
import { ExtendedGrenade, Grenade, RadarPlayerObject, RadarGrenadeObject } from './interface';
import config from './config';

const DESCALE_ON_ZOOM = true;


let playersStates: Player[][] = [];
let grenadesStates: ExtendedGrenade[][] = [];
const directions: Record<string, number> = {};
type ShootingState = {
    ammo: number,
    weapon: string,
    lastShoot: number
}
let shootingState: Record<string, ShootingState> = {};

const calculateDirection = (player: Player) => {
    if (directions[player.steamid] && !player.state.health) return directions[player.steamid];

    const [forwardV1, forwardV2] = player.forward;
    let direction = 0;

    const [axisA, axisB] = [Math.asin(forwardV1), Math.acos(forwardV2)].map(axis => axis * 180 / Math.PI);

    if (axisB < 45) {
        direction = Math.abs(axisA);
    } else if (axisB > 135) {
        direction = 180 - Math.abs(axisA);
    } else {
        direction = axisB;
    }

    if (axisA < 0) {
        direction = -(direction -= 360);
    }

    if (!directions[player.steamid]) {
        directions[player.steamid] = direction;
    }

    const previous = directions[player.steamid];

    let modifier = previous;
    modifier -= 360 * Math.floor(previous / 360);
    modifier = -(modifier -= direction);

    if (Math.abs(modifier) > 180) {
        modifier -= 360 * Math.abs(modifier) / modifier;
    }
    directions[player.steamid] += modifier;

    return directions[player.steamid];
}

interface IProps {
    players: Player[],
    bomb?: Bomb | null,
    player: Player | null,
    grenades?: any
    size?: number,
    mapName: string
}

class App extends React.Component<IProps> {
    round = (n: number) => {
        const r = 0.02;
        return Math.round(n / r) * r;
    }

    parsePosition = (position: number[], size: number, config: ScaleConfig) => {
        if (!(this.props.mapName in maps)) {
            return [0, 0];
        }
        const left = config.origin.x + (position[0] * config.pxPerUX) - (size / 2);
        const top = config.origin.y + (position[1] * config.pxPerUY) - (size / 2);

        return [this.round(left), this.round(top)];
    }

    parseGrenadePosition = (grenade: ExtendedGrenade, config: ScaleConfig) => {
        if (!("position" in grenade)) {
            return null;
        }
        let size = 30;
        if (grenade.type === "smoke") {
            size = 60;
        }
        return this.parsePosition(grenade.position.split(", ").map(pos => Number(pos)), size, config);
    }
    getGrenadePosition = (grenade: ExtendedGrenade, config: ScaleConfig) => {
        const grenadeData = grenadesStates.slice(0, 5).map(grenades => grenades.filter(gr => gr.id === grenade.id)[0]).filter(pl => !!pl);
        if (grenadeData.length === 0) return null;
        const positions = grenadeData.map(grenadeEntry => this.parseGrenadePosition(grenadeEntry, config)).filter(posData => posData !== null) as number[][];
        if (positions.length === 0) return null;
        const entryAmount = positions.length;
        let x = 0;
        let y = 0;
        for (const position of positions) {
            x += position[0];
            y += position[1];
        }

        return [x / entryAmount, y / entryAmount];
    }
    getPosition = (player: Player, mapConfig: ScaleConfig, scale: number) => {
        const playerData = playersStates.slice(0, 5).map(players => players.filter(pl => pl.steamid === player.steamid)[0]).filter(pl => !!pl);
        if (playerData.length === 0) return [0, 0];
        const positions = playerData.map(playerEntry => this.parsePosition(playerEntry.position, config.playerSize * scale, mapConfig));
        const entryAmount = positions.length;
        let x = 0;
        let y = 0;
        for (const position of positions) {
            x += position[0];
            y += position[1];
        }

        const degree = calculateDirection(player);
        return [x / entryAmount, y / entryAmount, degree];
    }
    mapPlayer = (active: Player | null) => (player: Player): RadarPlayerObject | RadarPlayerObject[] | null => {
        if (!(this.props.mapName in maps)) {
            return null;
        }

        const weapons = player.weapons ? Object.values(player.weapons) : [];
        const weapon = weapons.find(weapon => weapon.state === "active" && weapon.type !== "C4" && weapon.type !== "Knife" && weapon.type !== "Grenade");

        const shooting: ShootingState = { ammo: weapon && weapon.ammo_clip || 0, weapon: weapon && weapon.name || '', lastShoot: 0 };

        const lastShoot = shootingState[player.steamid] || shooting;

        let isShooting = false;

        if (shooting.weapon === lastShoot.weapon && shooting.ammo < lastShoot.ammo) {
            isShooting = true;
        }

        shooting.lastShoot = isShooting ? (new Date()).getTime() : lastShoot.lastShoot;

        shootingState[player.steamid] = shooting;


        const map = maps[this.props.mapName];
        const playerObject: RadarPlayerObject = {
            id: player.steamid,
            label: player.observer_slot !== undefined ? player.observer_slot : "",
            side: player.team.side,
            position: [],
            visible: true,
            isActive: !!active && active.steamid === player.steamid,
            forward: 0,
            steamid: player.steamid,
            isAlive: player.state.health > 0,
            hasBomb: !!Object.values(player.weapons).find(weapon => weapon.type === "C4"),
            flashed: player.state.flashed > 35,
            shooting: isShooting,
            lastShoot: shooting.lastShoot,
            scale: 1,
            player
        }
        if ("config" in map) {
            const scale = map.config.originHeight === undefined ? 1 : (1 + (player.position[2] - map.config.originHeight) / 1000);

            playerObject.scale = scale;

            const position = this.getPosition(player, map.config, scale);
            playerObject.position = position;

            return playerObject;
        }
        return map.configs.map(config => {
            const scale = config.config.originHeight === undefined ? 1 : (1 + (player.position[2] - config.config.originHeight) / 750);

            playerObject.scale = scale;

            return ({
                ...playerObject,
                position: this.getPosition(player, config.config, scale),
                id: `${player.steamid}_${config.id}`,
                visible: config.isVisible(player.position[2])
            })
        });
    }
    mapGrenade = (extGrenade: ExtendedGrenade) => {
        if (!(this.props.mapName in maps)) {
            return null;
        }
        const map = maps[this.props.mapName];
        if (extGrenade.type === "inferno") {
            const mapFlame = (id: string) => {
                if ("config" in map) {
                    return ({
                        position: this.parsePosition(extGrenade.flames[id].split(", ").map(pos => Number(pos)), 12, map.config),
                        id: `${id}_${extGrenade.id}`,
                        visible: true
                    });
                }
                return map.configs.map(config => ({
                    id: `${id}_${extGrenade.id}_${config.id}`,
                    visible: config.isVisible(extGrenade.flames[id].split(", ").map(Number)[2]),
                    position: this.parsePosition(extGrenade.flames[id].split(", ").map(pos => Number(pos)), 12, config.config)
                }));
            }
            const flames = Object.keys(extGrenade.flames).map(mapFlame).flat();
            const flameObjects: RadarGrenadeObject[] = flames.map(flame => ({
                ...flame,
                side: extGrenade.side,
                type: 'inferno',
                state: 'landed'
            }));
            return flameObjects;
        }

        if ("config" in map) {
            const position = this.getGrenadePosition(extGrenade, map.config);
            if (!position) return null;
            const grenadeObject: RadarGrenadeObject = {
                type: extGrenade.type,
                state: 'inair',
                side: extGrenade.side,
                position,
                id: extGrenade.id,
                visible: true
            }
            if (extGrenade.type === "smoke") {
                if (extGrenade.effecttime !== "0.0") {
                    grenadeObject.state = "landed";
                    if (Number(extGrenade.effecttime) >= 16.5) {
                        grenadeObject.state = 'exploded';
                    }
                }
            } else if (extGrenade.type === 'flashbang' || extGrenade.type === 'frag') {
                if (Number(extGrenade.lifetime) >= 1.25) {
                    grenadeObject.state = 'exploded';
                }
            }
            return grenadeObject;
        }
        return map.configs.map(config => {
            const position = this.getGrenadePosition(extGrenade, config.config);
            if (!position) return null;
            const grenadeObject: RadarGrenadeObject = {
                type: extGrenade.type,
                state: 'inair',
                side: extGrenade.side,
                position,
                id: `${extGrenade.id}_${config.id}`,
                visible: config.isVisible(extGrenade.position.split(", ").map(Number)[2])
            }
            if (extGrenade.type === "smoke") {
                if (extGrenade.effecttime !== "0.0") {
                    grenadeObject.state = "landed";
                    if (Number(extGrenade.effecttime) >= 16.5) {
                        grenadeObject.state = 'exploded';
                    }
                }
            } else if (extGrenade.type === 'flashbang' || extGrenade.type === 'frag') {
                if (Number(extGrenade.lifetime) >= 1.25) {
                    grenadeObject.state = 'exploded';
                }
            }
            return grenadeObject;
        }).filter((grenade): grenade is RadarGrenadeObject => grenade !== null);

    }
    getSideOfGrenade = (grenade: Grenade) => {
        const owner = this.props.players.find(player => player.steamid === grenade.owner);
        if (!owner) return null;
        return owner.team.side;
    }
    render() {
        const players: RadarPlayerObject[] = this.props.players.map(this.mapPlayer(this.props.player)).filter((player): player is RadarPlayerObject => player !== null).flat();
        playersStates.unshift(this.props.players);
        if (playersStates.length > 5) {
            playersStates = playersStates.slice(0, 5);
        }
        let grenades: RadarGrenadeObject[] = [];
        const currentGrenades = Object.keys(this.props.grenades as { [key: string]: Grenade }).map(grenadeId => ({ ...this.props.grenades[grenadeId], id: grenadeId, side: this.getSideOfGrenade(this.props.grenades[grenadeId]) })) as ExtendedGrenade[];
        if (currentGrenades) {
            grenades = currentGrenades.map(this.mapGrenade).filter(entry => entry !== null).flat() as RadarGrenadeObject[];
            grenadesStates.unshift(currentGrenades);
        }
        if (grenadesStates.length > 5) {
            grenadesStates = grenadesStates.slice(0, 5);
        }
        const size = this.props.size || 300;
        const offset = (size - (size * size / 1024)) / 2;

        const config = maps[this.props.mapName];

        const zooms = config && config.zooms || [];

        const activeZoom = zooms.find(zoom => zoom.threshold(players.map(pl => pl.player)));

        const reverseZoom = 1/(activeZoom && activeZoom.zoom || 1);

        // s*(1024-s)/2048
        if (!(this.props.mapName in maps)) {
            return <div className="map-container" style={{ width: size, height: size, transform: `scale(${size / 1024})`, top: -offset, left: -offset }}>
                Unsupported map
            </div>;
        }
        return <div className="map-container" style={{ width: size, height: size, transform: `scale(${size / 1024})`, top: -offset, left: -offset }}>
            <LexoRadar
                players={players}
                grenades={grenades}
                parsePosition={this.parsePosition}
                bomb={this.props.bomb}
                mapName={this.props.mapName}
                mapConfig={maps[this.props.mapName]}
                zoom={activeZoom}
                reverseZoom={DESCALE_ON_ZOOM ? reverseZoom.toFixed(2) : '1'}
            />
        </div>;
    }
}

export default App;
