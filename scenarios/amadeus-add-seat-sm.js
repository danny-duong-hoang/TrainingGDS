/**
 * Scenario: Seat Map Display (SM) & Seat Assignment (ST)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["add_seat_sm"] = {
  meta: {
    id: "add_seat_sm",
    system: "AMADEUS",
    title: "Seat Map & Seat Assignment (SM/ST)",
    blurb: "Display seat map on flight segment · Assign seat 14A · Confirm HK",
    badge: "SEAT ASSIGNMENT",
    badgeClass: "badge-blue",
    category: "Ancillaries"
  },

  caseMeta: {
    "PNR": "SEAT01",
    "PASSENGER": "NILSSON/SOFIA MS",
    "TICKET NO.": "074-9988112233",
    "ROUTE": "ARN → CDG",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Open seat map for flight segment 2 and assign window seat 14A."
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
    { type: "dim",  text: "CASE: ADVANCE SEAT RESERVATION (SM / ST)" },
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
      task: "Retrieve booking record SEAT01 for passenger NILSSON/SOFIA MS.",
      hint: "Type <strong>RTSEAT01</strong> or <strong>RT SEAT01</strong>",
      inputMatch: {
        aliases: ["RTSEAT01", "RT SEAT01"],
        patterns: ["^RT\\s*SEAT01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  14DEC24/1045Z  SEAT01" },
        { type: "ok",  text: "  1.NILSSON/SOFIA MS" },
        { type: "ok",  text: "  2  AF 1063 Y 18NOV 1 ARNCDG HK1  0630 0910  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 667788 - A" },
        { type: "ok",  text: "  5 APE SOFIA.NILSSON@TRAVEL.SE" },
        { type: "ok",  text: "  6 TK OK14DEC/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-9988112233/ETAF/EUR180.00/14DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A SEAT ASSIGNMENT REQUEST" }
      ]
    },
    {
      id: "seat_map",
      title: "Display Seat Map (SM2)",
      task: "Display the interactive seat map for air segment 2. (Disclaimer: Graphical seat map interface may vary; drill exercises the core terminal command sequence).",
      hint: "Type <strong>SM2</strong> or <strong>SM 2</strong>",
      inputMatch: {
        aliases: ["SM2", "SM 2", "SM/S2"]
      },
      terminalResponse: [
        { type: "info", text: "SM2" },
        { type: "ok",   text: "SEAT MAP AF 1063 Y 18NOV ARNCDG A320" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "    A B C   D E F" },
        { type: "ok",   text: "12  . . .   . . ." },
        { type: "ok",   text: "14  . . X   X . ." },
        { type: "dim",  text: "KEY: (.) AVAILABLE  (X) OCCUPIED  WINDOW: A, F" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "SEAT 14A IS AVAILABLE FOR SELECTION" }
      ]
    },
    {
      id: "assign_seat",
      title: "Assign Seat (ST/14A)",
      task: "Select and assign window seat 14A for passenger 1.",
      hint: "Type <strong>ST/14A</strong> or <strong>ST/14A/P1</strong>",
      inputMatch: {
        aliases: ["ST/14A", "ST14A", "ST/14A/P1", "ST/14A/S2", "ST 14A"]
      },
      terminalResponse: [
        { type: "info", text: "ST/14A" },
        { type: "ok",   text: "  4 SSR SEAT AF NN1 ARNCDG 14A /P1/S2" },
        { type: "ok",   text: "SEAT REQUEST 14A TRANSMITTED TO AIR FRANCE" }
      ]
    },
    {
      id: "verify_seat",
      title: "Verify Seat Status (RTG)",
      task: "Display special service elements to confirm HK seat status.",
      hint: "Type <strong>RTG</strong>",
      inputMatch: {
        aliases: ["RTG"]
      },
      terminalResponse: [
        { type: "info", text: "RTG" },
        { type: "ok",   text: "  4 SSR SEAT AF HK1 ARNCDG 14A /P1/S2" },
        { type: "warn", text: "STATUS: HK (CONFIRMED BY AIRLINE OPERATIONS)" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit the seat assignment.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  14DEC24/1050Z  SEAT01" },
        { type: "ok",  text: "  1.NILSSON/SOFIA MS" },
        { type: "ok",  text: "  2  AF 1063 Y 18NOV 1 ARNCDG HK1  0630 0910  *1A/E*" },
        { type: "ok",  text: "  3 SSR SEAT AF HK1 ARNCDG 14A /P1/S2" },
        { type: "ok",  text: "  4 AP STO +46 8 667788 - A" },
        { type: "ok",  text: "  5 TK OK14DEC/STOSG34AA//ETAF" },
        { type: "ok",  text: "  6 FA PAX 074-9988112233/ETAF/EUR180.00/14DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "PNR SEAT01 UPDATED — SEAT 14A PERMANENTLY CONFIRMED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Seat assignment complete! Flow: RT → SM<segment> (open seat map) → ST/<seat> (take seat) → RTG (verify airline HK status) → ER. (Disclaimer: Seat map graphical layout may vary across systems, but terminal command workflow remains standard)."
  }
};
