export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface Convocation {
  id: string;
  classification: string;
  name: string;
  source?: string;
  extractedAt: string;
}

export interface Match {
  user: User;
  convocation: Convocation;
  matchedAt: string;
}
