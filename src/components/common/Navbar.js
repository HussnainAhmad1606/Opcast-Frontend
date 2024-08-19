"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image"; 
import { Button, Grid, Menu, Space, theme } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";


const { useToken } = theme;
const { useBreakpoint } = Grid;

import DropdownMenu from "@/components/common/DropdownMenu"
import { useUserStore } from "@/store/store";
import axios from "axios";

export default function App() {
  const {setIsLogin, isLogin, setUserId, setUsername} = useUserStore();
  const { token } = useToken();
  const screens = useBreakpoint();

  const verificationToken =async () => {

    const req = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify`, {
      token: localStorage.getItem("token")
    })

    const res = await req.data;
    // console.log(res)

    if (res.type == "success") {
      setIsLogin(true);
      setUserId(res.user._id)
      setUsername(res.user.username);
    }
  }

  useEffect(() => {
    verificationToken();
  }, [])

  const menuItems = [
    {
      label: "Home",
      key: "home",
    },
    {
      label: "Discover",
      key: "discover",
    },
    {
      label: "About",
      key: "about",
    },
  ];

  const [current, setCurrent] = useState("projects");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const styles = {
    container: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      margin: "0 auto",
      maxWidth: token.screenXL,
      padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
    },
    header: {
      backgroundColor: token.colorBgContainer,
      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      position: "relative"
    },
    logo: {
      display: "block",
      height: token.sizeLG,
      left: "50%",
      position: screens.md ? "static" : "absolute",
      top: "50%",
      transform: screens.md ? " " : "translate(-50%, -50%)"
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL
    },
    menuContainer: {
      alignItems: "center",
      display: "flex",
      gap: token.size,
      width: "100%"
    }
  };

  return (
    <nav style={styles.header}>
      <div style={styles.container}>
        <div style={styles.menuContainer}>
          <a style={styles.logo} href="#">
            <h1 className="font-bold text-2xl">Opcast</h1>
          </a>
          <Menu
            style={styles.menu}
            mode="horizontal"
            items={menuItems}
            onClick={onClick}
            selectedKeys={screens.md ? [current] : ""}
            overflowedIndicator={
              <Button type="text" icon={<MenuOutlined />}></Button>
            }
          />
        </div>
        <Space>
          
          {
            isLogin?(
              <DropdownMenu/>
            ):(
              <>
               <Link href={"/login"}><Button type="text">Log in</Button> </Link>
          <Link href={"/signup"}>
          <Button type="primary">Sign up</Button>
          </Link>
              </>
            )
          }
        </Space>
      </div>
    </nav>
  );
}