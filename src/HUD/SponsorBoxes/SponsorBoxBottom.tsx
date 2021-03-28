import React from 'react';
import { AMD, MonsterEnergy, Nitrado, Warsteiner, F4UGStore } from '../../assets/Sponsors';
import './sponsorboxes.scss'



export default class SponsorBoxBottom extends React.Component {
	
	render() {
		return (
			<div className='sponsorbox bottom'>
				<div className='sponsorlogo_container'><img src={Warsteiner} alt={'[Warsteiner]'}/></div>
				<div className='sponsorlogo_container'><AMD /></div>
				<div className='sponsorlogo_container'><img src={MonsterEnergy} alt={'[MonsterEnergy]'}/></div>
				<div className='sponsorlogo_container'><img src={F4UGStore} alt={'[F4UGStore]'}/></div>
				<div className='sponsorlogo_container'><Nitrado /></div>
            </div>
		);
	}

}
