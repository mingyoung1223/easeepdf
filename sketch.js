let state = 0; // 현재 상태를 저장 (0: home, 1: file, 2: loading)

let imgX;
let img0;
let test3Img;
let test4Img;
let penImg;
let gatherImg;
let backImg;
let x1Img;
let x2Img;
let toggleImg;
let hereImg;
let ex1Img;
let ex2Img;
let ex3Img;
let ex4Img;
let ex5Img;
let ex6Img;
let ex7Img;
let ex8Img;
let ex9Img;
let ex10Img;
let ex11Img;
let ex12Img;
let ex13Img;
let homeImg;
let fileImg;
let loadingImg;
let dawnloadImg;
let ocrResultImg0 = [];
let ocrResultTest3 = [];
let ocrResultTest4 = [];

let buttonX = 1100;
let buttonY = 35;
let buttonWidth = 90;
let buttonHeight = 20;


function performOCR(image, callback) {
    console.log('OCR 작업 시작:', image);

    // 이미지 객체 유형 확인
    if (!(image instanceof p5.Image)) {
        console.error('이미지 객체가 p5.Image 타입이 아닙니다.');
        return;
    }

    Tesseract.recognize(image.canvas, 'eng', { logger: (m) => console.log(m) })
        .then(result => {
            callback(result.data.words); // OCR 결과를 콜백 함수로 전달
        })
        .catch(error => {
            console.error('OCR 작업 중 오류 발생:', error);
        });
}

function preload() {
    img0 = loadImage("image/test2.png", () => {
        performOCR(img0, words => {
            ocrResultImg0 = words;
            console.log("OCR 결과 (img0):", ocrResultImg0);
        });
    });
    test3Img = loadImage("image/test3.png", () => {
        performOCR(test3Img, words => {
            ocrResultTest3 = words;
            console.log("OCR 결과 (test3Img):", ocrResultTest3);
        });
    });
    test4Img = loadImage("image/test4.png", () => {
        performOCR(test4Img, words => {
            ocrResultTest4 = words;
            console.log("OCR 결과 (test4Img):", ocrResultTest4);
        });
    });
    penImg = loadImage("image/pen.png");
    gatherImg = loadImage("image/gather pages.png");
    backImg = loadImage("image/back.png");
    x1Img = loadImage("image/x1.png");
    x2Img = loadImage("image/x2.png");
    toggleImg = loadImage("image/toggle.png");
    hereImg = loadImage("image/here.png");
    ex1Img = loadImage("image/ex1.png");
    ex2Img = loadImage("image/ex2.png");
    ex3Img = loadImage("image/ex3.png");
    ex4Img = loadImage("image/ex4.png");
    ex5Img = loadImage("image/ex5.png");
    ex6Img = loadImage("image/ex6.png");
    ex7Img = loadImage("image/ex7.png");
    ex8Img = loadImage("image/ex8.png");
    ex9Img = loadImage("image/ex9.png");
    ex10Img = loadImage("image/ex10.png");
    ex11Img = loadImage("image/ex11.png");
    ex12Img = loadImage("image/ex12.png");
    ex13Img = loadImage("image/ex13.png");
    homeImg = loadImage("image/home.png");
    fileImg = loadImage("image/file.png");
    loadingImg = loadImage("image/loading.png");
    dawnloadImg = loadImage("image/dawnload.png");
}

function setup() {
    createCanvas(1194, 834);
    // 여기에 다른 초기화 코드 추가
}

let scrolly = 0;

function mouseWheel(event) {
    scrolly += event.delta;
    let totalHeight = img0.height + test3Img.height + test4Img.height + 40;
    scrolly = constrain(scrolly, 0, totalHeight - 834 + 120);
    redraw();
}


function mouseReleased() {
    console.log("mouseRelease 이벤트 트리거됨");

    if (state === 0) {
        state = 1; // homeImg -> fileImg로 전환
    } else if (state === 1) {
        state = 2; // fileImg -> loadingImg로 전환
    } else if (state === 2) {
        state = 3; // loadingImg -> 기존 창으로 전환
    }

    // dawnloadImg 클릭 감지 및 PDF로 변환
    if (dawnloadImg && mouseX > 1100 && mouseX < 1190 &&
        mouseY > 35 && mouseY < 55) {
        console.log("PDF 변환 버튼 클릭됨");
        convertToPDF();
    }

    redraw(); // 상태 변경 후 화면을 다시 그리기 위해 redraw() 호출
}

function convertToPDF() {
    console.log('convertToPDF 함수 호출됨');
    const { jsPDF } = window.jspdf;

    // 새로운 PDF 문서 생성
    let doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [img0.width, img0.height]
    });

    // 이미지를 캔버스에 추가하는 함수
    function addImageToPDF(image, ocrResult, doc) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext('2d');

        // 이미지 그리기
        if (image instanceof p5.Image) {
            ctx.drawImage(image.canvas, 0, 0);
        } else if (image instanceof HTMLImageElement) {
            ctx.drawImage(image, 0, 0);
        } else {
            console.error('올바르지 않은 이미지 타입');
            return;
        }

        // OCR 결과 적용
        applyOCRResults(ctx, ocrResult, 0, 0);

        // PDF에 이미지 추가
        let imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 0, 0, image.width, image.height);
    }

    // img0 이미지 추가
    addImageToPDF(img0, ocrResultImg0, doc);

    // 페이지 추가 및 test3Img 이미지 추가
    doc.addPage([img0.width, img0.height]);
    addImageToPDF(test3Img, ocrResultTest3, doc);

    // 페이지 추가 및 test4Img 이미지 추가
    doc.addPage([img0.width, img0.height]);
    addImageToPDF(test4Img, ocrResultTest4, doc);

    // PDF 저장
    doc.save('HCI W4_easeePDF');
}





function applyOCRResults(ctx, ocrResults, offsetX, offsetY) {
    const padding = 2; // 상하좌우 여백

    for (let i = 0; i < ocrResults.length; i++) {
        let word = ocrResults[i];
        let x = word.bbox.x0 + offsetX - padding;
        let y = word.bbox.y0 + offsetY - padding;
        let w = word.bbox.x1 - word.bbox.x0 + 2 * padding;
        let h = word.bbox.y1 - word.bbox.y0 + 2 * padding;

        // 텍스트 색상 추출
        let r = 0, g = 0, b = 0;
        let count = 0;
        for (let j = 0; j < h - 2 * padding; j++) {
            for (let k = 0; k < w - 2 * padding; k++) {
                let tempX = x + k + padding;
                let tempY = y + j + padding;
                let tempPixel = ctx.getImageData(tempX, tempY, 1, 1).data;
                r += tempPixel[0];
                g += tempPixel[1];
                b += tempPixel[2];
                count++;
            }
        }

        let meanR = r / count;
        let meanG = g / count;
        let meanB = b / count;

        // 빨간색 텍스트 조건 (점선)
        if ((meanR > meanG && meanR > meanB && meanR > 150)) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]); // 점선 설정
            ctx.strokeRect(x, y, w, h); // 파란색 점선으로 텍스트 경계를 표시
            ctx.setLineDash([]); // 점선 해제
        }
        // 초록색 텍스트 조건 (실선)
        else if ((meanG > meanR && meanG > meanB && meanG > 150)) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h); // 파란색 실선으로 텍스트 경계를 표시
        }
    }
}





function drawOCRBox(ctx, x, y, w, h) {
    x = Math.floor(x);
    y = Math.floor(y);
    w = Math.floor(w);
    h = Math.floor(h);

    // 텍스트 영역의 RGB 값을 추출하여 평균 색상을 계산
    let imageData = ctx.getImageData(x, y, w, h);
    let data = imageData.data;
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    let pixels = data.length / 4;
    let meanR = r / pixels;
    let meanG = g / pixels;
    let meanB = b / pixels;

    // 빨간색 또는 초록색 텍스트인지 확인하는 조건
    if ((meanR > meanG && meanR > meanB && meanR > 150) || (meanG > meanR && meanG > meanB && meanG > 150)) {
        ctx.strokeStyle = 'rgba(0, 0, 255, 1)';  // 파란색으로 설정
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // 점선 설정
        ctx.strokeRect(x, y, w, h);  // 파란색 점선으로 텍스트 경계를 표시
        ctx.setLineDash([]); // 점선 해제
    }
}


function applyOCRResultsToScreen(ocrResults, offsetX, offsetY) {
    const padding = 2; // 상하좌우 여백

    for (let i = 0; i < ocrResults.length; i++) {
        let word = ocrResults[i];
        let x = word.bbox.x0 + offsetX - padding;
        let y = word.bbox.y0 + offsetY - padding;
        let w = word.bbox.x1 - word.bbox.x0 + 2 * padding;
        let h = word.bbox.y1 - word.bbox.y0 + 2 * padding;

        // 텍스트 색상 추출
        let r = 0, g = 0, b = 0;
        let count = 0;
        for (let j = 0; j < h - 2 * padding; j++) {
            for (let k = 0; k < w - 2 * padding; k++) {
                let tempX = x + k + padding;
                let tempY = y + j + padding;
                if (tempX >= 0 && tempX < width && tempY >= 0 && tempY < height) {
                    let tempPixel = get(tempX, tempY);
                    r += tempPixel[0];
                    g += tempPixel[1];
                    b += tempPixel[2];
                    count++;
                }
            }
        }

        let meanR = r / count;
        let meanG = g / count;
        let meanB = b / count;

        // 빨간색 텍스트 조건 (점선)
        if ((meanR > meanG && meanR > meanB && meanR > 150)) {
            noFill();
            stroke(0, 0, 255);  // 파란색으로 설정
            strokeWeight(2);
            drawingContext.setLineDash([5, 5]); // 점선 설정
            rect(x, y, w, h);  // 파란색 점선으로 텍스트 경계를 표시
            drawingContext.setLineDash([]); // 점선 해제
        }
        // 초록색 텍스트 조건 (실선)
        else if ((meanG > meanR && meanG > meanB && meanG > 150)) {
            noFill();
            stroke(0, 0, 255);  // 파란색으로 설정
            strokeWeight(2);
            rect(x, y, w, h);  // 파란색 실선으로 텍스트 경계를 표시
        }
    }
}






function draw() {
    background(230);
    
    switch (state) {
        case 0: // homeImg 상태
            image(homeImg, (width - homeImg.width) / 2, (height - homeImg.height) / 2);
            break;
        case 1: // fileImg 상태
            image(fileImg, (width - fileImg.width) / 2, (height - fileImg.height) / 2);
            break;
        case 2: // loadingImg 상태
            image(loadingImg, (width - loadingImg.width) / 2, (height - loadingImg.height) / 2);
            break;
        case 3: // 기존 화면
            drawMainScreen();
            drawFixedUI();   
            break;       
    }
}

// `drawFixedUI` 및 기타 함수들 여기서 점검
function drawFixedUI() {
    // 여기에 UI 요소 그리기 로직 포함
    // dawnloadImg 클릭을 감지하는 로직은 `mouseReleased`로 이동
    // dawnloadImg 그리기
    if (dawnloadImg) {
        image(dawnloadImg, 1100, 35, 90, 20);
    }
}



function drawFixedUI(){

   // 상단 남색바(0,0,1194,60)
    fill(36, 41, 47);
    rect(0, 0, 1194, 60);

    if (gatherImg){
        let newWidth = gatherImg.width / 1.5;
        let newHeight = gatherImg.height / 1.5 ;
        image(gatherImg, 60, 30, newWidth, newHeight);
    }

    if (backImg){
        let newWidth = gatherImg.width / 1.5;
        let newHeight = gatherImg.height / 1.5 ;
        image(backImg, 20, 31, newWidth, newHeight);
    }

    if (toggleImg){
        image(toggleImg, 1050, 35, 40, 20);
    }
  
     if (dawnloadImg){
        image(dawnloadImg,1100, 35,90,20);
    }
  
  
  

    // 아이콘 흰색 바
    fill(255, 255, 255);
    drawingContext.setLineDash([]);
    rect(0, 60, 1194, 30);

    if (penImg){
        let penImgX = (1194 - penImg.width) / 2;
        image(penImg, penImgX, 60); // 흰색 바 중앙에 배치
    }

    stroke(128);
    strokeWeight(1);
    drawingContext.setLineDash([]);
    line(0, 90, 1400, 90);

    // 진 회색(과목명)
    fill(228, 228, 228);
    drawingContext.setLineDash([]);
    rect(0, 90, 597, 30);

    if (x1Img){
        let newWidth = x1Img.width / 1;
        let newHeight = x1Img.height / 1 ;
        image(x1Img, 560, 95, newWidth, newHeight);
    }  

    // 흰 색(과목명)
    fill(255, 255, 255);
    drawingContext.setLineDash([]);
    rect(597, 90, 1194, 30); 

    if (x2Img){
        let newWidth = x2Img.width / 1;
        let newHeight = x2Img.height / 1;
        image(x2Img, 1157, 95, newWidth, newHeight);
    } 
  
    // 점선 설정 해제
    drawingContext.setLineDash([]);

  
     // 텍스트 추가
    fill(255);
    textAlign(CENTER);
    textSize(12);
    textStyle(NORMAL);
    text("Annotate", 1194 / 2, 50); // 텍스트 실제로 그림

    fill(0);
    textSize(12);
    textStyle(NORMAL);
    text("HCI W4", 900, 110);

    fill(100);
    textSize(12);
    textStyle(NORMAL);
    text("HCI W3", 305, 110);  

    fill(255);
    textSize(12);
    textStyle(NORMAL);
    text("easee mode", 1010, 50);  
  
    fill(36,41,47);
    textSize(10);
    textStyle(NORMAL);
    text("dawnload", 1150, 50); 
  
  
          // 왼쪽 여백 부분에 배경색을 변경
    fill(240);
    noStroke();
    rect(0, 121, imgX, 834); // 왼쪽 여백

    // 오른쪽 여백 부분에 배경색을 변경
    rect(imgX + img0.width, 121, imgX, 834); // 오른쪽 여백
  
  
  
  
    let imageY = 130;
    let imageSpacing = 50;

    if (ex1Img){
        let newWidth = ex1Img.width / 2.5;
        let newHeight = ex1Img.height / 2.5;
        image(ex1Img, 10, imageY, newWidth, newHeight);
    }  
  
    imageY += imageSpacing;

    if (ex2Img){
        let newWidth = ex2Img.width / 2.5;
        let newHeight = ex2Img.height / 2.5;
        image(ex2Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    } 

    if (ex3Img){
        let newWidth = ex3Img.width / 2.5;
        let newHeight = ex3Img.height / 2.5;
        image(ex3Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    }  

    if (ex4Img){
        let newWidth = ex4Img.width / 2.5;
        let newHeight = ex4Img.height / 2.5;
        image(ex4Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    }  

    if (ex5Img){
        let newWidth = ex5Img.width / 2.5;
        let newHeight = ex5Img.height / 2.5;
        image(ex5Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    }  

    if (ex6Img){
        let newWidth = ex6Img.width / 2.5;
        let newHeight = ex6Img.height / 2.5;
        image(ex6Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    }  

    if (ex7Img){
        let newWidth = ex7Img.width / 2.5;
        let newHeight = ex7Img.height / 2.5;
        image(ex7Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    }  

    if (ex8Img){
        let newWidth = ex8Img.width / 2.5;
        let newHeight = ex8Img.height / 2.5;
        image(ex8Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    }

    if (ex9Img){
        let newWidth = ex9Img.width / 2.5;
        let newHeight = ex9Img.height / 2.5;
        image(ex9Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    } 

    if (ex10Img){
        let newWidth = ex10Img.width / 2.5;
        let newHeight = ex10Img.height / 2.5;
        image(ex10Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    } 

    if (ex11Img){
        let newWidth = ex11Img.width / 2.5;
        let newHeight = ex11Img.height / 2.5;
        image(ex11Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    } 

    if (ex12Img){
        let newWidth = ex12Img.width / 2.5;
        let newHeight = ex12Img.height / 2.5;
        image(ex12Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    } 

    if (ex13Img){
        let newWidth = ex13Img.width / 2.5;
        let newHeight = ex13Img.height / 2.5;
        image(ex13Img, 10, imageY, newWidth, newHeight);
        imageY += imageSpacing;
    } 

}

function drawMainScreen() {
    // 스크롤 가능한 이미지 그리기
    let imgX = (1194 - img0.width) / 2;
    let imgY = 120;
    let test3ImgX = (1194 - test3Img.width) / 2;
    let test3ImgY = imgY + img0.height + 10;
    let test4ImgX = (1194 - test4Img.width) / 2;
    let test4ImgY = test3ImgY + test3Img.height + 10;

    push();
    translate(0, -scrolly); // scrolly 값을 반영하여 이미지 이동

    if (img0) {
        image(img0, imgX, imgY);
    }
    if (test3Img) {
        image(test3Img, test3ImgX, test3ImgY);
    }
    if (test4Img) {
        image(test4Img, test4ImgX, test4ImgY);
    }

    pop();

    // OCR 결과 텍스트를 화면에 표시 (img0)
    applyOCRResultsToScreen(ocrResultImg0, imgX, imgY - scrolly);

    // OCR 결과 텍스트를 화면에 표시 (test3Img)
    applyOCRResultsToScreen(ocrResultTest3, test3ImgX, test3ImgY - scrolly);

    // OCR 결과 텍스트를 화면에 표시 (test4Img)
    applyOCRResultsToScreen(ocrResultTest4, test4ImgX, test4ImgY - scrolly);
}

