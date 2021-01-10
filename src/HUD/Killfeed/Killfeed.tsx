import React from 'react';
import { GSI } from './../../App';
import { KillEvent, Player } from 'csgogsi-socket';
import Kill from './Kill';
import './killfeed.scss';


export interface ExtendedKillEvent extends KillEvent {
    type: 'kill'
}

export interface BombEvent {
    player: Player,
    type: 'plant' | 'defuse'
}

export default class Killfeed extends React.Component<any, { events: (BombEvent | ExtendedKillEvent)[] }> {

    constructor(props: any){
        super(props);
        this.state = {
            events: []
        }
    }
    addKill = (kill: KillEvent) => {
        this.setState(state => {
            state.events.push({...kill, type: 'kill'});
            return state;
        })
    }

    addBombEvent = (player: Player, type: 'plant' | 'defuse') => {
        if(!player) return;
        const event: BombEvent = {
            player: player,
            type: type
        }
        this.setState(state => {
            state.events.push(event);
            return state;
        })
    }
    
	async componentDidMount() {
		GSI.on("kill", kill => {
            this.addKill(kill);
        });
        GSI.on("data", data => {

            if(data.round && data.round.phase === "freezetime"){
                if(Number(data.phase_countdowns.phase_ends_in) < 10 && this.state.events.length > 0){
                    this.setState({events:[]})
                }
            }
        });

        /*
        GSI.on("bombPlant", player => {
            this.addBombEvent(player, 'plant');
        })
        GSI.on("bombDefuse", player => {
            this.addBombEvent(player, 'defuse');
        })

        */

	}
	render() {
		return (
			<div className="killfeed">
                {this.state.events.map(event => <Kill event={event}/>)}
			</div>
		);
	}

}
