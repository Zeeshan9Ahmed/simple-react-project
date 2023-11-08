import React from 'react'
import { CircularProgress } from '@mui/material';

const Spinner = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100%", backgroundColor: "rgba(15, 15, 15,0.5)", position: "fixed", zIndex: 1500, }}>
            {/* <CircularProgress className="progress" sx={{ color: "#FF90AA", backgroundColor: "transparent" }} /> */}
            <div className="fa-3x">
                <i style={{color: "#1D454C"}} className="fas fa-solid fa-spinner fa-spin-pulse"></i>
            </div> 
        </div>
    )
}

export default Spinner