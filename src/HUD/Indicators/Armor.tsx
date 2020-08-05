import React from "react";
import { ArmorHelmet, ArmorFull } from "./../../assets/Icons";
export default class Armor extends React.Component<{
  health: number;
  armor: number;
  helmet: boolean;
}> {
  render() {
    const { health, armor, helmet } = this.props;
    if (!health || !armor) return "";
    return (
      <div className={`armor_indicator`}>
        <img src={helmet ? ArmorHelmet : ArmorFull} alt={"Armor"} />
      </div>
    );
  }
}
