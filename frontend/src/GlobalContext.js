import { createContext, useContext, useState } from "react"

export const MapContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [source, setSource] = useState('')
    const [destination, setDestination] = useState('')
    const [paths, setPaths] = useState([])
    const [showSnackBar, setShowSnackBar] = useState({
        show: false,
        msg: "Login Successful!",
        type: "success",
    });
    const info = {
        source,
        setSource,
        destination,
        setDestination,
        paths,
        setPaths,
        showSnackBar,
        setShowSnackBar,
    }

    return (
        <MapContext.Provider value={info}>
            {children}
        </MapContext.Provider>
    )
}