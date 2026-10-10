# fpgadashboard

Daily data file for the FPGA ads dashboard at https://fpgapassport.ca/dashboard.html.

data.json is rewritten every morning (7:46 am Toronto) by a scheduled Claude task:
- ranges: ad spend, impressions and clicks per platform (Meta, Google Ads, TikTok) from Metricool, for yesterday, the last 7 days and the last 30 days.
- aud: last-30-day Google Ads views by Ontario city (top 15) plus the all-Ontario total, and the gender split reported by Google Ads and TikTok, from Supermetrics.

Aggregated campaign numbers only. No personal data.

## Weekly history

.github/workflows/weekly-history.yml runs every Monday after the daily data refresh. It uses scripts/update-history.mjs to append or replace the latest seven-day snapshot in history.json and commits the result automatically.

The history contains aggregated spend, impressions, clicks, CPC, and CTR for Meta, Google Search, YouTube, TikTok, Google overall, and all platforms. It does not contain personal data.

The workflow can also be tested manually from Actions → Weekly campaign history → Run workflow. Repository workflow permissions must allow read and write access so the built-in GITHUB_TOKEN can commit history.json.
