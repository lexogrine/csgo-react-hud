import React from 'react';
import Weapon from './../Weapon/Weapon';
import headshot from './../../assets/headshot.png';
import wallbang from './../../assets/wallbang.png';
import flash_assist from './../../assets/flash_assist.png';
import flash_kill from './../../assets/flashed_kill.png';
import smoke_kill from './../../assets/smoke_kill.png';
import noscope_kill from './../../assets/noscope_kill.png';


import { C4, Defuse } from "./../../assets/Icons"
import { ExtendedKillEvent, BombEvent } from "./Killfeed"
export default class Kill extends React.Component<{ event: ExtendedKillEvent | BombEvent }> {

	render() {
		const { event } = this.props;
		if (event.type !== "kill") {
			return (
				<div className={`single_kill`}>
					<div className={`killer_name ${event.player.team.side}`}>{event.player.name}</div>
					<div className="way">
						{event.type === "plant" ? <C4 height="18px" />: <Defuse height="18px"/>}
					</div>
					<div className={`victim_name`}>{ event.type === "plant" ? "planted the bomb" : "defused the bomb"}</div>

				</div>

			)
		}

		return (
			<div className={`single_kill`}>
				{event.attackerblind ? <img src={flash_kill} className="flash_kill" alt={'[FLASHED]'} /> : ''}
				{ event.killer ? <div className={`killer_name ${event.killer.team.side}`}>{event.killer.name}</div> : null}
				{event.assister ?
					<React.Fragment>
						<div className="plus">+</div>
						{event.flashed ? <img src={flash_assist} className="flash_assist" alt={'[FLASH]'} /> : ''}
						<div className={`assister_name ${event.assister.team.side}`}>{event.assister.name}</div>
					</React.Fragment>
					: ''}
				<div className="way">
					<Weapon weapon={event.weapon} active={false} />
					{event.thrusmoke ? <img src={smoke_kill} className="smoke_kill"  alt={'[SMOKE]'}/> : ''}
					{event.noscope ? <img src={noscope_kill} className="noscope_kill"  alt={'[NOSCOPE]'}/> : ''}
					{event.wallbang ? <img src={wallbang} className="wallbang"  alt={'[WALLBANG]'}/> : ''}
					{event.headshot ? <img src={headshot} className="headshot"  alt={'[HEADSHOT]'}/> : ''}
				</div>
				<div className={`victim_name ${event.victim.team.side}`}>{event.victim.name}</div>
			</div>
		);
	}

}
