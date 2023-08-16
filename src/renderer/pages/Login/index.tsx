import { Alert, Button, Form, Input } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './index.module.scss';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const login = async () => {
    const values = await form.validateFields();

    // const res = await fetch(
    //   `http://localhost:3000/login?username=${values.username}&password=${values.password}`,
    //   {
    //     method: 'GET',
    //   }
    // );
    // const data = await res.json();
    window.electron.store.set('userInfo', values);
    window.electron.ipcRenderer.sendMessage('set-mainWindow-size', {
      width: 1400,
      height: 900,
    });
    navigate('/app1');
  };

  return (
    <div className={Styles.login}>
      <Alert
        type="info"
        message="登录后调整窗口尺寸 并且记录用户信息到C:\Users\admin\AppData\Roaming\Electron\config.json"
      ></Alert>
      <div className={Styles.formArea}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ username: 'admin', password: '123456' }}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" onClick={login}>
              Submit
            </Button>
          </Form.Item>
          {/* <Link to="/app1">app1</Link> */}
        </Form>
      </div>
    </div>
  );
};

export default Login;
