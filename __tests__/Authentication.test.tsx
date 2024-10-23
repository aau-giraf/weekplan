const zapier = require('zapier-platform-core');

zapier.tools.env.inject();

const App = require('../index');
const appTester = zapier.createAppTester(App);

