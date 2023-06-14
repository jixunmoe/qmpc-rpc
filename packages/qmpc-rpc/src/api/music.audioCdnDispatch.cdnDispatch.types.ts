import type { QQMusicRPCRequest, RPCResponseAlt1 } from './RPC';

export type QQMusicGetCdnDispatchRequest = QQMusicRPCRequest<
  'GetCdnDispatch',
  'music.audioCdnDispatch.cdnDispatch',
  {
    ctx: number; // 1
    guid: string; // guid
    referer: string; // "y.qq.com"
    scene: number; // 0
    uin: string; // QQ
  }
>;
export type QQMusicGetCdnDispatchResponse = RPCResponseAlt1<GetCdnDispatchBody>;

interface GetCdnDispatchBody {
  cacheTime: number;
  expiration: number;
  freeflowsip: string[];
  keepalivefile: string;
  kugo: CDNHostItem[]; // 酷狗?
  kuwo: CDNHostItem[]; // 酷我?
  lazy: CDNHostItem[]; // 懒人听书?
  msg: string;
  p2pup: { msg: string; onoff: number };
  refreshTime: number;
  retcode: number;
  servercheck: string;
  sip: string[]; // 用这个
  sipinfo: CDNHostItem[];
  testfile2g: string;
  testfilewifi: string;
  uin: string;
  userip: string;
  vkey: string;
}

export enum IPStack {
  IPv4 = 1 << 0,
  IPv6 = 1 << 1,
}

interface CDNHostItem {
  cdn: string;
  encryptquic: number;
  /**
   * 1 = IPv4, 2 = IPv6, 3 = IPv4 | IPv6
   * 看一些域名应该是 IPv6，但是实际上只添加了 IPv4 DNS 解析?
   */
  ipstack: IPStack;
  plaintextquic: number;
  quic: number;
  quichost: string;
}
