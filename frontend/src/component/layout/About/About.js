import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from '@mui/icons-material/GitHub';
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/sahin_18_00";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dl0trmlyx/image/upload/v1697463823/myPhoto_otmw6d.jpg"
              alt="Founder"
            />
            <Typography>Sahin Dafader</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
            I am Sahin Dafader a MERN developer.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Account</Typography>
            <a
              href="https://www.linkedin.com/in/sahin-dafader-384670203/"
              target="blank"
            >
              <LinkedInIcon className="LinkedInSvgIcon" />
            </a>

            <a href="https://instagram.com/sahin_18_00" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
            <a href="https://github.com/SahinDa" target="blank">
              <GitHubIcon className="githubSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;