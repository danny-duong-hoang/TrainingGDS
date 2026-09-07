/**
 * Scenario: Add Baggage Ancillary (SSR XBAG)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["add_baggage_ssr"] = {
  meta: {
    id: "add_baggage_ssr",
    system: "AMADEUS",
    title: "Add Baggage SSR (XBAG)",
    blurb: "Inspect catalogue with FXK · Book SSR XBAG · Verify RTG status",
    badge: "ANCILLARY",
    badgeClass: "badge-blue",
    category: "Ancillaries"
  },

  caseMeta: {
    "PNR": "BAG123",
    "PASSENGER": "ALVAREZ/MARIA MS",
    "TICKET NO.": "074-4433221100",
    "ROUTE": "MAD → CDG",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Customer requests 1 extra prepaid checked baggage (23kg)."
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
    { type: "dim",  text: "CASE: ANCILLARY SERVICE / PREPAID BAGGAGE (XBAG)" },
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
      task: "Retrieve booking record BAG123 for passenger ALVAREZ/MARIA MS.",
      hint: "Type <strong>RTBAG123</strong> or <strong>RT BAG123</strong>",
      inputMatch: {
        aliases: ["RTBAG123", "RT BAG123"],
        patterns: ["^RT\\s*BAG123$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  11DEC24/1420Z  BAG123" },
        { type: "ok",  text: "  1.ALVAREZ/MARIA MS" },
        { type: "ok",  text: "  2  AF 1401 Y 15NOV 5 MADCDG HK1  1015 1230  *1A/E*" },
        { type: "ok",  text: "  4 AP MAD +34 91 556677 - A" },
        { type: "ok",  text: "  5 APE MARIA.ALVAREZ@CORP.ES" },
        { type: "ok",  text: "  6 TK OK11DEC/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 074-4433221100/ETAF/EUR210.00/11DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A PREPAID BAGGAGE INQUIRY" }
      ]
    },
    {
      id: "open_catalog",
      title: "Check Catalogue (FXK)",
      task: "Open the ancillary catalogue with FXK to check baggage pricing.",
      hint: "Type <strong>FXK</strong> or <strong>FXH/ALL</strong>",
      inputMatch: {
        aliases: ["FXK", "FXH/ALL", "FXH"]
      },
      terminalResponse: [
        { type: "info", text: "FXK" },
        { type: "ok",   text: "ANCILLARY SERVICES CATALOGUE (AF) — SEG 2 MADCDG:" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "  01  XBAG  1ST ADDITIONAL BAG 23KG   EUR 30.00" },
        { type: "ok",   text: "  02  SEAT  ADVANCE SEAT ASSIGNMENT   EUR 15.00" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "PRICING GUARANTEED PER AIRLINE EMD RULE" }
      ]
    },
    {
      id: "book_baggage",
      title: "Request Baggage SSR (SR XBAG)",
      task: "Book 1 piece of extra baggage via Special Service Request. (Note: XBAG is used here as a practice SSR code; real carrier codes and formats may differ).",
      hint: "Type <strong>SR XBAG</strong>",
      inputMatch: {
        aliases: ["SR XBAG", "SRXBAG", "SR XBAG/P1/S2", "SR XBAG-1", "SR XBAG/P1"]
      },
      terminalResponse: [
        { type: "ok",   text: "  4 SSR XBAG AF NN1 MADCDG/P1/S2" },
        { type: "info", text: "CHARGEABLE SERVICE REQUEST SENT TO AIRLINE (AF)" }
      ]
    },
    {
      id: "verify_ssr",
      title: "Verify SSR Status (RTG)",
      task: "Display Special Service Requests to verify the carrier confirmed status HK.",
      hint: "Type <strong>RTG</strong>",
      inputMatch: {
        aliases: ["RTG"]
      },
      terminalResponse: [
        { type: "info", text: "RTG" },
        { type: "ok",   text: "  4 SSR XBAG AF HK1 MADCDG 23KG /P1/S2" },
        { type: "warn", text: "STATUS: HK (CONFIRMED BY CARRIER) — READY FOR EMD-A" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit the ancillary request.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  11DEC24/1425Z  BAG123" },
        { type: "ok",  text: "  1.ALVAREZ/MARIA MS" },
        { type: "ok",  text: "  2  AF 1401 Y 15NOV 5 MADCDG HK1  1015 1230  *1A/E*" },
        { type: "ok",  text: "  3 SSR XBAG AF HK1 MADCDG 23KG /P1/S2" },
        { type: "ok",  text: "  4 AP MAD +34 91 556677 - A" },
        { type: "ok",  text: "  5 TK OK11DEC/STOSG34AA//ETAF" },
        { type: "ok",  text: "  6 FA PAX 074-4433221100/ETAF/EUR210.00/11DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "PNR BAG123 UPDATED — ISSUE EMD-A ON FLOOR TO COLLECT FEE" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "Ancillary baggage drill complete. Sequence: RT → FXK (catalogue inspection) → SR XBAG (book service) → RTG (verify airline HK status) → ER. (Note: XBAG is a practice SSR code; real carriers may differ)."
  }
};
