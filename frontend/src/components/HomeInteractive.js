import 'leaflet/dist/leaflet.css'
import '../index.css'
import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, ImageOverlay } from 'react-leaflet'
import { location_marker, selected_marker } from './icons_handler';
import { geo_data, updateLatLon } from './utils';

//Implemented marker coorection with ability to download the corrected latlng
// Click to remove a marker and click again to place it to a new location

const centre_position = [27.6193, 85.5388]
const ZOOM_LEVEL = 18
const BOUNDS = [ //corner bounds of the provided png background was in TL,TR,BR,BL format initally in .dat file with Lat and Lng reversed
    [27.6212868734765, 85.5340294539928], //TL
    [27.6212868734765, 85.5417770147324], //TR
    [27.6158860954476, 85.5340294539928], //BL
    [27.6158860954476, 85.5417770147324], //BR
]
function HomeInteractive() {
    const ClickHandler = ({ onMapClick }) => {
        useMapEvents({
            click: onMapClick,
        });

        return null;
    };
    const [locations, setLocations] = useState([])
    const [selectedNode, setSelectedNode] = useState(null)
    const [selected, setSelected] = useState(false)
    const [bounds, setBounds] = useState([])

    useEffect(() => {
        setLocations(geo_data)
    }, [])

    const handleMovement = (e) => {
        console.log('Selected: ', selected, 'Map clicked at:', e.latlng);
        const lat = e.latlng.lat
        const lon = e.latlng.lng
        if (selected) {
            setLocations(prev => {
                return [...prev, { ...selectedNode, 'lat': lat, 'lon': lon }]
            })
            setSelected(false)
            updateLatLon(geo_data, selectedNode.id, { 'lat': lat, 'lon': lon })
        }
    }

    const handleSelection = (id) => {

        console.log('clicked ', id)
        let node = locations.find(n => n.id === id)
        setLocations(prev => {
            return prev.filter((node) => node.id !== id)
        })
        console.log(node)
        setSelected(true)
        setSelectedNode(node)
    }

    const download = () => {
        const json = JSON.stringify(geo_data);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'geo_data_corrected.json');
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const CircleMarkerWithText = ({ position, radius, color, text }) => {
        return (
            <div className="circle-marker-container" style={{ position: 'absolute', top: position[0], left: position[1], transform: 'translate(-50%, -50%)' }}>
                <div className="circle-marker" style={{ width: radius * 2, height: radius * 2, borderRadius: '50%', backgroundColor: color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span>{text}</span>
                </div>
            </div>
        );
    };
    return (
        <Box sx={{
            position: 'relative'
        }}>

            <Button
                sx={{ position: 'absolute', top: 10, left: 120, zIndex: 1000 }}
                variant='contained'
                onClick={download}
            >
                Download
            </Button>

            <MapContainer center={centre_position} zoom={ZOOM_LEVEL} scrollWheelZoom={true}
            >
                <ImageOverlay
                    url={require("../assests/KU.png")}
                    bounds={[[27.6158860954476, 85.5340294539928], [27.6212868734765, 85.5417770147324]]}
                />
                {
                    locations.map((e) => (
                        <CircleMarker attribution='Google Maps' key={e.id} center={[e.lat, e.lon]} radius={4} fillOpacity={1}
                            color='red'
                            eventHandlers={{
                                'click': (event) => handleSelection(e.id),
                                'mouseover': (event) => console.log(e.id)
                            }}
                        >
                            <Popup>
                                {e.id}
                            </Popup>
                        </CircleMarker>
                        // <Marker key={e.id} position={[e.lat, e.lon]} icon={location_marker}
                        //     eventHandlers={{
                        //         'click': (event) => handleSelection(e.id)
                        //     }}
                        // >
                        //     <Popup>
                        //         {e.id}
                        //     </Popup>
                        // </Marker>

                    ))
                }

                <ClickHandler onMapClick={handleMovement} />

            </MapContainer>

        </Box>
    )
}

export default HomeInteractive