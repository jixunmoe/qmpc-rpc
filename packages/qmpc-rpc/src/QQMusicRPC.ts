import axios from 'axios';
import { QQMusicSession, sign, generateSession } from '@jixun/qmpc-sign';

import type { IQQMusicRPC, QQMusicRPCObject } from './api/RPC';

import * as API from './api/API';
import { buildRPC } from './utils/buildRPC';

export class QQMusicRPC implements IQQMusicRPC {
  public session;
  public cookie?;
  public headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
    'Accept-Language': 'zh-CN',
    Accept: '*/*',
  };

  /**
   * Inject API methods
   */
  public Search = API.DoSearchForQQMusicDesktop;
  public GetAlbumDetail = API.GetAlbumDetail;
  public GetSongDetail = API.get_song_detail;
  public GetStreamPath = API.CgiGetEVkey;
  public GetDownloadURL = API.CgiGetEDownUrl;
  public FetchCDNConfig = API.GetCdnDispatch;

  constructor(session?: QQMusicSession, cookie?: string) {
    this.session = session || generateSession();
    this.cookie = cookie;
  }

  async doRPC<R = Record<string, unknown>>(rpcObjects: QQMusicRPCObject<unknown>): Promise<R>;
  async doRPC<R = Record<string, unknown>>(rpcObjects: QQMusicRPCObject<unknown>[]): Promise<R[]>;
  async doRPC<R = Record<string, unknown>>(
    rpcObjects: QQMusicRPCObject<unknown> | QQMusicRPCObject<unknown>[]
  ): Promise<R | R[]> {
    if (!Array.isArray(rpcObjects)) {
      return this.doRPC<R>([rpcObjects]).then((arr) => arr[0]);
    }

    const [reqNames, rpcPayload] = buildRPC(rpcObjects);
    const signed = sign(this.session, rpcPayload, BigInt(Date.now()) / 1000n);
    const resp = await axios.post(signed.url, signed.payload, {
      headers: {
        ...this.headers,
        ...signed.headers,
        ...(this.cookie && { Cookie: this.cookie }),
      },
    });

    return reqNames.map((key: string) => resp.data[key]);
  }
}
