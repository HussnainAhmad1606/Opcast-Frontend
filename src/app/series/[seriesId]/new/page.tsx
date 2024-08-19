"use client"
import React, {useState} from "react";

import { Button, Checkbox, DatePicker, Form, Grid, Input, Select, theme, Typography } from "antd";
import ImgInput from "@/components/ImgInput"
import AudioInput from "@/components/AudioInput"

import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/store";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;




export default function App({params}:any) {
  const { token } = useToken();
  const screens = useBreakpoint();
  const {coverImage, audioURL }:any = useUserStore();
  const { seriesId } = params;

    interface SubmittedForm {
        title: string;
        description: string;
        cover: string;
        host: string;
        category: string;
        series: string;
        guests: string;
        audioURL: string;
        duration: string;
        isLive: boolean;
        status: string;
        publishDate: string;
    }
  const onFinish = async(values:SubmittedForm) => {
    
    let data = {
        title: values.title,
        description: values.description,
        cover: coverImage,
        host: values.host,
        category: values.category.split(","),
        series: seriesId,
        guests: values.guests.split(","),
        audioURL: audioURL,
        duration: values.duration,
        isLive: values.isLive,
        status: values.status,
        publishDate: values.publishDate
    }
    
    console.log("Received values of form: ", data);
    const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/podcast/new-podcast`, data);
    console.log(request.data)
    if (request.data.type =="success"){
      toast.success(request.data.message);
    }
    else {
      toast.error(request.data.message);
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: token.marginXL
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "140vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
    },
    text: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
      
          <Title style={styles.title}>Add New Podcast</Title>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Please input podcast title!",
              },
            ]}
          >
            <Input
              placeholder="Podcast Title"
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input podcast description!",
              },
            ]}
          >
            <Input
              type="description"
              placeholder="Podcast Description"
            />
          </Form.Item>
          <Form.Item
            name="host"
            rules={[
              {
                required: true,
                message: "Please input podcast host!",
              },
            ]}
          >
            <Input
              placeholder="Podcast Host"
            />
          </Form.Item>
          <Form.Item
            name="category"
            rules={[
              {
                required: true,
                message: "Please input podcast category!",
              },
            ]}
          >
            <Input
              placeholder="Podcast Category"
            />
          </Form.Item>
          <Form.Item
            name="guests"
            rules={[
              {
                required: true,
                message: "Please input podcast Guests!",
              },
            ]}
          >
            <Input
              placeholder="Podcast Guests"
            />
          </Form.Item>
          <Form.Item
            name="duration"
            rules={[
              {
                required: true,
                message: "Please input podcast Duration!",
              },
            ]}
          >
            <Input
              placeholder="Podcast Duration"
            />
          </Form.Item>
          <Form.Item
            name="publishDate"
            rules={[
              {
                required: true,
                message: "Please input podcast publish date!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
  
          <Form.Item
            name="isLive"
            rules={[
              {
                required: true,
                message: "Please input podcast is live or not!",
              },
            ]}
          >
    <Select
      defaultValue={"Live"}
      style={{ width: 120 }}
      options={[
        { value: true, label: 'Live' },
        { value: false, label: 'Recorded' },
      ]}
    />
          </Form.Item>
          <Form.Item
            name="status"
            rules={[
              {
                required: true,
                message: "Please input podcast status!",
              },
            ]}
          >
    <Select
      defaultValue={"Draft"}
      style={{ width: 120 }}
      options={[
          { value: "Draft", label: 'Draft' },
          { value: "Scheduled", label: 'Scheduled' },
        { value: "Published", label: 'Published' },
      ]}
    />
          </Form.Item>
  
          
          <Form.Item style={{ marginBottom: "0px" }}>
            <ImgInput/>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <AudioInput/>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block="true" type="primary" htmlType="submit">
             Add series
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}




