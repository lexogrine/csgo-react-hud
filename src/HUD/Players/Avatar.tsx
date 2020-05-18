import React from 'react';

import { avatars } from './../../api/avatars';

import { Skull } from './../../assets/Icons';

export default class Avatar extends React.Component<{steamid: string, height?: number, width?: number, showSkull?: boolean}> {
  render(){
    const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    if(!url || (!url.steam.length && !url.custom.length)){
        return '';
    }
    return (
      <div className={`avatar`}>
          <img src={this.props.showSkull ? Skull : (url.custom || url.steam)} height={this.props.height} width={this.props.width} alt={'Avatar'} />
      </div>
    );
  }

}
