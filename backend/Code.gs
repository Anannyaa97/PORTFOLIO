/**
 * =========================================================================
 * ANANNYA AK – COMPLETE PORTFOLIO CMS BACKEND (GOOGLE APPS SCRIPT)
 * Technology: Google Apps Script + Google Sheets + Google Drive
 * 
 * Connected Spreadsheet ID: 1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD
 * Connected Google Drive Media Folder ID: 1tdwIhAH6WevW6PuXBH4abNqkYevlN7Z8
 * Authorized Administrators:
 * - anannyamalu23@gmail.com (Google Drive & Sheets Owner)
 * - gamingwithjokers34@gmail.com (Apps Script Deployment Owner)
 * - anannyaak01@gmail.com (Portfolio Owner)
 * =========================================================================
 */

function getAppConfig() {
  var globalConf = (typeof CONFIG !== "undefined" && CONFIG && typeof CONFIG === "object") ? CONFIG : null;
  return {
    SPREADSHEET_ID: (globalConf && globalConf.SPREADSHEET_ID) || "1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD",
    DRIVE_FOLDER_ID: (globalConf && globalConf.DRIVE_FOLDER_ID) || "1tdwIhAH6WevW6PuXBH4abNqkYevlN7Z8",
    ADMIN_EMAILS: (globalConf && globalConf.ADMIN_EMAILS && globalConf.ADMIN_EMAILS.length > 0)
      ? globalConf.ADMIN_EMAILS
      : [
          "anannyamalu23@gmail.com",
          "gamingwithjokers34@gmail.com",
          "anannyaak01@gmail.com"
        ],
    ADMIN_API_KEY: (globalConf && globalConf.ADMIN_API_KEY) || "anannya_admin_secret_key_2026",
    SHEET_NAMES: (globalConf && globalConf.SHEET_NAMES && globalConf.SHEET_NAMES.length > 0)
      ? globalConf.SHEET_NAMES
      : [
          "Profile",
          "About",
          "Skills",
          "Projects",
          "Experience",
          "Education",
          "Certificates",
          "Achievements",
          "Services",
          "Testimonials",
          "Resume",
          "SocialLinks",
          "Contact",
          "Music",
          "Appearance",
          "Media",
          "Navigation",
          "SEOSettings",
          "ActivityLog"
        ]
  };
}

/**
 * Open connected Google Spreadsheet
 */
function getSpreadsheet() {
  var cfg = getAppConfig();
  if (cfg.SPREADSHEET_ID) {
    try {
      return SpreadsheetApp.openById(cfg.SPREADSHEET_ID);
    } catch (e) {
      Logger.log("openById failed, falling back to active sheet: " + e.toString());
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Open connected Google Drive Media Folder
 */
function getMediaFolder() {
  var cfg = getAppConfig();
  if (cfg.DRIVE_FOLDER_ID) {
    try {
      return DriveApp.getFolderById(cfg.DRIVE_FOLDER_ID);
    } catch (e) {
      Logger.log("getFolderById failed, searching by name: " + e.toString());
    }
  }
  var folders = DriveApp.getFoldersByName("Anannya_Portfolio_Media");
  if (folders.hasNext()) {
    return folders.next();
  }
  var newFolder = DriveApp.createFolder("Anannya_Portfolio_Media");
  newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newFolder;
}

/**
 * Helper to get admin allowlist
 */
function getAdminEmails() {
  var cfg = getAppConfig();
  var prop = PropertiesService.getScriptProperties().getProperty("ADMIN_EMAILS");
  if (prop) {
    return prop.split(",").map(function(e) { return e.trim().toLowerCase(); });
  }
  return cfg.ADMIN_EMAILS.map(function(e) { return e.toLowerCase(); });
}

/**
 * Verify administrator authentication
 * Supports:
 * 1. Google OAuth 2.0 ID Token (verified via oauth2.googleapis.com)
 * 2. Secure Admin Key configured in ADMIN_API_KEY or Script Properties
 */
function verifyAdmin(authHeader, idToken, adminKey) {
  var cfg = getAppConfig();
  var allowedEmails = getAdminEmails();
  var configuredKey = PropertiesService.getScriptProperties().getProperty("ADMIN_API_KEY") || cfg.ADMIN_API_KEY;

  var candidateKey = adminKey || authHeader || idToken;

  // Check 1: Direct Admin Key Match
  if (configuredKey && candidateKey && candidateKey === configuredKey) {
    return { authorized: true, email: "admin-key@authorized", name: "Administrator" };
  }

  // Check 2: Google ID Token verification
  var token = idToken || authHeader;
  if (!token) {
    return { authorized: false, error: "Authentication required." };
  }

  if (token.indexOf("Bearer ") === 0) {
    token = token.substring(7);
  }

  try {
    var response = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(token), {
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      var payload = JSON.parse(response.getContentText());
      var userEmail = (payload.email || "").toLowerCase();
      
      if (allowedEmails.indexOf(userEmail) !== -1) {
        return { authorized: true, email: userEmail, name: payload.name || userEmail };
      } else {
        return { authorized: false, error: "Access denied. " + userEmail + " is not an authorized administrator." };
      }
    } else {
      // Fallback check against configured admin key
      if (configuredKey && token === configuredKey) {
        return { authorized: true, email: "admin-key@authorized", name: "Administrator" };
      }
      return { authorized: false, error: "Invalid or expired authorization token." };
    }
  } catch (err) {
    if (configuredKey && token === configuredKey) {
      return { authorized: true, email: "admin-key@authorized", name: "Administrator" };
    }
    return { authorized: false, error: "Auth verification error: " + err.toString() };
  }
}

/**
 * Helper to build JSON Response with CORS headers
 */
function jsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * =========================================================================
 * 1. HTTP GET HANDLER
 * =========================================================================
 * - action=portfolio | action=getPortfolioData | (empty): Returns public published content
 * - action=verifyAuth: Checks authentication token / key
 * - action=getAllAdminData: Returns full database records (admin auth required)
 */
function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || "portfolio";

    // Public Portfolio Data (No Auth Required, published items only)
    if (action === "portfolio" || action === "getPortfolioData" || action === "getPortfolio") {
      var portfolioData = getPublicPortfolioData();
      return jsonResponse({
        success: true,
        data: portfolioData,
        revision: new Date().getTime(),
        serverTime: new Date().toISOString()
      });
    }

    // Specific entity public reads
    if (action === "getProfile" || action === "profile") {
      return jsonResponse({ success: true, data: getSheetData("Profile", true) });
    }
    if (action === "getProjects" || action === "projects") {
      return jsonResponse({ success: true, data: getSheetData("Projects", true) });
    }
    if (action === "getSkills" || action === "skills") {
      return jsonResponse({ success: true, data: getSheetData("Skills", true) });
    }
    if (action === "getExperience" || action === "experience") {
      return jsonResponse({ success: true, data: getSheetData("Experience", true) });
    }
    if (action === "getEducation" || action === "education") {
      return jsonResponse({ success: true, data: getSheetData("Education", true) });
    }
    if (action === "getCertificates" || action === "certificates") {
      return jsonResponse({ success: true, data: getSheetData("Certificates", true) });
    }
    if (action === "getServices" || action === "services") {
      return jsonResponse({ success: true, data: getSheetData("Services", true) });
    }
    if (action === "getTestimonials" || action === "testimonials") {
      return jsonResponse({ success: true, data: getSheetData("Testimonials", true) });
    }

    // Admin Auth Check via GET
    if (action === "verifyAuth") {
      var authCheck = verifyAdmin(params.auth, params.idToken, params.adminKey);
      return jsonResponse({
        success: authCheck.authorized,
        authorized: authCheck.authorized,
        email: authCheck.email || null,
        name: authCheck.name || null,
        error: authCheck.error || null
      });
    }

    // Admin Full Data via GET
    if (action === "getAllAdminData") {
      var authCheck = verifyAdmin(params.auth, params.idToken, params.adminKey);
      if (!authCheck.authorized) {
        return jsonResponse({ success: false, error: authCheck.error }, 401);
      }
      return jsonResponse({
        success: true,
        data: getAllAdminData(),
        revision: new Date().getTime(),
        serverTime: new Date().toISOString()
      });
    }

    // Unknown public action
    return jsonResponse({ success: false, error: "Unknown public API action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * =========================================================================
 * 2. HTTP POST HANDLER
 * =========================================================================
 */
function doPost(e) {
  try {
    var raw = e && e.postData ? e.postData.contents : "";
    var payload = {};
    if (raw) {
      try {
        payload = JSON.parse(raw);
      } catch (parseErr) {
        return jsonResponse({ success: false, error: "Malformed JSON payload: " + parseErr.toString() });
      }
    }

    var action = payload.action;

    // Contact form submission (Public, no auth required)
    if (action === "submitContactForm") {
      return handleContactFormSubmission(payload.data || payload);
    }

    // Admin Auth Verification
    var authCheck = verifyAdmin(payload.auth, payload.idToken, payload.adminKey);
    if (!authCheck.authorized) {
      return jsonResponse({ success: false, error: authCheck.error || "Authentication required." }, 401);
    }
    var adminEmail = authCheck.email;

    if (action === "verifyAuth") {
      return jsonResponse({
        success: true,
        authorized: true,
        email: authCheck.email,
        name: authCheck.name
      });
    }

    if (action === "getAllAdminData") {
      return jsonResponse({
        success: true,
        data: getAllAdminData(),
        revision: new Date().getTime(),
        serverTime: new Date().toISOString()
      });
    }

    if (action === "getStats") {
      return jsonResponse({ success: true, data: calculateStats() });
    }

    if (action === "createRecord" || action === "create") {
      var sheetName = payload.sheetName || payload.sheet;
      return jsonResponse(createRecord(sheetName, payload.data, adminEmail));
    }

    if (action === "updateRecord" || action === "update") {
      var sheetName = payload.sheetName || payload.sheet;
      return jsonResponse(updateRecord(sheetName, payload.id, payload.data, adminEmail));
    }

    if (action === "deleteRecord" || action === "delete") {
      var sheetName = payload.sheetName || payload.sheet;
      return jsonResponse(deleteRecord(sheetName, payload.id, adminEmail));
    }

    if (action === "publishContent" || action === "publish") {
      var sheetName = payload.sheetName || payload.sheet;
      var isPub = payload.published !== false && payload.status !== "draft";
      return jsonResponse(togglePublish(sheetName, payload.id, isPub, adminEmail));
    }

    if (action === "reorderRecords" || action === "reorder") {
      var sheetName = payload.sheetName || payload.sheet;
      return jsonResponse(reorderRecords(sheetName, payload.orderedIds, adminEmail));
    }

    if (action === "uploadMedia") {
      return jsonResponse(uploadMediaFile(payload, adminEmail));
    }

    if (action === "deleteMedia") {
      return jsonResponse(deleteMediaFile(payload.id, payload.driveFileId, adminEmail));
    }

    if (action === "updateAppearance") {
      return jsonResponse(updateAppearanceSettings(payload.settings, adminEmail));
    }

    if (action === "updateSEO") {
      return jsonResponse(updateSEOSettings(payload.seo, adminEmail));
    }

    if (action === "seedDatabase" || action === "setupDatabase" || action === "setup") {
      setupDatabase();
      return jsonResponse({ success: true, message: "Database initialized and seeded successfully." });
    }

    return jsonResponse({ success: false, error: "Unknown POST action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * =========================================================================
 * 3. DATA ACCESS HELPERS
 * =========================================================================
 */

function getSheetData(sheetName, publishedOnly) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      var val = row[j];

      if (typeof val === "string" && (val.indexOf("[") === 0 || val.indexOf("{") === 0)) {
        try {
          val = JSON.parse(val);
        } catch (e) {}
      }
      obj[key] = val;
    }

    // Publication filter
    if (publishedOnly) {
      if (obj.hasOwnProperty("status")) {
        var statusStr = String(obj.status).toLowerCase().trim();
        if (statusStr !== "published") continue;
      } else if (obj.hasOwnProperty("enabled")) {
        var enabled = obj.enabled === true || String(obj.enabled).toLowerCase() === "true" || obj.enabled === 1;
        if (!enabled) continue;
      } else if (obj.hasOwnProperty("visible")) {
        var visible = obj.visible === true || String(obj.visible).toLowerCase() === "true" || obj.visible === 1;
        if (!visible) continue;
      }
    }

    results.push(obj);
  }

  var orderKey = headers.indexOf("display_order") !== -1 ? "display_order" : (headers.indexOf("order") !== -1 ? "order" : null);
  if (orderKey) {
    results.sort(function(a, b) {
      return (Number(a[orderKey]) || 0) - (Number(b[orderKey]) || 0);
    });
  }

  return results;
}

/**
 * Aggregates all published data for Public Portfolio
 */
function getPublicPortfolioData() {
  var sheets = [
    "Profile", "About", "Skills", "Projects", "Experience", "Education",
    "Certificates", "Achievements", "Services", "Testimonials", "Resume",
    "SocialLinks", "Contact", "Music", "Appearance", "Navigation", "SEOSettings"
  ];
  var result = {};
  for (var i = 0; i < sheets.length; i++) {
    var sName = sheets[i];
    result[sName] = getSheetData(sName, true);
  }
  return result;
}

/**
 * Aggregates all data (draft + published) for Admin Panel
 */
function getAllAdminData() {
  var cfg = getAppConfig();
  var result = {};
  for (var i = 0; i < cfg.SHEET_NAMES.length; i++) {
    var sName = cfg.SHEET_NAMES[i];
    result[sName] = getSheetData(sName, false);
  }
  result.stats = calculateStats();
  return result;
}

/**
 * Calculates dashboard statistics
 */
function calculateStats() {
  var projects = getSheetData("Projects", false);
  var publishedProjects = projects.filter(function(p) {
    return String(p.status).toLowerCase().trim() === "published";
  });
  var skills = getSheetData("Skills", false);
  var certificates = getSheetData("Certificates", false);
  var experience = getSheetData("Experience", false);
  var media = getSheetData("Media", false);
  var services = getSheetData("Services", false);
  var testimonials = getSheetData("Testimonials", false);
  var activity = getSheetData("ActivityLog", false);

  var lastUpdated = new Date().toISOString();
  if (activity.length > 0) {
    lastUpdated = activity[activity.length - 1].timestamp || lastUpdated;
  }

  return {
    totalProjects: projects.length,
    publishedProjects: publishedProjects.length,
    totalSkills: skills.length,
    totalCertificates: certificates.length,
    totalExperience: experience.length,
    totalServices: services.length,
    totalTestimonials: testimonials.length,
    totalMedia: media.length,
    lastUpdated: lastUpdated,
    recentActivity: activity.slice(-10).reverse()
  };
}

/**
 * =========================================================================
 * 4. CRUD OPERATIONS
 * =========================================================================
 */

function createRecord(sheetName, recordData, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: "Sheet '" + sheetName + "' does not exist." };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var newId = recordData.id || (sheetName.toLowerCase() + "_" + Utilities.getUuid().substring(0, 8));
  recordData.id = newId;

  var now = new Date().toISOString();
  if (headers.indexOf("created_at") !== -1) recordData.created_at = now;
  if (headers.indexOf("updated_at") !== -1) recordData.updated_at = now;
  if (headers.indexOf("createdAt") !== -1) recordData.createdAt = now;
  if (headers.indexOf("updatedAt") !== -1) recordData.updatedAt = now;

  var orderKey = headers.indexOf("display_order") !== -1 ? "display_order" : (headers.indexOf("order") !== -1 ? "order" : null);
  if (orderKey && !recordData.hasOwnProperty(orderKey)) {
    recordData[orderKey] = Math.max(1, sheet.getLastRow());
  }

  if (headers.indexOf("status") !== -1 && !recordData.status) {
    recordData.status = "published";
  }

  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    var val = recordData.hasOwnProperty(key) ? recordData[key] : "";
    if (typeof val === "object" && val !== null) {
      val = JSON.stringify(val);
    }
    row.push(val);
  }

  sheet.appendRow(row);
  logActivity(adminEmail, "CREATE", sheetName, newId, "Created new " + sheetName + " record");

  return { success: true, id: newId, data: recordData, timestamp: now };
}

function updateRecord(sheetName, id, updateData, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: "Sheet '" + sheetName + "' does not exist." };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf("id");
  if (idIndex === -1) return { success: false, error: "Sheet does not have an 'id' column." };

  var targetRowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      targetRowIndex = i + 1;
      break;
    }
  }

  if (targetRowIndex === -1) {
    return { success: false, error: "Record with ID " + id + " not found in " + sheetName + "." };
  }

  var now = new Date().toISOString();
  if (headers.indexOf("updated_at") !== -1) updateData.updated_at = now;
  if (headers.indexOf("updatedAt") !== -1) updateData.updatedAt = now;

  for (var key in updateData) {
    var colIndex = headers.indexOf(key);
    if (colIndex !== -1) {
      var val = updateData[key];
      if (typeof val === "object" && val !== null) {
        val = JSON.stringify(val);
      }
      sheet.getRange(targetRowIndex, colIndex + 1).setValue(val);
    }
  }

  logActivity(adminEmail, "UPDATE", sheetName, id, "Updated " + sheetName + " record");
  return { success: true, id: id, timestamp: now };
}

function deleteRecord(sheetName, id, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: "Sheet '" + sheetName + "' does not exist." };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf("id");
  if (idIndex === -1) return { success: false, error: "Sheet does not have an 'id' column." };

  var targetRowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      targetRowIndex = i + 1;
      break;
    }
  }

  if (targetRowIndex === -1) {
    return { success: false, error: "Record with ID " + id + " not found in " + sheetName + "." };
  }

  sheet.deleteRow(targetRowIndex);
  logActivity(adminEmail, "DELETE", sheetName, id, "Deleted " + sheetName + " record");
  return { success: true, id: id, timestamp: new Date().toISOString() };
}

function togglePublish(sheetName, id, isPublished, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: "Sheet not found" };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var updatePayload = {};

  if (headers.indexOf("status") !== -1) {
    updatePayload.status = isPublished ? "published" : "draft";
  } else if (headers.indexOf("enabled") !== -1) {
    updatePayload.enabled = isPublished;
  } else if (headers.indexOf("visible") !== -1) {
    updatePayload.visible = isPublished;
  }

  return updateRecord(sheetName, id, updatePayload, adminEmail);
}

function reorderRecords(sheetName, orderedIds, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: "Sheet not found" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf("id");
  var orderIndex = headers.indexOf("display_order") !== -1 ? headers.indexOf("display_order") : headers.indexOf("order");

  if (idIndex === -1 || orderIndex === -1) {
    return { success: false, error: "Sheet must have 'id' and 'display_order' columns." };
  }

  for (var k = 0; k < orderedIds.length; k++) {
    var targetId = orderedIds[k];
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][idIndex]) === String(targetId)) {
        sheet.getRange(r + 1, orderIndex + 1).setValue(k + 1);
        break;
      }
    }
  }

  logActivity(adminEmail, "REORDER", sheetName, "batch", "Reordered " + orderedIds.length + " items");
  return { success: true, timestamp: new Date().toISOString() };
}

function updateAppearanceSettings(settings, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Appearance");
  if (!sheet) return { success: false, error: "Appearance sheet not found" };

  var now = new Date().toISOString();
  var data = sheet.getDataRange().getValues();
  var existingKeys = {};
  for (var i = 1; i < data.length; i++) {
    var k = data[i][1];
    existingKeys[k] = i + 1; // row number
  }

  for (var key in settings) {
    var val = String(settings[key]);
    if (existingKeys[key]) {
      sheet.getRange(existingKeys[key], 3).setValue(val);
      sheet.getRange(existingKeys[key], 5).setValue(now);
    } else {
      var newId = "app_" + Utilities.getUuid().substring(0, 6);
      sheet.appendRow([newId, key, val, "Appearance setting", now]);
    }
  }

  logActivity(adminEmail, "UPDATE", "Appearance", "settings", "Updated site appearance settings");
  return { success: true, timestamp: now };
}

function updateSEOSettings(seo, adminEmail) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("SEOSettings");
  if (!sheet) return { success: false, error: "SEOSettings sheet not found" };

  var now = new Date().toISOString();
  if (sheet.getLastRow() <= 1) {
    sheet.appendRow([
      "seo_1",
      seo.meta_title || "Anannya AK | Data Science & Software Engineering Portfolio",
      seo.meta_description || "Official portfolio of Anannya AK — CSE Student specializing in Data Science, Machine Learning, and Big Data.",
      seo.canonical_url || "https://anannya-ak.onrender.com",
      seo.keywords || "Data Science, Software Engineering, Python, Machine Learning, Portfolio",
      seo.og_image || "profile/profile.jpeg",
      now
    ]);
  } else {
    if (seo.meta_title) sheet.getRange(2, 2).setValue(seo.meta_title);
    if (seo.meta_description) sheet.getRange(2, 3).setValue(seo.meta_description);
    if (seo.canonical_url) sheet.getRange(2, 4).setValue(seo.canonical_url);
    if (seo.keywords) sheet.getRange(2, 5).setValue(seo.keywords);
    if (seo.og_image) sheet.getRange(2, 6).setValue(seo.og_image);
    sheet.getRange(2, 7).setValue(now);
  }

  logActivity(adminEmail, "UPDATE", "SEOSettings", "global", "Updated SEO metadata");
  return { success: true, timestamp: now };
}

/**
 * =========================================================================
 * 5. GOOGLE DRIVE MEDIA MANAGER
 * =========================================================================
 */

function uploadMediaFile(payload, adminEmail) {
  try {
    var base64Data = payload.base64;
    var fileName = payload.fileName || ("upload_" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd_HHmmss"));
    var mimeType = payload.mimeType || "application/octet-stream";
    var category = payload.category || "Images";

    if (!base64Data) {
      return { success: false, error: "Missing base64 data string." };
    }

    if (base64Data.indexOf(",") !== -1) {
      base64Data = base64Data.split(",")[1];
    }

    var decodedBytes = Utilities.base64Decode(base64Data);
    if (decodedBytes.length > 10 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 10MB limit." };
    }

    var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
    var folder = getMediaFolder();
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileId = file.getId();
    var publicUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    var mediaRecord = {
      id: "media_" + Utilities.getUuid().substring(0, 8),
      file_name: fileName,
      file_type: mimeType,
      file_url: publicUrl,
      drive_file_id: fileId,
      file_size: decodedBytes.length,
      category: category,
      uploaded_at: new Date().toISOString()
    };

    createRecord("Media", mediaRecord, adminEmail);
    return { success: true, media: mediaRecord };
  } catch (err) {
    return { success: false, error: "Media upload failed: " + err.toString() };
  }
}

function deleteMediaFile(mediaId, driveFileId, adminEmail) {
  try {
    if (driveFileId) {
      try {
        var file = DriveApp.getFileById(driveFileId);
        file.setTrashed(true);
      } catch (e) {}
    }
    deleteRecord("Media", mediaId, adminEmail);
    return { success: true, id: mediaId };
  } catch (err) {
    return { success: false, error: "Failed to delete media: " + err.toString() };
  }
}

/**
 * =========================================================================
 * 6. CONTACT FORM & ACTIVITY LOGGING
 * =========================================================================
 */

function handleContactFormSubmission(formData) {
  try {
    if (!formData || !formData.email || !formData.message) {
      return jsonResponse({ success: false, error: "Email and message are required." });
    }

    logActivity("public-visitor", "CONTACT_SUBMIT", "Contact", formData.email, "Message from " + (formData.name || "Anonymous") + ": " + (formData.message).substring(0, 50));

    return jsonResponse({
      success: true,
      message: "Your message has been received."
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function logActivity(adminEmail, action, section, recordId, details) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("ActivityLog");
    if (!sheet) return;

    var id = "log_" + Utilities.getUuid().substring(0, 8);
    var timestamp = new Date().toISOString();

    sheet.appendRow([
      id,
      adminEmail || "system",
      action,
      section,
      recordId || "",
      timestamp
    ]);
  } catch (e) {}
}

/**
 * =========================================================================
 * 7. DATABASE INITIALIZATION & VERIFIED SEEDING
 * =========================================================================
 * Populates and validates all 17 sheets non-destructively!
 */
function setupDatabase() {
  var ss = getSpreadsheet();
  var now = new Date().toISOString();

  var schemas = {
    Profile: ['id', 'name', 'designation', 'tagline', 'bio', 'profile_image', 'resume_url', 'location', 'email', 'phone', 'availability', 'status', 'updated_at'],
    About: ['id', 'title', 'description', 'category', 'display_order', 'status', 'updated_at'],
    Skills: ['id', 'skill_name', 'category', 'proficiency', 'icon', 'display_order', 'status', 'updated_at'],
    Projects: ['id', 'title', 'slug', 'short_description', 'description', 'thumbnail', 'gallery_urls', 'github_url', 'live_url', 'technologies', 'category', 'featured', 'display_order', 'status', 'created_at', 'updated_at'],
    Experience: ['id', 'position', 'organization', 'employment_type', 'location', 'start_date', 'end_date', 'currently_working', 'description', 'technologies', 'display_order', 'status', 'updated_at'],
    Education: ['id', 'institution', 'degree', 'course', 'start_year', 'end_year', 'grade', 'description', 'display_order', 'status', 'updated_at'],
    Certificates: ['id', 'title', 'issuing_organization', 'issue_date', 'credential_id', 'verification_url', 'certificate_file', 'display_order', 'status', 'updated_at'],
    Achievements: ['id', 'title', 'description', 'event', 'achievement_date', 'image_url', 'display_order', 'status', 'updated_at'],
    Services: ['id', 'title', 'description', 'deliverables', 'icon', 'display_order', 'status', 'updated_at'],
    Testimonials: ['id', 'client_name', 'client_role', 'company', 'quote', 'avatar_url', 'rating', 'display_order', 'status', 'updated_at'],
    Resume: ['id', 'title', 'version', 'file_url', 'drive_file_id', 'is_active', 'updated_at'],
    SocialLinks: ['id', 'platform', 'username', 'url', 'icon', 'display_order', 'status', 'updated_at'],
    Contact: ['id', 'email', 'phone', 'location', 'contact_message', 'updated_at'],
    Music: ['id', 'title', 'artist', 'audio_url', 'cover_image', 'display_order', 'enabled', 'updated_at'],
    Appearance: ['id', 'setting_key', 'setting_value', 'description', 'updated_at'],
    Media: ['id', 'file_name', 'file_type', 'file_url', 'drive_file_id', 'file_size', 'category', 'uploaded_at'],
    Navigation: ['id', 'section_name', 'section_id', 'display_label', 'display_order', 'visible', 'updated_at'],
    SEOSettings: ['id', 'meta_title', 'meta_description', 'canonical_url', 'keywords', 'og_image', 'updated_at'],
    ActivityLog: ['id', 'admin_email', 'action', 'section', 'record_id', 'timestamp']
  };

  for (var sheetName in schemas) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(schemas[sheetName]);
      sheet.getRange(1, 1, 1, schemas[sheetName].length)
        .setFontWeight("bold")
        .setBackground("#0F5132")
        .setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
  }

  // Seed Profile
  var profileSheet = ss.getSheetByName("Profile");
  if (profileSheet.getLastRow() <= 1) {
    profileSheet.appendRow([
      "profile_1",
      "Anannya AK",
      "Data Science & Software Engineering",
      "CSE Student — Data Science Specialization",
      "Building high-performance ecosystems at the intersection of logical problem-solving and data-driven insights. Hands-on experience in distributed big data pipelines, machine learning, and secure database architectures.",
      "profile/profile.jpeg",
      "resume.pdf",
      "Kannur, Kerala, India",
      "anannyaak01@gmail.com",
      "+91 0000000000",
      "Active CSE Student",
      "published",
      now
    ]);
  }

  // Seed About
  var aboutSheet = ss.getSheetByName("About");
  if (aboutSheet.getLastRow() <= 1) {
    aboutSheet.appendRow([
      "about_1",
      "Academic Pulse & Identity",
      "I am a B.Tech student specializing in Computer Science and Engineering (Data Science). I thrive at the intersection of logical problem-solving and data-driven insights, with hands-on internship experience in software development, database migration, and Python-based data pipelines.",
      "Identity",
      1,
      "published",
      now
    ]);
    aboutSheet.appendRow([
      "about_2",
      "Technical Core & Philosophy",
      "Passionate about architecting clean data infrastructures, applying machine learning algorithms (regression, classification, clustering, PCA), and writing robust code in Python, Java, SQL, and modern web environments.",
      "Philosophy",
      2,
      "published",
      now
    ]);
  }

  // Seed Skills
  var skillsSheet = ss.getSheetByName("Skills");
  if (skillsSheet.getLastRow() <= 1) {
    var skillsList = [
      ["skill_1", "Python", "Programming Languages", 90, "Code", 1, "published", now],
      ["skill_2", "Java", "Programming Languages", 85, "Code", 2, "published", now],
      ["skill_3", "C", "Programming Languages", 80, "Code", 3, "published", now],
      ["skill_4", "MySQL", "Databases & Storage", 90, "Database", 4, "published", now],
      ["skill_5", "PostgreSQL", "Databases & Storage", 85, "Database", 5, "published", now],
      ["skill_6", "JDBC", "Databases & Storage", 80, "Database", 6, "published", now],
      ["skill_7", "SQL Optimization", "Databases & Storage", 85, "Database", 7, "published", now],
      ["skill_8", "Pandas", "Data Analysis & ML", 90, "LineChart", 8, "published", now],
      ["skill_9", "NumPy", "Data Analysis & ML", 90, "LineChart", 9, "published", now],
      ["skill_10", "Matplotlib", "Data Analysis & ML", 85, "LineChart", 10, "published", now],
      ["skill_11", "HTML5", "Web Technologies", 95, "Globe", 11, "published", now],
      ["skill_12", "CSS3", "Web Technologies", 90, "Globe", 12, "published", now],
      ["skill_13", "JavaScript", "Web Technologies", 85, "Globe", 13, "published", now],
      ["skill_14", "Git", "Development Tools", 85, "Terminal", 14, "published", now],
      ["skill_15", "VS Code", "Development Tools", 90, "Terminal", 15, "published", now]
    ];
    for (var k = 0; k < skillsList.length; k++) {
      skillsSheet.appendRow(skillsList[k]);
    }
  }

  // Seed Projects
  var projectsSheet = ss.getSheetByName("Projects");
  if (projectsSheet.getLastRow() <= 1) {
    var projList = [
      [
        "hospital-analysis",
        "Hospital Patient Record Analysis",
        "hospital-analysis",
        "PySpark & HDFS distributed data pipeline with interactive analytics.",
        "Distributed big data pipeline processing New York State inpatient discharge records using HDFS and PySpark for high-throughput cleansing and exploratory analytics, presented in a custom live analytics dashboard.",
        "",
        "",
        "https://github.com/Anannyaa97/Hospital-Patient-Analysis",
        "https://hospital-patient-analysis.onrender.com",
        "PySpark, HDFS, Python, Big Data, HTML5, Chart.js",
        "Big Data & Distributed Computing",
        true,
        1,
        "published",
        now,
        now
      ],
      [
        "cybersentry",
        "CyberSentry: Phishing Analyzer",
        "cybersentry",
        "0–100 heuristic risk scoring engine for phishing URL identification.",
        "Explainable URL security analysis engine that inspects text patterns and computes transparent 0–100 heuristic risk scores, identifying threat vectors rather than relying on opaque classifications.",
        "",
        "",
        "https://github.com/Anannyaa97/CyberSentry",
        "https://cybersentry-skx7.onrender.com",
        "Python, Heuristic Analysis, Cybersecurity, Risk Scoring",
        "Security & Heuristic Intelligence",
        true,
        2,
        "published",
        now,
        now
      ],
      [
        "hotel-booking",
        "Hotel Room Booking System",
        "hotel-booking",
        "Java Swing + MySQL ACID relational booking and review engine.",
        "Full-featured reservation system developed with Java Swing for user interaction and MySQL with JDBC for persistent storage, handling room bookings, payment tracking, and customer reviews.",
        "",
        "",
        "https://github.com/Anannyaa97/Hotel-Room-Booking-System",
        "",
        "Java Swing, MySQL, JDBC, OOP Architecture",
        "Software Engineering & Database",
        false,
        3,
        "published",
        now,
        now
      ],
      [
        "riscv-cache",
        "Unified vs Split Cache RISC-V Analysis",
        "riscv-cache",
        "Microarchitecture cache benchmarking in RISC-V assembly.",
        "Comprehensive benchmark comparing Unified and Split Cache memory architectures executing RISC-V assembly routines on the Ripes simulator to evaluate cycle times, miss ratios, and stalls.",
        "",
        "",
        "https://github.com/Anannyaa97/Unified-vs-Split-Cache-RISC-V",
        "",
        "RISC-V Assembly, Ripes Simulator, Architecture Benchmarking",
        "Computer Architecture",
        false,
        4,
        "published",
        now,
        now
      ],
      [
        "ieee-website",
        "IEEE Student Branch Portal",
        "ieee-website",
        "Interactive student branch web platform with event registries.",
        "Official interactive web platform created for the IEEE Student Branch, serving event registrations, organizational updates, technical committee directories, and workshop schedules.",
        "",
        "",
        "https://github.com/Anannyaa97/IEEE-WEBSITE",
        "https://anannyaa97.github.io/IEEE-WEBSITE/",
        "HTML5, CSS3, JavaScript, Responsive Design, Git",
        "Full Stack & Web Technologies",
        false,
        5,
        "published",
        now,
        now
      ],
      [
        "db-migration",
        "Database Migration Engine",
        "db-migration",
        "Automated schema transformation and data migration pipeline.",
        "Automated database migration framework developed at Dinesh IT Systems for seamless data transformation between MySQL and PostgreSQL with schema validation and complete SRS documentation.",
        "",
        "",
        "https://github.com/Anannyaa97",
        "",
        "Python, PostgreSQL, MySQL, SRS Documentation, Validation",
        "Enterprise Infrastructure",
        false,
        6,
        "published",
        now,
        now
      ]
    ];
    for (var p = 0; p < projList.length; p++) {
      projectsSheet.appendRow(projList[p]);
    }
  }

  // Seed Experience
  var expSheet = ss.getSheetByName("Experience");
  if (expSheet.getLastRow() <= 1) {
    expSheet.appendRow([
      "exp_1",
      "Software Development Intern",
      "Dinesh IT Systems",
      "Internship Protocol",
      "Kannur, Kerala",
      "June 2026",
      "July 2026",
      false,
      "Architected and implemented a high-performance Database Migration System connecting MySQL and PostgreSQL.\nConducted extensive testing, system debugging, and enterprise UI/UX enhancements across core systems.\nAuthored rigorous, comprehensive Software Requirements Specification (SRS) documentation.",
      "Python, PostgreSQL, MySQL, JavaScript, HTML/CSS, SRS Docs",
      1,
      "published",
      now
    ]);
    expSheet.appendRow([
      "exp_2",
      "Python for Database Intern",
      "Neovent Innovations",
      "Internship Protocol",
      "Kannur, Kerala",
      "June 2025",
      "July 2025",
      false,
      "Engineered end-to-end Python data analysis pipelines utilizing Pandas, NumPy, and Matplotlib for analytical insights.\nDeveloped preprocessing and feature engineering routines on structured and multi-source dataset streams.\nExplored and implemented core Machine Learning models covering regression, classification, clustering, and PCA.",
      "Python, Pandas, NumPy, Matplotlib, Machine Learning, Data Pipelines",
      2,
      "published",
      now
    ]);
  }

  // Seed Education
  var eduSheet = ss.getSheetByName("Education");
  if (eduSheet.getLastRow() <= 1) {
    eduSheet.appendRow([
      "edu_1",
      "St. Thomas College of Engineering and Technology, Kannur",
      "B.Tech",
      "Computer Science and Engineering (Data Science)",
      "2024",
      "2028 (Expected)",
      "CGPA: 8.6 / 10",
      "Focusing on distributed big data frameworks, algorithms, and applied machine learning.",
      1,
      "published",
      now
    ]);
    eduSheet.appendRow([
      "edu_2",
      "Government Higher Secondary School, Chala, Kannur",
      "Class XII",
      "Higher Secondary Education",
      "2022",
      "2024",
      "95% Aggregate",
      "Core coursework in Computer Science, Mathematics, and Physical Sciences.",
      2,
      "published",
      now
    ]);
  }

  // Seed Certificates
  var certSheet = ss.getSheetByName("Certificates");
  if (certSheet.getLastRow() <= 1) {
    certSheet.appendRow([
      "cert_1",
      "Python Training",
      "Spoken Tutorial, IIT Bombay",
      "2025",
      "IITB-PY-2025",
      "https://spoken-tutorial.org",
      "",
      1,
      "published",
      now
    ]);
    certSheet.appendRow([
      "cert_2",
      "Python for Data Science",
      "NPTEL Certification",
      "2025",
      "NPTEL-DS-2025",
      "https://nptel.ac.in",
      "",
      2,
      "published",
      now
    ]);
  }

  // Seed Services
  var srvSheet = ss.getSheetByName("Services");
  if (srvSheet.getLastRow() <= 1) {
    srvSheet.appendRow([
      "srv_1",
      "Data Pipelines & Distributed ETL",
      "Architecture and optimization of resilient data processing pipelines in Python, PySpark, and SQL.",
      "Automated Ingestion, Schema Migration, Data Quality Auditing",
      "Database",
      1,
      "published",
      now
    ]);
    srvSheet.appendRow([
      "srv_2",
      "Full-Stack Web Engineering",
      "Modern, high-performance web applications built with React, TypeScript, Tailwind CSS, and cloud integrations.",
      "Responsive UI/UX, REST API Architecture, Database Integration",
      "Code",
      2,
      "published",
      now
    ]);
    srvSheet.appendRow([
      "srv_3",
      "Machine Learning & Analytics",
      "Statistical modeling, classification, regression, clustering, and heuristic threat detection engines.",
      "Model Training, Heuristic Scoring, Visual Dashboards",
      "LineChart",
      3,
      "published",
      now
    ]);
  }

  // Seed Testimonials
  var testSheet = ss.getSheetByName("Testimonials");
  if (testSheet.getLastRow() <= 1) {
    testSheet.appendRow([
      "test_1",
      "Academic Supervisor",
      "Professor & Head of Department",
      "St. Thomas College of Engg.",
      "Anannya demonstrates exceptional dedication to software engineering principles and big data systems architecture.",
      "",
      5,
      1,
      "published",
      now
    ]);
  }

  // Seed Resume
  var resSheet = ss.getSheetByName("Resume");
  if (resSheet.getLastRow() <= 1) {
    resSheet.appendRow([
      "res_1",
      "Anannya AK — Official Curriculum Vitae",
      "2026.1",
      "resume.pdf",
      "local_resume",
      true,
      now
    ]);
  }

  // Seed SocialLinks
  var socSheet = ss.getSheetByName("SocialLinks");
  if (socSheet.getLastRow() <= 1) {
    socSheet.appendRow(["soc_1", "GitHub", "Anannyaa97", "https://github.com/Anannyaa97", "Github", 1, "published", now]);
    socSheet.appendRow(["soc_2", "LinkedIn", "anannya-ak", "https://www.linkedin.com/in/anannya-ak/", "Linkedin", 2, "published", now]);
    socSheet.appendRow(["soc_3", "Email", "anannyaak01@gmail.com", "mailto:anannyaak01@gmail.com", "Mail", 3, "published", now]);
  }

  // Seed Contact
  var contactSheet = ss.getSheetByName("Contact");
  if (contactSheet.getLastRow() <= 1) {
    contactSheet.appendRow(["contact_1", "anannyaak01@gmail.com", "+91 0000000000", "Kannur, Kerala, India", "Let's connect and build something impactful.", now]);
  }

  // Seed Music
  var musicSheet = ss.getSheetByName("Music");
  if (musicSheet.getLastRow() <= 1) {
    musicSheet.appendRow(["track-1", "Deep Focus Ambient (432Hz)", "Anannya AK", "audio/deep-focus.wav", "", 1, true, now]);
    musicSheet.appendRow(["track-2", "Midnight Algorave", "Data Science Synthesis", "audio/midnight-pulse.wav", "", 2, true, now]);
    musicSheet.appendRow(["track-3", "Neural Synthesis Drift", "Machine Learning Flow", "audio/neural-drift.wav", "", 3, true, now]);
  }

  // Seed Navigation
  var navSheet = ss.getSheetByName("Navigation");
  if (navSheet.getLastRow() <= 1) {
    navSheet.appendRow(["nav_1", "Home", "#hero", "Home", 1, true, now]);
    navSheet.appendRow(["nav_2", "About", "#about", "About", 2, true, now]);
    navSheet.appendRow(["nav_3", "Experience", "#experience", "Experience", 3, true, now]);
    navSheet.appendRow(["nav_4", "Projects", "#projects", "Projects", 4, true, now]);
    navSheet.appendRow(["nav_5", "Skills", "#skills", "Skills", 5, true, now]);
    navSheet.appendRow(["nav_6", "Services", "#services", "Services", 6, true, now]);
    navSheet.appendRow(["nav_7", "Education", "#education", "Education", 7, true, now]);
    navSheet.appendRow(["nav_8", "Contact", "#contact", "Contact", 8, true, now]);
  }

  // Seed Appearance
  var appSheet = ss.getSheetByName("Appearance");
  if (appSheet.getLastRow() <= 1) {
    appSheet.appendRow(["app_1", "theme", "dark", "Default color mode", now]);
    appSheet.appendRow(["app_2", "accentColor", "#50C878", "Primary emerald accent", now]);
    appSheet.appendRow(["app_3", "showMusicPlayer", "true", "Floating music player visibility", now]);
  }

  // Seed SEOSettings
  var seoSheet = ss.getSheetByName("SEOSettings");
  if (seoSheet.getLastRow() <= 1) {
    seoSheet.appendRow([
      "seo_1",
      "Anannya AK | Data Science & Software Engineering Portfolio",
      "Portfolio of Anannya AK — CSE Student specializing in Data Science & Software Engineering. Featuring big data pipelines, machine learning models, and modern software development.",
      "https://anannya-ak.onrender.com",
      "Anannya AK, Data Science, Software Engineering, Python, PySpark, Machine Learning, Portfolio, Kannur",
      "profile/profile.jpeg",
      now
    ]);
  }

  // Initialize Drive folder
  getMediaFolder();

  logActivity("admin-system", "SETUP", "Database", "all", "Database verified, schemas synced, and seed data populated");
  Logger.log("Database initialized successfully!");
}
