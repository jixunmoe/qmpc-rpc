import { QQMusicGetSongDetailRequest, QQMusicGetSongDetailResponse } from './music.pf_song_detail_svr.types';
import { IQQMusicRPC, RPCRequestWithRequired } from './RPC';

/**
 * music.pf_song_detail_svr::get_song_detail
 */
export async function get_song_detail(
  this: IQQMusicRPC,
  param: RPCRequestWithRequired<QQMusicGetSongDetailRequest, 'song_mid'>
): Promise<QQMusicGetSongDetailResponse> {
  return this.doRPC<QQMusicGetSongDetailResponse>(<QQMusicGetSongDetailRequest>{
    method: 'get_song_detail',
    module: 'music.pf_song_detail_svr',
    param: {
      song_id: null,
      song_type: 0,
      ...param,
    },
  });
}
