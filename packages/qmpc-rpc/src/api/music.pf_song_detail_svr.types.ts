import type { QQMusicRPCRequest, RPCResponseAlt1 } from './RPC';
import { PaymentInfo, MVInfo, Singer, TrackVol, Album, SongAction, SongFileInfo } from './common.types';

export type QQMusicGetSongDetailRequest = QQMusicRPCRequest<
  'get_song_detail',
  'music.pf_song_detail_svr',
  {
    song_id: null;
    song_mid: string;
    song_type: 0; // ??
  }
>;
export type QQMusicGetSongDetailResponse = RPCResponseAlt1<SongDetailData>;

interface SongDetailData {
  extras: ExtraDetail;
  info: SongDetailInfo[];
  track_info: TrackInfo;
}
interface ExtraDetail {
  from: string;
  name: string;
  subtitle: string;
  transname: string;
  wikiurl: string;
}
interface SongDetailInfo {
  content: IContentItem[];
  more: number;
  pos: number;
  selected: string;
  title: string;
  type: string;
  use_platform: number;
}
interface IContentItem {
  author: string;
  id: number;
  is_parent: number;
  jumpurl: string;
  mid: string;
  ori_picurl: string;
  picurl: string;
  read_cnt: number;
  show_type: number;
  type: number;
  value: string;
}
interface TrackInfo {
  action: SongAction;
  album: Album;
  bpm: number;
  data_type: number;
  es: string;
  file: SongFileInfo;
  fnote: number;
  genre: number;
  id: number;
  index_album: number;
  index_cd: number;
  interval: number;
  isonly: number;
  ksong: { id: number; mid: string };
  label: string;
  language: number;
  mid: string;
  modify_stamp: number;
  mv: MVInfo;
  name: string;
  ov: number;
  pay: PaymentInfo;
  pingpong: string;
  ppurl: string;
  sa: number;
  singer: Singer[];
  status: number;
  subtitle: string;
  tid: number;
  time_public: string;
  title: string;
  trace: string;
  type: number;
  url: string;
  version: number;
  vi: number[];
  volume: TrackVol;
  vs: string[];
}
