/**
 * Scenario: PNR Inspection Toolkit (RT, RTN, RTA, RTF, RTG, RTTN)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["retrieve_toolkit"] = {
  meta: {
    id: "retrieve_toolkit",
    system: "AMADEUS",
    title: "PNR Inspection Toolkit",
    blurb: "Granular inspection commands: RTN, RTA, RTF, RTG, RTTN",
    badge: "RETRIEVE TOOLKIT",
    badgeClass: "badge-dark",
    category: "Retrieve Toolkit"
  },

  caseMeta: {
    "PNR": "INSPECT",
    "PASSENGER": "TAYLOR/SARAH MS",
    "TICKET NO.": "074-1234432100",
    "ROUTE": "LHR → SIN → SYD",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Audit complex PNR elements using isolated retrieve commands."
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
    { type: "dim",  text: "CASE: PNR RETRIEVAL SUB-MASKS & AUDITING" },
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
      title: "Retrieve Master PNR (RT)",
      task: "Open booking record INSPECT to view the complete reservation.",
      hint: "Type <strong>RTINSPECT</strong> or <strong>RT INSPECT</strong>",
      inputMatch: {
        aliases: ["RTINSPECT", "RT INSPECT"],
        patterns: ["^RT\\s*INSPECT$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  05OCT24/1045Z  INSPECT" },
        { type: "ok",  text: "  1.TAYLOR/SARAH MS" },
        { type: "ok",  text: "  2  SQ 0317 Y 05NOV 2 LHRSIN HK1  1125 0730+1  *1A/E*" },
        { type: "ok",  text: "  3  SQ 0221 Y 06NOV 3 SINSYD HK1  2010 0655+1  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 71234567 - A" },
        { type: "ok",  text: "  5 APE SARAH.TAYLOR@TRAVEL.CO.UK" },
        { type: "ok",  text: "  6 TK OK05OCT/STOSG34AA//ETSQ" },
        { type: "ok",  text: "  7 SSR VGML SQ HK1 /S2" },
        { type: "ok",  text: "  8 FA PAX 074-1234432100/ETSQ/EUR1150.00/05OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  9 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: " 10 MIS 1A SPECIAL MEAL CONFIRMED WITH SQ" }
      ]
    },
    {
      id: "display_names",
      title: "Display Names Only (RTN)",
      task: "Filter display to show ONLY passenger name elements.",
      hint: "Type <strong>RTN</strong>",
      inputMatch: {
        aliases: ["RTN"]
      },
      terminalResponse: [
        { type: "info", text: "RTN" },
        { type: "ok",   text: "  1.TAYLOR/SARAH MS" }
      ]
    },
    {
      id: "display_air",
      title: "Display Air Itinerary (RTA)",
      task: "Filter display to show ONLY air itinerary flight segments.",
      hint: "Type <strong>RTA</strong>",
      inputMatch: {
        aliases: ["RTA"]
      },
      terminalResponse: [
        { type: "info", text: "RTA" },
        { type: "ok",   text: "  2  SQ 0317 Y 05NOV 2 LHRSIN HK1  1125 0730+1  *1A/E*" },
        { type: "ok",   text: "  3  SQ 0221 Y 06NOV 3 SINSYD HK1  2010 0655+1  *1A/E*" }
      ]
    },
    {
      id: "display_fare",
      title: "Display Fare & TST (RTF)",
      task: "Filter display to show ONLY fare quotes, ticket numbers, and TST masks.",
      hint: "Type <strong>RTF</strong>",
      inputMatch: {
        aliases: ["RTF"]
      },
      terminalResponse: [
        { type: "info", text: "RTF" },
        { type: "ok",   text: "  TST 01  STORED: EUR 1150.00  S2-3" },
        { type: "ok",   text: "  FA PAX 074-1234432100/ETSQ/EUR1150.00/05OCT/STOSG34AA/01234567/S2-3" }
      ]
    },
    {
      id: "display_ssr",
      title: "Display SSR Elements (RTG)",
      task: "Filter display to show ONLY special service requests and service status.",
      hint: "Type <strong>RTG</strong>",
      inputMatch: {
        aliases: ["RTG"]
      },
      terminalResponse: [
        { type: "info", text: "RTG" },
        { type: "ok",   text: "  4 SSR VGML SQ HK1 LHRSIN /S2" }
      ]
    },
    {
      id: "display_tickets",
      title: "Display Electronic Tickets (RTTN)",
      task: "Filter display to show ONLY electronic ticket records.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "RTTN" },
        { type: "ok",   text: "  8  47 FA PAX 074-1234432100/ETSQ/EUR1150.00/05OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  9     FB PAX 0010000001 TKT/T1" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Retrieve Toolkit complete! Quick reference: RT = Full PNR | RTN = Names | RTA = Air itinerary | RTF = Fares & TSTs | RTG = SSRs & Special Services | RTTN = Electronic tickets list."
  }
};
