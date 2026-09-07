/**
 * Scenario: Drop Baggage Trap & Fare Family Filter (FXQ /FF-ECOSTAND)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["drop_baggage_ff"] = {
  meta: {
    id: "drop_baggage_ff",
    system: "AMADEUS",
    title: "Drop Baggage Trap & Fare Family Filter (FXQ /FF-)",
    blurb: "Unused rebook · Plain FXQ drops 1PC→0PC · Protect baggage with /FF-ECOSTAND",
    badge: "DROP BAGGAGE",
    badgeClass: "badge-blue",
    category: "Baggage & Fare Family"
  },

  caseMeta: {
    "PNR": "BAG882",
    "PASSENGER": "BERG/JONAS MR",
    "TICKET NO.": "117-7722334455",
    "ROUTE": "ARN → HEL → ARN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Rebook inbound flight to 28DEC. Original ticket has 1PC baggage. Price with FXQ, avoid the drop baggage trap, and protect baggage allowance with /FF-ECOSTAND."
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
    { type: "dim",  text: "CASE: UNUSED REBOOK — PROTECT BAGGAGE ALLOWANCE (/FF- FILTER)" },
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
      task: "Retrieve booking record BAG882 for passenger BERG/JONAS MR.",
      hint: "Type <strong>RTBAG882</strong> or <strong>RT BAG882</strong>",
      inputMatch: {
        aliases: ["RTBAG882", "RT BAG882", "RT"],
        patterns: ["^RT\\s*BAG882$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  15NOV24/1105Z  BAG882" },
        { type: "ok",  text: "  1.BERG/JONAS MR" },
        { type: "ok",  text: "  2  SK 0702 T 15DEC 7 ARNHEL HK1  0830 1100  *1A/E*" },
        { type: "ok",  text: "  3  SK 0715 T 22DEC 1 HELARN HK1  1640 1710  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 5551234 - A" },
        { type: "ok",  text: "  5 APE JONAS.BERG@TRAVEL.SE" },
        { type: "ok",  text: "  6 TK OK05NOV/STOSG34AA//ETSK" },
        { type: "ok",  text: "  7 FA PAX 117-7722334455/ETSK/EUR220.00/05NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display ticket elements associated with the PNR using RTTN.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR BAG882" },
        { type: "ok",   text: "  7  47 FA PAX 117-7722334455/ETSK/EUR220.00/05NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD)",
      task: "Display electronic ticket to check coupon statuses and original baggage allowance.",
      hint: "Type <strong>TWD</strong> or <strong>TWD/L7</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L7", "TWDL7", "TWD/T1", "TWD1", "TWD/TKT117-7722334455"]
      },
      terminalResponse: [
        { type: "info", text: "TWD" },
        { type: "ok",   text: "TICKET: 117-7722334455    NAME: BERG/JONAS MR" },
        { type: "ok",   text: "ISSUED: 05NOV24  STOSG34AA  FOP: CC AX XXXXXXXXXXXX0001" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS   BG" },
        { type: "ok",   text: "  1 SK   0702   T  15DEC  ARN HEL  O       15DEC TSTAND1   1P" },
        { type: "ok",   text: "  2 SK   0715   T  22DEC  HEL ARN  O       22DEC TSTAND1   1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 160.00   TAX: EUR 60.00   TOTAL: EUR 220.00" },
        { type: "ok",   text: "ORIGINAL BAGGAGE: 1PC (23KG) — BRAND: ECOSTAND" }
      ]
    },
    {
      id: "check_fare_family",
      title: "Check Fare Family (TTH/T1)",
      task: "Audit stored ticket history with TTH/T1 to confirm the commercial brand / Fare Family name.",
      hint: "Type <strong>TTH/T1</strong> or <strong>TTH</strong>",
      inputMatch: {
        aliases: ["TTH/T1", "TTH", "TTHT1", "TTH/T01"]
      },
      terminalResponse: [
        { type: "info", text: "TTH/T1" },
        { type: "ok",   text: "TICKET HISTORY RECORD 01 — STORED FARE CALCULATION" },
        { type: "ok",   text: "PAX: 1.1 BERG/JONAS MR      TKT: 117-7722334455" },
        { type: "warn", text: "AFF-ECOSTAND                SAS GO SMART / STANDARD" },
        { type: "ok",   text: "INCLUDED ANCILLARY SERVICES: 1PC CHECKED BAG (23KG)" },
        { type: "info", text: "STORED BRAND: ECOSTAND — MUST PRESERVE WITH /FF-ECOSTAND ON REPRICE" }
      ]
    },
    {
      id: "check_availability",
      title: "Check Availability (SN)",
      task: "Check flight availability on SAS for the new return date 28DEC from HEL to ARN.",
      hint: "Type <strong>SN28DECHELARN/ASK</strong>",
      inputMatch: {
        aliases: [
          "SN28DECHELARN/ASK",
          "SN28DECHELARN",
          "SN 28DEC HELARN /A SK",
          "SN 28DEC HELARN",
          "SN28DECHELARN/A SK"
        ],
        patterns: ["^SN28DECHELARN.*$"]
      },
      terminalResponse: [
        { type: "ok",  text: "SK  HEL ARN  28DEC" },
        { type: "ok",  text: "  1  SK 0719  C9 D9 I9  Y9 S9 B9 M9  T9 L9 K9  1415 1445  CR9  0" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Class T available on line 1 — flight SK 0719" }
      ]
    },
    {
      id: "sell_segment",
      title: "Sell New Segment (SS1T1)",
      task: "Sell 1 seat in T class on availability line 1.",
      hint: "Type <strong>SS1T1</strong>",
      inputMatch: {
        aliases: ["SS1T1", "SS 1 T 1", "SS 1T1", "SS1T 1"]
      },
      terminalResponse: [
        { type: "ok",  text: "  4  SK 0719 T 28DEC 6 HELARN HK1  1415 1445  *1A/E*" },
        { type: "dim", text: "" },
        { type: "ok",  text: "New return segment added on line 4. Old return remains on line 3." }
      ]
    },
    {
      id: "reprice_unfiltered",
      title: "Unfiltered Reprice (Drop Baggage Trap!)",
      task: "Test price the retained segment 2 and new segment 4 without a fare family filter: FXQ/S2,4/R,UP.",
      hint: "Type <strong>FXQ/S2,4/R,UP</strong>",
      inputMatch: {
        aliases: [
          "FXQ/S2,4/R,UP",
          "FXQ/S2,4/RUP",
          "FXQ/S2-4/R,UP",
          "FXQ/S4,2/R,UP",
          "FXQ/S2,4/R,UP,STO",
          "FXQ/S2,4/RUP,STO"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXQ/S2,4/R,UP" },
        { type: "ok",   text: "ATC REISSUE — GUARANTEED (FARE FAMILY: LIGHT)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "warn", text: "SK 0702  T  T 15DEC 0830  TLIGHT0                15DEC  0P" },
        { type: "warn", text: "SK 0719  T  T 28DEC 1415  TLIGHT0                28DEC  0P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "BASE FARE ......... EUR   190.00      OLD FARE ... EUR   220.00" },
        { type: "ok",   text: "PENALTY ........... EUR    50.00" },
        { type: "ok",   text: "TOTAL ADD COLL .... EUR    50.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "err",  text: "*** CRITICAL WARNING: DROP BAGGAGE DETECTED! ***" },
        { type: "err",  text: "ORIGINAL TICKET INCLUDED 1PC BAGGAGE (AFF-ECOSTAND)." },
        { type: "err",  text: "UNFILTERED FXQ PRICED INTO CHEAPEST BRAND: SAS GO LIGHT (0P BAGGAGE)." },
        { type: "err",  text: "IF ISSUED, PASSENGER WILL HAVE NO CHECKED BAG AT AIRPORT!" },
        { type: "info", text: "ACTION: REPRICE WITH /FF-ECOSTAND TO PRESERVE 1PC BAGGAGE" }
      ]
    },
    {
      id: "reprice_with_ff",
      title: "Reprice with Fare Family Filter (FXQ /FF-ECOSTAND)",
      task: "Reprice segments 2 and 4 applying the /FF-ECOSTAND filter to guarantee 1PC included baggage.",
      hint: "Type <strong>FXQ/S2,4/R,UP/FF-ECOSTAND</strong>",
      inputMatch: {
        aliases: [
          "FXQ/S2,4/R,UP/FF-ECOSTAND",
          "FXQ/S2,4/RUP/FF-ECOSTAND",
          "FXQ/S2-4/R,UP/FF-ECOSTAND",
          "FXQ/S4,2/R,UP/FF-ECOSTAND",
          "FXQ/S2,4/R,UP,STO/FF-ECOSTAND",
          "FXP/S2,4/R,UP/FF-ECOSTAND"
        ]
      },
      terminalResponse: [
        { type: "info", text: "FXQ/S2,4/R,UP/FF-ECOSTAND" },
        { type: "ok",   text: "ATC REISSUE — GUARANTEED (FARE FAMILY: ECOSTAND)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "SK 0702  T  T 15DEC 0830  TSTAND1                15DEC  1P" },
        { type: "ok",   text: "SK 0719  T  T 28DEC 1415  TSTAND1                28DEC  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "INCLUDED BAGGAGE: 1PC PRESERVED (BRAND: ECOSTAND)" },
        { type: "ok",   text: "OLD TICKET: 117-7722334455" },
        { type: "ok",   text: "BASE FARE ......... EUR   250.00      OLD FARE ... EUR   220.00" },
        { type: "ok",   text: "DIFF .............. EUR    30.00" },
        { type: "ok",   text: "TAX BALANCE ....... EUR     0.00" },
        { type: "ok",   text: "PENALTY ........... EUR    50.00" },
        { type: "warn", text: "TOTAL ADD COLL .... EUR    80.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "TST 01 STORED — REISSUE MASK CREATED WITH 1PC BAGGAGE" }
      ]
    },
    {
      id: "check_penalties",
      title: "Check Penalties (FQN1*PE)",
      task: "Check penalties rule text for line 1 to confirm the EUR 50.00 reissue fee before accepting.",
      hint: "Type <strong>FQN1*PE</strong>",
      inputMatch: {
        aliases: ["FQN1*PE", "FQN*PE", "FQN1PE", "FQN01*PE", "FQN1*16"]
      },
      terminalResponse: [
        { type: "info", text: "FQN1*PE" },
        { type: "ok",   text: "CATEGORY 16 - PENALTIES - TSTAND1 / ECOSTAND" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "CHANGES BEFORE DEPARTURE: PERMITTED FOR CHARGE EUR 50.00." },
        { type: "ok",   text: "PENALTY CONFIRMED: EUR 50.00 + EUR 30.00 FARE DIFF = EUR 80.00 TOTAL ADD COLLECT" }
      ]
    },
    {
      id: "cancel_old_segment",
      title: "Cancel Old Return Segment (XE3)",
      task: "Customer accepted and paid EUR 80.00 add collect. Cancel the old return segment 3.",
      hint: "Type <strong>XE3</strong>",
      inputMatch: {
        aliases: ["XE3", "X3", "XE 3"]
      },
      terminalResponse: [
        { type: "ok", text: "  3  SK 0715 T 22DEC 1 HELARN HK1  — CANCELLED" },
        { type: "ok", text: "OLD RETURN SEGMENT 3 REMOVED FROM ACTIVE ITINERARY" }
      ]
    },
    {
      id: "end_and_retrieve",
      title: "Save PNR (ER)",
      task: "End transaction and retrieve booking to commit the changes and save TST 01.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER", "ET"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  15NOV24/1125Z  BAG882" },
        { type: "ok",  text: "  1.BERG/JONAS MR" },
        { type: "ok",  text: "  2  SK 0702 T 15DEC 7 ARNHEL HK1  0830 1100  *1A/E*" },
        { type: "ok",  text: "  3  SK 0719 T 28DEC 6 HELARN HK1  1415 1445  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 5551234 - A" },
        { type: "ok",  text: "  5 TK OK05NOV/STOSG34AA//ETSK" },
        { type: "ok",  text: "  6 FA PAX 117-7722334455/ETSK/EUR220.00/05NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  7 TST 01 REISSUE MASK (ECOSTAND 1PC) VALIDATED" }
      ]
    }
  ],

  winMessage: {
    title: "Baggage Protection Drill Complete ✓",
    text: "Drop-baggage trap avoided! When rebooking in Amadeus, a plain FXQ/S…/R,UP prices into the cheapest available fare brand (often Light/0PC). If the passenger originally had 1PC, dropping to 0PC without consent is a serious error. Always check TTH/T1 for original AFF brand, and use /FF-ECOSTAND to force Amadeus to quote within the correct fare family with 1PC included."
  }
};
