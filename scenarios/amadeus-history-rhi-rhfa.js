/**
 * Scenario: PNR History Audit (RHI / RHFA / RHA)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["history_rhi_rhfa"] = {
  meta: {
    id: "history_rhi_rhfa",
    system: "AMADEUS",
    title: "PNR History Audit (RHI / RHFA / RHA)",
    blurb: "Audit record modifications · Itinerary history · Ticketing history · Air segments",
    badge: "HISTORY AUDIT",
    badgeClass: "badge-dark",
    category: "Retrieve Toolkit"
  },

  caseMeta: {
    "PNR": "HIST01",
    "PASSENGER": "BROWN/ALICE MS",
    "TICKET NO.": "074-7788990011",
    "ROUTE": "LHR → DUB",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Audit historical modifications made to itinerary, ticketing lines, and air segments."
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
    { type: "dim",  text: "CASE: PNR AUDIT TRAIL / RHI, RHFA, RHA HISTORY COMMANDS" },
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
      task: "Retrieve booking record HIST01 for passenger BROWN/ALICE MS.",
      hint: "Type <strong>RTHIST01</strong> or <strong>RT HIST01</strong>",
      inputMatch: {
        aliases: ["RTHIST01", "RT HIST01"],
        patterns: ["^RT\\s*HIST01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  03DEC24/0925Z  HIST01" },
        { type: "ok",  text: "  1.BROWN/ALICE MS" },
        { type: "ok",  text: "  2  BA 0830 Y 12DEC 4 LHRDUB HK1  1015 1135  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 73334455 - A" },
        { type: "ok",  text: "  5 APE ALICE.BROWN@CORP.CO.UK" },
        { type: "ok",  text: "  6 TK OK03DEC/STOSG34AA//ETBA" },
        { type: "ok",  text: "  7 FA PAX 074-7788990011/ETBA/EUR195.00/03DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A HISTORICAL AUDIT TRACE AVAILABLE" }
      ]
    },
    {
      id: "history_itinerary",
      title: "Itinerary History (RHI)",
      task: "Display the chronological history of itinerary segments.",
      hint: "Type <strong>RHI</strong>",
      inputMatch: {
        aliases: ["RHI", "RH I", "RH/I"]
      },
      terminalResponse: [
        { type: "info", text: "RHI" },
        { type: "ok",   text: "HISTORICAL ITINERARY DISPLAY (RHI):" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "  01DEC 1422Z/STOSG34AA/AA  SS BA 0828 Y 10DEC LHRDUB NN1" },
        { type: "dim",  text: "  01DEC 1425Z/STOSG34AA/AA  ER" },
        { type: "warn", text: "  03DEC 0915Z/STOSG34AA/AA  XE 2" },
        { type: "ok",   text: "  03DEC 0916Z/STOSG34AA/AA  SS BA 0830 Y 12DEC LHRDUB NN1" },
        { type: "dim",  text: "  03DEC 0918Z/STOSG34AA/AA  ER" }
      ]
    },
    {
      id: "history_ticketing",
      title: "Ticketing History (RHFA)",
      task: "Display the historical log of FA/ticketing elements.",
      hint: "Type <strong>RHFA</strong>",
      inputMatch: {
        aliases: ["RHFA", "RH FA", "RH/FA"]
      },
      terminalResponse: [
        { type: "info", text: "RHFA" },
        { type: "ok",   text: "HISTORICAL FA/TICKETING AUDIT (RHFA):" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "  03DEC 0920Z/STOSG34AA/AA  FA PAX 074-7788990011/ETBA/EUR195.00/S2" },
        { type: "dim",  text: "  AGENT SIGN: 9999AA/SU — ISSUE TRANSACTION LOGGED" }
      ]
    },
    {
      id: "history_air",
      title: "Air Segment History (RHA)",
      task: "Display history filtered specifically to active and cancelled air segments.",
      hint: "Type <strong>RHA</strong>",
      inputMatch: {
        aliases: ["RHA", "RH A", "RH/A"]
      },
      terminalResponse: [
        { type: "info", text: "RHA" },
        { type: "ok",   text: "HISTORICAL AIR SEGMENTS (RHA):" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "warn", text: "  X2 BA 0828 Y 10DEC 2 LHRDUB HK1 (CANCELLED 03DEC)" },
        { type: "ok",   text: "  A2 BA 0830 Y 12DEC 4 LHRDUB HK1 (ADDED 03DEC)" },
        { type: "info", text: "AUDIT TRACE CONFIRMED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "History audit drill complete! Command mapping: RHI = Itinerary history (all segment additions and cancellations), RHFA = Ticketing history (FA lines, issue and void events), RHA = Air segment history only. Use RH variants to trace who made changes and when."
  }
};
