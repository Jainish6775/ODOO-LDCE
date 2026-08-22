const app = require('./src/app');
const config = require('./src/config/env');

app.listen(config.port, () => {
  console.log(`\n🌍 GlobeTrotter API running on http://localhost:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Frontend URL: ${config.frontendUrl}\n`);
});
