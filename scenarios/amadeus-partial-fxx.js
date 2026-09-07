/**
 * Scenario: Partial-Used Ticket — Historical FXX Reissue
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["partial_fxx"] = {
  meta: {
    id: "partial_fxx",
    system: "AMADEUS",
    title: "C · Partial-Used — FXX Reissue",
    blurb: "OB Flown · Rebook IB to 25NOV · Historical FXX (01NOV24/STO)",
    badge: "PARTIAL REISSUE",
    badgeClass: "badge-orange",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "KLM789",
    "PASSENGER": "DAVIS/ROBERT MR",
    "TICKET NO.": "074-1122334455",
    "ROUTE": "LHR → CDG → LHR",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "OB flown, rebook IB to 25NOV via historical FXX"
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
    { type: "dim",  text: "CASE: PARTIALLY USED TICKET / HISTORICAL REISSUE" },
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
      task: "Retrieve booking record KLM789 for passenger DAVIS/ROBERT MR.",
      hint: "Type <strong>RTKLM789</strong> or <strong>RT KLM789</strong>",
      inputMatch: {
        aliases: ["RTKLM789", "RT KLM789"],
        patterns: ["^RT\\s*KLM789$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  15NOV24/0930Z  KLM789" },
        { type: "ok",  text: "  1.DAVIS/ROBERT MR" },
        { type: "dim", text: "  2  AF 1681 T 10NOV 1 LHRCDG FLOWN 0900 1120  *1A/E*" },
        { type: "ok",  text: "  3  AF 1680 T 18NOV 2 CDGLHR HK1   1400 1420  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 79460912 - A" },
        { type: "ok",  text: "  5 APE ROBERT.DAVIS@GLOBAL.CO.UK" },
        { type: "ok",  text: "  6 TK OK01NOV/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-1122334455/ETAF/EUR380.00/01NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A VOLUNTARY PARTIAL REISSUE" },
        { type: "warn",text: "SEGMENT 2 IS FLOWN — PARTIAL HISTORICAL REISSUE REQUIRED" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display the ticket list to identify the e-ticket line number.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR KLM789" },
        { type: "ok",   text: "  7  47 FA PAX 074-1122334455/ETAF/EUR380.00/01NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ELECTRONIC TICKET PARTIALLY USED — COUPON 1 FLOWN" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Open ticket on line 6 to inspect coupon statuses.",
      hint: "Type <strong>TWD/L6</strong>",
      inputMatch: {
        aliases: ["TWD/L6", "TWDL6", "TWD/TKT074-1122334455", "TWD/074-1122334455"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L6" },
        { type: "ok",   text: "TICKET: 074-1122334455    NAME: DAVIS/ROBERT MR" },
        { type: "ok",   text: "ISSUED: 01NOV24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX9012" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "dim",  text: "  1 AF   1681   T  10NOV  LHR CDG  F       10NOV TR1GB" },
        { type: "ok",   text: "  2 AF   1680   T  18NOV  CDG LHR  O       18NOV TR1GB" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 380.00   TAX: EUR 95.00   TOTAL: EUR 475.00" },
        { type: "warn", text: "CPN 1 FLOWN — PARTIAL USE CONFIRMED — PRICE WITH FXX/R,01NOV24,UP,STO/S2,4" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Search availability for AF flight CDG to LHR on 25NOV.",
      hint: "Type <strong>SN25NOVCDGLHR/AAF</strong>",
      inputMatch: {
        aliases: ["SN25NOVCDGLHR/AAF"],
        patterns: ["^SN25NOVCDGLHR\\/AAF,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "AF  CDG LHR  25NOV" },
        { type: "ok",  text: "  1  AF 1680  T4  25NOV CDGLHR  1400  1420  320  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class T open on line 1" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Inbound (SS1T1)",
      task: "Book 1 seat in matching class T on availability line 1.",
      hint: "Type <strong>SS1T1</strong>",
      inputMatch: {
        aliases: ["SS1T1", "SS 1 T 1", "SS 1T1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  AF 1680 T 25NOV 2 CDGLHR HK1  1400 1420" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New inbound segment booked on line 4" }
      ]
    },
    {
      id: "historical_fxx",
      title: "Historical Price (FXX)",
      task: "Run historical FXX calculation on flown segment 2 and new segment 4 using original Date of Issue (01NOV24) and Point of Issue city STO (from issuing office STOSG34AA).",
      hint: "Type <strong>FXX/R,01NOV24,UP,STO/S2,4</strong> (POI is the 3-letter city code STO from issuing office STOSG34AA; DOI is 01NOV24 from ticket ISSUED line).",
      inputMatch: {
        aliases: [
          "FXX/R,01NOV24,UP,STO/S2,4",
          "FXX/R,01NOV24,UP,STO/S2-4",
          "FXX/S2,4/R,01NOV24,UP,STO",
          "FXX/S2-4/R,01NOV24,UP,STO",
          "FXX/R,1NOV24,UP,STO/S2,4",
          "FXX/R,01NOV,UP,STO/S2,4"
        ],
        patterns: ["^FXX\\/R,0?1NOV(24)?,UP,STO\\/S[24],[24]$", "^FXX\\/S[24],[24]\\/R,0?1NOV(24)?,UP,STO$"]
      },
      terminalResponse: [
        { type: "info", text: "FXX/R,01NOV24,UP,STO/S2,4" },
        { type: "ok",   text: "HISTORICAL REISSUE PRICING RECORD — DOI 01NOV24 POI STO" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "dim",  text: "AF 1681  T  T 10NOV 0900  TR1GB (USED)          10NOV  1P" },
        { type: "ok",   text: "AF 1680  T  T 25NOV 1400  TR1GB                 25NOV  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "OLD TICKET: 074-1122334455" },
        { type: "ok",   text: "BASE FARE BALANCE .. EUR   35.00      OLD FARE ... EUR   380.00" },
        { type: "ok",   text: "TAX BALANCE ........ EUR   12.00      OLD TAXES .. EUR    95.00" },
        { type: "warn", text: "PENALTY CHARGE .... EUR   80.00" },
        { type: "warn", text: "TOTAL ADD COLL .... EUR  127.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "TST 01 CREATED FOR AUDIT — USE FQQ01 TO INSPECT" }
      ]
    },
    {
      id: "read_tst",
      title: "Audit Stored TST (FQQ01)",
      task: "Verify the generated historical TST 1 breakdown.",
      hint: "Type <strong>FQQ01</strong> or <strong>FQQ1</strong>",
      inputMatch: {
        aliases: ["FQQ01", "FQQ1"]
      },
      terminalResponse: [
        { type: "info", text: "FQQ01" },
        { type: "ok",   text: "TST 01  LHR AF PAR AF LON  S2,4" },
        { type: "ok",   text: "FARE CALC: LON AF PAR190.00AF LON225.00NUC415.00END ROE0.86" },
        { type: "warn", text: "CRITICAL: NEW MASK MUST KEEP ORIGINAL FLOWN OB FARE BASIS AND BOOKING CLASS" },
        { type: "ok",   text: "FARE BALANCE: EUR 35.00  TAX BALANCE: EUR 12.00  PENALTY: EUR 80.00" },
        { type: "warn", text: "TOTAL ADD COLL CONFIRMED: EUR 127.00" }
      ]
    },
    {
      id: "store_fxp",
      title: "Store Pricing (FXP)",
      task: "Commit the historical pricing mask for segments 2 and 4 using FXP with historical reissue parameters.",
      hint: "Type <strong>FXP/R,01NOV24,UP,STO/S2,4</strong> (or <strong>FXP/S2,4/R,UP</strong>)",
      inputMatch: {
        aliases: [
          "FXP/R,01NOV24,UP,STO/S2,4",
          "FXP/R,01NOV24,UP,STO/S2-4",
          "FXP/S2,4/R,01NOV24,UP,STO",
          "FXP/S2-4/R,01NOV24,UP,STO",
          "FXP/R,1NOV24,UP,STO/S2,4",
          "FXP/R,01NOV,UP,STO/S2,4",
          "FXP/S2,4/R,UP",
          "FXP/S2-4/R,UP",
          "FXP/S2,4"
        ],
        patterns: ["^FXP\\/R,0?1NOV(24)?,UP,STO\\/S[24],[24]$", "^FXP\\/S[24],[24]\\/R,0?1NOV(24)?,UP,STO$"]
      },
      terminalResponse: [
        { type: "info", text: "FXP/R,01NOV24,UP,STO/S2,4" },
        { type: "ok",   text: "TST 01 STORED — READY FOR REISSUE FULFILLMENT" }
      ]
    },
    {
      id: "cancel_old_ib",
      title: "Delete Old Inbound (XE3)",
      task: "Remove the old superseded inbound segment on line 3.",
      hint: "Type <strong>XE3</strong>",
      inputMatch: {
        aliases: ["XE3", "X3"]
      },
      terminalResponse: [
        { type: "ok", text: "  3  AF 1680 T 18NOV 2 CDGLHR HK1  — CANCELLED" },
        { type: "ok", text: "OLD INBOUND SEGMENT 3 REMOVED" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to finalize partial reissue.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  15NOV24/0952Z  KLM789" },
        { type: "ok",  text: "  1.DAVIS/ROBERT MR" },
        { type: "dim", text: "  2  AF 1681 T 10NOV 1 LHRCDG FLOWN 0900 1120  *1A/E*" },
        { type: "ok",  text: "  3  AF 1680 T 25NOV 2 CDGLHR HK1   1400 1420  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 79460912 - A" },
        { type: "ok",  text: "  5 TK OK01NOV/STOSG34AA//ETAF" },
        { type: "ok",  text: "  6 FA PAX 074-1122334455/ETAF/EUR380.00/01NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  7 TST 01 HISTORICAL REISSUE MASK STORED" },
        { type: "ok",  text: "PNR KLM789 UPDATED — HAND OFF TO FULFILLMENT" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Partial reissue drill complete. Key rule: When outbound is flown, use FXX with concrete parameters (e.g. /R,01NOV24,UP,STO) to quote historical fare rules using original Date of Issue (DOI) and Point of Issue city (POI from issuing office), verify with FQQ, then commit with FXP. Critical: The new pricing mask must retain the original flown outbound fare basis and booking class."
  }
};
