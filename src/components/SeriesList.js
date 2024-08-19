import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';

const count = 3;

const App = ({seriesId}) => {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState([{title: "Test", description: "Desc", id: "5458043820"}]);



  const getPodcastsList = async() => {
    setInitLoading(false);
  }

  useEffect(() => {
    getPodcastsList();
  }, [])
  

  return (
    <List
      className="demo-loadmore-list w-full"
      loading={initLoading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) => (
        <List.Item
        className='w-[180%]'
          actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
        >
          <Skeleton title={false} loading={item.loading} active>
            <List.Item.Meta
            //   avatar={<Avatar src={item.picture.large} />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
           
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default App;