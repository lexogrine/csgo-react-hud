import { getExampleTeamData } from "./teamData";
import { Map } from "csgogsi";

export const getExampleMapData = (
  phase?: "warmup" | "live" | "intermission" | "gameover"
): Map => {
  return {
    mode: "competetive",
    name: "old-spyce-game",
    phase: phase || "gameover",
    round: 1,
    team_ct: getExampleTeamData(),
    team_t: getExampleTeamData("lexogrine"),
    num_matches_to_win_series: 12,
    current_spectators: 1,
    souvenirs_total: 0,
    round_wins: {
      1: "ct_win_time",
    },
  };
};
