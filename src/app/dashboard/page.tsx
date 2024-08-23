"use client"
import React,  {useEffect, useState} from "react";

import { Button, Divider, Grid, Space, theme, Typography } from "antd";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
import PodcastSeries from "@/components/common/PodcastSeries"
import Link from "next/link";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/store";

export default function App() {
  const [series, setSeries] = useState([])
  const { token } = useToken();
  const screens = useBreakpoint();

  const {setTotalEarnings} = useUserStore();

  const getUserSeries = async() => {
    const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/series/get-user-series`);
    if (request.data.type =="success"){
      console.log(request.data)
      setSeries(request.data.series)
     
    }
    else {
      toast.error(request.data.message);
    }
  }
  const getTotalEarnings = async() => {
    const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/podcast/get-total-earnings`);
    if (request.data.type =="success"){
      console.log(request.data)
      setTotalEarnings(request.data.totalEarnings)
     
    }
    else {
      toast.error(request.data.message);
    }
  }

  useEffect(() => {
    getUserSeries();
    getTotalEarnings();
  }, [])



  
  

  const styles = {
    container: {
      margin: "0 auto",
      maxWidth: screens.lg ? token.screenXL : token.screenSM,
      padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
    },
    divider: {
      margin: 0
    },
    header: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.paddingLG}px 0px`
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
    tagline: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      margin: "0px"
    },
    titleWrapper: {
      alignItems: screens.md ? "flex-end" : "flex-start",
      justifyContent: "space-between",
      width: "100%"
    }
  };

  return (
    <>
      <div style={styles.header}>
        <div style={styles.container}>
          <Space
            size="middle"
            direction={screens.md ? "horizontal" : "vertical"}
            style={styles.titleWrapper}
          >
            <Space direction="vertical">
              <Text style={styles.tagline}>Tagline</Text>
              <Title block style={styles.title}>
                Your Podcast Series
              </Title>
            </Space>
            <Space>
              <Link href={"/dashboard/series/new"}><Button type="primary">New Series</Button></Link>
            </Space>
          </Space>
        </div>
      </div>
      <Divider style={styles.divider} />
      <div style={styles.section}>
        <div style={styles.container}>
         
{
  series.length > 0 ? series.map((series, index) => {
    return <PodcastSeries key={index} series={series} />
  }) :null
}         
        </div>
      </div>
    </>
  );
}