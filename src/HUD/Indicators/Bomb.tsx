import React from 'react';
import { Player } from 'csgogsi-socket';
import {Bomb as BombIcon} from './../../assets/Icons';
export default class Bomb extends React.Component<{ player: Player, width?: number }> {
    render() {
        const { player, width } = this.props;
        if(Object.values(player.weapons).every(weapon => weapon.type !== "C4")) return '';
        return (
            <div className={`armor_indicator`}>
                <BombIcon width={width} />
            </div>
        );
    }

}
