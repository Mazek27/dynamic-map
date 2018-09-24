import {Control, ControlOptions, ControlPosition, DomUtil, Map} from "leaflet";
import L = require("leaflet");

export interface CustomControlOptions extends ControlOptions {
    map : any
}

export class CustomControl extends Control{

    options: ControlOptions
    position: ControlPosition

    controlButton : HTMLElement
    map : any

    constructor(options?: CustomControlOptions){
        super(options)
        // this.map = L.('leaflet-map')
    }

    onAdd(map: Map): HTMLElement {
        var className = 'leaflet-control-player'
        var container = DomUtil.create('div', className);
        var options = this.options


        this.controlButton = this._addControlButton(className, container);




        return container;
    }

    _addControlButton(className : string, container : HTMLElement) : HTMLElement{
        var link = DomUtil.create('a', className, container)

        return link;
    }

    onRemove(map: Map): void {
    }

    getPosition(): ControlPosition {
        return super.getPosition();
    }

    setPosition(position: ControlPosition): this {
        return super.setPosition(position);
    }

    getContainer(): HTMLElement | undefined {
        return super.getContainer();
    }

    addTo(map: Map): this {
        return super.addTo(map);
    }

    remove(): this {
        return super.remove();
    }
}