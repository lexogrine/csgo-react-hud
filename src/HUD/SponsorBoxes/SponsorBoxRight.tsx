import React from 'react'
import { Logo99DamageLiga } from '../../assets/Sponsors'
import './sponsorboxes.scss'


export default class SponsorBoxRight extends React.Component {
    render() {
        return (
            <div className='sponsorbox right'>
                <img src={Logo99DamageLiga} alt={'[99Liga]'}/>
            </div>
        )
    }
}
