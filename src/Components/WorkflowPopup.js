import React from 'react';
import Header from './Header';
import Footer from './Footer';
import img3 from '../public/images/bg_image_3.png';

const WorkflowPopup = () => {
  return (

    <>
      <Header />
      <main>
        <div className="page-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 py-3" style={{ margin: "auto" }}>
                <h2 className="title-section">Step 1: Nomination</h2>
                <div className="divider"></div>
                <p className="mb-5">Recognizers to fill and submit nomination forms to R&R team</p>
              </div>
              <div className="col-lg-6 py-3">
                <div className="img-place text-center">
                  <img src={img3} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="page-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 py-3">
                <div className="img-place text-center">
                  <img src={img3} alt="" />
                </div>
              </div>
              <div className="col-lg-6 py-3" style={{ margin: "auto" }}>
                <h2 className="title-section">Step 2: Review</h2>
                <div className="divider"></div>
                <p className="mb-5">Review Committee assigned by the admin to assess all nominations and provide their ratings to nominations </p>
              </div>

            </div>
          </div>
        </div>


        <div className="page-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 py-3" style={{ margin: "auto" }}>
                <h2 className="title-section">Step 3: Approval</h2>
                <div className="divider"></div>
                <p className="mb-5">Nivedita and her next line LT to review and approve</p>
              </div>
              <div className="col-lg-6 py-3">
                <div className="img-place text-center">
                  <img src={img3} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="page-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 py-3">
                <div className="img-place text-center">
                  <img src={img3} alt="" />
                </div>
              </div>
              <div className="col-lg-6 py-3" style={{ margin: "auto" }}>
                <h2 className="title-section">Step 4: Award Disbursal</h2>
                <div className="divider"></div>
                <p className="mb-5">Award to be given during Quarterly All Hands/Town Halls</p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default WorkflowPopup


