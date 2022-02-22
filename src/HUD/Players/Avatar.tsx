import React from 'react';
import CameraContainer from '../Camera/Container';
import PlayerCamera from "./../Camera/Camera";

import { avatars } from './../../api/avatars';

import { Skull } from './../../assets/Icons';

interface IProps {
  steamid: string,
  slot?: number,
  height?: number,
  width?: number,
  showSkull?: boolean,
  showCam?: boolean,
  sidePlayer?: boolean
}
export default class Avatar extends React.Component<IProps> {

  render() {
    const { showCam, steamid, width, height, showSkull, sidePlayer } = this.props;
    //const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    const avatarData = avatars[this.props.steamid];
    if (!avatarData || !avatarData.url) {
      return null;
    }

    return (
      <div className={`avatar`}>
        {
          showCam ? ( sidePlayer ? <div className="videofeed"><PlayerCamera steamid={steamid} visible={true} /></div> : <CameraContainer observedSteamid={steamid} />) : null
        }
        {
          showSkull ? <Skull height={height} width={width} /> : <img src={avatarData.url} height={height} width={width} alt={'Avatar'} />
        }

      </div>
    );
  }

}
