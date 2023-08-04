import { Button } from 'antd';
import React from 'react';

const App1 = () => {
  return (
    <div>
      <span>{window.electron.store.get('asd')}</span>
    </div>
  );
};

export default App1;
