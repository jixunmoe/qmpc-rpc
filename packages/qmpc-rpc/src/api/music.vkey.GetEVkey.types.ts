import type { QQMusicRPCRequest, RPCResponseAlt1 } from './RPC';

export type QQMusicGetEVKeyRequest = QQMusicRPCRequest<
  'CgiGetEVkey',
  'music.vkey.GetEVkey',
  {
    checklimit: 0;
    ctx: 1;
    downloadfrom: 0;
    filename: string[]; // 文件名，必填
    guid: string; // 与 session 的 guid 一致
    musicfile: string[]; // songmid 拼接的文件名
    nettype: ''; // 留空
    referer: 'y.qq.com'; //
    scene: 0;
    songmid: string[];
    songtype: number[]; // 固定值 1，与 songmid 的数量一致。
    uin: string; // QQ 号
  }
>;
export type QQMusicGetEVKeyResponse = RPCResponseAlt1<GetEVKeyResponseBody>;

export interface GetEVKeyResponseBody {
  expiration: number;
  login_key: string;
  midurlinfo: URLInfo[];
  msg: string;
  retcode: number;
  servercheck: string;
  sip: unknown[];
  testfile2g: string;
  testfilewifi: string;
  thirdip: string[];
  uin: string;
  verify_type: number;
}

interface URLInfo {
  auth_switch: number;
  auth_switch2: number;
  common_downfromtag: number;
  ekey: string;
  errtype: string;
  filename: string;
  flowfromtag: string;
  flowurl: string;
  hisbuy: number;
  hisdown: number;
  isbuy: number;
  isonly: number;
  onecan: number;
  opi128kurl: string;
  opi192koggurl: string;
  opi192kurl: string;
  opi30surl: string;
  opi48kurl: string;
  opi96koggurl: string;
  opi96kurl: string;
  opiflackurl: string;
  p2pfromtag: number;
  pdl: number;
  pneed: number;
  pneedbuy: number;
  premain: number;
  purl: string;
  qmdlfromtag: number;
  result: number;
  songmid: string;
  subcode: number;
  tips: string;
  uiAlert: number;
  vip_downfromtag: number;
  vkey: string;
  wififromtag: string;
  wifiurl: string;
}
