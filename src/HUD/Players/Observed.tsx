import React from "react";
import { Player } from "csgogsi-socket";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./observed.scss";
import { apiUrl } from './../../api/api';
import { getCountry } from "./../countries";
import Health from './../../assets/health.png';
import { ArmorHelmet, ArmorFull, Kill, Bullets, SkullRaw } from './../../assets/Icons';
import { Veto } from "../../api/interfaces";
import Grenade from "../Weapon/Grenade";
import { getFlag } from "../../assets/flags";
import Defuse from "../Indicators/Defuse";
import Bomb from "../Indicators/Bomb";
import { actions } from "../../App";

class Statistic extends React.PureComponent<{ label: string; value: string | number, }> {
	render() {
		return (
			<div className="stat">
				<div className="label">{this.props.label}</div>
				<div className="value">{this.props.value}</div>
			</div>
		);
	}
}

export default class Observed extends React.Component<{ player: Player | null, veto: Veto | null, round: number }, { showCam: boolean }> {
	constructor(props: any){
		super(props);
		this.state = {
		  showCam: true
		}
	  }
	componentDidMount() {
		actions.on('toggleCams', () => {
			console.log(this.state.showCam)
			this.setState({ showCam: !this.state.showCam });
		});
	}
	getAdr = () => {
		const { veto, player } = this.props;
		if (!player || !veto || !veto.rounds) return null;
		const damageInRounds = veto.rounds.map(round => round.players[player.steamid]).filter(data => !!data).map(roundData => roundData.damage);
		return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
	}
	render() {
		if (!this.props.player) return '';
		const { player } = this.props;
		const country = player.country || player.team.country;
		const weapons = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
		const currentWeapon = weapons.filter(weapon => weapon.state === "active")[0];
		const grenades = weapons.filter(weapon => weapon.type === "Grenade");
		const { stats } = player;
		const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths;
		const flag = country ? getFlag(country) : null;
		return (
			<div className={`observed ${player.team.side}`}>
				<div className="main_row">
					{<Avatar steamid={player.steamid} height={162} width={162} showCam={false} slot={player.observer_slot}/>}
					<div className="flag">{flag ? <img src={flag} alt={flag} /> : ''}</div>
					<div className="username">{player.name}</div>
					<div className={`ammo ${!currentWeapon || !currentWeapon.ammo_clip ? 'no-weapon':''}`}>
						<div className={`current_rounds_kills ${player.state.round_kills ? 'active':''}`}>
                			<img src={SkullRaw} width={15} />
							{player.state.round_kills || null}
						</div>
						<div className="ammo_icon_container">
							<Bullets />
						</div>
						<div className="ammo_counter">
							<div className="ammo_clip">{(currentWeapon && currentWeapon.ammo_clip) || "-"}</div>
							<div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
						</div>
					</div>
				</div>
				<div className="stats_row">
					<div className="health_armor_container">
						<div className="health-icon icon">
							<img src={Health} />
						</div>
						<div className="health text">{player.state.health}</div>
						<div className="armor-icon icon">
							{player.state.helmet ? <ArmorHelmet /> : <ArmorFull />}
						</div>
						<div className="health text">{player.state.armor}</div>
					</div>

					<div className="grenade_container">
						<Defuse player={player} width={19} />
						<Bomb player={player} width={19} />
						{grenades.map(grenade => <React.Fragment key={`${player.steamid}_${grenade.name}_${grenade.ammo_reserve || 1}`}>
							<Grenade weapon={grenade.name} active={grenade.state === 'active'} height={19}/>
							{ 
							grenade.ammo_reserve === 2 ? <Grenade weapon={grenade.name} active={false} height={19}/> : null }
						</React.Fragment>)}
					</div>
				</div>
			</div>
		);
	}
}
