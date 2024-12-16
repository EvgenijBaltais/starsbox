<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	
<img src="1.jpg" alt="" class = "pic pic_1">
<img src="2.jpg" alt="" class = "pic pic_2">
<img src="3.jpg" alt="" class = "pic pic_3">
<img src="4.jpg" alt="" class = "pic pic_4">
<img src="5.jpg" alt="" class = "pic pic_5">
<img src="6.jpg" alt="" class = "pic pic_6">
<img src="7.jpg" alt="" class = "pic pic_7">
<img src="8.jpg" alt="" class = "pic pic_8">
<div class = "wrapper">
<?php

require_once('../system/db.php');


if (isset($_GET['goal'])) {
	$goal = $_GET['goal'];
	$sql2 = "UPDATE `goal` SET `value`= 1 WHERE id = $goal";
	$result = $conn->query($sql2);

	if ($result) echo $goal;
}



$sql = "SELECT * from `goal` where 1";

$result = $conn->query($sql);
while($row = mysqli_fetch_assoc($result)) {
    $items[] = $row;
}


$sql = "SELECT * from `goal` where value = 1";

$result = $conn->query($sql);
while($row = mysqli_fetch_assoc($result)) {
    $active_items[] = $row;
}

$per = count($active_items) / count($items) * 100;

echo '

<div id="countdown" class="countdown" style = "width: 100%; margin-bottom: 50px">

  <div class="countdown-number">
    <span class="hours countdown-time">01</span>
    <span class="countdown-text">Часов</span>
  </div>
  <div class="countdown-number">
    <span class="minutes countdown-time">00</span>
    <span class="countdown-text">Минут</span>
  </div>
  <div class="countdown-number">
    <span class="seconds countdown-time">00</span>
    <span class="countdown-text">Секунд</span>
  </div>
</div>

<div style = "margin-bottom: 50px;">Старание и полная сосредоточенность <a id = "go">Вперед!</a></div>
<div class = "progress-bar">
<span class = "start">' . $per . '%</span>
<span class = "all">100%</span>
<div class = "ready" style = "width: ' . $per . '%"></div>
</div>';


foreach ($items as $key => $value) {

	if ($key % 100 == 0 && $key != 0) {
		echo '<div class = "between-step"></div>';
	}

	$code = '<div class = "step'; 
	$value['value'] == 1 ? $code .= ' step-active' : '';
	$code .= '" data-id = "' . $value['id'] . '"></div>';

	echo $code;
}


?>

<script>
	document.addEventListener('DOMContentLoaded', () => {



        document.addEventListener('click', () => {

        	if (event.target.classList.contains('step')) {
        		let target = event.target
				response = fetch('/chat/goal.php?goal=' + target.getAttribute('data-id')).then(
               response => {
                  return response.text();
               }
            ).then(
               goal => {
            		goal ? target.classList.add('step-active') : ''
               }
            );
        	}
        })


function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  return {
    'total': t,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}
 
function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');
 
  function updateClock() {
    var t = getTimeRemaining(endtime);
 
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
 
    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }
 
  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}
 
var deadline = new Date(Date.parse(new Date()) + 3600 * 1000);

document.getElementById('go').addEventListener('click', () => {
	initializeClock('countdown', deadline);
})

	})
</script>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	.wrapper {
		width: 1000px;
		margin: 100px auto;
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}

	.pic {
		display: inline-block;
		width: 24.5%;
	}

	.step {
		width: 20px;
		height: 20px;
		border: 1px solid blue;
		box-sizing: border-box;
		margin-right: 5px;
		margin-bottom: 5px;
		cursor: pointer;
	}

	.step-active {
		background: green;
		border: 1px solid green;
	}

	.between-step {
		width: 100%;
		border: 1px solid green;
		padding: 10px 0;
		margin: 20px 0;
	}

.progress-bar {
	width: 100%;
	position: relative;
	height: 50px;
	border-radius: 5px;
	border: 1px solid #000;
	margin: 50px auto;
}

.ready {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	height: 100%;
	background: green;
}

.start {
	position: absolute;
	top: -50px;
	left: 0;
}

.all {
	position: absolute;
	top: -50px;
	right: 0;
}

.countdown-title {
  color: #396;
  font-weight: 100;
  font-size: 40px;
  margin: 40px 0px 20px;
}

.countdown {
  font-family: sans-serif;
  color: #fff;
  display: inline-block;
  font-weight: 100;
  text-align: center;
  font-size: 30px;
}

.countdown-number {
  padding: 10px;
  border-radius: 3px;
  background: #00bf96;
  display: inline-block;
}

.countdown-time {
  padding: 15px;
  border-radius: 3px;
  background: #00816a;
  display: inline-block;
}

.countdown-text {
  display: block;
  padding-top: 5px;
  font-size: 16px;
}
#go {
	color: blue;
	text-decoration: underline;
	cursor: pointer;
	font-weight: bold;
}
</style>

</div>
</body>
</html>