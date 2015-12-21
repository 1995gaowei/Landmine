var colorList = ['blue', 'green', 'red', 'orange', 'yellow', 'gray', 'black', 'purple'];
var mineList;
var safeCount;
var time;
var timer;

$(document).ready(function () {

	init();

	$('#start').click(function() {
		$(this).text('重新开始');
		init();
		time = 0;
		clearInterval(timer);
		timer = setInterval(function() {
			time++;
			$('#timeCounter').html('<span class="glyphicon glyphicon-time"></span> '+time);
			
		}, 1000);
		startGame();
	});
	
});

function startGame() {
	mineList = setMine();

	$('.btn').mousedown(function(e){
		if ($(this).attr('leftclick') == 'false') {
			if (e.which == 1) {
				if ($(this).attr('rightclick') == 'true') {
					$(this).css('background-image', 'none');
					$(this).attr('rightclick', 'false');
				} else {
					
					var x = Number($(this).attr('x'));
					var y = Number($(this).attr('y'));
					var index = mineList[x][y];
					if (index == 0) {
						spread(x, y);
					} else if (index == -1) {
						gameOver(x, y);
					} else {
						$(this).css('color', colorList[index-1]);
						$(this).text(index);
						$(this).attr('leftclick', 'true');
						safeCount++;
					}

					if (safeCount==71) {
						success();
					}
				}
			} else if (e.which == 3) {
				if ($(this).attr('rightclick') == 'false') {
					$(this).css('background-image', 'url(flag.jpg)');
					$(this).attr('rightclick', 'true');
				} else if ($(this).attr('rightclick') == 'true') {
					$(this).css('background-image', 'none');
					$(this).attr('rightclick', 'false');
				}
			}
		}
	});

	$('.main').bind('contextmenu', function(){
		return false;
	});
}

function success() {
	noclick();
	clearInterval(timer);
	$('#tip').html('<span class="glyphicon glyphicon-thumbs-up"></span> 你赢了，花时'+time+'秒');
	time = 0;
	$('#timeCounter').html('<span class="glyphicon glyphicon-time"></span> '+time);
}

function spread(i, j) {
	
	var index = mineList[i][j];
	if ($('.btn[x="'+i+'"][y="'+j+'"]').attr('leftclick') == 'false'){
		safeCount++;
		if (index == 0) {
			$('.btn[x="'+i+'"][y="'+j+'"]').css('background-image', 'none');
			$('.btn[x="'+i+'"][y="'+j+'"]').attr('disabled', 'true');
			$('.btn[x="'+i+'"][y="'+j+'"]').attr('leftclick', 'true');
			if (i>0) {
				spread(i-1, j);
			}
			if (i<8) {
				spread(i+1, j);
			}
			if (j>0) {
				spread(i, j-1);
			}
			if (j<8) {
				spread(i, j+1);
			}
			if (j>0 && i>0) {
				spread(i-1, j-1);
			}
			if (j<8 && i>0) {
				spread(i-1, j+1);
			}
			if (j>0 && i<8) {
				spread(i+1, j-1);
			}
			if (j<8 && i<8) {
				spread(i+1, j+1);
			}
		} else if (index > 0) {
			$('.btn[x="'+i+'"][y="'+j+'"]').css('background-image', 'none');
			$('.btn[x="'+i+'"][y="'+j+'"]').attr('leftclick', 'true');
			$('.btn[x="'+i+'"][y="'+j+'"]').css('color', colorList[index-1]);
			$('.btn[x="'+i+'"][y="'+j+'"]').text(index);
			return;
		} else {
			return;
		}
	} else {
		return;
	}
}

function gameOver(x, y) {
	noclick();
	$('#tip').html('<span class="glyphicon glyphicon-thumbs-down"></span> 你输了');
	time = 0;
	$('#timeCounter').html('<span class="glyphicon glyphicon-time"></span> '+time);
	clearInterval(timer);
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (mineList[i][j] == -1) {
				$('.btn[x="'+i+'"][y="'+j+'"]').css('background-image', 'url(bomb.png)');
			}
		}
	}
	$('.btn[x="'+x+'"][y="'+y+'"]').css('border-color', 'red');
}

function init() {
	var content='';
	safeCount = 0;
	for(var i=0; i<9; i++) {
		for (var j=0; j<9; j++) {
			content += '<button class="btn btn-default" x="'+i+'" y="'+j+'" leftclick="false" rightclick="false"></button>';
		}
	}
	$('.main').html(content);
	$('#tip').html('');
}

function noclick() {
	for(var i=0; i<9; i++) {
		for (var j=0; j<9; j++) {
			$('.btn[x="'+i+'"][y="'+j+'"]').attr('disabled', 'true');
		}
	}
}

function setMine() {
	mineArray = new Array();
	for (var i=0; i<10; i++) {
		var curMine = Math.floor(Math.random()*81);
		var exist = false;
		for (var j=0; j<mineArray.length; j++) {
			if (curMine == mineArray[j]) {
				exist = true;
				break;
			}
		}
		if (!exist) {
			mineArray[j] = curMine;
		} else {
			i--;
		}
	}
	var mineList = new Array();
	for (var i=0; i<9; i++) {
		mineList[i] = new Array();
		for (var j=0; j<9; j++) {
			var isMine = false;
			for (var k=0; k<mineArray.length; k++) {
				if (mineArray[k]==i*9+j) {
					isMine = true;
					break;
				}
			}
			if (isMine) {
				mineList[i][j] = -1;
			} else {
				mineList[i][j] = 0;
			}
		}
	}
	console.log(mineArray.length);

	//计算周围地雷数;
	for (var i=0; i<9; i++) {
		for (var j=0; j<9; j++) {
			if (mineList[i][j] != -1) {
				around = 0;
				if (i>0 && mineList[i-1][j] == -1) {
					around++;
				}
				if (i<8 && mineList[i+1][j] == -1) {
					around++;
				}
				if (j>0 && mineList[i][j-1] == -1) {
					around++;
				}
				if (j<8 && mineList[i][j+1] == -1) {
					around++;
				}
				if (j>0 && i>0 && mineList[i-1][j-1] == -1) {
					around++;
				}
				if (j<8 && i>0 && mineList[i-1][j+1] == -1) {
					around++;
				}
				if (j>0 && i<8 && mineList[i+1][j-1] == -1) {
					around++;
				}
				if (j<8 && i<8 && mineList[i+1][j+1] == -1) {
					around++;
				}
				mineList[i][j] = around;
			}
		}
	}

	return mineList;
}