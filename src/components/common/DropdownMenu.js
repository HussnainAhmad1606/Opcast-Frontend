import React from 'react'
import { Button, Dropdown, Space, Avatar } from 'antd';

import { UserOutlined, StarOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';

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
          <DashboardOutlined className="mx-1" />Dashboard
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          <StarOutlined className="mx-1"/> Favourites
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
         <LogoutOutlined className="mx-1"/> Logout
        </a>
      ),
    },
  ];
  
function DropdownMenu() {
  return (
    <Dropdown menu={{ items }} placement="bottomRight">

    <Avatar size="large" icon={<UserOutlined />} />
   
  </Dropdown>
  )
}

export default DropdownMenu