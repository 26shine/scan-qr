import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { QrReader } from 'react-qr-reader';
import styles from './app.module.scss';
import useSound from 'use-sound';
import axios from 'axios';

interface UserInfo {
  id: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
  fatherName: string;
  motherName: string;
}

function Scan() {
  const [data, setData] = useState<null | string>(null);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [checked, setChecked] = useState(false);
  const [qrValid] = useSound('sounds/beep-1.mp3', { volume: 1 });
  const [activeTab, setActiveTab] = useState('scan');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [onCallDate, setOnCallDate] = useState<string | undefined>();

  const handleRollCall = async (isLate?: boolean) => {
    setError(undefined);
    const userId = userInfo?.id;
    if (!userId) return;

    try {
      await axios.post(
        `/users/${userId}/roll-call`,
        { onCallDate, isLate },
        {
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        }
      );
      setChecked(true);
    } catch (error: any) {
      console.error(error);
      if (error.response.data?.message) {
        setError(error.response.data?.message);
        return;
      }

      setError('Có lỗi xảy ra. Vui lòng thử lại sau');
    }
  };

  const getUserInfo = async (userId?: string) => {
    if (!userId) return;
    setIsLoading(true);
    setError(undefined);
    setChecked(false);
    try {
      const response = await axios.get(`/users/${userId}`, {
        baseURL: process.env.NEXT_PUBLIC_API_URL,
      });
      const { data } = response;
      setUserInfo({
        id: data['MÃ SỐ'],
        name: data['TÊN THÁNH'] + ' ' + data['HỌ VÀ TÊN'],
        dob: data['NĂM SINH'],
        phone: data['SDT'],
        address: data['GH'],
        fatherName: data['TÊN THÁNH, TÊN CHA'],
        motherName: data['TÊN THÁNH, TÊN MẸ'],
      });
    } catch (error: any) {
      setUserInfo(undefined);
      if (error.response?.status === 404) {
        setError('Không tìm thấy thông tin thiếu nhi');
        return;
      }
      setError('Kiểm tra thông tin thất bại. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setChecked(false);
      qrValid();
      getUserInfo(data);
    }
  }, [data]);

  useEffect(() => {
    setError(undefined);
  }, [activeTab]);

  useEffect(() => {
    console.log(checked);
  }, [checked]);

  useEffect(() => {
    const savedOnCallDate = localStorage.getItem('onCallDate');
    if (savedOnCallDate) {
      setOnCallDate(savedOnCallDate);
    }
  }, []);

  return (
    <div className={styles.scan_wrapper}>
      <div className={styles.header_wrapper}>
        <Image
          src="/imgs/logo.jpg"
          width={80}
          height={80}
          alt="Picture of the author"
        />
        <div>
          <p className={styles.text_title}>Giáo xứ Thánh Giuse</p>
          <p className={styles.text_title}>Giáo phận Đà Lạt</p>
        </div>
      </div>

      <div className={styles.tab_container}>
        <button
          className={activeTab === 'scan' ? styles.active_tab : ''}
          onClick={() => setActiveTab('scan')}
        >
          SCAN QR
        </button>
        <button
          className={activeTab === 'input' ? styles.active_tab : ''}
          onClick={() => setActiveTab('input')}
        >
          NHẬP MÃ SỐ
        </button>
      </div>

      {activeTab === 'scan' && (
        <div className={styles.qr_container}>
          <div className={styles.scan_line}></div>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setError(undefined);
                qrValid();
                setData(result.getText());
              }

              if (!!error) {
                console.info(error);
              }
            }}
            key="environment"
            constraints={{
              aspectRatio: 1,
              facingMode: { ideal: 'environment' },
            }}
            containerStyle={{
              width: '280px',
              height: '280px',
              border: '2px solid #29324e',
              padding: '10px',
              borderRadius: '10px',
            }}
          />
        </div>
      )}

      {activeTab === 'input' && (
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Nhập mã số  thiếu nhi"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={() => getUserInfo(inputValue)}>Kiểm tra</button>
        </div>
      )}

      {isLoading && <div className={styles.loading}>Đang xử lý ...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!!userInfo && (
        <>
          <div className={styles.card_info}>
            <span>THÔNG TIN</span>
            <div className={styles.user_info}>
              <p>
                <b>Mã số:</b> {userInfo.id}
              </p>
              <p>
                <b>Họ và Tên:</b> {userInfo.name}
              </p>
              <p>
                <b>Năm sinh:</b> {userInfo.dob}
              </p>
              <p>
                <b>SĐT:</b> {userInfo.phone}
              </p>
              <p>
                <b>Giáo Họ:</b> {userInfo.address}
              </p>
            </div>
          </div>

          {!checked ? (
            <div>
              <button
                className={styles.form_button}
                disabled={checked}
                onClick={() => handleRollCall()}
              >
                Điểm danh
              </button>

              <button
                className={styles.warning_button}
                disabled={checked}
                onClick={() => handleRollCall(true)}
              >
                Đi muộn
              </button>
            </div>
          ) : (
            <div className={styles.success_message}>
              <p> Đã điểm danh</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Scan;
