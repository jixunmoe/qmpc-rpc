import assert from 'assert';
import { IQQMusicRPC, RPCRequestWithRequired } from './RPC';
import type { QQMusicGetEDownUrlRequest, QQMusicGetEDownUrlResponse } from './music.vkey.GetEDownUrl.types';

/**
 * music.vkey.GetEDownUrl::CgiGetEDownUrl
 */
export async function CgiGetEDownUrl(
  this: IQQMusicRPC,
  param: RPCRequestWithRequired<QQMusicGetEDownUrlRequest, 'filename' | 'musicfile' | 'songmid'>
): Promise<QQMusicGetEDownUrlResponse> {
  assert(param.filename.length === param.musicfile.length);
  if (param.songtype) {
    assert(param.songtype.length === param.filename.length);
  }

  return this.doRPC<QQMusicGetEDownUrlResponse>(<QQMusicGetEDownUrlRequest>{
    method: 'CgiGetEDownUrl',
    module: 'music.vkey.GetEDownUrl',
    param: {
      checklimit: 1,
      ctx: 1,
      downloadfrom: 0,
      // "filename" : [],
      guid: this.session.guid,
      // "musicfile" : [],
      nettype: '',
      referer: 'y.qq.com',
      scene: 0,
      // "songmid" : [""],
      songtype: param.filename.map(() => 1),
      uin: this.session.uin,

      ...param,
    },
  });
}
