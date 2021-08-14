import React from "react";
import Weapon from "./../Weapon/Weapon";
import { Player, WeaponRaw, Side, Orientation } from "csgogsi-socket";
import Grenade from "../Weapon/Grenade";

interface Props {
  orientation: Orientation,
  show: boolean;
  side: 'CT' | 'T',
  players: Player[]
}

function utilityState(amount: number) {
  if (amount === 20) {
    return "Full";
  }
  if (amount > 14) {
    return "Great";
  }
  if (amount > 9) {
    return "Good";
  }
  if (amount > 5) {
    return "Low";
  }
  if (amount > 0) {
    return "Poor";
  }
  return "None";
}

function utilityColor(amount: number) {
  if (amount === 20) {
    return "#22f222";
  }
  if (amount > 14) {
    return "#32f218";
  }
  if (amount > 9) {
    return "#8ef218";
  }
  if (amount > 5) {
    return "#f29318";
  }
  if (amount > 0) {
    return "#f25618";
  }
  return "#f21822";
}

function sum(grenades: WeaponRaw[], name: string) {
  return (
    grenades.filter(grenade => grenade.name === name).reduce((prev, next) => ({ ...next, ammo_reserve: (prev.ammo_reserve || 0) + (next.ammo_reserve || 0) }), { name: "", ammo_reserve: 0 })
      .ammo_reserve || 0
  );
}

function parseGrenades(players: Player[], side: Side) {
  const grenades = players
    .filter(player => player.team.side === side)
    .map(player => Object.values(player.weapons).filter(weapon => weapon.type === "Grenade"))
    .flat()
    .map(grenade => ({ ...grenade, name: grenade.name.replace("weapon_", "") }));
  return grenades;
}

export function summarise(players: Player[], side: Side) {
  const grenades = parseGrenades(players, side);
  return {
    hg: sum(grenades, "hegrenade"),
    flashes: sum(grenades, "flashbang"),
    smokes: sum(grenades, "smokegrenade"),
    inc: sum(grenades, "incgrenade") + sum(grenades, "molotov")
  };
}

class GrenadeContainer extends React.PureComponent<{ grenade: string; amount: number }> {
  render() {
    return (
      <div className={`grenade_container ${this.props.amount === 0 ? 'empty':''}`}>
        <Grenade weapon={this.props.grenade} active={false} height={20} />
        <div className="grenade_amount">{this.props.amount}</div>
      </div>
    );
  }
}

export default class SideBox extends React.Component<Props> {
  render() {
    const grenades = summarise(this.props.players, this.props.side);
    const total = Object.values(grenades).reduce((a, b) => a + b, 0);
    return (
      <div className={`utilitybox sidebox ${this.props.orientation} ${this.props.side || ''} ${this.props.show ? "show" : "hide"}`}>
        <div className="title">Team utility</div>
        <div className="content">
          <div className="utility_level">
            <div className="utility_label">Level</div>
            <div className="utility">{utilityState(total)}</div>
          </div>
          <div className="grenades_container">
            <GrenadeContainer grenade="smokegrenade" amount={grenades.smokes} />
            <GrenadeContainer grenade={this.props.side === 'CT' ? 'incgrenade' : 'molotov'} amount={grenades.inc} />
            <GrenadeContainer grenade="flashbang" amount={grenades.flashes} />
            <GrenadeContainer grenade="hegrenade" amount={grenades.hg} />
          </div>
        </div>
      </div>
    );
  }
}
