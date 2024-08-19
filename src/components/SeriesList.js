import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';
import Link from 'next/link';

const count = 3;

const App = ({podcasts}) => {


  

  return (
    <List
      className="demo-loadmore-list w-full"
  
      itemLayout="horizontal"
      dataSource={podcasts}
      renderItem={(item) => (
        <List.Item
        className='w-[180%]'
          actions={[<Link href={`/podcast/${item._id}`} key="list-loadmore-edit">Open</Link>]}
        >
          <Skeleton title={false} loading={item.loading} active>
            <List.Item.Meta
            //   avatar={<Avatar src={item.picture.large} />}
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.description}
            />
           
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default App;