import type { QQMusicRPCRequest, RPCResponseAlt1 } from './RPC';

export type QQMusicGetAlbumDetailRequest = QQMusicRPCRequest<
  'GetAlbumDetail',
  'music.musichallAlbum.AlbumInfoServer',
  {
    albumMid: string;
  }
>;
export type QQMusicGetAlbumDetailResponse = RPCResponseAlt1<GetAlbumDetailBody>;

interface GetAlbumDetailBody {
  basicInfo: IBasicInfo;
  company: AlbumCompany;
  singer: { singerList: AlbumSinger[] };
}

interface IBasicInfo {
  LanRenBookUrl: string;
  adJson: string;
  adStatus: number;
  albumID: number;
  albumMid: string;
  albumName: string;
  albumTag3: number;
  albumType: string;
  album_right: number;
  awards: unknown[];
  color: number;
  desc: string;
  encourageVideoStatus: number;
  fpaymid: string;
  genre: string;
  genreURL: string;
  genres: { name: string; url: string }[];
  lanURL: string;
  language: string;
  modifyTime: number;
  operateStatus: number;
  pmid: string;
  publishDate: string;
  recordNum: string;
  topListContent: string;
  topListSchema: string;
  tranName: string;
  type: number;
  vid: string;
  wikiurl: string;
}

interface AlbumSinger {
  indentity: number;
  instrument: string;
  mid: string;
  name: string;
  pmid: string;
  role: string;
  singerID: number;
  singerType: number;
  transName: string;
  type: number;
}

interface AlbumCompany {
  ID: number;
  brief: string;
  headPic: string;
  isShow: number; // bool
  name: string;
}
