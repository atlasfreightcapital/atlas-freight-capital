import type { RiskLevel } from "@/types/domain";

export type DemoDocument = {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedAt: string;
  bucket?: string;
  path?: string;
};

export type DemoLoad = {
  id: string;
  invoice: string;
  broker: string;
  amount: number;
  status: string;
  risk: RiskLevel;
};

export const demoCarriers = [
  {
    id: "mountain-line-express",
    legalName: "Mountain Line Express LLC",
    owner: "Jaspreet Toor",
    email: "ops@mountainline.example.com",
    phone: "(559) 410-8821",
    mc: "884210",
    dot: "3017742",
    ein: "88-4410291",
    address: "2148 W Shaw Ave, Fresno, CA 93711",
    entityType: "LLC",
    state: "CA",
    years: "3",
    trucks: "8",
    trailerTypes: "Dry van, reefer",
    monthlyVolume: 185000,
    factoringVolume: 150000,
    currentFactor: "None",
    activeUcc: false,
    status: "approved",
    risk: "medium" as RiskLevel,
    riskScore: 58,
    reserveBalance: 18420,
    availablePayout: 79200,
    notes: "Strong lane history. Watch insurance renewal and new broker concentration.",
  },
  {
    id: "westbound-freight-group",
    legalName: "Westbound Freight Group Inc.",
    owner: "Harpreet Sandhu",
    email: "admin@westbound.example.com",
    phone: "(916) 555-0198",
    mc: "772099",
    dot: "2881140",
    ein: "92-1188340",
    address: "800 Riverside Pkwy, Sacramento, CA 95814",
    entityType: "Corporation",
    state: "CA",
    years: "1",
    trucks: "2",
    trailerTypes: "Power only, dry van",
    monthlyVolume: 62000,
    factoringVolume: 55000,
    currentFactor: "Legacy Freight Funding",
    activeUcc: true,
    status: "more_info_needed",
    risk: "high" as RiskLevel,
    riskScore: 77,
    reserveBalance: 6400,
    availablePayout: 0,
    notes: "Existing UCC and release-letter dependency. Require manual approval before funding.",
  },
  {
    id: "clearwater-reefer",
    legalName: "Clearwater Reefer LLC",
    owner: "Maria Alvarez",
    email: "billing@clearwaterreefer.example.com",
    phone: "(214) 555-4420",
    mc: "551892",
    dot: "1980201",
    ein: "83-7761180",
    address: "2401 Commerce St, Dallas, TX 75226",
    entityType: "LLC",
    state: "TX",
    years: "6",
    trucks: "12",
    trailerTypes: "Reefer",
    monthlyVolume: 320000,
    factoringVolume: 240000,
    currentFactor: "None",
    activeUcc: false,
    status: "onboarded",
    risk: "low" as RiskLevel,
    riskScore: 31,
    reserveBalance: 42650,
    availablePayout: 146900,
    notes: "Clean compliance file and stable broker mix. Eligible for faster funding queue.",
  },
];

export const demoCarrierDocuments: Record<string, DemoDocument[]> = {
  "mountain-line-express": [
    { id: "doc-w9", name: "W9 - Mountain Line Express.pdf", type: "W9", status: "accepted", uploadedAt: "Apr 26, 2026" },
    { id: "doc-mc", name: "MC Authority.pdf", type: "MC authority", status: "accepted", uploadedAt: "Apr 26, 2026" },
    { id: "doc-coi", name: "Certificate of Insurance.pdf", type: "Insurance", status: "needs_replacement", uploadedAt: "Apr 27, 2026" },
    { id: "doc-bank", name: "Voided Check.pdf", type: "Bank verification", status: "accepted", uploadedAt: "Apr 27, 2026" },
  ],
  "westbound-freight-group": [
    { id: "doc-w9", name: "W9 - Westbound.pdf", type: "W9", status: "accepted", uploadedAt: "Apr 25, 2026" },
    { id: "doc-id", name: "Owner ID.pdf", type: "Owner ID", status: "needs_replacement", uploadedAt: "Apr 25, 2026" },
    { id: "doc-release", name: "Release Letter Request.pdf", type: "Release letter", status: "uploaded", uploadedAt: "Apr 28, 2026" },
  ],
  "clearwater-reefer": [
    { id: "doc-w9", name: "W9 - Clearwater Reefer.pdf", type: "W9", status: "accepted", uploadedAt: "Apr 22, 2026" },
    { id: "doc-coi", name: "COI Active Through 2027.pdf", type: "Insurance", status: "accepted", uploadedAt: "Apr 22, 2026" },
    { id: "doc-articles", name: "Texas Registration.pdf", type: "Articles", status: "accepted", uploadedAt: "Apr 22, 2026" },
  ],
};

export const demoCarrierLoads: Record<string, DemoLoad[]> = {
  "mountain-line-express": [
    { id: "LD-90322", invoice: "INV-448201", broker: "Blue River Logistics", amount: 4200, status: "atlas_review", risk: "medium" },
    { id: "LD-90288", invoice: "INV-447911", broker: "Northstar Retail Freight", amount: 6100, status: "funded", risk: "low" },
  ],
  "westbound-freight-group": [
    { id: "LD-90441", invoice: "INV-448277", broker: "Southline Brokers", amount: 7800, status: "broker_verification_pending", risk: "high" },
  ],
  "clearwater-reefer": [
    { id: "LD-90477", invoice: "INV-448290", broker: "Delta Produce Network", amount: 6150, status: "sent_to_funding_partner", risk: "low" },
    { id: "LD-90402", invoice: "INV-448010", broker: "Blue River Logistics", amount: 9800, status: "broker_paid", risk: "low" },
  ],
};

export const demoBrokers = [
  {
    id: "blue-river-logistics",
    name: "Blue River Logistics",
    mc: "443991",
    dot: "1882041",
    email: "ap@blueriver.example.com",
    phone: "(312) 555-7800",
    address: "1800 W Fulton Market, Chicago, IL 60612",
    terms: "Net 30",
    avgDays: 18,
    score: 82,
    limit: 250000,
    totalInvoices: 142,
    totalPaid: 1280000,
    disputes: 1,
    chargebacks: 0,
    risk: "low" as RiskLevel,
    notes: "Strong payment history. Auto-approve under $45k when POD is clean.",
  },
  {
    id: "southline-brokers",
    name: "Southline Brokers",
    mc: "998832",
    dot: "4021093",
    email: "billing@southline.example.com",
    phone: "(555) 010-4400",
    address: "410 Peachtree St, Atlanta, GA 30308",
    terms: "Net 45",
    avgDays: 48,
    score: 41,
    limit: 75000,
    totalInvoices: 36,
    totalPaid: 216000,
    disputes: 4,
    chargebacks: 2,
    risk: "high" as RiskLevel,
    notes: "Manual review before approval. Confirm no service failure and payment instructions.",
  },
  {
    id: "delta-produce-network",
    name: "Delta Produce Network",
    mc: "701882",
    dot: "2401991",
    email: "payables@deltaproduce.example.com",
    phone: "(972) 555-0190",
    address: "1160 Market Center Blvd, Dallas, TX 75207",
    terms: "Net 21",
    avgDays: 22,
    score: 76,
    limit: 185000,
    totalInvoices: 87,
    totalPaid: 742500,
    disputes: 2,
    chargebacks: 0,
    risk: "low" as RiskLevel,
    notes: "Good produce payer. Watch temperature claim deductions on reefer loads.",
  },
];

export const demoPartners = [
  {
    id: "keystone-capital-desk",
    name: "Keystone Capital Desk",
    contact: "Avery Mitchell",
    email: "underwriting@keystone.example.com",
    phone: "(646) 555-1008",
    status: "active",
    buyRate: "1.50% - 2.15%",
    maxInvoice: 50000,
    states: "CA, TX, AZ, NV, OR, WA",
    newMc: true,
    activeUcc: false,
    approvalHours: 6,
    notes: "Best fit for small fleet and clean POD files under $50k.",
  },
  {
    id: "harbor-receivables-group",
    name: "Harbor Receivables Group",
    contact: "Morgan Patel",
    email: "review@harborar.example.com",
    phone: "(212) 555-0191",
    status: "active",
    buyRate: "1.75% - 2.45%",
    maxInvoice: 125000,
    states: "Nationwide",
    newMc: true,
    activeUcc: false,
    approvalHours: 10,
    notes: "Good for larger invoices and established brokers. Does not accept active UCC.",
  },
  {
    id: "summit-freight-finance",
    name: "Summit Freight Finance",
    contact: "Natalie Brooks",
    email: "partners@summitfreight.example.com",
    phone: "(303) 555-3409",
    status: "paused",
    buyRate: "1.35% - 1.95%",
    maxInvoice: 30000,
    states: "Midwest",
    newMc: false,
    activeUcc: false,
    approvalHours: 4,
    notes: "Fast approvals, but currently capacity-limited. Manual route only.",
  },
];
