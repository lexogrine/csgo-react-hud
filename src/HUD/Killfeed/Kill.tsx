import React from 'react';
import Weapon from './../Weapon/Weapon';
import flash_assist from './../../assets/flash_assist.png';


import { C4, Defuse, FlashedKill, Headshot, NoScope, SmokeKill, Suicide, Wallbang } from "./../../assets/Icons"
import { ExtendedKillEvent, BombEvent } from "./Killfeed"
export default class Kill extends React.Component<{ event: ExtendedKillEvent | BombEvent }> {
	render() {
		const { event } = this.props;
		if (event.type !== "kill") {
			return (
				<div className={`single_kill`}>
					<div className={`killer_name ${event.player.team.side}`}>{event.player.name}</div>
					<div className="way">
						{event.type === "plant" ? <C4 height="18px" /> : <Defuse height="18px" />}
					</div>
					<div className={`victim_name`}>{event.type === "plant" ? "planted the bomb" : "defused the bomb"}</div>

				</div>

			)
		}
		let weapon = <Weapon weapon={event.weapon} active={false} />;
		if(event.killer === event.victim) {
			weapon = <Suicide />;
		} else if(event.weapon === 'planted_c4'){
			weapon = <Weapon weapon={'c4'} active={false} />
		}
		return (
			<div className='single_kill_container'>
				<div className={`single_kill`}>
					{event.attackerblind ? <FlashedKill /> : null}
					{event.killer ? <div className={`killer_name ${event.killer.team.side}`}>{event.killer.name}</div> : null}
					{event.assister ?
						<React.Fragment>
							<div className="plus">+</div>
							{event.flashed ? <img src={flash_assist} className="flash_assist" alt={'[FLASH]'} /> : null}
							<div className={`assister_name ${event.assister.team.side}`}>{event.assister.name}</div>
						</React.Fragment>
						: ''}
					<div className="way">
						{weapon}
						{event.thrusmoke ? <SmokeKill /> : null}
						{event.noscope ? <NoScope /> : null}
						{event.wallbang ? <Wallbang /> : null}
						{event.headshot ? <Headshot /> : null}
					</div>
					<div className={`victim_name ${event.victim.team.side}`}>{event.victim.name}</div>
				</div>
			</div>
		);
	}

}
