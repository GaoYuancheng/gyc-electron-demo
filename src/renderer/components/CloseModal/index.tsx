import { Checkbox, Modal, Radio } from 'antd';
import React, { useEffect, useState } from 'react';

const CloseModal: React.FC = () => {
  const [closeModalShow, setCloseModalShow] = useState(false);
  const [closeType, setCloseType] = useState('hide');
  const [noLongerShow, setNoLongerShow] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.on('open-closeModal', () => {
      setCloseModalShow(true);
    });
  }, []);

  const onOk = () => {
    setCloseModalShow(false);
    window.electron.ipcRenderer.sendMessage('close-app', { type: closeType });
  };

  return (
    <Modal
      open={closeModalShow}
      onCancel={() => {
        setCloseModalShow(false);
      }}
      onOk={onOk}
      destroyOnClose
    >
      <div>
        <div>
          <Radio.Group
            value={closeType}
            onChange={(e) => {
              console.log('e', e.target.value);
              setCloseType(e.target.value);
            }}
          >
            <Radio value="hide">缩小到托盘</Radio>
            <Radio value="exit">直接退出</Radio>
          </Radio.Group>
        </div>
        <div>
          <Checkbox
            onChange={(e) => {
              setNoLongerShow(e.target.checked);
            }}
            checked={noLongerShow}
          >
            下次不再提示
          </Checkbox>
        </div>
      </div>
    </Modal>
  );
};

export default CloseModal;
