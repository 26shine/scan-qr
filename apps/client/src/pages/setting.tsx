import React, { useEffect, useState } from 'react';
import styles from './app.module.scss';

const setting = () => {
  const [onCallDate, setOnCallDate] = useState<string | undefined>();
  const [saved, setSaved] = useState<boolean>(false);

  const handleSaveSetting = () => {
    if (onCallDate) {
      localStorage.setItem('onCallDate', onCallDate);
    }
  };

  useEffect(() => {
    const savedOnCallDate = localStorage.getItem('onCallDate');
    if (savedOnCallDate) {
      setOnCallDate(savedOnCallDate);
    }
  }, []);

  useEffect(() => {
    const savedOnCallDate = localStorage.getItem('onCallDate');
    console.log(onCallDate, savedOnCallDate);
    setSaved(onCallDate === savedOnCallDate);
  }, [onCallDate]);

  return (
    <div className={styles.setting_wrapper}>
      <h1>Setting</h1>
      <div>
        <span>Ngày điểm danh:</span>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Nhập ngày điểm danh"
            value={onCallDate}
            onChange={(e) => setOnCallDate(e.target.value)}
          />
          <button onClick={handleSaveSetting} disabled={saved}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default setting;
