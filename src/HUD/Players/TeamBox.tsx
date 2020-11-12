import React from 'react';
import Player from './Player'
import * as I from 'csgogsi-socket';
import './players.scss';

interface Props {
  players: I.Player[],
  team: I.Team,
  side: 'right' | 'left',
  current: I.Player | null,
  isFreezetime: boolean,
}

export default class TeamBox extends React.Component<Props> {
  render() {
    return (
      <div className={`teambox ${this.props.team.side} ${this.props.side}`}>
        {this.props.players.map(player => <Player
          key={player.steamid}
          player={player}
          isObserved={!!(this.props.current && this.props.current.steamid === player.steamid)}
          isFreezetime={this.props.isFreezetime}
        />)}
      </div>
    );
  }
}
