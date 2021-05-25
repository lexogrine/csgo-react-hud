import React from 'react';
import './sideboxes.scss'
import {configs, hudIdentity} from './../../App';
import { apiUrl } from '../../api/api';

export default class SideBox extends React.Component<{ side: 'left' | 'right', hide: boolean}, { title: string, subtitle: string, image?: string }> {
	constructor(props: any) {
		super(props);
		this.state = {
            title:'Title',
            subtitle:'Content',
		}
	}

	componentDidMount() {
        configs.onChange((data:any) => {
            if(!data) return;
            const display = data.display_settings;
            if(!display) return;
            if(`${this.props.side}_title` in display){
                this.setState({title:display[`${this.props.side}_title`]})
            }
            if(`${this.props.side}_subtitle` in display){
                this.setState({subtitle:display[`${this.props.side}_subtitle`]})
            }
            if(`${this.props.side}_image` in display){
                const imageUrl = `${apiUrl}api/huds/${hudIdentity.name || 'dev'}/display_settings/${this.props.side}_image?isDev=${hudIdentity.isDev}&cache=${(new Date()).getTime()}`;
                this.setState({image:imageUrl})
            }
        });
	}
	
	render() {
        const { image, title, subtitle} = this.state;
        if(!title) return '';
		return (
			<div className={`sidebox ${this.props.side} ${this.props.hide ? 'hide':''}`}>
                <div className="title_container">
                    <div className="title">{title}</div>
                    <div className="subtitle">{subtitle}</div>
                </div>
                <div className="image_container">
                    {image ? <img src={image} id={`image_left`} alt={'Left'}/>:''}
                </div>
            </div>
		);
	}

}
