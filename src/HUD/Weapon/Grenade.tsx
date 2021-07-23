import React from 'react';

import { ReactComponent as smokegrenade } from './smokegrenade.svg';
import { ReactComponent as flashbang } from './flashbang.svg';
import { ReactComponent as decoy } from './decoy.svg';
import { ReactComponent as hegrenade } from './hegrenade.svg';
import { ReactComponent as incgrenade } from './incgrenade.svg';
import { ReactComponent as molotov } from './molotov.svg';

const Weapons = {
    smokegrenade,
    flashbang,
    decoy,
    hegrenade,
    incgrenade,
    molotov
}

interface IProps extends React.SVGProps<SVGSVGElement> {
	weapon: string,
	active: boolean,
    height: number,
}
export default class Grenade extends React.Component<IProps> {
	render() {
		const { weapon, active, height, ...rest } = this.props;
		const Weapon = (Weapons as any)[weapon];
		const { className, ...svgProps } = rest;
		if(!Weapon) return null;
        let imageHeight = height;
        if(weapon !== 'flashbang'){
            //imageHeight = imageHeight*0.76;
        }
		return (
			<Weapon fill="white" className={`${active ? 'active':''} weapon grenade ${weapon} ${className || ''}`} {...svgProps} height={imageHeight} />
		);
	}	
}