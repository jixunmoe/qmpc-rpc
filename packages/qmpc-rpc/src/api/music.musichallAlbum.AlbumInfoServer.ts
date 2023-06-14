import {
  QQMusicGetAlbumDetailRequest,
  QQMusicGetAlbumDetailResponse,
} from './music.musichallAlbum.AlbumInfoServer.types';
import { IQQMusicRPC, RPCRequestWithRequired } from './RPC';

/**
 * music.musichallAlbum.AlbumInfoServer::GetAlbumDetail
 */
export async function GetAlbumDetail(
  this: IQQMusicRPC,
  param: RPCRequestWithRequired<QQMusicGetAlbumDetailRequest, 'albumMid'>
): Promise<QQMusicGetAlbumDetailResponse> {
  return this.doRPC<QQMusicGetAlbumDetailResponse>(<QQMusicGetAlbumDetailRequest>{
    method: 'GetAlbumDetail',
    module: 'music.musichallAlbum.AlbumInfoServer',
    param: param,
  });
}
