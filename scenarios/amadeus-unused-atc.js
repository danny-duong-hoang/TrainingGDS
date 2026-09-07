/**
 * Scenario A: Unused Ticket — Automated ATC Rebook
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["unused_ib"] = {
  meta: {
    id: "unused_ib",
    system: "AMADEUS",
    title: "A · Unused ATC — Rebook Inbound",
    blurb: "EZE–CDG–EZE · Reschedule IB to 07NOV · ATC OK",
    badge: "UNUSED TICKET",
    badgeClass: "badge-blue",
    category: "Rebook"
  },

  caseMeta: {
    "PNR": "ABCXYZ",
    "PASSENGER": "LINDQVIST/ANNA MRS",
    "TICKET NO.": "074-3853604512",
    "ROUTE": "EZE → CDG → EZE",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Rebook inbound to 07NOV"
  },

  officeConfig: {
    startOffice: "STOQK2100",
    targetOffice: "STOSG34AA",
    offices: [
      { id: "STOQK2100", label: "STOQK2100 (DEFAULT)" },
      { id: "STOSG34AA", label: "STOSG34AA (ISSUING OFFICE)" },
      { id: "LONAC2800", label: "LONAC2800 (LONDON BRANCH)" }
    ]
  },

  bootLines: [
    { type: "info", text: "AMADEUS SELLING PLATFORM CONNECT — STOQK2100" },
    { type: "dim",  text: "OFFICE: STOQK2100 | AGENT: ATC-TRAINING" },
    { type: "dim",  text: "────────────────────────────────────────" },
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
        { type: "ok",  text: "CITY       : STOCKHOLM" },
        { type: "ok",  text: "STATUS     : SIGNED IN" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Office ID changed to STOSG34AA" }
      ]
    },
    {
      id: "retrieve_pnr",
      title: "Retrieve PNR",
      task: "Now in issuing office STOSG34AA, retrieve the booking for LINDQVIST/ANNA MRS with record locator ABCXYZ.",
      hint: "Type <strong>RTABCXYZ</strong> or <strong>RT ABCXYZ</strong>",
      inputMatch: {
        aliases: ["RTABCXYZ", "RT ABCXYZ"],
        patterns: ["^RT\\s*ABCXYZ$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  07OCT24/1423Z  ABCXYZ" },
        { type: "ok",  text: "  1.LINDQVIST/ANNA MRS" },
        { type: "ok",  text: "  2  AF 0442 V 07NOV 4 EZECDG HK1  2350 1545+1  *1A/E*" },
        { type: "ok",  text: "  3  AF 0443 V 14NOV 4 CDGEZE HK1  1700 0545+1  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 1234567 - A" },
        { type: "ok",  text: "  5 APE ANNA.LINDQVIST@TRAVEL.SE" },
        { type: "ok",  text: "  6 TK OK07OCT/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-3853604512/ETAF/EUR842.00/07OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A VOLUNTARY REBOOK REQUESTED" },
        { type: "info",text: "SEGMENT STATUS: HK — ATC PROCESS CAN PROCEED" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display all tickets associated with this PNR to locate the active FA element.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR ABCXYZ" },
        { type: "ok",   text: "  6  47 FA PAX 074-3853604512/ETAF/EUR842.00/07OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  7     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Open ticket line 6 to inspect coupon statuses and verify all coupons are O (Open).",
      hint: "Type <strong>TWD/L6</strong> or <strong>TWD/TKT074-3853604512</strong>",
      inputMatch: {
        aliases: [
          "TWD/L6",
          "TWDL6",
          "TWD/TKT074-3853604512",
          "TWD/TKT0743853604512",
          "TWD/074-3853604512",
          "TWD/0743853604512"
        ]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L6" },
        { type: "ok",   text: "TICKET: 074-3853604512    NAME: LINDQVIST/ANNA MRS" },
        { type: "ok",   text: "ISSUED: 07OCT24  STOSG34AA  FOP: CC AX XXXXXXXXXXXX0001" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 AF   0442   V  07NOV  EZE CDG  O       07NOV VR1SE" },
        { type: "ok",   text: "  2 AF   0443   V  14NOV  CDG EZE  O       14NOV VR1SE" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 842.00   TAX: EUR 210.00   TOTAL: EUR 1052.00" },
        { type: "ok",   text: "STATUS: ALL COUPONS OPEN — ELIGIBLE FOR ATC REBOOKING" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Passenger requests new inbound on 07NOV for CDG to EZE with Air France. Check availability for open classes.",
      hint: "Type <strong>SN07NOVCDGEZE/AAF</strong>",
      inputMatch: {
        aliases: ["SN07NOVCDGEZE/AAF", "SN7NOVCDGEZE/AAF"],
        patterns: ["^SN0?7NOVCDGEZE\\/AAF,?$"]
      },
      terminalResponse: [
        { type: "ok",  text: "AF  CDG EZE  07NOV" },
        { type: "ok",  text: "  1  AF 0443  C9 D9 I9 Z9  W9 S9 Y9 B9  M9 K9 H9 Q9  V4  1700 0545+1  332  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class V available on line 1 — same as original inbound" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Segment (SS1V1)",
      task: "Sell 1 seat in V class on availability line 1 (equal booking code, avoiding downgrade).",
      hint: "Type <strong>SS1V1</strong>",
      inputMatch: {
        aliases: ["SS1V1", "SS 1 V 1", "SS 1V1", "SS1V 1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  AF 0443 V 07NOV 3 CDGEZE HK1  1700  0545+1" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New inbound added on line 4. Old inbound remains on line 3." }
      ]
    },
    {
      id: "price_fxq",
      title: "Price with FXQ",
      task: "Execute ATC calculation on the retained outbound (segment 2) and new inbound (segment 4). Use FXQ to quote.",
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
        { type: "ok",   text: "ATC REISSUE — GUARANTEED" },
        { type: "dim",  text: "LAST TKT DTE 07NOV24 - DATE OF ORIGIN" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "AF 0442  V  V 07NOV 2350  VR1SE                 07NOV  2P" },
        { type: "ok",   text: "AF 0443  V  V 07NOV 1700  VR1SE                 07NOV  2P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "OLD TICKET: 074-3853604512" },
        { type: "ok",   text: "BASE FARE ......... EUR   560.00      OLD FARE ... EUR   560.00" },
        { type: "ok",   text: "EQUIV FARE ........ EUR     0.00      DIFF ....... EUR     0.00" },
        { type: "ok",   text: "TAXES ............. EUR   282.00      OLD TAXES .. EUR   282.00" },
        { type: "ok",   text: "TAX BALANCE ....... EUR     6.00" },
        { type: "ok",   text: "PENALTY ........... EUR    75.00" },
        { type: "warn", text: "TOTAL ADD COLL .... EUR    81.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "TST 01 STORED — REISSUE MASK CREATED" }
      ]
    },
    {
      id: "cancel_old_segment",
      title: "Delete Old Inbound (XE3)",
      task: "Customer accepted and paid the quote. Remove the old inbound segment on line 3.",
      hint: "Type <strong>XE3</strong>",
      inputMatch: {
        aliases: ["XE3", "X3", "XE 3"]
      },
      terminalResponse: [
        { type: "ok", text: "  3  AF 0443 V 14NOV 4 CDGEZE HK1  — CANCELLED" },
        { type: "ok", text: "OLD INBOUND SEGMENT 3 REMOVED FROM ACTIVE ITINERARY" }
      ]
    },
    {
      id: "end_and_retrieve",
      title: "Save PNR (ER)",
      task: "End transaction and retrieve booking to commit itinerary updates and stored ATC pricing mask.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  07OCT24/1445Z  ABCXYZ" },
        { type: "ok",  text: "  1.LINDQVIST/ANNA MRS" },
        { type: "ok",  text: "  2  AF 0442 V 07NOV 4 EZECDG HK1  2350 1545+1  *1A/E*" },
        { type: "ok",  text: "  3  AF 0443 V 07NOV 4 CDGEZE HK1  1700 0545+1  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 1234567 - A" },
        { type: "ok",  text: "  5 TK OK07OCT/STOSG34AA//ETAF" },
        { type: "ok",  text: "  6 FA PAX 074-3853604512/ETAF/EUR842.00/07OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  7 TST 01 REISSUE MASK VALIDATED" }
      ]
    },
    {
      id: "queue_pnr",
      title: "Forward to Ticketing (QF/0)",
      task: "Place the updated PNR on Queue 0 for ticketing reissue fulfillment.",
      hint: "Type <strong>QF/0</strong> or <strong>QE/0</strong>",
      inputMatch: {
        aliases: ["QF/0", "QE/0", "QF0", "QE0"]
      },
      terminalResponse: [
        { type: "ok", text: "QUEUE PLACED — Q/0 TICKETING" },
        { type: "ok", text: "Hand-off complete. Next on floor: Rebooking Wizard + Fulfillment." }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Unused ATC inbound drill finished. Remember standard sequence: Verify OID → RT → RTTN → TWD (Open) → SN → SS → FXQ → XE old segment → ER → Queue."
  }
};
