import React from "react";

import { Timer } from "../MatchBar/MatchBar";
import { Player } from "csgogsi";

import * as I from "./../../assets/Icons";

interface IProps {
  timer: Timer | null;
  orientation: "right" | "left"
  side: "CT" | "T"
}

export default class Bomb extends React.Component<IProps> {
  getCaption = (type: "defusing" | "planting", player: Player | null) => {
    if(!player) return null;
    if(type === "defusing"){
      return <>
        <I.Defuse height={22} width={22} fill="var(--white-full)" />
        <div>{player.name} is defusing the bomb</div>
      </>;
    }
    return <>
      <I.C4 height={22} width={22} fill="var(--white-full)"/>
      <div>{player.name} is planting the bomb</div>
    </>;
  }
  render() {
    const { orientation, timer, side } = this.props;
    return (
      <div className={`defuse_plant_container ${orientation} ${side} ${timer && timer.active ? 'show' :'hide'}`}>
        <div className="defuse_plant_bar" style={{width: `${(timer && timer.width) || 0}%`}}/>
        {
          timer ?
          <div className={`defuse_plant_caption`}>
            {this.getCaption(timer.type, timer.player)}
          </div> : null
        }
      </div>
    );
  }
}
