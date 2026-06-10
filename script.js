const egg = document.getElementById('egg');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const successScreen = document.getElementById('success-screen');

let eggX = window.innerWidth / 2;
let targetX = window.innerWidth / 2;
let isGaming = false;
let successTimer = 0;

// 初始化權限請求 (iOS 13+ 需要)
startBtn.addEventListener('click', () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startGame();
                } else {
                    alert('需要權限才能玩遊戲喔！');
                }
            })
            .catch(console.error);
    } else {
        // 非 iOS 裝置
        startGame();
    }
});

function startGame() {
    startScreen.classList.add('hidden');
    isGaming = true;
    window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
    if (!isGaming) return;

    // gamma 是手機左右傾斜角度 (-90 到 90)
    let tilt = event.gamma; 
    
    // 將傾斜角度轉化為位移
    eggX += tilt * 0.5;

    // 邊界限制
    if (eggX < 50) eggX = 50;
    if (eggX > window.innerWidth - 50) eggX = window.innerWidth - 50;

    // 更新蛋的位置
    egg.style.left = `${eggX}px`;
    egg.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;

    // 判斷是否在蛋框內 (中間區域)
    const diff = Math.abs(eggX - targetX);
    if (diff < 15) {
        successTimer++;
        egg.style.backgroundColor = '#fff9c4'; // 靠近時變色提示
    } else {
        successTimer = 0;
        egg.style.backgroundColor = '#fffcf2';
    }

    // 需穩定在中心約 1.5 秒 (約 90 幀)
    if (successTimer > 90) {
        winGame();
    }
}

function winGame() {
    isGaming = false;
    window.removeEventListener('deviceorientation', handleOrientation);
    successScreen.classList.remove('hidden');
}
