import { RoundInfo, Team } from "csgogsi";
import TeamLogo from "../MatchBar/TeamLogo";
import "./index.scss";

const RoundEntry = ({ roundInfo, isCurrent, team, isTrophy }: { roundInfo: RoundInfo | null, isCurrent: boolean, team: Team, isTrophy :boolean }) => {
    if (!roundInfo) {
        return (
            <div className={`round-entry x ${isCurrent ? 'active' : ''} ${isTrophy ? 'trophy':''}`}></div>
        )
    }
    return (
        <div className={`round-entry ${roundInfo.side} ${isTrophy ? 'trophy':''} ${team === roundInfo.team ? 'active' : ''}`}></div>
    )
}

const getRoundsToWin = (round: number, mr = 3) => {

    if (round <= 30) {
        return 16
    }

    const additionalRounds = round - 30;
    const OT = Math.ceil(additionalRounds / (mr*2));
    return 16 + OT * mr
}

const getRange = (round: number) => {
    if (round < 16) {
        return Array(15).fill(0).map((_, i) => i + 1);
    }
    if (round < 31) {
        return Array(15).fill(0).map((_, i) => i + 16);
    }

    const beginRound = 31 + 3 * Math.floor((round - 31) / 3);

    return Array(3).fill(0).map((_, i) => i + beginRound);
}

const TeamRoundHistory = ({ rounds, team, currentRound }: { rounds: RoundInfo[], team: Team, currentRound: number }) => {
    const roundRange = getRange(currentRound);

    const minimalRoundForWin = currentRound - 1 + getRoundsToWin(currentRound) - team.score;

    return (
        <div className="team-info-container">
            <div className="team-info">
                <TeamLogo team={team} />
                <div className="team-score">{team.score}</div>
            </div>
            <div className="team-rounds">
                {
                    roundRange.map(round => <RoundEntry isTrophy={minimalRoundForWin === round}  roundInfo={rounds.find(roundInfo => roundInfo.round === round) || null} isCurrent={currentRound === round} team={team} />)
                }
            </div>
        </div>
    )
}

const RoundHistory = ({ rounds, left, right, currentRound }: { rounds: RoundInfo[], left: Team, right: Team, currentRound: number }) => {
    return (
        <div className="round-history">
            <div className="rounds-info">
                <TeamRoundHistory team={left} currentRound={currentRound} rounds={rounds} />
                <TeamRoundHistory team={right} currentRound={currentRound} rounds={rounds} />
            </div>
        </div>
    )
}

export default RoundHistory;