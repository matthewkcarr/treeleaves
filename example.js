var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),

		treeImage = new Image(),
    RIGHT = 1,
    LEFT = 2,
    BALL_RADIUS   = 23,
		LEAF_HEIGHT = 30,

    GRAVITY_FORCE = 9.81,  // 9.81 m/s / s

    lastTime = 0,
		LEAF_ANIMATION_TIME = 2,
		LEAF_ROTATION_ANGLE = Math.PI/30,
    fps = 60,

    PLATFORM_HEIGHT_IN_METERS = 15, // 10 meters
    pixelsPerMeter = (canvas.height) /
                      PLATFORM_HEIGHT_IN_METERS,

    moveLeaf = {
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


// Behavior functions............................................
function paintLeaf(sprite, context) {
	context.save();
	context.beginPath();
	if( sprite.rotationTimer.isRunning() ) {
		context.arc(sprite.left + LEAF_HEIGHT, sprite.top + LEAF_HEIGHT,
							 LEAF_HEIGHT, sprite.rotationAngle, sprite.rotationAngle + Math.PI/2, false);
		if( sprite.rotationClockwise)
		{  sprite.rotationAngle += LEAF_ROTATION_ANGLE; //Math.PI/30; 
		} 
		else 
		{  sprite.rotationAngle -= LEAF_ROTATION_ANGLE; //Math.PI/30; 
		}
	}else {
		context.arc(sprite.left + LEAF_HEIGHT, sprite.top + LEAF_HEIGHT,
							 LEAF_HEIGHT, 0, Math.PI/2, false);
	}
	context.closePath();
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

	context.restore();
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

	 for( var i = 0; i < leaves.length; i++ ) {
		 var leaf = leaves[i];
		 leaf.paint(context);
	  }


   window.requestNextAnimationFrame(animate);
}

function generateLeaf() {
  var leaf = new Sprite('leaf' + leaves.length,
       {
          paint: function (sprite, context) {
						 paintLeaf(sprite, context);
          }
       },

       [ moveLeaf ]
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
  leaf['rotationAngle'] = 0; 
	leaf['rotatingBegin'] = Math.floor( Math.random() * LEAF_ANIMATION_TIME ) * 1000;
	leaf.animationTimer.start();  //start the animation but not rotating
  leaf['pushDirection'] = Math.floor( (Math.random() * 2) + 1);
	leaf.animating = true;
	leaves.push(leaf);
}

// Event handlers................................................

// Initialization................................................  


treeImage.src = 'tree_for_leaves.png';
window.requestNextAnimationFrame(animate);
setInterval( generateLeaf, 300);
