# fpgadashboard

Daily data file for the FPGA ads dashboard at https://fpgapassport.ca/dashboard.html.

`data.json` is rewritten every morning (7:46 am Toronto) by a scheduled Claude task:
- `ranges`: ad spend, impressions and clicks per platform (Meta, Google Ads, TikTok) from Metricool, for yesterday, the last 7 days and the last 30 days.
- `aud`: last-30-day Google Ads views by Ontario city (top 15) plus the all-Ontario total, and the gender split reported by Google Ads and TikTok, from Supermetrics.

Aggregated campaign numbers only. No personal data.
