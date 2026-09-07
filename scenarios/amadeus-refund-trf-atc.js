/**
 * Scenario: Automated ATC Refund Calculation & Safe Abort (TRF/ATC & TRFIG)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["refund_trf_atc"] = {
  meta: {
    id: "refund_trf_atc",
    system: "AMADEUS",
    title: "Automated Refund (TRF/ATC)",
    blurb: "Automated refund mask calculation · Audit fare/tax refund · TRFIG abort",
    badge: "ATC REFUND",
    badgeClass: "badge-orange",
    category: "Refund"
  },

  caseMeta: {
    "PNR": "REF001",
    "PASSENGER": "MUELLER/HANS MR",
    "TICKET NO.": "074-1234567890",
    "ROUTE": "FRA → JFK → FRA",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Open automated ATC refund mask to audit cancellation penalty and taxes, then abort with TRFIG."
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
    { type: "dim",  text: "CASE: AUTOMATED REFUND AUDIT (TRF/ATC) & SAFE ABORT (TRFIG)" },
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
      task: "Retrieve booking record REF001 for passenger MUELLER/HANS MR.",
      hint: "Type <strong>RTREF001</strong> or <strong>RT REF001</strong>",
      inputMatch: {
        aliases: ["RTREF001", "RT REF001"],
        patterns: ["^RT\\s*REF001$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  28OCT24/1620Z  REF001" },
        { type: "ok",  text: "  1.MUELLER/HANS MR" },
        { type: "ok",  text: "  2  LH 0400 Y 20DEC 5 FRAJFK HK1  1040 1345  *1A/E*" },
        { type: "ok",  text: "  3  LH 0401 Y 27DEC 5 JFKFRA HK1  1615 0540+1  *1A/E*" },
        { type: "ok",  text: "  4 AP FRA +49 69 778899 - A" },
        { type: "ok",  text: "  5 APE HANS.MUELLER@BIZ.DE" },
        { type: "ok",  text: "  6 TK OK28OCT/STOSG34AA//ETLH" },
        { type: "ok",  text: "  7 FA PAX 074-1234567890/ETLH/EUR680.00/28OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A REFUND AUDIT REQUESTED BY PASSENGER" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Ticket List (RTTN)",
      task: "Display the ticket list to verify active FA line for refund calculation.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET RECORD DISPLAY — PNR REF001" },
        { type: "ok",   text: "  7  47 FA PAX 074-1234567890/ETLH/EUR680.00/28OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "open_trf_atc",
      title: "Open ATC Refund Mask (TRF.../ATC)",
      task: "Open automated ATC refund record for ticket 074-1234567890.",
      hint: "Type <strong>TRF074-1234567890/ATC</strong> or <strong>TRF/ATC</strong>",
      inputMatch: {
        aliases: [
          "TRF074-1234567890/ATC",
          "TRF 074-1234567890/ATC",
          "TRF/ATC",
          "TRF/L6/ATC",
          "TRFL6/ATC",
          "TRF0741234567890/ATC"
        ]
      },
      terminalResponse: [
        { type: "info", text: "TRF074-1234567890/ATC" },
        { type: "ok",   text: "ATC AUTOMATED REFUND RECORD — TICKET 074-1234567890" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "CPN A/L  FLT   CLS DATE   BRD OFF ST FARE USED   TAX USED" },
        { type: "ok",   text: "  1 LH   0400   Y  20DEC  FRA JFK  O      0.00       0.00" },
        { type: "ok",   text: "  2 LH   0401   Y  27DEC  JFK FRA  O      0.00       0.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE PAID ........ EUR   520.00      FARE USED ... EUR     0.00" },
        { type: "ok",   text: "REFUND FARE ...... EUR   520.00" },
        { type: "ok",   text: "TAX REFUNDABLE ... EUR   160.00" },
        { type: "warn", text: "CANCELLATION PEN . EUR   150.00  (CAT 16 PENALTY DEDUCTED)" },
        { type: "warn", text: "NET REFUND AMT ... EUR   530.00  (FORM OF PAYMENT: CC)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "info", text: "REFUND MASK OPEN — USE TRFIG TO DISCARD SAFELY IN TRAINING" }
      ]
    },
    {
      id: "ignore_refund",
      title: "Ignore Refund Mask (TRFIG)",
      task: "Abort and discard the refund mask without transmitting payment transaction.",
      hint: "Type <strong>TRFIG</strong>",
      inputMatch: {
        aliases: ["TRFIG", "TRF IG", "TRF/IG"]
      },
      terminalResponse: [
        { type: "info", text: "TRFIG" },
        { type: "warn", text: "REFUND TRANSACTION IGNORED (TRFIG)" },
        { type: "ok",   text: "NO REFUND RECORD TRANSMITTED — TICKET STATUS UNCHANGED (OPEN)" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Automated refund drill complete! TRF opens the electronic refund record and /ATC instructs Amadeus to calculate rule penalties and refundable taxes automatically. In live ticketing, TRFP commits the payment refund; TRFIG safely ignores and aborts the mask before processing. For safety training, we stop at TRFIG without committing TRFP."
  }
};
