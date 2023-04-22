

// Constants
const COLORS = ["HotPink", "ForestGreen", "DarkOrange", "Indigo", "MediumSeaGreen", "Gold", "Crimson"]

const GRAY = "rgb(245, 245, 245)"
const FREQUENCIES = {
    0: [261.63, 246.94, 220.00, 196, 174.61, 164.81, 146.83, 130.81]
   
}
const PLAY_IMAGE = "url('https://raw.githubusercontent.com/djberistain/djberistain.github.io/main/images/play.svg')"
const STOP_IMAGE = "url('https://raw.githubusercontent.com/djberistain/djberistain.github.io/main/images/square.svg')"
const DEFAULT_LENGTH = 4

// Settings

var LENGTH = 4
var BEATS_PER_BAR = 4
var SPLIT = 1
var RANGE = 1

// Global Varables

var notes
var overlay
var notes_overlay
var grid_row
var grid_col
var audioContext
var length_ = LENGTH
var beatsPerBar = BEATS_PER_BAR
var range = RANGE
var playing = false;
var overlayCreated = false

// Objects
var playButton = document.getElementById("play")
var tempoCounter = document.getElementById("counter-tempo");
var beatsPerBarCounter = document.getElementById("counter-bpb")
var splitCounter = document.getElementById("counter-split")
var lengthCounter = document.getElementById("counter-length")
var rangeCounter = document.getElementById("counter-range")
var tempoSlider = document.getElementById("tempo")
var splitSlider = document.getElementById("split")
var lengthSlider = document.getElementById("length")
var rangeSlider = document.getElementById("rangeS")
var beatsPerBarSlider = document.getElementById("beats-per-bar")
var settingsCloseButton = document.getElementById("close-button")
var settingsDiv = document.getElementById("settings-popup")
var settingsButton = document.getElementById("settings")

// Functions

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}
function create2DMatrix(row, col, value) {
    notes = new Array(row)
    for (let i = 0; i < row; i++) {
        notes[i] = new Array(col).fill(value)
    }


    overlay = new Array(row)
    for (let i = 0; i < row; i++) {
        overlay[i] = new Array(col).fill(null)
    }

    notes_overlay = new Array(row)
    for (let i = 0; i < row; i++) {
        notes_overlay[i] = new Array(col).fill(null)
    }
}

function pickColor(i) {
    let finalIndex = 0
    for (let j = 0; j < i; j++) {
        finalIndex++
        if (finalIndex == COLORS.length) {
            finalIndex = 0
        }
    }
    return COLORS[finalIndex]
}

function getFrequency(i) {
    return FREQUENCIES[0][i]
}

function playNote(i) {
    let compressor = audioContext.createDynamicsCompressor()
    compressor.connect(audioContext.destination)

    let gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.connect(compressor)
    let oscillator = audioContext.createOscillator()
    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(getFrequency(i), audioContext.currentTime); // value in hertz
    oscillator.connect(gainNode);
    oscillator.start();
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4)
    
    
    

}
function createGrid(row, col) {
    let tbl = document.getElementById("sheet")
    let tbl_checkered = document.getElementById("sheet-checkered")
    let tbl_overlay = document.getElementById("overlay")
    let barColor = GRAY
    let widthValue = 25*LENGTH;
    let widthValueStr = String(widthValue)
    let widthFinal = widthValueStr.concat("%")
    tbl.style.width = widthFinal
    tbl_checkered.style.width = widthFinal
    tbl_overlay.style.width = widthFinal
    grid_row = row
    grid_col = col
    for (let i = 0; i < row; i++) {
        let myRow = document.createElement("tr")
        myRow.id = "rowC" + i  
        tbl_checkered.append(myRow)
        barColor = GRAY
        for (let j = 0; j < (LENGTH*BEATS_PER_BAR); ++j) {
            let myCell = document.createElement("td")
            myRow.appendChild(myCell)
            if (j% BEATS_PER_BAR == 0 ) {
                barColor = (barColor == GRAY) ? "white" : GRAY
            }
            myCell.style.backgroundColor = barColor
            myCell.style.borderLeft = "2px solid #16a8f0"
        }
    }
    for(let i = 0; i < row; i++) { // Begin by creating a row.
        let myRow = document.createElement("tr")
        myRow.id = "row" + i  
        tbl.append(myRow)
        let rowW = document.getElementById("row" + i)
        let rowW_overlay = null

        let myRow_overlay = document.createElement("tr");
        myRow_overlay.id = "row_overlay" + i
        rowW_overlay = document.getElementById("row_overlay" + i)
        rowW_overlay = myRow_overlay
        tbl_overlay.append(myRow_overlay)

        for(let j = 0; j < col; ++j) { // Fill in the row with the appropriate columns.
            let myCell = document.createElement("td")
            rowW.appendChild(myCell)
            
            myCell.i = i
            myCell.j = j 

   

            let myCell_overlay = document.createElement("td")
            myCell_overlay.style.backgroundColor = "#16a8f0"
            myCell_overlay.style.visibility = "hidden"
            myCell.overlay = myCell_overlay
            overlay[i][j] = myCell_overlay
            rowW_overlay.appendChild(myCell_overlay)
            
            
            myCell.style.backgroundColor = "white"
            myCell.default = myCell.style.backgroundColor
            myCell.style.opacity = 0
            myCell.style.borderLeft = "1px solid #16a8f0"
            myCell.addEventListener("click", () => {
                let color = pickColor(myCell.i)
                myCell.style.backgroundColor = (myCell.style.backgroundColor == myCell.default) ? color : myCell.default
                if (myCell.style.backgroundColor != myCell.default) {
                    notes[myCell.i][myCell.j] = getFrequency(myCell.i)
                    notes_overlay[myCell.i][myCell.j] = myCell
                    myCell.style.opacity = 1
                    playNote(myCell.i)
                } else {
                    notes[myCell.i][myCell.j] = 0
                    myCell.style.opacity = 0
                    notes_overlay[myCell.i][myCell.j] = null
                }
                
            })
        }
    }
}
function makeSheet(row, col) {
    
    create2DMatrix(row, col, 0)

    createGrid(row, col)
    
    audioContext = new AudioContext()
    tempoCounter.innerText = tempoSlider.value
    beatsPerBarCounter.innerText = beatsPerBarSlider.value
    splitCounter.innerText = splitSlider.value
    lengthCounter.innerText = lengthSlider.value
    rangeCounter.innerText = rangeSlider.value
    settingsDiv.style.visibility = "hidden"
}

function setUpAudio() {
    audioContext = new AudioContext()
    
}

function clearBoard() {

    for (let col = 0; col < grid_col; col++) {
        for (let row = 0; row < grid_row; row++) {
            overlay[row][col].style.visibility = "hidden"
        }
    }
}
async function play() {
    if (!playing) {
        clearBoard()
        playButton.style.backgroundImage = PLAY_IMAGE
        return
    }
        
    playButton.style.backgroundImage = STOP_IMAGE
    for (let col = 0; col < grid_col; col++) {
        if (!playing)
            break
        for (let row = 0; row < grid_row; row++) {
            if (!playing)
                break
            overlay[row][col].style.visibility = "visible"
            if (notes[row][col] != 0) {
                playNote(row)
            }
            
        }
        await sleep( ((60/tempoSlider.value)*1000) / SPLIT )
        clearBoard()
    }


    playButton.style.backgroundImage = PLAY_IMAGE
    playing = false;
}

function playButtonClicked() {
    playing = !playing
    play()
}



function rangeAnalysis() {
    let range2 = 8
    switch(parseInt(RANGE)) {
        case 1:
            range2 = 8
            break
        case 2:
            range2 = 14
            break
        case 3:
            range2 = 21
            break
        default:
            range2 = 8
    }
    return range2

}

function updateSettings() {
 
    
    settingsDiv.style.visibility = "hidden"
     $('#sheet').empty()
     $('#sheet-checkered').empty()
     $('#overlay').empty()
     makeSheet(rangeAnalysis(), LENGTH * BEATS_PER_BAR * SPLIT)
 
     
 }

window.onload = makeSheet(rangeAnalysis(), LENGTH * BEATS_PER_BAR * SPLIT)
window.onclick = setUpAudio()
playButton.addEventListener("click", playButtonClicked)
settingsCloseButton.addEventListener("click", updateSettings)
tempoSlider.addEventListener("input", () => {
    tempoCounter.innerText = tempoSlider.value
})
beatsPerBarSlider.addEventListener("input", () => {
    beatsPerBarCounter.innerText = beatsPerBarSlider.value
    BEATS_PER_BAR = beatsPerBarSlider.value

})
splitSlider.addEventListener("input", () => {
    splitCounter.innerText = splitSlider.value
    SPLIT = splitSlider.value
})
lengthSlider.addEventListener("input", () => {
    lengthCounter.innerText = lengthSlider.value
    LENGTH = lengthSlider.value
})
rangeSlider.addEventListener("input", () => {
    rangeCounter.innerText = rangeSlider.value
    RANGE = rangeSlider.value
})
settingsButton.addEventListener("click", () => {
    settingsDiv.style.visibility = "visible"
})