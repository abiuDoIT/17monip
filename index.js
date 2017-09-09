const fs = require('fs')
const path = require('path')
const ipBuffer = fs.readFileSync(path.resolve(__dirname,'./ip.dat'));
const indexBuffer = fs.readFileSync(path.resolve(__dirname,'./index.dat'));
const cc = require('./cc.json');
let ccmap = {};
for(let key in cc){
    ccmap[cc[key]] = key;
}
const ipBufferLength = ipBuffer.length;

module.exports = function(ip){
    let ipInfo = ip.trim().split('.') ;
    let ipInt = new Buffer(ipInfo).readUInt32BE(0)
    const preIp = (ipInfo[0]<<8)+parseInt(ipInfo[1]);
    let start = indexBuffer.slice(preIp*4,preIp*4+4).readUInt32BE(0);
    let result = '--';
    for(let i = start*5;i<ipBufferLength;i= i+5){
        if(ipBuffer.slice(i,i+4).readUInt32BE(0)>=ipInt){
            result = ccmap[ipBuffer[i+4]]
            break;
        }
    }
    return result;
}



