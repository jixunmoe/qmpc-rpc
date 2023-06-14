import {
  IPStack,
  QQMusicGetCdnDispatchRequest,
  QQMusicGetCdnDispatchResponse,
} from './music.audioCdnDispatch.cdnDispatch.types';
import { IQQMusicRPC } from './RPC';

/**
 * music.audioCdnDispatch.cdnDispatch::GetCdnDispatch
 */
export async function GetCdnDispatch(
  this: IQQMusicRPC,
  param?: Partial<QQMusicGetCdnDispatchRequest['param']>
): Promise<QQMusicGetCdnDispatchResponse> {
  return this.doRPC<QQMusicGetCdnDispatchResponse>(<QQMusicGetCdnDispatchRequest>{
    method: 'GetCdnDispatch',
    module: 'music.audioCdnDispatch.cdnDispatch',
    param: {
      ctx: 1,
      guid: this.session.guid,
      referer: 'y.qq.com',
      scene: 0,
      uin: this.session.uin,
      ...param,
    },
  });
}

GetCdnDispatch.IPStack = IPStack;
