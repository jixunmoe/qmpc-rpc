import type { GetEVKeyResponseBody } from './music.vkey.GetEVkey.types';
import type { QQMusicRPCRequest, RPCResponseAlt1 } from './RPC';

export type QQMusicGetEDownUrlRequest = QQMusicRPCRequest<
  'CgiGetEDownUrl',
  'music.vkey.GetEDownUrl',
  {
    checklimit: 1;
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
export type QQMusicGetEDownUrlResponse = RPCResponseAlt1<GetEDownUrlResponseBody>;

type GetEDownUrlResponseBody = GetEVKeyResponseBody;
