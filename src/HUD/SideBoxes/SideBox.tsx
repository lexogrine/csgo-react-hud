import React from 'react';
import './../Styles/sideboxes.css'

import {configs} from './../../App';

export default class SideBox extends React.Component<{ side: 'left' | 'right', hide: boolean}, { title: string, subtitle: string, image?: string }> {
	constructor(props: any) {
		super(props);
		this.state = {
            title:'Title',
            subtitle:'Content'
		}
	}

	componentDidMount() {
        configs.onChange((data:any) => {
            if(!data) return;
            const display = data.display_settings;
            if(!display) return;
            if(display[`${this.props.side}_title`]){
                this.setState({title:display[`${this.props.side}_title`]})
            }
            if(display[`${this.props.side}_subtitle`]){
                this.setState({subtitle:display[`${this.props.side}_subtitle`]})
            }
            if(display[`${this.props.side}_image`]){
                this.setState({image:display[`${this.props.side}_image`]})
            }
        });
	}
	
	render() {
        if(!this.state.title) return '';
		return (
			<div className={`sidebox ${this.props.side} ${this.props.hide ? 'hide':''}`}>
                <div className="title_container">
                    <div className="title">{this.state.title}</div>
                    <div className="subtitle">{this.state.subtitle}</div>
                </div>
                <div className="image_container">
                    {this.state.image ? <img src={`data:image/jpeg;base64,${this.state.image}`} id={`image_left`} alt={'Left'}/>:''}
                </div>
            </div>
		);
	}

}
