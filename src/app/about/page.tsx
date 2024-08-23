"use client"

import React from "react";

import { Button, Grid, theme, Typography } from "antd";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function App() {
  const { token } = useToken();
  const screens = useBreakpoint();

  const styles = {
    container: {
      margin: "200px auto",
      maxWidth: token.screenXL,
      padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
    },
    panel: {
      alignItems: screens.sm ? "flex-start" : "stretch", // align panel to center
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowTertiary,
      display: "flex",
      flexDirection: "column",
      gap: token.margin,
      margin: "0 auto",
      maxWidth: "480px",
      padding: token.paddingLG
    },
    text: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: token.fontSizeHeading5,
      marginTop: 0
    }
  };

  return (
    <section>
      <div style={styles.container}>
        <div style={styles.panel}>
          <div>
          <Title level={1} style={styles.title}>
            OpCast
          </Title>
          <Text style={styles.text}>
            Welcome to OpCast! We are a podcasting platform that allows you to share your thoughts with the world.
          </Text>
          </div>
          <Button href={"/login"} type="primary">Get Started</Button>
        </div>
      </div>
    </section>
  );
}