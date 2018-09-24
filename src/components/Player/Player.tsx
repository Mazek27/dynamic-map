import * as React from "react";
import { Map } from "../Map/Map"
import "./style.scss"
import { downloadFile, PngMimeType, JpgMimeType, FileDescription, prepareBlobFor } from "../../../service/file";
import { DynamicLayerConfigurator, Configuration } from "../Map/DynamicLayerConfigurator/compontent";
import { PlayerBar } from "../PlayerBar/component";
import {Moment, months} from "moment";
import moment = require("moment");
var html2canvas = require(`html2canvas`);
let GIF = require("../../../node_modules/gif.js.optimized")

export interface IPlayerState {
    start_date?: Moment
    end_date?: Moment
    current_date?: Moment
    isRecorded?: boolean
    playSpeed?: number

    multiModeEnabled?: boolean,
    aggregationType?: any,
    playerRunning?: boolean
    handlePlayButtonClick?: (speed: number) => void
    handleSpeedChange?: (speed: any) => void
}

export interface IFrames{
    id : number
    frame : HTMLCanvasElement
}

export const PlayerContext = React.createContext<IPlayerState>({});

export class Player extends React.Component<{}, IPlayerState> {

    private playInstance: any = {}
    private frames: IFrames[] = []

    constructor(props: any) {
        super(props)
        this.state = {
            current_date: moment([2017, 0, 1]),
            start_date: moment([2017, 0, 1]),
            end_date: moment([2017, 0, 12]),
            aggregationType: 'days',
            isRecorded: false,
            multiModeEnabled: false,
            playerRunning: false,
            playSpeed: 1
        }
        this.handleDownloadClick = this.handleDownloadClick.bind(this)
        this.handleSpeedChange = this.handleSpeedChange.bind(this)
    }

    startRecordGif() {
        this.setState({
            isRecorded: true,
            current_date: this.state.start_date
        })
        this.frames = []
        let recordedWait = setInterval(() => {
            let warunek =  this.state.aggregationType == 'day'?
                this.frames.length == this.state.end_date.diff(this.state.start_date, 'days')+1 :
                this.frames.length == this.state.end_date.diff(this.state.start_date, 'month')+1
            if( warunek ){
                console.log(this.state.aggregationType)
                console.log(this.frames.length)
                console.log(this.state.end_date.diff(this.state.start_date, 'days')+1)
                console.log(this.state.end_date.diff(this.state.start_date, 'month')+1)
                console.log("Zaczynam Pobieranie Gifa")
                this.setState({
                    isRecorded: false
                }, () => {
                    let objectGIF = new GIF({
                        workers: 10,
                        quality: 1
                    });

                    this.frames.sort((a, b) => a > b ? 1 : 0)
                    this.frames.forEach(frame => objectGIF.addFrame(frame.frame, { delay: this.state.playSpeed * 1000, copy: true }));


                    objectGIF.on('finished', (blob: any)=> {
                        const url = window.URL.createObjectURL(blob);

                        const anchor = document.createElement("a");
                        let fileName =
                            this.state.aggregationType == 'day' ?
                                `${this.state.start_date.format("YYYYMMDD")}_${this.state.end_date.format("YYYYMMDD")}` :
                                `${this.state.start_date.format("YYYYMM")}_${this.state.end_date.format("YYYYMM")}`;
                        anchor.download = `animation_${fileName}.gif`;
                        anchor.href = url;
                        anchor.target = "_blank";
                        anchor.className = "hidden";

                        document.body.appendChild(anchor);

                        anchor.click();

                        setTimeout(() => {
                            document.body.removeChild(anchor);
                            window.URL.revokeObjectURL(url);
                        }, 0);
                    });

                    objectGIF.render()
                    clearTimeout(recordedWait)
                } )
            }
        }, 200)
    }

    appendFrame() {
        document.getElementsByClassName("leaflet-control-container")[0].setAttribute("data-html2canvas-ignore", "true")
        document.getElementById("LayerConfigurator").setAttribute("data-html2canvas-ignore", "true")
        let node = document.getElementById("leaflet-map")
        let id = this.state.current_date.month()
        html2canvas(node, {
            preferCanvas: true,
            useCORS: true,
            allowTaint: false,
            letterRendering: true,
            onclone:  (doc : any) => {
                this.setState({
                    current_date: this.state.current_date.clone().add(1, this.state.aggregationType)
                })
            }
        }).then((canvas: HTMLCanvasElement) => {
            this.frames.push({frame: canvas, id : id})

        })

    }

    componentDidUpdate() {
        if (this.state.isRecorded) {
            if (this.state.current_date <= this.state.end_date) {
                this.appendFrame()
            } else {



                // while(true){
                //     if(this.frames.length == this.state.start_date.diff(this.state.end_date, 'days'))
                //         break;
                // }
                // // let gif = (window as any).gif;
                // let objectGIF = new GIF({
                //     workers: 10,
                //     quality: 1
                // });
                //
                // this.frames.sort((a, b) => a < b ? 1 : 0)
                // this.frames.forEach(frame => objectGIF.addFrame(frame.frame, { delay: 200, copy: true }));
                //
                //
                // objectGIF.on('finished', function (blob: any) {
                //     const url = window.URL.createObjectURL(blob);
                //
                //     const anchor = document.createElement("a");
                //     anchor.download = "gif.gif";
                //     anchor.href = url;
                //     anchor.target = "_blank";
                //     anchor.className = "hidden";
                //
                //     document.body.appendChild(anchor);
                //
                //     anchor.click();
                //
                //     setTimeout(() => {
                //         document.body.removeChild(anchor);
                //         window.URL.revokeObjectURL(url);
                //     }, 0);
                // });
                //
                // objectGIF.render()
            }

        }
    }

    options = {
        width: '100%',
        height: '60px',
        stack: false,
        showMajorLabels: true,
        showCurrentTime: true,
        zoomMin: 1000000,
        type: 'background',
        format: {
            minorLabels: {
                month: `mm`,
                day: 'dd'
            }
        }
    }

    private handleDownloadClick(e: any) {
        if(this.state.multiModeEnabled){
            this.startRecordGif()
        } else {
            document.getElementsByClassName("leaflet-control-container")[0].setAttribute("data-html2canvas-ignore", "true")
            document.getElementById("LayerConfigurator").setAttribute("data-html2canvas-ignore", "true")
            let node = document.getElementById("leaflet-map");
            html2canvas(node, {
                preferCanvas: true,
                useCORS: true,
                allowTaint: false,
                letterRendering: true
            }).then((canvas: HTMLCanvasElement) => {
                let fileName =
                    this.state.aggregationType == 'day' ?
                    this.state.current_date.format("YYYYMMDD") :
                    this.state.current_date.format("YYYYMM")
                downloadFile({name: `frame_${fileName}.jpg`, type: JpgMimeType, data: canvas})
            }).catch((errorObject: any) => console.log(errorObject))
        }
    }

    handleSpeedChange(speed : any){
        this.setState({
            playSpeed : speed.target.value
        })
    }

    handleConfigurationChange(configuration: Configuration) {
        console.log(JSON.stringify(configuration));

        if (configuration.multi) {
            console.log(configuration.value.multiFrom.toDate())
            this.setState({
                start_date: configuration.value.multiFrom,
                end_date: configuration.value.multiTo,
                current_date: configuration.value.singleRange,
                multiModeEnabled: true,
                aggregationType: configuration.aggregation
            })
        } else {
            this.setState({
                current_date: configuration.value.singleRange,
                multiModeEnabled: false,
                aggregationType: configuration.aggregation
            })
        }
    }

    handlePlayButtonClick = (speed: number) => {
        if (this.state.playerRunning == false) {
            this.runPlayer(speed);
        } else {
            this.stopPlayer();
        }
    }

    runPlayer(speed: number) {
        this.setState({ current_date: this.state.start_date }, () => {

            this.playInstance = setInterval(() => {
                if (this.state.current_date < this.state.end_date) {
                    this.setState({
                        current_date: this.state.current_date.clone().add(1, this.state.aggregationType),
                    })
                } else {
                    this.setState({ playerRunning: false, current_date: this.state.start_date })
                    clearTimeout(this.playInstance)
                }
            }, speed * 1000)

            this.setState({ playerRunning: true })
        })
    }

    stopPlayer() {
        this.setState({ playerRunning: false, current_date: this.state.start_date })
        clearTimeout(this.playInstance)
    }

    render() {
        return (
            <PlayerContext.Provider value={{
                ...this.state,
                handlePlayButtonClick: this.handlePlayButtonClick,
                handleSpeedChange: this.handleSpeedChange
            }}>
                <Map aggregationType={this.state.aggregationType} timeFrame={this.state.current_date} >
                    <DynamicLayerConfigurator onConfigurationChange={c => this.handleConfigurationChange(c)}>
                        <PlayerBar />
                        <button className="download" onClick={this.handleDownloadClick}>Pobierz</button>
                    </DynamicLayerConfigurator>
                </Map>
            </PlayerContext.Provider>
        )
    }

}