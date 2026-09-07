/**
 * Shared Amadeus Formatting Helpers for TrainingGDS
 * Generates realistic monospaced Amadeus cryptic PNR, ticket, and pricing displays.
 */
(function (global) {
  "use strict";

  const GDSFormat = {
    // RP header line: RP/STOSG34AA/STOSG34AA  AA/SU  07OCT24/1423Z  ABCXYZ
    rpHeader(office, pnr, agent = "AA/SU", datetime = "07OCT24/1423Z") {
      return `RP/${office}/${office}  ${agent}  ${datetime}  ${pnr}`;
    },

    // Passenger Name line: 1.LINDQVIST/ANNA MRS
    paxLine(names) {
      if (Array.isArray(names)) {
        return "  " + names.map((n, i) => `${i + 1}.${n}`).join("  ");
      }
      return `  1.${names}`;
    },

    // Air segment line with standard Amadeus columns:
    // "  2  AF 0442 V 07NOV 4 EZECDG HK1  2350 1545+1  *1A/E*"
    airSegment({ num, carrier, flight, bookingClass, date, dow = "3", board, off, status = "HK1", depTime, arrTime, fltType = "*1A/E*" }) {
      const fltPad = flight.toString().padStart(4, "0");
      const fltStr = `${carrier} ${fltPad}`;
      const segNum = num.toString().padStart(2, " ");
      return `  ${segNum}  ${fltStr} ${bookingClass} ${date} ${dow} ${board}${off} ${status.padEnd(4)}  ${depTime} ${arrTime.padEnd(7)}  ${fltType}`;
    },

    // Flown outbound segment line:
    flownSegment({ num, carrier, flight, bookingClass, date, dow = "1", board, off, depTime, arrTime, fltType = "*1A/E*" }) {
      const fltPad = flight.toString().padStart(4, "0");
      const fltStr = `${carrier} ${fltPad}`;
      const segNum = num.toString().padStart(2, " ");
      return `  ${segNum}  ${fltStr} ${bookingClass} ${date} ${dow} ${board}${off} FLOWN ${depTime} ${arrTime.padEnd(7)}  ${fltType}`;
    },

    // Agency contact line (AP, APE, APM)
    agencyContact(lineNum, city, phone) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} AP ${city} ${phone} - A`;
    },
    emailContact(lineNum, email) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} APE ${email}`;
    },
    mobileContact(lineNum, mobile) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} APM ${mobile}`;
    },

    // Ticketing lines (TK, FA, FB)
    tkLine(lineNum, date, office, carrier) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} TK OK${date}/${office}//ET${carrier}`;
    },
    faLine(lineNum, tkt, carrier, amount, date, office, segs, paxIndex) {
      const l = lineNum.toString().padStart(2, " ");
      const p = paxIndex ? `/P${paxIndex}` : "";
      return `  ${l} FA PAX ${tkt}/ET${carrier}/EUR${amount}/${date}/${office}/01234567/${segs}${p}`;
    },
    fbLine(lineNum) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} FB PAX 0010000001 TKT/T1`;
    },

    // Ghost MIS & Remarks lines
    misLine(lineNum, text) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} MIS 1A ${text}`;
    },
    rmLine(lineNum, text) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} RM ${text}`;
    },

    // SSR line
    ssrLine(lineNum, code, carrier, status, details) {
      const l = lineNum.toString().padStart(2, " ");
      return `  ${l} SSR ${code} ${carrier} ${status} ${details}`;
    },

    // Ticket details block (TWD)
    twd({ tkt, name, date, office, fop = "CC AX XXXXXXXXXXXX0001", fare = "842.00", tax = "210.00", total = "1052.00", coupons = [] }) {
      const lines = [
        { type: "info", text: "TWD" },
        { type: "ok",   text: `TICKET: ${tkt}    NAME: ${name}` },
        { type: "ok",   text: `ISSUED: ${date}  ${office}  FOP: ${fop}` },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "CPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS" }
      ];

      coupons.forEach((c) => {
        const cpnNum = c.cpn.toString().padStart(2, " ");
        const fltPad = c.flight.toString().padStart(4, "0");
        lines.push({
          type: c.status === "F" ? "dim" : "ok",
          text: ` ${cpnNum} ${c.carrier}   ${fltPad}   ${c.cls}  ${c.date}  ${c.board} ${c.off}  ${c.status}       ${c.nvb || c.date} ${c.fareBasis || "VR1SE"}`
        });
      });

      lines.push({ type: "dim", text: "------------------------------------------------------------" });
      lines.push({ type: "ok",  text: `FARE: EUR ${fare}   TAX: EUR ${tax}   TOTAL: EUR ${total}` });
      return lines;
    },

    // Cryptic ATC Reissue Pricing Mask (FXQ / FXO / FXP)
    fxq({ oldTkt, flts = [], base = "560.00", oldBase = "560.00", tax = "282.00", oldTax = "282.00", penalty = "50.00", totalAddColl = "50.00", cmd = "FXQ/S2,4/R,UP" }) {
      const lines = [
        { type: "info", text: cmd },
        { type: "ok",   text: "ATC REISSUE — GUARANTEED" },
        { type: "dim",  text: "LAST TKT DTE 07NOV24 - DATE OF ORIGIN" },
        { type: "dim",  text: "------------------------------------------------------------" },
        { type: "dim",  text: "AL FLGT  BK T DATE  TIME  FARE BASIS      NVB   NVA    BG" }
      ];

      flts.forEach(f => {
        const fltPad = f.flight.toString().padStart(4, "0");
        lines.push({
          type: "ok",
          text: `${f.carrier} ${fltPad}  ${f.cls}  ${f.cls} ${f.date} ${f.time}  ${(f.fareBasis || "VR1SE").padEnd(15)} ${f.nvb || "     "} ${(f.nva || f.date).padEnd(6)} 2P`
        });
      });

      lines.push({ type: "dim",  text: "------------------------------------------------------------" });
      lines.push({ type: "ok",   text: `OLD TICKET: ${oldTkt}` });
      lines.push({ type: "ok",   text: `BASE FARE ......... EUR   ${base.padStart(6)}      OLD FARE ... EUR   ${oldBase.padStart(6)}` });
      lines.push({ type: "ok",   text: `EQUIV FARE ........ EUR     0.00      DIFF ....... EUR     0.00` });
      lines.push({ type: "ok",   text: `TAXES ............. EUR   ${tax.padStart(6)}      OLD TAXES .. EUR   ${oldTax.padStart(6)}` });
      lines.push({ type: "ok",   text: `TAX BALANCE ....... EUR     0.00` });
      lines.push({ type: "ok",   text: `PENALTY ........... EUR   ${penalty.padStart(6)}` });
      lines.push({ type: "warn", text: `TOTAL ADD COLL .... EUR   ${totalAddColl.padStart(6)}` });
      lines.push({ type: "dim",  text: "------------------------------------------------------------" });
      lines.push({ type: "ok",   text: "TST 01 STORED — REISSUE MASK CREATED" });
      return lines;
    }
  };

  global.GDSFormat = GDSFormat;
})(typeof window !== "undefined" ? window : global);
