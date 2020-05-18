import React from 'react';
import { Team } from 'csgogsi-socket';


export default class Avatar extends React.Component<{ team?: Team | null, height?: number, width?: number}> {
  render(){
    if(!this.props.team) return null;
    return (
      <div className={`logo`}>
          { this.props.team.logo ? <img src={`data:image/jpeg;base64,${this.props.team.logo}`} width={this.props.width} height={this.props.height} alt={'Team logo'} /> : ''}
      </div>
    );
  }

}
