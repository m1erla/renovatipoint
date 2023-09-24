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
        <h2>Benim profilim</h2>
        <p>Potansiyel müşterilerin kim olduğunuzu bilmesi için profilinizi tamamlayın.</p>
        <Link className="prfileViewLink">
          <AiFillEye /> Profilimi müşteri olarak görüntüle
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
            <Link className="ml">Yorumları görüntüle</Link>{" "}
          </span>
          <span className="contantSide-line">
            <CiLocationOn /> 2022CV Haarlem
          </span>
        </div>
      </div>
      <div className="profile-copy-link-wrapper">
        <h2>Musteri degerlendirmeleri</h2>
        <p>
          5 veya daha fazla yorumu olan profesyonellerin seçilme olasılığı daha yüksektir
          bir iş için olmak Bu bağlantıyı paylaşın ve en fazla 5 önceki müşteriyi talep edin
          bir inceleme.
        </p>
        <p className="profile-link">https://www.werkspot.nl/c/263fad?s=WEB</p>
        <div className="profile-link-buttons">
          <button className="link-button">Paylaşmak</button>
          <button className="link-button">Bağlantıyı kopyala</button>
        </div>
      </div>
      <div className="company-desc">
        <div className="company-head"><h3>Şirket tanımı</h3><button className="company-desc-btn"><BsPencil/> Değiştirmek</button></div>
        <p>a</p>
      </div>
      <div className="portfolio-promotion">
      <h3>Portföy</h3>
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
        <p>Dosyaları seçin veya yükleme alanına sürükleyin (png, jpg)</p>
      </div>
    </div>
    <div className="guarantee-wrapper">
        <h3>Garanti</h3>
        <p>Müşteriler için bir çeşit garantinin olması önemlidir. Potansiyel müşterilere, garantinin işe ve hizmete göre farklılık gösterebileceğini ve bunun önceden şirketle dikkatli bir şekilde koordine edilmesi gerektiğini her zaman bildiririz.</p>
        <div>
            <p>Not: 'Evet, garanti veriyorum' seçeneğini seçtiğinizde tüketiciler profilinizde garanti sunduğunuzu görebilir.</p>
            <div>
        <form className="yesORnoForm"> 
            <div className="radioBtnProfile">
                <input type="radio" id="yes" name="yesOrno" value="yes"/>
            <label htmlFor="yes">Evet garanti veriyorum</label>
            </div>
            <div className="radioBtnProfile">
                          <input type="radio" id="no" name="yesOrno" value="no"/>
            <label htmlFor="no">Hayır garanti vermiyorum</label>
            </div>
  
        </form>
    </div>
        </div>
    </div>
    <div className="reviews">
        <h3>Yorumlar (0)</h3>
    </div>
    </div>
  );
};

export default MyProfile;
