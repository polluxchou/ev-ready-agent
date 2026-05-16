# SC-01 GTM IT — Home Wallbox Installation Knowledge Base

**Reference municipality: Volpiano (TO)** — Città Metropolitana di Torino, ~15.000 ab., 15 km NE di Torino sull'asse SR11. Scelto perché: (1) tipico comune di "prima cintura industriale-logistica" dove un importatore SC-01 potrebbe realisticamente effettuare PDI e prima consegna, (2) ha uno **SUE (Sportello Unico Edilizia) digitale** pubblicamente documentato — utile come worked example, (3) è **fuori dal centro storico vincolato** di Torino, quindi rappresenta il caso "base" senza vincolo paesaggistico, (4) PRG con zone residenziali + condomini anni '70-'90 e villette singole — copre i tre casi tipici.

> **Scope:** auto già omologata, targata, IVA assolta. Documento riguarda solo l'installazione di **wallbox AC Type 2 11 kW monofase/trifase** in abitazione privata.

---

## 1. Inquadramento giuridico — base normativa

| Norma | Cosa regola |
|---|---|
| **Codice Civile art. 1122-bis** (riformato L.220/2012, novellato dal DL 76/2020 "Semplificazioni") | Diritto del condomino di installare punti di ricarica anche su parti comuni; *comunicazione* all'amministratore, non autorizzazione |
| **DPR 380/2001 (Testo Unico Edilizia) art. 6** | Edilizia libera: punto di ricarica privato è **attività libera** se non richiede nuova connessione di rete e l'installatore è abilitato |
| **DM 37/2008 art. 3 e art. 7** | Solo imprese abilitate (lettera **a** — impianti elettrici) iscritte CCIAA possono installare; rilasciano **Di.Co. — Dichiarazione di Conformità** |
| **CEI 64-8 sez. 722** | Norma tecnica impianto: linea dedicata, RCD tipo A con rilevamento DC 6 mA o tipo B, sezionatore, SPD se >20 m cavo |
| **CEI 0-21** | Regola di connessione BT lato distributore (e-distribuzione) |
| **DL 257/2016 e DM 28 ottobre 2025** | Obbligo predisposizione canalizzazioni in nuove costruzioni / ristrutturazioni pesanti |

---

## 2. I tre scenari abitativi — checklist comparata

### A) Villetta / unità abitativa singola (caso più semplice)
- [ ] Nessuna pratica edilizia (rientra in **edilizia libera ex art. 6 DPR 380/01**) purché contatore esistente sia sufficiente
- [ ] Nessuna comunicazione a terzi (no amministratore)
- [ ] Eventuale richiesta **aumento potenza** al venditore di energia (vedi §4)
- [ ] Installatore abilitato DM 37/08 lett. a) → **Di.Co.** consegnata al committente

### B) Condominio — wallbox su posto auto / box di proprietà esclusiva, cavo passa per parti comuni
- [ ] **Comunicazione scritta all'amministratore** ex art. 1122-bis c.c. con: relazione tecnica, schema percorso cavo, modalità di esecuzione, ditta esecutrice, tempistica
- [ ] **Non serve voto assembleare**, non serve autorizzazione
- [ ] L'amministratore può convocare l'assemblea che — con maggioranza ex art. 1136 co. 5 (maggioranza intervenuti + ≥500 millesimi) — può **prescrivere modalità alternative** (es. percorso cavo diverso) ma **non vietare**
- [ ] Se l'assemblea non delibera entro **3 mesi** o nega senza motivo tecnico → si procede comunque
- [ ] Preavviso pratico consigliato: **30 giorni** prima dei lavori

### C) Condominio — wallbox condivisa su parte comune
- [ ] Delibera assembleare con maggioranza dell'art. 1136 co. 2 c.c. (maggioranza intervenuti + ≥500 millesimi)
- [ ] Eventuale modifica tabelle millesimali se cambia ripartizione spese
- [ ] Stesso iter tecnico (DM 37/08, CEI 64-8)

---

## 3. Pratica edilizia — CILA / SCIA / nulla

| Situazione | Titolo edilizio |
|---|---|
| Wallbox a parete su muro proprio, niente opere murarie significative | **Nessuno** — edilizia libera art. 6 |
| Cavidotto interrato breve in cortile privato, no modifiche strutturali | **Nessuno** — edilizia libera |
| Foratura muri portanti, opere murarie rilevanti, modifiche prospetti | **CILA** allo SUE comunale |
| Modifiche strutturali significative / opere su immobile vincolato | **SCIA** (raro per wallbox) |
| Centro storico Torino o area con **vincolo paesaggistico** (D.Lgs 42/2004) | **Autorizzazione paesaggistica semplificata** (DPR 31/2017) — *non* è il caso di Volpiano periferia |

**Permesso di Costruire (PdC) non è mai richiesto** per wallbox residenziale.

---

## 4. Connessione di rete — e-distribuzione

- **POD** (Point of Delivery, codice IT001E…): identificativo univoco del punto fornitura — si trova in bolletta
- Contatore tipico domestico Italia: **3 kW monofase**. Per ricaricare SC-01 a 11 kW serve **trifase** o almeno **6 kW monofase**
- **Aumento potenza ≤ 6 kW monofase**: richiesta al venditore → e-distribuzione esegue in **5 gg lavorativi**, costo ~**61,26 €/kW + 23 € contributo fisso + IVA 22%** = ~200-250 € una tantum
- **Aumento >6 kW o passaggio a trifase (11/22 kW)**: il distributore emette preventivo (tempi 15-30 gg, costo variabile 300-1.000+ €)
- **Sperimentazione ARERA-GSE "wallbox 6 kW notturna"**: gratis (no costo aumento), fasce 23:00-07:00 + domeniche/festivi 24h, richiede contatore 2G, wallbox Modo 3 smart connessa. Domande aperte fino al **30 giugno 2026**, beneficio fino al 30 giugno 2027

---

## 5. Installatore — DM 37/2008

- Deve essere **impresa iscritta CCIAA con abilitazione lettera a)** (impianti elettrici)
- Al termine rilascia **Dichiarazione di Conformità (Di.Co.)** in originale al committente con allegati obbligatori: relazione materiali, schema unifilare, riferimento norme CEI applicate, visura CCIAA, copia abilitazione del responsabile tecnico
- La Di.Co. è **obbligatoria per legge** ed è **condizione di accesso a qualsiasi incentivo fiscale**
- Tempo di installazione tipico: **mezza/una giornata** (4-8 h)

---

## 6. Collaudo / verifiche

- **Nessun collaudo da ente pubblico** per wallbox domestica (no ARPA Piemonte, no ASL, no Comune verifica preventiva)
- La **Di.Co.** vale come autocertificazione di conformità
- L'installatore esegue verifiche obbligatorie ex CEI 64-8 (continuità PE, isolamento, RCD trip test, impedenza loop guasto) — risultati allegati alla Di.Co.

---

## 7. Incentivi fiscali 2026

| Incentivo | Aliquota | Massimale | Stato 2026 |
|---|---|---|---|
| **Ecobonus / Bonus Ristrutturazioni** (DL 63/2013, prorogato L. Bilancio 2026) | **50%** prima casa, **36%** seconde case | 3.000 € per punto ricarica, detratti in 10 quote annuali IRPEF | Attivo fino al **31 dicembre 2026** |
| **Bonus Colonnine Domestiche MIMIT** (PNRR/fondo dedicato) | **80%** | 1.500 € privato / 8.000 € condominio | Finestra **29 apr → 27 mag 2026** per spese 2024-2025; click-day Invitalia |
| **Regione Piemonte — Bando Rinnovo Flotte 2025-2026** | Fino +2.000 € per wallbox abbinata a EV | — | Solo imprese piemontesi, fondi fino 30 apr 2026 |

> Ecobonus e Bonus Colonnine MIMIT **non sono cumulabili** sulla stessa spesa.

---

## 8. Flow narrativo — buyer ↔ wallbox attiva

```
[D0]   Cliente firma ordine SC-01 → TopSC apre dossier "Home Charging"
  |
[D0+3] Sopralluogo installatore partner (gratis): foto quadro, distanza posto auto, lettura POD, verifica trifase
  |
[D5]   Preventivo + scelta scenario A/B/C
  |
[D7]   ▸ Caso B/C: invio comunicazione 1122-bis ad amministratore (PEC) — attendere 30 gg buona prassi
       ▸ Caso A: salta
  |
[D7]   Richiesta aumento potenza al venditore energia → e-distribuzione: 5 gg (≤6 kW) o 15-30 gg (trifase)
  |
[D15-30] Nuovo contatore attivo / potenza aumentata
  |
[D30-40] Installazione wallbox (4-8 h) → installatore rilascia Di.Co.
  |
[D40]  Wallbox in uso. Cliente conserva: Di.Co., fattura tracciabile (bonifico parlante!), schede tecniche
  |
[D40+] Pratica fiscale: detrazione 50% in dichiarazione redditi OPPURE
       domanda Bonus Colonnine MIMIT su Invitalia con SPID nella finestra annuale
```

**Tempistica totale tipica: 4-6 settimane** dal sopralluogo all'attivazione. Caso A (villetta, no aumento potenza, no condominio): **7-10 giorni**.

---

## 9. Costi tipici — Volpiano / cintura Torino 2026

| Voce | Range |
|---|---|
| Wallbox 11 kW Type 2 (Wallbox Pulsar Plus, Enel X Way, V2C, Daze) | 600 – 1.300 € |
| Installazione (cavidotto < 10 m, RCD dedicato, sottoquadro) | 400 – 900 € |
| Aumento potenza ≤ 6 kW (one-shot) | ~200-250 € |
| Passaggio a trifase 11 kW | 350 – 1.000 € |
| Eventuale CILA (se opere murarie) — tecnico abilitato + diritti SUE Volpiano | 400 – 800 € |
| Compenso amministratore per gestione comunicazione 1122-bis (se condominio) | 0 – 150 € |
| **Totale tipico chiavi in mano** | **1.500 – 3.000 €** |
| **Costo netto post Ecobonus 50%** | **750 – 1.500 €** (rateizzato 10 anni) |

---

## 10. Showstopper ricorrenti

1. **Condominio anni '60-'70**: cabina di consegna e montanti dimensionati per 3 kW × appartamento. Aggiungere 11 kW trifase può richiedere **rifacimento montante** → 1.500-5.000 € e 2-4 mesi.
2. **Posto auto in uso ma non di proprietà esclusiva** → manca il diritto reale, l'art. 1122-bis non si applica direttamente; serve delibera assembleare ordinaria.
3. **Centro storico Torino / immobili vincolati** (UNESCO Residenze Sabaude): serve autorizzazione paesaggistica semplificata DPR 31/2017 (30-60 gg). **Non è il caso di Volpiano**.
4. **Box auto in area separata dall'abitazione** (autorimessa interrata staccata): POD diverso → o nuova fornitura dedicata, o cavo dal proprio appartamento attraverso parti comuni.
5. **Aumento potenza negato in zone con cabina secondaria satura** — frequente in alcune frazioni di Volpiano lato industriale: ripiego sulla sperimentazione ARERA 6 kW notturna.

---

## Fonti

- [Art. 1122-bis Codice Civile — Brocardi](https://www.brocardi.it/codice-civile/libro-terzo/titolo-vii/capo-ii/art1122bis.html)
- [DPR 380/2001 art. 6 — Edilizia libera](https://biblus.acca.it/art-6-dpr-380-01/)
- [DM 37/2008 testo coordinato — Bosetti & Gatti](https://www.bosettiegatti.eu/info/norme/statali/2008_0037.htm)
- [Dichiarazione di Conformità Di.Co. — BibLus](https://biblus.acca.it/certificato-di-conformita-impianti-cose-obbligo-esempio-pdf/)
- [CEI 64-8 sez. 722 e wallbox — NT24](https://nt24.it/2020/12/installazione-wallbox-e-norma-cei-64-8-sez-722/)
- [Aumento potenza contatore — e-distribuzione](https://www.e-distribuzione.it/supporto/costi-tempi-aumento-potenza-contatore.html)
- [Sperimentazione ARERA-GSE 6 kW notturna](https://www.arera.it/comunicati-stampa/dettaglio/auto-elettrica-riparte-la-sperimentazione-smart-di-arera-e-gse)
- [Bonus Colonnine Domestiche MIMIT](https://www.mimit.gov.it/it/incentivi/bonus-colonnine-domestiche)
- [Ecobonus / Bonus Ristrutturazioni wallbox 2026](https://bonuscasafacile.it/wallbox-colonnine-ricarica-bonus-costi-2026/)
- [Mobilità elettrica Regione Piemonte](https://www.regione.piemonte.it/web/temi/mobilita-trasporti/mobilita-elettrica)
- [SUE Comune di Volpiano](https://hosting.pa-online.it/001314/sportello-unico-digitale/)
- [Comune di Volpiano — SUE](https://www.comune.volpiano.to.it/it-it/servizi/catasto-e-urbanistica/sportello-unico-per-l-edilizia-sue-645-42354-1-4bf7f581c29e1fdb1eb24af951033eae)
- [Colonnine condominio normativa — Ingenio](https://www.ingenio-web.it/articoli/colonnine-di-ricarica-condominiali-normativa-disciplina-e-obblighi/)

---
*Knowledge base v1.0 — ground truth per AI agent SC-01 IT. Ultimo aggiornamento: maggio 2026.*
