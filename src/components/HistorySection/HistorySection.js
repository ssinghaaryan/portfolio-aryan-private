import React from "react";
import "./HistorySection.css";

const HistorySection = () => {
    return (
        <>
        <section id='historySections'>
        <div className="timelineEntry">
            <div className='historySectionsContainer'>
                <span className='duration'>Nov 2024 - Present</span>
                <div className='historySectionRight'>
                    <span className='company'>QA Engineer • LeewayHertz</span>
                    <div className='historySectionContent'>
                    Worked as a Quality Assurance Engineer wherein handled the Manual Testing. Lorem Ipsum 
                    Worked as a Quality Assurance Engineer wherein handled the Manual Testing. Lorem Ipsum 
                    Worked as a Quality Assurance Engineer wherein handled the Manual Testing. Lorem Ipsum.
                    </div>
                    <div className='historySectionSkills'>
                        <span>Automation Testing</span>
                        <span>API Testing</span>
                        <span>Manual Testing</span>
                        <span>Java</span>
                        <span>Performance Testing</span>
                    </div>
                </div>
            </div>
                <div className='connection'></div>
        </div>
            
        <div className="timelineEntry">
            <div className='historySectionsContainer'>
                <span className='duration'>Aug 2024 - Nov 2024</span>
                <div className='historySectionRight'>
                    <span className='company'>Test Consultant • Hogarth Worldwide</span>
                    <div className='historySectionContent'>
                    • Collaborating with the ANZ and SEA team, performing Functional and UI Testing across multiple platforms, identifying and reporting critical issues, ensuring the highest Quality Standards for major global launchs.<br />
                    • Handling 1/3 of the total incoming tickets for QA, effectively prioritising and managing them, contributing to a overall team efficiency.<br />
                    • Working closely with the Team Lead, Project Manager, and Developers to align testing efforts with project goals.<br />
                    </div>
                    <div className='historySectionSkills'>
                        <span>Manual Testing</span>
                        <span>UI/UX Testing</span>
                        <span>Regression Testing</span>
                        <span>Agile</span>
                    </div>
                </div>
            </div>
                <div className='connection'></div>
        </div>

            <div className='historySectionsContainer'>
                <span className='duration'>July 2023 - May 2024</span>
                <div className='historySectionRight'>
                    <span className='company'>Inter, Manual Tester • Cvent IN</span>
                    <div className='historySectionContent'>
                    Worked as a Quality Assurance Engineer wherein handled the Manual Testing. Lorem Ipsum 
                    Worked as a Quality Assurance Engineer wherein handled the Manual Testing. Lorem Ipsum 
                    Worked as a Quality Assurance Engineer wherein handled the Manual Testing. Lorem Ipsum.
                    </div>
                    <div className='historySectionSkills'>
                        <span>Manual Testing</span>
                        <span>API</span>
                        <span>Performance</span>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default HistorySection;