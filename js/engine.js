/**
 * GDS Training Simulator Engine
 * Handles normalization, command matching, state transitions, and terminal output.
 */
(function (global) {
  "use strict";

  function normalize(input) {
    return String(input || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ",")
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s*\*\s*/g, "*");
  }

  function stripAllSpaces(input) {
    return normalize(input).replace(/\s+/g, "");
  }

  class SimulatorEngine {
    constructor(callbacks) {
      this.callbacks = callbacks || {};
      this.scenario = null;
      this.stepIndex = 0;
      this.office = "";
      this.hintShown = false;
      this.isDone = false;

      // Command History
      this.history = [];
      this.historyIndex = -1;
    }

    loadScenario(scenario) {
      if (!scenario) return;
      this.scenario = scenario;
      this.stepIndex = 0;
      this.hintShown = false;
      this.isDone = false;
      this.office = (scenario.officeConfig && scenario.officeConfig.startOffice) || "";
      this.historyIndex = -1;

      if (this.callbacks.onScenarioLoaded) {
        this.callbacks.onScenarioLoaded(this.scenario, this.getState());
      }

      this.boot();
    }

    boot() {
      if (!this.scenario) return;
      if (this.callbacks.onClearTerminal) {
        this.callbacks.onClearTerminal();
      }

      const bootLines = this.scenario.bootLines || [];
      bootLines.forEach((line) => {
        this.print(line.type || "ok", line.text);
      });

      if (this.callbacks.onStepChanged) {
        this.callbacks.onStepChanged(this.getCurrentStep(), this.getState());
      }
    }

    getCurrentStep() {
      if (!this.scenario || !this.scenario.steps) return null;
      return this.scenario.steps[this.stepIndex] || null;
    }

    getState() {
      const totalSteps = (this.scenario && this.scenario.steps) ? this.scenario.steps.length : 0;
      return {
        scenarioId: this.scenario ? this.scenario.meta.id : null,
        stepIndex: this.stepIndex,
        totalSteps: totalSteps,
        office: this.office,
        hintShown: this.hintShown,
        isDone: this.isDone
      };
    }

    print(type, text) {
      if (this.callbacks.onPrintLine) {
        this.callbacks.onPrintLine(type || "ok", text);
      }
    }

    revealHint() {
      if (this.isDone) return;
      this.hintShown = true;
      if (this.callbacks.onHintRevealed) {
        this.callbacks.onHintRevealed(this.getCurrentStep(), this.getState());
      }
    }

    executeCommand(raw) {
      if (this.isDone) return;
      const cleanRaw = String(raw || "").trim();
      if (!cleanRaw) return;

      // Add to command history
      this.addToHistory(cleanRaw);

      // Print prompt entry to terminal
      this.print("prompt", "> " + cleanRaw);

      const step = this.getCurrentStep();
      if (!step) return;

      const isMatch = this.matchCommand(cleanRaw, step);

      if (!isMatch) {
        // Locked format error message per decision
        this.print("err", "FORMAT ERROR — CHECK ENTRY OR PRESS HINT");
        return;
      }

      // Successful command execution
      if (step.stateUpdates) {
        if (step.stateUpdates.office) {
          this.office = step.stateUpdates.office;
        }
      }

      // Output response lines
      if (Array.isArray(step.terminalResponse)) {
        step.terminalResponse.forEach((line) => {
          this.print(line.type || "ok", line.text);
        });
      }

      this.advance();
    }

    selectOffice(officeId) {
      if (this.isDone) return;
      const step = this.getCurrentStep();
      if (!step) return;

      const targetOffice = (this.scenario && this.scenario.officeConfig)
        ? this.scenario.officeConfig.targetOffice
        : null;

      const isOfficeStep = (step.inputMatch && step.inputMatch.type === "office_dropdown")
        || (step.id === "change_office");

      // Requirement 1 & 7: Completes ONLY when selecting targetOffice; wrong office does NOT advance
      if (isOfficeStep && targetOffice && officeId === targetOffice) {
        this.office = officeId;

        this.print("dim", "> [ACTIVE OFFICE CHANGED TO: " + officeId + "]");

        if (Array.isArray(step.terminalResponse)) {
          step.terminalResponse.forEach((line) => {
            this.print(line.type || "ok", line.text);
          });
        }

        this.advance();
      } else {
        // Wrong office selected (still default or other non-target office) -> do NOT advance
        this.office = officeId;
        if (this.callbacks.onOfficeSelected) {
          this.callbacks.onOfficeSelected(officeId, this.getState());
        }
      }
    }

    matchCommand(raw, step) {
      if (!step || !step.inputMatch) return false;
      const match = step.inputMatch;
      const normInput = normalize(raw);
      const noSpaceInput = stripAllSpaces(raw);

      // 1. Check aliases (support both normalized and space-stripped matching)
      if (Array.isArray(match.aliases)) {
        for (let i = 0; i < match.aliases.length; i++) {
          const alias = match.aliases[i];
          const normAlias = normalize(alias);
          const noSpaceAlias = stripAllSpaces(alias);

          if (normInput === normAlias || noSpaceInput === noSpaceAlias) {
            return true;
          }
        }
      }

      // 2. Check regex patterns
      if (Array.isArray(match.patterns)) {
        for (let i = 0; i < match.patterns.length; i++) {
          try {
            const regex = new RegExp(match.patterns[i], "i");
            if (regex.test(normInput) || regex.test(noSpaceInput) || regex.test(raw.trim())) {
              return true;
            }
          } catch (e) {
            console.error("Invalid regex in step pattern:", match.patterns[i], e);
          }
        }
      }

      return false;
    }

    advance() {
      this.hintShown = false;
      this.stepIndex += 1;
      const totalSteps = this.scenario.steps.length;

      if (this.stepIndex >= totalSteps) {
        this.isDone = true;
        this.stepIndex = totalSteps;
        if (this.callbacks.onComplete) {
          this.callbacks.onComplete(this.scenario.winMessage || {}, this.getState());
        }
      }

      if (this.callbacks.onStepChanged) {
        this.callbacks.onStepChanged(this.getCurrentStep(), this.getState());
      }
    }

    // Command History
    addToHistory(cmd) {
      if (!cmd) return;
      if (this.history.length === 0 || this.history[this.history.length - 1] !== cmd) {
        this.history.push(cmd);
      }
      this.historyIndex = -1;
    }

    getPreviousHistory() {
      if (this.history.length === 0) return null;
      if (this.historyIndex === -1) {
        this.historyIndex = this.history.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
      return this.history[this.historyIndex];
    }

    getNextHistory() {
      if (this.history.length === 0 || this.historyIndex === -1) return null;
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        return this.history[this.historyIndex];
      }
      this.historyIndex = -1;
      return "";
    }

    resetHistoryIndex() {
      this.historyIndex = -1;
    }
  }

  global.SimulatorEngine = SimulatorEngine;
})(window);
