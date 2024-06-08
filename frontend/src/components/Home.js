import 'leaflet/dist/leaflet.css'
import '../index.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, ImageOverlay, Polyline, SVGOverlay } from 'react-leaflet'
import { location_marker, selected_marker } from './icons_handler';
import { geo_data, node_and_neighbours, saved_paths } from './utils';
import SearchBox from './SearchBox';
import zIndex from '@mui/material/styles/zIndex';
import Navbar from './Navbar';
import { MapContext } from '../GlobalContext';



export const centre_position = [27.61951040933055, 85.53805679082873]
export const ZOOM_LEVEL = 18
const BOUNDS = { //corner bounds of the provided png background was in TL,TR,BR,BL format initally in .dat file with Lat and Lng reversed
    'TL': [27.6212868734765, 85.5340294539928], //TL
    'TR': [27.6212868734765, 85.5417770147324], //TR
    'BL': [27.6158860954476, 85.5340294539928], //BL
    'BR': [27.6158860954476, 85.5417770147324], //BR
}
// [27.6158860954476, 85.5340294539928]
// [27.6212868734765, 85.5417770147324]
function Home() {
    const [locations, setLocations] = useState([])
    const [intermediateLocations, setIntermediateLocations] = useState([])
    const {paths} = useContext(MapContext)

    useEffect(() => {
        setLocations(geo_data)
    }, [])


    return (
        <Box sx={{
            position: 'relative'
        }}>
            <Navbar />

            <MapContainer center={centre_position} zoom={ZOOM_LEVEL} scrollWheelZoom={true}
            >
                <ImageOverlay
                    url={require("../assests/KU.png")}
                    bounds={[BOUNDS.BL, BOUNDS.TR]}
                />
                {
                    locations.map((e) => (
                        <Box key={e.id}>
                            <CircleMarker attribution='Google Maps'  center={[e.lat, e.lon]} radius={3} fillOpacity={1}
                                color={'red'}
                                eventHandlers={{
                                    // 'click': (event) => handleSelection(e.id),
                                    // 'mouseover': (event) => console.log(e.id)
                                }}
                            >
                                <Popup>
                                    {e.id}
                                </Popup>
                            </CircleMarker>
                            <SVGOverlay bounds={[[e.lat - 0.05, e.lon - 0.05], [e.lat + 0.05, e.lon + 0.05]]}>
                                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill='#e0ebeb' >
                                    {e.labels ? e.labels[0] : ''}
                                </text>
                            </SVGOverlay>
                        </Box>

                    ))

                }

                {
                    paths.map(path => (
                        //path[0].lat - path[1].lat as key is likely to be unique
                        <Polyline weight={3} key={path[0].lat - path[1].lat} positions={path} color="yellow" />
                    ))
                }

            </MapContainer>

        </Box>
    )
}

export default Home