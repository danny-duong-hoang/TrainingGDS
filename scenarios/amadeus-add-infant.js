/**
 * Scenario: Add Infant without Seat (INF Name Association)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["add_infant"] = {
  meta: {
    id: "add_infant",
    system: "AMADEUS",
    title: "Add Infant Passenger (NM1 INF)",
    blurb: "Add non-seated infant associated to adult passenger",
    badge: "PASSENGER TYPE",
    badgeClass: "badge-dark",
    category: "Name / Passenger"
  },

  caseMeta: {
    "PNR": "INF001",
    "PASSENGER": "SMITH/JOHN MR",
    "TICKET NO.": "074-1199887766",
    "ROUTE": "LHR → JFK",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Add non-seated infant (born 15JUN24) associated to adult passenger 1 SMITH/JOHN MR."
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
    { type: "dim",  text: "CASE: NAME ELEMENT / INFANT WITHOUT SEAT (INF)" },
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
      task: "Retrieve booking record INF001 for passenger SMITH/JOHN MR.",
      hint: "Type <strong>RTINF01</strong> or <strong>RT INF01</strong>",
      inputMatch: {
        aliases: ["RTINF01", "RT INF01", "RTINF001", "RT INF001"],
        patterns: ["^RT\\s*INF00?1$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  10DEC24/1105Z  INF001" },
        { type: "ok",  text: "  1.SMITH/JOHN MR" },
        { type: "ok",  text: "  2  BA 0177 Y 10DEC 2 LHRJFK HK1  1230 1545  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 7946 0991 - A" },
        { type: "ok",  text: "  5 APE JOHN.SMITH@TRAVEL.CO.UK" },
        { type: "ok",  text: "  6 TK OK10DEC/STOSG34AA//ETBA" },
        { type: "ok",  text: "  7 FA PAX 074-1199887766/ETBA/EUR820.00/10DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A INFANT PASSENGER TO BE ADDED" }
      ]
    },
    {
      id: "add_infant_name",
      title: "Add Infant Name (NM1)",
      task: "Add infant with birth date 15JUN24 associated to passenger 1 using Amadeus INF//DOB syntax.",
      hint: "Type <strong>NM1SMITH/JOHN MR(INF//15JUN24)</strong>",
      inputMatch: {
        aliases: [
          "NM1SMITH/JOHN MR(INF//15JUN24)",
          "NM1SMITH/JOHN MR (INF//15JUN24)",
          "NM1SMITH/JOHN(INF//15JUN24)",
          "NM1SMITH/JOHN MR(INF/15JUN24)",
          "NM1SMITH/LEO(INF/15JUN24)"
        ]
      },
      terminalResponse: [
        { type: "info", text: "NM1SMITH/JOHN MR(INF//15JUN24)" },
        { type: "ok",   text: "  1.SMITH/JOHN MR(INF//15JUN24)" },
        { type: "ok",   text: "INFANT ASSOCIATED TO ADULT PASSENGER 1" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit the infant addition.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  10DEC24/1110Z  INF001" },
        { type: "ok",  text: "  1.SMITH/JOHN MR(INF//15JUN24)" },
        { type: "ok",  text: "  2  BA 0177 Y 10DEC 2 LHRJFK HK1  1230 1545  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 7946 0991 - A" },
        { type: "ok",  text: "  5 APE JOHN.SMITH@TRAVEL.CO.UK" },
        { type: "ok",  text: "  6 TK OK10DEC/STOSG34AA//ETBA" },
        { type: "ok",  text: "  7 FA PAX 074-1199887766/ETBA/EUR820.00/10DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "PNR INF001 UPDATED — INFANT NAME ELEMENT STORED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Infant registration complete! In Amadeus, when an infant shares the adult surname, append (INF//DOB) with double slashes directly after the adult name: NM1SURNAME/FIRST TITLE(INF//DOB)."
  }
};
