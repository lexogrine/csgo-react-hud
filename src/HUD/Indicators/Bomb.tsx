import React from "react";
import { WeaponRaw } from "csgogsi-socket";
import { Bomb as BombIcon } from "./../../assets/Icons";
export default class Bomb extends React.Component<{
  weapons: { [key: string]: WeaponRaw };
}> {
  render() {
    const { weapons } = this.props;
    if (Object.values(weapons).every((weapon) => weapon.type !== "C4"))
      return "";
    return (
      <div className={`armor_indicator`}>
        <img src={BombIcon} alt={"Bomb"} />
      </div>
    );
  }
}
