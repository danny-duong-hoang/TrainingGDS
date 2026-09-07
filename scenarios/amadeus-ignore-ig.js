/**
 * Scenario: Discard Modifications with Ignore (IG)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["ignore_ig"] = {
  meta: {
    id: "ignore_ig",
    system: "AMADEUS",
    title: "Ignore Transaction (IG)",
    blurb: "Discard pending edits and avoid saving unwanted changes with IG",
    badge: "DISCARD EDITS",
    badgeClass: "badge-dark",
    category: "Retrieve Toolkit"
  },

  caseMeta: {
    "PNR": "IGNR01",
    "PASSENGER": "TAYLOR/CHLOE MS",
    "TICKET NO.": "074-6677881122",
    "ROUTE": "OSL → CPH",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Add a test remark to simulate an unwanted edit, then execute IG to discard changes without saving."
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
    { type: "dim",  text: "CASE: BUFFER MANAGEMENT / IGNORE TRANSACTION (IG)" },
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
      task: "Retrieve booking record IGNR01 for passenger TAYLOR/CHLOE MS.",
      hint: "Type <strong>RTIGNR01</strong> or <strong>RT IGNR01</strong>",
      inputMatch: {
        aliases: ["RTIGNR01", "RT IGNR01"],
        patterns: ["^RT\\s*IGNR01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  05DEC24/1140Z  IGNR01" },
        { type: "ok",  text: "  1.TAYLOR/CHLOE MS" },
        { type: "ok",  text: "  2  SK 1461 Y 08FEB 6 OSLCPH HK1  0910 1020  *1A/E*" },
        { type: "ok",  text: "  4 AP OSL +47 22 112233 - A" },
        { type: "ok",  text: "  5 APE CHLOE.TAYLOR@TRAVEL.NO" },
        { type: "ok",  text: "  6 TK OK05DEC/STOSG34AA//ETSK" },
        { type: "ok",  text: "  7 FA PAX 074-6677881122/ETSK/EUR165.00/05DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A VERIFY BUFFER DISCARD WORKFLOW" }
      ]
    },
    {
      id: "test_remark",
      title: "Add Test Remark (RM TEST)",
      task: "Simulate an uncommitted modification by adding a general remark line RM TEST (or type IG directly to skip).",
      hint: "Type <strong>RM TEST</strong>",
      inputMatch: {
        aliases: ["RM TEST", "RMTEST", "RM/TEST", "RM TEST REMARK", "IG"]
      },
      terminalResponse: [
        { type: "info", text: "RM TEST" },
        { type: "ok",   text: " 10  RM TEST" },
        { type: "warn", text: "PENDING MODIFICATION IN WORKING BUFFER (NOT COMMITTED)" }
      ]
    },
    {
      id: "ignore_transaction",
      title: "Ignore Changes (IG)",
      task: "Discard all uncommitted working modifications and restore original record state.",
      hint: "Type <strong>IG</strong>",
      inputMatch: {
        aliases: ["IG", "I"]
      },
      terminalResponse: [
        { type: "info", text: "IG" },
        { type: "warn", text: "CHANGES IGNORED — PNR NOT SAVED" },
        { type: "ok",   text: "WORKING BUFFER CLEARED — RECORD RESTORED TO ORIGINAL STATE" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Ignore transaction drill complete! IG discards all unsaved changes in the active working buffer and keeps the database intact, whereas ER commits and saves them permanently. Always prefer IG whenever an entry mistake occurs or when aborting an unwanted workflow."
  }
};
