export type SessionsResponse = {
  sessions: {
    id: string;
    device: string;
    ipAddress: string;
    createdAt: string;
    userAgent: string;
    lastUsedAt: string;
    expiresAt: string;
  }[];
};
