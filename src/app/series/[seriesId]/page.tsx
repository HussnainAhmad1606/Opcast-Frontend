"use client"
import api from '@/utils/api';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';

import { Button, Divider, Grid, Space, theme, Typography } from "antd";
import Image from 'next/image';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

import SeriesList from "@/components/SeriesList"

export default function App({params}:any) {
  const { seriesId } = params;

  const [series, setSeries] = useState({
    name: "",
    description: "",
    cover: ""
  });
  const [isAdmin, setIsAdmin] = useState(false);

  
  const getUserSeries = async() => {
    const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/series/get-single-series`, {
      seriesId: seriesId
    });
    if (request.data.type == "success"){
      console.log(request.data)
      setSeries(request.data.series);
      setIsAdmin(request.data.isAdmin);
    }
    else {
      toast.error(request.data.message);
    }
  }

  useEffect(() => {
    getUserSeries();
  }, [])
  const { token } = useToken();
  const screens = useBreakpoint();

  const styles = {
    container: {
      margin: "0 auto",
      maxWidth: screens.lg ? token.screenXL : token.screenSM,
      padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
    },
    header: {
      alignContent: "center",
      alignItems: "flex-start",
      justifyContent: "space-between",
      width: "100%"
    },
    paragraph: {
      color: token.colorTextSecondary
    },
    placeholder: {
      backgroundColor: token.colorBgLayout,
      border: `${token.lineWidth}px dashed ${token.colorBorder}`,
      borderRadius: token.borderRadiusLG,
      padding: token.paddingLG,
      textAlign: "center"
    },
    section: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.sizeXXL}px 0px`
    },
    textWrapper: {
      width: "100%"
    },
    title: {
      fontSize: token.fontSizeHeading4,
      marginBottom: token.marginXXS,
      marginTop: 0
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.container}>
        <Space
          size="middle"
          direction={screens.md ? "horizontal" : "vertical"}
          style={styles.header}
        >
          <Space style={styles.textWrapper} direction="vertical" size={4}>
            <Title style={styles.title}>Podcast Series: {series.name}</Title>
            <Text style={styles.paragraph}>
              {series.description}
            </Text>
          </Space>
          <Space>
            {
              isAdmin && (
                <>
                <Button type="primary">Add New Episode</Button>
                </>
              )
              }
          </Space>
        </Space>
        <Divider direction="horizontal" />

        <div className='flex '>
        <img src={series.cover} style={{height: "100vh"}} />
        <div className='ml-10'>
          <h1 className='text-center font-bold text-3xl my-5'>Podcasts:</h1>
        <SeriesList seriesId={seriesId}/>
        </div>
        </div>
      
          
      
      </div>
    </div>
  );
}