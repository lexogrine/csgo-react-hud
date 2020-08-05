import React from "react";
import { storiesOf } from "@storybook/react";
import TeamBox from "./TeamBox";
import { getExamplePlayerData } from "../../example/playerData";
import { boolean, select } from "@storybook/addon-knobs";
import { getExampleTeamData } from "../../example/teamData";

storiesOf("TeamBox", module).add(
  "Default",
  (): JSX.Element => {
    const isFreezetime = boolean("isFreezetime", false);
    const playersArray = [
      getExamplePlayerData(),
      getExamplePlayerData("lexogrine"),
      getExamplePlayerData("ostenkurden"),
      getExamplePlayerData("valve"),
      getExamplePlayerData("sandra"),
    ];

    return (
      <TeamBox
        players={playersArray}
        current={getExamplePlayerData()}
        isFreezetime={isFreezetime}
        team={getExampleTeamData("Old Spyce")}
        side={"right"}
      />
    );
  }
);
