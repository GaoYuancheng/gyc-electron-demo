import { createRoot } from 'react-dom/client';
import App from './App';
import { message } from 'antd';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.on('show-message', (arg: any) => {
  // eslint-disable-next-line no-console
  console.log(arg);
  const { type, text } = arg;
  (message as any)[type](text);
});
