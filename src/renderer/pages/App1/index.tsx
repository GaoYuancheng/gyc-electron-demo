import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import Styles from './index.module.scss';
import { Link } from 'react-router-dom';

const App1: React.FC = () => {
  const userInfo = window.electron.store.get('userInfo');

  const [osInfo, setOsInfo] = useState<any>({});

  const getOsInfo = () => {
    window.electron.ipcRenderer.on('get-osInfo', (arg) => {
      // eslint-disable-next-line no-console
      setOsInfo(arg);
    });
    window.electron.ipcRenderer.sendMessage('get-osInfo');
  };

  const saveFile = () => {
    window.electron.ipcRenderer.sendMessage('save-file', {
      fileUrl: 'C:\\Users\\admin\\Desktop\\osInfo.txt',
      fileContent: JSON.stringify(osInfo),
    });
  };

  return (
    <div className={Styles.app1}>
      <Link to="/login">返回登录页</Link>
      <div>欢迎 {userInfo.username}</div>
      <Button onClick={getOsInfo}>获取系统信息</Button>
      <div>
        {Object.keys(osInfo).map((key) => (
          <div key={key}>{osInfo[key]}</div>
        ))}
      </div>
      <Button onClick={saveFile}>导出文件</Button>
    </div>
  );
};

export default App1;
