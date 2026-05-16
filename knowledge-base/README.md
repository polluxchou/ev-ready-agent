# SC-01 GTM Knowledge Base

Ground-truth reference data used by the TopSC agents in the demo flow.
Each file is structured for direct ingestion as RAG context.

| File | Scope |
|---|---|
| `nassau-charging.md` | Home Level 2 EV charger install in Nassau County (Long Island) South Shore — Town of Hempstead permit, PSEG-LI, third-party inspection, IRS §30C |
| `torino-charging.md` | Home wallbox install in a real Torino metro comune (Volpiano) — art. 1122-bis, DM 37/2008, Ecobonus 50%, MIMIT Bonus Colonnine, e-distribuzione |
| `nassau-insurance.md` | Motor insurance for an ~$80k imported EV in Nassau — NY FS-20, 25/50/10, $50k PIP, UM/UIM, Hagerty/Grundy/Chubb specialty paths for the China-VIN problem |
| `torino-insurance.md` | RCA + Kasko in Torino metro — Codice delle Assicurazioni Private, classe di merito CU, Legge Bersani / RC Familiare, the omologazione individuale problem |

**Last verified:** May 2026. Premium ranges and program windows (IRS §30C sunset, MIMIT click-day, ARERA-GSE sperimentazione) are time-sensitive; re-verify before quoting customers.

## How the agents use it

- **PD (Parking & Delivery) agent** quotes feasibility based on the buyer's address, pulling housing-type rules and approval path from the charging docs.
- **CC (Charging & Compliance) agent** drafts the permit / notice using the exact statute references and applies the right subsidy (PSEG-LI rebate, Ecobonus 50%, MIMIT 80%).
- **SN (Service Network) agent** uses the locality's commercial garage density and EV-trained counts.
- **WC (Warranty & Cases) agent** links to insurance routing when the case is collision-related — the insurance docs feed the specialty-carrier matching.
