"use client"
import React from "react";

import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import ImgInput from "@/components/ImgInput"

import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/store";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;




export default function App() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const {coverImage } = useUserStore();

    interface SubmittedForm {
        name: string;
        description: string;
        cover: string;
    }
  const onFinish = async(values:SubmittedForm) => {
    
    let data = {
      name: values.name,
      description: values.description,
      cover: coverImage
    }
    
    console.log("Received values of form: ", data);
    const request = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/series/new-series`, data);
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
      width: "380px"
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
      height: screens.sm ? "100vh" : "auto",
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
      
          <Title style={styles.title}>Add New Series</Title>
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
            name="name"
            rules={[
              {
                required: true,
                message: "Please input series name!",
              },
            ]}
          >
            <Input
              placeholder="Series Name"
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input series description!",
              },
            ]}
          >
            <Input
              type="description"
              placeholder="Series Description"
            />
          </Form.Item>
  
          
          <Form.Item style={{ marginBottom: "0px" }}>
            <ImgInput/>
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




