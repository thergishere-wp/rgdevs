"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Ticket, Message } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "My Platform", href: "/dashboard/platform", icon: "platform" },
  { label: "Tickets", href: "/dashboard/tickets", icon: "tickets" },
  { label: "Messages", href: "/dashboard/messages", icon: "messages" },
  { label: "Reports", href: "/dashboard/reports", icon: "reports" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { user, profile, loading, signOut } = useAuth("client");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => {
    if (!user || !ticketId) return;
    const supabase = getSupabaseBrowser();

    // Fetch ticket
    supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single()
      .then(({ data }) => {
        if (data) setTicket(data);
      });

    // Fetch messages
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
          filter: `id=eq.${ticketId}`,
        },
        (payload) => {
          setTicket(payload.new as Ticket);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    setSending(true);

    const supabase = getSupabaseBrowser();
    await supabase.from("messages").insert([
      {
        ticket_id: ticketId,
        sender_id: user.id,
        content: newMessage.trim(),
        is_admin: false,
      },
    ]);

    setNewMessage("");
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar
        items={sidebarItems}
        userName={profile?.full_name || "Client"}
        role="Client"
        onSignOut={signOut}
      />

      <main className="flex-1 ml-60 p-8 flex flex-col h-screen">
        {/* Ticket header */}
        {ticket && (
          <div className="mb-6 shrink-0">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-barlow font-bold text-xl text-text">
                {ticket.title}
              </h1>
              <StatusBadge status={ticket.status} />
              <StatusBadge status={ticket.priority} />
            </div>
            {ticket.description && (
              <p className="text-offwhite text-sm">{ticket.description}</p>
            )}
            <p className="text-xs text-offwhite font-mono mt-2">
              Created {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-card border border-border p-4 space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-offwhite text-sm">
                No messages yet. Start the conversation.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.is_admin ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 ${
                    msg.is_admin
                      ? "bg-surface border border-border"
                      : "bg-blue/10 border border-blue/20"
                  }`}
                >
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    {msg.is_admin ? "RG Devs" : "You"}
                  </p>
                  <p className="text-sm text-text whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <p className="text-[10px] text-offwhite/50 font-mono mt-2">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3 shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-card border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
