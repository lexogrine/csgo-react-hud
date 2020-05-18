import React from 'react';
import { config } from './../../api/api';

export default class WeaponImage extends React.Component<{ weapon: string, active: boolean, isGrenade?: boolean}> {
	render() {
		return (
			<img alt={'Weapon'} src={`${config.apiAddress}files/img/weapons/${this.props.weapon}.png`} className={`${this.props.active ? 'active':''} weapon ${this.props.isGrenade ? 'grenade' : ''}`} />
		);
	}	
}