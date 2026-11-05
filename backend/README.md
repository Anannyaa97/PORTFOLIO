# Google Sheets & Google Apps Script Backend Architecture Guide

This backend powers the **Anannya AK Portfolio CMS** using Google Sheets as the relational database, Google Drive as the asset storage system, and Google Apps Script as the REST API engine.

---

## 1. Verified Infrastructure Configuration

- **Connected Spreadsheet ID:** `1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD`
- **Spreadsheet & Drive Owner Account:** `anannyamalu23@gmail.com`
- **Apps Script Project Owner & Deployment Account:** `gamingwithjokers34@gmail.com`
- **Authorized Administrators:**
  - `anannyamalu23@gmail.com`
  - `gamingwithjokers34@gmail.com`
  - `anannyaak01@gmail.com`
- **Connected Google Drive Media Folder ID:** `1tdwIhAH6WevW6PuXBH4abNqkYevlN7Z8`
- **Apps Script Web App API URL:**
  `https://script.google.com/macros/s/AKfycbyg_38Pa8ZBj0iRCCYcColssYsOcVLHLmfizVcWiPFMDtVguZUeVqldCnqeS32wZZofjQ/exec`

---

## 2. Mandatory Apps Script Deployment Steps

Whenever [`backend/Code.gs`](./Code.gs) is updated, **you must create a new version in Google Apps Script** for changes to take effect:

1. Open your Apps Script Project at [script.google.com](https://script.google.com) signed in as `gamingwithjokers34@gmail.com` (or access via the Google Sheet: *Extensions > Apps Script*).
2. Ensure the Google Sheet is shared with `gamingwithjokers34@gmail.com` as **Editor**.
3. In the left file tree, click `Code.gs`. Replace all existing contents with the updated code in [`backend/Code.gs`](./Code.gs).
4. Save the project (`Ctrl+S` / `Cmd+S`).
5. Click **Deploy > Manage deployments**:
   - Select your active Web App deployment.
   - Click the **pencil icon (Edit)** at top right.
   - Under **Version**, click the dropdown and choose **New version**.
   - Ensure:
     - **Execute as:** `Me (gamingwithjokers34@gmail.com)`
     - **Who has access:** `Anyone`
   - Click **Deploy**.
6. Verify that your deployment URL matches the `VITE_APPS_SCRIPT_URL` configured in your `.env` and `admin/.env` files.

---

## 3. Initializing / Verifying All 17 Database Sheets

If any sheet is missing or empty, you can initialize or seed them in one click:

1. In the Apps Script toolbar at the top, select the function dropdown and choose **`setupDatabase`**.
2. Click **Run**.
3. It non-destructively creates and verifies all 17 tables:
   - `Profile`, `About`, `Skills`, `Projects`, `Experience`, `Education`, `Certificates`, `Achievements`, `Services`, `Testimonials`, `Resume`, `SocialLinks`, `Contact`, `Music`, `Appearance`, `Media`, `Navigation`, `SEOSettings`, `ActivityLog`.
4. Return to your Google Sheet tab to verify that the headers are styled in Emerald green and frozen in Row 1.

---

## 4. API Endpoint Verification

### Public Read Test (Browser, Postman, or Terminal)
```bash
curl -L "https://script.google.com/macros/s/AKfycbyg_38Pa8ZBj0iRCCYcColssYsOcVLHLmfizVcWiPFMDtVguZUeVqldCnqeS32wZZofjQ/exec?action=portfolio"
```
**Expected Response:** JSON with `success: true`, `revision: <timestamp>`, and all published portfolio records.

### Admin Verify Test
```bash
curl -L "https://script.google.com/macros/s/AKfycbyg_38Pa8ZBj0iRCCYcColssYsOcVLHLmfizVcWiPFMDtVguZUeVqldCnqeS32wZZofjQ/exec?action=verifyAuth&adminKey=anannya_admin_secret_key_2026"
```
**Expected Response:** `{"success":true,"authorized":true,"email":"admin-key@authorized"}`

---

## 5. Resolving Google OAuth "Error 400: origin_mismatch"

When attempting Google Sign-In with `anannyaak01@gmail.com` on `http://localhost:5174`, Google displays:
> **Access blocked: Authorisation error**  
> *Error 400: origin_mismatch*  
> *If you're the app developer, register the JavaScript origin in the Google Cloud Console.*

### Root Cause
Google Identity Services strictly validates the browser's exact origin against the registered origins in Google Cloud Console. `http://localhost:5174` is currently not on that allowlist.

### Fix (Takes 60 seconds):
1. Go to **[Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)**.
2. Ensure you are in the project containing OAuth Client ID:
   `1031335458105-6qfs0rqriufrrsbok7i0c39isnfgaeb9.apps.googleusercontent.com`.
3. Click on the Client ID to edit it.
4. Under **Authorized JavaScript origins**, click **+ ADD URI** and add:
   - `http://localhost:5174`
   - `http://localhost:5173`
   - `http://localhost`
   - Any production custom domain (e.g., `https://anannya-ak.onrender.com`)
5. Click **SAVE** at the bottom. *(Note: Changes propagate in ~2 minutes).*

> **Tip:** You do NOT need to wait for Google Cloud Console to log in! Simply use the **Admin Key** tab in the login page with key `anannya_admin_secret_key_2026` for immediate 1-click access.
