/**
 * Scenario B: ATC Restriction (CAT 31) -> Manual Pricing Fallback
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["cat31_fail"] = {
  meta: {
    id: "cat31_fail",
    system: "AMADEUS",
    title: "B · ATC Fail (CAT 31) → Manual Path",
    blurb: "SGN–CDG–SGN · FXQ blocked · Diagnose error & calculate manually",
    badge: "ATC FAIL → MANUAL",
    badgeClass: "badge-orange",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "LMNOPQ",
    "PASSENGER": "NGUYEN/MINH MR",
    "TICKET NO.": "074-9988776655",
    "ROUTE": "SGN → CDG → SGN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Rebook IB 20DEC · ATC blocked"
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
    { type: "dim",  text: "CASE: CAT31 / ATC NOT AUTHORIZED DRILL" },
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
      task: "Retrieve booking record LMNOPQ for passenger NGUYEN/MINH MR.",
      hint: "Type <strong>RTLMNOPQ</strong> or <strong>RT LMNOPQ</strong>",
      inputMatch: {
        aliases: ["RTLMNOPQ", "RT LMNOPQ"],
        patterns: ["^RT\\s*LMNOPQ$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  12OCT24/1115Z  LMNOPQ" },
        { type: "ok",  text: "  1.NGUYEN/MINH MR" },
        { type: "ok",  text: "  2  AF 0258 N 10DEC 2 SGNCDG HK1  1930 0615+1  *1A/E*" },
        { type: "ok",  text: "  3  AF 0259 N 28DEC 6 CDGSGN HK1  1710 1040+1  *1A/E*" },
        { type: "ok",  text: "  4 AP SGN +84 28 38221234 - A" },
        { type: "ok",  text: "  5 APE MINH.NGUYEN@CORP.VN" },
        { type: "ok",  text: "  6 TK OK12OCT/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-9988776655/ETAF/EUR620.00/12OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A VOLUNTARY CHANGE REQUEST" },
        { type: "info",text: "SEGMENT STATUS: HK — READY FOR PRICING VERIFICATION" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display the ticket list to identify the active e-ticket line.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR LMNOPQ" },
        { type: "ok",   text: "  7  47 FA PAX 074-9988776655/ETAF/EUR620.00/12OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Open ticket on line 6 and confirm all coupons have status O (Open).",
      hint: "Type <strong>TWD/L6</strong> or <strong>TWD/TKT074-9988776655</strong>",
      inputMatch: {
        aliases: [
          "TWD/L6",
          "TWDL6",
          "TWD/TKT074-9988776655",
          "TWD/TKT0749988776655",
          "TWD/074-9988776655",
          "TWD/0749988776655"
        ]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L6" },
        { type: "ok",   text: "TICKET: 074-9988776655    NAME: NGUYEN/MINH MR" },
        { type: "ok",   text: "ISSUED: 12OCT24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX4411" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 AF   0258   N  10DEC  SGN CDG  O       10DEC NR1VN" },
        { type: "ok",   text: "  2 AF   0259   N  28DEC  CDG SGN  O       28DEC NR1VN" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 620.00   TAX: EUR 200.00   TOTAL: EUR 820.00" },
        { type: "ok",   text: "STATUS: ALL COUPONS OPEN — ELIGIBLE FOR REBOOKING" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Search availability for AF flight CDG to SGN on 20DEC.",
      hint: "Type <strong>SN20DECCDGSGN/AAF</strong>",
      inputMatch: {
        aliases: ["SN20DECCDGSGN/AAF"],
        patterns: ["^SN20DECCDGSGN\\/AAF,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "AF  CDG SGN  20DEC" },
        { type: "ok",  text: "  1  AF 0259  J9 C9 D9 I9  W9 S9 Y9 B9  M9 U9 K9 H9  N4  1710 1040+1  772  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class N open on line 1" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Inbound (SS1N1)",
      task: "Book 1 seat in matching class N on availability line 1.",
      hint: "Type <strong>SS1N1</strong>",
      inputMatch: {
        aliases: ["SS1N1", "SS 1 N 1", "SS 1N1", "SS1N 1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  AF 0259 N 20DEC 5 CDGSGN HK1  1710 1040+1" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New inbound on line 4 · Old inbound still on line 3" }
      ]
    },
    {
      id: "try_atc",
      title: "Attempt ATC Pricing (FXQ)",
      task: "Attempt automated ATC calculation with FXQ on kept outbound (seg 2) and new inbound (seg 4). Observe the restriction response.",
      hint: "Type <strong>FXQ/S2,4/R,UP</strong>",
      inputMatch: {
        aliases: [
          "FXQ/S2,4/R,UP",
          "FXQ/S2-4/R,UP",
          "FXQ/S2,4/RUP",
          "FXQ/S4,2/R,UP"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXQ/S2,4/R,UP" },
        { type: "err",  text: " / \\ " },
        { type: "err",  text: "( ! )  AMADEUS TICKET CHANGER NOT AUTHORIZED" },
        { type: "err",  text: " \\ /  CARRIER RESTRICTED ACCESS TO CAT 31 (AF)" },
        { type: "warn", text: "ATC CANNOT GUARANTEE / CALCULATE THIS REISSUE AUTOMATICALLY" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "NEXT STEP: Check fare rule PENALTIES (FQN), then price manually (FXP)." }
      ]
    },
    {
      id: "read_penalties",
      title: "Read Fare Penalties (FQN)",
      task: "ATC is blocked. Read Category 16 (Penalties) from the fare notes to determine the change fee.",
      hint: "Type <strong>FQN1*PE</strong> or <strong>FQN*PE</strong>",
      inputMatch: {
        aliases: ["FQN1*PE", "FQN*PE", "FQN1PE", "FQN", "FQN1"]
      },
      terminalResponse: [
        { type: "info", text: "FQN1*PE" },
        { type: "ok",   text: "16.PENALTIES" },
        { type: "ok",   text: "  CHANGES" },
        { type: "ok",   text: "    BEFORE DEPARTURE CHARGE EUR 100.00 PER DIRECTION." },
        { type: "ok",   text: "    CHANGES PERMITTED." },
        { type: "warn", text: "→ INBOUND ONLY = 1 DIRECTION → AIRLINE PENALTY EUR 100.00" }
      ]
    },
    {
      id: "manual_price",
      title: "Price Manually with FXP",
      task: "Price the segments the passenger will actually fly (outbound seg 2 + new inbound seg 4) to generate a pricing record.",
      hint: "Type <strong>FXP/S2,4/R,UP</strong>",
      inputMatch: {
        aliases: [
          "FXP/S2,4/R,UP",
          "FXP/S2-4/R,UP",
          "FXP/S2,4/RUP",
          "FXP/S4,2/R,UP"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXP/S2,4/R,UP" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "AF 0258  N  N 10DEC 1930  NR1VN                 10DEC  2P" },
        { type: "ok",   text: "AF 0259  N  N 20DEC 1710  NR1VN                 20DEC  2P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE CALC: SGN AF PAR340.00AF SGN340.00NUC680.00END ROE1.0" },
        { type: "ok",   text: "NEW FARE ......... EUR   640.00      (OLD FARE ... EUR   620.00)" },
        { type: "ok",   text: "FARE DIFF ........ EUR    20.00" },
        { type: "ok",   text: "NEW TAXES ........ EUR   205.00      (OLD TAXES .. EUR   200.00)" },
        { type: "ok",   text: "TAX DIFF ......... EUR     5.00" },
        { type: "warn", text: "PENALTY (CAT 16) . EUR   100.00" },
        { type: "warn", text: "TOTAL ADD COLL ... EUR   125.00  (+ AGENCY SERVICE FEE)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "TST 01 STORED MANUALLY — RECORD READY FOR TICKETING" }
      ]
    },
    {
      id: "cancel_old_segment",
      title: "Delete Old Inbound (XE3)",
      task: "Cancel the old inbound segment on line 3.",
      hint: "Type <strong>XE3</strong>",
      inputMatch: {
        aliases: ["XE3", "X3", "XE 3"]
      },
      terminalResponse: [
        { type: "ok", text: "  3  AF 0259 N 28DEC 6 CDGSGN HK1  — CANCELLED" },
        { type: "ok", text: "OLD INBOUND SEGMENT 3 REMOVED FROM ACTIVE ITINERARY" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit itinerary changes.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  12OCT24/1138Z  LMNOPQ" },
        { type: "ok",  text: "  1.NGUYEN/MINH MR" },
        { type: "ok",  text: "  2  AF 0258 N 10DEC 2 SGNCDG HK1  1930 0615+1  *1A/E*" },
        { type: "ok",  text: "  3  AF 0259 N 20DEC 5 CDGSGN HK1  1710 1040+1  *1A/E*" },
        { type: "ok",  text: "  4 AP SGN +84 28 38221234 - A" },
        { type: "ok",  text: "  5 TK OK12OCT/STOSG34AA//ETAF" },
        { type: "ok",  text: "  6 FA PAX 074-9988776655/ETAF/EUR620.00/12OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  7 TST 01 MANUAL REISSUE MASK STORED" },
        { type: "dim", text: "  8 MIS 1A MANUAL REISSUE ADVICE ATTACHED" },
        { type: "ok",  text: "PNR LMNOPQ UPDATED — ATTACH PRICING BREAKDOWN TO ORDER NOTES" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "CAT 31 drill complete. Key rule: When automated ATC (FXQ/FXO) fails: FQN*PE → FXP (or FXX) → compute Fare Diff + Tax Diff + Penalties + Service Fee. Never guess fees."
  }
};
