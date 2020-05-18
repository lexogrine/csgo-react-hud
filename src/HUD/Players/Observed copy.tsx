import React from "react";
import { Player } from "csgogsi-socket";
import Avatar from "./Avatar";

class StatisticCell extends React.Component<{ label: string; stat: string | number }> {
  render() {
    return (
      <div className="stats_cell">
        <div className="label">{this.props.label}</div>
        <div className="stat">{this.props.stat}</div>
      </div>
    );
  }
}

export default class Observed extends React.Component<{ player: Player | null }> {
  render() {
    if (!this.props.player) return "";
    const { stats } = this.props.player;
    return (
      <div className={`observed ${this.props.player.team.side}`}>
        <div className="main_row">
          <div className="avatar_name">
            <Avatar steamid={this.props.player.steamid} height={83} />
            <span>{this.props.player.name}</span>
          </div>
        </div>
        <div className="stats_row">
          <StatisticCell label="K" stat={stats.kills} />
          <StatisticCell label="A" stat={stats.assists} />
          <StatisticCell label="D" stat={stats.deaths} />
          <StatisticCell label="K/D" stat={stats.deaths === 0 ? stats.kills.toFixed(2) : (stats.kills / stats.deaths).toFixed(2)} />
        </div>
      </div>
    );
  }
}
