/**
 * Scenario: Split PNR — Divide Passengers
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["split_partial_pax"] = {
  meta: {
    id: "split_partial_pax",
    system: "AMADEUS",
    title: "Split Passenger (SP)",
    blurb: "3 Passengers · Split Pax 1 & 2 to new record locator",
    badge: "SPLIT PNR",
    badgeClass: "badge-blue",
    category: "Split PNR"
  },

  caseMeta: {
    "PNR": "SPLIT3",
    "PASSENGER": "1.BROWN/JAMES 2.BROWN/EMMA 3.BROWN/LUCAS",
    "TICKET NO.": "074-5555444433",
    "ROUTE": "ARN → FRA → ARN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Split passengers 1 and 2 to change their return date"
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
    { type: "dim",  text: "CASE: SPLIT / DIVIDE MULTI-PASSENGER PNR" },
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
      task: "Retrieve multi-passenger booking SPLIT3.",
      hint: "Type <strong>RTSPLIT3</strong> or <strong>RT SPLIT3</strong>",
      inputMatch: {
        aliases: ["RTSPLIT3", "RT SPLIT3"],
        patterns: ["^RT\\s*SPLIT3$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  05OCT24/1620Z  SPLIT3" },
        { type: "ok",  text: "  1.BROWN/JAMES MR  2.BROWN/EMMA MRS  3.BROWN/LUCAS MSTR" },
        { type: "ok",  text: "  2  LH 0801 V 15OCT 2 ARNFRA HK3  0645 0900  *1A/E*" },
        { type: "ok",  text: "  3  LH 0802 V 22OCT 2 FRAARN HK3  1730 1935  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 5551234 - A" },
        { type: "ok",  text: "  5 TK OK05OCT/STOSG34AA//ETLH" },
        { type: "ok",  text: "  6 FA PAX 220-4455667788/ETLH/EUR420.00/05OCT/STOSG34AA/01234567/S2-3/P1" },
        { type: "ok",  text: "  7 FA PAX 220-4455667789/ETLH/EUR420.00/05OCT/STOSG34AA/01234567/S2-3/P2" },
        { type: "ok",  text: "  8 FA PAX 220-4455667790/ETLH/EUR315.00/05OCT/STOSG34AA/01234567/S2-3/P3" },
        { type: "info",text: "TOTAL PASSENGERS: 3 — READY FOR PARTIAL SPLIT" }
      ]
    },
    {
      id: "split_pax",
      title: "Split Passengers (SP)",
      task: "Divide passengers 1 and 2 from the current booking.",
      hint: "Type <strong>SP1,2</strong>",
      inputMatch: {
        aliases: ["SP1,2", "SP1-2", "SP 1,2", "SP 1-2"]
      },
      terminalResponse: [
        { type: "ok",   text: "SP 1,2" },
        { type: "ok",   text: "SPLIT IN PROGRESS — PASSENGERS 1, 2" },
        { type: "warn", text: "SPLIT FILE CREATED — COMMIT REQUIRED" },
        { type: "dim",  text: "TRANSACTION IN PROGRESS — FILE AND END (ER / EF)" }
      ]
    },
    {
      id: "commit_split",
      title: "Commit Split (ER)",
      task: "File and end transaction to finalize the split operation.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",   text: "RP/STOSG34AA/STOSG34AA  AA/SU  05OCT24/1625Z  SPLIT3" },
        { type: "ok",   text: "  1.BROWN/LUCAS MSTR" },
        { type: "ok",   text: "  2  LH 0801 V 15OCT 2 ARNFRA HK1  0645 0900  *1A/E*" },
        { type: "ok",   text: "  3  LH 0802 V 22OCT 2 FRAARN HK1  1730 1935  *1A/E*" },
        { type: "ok",   text: "  4 FA PAX 220-4455667790/ETLH/EUR315.00/05OCT/STOSG34AA/01234567/S2-3/P1" },
        { type: "warn", text: "SPLIT PNR ASSOCIATED: NEW888" },
        { type: "ok",   text: "SPLIT TRANSACTION COMPLETED" }
      ]
    },
    {
      id: "verify_associated",
      title: "Verify Cross-Reference (RTAXR)",
      task: "Inspect associated cross-reference records to confirm child PNR locator.",
      hint: "Type <strong>RTAXR</strong>",
      inputMatch: {
        aliases: ["RTAXR", "RT AXR"]
      },
      terminalResponse: [
        { type: "info", text: "RTAXR" },
        { type: "ok",   text: "ASSOCIATED RECORDS IN SYSTEM:" },
        { type: "ok",   text: "  SPLIT FROM : SPLIT3 (1 PAX: BROWN/LUCAS)" },
        { type: "ok",   text: "  DIVIDED TO : NEW888 (2 PAX: BROWN/JAMES, BROWN/EMMA)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "TICKETS AND SSRS TRANSFERRED SUCCESSFULLY" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Split drill complete. Sequence: RT → SP1,2 → ER → RTAXR to confirm child record. Continue rebooking actions on the newly generated child record."
  }
};
