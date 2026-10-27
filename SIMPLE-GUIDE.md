# FindIt Campus - simple guide (MUET)

## What this website does

It is a lost-and-found website for **Mehran University of Engineering and Technology**.

- **A student who lost something** fills in a form: name, email, phone, and the item (name, category, colour, description, where and when it was lost).
- **A person who found something** fills in the same form, then gives the item to the **administrator**.
- **They never contact each other.** Only the administrator can see names, emails and phone numbers.
- **The administrator** logs in, opens a report, clicks **Find matches**, sees likely lost/found pairs (with a score and reasons) and **both people's contact details**, contacts them, and clicks **Link these two** when the details match.
- If the details match, the administrator gives the item to the owner and clicks **Mark returned**. If they do not match, the item is **not** given.
- The administrator's name, email, phone and office location are shown on the website.

## What you need

1. **Node.js 22 or newer** (check with `node -v`). Download from nodejs.org if needed.
2. **VS Code** (or PowerShell). Open the project folder (the one that contains `backend`, `frontend` and `docs`) and open a terminal: **Terminal > New Terminal**.

## Run the website (Windows PowerShell / VS Code terminal)

PowerShell does not allow `&&`, so type **one command per line**.

If PowerShell says "running scripts is disabled", run this once per terminal window:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Terminal 1 - backend (the server)

```powershell
cd backend
npm install
copy .env.example .env
npm test
npm run db:init
npm run db:seed
npm run admin:create
npm run dev
```

- `npm run admin:create` asks for your admin **email** and **password** (at least 10 characters). Type only the answer, then press Enter. You use these to log in at `/admin/login`.
- `npm run db:seed` adds sample reports so you can demo matching straight away. If you already had an older database and want the new sample data with colours and phones, run `npm run db:reset` instead (this erases existing reports).
- Leave this terminal running. Check: open http://localhost:4000/api/health. It should show `"status":"ok"`.

### Terminal 2 - frontend (the website)

Open a second terminal (the **+** button in VS Code), starting in the project folder:

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Open **http://localhost:5173**.

## Put your real details on the website

Open `backend/.env` in VS Code and change these lines:

```
UNIVERSITY_NAME=Mehran University of Engineering and Technology
ADMIN_CONTACT_NAME=Your admin's name
ADMIN_CONTACT_EMAIL=xxx@gmail.com
ADMIN_CONTACT_PHONE=03XX-XXXXXXX
OFFICE_LOCATION=Room / building at MUET
OFFICE_HOURS=Mon-Fri, 9:00 AM - 4:00 PM
```

Save, then stop the backend (`Ctrl+C` in Terminal 1) and run `npm run dev` again. Refresh the website. (`xxx@gmail.com` and `03XX-XXXXXXX` are placeholders; replace them with the real admin details before the demo.)

## Try the whole flow (demo)

1. Home > **I Lost Something**: fill the form (all fields marked required) and submit.
2. Open `/admin/login` and log in with the admin email and password you created.
3. **Reports** tab > **Find matches** on your report: you see likely found items, scores, and both people's private details.
4. Click **Link these two**, then **Mark returned** after the handover. Both reports close.
5. Log out.

## Before you submit the ZIP

The ZIP must **not** contain `node_modules` folders, `.env` files or database files (they are huge, private, or machine specific). The ZIP made for you already excludes them. If you make your own ZIP, delete `backend/node_modules`, `frontend/node_modules`, `frontend/dist`, `backend/.env`, `frontend/.env.local` and everything in `backend/data` and `backend/uploads` (except the `.gitkeep` files) first.

The judges run the same commands as above (`npm install`, then `npm run dev` in both folders), so keep README and this guide in the ZIP.

## If something goes wrong

- `npm : File ... cannot be loaded because running scripts is disabled` - run the `Set-ExecutionPolicy` line above.
- `Cannot find path '...backend'` - you are in the wrong folder. Use `dir` to check that you can see `backend` and `frontend`.
- The website says it cannot load data - the backend (Terminal 1) is not running.
- Admin login fails - run `npm run admin:create` again in `backend` and use exactly those details.
