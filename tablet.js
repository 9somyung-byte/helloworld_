const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// 초기 설정
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#000000';

// 🎨 색상 변경 함수
function changeColor(color, buttonElement) {
    ctx.strokeStyle = color;
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
}

// 🖋️ 펜 굵기 변경 함수
function changeSize(size) {
    ctx.lineWidth = size;
}

// 마우스 & 터치 좌표 보정 함수
function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
}

function startDrawing(e) {
    isDrawing = true;
    const coords = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    const coords = getCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

// 이벤트 리스너 등록
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
}, { passive: false });

canvas.addEventListener('touchend', stopDrawing);

// 지우기 기능
function clearCanvas() {
    if(confirm("정말 그림을 지울까요?")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// 전송 기능 (Local Storage 활용)
function submitFish() {
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    
    if (!studentId || !studentName) {
        alert("학번과 이름을 입력해주세요!");
        return;
    }

    // 캔버스가 비어있는지 간단히 체크
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
        alert("물고기를 그려주세요!");
        return;
    }

    const imageData = canvas.toDataURL('image/png');

    const newFish = {
        student_id: studentId,
        name: studentName,
        image: imageData,
        time: Date.now()
    };

    localStorage.setItem('shared_fish_data', JSON.stringify(newFish));
    
    alert(`${studentName}님, 물고기가 성공적으로 전송되었습니다!`);
    
    // 입력값 및 캔버스 초기화
    document.getElementById('studentId').value = "";
    document.getElementById('studentName').value = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}