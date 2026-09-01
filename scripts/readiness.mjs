import {
  fixtures,
  knowledgeSources,
  launchGates,
  platformConfig
} from "../data.js";
import { calculateReadiness } from "../platform-core.js";

const result = calculateReadiness({
  gates: launchGates,
  fixtures,
  providers: platformConfig.providers,
  aiSources: knowledgeSources
});

console.log(`Production readiness: ${result.ready ? "READY" : "BLOCKED"}`);
for (const blocker of result.blockers) {
  console.log(`- [${blocker.type}] ${blocker.message}`);
}

if (process.env.REQUIRE_PRODUCTION_READY === "true" && !result.ready) {
  process.exitCode = 1;
}
