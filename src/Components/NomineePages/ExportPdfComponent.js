import React from "react"
import ReactToPrint from "react-to-print"
import * as Icon from 'react-bootstrap-icons'
import Header from "../Header"
import img1 from '../../public/images/iqvia-logo_color.svg'
import img2 from '../../public/images/sign.jpg'
import prize from '../../public/images/prize2.jfif'
import { CONFIG } from "../../config"

class ExportPdfComponent extends React.Component {
    constructor(props) {
        super(props)
        this.details = this.props.x
    }

    render() {
        return (
            <div>
                <Header />
                <div className="row container" 
                style={{minWidth: "-webkit-fill-available", overflowX: "auto", marginLeft:"4vh"}}
                                                         >
                    <div className='col container mt-4'>
                        <div className="pm-certificate-container" ref={(response) => (this.componentRef = response)}>
                            <div className="outer-border"></div>
                            <div className="inner-border"></div>
                            <div className="pm-certificate-border col-xs-12">
                                <div className="row pm-certificate-header">
                                 <Icon.BookmarkFill size={90} className="col-2" style={{color:"#618597", marginTop:"-10px"}}/>
                                    <img src={img1} className='w-25 h-25 badge-img mt-4' />
                                    <div className="pm-certificate-title cursive col-xs-12 text-center">
                                        <h3>{this.props.x.nominationCategory}</h3>
                                    </div>
                                </div>

                                <div className="row pm-certificate-body">

                                    <div className="col-xs-12">
                                        <div className="row">
                                            <div className="pm-earned col-xs-8 text-center">
                                                <span className="pm-earned-text padding-0 cursive">Awarded to</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <div className="row" >
                                            <div className="h-25 col-xs-8 text-center">
                                                {this.props.x.profileImg ?
                                                <img className="icon-img"
                                                 src={`${CONFIG.VIEW_FILES}?display_img=${this.props.x?.uuid}_${this.props.x?.profileImg[0]}`}
                                                alt="Nomination Picture" /> :
                                                <img className="icon-img" src={prize}/>
                                            }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="pm-certificate-block">
                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="col-xs-2"> </div>
                                                <div className="pm-certificate-name underline margin-0 col-xs-8 text-center">
                                                    <span className="pm-name-text bold">{this.props.x.nomineeName}</span>
                                                </div>
                                                <div className="col-xs-2"> </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="pm-earned col-xs-8 text-center">
                                                    <span className="pm-earned-text padding-0 block cursive">for</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="col-xs-2"> </div>
                                                <div className="pm-course-title underline col-xs-8 text-center">
                                                    <span className="pm-credits-text block bold sans">
                                                    {this.props.x.certificateCitation} </span>
                                                </div>
                                                <div className="col-xs-2"> </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xs-12">
                                        <div className="pm-certificate-footer row">
                                            <div className="col col-lg-4 pm-certified col-xs-4 text-center">
                                                <span className="pm-credits-text block sans">
                                                    <img src={img2} className="w-50 h-50" />
                                                </span>
                                                <hr />
                                                <span className="bold block">Nivedita Jain, Sr Director, RDS IT</span>
                                            </div>
                                            <div className="col col-lg-4">

                                            </div>
                                            <div className="col col-lg-4 pm-certified col-xs-4 text-center">
                                                {/* date of townhall */}
                                                <span className="pm-credits-text block sans">{new Date(this.props.x.createdOn).toDateString()}</span>
                                                <hr />
                                                <span className="bold block">Date: </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <ReactToPrint
                        content={() => this.componentRef}
                        trigger={() => (
                            <button className="btn btn-success col h-25 m-4">Print to PDF!</button>
                        )}
                    />
                </div>
            </div>
        )
    }
}

export default ExportPdfComponent
