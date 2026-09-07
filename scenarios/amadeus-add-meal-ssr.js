/**
 * Scenario: Special Meal Request (SSR VGML)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["add_meal_ssr"] = {
  meta: {
    id: "add_meal_ssr",
    system: "AMADEUS",
    title: "Special Meal Request (SR VGML)",
    blurb: "Request special dietary meal SSR VGML · Verify confirmation via RTG",
    badge: "SPECIAL MEAL",
    badgeClass: "badge-blue",
    category: "Ancillaries"
  },

  caseMeta: {
    "PNR": "MEAL01",
    "PASSENGER": "SANTOS/ELENA MRS",
    "TICKET NO.": "074-5566778899",
    "ROUTE": "MAD → EZE",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Customer requests vegetarian vegan meal (VGML) for transatlantic flight."
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
    { type: "dim",  text: "CASE: SPECIAL SERVICE REQUEST / DIETARY MEAL" },
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
      task: "Retrieve booking record MEAL01 for passenger SANTOS/ELENA MRS.",
      hint: "Type <strong>RTMEAL01</strong> or <strong>RT MEAL01</strong>",
      inputMatch: {
        aliases: ["RTMEAL01", "RT MEAL01"],
        patterns: ["^RT\\s*MEAL01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  16DEC24/1210Z  MEAL01" },
        { type: "ok",  text: "  1.SANTOS/ELENA MRS" },
        { type: "ok",  text: "  2  IB 6841 Y 05DEC 4 MADEZE HK1  2355 0845+1  *1A/E*" },
        { type: "ok",  text: "  4 AP MAD +34 91 776655 - A" },
        { type: "ok",  text: "  5 APE ELENA.SANTOS@VIAJES.ES" },
        { type: "ok",  text: "  6 TK OK16DEC/STOSG34AA//ETIB" },
        { type: "ok",  text: "  7 FA PAX 074-5566778899/ETIB/EUR740.00/16DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A SPECIAL MEAL REQUEST IN PROGRESS" }
      ]
    },
    {
      id: "request_meal",
      title: "Request Meal SSR (SR VGML)",
      task: "Enter Special Service Request for vegetarian vegan meal on flight segment 2. (Disclaimer: Airline meal codes and dietary availability vary by carrier and route).",
      hint: "Type <strong>SRVGML/P1/S2</strong> or <strong>SRVGML</strong>",
      inputMatch: {
        aliases: [
          "SRVGML/P1/S2",
          "SRVGML",
          "SR VGML/P1/S2",
          "SR VGML",
          "SRVGML/P1",
          "SR VGML/P1",
          "SRVGML/S2",
          "SR VGML/S2",
          "SRVLMLYY/P1/S2",
          "SRVLML",
          "SR VLML"
        ]
      },
      terminalResponse: [
        { type: "info", text: "SR VGML IB NN1 MADEZE/P1/S2" },
        { type: "ok",   text: "  4 SSR VGML IB NN1 MADEZE /P1/S2" },
        { type: "ok",   text: "SPECIAL MEAL REQUEST TRANSMITTED TO IBERIA" }
      ]
    },
    {
      id: "verify_meal",
      title: "Verify Confirmation (RTG)",
      task: "Display special service elements with RTG to verify carrier status.",
      hint: "Type <strong>RTG</strong>",
      inputMatch: {
        aliases: ["RTG"]
      },
      terminalResponse: [
        { type: "info", text: "RTG" },
        { type: "ok",   text: "  4 SSR VGML IB HK1 MADEZE /P1/S2" },
        { type: "warn", text: "STATUS: HK (CONFIRMED BY OPERATING CARRIER)" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to finalize SSR record.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  16DEC24/1215Z  MEAL01" },
        { type: "ok",  text: "  1.SANTOS/ELENA MRS" },
        { type: "ok",  text: "  2  IB 6841 Y 05DEC 4 MADEZE HK1  2355 0845+1  *1A/E*" },
        { type: "ok",  text: "  3 SSR VGML IB HK1 MADEZE /P1/S2" },
        { type: "ok",  text: "  4 AP MAD +34 91 776655 - A" },
        { type: "ok",  text: "  5 TK OK16DEC/STOSG34AA//ETIB" },
        { type: "ok",  text: "  6 FA PAX 074-5566778899/ETIB/EUR740.00/16DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "PNR MEAL01 UPDATED — SPECIAL MEAL REQUEST CONFIRMED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Special meal request drill complete! Flow: RT → SR <MEAL CODE> (e.g. VGML, HNML, MOML) → RTG (verify airline HK status) → ER. (Disclaimer: Airline meal codes, catering deadlines, and availability vary by carrier)."
  }
};
