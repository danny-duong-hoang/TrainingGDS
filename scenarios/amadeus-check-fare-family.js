/**
 * Scenario: Check Fare Family Brand & Included Baggage (TTH / TTH/T1)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["check_fare_family"] = {
  meta: {
    id: "check_fare_family",
    system: "AMADEUS",
    title: "Check Fare Family Brand (TTH / TTH/T1)",
    blurb: "Audit stored ticket history · Identify AFF-ECOSTAND · Prepare /FF- filter",
    badge: "FARE FAMILY",
    badgeClass: "badge-blue",
    category: "Baggage & Fare Family"
  },

  caseMeta: {
    "PNR": "FAM421",
    "PASSENGER": "NILSSON/KARIN MS",
    "TICKET NO.": "117-9911223344",
    "ROUTE": "ARN → CPH → ARN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Before rebooking, audit ticket history with TTH and TTH/T1 to identify the original Fare Family / brand name (AFF) and included baggage."
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
    { type: "dim",  text: "CASE: AUDIT FARE FAMILY (TTH / TTH/T1) BEFORE REBOOKING" },
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
      title: "Retrieve PNR (RT)",
      task: "Retrieve booking record FAM421 for passenger NILSSON/KARIN MS.",
      hint: "Type <strong>RTFAM421</strong> or <strong>RT FAM421</strong>",
      inputMatch: {
        aliases: ["RTFAM421", "RT FAM421", "RT"],
        patterns: ["^RT\\s*FAM421$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  10NOV24/0930Z  FAM421" },
        { type: "ok",  text: "  1.NILSSON/KARIN MS" },
        { type: "ok",  text: "  2  SK 1415 E 20DEC 5 ARNCPH HK1  0605 0720  *1A/E*" },
        { type: "ok",  text: "  3  SK 1416 E 27DEC 5 CPHARN HK1  1730 1845  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 7771234 - A" },
        { type: "ok",  text: "  5 APE KARIN.NILSSON@TRAVEL.SE" },
        { type: "ok",  text: "  6 TK OK10NOV/STOSG34AA//ETSK" },
        { type: "ok",  text: "  7 FA PAX 117-9911223344/ETSK/EUR180.00/10NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display ticket elements for the PNR using RTTN.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR FAM421" },
        { type: "ok",   text: "  7  47 FA PAX 117-9911223344/ETSK/EUR180.00/10NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD)",
      task: "Open electronic ticket with TWD to inspect coupon statuses and baggage allowance.",
      hint: "Type <strong>TWD</strong> or <strong>TWD/L7</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L7", "TWDL7", "TWD/T1", "TWD1", "TWD/TKT117-9911223344"]
      },
      terminalResponse: [
        { type: "info", text: "TWD" },
        { type: "ok",   text: "TICKET: 117-9911223344    NAME: NILSSON/KARIN MS" },
        { type: "ok",   text: "ISSUED: 10NOV24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX4411" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS   BG" },
        { type: "ok",   text: "  1 SK   1415   E  20DEC  ARN CPH  O       20DEC ELIGHT1   1P" },
        { type: "ok",   text: "  2 SK   1416   E  27DEC  CPH ARN  O       27DEC ELIGHT1   1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 180.00   TAX: EUR 64.00   TOTAL: EUR 244.00" },
        { type: "ok",   text: "FARE BASIS: ELIGHT1 | INCLUDED BAGGAGE: 1PC (23KG)" },
        { type: "warn", text: "NOTICE: FARE BASIS CODE SAYS 'LIGHT1' BUT TICKET SHOWS 1P BAGGAGE" },
        { type: "info", text: "MUST AUDIT TICKET HISTORY (TTH) TO DISCOVER REAL BRAND / FARE FAMILY" }
      ]
    },
    {
      id: "display_ticket_history",
      title: "List Ticket Stored Fares (TTH)",
      task: "Display Ticket / Fare History with TTH to view stored pricing records for this ticket.",
      hint: "Type <strong>TTH</strong>",
      inputMatch: {
        aliases: ["TTH"]
      },
      terminalResponse: [
        { type: "info", text: "TTH" },
        { type: "ok",   text: "TICKET HISTORY DISPLAY — PNR FAM421" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "TKT 01  PAX 1.1 NILSSON/KARIN MS" },
        { type: "ok",   text: "  REC 01  TST 01  ISSUED: 10NOV24  OFFICE: STOSG34AA" },
        { type: "ok",   text: "  FARE: EUR 180.00  TAX: EUR 64.00  TOTAL: EUR 244.00" },
        { type: "ok",   text: "  AIRLINE: SK  BRAND: ECOSTAND  BG: 1PC" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "USE TTH/T1 TO EXPAND STORED FARE RECORD 1 IN FULL DETAIL" }
      ]
    },
    {
      id: "open_fare_history_record",
      title: "Expand Fare History Record (TTH/T1)",
      task: "Open stored fare record 1 using TTH/T1 to inspect the full Fare Family and brand name (AFF).",
      hint: "Type <strong>TTH/T1</strong> (or <strong>TTHT1</strong>)",
      inputMatch: {
        aliases: ["TTH/T1", "TTHT1", "TTH/T01", "TTH1"]
      },
      terminalResponse: [
        { type: "info", text: "TTH/T1" },
        { type: "ok",   text: "TICKET HISTORY RECORD 01 — STORED FARE CALCULATION" },
        { type: "ok",   text: "PAX: 1.1 NILSSON/KARIN MS   TKT: 117-9911223344" },
        { type: "ok",   text: "FARE BASIS: ELIGHT1         CARRIER: SK" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "warn", text: "AFF-ECOSTAND                SAS GO SMART / STANDARD" },
        { type: "ok",   text: "INCLUDED ANCILLARY SERVICES:" },
        { type: "ok",   text: "  - CHECKED BAGGAGE: 1PC UP TO 23KG INCLUDED" },
        { type: "ok",   text: "  - CABIN BAGGAGE: 1PC UP TO 8KG + PERSONAL ITEM" },
        { type: "ok",   text: "  - ADVANCE SEAT SELECTION: STANDARD SEATS INCLUDED" },
        { type: "ok",   text: "  - CHANGES: PERMITTED FOR EUR 70.00 FEE" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "CRITICAL: MEMORIZE BRAND NAME 'ECOSTAND' FOR /FF-ECOSTAND FILTER" }
      ]
    }
  ],

  winMessage: {
    title: "Fare Family Audit Complete ✓",
    text: "Fare family check drill finished! Always verify Fare Family before rebooking: TTH lists stored ticket pricing history, and TTH/T1 displays the detailed breakdown containing the carrier's Fare Family brand name (AFF-ECOSTAND). Even when a fare basis code looks confusing, TTH/T1 gives you the true commercial brand. Pass /FF-ECOSTAND into your FXQ or FXP entry to protect the passenger's 1PC baggage allowance during rebooking."
  }
};
