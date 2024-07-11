import { NextRequest, NextResponse } from 'next/server';
import { connectToWhatsApp } from "../../../lib/whatsapp";
import QRCode from 'qrcode';

export async function GET(req: NextRequest, res: NextResponse) {
  const { qrCodeData, connected } = await connectToWhatsApp();
  let qrCode = "";
  if (qrCodeData) {
    qrCode = await QRCode.toDataURL(qrCodeData);
  }
  return NextResponse.json({ qr: qrCode, connected });
}
