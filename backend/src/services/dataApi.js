export const isDataApiEnabled = () => {
  return !!(process.env.MONGODB_DATA_API_URL && process.env.MONGODB_DATA_API_KEY && process.env.MONGODB_DATA_SOURCE);
};

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  'api-key': process.env.MONGODB_DATA_API_KEY
});

const getDbName = () => process.env.DB_NAME || 'slot-booking';

export const dataApiFind = async ({ collection, filter = {}, sort = { createdAt: -1 }, limit = 50, skip = 0, projection }) => {
  const url = `${process.env.MONGODB_DATA_API_URL}/action/find`;
  const body = {
    dataSource: process.env.MONGODB_DATA_SOURCE,
    database: getDbName(),
    collection,
    filter,
    sort,
    limit,
    skip,
    projection
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Data API find failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.documents || [];
};

export const dataApiCount = async ({ collection, filter = {} }) => {
  const url = `${process.env.MONGODB_DATA_API_URL}/action/count`;
  const body = {
    dataSource: process.env.MONGODB_DATA_SOURCE,
    database: getDbName(),
    collection,
    filter
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Data API count failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.count || 0;
};


