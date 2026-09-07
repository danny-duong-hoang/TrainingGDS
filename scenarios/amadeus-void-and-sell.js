/**
 * Scenario: Void & Sell — Same Day Cancellation & Rebook
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["void_and_sell"] = {
  meta: {
    id: "void_and_sell",
    system: "AMADEUS",
    title: "Void & Rebook (Same Day)",
    blurb: "Issued today · Cancel ticket via TRDC & rebook new itinerary",
    badge: "VOID & SELL",
    badgeClass: "badge-green",
    category: "Void & Sell"
  },

  caseMeta: {
    "PNR": "VOID01",
    "PASSENGER": "CLARK/SUSAN MS",
    "TICKET NO.": "074-9911882233",
    "ROUTE": "CPH → LHR → CPH",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Customer rebooking within void window: clone pax, rebook, void old ticket."
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
    { type: "dim",  text: "CASE: SAME DAY REVISION / VOID & REBOOK WORKFLOW" },
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
      task: "Retrieve booking record VOID01 for passenger CLARK/SUSAN MS.",
      hint: "Type <strong>RTVOID01</strong> or <strong>RT VOID01</strong>",
      inputMatch: {
        aliases: ["RTVOID01", "RT VOID01"],
        patterns: ["^RT\\s*VOID01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  08OCT24/0915Z  VOID01" },
        { type: "ok",  text: "  1.CLARK/SUSAN MS" },
        { type: "ok",  text: "  2  BA 0811 Y 10DEC 2 CPHLHR HK1  0730 0845  *1A/E*" },
        { type: "ok",  text: "  3  BA 0820 Y 17DEC 2 LHRCPH HK1  1815 2100  *1A/E*" },
        { type: "ok",  text: "  4 AP CPH +45 33 123456 - A" },
        { type: "ok",  text: "  5 APE SUSAN.CLARK@BIZTRAVEL.DK" },
        { type: "ok",  text: "  6 TK OK08OCT/STOSG34AA//ETBA" },
        { type: "ok",  text: "  7 FA PAX 074-9911882233/ETBA/EUR520.00/08OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A SAME DAY REISSUE/VOID IN PROGRESS" },
        { type: "info",text: "TICKET ISSUED TODAY — SAME-DAY VOID ELIGIBLE" }
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
        { type: "info", text: "TICKET RECORD DISPLAY — PNR VOID01" },
        { type: "ok",   text: "  7  47 FA PAX 074-9911882233/ETBA/EUR520.00/08OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD)",
      task: "Verify that ticket 074-9911882233 was issued today and all coupons are Open.",
      hint: "Type <strong>TWD/L6</strong> or <strong>TWD</strong>",
      inputMatch: {
        aliases: ["TWD/L6", "TWDL6", "TWD"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L7" },
        { type: "ok",   text: "TICKET: 074-9911882233    NAME: CLARK/SUSAN MS" },
        { type: "ok",   text: "ISSUED: 08OCT24  STOSG34AA  FOP: CC AX XXXXXXXXXXXX1122" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 BA   0811   Y  10DEC  CPH LHR  O       10DEC YR1DK" },
        { type: "ok",   text: "  2 BA   0820   Y  17DEC  LHR CPH  O       17DEC YR1DK" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 520.00   TAX: EUR 110.00   TOTAL: EUR 630.00" },
        { type: "warn", text: "DATE OF ISSUE: TODAY — VALID FOR SAME-DAY TRDC VOID" }
      ]
    },
    {
      id: "clone_pax",
      title: "Clone Passenger Details (RRP)",
      task: "Clone passenger and contact details to retain customer profile for new flight options.",
      hint: "Type <strong>RRP</strong>",
      inputMatch: {
        aliases: ["RRP"]
      },
      terminalResponse: [
        { type: "ok",   text: "RRP" },
        { type: "ok",   text: "PASSENGER DETAILS COPIED TO WORKING BUFFER" },
        { type: "dim",  text: "PAX: 1.CLARK/SUSAN MS — CONTACT AND PROFILE SAVED" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Check availability for BA flight CPH to LHR on 15DEC.",
      hint: "Type <strong>SN15DECCPHLHR/ABA</strong>",
      inputMatch: {
        aliases: ["SN15DECCPHLHR/ABA"],
        patterns: ["^SN15DECCPHLHR\\/ABA,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "BA  CPH LHR  15DEC" },
        { type: "ok",  text: "  1  BA 0813  J9 C9 D9  Y9 B9 H9 K9  M9 L9 V9  1125 1235  32A  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class M available on line 1" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Segment (SS1M1)",
      task: "Book 1 seat in M class on availability line 1.",
      hint: "Type <strong>SS1M1</strong>",
      inputMatch: {
        aliases: ["SS1M1", "SS 1 M 1", "SS 1M1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  BA 0813 M 15DEC 7 CPHLHR HK1  1125 1235" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New segment added" }
      ]
    },
    {
      id: "price_new",
      title: "Price New Itinerary (FXP)",
      task: "Store new pricing record for the itinerary.",
      hint: "Type <strong>FXP</strong>",
      inputMatch: {
        aliases: ["FXP"]
      },
      terminalResponse: [
        { type: "info", text: "FXP" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "BA 0813  M  M 15DEC 1125  MR1DK                 15DEC  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 490.00   TAX: EUR 95.00   TOTAL: EUR 585.00" },
        { type: "ok",   text: "TST 02 STORED — NEW ITINERARY PRICED" }
      ]
    },
    {
      id: "void_ticket",
      title: "Void Original Ticket (TRDC)",
      task: "Void the original e-ticket on line 6 via TRDC.",
      hint: "Type <strong>TRDC/L6</strong> or <strong>TRDC/ALL</strong>",
      inputMatch: {
        aliases: ["TRDC/L6", "TRDC/ALL", "TRDCL6", "TRDC"]
      },
      terminalResponse: [
        { type: "info", text: "TRDC/L7" },
        { type: "err",  text: "TRANSACTION RECORD CANCELLED / VOIDED" },
        { type: "warn", text: "TICKET 074-9911882233 — STATUS: V (VOID)" },
        { type: "ok",   text: "ZERO PENALTY RECORDED — BSP BILLING CANCELLED" }
      ]
    },
    {
      id: "cancel_old_flights",
      title: "Cancel Old Flights (XE2,3)",
      task: "Remove the obsolete original flights on lines 2 and 3.",
      hint: "Type <strong>XE2,3</strong> or <strong>XE2-3</strong>",
      inputMatch: {
        aliases: ["XE2,3", "XE2-3", "XE 2,3"]
      },
      terminalResponse: [
        { type: "ok", text: "  2  BA 0811 Y 10DEC 2 CPHLHR — CANCELLED" },
        { type: "ok", text: "  3  BA 0820 Y 17DEC 2 LHRCPH — CANCELLED" },
        { type: "ok", text: "ORIGINAL SEGMENTS 2 AND 3 REMOVED" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "Save the updated booking with new flights and voided ticket note.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  08OCT24/0935Z  VOID01" },
        { type: "ok",  text: "  1.CLARK/SUSAN MS" },
        { type: "ok",  text: "  2  BA 0813 M 15DEC 7 CPHLHR HK1  1125 1235  *1A/E*" },
        { type: "ok",  text: "  3 AP CPH +45 33 123456 - A" },
        { type: "ok",  text: "  4 TK OK08OCT/STOSG34AA" },
        { type: "warn",text: "  5 FA PAX 074-9911882233/ETBA/EUR520.00/08OCT/STOSG34AA/VOID" },
        { type: "ok",  text: "  6 TST 02 STORED READY FOR ISSUE" },
        { type: "ok",  text: "PNR VOID01 UPDATED — ISSUE NEW TICKET FOR TST 02" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Void & Rebook drill complete. Rule: Price/book the new itinerary then void the old ticket with TRDC (never ATC void for this path). Remember: RRP = passenger clone only."
  }
};
