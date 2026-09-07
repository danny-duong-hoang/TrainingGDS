/**
 * Scenario Template for TrainingGDS
 * Copy this file to create a new scenario (e.g. scenarios/amadeus-partial-used.js).
 * Then register it in index.html by adding a <script src="scenarios/your-file.js"></script> tag.
 */
window.GDS_SCENARIOS = window.GDS_SCENARIOS || {};

window.GDS_SCENARIOS["example_scenario_id"] = {
  // 1. METADATA
  meta: {
    id: "example_scenario_id",        // Unique identifier (lowercase, letters/underscores/hyphens)
    system: "AMADEUS",                // Target GDS ("AMADEUS", later "SABRE")
    title: "C · Scenario Title",       // Display title in scenario picker
    blurb: "Short 1-line description", // Summary description in picker
    badge: "DRILL TYPE",              // Badge text (e.g. "PARTIAL REISSUE", "REFUND")
    badgeClass: "badge-blue",         // Style: badge-blue, badge-orange, badge-green, badge-dark
    category: "Rebook"                // Category: Rebook, Void & Sell, Refund, Split PNR, Name / Passenger, Ancillaries, APIS / DOCS, Retrieve Toolkit
  },

  // 2. CASE BRIEFING (Shown in the top summary bar)
  caseMeta: {
    "PNR": "EXAMPLE",
    "PASSENGER": "SMITH/JOHN MR",
    "TICKET NO.": "176-1234567890",
    "ROUTE": "LHR → JFK → LHR",
    "ISSUING OFFICE": "LONBA2100",
    "TASK": "Rebook inbound flight"
  },

  // 3. OFFICE / PCC CONFIGURATION
  officeConfig: {
    startOffice: "LONBA2000",         // Starting office code
    targetOffice: "LONBA2100",        // Target office code where work must occur
    offices: [
      { id: "LONBA2000", label: "LONBA2000 (DEFAULT)" },
      { id: "LONBA2100", label: "LONBA2100 (ISSUING OFFICE)" }
    ]
  },

  // 4. TERMINAL BOOT LINES (Shown when scenario is loaded)
  bootLines: [
    { type: "info", text: "AMADEUS SELLING PLATFORM CONNECT — LONBA2000" },
    { type: "dim",  text: "OFFICE: LONBA2000 | AGENT: TRAINING" },
    { type: "dim",  text: "────────────────────────────────────────" },
    { type: "ok",   text: "READY" }
  ],

  // 5. STEP-BY-STEP WORKFLOW
  steps: [
    // Example A: Office change via Active Office dropdown (Amadeus SPC pattern)
    {
      id: "change_office",
      title: "Change Office ID",
      task: "Switch to issuing office LONBA2100 using the Active Office dropdown.",
      hint: "Open <strong>Active Office</strong> and select <strong>LONBA2100 (ISSUING OFFICE)</strong>.",
      inputMatch: {
        type: "office_dropdown",
        targetOffice: "LONBA2100",
        aliases: []
      },
      stateUpdates: {
        office: "LONBA2100"
      },
      terminalResponse: [
        { type: "ok",  text: "SIGN IN TO OFFICE: LONBA2100" },
        { type: "ok",  text: "OFFICE ID  : LONBA2100" },
        { type: "ok",  text: "STATUS     : SIGNED IN" },
        { type: "dim", text: "" },
        { type: "ok",  text: "Office ID changed to LONBA2100" }
      ]
    },

    // Example B: Standard command step with alias matching
    {
      id: "retrieve_pnr",
      title: "Retrieve PNR",
      task: "Retrieve booking record for passenger.",
      hint: "Type <strong>RT EXAMPLE</strong>",
      inputMatch: {
        aliases: [
          "RTEXAMPLE",
          "RT EXAMPLE"
        ]
      },
      terminalResponse: [
        { type: "ok", text: "RP/LONBA2100  EXAMPLE" },
        { type: "ok", text: "  1. SMITH/JOHN MR" },
        { type: "ok", text: "PNR EXAMPLE retrieved" }
      ]
    }
  ],

  // 6. WIN SUMMARY (Shown upon completing the final step)
  winMessage: {
    title: "Scenario Complete ✓",
    text: "Summary of workflow rules and key takeaways for the learner."
  }
};
