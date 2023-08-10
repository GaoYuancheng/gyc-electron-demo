import { Button, Card, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import Styles from './index.module.scss';
import { Link } from 'react-router-dom';

const list = [
  {
    value: 'home',
    label: '用户的 home 文件夹（主目录）',
  },
  {
    value: 'appData',
    label: '每个用户的应用程序数据目录',
  },
  {
    value: 'userData',
    label: '储存你应用程序配置文件的文件夹',
  },
  {
    value: 'documents',
    label: '当前用户的桌面文件夹',
  },
];

const App1: React.FC = () => {
  const userInfo = window.electron.store.get('userInfo');

  const [osInfo, setOsInfo] = useState<any>({});
  const [appPath, setAppPath] = useState<any>('');
  const [selectedFilePath, setSelectedFilePath] = useState<any>([]);

  const getOsInfo = () => {
    window.electron.ipcRenderer.once('get-osInfo', (arg) => {
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

  const getAppPath = (value: any) => {
    window.electron.ipcRenderer.once('get-appPath', (arg) => {
      // eslint-disable-next-line no-console
      setAppPath(arg);
    });
    window.electron.ipcRenderer.sendMessage('get-appPath', value);
  };

  const getFilePath = () => {
    window.electron.ipcRenderer.once('get-filePath', (arg: any) => {
      console.log('get-filePath', arg);
      setSelectedFilePath(arg?.filePaths);
    });
    window.electron.ipcRenderer.sendMessage('get-filePath', {
      fileUrl: appPath,
    });
  };

  return (
    <div className={Styles.app1}>
      <Link to="/login">返回登录页</Link>
      <div>欢迎 {userInfo.username}</div>
      <div className={Styles.cardArea}>
        <Card className={Styles.card}>
          <div>
            <Button onClick={getOsInfo}>获取系统信息</Button>
          </div>
          <div>
            {Object.keys(osInfo).map((key) => (
              <div key={key}>{osInfo[key]}</div>
            ))}
          </div>
        </Card>
        <Card className={Styles.card}>
          <Button onClick={saveFile}>导出文件到桌面</Button>
        </Card>
        <Card className={Styles.card}>
          <div>
            <Select onChange={getAppPath} style={{ width: 200 }}>
              {list.map((item) => (
                <Select.Option key={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </div>
          <div>{appPath}</div>

          <div>
            <Button onClick={getFilePath}>获取文件路径</Button>
            <div>
              {selectedFilePath.map((item: any) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default App1;
