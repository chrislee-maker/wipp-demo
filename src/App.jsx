import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, HelpCircle, TrendingUp, Clock, DollarSign, Users,
  X, Send, ChevronRight, Check, Copy, Upload, ArrowLeft, Zap,
  Target, Megaphone, Building2, BookOpen, Leaf, HeartPulse,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ── DATA ──────────────────────────────────────────────────────────────────────

const PRIORITY_TREND_DATA = [
  { week: 'W1', Infrastructure: 45, Education: 72, Climate: 38, Healthcare: 55, Housing: 28 },
  { week: 'W2', Infrastructure: 52, Education: 75, Climate: 42, Healthcare: 54, Housing: 31 },
  { week: 'W3', Infrastructure: 58, Education: 71, Climate: 48, Healthcare: 56, Housing: 35 },
  { week: 'W4', Infrastructure: 67, Education: 78, Climate: 55, Healthcare: 52, Housing: 40 },
  { week: 'W5', Infrastructure: 79, Education: 80, Climate: 63, Healthcare: 58, Housing: 47 },
  { week: 'W6', Infrastructure: 85, Education: 77, Climate: 70, Healthcare: 55, Housing: 52 },
  { week: 'W7', Infrastructure: 92, Education: 82, Climate: 76, Healthcare: 60, Housing: 58 },
  { week: 'W8', Infrastructure: 98, Education: 85, Climate: 84, Healthcare: 62, Housing: 65 },
];

const PEAK_ENGAGEMENT_DATA = [
  { hour: '12am', v: 12 }, { hour: '1am', v: 8 },  { hour: '2am', v: 6 },
  { hour: '3am',  v: 5  }, { hour: '4am', v: 7 },  { hour: '5am', v: 15 },
  { hour: '6am',  v: 28 }, { hour: '7am', v: 52 }, { hour: '8am', v: 85 },
  { hour: '9am',  v: 92 }, { hour: '10am', v: 68 },{ hour: '11am', v: 71 },
  { hour: '12pm', v: 78 }, { hour: '1pm', v: 88 }, { hour: '2pm', v: 62 },
  { hour: '3pm',  v: 58 }, { hour: '4pm', v: 55 }, { hour: '5pm', v: 64 },
  { hour: '6pm',  v: 72 }, { hour: '7pm', v: 95 }, { hour: '8pm', v: 98 },
  { hour: '9pm',  v: 82 }, { hour: '10pm', v: 48 },{ hour: '11pm', v: 25 },
];

const DEMOGRAPHIC_DATA = [
  { name: '18-24', value: 12, color: '#1B4DFF' },
  { name: '25-34', value: 28, color: '#00E5A0' },
  { name: '35-44', value: 24, color: '#F59E0B' },
  { name: '45-54', value: 19, color: '#EF4444' },
  { name: '55-64', value: 11, color: '#8B5CF6' },
  { name: '65+',   value: 6,  color: '#EC4899' },
];

const GEO_DATA = [
  { name: 'Riverside', pct: 24 },
  { name: 'Downtown',  pct: 19 },
  { name: 'Oakwood',   pct: 17 },
  { name: 'Hillcrest', pct: 15 },
  { name: 'Lakeview',  pct: 12 },
  { name: 'Other',     pct: 13 },
];

const SENTIMENT_DATA = [
  { issue: 'Infrastructure', positive: 45, neutral: 32, negative: 23 },
  { issue: 'Education',      positive: 68, neutral: 22, negative: 10 },
  { issue: 'Climate/Energy', positive: 72, neutral: 18, negative: 10 },
  { issue: 'Healthcare',     positive: 54, neutral: 28, negative: 18 },
  { issue: 'Housing',        positive: 38, neutral: 35, negative: 27 },
];

const FUNNEL_DATA = [
  { stage: 'Conversations', value: 12847, pct: 100 },
  { stage: 'Engaged',       value: 8192,  pct: 64  },
  { stage: 'Action Taken',  value: 3420,  pct: 27  },
  { stage: 'Donated',       value: 847,   pct: 7   },
  { stage: 'Volunteered',   value: 342,   pct: 3   },
];

const SCENARIOS = [
  {
    id: 'data', label: 'Data Collection', emoji: '🎯',
    messages: [
      { role: 'user', text: "Hi, I have some concerns about what's happening in our neighborhood." },
      { role: 'bot',  text: "I'd love to hear what's on your mind. Which town or city are you in? Knowing your area helps me connect your concerns with the most relevant work Jeromie is doing across MA-01." },
      { role: 'user', text: "I'm in Springfield. The roads on our street are terrible and there's a new warehouse development that's going to make traffic even worse." },
      { role: 'bot',  text: "Springfield — Jeromie has been spending a lot of time there, especially after the district lost $47 million in public school funding this year alone. Infrastructure is a huge issue he's hearing about across the city. I want to make sure I capture the full picture: when you mention the warehouse development, is this the proposed distribution center on Page Boulevard? And on the roads — are we talking potholes and surface damage, or mostly congestion during morning and evening rush?" },
      { role: 'user', text: "Both, honestly. The potholes on Belmont Ave are bad, and that warehouse will add 300+ trucks a day to streets that already can't handle it." },
      { role: 'bot',  text: "That context is really valuable — you're the 11th Springfield resident this month to flag the Page Boulevard project, which tells us this is a district-wide priority. Two quick questions so Jeromie's team can represent your view accurately: 1) Would you support the development if it came with a road improvement and traffic mitigation plan? 2) On a scale of 1–5, how bad is road safety on Belmont Ave right now? Jeromie's platform includes expanding public transportation and investing in local infrastructure across Western Mass — your input feeds directly into how he prioritizes that." },
    ],
  },
  {
    id: 'action', label: 'Guide to Action', emoji: '📢',
    messages: [
      { role: 'user', text: "I keep hearing about Jeromie's education platform. What's he actually proposing?" },
      { role: 'bot',  text: "Great question. Jeromie spent 11 years as a public school teacher at Northampton High School, so this one is personal for him. His Solutions platform calls for fully funding public schools, paying teachers more, providing universal Pre-K, and making community college and vocational schooling tuition-free. He's also pushing to restore the Department of Education after it was abolished. What aspect matters most to you — are you a parent, an educator, or a concerned resident?" },
      { role: 'user', text: "I'm a parent. My kids' school is overcrowded and they just cut the music program." },
      { role: 'bot',  text: "As a parent experiencing that firsthand, your voice carries real weight. Which school do your kids attend? This year Massachusetts lost $108 million in public school funding — $47 million of that in Springfield alone — and Jeromie has been pulling together parents across Western Mass to speak out. Two concrete things that would move the needle: 1) Add your name to the parent coalition — takes about 30 seconds 2) Send us a one-sentence note about how the cuts have affected your kids. Would you like me to sign you up right now? I just need your name and email." },
      { role: 'user', text: "Yes — Sarah Mitchell, sarah.m@email.com" },
      { role: 'bot',  text: "Done, Sarah — you're in. Expect an email within 24 hours with details and talking points Jeromie's team has prepared. One more thing: delegations from the same school carry a lot of weight with state reps. Do you know 2–3 other parents at your school who'd come? I can send you a shareable invite link right now. A group from Forest Park Elementary showed up 15 strong last cycle and it directly shaped the committee vote." },
    ],
  },
  {
    id: 'donation', label: 'Guide to Donation', emoji: '💰',
    messages: [
      { role: 'user', text: "I really like what Jeromie is doing on workers' rights and union issues." },
      { role: 'bot',  text: "That's at the core of his campaign — Jeromie was a proud member of the Northampton Association of School Employees for over a decade and has been fighting for organized labor since his twenties. His platform includes passing the PRO Act, guaranteeing card check recognition, and extending labor rights to gig and misclassified workers. What resonates most with you: protecting collective bargaining, expanding union access, or the push to ban captive audience meetings?" },
      { role: 'user', text: "The collective bargaining stuff. I'm a union electrician and our local has been trying to grow our apprenticeship program for years." },
      { role: 'bot',  text: "That's exactly the kind of story Jeromie needs to tell. He's pushing for the PRO Act specifically because it would ban employer interference in organizing and end right-to-work laws that weaken locals like yours. He also wants to promote union access and neutrality agreements for federal contractors. Would you be open to a short testimonial? Real voices from the trades are how he makes the case to colleagues in Washington. Also, I want to be straight with you: Richie Neal is one of the top recipients of corporate PAC money in all of Congress — 75% of his funding comes from big banks and corporate lobbyists. Jeromie refuses all corporate money and runs entirely on grassroots donations. Even a $25 contribution helps him stay competitive against that. Would you like me to send the direct donation link?" },
      { role: 'user', text: "Yeah, I can do $50 actually." },
      { role: 'bot',  text: "That means a lot — thank you. Here's your secure link: [secure.actblue.com/donate/whalenforcongress]. Every dollar funds direct outreach across MA-01. And I wasn't kidding about the testimonial — Jeromie's team does regular calls with union members across the district. If you're up for a 10-minute conversation, it could end up shaping how he talks about labor on the trail. Can I pass your contact along?" },
    ],
  },
];

const SCENARIO_ICONS = { data: Target, action: Megaphone, donation: DollarSign };

function buildScenarios(candidateName, stafferName) {
  const nameParts = candidateName.split(' ');
  const candidateFirstName = nameParts[0];
  const candidateLastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const stafferFirstName = stafferName.split(' ')[0];
  const replace = (text) => text
    .replace(/Jeromie Whalen/g, candidateName)
    .replace(/Jeromie's/g, `${candidateFirstName}'s`)
    .replace(/Jeromie/g, candidateFirstName)
    .replace(/Whalen for Congress/g, `${candidateName} for Congress`)
    .replace(/Whalen/g, candidateLastName)
    .replace(/Alex Rivera/g, stafferName)
    .replace(/\bAlex\b/g, stafferFirstName);
  return SCENARIOS.map((s) => ({
    ...s,
    messages: s.messages.map((m) => ({ ...m, text: replace(m.text) })),
  }));
}

function getInitials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
}

function extractCandidateName(representing) {
  return representing.replace(/\s+for\s+.*/i, '').trim() || representing;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CHART_COLORS = {
  Infrastructure: '#1B4DFF',
  Education:      '#00E5A0',
  Climate:        '#10B981',
  Healthcare:     '#F59E0B',
  Housing:        '#EF4444',
};

// ── WIPP LOGO ─────────────────────────────────────────────────────────────────

function WippLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
        style={{ background: '#1B4DFF' }}>
        <Zap className="w-4 h-4 text-white" />
      </div>
      <span className="font-semibold text-lg tracking-tight" style={{ color: '#0B1D3A' }}>
        wipp
      </span>
    </div>
  );
}

// ── CAMPAIGN ASSETS ───────────────────────────────────────────────────────────


// ── SECTION HEADER (Phase 1) ──────────────────────────────────────────────────

function SectionHeader({ n, label }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-semibold flex-shrink-0 text-white"
        style={{ background: '#1B4DFF' }}>
        {n}
      </span>
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#6B7280' }}>
        {label}
      </span>
    </div>
  );
}

// ── PHASE 1: SETUP ────────────────────────────────────────────────────────────

function Phase1({ onNext }) {
  const [selectedTone, setSelectedTone] = useState(1);
  const [copied, setCopied] = useState(false);
  const [stafferName, setStafferName] = useState('Alex Rivera');
  const [representing, setRepresenting] = useState('Jeromie Whalen for Congress');
  const [files, setFiles] = useState([
    { name: 'policy_platform_2026.pdf',   size: '2.4 MB' },
    { name: 'voting_record.csv',           size: '890 KB' },
    { name: 'town_hall_transcripts.docx', size: '5.1 MB' },
  ]);

  const tones = [
    'Professional & Authoritative',
    'Warm & Approachable',
    'Grassroots & Passionate',
    'Data-Driven & Precise',
  ];

  const slug = representing.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const embedCode = `<script src="https://cdn.wipp.ai/widget/${slug}-staffer.js" async></script>`;

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const addFakeFile = () => {
    const pool = [
      { name: 'constituent_survey_q1.csv',  size: '1.2 MB' },
      { name: 'campaign_speeches_2024.pdf', size: '3.8 MB' },
      { name: 'endorsements.docx',          size: '780 KB' },
      { name: 'budget_positions.pdf',       size: '2.1 MB' },
    ];
    setFiles((p) => [...p, pool[p.length % pool.length]]);
  };

  const extColor = (name) => {
    const ext = name.split('.').pop();
    if (ext === 'pdf') return '#EF4444';
    if (ext === 'csv') return '#10B981';
    return '#1B4DFF';
  };

  return (
    <div className="min-h-screen phase-enter" style={{ background: '#F9FAFB' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white"
        style={{ borderBottom: '1px solid #E5E7EB' }}>
        <WippLogo />
        <div className="flex items-center gap-2 text-xs rounded px-3 py-1.5"
          style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
          Setup Mode
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Title */}
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#1B4DFF' }}>Configure</p>
          <h1 className="font-display text-4xl font-bold leading-tight mb-3" style={{ color: '#0B1D3A' }}>
            Deploy Your AI Staffer
          </h1>
          <p style={{ color: '#6B7280' }}>Configure your constituent engagement system in minutes.</p>
        </div>

        {/* ── 1: Identity ── */}
        <div className="card p-7 mb-4">
          <SectionHeader n="1" label="Staffer Identity" />
          <div className="flex gap-6 items-start">
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-white relative"
                style={{ background: '#1B4DFF', border: '2px solid #E5E7EB' }}>
                {getInitials(stafferName) || 'AI'}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                  style={{ background: '#22C55E', border: '2px solid #fff' }} />
              </div>
              <button className="text-xs rounded px-3 py-1 transition-colors"
                style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                Upload Photo
              </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#6B7280' }}>Staffer Name</label>
                <input value={stafferName} onChange={(e) => setStafferName(e.target.value)}
                  className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none"
                  style={{ background: '#fff', border: '1px solid #D1D5DB', color: '#111827' }} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#6B7280' }}>Representing</label>
                <input value={representing} onChange={(e) => setRepresenting(e.target.value)}
                  className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none"
                  style={{ background: '#fff', border: '1px solid #D1D5DB', color: '#111827' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2: Training ── */}
        <div className="card p-7 mb-4">
          <SectionHeader n="2" label="Platform Training" />
          <div className="upload-zone border-2 border-dashed rounded-lg p-7 text-center cursor-pointer mb-4"
            style={{ borderColor: '#D1D5DB' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFakeFile(); }}
            onClick={addFakeFile}>
            <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: '#9CA3AF' }} />
            <p className="text-sm" style={{ color: '#6B7280' }}>Drag & drop policy documents, voting records, speeches</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>PDF, DOCX, CSV, TXT — click to add a demo file</p>
          </div>

          <div className="space-y-2 mb-4">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-4 py-3 animate-msg-in"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: extColor(f.name) }}>
                    {f.name.split('.').pop().toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-none" style={{ color: '#111827' }}>{f.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{f.size}</p>
                  </div>
                </div>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#22C55E' }} />
              </div>
            ))}
          </div>

          <div className="rounded-lg px-4 py-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium" style={{ color: '#16A34A' }}>Training Complete</span>
              <span className="text-sm font-semibold" style={{ color: '#16A34A' }}>100%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: '#D1FAE5' }}>
              <div className="h-full rounded-full" style={{ width: '100%', background: '#22C55E' }} />
            </div>
            <p className="text-xs mt-1.5" style={{ color: '#4ADE80' }}>
              Platform analysis complete — 847 policy positions indexed
            </p>
          </div>
        </div>

        {/* ── 3: Tone ── */}
        <div className="card p-7 mb-4">
          <SectionHeader n="3" label="Communication Tone" />
          <div className="grid grid-cols-2 gap-3">
            {tones.map((t, i) => (
              <button key={i} onClick={() => setSelectedTone(i)}
                className="text-left p-4 rounded-lg border transition-colors"
                style={selectedTone === i
                  ? { background: '#EFF6FF', borderColor: '#1B4DFF' }
                  : { background: '#fff', borderColor: '#E5E7EB' }}>
                <p className="text-sm font-medium" style={{ color: selectedTone === i ? '#1B4DFF' : '#374151' }}>{t}</p>
                {selectedTone === i && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Check className="w-3 h-3" style={{ color: '#1B4DFF' }} />
                    <span className="text-xs" style={{ color: '#1B4DFF' }}>Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── 4: Embed ── */}
        <div className="card p-7 mb-8">
          <SectionHeader n="4" label="Embed Code" />
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Add this snippet to your campaign site's <code className="font-mono text-xs px-1.5 py-0.5 rounded"
              style={{ background: '#F3F4F6', color: '#1B4DFF', border: '1px solid #E5E7EB' }}>&lt;head&gt;</code> tag.
          </p>
          <div className="relative rounded-lg p-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <code className="font-mono text-xs break-all leading-relaxed block pr-20" style={{ color: '#1B4DFF' }}>
              {embedCode}
            </code>
            <button onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded transition-colors"
              style={copied
                ? { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }
                : { background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB' }}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => onNext({ stafferName, representing })}
          className="btn-primary w-full font-medium py-3.5 rounded-md flex items-center justify-center gap-2 text-sm">
          Deploy Staffer &amp; Preview
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── CHAT WIDGET ───────────────────────────────────────────────────────────────

function ChatWidget({ stafferName, representing, onShowDashboard }) {
  const candidateName = extractCandidateName(representing);
  const candidateFirstName = candidateName.split(' ')[0];
  const stafferInitials = getInitials(stafferName);
  const stafferFirstName = stafferName.split(' ')[0];
  const scenarios = buildScenarios(candidateName, stafferName);

  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [scenarioMsgs, setScenarioMsgs] = useState(() => scenarios.map(() => []));
  const [typingIdx, setTypingIdx] = useState(null);
  const playedRef = useRef(new Set());
  const endRef = useRef(null);

  const playScenario = useCallback(async (idx) => {
    if (playedRef.current.has(idx)) return;
    playedRef.current.add(idx);

    const disclaimer = {
      role: 'bot',
      text: `Hi! Just so you know — I'm an AI staffer. I've already pinged a real member of ${candidateFirstName}'s team who will follow up with you directly. In the meantime, I'm here to answer any questions and help however I can. What's on your mind?`,
    };
    setTypingIdx(idx);
    await sleep(2200);
    setTypingIdx(null);
    await sleep(100);
    setScenarioMsgs((prev) => prev.map((a, si) => si === idx ? [...a, disclaimer] : a));
    await sleep(1600);

    const msgs = scenarios[idx].messages;
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      if (m.role === 'bot') {
        setTypingIdx(idx);
        await sleep(Math.min(2800 + m.text.length * 6, 6000));
        setTypingIdx(null);
        await sleep(100);
      } else {
        await sleep(2000);
      }
      setScenarioMsgs((prev) => prev.map((a, si) => si === idx ? [...a, m] : a));
      if (m.role === 'user') await sleep(1000);
    }
  }, []);

  useEffect(() => { if (isOpen) playScenario(0); }, [isOpen, playScenario]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [scenarioMsgs, typingIdx]);

  const switchScenario = (idx) => { setActiveScenario(idx); playScenario(idx); };

  // +1 accounts for the disclaimer message prepended to each scenario
  const allDone = scenarios.every((s, i) => scenarioMsgs[i].length === s.messages.length + 1);
  const currentMsgs = scenarioMsgs[activeScenario] || [];
  const showTyping = typingIdx === activeScenario;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="chat-expand-anim mb-3 overflow-hidden flex flex-col rounded-xl"
          style={{ width: 380, height: 540, background: '#fff', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>

          {/* Header */}
          <div className="p-4 flex-shrink-0" style={{ background: '#0B1D3A', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold relative"
                  style={{ background: '#1B4DFF' }}>
                  {stafferInitials}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: '#22C55E', border: '2px solid #0B1D3A' }} />
                </div>
                <div>
                  <div className="text-sm font-medium leading-none text-white">{stafferName}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>AI Policy Advisor</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="transition-colors hover:opacity-70 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scenario tabs */}
            <div className="flex gap-1">
              {scenarios.map((s, i) => {
                const Icon = SCENARIO_ICONS[s.id];
                return (
                  <button key={i} onClick={() => switchScenario(i)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 px-1 rounded transition-colors font-medium truncate"
                    style={activeScenario === i
                      ? { background: '#1B4DFF', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll" style={{ background: '#F9FAFB' }}>
            {currentMsgs.map((m, i) => (
              <div key={i} className={`flex animate-msg-in ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-white text-xs font-semibold"
                    style={{ background: '#1B4DFF' }}>
                    {stafferFirstName[0]}
                  </div>
                )}
                <div className="max-w-xs px-3.5 py-2.5 text-sm leading-relaxed rounded-xl"
                  style={m.role === 'user'
                    ? { background: '#1B4DFF', color: '#fff' }
                    : { background: '#fff', color: '#111827', border: '1px solid #E5E7EB' }}>
                  {m.text}
                </div>
              </div>
            ))}

            {showTyping && (
              <div className="flex items-center gap-2 animate-msg-in">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: '#1B4DFF' }}>
                  {stafferFirstName[0]}
                </div>
                <div className="px-4 py-3 rounded-xl bg-white" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="flex gap-1.5 items-center h-3">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full block" style={{ background: '#1B4DFF' }} />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full block" style={{ background: '#1B4DFF' }} />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full block" style={{ background: '#1B4DFF' }} />
                  </div>
                </div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>{stafferFirstName} is typing…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-3 bg-white" style={{ borderTop: '1px solid #E5E7EB' }}>
            {allDone ? (
              <button onClick={onShowDashboard}
                className="btn-primary w-full text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-2">
                View Analytics Dashboard
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input disabled placeholder={`Message ${stafferName}…`}
                  className="flex-1 text-sm px-3 py-2 rounded-md cursor-not-allowed"
                  style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#9CA3AF' }} />
                <button className="w-8 h-8 rounded-md flex items-center justify-center opacity-40 cursor-not-allowed"
                  style={{ background: '#1B4DFF' }}>
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}
            <p className="text-center text-xs mt-2" style={{ color: '#D1D5DB' }}>
              Powered by <span className="font-medium" style={{ color: '#9CA3AF' }}>wipp</span>
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
        style={{ background: isOpen ? '#1642E8' : '#1B4DFF', boxShadow: '0 4px 16px rgba(27,77,255,0.35)' }}>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}

// ── PHASE 2: CAMPAIGN SITE ────────────────────────────────────────────────────

function Phase2({ representing }) {
  const [bannerVisible, setBannerVisible] = useState(true);

  const candidateName = extractCandidateName(representing);
  const candidateFirstName = candidateName.split(' ')[0];
  const candidateInitials = getInitials(candidateName);

  const solutions = [
    { Icon: Building2, title: 'Workers & Unions',
      desc: 'Protect collective bargaining, expand apprenticeship programs, and ensure every working family earns a living wage.' },
    { Icon: BookOpen, title: 'Education',
      desc: 'Fully fund public schools, restore arts and trades programs, and pay educators what they deserve.' },
    { Icon: Leaf, title: 'Environment',
      desc: 'Invest in clean energy infrastructure and protect local land, water, and air for future generations.' },
    { Icon: HeartPulse, title: 'Healthcare',
      desc: 'Fight for affordable prescription drugs, expand access to care, and protect reproductive rights.' },
  ];

  const DARK = '#1C2333';
  const SECTION = '#222E42';
  const ACCENT = '#CBD5E1';
  const FOOTER_BG = '#131923';

  return (
    <div className="min-h-screen phase-enter" style={{ background: DARK }}>

      {/* Announcement bar */}
      {bannerVisible && (
        <div className="flex items-center justify-center px-6 py-2.5 text-xs font-semibold tracking-widest uppercase relative"
          style={{ background: ACCENT, color: DARK }}>
          Learn more about {candidateFirstName}'s platform
          <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
          <button onClick={() => setBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100 opacity-60">
            <X className="w-3.5 h-3.5" style={{ color: DARK }} />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-40" style={{ background: DARK, borderBottom: `1px solid rgba(203,213,225,0.15)` }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
          <div className="flex-shrink-0">
            <div className="font-bold text-xl tracking-tight uppercase"
              style={{ color: ACCENT, fontFamily: 'IBM Plex Serif, serif' }}>
              {candidateName}
            </div>
            <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>
              {representing}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.7)' }}>
            {['Home', 'About', 'Platform', 'Events', 'Endorsements', 'Contact', 'Store'].map((l, i) => (
              <a key={l} href="#" className="transition-colors"
                style={i === 0 ? { color: ACCENT } : { color: 'rgba(255,255,255,0.7)' }}>
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="text-xs font-semibold tracking-widest uppercase px-5 py-2 transition-colors"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent' }}>
              Donate
            </button>
            <button className="text-xs font-semibold tracking-widest uppercase px-5 py-2 transition-colors"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent' }}>
              Volunteer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: DARK, minHeight: '520px' }}>
        {/* City skyline silhouette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.15 }}>
          <svg viewBox="0 0 1400 400" preserveAspectRatio="xMidYMax meet"
            className="absolute bottom-0 w-full" fill="rgba(255,255,255,0.5)">
            <rect x="0"   y="200" width="80"  height="200"/><rect x="40"  y="140" width="50"  height="260"/>
            <rect x="90"  y="180" width="70"  height="220"/><rect x="160" y="100" width="60"  height="300"/>
            <rect x="220" y="160" width="90"  height="240"/><rect x="310" y="170" width="80"  height="230"/>
            <rect x="390" y="90"  width="70"  height="310"/><rect x="460" y="150" width="60"  height="250"/>
            <rect x="520" y="110" width="90"  height="290"/><rect x="610" y="170" width="70"  height="230"/>
            <rect x="680" y="130" width="50"  height="270"/><rect x="730" y="200" width="80"  height="200"/>
            <rect x="810" y="160" width="60"  height="240"/><rect x="870" y="100" width="75"  height="300"/>
            <rect x="945" y="180" width="90"  height="220"/><rect x="1035" y="140" width="60" height="260"/>
            <rect x="1095" y="190" width="80" height="210"/><rect x="1175" y="120" width="70" height="280"/>
            <rect x="1245" y="160" width="90" height="240"/><rect x="1335" y="200" width="65" height="200"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 flex items-center gap-12">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold leading-none mb-2 uppercase tracking-tight"
              style={{ fontFamily: 'IBM Plex Serif, serif', color: ACCENT, fontSize: '3.5rem' }}>
              {candidateName}
            </h1>
            <h2 className="font-bold leading-none uppercase"
              style={{ fontFamily: 'IBM Plex Serif, serif', color: '#FFFFFF', fontSize: '4rem', lineHeight: 1.05 }}>
              Our Time.<br />Our Movement.
            </h2>
            <div className="flex items-center gap-4 mt-10">
              {['Donate', 'Volunteer', 'Store'].map((label) => (
                <button key={label}
                  className="font-semibold tracking-widest uppercase px-8 py-3 text-sm transition-colors"
                  style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent', minWidth: 140 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate photo placeholder */}
          <div className="flex-shrink-0 overflow-hidden"
            style={{ width: 380, height: 420, background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(203,213,225,0.2)` }}>
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{ background: 'rgba(203,213,225,0.15)', color: ACCENT, border: `2px solid rgba(203,213,225,0.4)` }}>
                {candidateInitials}
              </div>
              <p className="font-semibold text-sm" style={{ color: ACCENT }}>{candidateName}</p>
              <p className="text-xs text-white opacity-50">{representing}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet candidate */}
      <section className="py-20 px-8" style={{ background: SECTION }}>
        <div className="max-w-7xl mx-auto flex items-center gap-16">
          <div className="flex-1">
            <h2 className="font-bold uppercase mb-5 leading-tight"
              style={{ fontFamily: 'IBM Plex Serif, serif', color: ACCENT, fontSize: '2.5rem' }}>
              Meet {candidateName}
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 500 }}>
              A commitment to community, hard work, and showing up for the people who need it most. These values form the foundation of this campaign — and they'll guide every decision made in office.
            </p>
            <button className="font-semibold tracking-widest uppercase px-6 py-3 text-sm transition-colors"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent' }}>
              Learn More
            </button>
          </div>

          <div className="flex-shrink-0 overflow-hidden relative"
            style={{ width: 500, height: 320, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(203,213,225,0.2)` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(203,213,225,0.1)', borderColor: ACCENT }}>
                <div className="w-0 h-0 ml-1"
                  style={{ borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: `16px solid ${ACCENT}` }} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
              <p className="text-sm font-medium text-white">{candidateName} — Our Time, Our Movement</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Campaign launch video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 px-8" style={{ background: DARK, borderTop: `1px solid rgba(203,213,225,0.1)` }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold uppercase mb-2 text-center"
            style={{ fontFamily: 'IBM Plex Serif, serif', color: ACCENT, fontSize: '2.2rem' }}>
            {candidateFirstName}'s Platform
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            A platform built on results, not rhetoric.
          </p>
          <div className="grid grid-cols-4 gap-4">
            {solutions.map((s, i) => (
              <div key={i} className="p-5 transition-colors hover:bg-opacity-80"
                style={{ background: SECTION, border: `1px solid rgba(203,213,225,0.15)` }}>
                <s.Icon className="w-5 h-5 mb-3" style={{ color: ACCENT }} />
                <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide" style={{ color: ACCENT }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="font-semibold tracking-widest uppercase px-6 py-3 text-sm transition-colors"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent' }}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-14 px-8" style={{ background: SECTION, borderTop: `1px solid rgba(203,213,225,0.1)` }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold uppercase mb-8 text-center"
            style={{ fontFamily: 'IBM Plex Serif, serif', color: ACCENT, fontSize: '2rem' }}>
            Events
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { month: 'APR', day: '5',  title: 'Community Town Hall',     location: 'City Community Center', time: '6:30 PM' },
              { month: 'APR', day: '12', title: 'Neighborhood Canvass',    location: 'City Hall Plaza', time: '10:00 AM' },
              { month: 'APR', day: '22', title: 'Earth Day Rally',         location: 'Riverfront Park', time: '12:00 PM' },
            ].map((ev, i) => (
              <div key={i} className="p-4 flex gap-4"
                style={{ background: DARK, border: `1px solid rgba(203,213,225,0.2)`, borderLeft: `3px solid ${ACCENT}` }}>
                <div className="text-center px-3 py-2 min-w-[50px] flex-shrink-0"
                  style={{ background: 'rgba(203,213,225,0.08)', border: `1px solid rgba(203,213,225,0.2)` }}>
                  <div className="text-xs font-semibold" style={{ color: ACCENT }}>{ev.month}</div>
                  <div className="text-xl font-bold leading-none text-white">{ev.day}</div>
                </div>
                <div>
                  <p className="font-semibold text-sm leading-snug text-white">{ev.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{ev.location} · {ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Movement */}
      <section className="py-14 px-8 text-center" style={{ background: DARK, borderTop: `1px solid rgba(203,213,225,0.1)` }}>
        <h2 className="font-bold uppercase mb-3"
          style={{ fontFamily: 'IBM Plex Serif, serif', color: ACCENT, fontSize: '2.5rem' }}>
          Join the Movement
        </h2>
        <p className="text-sm mb-8 uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Our campaign is growing every day
        </p>
        <div className="flex items-center justify-center gap-4">
          {['Donate', 'Volunteer', 'Store'].map((label) => (
            <button key={label}
              className="font-semibold tracking-widest uppercase px-8 py-3 text-sm transition-colors"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent', minWidth: 140 }}>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8" style={{ background: FOOTER_BG, borderTop: `1px solid rgba(203,213,225,0.15)` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="font-bold text-base uppercase"
              style={{ color: ACCENT, fontFamily: 'IBM Plex Serif, serif' }}>
              {candidateName}
            </div>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Paid for by {representing}</p>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            {['Volunteer', 'Donate', 'Store', 'Contact'].map((l) => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => e.target.style.color = ACCENT}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── PHASE 3: DASHBOARD ────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, delta, positive }) {
  return (
    <div className="rounded-lg p-5 bg-white" style={{ border: '1px solid #E5E7EB' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded flex items-center justify-center"
          style={{ background: '#EFF6FF' }}>
          <Icon className="w-4 h-4" style={{ color: '#1B4DFF' }} />
        </div>
        {delta && (
          <span className="text-xs font-medium px-2 py-0.5 rounded"
            style={positive !== false
              ? { background: '#F0FDF4', color: '#16A34A' }
              : { background: '#FEF2F2', color: '#DC2626' }}>
            {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold mb-0.5" style={{ color: '#111827' }}>{value}</div>
      <div className="text-xs" style={{ color: '#6B7280' }}>{label}</div>
    </div>
  );
}

const CHART_TOOLTIP = {
  contentStyle: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 12, color: '#111827' },
  labelStyle: { color: '#111827' },
  itemStyle: { color: '#374151' },
};

function Phase3({ onBack, representing }) {
  return (
    <div className="min-h-screen phase-enter" style={{ background: '#F9FAFB' }}>

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white"
        style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-5">
          <WippLogo />
          <div style={{ color: '#E5E7EB' }}>|</div>
          <div>
            <span className="text-sm font-medium" style={{ color: '#111827' }}>Constituent Intelligence Dashboard</span>
            <span className="ml-2 text-xs" style={{ color: '#6B7280' }}>{representing}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs rounded px-3 py-1.5"
            style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
            Live
          </div>
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-xs rounded px-3 py-1.5 transition-colors hover:border-blue-400"
            style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Setup
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-6 gap-4">
          <StatCard icon={MessageCircle} label="Total Conversations"    value="12,847" delta="↑ 23% this week" positive />
          <StatCard icon={HelpCircle}    label="Avg Questions / Session" value="4.2" />
          <StatCard icon={TrendingUp}    label="Growth This Week"        value="+1,847" />
          <StatCard icon={Clock}         label="Avg Response Time"       value="1.2s" />
          <StatCard icon={DollarSign}    label="Donations Collected"     value="$47,250" delta="↑ 18%" positive />
          <StatCard icon={Users}         label="Volunteers Onboarded"    value="342" delta="↑ 31%" positive />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-lg p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>Priority Trends Over Time</h3>
            <p className="text-xs mb-5" style={{ color: '#6B7280' }}>Weekly volume by issue — last 8 weeks</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={PRIORITY_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
                {Object.entries(CHART_COLORS).map(([key, col]) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={col} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>Peak Engagement Times</h3>
            <p className="text-xs mb-5" style={{ color: '#6B7280' }}>Hourly volume across a typical day</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={PEAK_ENGAGEMENT_DATA} barSize={9}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Bar dataKey="v" name="Conversations" radius={[3, 3, 0, 0]}>
                  {PEAK_ENGAGEMENT_DATA.map((_, i) => (
                    <Cell key={i} fill={[8, 9, 13, 19, 20].includes(i) ? '#1B4DFF' : '#BFDBFE'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-lg p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>Demographic Breakdown</h3>
            <p className="text-xs mb-4" style={{ color: '#6B7280' }}>Age distribution of constituent conversations</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={DEMOGRAPHIC_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                    dataKey="value" paddingAngle={2}>
                    {DEMOGRAPHIC_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {DEMOGRAPHIC_DATA.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs" style={{ color: '#6B7280' }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#111827' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>Geographic Distribution</h3>
            <p className="text-xs mb-5" style={{ color: '#6B7280' }}>Top neighborhoods by conversation volume</p>
            <div className="space-y-3">
              {GEO_DATA.map((g) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#6B7280' }}>{g.name}</span>
                    <span className="text-xs font-semibold" style={{ color: '#111827' }}>{g.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${g.pct}%`, background: g.name === 'Riverside' ? '#1B4DFF' : '#BFDBFE' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-lg p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>Topic Sentiment Analysis</h3>
            <p className="text-xs mb-5" style={{ color: '#6B7280' }}>Positive / neutral / negative by issue</p>
            <div className="space-y-4">
              {SENTIMENT_DATA.map((s) => (
                <div key={s.issue}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: '#111827' }}>{s.issue}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span style={{ color: '#16A34A' }}>{s.positive}%</span>
                      <span style={{ color: '#6B7280' }}>{s.neutral}%</span>
                      <span style={{ color: '#DC2626' }}>{s.negative}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden flex">
                    <div style={{ width: `${s.positive}%`, background: '#22C55E' }} />
                    <div style={{ width: `${s.neutral}%`, background: '#E5E7EB' }} />
                    <div style={{ width: `${s.negative}%`, background: '#EF4444' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>Conversion Funnel</h3>
            <p className="text-xs mb-5" style={{ color: '#6B7280' }}>From first message to action</p>
            <div className="space-y-3">
              {FUNNEL_DATA.map((f, i) => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#6B7280' }}>{f.stage}</span>
                    <span className="text-sm font-semibold" style={{ color: '#111827' }}>{f.value.toLocaleString()}</span>
                  </div>
                  <div className="h-6 rounded overflow-hidden" style={{ background: '#F3F4F6' }}>
                    <div className="h-full rounded flex items-center px-3"
                      style={{ width: `${f.pct}%`, background: `rgba(27,77,255,${1 - i * 0.16})`, minWidth: f.pct > 0 ? 44 : 0 }}>
                      <span className="text-xs font-medium text-white">{f.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-xs" style={{ color: '#D1D5DB' }}>
            Wipp Intelligence Platform · Data refreshed live · All constituent data anonymized and compliant
          </p>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState(1);
  const [campaignData, setCampaignData] = useState({
    stafferName: 'Alex Rivera',
    representing: 'Jeromie Whalen for Congress',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; font-family: 'IBM Plex Sans', system-ui, sans-serif; background: #F9FAFB; }
        .font-display  { font-family: 'IBM Plex Serif', Georgia, serif; }
        .font-mono     { font-family: 'IBM Plex Mono', monospace; }

        /* Cards */
        .card { background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; }

        /* Buttons */
        .btn-primary { background: #1B4DFF; color: #fff; transition: background 150ms ease; }
        .btn-primary:hover { background: #1642E8; }

        /* Upload zone */
        .upload-zone { transition: border-color 150ms ease; }
        .upload-zone:hover { border-color: #1B4DFF !important; }

        /* Chat scroll */
        .chat-scroll { scrollbar-width: thin; scrollbar-color: #E5E7EB transparent; }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }

        /* ── Animations (minimal set) ── */

        @keyframes phase-enter-kf {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .phase-enter { animation: phase-enter-kf 0.3s ease both; }

        @keyframes msg-in-kf {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-msg-in { animation: msg-in-kf 0.2s ease both; }

        @keyframes chat-expand-kf {
          from { opacity: 0; transform: scale(0.96) translateY(8px); transform-origin: bottom right; }
          to   { opacity: 1; transform: scale(1) translateY(0); transform-origin: bottom right; }
        }
        .chat-expand-anim { animation: chat-expand-kf 0.2s ease both; }

        /* Typing dots — opacity pulse only */
        @keyframes typing-pulse-kf {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 1; }
        }
        .typing-dot { display: inline-block; }
        .typing-dot:nth-child(1) { animation: typing-pulse-kf 1.2s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation: typing-pulse-kf 1.2s ease-in-out 0.22s infinite; }
        .typing-dot:nth-child(3) { animation: typing-pulse-kf 1.2s ease-in-out 0.44s infinite; }
      `}</style>

      {phase === 1 && <Phase1 onNext={(data) => { setCampaignData(data); setPhase(2); }} />}
      {phase === 2 && <Phase2 representing={campaignData.representing} />}
      {phase === 3 && <Phase3 onBack={() => setPhase(1)} representing={campaignData.representing} />}

      {phase === 2 && (
        <>
          <div className="fixed bottom-24 right-6 text-xs px-3 py-1.5 rounded z-40 pointer-events-none"
            style={{ background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            Chat with {campaignData.stafferName}
          </div>
          <ChatWidget
            stafferName={campaignData.stafferName}
            representing={campaignData.representing}
            onShowDashboard={() => setPhase(3)}
          />
        </>
      )}
    </>
  );
}
