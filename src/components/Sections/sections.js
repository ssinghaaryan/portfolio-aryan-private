import React from "react";
import './sections.css'
import ProjectImg from "../../assets/project.jpg"
import HistoryImg from "../../assets/work-history-black.jpg"
import PhotoImg from "../../assets/camera.jpg"
import { Link } from "react-router-dom";

const Sections = () => {
    return (
        <section id='sections'>

        <Link to='/projects' className='sectionLinkWrapper'>
            <div className='sectionContainer'>
                <span className='sectionTitle'>Projects</span>
                <div className="sectionBottomRow">
                <div className='sectionContent'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
                <img src={ProjectImg} className='sectionImg' />
                </div>
            </div>
            </Link>

            <Link to='/history' className='sectionLinkWrapper'>
            <div className='sectionContainer'>
                <span className='sectionTitle'>History</span>
                <div className="sectionBottomRow">
                <img src={HistoryImg} className='sectionImg' />
                <div className='sectionContent'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
                </div>
            </div>
            </Link>

            <Link to='/photos' className='sectionLinkWrapper'>
            <div className='sectionContainer'>
                <span className='sectionTitle'>Photos</span>
                <div className="sectionBottomRow">
                <div className='sectionContent'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
                <img src={PhotoImg} className='sectionImg' />
                </div>
            </div>
            </Link>

        </section>
    )
}

export default Sections;