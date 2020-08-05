import { Player } from "csgogsi";
import { getExampleTeamData } from "./teamData";

export const getExamplePlayerData = (name?: string): Player => {
  return {
    steamid: "76561198121076149",
    name: name || "Noel Bank",
    avatar: "https://placekitten.com/512/512",
    observer_slot: 0,
    team: getExampleTeamData(),
    activity: "string",
    stats: {
      kills: 10,
      assists: 4,
      deaths: 1,
      mvps: 5,
      score: 40,
    },
    weapons: {
      c4: {
        name: "c4",
        paintkit: "string",
        type: "C4",
        ammo_clip: 1,
        ammo_clip_max: 32,
        ammo_reserve: 29,
        state: "active",
      },
    },
    state: {
      health: 22,
      armor: 99,
      helmet: false,
      defusekit: false,
      flashed: 0,
      smoked: 0,
      burning: 0,
      money: 1200,
      round_kills: 1,
      round_killhs: 1,
      round_totaldmg: 99,
      equip_value: 3000,
    },
    spectarget: "string",
    position: [12, 13, 15],
    forward: [12, 13, 15],
    country: "germany",
    realName: "Noel Bank",
  };
};
