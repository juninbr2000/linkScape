import React from 'react';
import Slider from 'react-slick'
import ppr1 from '../assets/ppr1.jpeg';
import ppr2 from '../assets/ppr2.jpeg';
import ppr3 from '../assets/ppr3.jpeg';

const AutoPlay = () => {

    const settings = {
        dots: false,
        infinity: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        speed: 10000,
        autoplaySpeed: 0,
        cssEase: "linear",
        arrows: false,
    }

  return (
    <div className='sliderContainer'>
        <Slider {...settings}>
            <div className='imageSlider'>
                <img src={ppr1} alt="" />
            </div>
            <div className='imageSlider'>
                <img src={ppr2} alt="" />
            </div>
            <div className='imageSlider'>
                <img src={ppr3} alt="" />
            </div>
        </Slider>
    </div>
  )
}

export default AutoPlay