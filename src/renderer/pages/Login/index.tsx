import { Button, Form, Input } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const login = async () => {
    const values = await form.validateFields();

    const res = await fetch(
      `http://localhost:3000/login?username=${values.username}&password=${values.password}`,
      {
        method: 'GET',
      }
    );
    const data = await res.json();
    window.electron.store.set('userInfo', data);
    window.electron.ipcRenderer.sendMessage('set-mainWindow-size', {
      width: 1200,
      height: 700,
    });
    navigate('/app1');
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
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
      <Link to="/app1">app1</Link>
    </Form>
  );
};

export default Login;
