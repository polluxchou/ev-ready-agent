import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { AGENTS, AgentTile, Icon } from './components';
import type { AgentColor, AgentId, IconName } from './components';
import sc02 from './assets/sc02.png';

// =============================================================================
// PHASES — the 4-step buyer journey
// =============================================================================

type Phase = 'reserve' | 'install' | 'service' | 'warranty';

type PhaseDef = {
  id: Phase;
  agentId: AgentId;
  label: string;
  sub: string;
  code: string;
};

const PHASES: PhaseDef[] = [
  { id: 'reserve', agentId: 'parking', label: 'Reservation check', sub: 'Address & home-charging feasibility', code: 'PD' },
  { id: 'install', agentId: 'charging', label: 'Wallbox install', sub: 'Building approval & certified installer', code: 'CC' },
  { id: 'service', agentId: 'service', label: 'Service network', sub: 'Local EV-friendly garages pre-confirmed', code: 'SN' },
  { id: 'warranty', agentId: 'warranty', label: 'Warranty file', sub: 'Coverage active before delivery', code: 'WC' },
];

const phaseIndex = (p: Phase): number => PHASES.findIndex((d) => d.id === p);

// First turn ID for each phase — used when user clicks a phase node to jump
const PHASE_ENTRY: Record<Phase, string> = {
  reserve: 't1',
  install: 't4',
  service: 't7',
  warranty: 't9',
};

// =============================================================================
// CITIES — three sample addresses the buyer can swap in
// =============================================================================

type CityId = 'volpiano' | 'massapequa' | 'torinoCentro';
type Region = 'IT' | 'US';

type CityData = {
  id: CityId;
  region: Region;
  label: string;
  address: string;
  zip: string;
  // map
  housing: string;
  housingShort: string;
  buildingTag: string;
  streetLabel: string;
  pins: { x: number; y: number; fast?: boolean }[];
  // charging context
  chargers: number;
  chargerNote: string;
  subpanel: string;
  // approval / regulatory
  feasibility: 'high' | 'medium';
  feasibilityLabel: string;
  approvalPath: string; // short label for grid
  permitForm: string; // long-form form name
  utility: string; // grid operator name
  installerCert: string; // installer certification
  // subsidy / incentive
  subsidy: string; // label for grid
  subsidyDetail: string; // full sentence used by CC agent
  // money / time
  currency: '€' | '$';
  installCost: string;
  installTimeline: string;
  // narrative
  score: number;
  feasibilityNarrative: string;
  catch: string;
  // service / warranty locale
  serviceCity: string; // city name shown in service phase
  insuranceNote: string; // surfaced in warranty/insurance step
};

const CITIES: Record<CityId, CityData> = {
  // ───── REAL knowledge-base-backed: Volpiano (TO), Italy
  volpiano: {
    id: 'volpiano',
    region: 'IT',
    label: 'Volpiano (TO)',
    address: 'Via Trieste 14, 10088 Volpiano TO',
    zip: '10088',
    housing: 'Villetta a schiera · 2 piani · box auto privato',
    housingShort: 'Villetta · box privato',
    buildingTag: 'V14',
    streetLabel: 'VIA TRIESTE · VOLPIANO',
    pins: [
      { x: 140, y: 80 },
      { x: 280, y: 95 },
      { x: 95, y: 180 },
      { x: 260, y: 200 },
      { x: 175, y: 215 },
      { x: 320, y: 150, fast: true },
      { x: 130, y: 245 },
    ],
    chargers: 7,
    chargerNote: 'AC + 1 DC fast (SR11)',
    subpanel: 'sottoquadro box · OK',
    feasibility: 'high',
    feasibilityLabel: 'HIGH FEASIBILITY',
    approvalPath: 'Edilizia libera (DPR 380/01 art.6)',
    permitForm: 'Edilizia libera — nessuna pratica SUE; Di.Co. installatore DM 37/2008',
    utility: 'e-distribuzione',
    installerCert: 'CCIAA · DM 37/2008 lett. a)',
    subsidy: 'Ecobonus 50% · 3.000 €',
    subsidyDetail:
      "Italian Ecobonus 50% detrazione IRPEF — up to €3,000 per charge point, deducted over 10 years. Live through 31 Dec 2026. You also have a 1-shot at the MIMIT Bonus Colonnine click-day (80% / €1,500) but the two aren't cumulable.",
    currency: '€',
    installCost: '1.500 – 3.000 €',
    installTimeline: '4–6 weeks · 7–10 days for villetta',
    score: 91,
    feasibilityNarrative:
      "Best-case Italian profile. Volpiano sits in the prima cintura of Torino — your villetta has a private garage with its own subpanel, so there's no condominio and no Codice Civile art. 1122-bis notice needed. Under DPR 380/2001 art. 6 the wallbox is edilizia libera — zero permits at the Sportello Unico Edilizia. e-distribuzione can lift you from 3 kW to 6 kW monofase in 5 working days; trifase 11 kW takes 15–30 days. Within 500 m, 7 public chargers — including the SR11 DC-fast — but you won't need them.",
    catch:
      "Only thing to coordinate is the power upgrade with e-distribuzione (~€200 one-shot for 6 kW, ~€500–€1,000 for trifase 11 kW). Installer must be CCIAA-iscritto with DM 37/2008 lett. a) — they hand you the Dichiarazione di Conformità, which is your golden ticket to the Ecobonus 50%. Order Confidence Score: 91 — proceed.",
    serviceCity: 'Torino',
    insuranceNote:
      "RCA mandatory; first-time owner enters CU 14 (~€1,200–€2,000/yr) unless you inherit a household member's class under Legge Bersani — that drops it to CU 1, ~€450–€700/yr. We pre-file the Bersani paperwork with Reale Mutua (manual emission, since some direct insurers reject import VINs).",
  },

  // ───── REAL knowledge-base-backed: Massapequa, Nassau County NY
  massapequa: {
    id: 'massapequa',
    region: 'US',
    label: 'Massapequa, NY',
    address: '128 Tide Court, Massapequa NY 11758',
    zip: '11758',
    housing: 'Single-family · attached 2-car garage · 200 A panel',
    housingShort: 'Single-family · 2-car garage',
    buildingTag: '128',
    streetLabel: 'TIDE COURT · MASSAPEQUA',
    pins: [
      { x: 130, y: 70 },
      { x: 260, y: 90 },
      { x: 95, y: 200 },
      { x: 290, y: 215 },
      { x: 310, y: 160, fast: true },
    ],
    chargers: 5,
    chargerNote: 'AC + 1 DC fast (Sunrise Hwy)',
    subpanel: '200 A main · OK',
    feasibility: 'high',
    feasibilityLabel: 'HIGH FEASIBILITY',
    approvalPath: 'HOA notification + Town of Hempstead permit',
    permitForm: 'Town of Hempstead Online Permit Center — Electrical Permit Application',
    utility: 'PSEG Long Island',
    installerCert: 'Nassau County Master Electrician + Town of Hempstead Ch. 84',
    subsidy: 'PSEG-LI Rebate · $100',
    subsidyDetail:
      "PSEG-LI Residential Charger Rebate: $100 instant on a qualified Level 2 from the EPRI Vetted Product List. Federal IRS §30C 30% / $1,000 credit expires June 30, 2026 — and most South Shore Nassau tracts (incl. Massapequa) are urban + not low-income, so they don't qualify. Real long-run win is enrolling in PSEG-LI Time-of-Use Rate 195 (Super Off-Peak): ~40% off overnight kWh.",
    currency: '$',
    installCost: '$1,300 – $2,500',
    installTimeline: '3–5 weeks · 6–10 weeks if 100A→200A upgrade needed',
    score: 84,
    feasibilityNarrative:
      "Strong US baseline. Your home is a post-1990 single-family on a Hempstead parcel with an existing 200 A service panel and attached 2-car garage. Technically the town permit is straightforward — but your deed records show the property sits inside a small residential covenant, the Massapequa Residential Association, which requires written notification before any visible exterior equipment is installed. So before we file with Hempstead, we need: HOA architectural notification, exterior placement sketch, utility-side load confirmation, and the town electrical permit.",
    catch:
      "Not a full condo-style approval — the covenant just requires notification because chargers on front-facing walls can affect neighborhood appearance, conduit visible from the street can trigger design review, and some communities restrict new exterior hardware. Good news: this is paperwork, not a rejection risk. We mount the wallbox on the interior side wall of your attached garage — zero street visibility — and I send a notification letter to the Architectural Review Committee on your behalf. Once that's on file, HOA rejection probability is <5% and the Order Confidence Score moves 84 → 91.",
    serviceCity: 'Long Island',
    insuranceNote:
      "NY statutory minimums (25/50/10 + $50k PIP + UM/UIM) are dangerously low for an $80k EV. Standard carriers (GEICO, Progressive) typically reject Chinese-market VINs — we route to a specialty carrier (Hagerty / Grundy / Chubb Masterpiece) for an agreed-value policy in the $1.8–3.2k/yr range with a 7,500-mile cap. Need: NY DL, MV-999 title, MV-82 registration, garaging address proof, prior dec page. FS-20 ID card issued at bind.",
  },

  // ───── Heritage / harder case: Torino centro storico
  torinoCentro: {
    id: 'torinoCentro',
    region: 'IT',
    label: 'Torino centro',
    address: 'Via Po 14, 10123 Torino',
    zip: '10123',
    housing: 'Palazzo storico · 5 piani · vincolo paesaggistico',
    housingShort: 'Palazzo storico · vincolo',
    buildingTag: '14',
    streetLabel: 'VIA PO · TORINO',
    pins: [
      { x: 150, y: 90 },
      { x: 290, y: 110 },
      { x: 110, y: 220 },
      { x: 250, y: 222 },
    ],
    chargers: 4,
    chargerNote: 'AC only · slow',
    subpanel: 'cortile interno · OK',
    feasibility: 'medium',
    feasibilityLabel: 'FEASIBLE · CAVEATS',
    approvalPath: 'CILA + autorizzazione paesaggistica',
    permitForm: 'CILA al SUE Torino + autorizzazione paesaggistica semplificata (DPR 31/2017)',
    utility: 'e-distribuzione',
    installerCert: 'CCIAA · DM 37/2008 lett. a)',
    subsidy: 'Ecobonus 50% · 3.000 €',
    subsidyDetail:
      "Ecobonus 50% IRPEF applies (€3,000 cap, 10-year rateization). MIMIT Bonus Colonnine 80% / €1,500 click-day is open Apr–May 2026 — alternative if you want a faster cashback path but harder operationally.",
    currency: '€',
    installCost: '2.500 – 4.500 €',
    installTimeline: '8–12 weeks (vincolo paesaggistico aggiunge 30–60 gg)',
    score: 72,
    feasibilityNarrative:
      "Trickier Italian case. Your palazzo is in the centro storico of Torino — a UNESCO-adjacent area with vincolo paesaggistico (D.Lgs 42/2004). The condominio path under art. 1122-bis is fine (notice only, no vote needed), but because cable routing might be visible from a façade or courtyard, we need autorizzazione paesaggistica semplificata under DPR 31/2017 alongside a CILA at the Comune di Torino SUE.",
    catch:
      "Heritage approval typically adds 30–60 days. We design the cable route through an internal duct so it's not visible from the cortile — that's the usual route through Soprintendenza without issues. e-distribuzione trifase upgrade still possible. Order Confidence Score: 72 — lock the order with a 60-day contingency window on the heritage approval.",
    serviceCity: 'Torino',
    insuranceNote:
      "Same Italian RCA framework as Volpiano, but Torino capoluogo CAP (10100–10156) raises premium 10–25%. CU 14 first-time entrant: ~€1,500–€2,400/yr. Legge Bersani inheritance still applies if you have a household member with a clean CU.",
  },
};

// =============================================================================
// GEO — real lat/lng for each city + garage offsets
// =============================================================================

type LatLng = { lat: number; lng: number };

const CITY_COORDS: Record<CityId, LatLng & { zoom: number }> = {
  volpiano: { lat: 45.329, lng: 7.7796, zoom: 12 },
  massapequa: { lat: 40.6815, lng: -73.4715, zoom: 12 },
  torinoCentro: { lat: 45.0703, lng: 7.6869, zoom: 13 },
};

// Offset a coordinate by km along a bearing (deg from north, clockwise)
const offsetLatLng = (c: LatLng, km: number, bearingDeg: number): LatLng => {
  const R = 6378.1;
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (c.lat * Math.PI) / 180;
  const lng1 = (c.lng * Math.PI) / 180;
  const d = km / R;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    );
  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
};

// 5 garages scattered around the home — distance + bearing pre-defined
const GARAGE_DEFS: { c: string; n: string; km: number; bearing: number; best?: boolean }[] = [
  { c: 'PG', n: 'Performance Garage', km: 2.4, bearing: 45, best: true },
  { c: 'SR', n: 'Schmidt Reifen', km: 3.1, bearing: 95 },
  { c: 'BM', n: 'Bavarian Motors', km: 4.8, bearing: 315 },
  { c: 'KE', n: 'Karosserie Eberhardt', km: 5.2, bearing: 155 },
  { c: 'TM', n: 'Tech Mobility', km: 6.0, bearing: 235 },
];

// =============================================================================
// WORKSPACE STATE — what fills the right-hand panel
// =============================================================================

type FileItem = { icon: IconName; label: string; status: 'draft' | 'sent' | 'signed' | 'received' };

type InstallState = {
  letterStatus: 'idle' | 'drafting' | 'sent' | 'approved';
  installerPicked?: string;
  installerPrice?: string;
  installerEta?: string;
  evSubsidy: 'idle' | 'queued' | 'approved';
};

type ServiceState = {
  garageCount: number;
  primaryGarage?: string;
  primaryDistance?: string;
  evTrained: number;
};

type WarrantyState = {
  caseFile: 'idle' | 'building' | 'active';
  coverage?: string;
  hvCoverage?: string;
  sla?: string;
};

type Workspace = {
  city: CityId;
  phaseStatus: Record<Phase, 'pending' | 'active' | 'done'>;
  install: InstallState;
  service: ServiceState;
  warranty: WarrantyState;
  files: FileItem[];
  // a "keyframe" controls per-phase artifact reveal
  reserveStep: 0 | 1 | 2 | 3; // 0 = no address, 1 = scanned, 2 = scored, 3 = HOA letter sent
  installStep: 0 | 1 | 2 | 3; // 0=idle, 1=letter drafting, 2=quotes, 3=booked
  serviceStep: 0 | 1 | 2; // 0=idle, 1=indexed, 2=confirmed
  warrantyStep: 0 | 1 | 2; // 0=idle, 1=building, 2=active
  hoaLetterBonus: number; // confidence score bump once HOA letter is queued (US-only flow)
};

const initialWorkspace = (city: CityId = 'volpiano'): Workspace => ({
  city,
  phaseStatus: { reserve: 'active', install: 'pending', service: 'pending', warranty: 'pending' },
  install: { letterStatus: 'idle', evSubsidy: 'idle' },
  service: { garageCount: 0, evTrained: 0 },
  warranty: { caseFile: 'idle' },
  files: [],
  reserveStep: 0,
  installStep: 0,
  serviceStep: 0,
  warrantyStep: 0,
  hoaLetterBonus: 0,
});

// Workspace state when the user jumps directly to a phase via the PhaseBar.
// Prior phases are marked done with sensible-looking artifact state; target phase
// starts fresh and its enter() will fill in step counters.
const fastForwardWorkspace = (target: Phase, city: CityId): Workspace => {
  const tIdx = phaseIndex(target);
  const past = (p: Phase) => phaseIndex(p) < tIdx;
  return {
    city,
    phaseStatus: {
      reserve: tIdx === 0 ? 'active' : 'done',
      install: tIdx < 1 ? 'pending' : tIdx === 1 ? 'active' : 'done',
      service: tIdx < 2 ? 'pending' : tIdx === 2 ? 'active' : 'done',
      warranty: tIdx < 3 ? 'pending' : 'active',
    },
    install: past('install')
      ? {
          letterStatus: 'approved',
          evSubsidy: 'approved',
          installerPicked: 'Elektro Eisenmann',
          installerPrice: '€1,980',
          installerEta: '4 wks',
        }
      : { letterStatus: 'idle', evSubsidy: 'idle' },
    service: past('service')
      ? { garageCount: 5, evTrained: 4, primaryGarage: 'Performance Garage', primaryDistance: '2.4 km' }
      : { garageCount: 0, evTrained: 0 },
    warranty: past('warranty')
      ? { caseFile: 'active', coverage: '5y / 100k km', hvCoverage: '8y / 160k km', sla: '4.8 days' }
      : { caseFile: 'idle' },
    files: [],
    reserveStep: past('reserve') ? 3 : 0,
    installStep: past('install') ? 3 : 0,
    serviceStep: past('service') ? 2 : 0,
    warrantyStep: past('warranty') ? 2 : 0,
    hoaLetterBonus: past('reserve') && city === 'massapequa' ? 7 : 0,
  };
};

// =============================================================================
// SCRIPT — turn-by-turn dialogue
// =============================================================================

type Att = { icon?: IconName; label: string; mailto?: string };

type LetterDoc = {
  from?: string;
  to: string[];
  subject: string;
  body: string;
};

type Block =
  | { kind: 'text'; text: string; attachments?: Att[] }
  | { kind: 'tool'; label: string; args?: Record<string, string | number>; result?: string }
  | { kind: 'letter'; doc: LetterDoc; status?: 'draft' | 'pdf' }
  | { kind: 'handoff'; to: AgentId };

type Option = {
  label: string;
  echo?: string;
  keywords?: string[];
  next: string | null;
  patch?: (w: Workspace) => Workspace;
};

type Turn = {
  id: string;
  phase: Phase;
  agentId: AgentId;
  ts: string;
  blocks: (w: Workspace) => Block[];
  options: (w: Workspace) => Option[];
  // patch applied when this turn becomes active
  enter?: (w: Workspace) => Workspace;
};

const setStatus = (w: Workspace, phase: Phase, status: 'pending' | 'active' | 'done'): Workspace => ({
  ...w,
  phaseStatus: { ...w.phaseStatus, [phase]: status },
});

const addFile = (w: Workspace, f: FileItem): Workspace =>
  w.files.some((existing) => existing.label === f.label && existing.status === f.status)
    ? w
    : { ...w, files: [...w.files, f] };

// ─── HOA notification letter (Massapequa US flow) ─────────────────────────
const HOA_LETTER: LetterDoc = {
  from: 'L. Vogel · 128 Tide Court, Massapequa, NY 11758',
  to: ['Architectural Review Committee', 'Massapequa Residential Association'],
  subject: 'Notification of Residential EV Charger Installation — 128 Tide Court',
  body: [
    'Dear Architectural Review Committee,',
    '',
    'I am the homeowner of 128 Tide Court, Massapequa, NY 11758, and I am writing to notify the association of a planned residential electric vehicle charger installation at my property.',
    '',
    'Installation details:',
    '  • Vehicle: SC-01 electric vehicle',
    '  • Charger type: Level 2 home wall charger (240 V / 48 A)',
    '  • Installation location: Interior side wall of attached garage',
    '  • Visibility from street: None',
    '  • Licensed electrician: Nassau County Master Electrician (Town of Hempstead Ch. 84)',
    '  • Town permit: To be submitted through the Town of Hempstead Online Permit Center',
    '',
    'The installation will not modify the exterior appearance of the property, obstruct shared spaces, or create any community safety concern. No conduit will be visible from the street or from neighboring lots.',
    '',
    'Please let me know if any additional documentation is required.',
    '',
    'Sincerely,',
    'L. Vogel',
    '128 Tide Court, Massapequa, NY 11758',
  ].join('\n'),
};

const HOA_MAILTO = `mailto:arc@massapequa-residential.org?subject=${encodeURIComponent(
  HOA_LETTER.subject,
)}&body=${encodeURIComponent(HOA_LETTER.body)}`;

const SCRIPT: Turn[] = [
  // ─── PHASE 1 · RESERVATION CHECK ──────────────────────────────────────────
  {
    id: 't1',
    phase: 'reserve',
    agentId: 'parking',
    ts: '14:02',
    blocks: () => [
      {
        kind: 'text',
        text:
          "Welcome — I'm your Parking & Delivery agent. Before you place a reservation, we run one quick check: can the SC-01 actually live at your home? Share your address and I'll pull the local rules, your housing type, public chargers within 500 m, and whether a home wallbox is realistic — then give you an Order Confidence Score before you commit.",
      },
    ],
    options: () => [
      { label: 'Volpiano (TO) · Via Trieste 14', echo: 'Volpiano · Via Trieste 14', keywords: ['volpiano', 'trieste', 'italy', 'italia'], next: 't2', patch: (w) => ({ ...w, city: 'volpiano' }) },
      { label: 'Massapequa, NY · 128 Tide Ct', echo: 'Massapequa NY · 128 Tide Ct', keywords: ['massapequa', 'long island', 'nassau', 'new york', 'usa', 'tide'], next: 't2', patch: (w) => ({ ...w, city: 'massapequa' }) },
      { label: 'Torino centro · Via Po 14', echo: 'Torino centro · Via Po 14', keywords: ['torino centro', 'centro storico', 'via po'], next: 't2', patch: (w) => ({ ...w, city: 'torinoCentro' }) },
    ],
  },
  {
    id: 't2',
    phase: 'reserve',
    agentId: 'parking',
    ts: '14:03',
    enter: (w) => ({ ...w, reserveStep: 1 }),
    blocks: (w) => {
      const c = CITIES[w.city];
      return [
        {
          kind: 'text',
          text: `Scanning ${c.address} on Google Maps now — housing type, public chargers within 500 m, subpanel access.`,
        },
        {
          kind: 'tool',
          label: 'address.scan',
          args: { address: c.address, country: c.region, radius_m: 500 },
          result: `housing = ${c.housing} · public chargers = ${c.chargers} (${c.chargerNote}) · subpanel = ${c.subpanel} · feasibility = ${c.feasibility}`,
        },
        { kind: 'text', text: c.feasibilityNarrative },
      ];
    },
    options: () => [
      { label: "What's the catch?", echo: "What's the catch?", keywords: ['catch', 'risk', 'problem'], next: 't2b' },
      { label: 'Lock the reservation', echo: 'Lock the reservation', keywords: ['lock', 'reserve', 'order', 'go'], next: 't3' },
    ],
  },
  {
    id: 't2b',
    phase: 'reserve',
    agentId: 'parking',
    ts: '14:04',
    enter: (w) => ({ ...w, reserveStep: 2 }),
    blocks: (w) => {
      const c = CITIES[w.city];
      return [
        { kind: 'text', text: c.catch, attachments: [
          { icon: 'doc', label: `address_scan_${c.id}.pdf` },
          { icon: 'clock', label: 'delivery_plan.json' },
        ] },
      ];
    },
    options: (w) => {
      if (w.city === 'massapequa') {
        return [
          { label: 'Draft & send the HOA notification', echo: 'Send the HOA notification on my behalf', keywords: ['hoa', 'letter', 'notification', 'draft', 'send', 'covenant'], next: 't2c' },
          { label: 'Lock the reservation anyway', echo: 'Lock the reservation', keywords: ['lock', 'reserve', 'order'], next: 't3' },
          { label: 'Try a different city', echo: 'Let me try a different address', keywords: ['different', 'change', 'switch'], next: 't1' },
        ];
      }
      return [
        { label: 'Good — lock the reservation', echo: 'Lock the reservation', keywords: ['lock', 'reserve', 'order'], next: 't3' },
        { label: 'Try a different city', echo: 'Let me try a different address', keywords: ['different', 'change', 'switch'], next: 't1' },
      ];
    },
  },

  // ─── PHASE 1 · OPTIONAL · HOA notification (US-only) ─────────────────────
  {
    id: 't2c',
    phase: 'reserve',
    agentId: 'parking',
    ts: '14:05',
    blocks: () => [
      {
        kind: 'text',
        text:
          "Drafting under your name now. Mounting goes on the interior side wall of the garage so there's zero street visibility — this is a notification, not an approval ask. Here's the letter — review it before I save the PDF.",
      },
      {
        kind: 'tool',
        label: 'hoa.assist.generate_letter',
        args: {
          recipient: 'Architectural Review Committee',
          community: 'Massapequa Residential Association',
          property: '128 Tide Court, Massapequa, NY 11758',
          install_location: 'Interior side wall · attached garage',
          street_visibility: 'none',
          electrician: 'Nassau County Master Electrician',
          town_permit: 'Town of Hempstead Online Permit Center',
        },
        result: 'draft ready · awaiting your confirmation',
      },
      {
        kind: 'letter',
        status: 'draft',
        doc: HOA_LETTER,
      },
      {
        kind: 'text',
        text:
          "Once you confirm, I freeze it as a PDF and hand it off to your Mac Mail with the ARC pre-filled — you tap Send.",
      },
    ],
    options: () => [
      { label: 'Confirm & save as PDF', echo: 'Confirm — save it as a PDF', keywords: ['confirm', 'pdf', 'save', 'ok'], next: 't2d' },
      { label: 'Edit before sending', echo: 'Hold on — I want to tweak it', keywords: ['edit', 'change', 'tweak'], next: 't2b' },
    ],
  },

  // ─── PHASE 1 · OPTIONAL · HOA letter → PDF → macOS Mail ───────────────────
  {
    id: 't2d',
    phase: 'reserve',
    agentId: 'parking',
    ts: '14:06',
    enter: (w) => ({ ...w, reserveStep: 3, hoaLetterBonus: 7 }),
    blocks: () => [
      {
        kind: 'text',
        text:
          "Locked. Letter saved as hoa_notification_128_tide_ct.pdf and queued to the Architectural Review Committee on your behalf.",
      },
      {
        kind: 'letter',
        status: 'pdf',
        doc: HOA_LETTER,
      },
      {
        kind: 'tool',
        label: 'hoa.email.compose',
        args: {
          to: 'arc@massapequa-residential.org',
          subject: 'Notification of Residential EV Charger Installation — 128 Tide Court',
          attachment: 'hoa_notification_128_tide_ct.pdf',
          handoff: 'macOS Mail.app',
        },
        result: 'tap the PDF below to launch Mail with the message pre-filled',
      },
      {
        kind: 'text',
        text:
          "Tap the attachment to open it in your Mac's Mail app — the email is pre-filled, you just hit Send. HOA rejection probability is below 5%. Order Confidence Score: 84 → 91.",
        attachments: [
          {
            icon: 'doc',
            label: 'hoa_notification_128_tide_ct.pdf',
            mailto: HOA_MAILTO,
          },
        ],
      },
    ],
    options: () => [
      { label: 'Lock the reservation', echo: 'Lock the reservation', keywords: ['lock', 'reserve', 'order', 'proceed'], next: 't3' },
    ],
  },

  // ─── HANDOFF → PHASE 2 · CHARGING INSTALL ────────────────────────────────
  {
    id: 't3',
    phase: 'reserve',
    agentId: 'parking',
    ts: '14:06',
    enter: (w) => {
      const c = CITIES[w.city];
      let next = setStatus(w, 'reserve', 'done');
      next = setStatus(next, 'install', 'active');
      next = addFile(next, { icon: 'doc', label: `reservation_${c.id}.pdf`, status: 'signed' });
      next = addFile(next, { icon: 'clock', label: 'delivery_plan.json', status: 'sent' });
      if (w.city === 'massapequa' && w.hoaLetterBonus > 0) {
        next = addFile(next, { icon: 'doc', label: 'hoa_notification_128_tide_ct.pdf', status: 'sent' });
      }
      return { ...next, reserveStep: Math.max(next.reserveStep, 2) as Workspace['reserveStep'] };
    },
    blocks: () => [
      {
        kind: 'text',
        text: "Reservation locked. Handing off to the Charging & Compliance agent — they'll handle building approval, installer matching, and the EV subsidy paperwork.",
      },
      { kind: 'handoff', to: 'charging' },
    ],
    options: () => [
      { label: 'Continue with charging →', echo: 'Continue', next: 't4' },
    ],
  },

  // ─── PHASE 2 · CHARGING (locale-aware) ───────────────────────────────────
  {
    id: 't4',
    phase: 'install',
    agentId: 'charging',
    ts: '14:06',
    enter: (w) => ({
      ...w,
      installStep: 1,
      install: { ...w.install, letterStatus: 'drafting' },
    }),
    blocks: (w) => {
      const c = CITIES[w.city];
      // Per region: what's the headline action?
      if (c.region === 'US') {
        return [
          {
            kind: 'text',
            text: `Picking up. Target: 11.5 kW Level 2 (240 V / 48 A) wallbox in your Massapequa garage. Filing the electrical permit through the Town of Hempstead Online Permit Center now — owner authorization, contractor disclosure, one-line diagram, EVSE cut sheet, NEC 220.87 load calc.`,
          },
          {
            kind: 'tool',
            label: 'permit.file',
            args: { jurisdiction: 'Town of Hempstead, NY', form: 'Electrical Permit Application', portal: 'Online Permit Center (citizenserve)' },
            result: 'application filed · permit no. pending · est. 5-15 business days',
          },
        ];
      }
      if (c.id === 'torinoCentro') {
        return [
          {
            kind: 'text',
            text: `Picking up. Target: 11 kW Type 2 AC wallbox in ${c.label}. Because we're in centro storico (vincolo paesaggistico D.Lgs 42/2004), we file BOTH a CILA at the Comune di Torino SUE and an autorizzazione paesaggistica semplificata under DPR 31/2017. Also drafting the art. 1122-bis comunicazione to the amministratore.`,
          },
          {
            kind: 'tool',
            label: 'permit.file',
            args: { jurisdiction: 'Comune di Torino · SUE', forms: 'CILA + Autorizzazione paesaggistica DPR 31/2017 + 1122-bis notice' },
            result: 'CILA filed · heritage application pending (30-60 gg)',
          },
        ];
      }
      // Volpiano (villetta, edilizia libera) — simplest path
      return [
        {
          kind: 'text',
          text: `Picking up. Target: 11 kW Type 2 AC wallbox in your Volpiano villetta. Best-case path — under DPR 380/2001 art. 6 this is edilizia libera so no SUE filing is required. I'm sending the aumento potenza request to e-distribuzione to lift you from 3 kW to trifase 11 kW.`,
        },
        {
          kind: 'tool',
          label: 'utility.request',
          args: { utility: 'e-distribuzione', from_kw: 3, to_kw: 11, phase: 'trifase' },
          result: 'request accepted · preventivo in 5 working days',
        },
      ];
    },
    options: (w) => {
      const c = CITIES[w.city];
      const subsidyChip = c.region === 'US' ? 'What rebates apply?' : "What about l'Ecobonus?";
      return [
        { label: 'Show installer quotes', echo: 'Get me the installer quotes', keywords: ['installer', 'quote', 'price'], next: 't5' },
        { label: subsidyChip, echo: subsidyChip, keywords: ['subsidy', 'rebate', 'incentive', 'ecobonus', 'tax credit'], next: 't4b' },
      ];
    },
  },
  {
    id: 't4b',
    phase: 'install',
    agentId: 'charging',
    ts: '14:07',
    enter: (w) => ({
      ...w,
      install: { ...w.install, evSubsidy: 'queued' },
    }),
    blocks: (w) => {
      const c = CITIES[w.city];
      return [{ kind: 'text', text: c.subsidyDetail }];
    },
    options: () => [{ label: 'Show installer quotes', echo: 'Show the quotes', next: 't5' }],
  },
  {
    id: 't5',
    phase: 'install',
    agentId: 'charging',
    ts: '14:08',
    enter: (w) => ({ ...w, installStep: 2 }),
    blocks: (w) => {
      const c = CITIES[w.city];
      if (c.region === 'US') {
        return [
          {
            kind: 'text',
            text: `Three Nassau-licensed Master Electricians within 15 mi — all hold Town of Hempstead Ch. 84 + Nassau County registration. Filter: 48 A circuit, EPRI-vetted EVSE, ≤ 4 wks, $2M liability.`,
          },
          {
            kind: 'tool',
            label: 'installer.match',
            args: { radius_mi: 15, amperage: 48, cert: 'Nassau County Master + Hempstead Ch.84' },
            result: '3 quotes returned · best pick: South Shore Electric $1,650',
          },
          {
            kind: 'text',
            text:
              'My recommendation: South Shore Electric — $1,650 all-in (Tesla Wall Connector + 48 A run + permit fee + NYBFU inspection), 3 weeks. Sparta Electrical Services is faster (2 wks) but $1,890. Long Island Power Pros is cheapest ($1,420) but 5 wks. Your existing 200 A panel checks out — no service upgrade needed.',
            attachments: [
              { icon: 'doc', label: 'hempstead_permit_app.pdf' },
              { icon: 'plug', label: 'installer_quotes_NY.csv' },
            ],
          },
        ];
      }
      // Italy path
      return [
        {
          kind: 'text',
          text: `Three CCIAA-certified installers within 25 km — DM 37/2008 lett. a) abilitati, polizza RC ≥ €5 M, può rilasciare Di.Co. Tutti possono fornire e installare Wallbox Pulsar Plus / Enel X Way / V2C.`,
        },
        {
          kind: 'tool',
          label: 'installer.match',
          args: { radius_km: 25, power_kw: 11, cert: 'DM 37/2008 lett. a)' },
          result: '3 quotes · best pick: ElettroTorino €1,420',
        },
        {
          kind: 'text',
          text:
            "Recommendation: ElettroTorino — €1,420 chiavi in mano (Wallbox Pulsar Plus + cavidotto + sottoquadro + Di.Co.), 3 settimane. Piemonte Energia is faster (2 wks) at €1,580 — they've handled vincolo paesaggistico cases before, which matters if you ever move to centro. CintuRica is cheapest €1,150 but 5 settimane.",
          attachments: [
            { icon: 'doc', label: c.region === 'IT' && w.city === 'torinoCentro' ? 'cila_torino_v1.pdf' : 'utility_upgrade_request.pdf' },
            { icon: 'plug', label: 'installer_quotes_IT.csv' },
          ],
        },
      ];
    },
    options: (w) => {
      const c = CITIES[w.city];
      if (c.region === 'US') {
        return [
          {
            label: 'Book South Shore Electric · $1,650',
            echo: 'Book South Shore Electric',
            keywords: ['south shore', 'book', 'go', 'pick'],
            next: 't6',
            patch: (w) => ({
              ...w,
              install: { ...w.install, installerPicked: 'South Shore Electric', installerPrice: '$1,650', installerEta: '3 wks' },
            }),
          },
          {
            label: 'Pick the fastest (Sparta · 2 wks)',
            echo: 'Pick Sparta',
            keywords: ['sparta', 'fast'],
            next: 't6',
            patch: (w) => ({
              ...w,
              install: { ...w.install, installerPicked: 'Sparta Electrical', installerPrice: '$1,890', installerEta: '2 wks' },
            }),
          },
        ];
      }
      return [
        {
          label: 'Book ElettroTorino · €1,420',
          echo: 'Book ElettroTorino',
          keywords: ['elettrotorino', 'book', 'go', 'pick'],
          next: 't6',
          patch: (w) => ({
            ...w,
            install: { ...w.install, installerPicked: 'ElettroTorino', installerPrice: '€1,420', installerEta: '3 sett.' },
          }),
        },
        {
          label: 'Pick faster (Piemonte Energia · 2 wks)',
          echo: 'Pick Piemonte Energia',
          keywords: ['piemonte', 'fast'],
          next: 't6',
          patch: (w) => ({
            ...w,
            install: { ...w.install, installerPicked: 'Piemonte Energia', installerPrice: '€1,580', installerEta: '2 sett.' },
          }),
        },
      ];
    },
  },
  {
    id: 't6',
    phase: 'install',
    agentId: 'charging',
    ts: '14:09',
    enter: (w) => {
      const c = CITIES[w.city];
      let next: Workspace = {
        ...w,
        installStep: 3,
        install: { ...w.install, letterStatus: 'sent' },
      };
      const permitFile: FileItem =
        c.region === 'US'
          ? { icon: 'doc', label: 'hempstead_electrical_permit.pdf', status: 'sent' }
          : c.id === 'torinoCentro'
          ? { icon: 'doc', label: 'cila_torino_+_paesaggistica.pdf', status: 'sent' }
          : { icon: 'doc', label: 'edistribuzione_aumento_potenza.pdf', status: 'sent' };
      next = addFile(next, permitFile);
      next = addFile(next, { icon: 'plug', label: 'wallbox_install_order.pdf', status: 'signed' });
      next = setStatus(next, 'install', 'done');
      next = setStatus(next, 'service', 'active');
      return next;
    },
    blocks: (w) => {
      const c = CITIES[w.city];
      const closing =
        c.region === 'US'
          ? `Permit will be issued in 5-15 business days. After install the third-party inspector (NYBFU) issues the Electrical Certificate, then Hempstead issues the Letter of Completion. PSEG-LI rebate filed on the Online Marketplace.`
          : c.id === 'torinoCentro'
          ? `Heritage approval is in motion (30-60 gg). After install your installer hands you the Dichiarazione di Conformità — that's your ticket to the Ecobonus 50% on next year's tax return.`
          : `e-distribuzione upgrade in 5-15 working days. After install you receive the Dichiarazione di Conformità ex DM 37/2008 — required for the Ecobonus 50% IRPEF claim.`;
      return [
        {
          kind: 'text',
          text: `Booked. ${w.install.installerPicked} confirmed (${w.install.installerEta}). ${closing}`,
        },
        { kind: 'handoff', to: 'service' },
      ];
    },
    options: () => [{ label: 'Continue with service network →', echo: 'Continue', next: 't7' }],
  },

  // ─── PHASE 3 · SERVICE NETWORK (locale-aware) ────────────────────────────
  {
    id: 't7',
    phase: 'service',
    agentId: 'service',
    ts: '14:10',
    enter: (w) => ({
      ...w,
      serviceStep: 1,
      service: { ...w.service, garageCount: 5, evTrained: 4 },
    }),
    blocks: (w) => {
      const c = CITIES[w.city];
      const radius = c.region === 'US' ? '10 mi' : '10 km';
      const topName = c.region === 'US' ? 'Mavis Tire & EV — Bethpage' : c.id === 'volpiano' ? 'AutoTorino Service' : 'Performance Auto · Torino';
      const topDist = c.region === 'US' ? '3.8 mi' : c.id === 'volpiano' ? '4.2 km' : '2.1 km';
      return [
        {
          kind: 'text',
          text: `Picking up. Indexing EV-friendly garages within ${radius} of ${c.serviceCity} — excluding HV-battery work (manufacturer-authorized only).`,
        },
        {
          kind: 'tool',
          label: 'garage.match',
          args:
            c.region === 'US'
              ? ({ radius_mi: 10, capability: 'brake|tire|suspension|body', exclude: 'HV-battery' } as Record<string, string | number>)
              : ({ radius_km: 10, capability: 'brake|tire|suspension|body', exclude: 'HV-battery' } as Record<string, string | number>),
          result: `5 partners · 4 EV-trained · closest ${topDist}`,
        },
        {
          kind: 'text',
          text:
            `Top match: ${topName} — ${topDist}, EV-trained, OEM friction in stock. I'll pre-confirm them as your primary partner so they have your VIN and torque specs on file before delivery.`,
        },
      ];
    },
    options: (w) => {
      const c = CITIES[w.city];
      const topName = c.region === 'US' ? 'Mavis Tire & EV — Bethpage' : c.id === 'volpiano' ? 'AutoTorino Service' : 'Performance Auto · Torino';
      const topDist = c.region === 'US' ? '3.8 mi' : c.id === 'volpiano' ? '4.2 km' : '2.1 km';
      return [
        {
          label: `Confirm ${topName.split(' — ')[0].split(' · ')[0]}`,
          echo: `Confirm ${topName}`,
          keywords: ['confirm', 'primary', 'mavis', 'autotorino', 'performance'],
          next: 't8',
          patch: (w) => ({ ...w, service: { ...w.service, primaryGarage: topName, primaryDistance: topDist } }),
        },
        {
          label: 'What if the HV battery has an issue?',
          echo: 'What about HV battery?',
          keywords: ['hv', 'battery', 'high voltage'],
          next: 't7b',
        },
      ];
    },
  },
  {
    id: 't7b',
    phase: 'service',
    agentId: 'service',
    ts: '14:11',
    blocks: () => [
      {
        kind: 'text',
        text:
          "Hard rule: no local shop touches the high-voltage pack or regen system. If we ever see HV symptoms we route directly to the manufacturer's authorized channel — the Warranty agent opens a case file, ships data to Hangzhou, and arranges OEM service. Your primary garage handles everything that isn't HV: brakes, tires, suspension, body.",
      },
    ],
    options: (w) => {
      const c = CITIES[w.city];
      const topName = c.region === 'US' ? 'Mavis Tire & EV — Bethpage' : c.id === 'volpiano' ? 'AutoTorino Service' : 'Performance Auto · Torino';
      const topDist = c.region === 'US' ? '3.8 mi' : c.id === 'volpiano' ? '4.2 km' : '2.1 km';
      return [
        {
          label: `OK — confirm ${topName.split(' — ')[0].split(' · ')[0]}`,
          echo: `Confirm ${topName}`,
          next: 't8',
          patch: (w) => ({ ...w, service: { ...w.service, primaryGarage: topName, primaryDistance: topDist } }),
        },
      ];
    },
  },
  {
    id: 't8',
    phase: 'service',
    agentId: 'service',
    ts: '14:12',
    enter: (w) => {
      let next: Workspace = { ...w, serviceStep: 2 };
      next = addFile(next, { icon: 'wrench', label: 'service_partner_agreement.pdf', status: 'signed' });
      next = setStatus(next, 'service', 'done');
      next = setStatus(next, 'warranty', 'active');
      return next;
    },
    blocks: (w) => [
      {
        kind: 'text',
        text: `Confirmed. ${w.service.primaryGarage} has your VIN, torque specs, and OEM parts catalog on file. Handing off to the Warranty & Insurance agent — they'll spin up your case file and bind your motor insurance so coverage is live the second you take delivery.`,
      },
      { kind: 'handoff', to: 'warranty' },
    ],
    options: () => [{ label: 'Continue with warranty →', echo: 'Continue', next: 't9' }],
  },

  // ─── PHASE 4 · WARRANTY + INSURANCE FILE ─────────────────────────────────
  {
    id: 't9',
    phase: 'warranty',
    agentId: 'warranty',
    ts: '14:13',
    enter: (w) => ({
      ...w,
      warrantyStep: 1,
      warranty: { ...w.warranty, caseFile: 'building' },
    }),
    blocks: (w) => {
      const c = CITIES[w.city];
      return [
        {
          kind: 'text',
          text:
            "Creating your warranty file and binding your motor insurance in parallel. Linking owner, vehicle (VIN TBD on dispatch), region, evidence channel, your service partner, and a direct line to the Hangzhou aftersales team.",
        },
        {
          kind: 'tool',
          label: 'warranty.profile.create',
          args: { vin: 'pending dispatch', region: c.region, service_partner: w.service.primaryGarage ?? '—' },
          result: 'profile active · 4 actors linked',
        },
        { kind: 'text', text: c.insuranceNote },
      ];
    },
    options: () => [
      { label: 'Show coverage details', echo: 'Show coverage details', keywords: ['coverage', 'details'], next: 't10' },
      { label: 'What about response time?', echo: 'What about response time?', keywords: ['sla', 'response', 'time'], next: 't9b' },
    ],
  },
  {
    id: 't9b',
    phase: 'warranty',
    agentId: 'warranty',
    ts: '14:14',
    blocks: () => [
      {
        kind: 'text',
        text:
          'Median case resolution across the SC-01 fleet right now: 4.8 days. We collect evidence (video + OBD), generate a Chinese technical summary for the manufacturer, and coordinate locally — you never have to translate or re-explain. Pattern alerts ping me if the same issue shows up on >3 cars in 30 days.',
      },
    ],
    options: () => [{ label: 'Show coverage details', echo: 'Show coverage', next: 't10' }],
  },
  {
    id: 't10',
    phase: 'warranty',
    agentId: 'warranty',
    ts: '14:15',
    enter: (w) => {
      let next: Workspace = {
        ...w,
        warrantyStep: 2,
        warranty: {
          ...w.warranty,
          caseFile: 'active',
          coverage: '5 y / 100,000 km',
          hvCoverage: '8 y / 160,000 km',
          sla: '4.8 days median',
        },
      };
      next = addFile(next, { icon: 'shield', label: 'warranty_profile.json', status: 'signed' });
      const insuranceFile: FileItem =
        CITIES[w.city].region === 'US'
          ? { icon: 'shield', label: 'FS-20_insurance_card.pdf', status: 'signed' }
          : { icon: 'shield', label: 'polizza_RCA.pdf', status: 'signed' };
      next = addFile(next, insuranceFile);
      next = setStatus(next, 'warranty', 'done');
      return next;
    },
    blocks: (w) => {
      const c = CITIES[w.city];
      return [
        {
          kind: 'text',
          text:
            'All four phases complete. Reservation locked, wallbox booked, service partner confirmed, warranty + insurance live. Your SC-01 ships on schedule — delivery window Q3 2026.',
          attachments: [
            { icon: 'shield', label: 'warranty_profile.json' },
            { icon: 'doc', label: `buyer_dossier_${c.id}.pdf` },
            { icon: 'shield', label: c.region === 'US' ? 'FS-20_insurance_card.pdf' : 'polizza_RCA.pdf' },
          ],
        },
      ];
    },
    options: () => [
      { label: 'Restart the demo', echo: 'Restart', next: null },
    ],
  },
];

const TURNS_BY_ID: Record<string, Turn> = Object.fromEntries(SCRIPT.map((t) => [t.id, t]));

// =============================================================================
// HISTORY / RUNTIME
// =============================================================================

type HistoryEntry = {
  turnId: string;
  // user reply that came AFTER this turn (if any)
  userText?: string;
  selectedOption?: Option | null;
};

// =============================================================================
// LEFT PANE — chat
// =============================================================================

const ChatBubble = ({
  from,
  name,
  role,
  color,
  ts,
  children,
  attachments,
}: {
  from: 'user' | 'agent';
  name: string;
  role: string;
  color: AgentColor;
  ts: string;
  children: ReactNode;
  attachments?: Att[];
}) => {
  const isUser = from === 'user';
  return (
    <div className={`bubble ${isUser ? 'user' : 'agent'}`}>
      <div className="bubble-side">
        {isUser ? <div className="user-avi">LV</div> : <div className={`agent-tile ${color}`}>{name}</div>}
      </div>
      <div className="bubble-body">
        <div className="bubble-meta">
          <span className="who">{isUser ? 'You · Buyer' : role}</span>
          <span className="ts">{ts}</span>
        </div>
        <div className="bubble-text">{children}</div>
        {attachments && attachments.length > 0 && (
          <div className="bubble-attach">
            {attachments.map((a, i) =>
              a.mailto ? (
                <a key={i} className="attach-chip attach-chip-action" href={a.mailto} title="Open in Mail.app">
                  <Icon name={a.icon ?? 'doc'} size={12} />
                  {a.label}
                  <span className="attach-chip-cta">Open in Mail</span>
                </a>
              ) : (
                <span key={i} className="attach-chip">
                  <Icon name={a.icon ?? 'doc'} size={12} />
                  {a.label}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ToolCallView = ({
  label,
  args,
  color,
  result,
}: {
  label: string;
  args?: Record<string, string | number>;
  color: AgentColor;
  result?: string;
}) => (
  <div className={`tool-call ${color}`}>
    <div className="tool-head">
      <Icon name="sparkle" size={12} />
      <span className="mono">tool · {label}</span>
      {result && (
        <span className="badge green" style={{ marginLeft: 'auto' }}>
          OK
        </span>
      )}
    </div>
    {args && (
      <div className="tool-args">
        {Object.entries(args).map(([k, v]) => (
          <div key={k}>
            <span className="k">{k}</span>
            <span className="v">{String(v)}</span>
          </div>
        ))}
      </div>
    )}
    {result && <div className="tool-result">{result}</div>}
  </div>
);

const LetterPreview = ({
  doc,
  color,
  status,
}: {
  doc: LetterDoc;
  color: AgentColor;
  status?: 'draft' | 'pdf';
}) => {
  const isPdf = status === 'pdf';
  return (
    <div className={`letter-preview ${color}${isPdf ? ' letter-preview-pdf' : ''}`}>
      <div className="letter-preview-head">
        <Icon name={isPdf ? 'doc' : 'sparkle'} size={12} />
        <span className="mono">{isPdf ? 'document · pdf' : 'draft · letter'}</span>
        <span className={`badge ${isPdf ? 'green' : 'muted'}`} style={{ marginLeft: 'auto' }}>
          {isPdf ? 'SIGNED' : 'AWAITING REVIEW'}
        </span>
      </div>
      <div className="letter-preview-meta">
        {doc.from && (
          <div>
            <span className="k">From</span>
            <span className="v">{doc.from}</span>
          </div>
        )}
        <div>
          <span className="k">To</span>
          <span className="v">{doc.to.join(', ')}</span>
        </div>
        <div>
          <span className="k">Subject</span>
          <span className="v">{doc.subject}</span>
        </div>
      </div>
      <div className="letter-preview-body">{doc.body}</div>
    </div>
  );
};

const HandoffPill = ({ to }: { to: AgentId }) => {
  const a = AGENTS[to];
  return (
    <div className="handoff">
      <Icon name="arrow" size={14} />
      <span className="mono">
        Handing off to <strong>{a.code}</strong> · {a.name} agent
      </span>
    </div>
  );
};

// =============================================================================
// RIGHT PANE — workspace (file + form + node status)
// =============================================================================

const PhaseHeader = ({ active }: { active: Phase }) => {
  const def = PHASES.find((p) => p.id === active)!;
  return (
    <div className="ws-phase-head">
      <AgentTile id={def.agentId} pulse />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono ws-phase-code">{`PHASE ${phaseIndex(active) + 1} / 4 · ${def.code}`}</div>
        <div className="ws-phase-title">{def.label}</div>
        <div className="ws-phase-sub">{def.sub}</div>
      </div>
      <span className={`badge ${AGENTS[def.agentId].color}`}>LIVE</span>
    </div>
  );
};

// ─── Phase 1 artifact: address scan map + readiness grid ───
// =============================================================================
// SVG marker icons — used by <Marker> (no Map ID required, unlike AdvancedMarker)
// =============================================================================

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

// Standard Google-Maps-style teardrop pin (32×42) — bg, border, 2-char glyph
const pinIcon = (bg: string, border: string, label: string): string =>
  encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">` +
      `<ellipse cx="16" cy="41" rx="5" ry="1.3" fill="#000" opacity="0.22"/>` +
      `<path d="M 16,40 C 4,26 4,12 16,12 C 28,12 28,26 16,40 Z" fill="${bg}" stroke="${border}" stroke-width="0.6"/>` +
      `<circle cx="16" cy="20" r="6" fill="#fff"/>` +
      `<text x="16" y="23" font-family="-apple-system,system-ui,sans-serif" font-size="8" font-weight="700" fill="${border}" text-anchor="middle">${label}</text>` +
      `</svg>`,
  );

// Larger pin for HOME building marker (44×56) — wider inner circle for 3-char tags
const pinIconLarge = (bg: string, border: string, label: string): string =>
  encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">` +
      `<ellipse cx="22" cy="55" rx="7" ry="1.6" fill="#000" opacity="0.25"/>` +
      `<path d="M 22,54 C 6,36 6,16 22,16 C 38,16 38,36 22,54 Z" fill="${bg}" stroke="${border}" stroke-width="0.8"/>` +
      `<circle cx="22" cy="28" r="9" fill="#fff"/>` +
      `<text x="22" y="31.5" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="${border}" text-anchor="middle">${label}</text>` +
      `</svg>`,
  );

// Google "you are here" blue location dot (32×32) — for ServiceMap home marker
const HOME_DOT_ICON = encodeSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<circle cx="16" cy="16" r="14" fill="#4285f4" opacity="0.18"/>` +
    `<circle cx="16" cy="16" r="8" fill="#4285f4"/>` +
    `<circle cx="16" cy="16" r="7" fill="none" stroke="#fff" stroke-width="2"/>` +
    `</svg>`,
);

// 500 m dashed radius overlay rendered via google.maps.Circle
const RadiusCircle = ({ center, radius }: { center: LatLng; radius: number }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  useEffect(() => {
    if (!map || !mapsLib) return;
    const circle = new mapsLib.Circle({
      map,
      center,
      radius,
      fillColor: '#4285f4',
      fillOpacity: 0.05,
      strokeColor: '#4285f4',
      strokeOpacity: 0.55,
      strokeWeight: 1.2,
      clickable: false,
    });
    return () => circle.setMap(null);
  }, [map, mapsLib, center.lat, center.lng, radius]);
  return null;
};

// Convert SVG pin coordinate (0..400 × 0..280, center at 200,140, 100u = 500m) to real lat/lng
const svgPinToLatLng = (pin: { x: number; y: number }, center: LatLng): LatLng => {
  const dx = pin.x - 200;
  const dy = pin.y - 140;
  const distKm = (Math.hypot(dx, dy) * 5) / 1000; // 1 svg unit ≈ 5 m
  const bearingDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return offsetLatLng(center, distKm, bearingDeg);
};

type RealCharger = { id: string; lat: number; lng: number; name: string; fast: boolean };

const FAST_CONNECTOR_TYPES = new Set([
  'EV_CONNECTOR_TYPE_CHADEMO',
  'EV_CONNECTOR_TYPE_CCS_COMBO_1',
  'EV_CONNECTOR_TYPE_CCS_COMBO_2',
  'EV_CONNECTOR_TYPE_TESLA',
  'EV_CONNECTOR_TYPE_NACS',
]);

// Renders home + nearby charger pins. Must live inside <Map> + <APIProvider>.
const ReserveMarkers = ({
  w,
  center,
  onCount,
}: {
  w: Workspace;
  center: LatLng;
  onCount?: (c: { ac: number; fast: number } | null) => void;
}) => {
  const c = CITIES[w.city];
  const stage = w.reserveStep;
  const placesLib = useMapsLibrary('places');
  const [realChargers, setRealChargers] = useState<RealCharger[] | null>(null);

  // Synthetic fallback if Places API not enabled or returns nothing
  const syntheticChargers = useMemo(
    () => c.pins.map((p, i) => ({ id: `synth-${i}`, name: 'Charging station', fast: !!p.fast, ...svgPinToLatLng(p, center) })),
    [c.pins, center],
  );

  useEffect(() => {
    setRealChargers(null); // reset when city changes
    if (!placesLib) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PlaceClass: any = (placesLib as any).Place;
    if (!PlaceClass || typeof PlaceClass.searchNearby !== 'function') {
      console.warn('Places API (New) not available — falling back to synthetic chargers');
      return;
    }

    let cancelled = false;
    PlaceClass.searchNearby({
      fields: ['id', 'displayName', 'location', 'evChargeOptions'],
      locationRestriction: { center, radius: 500 },
      includedPrimaryTypes: ['electric_vehicle_charging_station'],
      maxResultCount: 20,
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((result: any) => {
        if (cancelled) return;
        const places = result?.places ?? [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const out: RealCharger[] = places.map((p: any) => {
          const loc = p.location;
          const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.lat;
          const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.lng;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const aggs = (p.evChargeOptions?.connectorAggregations ?? []) as any[];
          const isFast = aggs.some(
            (a) => FAST_CONNECTOR_TYPES.has(a?.type ?? '') || (typeof a?.maxChargeRateKw === 'number' && a.maxChargeRateKw > 22),
          );
          return {
            id: p.id ?? `${lat}-${lng}`,
            lat,
            lng,
            name: typeof p.displayName === 'string' ? p.displayName : p.displayName?.text ?? 'EV charging station',
            fast: isFast,
          };
        });
        setRealChargers(out);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        console.warn('Places.searchNearby failed (falling back to synthetic):', e?.message ?? e);
      });

    return () => {
      cancelled = true;
    };
  }, [placesLib, center.lat, center.lng, w.city]);

  const chargers = realChargers ?? syntheticChargers;
  const acCount = chargers.filter((x) => !x.fast).length;
  const fastCount = chargers.filter((x) => x.fast).length;

  // Report counts upward whenever the displayed pin set changes (depend on
  // primitives, NOT the array — array reference changes every render and
  // would otherwise cause an infinite setState loop / white screen).
  useEffect(() => {
    if (!onCount) return;
    if (stage < 1) {
      onCount(null);
      return;
    }
    onCount({ ac: acCount, fast: fastCount });
  }, [acCount, fastCount, stage, onCount]);

  const coreLib = useMapsLibrary('core');

  if (stage < 1 || !coreLib) return stage < 1 ? null : <RadiusCircle center={center} radius={500} />;

  const homeIconCfg = {
    url: pinIconLarge('#1a73e8', '#0d47a1', c.buildingTag),
    anchor: new coreLib.Point(22, 54),
    scaledSize: new coreLib.Size(44, 56),
  };
  const acIconUrl = pinIcon('#34a853', '#1e8e3e', 'AC');
  const dcIconUrl = pinIcon('#1a73e8', '#0d47a1', 'DC');
  const chargerAnchor = new coreLib.Point(16, 40);
  const chargerSize = new coreLib.Size(32, 42);

  return (
    <>
      <RadiusCircle center={center} radius={500} />
      <Marker position={{ lat: center.lat, lng: center.lng }} title={c.address} icon={homeIconCfg} />
      {chargers.map((ch) => (
        <Marker
          key={ch.id}
          position={{ lat: ch.lat, lng: ch.lng }}
          title={`${ch.name} · ${ch.fast ? 'DC fast' : 'AC'}`}
          icon={{
            url: ch.fast ? dcIconUrl : acIconUrl,
            anchor: chargerAnchor,
            scaledSize: chargerSize,
          }}
        />
      ))}
    </>
  );
};

const ReserveMap = ({
  w,
  onCount,
}: {
  w: Workspace;
  onCount?: (c: { ac: number; fast: number } | null) => void;
}) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? '';
  const center = CITY_COORDS[w.city];

  if (!apiKey) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '100%',
          padding: 20,
          color: '#5f6368',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textAlign: 'center',
          letterSpacing: '0.08em',
          lineHeight: 1.6,
        }}
      >
        MAP UNAVAILABLE
        <br />
        Set VITE_GOOGLE_MAPS_API_KEY in .env.local
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.info('[gmaps] script loaded')}
      onError={(err) => console.error('[gmaps] failed to load:', err)}
    >
      <Map
        key={w.city}
        defaultCenter={{ lat: center.lat, lng: center.lng }}
        defaultZoom={16}
        gestureHandling="cooperative"
        disableDefaultUI
        clickableIcons={false}
        style={{ width: '100%', height: '100%' }}
      >
        <ReserveMarkers w={w} center={center} onCount={onCount} />
      </Map>
    </APIProvider>
  );
};

const StreetViewThumb = ({ city }: { city: CityData }) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? '';
  const [failed, setFailed] = useState(false);
  if (!apiKey || failed) return null;
  // request 2x size (320×208) for retina sharpness — displayed at 160×104
  const imgUrl =
    `https://maps.googleapis.com/maps/api/streetview?size=320x208&location=${encodeURIComponent(city.address)}&fov=85&pitch=2&key=${apiKey}`;
  // Search by full address (more accurate than hardcoded city lat/lng, which may snap to a nearby
  // panorama instead of the actual building)
  const openLink = `https://www.google.com/maps?q=${encodeURIComponent(city.address)}&layer=c`;
  return (
    <a
      className="streetview-thumb"
      href={openLink}
      target="_blank"
      rel="noopener noreferrer"
      title="Open in Google Street View"
    >
      <img
        src={imgUrl}
        alt={`Street view of ${city.address}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
      <div className="streetview-thumb-label">
        <Icon name="pin" size={10} />
        <span>Your home</span>
      </div>
    </a>
  );
};

const ReserveArtifact = ({ w }: { w: Workspace }) => {
  const c = CITIES[w.city];
  const feasOk = c.feasibility === 'high';
  const stage = w.reserveStep;
  const [chargerCount, setChargerCount] = useState<{ ac: number; fast: number } | null>(null);
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <div className="label">Google Maps scan · home charging</div>
          <h4 style={{ marginTop: 4 }}>{stage === 0 ? 'Awaiting address…' : c.address}</h4>
        </div>
        {stage === 0 ? (
          <span className="badge muted">IDLE</span>
        ) : stage === 1 ? (
          <span className="badge blue">SCANNING</span>
        ) : (
          <span className={`badge ${feasOk ? 'green' : 'amber'}`}>{c.feasibilityLabel}</span>
        )}
      </div>

      <div className="gmap-frame">
        {stage === 0 ? (
          <div className="reserve-placeholder">
            <div className="reserve-placeholder-icon">
              <Icon name="pin" size={26} />
            </div>
            <div className="reserve-placeholder-title">Share your address.</div>
            <div className="reserve-placeholder-sub">
              I&apos;ll pull the local rules, scan every public charger within 500&nbsp;m, and tell you straight up whether a home wallbox is realistic at your place.
            </div>
            <div className="reserve-placeholder-hint">
              <span className="mono">↓ tap a sample address below the chat</span>
            </div>
          </div>
        ) : (
          <>
            <ReserveMap w={w} onCount={setChargerCount} />
            <StreetViewThumb city={c} />
            {chargerCount && (
              <div className="gmap-legend">
                <span className="gmap-legend-item">
                  <span className="gmap-legend-dot green" /> AC · {chargerCount.ac}
                </span>
                <span className="gmap-legend-item">
                  <span className="gmap-legend-dot blue" /> DC fast · {chargerCount.fast}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="readiness-grid" style={{ opacity: stage === 0 ? 0.25 : 1 }}>
        <div className="rd">
          <span className="rk">Housing type</span>
          <span className="rv blue">{stage >= 1 ? c.housingShort : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Chargers ≤500 m</span>
          <span className="rv green">{stage >= 1 ? `${c.chargers} · ${c.chargerNote}` : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Subpanel access</span>
          <span className={`rv ${feasOk ? 'green' : 'amber'}`}>{stage >= 1 ? c.subpanel : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Approval path</span>
          <span className={`rv ${feasOk ? 'green' : 'amber'}`}>{stage >= 1 ? c.approvalPath : '—'}</span>
        </div>
      </div>

      <div className="score-strip" style={{ opacity: stage >= 2 ? 1 : 0.3 }}>
        <div className="score-strip-left">
          <div className="label">Order Confidence Score</div>
          <div className="score-num">{stage >= 2 ? c.score + w.hoaLetterBonus : '—'}<span>/100</span></div>
        </div>
        <div className="score-bar">
          <span className="bar"><span style={{ width: stage >= 2 ? `${c.score + w.hoaLetterBonus}%` : '0%' }} /></span>
          <div className="score-strip-foot mono">
            {stage >= 2 ? (feasOk ? 'Safe to lock — proceed to install' : 'Lock with contingency window') : 'Awaiting scan…'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Phase 2 artifact: wallbox + installer + letter ───
const InstallArtifact = ({ w }: { w: Workspace }) => {
  const stage = w.installStep;
  const picked = w.install.installerPicked;
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <div className="label">Wallbox · 11 kW Type 2 install plan</div>
          <h4 style={{ marginTop: 4 }}>{stage === 0 ? 'Awaiting handoff…' : stage >= 3 ? `${picked} · booked` : 'Drafting install plan'}</h4>
        </div>
        {stage === 0 && <span className="badge muted">PENDING</span>}
        {stage === 1 && <span className="badge blue">DRAFTING</span>}
        {stage === 2 && <span className="badge blue">QUOTES IN</span>}
        {stage >= 3 && <span className="badge green">BOOKED</span>}
      </div>

      <div className="wireframe" style={{ opacity: stage === 0 ? 0.3 : 1 }}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
          <rect x="10" y="10" width="380" height="180" fill="var(--surface-2)" stroke="var(--border-2)" strokeWidth="0.8" />
          <rect x="10" y="170" width="380" height="20" fill="var(--surface-3)" stroke="var(--border-2)" strokeWidth="0.5" />
          {stage >= 1 && (
            <>
              <rect x="40" y="50" width="56" height="80" fill="var(--bg-2)" stroke="var(--green)" strokeWidth="1.4" />
              <text x="68" y="42" fontFamily="JetBrains Mono" fontSize="8" fill="var(--green)" textAnchor="middle">
                MAIN PANEL
              </text>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={48} y={60 + i * 14} width="40" height="8" fill="var(--surface-3)" stroke="var(--border-2)" strokeWidth="0.4" />
              ))}
              <rect x="280" y="60" width="60" height="80" fill="var(--bg-2)" stroke="var(--blue)" strokeWidth="1.4" />
              <circle cx="310" cy="90" r="10" fill="none" stroke="var(--blue)" strokeWidth="1" />
              <circle cx="310" cy="90" r="3" fill="var(--blue)" />
              <rect x="294" y="110" width="32" height="6" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="0.6" />
              <text x="310" y="52" fontFamily="JetBrains Mono" fontSize="8" fill="var(--blue-strong)" textAnchor="middle">
                WALLBOX · 11 kW
              </text>
              <path d="M96 90 L280 90" stroke={stage >= 2 ? 'var(--green)' : 'var(--border-2)'} strokeWidth="1.6" strokeDasharray="4 3" />
              <text x="188" y="84" fontFamily="JetBrains Mono" fontSize="8" fill="var(--text-2)" textAnchor="middle">
                CONDUIT · 5×6mm² · 22 m
              </text>
              <path d="M310 116 Q330 150 360 168" stroke="var(--text-0)" strokeWidth="1.4" fill="none" />
              <circle cx="362" cy="170" r="4" fill={stage >= 3 ? 'var(--green)' : 'var(--text-3)'} />
              <rect x="180" y="130" width="50" height="20" fill="none" stroke="var(--amber)" strokeWidth="1" strokeDasharray="2 2" />
              <text x="205" y="143" fontFamily="JetBrains Mono" fontSize="7" fill="var(--amber)" textAnchor="middle">
                RCD TYPE B
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="readiness-grid">
        <div className="rd">
          <span className="rk">Capacity</span>
          <span className="rv green">{stage >= 1 ? '11 kW · spare 14 A' : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">RCD Type B</span>
          <span className="rv green">{stage >= 1 ? 'required · quoted' : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Subsidy</span>
          <span className={`rv ${w.install.evSubsidy === 'queued' ? 'green' : 'amber'}`}>
            {w.install.evSubsidy === 'queued' ? 'Ecobonus 50% · queued' : stage >= 1 ? 'eligible · pending' : '—'}
          </span>
        </div>
        <div className="rd">
          <span className="rk">Building notice</span>
          <span className={`rv ${stage >= 3 ? 'green' : 'amber'}`}>
            {stage >= 3 ? 'sent' : stage >= 1 ? 'drafting' : '—'}
          </span>
        </div>
      </div>

      <div className="installer-row-mini" style={{ opacity: stage >= 2 ? 1 : 0.2 }}>
        {[
          { c: 'EE', n: 'Elektro Eisenmann', p: '€1,180', e: '3 wks' },
          { c: 'WB', n: 'WallboxPro München', p: '€1,340', e: '2 wks' },
          { c: 'ME', n: 'MUC Elektrotechnik', p: '€990', e: '5 wks' },
        ].map((i) => {
          const isPicked = stage >= 3 && picked && picked.includes(i.n.split(' ')[0]);
          return (
            <div key={i.c} className={`ir ${isPicked ? 'best' : ''}`}>
              <div className="ir-avi">{i.c}</div>
              <div className="ir-info">
                <div className="ir-name">{i.n}</div>
                <div className="mono ir-sub">VDE · {i.e}</div>
              </div>
              <div className="ir-price">{i.p}</div>
              {isPicked && <span className="badge green">BOOKED</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Phase 3 artifact: garage network ───
// Real Google Maps embed used by ServiceArtifact
const ServiceMarkers = ({
  stage,
  center,
  garages,
}: {
  stage: Workspace['serviceStep'];
  center: LatLng;
  garages: { c: string; n: string; km: number; lat: number; lng: number; best?: boolean }[];
}) => {
  const coreLib = useMapsLibrary('core');
  if (!coreLib) return null;
  const homeIcon = {
    url: HOME_DOT_ICON,
    anchor: new coreLib.Point(16, 16),
    scaledSize: new coreLib.Size(32, 32),
  };
  const pinAnchor = new coreLib.Point(16, 40);
  const pinSize = new coreLib.Size(32, 42);
  return (
    <>
      <Marker position={{ lat: center.lat, lng: center.lng }} title="Your home" icon={homeIcon} />
      {stage >= 1 &&
        garages.map((g) => {
          const isBest = stage >= 2 && !!g.best;
          return (
            <Marker
              key={g.c}
              position={{ lat: g.lat, lng: g.lng }}
              title={`${g.n} · ${g.km} km`}
              icon={{
                url: pinIcon(isBest ? '#34a853' : '#ea4335', isBest ? '#1e8e3e' : '#c5221f', g.c),
                anchor: pinAnchor,
                scaledSize: pinSize,
              }}
            />
          );
        })}
    </>
  );
};

const ServiceMap = ({ city, stage }: { city: CityId; stage: Workspace['serviceStep'] }) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? '';
  const center = CITY_COORDS[city];
  const garages = useMemo(
    () => GARAGE_DEFS.map((g) => ({ ...g, ...offsetLatLng(center, g.km, g.bearing) })),
    [city, center],
  );

  if (!apiKey) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '100%',
          padding: 20,
          color: '#5f6368',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textAlign: 'center',
          letterSpacing: '0.08em',
          lineHeight: 1.6,
        }}
      >
        MAP UNAVAILABLE
        <br />
        Set VITE_GOOGLE_MAPS_API_KEY in .env.local
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        key={city}
        defaultCenter={{ lat: center.lat, lng: center.lng }}
        defaultZoom={center.zoom}
        gestureHandling="cooperative"
        disableDefaultUI
        clickableIcons={false}
        style={{ width: '100%', height: '100%' }}
      >
        <ServiceMarkers stage={stage} center={{ lat: center.lat, lng: center.lng }} garages={garages} />
      </Map>
    </APIProvider>
  );
};

const ServiceArtifact = ({ w }: { w: Workspace }) => {
  const stage = w.serviceStep;
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <div className="label">Service network · 10 km radius</div>
          <h4 style={{ marginTop: 4 }}>{stage === 0 ? 'Awaiting handoff…' : stage >= 2 ? 'Performance Garage · confirmed' : 'Indexing partners'}</h4>
        </div>
        {stage === 0 && <span className="badge muted">PENDING</span>}
        {stage === 1 && <span className="badge blue">INDEXING</span>}
        {stage >= 2 && <span className="badge green">PARTNER CONFIRMED</span>}
      </div>

      <div className="gmap-frame" style={{ opacity: stage === 0 ? 0.3 : 1 }}>
        <ServiceMap city={w.city} stage={stage} />
      </div>
      <div className="readiness-grid">
        <div className="rd">
          <span className="rk">Primary partner</span>
          <span className="rv green">{stage >= 2 ? w.service.primaryGarage : stage >= 1 ? 'top match · ready' : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Distance</span>
          <span className="rv green">{stage >= 2 ? w.service.primaryDistance : stage >= 1 ? '2.4 km' : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">EV-trained</span>
          <span className="rv green">{stage >= 1 ? `${w.service.evTrained} of ${w.service.garageCount}` : '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">HV battery</span>
          <span className="rv amber">{stage >= 1 ? 'MFR-only · routed' : '—'}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Phase 4 artifact: warranty schema ───
const WarrantyArtifact = ({ w }: { w: Workspace }) => {
  const stage = w.warrantyStep;
  const nodes = [
    { x: 50, y: 110, lbl: 'BUYER', sub: 'you', color: 'var(--blue)' },
    { x: 160, y: 60, lbl: 'AGENT', sub: 'triage', color: 'var(--violet)', active: stage >= 1 },
    { x: 160, y: 160, lbl: 'EVIDENCE', sub: 'video · OBD', color: 'var(--text-2)' },
    { x: 280, y: 60, lbl: 'GARAGE', sub: 'inspect', color: 'var(--amber)', active: stage >= 2 },
    { x: 280, y: 160, lbl: 'MFR · HANGZHOU', sub: 'review', color: 'var(--green)', active: stage >= 2 },
    { x: 380, y: 110, lbl: 'RESOLVED', sub: 'logged', color: 'var(--green)' },
  ];
  const arrows: Array<[number, number, number, number]> = [
    [88, 105, 122, 70],
    [88, 115, 122, 155],
    [160, 76, 160, 144],
    [198, 60, 242, 60],
    [198, 160, 242, 160],
    [198, 75, 242, 145],
    [318, 60, 342, 105],
    [318, 160, 342, 115],
  ];
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <div className="label">Warranty case file · live escalation graph</div>
          <h4 style={{ marginTop: 4 }}>{stage === 0 ? 'Awaiting handoff…' : stage >= 2 ? 'Profile active · linked to fleet' : 'Building profile'}</h4>
        </div>
        {stage === 0 && <span className="badge muted">PENDING</span>}
        {stage === 1 && <span className="badge violet">BUILDING</span>}
        {stage >= 2 && <span className="badge green">ACTIVE</span>}
      </div>

      <div className="wireframe" style={{ opacity: stage === 0 ? 0.3 : 1 }}>
        <svg viewBox="0 0 420 220" preserveAspectRatio="xMidYMid meet">
          {nodes.map((n, i) => (
            <g key={i}>
              <rect
                x={n.x - 38}
                y={n.y - 16}
                width="76"
                height="32"
                rx="4"
                fill={n.active ? 'oklch(0.45 0.13 295 / 0.2)' : 'var(--surface-2)'}
                stroke={n.color}
                strokeWidth={n.active ? 1.4 : 0.8}
              />
              <text x={n.x} y={n.y - 2} fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="600" fill={n.color} textAnchor="middle">
                {n.lbl}
              </text>
              <text x={n.x} y={n.y + 9} fontFamily="JetBrains Mono" fontSize="7.5" fill="var(--text-3)" textAnchor="middle">
                {n.sub}
              </text>
            </g>
          ))}
          {arrows.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-2)" strokeWidth="0.8" markerEnd="url(#arrow)" />
          ))}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--border-2)" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="readiness-grid">
        <div className="rd">
          <span className="rk">Vehicle coverage</span>
          <span className="rv green">{w.warranty.coverage ?? '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">HV battery</span>
          <span className="rv green">{w.warranty.hvCoverage ?? '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Median resolution</span>
          <span className="rv blue">{w.warranty.sla ?? '—'}</span>
        </div>
        <div className="rd">
          <span className="rk">Local liaison</span>
          <span className="rv blue">{w.service.primaryGarage ?? '—'}</span>
        </div>
      </div>
    </div>
  );
};

const PhaseArtifact = ({ w, phase }: { w: Workspace; phase: Phase }) => {
  if (phase === 'reserve') return <ReserveArtifact w={w} />;
  if (phase === 'install') return <InstallArtifact w={w} />;
  if (phase === 'service') return <ServiceArtifact w={w} />;
  return <WarrantyArtifact w={w} />;
};

// ─── Files & forms inventory ───
const FilesInventory = ({ w }: { w: Workspace }) => {
  if (w.files.length === 0) {
    return (
      <div className="files-pane empty">
        <div className="label">Files & forms · live</div>
        <div className="mono files-empty">No artifacts yet — they appear here as the agents work.</div>
      </div>
    );
  }
  return (
    <div className="files-pane">
      <div className="files-pane-head">
        <div className="label">Files & forms · live</div>
        <span className="mono">{w.files.length} ITEMS</span>
      </div>
      <div className="files-list">
        {w.files.map((f, i) => (
          <div key={i} className="files-item">
            <span className="files-icon">
              <Icon name={f.icon} size={13} />
            </span>
            <span className="files-name mono">{f.label}</span>
            <span className={`badge ${f.status === 'sent' || f.status === 'received' ? 'blue' : 'green'}`}>{f.status.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// PHASE NODE BAR (sits above chat + workspace)
// =============================================================================

const PhaseBar = ({
  w,
  activePhase,
  onJump,
}: {
  w: Workspace;
  activePhase: Phase;
  onJump: (p: Phase) => void;
}) => (
  <div className="phase-bar">
    {PHASES.map((p, i) => {
      const status = w.phaseStatus[p.id];
      const isActive = p.id === activePhase;
      const cls = `phase-node ${status} ${isActive ? 'on' : ''}`;
      return (
        <Fragment key={p.id}>
          <button type="button" className={cls} onClick={() => onJump(p.id)} title={`Jump to ${p.label}`}>
            <div className="phase-dot">
              {status === 'done' ? <Icon name="check" size={12} /> : <span className="phase-n">{i + 1}</span>}
            </div>
            <div className="phase-meta">
              <div className="phase-name">{p.label}</div>
              <div className="phase-sub mono">{p.sub}</div>
            </div>
            <AgentTile id={p.agentId} />
          </button>
          {i < PHASES.length - 1 && (
            <div className={`phase-edge ${w.phaseStatus[p.id] === 'done' ? 'done' : ''}`} />
          )}
        </Fragment>
      );
    })}
  </div>
);

// =============================================================================
// MAIN DEMO FLOW
// =============================================================================

const TYPING_DELAY = 600; // per block

export const DemoFlow = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentTurnId, setCurrentTurnId] = useState<string | null>('t1');
  const [workspace, setWorkspace] = useState<Workspace>(() => initialWorkspace());
  const [revealedBlocks, setRevealedBlocks] = useState(0);
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const currentTurn = currentTurnId ? TURNS_BY_ID[currentTurnId] : null;
  const activePhase: Phase = currentTurn?.phase ?? 'warranty';

  // Apply enter() patch when turn changes
  useEffect(() => {
    if (!currentTurn) return;
    if (currentTurn.enter) {
      setWorkspace((w) => currentTurn.enter!(w));
    }
    setRevealedBlocks(0);
    setHint(null);
  }, [currentTurnId]); // eslint-disable-line

  // Typing animation: reveal blocks one by one
  useEffect(() => {
    if (!currentTurn) return;
    const total = currentTurn.blocks(workspace).length;
    if (revealedBlocks >= total) return;
    const t = setTimeout(() => setRevealedBlocks((n) => n + 1), TYPING_DELAY);
    return () => clearTimeout(t);
  }, [currentTurn, revealedBlocks, workspace]);

  // Autoscroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [revealedBlocks, history]);

  const totalBlocksRevealed = currentTurn ? revealedBlocks >= currentTurn.blocks(workspace).length : true;

  const jumpToPhase = (target: Phase) => {
    setHistory([]);
    setWorkspace((w) => fastForwardWorkspace(target, w.city));
    setCurrentTurnId(PHASE_ENTRY[target]);
    setHint(null);
    setDraft('');
  };

  const submitUser = (echo: string, option: Option | null) => {
    if (!currentTurn) return;
    setHistory((h) => [...h, { turnId: currentTurn.id, userText: echo, selectedOption: option }]);
    if (option?.patch) setWorkspace((w) => option.patch!(w));
    setDraft('');
    if (option?.next) {
      setCurrentTurnId(option.next);
    } else {
      setCurrentTurnId(null);
    }
  };

  const onSend = () => {
    if (!currentTurn || !totalBlocksRevealed) return;
    const text = draft.trim();
    if (!text) return;
    const options = currentTurn.options(workspace);
    // try to match keywords
    const lower = text.toLowerCase();
    const matched = options.find(
      (o) => (o.keywords ?? []).some((k) => lower.includes(k.toLowerCase())) || lower.includes(o.label.toLowerCase()),
    );
    if (matched) {
      submitUser(text, matched);
    } else {
      // fallback to first option, but show a soft note
      setHint(`I'll treat that as "${options[0].label}" — you can also tap one of the suggestions.`);
      submitUser(text, options[0]);
    }
  };

  const onClickOption = (o: Option) => {
    if (!totalBlocksRevealed) return;
    submitUser(o.echo ?? o.label, o);
  };

  const reset = () => {
    setHistory([]);
    setCurrentTurnId('t1');
    setWorkspace(initialWorkspace());
    setRevealedBlocks(0);
    setDraft('');
    setHint(null);
  };

  // Compute rendered chat: history turns (fully shown + user echo) + current turn blocks (partial reveal)
  const renderedHistory: ReactNode[] = useMemo(() => {
    const out: ReactNode[] = [];
    // Replay each historical turn fully
    let scratch = initialWorkspace();
    for (let idx = 0; idx < history.length; idx++) {
      const entry = history[idx];
      const turn = TURNS_BY_ID[entry.turnId];
      if (!turn) continue;
      if (turn.enter) scratch = turn.enter(scratch);
      const a = AGENTS[turn.agentId];
      turn.blocks(scratch).forEach((b, i) => {
        if (b.kind === 'text') {
          out.push(
            <ChatBubble key={`${entry.turnId}-b${i}`} from="agent" name={a.code} role={`${a.code} · ${a.name} agent`} color={a.color} ts={turn.ts} attachments={b.attachments}>
              {b.text}
            </ChatBubble>,
          );
        } else if (b.kind === 'tool') {
          out.push(<ToolCallView key={`${entry.turnId}-t${i}`} label={b.label} args={b.args} result={b.result} color={a.color} />);
        } else if (b.kind === 'letter') {
          out.push(<LetterPreview key={`${entry.turnId}-l${i}`} doc={b.doc} status={b.status} color={a.color} />);
        } else if (b.kind === 'handoff') {
          out.push(<HandoffPill key={`${entry.turnId}-h${i}`} to={b.to} />);
        }
      });
      // Replay the exact matched/clicked option. Free-form replies often differ
      // from option labels, so string matching here corrupts historical state.
      const userText = entry.userText;
      if (userText !== undefined) {
        const opt = entry.selectedOption;
        if (opt?.patch) scratch = opt.patch(scratch);
        out.push(
          <ChatBubble key={`${entry.turnId}-u`} from="user" name="LV" role="You" color="blue" ts={turn.ts}>
            {userText}
          </ChatBubble>,
        );
      }
    }
    return out;
  }, [history]);

  const currentBlocks = currentTurn ? currentTurn.blocks(workspace).slice(0, revealedBlocks) : [];
  const isTyping = currentTurn && revealedBlocks < currentTurn.blocks(workspace).length;

  return (
    <div className="demo-frame">
      <PhaseBar w={workspace} activePhase={activePhase} onJump={jumpToPhase} />

      <div className="demo-body">
        {/* LEFT — chat */}
        <div className="card chat-card">
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {currentTurn && <AgentTile id={currentTurn.agentId} pulse />}
              <div>
                <h4>{currentTurn ? AGENTS[currentTurn.agentId].name + ' agent' : 'All four phases complete'}</h4>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 2 }}>
                  {currentTurn ? `${AGENTS[currentTurn.agentId].code} · turn ${SCRIPT.findIndex((t) => t.id === currentTurn.id) + 1} / ${SCRIPT.length}` : 'BUYER DOSSIER READY'}
                </div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset}>
              <Icon name="refresh" size={13} /> Reset
            </button>
          </div>

          <div className="chat-scroll" ref={chatRef}>
            {renderedHistory}

            {currentTurn &&
              currentBlocks.map((b, i) => {
                const a = AGENTS[currentTurn.agentId];
                if (b.kind === 'text') {
                  return (
                    <ChatBubble key={`cur-${i}`} from="agent" name={a.code} role={`${a.code} · ${a.name} agent`} color={a.color} ts={currentTurn.ts} attachments={b.attachments}>
                      {b.text}
                    </ChatBubble>
                  );
                }
                if (b.kind === 'tool') {
                  return <ToolCallView key={`cur-t-${i}`} label={b.label} args={b.args} result={b.result} color={a.color} />;
                }
                if (b.kind === 'letter') {
                  return <LetterPreview key={`cur-l-${i}`} doc={b.doc} status={b.status} color={a.color} />;
                }
                if (b.kind === 'handoff') {
                  return <HandoffPill key={`cur-h-${i}`} to={b.to} />;
                }
                return null;
              })}

            {isTyping && currentTurn && (
              <div className="typing">
                <AgentTile id={currentTurn.agentId} />
                <span className="dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="mono">{AGENTS[currentTurn.agentId].code} agent typing…</span>
              </div>
            )}

            {!currentTurnId && (
              <div className="final-card">
                <div className="final-card-head">
                  <Icon name="check" size={16} />
                  <span className="mono">DOSSIER COMPLETE</span>
                </div>
                <h4>You're ready to take delivery.</h4>
                <p>4 phases done · 5+ documents in your file · service partner on standby · warranty live.</p>
                <button className="btn btn-blue btn-sm" onClick={reset}>
                  <Icon name="refresh" size={13} /> Run the demo again
                </button>
              </div>
            )}
          </div>

          {/* Quick-reply chips + input */}
          {currentTurnId && (
            <div className="chat-actions">
              {totalBlocksRevealed && (
                <div className="chip-row">
                  {currentTurn!.options(workspace).map((o, i) => (
                    <button key={i} className="chip-btn" onClick={() => onClickOption(o)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
              {hint && <div className="hint-row mono">{hint}</div>}
              <div className="chat-input-row">
                <input
                  className="chat-input-field"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  placeholder={totalBlocksRevealed ? 'Reply to the agent — or tap a suggestion above' : `${currentTurn ? AGENTS[currentTurn.agentId].code : ''} is typing…`}
                  disabled={!totalBlocksRevealed}
                />
                <button className="btn btn-blue btn-sm chat-send" onClick={onSend} disabled={!totalBlocksRevealed || !draft.trim()}>
                  Send <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — workspace */}
        <div className="card workspace-card">
          <div className="card-head">
            <h4>Live workspace · {AGENTS[PHASES.find((p) => p.id === activePhase)!.agentId].code}</h4>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
              SC01 · BUYER DOSSIER
            </span>
          </div>
          <div className="workspace-scroll">
            <div className="ws-vehicle">
              <img src={sc02} alt="SC01" />
              <div className="ws-vehicle-meta">
                <div className="mono ws-veh-lbl">VEHICLE</div>
                <div className="ws-veh-name">SC01 · pending VIN</div>
                <div className="mono ws-veh-sub">Delivery · Q3 2026 · {CITIES[workspace.city].label}</div>
              </div>
            </div>
            <PhaseHeader active={activePhase} />
            <PhaseArtifact w={workspace} phase={activePhase} />
            <FilesInventory w={workspace} />
          </div>
        </div>
      </div>
    </div>
  );
};
