PROJECT NEW ME — My Goals v1

WHAT'S NEW
- Create, edit and delete personal goals
- Choose a category and optional target date
- Update progress from 0% to 100%
- Goals are saved in Supabase and protected by Row Level Security (RLS)

IMPORTANT: BACK UP YOUR CURRENT NETLIFY SITE BEFORE DEPLOYING.

STEP 1 — CREATE THE DATABASE TABLE
1. Open your Supabase project: pnm-production.
2. Open SQL Editor, then choose New query.
3. Open SETUP_GOALS.sql from this folder in Notepad.
4. Copy all its contents and paste them into Supabase SQL Editor.
5. Click Run. Wait for the success message.

STEP 2 — DEPLOY THE WEBSITE
1. Keep a copy of your current working website folder.
2. Upload the contents of this PNM_Goals_v1 folder to Netlify's manual deploy area (not the ZIP file itself if the page asks for a folder).
3. Make sure index.html, style.css and script.js are at the root of the deployed folder.

STEP 3 — TEST
1. Open your Netlify website and log in with your account.
2. Click + Add a goal, create a test goal, and save it.
3. Change its progress, then refresh the page to confirm it remains saved.
4. Log out, then log in again to confirm the goal is still there.

SECURITY
- The browser contains only the Supabase project URL and publishable key.
- Never put a service_role/secret key in website files or share it.
- RLS policies make each signed-in user able to access only their own goals.

If the goals section says the database setup is incomplete, run SETUP_GOALS.sql and refresh the website.

ACHIEVEMENTS & POINTS (v1)
- Achievements are calculated automatically from the signed-in user's existing goals.
- No new Supabase table or SQL migration is required.
- Points are a progress score from currently unlocked badges, not money or redeemable credit.
- Upload index.html, style.css and script.js to Netlify. The SQL file is not needed for this update.

ACHIEVEMENTS v2
- Locked badges now show live progress (for example, 2 / 3 goals).
- Progress updates automatically when goals are created or completed.
- No new Supabase table or SQL changes are needed.
- Deploy index.html, style.css and script.js only.
