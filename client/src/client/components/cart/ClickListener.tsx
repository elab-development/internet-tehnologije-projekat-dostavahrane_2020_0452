import React from 'react'
import { useMapEvents } from 'react-leaflet';

interface Props {
    onClick: (lat: number, lng: number) => void;
}

export default function ClickListener(props: Props) {
    const events = useMapEvents({
        click: (event) => {
            props.onClick(event.latlng.lat, event.latlng.lng)
        }
    })
    return (
        <div>ClickListener</div>
    )
}
