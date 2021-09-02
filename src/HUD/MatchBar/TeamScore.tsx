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
}

export default class TeamScore extends React.Component<IProps> {
  render() {
    const { orientation, timer, team, showWin } = this.props;
    return (
      <>
        <div className={`team skew ${orientation} ${team.side}`}>
          <div className="team-name-container">
              <div className="team-name unskew">{team.name}</div></div>
          <TeamLogo team={team} />
        </div>
        <PlantDefuse timer={timer} orientation={orientation} side={team.side}/>
        <WinIndicator team={team} show={showWin}/>
      </>
    );
  }
}
