"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Ticket, Message } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { adminSidebarItems } from "@/lib/sidebar-items";

export default function AdminTicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { user, profile, loading, signOut } = useAuth("admin");
  const [ticket, setTicket] = useState<
    (Ticket & { profiles?: { full_name: string; email: string } }) | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [internalNote, setInternalNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<"messages" | "notes">("messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicket = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("tickets")
      .select("*, profiles(full_name, email)")
      .eq("id", ticketId)
      .single();
    if (data) setTicket(data as unknown as typeof ticket);
  };

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
    fetchTicket();
    fetchMessages();

    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel(`admin-ticket-${ticketId}`)
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
          setTicket((prev) => {
            if (!prev) return prev;
            const updated = payload.new as Ticket;
            return { ...prev, ...updated } as typeof prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        client_id: ticket?.client_id || null,
        content: newMessage.trim(),
        is_admin: true,
      },
    ]);
    setNewMessage("");
    setSending(false);
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    setSavingNote(true);
    const supabase = getSupabaseBrowser();
    // Internal notes are messages with is_admin = true and a [NOTE] prefix
    await supabase.from("messages").insert([
      {
        ticket_id: ticketId,
        sender_id: user!.id,
        client_id: ticket?.client_id || null,
        content: `[INTERNAL NOTE] ${internalNote.trim()}`,
        is_admin: true,
      },
    ]);
    setInternalNote("");
    setSavingNote(false);
  };

  const updateTicket = async (updates: Partial<Ticket>) => {
    const supabase = getSupabaseBrowser();
    await supabase.from("tickets").update(updates).eq("id", ticketId);
    fetchTicket();
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#060608" }}
      >
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clientProfile = ticket?.profiles as unknown as {
    full_name: string;
    email: string;
  } | null;

  const publicMessages = messages.filter(
    (m) => !m.content.startsWith("[INTERNAL NOTE]")
  );
  const noteMessages = messages.filter((m) =>
    m.content.startsWith("[INTERNAL NOTE]")
  );

  const ticketAge = ticket
    ? Math.floor(
        (Date.now() - new Date(ticket.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar
        items={adminSidebarItems}
        userName={profile?.full_name || "Admin"}
        role="Admin"
        onSignOut={signOut}
      />

      <main className="flex-1 ml-60 flex flex-col h-screen p-6">
        {/* Breadcrumb */}
        <div className="shrink-0 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-offwhite/50">
            <Link
              href="/admin/tickets"
              className="hover:text-blue transition-colors"
            >
              Tickets
            </Link>
            <span>/</span>
            <span className="text-blue">
              TK-{ticketId.slice(0, 6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Ticket header */}
        {ticket && (
          <GlassCard className="shrink-0 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-barlow font-bold text-xl text-text">
                    {ticket.title}
                  </h1>
                  <StatusBadge status={ticket.status} />
                  <StatusBadge status={ticket.priority} />
                </div>
                {ticket.description && (
                  <p className="text-offwhite text-sm mb-3 leading-relaxed">
                    {ticket.description}
                  </p>
                )}
                <div className="flex items-center gap-6 text-xs font-mono text-offwhite/50">
                  <span>
                    Client:{" "}
                    <span className="text-text">
                      {clientProfile?.full_name || "Unknown"}
                    </span>
                  </span>
                  <span>
                    Email:{" "}
                    <span className="text-text">
                      {clientProfile?.email || "—"}
                    </span>
                  </span>
                  <span>
                    Opened:{" "}
                    <span className="text-text">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </span>
                  <span>
                    Age:{" "}
                    <span
                      className="text-text"
                      style={{
                        color:
                          ticketAge > 7
                            ? "#FF4444"
                            : ticketAge > 3
                            ? "#FFB800"
                            : "#00FF78",
                      }}
                    >
                      {ticketAge}d
                    </span>
                  </span>
                </div>
              </div>

              {/* Status / Priority controls */}
              <div className="flex items-center gap-3 ml-6">
                <div>
                  <label className="block font-mono text-[9px] text-offwhite/40 tracking-wider uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateTicket({
                        status: e.target.value as Ticket["status"],
                      })
                    }
                    className="text-xs text-text px-3 py-1.5 rounded-lg focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-offwhite/40 tracking-wider uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      updateTicket({
                        priority: e.target.value as Ticket["priority"],
                      })
                    }
                    className="text-xs text-text px-3 py-1.5 rounded-lg focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tab switcher */}
        <div className="flex gap-0 mb-4 shrink-0">
          {(["messages", "notes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all rounded-t-lg"
              style={{
                background:
                  activeTab === tab
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #0055FF"
                    : "2px solid transparent",
              }}
            >
              {tab === "messages"
                ? `Conversation (${publicMessages.length})`
                : `Internal Notes (${noteMessages.length})`}
            </button>
          ))}
        </div>

        {/* Messages / Notes area */}
        <div
          className="flex-1 overflow-y-auto p-5 space-y-4 mb-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {activeTab === "messages" ? (
            publicMessages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-offwhite/30 text-sm">
                  No messages yet. Reply to start the conversation.
                </p>
              </div>
            ) : (
              publicMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.is_admin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="max-w-[70%] p-4 rounded-2xl"
                    style={{
                      background: msg.is_admin
                        ? "rgba(0,85,255,0.12)"
                        : "rgba(255,255,255,0.04)",
                      border: msg.is_admin
                        ? "1px solid rgba(0,85,255,0.2)"
                        : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="font-mono text-[10px] text-offwhite/50 tracking-wider uppercase mb-1.5">
                      {msg.is_admin
                        ? "You (Admin)"
                        : clientProfile?.full_name || "Client"}
                    </p>
                    <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                    <p className="text-[10px] text-offwhite/30 font-mono mt-2">
                      {new Date(msg.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : noteMessages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-offwhite/30 text-sm">
                No internal notes. Add notes only visible to admins.
              </p>
            </div>
          ) : (
            noteMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-2xl"
                style={{
                  background: "rgba(255,184,0,0.06)",
                  border: "1px solid rgba(255,184,0,0.15)",
                }}
              >
                <p className="font-mono text-[10px] tracking-wider uppercase mb-1.5" style={{ color: "#FFB800" }}>
                  Internal Note
                </p>
                <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">
                  {msg.content.replace("[INTERNAL NOTE] ", "")}
                </p>
                <p className="text-[10px] text-offwhite/30 font-mono mt-2">
                  {new Date(msg.created_at).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {activeTab === "messages" ? (
          <form
            onSubmit={handleSend}
            className="flex gap-3 shrink-0"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Reply to client..."
              className="flex-1 px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:outline-none rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50 rounded-xl"
            >
              {sending ? "Sending..." : "Reply"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleAddNote}
            className="flex gap-3 shrink-0"
          >
            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Add internal note (only visible to admins)..."
              className="flex-1 px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:outline-none rounded-xl"
              style={{
                background: "rgba(255,184,0,0.04)",
                border: "1px solid rgba(255,184,0,0.15)",
              }}
            />
            <button
              type="submit"
              disabled={savingNote || !internalNote.trim()}
              className="px-6 py-3 text-sm font-medium tracking-wide transition-colors disabled:opacity-50 rounded-xl"
              style={{
                background: "rgba(255,184,0,0.15)",
                color: "#FFB800",
              }}
            >
              {savingNote ? "Saving..." : "Add Note"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
