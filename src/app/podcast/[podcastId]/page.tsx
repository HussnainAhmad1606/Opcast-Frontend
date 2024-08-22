"use client"
import api from '@/utils/api';
import React, {useState, useEffect, useRef} from 'react'
import { toast } from 'react-hot-toast';
import "@/css/audioPlayer.css"
import { Card, Col, Grid, Row, Statistic, theme, Typography } from "antd";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { getDeviceInfo } from '@/utils/getDeviceInfo';
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text } = Typography;
import BrowserChart from '@/components/BrowserChart';
import DeviceChart from '@/components/DeviceChart';




export default function App({params}:any) {
  const { token } = useToken();
  const screens = useBreakpoint();
  const audioRef = useRef(null);
  const lastTimeRef = useRef(0);
  const [replayed, setReplayed] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});

  const [devicesInfo,setDevicesInfo] = useState([
  { deviceType: 'desktop', browser: 'firefox' },

  { deviceType: 'desktop', browser: 'safari' }])

  const [isPlayed, setIsPlayed] = useState(false);

  const [podcastStats, setPodcastStats] = useState({ totalViews: 0,
    totalReplays: 0,
    totalPlays: 0,
    uniqueViews: 0})


  const getPodcastStatistics = async() => {
    
    const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/podcast/get-podcast-events`, {
        podcastId: podcastId
    });
    console.log(request.data)
    processPodcastStatistics(request.data.events);
  }

  const filterUniqueIpAddresses = (array:any) => {
    const seen = new Set();
    return array.filter((item:any) => {
      if (!seen.has(item.ipAddress)) {
        seen.add(item.ipAddress);
        return true;
      }
      return false;
    });
  };

  const processPodcastStatistics = (data:any) => {
    const totalViews = data.filter((item:any) => item.eventType == "view").length;
    const totalReplays = data.filter((item:any) => item.eventType == "replay").length;
    const totalPlays = data.filter((item:any) => item.eventType == "play").length;
    const totalDevices =data.map((item:any) => ({
      deviceType: item.deviceInfo.deviceType,
      browser: item.deviceInfo.browser,
    }));

  console.log()
    setDevicesInfo(totalDevices);
    // get uniques views
    const uniqueViews = filterUniqueIpAddresses(data);
    let stats = {
      totalViews: totalViews,
      totalReplays: totalReplays,
      totalPlays: totalPlays,
      uniqueViews: uniqueViews.length
    }
    console.log(stats)
    console.log(totalDevices)
    setPodcastStats(stats)
   

  }

  const handlePlay = () => {
    setReplayed(false);
    if (!isPlayed){
      trackEvent("play");
      setIsPlayed(true);
    }
  };

  // Handle time update to detect replay (seek backward)
  const handleTimeUpdate = () => {
    
    
    const currentTime = audioRef.current.audio.current.currentTime;


    // Detect if the user has sought backward
    if (currentTime < lastTimeRef.current && !replayed) {
      console.log("replayed")
      trackEvent("replay");

      setReplayed(true); // Mark that the replay has been tracked
    }

    lastTimeRef.current = currentTime; // Update the last time reference
  };

  // Handle the audio ending to detect replay from the start
  const handleEnded = () => {
    setReplayed(false); // Allow replay to be tracked again if the audio is restarted
  };



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
  const trackEvent = async (eventType:string) => {
    let sendingDeviceInfo = deviceInfo;
    if (Object.keys(sendingDeviceInfo).length === 0){
      sendingDeviceInfo = getDeviceInfo(navigator.userAgent);
      setDeviceInfo(sendingDeviceInfo);
    }
      const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/podcast/track-events`, {
          podcastId: podcastId,
          eventType: eventType,
          deviceInfo: sendingDeviceInfo
      });
      console.log(request.data)
  }

  useEffect(() => {
    getSinglePodcast();
    setDeviceInfo(getDeviceInfo(navigator.userAgent))
    trackEvent("view");
    getPodcastStatistics();
  }, [])
  const stats = [
    {
      id: 1,
      name: "Unique Views",
      value: podcastStats['uniqueViews'],  
    },
    {
      id: 2,
      name: "Total Views",
      value: podcastStats['totalViews'],   
    },
    {
      id: 3,
      name: "Plays",
      value: podcastStats['totalPlays'],
    },
    {
      id: 4,
      name: "Replays",
      value: podcastStats['totalReplays'],   
    }
  ];
  
  return (
    <div style={{height: "150vh"}}>

    <div style={styles.section}>
      <Card>

<h1 style={{textAlign: "center"}} className='text-center font-bold text-2xl my-5'>Audience Statistics</h1>


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
      </Card>
      <div style={{margin: "30px 0px"}}>
      <Card>

<h1 style={{textAlign: "center"}} className='text-center font-bold text-2xl my-5'>Device Statistics</h1>

<div style={{display: 'flex', justifyContent: "space-around", alignItems: "center"}}>

<BrowserChart data={devicesInfo} />
<DeviceChart data={devicesInfo} />
</div>
</Card>
      </div>


      <div className='m-5'>
        <h1 className='font-bold text-3xl'>{podcast.title}</h1>
        <p>{podcast.description}</p>
      </div>


      <AudioPlayer
       className="audioPlayer"
    autoPlay
    src={podcast.audioURL}
    ref={audioRef}
    onPlay={handlePlay}
    onListen={handleTimeUpdate}
    onEnded={handleEnded}
    // other props here
    />
    </div>
    </div>
  );
}