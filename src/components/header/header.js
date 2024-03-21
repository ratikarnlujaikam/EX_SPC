import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from 'react';



const useStyles = makeStyles(() => ({
  logo: {
    fontFamily: "Work Sans, sans-serif",
    fontWeight: 600,
    color: "#0B274D",
  },
  menuButton: {
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 600,
    color: "#0B274F",
    size: "20px",
    textAlign: "left",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#FFF",
  },
}));

const headersData = [];

export default function Header() {
  const { header, logo, menuButton, toolbar } = useStyles();
 
  // เปิดmanu auto
  useEffect(() => {
    // เมื่อคอมโพเนนต์ถูกโหลด
    const pushmenuButton = document.querySelector(".nav-link[data-widget='pushmenu']");
    if (pushmenuButton) {
      pushmenuButton.click(); // คลิกที่ปุ่ม pushmenu โดยอัตโนมัติ
    }
  }, []); // เรียกในรอบแรกที่คอมโพเนนต์ถูกโหลดเท่านั้น
  

  const displayDesktop = () => {
    return (
      <div className="bodylayout-fixed">

      <Toolbar className={`${toolbar} `}>
        <a
          className="nav-link"
          data-widget="pushmenu" // เพิ่ม data-widget เพื่อเปิด SideMenu
          href="#"
          // role="button"
        >
          <i className="fas fa-bars" /> Menu
        </a>
    
        
        <div>{getMenuButtons()}</div>
        <Link to="/home" className="nav-link">
          <img src="BlueText.png" alt="Home" />
        </Link>
        <img src="minebeamitsumi_logo_en.png" alt="Logo" />
      </Toolbar>
      </div>
    );
  };
  
  
  

  const NMBLogo = (
    <Typography variant="h6" component="h1" className={logo}>
      I-Spindle 4.0
    </Typography>
    
  );

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          {...{
            key: label,
            color: "inherit",
            to: href,
            component: RouterLink,
            className: menuButton,
          }}
        >
          {label}
        </Button>
      );
    });
  };

  return (
    <header>
     <AppBar className={`${header} layout-fixed`} main-header="true" navbar="true" navbar-expand="true" navbar-white="true" navbar-light="true">
  {displayDesktop()}
</AppBar>
    </header>
  );
}
