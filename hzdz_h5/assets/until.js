const host = {
    formal: 'https://fym.hzdzsngwh.com/index.php/api/',
    test: 'https://demo2.yunmofo.cn/east_station/index.php/api/'
};
const api = host['formal'];
const global = {
    addZero(num) {
        return num > 9 ? num : '0' + num;
    }
}