# Pitch video script (about 3 minutes)

Tips: record your screen with your voice (Windows: Win+Alt+R or the Xbox Game Bar, or OBS). Speak slowly. Use the sample data, never show your real admin password, and keep the browser zoom at 100-110%.
Replace [brackets] with your details. Say "deployed" only if the live link really works.

---

**1. Introduction (0:00 - 0:20)** [show the home page]
"Assalam-o-alaikum / Hello. My name is [your name], and this is my project for CraftSolve Hackathon 2026. It is called FindIt Campus, a lost-and-found website for Mehran University of Engineering and Technology."

**2. Problem (0:20 - 0:40)**
"Every week, students on our campus lose wallets, phones, keys and ID cards. People who find them do not know who the owner is. Messages in WhatsApp groups get buried in an hour, and the item may never reach its owner. There was no single, safe place for this."

**3. Solution (0:40 - 1:00)** [scroll the home page: statistics, how it works, admin contact card]
"FindIt Campus fixes this. A student who lost something, and a person who found something, both submit a report. The campus administrator is the link between them. Here you can see live statistics, recent reports, how the system works, and the administrator's contact details: name, email, phone and office location."

**4. Report a lost item (1:00 - 1:40)** [click I Lost Something and fill the form slowly]
"I will report a lost item. I choose Lost. The item name is Black leather wallet. Category: Wallet. Colour: Black. In the description I write the details: a silver zip and a bus pass inside. The place is Library, and I choose today's date. I can also upload a photo. Now my private details: my name, my Gmail and my phone number. These are marked private. Only the administrator can see them, they are never shown on the website, and the finder never receives them."
[click Submit] "My report is submitted, and the page shows me the administrator's contact details, so I know whom to contact."

**5. Public side stays private (1:40 - 2:00)** [open Browse, search "wallet", open an item]
"Anyone can browse and search items by name, category, colour, location and date. But look: no names, emails or phone numbers are visible. Only the item details. People who found something report in the same way and hand the item to the administrator."

**6. Admin dashboard and matching (2:00 - 2:50)** [open /admin/login, log in, open Reports, click Find matches]
"Now I log in as the administrator. This page is protected, and without logging in nobody can open it. In Reports, I click Find matches on the lost wallet. The system compares category, item name, description, colour, location and date, and shows a score from 0 to 100 with reasons: same category, shared keywords, same colour, same location, close dates. The administrator also sees the private contact details of both people, so they can phone or email both of them. The score is only a suggestion. The administrator checks the details, and the owner comes to the office with a student ID. If everything matches, the administrator clicks Link these two, hands over the item in person, and clicks Mark returned. Both reports close, and the statistics update. If the details do not match, nothing is handed over."

**7. Claims and security (2:50 - 3:10)** [show the Claims tab quickly]
"Owners can also submit a claim with private proof of ownership. The administrator approves or rejects it, and the owner checks the status with a private claim code. For security, passwords are hashed, admin routes are protected on the server, uploads are checked, inputs are validated, and requests are rate-limited."

**8. Technology and closing (3:10 - 3:30)**
"The frontend is built with React and Vite. The backend uses Node.js and Express with a SQLite database. The matching engine is written in JavaScript. It is deployed on Vercel and Render, and the links are in our README. Thank you for watching. FindIt Campus: simple, safe, and built for our university."
