"use client"
import React from "react";

import { Card, Flex, theme, Typography, Button } from "antd";

const { useToken } = theme;
const { Text, Link } = Typography;

export default function App({series}) {
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
        {
          series.cover != ""? (
            <img
            alt={`${series.name} cover image`}
            src={series.cover}
          />
          ):(
            <h1>No Cover Image</h1>
          )
        }
      
        <Flex vertical gap={token.marginXXS}>
          <Text strong>{series.name}</Text>
          <Text style={styles.paragraph}>
           {series.description}
          </Text>
        </Flex>

        <Button type="primary" href={`/series/${series._id}`}>

          <Text type="primary">View Series</Text>
        </Button>
      </Flex>
    </Card>
    </Flex>
  );
}