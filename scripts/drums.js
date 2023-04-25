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
    
   


    
    
    
   

   