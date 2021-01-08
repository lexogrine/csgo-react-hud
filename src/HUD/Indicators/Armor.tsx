import React from 'react';
import { Player } from 'csgogsi-socket';
import {ArmorHelmet, ArmorFull} from './../../assets/Icons';
export default class Armor extends React.Component<{ player: Player }> {
    render() {
        const { player } = this.props;
        if(!player.state.health || !player.state.armor) return '';
        return (
            <div className={`armor_indicator`}>
                {player.state.helmet ? <ArmorHelmet /> : <ArmorFull/>}
            </div>
        );
    }

}
