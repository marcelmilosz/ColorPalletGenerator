
let boxes = document.querySelectorAll(".box");
let rgbColorTexts = document.querySelectorAll(".rgb-color-text");
let hexColorTexts = document.querySelectorAll(".hex-color-text");
let colorClosestNames = document.querySelectorAll(".color-closest-name");
let locks = document.querySelectorAll(".lock");
let colorPicker = document.querySelectorAll(".setColor");
let colorPickerChange = document.querySelectorAll(".setColor");
let maxRgb = 40;

let bgsCreated = [];
let bgsP = -1;
let bgsCurrent = -1;

let undoBtn = document.querySelector('.undoBtn');
let redoBtn = document.querySelector('.redoBtn');

let miniBoxes = document.querySelectorAll(".mini-box");


document.body.onkeyup = function(e) {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) 
    {
        spaceBarClicked()
    }
}

// Adding listeners to all color pickers 
for (let i = 0; i < colorPickerChange.length; i++) {
    colorPickerChange[i].addEventListener("input", function(e) {
        let currentColor = e.target.value;
        changeBackground(currentColor, e)
    });
}

function changeAllColors() {
    for(let i = 0; i < boxes.length; i++) {

        let locksList = [...locks[i].classList];
            if(!locksList.includes("fa-lock")) {

            // Change RGB Color 
            let rgb = hexToRgb(bgsCreated[bgsCurrent][i]);
            let rgbCol = "rgb(" + rgb["r"] + ", " + rgb["g"] + ", " + rgb["b"] + ")";

            boxes[i].style.backgroundColor = rgbCol;

            // Change RGB Text
            rgbColorTexts[i].innerHTML = rgbCol;

            // Change HEX Text
            let hex = bgsCreated[bgsCurrent][i];
            hexColorTexts[i].innerHTML = hex;

            // Change Color name 
            let colorName = getColorName(bgsCreated[bgsCurrent][i]);
            colorClosestNames[i].innerHTML = colorName;

            // Change box color depending on rgb background color 
            if ((rgb["r"] < maxRgb) || (rgb["g"] < maxRgb) || (rgb["b"] < maxRgb)) {
                boxes[i].style.color = "#FFF";
            }
            else {
                boxes[i].style.color = "#111111";
            }
        }
        
    }
}

function toggleHistoryButtons(direction, option) {
    if(direction == 'undo' && option == 'off') {
        undoBtn.style.color = "#999";
    }

    if(direction == 'undo' && option == 'on') {
        undoBtn.style.color = "#111";
    }

    if(direction == 'redo' && option == 'off') {
        redoBtn.style.color = "#999";
    }

    if(direction == 'redo' && option == 'on') {
        redoBtn.style.color = "#111";
    }
}

function undo() {
    // console.log(bgsP, bgsCurrent, 'undo');

    if((bgsCurrent - 1) == 0) {
        console.log("now");
        toggleHistoryButtons('undo', 'off');
    }

    if (bgsCurrent > 0) {
        bgsCurrent -= 1;
        changeAllColors()
        changeMiniBoxes();
    }

    if(bgsCurrent < (bgsCreated.length - 1)) {
        toggleHistoryButtons('redo', 'on');
    }

    
}

function redo() {
    // console.log(bgsP, bgsCurrent, 'redo');


    if (bgsCurrent < (bgsCreated.length - 1)) {
        bgsCurrent += 1;
        changeAllColors();
        changeMiniBoxes();
    }

    if(bgsCurrent > 0) {
        toggleHistoryButtons('undo', 'on');
    } 
    
    if(bgsCurrent == (bgsCreated.length - 1)){
        toggleHistoryButtons('redo', 'off');
    }
}

// Changing box background after changing color value 
function changeBackground(currentColor, target) {
    let parentBox = target.target.parentElement;
    parentBox.style.backgroundColor = currentColor;

    // Change displayed text RGB and HEX
    let BoxChildrens = [...parentBox.children];

    let hexDict = hexToRgb(currentColor);
    let rgbText = "RGB(" + hexDict["r"] + ", " + hexDict["g"] + ", " + hexDict["b"] + ")";

    // For miniPallets
    let whichId = parentBox.id - 1;
    let noHash = currentColor.replace("#", "");
    bgsCreated[bgsCurrent][whichId] = noHash;

    for(let i = 0; i < BoxChildrens.length; i++) {
        if (BoxChildrens[i].className == "hex-color-text") {
            BoxChildrens[i].innerHTML = currentColor.replace("#", "");
        }

        if (BoxChildrens[i].className == "rgb-color-text") {
            BoxChildrens[i].innerHTML = rgbText;
        }

        if(BoxChildrens[i].className == "color-closest-name") {
            let colorName = getColorName(currentColor);
            BoxChildrens[i].innerHTML = colorName;
        }

        if ((hexDict["r"] < maxRgb) || (hexDict["g"] < maxRgb) || (hexDict["b"] < maxRgb)) {
            parentBox.style.color = "#FFF";
        }
        else {
            parentBox.style.color = "#111111";
        }
    }

    changeMiniBoxes(lockImportant = false);
}

// When we click something 
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target;
    
    let eleClasses = [...target.classList];
    
    // If we click lock
    if (eleClasses.includes("lock")) {
        toggleLock(target);
    }

    // If we click on hex or rgb color (to copy)
    if (eleClasses.includes("hex-color-text") || eleClasses.includes("rgb-color-text")) {
        copyToClipboard(target)
    }

    // We want to open input type color after click setColorI
    if (eleClasses.includes("setColorI")) {
        let setColorInput = target.previousElementSibling;
        setColorInput.click();
    }

}, false);

function randomRGBColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return [r, g, b]
}

function RGBToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return r + g + b;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function getColorName(hexColor) {
    let result = ntc.name(hexColor);
    let specific_name = result[1];  // Cornflower Blue : Color name of closest match

   return specific_name;
}

function spaceBarClicked() {

    bgsCreated.push([]);

    bgsP += 1;
    bgsCurrent += 1;
    // console.log(bgsP, bgsCurrent, bgsCreated);

    if(bgsCurrent > 0) {
        toggleHistoryButtons('undo', 'on');
    }
    else {
        toggleHistoryButtons('undo', 'off');
    }
    
    toggleHistoryButtons('redo', 'off');

    for(let i = 0; i < boxes.length; i++) {
        
        let rgb = randomRGBColor();
        let rgbCol = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
        let rgbToHex = RGBToHex(rgb[0], rgb[1], rgb[2]);

        let lockClasses = [...locks[i].classList];
        if (lockClasses.includes("fa-lock")) {
            let lockedColor = bgsCreated[bgsCurrent-1][i];
            bgsCreated[bgsP].push(lockedColor);
            continue;
        }

        bgsCreated[bgsP].push(rgbToHex);

        // Change RGB Color 
        boxes[i].style.backgroundColor = rgbCol;

        // Change RGB Text
        rgbColorTexts[i].innerHTML = rgbCol;

        // Change HEX Text
        hexColorTexts[i].innerHTML = rgbToHex;

        // Change Color name 
        let colorName = getColorName(rgbToHex);
        colorClosestNames[i].innerHTML = colorName;

        // Change box color depending on rgb background color 
        if ((rgb[0] < maxRgb) || (rgb[1] < maxRgb) || (rgb[2] < maxRgb)) {
            boxes[i].style.color = "#FFF";
        }
        else {
            boxes[i].style.color = "#111111";
        }
        
    }

    changeMiniBoxes();
}

// Change miniboxes 
function changeMiniBoxes(lockImportant = true) {
    // console.log(bgsCreated[bgsCurrent]);

    for(let i = 0; i < 5; i++) {
        let locksList = [...locks[i].classList];
        if(!locksList.includes("fa-lock")) {
            miniBoxes[i].style.backgroundColor = "#" + (bgsCreated[bgsCurrent][i]);
        }

        if(locksList.includes("fa-lock") && lockImportant == false) {
            miniBoxes[i].style.backgroundColor = "#" + (bgsCreated[bgsCurrent][i]);
        }
    }
}

// Toggle locks 
function toggleLock(target) {
    // console.log(target);

    let eleClasses = [...target.classList];

    // If was unlocked 
    if (eleClasses.includes("fa-unlock")) {
        target.classList.remove("fa-unlock");
        target.classList.add("fa-lock");
        target.style.visibility = "visible";
    }
    else {
        // If was locked
        target.classList.remove("fa-lock");
        target.classList.add("fa-unlock");
        target.style.visibility = "";
    }
}


function copyToClipboard(target) {
    // console.log(target);

    let targetVal = target.innerHTML;

    navigator.clipboard.writeText(targetVal);

    // Toggling alert-box 
    let alertBox = document.querySelector(".alert-box-wr");

    // We can click copy multiple time so we check if animation is already running
    if (alertBox.style.display != "flex") {
        alertBox.style.display = "flex";
        alertBox.style.animation = "alertIn 300ms forwards";

        setTimeout(function() {
            alertBox.style.animation = "alertOut 300ms forwards";

            setTimeout(function() {
                alertBox.style.display = "none";
            }, 300);
        }, 1000)
    }

    
}


