import React = require("react");
import "./style.scss"
import 'react-datepicker/dist/react-datepicker.css';
import { MonthPicker } from "../../MonthPicker/compontent";
import DatePicker from "react-datepicker"

import 'react-datepicker/dist/react-datepicker.css';
import {Moment} from "moment";
import moment = require("moment");
import {PlayerContext} from "../../Player/Player";

export interface Configuration {
    aggregation: string
    multi: boolean,
    value: {
        singleRange?: Moment,
        multiFrom?: Moment
        multiTo?: Moment
    }
}

interface IProps {
    onConfigurationChange: (event: Configuration) => void
}

interface IState extends Configuration {

}

export class DynamicLayerConfigurator extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = { aggregation: "day", multi: false, value: {
            singleRange : moment([2017, 0, 1]),
            multiFrom : moment([2017, 0, 1]),
            multiTo :  moment([2017, 0, 3]),
        }}

        this.handleAggregationTypeChange = this.handleAggregationTypeChange.bind(this);
        this.handleRangeTypeChange = this.handleRangeTypeChange.bind(this);
        this.handleSingleRangeValueChange = this.handleSingleRangeValueChange.bind(this);
        this.handleMultiRangeFromValueChange = this.handleMultiRangeFromValueChange.bind(this);
        this.handleMultiRangeToValueChange = this.handleMultiRangeToValueChange.bind(this);
    }

    handleAggregationTypeChange(event: any) {
        this.setState({ aggregation: event.currentTarget.value }, () => {
            this.sendEventIfSafe();
        });
    }

    handleRangeTypeChange(event: any) {
        this.setState({ multi: event.currentTarget.value === "1" }, () => {
            this.sendEventIfSafe();
        })
    }

    handleSingleRangeValueChange(event: any | Moment) {
        this.setState({ value: { ...this.state.value, singleRange: event } }, () => {
            this.sendEventIfSafe();
        });
    }

    handleMultiRangeFromValueChange(event: any | Moment) {
        this.setState({ value: { ...this.state.value, multiFrom: event, singleRange: event } }, () => {
            this.sendEventIfSafe();
        });
    }

    handleMultiRangeToValueChange(event: any | Moment) {
        this.setState({ value: { ...this.state.value, multiTo: event } }, () => {
            this.sendEventIfSafe();
        })
    }

    sendEventIfSafe() {
        let isSendingAllowed = true
        if (this.state.multi) {
            isSendingAllowed = this.state.value.multiFrom != undefined && this.state.value.multiTo != undefined;
        } else {
            isSendingAllowed = this.state.value.singleRange != undefined
        }

        if (isSendingAllowed) {
            console.log("layer-config:" + JSON.stringify(this.state));
            this.props.onConfigurationChange({ ...this.state });
        }
    }

    renderWidgetDependendOnAgrregationType() {
        if (this.state.aggregation == "day") {
            return this.renderWidgetsForDailyAggregation();
        } else {
            return this.renderWidgetsFormMonthlyAggregation();
        }
    }

    renderWidgetsForDailyAggregation() {
        return (
            <PlayerContext.Consumer>
                {({current_date})=> (
            <div className="DataRange">
                <div>
                    <input type="radio" name="range_type" value="0" checked={this.state.multi == false} onChange={this.handleRangeTypeChange} /> Data
                    <br />
                    <div className="ControlContainer">
                    <DatePicker
                        disabled={this.state.multi == true}
                        selected={moment(current_date)}
                        onChange={this.handleSingleRangeValueChange}
                        locale="pl-pl"
                    />
                    </div>
                </div>
                <div>
                    <input type="radio" name="range_type" value="1" checked={this.state.multi == true} onChange={this.handleRangeTypeChange} /> Zakres
                    <div className="ControlContainer">
                    <DatePicker
                        selected={moment(this.state.value.multiFrom)}
                        selectsStart
                        disabled={this.state.multi == false}
                        startDate={moment(this.state.value.multiFrom)}
                        endDate={moment(this.state.value.multiTo)}
                        onChange={this.handleMultiRangeFromValueChange}
                        locale="pl-pl"
                    />
                    <DatePicker
                        selected={moment(this.state.value.multiTo)}
                        selectsEnd
                        disabled={this.state.multi == false}
                        startDate={moment(this.state.value.multiFrom)}
                        endDate={moment(this.state.value.multiTo)}
                        onChange={this.handleMultiRangeToValueChange}
                        locale="pl-pl"
                    />
                    </div>

                            <br /> {this.props.children}
                        </div>
                    </div>
                )}
            </PlayerContext.Consumer>
        )
    }

    renderWidgetsFormMonthlyAggregation() {
        const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]

        return (<div>
            <div>
                <input type="radio" name="range_type" value="0" checked={this.state.multi == false} onChange={this.handleRangeTypeChange} /> Data
                <div className="ControlContainer">
                    <MonthPicker disabled={this.state.multi == true} months={months} years={[2017]} onSelectionChange={this.handleSingleRangeValueChange} />
                </div>
            </div>
            <div>
                <input type="radio" name="range_type" value="1" checked={this.state.multi == true} onChange={this.handleRangeTypeChange} /> Zakres
                <div className="ControlContainer">
                    Od <MonthPicker disabled={this.state.multi == false} months={months} years={[2017]} onSelectionChange={this.handleMultiRangeFromValueChange} />
                    <br />
                    do <MonthPicker disabled={this.state.multi == false} months={months} years={[2017]} onSelectionChange={this.handleMultiRangeToValueChange} />
                </div>
                <br /> {this.props.children}
            </div>
        </div>)
    }

    render() {
        return <div id={"LayerConfigurator"} className="MapControl LayerConfigurator">
            <div className="Filter">
                <div className="AggregationType">
                    <h2>Agregacja</h2>
                    <div>
                        <input type="radio" name="aggregation_type" value="day" checked={this.state.aggregation == "day"} onChange={this.handleAggregationTypeChange} /> Dzień
                    <input type="radio" name="aggregation_type" value="month" checked={this.state.aggregation == "month"} onChange={this.handleAggregationTypeChange} /> Miesiąc
                </div>
                </div>
                <div className="DataRange">
                    <h2>Tryb</h2>
                    {this.renderWidgetDependendOnAgrregationType()}
                </div>
            </div>
        </div>
    }
}