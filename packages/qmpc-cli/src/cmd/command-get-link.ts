import { printTable } from 'console-table-printer';
import { Format, GetSongFileName, Quality, QualityFlag, SelectSongLevel } from '@jixun/qmpc-rpc';
import { createClient } from '../utils/createClient';

interface CommandGetLinkOpts {
  consumeDownloadLimit: boolean;
  credential: string;
  display: string;
  fileId: string;
  musicId: string;
  fileQuality: QualityFlag;
  userQuality: Quality;
  format: Format;
}

export async function commandGetLink({
  credential,
  display,
  fileId,
  musicId,
  fileQuality,
  userQuality,
  format,
  consumeDownloadLimit,
}: CommandGetLinkOpts) {
  const client = createClient(credential);

  // 选择音质
  if (!format) {
    // MP3 没有对应的加密资源，接口要求 "必须请求加密文件"。
    const plainFormats = new Set([Format.MP3_320_PLAIN, Format.TRIAL_MP3_PLAIN, Format.MP3_128]);
    format = SelectSongLevel(userQuality, fileQuality, (format) => !plainFormats.has(format));
  }

  const param = {
    filename: [GetSongFileName(fileId, format)],
    musicfile: [GetSongFileName(musicId, format)],
    songmid: [musicId],
  };
  const streamInfo = await (consumeDownloadLimit ? client.GetDownloadURL(param) : client.GetStreamPath(param));

  if (streamInfo.data.retcode !== 0) {
    process.stderr.write(`请求资源出错: ${streamInfo.data.retcode} - ${streamInfo.data.msg}\n`);
    process.stderr.write(JSON.stringify(streamInfo, null, 2));
    return 1;
  }

  const cdnConfig = await client.FetchCDNConfig();
  const { IPv4 } = client.FetchCDNConfig.IPStack;
  // 查找第一个不使用 IP 做域名的 CDN 地址
  let cdn = cdnConfig.data.sipinfo.find(
    (info) => (info.ipstack & IPv4) === IPv4 && !/http:\/\/(\d+\.){3}\d+\//.test(info.cdn)
  );
  const cdnURL = cdn?.cdn || cdnConfig.data.sip[0]!;
  const downloadInfo = streamInfo.data.midurlinfo[0];
  const { ekey, purl } = downloadInfo;
  const downloadURL = cdnURL + purl;
  if (display === 'table') {
    printTable([
      { field: 'url', text: downloadURL },
      { field: 'ekey', text: ekey },
    ]);
  } else {
    process.stdout.write(JSON.stringify({ url: downloadURL, ekey }));
  }
}
