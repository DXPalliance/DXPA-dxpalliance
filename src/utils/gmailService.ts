export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: GmailMessageHeader[];
    body: {
      data?: string;
    };
    parts?: any[];
  };
}

export const fetchGmailMessages = async (accessToken: string, query: string = ''): Promise<any[]> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Gmail messages');
  }
  
  const data = await response.json();
  if (!data.messages) return [];
  
  const detailedMessages = await Promise.all(
    data.messages.map(async (msg: { id: string }) => {
      const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`;
      const detailRes = await fetch(detailUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return detailRes.json();
    })
  );
  
  return detailedMessages;
};

export const getHeader = (headers: GmailMessageHeader[], name: string): string => {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
};

export const decodeBase64 = (data: string): string => {
  try {
    return decodeURIComponent(escape(atob(data.replace(/-/g, '+').replace(/_/g, '/'))));
  } catch (e) {
    return 'Unable to decode message content.';
  }
};
