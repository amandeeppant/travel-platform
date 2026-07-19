// @ts-check
/**
 * Train Import Script
 * Usage: npm run trains:import
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Simple Prisma client setup
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importTrainSchedules() {
  console.log('🚂 Starting train schedules import...');
  console.log('━'.repeat(60));

  const startTime = Date.now();
  const stats = {
    totalRecordsRead: 0,
    uniqueTrains: new Set(),
    uniqueStations: new Set(),
    trainsInserted: 0,
    stopsInserted: 0,
    duration: 0,
    success: false,
  };

  try {
    // Find the schedules_pretty.json file
    const projectRoot = path.join(__dirname, '..');
    const workspaceRoot = path.join(projectRoot, '..');
    const schedulesPath = path.join(workspaceRoot, 'schedules_pretty.json');

    if (!fs.existsSync(schedulesPath)) {
      throw new Error(`schedules_pretty.json not found at ${schedulesPath}`);
    }

    console.log(`📂 Reading from: ${schedulesPath}`);

    // Group records by train number
    const trainGroups = new Map();
    const stationSet = new Set();

    // Read file line by line
    const fileStream = fs.createReadStream(schedulesPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '[' || trimmed === ']') continue;

      try {
        const jsonStr = trimmed.replace(/,$/, '');
        const record = JSON.parse(jsonStr);

        stats.totalRecordsRead++;
        lineCount++;

        if (lineCount % 100000 === 0) {
          console.log(`  ⏳ Processed ${lineCount.toLocaleString()} records...`);
        }

        if (!record.train_number || !record.station_code) continue;

        stats.uniqueTrains.add(record.train_number);
        stats.uniqueStations.add(record.station_code);

        if (!trainGroups.has(record.train_number)) {
          trainGroups.set(record.train_number, []);
        }
        trainGroups.get(record.train_number).push(record);
      } catch (e) {
        // Skip invalid JSON
      }
    }

    console.log(`📊 Read ${stats.totalRecordsRead.toLocaleString()} records`);

    // Process records: sort by id within each train
    const processedTrains = [];
    const processedStops = [];

    for (const [trainNumber, records] of trainGroups.entries()) {
      // Sort by id ascending to get correct sequence
      records.sort((a, b) => a.id - b.id);

      const firstRecord = records[0];
      const lastRecord = records[records.length - 1];

      processedTrains.push({
        trainNumber,
        trainName: firstRecord.train_name || '',
        sourceStationCode: firstRecord.station_code,
        destinationStationCode: lastRecord.station_code,
        totalStops: records.length,
      });

      records.forEach((record, idx) => {
        processedStops.push({
          trainNumber,
          stationCode: record.station_code,
          stopSequence: idx + 1,
          arrival: record.arrival || null,
          departure: record.departure || null,
          day: record.day || 1,
        });
      });
    }

    // Insert into database in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing data
      await tx.trainStop.deleteMany();
      await tx.train.deleteMany();
      await tx.station.deleteMany();

      // Insert stations
      const stations = Array.from(stats.uniqueStations).map(code => {
        const stationName = Array.from(trainGroups.values())
          .flat()
          .find(r => r.station_code === code)?.station_name || code;
        return {
          code,
          name: stationName,
        };
      });

      if (stations.length > 0) {
        await tx.station.createMany({
          data: stations,
        });
      }

      // Insert trains
      if (processedTrains.length > 0) {
        await tx.train.createMany({
          data: processedTrains,
        });
        stats.trainsInserted = processedTrains.length;
      }

      // Insert stops
      if (processedStops.length > 0) {
        await tx.trainStop.createMany({
          data: processedStops,
        });
        stats.stopsInserted = processedStops.length;
      }
    });

    stats.duration = Date.now() - startTime;
    stats.success = true;

    console.log('\n✅ Import completed successfully!');
    console.log('━'.repeat(60));
    console.log('📊 Statistics:');
    console.log(`  • Total records read:    ${stats.totalRecordsRead.toLocaleString()}`);
    console.log(`  • Unique trains:         ${stats.uniqueTrains.size.toLocaleString()}`);
    console.log(`  • Unique stations:       ${stats.uniqueStations.size.toLocaleString()}`);
    console.log(`  • Trains inserted:       ${stats.trainsInserted.toLocaleString()}`);
    console.log(`  • Train stops inserted:  ${stats.stopsInserted.toLocaleString()}`);
    console.log(`  • Duration:              ${(stats.duration / 1000).toFixed(2)}s`);
    console.log('━'.repeat(60));

    return stats;
  } catch (error) {
    console.error('\n❌ Import failed:');
    console.error(error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run import
importTrainSchedules().catch((error) => {
  console.error(error);
  process.exit(1);
});
