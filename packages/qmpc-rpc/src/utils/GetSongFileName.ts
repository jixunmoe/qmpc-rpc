import { Format } from './Format.types';

interface SongFileOpts {
  encrypted?: boolean; // default = true
  a3?: number; // hardcode to 1, unknown
}

const formatMap = {
  plain: new Map<Format, [string, string]>([
    [Format.MP3_128, ['M500', '.mp3']],
    [Format.OGG_192, ['O600', '.ogg']],
    [Format.MP3_320_PLAIN, ['M800', '.mp3']],
    [Format.L4, ['F000', '.flac']], // Same as Level 5
    [Format.FLAC_Standard, ['F000', '.flac']],
    [Format.FLAC_Surround_6ch, ['D00A', '.flac']],
    // [Format.L7, ['M500', '.mp3']], // Fallback to default
    [Format.TRIAL_MP3_PLAIN, ['RS02', '.mp3']],
    [Format.OGG_96, ['O400', '.ogg']],
    [Format.FLAC_HiRes, ['RS01', '.flac']],
    // [Format.AAC_96, ['M500', '.mp3']], // Fallback to default
    [Format.MP4_DolbyAtoms, ['D001', '.mp4']],
    [Format.OGG_320, ['O800', '.ogg']],
    [Format.FLAC_AIMastering, ['AI00', '.flac']],
    [Format.FLAC_AISurroundSoundStereo, ['Q000', '.flac']], // Premium-Atmos-2
    [Format.FLAC_AISurroundSound6ch, ['Q001', '.flac']], // Premium-Atmos-51 - L R C LFE Ls Rs
  ]),
  encrypted: new Map<Format, [string, string]>([
    [Format.OGG_192, ['O6M0', '.mgg']],
    [Format.L4, ['F0M0', '.mflac']], // Same as Level 5
    [Format.FLAC_Standard, ['F0M0', '.mflac']],
    [Format.FLAC_Surround_6ch, ['D0MA', '.mflac']],
    // [Format.L7, ['O4M0', '.mgg']], // Fallback to default
    [Format.OGG_96, ['O4M0', '.mgg']],
    [Format.FLAC_HiRes, ['RSM1', '.mflac']],
    // [Format.AAC_96, ['O4M0', '.mgg']], // Fallback to default
    [Format.MP4_DolbyAtoms, ['D0M1', '.mmp4']],
    [Format.OGG_320, ['O8M0', '.mgg']],
    [Format.FLAC_AIMastering, ['AIM0', '.mflac']],
    [Format.FLAC_AISurroundSoundStereo, ['Q0M0', '.mflac']],
    [Format.FLAC_AISurroundSound6ch, ['Q0M1', '.mflac']],
  ]),
  // Low complexity version? Probably not used.
  a3_111: new Map<Format, [string, string]>([
    [Format.MP3_128, ['M5L0', '.mp3']],
    [Format.OGG_192, ['O6L0', '.ogg']],
    [Format.MP3_320_PLAIN, ['M8L0', '.mp3']],
    [Format.L4, ['F0L0', '.flac']], // Same as Level 5
    [Format.FLAC_Standard, ['F0L0', '.flac']],
    [Format.OGG_96, ['M500', '.mp3']], // strange case
  ]),
};

function getFormat(format: Format, keys: (keyof typeof formatMap)[], fallback: [string, string]): [string, string] {
  for (const key of keys) {
    const value = formatMap[key].get(format);
    if (value) {
      return value;
    }
  }

  return fallback;
}

function getFormatA3_113(format: Format) {
  switch (format) {
    case Format.MP3_320_PLAIN:
      return 'KC80';
    case Format.AAC_96:
      return 'KC40';
    default:
      return 'KC50';
  }
}

export function GetSongFileName(mediaId: string, format: Format, opts: SongFileOpts = {}): string {
  const { a3 = 1, encrypted = true } = opts;

  let prefix = encrypted ? 'O4M0' : 'M500';
  let suffix = encrypted ? '.mgg' : '.mp3';

  if (a3 === 1 || a3 === 2) {
    [prefix, suffix] = getFormat(format, ['encrypted', 'plain'], [prefix, suffix]);
  } else if (a3 === 111) {
    [prefix, suffix] = getFormat(format, ['encrypted', 'a3_111', 'plain'], [prefix, suffix]);
  } else if (a3 === 112) {
    prefix = 'R500';
    suffix = '.mp3';
  } else if (a3 === 113) {
    prefix = getFormatA3_113(format);
    suffix = '.tkm';
  }

  return prefix + mediaId + suffix;
}
