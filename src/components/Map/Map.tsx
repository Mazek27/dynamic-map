import * as React from "react";
import { renderToString } from "react-dom/server";
import { CircleIcon } from "../icons/CircleIcon"
import * as L from "leaflet"
import {
    Map as LeafletMap,
    Marker,
    Popup,
    TileLayer,
    WMSTileLayer,
    LayersControl,
    LayerGroup,
    ScaleControl,
} from "react-leaflet"
import { convertDateToString } from "../../data/DateTime";
import { LatLngBounds } from "leaflet";
import { Legend } from "./Legend";
import { GradientReader } from "../../services/GradientReader";
import "./style.scss"
import { Moment } from "moment";

interface IState {
    points: any
    data: any
    lat: any
    lng: any
    zoom: any
    gradientReader: any
}

interface IProps {
    timeFrame: Moment,
    aggregationType: string
}

export const IconContext = React.createContext({});

export class Map extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            points: [],
            data: [],
            lat: 52.069325,
            lng: 19.140312,
            zoom: 6,
            gradientReader: new GradientReader([
                { stop: 0.0, color: '#3ca0e1' },
                { stop: 0.5, color: '#ffffff' },
                { stop: 0.75, color: '#ffc8b4' },
                { stop: 1.0, color: '#ff0000' }])
        }

        this.onresizemap = this.onresizemap.bind(this)
    }

    map: any;
    db = (window as any).data;
    config = {
        format: "image/png",
        transparent: true,
    }
    road_config = { ...this.config, layers: "drogi", crossOrigin: true }
    province_config = { ...this.config, layers: "granice_wojewodztw", crossOrigin: true }
    city_config = { ...this.config, layers: "miasta", crossOrigin: true }
    number_config = { ...this.config, layers: "lokalizacja_scpr", crossOrigin: true }

    numberMarkers: any[] = []
    bbox = new LatLngBounds({ lat: 48.7273953314, lng: 14.0745211117 }, { lat: 55.3515359564, lng: 24.0299857927 })

    componentWillMount() {
        let points: any[] = this.db.local;
        this.numberMarkers = points.map((x: any) => {

            const icon = L.divIcon({
                className: 'custom-text',
                html: renderToString(<div>{x.id}</div>)
            });

            return <Marker position={[x.gps[1], x.gps[0]]} radius={1} icon={icon} />

        })

        this.updateDataForAggregation(this.props.aggregationType, this.props.timeFrame);
    }

    private updateDataForAggregation(aggregationType: string, timeFrame: Moment) {
        let updatedPoints;

        if (aggregationType == "day") {
            updatedPoints = this.updateWithDailyAggregation(timeFrame);
        } else {
            updatedPoints = this.updateWithMonthlyAggregation(timeFrame);
        }

        this.setState({ points: updatedPoints })

    }

    private updateWithDailyAggregation(timeFrame: Moment) {
        const points: any[] = this.db.local;
        const selectedDataIndex = this.db.day_data.findIndex((data: any) => new Date(data.id).setHours(0) == timeFrame.toDate().getTime());

        for (let i = 0; i < points.length; i++) {
            let elementIndex = this.db.day_data[selectedDataIndex].value.findIndex((item: any) => item.id === points[i].id)

            if (typeof points[i] !== undefined) {
                if (elementIndex != -1) {
                    points[i].value = this.db.day_data[selectedDataIndex].value[elementIndex].value
                }
            }
        }
        return points;
    }

    private updateWithMonthlyAggregation(timeFrame: Moment) {
        const points: any[] = this.db.local;
        const selectedDataIndex = this.db.month_data.findIndex((data: any) => parseInt(data.id) == timeFrame.month() + 1);

        for (let i = 0; i < points.length; i++) {
            if (typeof points[i] !== undefined) {
                points[i].value = this.db.month_data[selectedDataIndex].value[i].value
            }
        }
        return points;
    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return nextProps.timeFrame !== this.props.timeFrame || nextProps.aggregationType != this.props.aggregationType;
    }

    componentWillUpdate(nextProps: IProps, nextState: IState) {
        this.updateDataForAggregation(nextProps.aggregationType, nextProps.timeFrame);
    }

    onresizemap = (event: L.ResizeEvent) => {
        this.map.leafletElement.fitBounds(this.bbox)
    }

    componentDidMount() {
        this.map.leafletElement.fitBounds(this.bbox)
    }

    render() {
        let circleMarkers = this.state.points.map((x: any) => {
            const icon = L.divIcon({
                iconSize: L.point(0, 0),
                className: `value-icon`,
                html: renderToString(
                    <IconContext.Provider value={this.state.gradientReader}>
                        <CircleIcon text={x.id} value={x.value} />
                    </IconContext.Provider>)
            });
            return (
                <Marker key={x.id} position={[x.gps[1], x.gps[0]]} icon={icon} >
                    <Popup>
                        {x.id}<br />
                        {x.value}
                    </Popup>
                </Marker>
            )
        });

        return (
            <>

                <LeafletMap
                    // onresize={this.onresizemap}
                    preferCanvas={true}
                    id={"leaflet-map"}
                    bounds={this.bbox}
                    maxBounds={this.bbox}
                    minBounds={this.bbox}
                    center={[this.state.lat, this.state.lng]}
                    minZoom={this.state.zoom}
                    zoomDelta={0.25}
                    zoomSnap={0}
                    style={{ height: "100vh" }}
                    animate={true}
                    ref={(item) => { this.map = item }}>

                    <LayersControl position={"topright"}>
                        <LayersControl.Overlay name={"Legend"} updateWhenIdle={false} updateWhenZoom={false}>
                            <Legend />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={"  "} >
                            <div style={{
                                position: "relative",
                                textAlign: "center",
                                marginLeft: 0,
                                marginRight: 0,
                                width: "100%",
                                fontSize: '18px'
                            }}>
                                <strong>Dynamiczna mapa prezentująca zmiany ruchu dobowego w ciągu roku</strong><br />
                                <a>Proporcja wartości natężenia w dniu <b>{convertDateToString(this.props.timeFrame.toDate())}</b> do SDRR dla roku {this.props.timeFrame.toDate().getFullYear()} dla liczników SCPR</a>
                            </div>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={"OSM"}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'} />
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name={"Miasta"} checked={true}>
                            <WMSTileLayer
                                url={"http://gisportal.hcdev.pl/cgi-bin/qgis_mapserv.fcgi?&map=/var/www/html/gisapp/projects/SCPR.qgs"}
                                attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'} {...this.city_config} />
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name={"Województwa"} checked={true}>
                            <WMSTileLayer
                                url={"http://gisportal.hcdev.pl/cgi-bin/qgis_mapserv.fcgi?&map=/var/www/html/gisapp/projects/SCPR.qgs"}
                                attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'} {...this.province_config} />
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name={"Drogi krajowe"} checked={true}>
                            <WMSTileLayer
                                url={"http://gisportal.hcdev.pl/cgi-bin/qgis_mapserv.fcgi?&map=/var/www/html/gisapp/projects/SCPR.qgs"}
                                attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'} {...this.road_config} />
                        </LayersControl.Overlay>

                        <LayersControl.BaseLayer name={"SCPR"} checked={true} updateWhenIdle={false} updateWhenZoom={false}>
                            <LayerGroup>
                                {circleMarkers}
                            </LayerGroup>
                        </LayersControl.BaseLayer>

                        <LayersControl.Overlay name={"Numery urządzeń"} checked={false} updateWhenIdle={false} updateWhenZoom={false}>
                            <WMSTileLayer
                                url={"http://gisportal.hcdev.pl/cgi-bin/qgis_mapserv.fcgi?&map=/var/www/html/gisapp/projects/SCPR.qgs"}
                                attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'} {...this.number_config} />
                        </LayersControl.Overlay>
                    </LayersControl>

                    {this.props.children}

                    <ScaleControl position={"bottomleft"} imperial={false} />
                </LeafletMap>
            </>
        )
    }

}