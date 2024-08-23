import React from 'react'
import { Button, Dropdown, Space, Avatar } from 'antd';

import { UserOutlined, StarOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useUserStore } from '@/store/store';
import { useRouter } from 'next/navigation';


  
function DropdownMenu() {

  const router = useRouter();

  const {totalEarnings} = useUserStore();

  const logout = () => {
    localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login")
  }

  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Hi, Psycho
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
         Earnings: {totalEarnings} PKR
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <Link href={"/dashboard"}>
          <DashboardOutlined className="mx-1" />Dashboard
        </Link>
      ),
    },
    {
      key: '4',
      label: (
        <button onClick={logout} target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
         <LogoutOutlined className="mx-1"/> Logout
        </button>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomRight">

    <Avatar size="large" icon={<UserOutlined />} />
   
  </Dropdown>
  )
}

export default DropdownMenu