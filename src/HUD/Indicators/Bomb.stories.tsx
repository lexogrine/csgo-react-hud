import React from "react";
import { storiesOf } from "@storybook/react";
import Bomb from "./Bomb";

storiesOf("Bomb", module).add(
  "Default",
  (): JSX.Element => {
    return (
      <Bomb
        weapons={{
          c4: {
            name: "C4",
            paintkit: "",
            state: "active",
            type: "C4",
          },
        }}
      />
    );
  }
);
