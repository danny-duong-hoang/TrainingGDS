/**
 * Scenario: Unused Ticket Rebook — Best Available Fare (FXO)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["rebook_fxo"] = {
  meta: {
    id: "rebook_fxo",
    system: "AMADEUS",
    title: "Rebook with Lowest Class (FXO)",
    blurb: "Unused ticket · Search and rebook cheapest available booking class",
    badge: "LOWEST FARE FXO",
    badgeClass: "badge-blue",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "BEST01",
    "PASSENGER": "LARSSON/ERIK MR",
    "TICKET NO.": "074-3344556677",
    "ROUTE": "ARN → AMS → ARN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Customer wants cheapest rebooking option on new inbound date. Use FXO."
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
    { type: "dim",  text: "CASE: UNUSED REBOOK / FXO BEST PRICING OPTION" },
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
      task: "Retrieve booking record BEST01 for passenger LARSSON/ERIK MR.",
      hint: "Type <strong>RTBEST01</strong> or <strong>RT BEST01</strong>",
      inputMatch: {
        aliases: ["RTBEST01", "RT BEST01"],
        patterns: ["^RT\\s*BEST01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  18OCT24/1520Z  BEST01" },
        { type: "ok",  text: "  1.LARSSON/ERIK MR" },
        { type: "ok",  text: "  2  KL 1108 Y 01DEC 7 ARNAMS HK1  0630 0835  *1A/E*" },
        { type: "ok",  text: "  3  KL 1109 Y 08DEC 7 AMSARN HK1  1420 1625  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 7654321 - A" },
        { type: "ok",  text: "  5 APE ERIK.LARSSON@NORDIC.SE" },
        { type: "ok",  text: "  6 TK OK18OCT/STOSG34AA//ETKL" },
        { type: "ok",  text: "  7 FA PAX 074-3344556677/ETKL/EUR420.00/18OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A BEST-BUY REBOOK REQUESTED" },
        { type: "info",text: "ALL COUPONS OPEN — ATC REBOOK ELIGIBLE" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display ticket list to verify coupon lines.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR BEST01" },
        { type: "ok",   text: "  7  47 FA PAX 074-3344556677/ETKL/EUR420.00/18OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Confirm all coupons are status O (Open).",
      hint: "Type <strong>TWD/L6</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L6", "TWDL6", "TWD/TKT074-3344556677"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L7" },
        { type: "ok",   text: "TICKET: 074-3344556677    NAME: LARSSON/ERIK MR" },
        { type: "ok",   text: "ISSUED: 18OCT24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX5566" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 KL   1108   Y  01DEC  ARN AMS  O       01DEC YR1SE" },
        { type: "ok",   text: "  2 KL   1109   Y  08DEC  AMS ARN  O       08DEC YR1SE" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 420.00   TAX: EUR 105.00   TOTAL: EUR 525.00" },
        { type: "ok",   text: "ALL COUPONS OPEN — ATC REBOOK ELIGIBLE" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Check availability for return flight AMS to ARN on 12DEC with KLM.",
      hint: "Type <strong>SN12DECAMSARN/AKL</strong>",
      inputMatch: {
        aliases: ["SN12DECAMSARN/AKL"],
        patterns: ["^SN12DECAMSARN\\/AKL,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "KL  AMS ARN  12DEC" },
        { type: "ok",  text: "  1  KL 1109  J4 C4  Y9 B9 M9 U4 T4  12DEC AMSARN  1420 1625  738  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Multiple classes open on line 1" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Inbound (SS1Y1)",
      task: "Book 1 seat in Y class on line 1.",
      hint: "Type <strong>SS1Y1</strong>",
      inputMatch: {
        aliases: ["SS1Y1", "SS 1 Y 1", "SS 1Y1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  KL 1109 Y 12DEC 4 AMSARN HK1  1420 1625" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New inbound segment booked on line 4" }
      ]
    },
    {
      id: "price_fxo",
      title: "Reprice at Lowest Class (FXO)",
      task: "Run ATC best-fare search (FXO) on kept outbound (seg 2) and new inbound (seg 4) to automatically rebook into the cheapest available class.",
      hint: "Type <strong>FXO/S2,4/R,UP</strong>",
      inputMatch: {
        aliases: [
          "FXO/S2,4/R,UP",
          "FXO/S2-4/R,UP",
          "FXO/S4,2/R,UP",
          "FXO/R,UP/S2,4",
          "FXO/R,UP/S4,2",
          "FXO/S2,4/RUP",
          "FXO/S4,2/RUP",
          "FXO/S2,4",
          "FXO/S4,2"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXO/S2,4/R,UP" },
        { type: "ok",   text: "ATC BEST-BUY REISSUE — GUARANTEED" },
        { type: "warn", text: "REBOOKED SEG 4: Y → T CLASS (LOWEST AVAILABLE)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "KL 1108  Y  Y 01DEC 0630  YR1SE                 01DEC  1P" },
        { type: "ok",   text: "KL 1109  Y  T 12DEC 1420  TR1SE                 12DEC  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE BALANCE ...... EUR    0.00" },
        { type: "ok",   text: "TAX BALANCE ....... EUR    4.50" },
        { type: "ok",   text: "PENALTY ........... EUR   50.00" },
        { type: "warn", text: "TOTAL ADD COLL .... EUR   54.50" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "ATC GUARANTEED — TST 01 STORED WITH CHEAPEST OPTION" }
      ]
    },
    {
      id: "cancel_old_ib",
      title: "Delete Old Inbound (XE3)",
      task: "Cancel the old inbound segment on line 3.",
      hint: "Type <strong>XE3</strong>",
      inputMatch: {
        aliases: ["XE3", "X3"]
      },
      terminalResponse: [
        { type: "ok", text: "  3  KL 1109 Y 08DEC 7 AMSARN HK1  — CANCELLED" },
        { type: "ok", text: "OLD INBOUND SEGMENT 3 REMOVED" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "Save the PNR with the updated lowest-class itinerary and ATC mask.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  18OCT24/1545Z  BEST01" },
        { type: "ok",  text: "  1.LARSSON/ERIK MR" },
        { type: "ok",  text: "  2  KL 1108 Y 01DEC 7 ARNAMS HK1  0630 0835  *1A/E*" },
        { type: "ok",  text: "  3  KL 1109 T 12DEC 4 AMSARN HK1  1420 1625  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 7654321 - A" },
        { type: "ok",  text: "  5 TK OK18OCT/STOSG34AA//ETKL" },
        { type: "ok",  text: "  6 FA PAX 074-3344556677/ETKL/EUR420.00/18OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  7 TST 01 REISSUE MASK STORED" },
        { type: "ok",  text: "PNR BEST01 UPDATED — FXO REBOOK COMPLETE" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "FXO rebooking complete! FXO functions like FXQ but automatically evaluates and rebooks into the lowest available booking class in the same cabin, minimizing total add-collect costs."
  }
};
