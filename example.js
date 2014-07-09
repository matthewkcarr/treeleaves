var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),

		treeImage = new Image(),
    RIGHT = 1,
    LEFT = 2,
    BALL_RADIUS   = 23,
    LEDGE_LEFT   = 280,
    LEDGE_TOP    = 55,
    LEDGE_WIDTH  = 50,
    LEDGE_HEIGHT = 12,

    GRAVITY_FORCE = 9.81,  // 9.81 m/s / s

    lastTime = 0,
		LEAF_ANIMATION_TIME = 6,
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
				 /*if( ! sprite.rotationTimer.isRunning() ) {
					 if( sprite.animationTimer.getElapsedTime() >= sprite.rotatingBegin) 
					 {  sprite.rotationTimer.start();
					 }
				 }*/

				 //calculate X
         if (sprite.animating) {
            if (sprite.pushDirection === LEFT) sprite.left -= sprite.velocityX / fps;
            else                sprite.left += sprite.velocityX / fps;

            /*if (isSpriteOnLedge(sprite)) {
               if (sprite.pushAnimationTimer.getElapsedTime() > 200) {
                  sprite.pushAnimationTimer.stop();
               }
            }*/
            /*if ( ! sprite.fallingAnimationTimer.isRunning()) {
							 sprite.fallingAnimationTimer.start();
							 sprite.velocityY = 0;
               this.lastFrameTime = now;
            }*/
         }

				 //calculate Y
         if (sprite.animating) {
            sprite.top += sprite.velocityY / fps;
            sprite.velocityY = GRAVITY_FORCE *
               (sprite.animationTimer.getElapsedTime()/1000) * pixelsPerMeter;
						//console.log('velocityY is ' + sprite.velocityY/fps);
						//console.log('sprite visibility is ' + sprite.visible);
						//console.log('sprite animating is ' + sprite.animating);

            if (sprite.top > canvas.height) {
							 sprite.animationTimer.stop();
							 //sprite.pushAnimationTimer.stop();
							 console.log('stopping leaf animation');
							 console.log('at ' + sprite.top);
							 console.log('velocity at ' + (sprite.velocityY/fps));
							 sprite.animating = false;

							 //sprite.left = LEDGE_LEFT + LEDGE_WIDTH/2 - BALL_RADIUS;
							 //sprite.top = LEDGE_TOP - BALL_RADIUS*2;

							 sprite.velocityY = 0;
            }
         }
      }
    },
		leaves = new Array();


function paintLeaf(sprite, context) {
	context.save();
	context.beginPath();
	var LEAF_LENGTH = 60;
	var LEAF_HEIGHT = 20;
	//context.arcTo(15, 15, 15 + LEAF_LENGTH, 15, LEAF_HEIGHT);
	//context.arcTo(15, 15, 15 + LEAF_LENGTH, 15, LEAF_HEIGHT);
	//context.moveTo(15 + LEAF_HEIGHT, 15 + LEAF_HEIGHT);
	/*if( sprite.rotationTimer.isRunning() ) {
		var clockwise = true;
		var angle = Math.PI / 16;
		var sin = clockwise ? Math.sin(angle): Math.sin(-angle);
		var cos = clockwise ? Math.cos(angle): Math.cos(-angle);
		console.log("calling rotate");
		context.rotate( angle );
		//context.transform( cos, sin, -sin, cos, 0 , 0);
	}*/
	context.arc(sprite.left + LEAF_HEIGHT, sprite.top + LEAF_HEIGHT,
							 LEAF_HEIGHT, 0, Math.PI/2, false);
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

function isSpriteOnLedge(sprite) {
   return sprite.left + BALL_RADIUS > LEDGE_LEFT &&
          sprite.left < LEDGE_LEFT + LEDGE_WIDTH;
}



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
  var leaf = new Sprite('leaf',
       {
          paint: function (sprite, context) {
						 paintLeaf(sprite, context);
          }
       },

       [ moveBall ]
  );
	leaf.left = Math.floor( (Math.random() * canvas.width) + (BALL_RADIUS*2));
	leaf.top = 0;
	leaf.width = BALL_RADIUS*2;
	leaf.height = BALL_RADIUS*2;
	leaf.velocityX = 140;
	leaf.velocityY = 0;
  leaf['animationTimer'] = new AnimationTimer(LEAF_ANIMATION_TIME);
  leaf['rotationTimer'] = new AnimationTimer('1');
	leaf['rotatingBegin'] = Math.floor( Math.random() * LEAF_ANIMATION_TIME ) * 1000;
	//console.log('rotate begin at ');
	//console.log(leaf.rotatingBegin);
	leaf.animationTimer.start();  //start the animation but not rotating
  //leaf.fallingAnimationTimer.start()
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
