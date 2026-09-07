/**
 * Scenario: Tax-Only Refund on Non-Refundable Ticket (TRF/TAX & TRFIG)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["refund_trf_tax"] = {
  meta: {
    id: "refund_trf_tax",
    system: "AMADEUS",
    title: "Tax-Only Refund (TRF/TAX)",
    blurb: "Non-refundable ticket · Calculate unspent government taxes · TRFIG abort",
    badge: "TAX REFUND",
    badgeClass: "badge-orange",
    category: "Refund"
  },

  caseMeta: {
    "PNR": "NONREF",
    "PASSENGER": "GARCIA/CARLOS MR",
    "TICKET NO.": "074-9876543210",
    "ROUTE": "MAD → LIS → MAD",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Customer cancelled non-refundable booking. Inspect unspent tax refund breakdown with TRF.../TAX and abort with TRFIG."
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
    { type: "dim",  text: "CASE: NON-REFUNDABLE TICKET / TAX-ONLY REFUND CALCULATION" },
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
      task: "Retrieve booking record NONREF for passenger GARCIA/CARLOS MR.",
      hint: "Type <strong>RTNONREF</strong> or <strong>RT NONREF</strong>",
      inputMatch: {
        aliases: ["RTNONREF", "RT NONREF"],
        patterns: ["^RT\\s*NONREF$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  02NOV24/1115Z  NONREF" },
        { type: "ok",  text: "  1.GARCIA/CARLOS MR" },
        { type: "ok",  text: "  2  IB 3100 N 05JAN 7 MADLIS HK1  0855 0915  *1A/E*" },
        { type: "ok",  text: "  3  IB 3105 N 10JAN 5 LISMAD HK1  1730 1950  *1A/E*" },
        { type: "ok",  text: "  4 AP MAD +34 91 123456 - A" },
        { type: "ok",  text: "  5 APE CARLOS.GARCIA@CORP.ES" },
        { type: "ok",  text: "  6 TK OK02NOV/STOSG34AA//ETIB" },
        { type: "ok",  text: "  7 FA PAX 074-9876543210/ETIB/EUR180.00/02NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "warn",text: "NOTE: NON-REFUNDABLE BASE FARE PER CAT 16 RULES" }
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
        { type: "info", text: "TICKET RECORD DISPLAY — PNR NONREF" },
        { type: "ok",   text: "  7  47 FA PAX 074-9876543210/ETIB/EUR180.00/02NOV/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "open_trf_tax",
      title: "Open Tax-Only Refund (TRF.../TAX)",
      task: "Open tax-only refund mask for ticket 074-9876543210.",
      hint: "Type <strong>TRF074-9876543210/TAX</strong> or <strong>TRF/TAX</strong>",
      inputMatch: {
        aliases: [
          "TRF074-9876543210/TAX",
          "TRF 074-9876543210/TAX",
          "TRF/TAX",
          "TRF/L6/TAX",
          "TRFL6/TAX",
          "TRF0749876543210/TAX"
        ]
      },
      terminalResponse: [
        { type: "info", text: "TRF074-9876543210/TAX" },
        { type: "ok",   text: "TRF TAX-ONLY REFUND RECORD — TICKET 074-9876543210" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "BASE FARE REFUND ... EUR     0.00  (NON-REFUNDABLE CAT 16)" },
        { type: "ok",   text: "UNSPENT TAXES ELIGIBLE FOR REFUND:" },
        { type: "ok",   text: "  QV (AIRPORT NOISE) ... EUR   12.40" },
        { type: "ok",   text: "  JD (SECURITY CHARGE) . EUR    9.60" },
        { type: "dim",  text: "  YQ/YR (CARRIER SUR) .. EUR    0.00  (SURCHARGE NON-REFUNDABLE)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "warn", text: "TOTAL TAX REFUND ....... EUR   22.00  (FORM OF PAYMENT: CC)" },
        { type: "info", text: "AUDIT MASK OPEN — USE TRFIG TO DISCARD SAFELY IN TRAINING" }
      ]
    },
    {
      id: "ignore_refund",
      title: "Ignore Refund Mask (TRFIG)",
      task: "Abort and discard the tax-only refund mask without transmitting transaction.",
      hint: "Type <strong>TRFIG</strong>",
      inputMatch: {
        aliases: ["TRFIG", "TRF IG", "TRF/IG"]
      },
      terminalResponse: [
        { type: "info", text: "TRFIG" },
        { type: "warn", text: "REFUND TRANSACTION IGNORED (TRFIG)" },
        { type: "ok",   text: "NO BSP REFUND REPORT GENERATED — TICKET UNTOUCHED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Tax-only refund drill complete! When base fares are non-refundable, TRF{ticket}/TAX provides an automated breakdown of unspent airport and government taxes. Always verify fare rules and airline policy outside GDS before processing TRFP."
  }
};
