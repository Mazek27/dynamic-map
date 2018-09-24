import { MapControl, MapControlProps } from "react-leaflet";
import { DomUtil, DomEvent, } from "leaflet";
import * as RL from 'react-leaflet';
const ReactLeaflet = RL as any;
import "./style.scss"

import * as ReactDOM from "react-dom";
import { CustomControl } from "../CustomControl";
import React = require("react");
import L = require("leaflet");

type LeafletElement = CustomControl
type Props = {
} & MapControlProps


class Component extends MapControl<Props>{
    leafletElement: any;
    options: any
    container: any

    componentWillMount() {
        const legend = new L.Control({ position: 'bottomright' });
        const jsx = (
            <>
                <div className={'leaflet-control-player-toggle'}>

                </div>
                {this.props.children}
            </>
        );

        legend.onAdd = (map) => {
            const div = this.container = L.DomUtil.create('div', 'leaflet-control-player');
            DomEvent.on(this.container, {
                mouseenter: this.expand,
                mouseleave: this.collapse
            }, this);
            DomEvent.disableClickPropagation(this.container);
            DomEvent.disableScrollPropagation(this.container);
            ReactDOM.render(jsx, div);
            return div;
        };

        this.leafletElement = legend;
    }

    expand() {
        DomUtil.addClass(this.container, 'leaflet-control-player-expanded');
    }

    collapse() {
        DomUtil.removeClass(this.container, 'leaflet-control-player-expanded');
    }

    createLeafletElement(props: Props): any {
        return this.leafletElement
    }
}

export const PlayerControl = ReactLeaflet.withLeaflet(Component);