import React, { useState } from "react";
import { AiFillEye, AiFillStar, AiOutlinePicture } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./componentCss/myprofile.css";
import { GrUserWorker } from "react-icons/gr";
import { CiLocationOn } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";

const MyProfile = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [popoverVisible, setPopoverVisible] = useState(false);
 

  
  
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Dosyanın verisini okuyup görsel olarak görüntülemek için bir URL oluşturun.
          setUploadedImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const showPopover = () => {
      setPopoverVisible(true);
    };
  
    const hidePopover = () => {
      setPopoverVisible(false);
    };
  return (
    <div className="container profileSide">
      <div className="prfile-titles">
        <h2>My profile</h2>
        <p>Complete your profile so potential customers know who you are.</p>
        <Link className="prfileViewLink">
          <AiFillEye /> View my profile as a client
        </Link>
      </div>
      <div className="profileContent-wrapper">
        <div className="profileImage-wrapper">
          <label className="profileImageInputIcon" htmlFor="profileImageInput">
            <GrUserWorker className="prfileIcon" />
          </label>
          <input id="profileImageInput" type="file" />
        </div>
        <div className="profile-contantSide">
          <span className="contantSide-line">
            <AiFillStar className="stars" /> 0/5 (0){" "}
            <Link className="ml">View reviews</Link>{" "}
          </span>
          <span className="contantSide-line">
            <CiLocationOn /> 2022CV Haarlem
          </span>
        </div>
      </div>
      <div className="profile-copy-link-wrapper">
        <h2>Customer reviews</h2>
        <p>
          Vakmensen met 5 of meer reviews hebben meer kans om geselecteerd te
          worden voor een klus. Deel deze link en vraag tot 5 eerdere klanten om
          een review.
        </p>
        <p className="profile-link">https://www.werkspot.nl/c/263fad?s=WEB</p>
        <div className="profile-link-buttons">
          <button className="link-button">To share</button>
          <button className="link-button">Copy link</button>
        </div>
      </div>
      <div className="company-desc">
        <div className="company-head"><h3>Company Description</h3><button className="company-desc-btn"><BsPencil/> Change</button></div>
        <p>a</p>
      </div>
      <div className="portfolio-promotion">
      <h3>Portfolio</h3>
      <div
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        style={{ position: 'relative'}}
      >
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{ width: '150px', height: '150px', objectFit: "cover" }}
          />
        ) : (
          null
        )}
        {popoverVisible && (
          <div
            className="popover"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 999,
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              padding: '10px',
            }}
          >
            {uploadedImage && (
              <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%',maxHeight:'600px'}} />
            )}
          </div>
        )}
      </div>
      <div className="uploadfiles-wrapper">
        <label htmlFor="portfolioInput"><AiOutlinePicture className="uploadImageFileIcon"/> </label>
        <input
          type="file"
          id="portfolioInput"
          onChange={handleFileUpload}
          accept=".png, .jpg"
        />
        <p>Select files or drag them to the upload area (png, jpg)</p>
      </div>
    </div>
    <div className="guarantee-wrapper">
        <h3>Guarantee</h3>
        <p>It is important for customers that there is some form of warranty. We always let potential customers know that the warranty may differ per job and service, and that this must be carefully coordinated with the company in advance.</p>
        <div>
            <p>Opmerking: door de optie 'Ja, ik geef garantie' te kiezen, kunnen consumenten op je profiel zien dat je garantie biedt.</p>
            <div>
        <form className="yesORnoForm"> 
            <div className="radioBtnProfile">
                <input type="radio" id="yes" name="yesOrno" value="yes"/>
            <label htmlFor="yes">Yes, I give a guarantee</label>
            </div>
            <div className="radioBtnProfile">
                          <input type="radio" id="no" name="yesOrno" value="no"/>
            <label htmlFor="no">No, I don't give a guarantee</label>
            </div>
  
        </form>
    </div>
        </div>
    </div>
    <div className="reviews">
        <h3>Reviews (0)</h3>
    </div>
    </div>
  );
};

export default MyProfile;
