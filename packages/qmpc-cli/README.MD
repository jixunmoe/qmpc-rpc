# QMPC RPC 协议（CLI）

对 `@jixun/qmpc-rpc` 的简易包装，做示例用。

## 安装

可以安装到全局，或本地安装（推荐）。

全局安装：

```sh
npm i -g @jixun/qmpc-cli
```

本地安装：

```sh
# 首先找一个目录
mkdir qmpc && cd qmpc
npm init -y
npm i @jixun/qmpc-cli

# 之后使用 `npx qmpc-cli` 来执行：
npx qmpc-cli help
```

## CLI 使用

所有接口（除了下载）都可以添加 `--display json` 来获取 JSON 信息，可以用来自动化（虽然直接用这个库会更方便）。

### 认证文件

部分接口需要认证，因此你需要在 PC 客户端进行登录、抓包操作。

抓包并查找地址含有 `/cgi-bin/musics.fcg?pcachetime=` 的 `POST` 请求：

- `cookie` 项目填写请求头的 `Cookie` 头内容。
- `session` 项目为请求包的 `comm` 对象内容，对照着模板填写或整个覆盖即可。

```js
{
    "cookie": "抓包获取",
    "session": {
        "_channelid": "20",
        // ... 省略不计 ...
        "wid": "9999999999999999999"
    }
}
```

程序会默认尝试读取“运行目录”下的 `credentials.json` 文件

### 查看帮助

```sh
npx qmpc-cli -h
```

### 检索

```sh
npx qmpc-cli search -n 2 富士山下
```

> | 序号 | 名称     | 歌手   |           专辑           |  音质   |     文件/file_id |    音乐/music_id |
> | ---: | -------- | ------ | :----------------------: | :-----: | ---------------: | ---------------: |
> |    1 | 富士山下 | 陈奕迅 | What's Going<br/> On...? | `14485` | `0032PB2V2QYWSC` | `003aAPj81VWrbL` |
> |    2 | 富士山下 | 余超颖 |           <无>           | `14485` | `002rG2i714bTsL` | `0026ubWc4PrBUh` |

### 解释音质

```sh
npx qmpc-cli explain-quality 14485
```

> 该音质值包含下述 8 种音质:
>
> | 格式序号 |       格式 ID (Format) |                          描述 |    音质名 |  音质值  |
> | -------: | ---------------------: | ----------------------------: | --------: | :------: |
> |        1 |              `MP3_128` |            MP3 - SD (128kbps) | `MP3_128` |  `0x01`  |
> |        3 |        `MP3_320_PLAIN` |            MP3 - HQ (320kbps) | `MP3_320` |  `0x04`  |
> |        5 |        `FLAC_Standard` |                          FLAC |    `FLAC` |  `0x10`  |
> |        8 |      `TRIAL_MP3_PLAIN` |                试听 (低音质)? |     `TRY` |  `0x40`  |
> |        9 |               `OGG_96` |             OGG - SD (96kbps) |  `OGG_96` |  `0x80`  |
> |       13 |              `OGG_320` |            OGG - HQ (320kbps) |   `NEW_3` | `0x0800` |
> |       14 |     `FLAC_AIMastering` |            FLAC - AI 臻品母带 |   `NEW_0` | `0x1000` |
> |       15 | `FLAC_AISurroundSound` | FLAC - AI 臻品全景声 (双声道) |   `NEW_1` | `0x2000` |

其中绿色表示高音质，黄色表示 AI 拉升，红色表示低音质。其它音质无特殊选项。

### 获取下载地址以及解密链接

⚠️ 注意：

- 该接口需要认证（如会员专属内容）。
- 客户端不会检查你是否有对应的资源访问权限。 \
     尝试越权获取可能会导致账号或 IP 被封锁。

指定 `--user-quality Best`，会自动选择最高可用音质（臻品全景声）。

```sh
npx qmpc-cli get-link -f 0032PB2V2QYWSC -m 003aAPj81VWrbL --file-quality 14485 --user-quality Best --display json
```

如果需要指定其中一个音质，如 `FLAC`，参数更改如下：

```sh
npx qmpc-cli get-link -f 0032PB2V2QYWSC -m 003aAPj81VWrbL --format FLAC_Standard --display json
```

返回值 (JSON 形式):

```js
// FLAC (臻品全景声)
{"url":"http://cdn_host/AIM0xxxxxxxxxxxxxx.mflac?guid=00000000000000000000000000000000&vkey=FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF&uin=10000&fromtag=12345","ekey":"U0F4...."}

// FLAC (SQ 无损)
{"url":"http://cdn_host/F0M0xxxxxxxxxxxxxx.mflac?guid=00000000000000000000000000000000&vkey=FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF&uin=20000&fromtag=54321","ekey":"ZnFi...."}
```

⚠️ 注意：

- 访问获取到的链接不需要携带 `Cookie` 获其它信息。
- 文件下载后你需要手动使用获取到的 EKey 对文件进行解密。

### 下载文件

参考 `get-link` 的参数，额外多了下述参数：

- `-o, --output` - 输出文件路径。
- `--consume-download-limit, --no-consume-download-limit` - 使用串流或下载接口，后者会消耗下载次数。默认为下载接口。
- `--qmc2-seed` - 用于解密 `EKey` 的种子。不填写则获得加密后的文件。

```sh
npx qmpc-cli download -f 0032PB2V2QYWSC -m 003aAPj81VWrbL --format FLAC_Standard --qmc2-seed 0 -o /tmp/富士山下.flac
npx qmpc-cli download -f 0032PB2V2QYWSC -m 003aAPj81VWrbL --format FLAC_Standard -o /tmp/富士山下.mflac
```
