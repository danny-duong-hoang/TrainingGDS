/**
 * Scenario: Display Electronic Miscellaneous Document (EMD) & TSM Mask
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["emd_view"] = {
  meta: {
    id: "emd_view",
    system: "AMADEUS",
    title: "Display EMD Ancillary (EWD/TQM)",
    blurb: "Inspect Electronic Miscellaneous Document · EWD for coupon · TQM for mask",
    badge: "EMD INSPECT",
    badgeClass: "badge-blue",
    category: "Ancillaries"
  },

  caseMeta: {
    "PNR": "EMD001",
    "PASSENGER": "ANDERSSON/EVA MS",
    "TICKET NO.": "074-4455667788",
    "EMD NO.": "074-1823456789",
    "ROUTE": "ARN → LHR",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Inspect paid baggage EMD coupon with EWD and audit stored TSM details with TQM."
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
    { type: "dim",  text: "CASE: ANCILLARY AUDIT / EMD (EWD) & TSM (TQM) DISPLAY" },
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
      task: "Retrieve booking record EMD001 for passenger ANDERSSON/EVA MS.",
      hint: "Type <strong>RTEMD001</strong> or <strong>RT EMD001</strong>",
      inputMatch: {
        aliases: ["RTEMD001", "RT EMD001"],
        patterns: ["^RT\\s*EMD001$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  25OCT24/1410Z  EMD001" },
        { type: "ok",  text: "  1.ANDERSSON/EVA MS" },
        { type: "ok",  text: "  2  BA 0777 Y 15NOV 5 ARNLHR HK1  0705 0850  *1A/E*" },
        { type: "ok",  text: "  4 AP STO +46 8 889900 - A" },
        { type: "ok",  text: "  5 APE EVA.ANDERSSON@CORP.SE" },
        { type: "ok",  text: "  6 TK OK25OCT/STOSG34AA//ETBA" },
        { type: "ok",  text: "  7 FA PAX 074-4455667788/ETBA/EUR220.00/25OCT/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FA PAX 074-1823456789/EMD-A/EUR45.00/25OCT/STOSG34AA/BAGP/S2" },
        { type: "ok",  text: "  9 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: " 10 MIS 1A PREPAID BAGGAGE ANCILLARY ASSOCIATED" }
      ]
    },
    {
      id: "ticket_list",
      title: "Open Document List (RTTN)",
      task: "Display document list to verify e-ticket and EMD lines.",
      hint: "Type <strong>RTTN</strong>",
      inputMatch: {
        aliases: ["RTTN"]
      },
      terminalResponse: [
        { type: "info", text: "TICKET & EMD RECORD DISPLAY — PNR EMD001" },
        { type: "ok",   text: "  7  47 FA PAX 074-4455667788/ETBA/EUR220.00/25OCT/STOSG34AA/01234567/S2" },
        { type: "ok",   text: "  8  85 FA PAX 074-1823456789/EMD-A/EUR45.00/25OCT/STOSG34AA/BAGP/S2" },
        { type: "dim",  text: "ACTIVE DOCUMENTS: ETKT ON LINE 7 / EMD-A ON LINE 8" }
      ]
    },
    {
      id: "display_emd",
      title: "Display EMD Coupon (EWD)",
      task: "Display the Electronic Miscellaneous Document on line 7.",
      hint: "Type <strong>EWD/L7</strong> or <strong>EWD/EMD074-1823456789</strong>",
      inputMatch: {
        aliases: [
          "EWD/L7",
          "EWDL7",
          "EWD/L8",
          "EWDL8",
          "EWD/L85",
          "EWDL85",
          "EWD/EMD074-1823456789",
          "EWD"
        ]
      },
      terminalResponse: [
        { type: "info", text: "EWD/EMD074-1823456789" },
        { type: "ok",   text: "EMD 074-1823456789    NAME: ANDERSSON/EVA MS" },
        { type: "ok",   text: "ISSUED: 25OCT24  STOSG34AA  FOP: CC AX XXXXXXXXXXXX4488" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF SERVICE             ST AMT" },
        { type: "ok",   text: "  1 BA   0777   Y  15NOV  ARN LHR 0GO/1ST ADD BAG 23K O  45.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "BASE FARE: EUR 45.00   TAX: EUR 0.00   TOTAL: EUR 45.00" },
        { type: "dim",  text: "ASSOCIATED TICKET: 074-4455667788 COUPON 1" }
      ]
    },
    {
      id: "display_tsm",
      title: "Audit TSM Mask (TQM)",
      task: "Display the Transitional Stored Miscellaneous (TSM) mask to inspect ancillary pricing details.",
      hint: "Type <strong>TQM</strong> or <strong>TQM/M1</strong>",
      inputMatch: {
        aliases: ["TQM", "TQM/M1", "TQMM1", "TQM/M01"]
      },
      terminalResponse: [
        { type: "info", text: "TQM/M1" },
        { type: "ok",   text: "TSM 01 TYPE P   PAX 1.1 ANDERSSON/EVA MS" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "RFIC: C (BAGGAGE)      RFISC: 0GO (1ST ADDITIONAL BAG)" },
        { type: "ok",   text: "BASE AMT: EUR 45.00    TOTAL AMT: EUR 45.00" },
        { type: "ok",   text: "PRESENT VALUE: EUR 45.00   COUPON: 1 S2" },
        { type: "warn", text: "STATUS: ISSUED / COUPON 1 CLOSED FOR SALE" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "EMD inspection complete! EMD (Electronic Miscellaneous Document) is the IATA standard for paid airline ancillaries (such as extra baggage, seats, or lounge access). Use EWD to open and view the active EMD coupon, and TQM to audit the underlying TSM mask details."
  }
};
