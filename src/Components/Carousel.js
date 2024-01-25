import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CONFIG } from '../config';
import prize from '../public/images/prize.jfif'
import p2 from '../public/images/p2.jfif'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const myCarousel = () => {
    const [winners, setWinners] = useState([])
    useEffect(() => {
        axios.post(CONFIG.WINNERS_URL, {
            token: window.localStorage.token,
        }).then((response) => {
            setWinners(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <Carousel
            autoPlay={true}
            // interval={5000}
            // width={700}
            infiniteLoop
            stopOnHover={true}
            showThumbs={false}>
            {winners.map(nom => (
                 <div key={winners.indexOf(nom)} className="text-white h-100">
                        
                        <div className="card-body d-flex justify-content-between align-items-center">
                        {nom.profileImg ?
                            <img className=" card-img-top m-3"
                                src={`${CONFIG.VIEW_FILES}?display_img=${nom?.uuid}_${nom?.profileImg[0]}`}
                                alt="Nomination Picture" style={{ borderRadius: "30px", width:'22vh', height:'28vh'}} /> :
                            <img className="card-img-top m-3" src={prize} style={{ borderRadius: "30px", width:'22vh', height:'28vh'}} />}

                            <div className="card-number m-3 ">
                                <div className="h4 mb-3">{nom.nomineeName}</div>
                                <h5> In {nom.nominationCategory}
                                <p>{nom.certificateCitation}</p></h5>
                            </div>
                        </div>
                    </div>
            ))}
        </Carousel>
    );
}

export default myCarousel