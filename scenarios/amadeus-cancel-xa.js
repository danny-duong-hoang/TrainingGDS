/**
 * Scenario: Bulk Segment Cancellation (XA) & Commit
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["cancel_xa"] = {
  meta: {
    id: "cancel_xa",
    system: "AMADEUS",
    title: "Bulk Air Cancellation (XA)",
    blurb: "Cancel all active air segments with XA after void or unconfirmed booking",
    badge: "CANCEL SEGMENTS",
    badgeClass: "badge-green",
    category: "Void & Sell"
  },

  caseMeta: {
    "PNR": "CANC01",
    "PASSENGER": "WILSON/DAVID MR",
    "TICKET NO.": "074-5544332211",
    "ROUTE": "ARN → FRA → MUC → ARN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Ticket was voided. Remove all air segments in one entry using XA and commit with ER."
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
    { type: "dim",  text: "CASE: BULK AIR CANCELLATION (XA) / POST-VOID PURGE" },
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
      task: "Retrieve booking record CANC01 for passenger WILSON/DAVID MR.",
      hint: "Type <strong>RTCANC01</strong> or <strong>RT CANC01</strong>",
      inputMatch: {
        aliases: ["RTCANC01", "RT CANC01"],
        patterns: ["^RT\\s*CANC01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  04DEC24/1015Z  CANC01" },
        { type: "ok",  text: "  1.WILSON/DAVID MR" },
        { type: "ok",  text: "  2  LH 0809 Y 18JAN 6 ARNFRA HK1  0615 0830  *1A/E*" },
        { type: "ok",  text: "  3  LH 0102 Y 18JAN 6 FRAMUC HK1  0945 1040  *1A/E*" },
        { type: "ok",  text: "  4  LH 2418 Y 22JAN 3 MUCARN HK1  1520 1735  *1A/E*" },
        { type: "ok",  text: "  5 AP STO +46 8 444556 - A" },
        { type: "ok",  text: "  6 TK OK04DEC/STOSG34AA" },
        { type: "warn",text: "  7 FA PAX 074-5544332211/ETLH/EUR480.00/04DEC/STOSG34AA/VOID" },
        { type: "dim", text: "  8 MIS 1A TICKET VOIDED — FLIGHT SEATS REMAIN HELD" }
      ]
    },
    {
      id: "cancel_air",
      title: "Cancel All Air Segments (XA)",
      task: "Cancel all active air segments in one entry using XA (or XI for entire itinerary).",
      hint: "Type <strong>XA</strong>",
      inputMatch: {
        aliases: ["XA", "X A", "XI", "X I"]
      },
      terminalResponse: [
        { type: "info", text: "XA" },
        { type: "warn", text: "  2  LH 0809 Y 18JAN ARNFRA — CANCELLED" },
        { type: "warn", text: "  3  LH 0102 Y 18JAN FRAMUC — CANCELLED" },
        { type: "warn", text: "  4  LH 2418 Y 22JAN MUCARN — CANCELLED" },
        { type: "ok",   text: "ALL AIR ITINERARY SEGMENTS CANCELLED IN ACTIVE BUFFER" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to finalize cancellation.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  04DEC24/1020Z  CANC01" },
        { type: "ok",  text: "  1.WILSON/DAVID MR" },
        { type: "ok",  text: "  2 AP STO +46 8 444556 - A" },
        { type: "warn",text: "  3 FA PAX 074-5544332211/ETLH/EUR480.00/04DEC/STOSG34AA/VOID" },
        { type: "dim", text: "  4 MIS 1A ALL AIR SEGMENTS CANCELLED" },
        { type: "ok",  text: "PNR CANC01 UPDATED — NO ACTIVE ITINERARY SEGMENTS REMAINING" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Segment cancellation drill complete! Segment removal command guide: XE <line> cancels a single specific line; XA cancels all Air segments; XI cancels the entire Itinerary including auxiliary hotel/car segments. Use XA and XI carefully to avoid accidental flight cancellations."
  }
};
