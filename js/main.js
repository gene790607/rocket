

//取出隨機整數
function getRandomInt(min,max) {
	return Math.floor(Math.random()*(max-min+1))+min;
}

//當dom讀取完畢執行
$(function(){
	var	$body=$("body"),
		$stage=$("#stage"),
		$player=$("#player"),
		$score=$("#score"),
		enemy_fall_speed=2,
		enemy_fall_max_speed=18,
		enemy_wave=0,
		enemy_wave_gap=500,
		hit_test_r=20,
		score=0,
		score_add=1,
		loop,
		speedup,
		mySound;
		


	//左鍵點擊
	function left_click_action(){
		var x=parseInt($player.css("left"));
		if(x>0)
		$player.css("left",x-150+"px");
	}

	//右鍵點擊
	function right_click_action(e){
		e.preventDefault();
		var x=parseInt($player.css("left"));
		if(x<300)
		$player.css("left",x+150+"px");
	}

	//重新開始
	function initGame(){
		enemy_fall_speed=2,
		enemy_wave=0,
		score=0,
		score_add=1

		//player 初始位置	
		$player.css("left",($stage.width()-$player.width())/2+"px");
		$player.css("top",$stage.height()-$player.height());

		//score 初始位置
		$score.css("left",$stage.width()-$score.width()-5+"px");
		$score.css("top","10px");

		//建立敵人
		createEnemy();

		//時間器重設
		loop = setInterval(loop_func,1000/60);
		speedup= setInterval(speedup_func,1000);

		//角色移動
		$body.click(left_click_action);
		$body.contextmenu(right_click_action);

		//聲音播放
		mySound.play();
		
	}
	
	soundManager.setup({
	  onready: function() {
	    mySound=soundManager.createSound({
	    	id: 'aSound',
	    	url: 'New_Land.mp3'
	    });
	  		initGame();
		}
	});


	//生成障礙物
		function createEnemy(){
			var enemy_pos=[0,150,300];
			for(var i=0;i<2;i++)
			{
				$stage.append("<div class='sprite enemy'></div>");
				var $enemy=$stage.find(".enemy:last");
				$enemy.data("wave",enemy_wave)
				var rand_index=getRandomInt(0,enemy_pos.length-1);
				var enemy_x=enemy_pos.splice(rand_index,1)[0];  //障礙物起始位置
				$enemy.css("left",enemy_x+"px");
				$enemy.css("top",-($enemy.height())+"px");
			}
		}
		
	
	
	

	//遊戲結束
	function endGame(){

		//停止撥放
		mySound.stop();

		//角色不能移動
		$body.unbind("click");
		$body.unbind("contextmenu");

		//清除計時器
		clearInterval(loop);
		clearInterval(speedup);



		//跳出結束畫面
		$stage.append("<div id='gameover'>RETRY</div>");
		$gameover=$("#gameover");
		$("#gameover").css({
			"background":"black",
			"opacity":"0.7",
			"width":"100%",
			"height":"100%",
			"position":"relative",
			"color": "white",
			"line-height":"800px",
			"text-align":"center",
			"font-size":"50px"
		});
		$gameover.click(function(){
			$gameover.unbind("click");

			//清除retry頁面
			$gameover.remove();

			//清空Enemy
			$stage.find(".enemy").remove();

			

			initGame();
		});
	}

	
	//計時器(處理落下的動畫跟碰撞機制)
	function loop_func(){
		$stage.find(".enemy").each(function(){
			var enemy_y=parseInt($(this).css("top"));
			if(enemy_y > enemy_wave_gap && $(this).data("wave")==enemy_wave){
				enemy_wave++;
				createEnemy();
			}

			var px=parseInt($player.css("left"))+$player.width()/2;
			var py=parseInt($player.css("top"))+$player.height()/2;
			var ex=parseInt($(this).css("left"))+$(this).width()/2;
			var ey=parseInt($(this).css("top"))+$(this).height()/2;
			var p_e_dist=Math.sqrt(Math.pow(px-ex,2)+Math.pow(py-ey,2));
			if(hit_test_r*2>p_e_dist){
				endGame();
			}


			if(enemy_y>$stage.height()){
				$(this).remove();
				return;
			}
			$(this).css("top",enemy_y+enemy_fall_speed+"px");
			$score.html(score);
			score+=score_add;
			score = parseInt(score);
		});
	}

	//每秒增加落下速度
	function speedup_func(){
		if(enemy_fall_speed>=enemy_fall_max_speed)
		{
			enemy_fall_speed=18
			clearInterval(speedup);
		}
		enemy_fall_speed+=0.1;
		score_add*=1.1;
	}
})