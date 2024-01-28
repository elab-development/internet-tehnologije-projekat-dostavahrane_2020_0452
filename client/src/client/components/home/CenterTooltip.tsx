import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';

interface Props {
    lat: number,
    lng: number
}

export default function CenterTooltip(props: Props) {
    const map = useMap();
    useEffect(() => {
        map.setView({ lat: props.lat, lng: props.lng })
    }, [props.lat, props.lng])
    return null;
}
