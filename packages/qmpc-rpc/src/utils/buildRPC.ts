import type { QQMusicRPCObject } from '../api/RPC';

export function buildRPC(rpcObjects: QQMusicRPCObject<unknown>[]) {
  const reqNames: string[] = [];

  const payload = Object.create(null);
  for (const rpcObject of rpcObjects) {
    let i = 1;
    let reqName = rpcObject.module;
    while (reqNames.includes(reqName)) {
      reqName = `${rpcObject.module}_${i}`;
      i++;
    }
    reqNames.push(reqName);
    payload[reqName] = rpcObject;
  }

  return [reqNames, payload];
}
