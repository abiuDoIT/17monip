const fs = require('fs');
const ccmap = require('./ccmap');
const cc = require('./cc.json')


function int2ip(num){
    return [num>>24&0xff,num>>16&0xff,num>>8&0xff,num&0xff].join('.')
}
function changeIpData(){
    const dataBuffer = fs.readFileSync('./17monipdb.dat');
    const offset = dataBuffer.readInt32BE(0);   
    const ipBuffer = dataBuffer.slice(1028,offset-1024);
    const countryBuffer = dataBuffer.slice(offset-1024,dataBuffer.length);
    
    let countries = {};
    for(i=0;i<ipBuffer.length;i=i+8){
        countries[[ipBuffer[i+4]+(ipBuffer[i+5]<<8)+(ipBuffer[i+6]<<16),ipBuffer[i+7]].join(',')] = 1;
    }
    let code_country = {};
    Object.keys(countries).forEach(function(data) {
        arr = data.split(',').map(data=>parseInt(data));
        let info = countryBuffer.slice(arr[0],arr[0]+arr[1]).toString('utf-8').split('\t');
        code_country[data] = ccmap[info[1]]||ccmap[info[0]]||"--";
    });
    // let newBufferArr = [Buffer.from([0,0,0,0]),Buffer.from([cc["--"]])],latest_code= '--';
    let newBufferArr = [],latest_code = '';
    let l1,l2;
    //ip段同化，即 如果相邻ip段为同个国家，则不分段，整合到一段
    for(let i=0;i<ipBuffer.length;i=i+8){
       
        let code = code_country[[ipBuffer[i+4]+(ipBuffer[i+5]<<8)+(ipBuffer[i+6]<<16),ipBuffer[i+7]].join(',')] ;
        if(code==latest_code){
            newBufferArr.pop();
            newBufferArr.pop();
        }
        latest_code = code;
        newBufferArr.push(ipBuffer.slice(i,i+4)) 
        newBufferArr.push(Buffer.from(new Uint8Array([cc[code]]))) 
    }
    fs.writeFileSync('./ip.dat',Buffer.concat(newBufferArr))
    console.log("change complete!")
    console.log(`数据格式为5字节一单位，前四字节为ip地址，第五字节为对应国家代码编号。 如前10字节为[0,255,255,255,0,1,0,3,255,2] 
    则表示 0.0.0.0-0,255,255,255IP段的国家编号为0，对应到cc.js即为 -- 。0,255,255,255-1,0,3,255ip段对应国家为 CN`)
}
function createIndex(){
   const ipBuffer = fs.readFileSync('./ip.dat');
   console.log(ipBuffer.length/5);

    function readPreIp(index){
        index = index*5;
        return (ipBuffer[index]<<8)+ipBuffer[index+1];
    }
    let bufferArr = [],latest_ip_index = 0;
   for(let j=0,i=0;j<Math.pow(2,16);j++){
       while(readPreIp(latest_ip_index)<j&&latest_ip_index<ipBuffer.length/5){
        latest_ip_index++;
       }
        bufferArr[j] = Buffer.from(new Uint32Array([latest_ip_index]).buffer).reverse();
   }
//    console.log(latest_ip_index,bufferArr.length);
   fs.writeFileSync('./index.dat',Buffer.concat(bufferArr));
   console.log("create index complete!")
   console.log("索引的数据结构为四子节一单位。假设第n个单位的Int值为m， 则所有ip段前16位Int值为n的ip，"+
   " 应该从ipBuffer的第m个单位找起，直到找到ipBuffer.ip>本身ip，ipBuffer.country即为所找国家代码")
}
changeIpData()
createIndex()
