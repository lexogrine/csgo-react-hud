import React from "react";
import * as I from "csgogsi-socket";
import WinIndicator from "./WinIndicator";
import { Timer } from "./MatchBar";
import TeamLogo from './TeamLogo';
import PlantDefuse from "../Timers/PlantDefuse"
import { configs } from "../../App"

interface IProps {
  team: I.Team;
  orientation: "left" | "right";
  timer: Timer | null;
  showWin: boolean;
}

export default class TeamScore extends React.Component<IProps, {roundThingyToggle: boolean}> {
  constructor(props: any){
    super(props);
    this.state = {
      roundThingyToggle: false
    }
  }

  componentDidMount(){
    configs.onChange((data:any) =>{
      if(!data) return;
      const toggle = data.display_settings.round_thingy_toggle
      this.setState({roundThingyToggle: toggle})
    })
  }
  render() {
    const { orientation, timer, team, showWin } = this.props;
    const { roundThingyToggle } = this.state;
    return (
      <>
        <div className={`team ${orientation} ${team.side}`}>
          <div className="team-name">{team.name}</div>
          <TeamLogo team={team} />
          <div className={`round-thingy ${roundThingyToggle ? 'PepeHands' : ''}`}><div className="inner"></div></div>
        </div>
        <PlantDefuse timer={timer} side={orientation} />
        <WinIndicator team={team} show={showWin}/>
      </>
    );
  }
}
