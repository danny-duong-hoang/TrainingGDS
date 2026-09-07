/**
 * Scenario: Display Fare Rules & Audit Penalties (FQN / FQN*PE / FQN*VC)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["fare_rules_open"] = {
  meta: {
    id: "fare_rules_open",
    system: "AMADEUS",
    title: "Display Fare Rules & Penalties (FQN / *PE / *VC)",
    blurb: "Audit fare basis rules · FQN notes · *PE penalties & *VC voluntary changes",
    badge: "FARE RULES",
    badgeClass: "badge-blue",
    category: "Fare Rules"
  },

  caseMeta: {
    "PNR": "RUL902",
    "PASSENGER": "ANDERSSON/ERIK MR",
    "TICKET NO.": "117-4455667788",
    "ROUTE": "ARN → LHR → ARN",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Audit fare rules and penalties (FQN / FQN1*PE / FQN1*VC) to verify reissue fees and refund conditions."
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
    { type: "dim",  text: "CASE: FARE RULES AUDIT (FQN) & PENALTY VERIFICATION (*PE / *VC)" },
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
      task: "Retrieve booking record RUL902 for passenger ANDERSSON/ERIK MR.",
      hint: "Type <strong>RTRUL902</strong> or <strong>RT RUL902</strong>",
      inputMatch: {
        aliases: ["RTRUL902", "RT RUL902", "RT"],
        patterns: ["^RT\\s*RUL902$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  15OCT24/1015Z  RUL902" },
        { type: "ok",  text: "  1.ANDERSSON/ERIK MR" },
        { type: "ok",  text: "  2  SK 0525 T 12NOV 2 ARNLHR HK1  0750 0935  *1A/E*" },
        { type: "ok",  text: "  3  SK 0526 T 19NOV 2 LHRARN HK1  1025 1400  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 5051234 - A" },
        { type: "ok",  text: "  5 APE ERIK.ANDERSSON@CORP.SE" },
        { type: "ok",  text: "  6 TK OK15OCT/STOSG34AA//ETSK" },
        { type: "ok",  text: "  7 FA PAX 117-4455667788/ETSK/EUR420.00/15OCT/STOSG34AA/01234567/S2-3" },
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
        { type: "info", text: "TICKET RECORD DISPLAY — PNR RUL902" },
        { type: "ok",   text: "  7  47 FA PAX 117-4455667788/ETSK/EUR420.00/15OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD)",
      task: "Display electronic ticket coupons to inspect fare basis code and baggage allowance.",
      hint: "Type <strong>TWD</strong> or <strong>TWD/L7</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L7", "TWDL7", "TWD/T1", "TWD1", "TWD/TKT117-4455667788"]
      },
      terminalResponse: [
        { type: "info", text: "TWD" },
        { type: "ok",   text: "TICKET: 117-4455667788    NAME: ANDERSSON/ERIK MR" },
        { type: "ok",   text: "ISSUED: 15OCT24  STOSG34AA  FOP: CC AX XXXXXXXXXXXX0001" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS   BG" },
        { type: "ok",   text: "  1 SK   0525   T  12NOV  ARN LHR  O       12NOV TR1GB     1P" },
        { type: "ok",   text: "  2 SK   0526   T  19NOV  LHR ARN  O       19NOV TR1GB     1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 310.00   TAX: EUR 110.00   TOTAL: EUR 420.00" },
        { type: "ok",   text: "FARE BASIS: TR1GB | INCLUDED BAGGAGE: 1PC (23KG)" }
      ]
    },
    {
      id: "display_stored_fare",
      title: "Display Stored Fare Mask (TQT)",
      task: "Display the stored Transitional Stored Ticket (TST) with TQT to verify the fare quote line number.",
      hint: "Type <strong>TQT</strong> or <strong>TTH</strong>",
      inputMatch: {
        aliases: ["TQT", "TTH", "TQT/T1", "TTH/T1", "TQTT1"]
      },
      terminalResponse: [
        { type: "info", text: "TQT/T1" },
        { type: "ok",   text: "TST 01 TYPE P   PAX 1.1 ANDERSSON/ERIK MR" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" },
        { type: "ok",   text: "SK 0525  T  T 12NOV 0750  TR1GB                 12NOV  1P" },
        { type: "ok",   text: "SK 0526  T  T 19NOV 1025  TR1GB                 19NOV  1P" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 310.00   TAX: EUR 110.00   TOTAL: EUR 420.00" },
        { type: "ok",   text: "QUOTE LINE 01 STORED — READY FOR FARE RULES DISPLAY (FQN1)" }
      ]
    },
    {
      id: "open_fare_rules",
      title: "Open Fare Rules Menu (FQN1)",
      task: "Display the full fare rule category table for quote line 1 using FQN1.",
      hint: "Type <strong>FQN1</strong> (or <strong>FQN01</strong>)",
      inputMatch: {
        aliases: ["FQN1", "FQN01", "FQN", "FQQ01", "FQQ1"]
      },
      terminalResponse: [
        { type: "info", text: "FQN1" },
        { type: "ok",   text: "FARE BASIS: TR1GB           CARRIER: SK    ROUTE: ARN-LHR" },
        { type: "dim",  text: "RULE NUMBER: 7012           TARIFF: EUR1   PUBLISHED: 15OCT24" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "CAT 01  ELIGIBILITY" },
        { type: "ok",   text: "CAT 02  DAY/TIME RESTRICTIONS" },
        { type: "ok",   text: "CAT 03  SEASONALITY" },
        { type: "ok",   text: "CAT 04  FLIGHT APPLICATION" },
        { type: "ok",   text: "CAT 05  ADVANCE RESERVATIONS / TICKETING" },
        { type: "ok",   text: "CAT 08  STOPOVERS" },
        { type: "ok",   text: "CAT 14  TRAVEL RESTRICTIONS" },
        { type: "ok",   text: "CAT 15  SALES RESTRICTIONS" },
        { type: "warn", text: "CAT 16  PENALTIES                  (USE FQN1*PE)" },
        { type: "warn", text: "CAT 31  VOLUNTARY CHANGES          (USE FQN1*VC)" },
        { type: "ok",   text: "CAT 33  VOLUNTARY REFUNDS" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "USE FQN1*{CAT CODE} TO EXPAND SPECIFIC PARAGRAPH" }
      ]
    },
    {
      id: "check_penalties",
      title: "Check Penalties (FQN1*PE)",
      task: "Display Category 16 (Penalties) using FQN1*PE to check change fees and cancellation penalties.",
      hint: "Type <strong>FQN1*PE</strong>",
      inputMatch: {
        aliases: ["FQN1*PE", "FQN*PE", "FQN1PE", "FQN01*PE", "FQN1*16"]
      },
      terminalResponse: [
        { type: "info", text: "FQN1*PE" },
        { type: "ok",   text: "CATEGORY 16 - PENALTIES - FARE BASIS: TR1GB" },
        { type: "dim",  text: "ORIGINATING AREA: SCANDINAVIA TO EUROPE" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "CHANGES:" },
        { type: "ok",   text: "  BEFORE DEPARTURE OF FIRST FLIGHT:" },
        { type: "ok",   text: "    CHANGES PERMITTED FOR REISSUE / REVALIDATION." },
        { type: "warn", text: "    CHARGE EUR 70.00 FOR REISSUE OR REVALIDATION PER DIRECTION." },
        { type: "ok",   text: "    FARE DIFFERENCE APPLIES IF NEW FARE IS HIGHER." },
        { type: "ok",   text: "  AFTER DEPARTURE OF FIRST FLIGHT:" },
        { type: "warn", text: "    CHANGES PERMITTED: CHARGE EUR 70.00 PER DIRECTION." },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "CANCELLATIONS:" },
        { type: "warn", text: "  BEFORE DEPARTURE: CHARGE EUR 150.00 FOR REFUND." },
        { type: "warn", text: "  AFTER DEPARTURE: TICKET IS NON-REFUNDABLE." },
        { type: "warn", text: "NO-SHOW: CHANGES / REFUND NOT PERMITTED FOR NO-SHOW." }
      ]
    },
    {
      id: "check_voluntary_changes",
      title: "Check Voluntary Changes (FQN1*VC)",
      task: "Display Category 31 (Voluntary Changes) using FQN1*VC to inspect automated ATC reissue rules.",
      hint: "Type <strong>FQN1*VC</strong>",
      inputMatch: {
        aliases: ["FQN1*VC", "FQN*VC", "FQN1VC", "FQN01*VC", "FQN1*31"]
      },
      terminalResponse: [
        { type: "info", text: "FQN1*VC" },
        { type: "ok",   text: "CATEGORY 31 - VOLUNTARY CHANGES - FARE BASIS: TR1GB" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "ATC AUTOMATED REISSUE SUPPORTED." },
        { type: "ok",   text: "REPRICE USING ORIGINAL DATE OF ISSUE (DOI): 15OCT24." },
        { type: "ok",   text: "POINT OF ISSUE (POI): STO (OFFICE STOSG34AA)." },
        { type: "ok",   text: "NEW FARE MUST BE EQUAL OR HIGHER. DOWNGRADE NOT PERMITTED." },
        { type: "ok",   text: "CHANGE FEE EUR 70.00 PLUS ANY FARE/TAX DIFFERENCE COLLECTED AS ADD COLLECT." },
        { type: "ok",   text: "RESIDUAL FARE VALUE IS NON-REFUNDABLE." }
      ]
    }
  ],

  winMessage: {
    title: "Fare Rules Audit Complete ✓",
    text: "Fare rules drill finished! FQN displays Fare Quote Notes for a fare. The line number matches the quote or stored TST line (e.g. FQN1). Use paragraph codes to jump straight to critical sections: *PE for Category 16 (Penalties: change fee and refundability) and *VC for Category 31 (Voluntary Changes: ATC rules, DOI preservation, and reissue conditions). Always check *PE before quoting change fees to a passenger."
  }
};
