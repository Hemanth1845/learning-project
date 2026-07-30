const fs = require('fs');
const path = require('path');

const logUserActivity = (username, email, action, details) => {
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const logFile = path.join(logDir, 'user_activity.csv');
  const fileExists = fs.existsSync(logFile);
  
  const headers = 'Timestamp,Username,Email,Action,Details\n';
  const timestamp = new Date().toISOString();
  
  const escapedUsername = `"${(username || '').replace(/"/g, '""')}"`;
  const escapedEmail = `"${(email || '').replace(/"/g, '""')}"`;
  const escapedAction = `"${(action || '').replace(/"/g, '""')}"`;
  const escapedDetails = `"${(details || '').replace(/"/g, '""')}"`;
  
  const row = `${timestamp},${escapedUsername},${escapedEmail},${escapedAction},${escapedDetails}\n`;
  
  try {
    if (!fileExists) {
      fs.writeFileSync(logFile, headers + row);
    } else {
      fs.appendFileSync(logFile, row);
    }
  } catch (err) {
    console.error('CSV logging failed:', err);
  }
};

module.exports = { logUserActivity };
