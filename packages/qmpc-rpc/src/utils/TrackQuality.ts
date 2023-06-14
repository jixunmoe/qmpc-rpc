import { SongFileInfo } from '../api/common.types';
import { Format, Quality, QualityFlag } from './Format.types';

export class CouldNotFindRequestedFormatError extends Error {}
export class CouldNotFindRequestedQuality extends Error {
  constructor(quality: unknown) {
    super();
    this.message = `Unknown Quality ${quality}`;
  }
}

const songLevels: { quality: Quality; test: QualityFlag; level: Format }[] = [
  { quality: Quality.DolbyAtoms, test: QualityFlag.DOLBY_ATOMS, level: Format.MP4_DolbyAtoms },
  { quality: Quality.AIMastering, test: QualityFlag.NEW_0, level: Format.FLAC_AIMastering },
  { quality: Quality.AISurroundSound, test: QualityFlag.NEW_2, level: Format.FLAC_AISurroundSound6ch },
  { quality: Quality.AISurroundSound, test: QualityFlag.NEW_1, level: Format.FLAC_AISurroundSoundStereo },
  { quality: Quality.HiResLossless, test: QualityFlag.FLAC_HiRes, level: Format.FLAC_HiRes },
  { quality: Quality.SurroundSound, test: QualityFlag.FLAC_Surround_6ch, level: Format.FLAC_Surround_6ch },
  { quality: Quality.SuperLossless, test: QualityFlag.FLAC, level: Format.FLAC_Standard },
  { quality: Quality.High, test: QualityFlag.NEW_3, level: Format.OGG_320 },
  { quality: Quality.High, test: QualityFlag.OGG_192, level: Format.OGG_192 },
  { quality: Quality.High, test: QualityFlag.MP3_320, level: Format.MP3_320_PLAIN },
  { quality: Quality.Standard, test: QualityFlag.OGG_96, level: Format.OGG_96 },
  { quality: Quality.Standard, test: QualityFlag.MP3_128, level: Format.MP3_128 },
  { quality: Quality.Standard, test: QualityFlag.AAC_96, level: Format.AAC_96 },
  { quality: Quality.Standard, test: QualityFlag.TRY, level: Format.TRIAL_MP3_PLAIN },
];

export function SelectSongLevel(
  target: Quality,
  fileQualities: QualityFlag,
  filter: (format: Format, quality: QualityFlag) => boolean = () => true
): Format {
  let idxQuality = songLevels.findIndex((level) => level.quality === target);
  if (idxQuality === -1) {
    idxQuality = 0; // Requested quality not found, lookup from highest quality.
  }

  const level = songLevels
    .slice(idxQuality)
    .find((level) => (level.test & fileQualities) !== 0 && filter(level.level, level.test));
  if (!level) {
    throw new CouldNotFindRequestedFormatError();
  }
  return level.level;
}

export function SelectSongLevelExact(
  target: Quality,
  fileQualities: QualityFlag,
  filter: (format: Format, quality: QualityFlag) => boolean = () => true
): Format {
  const level = songLevels.find(
    (level) => level.quality === target && (level.test & fileQualities) !== 0 && filter(level.level, level.test)
  );
  if (!level) {
    throw new CouldNotFindRequestedFormatError();
  }
  return level.level;
}

const qualityMapping: { field: keyof SongFileInfo; flag: QualityFlag }[] = [
  { field: 'size_128mp3', flag: QualityFlag.MP3_128 },
  { field: 'size_320mp3', flag: QualityFlag.MP3_320 },
  { field: 'size_320', flag: QualityFlag.MP3_320 },
  { field: 'size_96ogg', flag: QualityFlag.OGG_96 },
  { field: 'size_ape', flag: QualityFlag.APE }, // probably unused
  { field: 'size_flac', flag: QualityFlag.FLAC },
  { field: 'size_dts', flag: QualityFlag.FLAC_Surround_6ch },
  { field: 'size_try', flag: QualityFlag.TRY },
  { field: 'size_hires', flag: QualityFlag.FLAC_HiRes },
  { field: 'size_dolby', flag: QualityFlag.DOLBY_ATOMS },
];

export function ToFileQualityFlags(fileInfo: SongFileInfo): QualityFlag {
  let result: QualityFlag = 0;

  for (const { field, flag } of qualityMapping) {
    const size = fileInfo[field];
    if (typeof size === 'number' && size > 0) {
      result |= flag;
    }
  }

  const EXPECTED_NEW_SIZE = 4;
  if (fileInfo.size_new && fileInfo.size_new.length >= EXPECTED_NEW_SIZE) {
    const newSizes = fileInfo.size_new.slice(0, EXPECTED_NEW_SIZE);
    const flags = [QualityFlag.NEW_0, QualityFlag.NEW_1, QualityFlag.NEW_2, QualityFlag.NEW_3];

    for (let i = 0; i < EXPECTED_NEW_SIZE; i++) {
      if (typeof newSizes[i] === 'number' && newSizes[i] > 0) {
        result |= flags[i];
      }
    }
  }

  return result;
}

const qualityFlagToFormatMapping = new Map([
  [QualityFlag.DOLBY_ATOMS, Format.MP4_DolbyAtoms],
  [QualityFlag.NEW_0, Format.FLAC_AIMastering],
  [QualityFlag.NEW_1, Format.FLAC_AISurroundSoundStereo],
  [QualityFlag.NEW_2, Format.FLAC_AISurroundSound6ch],
  [QualityFlag.FLAC_HiRes, Format.FLAC_HiRes],
  [QualityFlag.FLAC_Surround_6ch, Format.FLAC_Surround_6ch],
  [QualityFlag.FLAC, Format.FLAC_Standard],
  [QualityFlag.NEW_3, Format.OGG_320],
  [QualityFlag.OGG_192, Format.OGG_192],
  [QualityFlag.MP3_320, Format.MP3_320_PLAIN],
  [QualityFlag.OGG_96, Format.OGG_96],
  [QualityFlag.MP3_128, Format.MP3_128],
  [QualityFlag.AAC_96, Format.AAC_96],
  [QualityFlag.TRY, Format.TRIAL_MP3_PLAIN],
]);

export function QualityFlagToFormat(quality: QualityFlag): Format {
  const format = qualityFlagToFormatMapping.get(quality);
  if (!format) {
    throw new CouldNotFindRequestedQuality(quality);
  }
  return format;
}
