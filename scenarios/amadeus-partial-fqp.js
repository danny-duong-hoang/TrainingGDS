/**
 * Scenario: Partial-Used Ticket — FXX Failure & FQP Pricing Fallback
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["partial_fqp"] = {
  meta: {
    id: "partial_fqp",
    system: "AMADEUS",
    title: "D · Partial-Used — FQP Fallback",
    blurb: "OB Flown · FXX fails · Price via historical FQP entry",
    badge: "PARTIAL FQP",
    badgeClass: "badge-orange",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "PART01",
    "PASSENGER": "PETERS/MARK MR",
    "TICKET NO.": "074-8877665544",
    "ROUTE": "LHR → CDG → LHR",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Outbound flown, FXX fails to price. Fallback to informative FQP."
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
    { type: "dim",  text: "CASE: PARTIAL USED TICKET / FXX FAILURE → FQP ENTRY" },
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
      task: "Retrieve booking record PART01 for passenger PETERS/MARK MR.",
      hint: "Type <strong>RTPART01</strong> or <strong>RT PART01</strong>",
      inputMatch: {
        aliases: ["RTPART01", "RT PART01"],
        patterns: ["^RT\\s*PART01$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  14NOV24/1140Z  PART01" },
        { type: "ok",  text: "  1.PETERS/MARK MR" },
        { type: "dim", text: "  2  AF 1681 V 10NOV 1 LHRCDG FLOWN 0900 1120  *1A/E*" },
        { type: "ok",  text: "  3  AF 1680 V 15NOV 2 CDGLHR HK1   1400 1420  *1A/E*" },
        { type: "ok",  text: "  4 AP LON +44 20 79461122 - A" },
        { type: "ok",  text: "  5 APE MARK.PETERS@CORP.UK" },
        { type: "ok",  text: "  6 TK OK01NOV/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-8877665544/ETAF/EUR410.00/01NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A VOLUNTARY PARTIAL REBOOK" },
        { type: "warn",text: "SEGMENT 2 IS FLOWN — PARTIAL HISTORICAL REISSUE REQUIRED" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display the ticket list to verify active FA line.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR PART01" },
        { type: "ok",   text: "  7  47 FA PAX 074-8877665544/ETAF/EUR410.00/01NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET — COUPON 1 FLOWN" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Inspect coupons to confirm outbound is Flown (F) and inbound is Open (O).",
      hint: "Type <strong>TWD/L6</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L6", "TWDL6", "TWD/TKT074-8877665544"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L7" },
        { type: "ok",   text: "TICKET: 074-8877665544    NAME: PETERS/MARK MR" },
        { type: "ok",   text: "ISSUED: 01NOV24  STOSG34AA  FOP: CC AX XXXXXXXXXXXX3344" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "dim",  text: "  1 AF   1681   V  10NOV  LHR CDG  F       10NOV VR1GB" },
        { type: "ok",   text: "  2 AF   1680   V  15NOV  CDG LHR  O       15NOV VR1GB" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 410.00   TAX: EUR 90.00   TOTAL: EUR 500.00" },
        { type: "warn", text: "CPN 1 FLOWN — PARTIAL USE CONFIRMED — ATTEMPT FXX/R,01NOV24,UP,STO/S2,4" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Search availability for AF flight CDG to LHR on 18NOV.",
      hint: "Type <strong>SN18NOVCDGLHR/AAF</strong>",
      inputMatch: {
        aliases: ["SN18NOVCDGLHR/AAF"],
        patterns: ["^SN18NOVCDGLHR\\/AAF,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "AF  CDG LHR  18NOV" },
        { type: "ok",  text: "  1  AF 1680  V4  18NOV CDGLHR  1400  1420  320  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class V open on line 1" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Inbound (SS1V1)",
      task: "Book 1 seat in matching class V on availability line 1.",
      hint: "Type <strong>SS1V1</strong>",
      inputMatch: {
        aliases: ["SS1V1", "SS 1 V 1", "SS 1V1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  AF 1680 V 18NOV 2 CDGLHR HK1  1400 1420" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New inbound booked on line 4" }
      ]
    },
    {
      id: "attempt_fxx",
      title: "Attempt FXX Pricing",
      task: "Attempt automated historical pricing with FXX on segments 2 and 4 using original issue date (01NOV24) and issue city STO (from office STOSG34AA). (Observe failure).",
      hint: "Type <strong>FXX/R,01NOV24,UP,STO/S2,4</strong> (POI is 3-letter city STO from issuing office STOSG34AA; DOI is 01NOV24 from ticket ISSUED line).",
      inputMatch: {
        aliases: [
          "FXX/R,01NOV24,UP,STO/S2,4",
          "FXX/R,01NOV24,UP,STO/S2-4",
          "FXX/S2,4/R,01NOV24,UP,STO",
          "FXX/S2-4/R,01NOV24,UP,STO",
          "FXX/R,1NOV24,UP,STO/S2,4",
          "FXX/R,01NOV,UP,STO/S2,4",
          "FXX/S2,4",
          "FXX/S2-4"
        ],
        patterns: ["^FXX\\/R,0?1NOV(24)?,UP,STO\\/S[24],[24]$", "^FXX\\/S[24],[24]\\/R,0?1NOV(24)?,UP,STO$"]
      },
      terminalResponse: [
        { type: "info", text: "FXX/R,01NOV24,UP,STO/S2,4" },
        { type: "err",  text: "UNABLE TO PRICE — HISTORICAL FARE RECORD NOT FOUND" },
        { type: "warn", text: "FXX FAILED: FARE BASIS OR MILEAGE ROUTING CANNOT AUTO-STORE" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "ACTION REQUIRED: Construct informative FQP pricing entry for ticketing." }
      ]
    },
    {
      id: "price_fqp",
      title: "Manual Quote with FQP",
      task: "Execute informative FQP pricing specifying routing, historical date of issue 01NOV24, issue city STO (from office STOSG34AA), and class V.",
      hint: "Type <strong>FQP LHR AF PAR AF LON/D10NOV/R,01NOV24,UP,STO/CL,V/S2,4</strong> (or <strong>FQP/S2,4/R,01NOV24,UP,STO</strong>).",
      inputMatch: {
        aliases: [
          "FQP LHR AF PAR AF LON/D10NOV/R,01NOV24,UP,STO/CL,V/S2,4",
          "FQPLHRAFPARAFLON/D10NOV/R,01NOV24,UP,STO/CL,V/S2,4",
          "FQP LHR AF PAR AF LON/D10NOV/R,01NOV24,UP,STO/CL,V",
          "FQP/S2,4/R,01NOV24,UP,STO",
          "FQP/S2,4/R,01NOV24,UP,STO/CL,V",
          "FQP LHR AF PAR AF LON/D10NOV/R,10NOV/CL,V/S2,4",
          "FQPLHRAFPARAFLON/D10NOV/R,10NOV/CL,V/S2,4",
          "FQP LHR AF PAR AF LON/D10NOV/R,10NOV/CL,V",
          "FQP/S2,4"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FQP LHR AF PAR AF LON/D10NOV/R,01NOV24,UP,STO/S2,4" },
        { type: "ok",   text: "INFORMATIVE PRICING CALCULATION — HISTORICAL DOI 01NOV24 POI STO" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "dim",  text: "AF 1681  V  V 10NOV 0900  VR1GB (USED)          10NOV  1P" },
        { type: "ok",   text: "AF 1680  V  V 18NOV 1400  VR1GB                 18NOV  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "BASE FARE: EUR 420.00   TAX: EUR 85.00   PENALTY: EUR 75.00" },
        { type: "warn", text: "TOTAL ADD COLL: EUR 110.00 — STORED IN TST 01" }
      ]
    },
    {
      id: "read_tst",
      title: "Audit Stored TST (FQQ01)",
      task: "Display TST 01 to review the calculation and verify fare basis.",
      hint: "Type <strong>FQQ01</strong> or <strong>FQQ1</strong>",
      inputMatch: {
        aliases: ["FQQ01", "FQQ1"]
      },
      terminalResponse: [
        { type: "info", text: "FQQ01" },
        { type: "ok",   text: "TST 01 — INFORMATIVE REISSUE MASK AUDIT" },
        { type: "warn", text: "CRITICAL: ENSURE FLOWN OB FARE BASIS AND BOOKING CLASS MATCH ORIGINAL TICKET" },
        { type: "ok",   text: "QUOTE DETAILS READY FOR MANUAL TICKETING QUEUE HANDOFF" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Partial FQP drill complete! When automated FXX fails on partially flown journeys, construct an informative FQP string with original Date of Issue and routing. The FQP string is often copied for ticketing and TST may not save from script in manual fallback. Warning: The outbound fare basis and booking class must strictly match original flown coupons."
  }
};
