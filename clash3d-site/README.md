# CLASH 3D – deploy on Vercel

1. Put this folder in a GitHub repo (or run `npx vercel` inside it).
2. In Vercel: Import the project. Then Storage > Create > **Blob** (Public) > connect it to the project. This adds `BLOB_READ_WRITE_TOKEN` automatically.
3. Project Settings > Environment Variables, add:
   - `ADMIN_PASSWORD` – a long password only you know
   - `SESSION_SECRET` – any random text, 32+ characters
4. Redeploy. Open your site, scroll to the footer, tap **Owner login**.
5. Set your WhatsApp number first, then add photos, reviews and offers.

If either variable is missing, owner login stays disabled on purpose.
