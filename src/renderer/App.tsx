import { Button, Modal } from 'antd';
import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import App1 from './pages/App1';
import Login from './pages/Login';
import CloseModal from './components/CloseModal';

// function Hello() {
//   return (
//     <div>
//       <div>
//         <Link to="/app1">/app</Link>
//         {/* <Button
//           type="primary"
//           onClick={() => {
//             window.electron.store.set('asd', '11');
//           }}
//         >
//           setStore('asd', '111')
//         </Button> */}
//       </div>
//     </div>
//   );
// }

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app1" element={<App1 />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <CloseModal />
    </Router>
  );
}
