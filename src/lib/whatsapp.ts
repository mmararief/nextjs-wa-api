// lib/whatsapp.ts

import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

interface ConnectResult {
  qrCodeData: string | null;
  connected: boolean;
  sock: ReturnType<typeof makeWASocket>;
}

export async function connectToWhatsApp(): Promise<ConnectResult> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    auth: state,
  });

  return new Promise((resolve, reject) => {
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        resolve({ qrCodeData: qr, connected: false, sock });
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
        if (shouldReconnect) {
          connectToWhatsApp();
        }
      } else if (connection === 'open') {
        console.log('opened connection');
        resolve({ qrCodeData: null, connected: true, sock });
      }
    });

    sock.ev.on('messages.upsert', async (m) => {
      console.log(JSON.stringify(m, undefined, 2));

      if (m.messages[0]?.message) {
        const message = m.messages[0].message.conversation;
        console.log('Received message:', message);
      }
    });
  });
}
