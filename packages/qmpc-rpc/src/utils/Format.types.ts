export enum Quality {
  Standard = 0, // 标准品质
  High = 1, // HQ 高品质
  SuperLossless = 2, // SQ 无损品质
  HiResLossless = 6, // Hi-Res 无损品质
  SurroundSound = 3, // 5.1 声道 FLAC [L R C LFE Ls Rs]
  // AI_v2 = 2, // 至臻音质 2.0，实际上请求的是 SQ 内容… 客户端音效?
  AISurroundSound = 10, // [AI] 至臻全景声
  AIMastering = 9, // [AI] 至臻母带
  DolbyAtoms = 7, // 杜比全景声

  Best = Quality.DolbyAtoms,

  UNUSED_4 = 4, // 未使用
  UNUSED_5 = 5, // 未使用
  UNUSED_8 = 8, // 未使用
  UNUSED_11 = 11, // 未使用
}

export enum QualityFlag {
  None = 0,
  MP3_128 = 1 << 0,
  MP3_320 = 1 << 2,
  OGG_192 = 1 << 1,
  OGG_96 = 1 << 7,
  APE = 1 << 3, // unused / deprecated?
  FLAC = 1 << 4,
  FLAC_Surround_6ch = 1 << 5,
  TRY = 1 << 6, // size_try
  FLAC_HiRes = 1 << 8,
  /**
   * @deprecated
   */
  AAC_96 = 1 << 9,
  DOLBY_ATOMS = 1 << 10,
  NEW_0 = 1 << 12, // 臻品母带
  NEW_1 = 1 << 13, // 臻品全景声
  NEW_2 = 1 << 14, // Premium Dolby 5.1，无法从界面选择。
  NEW_3 = 1 << 11, // HQ OGG
}

export enum Format {
  MP3_128 = 1,
  OGG_192 = 2,
  MP3_320_PLAIN = 3, // not encrypted
  L4 = 4, // Unused / deprecated? APE?
  FLAC_Standard = 5,
  FLAC_Surround_6ch = 6,
  L7 = 7, // Unused / deprecated?
  TRIAL_MP3_PLAIN = 8, // not encrypted
  OGG_96 = 9,
  FLAC_HiRes = 10,
  /**
   * @deprecated
   */
  AAC_96 = 11,
  MP4_DolbyAtoms = 12,
  OGG_320 = 13,
  FLAC_AIMastering = 14,
  FLAC_AISurroundSoundStereo = 15,
  FLAC_AISurroundSound6ch = 16, //
}
