#!/usr/bin/env node
/**
 * Seed Creative Corner Users Script
 * 
 * Reads the Creative_Corner_Matched_List_1.xlsx file and creates a CC user
 * for every school with UDISE+CC as the username and a common default password.
 * Outputs:
 *   - cc_users.json   (user objects with bcrypt-hashed passwords)
 *   - cc_credentials.csv (plaintext credentials for distribution)
 */

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const EXCEL_FALLBACK = process.argv[2] || path.resolve('c:/Users/maria/Downloads/Creative_Corner_Matched_List_1.xlsx');

const CC_USERS_FILE = path.join(__dirname, '../data/cc_users.json');
const CREDENTIALS_FILE = path.join(__dirname, '../data/cc_credentials.csv');

const DEFAULT_PASSWORD = 'Stream@CC2026';

async function main() {
  // Find the Excel file
  let excelPath = EXCEL_FALLBACK;
  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Excel file not found at: ${excelPath}`);
    console.error('   Pass the path as an argument: node seed-cc-users.js /path/to/file.xlsx');
    process.exit(1);
  }

  console.log(`📄 Reading Excel file: ${excelPath}`);
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(`   Found ${rows.length} rows in sheet "${sheetName}"`);

  // Hash the common default password once
  console.log(`🔑 Hashing default password...`);
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  const ccUsers = [];
  const csvRows = ['UDISE+CC Code,School Name,District,Username,Default Password'];
  let skipped = 0;

  for (const row of rows) {
    const code = (row['UDISE Code + CC'] || '').trim();
    const schoolName = (row['School Name (official)'] || '').trim();
    const district = (row['District'] || '').trim();

    if (!code || !schoolName) {
      skipped++;
      continue;
    }

    ccUsers.push({
      id: `cc-${code}`,
      email: `cc-${code.toLowerCase()}@stream.edu`,
      username: code,
      password: hashedPassword,
      name: `${district} / ${schoolName}`,
      brcCode: code,
      role: 'CREATIVE_CORNER',
      district: district,
      schoolName: schoolName,
      mustChangePassword: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    csvRows.push(`${code},${schoolName.replace(/,/g, ';')},${district},${code},${DEFAULT_PASSWORD}`);
    process.stdout.write(`\r  Processed ${ccUsers.length}/${rows.length}`);
  }

  fs.writeFileSync(CC_USERS_FILE, JSON.stringify(ccUsers, null, 2));
  fs.writeFileSync(CREDENTIALS_FILE, csvRows.join('\n'));

  console.log(`\n\n✅ Created ${ccUsers.length} Creative Corner users`);
  if (skipped > 0) console.log(`⚠️  Skipped ${skipped} rows (missing code or name)`);
  console.log(`📁 Users saved to: ${CC_USERS_FILE}`);
  console.log(`📋 Credentials CSV saved to: ${CREDENTIALS_FILE}`);
  console.log(`\n🔐 Default password for all users: ${DEFAULT_PASSWORD}`);
  console.log(`   Users will be forced to change password on first login.`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
