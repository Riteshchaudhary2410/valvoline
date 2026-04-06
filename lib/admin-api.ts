export function createAdminHeaders(adminKey: string, includeJson = false): HeadersInit {
  const headers: Record<string, string> = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  headers.Authorization = `Bearer ${adminKey}`;

  return headers;
}

export async function uploadAdminImage(file: File, slug: string, adminKey: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('slug', slug);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: createAdminHeaders(adminKey),
    body: formData,
  });

  const payload = (await response.json()) as {
    success: boolean;
    data?: { url?: string };
    error?: string;
  };

  if (!response.ok || !payload.success || !payload.data?.url) {
    throw new Error(payload.error || 'Failed to upload image');
  }

  return payload.data.url;
}

export async function uploadAdminExcel(file: File, adminKey: string): Promise<{
  processed: number;
  inserted: number;
  updated: number;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-excel', {
    method: 'POST',
    headers: createAdminHeaders(adminKey),
    body: formData,
  });

  const payload = (await response.json()) as {
    success: boolean;
    data?: { processed?: number; inserted?: number; updated?: number };
    error?: string;
  };

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error || 'Failed to upload Excel file');
  }

  return {
    processed: payload.data.processed ?? 0,
    inserted: payload.data.inserted ?? 0,
    updated: payload.data.updated ?? 0,
  };
}
