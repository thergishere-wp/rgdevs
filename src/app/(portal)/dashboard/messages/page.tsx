"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Message } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import GlassCard from "@/components/GlassCard";
import { clientSidebarItems } from "@/lib/sidebar-items";

const faqs = [
  { q: "How do I request a change?", a: "Create a ticket from the Tickets page with details about the change you need." },
  { q: "How long do changes take?", a: "Most changes are completed within 24-48 hours depending on complexity." },
  { q: "What does my plan include?", a: "Check your platform page for details on your plan. All plans include hosting and maintenance." },
  { q: "How do I renew after 1 year?", a: "We'll contact you before your contract ends to discuss renewal options." },
  { q: "Can I upgrade my plan?", a: "Yes! Send us a message here or create a ticket and we'll handle the upgrade." },
];

export default function MessagesPage() {
  const { user, profile, loading, signOut } = useAuth("client");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();

    // Fetch general messages (no ticket_id)
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .is("ticket_id", null)
        .eq("client_id", user.id)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    // Realtime
    const channel = supabase
      .channel("general-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (!msg.ticket_id && msg.client_id === user.id) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    setSending(true);
    const supabase = getSupabaseBrowser();
    await supabase.from("messages").insert([{
      sender_id: user.id,
      client_id: user.id,
      content: newMessage.trim(),
      is_admin: false,
      ticket_id: null,
    }]);
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
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar
        items={clientSidebarItems}
        userName={profile?.full_name || "Client"}
        role="Client"
        onSignOut={signOut}
      />
      <main className="flex-1 ml-60 p-8 flex flex-col h-screen">
        <div className="shrink-0 mb-6">
          <span className="font-mono text-blue text-xs tracking-wider">/ MESSAGES</span>
          <h1 className="font-anton text-4xl uppercase mt-2 text-text">
            Direct <span className="text-blue">Chat.</span>
          </h1>
        </div>

        {/* FAQ Section */}
        <GlassCard className="shrink-0 mb-6">
          <p className="font-mono text-[10px] text-blue tracking-wider uppercase mb-3">FAQ</p>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="last:border-0" style={{ borderBottom: i < faqs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-3 flex items-center justify-between text-sm text-text hover:text-blue transition-colors"
                >
                  {faq.q}
                  <span className="text-offwhite text-xs">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="text-offwhite text-xs pb-3 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem" }}>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-offwhite text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] p-3 rounded-xl ${msg.is_admin ? "" : "bg-blue/10 border border-blue/20"}`} style={msg.is_admin ? { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" } : undefined}>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    {msg.is_admin ? "RG Devs" : "You"}
                  </p>
                  <p className="text-sm text-text whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-[10px] text-offwhite/50 font-mono mt-2">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-3 shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
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
