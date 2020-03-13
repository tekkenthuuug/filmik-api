import fetch from 'node-fetch';

interface PropsfetchJSON {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
}

/** API that automaticly converts fetch response with .json */
export default async function fetchJSON({ url, method }: PropsfetchJSON) {
  return fetch(url, {
    method: method || 'get',
    headers: {
      'Content-type': 'application/json;charset=utf-8'
    }
  }).then((r) => r.json());
}
