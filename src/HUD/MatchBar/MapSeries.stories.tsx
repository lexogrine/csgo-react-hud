import React from "react";
import { storiesOf } from "@storybook/react";
import MapSeries from "./MapSeries";
import { getExampleTeamData } from "../../example/teamData";
import { getExampleMatchData } from "../../example/matchData";
import { boolean } from "@storybook/addon-knobs";
import { getExampleMapData } from "../../example/mapData";

storiesOf("MapSeries", module).add(
  "Default",
  (): JSX.Element => {
    const isFreezetime = boolean("isFreezetime", false);

    return (
      <MapSeries
        match={getExampleMatchData()}
        teams={[getExampleTeamData(), getExampleTeamData("lexogrine")]}
        isFreezetime={isFreezetime}
        map={getExampleMapData()}
      />
    );
  }
);
