import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "./Nav.css"
const NavAdmin = () => {
    const logo = "http://dypatil.edu/images/DY-Patil-University-Logo.png";
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <nav className="navbarmusic" >
                <div className="navbar__logo">
                    <NavLink to="#">
                        <img src={logo} alt="" />
                    </NavLink>
                </div>
                <ul style={{ marginBottom: "0px", paddingLeft: "0" }} className={open ? "navbar__listms active" : "navbar__listms"}>

                    <li>
                        <NavLink to="/adminrequests">Requests</NavLink>
                    </li>
                    <li>
                        <NavLink to="/addDefaulters">Add Defaulter</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/logout">Logout</NavLink>
                    </li>
                </ul>
                <div className="navbar__menu" onClick={handleClick}>
                    <div className={open ? "navbar__menu-icon open" : "navbar__menu-icon"}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavAdmin