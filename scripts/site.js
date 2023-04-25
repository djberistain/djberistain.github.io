

// Constants
const COLORS = ["HotPink", "ForestGreen", "DarkOrange", "Indigo", "MediumSeaGreen", "Gold", "Crimson"]

const GRAY = "rgb(245, 245, 245)"
const FREQUENCIES0 = {
    0: [130.82, 123.47, 110.00, 98.00, 87.31, 82.41, 73.42, 65.41],
    1: [261.63, 246.94, 220.00, 196, 174.61, 164.81, 146.83, 130.81],
    2: [523.26, 493.88, 440.00, 392, 349.22, 329.62, 293.66, 261.62]
   
}
const FREQUENCIES1 = {
    0: [261.63, 246.94, 220.00, 196, 174.61, 164.81, 146.83, 130.81, 123.47, 110.00, 98.00, 87.31, 82.41, 73.42, 65.41]
   
}
const FREQUENCIES2 = {
    0: [523.26, 493.88, 440.00, 392, 349.22, 329.62, 293.66, 261.63, 246.94, 220.00, 196, 174.61, 164.81, 146.83, 130.81, 123.47, 110.00, 98.00, 87.31, 82.41, 73.42, 65.41]
   
}
const FREQUENCIES = {
    0: [130.82, 123.47, 110.00, 98.00, 87.31, 82.41, 73.42, 65.41],
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
var lastNote = -1;
var octave = 0
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

///////

var context = new AudioContext;

function Kick(context) 
{
	this.context = context;
};

    Kick.prototype.setup = function() 
    {
	this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.gain.gain.setValueAtTime(1, 0);
    this.gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination);
    };

Kick.prototype.trigger = function(time) 
    {
	this.setup();

	this.osc.frequency.setValueAtTime(150, time);
	this.gain.gain.setValueAtTime(1, time);

	this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
	this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

	this.osc.start(time);
	this.osc.stop(time + 0.5);
    };
    

function playKick()
    {
    var kick = new Kick(context);
    var now = context.currentTime;
    kick.trigger(now);
    }

    /*********************************************** */

    function Snare(context) 
    {
        this.context = context;
    };    

    Snare.prototype.noiseBuffer = function() 
    {
        var bufferSize = this.context.sampleRate;
        var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        var output = buffer.getChannelData(0);
    
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    
        return buffer;
    };

    Snare.prototype.setup = function() 
    {
        this.noise = this.context.createBufferSource();
        this.noise.buffer = this.noiseBuffer();
        var noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        this.noise.connect(noiseFilter);

        this.noiseEnvelope = this.context.createGain();
        noiseFilter.connect(this.noiseEnvelope);
        this.noiseEnvelope.connect(this.context.destination);

        this.osc = this.context.createOscillator();
        this.osc.type = 'triangle';

        this.oscEnvelope = this.context.createGain();
        this.osc.connect(this.oscEnvelope);
        this.oscEnvelope.connect(this.context.destination);
    };

    Snare.prototype.trigger = function(time) {
        this.setup();
    
        this.noiseEnvelope.gain.setValueAtTime(1, time);
        this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        this.noise.start(time)
    
        this.osc.frequency.setValueAtTime(250, time);
        this.oscEnvelope.gain.setValueAtTime(0.7, time);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        this.osc.start(time)
    
        this.osc.stop(time + 0.2);
        this.noise.stop(time + 0.2);
    };

    function playSnare()
    {
    var snare = new Snare(context);
    var now = context.currentTime;
    snare.trigger(now);
    }

    /************************************** */

    var fundamental = 40;
    var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

   
    
    function HiHat()
    {
        this.context = context;
    }

    
    HiHat.prototype.trigger = function(time, gain)
    {
        var bandpass = context.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.value = 10000;

        var highpass = context.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 7000;

        bandpass.connect(highpass);
        highpass.connect(gain);
        gain.connect(context.destination);

        ratios.forEach(function(ratio) {
        var osc = context.createOscillator();
        osc.type = "square";
        osc.frequency.value = fundamental * ratio;
        osc.connect(bandpass);
        osc.start(time);
        osc.stop(time + 0.5);   
        });
        
    };
    
   
    function playHat()
   {   

    var hiHat = new HiHat(context);
    var now = context.currentTime; 
    var gain = context.createGain();  
    gain.gain.setValueAtTime(0.00001, now);
    gain.gain.exponentialRampToValueAtTime(1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
    hiHat.trigger(now, gain);
   }
    
   

///////

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
    if (octave == 0) {
        return FREQUENCIES[0][i] 
    } else if (octave == 1) {
        return FREQUENCIES1[0][i] 
    } else if (octave == 2) {
        return FREQUENCIES2[0][i] 
    }
    

}

function isDrum(i) {
    if (i == lastNote + 1 || i == lastNote + 2 || i == lastNote + 3) {
        return true
    }
    return false
}

function playNote(i) {

    if (!isDrum(i)) {
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
    } else {
        if (i == lastNote + 1) {
            playHat()
        } else if (i == lastNote + 2) {
            playSnare()
        } else if (i == lastNote + 3) {
            playKick()
        }
    }
    
    
}



function returnDrumColor(i) {
    if (i == lastNote + 1) {
        return "rgba(255, 0, 0, 1)"
    } else if (i == lastNote + 2) {
        return "rgba(0, 255, 0, 1)"
    } else if (i == lastNote + 3) {
        return "rgba(0, 0, 255, 1)"
    }
    return "rgba(217, 217, 217, 1)" 
}
function createGrid(row, col) {
    let tbl = document.getElementById("sheet")
    let tbl_checkered = document.getElementById("sheet-checkered")
    let tbl_overlay = document.getElementById("overlay")
    let barColor = GRAY
    let widthValue = 25*LENGTH;
    let widthValueStr = String(widthValue)
    let widthFinal = widthValueStr.concat("%")
    let orbWidth = 15 * SPLIT
    let orbHeight = 18 * SPLIT
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
            
            myCell.i = i  // shift index 
            myCell.j = j 
            myCell.enabled = false
            
   

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

            
            if (isDrum(myCell.i)) {
                myCell.style.boxShadow = "0px 0px 0px 1px rgba(114, 190, 236, 0.5)"
                myCell.style.opacity = 1
                myCell.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
                let orb = document.createElement("div")
                myCell.appendChild(orb)
                orb.style.backgroundColor = "red"
                
                orb.style.width = orbWidth + "%"
                orb.style.height = orbHeight + "%"
                orb.style.borderRadius = "50%"
                orb.style.display = "flex"
                orb.style.alignItems = "center"
                orb.style.justifyContent = "center"
                orb.style.margin = "0px auto"
                orb.style.backgroundColor = "rgba(217, 217, 217, 1)"

                myCell.orb = orb

            }

            myCell.addEventListener("click", () => {
                
                if (!isDrum(myCell.i)) {
                    let color = pickColor(myCell.i)
                    myCell.style.backgroundColor = (myCell.style.backgroundColor == myCell.default) ? color : myCell.default
                    if (myCell.style.backgroundColor != myCell.default) {
                        notes[myCell.i][myCell.j] = getFrequency(myCell.i)
                        notes_overlay[myCell.i][myCell.j] = myCell
                        myCell.style.opacity = 1
                        playNote(myCell.i) // shift index back
                    } else {
                        notes[myCell.i][myCell.j] = 0
                        myCell.style.opacity = 0
                        notes_overlay[myCell.i][myCell.j] = null
                    }
                } else {
                    if (!myCell.enabled) {
                        myCell.enabled = true
                        notes[myCell.i][myCell.j] = 1
                        playNote(myCell.i)
                        myCell.orb.style.backgroundColor = returnDrumColor(myCell.i)
                    } else {
                        myCell.enabled = false 
                        notes[myCell.i][myCell.j] = 0
                        myCell.orb.style.backgroundColor = "rgba(217, 217, 217, 1)"
                    }
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
    let range2 = 8 + 3 // plus three for drum rows
    lastNote = 7;
    switch(RANGE) {
        case 1:
            range2 = 8 + 3 // plus three for drum rows
            lastNote = 7;
            octave = 0
            break
        case 2:
            range2 = 15 + 3 // plus seven for extra octave
            lastNote = 14;
            octave = 1
            break
        case 3:
            range2 = 22 + 3// plus seven for extra octave
            lastNote = 21;
            octave = 2
            break
        default:
            range2 = 8 + 3
            octave = 0

    }
    return range2

}

function updateSettings() {
 
    console.log("a")
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
    RANGE = parseInt(rangeSlider.value)
})
settingsButton.addEventListener("click", () => {
    settingsDiv.style.visibility = "visible"
})