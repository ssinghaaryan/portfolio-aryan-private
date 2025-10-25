import React from "react";
import './projectSections.css';
import { Link } from "react-router-dom";
import SeleniumImg from "../../assets/Selenium-1.png"
import RestAssuredImg from "../../assets/RestAssured.png"
import ApiImg from "../../assets/Api.png"
import JavaImg from "../../assets/Java.png"

const ProjectSections = () => {
    return (
        <>
        <section id='projectSections'>
            <div className='projectSectionsContainer'>
                <img src={SeleniumImg} alt='' className='projectSectionImg' />
                <div className='projectSectionRight'>
                <span> LumaAutomation </span> 
                <div className='projectSectionContent'>
                From clicking buttons with Selenium to poking APIs with REST Assured, I’ve built test frameworks that don’t just work—they work smart. Whether it's crafting Java-based test suites, automating the boring stuff with TestNG, or making sure APIs behave, I love breaking things (and then helping fix them). CI/CD? Yep, that too.
                </div>
                <div className='projectSectionLinks'>
                    <span>
                    <Link to='https://github.com/ssinghaaryan/LumaAutomation' className='linkText'> Github </Link> 
                    <span className='linkArrow'>↗</span>
                    </span>
                    <span>
                    <span className='linkText'> Website </span> 
                    <span className='linkArrow'>↗</span>
                    </span>
                </div>
                </div>
            </div>
            <div className='sectionDivider' />
            <div className='projectSectionsContainer'>
                <img src={RestAssuredImg} alt='' className='projectSectionImg' />
                <div className='projectSectionRight'>
                <span> FurStore Automation </span>
                <div className='projectSectionContent'>
                This project is a comprehensive API testing framework designed to test and automate the API of the Swagger Petstore for the User, Pet, and Store models. Built using REST Assured, Java, TestNG, Maven, Jenkins, Git, and Extent Reports, it is designed to simplify API testing and reporting, ensuring efficient and reliable automated testing processes.
                </div>
                <div className='projectSectionLinks'>
                    <span>
                    <Link to='https://github.com/ssinghaaryan/FurStore-Automation' className='linkText'> Github </Link> 
                    <span className='linkArrow'>↗</span>
                    </span>
                    <span>
                    <span className='linkText'> Website </span> 
                    <span className='linkArrow'>↗</span>
                    </span>
                </div>
                </div>
            </div>
            <div className='sectionDivider' />
            <div className='projectSectionsContainer'>
                <img src={ApiImg} alt='' className='projectSectionImg' />
                <div className='projectSectionRight'>
                <span> Paws-API </span>
                <div className='projectSectionContent'>
                This project is a comprehensive API testing framework designed to test and automate the API of the Swagger Petstore for the User, Pet, and Store models. Built using REST Assured, Java, TestNG, Maven, Jenkins, Git, and Extent Reports, it is designed to simplify API testing and reporting, ensuring efficient and reliable automated testing processes.
                </div>
                <div className='projectSectionLinks'>
                    <span>
                    <Link to='https://github.com/ssinghaaryan/Paws-API' className='linkText'> Github </Link> 
                    <span className='linkArrow'>↗</span>
                    </span>
                    <span>
                    <Link to='https://pawsapi.vercel.app/docs' className='linkText'> Website </Link> 
                    <span className='linkArrow'>↗</span>
                    </span>
                </div>
                </div>
            </div>
            <div className='sectionDivider' />
            <div className='projectSectionsContainer'>
                <img src={JavaImg} alt='' className='projectSectionImg' />
                <div className='projectSectionRight'>
                <span> Java </span>
                <div className='projectSectionContent'>
                This project is a comprehensive API testing framework designed to test and automate the API of the Swagger Petstore for the User, Pet, and Store models. Built using REST Assured, Java, TestNG, Maven, Jenkins, Git, and Extent Reports, it is designed to simplify API testing and reporting, ensuring efficient and reliable automated testing processes.
                </div>
                <div className='projectSectionLinks'>
                    <span>
                    <Link to='https://github.com/ssinghaaryan/DSA-Practice' className='linkText'> Github </Link> 
                    <span className='linkArrow'>↗</span>
                    </span>
                    <span>
                    <Link to='' className='linkText'> Website </Link> 
                    <span className='linkArrow'>↗</span>
                    </span>
                </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default ProjectSections;