// Class import
const TwitterBot = require('../TwitterBot/TwitterBot.js');
const DBconnection = require('../DBconnection/DBconnection.js');
const Statistics = require('../Statistics/Statistics.js');
const Charts = require('../Statistics/Charts.js');

// utils function import
const getFormattedDate = require('../utils/getFormattedDate.js');
const sleep = require('../utils/sleep.js');

// Objects instanciation
let twitterBot = new TwitterBot();
let dbConnection = new DBconnection();
let statistics = new Statistics(dbConnection);
let charts = new Charts();

// Connection to the database
dbConnection.connect()

// Get week statistics
statistics.get("covid_stats", "new_cases", 7)
    .then((weekStatistics => {
        // Create the statistics chart and download it locally
        charts.create("Nombre de nouveaux cas recensés", 418, 800, weekStatistics);
        charts.download();
    })).then(async () => {
        // Wait 5 seconds for the statistics chart to be written on the file system
        await sleep(5000);
        // Tweet the statistics chart
        var date = getFormattedDate(new Date());
        twitterBot.tweetMedia(`../chart_${date}.png`, 'Graphe sur le nombre de nouveaux cas recensés cette semaine');
    })

// Disconnection to the database
dbConnection.disconnect();