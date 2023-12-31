import { Table } from 'console-table-printer';

import { ToFileQualityFlags } from '@jixun/qmpc-rpc';
import { createClient } from '../utils/createClient';

export async function commandSearch(
  query: string,
  { page, credential, count, colWidth, display }: Record<string, string>
) {
  const width = colWidth === undefined ? undefined : parseInt(colWidth, 10);
  const client = createClient(credential);
  const searchResult = await client.Search({ query, page_num: parseInt(page, 10), num_per_page: parseInt(count, 10) });

  const data = [];
  const table = new Table({
    columns: [
      { name: 'seq', title: '序号' },
      { name: 'name', title: '名称', maxLen: width, alignment: 'center' },
      { name: 'singer', title: '歌手', maxLen: width, alignment: 'left' },
      { name: 'album', title: '专辑', maxLen: width, alignment: 'center' },
      { name: 'quality', title: '音质' },
      { name: 'file_id', title: '文件/file_id' },
      { name: 'music_id', title: '音乐/music_id' },
    ],
  });

  for (const [i, song] of searchResult.data.body.song.list.entries()) {
    const row = {
      seq: i + 1,
      name: song.name,
      album: song.album.name || '<无>',
      singer: song.singer.map((singer) => singer.name).join('、 '),
      file_id: song.file.media_mid,
      music_id: song.mid,
      quality: ToFileQualityFlags(song.file),
    };
    data.push(row);
    table.addRow(row);
  }
  if (display === 'table') {
    table.printTable();
  } else {
    process.stdout.write(JSON.stringify(data));
  }
}
