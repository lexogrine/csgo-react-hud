import React from "react";
import { storiesOf } from "@storybook/react";
import WinIndicator from "./WinIndicator";
import { getExampleTeamData } from "../../example/teamData";
import { boolean } from "@storybook/addon-knobs";

storiesOf("WinIndicator", module).add(
  "Default",
  (): JSX.Element => {
    const showIndicator = boolean("Show Win Indicator", false);

    return <WinIndicator team={getExampleTeamData()} show={showIndicator} />;
  }
);
