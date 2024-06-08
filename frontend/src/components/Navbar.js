import { Box, Chip, Paper } from '@mui/material'
import React, { useContext } from 'react'
import SearchBox from './SearchBox'
import { MapContext } from '../GlobalContext'
import { LABELS, get_label_id } from './utils'
import { axiosInstance } from './axios'

function Navbar() {
    const { source, setSource, destination, setDestination,
        setPaths, setShowSnackBar, setZoom, setCenter } = useContext(MapContext)

    const handleClear = () => {
        setSource('')
        setDestination('')
        return setPaths([])


    }
    
    const handleMst = () => {
        axiosInstance.get('/mst/').then(
            res => setPaths(res.data)
        ).catch(err => {
            console.log(err)

            setShowSnackBar({
                show: true,
                msg: 'Something Went Wrong!',
                type: 'error'
            })
        })
    }
    const handleAllPaths = () => {
        axiosInstance.get('/all/').then(
            res => setPaths(res.data)
        ).catch(err => {
            console.log(err)

            setShowSnackBar({
                show: true,
                msg: 'Something Went Wrong!',
                type: 'error'
            })
        })
    }

    const handleShortestPath = () => {
        if (source === '' || destination === '') {
            return setShowSnackBar({
                show: true,
                msg: 'Empty Fields Not Allowed',
                type: 'error'
            })
        }

        const source_id = get_label_id(source)
        const destination_id = get_label_id(destination)
        axiosInstance.post('/shortest/', {
            source_id, destination_id
        }
        ).then(res => setPaths(res.data))
            .catch(err => {
                console.log(err)

                setShowSnackBar({
                    show: true,
                    msg: 'Something Went Wrong!',
                    type: 'error'
                })
            })
    }
    return (
        <Box sx={{
            position: 'absolute',
            top: 20,
            left: 70,
            zIndex: 1000,
            display: 'flex',
            gap: 35
        }}>
            <Box sx={{
                display: 'flex',
                gap: 3,
                alignItems: 'center'
            }}>

                <SearchBox data={LABELS} title='Source' pattern={source} setPattern={setSource} />
                <SearchBox data={LABELS} title='Destination' pattern={destination} setPattern={setDestination} />
                <Chip component={Paper} elevation={4} label="Shortest Path" onClick={handleShortestPath} color='primary'
                    sx={{
                        fontWeight: 'bold'
                    }}
                />
                <Chip component={Paper} elevation={4} label="Clear" onClick={handleClear} color='error'
                    sx={{
                        fontWeight: 'bold'
                    }}
                />
            </Box>
            <Box sx={{
                display: 'flex',
                gap: 3,
                alignItems: 'center'
            }}>

                <Chip component={Paper} elevation={4} label="All Paths" onClick={handleAllPaths} color='white'
                    sx={{
                        fontWeight: 'bold'
                    }}
                />
                <Chip component={Paper} elevation={4} label="Min Spanning Tree" onClick={handleMst} color='white'
                    sx={{
                        fontWeight: 'bold'
                    }}
                />
            </Box>
        </Box>
    )
}

export default Navbar