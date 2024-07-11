"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function WhatsAppQRCode() {
  const [qrCode, setQrCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQRCode() {
      const response = await fetch("/api/whatsapp");
      const data = await response.json();
      setQrCode(data.qr);
      setConnected(data.connected);
      setLoading(false);
    }

    fetchQRCode();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        {loading ? (
          <p className="text-center text-gray-600">Loading QR Code...</p>
        ) : connected ? (
          <p className="text-center text-green-500 font-semibold">
            WhatsApp connected
          </p>
        ) : (
          qrCode && (
            <div className="text-center">
              <p className="mb-4">Please scan QR Code:</p>
              <div className="mx-auto">
                <Image
                  width={300}
                  height={300}
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="rounded-lg"
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
