# Nassau County South Shore — Home Level 2 EV Charger Installation Knowledge Base

**Scope:** Single-family / townhouse garage Level 2 (240 V) charger installation for owners in the South Shore of Nassau County (Massapequa, Wantagh, Seaford, Bellmore, Merrick, Freeport, Baldwin, Oceanside). Assumes vehicle import, NHTSA/EPA compliance, and NY DMV registration are already done.
**Last verified:** May 2026. PSEG-LI Residential Charger Rebate program year and IRS §30C sunset (June 30, 2026) are time-sensitive — re-verify before quoting customers.

---

## 1. Responsibility Matrix

| Party | Responsibility |
|---|---|
| **Homeowner** | Hires licensed electrician; signs permit application as owner; pays permit + inspection fees; applies for PSEG-LI rebate; files IRS Form 8911 if eligible; verifies HOA/condo bylaws for townhomes. |
| **Licensed electrician** (must hold the Town's electrical license + Nassau County registration) | Sizes the 240 V circuit (typically 40–60 A breaker for a 32–48 A charger), files the electrical permit, performs the install, schedules and meets the third-party electrical inspector, pulls a service upgrade through PSEG-LI if panel is undersized. |
| **Town Building Department** (Hempstead, Babylon, Oyster Bay) | Issues the electrical permit, reviews load calc + one-line diagram, accepts the third-party inspection certificate, issues Letter of Completion / closes the permit. |
| **PSEG Long Island** | Owns everything from the pole to the meter base. Handles service upgrades (e.g. 100 A → 200 A), transformer sizing if multiple EVs on a block, and the SmartCharge / Residential Charger rebate. Does NOT inspect interior wiring. |
| **Third-party Electrical Inspector** (NYBFU / Atlantic-Inland / Commonwealth Electrical Inspection) | Performs the rough-in (if concealed) and final inspections required by the Town because Nassau Towns do not have in-house electrical inspectors. Issues the Electrical Certificate that closes out the Town permit. |

---

## 2. Required Permit Documents

- **Town of Hempstead** (covers Massapequa, Wantagh, Seaford, Bellmore, Merrick, Freeport, Baldwin, Oceanside, Lido Beach, etc.): **Electrical Permit Application** filed through the Online Permit Center (citizenserve portal). Plus signed/notarized **Owner's Authorization** and **Contractor Disclosure Affidavit**. Submittals: one-line diagram, EVSE cut sheet, panel schedule, load calculation per NEC 220.87 / 625.42.
- **Town of Babylon** (Amityville, Copiague, Lindenhurst, North Babylon): **Electrical Permit Application** via the Town's online portal (mandatory online filing since Feb 2026). Fee bracket ~$150–$350.
- **Town of Oyster Bay** (Massapequa north of Sunrise Hwy, Plainview, Syosset): **Application for Permit-to-Build-or-Install** + notarized **Applicant Disclosure Affidavit** for owner and every contractor. Filed through the Town Building Portal.
- **Incorporated villages within these towns** (Freeport, Lindenhurst, Massapequa Park, etc.) issue their own permits — check the village before the Town.

---

## 3. Electrician Licensing Requirements

- **NY State** does not issue a state-level electrician license; licensing is at the county/town/city level.
- **Nassau County** requires a county-issued Master Electrician (or Electrical Contractor) license — minimum 7 years documented experience under a licensed Master.
- **Town of Hempstead** additionally enforces Chapter 84 (Master Electricians); the electrician's Hempstead license must be current and on file before permit issuance.
- **Town of Babylon** (Suffolk-side) requires a Suffolk County Master Electrician license — Nassau licenses are NOT automatically reciprocal.
- **Town of Oyster Bay** accepts Nassau County Master Electrician license but requires Town registration.
- **Practical implication for South Shore:** an electrician working both sides of the Nassau–Suffolk line (e.g. Massapequa and Amityville) needs BOTH county licenses.

---

## 4. PSEG Long Island Procedures

- **Panel check first.** Roughly 80% of post-1990 Long Island homes already have 200 A service. Pre-1980 Cape Cod / split-level homes in Bellmore/Merrick/Wantagh often still have 100 A or 150 A — likely needs upgrade.
- **Service upgrade (100A → 200A):** electrician submits the upgrade through PSEG-LI Building & Renovation Services (BRSLI@psegliny.com / 1-800-692-2626). PSEG handles the riser/meter pan replacement and may reset the service drop. Typical lead time: 2–6 weeks.
- **Interconnection application** is NOT required for a one-way Level 2 charger. Required only for V2G/V2H bidirectional setups or if pairing with solar/battery — uses the SGIP application track.
- **Notification:** PSEG-LI does not require the customer to notify them just to add a Level 2 load if existing service is adequate, but the rebate application triggers a record.

---

## 5. Inspection Workflow

1. **Rough-in inspection** (only if wiring is concealed in finished walls or buried in conduit) — third-party agency (NYBFU/Atlantic-Inland/Commonwealth) verifies conduit, wire gauge, grounding, box fill before drywall closes.
2. **Final inspection** — verifies EVSE mounted, GFCI, breaker labeling, disconnect within sight, NEC 625 compliance, load calc.
3. **Electrical Certificate** is issued by the third-party agency and emailed to the Town. The agency invoices the homeowner/contractor directly (~$100–$200).
4. **Town Letter of Completion / permit closeout** issued after the certificate arrives.

---

## 6. Typical Timeline (contract signing → final closeout)

| Step | Duration |
|---|---|
| Site survey, load calc, quote | 3–7 days |
| Permit filing (Hempstead online portal) | 1 day |
| Permit issued (no panel upgrade) | 5–15 business days |
| Permit issued + PSEG service upgrade coordination | 3–6 weeks |
| Install day | 4–8 hours |
| Third-party inspection scheduled and passed | 5–10 business days after install |
| Town Letter of Completion | 1–3 weeks after inspection |
| **Total typical** | **3–5 weeks** (no upgrade), **6–10 weeks** (with 200 A upgrade) |

---

## 7. Rebates and Tax Credits (2026)

- **PSEG-LI Residential Charger Rebate (2026):** $100 instant rebate on a qualified Level 2 charger from the EPRI Vetted Product List (PSEG-LI). Additional $300 for customers in a Disadvantaged Community (DAC) or Household Assistance Program = up to **$400 total**. Open through Dec 31, 2026 or until budget exhausted. Apply via PSEG-LI Online Marketplace (instant) or post-purchase form.
- **PSEG-LI Time-of-Day / Time-of-Use Rates** (Rate 194 / Rate 195 Super Off-Peak): up to ~40% lower kWh cost for overnight charging (10 p.m.–6 a.m. seven days/week on Rate 195). 12-month bill protection. Not a rebate but the most material long-run saving.
- **NY State Drive Clean** — vehicle-side only (up to $2,000 off EV purchase). Does NOT cover home charger hardware/install for individual homeowners.
- **NYSERDA Charge Ready NY 2.0** — workplace/multifamily only. NOT available to single-family homes.
- **Federal IRS §30C (Form 8911):** 30% of cost up to **$1,000** for residential charger + install. **Critical:** the One Big Beautiful Bill Act moved the sunset to **June 30, 2026** — property must be placed in service by that date. Also requires the home to sit in an eligible **non-urban OR low-income census tract**. Most South Shore Nassau census tracts (Massapequa, Wantagh, Bellmore, Merrick) are classified urban and not low-income, so **many South Shore homeowners will NOT qualify**. Verify the 11-digit GEOID against the IRS Appendix A list before promising the credit to a customer. Freeport and parts of Roosevelt/Baldwin contain qualifying low-income tracts.

---

## 8. Typical Cost Range (South Shore, 2026)

| Line item | Range |
|---|---|
| Level 2 EVSE hardware (e.g. Tesla Wall Connector, ChargePoint Home Flex, Wallbox Pulsar Plus) | $400 – $1,200 |
| Standard install (garage with existing 200 A panel, <25 ft run) | $650 – $1,500 |
| Long run / exterior conduit / trenching | +$500 – $1,500 |
| 100 A → 200 A panel + service upgrade | $1,800 – $3,500 |
| Town electrical permit fee (Hempstead/Babylon/OB) | $100 – $350 |
| Third-party inspection fee | $100 – $200 |
| **Typical all-in (no upgrade)** | **$1,300 – $2,500** |
| **Typical all-in (with 200 A upgrade)** | **$3,500 – $5,500** |

---

## 9. Common Blockers on the South Shore

- **Undersized service:** older Cape Cods in central Bellmore/Merrick/Wantagh with 100 A panels and 1970s aluminum service entrance — forces a PSEG service upgrade and adds 3–6 weeks.
- **FEMA flood zones (AE / VE):** large parts of South Massapequa, Massapequa Shores, Biltmore Shores, Harbor Isle Freeport, Seaford Harbor, Wantagh canal blocks. Garage and panel must be at or above Base Flood Elevation (BFE); panels in unelevated attached garages may need to be raised or relocated, which the Town will flag on plan review. Use FEMA Map Service Center (msc.fema.gov) to confirm zone before quoting.
- **HOA / condo / co-op restrictions:** townhome/condo complexes in Freeport (Harbor Isle, Bayview), Massapequa (Harbour Green), Merrick (Meadowbrook). NY Right-to-Charge protection (RPTL §238) covers most condos but NOT co-ops; HOA board approval and shared-meter/sub-metering questions can stall installs 30–90 days.
- **Shared driveways / mother-daughter rentals:** common in Freeport and Baldwin; meter ownership and panel access must be documented for the permit.
- **Pre-existing knob-and-tube / fused panels** in older Freeport and Baldwin homes — must be replaced before any new 240 V circuit is added.

---

## 10. Official / Authoritative Sources

- PSEG-LI Residential Charger Rebate: https://www.psegliny.com/saveenergyandmoney/GreenEnergy/EV/ResidentialCustomers/ChargerRebate
- PSEG-LI EV main page: https://www.psegliny.com/saveenergyandmoney/greenenergy/ev
- PSEG-LI Time of Use rates: https://www.psegliny.com/timeofuse
- PSEG-LI Building & Renovation Services: https://www.psegliny.com/buildingrenovationservices/upgradeorchangeservice
- PSEG-LI Interconnection (SGIP): https://www.psegliny.com/aboutpseglongisland/ratesandtariffs/sgip/applications
- Town of Hempstead Online Permit Center: https://hempsteadny.gov/622/Online-Permit-Center
- Town of Hempstead Permits & Forms: https://hempsteadny.gov/209/Permits-Forms
- Town of Hempstead Chapter 84 (Master Electricians): https://ecode360.com/15509840
- Town of Babylon Permit Applications: https://townofbabylonny.gov/260/Permit-Applications-Documents
- Town of Babylon EV Charging page: https://www.townofbabylonny.gov/792/Electric-Vehicle-Charging
- Town of Oyster Bay Building Portal: https://oysterbaytown.com/departments/planning-and-development/building-portal/
- Town of Oyster Bay Ch. 107 Electrical Standards: https://ecode360.com/26874872
- NYBFU / Electrical Inspectors Inc.: https://electricalinspectors.com/
- Atlantic-Inland Inc.: https://www.atlanticinlandinc.com/
- IRS §30C Alternative Fuel Refueling Property Credit: https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit
- IRS §30C eligible census tract FAQ: https://www.irs.gov/credits-deductions/frequently-asked-questions-regarding-eligible-census-tracts-for-purposes-of-the-alternative-fuel-vehicle-refueling-property-credit-under-section-30c
- IRS Form 8911 Instructions (12/2025): https://www.irs.gov/instructions/i8911
- NYSERDA Drive Clean Rebate: https://www.nyserda.ny.gov/All-Programs/Drive-Clean-Rebate-For-Electric-Cars-Program
- NYSERDA Charge Ready NY 2.0: https://www.nyserda.ny.gov/All-Programs/Charge-Ready-NY
- FEMA Flood Map Service Center: https://msc.fema.gov/portal/search

---

## Process Flow

```
[SC-01 owner signs SOW]
        |
        v
[Site survey + panel/load assessment] -- 200A? --no--> [PSEG-LI service upgrade via BRSLI@psegliny.com]
        |                                                      |
        | yes                                                  v (2-6 weeks)
        |<-----------------------------------------------------+
        v
[Licensed Nassau Master Electrician files Town electrical permit
 (Hempstead Online Permit Center / Babylon online / OB Building Portal)]
        |
        v (5-15 business days)
[Permit issued]
        |
        v
[Install day: mount EVSE, run 240V circuit, breaker, disconnect]
        |
        v
[Schedule 3rd-party inspection: NYBFU / Atlantic-Inland / Commonwealth]
        |
        v (5-10 business days)
[Rough-in (if concealed) -> Final inspection -> Electrical Certificate]
        |
        v
[Town Letter of Completion / permit closeout]   +   [PSEG-LI rebate via Online Marketplace]
        |
        v
[Optional: enroll in PSEG-LI TOU Rate 194 / Super Off-Peak Rate 195]
        |
        v
[Optional: file IRS Form 8911 for §30C credit IF property in eligible census tract AND placed in service before June 30, 2026]
```

---

## Key flags for GTM team

1. **The IRS §30C 30% / $1,000 federal credit dies June 30, 2026** — re-verify before quoting it on the site.
2. **Most South Shore Nassau homeowners do NOT qualify for §30C** — urban + not low-income census tracts. Freeport and parts of Roosevelt/Baldwin are the exceptions.
3. **PSEG-LI rebate is only $100** for most customers ($400 with DAC). Smaller than CA/NJ utility rebates; don't overstate.
4. **Realistic cost story: $1,300–$2,500 all-in** for ~80% of homes with 200 A service, **$3,500–$5,500** with a panel upgrade.
5. **Nassau–Suffolk license boundary matters** — Massapequa is Hempstead/Nassau; Amityville across the border is Babylon/Suffolk, different electrician license.
6. The defunct **SmartCharge Rewards** program (closed 2021) is sometimes cited in old blog posts — current equivalent is just enrolling in PSEG-LI **Time-of-Use Rate 195 (Super Off-Peak)**.
