import React from "react";
import { storiesOf } from "@storybook/react";
import Defuse from "./Defuse";
import { number, boolean } from "@storybook/addon-knobs";

storiesOf("Defuse", module).add(
  "Default",
  (): JSX.Element => {
    const health = number("Health", 100, { max: 100, min: 0 });
    const defusekit = boolean("Defusekit", true);

    return <Defuse health={health} defusekit={defusekit} />;
  }
);
