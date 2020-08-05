import React from "react";
import { Defuse as DefuseIcon } from "./../../assets/Icons";
export default class Defuse extends React.Component<{
  health: number;
  defusekit?: boolean;
}> {
  render() {
    const { health, defusekit } = this.props;
    if (!health || !defusekit) return "";
    return (
      <div className={`defuse_indicator`}>
        <img src={DefuseIcon} alt={"Defuse"} />
      </div>
    );
  }
}
