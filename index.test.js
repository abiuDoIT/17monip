const findIp = require('./index');

function get_random(max) {
    return Math.floor(Math.random() * max);
}
function get_random_ip() {
    return [get_random(256), get_random(256), get_random(256), get_random(256)].join('.');
}
function test_time(ip_num){
    ip_num = ip_num||Math.pow(10,6);
    let ip_arr = Array.from(new Array(ip_num),d=>get_random_ip());
    console.log("start ..")
    let start_at = Date.now()
    ip_arr.forEach(findIp);
    console.log("end ,find "+ip_num+" ip, cost time:",Date.now()-start_at+"ms");
}
test_time()
