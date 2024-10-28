
export const r = async (params) => {
 
  if (params.data && params.method === 'GET') {
    params.data = Object.fromEntries(
      Object.entries(params.data).filter(([_, v]) => v != null),
    );
  }
  const headers = new Headers({
    "ngrok-skip-browser-warning" :  true,
    "Content-Type": "application/json"
  })
  const requestInit= {
    method: params.method.toUpperCase(),
    headers
  };

  if (params.data && ['POST', 'PUT', 'PATCH'].includes(params.method)) {
    requestInit.body = JSON.stringify(params.data);
  } else if (params.data && params.method === 'GET') {
    params.url += `?${new URLSearchParams(params.data).toString()}`;
  }
  
  const response = await fetch(`${params.url}`, requestInit);
  if (params.download) return await (response.blob());

  if (response.ok) {
    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json')
      ? await response.json()
      : await (response.text());
  }

  const errorResult = await response.text();

  const errorJson = JSON.parse(errorResult);

  if (errorJson.statusCode) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw { code: errorJson.statusCode, message: errorJson.message };
  }

  throw errorJson;
};