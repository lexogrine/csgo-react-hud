import React from "react";
import { storiesOf } from "@storybook/react";
import Observed from "./Observed";
import { getExamplePlayerData } from "../../example/playerData";

storiesOf("Observed", module).add(
  "Default",
  (): JSX.Element => {
    return <Observed player={getExamplePlayerData()} />;
  }
);
