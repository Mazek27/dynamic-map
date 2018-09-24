import * as React from "react";
import "./style.scss"
import {IconContext} from "../Map/Map";

interface IProps {
    text : string
    value : number
}

export class CircleIcon extends React.Component<IProps, any> {
    render() {
        if(this.props.value === undefined){
            return (<></>)
        }
        let pixel = 177.5
        let diameter= 10
        if(this.props.value < 0.4){
            pixel = 0
            diameter= (25 * 0.4 + 10) /2
        } else if(this.props.value > 1.6) {
            pixel = 354
            diameter=  (25 * 1.6 + 10) /2
        } else {
            pixel = (this.props.value - 0.4) / 1.2 * 355
            diameter= (25 * this.props.value + 10) /2
        }
        return (
            <IconContext.Consumer>
                {(colorR : any) =>
                    <div style={{
                        backgroundColor: `rgb(${colorR.getColor(pixel)[0]}, ${colorR.getColor(pixel)[1]}, ${colorR.getColor(pixel)[2]})`,
                        borderRadius: `${diameter}px`,
                        width: `${diameter*2}px`,
                        height: `${diameter*2}px`,
                        transform: `translate3d(-${Math.abs(diameter)}px,-${Math.abs(diameter)}px,0px)`,
                        borderWidth: `1px`,
                        borderStyle: 'solid',
                        borderColor: 'black',
                        opacity: 0.85
                    }}/>
                }
            </IconContext.Consumer>
        );
    }
}