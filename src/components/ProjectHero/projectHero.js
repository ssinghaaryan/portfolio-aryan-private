import React from "react";
import ProjectBanner from '../../assets/projectBanner.gif'
import './projectHero.css';

const ProjectHero = () => {
    return (
        <>
        <section id='projectHero'>
            <div className='projectBanner'>
                <img src={ProjectBanner} className='projectBannerImg'></img>
            </div>
            <div className='projectSummary'></div>
        </section>
        <section id='projectSummary'>
            <span className='projectSummaryDesc'>From clicking buttons with Selenium to poking APIs with REST Assured, I’ve built test frameworks that don’t just work—they work smart. Whether it's crafting Java-based test suites, automating the boring stuff with TestNG, or making sure APIs behave, I love breaking things (and then helping fix them). CI/CD? Yep, that too.</span>
        </section>
        </>
    )
}

export default ProjectHero;