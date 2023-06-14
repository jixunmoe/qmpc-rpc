import { QQMusicRPC, QQMusicSession } from '@jixun/qmpc-rpc';
import { readJson } from './readJSON';

export function createClient(credentialPath?: string) {
  const client = new QQMusicRPC();
  if (credentialPath) {
    const credentials = readJson<{ cookie?: string; session: Partial<QQMusicSession> }>(credentialPath);
    if (credentials) {
      client.cookie = credentials.cookie;
      Object.assign(client.session, credentials.session);
      process.stderr.write('Applied custom session & cookie.\n');
    }
  }
  return client;
}
