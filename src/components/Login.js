"use client"
import React from "react";

import { Button, Form, Grid, Input, theme, Typography } from "antd";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import axios from "axios";

export default function SignUpPage() {
  const { setUsername, setUserId, setEmail, setIsLogin} = useUserStore();
  const { token } = useToken();
  const screens = useBreakpoint();
  const router = useRouter();


  const onFinish = async(values) => {
    console.log("Received values of form: ", values);

   try {
    const request = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, values);

    console.log(request)
   
    if (request.data.type == "success") {
      toast.success(request.data.message);
      localStorage.setItem("token", request.data.token);
      localStorage.setItem("refreshToken", request.data.refreshToken);
      setUsername(values.username);
      setUserId(request.data.userId);
      setIsLogin(true);
      setEmail(values.email);
      router.push("/dashboard");
    }
    else {
      toast.error(request.data.message);
    }
   }
  catch(error) {

    toast.error(error.response.data.message)

  }
  }
  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.paddingXL}px ${token.padding}px`,
      width: "380px"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center"
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
    },
    signup: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%"
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
          <img src={"/logo-without-text.png"} width={60}/>

          <Title style={styles.title}>Login</Title>
          <Text style={styles.text}>
            Enter your details below
          </Text>
        </div>
        <Form
          name="normal_signup"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
         
          <Form.Item
            name="username"
            rules={[
              {
                type: "text",
                required: true,
                message: "Please enter your username!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Sign in
            </Button>
            <div style={styles.signup}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="/login">Sign Up</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}