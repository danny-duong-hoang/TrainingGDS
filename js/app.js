/**
 * GDS Training Simulator Application Controller
 * Manages DOM interaction, UI updates, keyboard history, and scenario loading.
 */
(function () {
  "use strict";

  const el = {
    scenarioPick: document.getElementById("scenarioPick"),
    caseBar: document.getElementById("caseBar"),
    stepList: document.getElementById("stepList"),
    terminal: document.getElementById("terminal"),
    cmdInput: document.getElementById("cmdInput"),
    enterBtn: document.getElementById("enterBtn"),
    officeSelect: document.getElementById("officeSelect"),
    termTitle: document.getElementById("termTitle"),
    taskText: document.getElementById("taskText"),
    hintBox: document.getElementById("hintBox"),
    hintBtn: document.getElementById("hintBtn"),
    restartBtn: document.getElementById("restartBtn"),
    stepMeta: document.getElementById("stepMeta"),
    progressBar: document.getElementById("progressBar"),
    progressPct: document.getElementById("progressPct"),
    typeBadge: document.getElementById("typeBadge"),
    winBox: document.getElementById("winBox"),
    winTitle: document.getElementById("winTitle"),
    winText: document.getElementById("winText"),
  };

  function ensureInputFocus(force = false) {
    if (!force && document.activeElement === el.officeSelect) {
      return;
    }
    if (el.cmdInput) {
      setTimeout(() => {
        if (force || document.activeElement !== el.officeSelect) {
          el.cmdInput.focus();
        }
      }, 10);
    }
  }

  // Engine callbacks
  const callbacks = {
    onClearTerminal() {
      el.terminal.innerHTML = "";
    },

    onPrintLine(type, text) {
      const div = document.createElement("div");
      div.className = "term-line " + (type || "ok");
      div.textContent = text;
      el.terminal.appendChild(div);
      el.terminal.scrollTop = el.terminal.scrollHeight;
    },

    onScenarioLoaded(scenario, state) {
      el.winBox.classList.remove("show");
      if (el.typeBadge) {
        el.typeBadge.textContent = scenario.meta.badge || "SCENARIO";
        el.typeBadge.className = "badge " + (scenario.meta.badgeClass || "badge-dark");
      }

      renderScenarioButtons(scenario.meta.id);
      renderCaseBar(scenario.caseMeta || {});
      renderOffices(scenario.officeConfig || {}, state.office);
      updateOfficeUI(state.office);
    },

    onStepChanged(step, state) {
      renderStepList(state);
      renderTaskCard(step, state);
      updateOfficeUI(state.office);
      el.cmdInput.value = "";
      ensureInputFocus(true);
    },

    onOfficeSelected(officeId, state) {
      updateOfficeUI(officeId);
    },

    onHintRevealed(step, state) {
      renderTaskCard(step, state);
      ensureInputFocus();
    },

    onComplete(winMessage, state) {
      renderStepList(state);
      el.winBox.classList.add("show");
      el.winTitle.textContent = winMessage.title || "Scenario Complete ✓";
      el.winText.textContent = winMessage.text || "Drill finished successfully.";
      ensureInputFocus();
    }
  };

  const engine = new window.SimulatorEngine(callbacks);

  function renderScenarioButtons(activeId) {
    el.scenarioPick.innerHTML = "";
    const scenarios = window.GDS_SCENARIOS || {};

    const categoryOrder = [
      "Rebook",
      "Void & Sell",
      "Refund",
      "Split PNR",
      "Name / Passenger",
      "Ancillaries",
      "APIS / DOCS",
      "Retrieve Toolkit"
    ];

    const categories = {};
    Object.values(scenarios).forEach((s) => {
      const cat = (s.meta && s.meta.category) || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s);
    });

    const sortedCatNames = Object.keys(categories).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    sortedCatNames.forEach((catName) => {
      const items = categories[catName];
      const group = document.createElement("div");
      group.className = "category-group";

      const title = document.createElement("div");
      title.className = "category-title";
      title.textContent = catName;
      group.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "category-grid";

      items.forEach((s) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "scenario-btn" + (s.meta.id === activeId ? " active" : "");
        btn.innerHTML = "<strong>" + s.meta.title + "</strong><small>" + s.meta.blurb + "</small>";
        btn.addEventListener("click", () => {
          engine.loadScenario(s);
          ensureInputFocus();
        });
        grid.appendChild(btn);
      });

      group.appendChild(grid);
      el.scenarioPick.appendChild(group);
    });
  }

  function renderCaseBar(caseMeta) {
    el.caseBar.innerHTML = "";
    Object.entries(caseMeta).forEach(([label, val]) => {
      const item = document.createElement("div");
      item.className = "case-item";
      item.innerHTML = "<label>" + label + "</label><span>" + val + "</span>";
      el.caseBar.appendChild(item);
    });
  }

  function renderOffices(officeConfig, activeOffice) {
    el.officeSelect.innerHTML = "";
    const offices = officeConfig.offices || [];
    offices.forEach((off) => {
      const opt = document.createElement("option");
      opt.value = off.id;
      opt.textContent = off.label;
      el.officeSelect.appendChild(opt);
    });
    el.officeSelect.value = activeOffice;
  }

  function updateOfficeUI(officeId) {
    if (el.officeSelect && officeId) {
      el.officeSelect.value = officeId;
    }
    if (el.termTitle && officeId) {
      el.termTitle.textContent = "AMADEUS SELLING PLATFORM CONNECT — " + officeId;
    }
  }

  function renderStepList(state) {
    const scenario = engine.scenario;
    if (!scenario || !scenario.steps) return;
    const steps = scenario.steps;
    el.stepList.innerHTML = "";

    steps.forEach((st, idx) => {
      const li = document.createElement("li");
      li.className = "step-item";
      if (idx < state.stepIndex) {
        li.classList.add("done");
      } else if (idx === state.stepIndex && !state.isDone) {
        li.classList.add("active");
      }

      li.innerHTML = '<div class="n"><span>' + (idx + 1) + '</span></div><div>' + st.title + '</div>';
      el.stepList.appendChild(li);
    });

    const total = steps.length;
    const current = Math.min(state.stepIndex + (state.isDone ? 0 : 1), total);
    const pct = Math.round((state.stepIndex / total) * 100);

    el.stepMeta.textContent = state.isDone
      ? "Complete · " + total + "/" + total
      : "Step " + (state.stepIndex + 1) + " of " + total;
    el.progressBar.style.width = (state.isDone ? 100 : pct) + "%";
    el.progressPct.textContent = (state.isDone ? 100 : pct) + "%";
  }

  function renderTaskCard(step, state) {
    if (state.isDone) {
      el.taskText.textContent = "All steps finished. Review terminal response, restart, or switch to another scenario.";
      el.hintBox.className = "hint";
      el.hintBox.innerHTML = "Select another scenario above to continue your practice.";
      return;
    }

    if (!step) return;

    el.taskText.textContent = step.task || "";
    el.hintBox.className = "hint";

    if (state.hintShown) {
      el.hintBox.classList.add("reveal");
      el.hintBox.innerHTML = step.hint || "No hint available for this step.";
    } else {
      el.hintBox.innerHTML = 'Type command with valid syntax. Press <strong>Hint</strong> if you need guidance.';
    }
  }

  function submitCurrentInput() {
    const val = el.cmdInput.value;
    if (!val || !val.trim()) return;
    el.cmdInput.value = "";
    engine.executeCommand(val);
    ensureInputFocus();
  }

  // Event Listeners
  el.enterBtn.addEventListener("click", submitCurrentInput);

  // Auto-uppercase input and Arrow History navigation
  el.cmdInput.addEventListener("input", (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(start, end);
  });

  el.cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitCurrentInput();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevCmd = engine.getPreviousHistory();
      if (prevCmd !== null) {
        el.cmdInput.value = prevCmd;
        el.cmdInput.setSelectionRange(prevCmd.length, prevCmd.length);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextCmd = engine.getNextHistory();
      if (nextCmd !== null) {
        el.cmdInput.value = nextCmd;
        el.cmdInput.setSelectionRange(nextCmd.length, nextCmd.length);
      }
    }
  });

  el.hintBtn.addEventListener("click", () => {
    engine.revealHint();
  });

  el.restartBtn.addEventListener("click", () => {
    if (engine.scenario) {
      engine.loadScenario(engine.scenario);
      ensureInputFocus();
    }
  });

  // Office dropdown selection handler
  el.officeSelect.addEventListener("change", () => {
    engine.selectOffice(el.officeSelect.value);
  });

  // Prevent clicks or mousedown on office dropdown from bubbling to focus-stealing handlers
  el.officeSelect.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  el.officeSelect.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  // Re-focus on clicks inside terminal log area or input row (never the chrome header)
  if (el.terminal) {
    el.terminal.addEventListener("click", () => {
      ensureInputFocus();
    });
  }
  const inputRow = document.querySelector(".input-row");
  if (inputRow) {
    inputRow.addEventListener("click", () => {
      ensureInputFocus();
    });
  }

  // Bootstrap initial scenario
  window.addEventListener("DOMContentLoaded", () => {
    const scenarios = window.GDS_SCENARIOS || {};
    const firstKey = Object.keys(scenarios)[0];
    if (firstKey) {
      engine.loadScenario(scenarios[firstKey]);
    }
    ensureInputFocus();
  });
})();
