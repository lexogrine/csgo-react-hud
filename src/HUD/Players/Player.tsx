import React from "react";
import { Player, WeaponRaw } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import Grenade from "../Weapon/Grenade";
import { Skull, Kill, SkullRaw } from "../../assets/Icons";

interface IProps {
  player: Player,
  isObserved: boolean,
  isFreezetime: boolean,
}
export default class PlayerBox extends React.Component<IProps> {
  render() {
    const { player } = this.props;
    const weapons: WeaponRaw[] = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const primary = weapons.filter(weapon => !['C4', 'Pistol', 'Knife', 'Grenade', undefined].includes(weapon.type))[0] || null;
    const secondary = weapons.filter(weapon => weapon.type === "Pistol")[0] || null;
    const grenades = weapons.filter(weapon => weapon.type === "Grenade");
    const isLeft = player.team.orientation === "left";
    let state = 'neutral';
    if(player.stats.kills > player.stats.deaths) {
      state = 'positive';
    } else if (player.stats.deaths > player.stats.kills) {
      state = 'negative';
    }
    return (
      <div className={`player ${state} ${player.state.health === 0 ? "dead" : ""} ${this.props.isObserved ? 'active' : ''}`}>
        <div className="player_data">
          <div className="background" />
          <Avatar steamid={player.steamid} showSkull={false}/>
          <div className="player_stats">
            <div className="health-bar-container">
              <div className={`hp_bar`} style={{ width: `${player.state.health}%` }}></div>
              <div className="username">
                <span>{player.observer_slot}</span> {player.name}
              </div>
              <Armor player={player} />
              <div className="health">
                {player.state.health}
              </div>
            </div>
            <div className="row">
              <div className="money">${player.state.money}</div>
              <div style={{display:'flex'}}>
                <img src={SkullRaw} width={11} />
                <div className="kills-count">{player.stats.kills}</div>
                <Skull width={9} />
                <div className="deaths-count">{player.stats.deaths}</div>
              </div>
              <div className="armor_and_utility">
                <Bomb player={player} />
                <Defuse player={player} width={12} />
              </div>
              <div className="grenades">
                {grenades.map(grenade => (
                  [
                    <div className={`single-grenade-container ${grenade.state === 'active' ? 'active':''}`}><Grenade key={`${grenade.name}-${grenade.state}`} weapon={grenade.name} active={grenade.state === "active"} height={15} /></div>,
                    grenade.ammo_reserve === 2 ? <div className={`single-grenade-container`}><Grenade key={`${grenade.name}-${grenade.state}-double`} weapon={grenade.name} active={false} height={15}/></div> : null,
                  ]
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
