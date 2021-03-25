const DBconnection = require('./DBconnection.js');
const getFormattedDate = require('../utils/getFormattedDate.js');


class Statistics {

    constructor() {
        this.DBconnection = new DBconnection();
    }

    add(dataCovid) {
        var actualDate = new Date();
        actualDate.setHours(actualDate.getHours() + 1); // Date UTC + 1 (Belgium Time Zone)

        const statistics = {
            date: actualDate,
            data: dataCovid
        }
        this.DBconnection.insert("belgium-covid-tracker", "statistics", statistics);
    }

    async get(statisticType, statisticName, numberOfStatsFromNow) {
        return await new Promise(async (resolve, reject) => {
            var todayDate = new Date();
            var lastWeekDate = new Date();
            lastWeekDate.setDate(lastWeekDate.getDate() - numberOfStatsFromNow);

            var statistics = [];
            var documents = await this.DBconnection.getDocuments("belgium-covid-tracker", "statistics", lastWeekDate, todayDate);
            documents.forEach(statistic => {
                var statisticDate = getFormattedDate(statistic.date);

                if (statisticName === "new_cases") {
                    var statisticData = parseFloat(statistic.data[statisticType][statisticName].replace(',', "").replace("+", "")); // new_cases data have particular format in the database
                }
                else {
                    var statisticData = parseFloat(statistic.data[statisticType][statisticName]);
                }

                statistics.push({
                    date: statisticDate,
                    data: statisticData
                });
            })
            resolve(statistics);
        })
    }
}

module.exports = Statistics;