import Image from "next/image";
import * as qrcode from "qrcode";
import { useEffect, useState } from "react";

const QRCode = () => {
  const [countDown, setCountDown] = useState<number>(15);
  const [qrData, setQRData] = useState<string>(
    `https://link-to-attendance.vn/${new Date().getTime()}`
  );
  const [qrDataURL, setQRDataURL] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown > 0) {
        setCountDown(countDown - 1);
      } else {
        setCountDown(15);
        setQRData(`https://link-to-attendance.vn/${new Date().getTime()}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  useEffect(() => {
    async function updateQRCode() {
      const qrURL = await qrcode.toDataURL(qrData);
      setQRDataURL(qrURL);
    }
    updateQRCode();
  }, [qrData]);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="text-center">
        <Image
          src={qrDataURL}
          alt="QrCode to attendance"
          width={300}
          height={300}
        />
        <p>Rotate QR code in {countDown}s.</p>
      </div>
    </div>
  );
};

export default QRCode;
