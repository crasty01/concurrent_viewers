

require('module-alias')('.');
const { App } = require('deta');

const { Api } = require('$/lib/twitch');
const { DetaDatabaseService } = require("$/services/DetaDb")
const { ApiServer } = require("$/services/apiServer")
const { Scaper } = require("$/services/scraper")

const channels = [
    'cdubya719'
]


const dbServer = new DetaDatabaseService(undefined, channels)
const apiSvc = new ApiServer(dbServer)


const app = App(apiSvc.app)


app.lib.cron(async event=>{
    const api=await Api.createApiClient(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET)
        
    const scraper = new Scaper(dbServer, api)
    await scraper.Scrape()
    return "Scraping Done"
})

module.exports = app