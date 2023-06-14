import assert from 'assert';
import { QQMusicGetEVKeyRequest, QQMusicGetEVKeyResponse } from './music.vkey.GetEVkey.types';
import { IQQMusicRPC, RPCRequestWithRequired } from './RPC';

/**
 * music.vkey.GetEVkey::CgiGetEVkey
 */
export async function CgiGetEVkey(
  this: IQQMusicRPC,
  param: RPCRequestWithRequired<QQMusicGetEVKeyRequest, 'filename' | 'musicfile' | 'songmid'>
): Promise<QQMusicGetEVKeyResponse> {
  assert(param.filename.length === param.musicfile.length);
  if (param.songtype) {
    assert(param.songtype.length === param.filename.length);
  }

  return this.doRPC<QQMusicGetEVKeyResponse>(<QQMusicGetEVKeyRequest>{
    method: 'CgiGetEVkey',
    module: 'music.vkey.GetEVkey',
    param: {
      checklimit: 0,
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
