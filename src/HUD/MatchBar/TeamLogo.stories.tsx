import React from "react";
import { storiesOf } from "@storybook/react";
import TeamLogo from "./TeamLogo";
import { getExampleTeamData } from "../../example/teamData";

storiesOf("TeamLogo", module).add(
  "Default",
  (): JSX.Element => {
    return <TeamLogo team={getExampleTeamData()} width={64} height={64} />;
  }
);
