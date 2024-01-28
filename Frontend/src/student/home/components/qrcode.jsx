import React from "react";
import QRCode from "react-qr-code";

const QR = ({ token, setShowQR }) => {
  return (
    <section
      onClick={() => {
        setShowQR(false);
      }}
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur"
    >
      <div
        onClick={() => {
          setShowQR(false);
        }}
        className="absolute right-4 top-4 aspect-square w-8"
      >
        <img
          src="/icons/times.svg"
          alt="times icon"
          className="aspect-square w-8"
        />
      </div>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "16rem", width: "100%" }}
        value={token}
        viewBox={`0 0 256 256`}
      />
    </section>
  );
};

export default QR;
