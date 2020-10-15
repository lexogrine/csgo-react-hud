import React from "react";
import * as I from "csgogsi-socket";
import WinIndicator from "./WinIndicator";
import { Timer } from "./MatchBar";
import PlantDefuse from "../Timers/PlantDefuse"
import {LogoCT, LogoT} from './../../assets/Icons';

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
        <div className={`team ${orientation} ${team.side}`}>
          <div className="team-name">{team.name}</div>
          <div className="logo"><img src={team.logo ? `data:image/jpeg;base64,${team.logo}` : (team.side === "CT" ? LogoCT : LogoT)} alt={'Team logo'} /></div>
          <div className="round-thingy"><div className="inner"></div></div>
        </div>
        <PlantDefuse timer={timer} side={orientation} />
        <WinIndicator team={team} show={showWin}/>
      </>
    );
  }
}
