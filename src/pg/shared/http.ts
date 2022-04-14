interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

interface Params { [key: string]: string | string[]; }

const isLocal = window.location.href.match(/localhost/);
const isGitHub = window.location.href.match(/templarian\.github\.io/);

export async function get<T>(
  request: string,
  options: { [key: string]: Params } = {}
): Promise<T> {

  const { params = {} } = options;
  const keys = Object.keys(params);
  const p = `?${keys.map(k => {
    const value = params[k];
    if (value instanceof Array) {
      return `${k}=${value.join(',')}`;
    } else {
      return `${k}=${value}`;
    }
  }).join('&')}`;
  if (isLocal || isGitHub) {
    const mock = keys.map(k => {
      const value = params[k];
      if (value instanceof Array) {
        value.forEach((v, i) => {
          if (v.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
            value[i] = v.substr(0, 3);
          }
        });
        return `${k}/${value.join('-')}`;
      } else {
        return `${k}/${value}`;
      }
    }).join('/');
    if (mock) {
      request += `/_/${mock}`;
    }
    if (isGitHub) {
      request = request.replace(/^\//, '');
    }
  }
  const response: HttpResponse<T> = await fetch(
    (isLocal || isGitHub) ? `${request}/mock.get.json` :  `${request}${p === '?' ? '' : p}`
  );

  try {
    return response.json();
  } catch (ex) {}

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return Promise.reject();
}

export async function asset(
  request: string,
  options: { [key: string]: Params } = {}
): Promise<string> {

  const { params = {} } = options;
  const keys = Object.keys(params);
  const p = `?${keys.map(k => `${k}=${params[k]}`).join('&')}`;
  const response: HttpResponse<string> = await fetch(`${request}${p === '?' ? '' : p}`);

  try {
    return response.text();
  } catch (ex) {}

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return Promise.reject();
}

export const http = {
  get,
  asset
};