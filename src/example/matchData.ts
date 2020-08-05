import { Match, Veto } from "../api/interfaces";

export const getExampleMatchData = (id?: string, current?: boolean): Match => {
  return {
    id: id || "example-match-data",
    current: current || false,
    left: {
      id: "old-spyce",
      wins: 1,
    },
    right: {
      id: "old-spyce-juionr",
      wins: 1,
    },
    matchType: "bo3",
    vetos: [vetoExampleData(), vetoExampleData("lexogrine", "de_vertigo")],
  };
};

export const vetoExampleData = (id?: string, map?: string): Veto => {
  return {
    teamId: id || "old-spyce",
    mapName: map || "de_overpass",
    side: "CT",
    type: "decider",
    reverseSide: false,
    winner: "old-spyce",
    mapEnd: false,
  };
};
