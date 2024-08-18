"use client"
import React from "react";

import { Card, Flex, theme, Typography } from "antd";

const { useToken } = theme;
const { Text, Link } = Typography;

export default function App() {
  const { token } = useToken();

  const styles = {
    card: {
      width: "300px",
    },
    paragraph: {
      color: token.colorTextSecondary,
    },
  };

  return (
    <Flex justify="center">
    <Card style={styles.card}>
      <Flex vertical gap="middle">
        <img
          alt="Card image"
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Flex vertical gap={token.marginXXS}>
          <Text strong>Card title</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit interdum
            hendrerit ex vitae sodales.
          </Text>
        </Flex>
      </Flex>
    </Card>
    </Flex>
  );
}