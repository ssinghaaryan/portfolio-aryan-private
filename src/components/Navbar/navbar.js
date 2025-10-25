import React, { useState } from 'react';
import './navbar.css'
// import logo from '../../assets/Pexel.jpg'
import { NavLink } from 'react-router-dom'; /* {Link} is from the router-dom framework */

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className='navbar'>
            <NavLink className='homepageLogo' to='/'>
                <span className='page'>Home</span>
                <span className='command'>~</span>
            </NavLink>
            {/* Hamburger for mobile */}
            <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={`homepageMenu ${menuOpen ? 'active' : ''}`}>
                {/* <Link className='homepageMenuItem'>Home</Link> */}
                <NavLink to='/projects' className= {({ isActive }) => isActive ? 'homepageMenuItem active' : 'homepageMenuItem'} onClick={closeMenu}>01.Projects</NavLink>
                {/* /* Below is for having the github like hover with ~ on the selected navbar item. will fix it */}
                {/* <Link className='homepageMenuItem homepageLogo' to='/projects'>Projects
                <span className='command'>~</span>
                </Link> */}
                <NavLink className='homepageMenuItem' to='/history' onClick={closeMenu}>02.History</NavLink>
                <NavLink className='homepageMenuItem' to='/photos' onClick={closeMenu}>03.Photos</NavLink>
            </div>
        </nav>
    )
}

export default Navbar;