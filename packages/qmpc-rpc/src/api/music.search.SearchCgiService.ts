import { generateId } from '../utils/generateId';
import { IQQMusicRPC, RPCRequestWithRequired } from './RPC';
import { QQMusicSearchRequest, QQMusicSearchResponse, SearchType } from './music.search.SearchCgiService.types';

/**
 * music.search.SearchCgiService::DoSearchForQQMusicDesktop
 */
export async function DoSearchForQQMusicDesktop(
  this: IQQMusicRPC,
  param: RPCRequestWithRequired<QQMusicSearchRequest, 'query'>
): Promise<QQMusicSearchResponse> {
  return this.doRPC<QQMusicSearchResponse>(<QQMusicSearchRequest>{
    method: 'DoSearchForQQMusicDesktop',
    module: 'music.search.SearchCgiService',
    param: {
      grp: 1,
      num_per_page: 40,
      page_num: 1, // 页码
      remoteplace: 'txt.newclient.top',
      search_type: SearchType.SINGLE,
      searchid: generateId(37),
      ...param,
    },
  });
}

DoSearchForQQMusicDesktop.SearchType = SearchType;
