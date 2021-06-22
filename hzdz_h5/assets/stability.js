//稳定性监控代码
try {
    constconfig = {
        bid: 'fym_zzdpro',
        signkey: '1234567890abcdef',
        gateway: 'https://wpk-gate.zjzwfw.gov.cn'
    };
    constwpk = newwpkReporter(config);
    wpk.installAll();
    window._wpk = wpk;
} catch (err) {
    console.error('WpkReporterinitfail', err);
}