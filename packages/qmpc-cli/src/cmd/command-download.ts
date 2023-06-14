import { Format, GetSongFileName, Quality, QualityFlag, SelectSongLevel } from '@jixun/qm-rpc';
import { createClient } from '../utils/createClient';
import axios from 'axios';
import { Parakeet, TransformResult, fetchParakeet } from '@jixun/libparakeet';
import { writeFileSync } from 'fs';

interface CommandDownloadOpts {
  consumeDownloadLimit: boolean;
  credential: string;
  fileId: string;
  musicId: string;
  output: string;
  fileQuality: QualityFlag;
  userQuality: Quality;
  format: Format;
  qmc2Seed: number | null;
}

export async function commandDownload({
  credential,
  fileId,
  musicId,
  fileQuality,
  userQuality,
  format,
  consumeDownloadLimit,
  output,
  qmc2Seed,
}: CommandDownloadOpts) {
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

  const parakeet = await fetchParakeet();

  let encryptedFile;

  for (let i = 1; i <= 3; i++) {
    // Don't rush...
    await new Promise((resolve) => setTimeout(resolve, 2000 * i));

    const resp = await axios.get<ArrayBuffer>(downloadURL, {
      responseType: 'arraybuffer',
      headers: {
        Accept: '*/*',
        'User-Agent': '2.13.0.00017',
      },
      validateStatus(status) {
        return true;
      },
    });

    if (resp.status === 200) {
      encryptedFile = resp.data;
      break;
    }
  }

  if (!encryptedFile) {
    throw new Error('could not fetch data');
  }

  let finalBlob: Blob;

  const textEncoder = new TextEncoder();
  if (qmc2Seed !== null) {
    const keyCrypto = parakeet.make.QMCv2KeyCrypto(qmc2Seed, '[[[[....,,,,]]]]', '[[[[00005555]]]]');
    const transformer = parakeet.make.QMCv2EKey(textEncoder.encode(ekey), keyCrypto);

    const reader = parakeet.make.Reader(encryptedFile);
    const sink = parakeet.make.WriterSink();
    const writer = sink.getWriter();

    const transformResult = transformer.Transform(writer, reader);
    if (transformResult !== TransformResult.OK) {
      throw new Error(`transform failed: ${TransformResult[transformResult]} (${transformResult})`);
    }

    // Cleanup
    reader.delete();
    writer.delete();

    finalBlob = sink.collectBlob();
  } else {
    const keyBufferLen = new Uint8Array(4);
    const view = new DataView(keyBufferLen.buffer);
    view.setUint32(0, ekey.length, true);
    finalBlob = new Blob([encryptedFile, textEncoder.encode(ekey), keyBufferLen]);
  }

  const finalData = await finalBlob.arrayBuffer();
  writeFileSync(output, new DataView(finalData));
}
