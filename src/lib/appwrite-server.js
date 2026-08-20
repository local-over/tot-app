export const createAdminClient = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!projectId || !apiKey) {
    throw new Error('Missing APPWRITE variables');
  }

  const headers = {
    'X-Appwrite-Project': projectId,
    'X-Appwrite-Key': apiKey,
    'Content-Type': 'application/json',
  };

  const databases = {
    async createDocument(dbId, colId, docId, data) {
      const res = await fetch(`${endpoint}/databases/${dbId}/collections/${colId}/documents`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ documentId: docId, data }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async listDocuments(dbId, colId, queries = []) {
      const url = new URL(`${endpoint}/databases/${dbId}/collections/${colId}/documents`);
      queries.forEach(q => url.searchParams.append('queries[]', q));
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async getDocument(dbId, colId, docId) {
      const res = await fetch(`${endpoint}/databases/${dbId}/collections/${colId}/documents/${docId}`, { headers });
      if (!res.ok) throw Object.assign(new Error(await res.text()), { code: res.status });
      return res.json();
    },
    async updateDocument(dbId, colId, docId, data) {
      const res = await fetch(`${endpoint}/databases/${dbId}/collections/${colId}/documents/${docId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw Object.assign(new Error(await res.text()), { code: res.status });
      return res.json();
    },
    async deleteDocument(dbId, colId, docId) {
      const res = await fetch(`${endpoint}/databases/${dbId}/collections/${colId}/documents/${docId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw Object.assign(new Error(await res.text()), { code: res.status });
      // Appwrite DELETE returns empty 204 typically
      return true;
    }
  };

  return { databases };
};
