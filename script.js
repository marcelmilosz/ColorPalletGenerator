
let boxes = document.querySelectorAll(".box");
let rgbColorTexts = document.querySelectorAll(".rgb-color-text");
let hexColorTexts = document.querySelectorAll(".hex-color-text");
let colorClosestNames = document.querySelectorAll(".color-closest-name");
let locks = document.querySelectorAll(".lock");

document.body.onkeyup = function(e) {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) 
    {
        spaceBarClicked()
    }
}

// When we click something 
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target;
    
    let eleClasses = [...target.classList];
    
    if (eleClasses.includes("lock")) {
        toggleLock(target);
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

function getColorName(hexColor) {
    let result = ntc.name(hexColor);
    let specific_name = result[1];  // Cornflower Blue : Color name of closest match

   return specific_name;
}

function spaceBarClicked() {

    for(let i = 0; i < boxes.length; i++) {

        let lockClasses = [...locks[i].classList];
        if (lockClasses.includes("fa-lock")) {
            continue;
        }

        // Change RGB Color 
        let rgb = randomRGBColor();
        let rgbCol = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
        boxes[i].style.backgroundColor = rgbCol;

        // Change RGB Text
        rgbColorTexts[i].innerHTML = rgbCol;

        // Change HEX Text
        let rgbToHex = RGBToHex(rgb[0], rgb[1], rgb[2]);
        hexColorTexts[i].innerHTML = rgbToHex;

        // Change Color name 
        let colorName = getColorName(rgbToHex);
        colorClosestNames[i].innerHTML = colorName;

        // Change box color depending on rgb background color 
        let maxRgb = 40;
        if ((rgb[0] < maxRgb) || (rgb[1] < maxRgb) || (rgb[2] < maxRgb)) {
            boxes[i].style.color = "#FFF";
        }
        else {
            boxes[i].style.color = "#111111";
        }
        
    }
}

function toggleLock(target) {
    console.log(target);

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


