import { useState, useEffect } from "react";

// Stripe Payment Links - create these in your Stripe dashboard
// Dashboard → Payment Links → Create → select your price
const PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/fZuaEW4N42vr9zf1Fu5os00", // Replace with your real Stripe payment link
  yearly:  "https://buy.stripe.com/dRm3cu2EW1rn8vbck85os01",  // Replace with your real Stripe payment link
};

const FREE_LIMIT = 3;
const STORAGE_KEY = "spark_usage";
const PREMIUM_KEY = "spark_premium";

function today() { return new Date().toISOString().slice(0, 10); }
function getUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: today() };
    const p = JSON.parse(raw);
    return p.date !== today() ? { count: 0, date: today() } : p;
  } catch { return { count: 0, date: today() }; }
}
function saveUsage(count) { localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: today() })); }
function getPremium() { try { return localStorage.getItem(PREMIUM_KEY) === "true"; } catch { return false; } }
function savePremium() { try { localStorage.setItem(PREMIUM_KEY, "true"); } catch {} }

const VIBES = [
  { id: "flirty",   emoji: "😏", label: "Flirty",      desc: "Teasing & playful",   color: "#FF6B9D", bg: "rgba(255,107,157,0.12)" },
  { id: "romantic", emoji: "🌹", label: "Romantic",    desc: "Tender & loving",     color: "#E878A2", bg: "rgba(232,120,162,0.12)" },
  { id: "spicy",    emoji: "🔥", label: "Spicy",       desc: "Bold & suggestive",   color: "#FF8C42", bg: "rgba(255,140,66,0.12)"  },
  { id: "sweet",    emoji: "🍯", label: "Sweet",       desc: "Warm & affectionate", color: "#F7C59F", bg: "rgba(247,197,159,0.12)" },
  { id: "cheeky",   emoji: "😈", label: "Cheeky",      desc: "Naughty & witty",     color: "#C77DFF", bg: "rgba(199,125,255,0.12)" },
  { id: "missing",  emoji: "💭", label: "Missing You", desc: "Longing & nostalgic", color: "#74B3CE", bg: "rgba(116,179,206,0.12)" },
];

const CONTEXTS = [
  { id: "morning", emoji: "☀️", label: "Good Morning"   },
  { id: "midday",  emoji: "💼", label: "During the Day" },
  { id: "night",   emoji: "🌙", label: "Good Night"     },
  { id: "anytime", emoji: "✨", label: "Just Because"   },
];

const VIBE_DESCS = {
  flirty: "playfully flirty and teasing with light innuendo",
  romantic: "deeply romantic, tender, and heartfelt",
  spicy: "bold, suggestive, and a little naughty but tasteful",
  sweet: "warm, loving, and genuinely sweet",
  cheeky: "cheeky, witty, and naughty in a fun way",
  missing: "longing, nostalgic, and full of desire to be together",
};

const CONTEXT_DESCS = {
  morning: "to send first thing in the morning",
  midday: "to send in the middle of the day",
  night: "to send as a good night message",
  anytime: "to send any time just because",
};

function IdeaCard({ idea, index, vibe }) {
  const [copied, setCopied] = useState(false);
  const v = VIBES.find(v => v.id === vibe);
  const copy = () => { navigator.clipboard.writeText(idea); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px " + v.color + "25"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      style={{ background: v.bg, border: "1px solid " + v.color + "30", borderRadius: 16, padding: "18px 20px", position: "relative", animation: "cardIn 0.4s ease " + (index * 0.08) + "s both", transition: "transform 0.2s, box-shadow 0.2s" }}
    >
      <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7, paddingRight: 36 }}>{idea}</div>
      <button onClick={copy} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 8, border: "1px solid " + (copied ? v.color : "rgba(255,255,255,0.12)"), background: copied ? v.color + "22" : "transparent", color: copied ? v.color : "#777", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontSize: 14 }}>
        {copied ? "✓" : "⧉"}
      </button>
    </div>
  );
}

function PaywallModal({ onClose }) {
  const handleCheckout = (plan) => {
    window.open(PAYMENT_LINKS[plan], "_blank");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20, backdropFilter: "blur(10px)" }}>
      <div style={{ background: "#120810", border: "1px solid rgba(255,107,157,0.3)", borderRadius: 24, padding: "36px 28px", maxWidth: 420, width: "100%", textAlign: "center", animation: "fadeUp 0.3s ease", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>💌</div>
        <h2 style={{ color: "#fff", fontWeight: 400, margin: "0 0 10px", fontSize: 21, fontFamily: "inherit" }}>You've used your 3 free ideas today</h2>
        <p style={{ color: "#777", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
          Upgrade to <span style={{ color: "#FF6B9D" }}>Spark Premium</span> for unlimited daily ideas, all 6 vibes, and seasonal packs every month.
        </p>

        {/* Features list */}
        <div style={{ background: "rgba(255,107,157,0.06)", border: "1px solid rgba(255,107,157,0.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 24, textAlign: "left" }}>
          {["Unlimited message ideas daily", "All 6 vibes + seasonal packs", "Faster AI generation", "Cancel anytime"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#bbb", fontSize: 13, marginBottom: i < 3 ? 9 : 0 }}>
              <span style={{ color: "#FF6B9D", fontWeight: 700, fontSize: 15 }}>✓</span> {f}
            </div>
          ))}
        </div>

        {/* Two plan buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>

          {/* Monthly */}
          <button
            onClick={() => handleCheckout("monthly")}
            style={{ width: "100%", padding: "14px 20px", borderRadius: 14, border: "1px solid rgba(255,107,157,0.3)", background: "rgba(255,107,157,0.08)", color: "#fff", fontSize: 15, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,157,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,157,0.08)"}
          >
            <span style={{ color: "#bbb", fontSize: 14 }}>Monthly</span>
            <span><strong style={{ fontSize: 18, color: "#FF6B9D" }}>$4.99</strong><span style={{ color: "#666", fontSize: 12 }}>/mo</span></span>
          </button>

          {/* Yearly */}
          <button
            onClick={() => handleCheckout("yearly")}
            style={{ width: "100%", padding: "14px 20px", borderRadius: 14, border: "1px solid rgba(255,107,157,0.5)", background: "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(199,125,255,0.1))", color: "#fff", fontSize: 15, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s", position: "relative" }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,107,157,0.25), rgba(199,125,255,0.2))"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(199,125,255,0.1))"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#ddd", fontSize: 14 }}>Yearly</span>
              <span style={{ background: "#FF6B9D", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>SAVE 50%</span>
            </div>
            <span><strong style={{ fontSize: 18, color: "#FF6B9D" }}>$29.99</strong><span style={{ color: "#666", fontSize: 12 }}>/yr</span></span>
          </button>

          {/* Main CTA */}
          <button
            onClick={() => handleCheckout("yearly")}
            style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #FF6B9D, #c9547a)", color: "#fff", fontSize: 16, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.03em", boxShadow: "0 6px 28px rgba(255,107,157,0.4)", marginTop: 4, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 36px rgba(255,107,157,0.6)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,107,157,0.4)"}
          >
            Get Premium — Best Value 💌
          </button>
        </div>

        <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Maybe later</button>
        <p style={{ color: "#222", fontSize: 11, marginTop: 12 }}>🔒 Secure checkout via Stripe · Cancel anytime</p>
      </div>
    </div>
  );
}

export default function SparkApp() {
  const [vibe, setVibe] = useState("flirty");
  const [context, setContext] = useState("anytime");
  const [partnerName, setPartnerName] = useState("");
  const [about, setAbout] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPremium, setIsPremium] = useState(getPremium());
  const [usage, setUsage] = useState(getUsage);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("premium") === "true") {
        savePremium();
        setIsPremium(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    } catch {}
  }, []);

  const sv = VIBES.find(v => v.id === vibe);
  const remaining = Math.max(0, FREE_LIMIT - usage.count);
  const isLocked = !isPremium && usage.count >= FREE_LIMIT;

  const generate = async () => {
    if (isLocked) { setShowPaywall(true); return; }
    setLoading(true); setError(""); setIdeas([]);
    const parts = [
      "Generate 5 short text messages that are " + VIBE_DESCS[vibe] + ", " + CONTEXT_DESCS[context] + ".",
      "These are real messages someone will copy and send to their romantic partner.",
    ];
    if (partnerName) parts.push("Their partner's name is " + partnerName + ".");
    if (about) parts.push("Extra context: " + about);
    parts.push("Keep each 1-3 sentences. Vary the style. Feel natural, not AI-generated.");
    parts.push("Respond with ONLY a JSON array of 5 strings. No markdown. No explanation. Just the array.");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: "You help couples write sweet, flirty, and romantic messages. Respond only with a valid JSON array of strings. No markdown fences, no explanation, nothing else.",
          messages: [{ role: "user", content: parts.join(" ") }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error("API error: " + (data.error.message || JSON.stringify(data.error)));
      const raw = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("");
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Unexpected response: " + raw.slice(0, 200));
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("No messages returned.");
      setIdeas(parsed);
      setGenerated(true);
      if (!isPremium) { const n = usage.count + 1; setUsage({ count: n, date: today() }); saveUsage(n); }
    } catch (e) { setError(e.message || String(e)); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "11px 14px", color: "#ddd", fontSize: 14, fontFamily: "inherit" };

  return (
    <div style={{ minHeight: "100vh", background: "#0e0a0e", backgroundImage: "radial-gradient(ellipse at 20% 20%, rgba(255,107,157,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(199,125,255,0.06) 0%, transparent 60%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 60px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>
      <style>{`
        @keyframes cardIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; }
        input::placeholder, textarea::placeholder { color:#444; }
        input:focus, textarea:focus { outline:none; }
        textarea { resize:none; }
      `}</style>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeIn 0.6s ease" }}>
        <div style={{ fontSize: 42, marginBottom: 10 }}>💌</div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 400, color: "#fff", letterSpacing: "0.04em" }}>Spark</h1>
        <p style={{ color: "#555", fontSize: 12, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Message ideas for your person</p>

        <div style={{ marginTop: 16 }}>
          {!isPremium ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "7px 16px" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[...Array(FREE_LIMIT)].map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < usage.count ? "rgba(255,255,255,0.1)" : "#FF6B9D", boxShadow: i < usage.count ? "none" : "0 0 6px #FF6B9D88", transition: "all 0.3s" }} />
                ))}
              </div>
              <span style={{ color: "#777", fontSize: 12 }}>
                {remaining > 0 ? remaining + " free " + (remaining === 1 ? "idea" : "ideas") + " left today" : "Daily limit reached —"}
              </span>
              {remaining === 0 && <button onClick={() => setShowPaywall(true)} style={{ background: "none", border: "none", color: "#FF6B9D", fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>Upgrade ✨</button>}
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,107,157,0.08)", border: "1px solid rgba(255,107,157,0.2)", borderRadius: 20, padding: "7px 16px" }}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span style={{ color: "#FF6B9D", fontSize: 12 }}>Premium — unlimited ideas</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Vibe */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Pick a vibe</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {VIBES.map(v => (
              <button key={v.id} onClick={() => setVibe(v.id)} style={{ padding: "12px 8px", borderRadius: 14, border: "1px solid " + (vibe === v.id ? v.color + "88" : "rgba(255,255,255,0.06)"), background: vibe === v.id ? v.bg : "transparent", color: vibe === v.id ? v.color : "#555", cursor: "pointer", transition: "all 0.2s", textAlign: "center", fontFamily: "inherit" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{v.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: vibe === v.id ? 600 : 400 }}>{v.label}</div>
                <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Context */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>When are you sending it?</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => setContext(c.id)} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid " + (context === c.id ? sv.color + "88" : "rgba(255,255,255,0.07)"), background: context === c.id ? sv.bg : "transparent", color: context === c.id ? sv.color : "#555", fontSize: 13, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="Their name (optional) — e.g. Jess, babe, love..." style={inp} />
          <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Any context? (optional) — anniversary, long distance, rough week..." rows={2} style={{ ...inp, lineHeight: 1.5 }} />
        </div>

        {/* Generate button */}
        <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: loading ? "rgba(255,255,255,0.04)" : isLocked ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, " + sv.color + ", " + sv.color + "bb)", color: loading || isLocked ? "#555" : "#fff", fontSize: 16, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.04em", transition: "all 0.3s", boxShadow: !loading && !isLocked ? "0 6px 30px " + sv.color + "40" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {loading ? <><span style={{ width: 18, height: 18, border: "2px solid #333", borderTopColor: "#777", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Crafting ideas...</> : isLocked ? "🔒 Upgrade to generate more" : generated ? "✨ Generate more ideas" : "✨ Get " + sv.emoji + " " + sv.label + " ideas"}
        </button>

        {error && <div style={{ color: "#ff8080", fontSize: 12, marginTop: 14, background: "rgba(255,80,80,0.07)", border: "1px solid rgba(255,80,80,0.18)", borderRadius: 10, padding: "10px 14px", lineHeight: 1.6 }}>⚠️ {error}</div>}

        {ideas.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>{sv.emoji} {sv.label} messages — tap to copy</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} index={i} vibe={vibe} />)}
            </div>
            <p style={{ color: "#333", fontSize: 12, textAlign: "center", marginTop: 20, fontStyle: "italic" }}>Not quite right? Adjust the vibe and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
