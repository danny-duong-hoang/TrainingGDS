/**
 * Scenario: Wheelchair Assistance Request (SSR WCHR)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["add_wheelchair"] = {
  meta: {
    id: "add_wheelchair",
    system: "AMADEUS",
    title: "Wheelchair Assistance (SR WCHR)",
    blurb: "Book Special Assistance SSR WCHR · Verify HK confirmation via RTG",
    badge: "SPECIAL ASSISTANCE",
    badgeClass: "badge-blue",
    category: "Ancillaries"
  },

  caseMeta: {
    "PNR": "WCHR01",
    "PASSENGER": "O'CONNOR/LIAM MR",
    "TICKET NO.": "074-6655443322",
    "ROUTE": "DUB → CDG",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Passenger has difficulty walking long distances. Request ramp wheelchair (WCHR)."
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
    { type: "dim",  text: "CASE: SPECIAL ASSISTANCE / WHEELCHAIR SSR" },
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
      task: "Retrieve booking record WCHR01 for passenger O'CONNOR/LIAM MR.",
      hint: "Type <strong>RTWCHR01</strong> or <strong>RT WCHR01</strong>",
      inputMatch: {
        aliases: ["RTWCHR01", "RT WCHR01"],
        patterns: ["^RT\\s*WCHR01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  14DEC24/0930Z  WCHR01" },
        { type: "ok",  text: "  1.OCONNOR/LIAM MR" },
        { type: "ok",  text: "  2  AF 1017 Y 14DEC 5 DUBCDG HK1  1145 1435  *1A/E*" },
        { type: "ok",  text: "  4 AP DUB +353 1 8901234 - A" },
        { type: "ok",  text: "  5 APE LIAM.OCONNOR@TRAVEL.IE" },
        { type: "ok",  text: "  6 TK OK14DEC/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-6655443322/ETAF/EUR240.00/14DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A SPECIAL ASSISTANCE REQUEST REQUIRED" }
      ]
    },
    {
      id: "request_wchr",
      title: "Request Wheelchair (SR WCHR)",
      task: "Request ramp wheelchair assistance for passenger 1 on segment 2.",
      hint: "Type <strong>SRWCHR/P1/S2</strong> or <strong>SRWCHR/P1/S2-3</strong>",
      inputMatch: {
        aliases: [
          "SRWCHR/P1/S2",
          "SRWCHR/P1/S2-3",
          "SRWCHR",
          "SR WCHR/P1/S2",
          "SR WCHR/P1/S2-3",
          "SR WCHR",
          "SRWCHR/P1",
          "SR WCHR/P1"
        ]
      },
      terminalResponse: [
        { type: "info", text: "SR WCHR AF NN1 DUBCDG/P1/S2" },
        { type: "ok",   text: "  4 SSR WCHR AF NN1 DUBCDG /P1/S2" },
        { type: "ok",   text: "WHEELCHAIR RAMP ASSISTANCE REQUEST TRANSMITTED TO AIR FRANCE" }
      ]
    },
    {
      id: "verify_wchr",
      title: "Verify Confirmation (RTG)",
      task: "Display special service elements with RTG to verify carrier status.",
      hint: "Type <strong>RTG</strong>",
      inputMatch: {
        aliases: ["RTG"]
      },
      terminalResponse: [
        { type: "info", text: "RTG" },
        { type: "warn", text: "  4 SSR WCHR AF HK1 DUBCDG /P1/S2" },
        { type: "ok",   text: "STATUS: HK (CONFIRMED BY OPERATING CARRIER AIR FRANCE)" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to finalize wheelchair element.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  14DEC24/0935Z  WCHR01" },
        { type: "ok",  text: "  1.OCONNOR/LIAM MR" },
        { type: "ok",  text: "  2  AF 1017 Y 14DEC 5 DUBCDG HK1  1145 1435  *1A/E*" },
        { type: "ok",  text: "  3 SSR WCHR AF HK1 DUBCDG /P1/S2" },
        { type: "ok",  text: "  4 AP DUB +353 1 8901234 - A" },
        { type: "ok",  text: "  5 TK OK14DEC/STOSG34AA//ETAF" },
        { type: "ok",  text: "  6 FA PAX 074-6655443322/ETAF/EUR240.00/14DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "PNR WCHR01 UPDATED — WHEELCHAIR ASSISTANCE CONFIRMED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Wheelchair drill complete. Understanding categories: WCHR = Ramp/Distance (can climb stairs & walk to seat), WCHS = Steps (cannot climb stairs, can walk slowly to seat), WCHC = Cabin (completely immobile, requires aisle chair to seat)."
  }
};
