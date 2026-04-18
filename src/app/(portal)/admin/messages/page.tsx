"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Profile, Message } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import { adminSidebarItems } from "@/lib/sidebar-items";

export default function AdminMessagesPage() {
  const { user, profile, loading, signOut } = useAuth("admin");
  const [clients, setClients] = useState<Profile[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch clients and unread counts
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("full_name")
      .then(({ data }) => setClients((data as Profile[]) || []));

    // Get unread counts per client
    supabase
      .from("messages")
      .select("client_id")
      .eq("is_admin", false)
      .eq("read", false)
      .is("ticket_id", null)
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        (data || []).forEach((msg: { client_id: string | null }) => {
          if (msg.client_id) {
            counts[msg.client_id] = (counts[msg.client_id] || 0) + 1;
          }
        });
        setUnreadCounts(counts);
      });
  }, []);

  // Fetch messages for selected client
  useEffect(() => {
    if (!selectedClient) return;
    const supabase = getSupabaseBrowser();

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .is("ticket_id", null)
        .eq("client_id", selectedClient)
        .order("created_at", { ascending: true });
      setMessages(data || []);

      // Mark client messages as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("client_id", selectedClient)
        .eq("is_admin", false)
        .eq("read", false)
        .is("ticket_id", null);

      setUnreadCounts((prev) => ({ ...prev, [selectedClient]: 0 }));
    };

    fetchMessages();

    // Realtime subscription scoped to this client
    const channel = supabase
      .channel(`admin-msg-${selectedClient}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (!msg.ticket_id && msg.client_id === selectedClient) {
            setMessages((prev) => [...prev, msg]);
            if (!msg.is_admin) {
              supabase.from("messages").update({ read: true }).eq("id", msg.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !selectedClient) return;
    setSending(true);
    const supabase = getSupabaseBrowser();
    await supabase.from("messages").insert([
      {
        sender_id: user.id,
        client_id: selectedClient,
        content: newMessage.trim(),
        is_admin: true,
        ticket_id: null,
      },
    ]);
    setNewMessage("");
    setSending(false);
  };

  const filteredClients = clients.filter(
    (c) =>
      (c.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060608" }}>
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedClientProfile = clients.find((c) => c.id === selectedClient);

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar
        items={adminSidebarItems}
        userName={profile?.full_name || "Admin"}
        role="Admin"
        onSignOut={signOut}
      />
      <main className="flex-1 ml-60 flex h-screen">
        {/* Client list sidebar */}
        <div
          className="w-72 overflow-y-auto flex flex-col"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="font-mono text-[10px] text-blue tracking-wider uppercase mb-3">
              Conversations
            </p>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs text-text placeholder:text-offwhite/30 focus:outline-none rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client.id)}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 mb-1 ${
                  selectedClient === client.id ? "text-blue" : "text-offwhite hover:text-text"
                }`}
                style={{
                  background: selectedClient === client.id ? "rgba(0,85,255,0.08)" : "transparent",
                  borderLeft: selectedClient === client.id ? "3px solid #0055FF" : "3px solid transparent",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0"
                  style={{
                    background: selectedClient === client.id ? "rgba(0,85,255,0.15)" : "rgba(255,255,255,0.05)",
                    color: selectedClient === client.id ? "#4488FF" : "#888",
                  }}
                >
                  {(client.full_name || client.email || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{client.full_name || client.email}</p>
                  <p className="text-[10px] text-offwhite/40 font-mono truncate">{client.email}</p>
                </div>
                {(unreadCounts[client.id] || 0) > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono text-white shrink-0" style={{ background: "#0055FF" }}>
                    {unreadCounts[client.id]}
                  </span>
                )}
              </button>
            ))}
            {filteredClients.length === 0 && (
              <p className="text-offwhite/30 text-xs text-center py-8">No clients found</p>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!selectedClient ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,85,255,0.08)" }}>
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3h12v8H4l-2 2V3z" stroke="#0055FF" strokeWidth="1.2" />
                  </svg>
                </div>
                <p className="text-offwhite text-sm">Select a client to start messaging</p>
                <p className="text-offwhite/30 text-xs mt-1 font-mono">{clients.length} client{clients.length !== 1 ? "s" : ""} available</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 flex items-center gap-3 shrink-0" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-mono" style={{ background: "rgba(0,85,255,0.15)", color: "#4488FF" }}>
                  {(selectedClientProfile?.full_name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-text text-sm font-medium">{selectedClientProfile?.full_name || "Client"}</p>
                  <p className="text-[10px] text-offwhite/40 font-mono">{selectedClientProfile?.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-offwhite/30 text-sm">No messages yet. Send a message to start the conversation.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-[70%] p-4 rounded-2xl"
                        style={{
                          background: msg.is_admin ? "rgba(0,85,255,0.12)" : "rgba(255,255,255,0.04)",
                          border: msg.is_admin ? "1px solid rgba(0,85,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <p className="font-mono text-[10px] text-offwhite/50 tracking-wider uppercase mb-1.5">
                          {msg.is_admin ? "You" : selectedClientProfile?.full_name || "Client"}
                        </p>
                        <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] text-offwhite/30 font-mono mt-2">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex gap-3 p-4 shrink-0" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Reply to ${selectedClientProfile?.full_name || "client"}...`}
                  className="flex-1 px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:outline-none rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50 rounded-xl"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
