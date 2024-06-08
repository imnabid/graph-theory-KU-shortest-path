import { Box, ClickAwayListener, FormControl, Input, MenuItem, OutlinedInput, Paper, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'



function SearchBox({ data, title, pattern, setPattern }) {

    const [popUp, setPopUp] = useState(false);
    const searchRef = useRef(null);

    const handleSearchBoxClick = () => {
        // Select the text inside the input
        if (searchRef.current) {
            searchRef.current.select();
        }
    };

    const handleChange = (e) => {
        setPattern(e.target.value.toLowerCase())
        setPopUp(true)
    };
    const handleClose = () => {
        setPopUp(false);
        if (!popUp) return;
        setPattern("")
    };

    const handleItemClick = (entry) => {
        setPattern(entry)
        setPopUp(false)
    }

    return (
        <ClickAwayListener onClickAway={handleClose}>

            <Box width='100%' sx={{
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                gap: 0.5
            }}>
                <Paper elevation={3} sx={{
                    borderRadius: '15px'
                }}>
                    <OutlinedInput
                        value={pattern}
                        size='small'
                        sx={{
                            height: 35,
                            borderRadius: '15px',
                            fontSize: 14
                        }}
                        placeholder={title}
                        onChange={handleChange}
                        inputRef={searchRef}
                        onClick={handleSearchBoxClick}

                    />
                </Paper>
                <Paper
                    sx={{
                        display: popUp ? 'block' : 'none',
                        position: 'absolute',
                        top: 40,
                        width: '100%'
                    }}
                >
                    {ListItem(data, pattern, handleItemClick)}
                </Paper>
            </Box>
        </ClickAwayListener>
    )
}

const ListItem = (data, pattern, handleItemClick) => {
    let arr = [];
    for (let entry of data) {
        if (entry.toLowerCase().includes(pattern)) {
            arr.push(
                <MenuItem
                    onClick={() => handleItemClick(entry)}
                    key={entry}
                    sx={{
                        fontSize: 13,
                        color: 'grey',
                        overflow: 'hidden'
                    }}
                >
                    {entry}
                </MenuItem>
            );
        }
    }
    return arr.length ? (
        arr.slice(0, 5)
    ) : (
        <Typography sx={{ color: "lightGrey", fontSize: 14, textAlign: 'center', py: 0.5 }}>No data found</Typography>
    );
};

export default SearchBox