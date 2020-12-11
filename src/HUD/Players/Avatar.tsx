import React from 'react';

import { avatars } from './../../api/avatars';

import { Skull } from './../../assets/Icons';

export default class Avatar extends React.Component<{steamid: string, slot?: number, height?: number, width?: number, showSkull?: boolean, showCam?: boolean}> {
  render(){
    const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    if(!url || (!url.steam.length && !url.custom.length)){
        return '';
    }
    const slot = this.props.slot === 0 ? 10 : this.props.slot || 1;
    const leftPosition = - 150*((slot-1)%5);
    const topPosition = slot > 5 ? -150 : 0;
    return (
      <div className={`avatar`}>
          {
            this.props.showCam ? <div  id="cameraFeed"><iframe style={{top: `${topPosition}px`, left: `${leftPosition}px`}} src="./test.html" title="Camera feed" /></div> : null
          }
          <img src={this.props.showSkull ? Skull : (url.custom || url.steam)} height={this.props.height} width={this.props.width} alt={'Avatar'} />
      </div>
    );
  }

}
