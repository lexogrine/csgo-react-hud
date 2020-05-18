import React from "react";
import { Player } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./../Styles/observed.css";
import {apiUrl} from './../../api/api';
import { getCountry } from "./../countries";
import { ArmorHelmetCT, ArmorHelmetT, ArmorFullCT, ArmorFullT, HealthFullCT, HealthFullT, BulletsCT, BulletsT } from './../../assets/Icons';


const armor = {
  full: {
    CT: ArmorFullCT,
    T: ArmorFullT
  },
  helmet: {
    CT: ArmorHelmetCT,
    T: ArmorHelmetT
  }
};

class Statistic extends React.PureComponent<{ label: string; value: string | number }> {
  render() {
    return (
      <div className="stat">
        <div className="label">{this.props.label}</div>
        <div className="value">{this.props.value}</div>
      </div>
    );
  }
}

export default class Observed extends React.Component<{ player: Player | null }> {
	render() {
		if (!this.props.player) return '';
		const { player } = this.props;
		const country = player.country || player.team.country;
		const weapons = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
		const currentWeapon = weapons.filter(weapon => weapon.state === "active")[0];  
		const grenades = weapons.filter(weapon => weapon.type === "Grenade");
		const { stats } = player;
		const ratio = stats.deaths === 0 ? stats.kills : stats.kills/stats.deaths;
		return (
			<div className={`observed ${player.team.side}`}>
				<div className="main_row">
					<Avatar steamid={player.steamid} height={140} />
					<TeamLogo team={player.team} height={35} />
					<div className="username_container">
						<div className="username">{player.name}</div>
						<div className="real_name">{player.realName}</div>
					</div>
					<div className="flag">{country ? <img src={`${apiUrl}files/img/flags/${getCountry(country).replace(/ /g, "-")}.png`} alt={country}/> : ''}</div>
					<div className="grenade_container">
						{grenades.map(grenade => <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />)}
						</div>
				</div>
				<div className="stats_row">
					<div className="health_armor_container">
						<div className="health-icon icon"><img src={player.team.side === "CT" ? HealthFullCT : HealthFullT} alt={'Health'}/></div>
						<div className="health text">{player.state.health}</div>
						<div className="armor-icon icon"><img src={armor[player.state.helmet ? 'helmet' : 'full'][player.team.side]} alt={'Armor'} /></div>
						<div className="health text">{player.state.armor}</div>
					</div>
					<div className="statistics">
						<Statistic label={"K"} value={stats.kills} />
						<Statistic label={"A"} value={stats.assists} />
						<Statistic label={"D"} value={stats.deaths} />
						<Statistic label={"K/D"} value={ratio.toFixed(2)} />
					</div>
					<div className="ammo">
						<div className="ammo_icon_container">
							<img src={player.team.side === "CT" ? BulletsCT : BulletsT} alt={'Ammo'}/>
						</div>
            <div className="ammo_counter">
              <div className="ammo_clip">{(currentWeapon && currentWeapon.ammo_clip) || "-"}</div>
              <div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
