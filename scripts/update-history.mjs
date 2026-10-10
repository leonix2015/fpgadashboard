import { readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../data.json", import.meta.url);
const historyPath = new URL("../history.json", import.meta.url);

const source = JSON.parse(await readFile(sourcePath, "utf8"));
const range = source?.ranges?.d7;

if (!range?.from || !range?.to) {
  throw new Error("data.json does not contain ranges.d7 with from/to dates");
}

function total(rows = []) {
  const values = rows.reduce(
    (sum, row) => ({
      spend: sum.spend + Number(row.spend || 0),
      impressions: sum.impressions + Number(row.impr || 0),
      clicks: sum.clicks + Number(row.clicks || 0),
    }),
    { spend: 0, impressions: 0, clicks: 0 },
  );

  return {
    spend: Number(values.spend.toFixed(2)),
    impressions: values.impressions,
    clicks: values.clicks,
    cpc: values.clicks ? Number((values.spend / values.clicks).toFixed(4)) : null,
    ctr: values.impressions
      ? Number(((values.clicks / values.impressions) * 100).toFixed(4))
      : null,
  };
}

const google = range.google || [];
const snapshot = {
  weekEnding: range.to,
  range: { from: range.from, to: range.to },
  capturedAt: source.saved || source.generated || new Date().toISOString(),
  platforms: {
    meta: total(range.meta),
    search: total(google.filter((row) => /search/i.test(row.name))),
    youtube: total(google.filter((row) => /youtube/i.test(row.name))),
    googleTotal: total(google),
    tiktok: total(range.tiktok),
    all: total([...(range.meta || []), ...google, ...(range.tiktok || [])]),
  },
};

let history = { version: 1, updatedAt: null, snapshots: [] };
try {
  history = JSON.parse(await readFile(historyPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

history.version = 1;
history.updatedAt = source.saved || source.generated || new Date().toISOString();
history.snapshots = Array.isArray(history.snapshots) ? history.snapshots : [];

const existing = history.snapshots.findIndex(
  (item) => item.weekEnding === snapshot.weekEnding,
);

if (existing >= 0) history.snapshots[existing] = snapshot;
else history.snapshots.push(snapshot);

history.snapshots.sort((a, b) => a.weekEnding.localeCompare(b.weekEnding));

await writeFile(historyPath, JSON.stringify(history, null, 2) + "\n");
console.log(
  (existing >= 0 ? "Updated" : "Added") + " weekly snapshot " + snapshot.weekEnding,
);
