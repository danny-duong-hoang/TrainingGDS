/**
 * Scenario: Void E-Ticket — Immediate Cancellation (TRDC)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["void_ticket"] = {
  meta: {
    id: "void_ticket",
    system: "AMADEUS",
    title: "Void E-Ticket (TRDC)",
    blurb: "Issued today · Nullify unneeded e-ticket within void window",
    badge: "VOID TICKET",
    badgeClass: "badge-green",
    category: "Void & Sell"
  },

  caseMeta: {
    "PNR": "CANCL9",
    "PASSENGER": "MUELLER/HANS MR",
    "TICKET NO.": "074-7788990011",
    "ROUTE": "FRA → JFK → FRA",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Customer cancelled immediately after purchase. Void ticket via TRDC."
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
    { type: "dim",  text: "CASE: E-TICKET VOID / CANCELLATION" },
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
      task: "Retrieve booking record CANCL9 for passenger MUELLER/HANS MR.",
      hint: "Type <strong>RTCANCL9</strong> or <strong>RT CANCL9</strong>",
      inputMatch: {
        aliases: ["RTCANCL9", "RT CANCL9"],
        patterns: ["^RT\\s*CANCL9$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  09OCT24/1040Z  CANCL9" },
        { type: "ok",  text: "  1.MUELLER/HANS MR" },
        { type: "ok",  text: "  2  LH 0400 Q 12NOV 2 FRAJFK HK1  1110 1345  *1A/E*" },
        { type: "ok",  text: "  3  LH 0401 Q 20NOV 3 JFKFRA HK1  1615 0540+1  *1A/E*" },
        { type: "ok",  text: "  4 AP FRA +49 69 123456 - A" },
        { type: "ok",  text: "  5 APE HANS.MUELLER@TRAVEL.DE" },
        { type: "ok",  text: "  6 TK OK09OCT/STOSG34AA//ETLH" },
        { type: "ok",  text: "  7 FA PAX 074-7788990011/ETLH/EUR620.00/09OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A CUSTOMER REQUEST SAME DAY VOID" },
        { type: "info",text: "TICKET ISSUED TODAY — SAME-DAY VOID AUDIT WINDOW ACTIVE" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display the ticket list to verify active FA elements.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR CANCL9" },
        { type: "ok",   text: "  7  47 FA PAX 074-7788990011/ETLH/EUR620.00/09OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Inspect ticket line 6 to verify all coupons are Open and issued today.",
      hint: "Type <strong>TWD/L6</strong>",
      inputMatch: {
        aliases: ["TWD/L6", "TWDL6", "TWD/TKT074-7788990011"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L7" },
        { type: "ok",   text: "TICKET: 074-7788990011    NAME: MUELLER/HANS MR" },
        { type: "ok",   text: "ISSUED: 09OCT24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX8822" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 LH   0400   Q  12NOV  FRA JFK  O       12NOV QR1DE" },
        { type: "ok",   text: "  2 LH   0401   Q  20NOV  JFK FRA  O       20NOV QR1DE" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 620.00   TAX: EUR 145.00   TOTAL: EUR 765.00" },
        { type: "warn", text: "DATE OF ISSUE: TODAY — VALID FOR SAME-DAY TRDC VOID" }
      ]
    },
    {
      id: "void_ticket",
      title: "Void Ticket (TRDC/L6)",
      task: "Void the electronic ticket record on line 6.",
      hint: "Type <strong>TRDC/L6</strong> or <strong>TRDC/ALL</strong>",
      inputMatch: {
        aliases: ["TRDC/L6", "TRDC/ALL", "TRDCL6", "TRDC"]
      },
      terminalResponse: [
        { type: "info", text: "TRDC/L7" },
        { type: "err",  text: "REPORTING RECORD: CANCELLED" },
        { type: "warn", text: "TICKET 074-7788990011 VOID SUCCESSFUL" },
        { type: "ok",   text: "BSP BILLING SUSPENDED — STATUS: VOID" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit the voided status.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  09OCT24/1045Z  CANCL9" },
        { type: "ok",  text: "  1.MUELLER/HANS MR" },
        { type: "ok",  text: "  2  LH 0400 Q 12NOV 2 FRAJFK HK1  1110 1345  *1A/E*" },
        { type: "ok",  text: "  3  LH 0401 Q 20NOV 3 JFKFRA HK1  1615 0540+1  *1A/E*" },
        { type: "ok",  text: "  4 AP FRA +49 69 123456 - A" },
        { type: "ok",  text: "  5 TK OK09OCT/STOSG34AA" },
        { type: "warn",text: "  6 FA PAX 074-7788990011/ETLH/EUR620.00/09OCT/STOSG34AA/VOID" },
        { type: "dim", text: "  7 MIS 1A TICKET CANCELLED VIA TRDC" },
        { type: "ok",  text: "PNR CANCL9 UPDATED — TICKET VOID COMPLETED SUCCESSFULLY" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Void drill complete. TRDC/L6 cancels the electronic ticket immediately within the ticketing carrier's same-day audit window."
  }
};
