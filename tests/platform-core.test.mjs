import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReadiness,
  evaluateGuidance,
  filterCatalog,
  getRoute,
  normalizeLocale
} from "../platform-core.js";
import {
  fixtures,
  knowledgeSources,
  launchGates,
  platformConfig,
  products,
  services
} from "../data.js";

test("normalizes unsupported locales to English", () => {
  assert.equal(normalizeLocale("fr"), "fr");
  assert.equal(normalizeLocale("de"), "en");
});

test("parses supported and unknown hash routes safely", () => {
  assert.deepEqual(getRoute("#/service/service-orientation"), {
    route: "service",
    id: "service-orientation"
  });
  assert.deepEqual(getRoute("#/unknown"), { route: "home", id: "" });
});

test("filters services by localized search and category", () => {
  const french = filterCatalog(services, "fr", "document", "documents");
  assert.equal(french.length, 1);
  assert.equal(french[0].id, "service-document-review");

  const noMatch = filterCatalog(products, "zh", "不存在", "all");
  assert.equal(noMatch.length, 0);
});

test("guidance requires jurisdiction and topic", () => {
  const result = evaluateGuidance(
    { jurisdiction: "", topic: "", language: "en", situation: "" },
    knowledgeSources
  );
  assert.equal(result.status, "needs_input");
});

test("guidance escalates urgency before attempting retrieval", () => {
  const result = evaluateGuidance(
    {
      jurisdiction: "DEMO",
      topic: "orientation",
      language: "en",
      situation: "My hearing is tomorrow"
    },
    knowledgeSources
  );
  assert.equal(result.status, "escalate");
});

test("guidance refuses unsupported scope", () => {
  const result = evaluateGuidance(
    {
      jurisdiction: "UNSUPPORTED",
      topic: "orientation",
      language: "en",
      situation: "General question"
    },
    knowledgeSources
  );
  assert.equal(result.status, "unsupported");
});

test("guidance returns only approved matching source metadata", () => {
  const result = evaluateGuidance(
    {
      jurisdiction: "DEMO",
      topic: "orientation",
      language: "zh",
      situation: "General orientation"
    },
    knowledgeSources
  );
  assert.equal(result.status, "supported");
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].id, "source-demo-orientation");
});

test("production readiness remains blocked by launch gates", () => {
  const result = calculateReadiness({
    gates: launchGates,
    fixtures,
    providers: platformConfig.providers,
    aiSources: knowledgeSources
  });
  assert.equal(result.ready, false);
  assert.ok(result.blockers.some((blocker) => blocker.id === "identity"));
});

test("production readiness catches development providers when enabled", () => {
  const result = calculateReadiness({
    gates: [],
    fixtures: [],
    providers: { model: { enabled: true, mode: "development" } },
    aiSources: []
  });
  assert.equal(result.ready, false);
  assert.equal(result.blockers[0].type, "provider");
});
