

require('module-alias')('.');
const { App } = require('deta');

const { Api } = require('$/lib/twitch');
const { DetaDatabaseService } = require("$/services/DetaDb")
const  { AuthService, SessionService } =require( "$/services/Auth");

const { ApiServer } = require("$/services/apiServer")
const { Scaper } = require("$/services/scraper")

const channels = [
    'KrazeyHazey',
]


const twitchApi = new Api(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET)
const sessSvc = new SessionService(
    undefined,
    process.env.ACCESS_URL,
    process.env.TWITCH_CLIENT_ID,
    process.env.TWITCH_CLIENT_SECRET
)
const authSvc = new AuthService(undefined)
const db = new DetaDatabaseService(undefined, channels.map(x => x.toLowerCase()))

const apiSvc = new ApiServer(db, authSvc, sessSvc)
const scraper = new Scaper(db, twitchApi)

const app = App(apiSvc.app)

app.lib.cron(async event => {
    await scraper.Scrape()
    return "Scraping Done"
})

app.lib.run(async event =>{
    const {uid,channels}= JSON.parse(event.body)
    if (!uid){
        return "invalid UID"
    }
    if (!channels){
        return "missing channels"
    }
    let chans=[channels]

    if (typeof(channels)!=="string"){
        chans=[...channels]
    }

    await authSvc.SetAllowedChannels(uid,chans)
    

},'setacl')

module.exports = app