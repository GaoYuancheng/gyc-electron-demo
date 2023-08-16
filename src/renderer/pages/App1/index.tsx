import { Button, Card, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import Styles from './index.module.scss';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const [osInfo, setOsInfo] = useState<any>('');
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

  const openNotification = () => {
    window.electron.ipcRenderer.sendMessage('send-notification');
  };

  const logout = () => {
    window.electron.store.set('userInfo', {});
    navigate('/login');
  };

  return (
    <div className={Styles.app1}>
      <div className={Styles.action}>
        <a onClick={logout}>退出登录</a>
      </div>
      <div className={Styles.content}>
        <div>欢迎 {userInfo.username}</div>
        <div className={Styles.cardArea}>
          <Card className={Styles.card} title="系统信息">
            <div>
              <Button onClick={getOsInfo}>获取系统信息</Button>
            </div>
            <div>
              {osInfo &&
                Object.keys(osInfo).map((key) => (
                  <div key={key}>{osInfo[key]}</div>
                ))}
            </div>
          </Card>
          <Card className={Styles.card} title="导出文件">
            <Button onClick={saveFile}>导出文件到桌面</Button>
          </Card>
          <Card className={Styles.card} title="打开文件">
            <div>
              <Select onChange={getAppPath} style={{ width: 200 }}>
                {list.map((item) => (
                  <Select.Option key={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </div>
            <div>下方文件选择默认打开路径：{appPath}</div>
            <div>
              <Button onClick={getFilePath}>获取选中文件路径</Button>
              <div>
                {selectedFilePath.map((item: any) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </div>
          </Card>

          <Card className={Styles.card} title="发送通知">
            <Button onClick={openNotification}>发送通知</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App1;
