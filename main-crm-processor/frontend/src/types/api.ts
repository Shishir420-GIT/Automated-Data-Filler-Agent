export interface PIIEntity {
  entity: string;
  start: number;
  end: number;
  score: number;
}

export interface Contact {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
}

export interface Company {
  name?: string;
  industry?: string;
  size?: string;
  budget?: string;
}

export interface Deal {
  value?: string;
  stage?: string;
  timeline?: string;
  competitor?: string;
  next_action?: string;
}

export interface ProcessingRequest {
  summary: string;
}

export interface ProcessingResponse {
  pii: PIIEntity[];
  contact: Contact;
  company: Company;
  deal: Deal;
  confidence: number;
  processed_at: string;
  success: boolean;
  error?: string;
}

export interface Lead {
  pii: PIIEntity[];
  contact: Contact;
  company: Company;
  deal: Deal;
  confidence: number;
  processed_at: string;
  created_at: string;
}

export interface LeadResponse {
  leads: Lead[];
  total: number;
}

export interface Stats {
  total_leads: number;
  total_deals: number;
  total_value: number;
}