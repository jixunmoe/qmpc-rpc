export interface Album {
  id: number;
  mid: string;
  name: string;
  pmid: string;
  subtitle: string;
  time_public: string;
  title: string;
}

export interface SongAction {
  alert: number;
  icon2: number;
  icons: number;
  msgdown: number;
  msgfav: number;
  msgid: number;
  msgpay: number;
  msgshare: number;
  switch: number;
  switch2: number;
}

export interface SongFileInfo {
  b_30s: number;
  e_30s: number;
  hires_bitdepth: number;
  hires_sample: number;
  media_mid: string;
  size_128mp3: number;
  size_192aac: number;
  size_ogg?: number; // Fallback to size_192ogg
  size_192ogg: number;
  size_24aac: number;
  size_320?: number; // Fallback to size_320mp3
  size_320mp3: number;
  size_360ra: number[];
  size_48aac: number;
  size_96aac: number;
  size_96ogg: number;
  size_ape: number;
  size_dolby: number;
  size_dts: number;
  size_flac: number;
  size_hires: number;
  size_new: number[];
  size_try: number;
  try_begin: number;
  try_end: number;
  url: string;
}

export interface SongSinger {
  albumNum: number;
  concern_status: number;
  docid: string;
  mvNum: number;
  singerID: number;
  singerMID: string;
  singerName: string;
  singerName_hilight: string;
  singerPic: string;
  songNum: number;
}

export interface TrackVol {
  gain: number;
  lra: number;
  peak: number;
}

export interface Singer {
  id: number;
  mid: string;
  name: string;
  pmid: string;
  title: string;
  type: number;
  uin: number;
}

export interface PaymentInfo {
  pay_down: number;
  pay_month: number;
  pay_play: number;
  pay_status: number;
  price_album: number;
  price_track: number;
  time_free: number;
}

export interface MVInfo {
  id: number;
  name: string;
  title: string;
  vid: string;
  vt: number;
}
