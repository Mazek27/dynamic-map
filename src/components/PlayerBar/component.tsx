import React = require("react");
import "./style.scss"
import { PlayerContext, IPlayerState } from "../Player/Player";

export interface IProps {
    // onPlayerStart: (speed: number) => void
    // onPlayerStop: () => void
    visible?: boolean
    running?: boolean
}

export class PlayerBar extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <PlayerContext.Consumer>
                {
                    ({ playerRunning, multiModeEnabled, handlePlayButtonClick, handleSpeedChange, playSpeed }) => {

                        let className = multiModeEnabled ? "PlayerBar" : "PlayerBar hidden";
                        className += playerRunning ? " playing" : "";

                        return <div className={className}>
                            <span>
                                Prędkość <input type="number" value={playSpeed} onChange={handleSpeedChange} disabled={playerRunning} /> sek. na klatkę
                            </span>
                            <button
                                onClick={e => { handlePlayButtonClick(playSpeed) }}>
                                {playerRunning ? "Zatrzymaj" : "Odtwórz"}
                            </button>
                        </div>
                    }}
            </PlayerContext.Consumer>)
    }
}