import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import SeriesBox from "../MatchBar/SeriesBox";
import Observed from "./../Players/Observed";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import RadarMaps from "./../Radar/RadarMaps";
import Trivia from "../Trivia/Trivia";
import SideBox from '../SideBoxes/SideBox';
import { GSI, actions } from "./../../App";
import MoneyBox from '../SideBoxes/Money';
import UtilityLevel from '../SideBoxes/UtilityLevel';
import Killfeed from "../Killfeed/Killfeed";
import MapSeries from "./../MatchBar/MapSeries";
import Overview from "../Overview/Overview";

interface Props {
  game: CSGO,
  match: Match | null
}

interface State {
  winner: Team | null,
  showWin: boolean,
  forceHide: boolean
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      winner: null,
      showWin: false,
      forceHide: false
    }
  }

  componentDidMount(){
    GSI.on('roundEnd', score => {
      this.setState({ winner: score.winner, showWin: true }, () => {
        setTimeout(() => {
          this.setState({showWin: false})
        }, 4000)
      });
    });
    actions.on("boxesState", (state: string) => {
      if(state === "show"){
        this.setState({forceHide: false});
      } else if(state === "hide"){
        this.setState({forceHide:true});
      }
    });
  }

  render() {
    const { game, match } = this.props;
    const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
    const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

    const leftPlayers = game.players.filter(player => player.team.side === left.side);
    const rightPlayers = game.players.filter(player => player.team.side === right.side);
    const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";
    const { forceHide } = this.state;

    return (
      <div className="layout">
        <Killfeed />
        <Overview match={match} map={game.map} players={game.players || []} />
        <RadarMaps match={match} map={game.map} game={game}/>
        <MatchBar map={game.map} phase={game.phase_countdowns} bomb={game.bomb}/>

        <SeriesBox map={game.map} phase={game.phase_countdowns} match={match} />

        <Observed player={game.player} />

        <TeamBox team={left} players={leftPlayers} side="left" current={game.player} isFreezetime={isFreezetime}/>
        <TeamBox team={right} players={rightPlayers} side="right" current={game.player} isFreezetime={isFreezetime} />

        <Trivia />
        
        <MapSeries teams={[left, right]} match={match} isFreezetime={isFreezetime} map={game.map}/>
        <div className={"boxes left"}>
          <UtilityLevel side={left.side} players={game.players} show={isFreezetime && !forceHide} />
          <SideBox side="left" hide={forceHide}/>
          <MoneyBox
            team={left.side}
            side="left"
            loss={left.consecutive_round_losses * 500 + 1400}
            equipment={leftPlayers.map(player => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
            money={leftPlayers.map(player => player.state.money).reduce((pre, now) => pre + now, 0)}
            show={isFreezetime && !forceHide}
          />
        </div>
        <div className={"boxes right"}>
          <UtilityLevel side={right.side} players={game.players} show={isFreezetime && !forceHide} />
          <SideBox side="right" hide={forceHide} />
          <MoneyBox
            team={right.side}
            side="right"
            loss={right.consecutive_round_losses * 500 + 1400}
            equipment={rightPlayers.map(player => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
            money={rightPlayers.map(player => player.state.money).reduce((pre, now) => pre + now, 0)}
            show={isFreezetime && !forceHide}
          />
        </div>
      </div>
    );
  }
}
