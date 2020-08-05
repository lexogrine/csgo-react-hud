import React from "react";
import { storiesOf } from "@storybook/react";
import Kill from "./Kill";
import { select, boolean } from "@storybook/addon-knobs";
import { getExamplePlayerData } from "../../example/playerData";

storiesOf("Kill", module).add(
  "Default",
  (): JSX.Element => {
    const eventType = select(
      "Event Type",
      ["kill", "plant", "defuse"],
      "plant"
    );

    let assister = false;
    let flashed = false;
    let headshot = false;
    let wallbang = false;
    let attackerblind = false;
    let thrusmoke = false;
    let noscope = false;

    if (eventType === "kill") {
      assister = boolean("has assister", false);
      flashed = boolean("was flashed", false);
      headshot = boolean("was headshot", false);
      wallbang = boolean("was wallbanged", false);
      attackerblind = boolean("was attacker blind", false);
      thrusmoke = boolean("killed thru smoke", false);
      noscope = boolean("nop scoped", false);
    }

    return (
      <div className="killfeed">
        <Kill
          event={{
            player: getExamplePlayerData(),
            type: eventType,
            killer: getExamplePlayerData("ostenkurden"),
            victim: getExamplePlayerData(),
            assister: assister ? getExamplePlayerData("esterlinger") : null,
            flashed: flashed,
            headshot: headshot,
            weapon: "weapon_usp_silencer",
            wallbang: wallbang,
            attackerblind: attackerblind,
            thrusmoke: thrusmoke,
            noscope: noscope,
          }}
        />
      </div>
    );
  }
);
