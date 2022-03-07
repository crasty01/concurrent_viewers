

require('module-alias')('.');

const { env } = require('$/lib/env');
const {DetaDatabaseService} = require("$/services/DetaDb")
const {ApiServer} = require("$/services/apiServer")



const apiSvc= new ApiServer(new DetaDatabaseService(undefined,['cdubya719']))


module.exports = apiSvc.app