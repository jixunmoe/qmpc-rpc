import { Format, QualityFlag, QualityFlagToFormat } from '@jixun/qm-rpc';
import { Table } from 'console-table-printer';

const qualityNames = new Map<QualityFlag, string>([
  [QualityFlag.MP3_128, 'MP3 - SD (128kbps)'],
  [QualityFlag.MP3_320, 'MP3 - HQ (320kbps)'],
  [QualityFlag.OGG_192, 'OGG - HQ (192kbps)'],
  [QualityFlag.OGG_96, 'OGG - SD (96kbps)'],
  [QualityFlag.APE, 'APE Lossless'],
  [QualityFlag.FLAC, 'FLAC'],
  [QualityFlag.FLAC_Surround_6ch, 'FLAC - 5.1 环绕音'],
  [QualityFlag.TRY, '试听 (低音质)?'],
  [QualityFlag.FLAC_HiRes, 'FLAC (SQ)'],
  [QualityFlag.AAC_96, 'AAC (96kbps) / 已弃用'],
  [QualityFlag.DOLBY_ATOMS, 'MP4 - 杜比环绕音'],
  [QualityFlag.NEW_0, 'FLAC - AI 臻品母带'],
  [QualityFlag.NEW_1, 'FLAC - AI 臻品全景声 (双声道)'],
  [QualityFlag.NEW_2, 'FLAC - AI 臻品全景声 (5.1)'],
  [QualityFlag.NEW_3, 'OGG - HQ (320kbps)'],
]);

export function commandExplainQuality(quality: QualityFlag, { display }: Record<string, string>) {
  const data: { value: number; format: string; quality: string; description: string }[] = [];
  let iterator = 1;
  while (iterator <= quality) {
    if (iterator & quality) {
      const description = qualityNames.get(iterator) || '未知格式';
      data.push({
        value: iterator,
        format: Format[QualityFlagToFormat(iterator)],
        quality: QualityFlag[iterator],
        description,
      });
    }
    iterator *= 2;
  }

  if (display === 'table') {
    const table = new Table({
      columns: [
        { name: 'fmt_value', title: '格式序号' },
        { name: 'format', title: '格式 ID (Format)' },
        { name: 'description', title: '描述' },

        { name: 'quality', title: '音质名' },
        { name: 'value', title: '音质值' },
        { name: 'hex', title: '音质值' },
      ],
      disabledColumns: ['value'],
    });

    console.log('该音质值包含下述 %d 种音质:', data.length);
    for (const { value, format, quality, description } of data) {
      let color = '';
      if (description.includes(' AI ')) {
        color = 'yellow';
      } else if (/FLAC|APE|HQ|MP4/.test(description)) {
        color = 'green';
      } else if (/\b96kbps|试听/.test(description)) {
        color = 'red';
      }

      let hex = value.toString(16);

      table.addRow(
        {
          value,
          format,
          quality,
          fmt_value: Format[format as keyof typeof Format],
          hex: '0x' + hex.padStart(hex.length + (hex.length % 2), '0'),
          description,
        },
        { color }
      );
    }
    table.printTable();
  } else {
    console.log(JSON.stringify(data));
  }
}
