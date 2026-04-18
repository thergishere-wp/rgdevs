export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "client" | "admin";
  avatar_url: string | null;
  created_at: string;
}

export interface Platform {
  id: string;
  client_id: string;
  name: string;
  url: string | null;
  type: "website" | "webapp" | "erp" | "booking" | "dashboard" | null;
  status: "building" | "live" | "maintenance";
  plan: "starter" | "pro" | "enterprise" | null;
  uptime_percent: number;
  start_date: string | null;
  next_billing: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  client_id: string;
  platform_id: string | null;
  title: string;
  description: string | null;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  platforms?: Platform;
  profiles?: Profile;
}

export interface Message {
  id: string;
  ticket_id: string | null;
  sender_id: string;
  client_id: string | null;
  content: string;
  is_admin: boolean;
  read: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface Project {
  id: string;
  name: string;
  type: string | null;
  description: string | null;
  live_url: string | null;
  image_url: string | null;
  tags: string[] | null;
  featured: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  client_id: string;
  platform_id: string | null;
  month: string | null;
  uptime_percent: number | null;
  updates_made: string[] | null;
  notes: string | null;
  created_at: string;
  platforms?: Platform;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  company: string | null;
  platform_type: string | null;
  selected_plan: string | null;
  created_at: string;
}
