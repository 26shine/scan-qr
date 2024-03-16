import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { QrReader } from 'react-qr-reader';
import styles from './app.module.scss';
import useSound from 'use-sound';
import axios from 'axios';

function Scan() {
  const [data, setData] = useState<null | string>(null);
  const [qrInfo, setQrInfo] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [qrValid] = useSound('sounds/beep-1.mp3', { volume: 1 });

  const handleOnSuccess = async () => {
    if (!!qrInfo && !!qrInfo[0]) {
      try {
        const FORM_DATA_URL =
          'https://docs.google.com/forms/d/e/1FAIpQLScT-apCt71tkL_g9HozcXlansYAdDo6rYJZ82StcG1i1Y4ekw/formResponse?entry.1722036686=';
        axios
          .get(`${FORM_DATA_URL}${qrInfo[0]}`)
          .catch((error) => console.error(error));
        setChecked(true);
      } catch (error) {
        console.error('error', error);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setChecked(false);
      qrValid();
      setQrInfo(data.split(' - '));
    }
  }, [data]);

  useEffect(() => {
    console.log(checked);
  }, [checked]);

  return (
    <div className={styles.scan_wrapper}>
      <div className={styles.header_wrapper}>
        <Image
          src="/imgs/logo.jpg"
          width={100}
          height={100}
          alt="Picture of the author"
        />
        <div>
          <p className={styles.text_title}>GX. Thánh Giuse</p>
          <p className={styles.text_title}>GP. Đà Lạt</p>
        </div>
      </div>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            qrValid();
            setData(result.getText());
          }

          if (!!error) {
            console.info(error);
          }
        }}
        key="environment"
        constraints={{ aspectRatio: 1, facingMode: { ideal: 'environment' } }}
        containerStyle={{
          width: '250px',
          height: '250px',
          marginTop: '30px',
          border: '2px solid #ccc',
          padding: '10px',
          borderRadius: '10px',
        }}
      />
      {!!qrInfo.length && (
        <>
          <div className={styles.card_info}>
            <span>Thông tin</span>
            <p className={styles.card_text}>ID: {qrInfo[0]}</p>
            <p className={styles.card_text}>Họ và tên: {qrInfo[1]}</p>
          </div>

          <div>
            <button
              className={styles.form_button}
              disabled={checked}
              onClick={handleOnSuccess}
            >
              {checked ? 'Đã điểm danh' : 'Điểm danh'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Scan;
