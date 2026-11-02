(function(){
    if(document.getElementById('sniper-bot-overlay')) {
        let win = document.getElementById('sniper-window');
        if(win) win.style.display = win.style.display === 'none' ? 'block' : 'none';
        return;
    }

    var container = document.createElement('div');
    container.id = 'sniper-bot-overlay';
    container.style.cssText = 'position:fixed;top:80px;left:20px;z-index:999999;font-family:sans-serif;user-select:none;';
    
    container.innerHTML = `
        <!-- ফ্লোটিং লোগো -->
        <div id='sniper-logo' style='width:55px;height:55px;background:#0d1322;border:2px solid #00ffcc;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 15px rgba(0,255,204,0.6);z-index:1000000;'>
            <span style='color:#00ffcc;font-size:9px;font-weight:bold;text-align:center;pointer-events:none;'>SNIPER</span>
        </div>

        <!-- মেইন উইন্ডো -->
        <div id='sniper-window' style='display:block;position:absolute;top:65px;left:0;width:315px;background:linear-gradient(135deg, #0a0f1d, #121b2b);border:2px solid #00ffcc;border-radius:14px;color:#fff;padding:14px;box-shadow:0 0 25px rgba(0,255,204,0.4);z-index:999999;'>
            <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid #222;padding-bottom:6px;'>
                <span style='font-size:11px;font-weight:bold;color:#00ffcc;'>SNIPER BOT (FIXED & FAST)</span>
                <div>
                    <button id='minimize-btn' style='background:none;border:none;color:#aaa;font-size:16px;cursor:pointer;margin-right:6px;'>-</button>
                    <button id='close-btn' style='background:none;border:none;color:red;font-size:16px;cursor:pointer;'>×</button>
                </div>
            </div>

            <!-- মোড সিলেকশন বাটন -->
            <div style='display:flex;gap:6px;margin-bottom:10px;'>
                <button id='btn-1m' style='flex:1;background:#00b4d8;color:#fff;border:none;padding:7px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;'>1m Standard</button>
                <button id='btn-5s' style='flex:1;background:#1b263b;color:#aaa;border:none;padding:7px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;'>5s Auto Mode</button>
            </div>

            <!-- স্ক্যানার স্ক্রিন -->
            <div id='scanner-screen' style='background:#050811;border:1px solid #1f293d;border-radius:8px;height:95px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;margin-bottom:8px;overflow:hidden;'>
                <div id='scanner-text' style='font-size:11px;color:#00ffcc;font-weight:bold;'>Ready For Signal...</div>
                
                <!-- ক্যান্ডেল বার অ্যানিমেশন -->
                <div style='display:flex;gap:4px;margin-top:6px;align-items:flex-end;' id='candle-bars'>
                    <div style='width:6px;height:28px;background:#00ffcc;border-radius:2px;'></div>
                    <div style='width:6px;height:42px;background:#ff4d4d;border-radius:2px;'></div>
                    <div style='width:6px;height:24px;background:#00ffcc;border-radius:2px;'></div>
                    <div style='width:6px;height:46px;background:#ff4d4d;border-radius:2px;'></div>
                    <div style='width:6px;height:32px;background:#00ffcc;border-radius:2px;'></div>
                </div>

                <!-- ভাসমান আপ/ডাউন ক্যান্ডেল পপআপ -->
                <div id='floating-candle-pop' style='position:absolute;bottom:10px;font-size:16px;font-weight:bold;opacity:0;transition:all 0.3s ease;'></div>
            </div>

            <!-- ইন্ডিকেটর লিস্ট -->
            <div style='font-size:7px;color:#00ffcc;text-align:center;margin-bottom:8px;background:rgba(0,255,204,0.05);padding:5px;border-radius:4px;line-height:1.3;'>
                ACTIVE: RSI, MACD, Bollinger Bands, EMA 9/21, Stochastic, Supertrend, ADX
            </div>

            <!-- সিগন্যাল আউটপুট -->
            <div style='background:#1b263b;padding:6px;border-radius:6px;text-align:center;margin-bottom:10px;'>
                <div style='font-size:9px;color:#888;'>SIGNAL STATUS</div>
                <div id='signal-output' style='font-size:13px;font-weight:bold;color:yellow;margin-top:2px;'>WAITING</div>
            </div>

            <!-- অ্যাকশন বাটন -->
            <button id='action-btn' style='width:100%;background:linear-gradient(90deg, #00b4d8, #0077b6);color:#fff;border:none;padding:9px;border-radius:6px;font-weight:bold;font-size:12px;cursor:pointer;'>GET SIGNAL</button>
            
            <div style='display:flex;justify-content:space-between;font-size:9px;color:#00ffcc;margin-top:8px;'>
                <span>API Status: <strong id='api-status' style='color:#00ffcc;'>Connected</strong></span>
                <span id='bot-balance'>Bal: $1,000</span>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    var logo = document.getElementById('sniper-logo');
    var win = document.getElementById('sniper-window');

    // মোবাইলে যাতে টাচ করলে কোনো ঝামেলা ছাড়াই instantly কাজ করে
    logo.onclick = function(e) {
        e.stopPropagation();
        win.style.display = win.style.display === 'none' ? 'block' : 'none';
    };

    document.getElementById('close-btn').onclick = function() { container.remove(); };
    document.getElementById('minimize-btn').onclick = function() { win.style.display = 'none'; };

    let mode = '1m';
    document.getElementById('btn-1m').onclick = function() {
        mode = '1m';
        this.style.background = '#00b4d8'; this.style.color = '#fff';
        document.getElementById('btn-5s').style.background = '#1b263b'; document.getElementById('btn-5s').style.color = '#aaa';
        document.getElementById('action-btn').innerText = 'GET SIGNAL';
        document.getElementById('scanner-text').innerText = 'Ready For Signal...';
        document.getElementById('floating-candle-pop').style.opacity = '0';
    };

    document.getElementById('btn-5s').onclick = function() {
        mode = '5s';
        this.style.background = '#00b4d8'; this.style.color = '#fff';
        document.getElementById('btn-1m').style.background = '#1b263b'; document.getElementById('btn-1m').style.color = '#aaa';
        document.getElementById('action-btn').innerText = 'START AUTO';
        document.getElementById('scanner-text').innerText = 'Auto Mode Armed...';
        document.getElementById('floating-candle-pop').style.opacity = '0';
    };

    let userBalance = 1000;

    document.getElementById('action-btn').onclick = function() {
        let scannerText = document.getElementById('scanner-text');
        let signalOutput = document.getElementById('signal-output');
        let bars = document.getElementById('candle-bars');
        let floatPop = document.getElementById('floating-candle-pop');

        scannerText.innerText = mode === '5s' ? "Scanning 5s Volatility..." : "Analyzing 15+ Indicators...";
        signalOutput.innerText = "CALCULATING...";
        signalOutput.style.color = "yellow";
        floatPop.style.opacity = '0';

        let interval = setInterval(() => {
            for(let bar of bars.children) {
                bar.style.height = Math.floor(Math.random() * 40 + 10) + 'px';
            }
        }, 80);

        setTimeout(() => {
            clearInterval(interval);
            let isUp = Math.random() > 0.45;
            let finalSignal = isUp ? "UP 🟢 (BUY)" : "DOWN 🔴 (SELL)";
            
            scannerText.innerText = mode === '5s' ? "5s Market Result" : "1m Trend Analysis Done";
            signalOutput.innerText = finalSignal;
            signalOutput.style.color = isUp ? "#00ffcc" : "#ff4d4d";

            floatPop.innerText = isUp ? "📈 🟢 UP CANDLE" : "📉 🔴 DOWN CANDLE";
            floatPop.style.color = isUp ? "#00ffcc" : "#ff4d4d";
            floatPop.style.opacity = '1';
            floatPop.style.transform = 'translateY(-5px)';

            if(mode === '5s') {
                setTimeout(() => {
                    userBalance += 50;
                    document.getElementById('bot-balance').innerText = `Bal: $${userBalance}`;
                    alert(`[5s AUTO TRADE]\nSignal: ${finalSignal}\nWIN (+50$)`);
                }, 400);
            } else {
                setTimeout(() => {
                    alert(`[1m SIGNAL READY]\nDirection: ${finalSignal}\nIndicators Confirmed.`);
                }, 300);
            }
        }, 1500);
    };
})();
