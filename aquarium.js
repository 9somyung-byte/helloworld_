const aquarium = document.getElementById('aquarium');
let lastProcessedTime = 0;
const fishArray = []; 

// 🐟 물고기 객체 클래스
class Fish {
    constructor(studentId, studentName, imgSrc) {
        this.container = document.createElement('div');
        this.container.className = 'fish-container';
        this.container.style.position = 'absolute';
        
        const infoBox = document.createElement('div');
        infoBox.className = 'fish-info';
        infoBox.innerText = `${studentId} ${studentName}`;
        
        this.fishImg = document.createElement('img');
        this.fishImg.className = 'fish-img';
        this.fishImg.src = imgSrc;

        this.container.appendChild(infoBox);
        this.container.appendChild(this.fishImg);
        aquarium.appendChild(this.container);

        this.width = 160; 
        this.height = 130; 
        this.x = Math.random() * (window.innerWidth - this.width);
        this.y = Math.random() * (window.innerHeight - this.height - 150) + 50;

        // 대각선 왔다갔다 무작위 속도
        this.speedX = (Math.random() * 1.5 + 1.2) * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = (Math.random() * 1 + 0.6) * (Math.random() > 0.5 ? 1 : -1);

        this.updatePosition();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 좌우 벽 충돌 검사 및 튕기기
        if (this.x <= 0) this.speedX = Math.abs(this.speedX);
        else if (this.x >= window.innerWidth - this.width) this.speedX = -Math.abs(this.speedX);

        // 상하 벽 충돌 검사 및 튕기기
        if (this.y <= 30) this.speedY = Math.abs(this.speedY);
        else if (this.y >= window.innerHeight - this.height) this.speedY = -Math.abs(this.speedY);

        this.updatePosition();
    }

    updatePosition() {
        this.container.style.left = `${this.x}px`;
        this.container.style.top = `${this.y}px`;

        // 이동 방향에 맞춰서 좌우 뒤집기
        if (this.speedX > 0) {
            this.fishImg.style.transform = 'scaleX(-1)'; 
        } else {
            this.fishImg.style.transform = 'scaleX(1)';  
        }
    }
}

// 🧼 실시간 거품 생성 함수
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 12 + 6; // 거품 크기 랜덤
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * window.innerWidth}px`;
    
    const duration = Math.random() * 3 + 4; // 상승 속도 랜덤
    bubble.style.animationDuration = `${duration}s`;
    
    aquarium.appendChild(bubble);
    
    setTimeout(() => { bubble.remove(); }, duration * 1000);
}

// ⏱️ 0.15초마다 거품 1방울씩 무한 생성 (풍성하게 올라옴)
setInterval(createBubble, 150);

// ⏱️ 60fps 무한 애니메이션 루프 (물고기 이동)
function animate() {
    fishArray.forEach(fish => fish.move());
    requestAnimationFrame(animate);
}
animate();

// 📥 브라우저 공유 저장소 감시 루프
setInterval(() => {
    const rawData = localStorage.getItem('shared_fish_data');
    if (rawData) {
        const fishData = JSON.parse(rawData);
        if (fishData.time > lastProcessedTime) {
            lastProcessedTime = fishData.time;
            const newFish = new Fish(fishData.student_id, fishData.name, fishData.image);
            fishArray.push(newFish);
        }
    }
}, 1000);