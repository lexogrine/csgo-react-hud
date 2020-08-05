import React from "react";
import { storiesOf } from "@storybook/react";
import Armor from "./Armor";
import { number, boolean } from "@storybook/addon-knobs";

storiesOf("Armor", module).add(
  "Default",
  (): JSX.Element => {
    const armor = number("Armor", 100, { max: 100, min: 0 });
    const health = number("Health", 100, { max: 100, min: 0 });
    const helmet = boolean("Helmet", false);

    return <Armor {...{ armor: armor, helmet: helmet, health: health }} />;
  }
);
