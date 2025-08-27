#!/usr/bin/env node

// Simple runtime check to verify the system works
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkRuntime() {
  console.log("🔍 RUNTIME VERIFICATION CHECK");
  console.log("=" .repeat(40));
  
  try {
    // Check package.json
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = await readFile(packagePath, 'utf-8');
    const packageData = JSON.parse(packageContent);
    
    console.log("✅ Package.json loaded successfully");
    console.log(`📦 Project: ${packageData.name} v${packageData.version}`);
    console.log(`🔧 Type: ${packageData.type}`);
    
    // Check dependencies
    console.log("\n📋 Dependencies:");
    Object.entries(packageData.dependencies).forEach(([name, version]) => {
      console.log(`   • ${name}: ${version}`);
    });
    
    console.log("\n🎯 Available Scripts:");
    Object.entries(packageData.scripts).forEach(([name, script]) => {
      console.log(`   • npm run ${name}: ${script}`);
    });
    
    // Test basic imports
    console.log("\n🧪 Testing Core Modules...");
    
    // Dynamic imports to test
    await import('./CustomerManager.js');
    console.log("✅ CustomerManager module loaded");
    
    await import('./TaskManager.js');
    console.log("✅ TaskManager module loaded");
    
    await import('./ShipmentManager.js');
    console.log("✅ ShipmentManager module loaded");
    
    await import('./Dashboard.js');
    console.log("✅ Dashboard module loaded");
    
    await import('./CLI.js');
    console.log("✅ CLI module loaded");
    
    await import('./DataUtils.js');
    console.log("✅ DataUtils module loaded");
    
    await import('./validation.js');
    console.log("✅ Validation module loaded");
    
    console.log("\n🎉 ALL MODULES LOADED SUCCESSFULLY!");
    console.log("\n🚀 Your ShipmentManager is ready to run!");
    console.log("\n📋 Next Steps:");
    console.log("   1. Run 'npm run comprehensive-demo' for full feature demo");
    console.log("   2. Run 'npm start' for the main application");
    console.log("   3. Run 'npm run quickstart' for usage guide");
    console.log("   4. Run 'npm test' for basic functionality test");
    
  } catch (error) {
    console.error("❌ Runtime check failed:", error);
    
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.error("\n🔧 Module not found. Possible solutions:");
      console.error("   1. Run 'npm install' to install dependencies");
      console.error("   2. Check that all files exist in src/ directory");
      console.error("   3. Verify TypeScript configuration");
    }
    
    if (error.name === 'SyntaxError') {
      console.error("\n🔧 Syntax error detected. Check for:");
      console.error("   1. Missing imports or exports");
      console.error("   2. Incorrect TypeScript syntax");
      console.error("   3. Module resolution issues");
    }
    
    process.exit(1);
  }
}

checkRuntime();
