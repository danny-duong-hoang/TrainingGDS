/**
 * Scenario: Audit TST & Purge Pricing Conflicts (TQT & TTE/ALL)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["tqt_tte"] = {
  meta: {
    id: "tqt_tte",
    system: "AMADEUS",
    title: "Audit TST & Clear Overlap (TQT / TTE)",
    blurb: "Inspect stored fare quote mask (TQT) · Purge invalid TST with TTE/ALL",
    badge: "TST PURGE",
    badgeClass: "badge-blue",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "TJUNK1",
    "PASSENGER": "KOWALSKI/PIOTR MR",
    "TICKET NO.": "074-8899001122",
    "ROUTE": "WAW → CDG → WAW",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Audit conflicting stored TST with TQT then purge invalid pricing mask with TTE/ALL before repricing."
  },

  officeConfig: {
    startOffice: "STOQK2100",
    targetOffice: "STOSG34AA",
    offices: [
      { id: "STOQK2100", label: "STOQK2100 (DEFAULT)" },
      { id: "STOSG34AA", label: "STOSG34AA (ISSUING OFFICE)" }
    ]
  },

  bootLines: [
    { type: "info", text: "AMADEUS SELLING PLATFORM CONNECT — STOQK2100" },
    { type: "dim",  text: "OFFICE: STOQK2100 | AGENT: ATC-TRAINING" },
    { type: "dim",  text: "CASE: PRICING OVERLAP AUDIT (TQT) & MASK RESET (TTE/ALL)" },
    { type: "ok",   text: "READY" }
  ],

  steps: [
    {
      id: "change_office",
      title: "Change Office ID",
      task: "Switch to issuing office STOSG34AA using the Active Office dropdown.",
      hint: "Open <strong>Active Office</strong> and select <strong>STOSG34AA (ISSUING OFFICE)</strong>.",
      inputMatch: {
        type: "office_dropdown",
        targetOffice: "STOSG34AA",
        aliases: []
      },
      stateUpdates: {
        office: "STOSG34AA"
      },
      terminalResponse: [
        { type: "ok",  text: "SIGN IN TO OFFICE: STOSG34AA" },
        { type: "ok",  text: "OFFICE ID  : STOSG34AA" },
        { type: "ok",  text: "STATUS     : SIGNED IN" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Office ID changed to STOSG34AA" }
      ]
    },
    {
      id: "retrieve_pnr",
      title: "Retrieve PNR",
      task: "Retrieve booking record TJUNK1 for passenger KOWALSKI/PIOTR MR.",
      hint: "Type <strong>RTTJUNK1</strong> or <strong>RT TJUNK1</strong>",
      inputMatch: {
        aliases: ["RTTJUNK1", "RT TJUNK1"],
        patterns: ["^RT\\s*TJUNK1$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  10DEC24/0950Z  TJUNK1" },
        { type: "ok",  text: "  1.KOWALSKI/PIOTR MR" },
        { type: "ok",  text: "  2  LO 0331 Y 20FEB 4 WAWCDG HK1  0715 0945  *1A/E*" },
        { type: "ok",  text: "  3  LO 0332 Y 27FEB 4 CDGWAW HK1  1040 1255  *1A/E*" },
        { type: "ok",  text: "  4 AP WAW +48 22 6501234 - A" },
        { type: "ok",  text: "  5 APE PIOTR.KOWALSKI@TRAVEL.PL" },
        { type: "ok",  text: "  6 TK OK10DEC/STOSG34AA//ETLO" },
        { type: "ok",  text: "  7 FA PAX 074-8899001122/ETLO/EUR330.00/10DEC/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "warn",text: "  9 TST 01 STORED — CONFLICTING PRICING MASK DETECTED" }
      ]
    },
    {
      id: "display_tst",
      title: "Display Stored TST (TQT)",
      task: "Display the stored Transitional Stored Ticket (TST) fare quote mask with TQT.",
      hint: "Type <strong>TQT</strong> or <strong>TQT/T1</strong>",
      inputMatch: {
        aliases: ["TQT", "TQT/T1", "TQTT1", "TQT/T01"]
      },
      terminalResponse: [
        { type: "info", text: "TQT/T1" },
        { type: "ok",   text: "TST 01 TYPE P   PAX 1.1 KOWALSKI/PIOTR MR" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "LO 0331  Y  Y 20FEB 0715  YR1PL                 20FEB  1P" },
        { type: "ok",   text: "LO 0332  Y  Y 27FEB 1040  YR1PL                 27FEB  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 260.00   TAX: EUR 70.00   TOTAL: EUR 330.00" },
        { type: "warn", text: "STATUS: OBSOLETE FARE OVERLAP — TST PREVENTS CLEAN RE-PRICING" }
      ]
    },
    {
      id: "purge_tst",
      title: "Purge Stored TST (TTE/ALL)",
      task: "Purge all invalid stored pricing and electronic ticket masks using TTE/ALL.",
      hint: "Type <strong>TTE/ALL</strong> or <strong>TTE</strong>",
      inputMatch: {
        aliases: ["TTE/ALL", "TTE", "TTEALL", "TTE/T1"]
      },
      terminalResponse: [
        { type: "info", text: "TTE/ALL" },
        { type: "ok",   text: "TTE/ALL PROCESSED" },
        { type: "ok",   text: "TST 01 DELETED — ALL PRICING MASKS PURGED" },
        { type: "info", text: "RECORD READY FOR CLEAN FXQ OR FXP PRICING" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "TST purge drill complete! TQT displays the stored fare quote mask (TST) to verify current fares and taxes. When rebooking or updating itineraries, outdated or overlapping TSTs cause pricing conflicts — execute TTE/ALL to purge obsolete masks before issuing new FXQ or FXP entries."
  }
};
