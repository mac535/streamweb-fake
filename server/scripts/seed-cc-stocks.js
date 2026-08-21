#!/usr/bin/env node
/**
 * Seed Creative Corner Stocks Script
 * 
 * Reads the Stock Register CC 2026.xlsx file and generates a baseline 
 * cc_stocks_base.json file that can be duplicated for each CC school.
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const EXCEL_FALLBACK = process.argv[2] || path.resolve('c:/Users/maria/Downloads/Stock Register CC 2026.xlsx');
const CC_STOCKS_FILE = path.join(__dirname, '../data/cc_stocks_base.json');

async function main() {
  if (!fs.existsSync(EXCEL_FALLBACK)) {
    console.error(`❌ Excel file not found at: ${EXCEL_FALLBACK}`);
    process.exit(1);
  }

  console.log(`📄 Reading Excel file: ${EXCEL_FALLBACK}`);
  const workbook = XLSX.readFile(EXCEL_FALLBACK);
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(`   Found ${rows.length} rows in sheet "${sheetName}"`);

  const stocks = [];
  let currentCategory = 'Uncategorized';
  let processed = 0;

  for (const row of rows) {
    // If there is no 'Item name', it might be a category header row
    if (!row['Item name']) {
      if (row['Number'] && typeof row['Number'] === 'string') {
        // e.g., " 1. Hand Tools & Accessories: "
        let catStr = row['Number'].trim();
        // Remove leading numbers and dots like "1. "
        catStr = catStr.replace(/^\d+\.\s*/, '').replace(/:$/, '').trim();
        if (catStr) {
          currentCategory = catStr;
        }
      }
      continue;
    }

    const itemName = row['Item name'].trim();
    const slNo = row['Sl. No.'];
    const qty = parseInt(row['Unit per Lab'], 10) || 0;
    
    if (!itemName) continue;

    // Use Sl. No. as a base for uniqueId if present, else fallback
    const uniqueId = slNo ? `CC-${slNo}` : `CC-ITEM-${processed + 1}`;

    stocks.push({
      uniqueId: uniqueId.toString(),
      itemName: itemName,
      category: currentCategory,
      newQty: qty,
      availableQty: qty,
      usedQty: 0,
      damagedQty: 0,
      consumedQty: 0,
      section: 'Creative Corner',
      label: currentCategory,
      img: '', // Will use default category icons if image is missing
      status: 'ACTIVE'
    });

    processed++;
  }

  fs.writeFileSync(CC_STOCKS_FILE, JSON.stringify(stocks, null, 2));

  console.log(`\n✅ Generated ${stocks.length} baseline Creative Corner stock items.`);
  console.log(`📁 Saved to: ${CC_STOCKS_FILE}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
