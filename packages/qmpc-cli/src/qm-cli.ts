import { Command, Option } from 'commander';
import { readJson } from './utils/readJSON';
import { Format, Quality } from '@jixun/qm-rpc';

import { commandSearch } from './cmd/command-search';
import { commandExplainQuality } from './cmd/command-explain-quality';
import { commandGetLink } from './cmd/command-get-link';
import { commandDownload } from './cmd/command-download';

const pkgJSON = readJson<{ version: string }>(__dirname + '/../package.json');
const program = new Command();

const optDisplay = new Option('--display [format]', '输出显示格式').choices(['json', 'table']).default('table');
const optCredentialPath = new Option('-c, --credential <path>', '认证信息 JSON 文件。').default('credentials.json');

program
  .name('qqmusic-cli')
  .description('一个基于命令行的 QQMusic 客户端协议的客户端')
  .version(pkgJSON?.version || '<unknown>');

program
  .command('search')
  .description('利用关键词进行检索')
  .argument('<query>', '检索关键字')
  .addOption(optDisplay)
  .addOption(optCredentialPath)
  .option('-p, --page <page>', '页码', '1')
  .option('-n, --count <count>', '每页数量', '20')
  .option('-w, --col-width <width>', '表格宽度，0 表示不限制。', '8')
  .action((query, opts) => {
    commandSearch(query, opts).catch(console.error);
  });

program
  .command('explain-quality')
  .description('解释 quality 字段')
  .addOption(optDisplay)
  .argument('<quality>', 'quality 字段值')
  .action((quality, opts) => {
    commandExplainQuality(parseInt(quality), opts);
  });

program
  .command('get-link')
  .description('获取下载地址以及解密用的 EKey')
  .addOption(optDisplay)
  .addOption(optCredentialPath)
  .option('-d, --consume-download-limit', '是否消耗当前下载限额。不指定则调用串流 API。', false)
  .option('--no-consume-download-limit')
  .requiredOption('-f, --file-id <id>', 'file_id 值')
  .requiredOption('-m, --music-id <id>', 'music_id 值')
  .option(
    '-q, --file-quality [文件可用音质]',
    '检索时得到的文件可用音质值。使用时必须与<--user-quality>同时指定，且不得与<--format>同时使用。'
  )
  .addOption(
    new Option(
      '-u, --user-quality [格式]',
      '指定音质范围，将下载最高该音质。使用时必须与<--file-quality>同时指定，且不得与<--format>同时使用。'
    ).choices(Object.keys(Quality).filter((x) => !x.startsWith('UNUSED')))
  )
  .addOption(
    new Option('-t, --format [格式]', '下载指定音质。不得与<文件可用音质>与<下载音质>同时使用。').choices(
      Object.keys(Format).filter((x) => !x.endsWith('PLAIN'))
    )
  )
  .action(
    ({
      credential,
      display,
      fileId,
      musicId,
      fileQuality,
      userQuality,
      format,
      consumeDownloadLimit,
    }: Record<string, string>) => {
      if (Boolean(fileQuality && userQuality) && format) {
        console.error('错误: [fileQuality, userQuality] 与 [format] 两个组合只能指定一个');
        return;
      } else if (!(fileQuality && userQuality) && !format) {
        console.error('错误: [fileQuality, userQuality] 与 [format] 必须提供一个组合');
        return;
      }

      commandGetLink({
        credential,
        display,
        fileId,
        musicId,
        consumeDownloadLimit: String(consumeDownloadLimit ?? 'false') === 'true',
        fileQuality: parseInt(fileQuality, 10),
        userQuality: Object.prototype.hasOwnProperty.call(Quality, userQuality)
          ? Quality[userQuality as keyof typeof Quality]
          : parseInt(userQuality, 10),
        format: Object.prototype.hasOwnProperty.call(Format, format)
          ? Format[format as keyof typeof Format]
          : parseInt(format, 10),
      }).catch(console.error);
    }
  );

program
  .command('download')
  .description('下载并解密文件')
  .addOption(optCredentialPath)
  .option('-d, --consume-download-limit', '是否消耗当前下载限额。默认为消耗。', true)
  .option('--no-consume-download-limit')
  .requiredOption('-f, --file-id <id>', 'file_id 值')
  .requiredOption('-m, --music-id <id>', 'music_id 值')
  .requiredOption('-o, --output <path>', '输出路径。')
  .option(
    '-q, --file-quality [文件可用音质]',
    '检索时得到的文件可用音质值。使用时必须与<--user-quality>同时指定，且不得与<--format>同时使用。'
  )
  .addOption(
    new Option(
      '-u, --user-quality [格式]',
      '指定音质范围，将下载最高该音质。使用时必须与<--file-quality>同时指定，且不得与<--format>同时使用。'
    ).choices(Object.keys(Quality).filter((x) => !x.startsWith('UNUSED')))
  )
  .addOption(
    new Option('-t, --format [格式]', '下载指定音质。不得与<文件可用音质>与<下载音质>同时使用。').choices(
      Object.keys(Format).filter((x) => !x.endsWith('PLAIN'))
    )
  )
  .option('--qmc2-seed [seed]', '用于生成 ekey 解密密钥的 seed。若不提供则不进行解密。')
  .action(
    ({
      credential,
      fileId,
      musicId,
      fileQuality,
      userQuality,
      format,
      consumeDownloadLimit,
      output,
      qmc2Seed,
    }: Record<string, string>) => {
      if (Boolean(fileQuality && userQuality) && format) {
        console.error('错误: [fileQuality, userQuality] 与 [format] 两个组合只能指定一个');
        return;
      } else if (!(fileQuality && userQuality) && !format) {
        console.error('错误: [fileQuality, userQuality] 与 [format] 必须提供一个组合');
        return;
      }

      commandDownload({
        credential,
        fileId,
        musicId,
        consumeDownloadLimit: consumeDownloadLimit as unknown as boolean,
        output,
        qmc2Seed: qmc2Seed === undefined ? null : parseInt(qmc2Seed, 10),
        fileQuality: parseInt(fileQuality, 10),
        userQuality: Object.prototype.hasOwnProperty.call(Quality, userQuality)
          ? Quality[userQuality as keyof typeof Quality]
          : parseInt(userQuality, 10),
        format: Object.prototype.hasOwnProperty.call(Format, format)
          ? Format[format as keyof typeof Format]
          : parseInt(format, 10),
      }).catch(console.error);
    }
  );

program.parse();
