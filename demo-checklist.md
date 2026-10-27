# Live demo checklist

Before the demo
- [ ] Backend health URL returns `{"status":"ok"}`; open it 2 minutes early (free Render instances sleep)
- [ ] Frontend loads and shows the university name
- [ ] Demo data loaded (`SEED_DEMO_DATA=true` or `npm run db:seed`)
- [ ] Admin credentials ready (not shown on screen); second browser window for admin
- [ ] A small JPG/PNG ready for the upload demo

Demo flow
1. Home: stats, recent items, how it works, administrator contact card
2. Report a lost item (black wallet, Library, today): name, email, phone, colour, description
3. Show the confirmation with the administrator's contact details
4. Browse: search "wallet", show that no personal details are visible publicly
5. Admin login > Reports > Find matches on the lost wallet: score, reasons, both parties' private details
6. Link these two, then Mark returned: both reports close
7. Show Overview statistics updated; log out
8. Show that `/admin` without logging in does not show any data

Fallbacks
- [ ] Screen recording of the full flow in case of network trouble
