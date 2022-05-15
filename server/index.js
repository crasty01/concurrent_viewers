

require('module-alias')('.');
const { App } = require('deta');

const { Api } = require('$/lib/twitch');
const { DetaDatabaseService } = require("$/services/DetaDb")
const { ApiServer } = require("$/services/apiServer")
const { Scaper } = require("$/services/scraper")

const channels = [
    'cdubya719',
    'KrazeyHazey',
]


const api = new Api(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET, process.env.ACCESS_URL)

const dbServer = new DetaDatabaseService(undefined, channels.map(x => x.toLowerCase()))
const apiSvc = new ApiServer(dbServer)
const scraper = new Scaper(dbServer, api)

const app = App(apiSvc.app)


app.lib.cron(async event => {
    await scraper.Scrape()
    return "Scraping Done"
})


module.exports = app