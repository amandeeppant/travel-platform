import { trainImportService } from './src/lib/trainImportPipeline.js';

async function main() {
  console.log('🚂 Starting train schedules import...');
  console.log('━'.repeat(60));

  try {
    const stats = await trainImportService.importTrainSchedules();

    console.log('\n✅ Import completed successfully!');
    console.log('━'.repeat(60));
    console.log(`📊 Statistics:`);
    console.log(`  • Total records read:    ${stats.totalRecordsRead}`);
    console.log(`  • Unique trains:         ${stats.uniqueTrains}`);
    console.log(`  • Unique stations:       ${stats.uniqueStations}`);
    console.log(`  • Trains inserted:       ${stats.trainsInserted}`);
    console.log(`  • Train stops inserted:  ${stats.stopsInserted}`);
    console.log(`  • Duration:              ${stats.duration}ms`);
    console.log('━'.repeat(60));
  } catch (error) {
    console.error('\n❌ Import failed:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
