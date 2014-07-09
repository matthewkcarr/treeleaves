var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),

		treeImage = new Image(),
    RIGHT = 1,
    LEFT = 2,
    BALL_RADIUS   = 23,
		LEAF_HEIGHT = 30,

    GRAVITY_FORCE = 9.81,  // 9.81 m/s / s

    lastTime = 0,
		LEAF_ANIMATION_TIME = 4,
    fps = 60,

    PLATFORM_HEIGHT_IN_METERS = 15, // 10 meters
    pixelsPerMeter = (canvas.height) /
                      PLATFORM_HEIGHT_IN_METERS,

    moveBall = {
      lastFrameTime: undefined,
      
      execute: function (sprite, context, time) {
         var now = +new Date();
         if (this.lastFrameTime == undefined) {
            this.lastFrameTime = now;
            return;
         }
				 if( ! sprite.rotationTimer.isRunning() ) {
					 if( sprite.animationTimer.getElapsedTime() >= sprite.rotatingBegin) 
					 {  sprite.rotationTimer.start();
					 }
				 }

         if (sprite.animating) {
						//calculate X
            if (sprite.pushDirection === LEFT) sprite.left -= sprite.velocityX / fps;
            else                sprite.left += sprite.velocityX / fps;
					  //calculate Y
            sprite.top += sprite.velocityY / fps;
            sprite.velocityY = GRAVITY_FORCE *
               (sprite.animationTimer.getElapsedTime()/1000) * pixelsPerMeter;
						//console.log('velocityY is ' + sprite.velocityY/fps);
						//console.log('sprite visibility is ' + sprite.visible);
						//console.log('sprite animating is ' + sprite.animating);

            if (sprite.top > canvas.height) {
							 sprite.animationTimer.stop();
							 sprite.animating = false;
							 sprite.velocityY = 0;
            }
         }
      }
    },
		leaves = new Array();


function paintLeaf(sprite, context) {
	context.save();
	//context.arcTo(15, 15, 15 + LEAF_LENGTH, 15, LEAF_HEIGHT);
	//context.arcTo(15, 15, 15 + LEAF_LENGTH, 15, LEAF_HEIGHT);
	//context.moveTo(15 + LEAF_HEIGHT, 15 + LEAF_HEIGHT);
	if( sprite.rotationTimer.isRunning() ) {
		var angle = Math.PI/2;
		var sin = sprite.rotationClockwise ? Math.sin(angle): Math.sin(-angle);
		var cos = sprite.rotationClockwise ? Math.cos(angle): Math.cos(-angle);
		//console.log("calling rotate " + sprite.name + " at " + angle);
		//context.translate(sprite.left + LEAF_HEIGHT, sprite.top + LEAF_HEIGHT);
		//context.rotate( angle );
		//console.log(sprite.name + 'rotated');
		//context.transform( cos, sin, -sin, cos, 0 , 0);
	}
	context.beginPath();
	context.arc(sprite.left + LEAF_HEIGHT, sprite.top + LEAF_HEIGHT,
							 LEAF_HEIGHT, 0, Math.PI/2, false);
	//context.closePath();
	context.clip();
	context.shadowColor = 'rgba(0,0,100,0.8)';
	context.fillStyle = 'rgba(0,255,0,1)';
	context.shadowOffsetX = -2;
	context.shadowOffsetY = -2;
	context.shadowBlur = 8;

	context.lineWidth = 2;
	context.strokeStyle = 'rgba(238,236,0,1.0)';
	context.fill();
	context.stroke();

	//context.beginPath();
	/*context.arc(15 + BALL_RADIUS, 15 + BALL_RADIUS,
							 BALL_RADIUS/2, 0, Math.PI*2, false);
	context.clip();

	context.shadowColor = 'rgba(255,255,0,1.0)';
	context.shadowOffsetX = -4;
	context.shadowOffsetY = -4;
	context.shadowBlur = 8;
	context.stroke();
	*/

	context.restore();
}

// Behavior functions............................................
function paintLeaves(sprite, context) {
	context.save();
	context.beginPath();
	context.arc(sprite.left + sprite.width/2, sprite.top + sprite.height/2,
							 BALL_RADIUS, 0, Math.PI*2, false);
	context.clip();

	context.shadowColor = 'rgba(0,0,255,0.7)';
	context.shadowOffsetX = -4;
	context.shadowOffsetY = -4;
	context.shadowBlur = 8;

	context.lineWidth = 2;
	context.strokeStyle = 'rgba(100,100,195,0.8)';
	context.stroke();

	context.beginPath();
	context.arc(sprite.left + sprite.width/2, sprite.top + sprite.height/2,
							 BALL_RADIUS/2, 0, Math.PI*2, false);
	context.clip();

	context.shadowColor = 'rgba(255,255,0,1.0)';
	context.shadowOffsetX = -4;
	context.shadowOffsetY = -4;
	context.shadowBlur = 8;
	context.stroke();

	context.restore();
}

/*
function pushBallLeft() {
   if (sprite.pushAnimationTimer.isRunning()) {
      sprite.pushAnimationTimer.stop();
   }
   arrow = LEFT;
   sprite.pushAnimationTimer.start();
}

function pushBallRight() {
   if (sprite.pushAnimationTimer.isRunning()) {
      sprite.pushAnimationTimer.stop();
   }
   arrow = RIGHT;
   sprite.pushAnimationTimer.start();
}
*/



// Animation functions...........................................

function calculateFps(time) {
   var fps = 1000 / (time - lastTime);
   lastTime = time;
   return fps; 
}

function animate(time) {
   fps = calculateFps(time);

   context.clearRect(0,0,canvas.width,canvas.height);
   context.drawImage(treeImage, 0, 0);
   //drawGrid('lightgray', 10, 10);
   
	 //paintLeaves(context);
	 for( var i = 0; i < leaves.length; i++ ) {
		 var leaf = leaves[i];
		 if( ! leaf.animating ) {
		   leaves.splice( i, 1 ); //remove leaf from array if no longer animating
		 }
   }
	 for( var i = 0; i < leaves.length; i++ ) {
		 var leaf = leaves[i];
		 leaf.update(context, time);
	 }
   //ledge.update(context, time);

   //ledge.paint(context);
	 for( var i = 0; i < leaves.length; i++ ) {
		 var leaf = leaves[i];
		 leaf.paint(context);
	  }

   //paintThruster();

   window.requestNextAnimationFrame(animate);
}

function generateLeaf() {
  var leaf = new Sprite('leaf' + leaves.length,
       {
          paint: function (sprite, context) {
						 paintLeaf(sprite, context);
          }
       },

       [ moveBall ]
  );
	leaf.left = Math.floor( (Math.random() * canvas.width) + (LEAF_HEIGHT));
	leaf.top = 0;
	leaf.width = LEAF_HEIGHT;
	leaf.height = LEAF_HEIGHT;
	leaf.velocityX = 140;
	leaf.velocityY = 0;
  leaf['animationTimer'] = new AnimationTimer(LEAF_ANIMATION_TIME);
  leaf['rotationTimer'] = new AnimationTimer('2');
	var clockwise = true;
	if( ((Math.random() * 10) +1) > 5) {
	  clockwise = false;
	}
  leaf['rotationClockwise'] = clockwise; 
	leaf['rotatingBegin'] = 0;//Math.floor( Math.random() * LEAF_ANIMATION_TIME ) * 1000;
	//console.log('rotate begin at ');
	//console.log(leaf.rotatingBegin);
	leaf.animationTimer.start();  //start the animation but not rotating
  leaf['pushDirection'] = Math.floor( (Math.random() * 2) + 1);
	leaf.animating = true;
	leaves.push(leaf);
}

// Event handlers................................................

// Initialization................................................  


//ledge.left = LEDGE_LEFT;
//ledge.top = LEDGE_TOP;
//ledge.width = LEDGE_WIDTH;

treeImage.src = 'tree_for_leaves.png';
window.requestNextAnimationFrame(animate);
setInterval( generateLeaf, 400);
