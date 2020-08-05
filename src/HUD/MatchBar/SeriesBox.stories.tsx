import React from "react";
import { storiesOf } from "@storybook/react";
import SeriesBox from "./SeriesBox";
import { getExampleMatchData } from "../../example/matchData";
import { select } from "@storybook/addon-knobs";
import { getExampleMapData } from "../../example/mapData";

storiesOf("SeriesBox", module).add(
  "Default",
  (): JSX.Element => {
    const phase = select(
      "phase",
      [
        "freezetime",
        "bomb",
        "warmup",
        "live",
        "over",
        "defuse",
        "paused",
        "timeout_ct",
        "timeout_t",
      ],
      "freezetime"
    );

    return (
      <SeriesBox
        match={getExampleMatchData("series-box", true)}
        map={getExampleMapData()}
        phase={{ phase: phase, phase_ends_in: "12" }}
      />
    );
  }
);
