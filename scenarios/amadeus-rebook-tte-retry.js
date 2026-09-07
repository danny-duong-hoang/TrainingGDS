/**
 * Scenario: Rebook with TTE Reset — Clearing Electronic Ticket Association Conflicts
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["rebook_tte_retry"] = {
  meta: {
    id: "rebook_tte_retry",
    system: "AMADEUS",
    title: "Rebook Conflict & TTE Reset",
    blurb: "ATC blocked by segment association conflict · Clear with TTE/ALL",
    badge: "TTE RESET",
    badgeClass: "badge-blue",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "TTE001",
    "PASSENGER": "JOHANSSON/ANNA MS",
    "TICKET NO.": "074-2233441199",
    "ROUTE": "CPH → OSL → CPH",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "FXQ encounters association conflict. Reset ticket mask with TTE/ALL and retry."
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
    { type: "dim",  text: "CASE: TICKET ASSOCIATION CONFLICT / TTE RESET" },
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
      task: "Retrieve booking record TTE001 for passenger JOHANSSON/ANNA MS.",
      hint: "Type <strong>RTTTE001</strong> or <strong>RT TTE001</strong>",
      inputMatch: {
        aliases: ["RTTTE001", "RT TTE001"],
        patterns: ["^RT\\s*TTE001$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  20OCT24/1110Z  TTE001" },
        { type: "ok",  text: "  1.JOHANSSON/ANNA MS" },
        { type: "ok",  text: "  2  SK 1462 V 14NOV 4 CPHOSL HK1  0815 0925  *1A/E*" },
        { type: "ok",  text: "  3  SK 1463 V 21NOV 4 OSLCPH HK1  1645 1755  *1A/E*" },
        { type: "ok",  text: "  4 AP CPH +45 32 881234 - A" },
        { type: "ok",  text: "  5 APE ANNA.JOHANSSON@TRAVEL.DK" },
        { type: "ok",  text: "  6 TK OK20OCT/STOSG34AA//ETSK" },
        { type: "ok",  text: "  7 FA PAX 074-2233441199/ETSK/EUR290.00/20OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "warn",text: "  9 TST 01 STORED — OBSOLETE REISSUE RECORD CONFLICT" }
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
        { type: "info", text: "TICKET RECORD DISPLAY — PNR TTE001" },
        { type: "ok",   text: "  7  47 FA PAX 074-2233441199/ETSK/EUR290.00/20OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Confirm both coupons are status O (Open).",
      hint: "Type <strong>TWD/L6</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L6", "TWDL6", "TWD/TKT074-2233441199"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L7" },
        { type: "ok",   text: "TICKET: 074-2233441199    NAME: JOHANSSON/ANNA MS" },
        { type: "ok",   text: "ISSUED: 20OCT24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX2299" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 SK   1462   V  14NOV  CPH OSL  O       14NOV VR1DK" },
        { type: "ok",   text: "  2 SK   1463   V  21NOV  OSL CPH  O       21NOV VR1DK" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 290.00   TAX: EUR 82.00   TOTAL: EUR 372.00" },
        { type: "ok",   text: "ALL COUPONS OPEN — ATC REBOOK ELIGIBLE" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Search availability for return flight OSL to CPH on 28NOV with SAS.",
      hint: "Type <strong>SN28NOVOSLCPH/ASK</strong>",
      inputMatch: {
        aliases: ["SN28NOVOSLCPH/ASK"],
        patterns: ["^SN28NOVOSLCPH\\/ASK,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "SK  OSL CPH  28NOV" },
        { type: "ok",  text: "  1  SK 1463  C9 D9 Z9  Y9 S9 B9 M9  V4  28NOV OSLCPH  1645 1755  CR9  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class V open on line 1" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Inbound (SS1V1)",
      task: "Book 1 seat in V class on line 1.",
      hint: "Type <strong>SS1V1</strong>",
      inputMatch: {
        aliases: ["SS1V1", "SS 1 V 1", "SS 1V1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  SK 1463 V 28NOV 4 OSLCPH HK1  1645 1755" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New inbound added on line 4" }
      ]
    },
    {
      id: "attempt_fxq",
      title: "Attempt FXQ (Conflict)",
      task: "Attempt ATC quote with FXQ. (Observe the association conflict error).",
      hint: "Type <strong>FXQ/S2,4/R,UP</strong>",
      inputMatch: {
        aliases: [
          "FXQ/S2,4/R,UP",
          "FXQ/S2-4/R,UP",
          "FXQ/S4,2/R,UP",
          "FXQ/R,UP/S2,4",
          "FXQ/R,UP/S4,2",
          "FXQ/S2,4/RUP",
          "FXQ/S4,2/RUP",
          "FXQ/S2,4",
          "FXQ/S4,2"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXQ/S2,4/R,UP" },
        { type: "err",  text: " / \\ " },
        { type: "err",  text: "( ! )  SEGMENT OVERLAP / NEED TTE" },
        { type: "warn", text: "CANNOT REPRICE — PRIOR TST RECORD CONFLICTS WITH ACTIVE SEGMENTS" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "SOLUTION: Use TTE/ALL to purge obsolete electronic ticket mask linkages." }
      ]
    },
    {
      id: "purge_tte",
      title: "Purge Mask Association (TTE/ALL)",
      task: "Purge the conflicting ticket association table with TTE/ALL.",
      hint: "Type <strong>TTE/ALL</strong> or <strong>TTE</strong>",
      inputMatch: {
        aliases: ["TTE/ALL", "TTE", "TTEALL"]
      },
      terminalResponse: [
        { type: "info", text: "TTE/ALL" },
        { type: "ok",   text: "TTE/ALL PROCESSED — ALL PRIOR TST / TICKET ASSOCIATIONS PURGED" },
        { type: "ok",   text: "READY TO RETRY FXQ PRICING" }
      ]
    },
    {
      id: "retry_fxq",
      title: "Retry ATC Quote (FXQ)",
      task: "Re-run FXQ on outbound segment 2 and new inbound segment 4.",
      hint: "Type <strong>FXQ/S2,4/R,UP</strong>",
      inputMatch: {
        aliases: [
          "FXQ/S2,4/R,UP",
          "FXQ/S2-4/R,UP",
          "FXQ/S4,2/R,UP",
          "FXQ/R,UP/S2,4",
          "FXQ/R,UP/S4,2",
          "FXQ/S2,4/RUP",
          "FXQ/S4,2/RUP",
          "FXQ/S2,4",
          "FXQ/S4,2"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXQ/S2,4/R,UP" },
        { type: "ok",   text: "ATC REISSUE — GUARANTEED" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "SK 1462  V  V 14NOV 0815  VR1DK                 14NOV  1P" },
        { type: "ok",   text: "SK 1463  V  V 28NOV 1645  VR1DK                 28NOV  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE BALANCE ...... EUR    0.00" },
        { type: "ok",   text: "TAX BALANCE ....... EUR    3.20" },
        { type: "ok",   text: "PENALTY ........... EUR   45.00" },
        { type: "warn", text: "TOTAL ADD COLL .... EUR   48.20" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "NEW TST 01 STORED SUCCESSFULLY" }
      ]
    },
    {
      id: "cancel_old_ib",
      title: "Delete Old Inbound (XE3)",
      task: "Remove obsolete inbound flight on line 3.",
      hint: "Type <strong>XE3</strong>",
      inputMatch: {
        aliases: ["XE3", "X3"]
      },
      terminalResponse: [
        { type: "ok", text: "  3  SK 1463 V 21NOV 4 OSLCPH HK1  — CANCELLED" },
        { type: "ok", text: "OLD INBOUND SEGMENT 3 REMOVED" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  20OCT24/1135Z  TTE001" },
        { type: "ok",  text: "  1.JOHANSSON/ANNA MS" },
        { type: "ok",  text: "  2  SK 1462 V 14NOV 4 CPHOSL HK1  0815 0925  *1A/E*" },
        { type: "ok",  text: "  3  SK 1463 V 28NOV 4 OSLCPH HK1  1645 1755  *1A/E*" },
        { type: "ok",  text: "  4 AP CPH +45 32 881234 - A" },
        { type: "ok",  text: "  5 TK OK20OCT/STOSG34AA//ETSK" },
        { type: "ok",  text: "  6 FA PAX 074-2233441199/ETSK/EUR290.00/20OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  7 TST 01 REISSUE MASK VALIDATED" },
        { type: "ok",  text: "PNR TTE001 UPDATED — REBOOKING COMPLETE WITH CLEAN TST ASSOCIATION" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "TTE conflict resolution drill complete. When Amadeus rejects ATC pricing with 'SEGMENT OVERLAP / NEED TTE', execute TTE/ALL to purge obsolete TST linkages before re-running FXQ."
  }
};
