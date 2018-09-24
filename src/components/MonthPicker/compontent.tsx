import * as React from "react";
import moment = require("moment");
import "./style.scss"


export interface IProps {
    months: string[]
    years: number[],
    disabled?: boolean
    onSelectionChange: (selection: moment.Moment) => void
}

interface IState {
    selectedMonthIndex: number
    selectedYearIndex: number
}

export class MonthPicker extends React.Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);
        this.state = { selectedMonthIndex: 0, selectedYearIndex: 0 }
    }

    handleMonthChange(event: any): void {
        this.setState({ selectedMonthIndex: event.target.value }, () => {
            this.sendMomentChangeEvent();
        });
    }

    handleYearChange(event: any): void {
        this.setState({ selectedYearIndex: event.target.value }, () => {
            this.sendMomentChangeEvent();
        });
    }

    private sendMomentChangeEvent() {
        const year = this.props.years[this.state.selectedYearIndex];
        const month = moment([year, 1, 1]).month(this.state.selectedMonthIndex);
        this.props.onSelectionChange(month);
    }

    render() {
        const monthOptions = this.props.months.map((value, index) => {
            return <option id={index.toString()} value={index} >{value}</option>
        })

        const yearOptions = this.props.years.map((value, index) => {
            return <option id={index.toString()} value={index} >{value}</option>
        })
        return (
            <div className="MonthPicker">
                <select disabled={this.props.disabled} value={this.state.selectedMonthIndex} onChange={e => this.handleMonthChange(e)}>
                    {monthOptions}
                </select>
                <select disabled={this.props.disabled} value={this.state.selectedYearIndex} onChange={e => this.handleYearChange(e)}>
                    {yearOptions}
                </select>
            </div>
        )
    }
}