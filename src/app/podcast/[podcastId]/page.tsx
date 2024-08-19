"use client"
import api from '@/utils/api';
import React, {useState, useEffect} from 'react'
import { toast } from 'react-hot-toast';
import "@/css/audioPlayer.css"
import { Card, Col, Grid, Row, Statistic, theme, Typography } from "antd";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const stats = [
  {
    id: 1,
    name: "Downloads",
    value: "100",
    prevValue: "8923.11",
    changeType: "increase",
    precision: 2,
    prefix: "$"
  },
  {
    id: 2,
    name: "Views",
    value: "1k",
    prevValue: "8654.33",
    changeType: "decrease",
    precision: 2,
    prefix: "$"
  },
  {
    id: 3,
    name: "Replays",
    value: "200",
    prevValue: "3812",
    changeType: "decrease",
    // precision: 2,
    prefix: "$"
  }
];

export default function App({params}:any) {
  const { token } = useToken();
  const screens = useBreakpoint();

  const [podcast, setPodcast] = useState<any>({});
  const { podcastId } = params;

  const styles = {
    card: {
      position: "relative"
    },
    container: {
      margin: "0 auto",
      maxWidth: screens.lg ? token.screenXL : token.screenSM,
      padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
    },
    section: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.sizeXXL}px 0px`
    }
  };



  const getSinglePodcast = async () => {
      const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/podcast/get-single-podcast`, {
          podcastId: podcastId
      });
      if (request.data.type =="success"){
        console.log(request.data)
        setPodcast(request.data.podcast);
        let pageTitle = request.data.podcast.title + " - Opcast";
        document.title = pageTitle;
      }
      else {
        toast.error(request.data.message);
      }
  }

  useEffect(() => {
    getSinglePodcast();
  }, [])

  return (
    <div style={styles.section}>
      <div style={styles.container}>
        <Row
          gutter={[
            {
              xs: token.size,
              sm: token.size,
              md: token.size,
              lg: token.sizeLG,
              xl: token.sizeLG
            },
            token.size
          ]}
        >
          {stats.map((stat) => (
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Card bodyStyle={styles.card}>
                <Statistic
                  title={stat.name}
                  value={stat.value}
                  precision={stat.precision}
                  valueStyle={{
                    color:
                      stat.changeType === "increase"
                        ? token.colorSuccessTextActive
                        : token.colorErrorTextActive
                  }}
                
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className='m-5'>
        <h1 className='font-bold text-3xl'>{podcast.title}</h1>
        <p>{podcast.description}</p>
      </div>


      <AudioPlayer
       className="audioPlayer"
    autoPlay
    src={podcast.audioURL}
    onPlay={e => console.log("onPlay")}
    // other props here
  />
    </div>
  );
}