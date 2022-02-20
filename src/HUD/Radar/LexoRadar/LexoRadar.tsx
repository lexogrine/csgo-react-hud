import React from 'react';
import { Bomb } from 'csgogsi-socket';
import maps, { ScaleConfig, MapConfig, ZoomAreas } from './maps';
import './index.css';
import { RadarPlayerObject, RadarGrenadeObject } from './interface';
import config from './config';
interface IProps {
  players: RadarPlayerObject[];
  grenades: RadarGrenadeObject[];
  bomb?: Bomb | null;
  mapName: string;
  zoom?: ZoomAreas;
  mapConfig: MapConfig,
  reverseZoom: string,
  parsePosition: (position: number[], size: number, config: ScaleConfig) => number[]
}

const isShooting = (lastShoot: number) => (new Date()).getTime() - lastShoot <= 250;
class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      players: [],
      grenades: [],
      bomb: null
    }
  }

  renderGrenade = (grenade: RadarGrenadeObject) => {
    if ("flames" in grenade) {
      return null;
    }
    const { reverseZoom } = this.props;
    return (
      <div key={grenade.id} className={`grenade ${grenade.type} ${grenade.side || ''} ${grenade.state} ${grenade.visible ? 'visible':'hidden'}`}
        style={{
          transform: `translateX(${grenade.position[0].toFixed(2)}px) translateY(${grenade.position[1].toFixed(2)}px) translateZ(10px) scale(${reverseZoom})`,
        }}>
          <div className="explode-point"></div>
          <div className="background"></div>
      </div>
    )
  }
  renderDot = (player: RadarPlayerObject) => {
    const { reverseZoom } = this.props;
    return (
      <div key={player.id}
        className={`player ${player.shooting? 'shooting':''} ${player.side} ${player.hasBomb ? 'hasBomb':''} ${player.isActive ? 'active' : ''} ${!player.isAlive ? 'dead' : ''} ${player.visible ? 'visible':'hidden'}`}
        style={{
          transform: `translateX(${player.position[0].toFixed(2)}px) translateY(${player.position[1].toFixed(2)}px) translateZ(10px) scale(${reverseZoom})`,
          width: config.playerSize * player.scale,
          height: config.playerSize * player.scale,
        }}>
        <div className="background-fire" style={{ transform: `rotate(${-90 + player.position[2]}deg)`, opacity: isShooting(player.lastShoot) ? 1 : 0 }} ><div className="bg"/></div>
        <div className="background" style={{ transform: `rotate(${45 + player.position[2]}deg)` }}></div>
        <div className="label">{player.label}</div>
      </div>
    )
  }
  renderBomb = () => {
    const { bomb, mapConfig, reverseZoom } = this.props;
    if(!bomb) return null;
    if(bomb.state === "carried" || bomb.state === "planting") return null;
    if("config" in mapConfig){
      const position = this.props.parsePosition(bomb.position.split(", ").map(pos => Number(pos)), 30, mapConfig.config);
      if(!position) return null;
      
      return (
        <div className={`bomb ${bomb.state} visible`}
          style={{
            transform: `translateX(${position[0].toFixed(2)}px) translateY(${position[1].toFixed(2)}px) translateZ(10px) scale(${reverseZoom})`
          }}>
          <div className="explode-point"></div>
          <div className="background"></div>
        </div>
      )
    }
    return mapConfig.configs.map(config => {
      const position = this.props.parsePosition(bomb.position.split(", ").map(pos => Number(pos)), 30, config.config);
      if(!position) return null;
      return (
        <div className={`bomb ${bomb.state} ${config.isVisible(bomb.position.split(", ").map(Number)[2]) ? 'visible':'hidden'}`}
          style={{
            transform: `translateX(${position[0].toFixed(2)}px) translateY(${position[1].toFixed(2)}px) translateZ(10px)`
          }}>
          <div className="explode-point"></div>
          <div className="background"></div>
        </div>
      )
    });
  }
  render() {
    const { players, grenades, zoom } = this.props;

    const style: React.CSSProperties = { backgroundImage: `url(${maps[this.props.mapName].file})` }

    if(zoom){
      style.transform = `scale(${zoom.zoom})`;
      style.transformOrigin = `${zoom.origin[0]}px ${zoom.origin[1]}px`;
    }
    //if(players.length === 0) return null;
    return <div className="map" style={style}>
        {players.map(this.renderDot)}
        {grenades.map(this.renderGrenade)}
        {this.renderBomb()}
      </div>;
  }
}

export default App;
