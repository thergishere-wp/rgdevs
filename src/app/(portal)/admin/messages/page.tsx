"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Profile, Message } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";

const sidebarItems = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Tickets", href: "/admin/tickets", icon: "tickets" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "portfolio" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Contacts", href: "/admin/contacts", icon: "contacts" },
];

export default function AdminMessagesPage() {
  const { user, profile, loading, signOut } = useAuth("admin");
  const [clients, setClients] = useState<Profile[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.from("profiles").select("*").eq("role", "client").order("full_name").then(({ data }) => setClients(data as Profile[] || []));
  }, []);

  useEffect(() => {
    if (!selectedClient) return;
    const supabase = getSupabaseBrowser();

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .is("ticket_id", null)
        .or(`sender_id.eq.${selectedClient},is_admin.eq.true`)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`admin-msg-${selectedClient}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (!msg.ticket_id) setMessages((prev) => [...prev, msg]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !selectedClient) return;
    setSending(true);
    const supabase = getSupabaseBrowser();
    await supabase.from("messages").insert([{
      sender_id: user.id,
      content: newMessage.trim(),
      is_admin: true,
      ticket_id: null,
    }]);
    setNewMessage("");
    setSending(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 flex h-screen">
        {/* Client list */}
        <div className="w-64 border-r border-border overflow-y-auto p-3">
          <p className="font-mono text-[10px] text-blue tracking-wider uppercase px-3 py-2">Conversations</p>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client.id)}
              className={`w-full text-left px-3 py-3 text-sm transition-colors ${selectedClient === client.id ? "bg-blue/10 text-blue border-l-2 border-blue" : "text-offwhite hover:text-text hover:bg-surface border-l-2 border-transparent"}`}
            >
              {client.full_name || client.email}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col p-6">
          {!selectedClient ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-offwhite text-sm">Select a client to start messaging</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto bg-card border border-border p-4 space-y-4 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 ${msg.is_admin ? "bg-blue/10 border border-blue/20" : "bg-surface border border-border"}`}>
                      <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">{msg.is_admin ? "You" : "Client"}</p>
                      <p className="text-sm text-text whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[10px] text-offwhite/50 font-mono mt-2">{new Date(msg.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} className="flex gap-3">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Reply..."
                  className="flex-1 bg-card border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none" />
                <button type="submit" disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50">Send</button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
