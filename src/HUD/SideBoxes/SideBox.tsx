import React from 'react';
import './sideboxes.scss'
import {configs} from './../../App';
import isSvg from '../isSvg';

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
        const { image, title, subtitle} = this.state;
        if(!title) return '';
        const encoding = image && isSvg(Buffer.from(image, 'base64')) ? 'svg+xml':'png';
		return (
			<div className={`sidebox ${this.props.side} ${this.props.hide ? 'hide':''}`}>
                <div className="title_container">
                    <div className="title">{title}</div>
                    <div className="subtitle">{subtitle}</div>
                </div>
                <div className="image_container">
                    {this.state.image ? <img src={`data:image/${encoding};base64,${image}`} id={`image_left`} alt={'Left'}/>:''}
                </div>
            </div>
		);
	}

}
