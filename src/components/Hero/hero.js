import React from "react";
import './hero.css';
import profile from '../../assets/profile.PNG'
// import background from "../../assets/Banner.png"

const Hero = () => {
    return (
        <section id='hero'>
            <div className="banner">
                <img src={profile} alt="banner img" className="bannerImg"/>
                <span className='heroName'>Hi, I'm Aryan</span>
                <span className='heroTitle'>Building digital products, brands, and experience.</span>
            </div>
        </section>
    )
}

export default Hero;