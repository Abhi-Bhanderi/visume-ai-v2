// scripts/test-db-connection.ts
// Run with: npx tsx scripts/test-db-connection.ts
// (Install tsx: npm i -D tsx)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function testDatabaseConnection() {
  console.log("🔍 Testing Database Connection...\n");

  try {
    // Test 1: Basic Connection
    console.log("1️⃣ Testing basic connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully\n");

    // Test 2: Simple Query
    console.log("2️⃣ Testing simple query...");
    const resumeCount = await prisma.resume.count();
    console.log(`✅ Found ${resumeCount} resumes in database\n`);

    // Test 3: Transaction Test
    console.log("3️⃣ Testing transaction...");
    const startTime = Date.now();

    await prisma.$transaction(
      async (tx) => {
        // Simple transaction test
        await tx.resume.findMany({ take: 1 });
        console.log("   Transaction query executed...");
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ Transaction completed in ${duration}ms\n`);

    // Test 4: Connection Pool
    console.log("4️⃣ Testing connection pool...");
    const queries = Array(5)
      .fill(null)
      .map((_, i) => prisma.resume.findMany({ take: 1 }));
    await Promise.all(queries);
    console.log("✅ Connection pool working correctly\n");

    // Test 5: Large Transaction (simulating resume parse)
    console.log("5️⃣ Testing large transaction (resume parse simulation)...");
    const largeTransactionStart = Date.now();

    await prisma.$transaction(
      async (tx) => {
        // Simulate resume section creation
        for (let i = 0; i < 5; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate work
          console.log(`   Processing section ${i + 1}/5...`);
        }
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );

    const largeDuration = Date.now() - largeTransactionStart;
    console.log(`✅ Large transaction completed in ${largeDuration}ms\n`);

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ All tests passed!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nYour database connection is working correctly.");
    console.log("The transaction error might be due to:");
    console.log("  • Too much data being processed");
    console.log("  • Slow network to database");
    console.log("  • Resource constraints\n");
    console.log("💡 Try the optimized service version to fix this!");
  } catch (error) {
    console.error("\n❌ Database test failed!");
    console.error("\nError details:");
    console.error(error);

    if (error instanceof Error) {
      if (error.message.includes("P2028")) {
        console.log("\n📋 Solution for P2028:");
        console.log("  1. Add connection pool to DATABASE_URL:");
        console.log("     ?connection_limit=10&pool_timeout=60");
        console.log("  2. Use the optimized service version");
        console.log("  3. Restart your database");
      } else if (error.message.includes("timeout")) {
        console.log("\n📋 Solution for timeout:");
        console.log("  1. Check database is running");
        console.log("  2. Verify network connectivity");
        console.log("  3. Use smaller transaction batches");
      }
    }
  } finally {
    await prisma.$disconnect();
    console.log("\n🔌 Disconnected from database");
  }
}

testDatabaseConnection();
