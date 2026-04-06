"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Contact } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";

const sidebarItems = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Tickets", href: "/admin/tickets", icon: "tickets" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "portfolio" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Contacts", href: "/admin/contacts", icon: "contacts" },
];

export default function AdminContactsPage() {
  const { profile, loading, signOut } = useAuth("admin");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchContacts = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setContacts(data || []);
  };

  useEffect(() => { fetchContacts(); }, []);

  const markRead = async (id: string) => {
    const supabase = getSupabaseBrowser();
    await supabase.from("contacts").update({ status: "read" }).eq("id", id);
    fetchContacts();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">/ CONTACTS</span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-8 text-text">Form <span className="text-blue">Submissions.</span></h1>

        <div className="bg-card border border-border">
          {contacts.length === 0 ? <div className="p-12 text-center"><p className="text-offwhite text-sm">No submissions yet</p></div> : (
            <div className="divide-y divide-border">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-5">
                  <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setExpanded(expanded === contact.id ? null : contact.id)}>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={contact.status || "new"} />
                      <p className="text-sm text-text font-medium">{contact.name}</p>
                      <span className="text-xs text-offwhite font-mono">{contact.email}</span>
                    </div>
                    <span className="text-xs text-offwhite font-mono">{new Date(contact.created_at).toLocaleDateString()}</span>
                  </div>
                  {expanded === contact.id && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-offwhite whitespace-pre-wrap mb-3">{contact.message}</p>
                      <div className="flex gap-2">
                        {contact.status !== "read" && (
                          <button onClick={() => markRead(contact.id)}
                            className="px-3 py-1.5 border border-border text-xs text-text hover:border-blue transition-colors">Mark Read</button>
                        )}
                        <a href={`mailto:${contact.email}`}
                          className="px-3 py-1.5 bg-blue text-white text-xs hover:bg-blue-light transition-colors">Reply via Email</a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
