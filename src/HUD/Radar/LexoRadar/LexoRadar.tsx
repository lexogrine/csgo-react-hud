import React from 'react';
import { Bomb } from 'csgogsi-socket';
import maps from './maps';
import './index.css';
import { RadarPlayerObject, RadarGrenadeObject } from './interface';
import config from './config';
interface IProps {
  players: RadarPlayerObject[];
  grenades: RadarGrenadeObject[];
  bomb?: Bomb | null;
  mapName: string;
  parsePosition: (position: number[], size: number) => number[]
}
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
    return (
      <div key={grenade.id} className={`grenade ${grenade.type} ${grenade.state}`}
        style={{
          transform: `translateX(${grenade.position[0]}px) translateY(${grenade.position[1]}px)`,
        }}>
          <div className="explode-point"></div>
          <div className="background"></div>
      </div>
    )
  }
  renderDot = (player: RadarPlayerObject) => {
    return (
      <div key={player.steamid}
        className={`player ${player.side} ${player.hasBomb ? 'hasBomb':''} ${player.isActive ? 'active' : ''} ${!player.isAlive ? 'dead' : ''}`}
        style={{
          transform: `translateX(${player.position[0]}px) translateY(${player.position[1]}px)`,
          width: config.playerSize,
          height: config.playerSize
        }}>
        <div className="background" style={{ transform: `rotate(${45 + player.position[2]}deg)` }}></div>
        <div className="label">{player.label}</div>
      </div>
    )
  }
  renderBomb = () => {
    const { bomb } = this.props;
    if(!bomb) return null;
    if(bomb.state === "carried" || bomb.state === "planting") return null;
    const position = this.props.parsePosition(bomb.position.split(", ").map(pos => Number(pos)), 30);
    if(!position) return null;
    
    return (
      <div className={`bomb ${bomb.state}`}
        style={{
          transform: `translateX(${position[0]}px) translateY(${position[1]}px)`
        }}>
        <div className="explode-point"></div>
        <div className="background"></div>
      </div>
    )
  }
  render() {
    const { players, grenades } = this.props;
    //if(players.length === 0) return null;
    return <div className="map" style={{ backgroundImage: `url(${maps[this.props.mapName].file})` }}>
        {players.map(this.renderDot)}
        {grenades.map(this.renderGrenade)}
        {this.renderBomb()}
      </div>;
  }
}

export default App;
