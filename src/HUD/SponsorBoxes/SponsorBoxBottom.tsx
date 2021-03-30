import React from 'react';
import { AMD, Nitrado, Warsteiner } from '../../assets/Sponsors';
import './sponsorboxes.scss'



export default class SponsorBoxBottom extends React.Component {
	
	render() {
		return (
			<div className='sponsorbox bottom'>
				<div className='sponsorlogo_container'><img src={Warsteiner} alt={'[Warsteiner]'}/></div>
				<div className='sponsorlogo_container'><AMD /></div>
				<div className='sponsorlogo_container'><Nitrado /></div>
            </div>
		);
	}

}
