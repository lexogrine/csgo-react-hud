import React from "react";
import * as I from "csgogsi-socket";
import TeamLogo from './TeamLogo';

interface IProps {
  team: I.Team;
  orientation: "left" | "right";
}

export default class TeamScore extends React.Component<IProps> {
  render() {
    const { orientation, team } = this.props;
    return (
      <>
        <div className={`team skew ${orientation} ${team.side}`}>
          <div className="team-name-container">
              <div className="team-name unskew">{team.name}</div></div>
          <TeamLogo team={team} />
        </div>
      </>
    );
  }
}
