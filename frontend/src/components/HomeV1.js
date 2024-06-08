import 'leaflet/dist/leaflet.css'
import '../index.css'
import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, ImageOverlay, Polyline } from 'react-leaflet'
import { location_marker, selected_marker } from './icons_handler';
import { geo_data, node_and_neighbours, saved_paths } from './utils';



const centre_position = [27.6193, 85.5388]
const ZOOM_LEVEL = 18
const BOUNDS = [ //corner bounds of the provided png background was in TL,TR,BR,BL format initally in .dat file with Lat and Lng reversed
    [27.6212868734765, 85.5340294539928], //TL
    [27.6212868734765, 85.5417770147324], //TR
    [27.6158860954476, 85.5340294539928], //BL
    [27.6158860954476, 85.5417770147324], //BR
]
function HomeV1() {
    const ClickHandler = ({ onMapClick }) => {
        useMapEvents({
            click: onMapClick,
        });

        return null;
    };
    const [locations, setLocations] = useState([])
    const [intermediateLocations, setIntermediateLocations] = useState([])
    const [selectedNode1, setSelectedNode1] = useState(null)
    const [selectedNode2, setSelectedNode2] = useState(null)
    const [selected, setSelected] = useState(0) //selected nodes=1 initially
    const [paths, setPaths] = useState([])

    useEffect(() => {
        setLocations(geo_data)
        setPaths(saved_paths)
    }, [])

    useEffect(()=>{
        console.log('paths:',paths)
    },[paths])


    const handleSelection = (id) => {

        console.log('clicked ', id)
        console.log('selected:', selected)
        let node = locations.find(n => n.id === id)
        if (selected === 0) {
            setSelectedNode1(node)
            console.log('selected node1')
        }
        else if (selected === 1) {
            const node1 = node_and_neighbours.find((n) => n.id === selectedNode1.id)
            if (node1.neighbours.includes(id)) {
                setSelectedNode2(node)
                console.log('selected node2')
            }
            else {
                console.log(id, 'not a valid neighbour')
                alert('not a valid neighbour start from first')
                return setSelected(0)
            }

        }

        setSelected(prev => prev + 1) //a node is selected
    }

    const handleIntermediateNodeAddition = (e) => {
        console.log('intermediate node additon')

        // console.log('Map clicked at:', e.latlng);
        const lat = e.latlng.lat
        const lon = e.latlng.lng
        const newNode = {
            'lat': lat,
            'lon': lon
        }

        setIntermediateLocations(prev => [...prev, newNode])
    }

    const undoIntermediateLocation = () => {
        console.log('inside undo')
        setIntermediateLocations(prev => {
            const temp = [...prev]
            temp.pop()
            return temp
        })
    }

    const addPath = () => {
        let path = []
        path.push(selectedNode1)
        intermediateLocations.forEach(n=>path.push(n))
        path.push(selectedNode2)
        setPaths(prev => [...prev, path])
        setSelected(0)
        setSelectedNode1(null)
        setSelectedNode2(null)
        setIntermediateLocations([])

    }
    const undoPath = ()=>{
        setPaths(prev=>{
            let temp = [...prev]
            temp.pop()
            return temp
        })
    }

    const download = () => {
        const json = JSON.stringify(paths);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'paths.json');
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
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
            <Button
                sx={{ position: 'absolute', top: 60, left: 120, zIndex: 1000 }}
                variant='contained'
                color='error'
                onClick={undoPath}
            >
                Undo Path
            </Button>
            {selected === 2 && <Button
                sx={{ position: 'absolute', top: 10, left: 270, zIndex: 1000 }}
                variant='contained'
                color='success'
                onClick={addPath}
            >
                Add Path
            </Button>}
            {intermediateLocations.length? <Button
                sx={{ position: 'absolute', top: 10, left: 400, zIndex: 1000 }}
                variant='contained'
                onClick={undoIntermediateLocation}
            >
                Undo
            </Button>:''
            }
            <MapContainer center={centre_position} zoom={ZOOM_LEVEL} scrollWheelZoom={true}
            >
                <ImageOverlay
                    url={require("../assests/KU.png")}
                    bounds={[[27.6158860954476, 85.5340294539928], [27.6212868734765, 85.5417770147324]]}
                />
                {
                    locations.map((e) => (
                        <CircleMarker attribution='Google Maps' key={e.id} center={[e.lat, e.lon]} radius={6} fillOpacity={1}
                            color={e.color ? e.color : 'red'}
                            eventHandlers={{
                                'click': (event) => handleSelection(e.id),
                                // 'mouseover': (event) => console.log(e.id)
                            }}
                        >
                            {/* <Popup>
                                {e.id}
                            </Popup> */}
                        </CircleMarker>


                    ))

                }

                {
                    intermediateLocations.map((e) => (
                        <CircleMarker key={[e.lat, e.lon]} center={[e.lat, e.lon]} radius={4} fillOpacity={1}
                            color='blue' />


                    ))
                }

                {
                    paths.map(path => (
                        //path[0].lat + path[1].lat as key is likely to be unique
                        <Polyline weight={2} key={path[0].lat + path[1].lat} positions={path} color="blue" />
                    ))
                }

                {selected == 2 && <ClickHandler onMapClick={handleIntermediateNodeAddition} />}

            </MapContainer>

        </Box>
    )
}

export default HomeV1
