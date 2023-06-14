import type { QQMusicSession } from '@jixun/qmpc-sign';

export interface QQMusicRPCRequest<METHOD, MODULE, P> {
  method: METHOD;
  module: MODULE;
  param: P;
}
export type QQMusicRPCObject<P> = QQMusicRPCRequest<string, string, P>;
export type RPCRequestWithRequired<
  Request extends { param: Record<string, unknown> },
  RequiredKeys extends keyof Request['param']
> = Partial<Request['param']> & Pick<Request['param'], RequiredKeys>;

export interface IQQMusicRPC {
  session: QQMusicSession;
  cookie?: string;
  headers: Record<string, string>;

  doRPC<R = Record<string, unknown>>(rpcObjects: QQMusicRPCObject<unknown>): Promise<R>;
  doRPC<R = Record<string, unknown>>(rpcObjects: QQMusicRPCObject<unknown>[]): Promise<R[]>;
}

export interface RPCResponse<T> {
  code: number;
  data: {
    code: number;
    body: T;
    feedbackURL: string;
    meta: ResponseMeta;
    ver: number;
  };
}

export interface RPCResponseAlt1<T> {
  code: number;
  data: T;
}

export interface ResponseMeta {
  cid: string;
  curpage: number;
  dir: string;
  display_order: unknown[];
  ein: number;
  estimate_sum: number;
  expid: string;
  is_filter: number;
  next_page_start: unknown;
  nextpage: number;
  perpage: number;
  query: string;
  result_trustworthy: number;
  ret: number;
  safetyType: number;
  safetyUrl: string;
  searchid: string;
  sid: string;
  sin: number;
  sum: number;
  tab_list: unknown[];
  uid: string;
  v: number;
}

export type ListOf<T = unknown> = { list: T[] };
