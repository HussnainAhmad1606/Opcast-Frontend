import React from 'react'
import "@/css/heroSection.css"
import { Button } from 'antd'
function HeroSection() {
  return (
    <div id='heroSection'>
        <h1 className='font-bold text-5xl'>Your Ultimate Podcast Destination</h1>
        <p className='text-center my-5'>
        OpCast is a dynamic podcast platform where you can upload, share, and explore a wide range of podcasts. Connect with your audience in real-time, and track your podcast's performance with in-depth analytics.
        </p>

        <Button type='primary'>Get Started</Button>
    </div>
  )
}

export default HeroSection