import React from 'react';
import './sideboxes.scss'

class LossBox extends React.PureComponent<{ active: boolean, side: 'CT' | 'T' }>{
    render() {
        return <div className={`loss-box ${this.props.side} ${this.props.active ? 'active' : ''}`}></div>
    }
}

interface Props {
    side: 'left' | 'right',
    team: 'CT' | 'T',
    loss: number,
    equipment: number,
    money: number,
    show: boolean,
}

export default class Money extends React.PureComponent<Props> {

    render() {
        return (
            <div className={`moneybox sidebox ${this.props.side} ${this.props.team} ${this.props.show ? "show" : "hide"}`}>
                <div className="title wide"><span>TEAM MONEY</span><span>LOSS BONUS</span></div>
                <div className="content">
                    <div className="money_container">
                        $ {this.props.money}
                    </div>
                    <div className="loss_container">
                        <div className="losses">
                            <LossBox side={this.props.team} active={(this.props.loss - 1400) / 500 >= 1} />
                            <LossBox side={this.props.team} active={(this.props.loss - 1400) / 500 >= 2} />
                            <LossBox side={this.props.team} active={(this.props.loss - 1400) / 500 >= 3} />
                            <LossBox side={this.props.team} active={(this.props.loss - 1400) / 500 >= 4} />
                        </div>
                        <div className="label">
                            $ {this.props.loss}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
