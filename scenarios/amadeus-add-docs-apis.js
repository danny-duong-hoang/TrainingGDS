/**
 * Scenario: APIS Data & Contact Elements (SR DOCS, SR CTCE, SR CTCM)
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["add_docs_apis"] = {
  meta: {
    id: "add_docs_apis",
    system: "AMADEUS",
    title: "APIS & Passenger Data (SRDOCS)",
    blurb: "Mandatory passport SRDOCS · Email CTCE · Mobile CTCM",
    badge: "APIS / DOCS",
    badgeClass: "badge-orange",
    category: "APIS / DOCS"
  },

  caseMeta: {
    "PNR": "DOC789",
    "PASSENGER": "ROSSI/MARCO MR",
    "TICKET NO.": "074-6677889900",
    "ROUTE": "FCO → JFK",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Add mandatory international APIS passport info and emergency contact."
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
    { type: "dim",  text: "CASE: ADVANCE PASSENGER INFORMATION SYSTEM (APIS)" },
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
      task: "Retrieve booking record DOC789 for passenger ROSSI/MARCO MR.",
      hint: "Type <strong>RTDOC789</strong> or <strong>RT DOC789</strong>",
      inputMatch: {
        aliases: ["RTDOC789", "RT DOC789"],
        patterns: ["^RT\\s*DOC789$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  12DEC24/0915Z  DOC789" },
        { type: "ok",  text: "  1.ROSSI/MARCO MR" },
        { type: "ok",  text: "  2  AZ 0610 Y 20DEC 5 FCOJFK HK1  1010 1420  *1A/E*" },
        { type: "ok",  text: "  4 AP ROM +39 06 65951 - A" },
        { type: "ok",  text: "  5 TK OK12DEC/STOSG34AA//ETAZ" },
        { type: "ok",  text: "  6 FA PAX 074-6677889900/ETAZ/EUR780.00/12DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "  7 FB PAX 0010000001 TKT/T1" },
        { type: "warn",text: "WARNING: TRANSATLANTIC FLIGHT REQUIRES APIS PASSPORT & CONTACT DATA" }
      ]
    },
    {
      id: "add_passport",
      title: "Enter Passport Data (SRDOCS)",
      task: "Add passport details for passenger 1: Passport ITA A12345678, Nationality ITA, DOB 12JUL85, Male, Expiry 22OCT30, Surname ROSSI, First MARCO.",
      hint: "Type <strong>SRDOCS AZ HK1-P-ITA-A12345678-ITA-12JUL85-M-22OCT30-ROSSI-MARCO/P1</strong>",
      inputMatch: {
        aliases: [
          "SRDOCS AZ HK1-P-ITA-A12345678-ITA-12JUL85-M-22OCT30-ROSSI-MARCO/P1",
          "SRDOCSAZHK1-P-ITA-A12345678-ITA-12JUL85-M-22OCT30-ROSSI-MARCO/P1",
          "SRDOCS AZ HK1-P-ITA-A12345678-ITA-12JUL85-M-22OCT30-ROSSI-MARCO",
          "SR DOCS AZ HK1-P-ITA-A12345678-ITA-12JUL85-M-22OCT30-ROSSI-MARCO/P1",
          "SR DOCS AZ HK1-P-ITA-A12345678-ITA-12JUL85-M-22OCT30-ROSSI-MARCO"
        ]
      },
      terminalResponse: [
        { type: "ok", text: "  8 SSR DOCS AZ HK1 P/ITA/A12345678/ITA/12JUL85/M/22OCT30/ROSSI/MARCO/P1/S2" },
        { type: "ok", text: "APIS PASSPORT DETAILS VERIFIED AND STORED" }
      ]
    },
    {
      id: "add_email",
      title: "Add Contact Email (SRCTCE)",
      task: "Add contact email marco.rossi@email.com (use double slash // to substitute @).",
      hint: "Type <strong>SRCTCE-MARCO.ROSSI//EMAIL.COM/P1</strong> or <strong>SRCTCE AZ HK1-MARCO.ROSSI//EMAIL.COM/P1</strong>",
      inputMatch: {
        aliases: [
          "SRCTCE-MARCO.ROSSI//EMAIL.COM/P1",
          "SRCTCE AZ HK1-MARCO.ROSSI//EMAIL.COM/P1",
          "SRCTCEAZHK1-MARCO.ROSSI//EMAIL.COM/P1",
          "SRCTCE-MARCO.ROSSI//EMAIL.COM",
          "SR CTCE AZ HK1-MARCO.ROSSI//EMAIL.COM/P1",
          "SR CTCE-MARCO.ROSSI//EMAIL.COM/P1",
          "SRCTCE AZ HK1-MARCO.ROSSI@EMAIL.COM/P1"
        ]
      },
      terminalResponse: [
        { type: "ok", text: "  9 SSR CTCE AZ HK1 MARCO.ROSSI//EMAIL.COM/P1" },
        { type: "ok", text: "PASSENGER NOTIFICATION EMAIL SAVED" }
      ]
    },
    {
      id: "add_mobile",
      title: "Add Contact Mobile (SRCTCM)",
      task: "Add passenger mobile contact with country code +39 3331234567.",
      hint: "Type <strong>SRCTCM-393331234567/P1</strong> or <strong>SRCTCM AZ HK1-393331234567/P1</strong>",
      inputMatch: {
        aliases: [
          "SRCTCM-393331234567/P1",
          "SRCTCM AZ HK1-393331234567/P1",
          "SRCTCMAZHK1-393331234567/P1",
          "SRCTCM-393331234567",
          "SR CTCM AZ HK1-393331234567/P1",
          "SR CTCM-393331234567/P1",
          "SRCTCM AZ HK1-+393331234567/P1"
        ]
      },
      terminalResponse: [
        { type: "ok", text: " 10 SSR CTCM AZ HK1 393331234567/P1" },
        { type: "ok", text: "PASSENGER MOBILE CONTACT STORED" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit APIS elements.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  12DEC24/0920Z  DOC789" },
        { type: "ok",  text: "  1.ROSSI/MARCO MR" },
        { type: "ok",  text: "  2  AZ 0610 Y 20DEC 5 FCOJFK HK1  1010 1420  *1A/E*" },
        { type: "ok",  text: "  3 SSR DOCS AZ HK1 P/ITA/A12345678/ITA/12JUL85/M/22OCT30/ROSSI/MARCO/P1/S2" },
        { type: "ok",  text: "  4 SSR CTCE AZ HK1 MARCO.ROSSI//EMAIL.COM/P1" },
        { type: "ok",  text: "  5 SSR CTCM AZ HK1 393331234567/P1" },
        { type: "ok",  text: "  6 AP ROM +39 06 65951 - A" },
        { type: "ok",  text: "  7 TK OK12DEC/STOSG34AA//ETAZ" },
        { type: "ok",  text: "  8 FA PAX 074-6677889900/ETAZ/EUR780.00/12DEC/STOSG34AA/01234567/S2" },
        { type: "ok",  text: "PNR DOC789 UPDATED — APIS COMPLIANCE SATISFIED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "APIS drill complete. Key entries: SRDOCS (Passport info following ICAO format) → SRCTCE (Email using // for @) → SRCTCM (Mobile phone with country code) → ER."
  }
};
