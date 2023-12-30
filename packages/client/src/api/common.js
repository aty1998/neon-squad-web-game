async function handleFetchStatus(response) {
  if (response.ok) return response;
  
  const body = await response.text();
  console.error(`Fetch response error: ${body}.`);

  let err;
  try {
    err = JSON.parse(body);
  } catch {
    err = { status: response.status, body };
  }
  throw err;
}

export { handleFetchStatus };
