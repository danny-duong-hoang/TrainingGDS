/**
 * Scenario: Ignore & Redisplay (IR) Host Synchronization
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["ir_redisplay"] = {
  meta: {
    id: "ir_redisplay",
    system: "AMADEUS",
    title: "Ignore & Redisplay (IR)",
    blurb: "Refresh PNR from host database after airline queue sync or split",
    badge: "HOST REFRESH",
    badgeClass: "badge-dark",
    category: "Retrieve Toolkit"
  },

  caseMeta: {
    "PNR": "SYNC01",
    "PASSENGER": "HANSEN/LUKAS MR",
    "TICKET NO.": "074-9911223344",
    "ROUTE": "CPH → AMS",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Flight segment is pending airline action (UC). Execute IR to refresh latest status directly from carrier host."
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
    { type: "dim",  text: "CASE: HOST RECORD REFRESH / IGNORE & REDISPLAY (IR)" },
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
      task: "Retrieve booking record SYNC01 for passenger HANSEN/LUKAS MR.",
      hint: "Type <strong>RTSYNC01</strong> or <strong>RT SYNC01</strong>",
      inputMatch: {
        aliases: ["RTSYNC01", "RT SYNC01"],
        patterns: ["^RT\\s*SYNC01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  06DEC24/0830Z  SYNC01" },
        { type: "ok",  text: "  1.HANSEN/LUKAS MR" },
        { type: "warn",text: "  2  KL 1128 Y 14FEB 5 CPHAMS UC1  1415 1545  *1A/E*" },
        { type: "ok",  text: "  4 AP CPH +45 33 998877 - A" },
        { type: "ok",  text: "  5 APE LUKAS.HANSEN@NORDIC.DK" },
        { type: "ok",  text: "  6 TK OK06DEC/STOSG34AA//ETKL" },
        { type: "ok",  text: "  7 FA PAX 074-9911223344/ETKL/EUR210.00/06DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "warn",text: "SEGMENT 2 PENDING AIRLINE ACTION (UC STATUS — UNABLE CONFIRM)" }
      ]
    },
    {
      id: "redisplay_host",
      title: "Ignore & Redisplay (IR)",
      task: "Execute IR to discard local cache and refresh current record from airline central host.",
      hint: "Type <strong>IR</strong>",
      inputMatch: {
        aliases: ["IR", "I R", "I/R"]
      },
      terminalResponse: [
        { type: "info", text: "IR" },
        { type: "dim",  text: "IGNORING LOCAL CACHE — RE-READING HOST DATABASE..." },
        { type: "ok",   text: "RP/STOSG34AA/STOSG34AA  AA/SU  06DEC24/0832Z  SYNC01" },
        { type: "ok",   text: "  1.HANSEN/LUKAS MR" },
        { type: "ok",   text: "  2  KL 1128 Y 14FEB 5 CPHAMS HK1  1415 1545  *1A/E*" },
        { type: "ok",   text: "  4 AP CPH +45 33 998877 - A" },
        { type: "ok",   text: "  5 APE LUKAS.HANSEN@NORDIC.DK" },
        { type: "ok",   text: "  6 TK OK06DEC/STOSG34AA//ETKL" },
        { type: "ok",   text: "  7 FA PAX 074-9911223344/ETKL/EUR210.00/06DEC/STOSG34AA/01234567/S2" },
        { type: "ok",   text: "STATUS UPDATED TO HK1 — CONFIRMED BY OPERATING CARRIER" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Ignore & Redisplay drill complete! IR (Ignore and Redisplay) discards local cache and re-reads the active PNR directly from the airline host system. Use IR when awaiting airline confirmations, schedule updates, or following an airline-initiated passenger split."
  }
};
