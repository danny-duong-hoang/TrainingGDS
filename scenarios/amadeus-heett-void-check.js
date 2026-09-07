/**
 * Scenario: Airline E-Ticket Policy Audit (HEETT) & Ticket Void
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["heett_void_check"] = {
  meta: {
    id: "heett_void_check",
    system: "AMADEUS",
    title: "E-Ticket Policy Audit (HEETT) & Void",
    blurb: "Verify carrier void authorization with HEETT before issuing TRDC",
    badge: "HEETT AUDIT",
    badgeClass: "badge-green",
    category: "Void & Sell"
  },

  caseMeta: {
    "PNR": "VOIDAF",
    "PASSENGER": "DUBOIS/JEAN MR",
    "TICKET NO.": "057-3322119988",
    "ROUTE": "CDG → NCE → CDG",
    "ISSUING OFFICE": "STOSG34AA",
    "TASK": "Audit Air France e-ticket table rules with HEETT AF then void ticket via TRDC."
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
    { type: "dim",  text: "CASE: CARRIER ET RULE CHECK (HEETT) & TRDC CANCELLATION" },
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
      task: "Retrieve booking record VOIDAF for passenger DUBOIS/JEAN MR.",
      hint: "Type <strong>RTVOIDAF</strong> or <strong>RT VOIDAF</strong>",
      inputMatch: {
        aliases: ["RTVOIDAF", "RT VOIDAF"],
        patterns: ["^RT\\s*VOIDAF$"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  22OCT24/0830Z  VOIDAF" },
        { type: "ok",  text: "  1.DUBOIS/JEAN MR" },
        { type: "ok",  text: "  2  AF 7700 Y 22NOV 5 CDGNCE HK1  0715 0845  *1A/E*" },
        { type: "ok",  text: "  3  AF 7709 Y 29NOV 5 NCECDG HK1  1830 2000  *1A/E*" },
        { type: "ok",  text: "  4 AP PAR +33 1 44123456 - A" },
        { type: "ok",  text: "  5 APE JEAN.DUBOIS@AIR.FR" },
        { type: "ok",  text: "  6 TK OK22OCT/STOSG34AA//ETAF" },
        { type: "ok",  text: "  7 FA PAX 057-3322119988/ETAF/EUR260.00/22OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",  text: "  8 FB PAX 0010000001 TKT/T1" },
        { type: "dim", text: "  9 MIS 1A CARRIER ET RULE CHECK IN PROGRESS" },
        { type: "info",text: "TICKET ISSUED TODAY — VERIFY VOID PERMISSION WITH HEETTAF" }
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
        { type: "info", text: "TICKET RECORD DISPLAY — PNR VOIDAF" },
        { type: "ok",   text: "  7  47 FA PAX 057-3322119988/ETAF/EUR260.00/22OCT/STOSG34AA/01234567/S2-3" },
        { type: "ok",   text: "  8     FB PAX 0010000001 TKT/T1" },
        { type: "dim",  text: "ACTIVE ELECTRONIC TICKET ASSOCIATED WITH COUPONS 1-2" }
      ]
    },
    {
      id: "check_heett",
      title: "Check E-Ticket Table (HEETTAF)",
      task: "Display the validating airline e-ticket rules table to verify void authorization.",
      hint: "Type <strong>HEETTAF</strong> or <strong>HEETT AF</strong>",
      inputMatch: {
        aliases: ["HEETTAF", "HEETT AF", "HEETT/AF"]
      },
      terminalResponse: [
        { type: "info", text: "HEETTAF" },
        { type: "ok",   text: "ELECTRONIC TICKETING TABLE — AIR FRANCE (057)" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "  INTERLINE ET AGREEMENT : YES" },
        { type: "warn", text: "  VOID PERMITTED         : Y (SAME DAY TILL 2359 LT)" },
        { type: "ok",   text: "  REISSUE AUTHORIZED     : YES" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "CARRIER RULES CONFIRM: TRDC SAME-DAY VOID AUTHORIZED" }
      ]
    },
    {
      id: "display_ticket",
      title: "Display Ticket (TWD/L6)",
      task: "Display coupon details for line 6 to verify all coupons are Open.",
      hint: "Type <strong>TWD/L6</strong>",
      inputMatch: {
        aliases: ["TWD", "TWD/L6", "TWDL6", "TWD/TKT057-3322119988"]
      },
      terminalResponse: [
        { type: "info", text: "TWD/L7" },
        { type: "ok",   text: "TICKET: 057-3322119988    NAME: DUBOIS/JEAN MR" },
        { type: "ok",   text: "ISSUED: 22OCT24  STOSG34AA  FOP: CC VI XXXXXXXXXXXX9988" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" },
        { type: "ok",   text: "  1 AF   7700   Y  22NOV  CDG NCE  O       22NOV YR1FR" },
        { type: "ok",   text: "  2 AF   7709   Y  29NOV  NCE CDG  O       29NOV YR1FR" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "ok",   text: "FARE: EUR 260.00   TAX: EUR 68.00   TOTAL: EUR 328.00" },
        { type: "warn", text: "ALL COUPONS OPEN — ELIGIBLE FOR SAME-DAY TRDC VOID" }
      ]
    },
    {
      id: "void_ticket",
      title: "Void Ticket (TRDC/L6)",
      task: "Void the ticket on line 6.",
      hint: "Type <strong>TRDC/L6</strong> or <strong>TRDC/ALL</strong>",
      inputMatch: {
        aliases: ["TRDC/L6", "TRDC/ALL", "TRDCL6", "TRDC"]
      },
      terminalResponse: [
        { type: "info", text: "TRDC/L7" },
        { type: "err",  text: "REPORTING RECORD: CANCELLED" },
        { type: "warn", text: "TICKET 057-3322119988 VOID SUCCESSFUL" },
        { type: "ok",   text: "BSP BILLING SUSPENDED — STATUS: VOID" }
      ]
    },
    {
      id: "save_pnr",
      title: "Save Booking (ER)",
      task: "End transaction and retrieve booking to commit cancellation.",
      hint: "Type <strong>ER</strong>",
      inputMatch: {
        aliases: ["ER"]
      },
      terminalResponse: [
        { type: "ok",  text: "RP/STOSG34AA/STOSG34AA  AA/SU  22OCT24/0845Z  VOIDAF" },
        { type: "ok",  text: "  1.DUBOIS/JEAN MR" },
        { type: "ok",  text: "  2  AF 7700 Y 22NOV 5 CDGNCE HK1  0715 0845  *1A/E*" },
        { type: "ok",  text: "  3  AF 7709 Y 29NOV 5 NCECDG HK1  1830 2000  *1A/E*" },
        { type: "ok",  text: "  4 AP PAR +33 1 44123456 - A" },
        { type: "ok",  text: "  5 TK OK22OCT/STOSG34AA" },
        { type: "warn",text: "  6 FA PAX 057-3322119988/ETAF/EUR260.00/22OCT/STOSG34AA/VOID" },
        { type: "dim", text: "  7 MIS 1A TICKET CANCELLED VIA TRDC" },
        { type: "ok",  text: "PNR VOIDAF UPDATED — VOID PROCESS COMPLETED" }
      ]
    }
  ],

  winMessage: {
    title: "Scenario Complete ✓",
    text: "E-Ticket audit complete. Remember: HEETT displays the validating carrier's global electronic ticketing policy table (such as whether VOID is permitted on the carrier), which is distinct from your agency's BSP reporting window."
  }
};
