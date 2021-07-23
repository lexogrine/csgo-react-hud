import React from "react";
import * as I from "csgogsi-socket";
import WinIndicator from "./WinIndicator";
import { Timer } from "./MatchBar";
import TeamLogo from './TeamLogo';
import PlantDefuse from "../Timers/PlantDefuse"

interface IProps {
  team: I.Team;
  orientation: "left" | "right";
  timer: Timer | null;
  showWin: boolean;
  winsForSeries: number;
  wins: number;
}

export default class TeamScore extends React.Component<IProps> {
  render() {
    const { orientation, timer, team, showWin, wins, winsForSeries } = this.props;
    const wonMaps = [];
    for(let i = 0; i < winsForSeries; i++){
      wonMaps.push(wins > i ? 'win' : '');
    }
    return (
      <>
        <div className={`team ${orientation} ${team.side}`}>
          <TeamLogo team={team} />
          <div className="series-wins-container">
            {wonMaps.map(status => (
             <div className={`series-win ${status} ${team.side}`}/> 
            ))}
          </div>
          <div className="team-name">{team.name}</div>
        </div>
        <PlantDefuse timer={timer} side={orientation} />
        <WinIndicator team={team} show={showWin}/>
      </>
    );
  }
}
