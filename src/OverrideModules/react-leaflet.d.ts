import * as React from 'react'
import * as L from 'leaflet'
import 'react-leaflet'

declare module 'react-leaflet' {

    export interface LeafletContext {
        map?: L.Map,
        pane?: string,
        layerContainer?: LayerContainer,
        popupContainer?: L.Layer,
    }

    export class LeafletConsumer extends React.Component<React.ConsumerProps<LeafletContext>> {}
    export class LeafletProvider extends React.Component<React.ProviderProps<LeafletContext>> {}

    export type WrappedProps = {
        leaflet: LeafletContext;
    }

    export function withLeaflet<T>(WrappedComponent: React.ComponentType<T & WrappedProps>): React.ComponentType<T>;

    export interface MapLayer {
        contextValue?: LeafletContext;
    }

    export interface Map {
        contextValue?: LeafletContext;
    }
}