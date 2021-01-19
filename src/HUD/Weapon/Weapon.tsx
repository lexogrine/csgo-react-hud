import React from 'react';
import * as Weapons from './../../assets/Weapons';

interface IProps extends React.SVGProps<SVGSVGElement> {
	weapon: string,
	active: boolean,
	isGrenade?: boolean
}
export default class WeaponImage extends React.Component<IProps> {
	render() {
		const { weapon, active, isGrenade, ...rest } = this.props;
		const Weapon = (Weapons as any)[weapon];
		const { className, ...svgProps } = rest;
		if(!Weapon) return null;
		return (
			<Weapon fill="white" className={`${active ? 'active':''} weapon ${isGrenade ? 'grenade' : ''} ${className || ''}`} {...svgProps} />
		);
	}	
}