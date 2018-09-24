import * as React from "react";
// import {request} from "./services/endpointConnection"
import {Map} from "./components/Map/Map"
import "./App.scss"
import {Player} from "./components/Player/Player";

interface IState {
    date : any
    dateChange : any
}


export class App extends React.Component<{}, any> {

    constructor(props: any){
        super(props)

        this.state = {date : "2017-01-01",
                      dateChange : this.dateChange}
    }

    dateChange(e : any){
        console.log(e.target.value)
        this.setState({
            date: e.target.value
        })
    }

    componentWillMount(){

    }

    render(){
        return <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>


            <Player/>
        </div>
    }
}