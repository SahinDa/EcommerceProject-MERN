import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.jpg"
import "./Footer.css";

const Footer = () => {
  return (
   <footer id="footer">
    <div className="leftFooter">
         <h4>DOWNLOAD OUR APP</h4>
       <p>Download App for Android and IOS mobile phone</p>
       <img src={playStore} alt="playStore"/>
       <img src={appStore} alt="Appstore"/>
    </div>
    <div className="midFooter">
      <h1>X-MERCE</h1>
      <p>High Quality is our first priority</p>
      <p>Copyrights 2023  @meSahinDafader</p>
    </div>
    <div className="rightFooter">
     <h4>Follow Us</h4>
     <a href="https://instagram.com/sahin_18_00">Instagram</a>
     <a href="https://github.com/sahinDa">Github</a>
     <a href="https://www.linkedin.com/in/sahin-dafader-384670203/">Linkedln</a>
    </div>

   </footer>
  )
}

export default Footer;
