(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"ChameleonIntro_atlas_1", frames: [[0,0,1611,1192]]},
		{name:"ChameleonIntro_atlas_2", frames: [[0,0,1611,1192]]},
		{name:"ChameleonIntro_atlas_3", frames: [[0,0,1200,900],[0,902,1200,900]]},
		{name:"ChameleonIntro_atlas_4", frames: [[0,0,1200,900],[0,902,1200,900]]},
		{name:"ChameleonIntro_atlas_5", frames: [[0,0,1200,900],[0,902,1200,900]]},
		{name:"ChameleonIntro_atlas_6", frames: [[0,0,1200,900],[0,902,1200,900]]},
		{name:"ChameleonIntro_atlas_7", frames: [[0,0,1200,900],[0,902,1200,900]]},
		{name:"ChameleonIntro_atlas_8", frames: [[0,0,1366,768],[0,770,1366,768]]},
		{name:"ChameleonIntro_atlas_9", frames: [[0,0,1216,773],[0,775,1216,773]]},
		{name:"ChameleonIntro_atlas_10", frames: [[0,1347,1681,374],[0,0,1552,499],[0,501,1571,465],[0,968,1732,377]]},
		{name:"ChameleonIntro_atlas_11", frames: [[0,0,1681,374],[0,939,1443,386],[0,1327,1443,386],[0,376,1001,561],[1003,376,1001,561]]},
		{name:"ChameleonIntro_atlas_12", frames: [[0,844,1435,313],[0,1159,1435,313],[0,0,1257,420],[0,422,1257,420],[0,1474,1463,281],[0,1757,1463,281],[1465,0,414,896]]},
		{name:"ChameleonIntro_atlas_13", frames: [[1855,0,103,69],[1960,213,36,69],[1855,284,92,69],[1960,142,38,69],[1855,71,103,69],[1949,284,92,69],[1960,0,43,69],[2005,0,43,69],[369,814,648,69],[0,1205,648,69],[369,248,1068,281],[369,531,1068,281],[369,902,1371,158],[0,0,1466,246],[1855,142,103,69],[1855,355,92,69],[1998,213,36,69],[2000,142,38,69],[1855,213,103,69],[1949,355,92,69],[1960,71,43,69],[2005,71,43,69],[369,1062,1201,141],[0,248,367,900],[1468,0,385,900]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_39 = function() {
	this.initialize(ss["ChameleonIntro_atlas_10"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["ChameleonIntro_atlas_9"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["ChameleonIntro_atlas_9"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["ChameleonIntro_atlas_11"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["ChameleonIntro_atlas_11"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["ChameleonIntro_atlas_11"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["ChameleonIntro_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["ChameleonIntro_atlas_10"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["ChameleonIntro_atlas_10"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["ChameleonIntro_atlas_10"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.BGHedge01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.Cloud1 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.cloud201 = function() {
	this.initialize(ss["ChameleonIntro_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.FGFront01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.FloorPt201 = function() {
	this.initialize(ss["ChameleonIntro_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.FloorPt101 = function() {
	this.initialize(ss["ChameleonIntro_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.GreenWalkHorizontal_0007_Leg1 = function() {
	this.initialize(ss["ChameleonIntro_atlas_11"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.green_castle01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.Jacket01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.Lightning1 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.Lightning2 = function() {
	this.initialize(ss["ChameleonIntro_atlas_13"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.Lightning3 = function() {
	this.initialize(ss["ChameleonIntro_atlas_12"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Moon01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.PinkChameleonWeapon0101 = function() {
	this.initialize(ss["ChameleonIntro_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.PinkHorizontal_0007_Layer1 = function() {
	this.initialize(ss["ChameleonIntro_atlas_11"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.pink_castle01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.Trophy01 = function() {
	this.initialize(ss["ChameleonIntro_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.WeaponChameleon10101 = function() {
	this.initialize(ss["ChameleonIntro_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["ChameleonIntro_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(img.CachedBmp_16);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1614,2481);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Tween27 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(-304,-193.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-304,-193.3,608,386.5);


(lib.Tween26 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(-304,-193.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-304,-193.3,608,386.5);


(lib.Tween25 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Trophy01();
	this.instance.setTransform(-416,-312,0.6934,0.6933);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-416,-312,832.1,624);


(lib.Tween24 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Trophy01();
	this.instance.setTransform(-416,-312,0.6934,0.6933);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-416,-312,832.1,624);


(lib.Tween23 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-420.35,-93.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-420.3,-93.4,840.5,187);


(lib.Tween22 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_38();
	this.instance.setTransform(-420.35,-93.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-420.3,-93.4,840.5,187);


(lib.Tween20 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(-360.75,-96.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-360.7,-96.4,721.5,193);


(lib.Tween19 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(-360.75,-96.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-360.7,-96.4,721.5,193);


(lib.Tween16 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(-358.85,-78.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-358.8,-78.2,717.5,156.5);


(lib.Tween15 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(-358.85,-78.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-358.8,-78.2,717.5,156.5);


(lib.Tween14 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-161.9,-17.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-161.9,-17.2,324,34.5);


(lib.Tween13 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(-161.9,-17.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-161.9,-17.2,324,34.5);


(lib.Tween12 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(-314.15,-104.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-314.1,-104.8,628.5,210);


(lib.Tween11 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(-314.15,-104.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-314.1,-104.8,628.5,210);


(lib.Tween10 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(-365.65,-70.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-365.6,-70.2,731.5,140.5);


(lib.Tween9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(-365.65,-70.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-365.6,-70.2,731.5,140.5);


(lib.Tween8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(-267,-70.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-267,-70.2,534,140.5);


(lib.Tween7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(-267,-70.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-267,-70.2,534,140.5);


(lib.Tween6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_16();
	this.instance.setTransform(-403.6,-620.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-403.6,-620.5,807,1240.5);


(lib.Tween5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_16();
	this.instance.setTransform(-403.6,-620.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-403.6,-620.5,807,1240.5);


(lib.Tween4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CC6699").s().p("AxSRSQnKnJAAqJQAAqHHKnLQHLnKKHAAQKJAAHJHKQHLHLAAKHQAAKJnLHJQnJHLqJAAQqHAAnLnLg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-156.5,-156.5,313,313);


(lib.Tween3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CC6699").s().p("AxSRSQnKnJAAqJQAAqHHKnLQHLnKKHAAQKJAAHJHKQHLHLAAKHQAAKJnLHJQnJHLqJAAQqHAAnLnLg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-156.5,-156.5,313,313);


(lib.LongNight = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-342.7,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.LongNight, new cjs.Rectangle(-342.7,0,685.5,79), null);


(lib.Entered = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(-366.4,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Entered, new cjs.Rectangle(-366.4,0,733,123), null);


(lib.Enter = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_12();
	this.instance.setTransform(-388,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-388,0,776,249.5);


(lib.chameleonidae = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-392.85,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.chameleonidae, new cjs.Rectangle(-392.8,0,785.5,232.5), null);


(lib.Bidding2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-433,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Bidding2, new cjs.Rectangle(-433,0,866,188.5), null);


(lib.Scene_1_P_Chameleon = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// P_Chameleon
	this.instance = new lib.PinkChameleonWeapon0101();
	this.instance.setTransform(11,200,0.2682,0.2682);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).wait(391));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Night = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Night
	this.instance = new lib.Moon01();
	this.instance.setTransform(0,1,0.6667,0.6666);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).wait(391));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_G_Chameleon = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// G_Chameleon
	this.instance = new lib.WeaponChameleon10101();
	this.instance.setTransform(428,209,0.25,0.25);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).wait(391));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.sky2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Cloud1();
	this.instance.setTransform(-515.35,0,0.8582,0.8582);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-515.3,0,1030.6999999999998,121);


(lib.MG_Light = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.FloorPt201();
	this.instance.setTransform(-400,0,0.6667,0.6667);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-400,0,800,600);


(lib.MG_Dark = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.FloorPt101();
	this.instance.setTransform(-400,0,0.6667,0.6667);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-400,0,800,600);


(lib.FG_Light = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Jacket01();
	this.instance.setTransform(-400,0,0.6667,0.6667);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-400,0,800,600);


(lib.FG_Dark = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.FGFront01();
	this.instance.setTransform(-400,0,0.6667,0.6667);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-400,0,800,600);


(lib.cloud1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.cloud201();
	this.instance.setTransform(-600,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-600,0,1200,900);


(lib.BG_Hedge = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.BGHedge01();
	this.instance.setTransform(-400,0,0.6667,0.6666);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-400,0,800,600);


(lib.MorninChameleon = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.GreenWalkHorizontal_0007_Leg1();
	this.instance.setTransform(-106.95,0,0.2137,0.2137);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-106.9,0,213.9,119.9);


(lib.Symbol1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Lightning3();
	this.instance.setTransform(-138.6,0,0.6696,0.6696);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-138.6,0,277.2,600);


(lib.Lightning2_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Lightning2();
	this.instance.setTransform(-128.3,0,0.6666,0.6667);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-128.3,0,256.70000000000005,600);


(lib.Lightning1_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Lightning1();
	this.instance.setTransform(-122.3,0,0.6666,0.6666);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-122.3,0,244.7,600);


(lib.GreenCastle = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.green_castle01();
	this.instance.setTransform(-600,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-600,0,1200,900);


(lib.___Camera___ = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-401,-301,802,602);


(lib.Tween21 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(249,215.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(131.4,216.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_35();
	this.instance_2.setTransform(205.75,215.5,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_34();
	this.instance_3.setTransform(205.25,150.2,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_33();
	this.instance_4.setTransform(-172.85,215.6,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_32();
	this.instance_5.setTransform(-291.3,213.1,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_31();
	this.instance_6.setTransform(-217.8,215.7,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_30();
	this.instance_7.setTransform(-217.75,150.4,0.5,0.5);

	this.instance_8 = new lib.pink_castle01();
	this.instance_8.setTransform(11.55,-149.75,0.3333,0.3333);

	this.instance_9 = new lib.GreenCastle("synched",0);
	this.instance_9.setTransform(-211.8,-2.3,0.3333,0.3333,0,0,0,-0.8,451.8);

	this.instance_10 = new lib.CachedBmp_29();
	this.instance_10.setTransform(-400.6,-298.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-411.5,-298,823.1,596);


(lib.HedgemazeText = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Enter("synched",0);
	this.instance.setTransform(0,124.9,1,1,0,0,0,0,124.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-388,0,776,249.5);


(lib.Enter2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.HedgemazeText("synched",0);
	this.instance.setTransform(0,124.9,1,1,0,0,0,0,124.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Enter2, new cjs.Rectangle(-388,0,776,249.5), null);


(lib.Scene_1_Win = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Win
	this.instance = new lib.Tween22("synched",0);
	this.instance.setTransform(400.8,485.9);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween23("synched",0);
	this.instance_1.setTransform(400.8,485.9);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1559).to({_off:false},0).to({_off:true,alpha:1},15).wait(121));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1559).to({_off:false},15).wait(87).to({startPosition:0},0).to({alpha:0},33).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Two_Entered = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Two_Entered
	this.instance = new lib.Entered();
	this.instance.setTransform(409.25,513.7,1,1,0,0,0,0,61.4);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(345).to({_off:false},0).to({alpha:1},14).wait(105).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Trophy = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Trophy
	this.instance = new lib.Tween24("synched",0);
	this.instance.setTransform(458,165);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween25("synched",0);
	this.instance_1.setTransform(458,165);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1559).to({_off:false},0).to({_off:true,alpha:1},15).wait(121));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1559).to({_off:false},15).wait(87).to({startPosition:0},0).to({alpha:0},33).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Tell = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Tell
	this.instance = new lib.Tween11("synched",0);
	this.instance.setTransform(401.25,104.85);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween12("synched",0);
	this.instance_1.setTransform(401.25,104.85);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1079).to({_off:false},0).to({_off:true,alpha:1},15).wait(256));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1079).to({_off:false},15).wait(180).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_sun = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// sun
	this.instance = new lib.Tween3("synched",0);
	this.instance.setTransform(402.85,583);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween4("synched",0);
	this.instance_1.setTransform(402.85,431.65);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(643).to({_off:false},0).to({alpha:1},15).to({startPosition:0},1).wait(4).to({y:582.2},0).to({_off:true,y:431.65},360).wait(27));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(663).to({_off:false},360).wait(11).to({startPosition:0},0).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Someone = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Someone
	this.instance = new lib.Tween7("synched",0);
	this.instance.setTransform(287.7,85.45);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween8("synched",0);
	this.instance_1.setTransform(287.7,85.45);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(663).to({_off:false},0).to({_off:true,alpha:1},11).wait(165));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(663).to({_off:false},11).wait(94).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(60));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Solution = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Solution
	this.instance = new lib.Tween13("synched",0);
	this.instance.setTransform(402.85,469.8);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween14("synched",0);
	this.instance_1.setTransform(402.85,469.8);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1199).to({_off:false},0).to({_off:true,alpha:1},15).wait(136));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1199).to({_off:false},15).wait(60).to({startPosition:0},0).to({alpha:0},14).to({_off:true},1).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Sky_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Sky_2
	this.instance = new lib.cloud1("synched",0);
	this.instance.setTransform(304,438,1,1,0,0,0,0,450);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).to({x:282},390).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Sky_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Sky_1
	this.instance = new lib.sky2("synched",0);
	this.instance.setTransform(382,51.5,1,1,0,0,0,0,60.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).to({x:509},390).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Sky = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Sky
	this.instance = new lib.Tween5("synched",0);
	this.instance.setTransform(396.85,617.95);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween6("synched",0);
	this.instance_1.setTransform(396.85,101);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(643).to({_off:false},0).to({alpha:1},15).to({startPosition:0},1).wait(4).to({y:615.3},0).to({_off:true,y:101},360).wait(27));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(663).to({_off:false},360).wait(11).to({startPosition:0},0).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Problem = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Problem
	this.instance = new lib.Tween9("synched",0);
	this.instance.setTransform(423.95,87.25);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween10("synched",0);
	this.instance_1.setTransform(423.95,87.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},779).to({state:[{t:this.instance_1}]},15).wait(90));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(779).to({_off:false},0).to({_off:true,alpha:1},15).wait(90));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Mornin_Chameleon = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Mornin_Chameleon
	this.instance = new lib.MorninChameleon("synched",0);
	this.instance.setTransform(405.95,376,1,1,0,0,0,0,60);
	this.instance._off = true;
	this.instance.filters = [new cjs.ColorFilter(0, 0, 0, 1, 0, 0, 0, 0)];
	this.instance.cache(-109,-2,218,124);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(938).to({_off:false},0).wait(21).to({alpha:0.9297},0).to({alpha:0},13).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_MG_Light = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// MG_Light
	this.instance = new lib.MG_Light("synched",0);
	this.instance.setTransform(400.7,300,1,1,0,0,0,0,300);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).to({y:342.2},390).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_MG_Dark = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// MG_Dark
	this.instance = new lib.MG_Dark("synched",0);
	this.instance.setTransform(400,323.2,1,1,0,0,0,0,300);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).wait(390).to({startPosition:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Long_Night = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Long_Night
	this.instance = new lib.LongNight();
	this.instance.setTransform(408.25,196.5,1,1,0,0,0,0,39.4);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(524).to({_off:false},0).to({alpha:1},15).wait(60).to({alpha:0},30).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Lightning_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Lightning_3
	this.instance = new lib.Symbol1("synched",0);
	this.instance.setTransform(659.6,300,1,1,0,0,0,0,300);
	this.instance.alpha = 0.4492;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(10).to({_off:false},0).wait(3).to({alpha:1},0).to({_off:true},4).wait(63).to({_off:false,x:422,y:137.3,alpha:0.4492},0).wait(3).to({alpha:1},0).wait(6));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Lightning_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Lightning_2
	this.instance = new lib.Lightning2_1("synched",0);
	this.instance.setTransform(383.3,300,1,1,0,0,0,0,300);
	this.instance.alpha = 0.5;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(12).to({_off:false},0).wait(2).to({alpha:1},0).to({_off:true},6).wait(65).to({_off:false,regY:300.2,scaleX:0.9704,scaleY:0.9703,x:698,y:272.3,alpha:0.5},0).wait(2).to({alpha:1},0).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Lightning_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Lightning_1
	this.instance = new lib.Lightning1_1("synched",0);
	this.instance.setTransform(122.3,299.9,1,1,0,0,0,0,299.9);
	this.instance.alpha = 0.5;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(9).to({_off:false},0).wait(3).to({alpha:1},0).to({_off:true},4).wait(64).to({_off:false,alpha:0.5},0).wait(5).to({alpha:1},0).wait(6));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Ground = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Ground
	this.instance = new lib.FG_Light("synched",0);
	this.instance.setTransform(400,302.6,1,1,0,0,0,0,300);
	this.instance.alpha = 0.3711;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(643).to({_off:false},0).to({alpha:1},15).to({startPosition:0},1).wait(4).to({startPosition:0},0).wait(371).to({startPosition:0},0).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Good_Luck = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Good_Luck
	this.instance = new lib.Tween26("synched",0);
	this.instance.setTransform(406.4,289.5);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween27("synched",0);
	this.instance_1.setTransform(406.4,289.5);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1694).to({_off:false},0).to({_off:true,alpha:1},15).wait(106));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1694).to({_off:false},15).wait(90).to({startPosition:0},0).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_FG_Dark = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// FG_Dark
	this.instance = new lib.FG_Dark("synched",0);
	this.instance.setTransform(402,359.4,1,1,0,0,0,0,300);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).to({y:384.2},150).to({y:401.9},107).to({y:418.9},133).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Enter = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Enter
	this.instance = new lib.HedgemazeText("synched",0);
	this.instance.setTransform(401.65,262.45,1,1,0,0,0,0,124.9);
	this.instance.alpha = 0.5;
	this.instance._off = true;

	this.instance_1 = new lib.Enter2();
	this.instance_1.setTransform(401.65,262.45,1,1,0,0,0,0,124.9);
	this.instance_1.shadow = new cjs.Shadow("rgba(153,51,255,1)",4,4,4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},17).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},55).to({state:[{t:this.instance}]},3).to({state:[]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(17).to({_off:false},0).to({_off:true},2).wait(55).to({_off:false,alpha:1},0).to({alpha:0},3).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Code = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Code
	this.instance = new lib.Tween19("synched",0);
	this.instance.setTransform(407.1,483.1);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween20("synched",0);
	this.instance_1.setTransform(407.1,483.1);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1425).to({_off:false},0).to({_off:true,alpha:1},14).wait(121));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1425).to({_off:false},14).wait(105).to({startPosition:0},0).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Chameleonidae = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Chameleonidae
	this.instance = new lib.chameleonidae();
	this.instance.setTransform(407.15,483.65,1,1,0,0,0,0,116.2);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(239).to({_off:false},0).to({alpha:1},15).wait(75).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Castles = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Castles
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(222.75,277.65,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_8();
	this.instance_1.setTransform(105.15,278.55,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_7();
	this.instance_2.setTransform(179.5,277.75,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_6();
	this.instance_3.setTransform(179,212.45,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_5();
	this.instance_4.setTransform(645.45,276.5,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_4();
	this.instance_5.setTransform(527,274,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_3();
	this.instance_6.setTransform(600.5,276.6,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_2();
	this.instance_7.setTransform(600.55,211.3,0.5,0.5);

	this.instance_8 = new lib.pink_castle01();
	this.instance_8.setTransform(407,-77,0.3333,0.3333);

	this.instance_9 = new lib.GreenCastle("synched",0);
	this.instance_9.setTransform(183.65,70.45,0.3333,0.3333,0,0,0,-0.8,451.8);

	this.instance_10 = new lib.CachedBmp_1();
	this.instance_10.setTransform(-5.15,-225.3,0.5,0.5);

	this.instance_11 = new lib.Tween21("synched",0);
	this.instance_11.setTransform(395.45,72.75);
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},1289).to({state:[{t:this.instance_11}]},255).to({state:[{t:this.instance_11}]},15).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(1544).to({_off:false},0).to({alpha:0},15).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Black = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Black
	this.instance = new lib.MorninChameleon("synched",0);
	this.instance.setTransform(405.95,376,1,1,0,0,0,0,60);
	this.instance._off = true;
	this.instance.filters = [new cjs.ColorFilter(0, 0, 0, 1, 0, 0, 0, 0)];
	this.instance.cache(-109,-2,218,124);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(643).to({_off:false},0).to({startPosition:0},15).to({startPosition:0},1).wait(4).to({startPosition:0},0).to({_off:true},281).wait(15));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Biohack = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Biohack
	this.instance = new lib.Tween15("synched",0);
	this.instance.setTransform(408.55,476.85);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.instance_1 = new lib.Tween16("synched",0);
	this.instance_1.setTransform(408.55,476.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},1289).to({state:[{t:this.instance_1}]},34).to({state:[{t:this.instance_1}]},86).wait(16));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1289).to({_off:false},0).to({_off:true,alpha:1},34).wait(102));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Bidding = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Bidding
	this.instance = new lib.Bidding2();
	this.instance.setTransform(381.25,505.7,1,1,0,0,0,0,94.4);
	this.instance.alpha = 0;
	this.instance.shadow = new cjs.Shadow("rgba(0,0,0,1)",1,1,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).to({alpha:1},28).wait(110).to({alpha:0},11).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_BG_Hedge = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// BG_Hedge
	this.instance = new lib.BG_Hedge("synched",0);
	this.instance.setTransform(401,308.5,1,1,0,0,0,0,299.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).to({y:291.5},390).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.MC_Pink = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_2
	this.instance = new lib.MorninChameleon("synched",0);
	this.instance.setTransform(0,60,1,1,0,0,0,0,60);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({alpha:1},29).to({alpha:0},30).wait(1));

	// Layer_1
	this.instance_1 = new lib.PinkHorizontal_0007_Layer1();
	this.instance_1.setTransform(-106.95,0,0.2137,0.2134);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(60));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-106.9,0,213.9,119.9);


(lib.Scene_1_Pink = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Pink
	this.instance = new lib.MC_Pink();
	this.instance.setTransform(405.95,375.9,1,1,0,0,0,0,59.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(959).to({_off:false},0).wait(315).to({alpha:0},14).to({_off:true},1).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.ChameleonIntro = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0,1814];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_1814 = function() {
		this.___loopingOver___ = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1814).call(this.frame_1814).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(400,300);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(90).to({regX:0.8,regY:1,scaleX:0.252,scaleY:0.252,x:143.95,y:275},0).to({regX:2.2,regY:2.4,scaleX:0.2519,scaleY:0.2519,x:207.05,y:275.15},153).wait(1).to({regX:4,regY:4.2,scaleX:0.2494,scaleY:0.2494,x:641.25,y:282.85},0).to({regX:5,regY:5.2,scaleX:0.2493,scaleY:0.2493,x:586.7,y:283.15},109).wait(1).to({regX:0,regY:0,scaleX:1,scaleY:1,x:400,y:300},0).wait(554).to({regX:0.4,regY:0.2,scaleX:0.4259,scaleY:0.4259,x:401.35,y:372},0).wait(381).to({regX:0.7,regY:0.5,scaleX:1,scaleY:1,x:400.65,y:300.6},0).wait(526));

	// Good_Luck_obj_
	this.Good_Luck = new lib.Scene_1_Good_Luck();
	this.Good_Luck.name = "Good_Luck";
	this.Good_Luck.depth = 0;
	this.Good_Luck.isAttachedToCamera = 0
	this.Good_Luck.isAttachedToMask = 0
	this.Good_Luck.layerDepth = 0
	this.Good_Luck.layerIndex = 0
	this.Good_Luck.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Good_Luck).wait(1694).to({regY:0.1},0).wait(121));

	// Win_obj_
	this.Win = new lib.Scene_1_Win();
	this.Win.name = "Win";
	this.Win.depth = 0;
	this.Win.isAttachedToCamera = 0
	this.Win.isAttachedToMask = 0
	this.Win.layerDepth = 0
	this.Win.layerIndex = 1
	this.Win.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Win).wait(1559).to({regY:0.1},0).wait(135).to({_off:true},1).wait(120));

	// Trophy_obj_
	this.Trophy = new lib.Scene_1_Trophy();
	this.Trophy.name = "Trophy";
	this.Trophy.depth = 0;
	this.Trophy.isAttachedToCamera = 0
	this.Trophy.isAttachedToMask = 0
	this.Trophy.layerDepth = 0
	this.Trophy.layerIndex = 2
	this.Trophy.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Trophy).wait(1559).to({regY:0.1},0).wait(135).to({_off:true},1).wait(120));

	// Code_obj_
	this.Code = new lib.Scene_1_Code();
	this.Code.name = "Code";
	this.Code.depth = 0;
	this.Code.isAttachedToCamera = 0
	this.Code.isAttachedToMask = 0
	this.Code.layerDepth = 0
	this.Code.layerIndex = 3
	this.Code.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Code).wait(1425).to({regY:0.1},0).wait(134).to({_off:true},1).wait(255));

	// Biohack_obj_
	this.Biohack = new lib.Scene_1_Biohack();
	this.Biohack.name = "Biohack";
	this.Biohack.depth = 0;
	this.Biohack.isAttachedToCamera = 0
	this.Biohack.isAttachedToMask = 0
	this.Biohack.layerDepth = 0
	this.Biohack.layerIndex = 4
	this.Biohack.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Biohack).wait(1289).to({regY:0.1},0).wait(120).to({_off:true},16).wait(390));

	// Castles_obj_
	this.Castles = new lib.Scene_1_Castles();
	this.Castles.name = "Castles";
	this.Castles.depth = 0;
	this.Castles.isAttachedToCamera = 0
	this.Castles.isAttachedToMask = 0
	this.Castles.layerDepth = 0
	this.Castles.layerIndex = 5
	this.Castles.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Castles).wait(1289).to({regY:0.1},0).wait(270).to({_off:true},1).wait(255));

	// Solution_obj_
	this.Solution = new lib.Scene_1_Solution();
	this.Solution.name = "Solution";
	this.Solution.depth = 0;
	this.Solution.isAttachedToCamera = 0
	this.Solution.isAttachedToMask = 0
	this.Solution.layerDepth = 0
	this.Solution.layerIndex = 6
	this.Solution.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Solution).wait(1199).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},0).wait(89).to({regX:0,regY:0.1,scaleX:1,scaleY:1,x:0},1).to({_off:true},61).wait(465));

	// Tell_obj_
	this.Tell = new lib.Scene_1_Tell();
	this.Tell.name = "Tell";
	this.Tell.depth = 0;
	this.Tell.isAttachedToCamera = 1
	this.Tell.isAttachedToMask = 0
	this.Tell.layerDepth = 0
	this.Tell.layerIndex = 7
	this.Tell.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Tell).wait(1289).to({_off:true},61).wait(465));

	// Problem_obj_
	this.Problem = new lib.Scene_1_Problem();
	this.Problem.name = "Problem";
	this.Problem.depth = 0;
	this.Problem.isAttachedToCamera = 0
	this.Problem.isAttachedToMask = 0
	this.Problem.layerDepth = 0
	this.Problem.layerIndex = 8
	this.Problem.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Problem).wait(794).to({_off:true},90).wait(931));

	// Someone_obj_
	this.Someone = new lib.Scene_1_Someone();
	this.Someone.name = "Someone";
	this.Someone.depth = 0;
	this.Someone.isAttachedToCamera = 0
	this.Someone.isAttachedToMask = 0
	this.Someone.layerDepth = 0
	this.Someone.layerIndex = 9
	this.Someone.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Someone).wait(779).to({_off:true},60).wait(976));

	// Mornin_Chameleon_obj_
	this.Mornin_Chameleon = new lib.Scene_1_Mornin_Chameleon();
	this.Mornin_Chameleon.name = "Mornin_Chameleon";
	this.Mornin_Chameleon.depth = 0;
	this.Mornin_Chameleon.isAttachedToCamera = 0
	this.Mornin_Chameleon.isAttachedToMask = 0
	this.Mornin_Chameleon.layerDepth = 0
	this.Mornin_Chameleon.layerIndex = 10
	this.Mornin_Chameleon.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Mornin_Chameleon).wait(938).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},0).wait(34).to({_off:true},1).wait(842));

	// Pink_obj_
	this.Pink = new lib.Scene_1_Pink();
	this.Pink.name = "Pink";
	this.Pink.depth = 0;
	this.Pink.isAttachedToCamera = 0
	this.Pink.isAttachedToMask = 0
	this.Pink.layerDepth = 0
	this.Pink.layerIndex = 11
	this.Pink.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Pink).wait(929).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},0).wait(359).to({regX:0,regY:0.1,scaleX:1,scaleY:1,x:0},1).to({_off:true},61).wait(465));

	// sun_copy (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_643 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_644 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_645 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_646 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_647 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_648 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_649 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_650 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_651 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_652 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_653 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_654 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_655 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_656 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_657 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_658 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_659 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_660 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_661 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_662 = new cjs.Graphics().p("EAB9AynQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_663 = new cjs.Graphics().p("EAB9AyjQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_664 = new cjs.Graphics().p("EAB9AyhQnJnKAAqJQAAqIHJnLQHKnJKJAAQKIAAHKHJQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_665 = new cjs.Graphics().p("EAB9AyfQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_666 = new cjs.Graphics().p("EAB9AydQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_667 = new cjs.Graphics().p("EAB9AybQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_668 = new cjs.Graphics().p("EAB9AyZQnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_669 = new cjs.Graphics().p("EAB9AyXQnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_670 = new cjs.Graphics().p("EAB9AyUQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_671 = new cjs.Graphics().p("EAB9AySQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_672 = new cjs.Graphics().p("EAB9AyQQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_673 = new cjs.Graphics().p("EAB9AyOQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_674 = new cjs.Graphics().p("EAB9AyMQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_675 = new cjs.Graphics().p("EAB9AyKQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_676 = new cjs.Graphics().p("EAB9AyIQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_677 = new cjs.Graphics().p("EAB9AyGQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_678 = new cjs.Graphics().p("EAB9AyEQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_679 = new cjs.Graphics().p("EAB9AyCQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_680 = new cjs.Graphics().p("EAB9Ax/QnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_681 = new cjs.Graphics().p("EAB9Ax9QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_682 = new cjs.Graphics().p("EAB9Ax7QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_683 = new cjs.Graphics().p("EAB9Ax5QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_684 = new cjs.Graphics().p("EAB9Ax3QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_685 = new cjs.Graphics().p("EAB9Ax1QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_686 = new cjs.Graphics().p("EAB9AxzQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_687 = new cjs.Graphics().p("EAB9AxxQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_688 = new cjs.Graphics().p("EAB9AxvQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_689 = new cjs.Graphics().p("EAB9AxsQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_690 = new cjs.Graphics().p("EAB9AxrQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_691 = new cjs.Graphics().p("EAB9AxoQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_692 = new cjs.Graphics().p("EAB9AxmQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_693 = new cjs.Graphics().p("EAB9AxkQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_694 = new cjs.Graphics().p("EAB9AxiQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_695 = new cjs.Graphics().p("EAB9AxgQnJnKAAqJQAAqIHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKIQAAKJnLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_696 = new cjs.Graphics().p("EAB9AxeQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_697 = new cjs.Graphics().p("EAB9AxcQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_698 = new cjs.Graphics().p("EAB9AxaQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_699 = new cjs.Graphics().p("EAB9AxYQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_700 = new cjs.Graphics().p("EAB9AxVQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_701 = new cjs.Graphics().p("EAB9AxUQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_702 = new cjs.Graphics().p("EAB9AxRQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_703 = new cjs.Graphics().p("EAB9AxPQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_704 = new cjs.Graphics().p("EAB9AxNQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_705 = new cjs.Graphics().p("EAB9AxLQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_706 = new cjs.Graphics().p("EAB9AxJQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_707 = new cjs.Graphics().p("EAB9AxHQnJnKAAqJQAAqIHJnLQHKnJKJAAQKIAAHKHJQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_708 = new cjs.Graphics().p("EAB9AxFQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_709 = new cjs.Graphics().p("EAB9AxDQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_710 = new cjs.Graphics().p("EAB9AxBQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_711 = new cjs.Graphics().p("EAB9Aw/QnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_712 = new cjs.Graphics().p("EAB9Aw9QnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_713 = new cjs.Graphics().p("EAB9Aw6QnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_714 = new cjs.Graphics().p("EAB9Aw4QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_715 = new cjs.Graphics().p("EAB9Aw2QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_716 = new cjs.Graphics().p("EAB9Aw0QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_717 = new cjs.Graphics().p("EAB9AwyQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_718 = new cjs.Graphics().p("EAB9AwwQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_719 = new cjs.Graphics().p("EAB9AwuQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_720 = new cjs.Graphics().p("EAB9AwsQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_721 = new cjs.Graphics().p("EAB9AwqQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_722 = new cjs.Graphics().p("EAB9AwoQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_723 = new cjs.Graphics().p("EAB9AwlQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_724 = new cjs.Graphics().p("EAB9AwjQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_725 = new cjs.Graphics().p("EAB9AwhQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_726 = new cjs.Graphics().p("EAB9AwfQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_727 = new cjs.Graphics().p("EAB9AwdQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_728 = new cjs.Graphics().p("EAB9AwbQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_729 = new cjs.Graphics().p("EAB9AwZQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_730 = new cjs.Graphics().p("EAB9AwXQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_731 = new cjs.Graphics().p("EAB9AwVQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_732 = new cjs.Graphics().p("EAB9AwTQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_733 = new cjs.Graphics().p("EAB9AwRQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_734 = new cjs.Graphics().p("EAB9AwOQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_735 = new cjs.Graphics().p("EAB9AwNQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_736 = new cjs.Graphics().p("EAB9AwKQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_737 = new cjs.Graphics().p("EAB9AwIQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_738 = new cjs.Graphics().p("EAB9AwGQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_739 = new cjs.Graphics().p("EAB9AwEQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_740 = new cjs.Graphics().p("EAB9AwCQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_741 = new cjs.Graphics().p("EAB9AwAQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_742 = new cjs.Graphics().p("EAB9Av+QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_743 = new cjs.Graphics().p("EAB9Av8QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_744 = new cjs.Graphics().p("EAB9Av6QnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_745 = new cjs.Graphics().p("EAB9Av3QnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_746 = new cjs.Graphics().p("EAB9Av2QnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_747 = new cjs.Graphics().p("EAB9AvzQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_748 = new cjs.Graphics().p("EAB9AvxQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_749 = new cjs.Graphics().p("EAB9AvvQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_750 = new cjs.Graphics().p("EAB9AvtQnJnKAAqJQAAqIHJnLQHKnJKJAAQKIAAHKHJQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_751 = new cjs.Graphics().p("EAB9AvrQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_752 = new cjs.Graphics().p("EAB9AvpQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_753 = new cjs.Graphics().p("EAB9AvnQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_754 = new cjs.Graphics().p("EAB9AvlQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_755 = new cjs.Graphics().p("EAB9AvjQnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_756 = new cjs.Graphics().p("EAB9AvgQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_757 = new cjs.Graphics().p("EAB9AvfQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_758 = new cjs.Graphics().p("EAB9AvcQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_759 = new cjs.Graphics().p("EAB9AvaQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_760 = new cjs.Graphics().p("EAB9AvYQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_761 = new cjs.Graphics().p("EAB9AvWQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_762 = new cjs.Graphics().p("EAB9AvUQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_763 = new cjs.Graphics().p("EAB9AvSQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_764 = new cjs.Graphics().p("EAB9AvQQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_765 = new cjs.Graphics().p("EAB9AvOQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_766 = new cjs.Graphics().p("EAB9AvLQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_767 = new cjs.Graphics().p("EAB9AvJQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_768 = new cjs.Graphics().p("EAB9AvHQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_769 = new cjs.Graphics().p("EAB9AvFQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_770 = new cjs.Graphics().p("EAB9AvDQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_771 = new cjs.Graphics().p("EAB9AvBQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_772 = new cjs.Graphics().p("EAB9Au/QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_773 = new cjs.Graphics().p("EAB9Au9QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_774 = new cjs.Graphics().p("EAB9Au7QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_775 = new cjs.Graphics().p("EAB9Au5QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_776 = new cjs.Graphics().p("EAB9Au3QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_777 = new cjs.Graphics().p("EAB9Au0QnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_778 = new cjs.Graphics().p("EAB9AuzQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_779 = new cjs.Graphics().p("EAB9AuwQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_780 = new cjs.Graphics().p("EAB9AuuQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_781 = new cjs.Graphics().p("EAB9AusQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_782 = new cjs.Graphics().p("EAB9AuqQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_783 = new cjs.Graphics().p("EAB9AuoQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_784 = new cjs.Graphics().p("EAB9AumQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_785 = new cjs.Graphics().p("EAB9AukQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_786 = new cjs.Graphics().p("EAB9AuiQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_787 = new cjs.Graphics().p("EAB9AugQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_788 = new cjs.Graphics().p("EAB9AudQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_789 = new cjs.Graphics().p("EAB9AucQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_790 = new cjs.Graphics().p("EAB9AuZQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_791 = new cjs.Graphics().p("EAB9AuXQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_792 = new cjs.Graphics().p("EAB9AuVQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_793 = new cjs.Graphics().p("EAB9AuTQnJnKAAqJQAAqIHJnLQHKnJKJAAQKIAAHKHJQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_794 = new cjs.Graphics().p("EAB9AuRQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_795 = new cjs.Graphics().p("EAB9AuPQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_796 = new cjs.Graphics().p("EAB9AuNQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_797 = new cjs.Graphics().p("EAB9AuLQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_798 = new cjs.Graphics().p("EAB9AuJQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_799 = new cjs.Graphics().p("EAB9AuGQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_800 = new cjs.Graphics().p("EAB9AuFQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_801 = new cjs.Graphics().p("EAB9AuCQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_802 = new cjs.Graphics().p("EAB9AuAQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_803 = new cjs.Graphics().p("EAB9At+QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_804 = new cjs.Graphics().p("EAB9At8QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_805 = new cjs.Graphics().p("EAB9At6QnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_806 = new cjs.Graphics().p("EAB9At4QnJnKAAqJQAAqIHJnLQHKnKKJABQKIgBHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_807 = new cjs.Graphics().p("EAB9At2QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_808 = new cjs.Graphics().p("EAB9At0QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_809 = new cjs.Graphics().p("EAB9AtxQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_810 = new cjs.Graphics().p("EAB9AtvQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_811 = new cjs.Graphics().p("EAB9AtuQnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_812 = new cjs.Graphics().p("EAB9AtrQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_813 = new cjs.Graphics().p("EAB9AtpQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_814 = new cjs.Graphics().p("EAB9AtnQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_815 = new cjs.Graphics().p("EAB9AtlQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_816 = new cjs.Graphics().p("EAB9AtjQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_817 = new cjs.Graphics().p("EAB9AthQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_818 = new cjs.Graphics().p("EAB9AtfQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_819 = new cjs.Graphics().p("EAB9AtdQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_820 = new cjs.Graphics().p("EAB9AtaQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_821 = new cjs.Graphics().p("EAB9AtZQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_822 = new cjs.Graphics().p("EAB9AtWQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_823 = new cjs.Graphics().p("EAB9AtUQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_824 = new cjs.Graphics().p("EAB9AtSQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_825 = new cjs.Graphics().p("EAB9AtQQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_826 = new cjs.Graphics().p("EAB9AtOQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_827 = new cjs.Graphics().p("EAB9AtMQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_828 = new cjs.Graphics().p("EAB9AtKQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_829 = new cjs.Graphics().p("EAB9AtIQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_830 = new cjs.Graphics().p("EAB9AtGQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_831 = new cjs.Graphics().p("EAB9AtDQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_832 = new cjs.Graphics().p("EAB9AtCQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_833 = new cjs.Graphics().p("EAB9As/QnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_834 = new cjs.Graphics().p("EAB9As9QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_835 = new cjs.Graphics().p("EAB9As7QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_836 = new cjs.Graphics().p("EAB9As5QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_837 = new cjs.Graphics().p("EAB9As3QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_838 = new cjs.Graphics().p("EAB9As1QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_839 = new cjs.Graphics().p("EAB9AszQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_840 = new cjs.Graphics().p("EAB9AsxQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_841 = new cjs.Graphics().p("EAB9AsvQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_842 = new cjs.Graphics().p("EAB9AssQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_843 = new cjs.Graphics().p("EAB9AsrQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_844 = new cjs.Graphics().p("EAB9AsoQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_845 = new cjs.Graphics().p("EAB9AsmQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_846 = new cjs.Graphics().p("EAB9AskQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_847 = new cjs.Graphics().p("EAB9AsiQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_848 = new cjs.Graphics().p("EAB9AsgQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_849 = new cjs.Graphics().p("EAB9AseQnJnKAAqJQAAqIHJnLQHKnKKJABQKIgBHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_850 = new cjs.Graphics().p("EAB9AscQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_851 = new cjs.Graphics().p("EAB9AsaQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_852 = new cjs.Graphics().p("EAB9AsYQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_853 = new cjs.Graphics().p("EAB9AsVQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_854 = new cjs.Graphics().p("EAB9AsUQnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_855 = new cjs.Graphics().p("EAB9AsRQnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_856 = new cjs.Graphics().p("EAB9AsPQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_857 = new cjs.Graphics().p("EAB9AsNQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_858 = new cjs.Graphics().p("EAB9AsLQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_859 = new cjs.Graphics().p("EAB9AsJQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_860 = new cjs.Graphics().p("EAB9AsHQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_861 = new cjs.Graphics().p("EAB9AsFQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_862 = new cjs.Graphics().p("EAB9AsDQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_863 = new cjs.Graphics().p("EAB9AsBQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_864 = new cjs.Graphics().p("EAB9Ar/QnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_865 = new cjs.Graphics().p("EAB9Ar8QnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_866 = new cjs.Graphics().p("EAB9Ar7QnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_867 = new cjs.Graphics().p("EAB9Ar4QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_868 = new cjs.Graphics().p("EAB9Ar2QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_869 = new cjs.Graphics().p("EAB9Ar0QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_870 = new cjs.Graphics().p("EAB9AryQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_871 = new cjs.Graphics().p("EAB9ArwQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_872 = new cjs.Graphics().p("EAB9AruQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_873 = new cjs.Graphics().p("EAB9ArsQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_874 = new cjs.Graphics().p("EAB9ArqQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_875 = new cjs.Graphics().p("EAB9AroQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_876 = new cjs.Graphics().p("EAB9ArlQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_877 = new cjs.Graphics().p("EAB9ArkQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_878 = new cjs.Graphics().p("EAB9ArhQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_879 = new cjs.Graphics().p("EAB9ArfQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_880 = new cjs.Graphics().p("EAB9ArdQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_881 = new cjs.Graphics().p("EAB9ArbQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_882 = new cjs.Graphics().p("EAB9ArZQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_883 = new cjs.Graphics().p("EAB9ArXQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_884 = new cjs.Graphics().p("EAB9ArVQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_885 = new cjs.Graphics().p("EAB9ArTQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_886 = new cjs.Graphics().p("EAB9ArRQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_887 = new cjs.Graphics().p("EAB9ArOQnJnKAAqIQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_888 = new cjs.Graphics().p("EAB9ArNQnJnLAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHLQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_889 = new cjs.Graphics().p("EAB9ArKQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_890 = new cjs.Graphics().p("EAB9ArIQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_891 = new cjs.Graphics().p("EAB9ArGQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_892 = new cjs.Graphics().p("EAB9ArEQnJnKAAqJQAAqIHJnLQHKnKKJABQKIgBHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_893 = new cjs.Graphics().p("EAB9ArCQnJnKAAqIQAAqJHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_894 = new cjs.Graphics().p("EAB9ArAQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_895 = new cjs.Graphics().p("EAB9Aq+QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_896 = new cjs.Graphics().p("EAB9Aq8QnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_897 = new cjs.Graphics().p("EAB9Aq6QnJnKAAqJQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_898 = new cjs.Graphics().p("EAB9Aq3QnJnJAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHJQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_899 = new cjs.Graphics().p("EAB9Aq1QnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_900 = new cjs.Graphics().p("EAB9AqzQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_901 = new cjs.Graphics().p("EAB9AqxQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_902 = new cjs.Graphics().p("EAB9AqvQnJnKAAqIQAAqJHJnKQHKnKKJAAQKIAAHKHKQHLHKAAKJQAAKInLHKQnKHLqIAAQqJAAnKnLg");
	var mask_graphics_903 = new cjs.Graphics().p("EAB9AqtQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHLqIgBQqJABnKnLg");
	var mask_graphics_904 = new cjs.Graphics().p("EAB9AqrQnJnKAAqIQAAqJHJnKQHKnLKJAAQKIAAHKHLQHLHKAAKJQAAKInLHKQnKHKqIABQqJgBnKnKg");
	var mask_graphics_905 = new cjs.Graphics().p("EAB9AqpQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_906 = new cjs.Graphics().p("EAB9AqnQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_907 = new cjs.Graphics().p("EAB9AqlQnJnKAAqJQAAqIHJnLQHKnKKJAAQKIAAHKHKQHLHLAAKIQAAKJnLHKQnKHKqIAAQqJAAnKnKg");
	var mask_graphics_908 = new cjs.Graphics().p("EglxA3HQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_909 = new cjs.Graphics().p("EglxA3CQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_910 = new cjs.Graphics().p("EglxA29QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_911 = new cjs.Graphics().p("EglxA24QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_912 = new cjs.Graphics().p("EglxA20Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_913 = new cjs.Graphics().p("EglxA2uQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_914 = new cjs.Graphics().p("EglxA2qQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_915 = new cjs.Graphics().p("EglxA2lQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_916 = new cjs.Graphics().p("EglxA2gQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_917 = new cjs.Graphics().p("EglxA2bQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_918 = new cjs.Graphics().p("EglxA2WQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_919 = new cjs.Graphics().p("EglxA2RQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_920 = new cjs.Graphics().p("EglxA2MQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_921 = new cjs.Graphics().p("EglxA2HQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_922 = new cjs.Graphics().p("EglxA2CQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_923 = new cjs.Graphics().p("EglxA1+Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_924 = new cjs.Graphics().p("EglxA14QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_925 = new cjs.Graphics().p("EglxA10Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_926 = new cjs.Graphics().p("EglxA1vQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_927 = new cjs.Graphics().p("EglxA1qQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_928 = new cjs.Graphics().p("EglxA1lQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_929 = new cjs.Graphics().p("EglxA1gQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_930 = new cjs.Graphics().p("EglxA1bQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_931 = new cjs.Graphics().p("EglxA1WQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_932 = new cjs.Graphics().p("EglxA1RQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_933 = new cjs.Graphics().p("EglxA1MQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_934 = new cjs.Graphics().p("EglxA1IQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_935 = new cjs.Graphics().p("EglxA1CQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_936 = new cjs.Graphics().p("EglxA0+Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_937 = new cjs.Graphics().p("EglxA05QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_938 = new cjs.Graphics().p("EglxA00Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_939 = new cjs.Graphics().p("EglxA0vQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_940 = new cjs.Graphics().p("EglxA0qQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_941 = new cjs.Graphics().p("EglxA0lQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_942 = new cjs.Graphics().p("EglxA0gQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_943 = new cjs.Graphics().p("EglxA0bQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_944 = new cjs.Graphics().p("EglxA0WQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_945 = new cjs.Graphics().p("EglxA0SQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_946 = new cjs.Graphics().p("EglxA0MQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_947 = new cjs.Graphics().p("EglxA0IQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_948 = new cjs.Graphics().p("EglxA0CQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_949 = new cjs.Graphics().p("EglxAz+Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_950 = new cjs.Graphics().p("EglxAz5QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_951 = new cjs.Graphics().p("EglxAz0Qwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_952 = new cjs.Graphics().p("EglxAzvQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_953 = new cjs.Graphics().p("EglxAzqQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_954 = new cjs.Graphics().p("EglxAzlQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_955 = new cjs.Graphics().p("EglxAzgQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_956 = new cjs.Graphics().p("EglxAzcQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_957 = new cjs.Graphics().p("EglxAzWQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_958 = new cjs.Graphics().p("EglxAzSQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_959 = new cjs.Graphics().p("EglxAzMQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_960 = new cjs.Graphics().p("EglxAzIQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_961 = new cjs.Graphics().p("EglxAzDQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_962 = new cjs.Graphics().p("EglxAy+Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_963 = new cjs.Graphics().p("EglxAy5QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_964 = new cjs.Graphics().p("EglxAy0QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_965 = new cjs.Graphics().p("EglxAyvQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_966 = new cjs.Graphics().p("EglxAyqQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_967 = new cjs.Graphics().p("EglxAymQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_968 = new cjs.Graphics().p("EglxAygQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_969 = new cjs.Graphics().p("EglxAycQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_970 = new cjs.Graphics().p("EglxAyWQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_971 = new cjs.Graphics().p("EglxAySQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_972 = new cjs.Graphics().p("EglxAyNQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_973 = new cjs.Graphics().p("EglxAyIQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_974 = new cjs.Graphics().p("EglxAyDQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_975 = new cjs.Graphics().p("EglxAx+QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_976 = new cjs.Graphics().p("EglxAx5QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_977 = new cjs.Graphics().p("EglxAx0QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_978 = new cjs.Graphics().p("EglxAxwQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_979 = new cjs.Graphics().p("EglxAxqQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_980 = new cjs.Graphics().p("EglxAxmQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_981 = new cjs.Graphics().p("EglxAxgQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_982 = new cjs.Graphics().p("EglxAxcQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_983 = new cjs.Graphics().p("EglxAxXQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_984 = new cjs.Graphics().p("EglxAxSQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_985 = new cjs.Graphics().p("EglxAxNQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_986 = new cjs.Graphics().p("EglxAxIQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_987 = new cjs.Graphics().p("EglxAxDQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_988 = new cjs.Graphics().p("EglxAw+QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_989 = new cjs.Graphics().p("EglxAw5QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_990 = new cjs.Graphics().p("EglxAw0QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_991 = new cjs.Graphics().p("EglxAwwQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_992 = new cjs.Graphics().p("EglxAwqQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_993 = new cjs.Graphics().p("EglxAwmQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_994 = new cjs.Graphics().p("EglxAwhQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_995 = new cjs.Graphics().p("EglxAwcQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_996 = new cjs.Graphics().p("EglxAwXQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_997 = new cjs.Graphics().p("EglxAwSQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_998 = new cjs.Graphics().p("EglxAwNQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_999 = new cjs.Graphics().p("EglxAwIQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1000 = new cjs.Graphics().p("EglxAwDQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1001 = new cjs.Graphics().p("EglxAv+QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1002 = new cjs.Graphics().p("EglxAv6Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1003 = new cjs.Graphics().p("EglxAv0QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1004 = new cjs.Graphics().p("EglxAvwQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1005 = new cjs.Graphics().p("EglxAvrQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1006 = new cjs.Graphics().p("EglxAvmQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1007 = new cjs.Graphics().p("EglxAvhQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1008 = new cjs.Graphics().p("EglxAvcQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1009 = new cjs.Graphics().p("EglxAvXQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1010 = new cjs.Graphics().p("EglxAvSQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1011 = new cjs.Graphics().p("EglxAvNQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1012 = new cjs.Graphics().p("EglxAvIQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1013 = new cjs.Graphics().p("EglxAvEQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1014 = new cjs.Graphics().p("EglxAu+QwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1015 = new cjs.Graphics().p("EglxAu6Qwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1016 = new cjs.Graphics().p("EglxAu1Qwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1017 = new cjs.Graphics().p("EglxAuwQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1018 = new cjs.Graphics().p("EglxAurQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1019 = new cjs.Graphics().p("EglxAumQwzw0AA3zQAA3yQzw0QQ1w0XyAAQXzAAQzQ0QQ1Q0AAXyQAAXzw1Q0QwzQ03zAAQ3yAAw1w0g");
	var mask_graphics_1020 = new cjs.Graphics().p("EglxAuhQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1021 = new cjs.Graphics().p("EglxAucQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1022 = new cjs.Graphics().p("EglxAuXQwzwzAA3zQAA3yQzw1QQ1wzXyAAQXzAAQzQzQQ1Q1AAXyQAAXzw1QzQwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1023 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1024 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1025 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1026 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1027 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1028 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1029 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1030 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1031 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1032 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1033 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1034 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1035 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1036 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1037 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1038 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1039 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1040 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1041 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1042 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1043 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1044 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1045 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1046 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1047 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1048 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");
	var mask_graphics_1049 = new cjs.Graphics().p("EglxAuTQwzw0AA3zQAA3xQzw1QQ1w0XyAAQXzAAQzQ0QQ1Q1AAXxQAAXzw1Q0QwzQ13zAAQ3yAAw1w1g");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(643).to({graphics:mask_graphics_643,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_644,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_645,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_646,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_647,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_648,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_649,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_650,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_651,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_652,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_653,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_654,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_655,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_656,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_657,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_658,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_659,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_660,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_661,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_662,x:279.675,y:369.75}).wait(1).to({graphics:mask_graphics_663,x:279.675,y:369.35}).wait(1).to({graphics:mask_graphics_664,x:279.675,y:369.15}).wait(1).to({graphics:mask_graphics_665,x:279.675,y:368.925}).wait(1).to({graphics:mask_graphics_666,x:279.675,y:368.725}).wait(1).to({graphics:mask_graphics_667,x:279.675,y:368.525}).wait(1).to({graphics:mask_graphics_668,x:279.675,y:368.3}).wait(1).to({graphics:mask_graphics_669,x:279.675,y:368.1}).wait(1).to({graphics:mask_graphics_670,x:279.675,y:367.875}).wait(1).to({graphics:mask_graphics_671,x:279.675,y:367.675}).wait(1).to({graphics:mask_graphics_672,x:279.675,y:367.475}).wait(1).to({graphics:mask_graphics_673,x:279.675,y:367.25}).wait(1).to({graphics:mask_graphics_674,x:279.675,y:367.05}).wait(1).to({graphics:mask_graphics_675,x:279.675,y:366.85}).wait(1).to({graphics:mask_graphics_676,x:279.675,y:366.625}).wait(1).to({graphics:mask_graphics_677,x:279.675,y:366.425}).wait(1).to({graphics:mask_graphics_678,x:279.675,y:366.225}).wait(1).to({graphics:mask_graphics_679,x:279.675,y:366}).wait(1).to({graphics:mask_graphics_680,x:279.675,y:365.8}).wait(1).to({graphics:mask_graphics_681,x:279.675,y:365.575}).wait(1).to({graphics:mask_graphics_682,x:279.675,y:365.375}).wait(1).to({graphics:mask_graphics_683,x:279.675,y:365.175}).wait(1).to({graphics:mask_graphics_684,x:279.675,y:364.95}).wait(1).to({graphics:mask_graphics_685,x:279.675,y:364.75}).wait(1).to({graphics:mask_graphics_686,x:279.675,y:364.55}).wait(1).to({graphics:mask_graphics_687,x:279.675,y:364.325}).wait(1).to({graphics:mask_graphics_688,x:279.675,y:364.125}).wait(1).to({graphics:mask_graphics_689,x:279.675,y:363.9}).wait(1).to({graphics:mask_graphics_690,x:279.675,y:363.7}).wait(1).to({graphics:mask_graphics_691,x:279.675,y:363.5}).wait(1).to({graphics:mask_graphics_692,x:279.675,y:363.275}).wait(1).to({graphics:mask_graphics_693,x:279.675,y:363.075}).wait(1).to({graphics:mask_graphics_694,x:279.675,y:362.875}).wait(1).to({graphics:mask_graphics_695,x:279.675,y:362.65}).wait(1).to({graphics:mask_graphics_696,x:279.675,y:362.45}).wait(1).to({graphics:mask_graphics_697,x:279.675,y:362.25}).wait(1).to({graphics:mask_graphics_698,x:279.675,y:362.025}).wait(1).to({graphics:mask_graphics_699,x:279.675,y:361.825}).wait(1).to({graphics:mask_graphics_700,x:279.675,y:361.6}).wait(1).to({graphics:mask_graphics_701,x:279.675,y:361.4}).wait(1).to({graphics:mask_graphics_702,x:279.675,y:361.2}).wait(1).to({graphics:mask_graphics_703,x:279.675,y:360.975}).wait(1).to({graphics:mask_graphics_704,x:279.675,y:360.775}).wait(1).to({graphics:mask_graphics_705,x:279.675,y:360.575}).wait(1).to({graphics:mask_graphics_706,x:279.675,y:360.35}).wait(1).to({graphics:mask_graphics_707,x:279.675,y:360.15}).wait(1).to({graphics:mask_graphics_708,x:279.675,y:359.95}).wait(1).to({graphics:mask_graphics_709,x:279.675,y:359.725}).wait(1).to({graphics:mask_graphics_710,x:279.675,y:359.525}).wait(1).to({graphics:mask_graphics_711,x:279.675,y:359.3}).wait(1).to({graphics:mask_graphics_712,x:279.675,y:359.1}).wait(1).to({graphics:mask_graphics_713,x:279.675,y:358.9}).wait(1).to({graphics:mask_graphics_714,x:279.675,y:358.675}).wait(1).to({graphics:mask_graphics_715,x:279.675,y:358.475}).wait(1).to({graphics:mask_graphics_716,x:279.675,y:358.275}).wait(1).to({graphics:mask_graphics_717,x:279.675,y:358.05}).wait(1).to({graphics:mask_graphics_718,x:279.675,y:357.85}).wait(1).to({graphics:mask_graphics_719,x:279.675,y:357.625}).wait(1).to({graphics:mask_graphics_720,x:279.675,y:357.425}).wait(1).to({graphics:mask_graphics_721,x:279.675,y:357.225}).wait(1).to({graphics:mask_graphics_722,x:279.675,y:357}).wait(1).to({graphics:mask_graphics_723,x:279.675,y:356.8}).wait(1).to({graphics:mask_graphics_724,x:279.675,y:356.6}).wait(1).to({graphics:mask_graphics_725,x:279.675,y:356.375}).wait(1).to({graphics:mask_graphics_726,x:279.675,y:356.175}).wait(1).to({graphics:mask_graphics_727,x:279.675,y:355.975}).wait(1).to({graphics:mask_graphics_728,x:279.675,y:355.75}).wait(1).to({graphics:mask_graphics_729,x:279.675,y:355.55}).wait(1).to({graphics:mask_graphics_730,x:279.675,y:355.325}).wait(1).to({graphics:mask_graphics_731,x:279.675,y:355.125}).wait(1).to({graphics:mask_graphics_732,x:279.675,y:354.925}).wait(1).to({graphics:mask_graphics_733,x:279.675,y:354.7}).wait(1).to({graphics:mask_graphics_734,x:279.675,y:354.5}).wait(1).to({graphics:mask_graphics_735,x:279.675,y:354.3}).wait(1).to({graphics:mask_graphics_736,x:279.675,y:354.075}).wait(1).to({graphics:mask_graphics_737,x:279.675,y:353.875}).wait(1).to({graphics:mask_graphics_738,x:279.675,y:353.675}).wait(1).to({graphics:mask_graphics_739,x:279.675,y:353.45}).wait(1).to({graphics:mask_graphics_740,x:279.675,y:353.25}).wait(1).to({graphics:mask_graphics_741,x:279.675,y:353.025}).wait(1).to({graphics:mask_graphics_742,x:279.675,y:352.825}).wait(1).to({graphics:mask_graphics_743,x:279.675,y:352.625}).wait(1).to({graphics:mask_graphics_744,x:279.675,y:352.4}).wait(1).to({graphics:mask_graphics_745,x:279.675,y:352.2}).wait(1).to({graphics:mask_graphics_746,x:279.675,y:352}).wait(1).to({graphics:mask_graphics_747,x:279.675,y:351.775}).wait(1).to({graphics:mask_graphics_748,x:279.675,y:351.575}).wait(1).to({graphics:mask_graphics_749,x:279.675,y:351.35}).wait(1).to({graphics:mask_graphics_750,x:279.675,y:351.15}).wait(1).to({graphics:mask_graphics_751,x:279.675,y:350.95}).wait(1).to({graphics:mask_graphics_752,x:279.675,y:350.725}).wait(1).to({graphics:mask_graphics_753,x:279.675,y:350.525}).wait(1).to({graphics:mask_graphics_754,x:279.675,y:350.325}).wait(1).to({graphics:mask_graphics_755,x:279.675,y:350.1}).wait(1).to({graphics:mask_graphics_756,x:279.675,y:349.9}).wait(1).to({graphics:mask_graphics_757,x:279.675,y:349.7}).wait(1).to({graphics:mask_graphics_758,x:279.675,y:349.475}).wait(1).to({graphics:mask_graphics_759,x:279.675,y:349.275}).wait(1).to({graphics:mask_graphics_760,x:279.675,y:349.05}).wait(1).to({graphics:mask_graphics_761,x:279.675,y:348.85}).wait(1).to({graphics:mask_graphics_762,x:279.675,y:348.65}).wait(1).to({graphics:mask_graphics_763,x:279.675,y:348.425}).wait(1).to({graphics:mask_graphics_764,x:279.675,y:348.225}).wait(1).to({graphics:mask_graphics_765,x:279.675,y:348.025}).wait(1).to({graphics:mask_graphics_766,x:279.675,y:347.8}).wait(1).to({graphics:mask_graphics_767,x:279.675,y:347.6}).wait(1).to({graphics:mask_graphics_768,x:279.675,y:347.375}).wait(1).to({graphics:mask_graphics_769,x:279.675,y:347.175}).wait(1).to({graphics:mask_graphics_770,x:279.675,y:346.975}).wait(1).to({graphics:mask_graphics_771,x:279.675,y:346.75}).wait(1).to({graphics:mask_graphics_772,x:279.675,y:346.55}).wait(1).to({graphics:mask_graphics_773,x:279.675,y:346.35}).wait(1).to({graphics:mask_graphics_774,x:279.675,y:346.125}).wait(1).to({graphics:mask_graphics_775,x:279.675,y:345.925}).wait(1).to({graphics:mask_graphics_776,x:279.675,y:345.725}).wait(1).to({graphics:mask_graphics_777,x:279.675,y:345.5}).wait(1).to({graphics:mask_graphics_778,x:279.675,y:345.3}).wait(1).to({graphics:mask_graphics_779,x:279.675,y:345.075}).wait(1).to({graphics:mask_graphics_780,x:279.675,y:344.875}).wait(1).to({graphics:mask_graphics_781,x:279.675,y:344.675}).wait(1).to({graphics:mask_graphics_782,x:279.675,y:344.45}).wait(1).to({graphics:mask_graphics_783,x:279.675,y:344.25}).wait(1).to({graphics:mask_graphics_784,x:279.675,y:344.05}).wait(1).to({graphics:mask_graphics_785,x:279.675,y:343.825}).wait(1).to({graphics:mask_graphics_786,x:279.675,y:343.625}).wait(1).to({graphics:mask_graphics_787,x:279.675,y:343.425}).wait(1).to({graphics:mask_graphics_788,x:279.675,y:343.2}).wait(1).to({graphics:mask_graphics_789,x:279.675,y:343}).wait(1).to({graphics:mask_graphics_790,x:279.675,y:342.775}).wait(1).to({graphics:mask_graphics_791,x:279.675,y:342.575}).wait(1).to({graphics:mask_graphics_792,x:279.675,y:342.375}).wait(1).to({graphics:mask_graphics_793,x:279.675,y:342.15}).wait(1).to({graphics:mask_graphics_794,x:279.675,y:341.95}).wait(1).to({graphics:mask_graphics_795,x:279.675,y:341.75}).wait(1).to({graphics:mask_graphics_796,x:279.675,y:341.525}).wait(1).to({graphics:mask_graphics_797,x:279.675,y:341.325}).wait(1).to({graphics:mask_graphics_798,x:279.675,y:341.125}).wait(1).to({graphics:mask_graphics_799,x:279.675,y:340.9}).wait(1).to({graphics:mask_graphics_800,x:279.675,y:340.7}).wait(1).to({graphics:mask_graphics_801,x:279.675,y:340.475}).wait(1).to({graphics:mask_graphics_802,x:279.675,y:340.275}).wait(1).to({graphics:mask_graphics_803,x:279.675,y:340.075}).wait(1).to({graphics:mask_graphics_804,x:279.675,y:339.85}).wait(1).to({graphics:mask_graphics_805,x:279.675,y:339.65}).wait(1).to({graphics:mask_graphics_806,x:279.675,y:339.45}).wait(1).to({graphics:mask_graphics_807,x:279.675,y:339.225}).wait(1).to({graphics:mask_graphics_808,x:279.675,y:339.025}).wait(1).to({graphics:mask_graphics_809,x:279.675,y:338.8}).wait(1).to({graphics:mask_graphics_810,x:279.675,y:338.6}).wait(1).to({graphics:mask_graphics_811,x:279.675,y:338.4}).wait(1).to({graphics:mask_graphics_812,x:279.675,y:338.175}).wait(1).to({graphics:mask_graphics_813,x:279.675,y:337.975}).wait(1).to({graphics:mask_graphics_814,x:279.675,y:337.775}).wait(1).to({graphics:mask_graphics_815,x:279.675,y:337.55}).wait(1).to({graphics:mask_graphics_816,x:279.675,y:337.35}).wait(1).to({graphics:mask_graphics_817,x:279.675,y:337.15}).wait(1).to({graphics:mask_graphics_818,x:279.675,y:336.925}).wait(1).to({graphics:mask_graphics_819,x:279.675,y:336.725}).wait(1).to({graphics:mask_graphics_820,x:279.675,y:336.5}).wait(1).to({graphics:mask_graphics_821,x:279.675,y:336.3}).wait(1).to({graphics:mask_graphics_822,x:279.675,y:336.1}).wait(1).to({graphics:mask_graphics_823,x:279.675,y:335.875}).wait(1).to({graphics:mask_graphics_824,x:279.675,y:335.675}).wait(1).to({graphics:mask_graphics_825,x:279.675,y:335.475}).wait(1).to({graphics:mask_graphics_826,x:279.675,y:335.25}).wait(1).to({graphics:mask_graphics_827,x:279.675,y:335.05}).wait(1).to({graphics:mask_graphics_828,x:279.675,y:334.85}).wait(1).to({graphics:mask_graphics_829,x:279.675,y:334.625}).wait(1).to({graphics:mask_graphics_830,x:279.675,y:334.425}).wait(1).to({graphics:mask_graphics_831,x:279.675,y:334.2}).wait(1).to({graphics:mask_graphics_832,x:279.675,y:334}).wait(1).to({graphics:mask_graphics_833,x:279.675,y:333.8}).wait(1).to({graphics:mask_graphics_834,x:279.675,y:333.575}).wait(1).to({graphics:mask_graphics_835,x:279.675,y:333.375}).wait(1).to({graphics:mask_graphics_836,x:279.675,y:333.175}).wait(1).to({graphics:mask_graphics_837,x:279.675,y:332.95}).wait(1).to({graphics:mask_graphics_838,x:279.675,y:332.75}).wait(1).to({graphics:mask_graphics_839,x:279.675,y:332.525}).wait(1).to({graphics:mask_graphics_840,x:279.675,y:332.325}).wait(1).to({graphics:mask_graphics_841,x:279.675,y:332.125}).wait(1).to({graphics:mask_graphics_842,x:279.675,y:331.9}).wait(1).to({graphics:mask_graphics_843,x:279.675,y:331.7}).wait(1).to({graphics:mask_graphics_844,x:279.675,y:331.5}).wait(1).to({graphics:mask_graphics_845,x:279.675,y:331.275}).wait(1).to({graphics:mask_graphics_846,x:279.675,y:331.075}).wait(1).to({graphics:mask_graphics_847,x:279.675,y:330.875}).wait(1).to({graphics:mask_graphics_848,x:279.675,y:330.65}).wait(1).to({graphics:mask_graphics_849,x:279.675,y:330.45}).wait(1).to({graphics:mask_graphics_850,x:279.675,y:330.225}).wait(1).to({graphics:mask_graphics_851,x:279.675,y:330.025}).wait(1).to({graphics:mask_graphics_852,x:279.675,y:329.825}).wait(1).to({graphics:mask_graphics_853,x:279.675,y:329.6}).wait(1).to({graphics:mask_graphics_854,x:279.675,y:329.4}).wait(1).to({graphics:mask_graphics_855,x:279.675,y:329.2}).wait(1).to({graphics:mask_graphics_856,x:279.675,y:328.975}).wait(1).to({graphics:mask_graphics_857,x:279.675,y:328.775}).wait(1).to({graphics:mask_graphics_858,x:279.675,y:328.55}).wait(1).to({graphics:mask_graphics_859,x:279.675,y:328.35}).wait(1).to({graphics:mask_graphics_860,x:279.675,y:328.15}).wait(1).to({graphics:mask_graphics_861,x:279.675,y:327.925}).wait(1).to({graphics:mask_graphics_862,x:279.675,y:327.725}).wait(1).to({graphics:mask_graphics_863,x:279.675,y:327.525}).wait(1).to({graphics:mask_graphics_864,x:279.675,y:327.3}).wait(1).to({graphics:mask_graphics_865,x:279.675,y:327.1}).wait(1).to({graphics:mask_graphics_866,x:279.675,y:326.9}).wait(1).to({graphics:mask_graphics_867,x:279.675,y:326.675}).wait(1).to({graphics:mask_graphics_868,x:279.675,y:326.475}).wait(1).to({graphics:mask_graphics_869,x:279.675,y:326.25}).wait(1).to({graphics:mask_graphics_870,x:279.675,y:326.05}).wait(1).to({graphics:mask_graphics_871,x:279.675,y:325.85}).wait(1).to({graphics:mask_graphics_872,x:279.675,y:325.625}).wait(1).to({graphics:mask_graphics_873,x:279.675,y:325.425}).wait(1).to({graphics:mask_graphics_874,x:279.675,y:325.225}).wait(1).to({graphics:mask_graphics_875,x:279.675,y:325}).wait(1).to({graphics:mask_graphics_876,x:279.675,y:324.8}).wait(1).to({graphics:mask_graphics_877,x:279.675,y:324.6}).wait(1).to({graphics:mask_graphics_878,x:279.675,y:324.375}).wait(1).to({graphics:mask_graphics_879,x:279.675,y:324.175}).wait(1).to({graphics:mask_graphics_880,x:279.675,y:323.95}).wait(1).to({graphics:mask_graphics_881,x:279.675,y:323.75}).wait(1).to({graphics:mask_graphics_882,x:279.675,y:323.55}).wait(1).to({graphics:mask_graphics_883,x:279.675,y:323.325}).wait(1).to({graphics:mask_graphics_884,x:279.675,y:323.125}).wait(1).to({graphics:mask_graphics_885,x:279.675,y:322.925}).wait(1).to({graphics:mask_graphics_886,x:279.675,y:322.7}).wait(1).to({graphics:mask_graphics_887,x:279.675,y:322.5}).wait(1).to({graphics:mask_graphics_888,x:279.675,y:322.3}).wait(1).to({graphics:mask_graphics_889,x:279.675,y:322.075}).wait(1).to({graphics:mask_graphics_890,x:279.675,y:321.875}).wait(1).to({graphics:mask_graphics_891,x:279.675,y:321.65}).wait(1).to({graphics:mask_graphics_892,x:279.675,y:321.45}).wait(1).to({graphics:mask_graphics_893,x:279.675,y:321.25}).wait(1).to({graphics:mask_graphics_894,x:279.675,y:321.025}).wait(1).to({graphics:mask_graphics_895,x:279.675,y:320.825}).wait(1).to({graphics:mask_graphics_896,x:279.675,y:320.625}).wait(1).to({graphics:mask_graphics_897,x:279.675,y:320.4}).wait(1).to({graphics:mask_graphics_898,x:279.675,y:320.2}).wait(1).to({graphics:mask_graphics_899,x:279.675,y:319.975}).wait(1).to({graphics:mask_graphics_900,x:279.675,y:319.775}).wait(1).to({graphics:mask_graphics_901,x:279.675,y:319.575}).wait(1).to({graphics:mask_graphics_902,x:279.675,y:319.35}).wait(1).to({graphics:mask_graphics_903,x:279.675,y:319.15}).wait(1).to({graphics:mask_graphics_904,x:279.675,y:318.95}).wait(1).to({graphics:mask_graphics_905,x:279.675,y:318.725}).wait(1).to({graphics:mask_graphics_906,x:279.675,y:318.525}).wait(1).to({graphics:mask_graphics_907,x:279.675,y:318.325}).wait(1).to({graphics:mask_graphics_908,x:385.7031,y:460.3781}).wait(1).to({graphics:mask_graphics_909,x:385.7031,y:459.9031}).wait(1).to({graphics:mask_graphics_910,x:385.7031,y:459.3781}).wait(1).to({graphics:mask_graphics_911,x:385.7031,y:458.9031}).wait(1).to({graphics:mask_graphics_912,x:385.7031,y:458.4281}).wait(1).to({graphics:mask_graphics_913,x:385.7031,y:457.9031}).wait(1).to({graphics:mask_graphics_914,x:385.7031,y:457.4531}).wait(1).to({graphics:mask_graphics_915,x:385.7031,y:456.9781}).wait(1).to({graphics:mask_graphics_916,x:385.7031,y:456.4531}).wait(1).to({graphics:mask_graphics_917,x:385.7031,y:455.9781}).wait(1).to({graphics:mask_graphics_918,x:385.7031,y:455.5031}).wait(1).to({graphics:mask_graphics_919,x:385.7031,y:454.9781}).wait(1).to({graphics:mask_graphics_920,x:385.7031,y:454.5031}).wait(1).to({graphics:mask_graphics_921,x:385.7031,y:453.9781}).wait(1).to({graphics:mask_graphics_922,x:385.7031,y:453.5031}).wait(1).to({graphics:mask_graphics_923,x:385.7031,y:453.0281}).wait(1).to({graphics:mask_graphics_924,x:385.7031,y:452.5031}).wait(1).to({graphics:mask_graphics_925,x:385.7031,y:452.0281}).wait(1).to({graphics:mask_graphics_926,x:385.7031,y:451.5781}).wait(1).to({graphics:mask_graphics_927,x:385.7031,y:451.0531}).wait(1).to({graphics:mask_graphics_928,x:385.7031,y:450.5781}).wait(1).to({graphics:mask_graphics_929,x:385.7031,y:450.0531}).wait(1).to({graphics:mask_graphics_930,x:385.7031,y:449.5781}).wait(1).to({graphics:mask_graphics_931,x:385.7031,y:449.1031}).wait(1).to({graphics:mask_graphics_932,x:385.7031,y:448.5781}).wait(1).to({graphics:mask_graphics_933,x:385.7031,y:448.1031}).wait(1).to({graphics:mask_graphics_934,x:385.7031,y:447.6281}).wait(1).to({graphics:mask_graphics_935,x:385.7031,y:447.1031}).wait(1).to({graphics:mask_graphics_936,x:385.7031,y:446.6281}).wait(1).to({graphics:mask_graphics_937,x:385.7031,y:446.1781}).wait(1).to({graphics:mask_graphics_938,x:385.7031,y:445.6281}).wait(1).to({graphics:mask_graphics_939,x:385.7031,y:445.1781}).wait(1).to({graphics:mask_graphics_940,x:385.7031,y:444.6531}).wait(1).to({graphics:mask_graphics_941,x:385.7031,y:444.1781}).wait(1).to({graphics:mask_graphics_942,x:385.7031,y:443.7031}).wait(1).to({graphics:mask_graphics_943,x:385.7031,y:443.1781}).wait(1).to({graphics:mask_graphics_944,x:385.7031,y:442.7031}).wait(1).to({graphics:mask_graphics_945,x:385.7031,y:442.2281}).wait(1).to({graphics:mask_graphics_946,x:385.7031,y:441.7031}).wait(1).to({graphics:mask_graphics_947,x:385.7031,y:441.2281}).wait(1).to({graphics:mask_graphics_948,x:385.7031,y:440.7031}).wait(1).to({graphics:mask_graphics_949,x:385.7031,y:440.2281}).wait(1).to({graphics:mask_graphics_950,x:385.7031,y:439.7781}).wait(1).to({graphics:mask_graphics_951,x:385.7031,y:439.2531}).wait(1).to({graphics:mask_graphics_952,x:385.7031,y:438.7781}).wait(1).to({graphics:mask_graphics_953,x:385.7031,y:438.3031}).wait(1).to({graphics:mask_graphics_954,x:385.7031,y:437.7781}).wait(1).to({graphics:mask_graphics_955,x:385.7031,y:437.3031}).wait(1).to({graphics:mask_graphics_956,x:385.7031,y:436.8281}).wait(1).to({graphics:mask_graphics_957,x:385.7031,y:436.3031}).wait(1).to({graphics:mask_graphics_958,x:385.7031,y:435.8281}).wait(1).to({graphics:mask_graphics_959,x:385.7031,y:435.3031}).wait(1).to({graphics:mask_graphics_960,x:385.7031,y:434.8281}).wait(1).to({graphics:mask_graphics_961,x:385.7031,y:434.3781}).wait(1).to({graphics:mask_graphics_962,x:385.7031,y:433.8281}).wait(1).to({graphics:mask_graphics_963,x:385.7031,y:433.3781}).wait(1).to({graphics:mask_graphics_964,x:385.7031,y:432.9031}).wait(1).to({graphics:mask_graphics_965,x:385.7031,y:432.3781}).wait(1).to({graphics:mask_graphics_966,x:385.7031,y:431.9031}).wait(1).to({graphics:mask_graphics_967,x:385.7031,y:431.4281}).wait(1).to({graphics:mask_graphics_968,x:385.7031,y:430.9031}).wait(1).to({graphics:mask_graphics_969,x:385.7031,y:430.4281}).wait(1).to({graphics:mask_graphics_970,x:385.7031,y:429.9031}).wait(1).to({graphics:mask_graphics_971,x:385.7031,y:429.4281}).wait(1).to({graphics:mask_graphics_972,x:385.7031,y:428.9781}).wait(1).to({graphics:mask_graphics_973,x:385.7031,y:428.4281}).wait(1).to({graphics:mask_graphics_974,x:385.7031,y:427.9781}).wait(1).to({graphics:mask_graphics_975,x:385.7031,y:427.5031}).wait(1).to({graphics:mask_graphics_976,x:385.7031,y:426.9781}).wait(1).to({graphics:mask_graphics_977,x:385.7031,y:426.5031}).wait(1).to({graphics:mask_graphics_978,x:385.7031,y:426.0281}).wait(1).to({graphics:mask_graphics_979,x:385.7031,y:425.5031}).wait(1).to({graphics:mask_graphics_980,x:385.7031,y:425.0281}).wait(1).to({graphics:mask_graphics_981,x:385.7031,y:424.5031}).wait(1).to({graphics:mask_graphics_982,x:385.7031,y:424.0281}).wait(1).to({graphics:mask_graphics_983,x:385.7031,y:423.5781}).wait(1).to({graphics:mask_graphics_984,x:385.7031,y:423.0281}).wait(1).to({graphics:mask_graphics_985,x:385.7031,y:422.5781}).wait(1).to({graphics:mask_graphics_986,x:385.7031,y:422.1031}).wait(1).to({graphics:mask_graphics_987,x:385.7031,y:421.5781}).wait(1).to({graphics:mask_graphics_988,x:385.7031,y:421.1031}).wait(1).to({graphics:mask_graphics_989,x:385.7031,y:420.5781}).wait(1).to({graphics:mask_graphics_990,x:385.7031,y:420.1031}).wait(1).to({graphics:mask_graphics_991,x:385.7031,y:419.6281}).wait(1).to({graphics:mask_graphics_992,x:385.7031,y:419.1031}).wait(1).to({graphics:mask_graphics_993,x:385.7031,y:418.6281}).wait(1).to({graphics:mask_graphics_994,x:385.7031,y:418.1781}).wait(1).to({graphics:mask_graphics_995,x:385.7031,y:417.6281}).wait(1).to({graphics:mask_graphics_996,x:385.7031,y:417.1781}).wait(1).to({graphics:mask_graphics_997,x:385.7031,y:416.7031}).wait(1).to({graphics:mask_graphics_998,x:385.7031,y:416.1781}).wait(1).to({graphics:mask_graphics_999,x:385.7031,y:415.7031}).wait(1).to({graphics:mask_graphics_1000,x:385.7031,y:415.1781}).wait(1).to({graphics:mask_graphics_1001,x:385.7031,y:414.7031}).wait(1).to({graphics:mask_graphics_1002,x:385.7031,y:414.2281}).wait(1).to({graphics:mask_graphics_1003,x:385.7031,y:413.7031}).wait(1).to({graphics:mask_graphics_1004,x:385.7031,y:413.2281}).wait(1).to({graphics:mask_graphics_1005,x:385.7031,y:412.7531}).wait(1).to({graphics:mask_graphics_1006,x:385.7031,y:412.2281}).wait(1).to({graphics:mask_graphics_1007,x:385.7031,y:411.7781}).wait(1).to({graphics:mask_graphics_1008,x:385.7031,y:411.3031}).wait(1).to({graphics:mask_graphics_1009,x:385.7031,y:410.7781}).wait(1).to({graphics:mask_graphics_1010,x:385.7031,y:410.3031}).wait(1).to({graphics:mask_graphics_1011,x:385.7031,y:409.7781}).wait(1).to({graphics:mask_graphics_1012,x:385.7031,y:409.3031}).wait(1).to({graphics:mask_graphics_1013,x:385.7031,y:408.8281}).wait(1).to({graphics:mask_graphics_1014,x:385.7031,y:408.3031}).wait(1).to({graphics:mask_graphics_1015,x:385.7031,y:407.8281}).wait(1).to({graphics:mask_graphics_1016,x:385.7031,y:407.3531}).wait(1).to({graphics:mask_graphics_1017,x:385.7031,y:406.8281}).wait(1).to({graphics:mask_graphics_1018,x:385.7031,y:406.3531}).wait(1).to({graphics:mask_graphics_1019,x:385.7031,y:405.8281}).wait(1).to({graphics:mask_graphics_1020,x:385.7031,y:405.3781}).wait(1).to({graphics:mask_graphics_1021,x:385.7031,y:404.9031}).wait(1).to({graphics:mask_graphics_1022,x:385.7031,y:404.3781}).wait(1).to({graphics:mask_graphics_1023,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1024,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1025,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1026,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1027,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1028,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1029,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1030,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1031,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1032,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1033,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1034,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1035,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1036,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1037,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1038,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1039,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1040,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1041,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1042,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1043,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1044,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1045,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1046,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1047,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1048,x:385.7031,y:403.9531}).wait(1).to({graphics:mask_graphics_1049,x:385.7031,y:403.9531}).wait(766));

	// Black_obj_
	this.Black = new lib.Scene_1_Black();
	this.Black.name = "Black";
	this.Black.depth = 0;
	this.Black.isAttachedToCamera = 0
	this.Black.isAttachedToMask = 0
	this.Black.layerDepth = 0
	this.Black.layerIndex = 12
	this.Black.maskLayerName = 0

	var maskedShapeInstanceList = [this.Black];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.Black).wait(944).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},0).to({_off:true},15).wait(856));

	// Ground_obj_
	this.Ground = new lib.Scene_1_Ground();
	this.Ground.name = "Ground";
	this.Ground.depth = 0;
	this.Ground.isAttachedToCamera = 0
	this.Ground.isAttachedToMask = 0
	this.Ground.layerDepth = 0
	this.Ground.layerIndex = 13
	this.Ground.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Ground).wait(1034).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},0).wait(15).to({_off:true},1).wait(765));

	// sun_obj_
	this.sun = new lib.Scene_1_sun();
	this.sun.name = "sun";
	this.sun.depth = 0;
	this.sun.isAttachedToCamera = 0
	this.sun.isAttachedToMask = 0
	this.sun.layerDepth = 0
	this.sun.layerIndex = 14
	this.sun.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.sun).wait(663).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},360).wait(26).to({_off:true},1).wait(765));

	// Sky_obj_
	this.Sky = new lib.Scene_1_Sky();
	this.Sky.name = "Sky";
	this.Sky.depth = 0;
	this.Sky.isAttachedToCamera = 0
	this.Sky.isAttachedToMask = 0
	this.Sky.layerDepth = 0
	this.Sky.layerIndex = 15
	this.Sky.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Sky).wait(663).to({regX:230.8,regY:244.1,scaleX:2.3483,scaleY:2.3483,x:-0.1},360).wait(26).to({_off:true},1).wait(765));

	// Long_Night_obj_
	this.Long_Night = new lib.Scene_1_Long_Night();
	this.Long_Night.name = "Long_Night";
	this.Long_Night.depth = 0;
	this.Long_Night.isAttachedToCamera = 0
	this.Long_Night.isAttachedToMask = 0
	this.Long_Night.layerDepth = 0
	this.Long_Night.layerIndex = 16
	this.Long_Night.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Long_Night).wait(630).to({_off:true},1).wait(1184));

	// Two_Entered_obj_
	this.Two_Entered = new lib.Scene_1_Two_Entered();
	this.Two_Entered.name = "Two_Entered";
	this.Two_Entered.depth = 0;
	this.Two_Entered.isAttachedToCamera = 0
	this.Two_Entered.isAttachedToMask = 0
	this.Two_Entered.layerDepth = 0
	this.Two_Entered.layerIndex = 17
	this.Two_Entered.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Two_Entered).wait(345).to({regX:489.9,regY:207.2,scaleX:4.011,scaleY:4.011,x:0.05,y:-0.15},0).to({regX:0,regY:0,scaleX:1,scaleY:1,x:0,y:0},14).wait(120).to({_off:true},1).wait(1335));

	// Chameleonidae_obj_
	this.Chameleonidae = new lib.Scene_1_Chameleonidae();
	this.Chameleonidae.name = "Chameleonidae";
	this.Chameleonidae.depth = 0;
	this.Chameleonidae.isAttachedToCamera = 1
	this.Chameleonidae.isAttachedToMask = 0
	this.Chameleonidae.layerDepth = 0
	this.Chameleonidae.layerIndex = 18
	this.Chameleonidae.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Chameleonidae).wait(344).to({_off:true},1).wait(1470));

	// Bidding_obj_
	this.Bidding = new lib.Scene_1_Bidding();
	this.Bidding.name = "Bidding";
	this.Bidding.depth = 0;
	this.Bidding.isAttachedToCamera = 1
	this.Bidding.isAttachedToMask = 0
	this.Bidding.layerDepth = 0
	this.Bidding.layerIndex = 19
	this.Bidding.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Bidding).wait(237).to({_off:true},1).wait(1577));

	// Enter_obj_
	this.Enter = new lib.Scene_1_Enter();
	this.Enter.name = "Enter";
	this.Enter.depth = 0;
	this.Enter.isAttachedToCamera = 0
	this.Enter.isAttachedToMask = 0
	this.Enter.layerDepth = 0
	this.Enter.layerIndex = 20
	this.Enter.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Enter).wait(78).to({_off:true},1).wait(1736));

	// Lightning_3_obj_
	this.Lightning_3 = new lib.Scene_1_Lightning_3();
	this.Lightning_3.name = "Lightning_3";
	this.Lightning_3.depth = 0;
	this.Lightning_3.isAttachedToCamera = 0
	this.Lightning_3.isAttachedToMask = 0
	this.Lightning_3.layerDepth = 0
	this.Lightning_3.layerIndex = 21
	this.Lightning_3.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Lightning_3).wait(83).to({_off:true},6).wait(1726));

	// Lightning_2_obj_
	this.Lightning_2 = new lib.Scene_1_Lightning_2();
	this.Lightning_2.name = "Lightning_2";
	this.Lightning_2.depth = 0;
	this.Lightning_2.isAttachedToCamera = 0
	this.Lightning_2.isAttachedToMask = 0
	this.Lightning_2.layerDepth = 0
	this.Lightning_2.layerIndex = 22
	this.Lightning_2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Lightning_2).wait(87).to({_off:true},3).wait(1725));

	// Lightning_1_obj_
	this.Lightning_1 = new lib.Scene_1_Lightning_1();
	this.Lightning_1.name = "Lightning_1";
	this.Lightning_1.depth = 0;
	this.Lightning_1.isAttachedToCamera = 0
	this.Lightning_1.isAttachedToMask = 0
	this.Lightning_1.layerDepth = 0
	this.Lightning_1.layerIndex = 23
	this.Lightning_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Lightning_1).wait(85).to({_off:true},6).wait(1724));

	// FG_Dark_obj_
	this.FG_Dark = new lib.Scene_1_FG_Dark();
	this.FG_Dark.name = "FG_Dark";
	this.FG_Dark.depth = 0;
	this.FG_Dark.isAttachedToCamera = 0
	this.FG_Dark.isAttachedToMask = 0
	this.FG_Dark.layerDepth = 0
	this.FG_Dark.layerIndex = 24
	this.FG_Dark.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.FG_Dark).wait(88).to({regX:104,regY:199.3,scaleX:3.9695,scaleY:3.9695},150).to({regX:489.9,regY:207.2,scaleX:4.011,scaleY:4.011,x:0.05,y:-0.15},107).to({regX:0,regY:0,scaleX:1,scaleY:1,x:0,y:0},133).to({_off:true},1).wait(1336));

	// MG_Light_obj_
	this.MG_Light = new lib.Scene_1_MG_Light();
	this.MG_Light.name = "MG_Light";
	this.MG_Light.depth = 0;
	this.MG_Light.isAttachedToCamera = 0
	this.MG_Light.isAttachedToMask = 0
	this.MG_Light.layerDepth = 0
	this.MG_Light.layerIndex = 25
	this.MG_Light.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.MG_Light).wait(478).to({_off:true},1).wait(1336));

	// P_Chameleon_obj_
	this.P_Chameleon = new lib.Scene_1_P_Chameleon();
	this.P_Chameleon.name = "P_Chameleon";
	this.P_Chameleon.depth = 0;
	this.P_Chameleon.isAttachedToCamera = 0
	this.P_Chameleon.isAttachedToMask = 0
	this.P_Chameleon.layerDepth = 0
	this.P_Chameleon.layerIndex = 26
	this.P_Chameleon.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.P_Chameleon).wait(478).to({_off:true},1).wait(1336));

	// G_Chameleon_obj_
	this.G_Chameleon = new lib.Scene_1_G_Chameleon();
	this.G_Chameleon.name = "G_Chameleon";
	this.G_Chameleon.depth = 0;
	this.G_Chameleon.isAttachedToCamera = 0
	this.G_Chameleon.isAttachedToMask = 0
	this.G_Chameleon.layerDepth = 0
	this.G_Chameleon.layerIndex = 27
	this.G_Chameleon.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.G_Chameleon).wait(478).to({_off:true},1).wait(1336));

	// MG_Dark_obj_
	this.MG_Dark = new lib.Scene_1_MG_Dark();
	this.MG_Dark.name = "MG_Dark";
	this.MG_Dark.depth = 0;
	this.MG_Dark.isAttachedToCamera = 0
	this.MG_Dark.isAttachedToMask = 0
	this.MG_Dark.layerDepth = 0
	this.MG_Dark.layerIndex = 28
	this.MG_Dark.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.MG_Dark).wait(478).to({_off:true},1).wait(1336));

	// BG_Hedge_obj_
	this.BG_Hedge = new lib.Scene_1_BG_Hedge();
	this.BG_Hedge.name = "BG_Hedge";
	this.BG_Hedge.depth = 0;
	this.BG_Hedge.isAttachedToCamera = 0
	this.BG_Hedge.isAttachedToMask = 0
	this.BG_Hedge.layerDepth = 0
	this.BG_Hedge.layerIndex = 29
	this.BG_Hedge.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.BG_Hedge).wait(478).to({_off:true},1).wait(1336));

	// Sky_2_obj_
	this.Sky_2 = new lib.Scene_1_Sky_2();
	this.Sky_2.name = "Sky_2";
	this.Sky_2.depth = 0;
	this.Sky_2.isAttachedToCamera = 0
	this.Sky_2.isAttachedToMask = 0
	this.Sky_2.layerDepth = 0
	this.Sky_2.layerIndex = 30
	this.Sky_2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Sky_2).wait(478).to({_off:true},1).wait(1336));

	// Sky_1_obj_
	this.Sky_1 = new lib.Scene_1_Sky_1();
	this.Sky_1.name = "Sky_1";
	this.Sky_1.depth = 0;
	this.Sky_1.isAttachedToCamera = 0
	this.Sky_1.isAttachedToMask = 0
	this.Sky_1.layerDepth = 0
	this.Sky_1.layerIndex = 31
	this.Sky_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Sky_1).wait(478).to({_off:true},1).wait(1336));

	// Night_obj_
	this.Night = new lib.Scene_1_Night();
	this.Night.name = "Night";
	this.Night.depth = 0;
	this.Night.isAttachedToCamera = 0
	this.Night.isAttachedToMask = 0
	this.Night.layerDepth = 0
	this.Night.layerIndex = 32
	this.Night.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Night).wait(478).to({_off:true},1).wait(1336));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(82,-219.5,942.4000000000001,1457.5);
// library properties:
lib.properties = {
	id: '4ACA741D7AB0448C83A50CF67050E9E5',
	width: 800,
	height: 600,
	fps: 30,
	color: "#000000",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_16.png?1587420933457", id:"CachedBmp_16"},
		{src:"images/ChameleonIntro_atlas_1.png?1587420933203", id:"ChameleonIntro_atlas_1"},
		{src:"images/ChameleonIntro_atlas_2.png?1587420933203", id:"ChameleonIntro_atlas_2"},
		{src:"images/ChameleonIntro_atlas_3.png?1587420933203", id:"ChameleonIntro_atlas_3"},
		{src:"images/ChameleonIntro_atlas_4.png?1587420933204", id:"ChameleonIntro_atlas_4"},
		{src:"images/ChameleonIntro_atlas_5.png?1587420933204", id:"ChameleonIntro_atlas_5"},
		{src:"images/ChameleonIntro_atlas_6.png?1587420933204", id:"ChameleonIntro_atlas_6"},
		{src:"images/ChameleonIntro_atlas_7.png?1587420933204", id:"ChameleonIntro_atlas_7"},
		{src:"images/ChameleonIntro_atlas_8.png?1587420933204", id:"ChameleonIntro_atlas_8"},
		{src:"images/ChameleonIntro_atlas_9.png?1587420933204", id:"ChameleonIntro_atlas_9"},
		{src:"images/ChameleonIntro_atlas_10.png?1587420933205", id:"ChameleonIntro_atlas_10"},
		{src:"images/ChameleonIntro_atlas_11.png?1587420933205", id:"ChameleonIntro_atlas_11"},
		{src:"images/ChameleonIntro_atlas_12.png?1587420933205", id:"ChameleonIntro_atlas_12"},
		{src:"images/ChameleonIntro_atlas_13.png?1587420933206", id:"ChameleonIntro_atlas_13"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['4ACA741D7AB0448C83A50CF67050E9E5'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;