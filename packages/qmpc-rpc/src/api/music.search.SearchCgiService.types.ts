import type { ListOf, QQMusicRPCRequest, RPCResponse } from './RPC';
import { Album, SongSinger, SongAction, SongFileInfo, MVInfo, PaymentInfo, Singer, TrackVol } from './common.types';

export enum SearchType {
  /**
   * 单曲
   */
  SINGLE = 0,
  /**
   * 歌手
   */
  ARTIST = 1,
  /**
   * 专辑
   */
  ALBUM = 2,
  /**
   * 歌单
   */
  PLAYLIST = 3,
  /**
   * 视频
   */
  VIDEO = 4,
  /**
   * 歌词
   */
  LYRICS = 7,
  /**
   * 用户
   */
  USER = 8,
}

export type QQMusicSearchRequest = QQMusicRPCRequest<
  'DoSearchForQQMusicDesktop',
  'music.search.SearchCgiService',
  {
    grp: number;
    num_per_page: number; // 每页数量，默认应为 40
    page_num: number; // 页码
    query: string; // 关键字
    remoteplace: string; // "txt.newclient.top"
    search_type: SearchType;
    searchid: string; // 随机字符串，37 个字符
  }
>;
export type QQMusicSearchResponse = RPCResponse<SearchResponseBody>;

export interface SearchResponseBody {
  album: ListOf<unknown>;
  gedantip: { tab: number; tip: string };
  mv: ListOf<unknown>;
  qc: unknown[];
  singer: ListOf<SongSinger>;
  song: ListOf<SingleSong>;
  songlist: ListOf<unknown>;
  user: ListOf<unknown>;
  zhida: ListOf<unknown>;
}

export interface SingleSong {
  act?: number;
  action: SongAction;
  album: Album & ListOf<unknown>;
  bpm: number;
  content: string;
  desc: string;
  desc_hilight: string;
  docid: string;
  eq: number;
  es: string;
  file: SongFileInfo;
  fnote: number;
  genre: number;
  grp: SingleSong[];
  hotness: HotnessInfo;
  href3: string;
  id: number;
  index_album: number;
  index_cd: number;
  interval: number;
  isonly: number;
  ksong: { id: number; mid: string };
  label: string;
  language: number;
  lyric: string;
  lyric_hilight: string;
  mid: string;
  mv: MVInfo & ListOf<unknown>;
  name: string;
  newStatus: number;
  ov: number;
  pay: PaymentInfo;
  protect: number;
  sa: number;
  singer: Singer[];
  status: number;
  subtitle: string;
  tag: number;
  tid: number;
  time_public: string;
  title: string;
  title_hilight: string;
  type: number;
  url: string;
  version: number;
  volume: TrackVol;
  vs: string[];
}

export interface HotnessInfo {
  desc: string;
  icon_url: string;
  jump_type: number;
  jump_url: string;
}
