let sec_per_turn = 30;

let sec = 0;
let p1_sec = 0;
let p2_sec = 0;
let player_1 = '';
let player_2 = '';
let song_count = 0;
let p1_song_count = 0;
let p2_song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let p1_correct = 0;
let p2_correct = 0;
let options;
let skill = '';
let p1_skill = '';
let p2_skill = '';
let rate = '';
let lang = '';
let year = '';
let artist_type = '';
let videoPath = 'video/clip/';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage_90 = ' Ура! Вы освоили "Дискотеку 90-х"!';
let finalMessage_00 = ' Ура! Вы освоили "Дискотеку 2000-х"!';
let finalMessage = finalMessage_90;
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let isSingle = true;
let isP1Turn = true;
let isTournement = false;
let audio = new Audio(audioPath + '1.mp3');
let start_count_down = false;
let rating = [];

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	start_count_down = false;
	if(audio.paused){
		audio.play();
	}
	modeToggle();
	if(options[num-1] == songs[song_count].group){
		mirror_eval(rightAnswer(), 20, "green");
		$("#option_" + num).addClass("green");
		if(isSingle){
			correct++;
		} else if(isP1Turn){
			p1_correct++;
		} else {
			p2_correct++;
		}
		$('#score').html(++score);
		levelup();
	} else {
		mirror_eval(rightAnswer(), 20, "red");
		$("#option_" + num).addClass("red");
		if(isTournement){
			$('#mistakes').html(--mistakes);
		}
		if(isSingle){
			$('#skill').html(skill+='<br/>' + songs[song_count].group + ',');
		} else {
			if(isP1Turn){
				$('#p1_skill').html(p1_skill+='<br/>' + songs[song_count].group + ',');
			} else {
				$('#p2_skill').html(p2_skill+='<br/>' + songs[song_count].group + ',');
			}
		}
	}
	teamRandomScore();
	if(isSingle){
		if(mistakes <= 0){
			$('.icon').hide();
			$('#mirror').show();
			mirror('Game over!', 10, 'red');
		} else {
			toggleGameButton();
			$('.blink').show();
		}
	} else {
		next_double();
	}
}

function like(){
	let group = songs[song_count].shorten;
	if(!group) group = songs[song_count].group;
	if (!~rate.indexOf('+ ' + group)){
		$('#rate').html(rate = '+ ' + group + '<br/>' + rate);
	}
	$('.blink').hide();
	next();
}

function dislike(){
	let group = songs[song_count].shorten;
	if(!group) group = songs[song_count].group;
	if(!~rate.indexOf('- ' + group)){
		$('#rate').html(rate = rate + '<br/>- ' + group);
	}
	$('.blink').hide();
	next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(){
	return songs[song_count].group + ' "' + songs[song_count].song + '"';
}

function next(){
	if(song_count==songs.length-1){
		if(isTournement){
			if(tour < 5){
				nextTour();
				return;
			}
		}
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function next_double(){
	if(p1_song_count + p2_song_count == songs.length-1){
		$('#p1_song_count').html(song_count+1);
		$('#p2_song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		let overall = songs.length/2;
		let p1_percent = calculatePercent(p1_correct,overall);
		let p2_percent = calculatePercent(p2_correct,overall);
		let msg = player_1 + '. Верно: ' + p1_percent + '%('
		+ p1_correct + '/' + overall + '). ' + player_2 + '. Верно: ' + p2_percent + '%('
		+ p2_correct + '/' + overall + ').';
		let color = 'red';
		if(p1_correct>p2_correct){
			color = 'green';
			msg+=' Победил игрок ' + player_1 + '.'; 
		} else if(p1_correct == p2_correct){
			msg+=' Победила Дружба.'; 
		} else{
			msg+=' Победил игрок ' + player_2 + '.';
		}
		$('#mirror').show();
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		song_count++;
		if(isP1Turn){
			isP1Turn = false;
			$('#p1_song_count').html(++p1_song_count);
			$('#learn').html('Ход игрока: ' + player_2);
			mirror(p1_song_count + 1 + ' песня:', 20, 'blue');
		} else {
			isP1Turn = true;
			$('#p2_song_count').html(++p2_song_count);
			$('#learn').html('Ход игрока: ' + player_1);
			mirror(p2_song_count + 1 + ' песня:', 20, 'blue');
		}
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function levelup(){
	shuffle(states);
	let state = songs[song_count].state;
	if(!state) state = ' по ' + songs[song_count].group;
	$('#status').html(states[0] + state);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

function learn(){
	$('.game_button').show();
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		$('#sec_15').hide();
		audio.play();
		count_down(15);
	}
}

async function count_down(end){
	start_count_down = true;
	let count = 1;
	while(start_count_down && count++ <= end){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setVideo(){
	$('#song').attr("src",videoPath + songs[song_count].id + ".mp4");
}

function setAudio(){
	audio.pause();
	audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	audio.play();
}

function randomAnswers(){
	options = [];
	if(!isTournement){
		answers = songs.map(item=>item.group);
	}
	answers = removeDuplicates(answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(answers,correctAnswer);
	shuffle(answers);
	options.push(answers[0]);
	options.push(answers[1]);
	options.push(answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function nextTour(start){
	tour++;
	mistakes = 7 - tour;
	$('#mistakes').html(mistakes);
	$('#tour_number').html(tour);
	$('#mirror').show();
	mirror(tour + ' Тур. Жизней: ' + mistakes, 10, 'green');
	song_count = 0;
	correct = 0;
	songs = tours[tour-1];
	$('#total').html(songs.length);
	$('#song_count').html(0);
	answers = tour_answers[tour-1];
	if(!start){
		$('.game_button').hide();
		toggleFlag = false;
		$('.icon').hide();
		$('#learn').prop('disabled', false);
	}
}

let mistakes = 5;
let tour = 0;
let tour_1;
let tour_2;
let tour_3;
let tour_4;
let tour_5;
let tours = [];
let tour_answers_1;
let tour_answers_2;
let tour_answers_3;
let tour_answers_4;
let tour_answers_5;
let tour_answers = [];

function prepareTournement(){
	$('#life').show();
	$('#tour').show();
	tour_1 = songs.slice(1, 11);
	tour_answers_1 = songs.slice(11, songs.length).map(item=>item.group);
	tours.push(tour_1);
	tour_answers.push(tour_answers_1);
	tour_2 = songs.slice(11, 21);
	tour_answers_2 = songs.slice(21, songs.length).map(item=>item.group);
	tours.push(tour_2);
	tour_answers.push(tour_answers_2);
	tour_3 = songs.slice(21, 31);
	tour_answers_3 = songs.slice(31, songs.length).map(item=>item.group);
	tours.push(tour_3);
	tour_answers.push(tour_answers_3);
	tour_4 = songs.slice(31, 41);
	tour_answers_4 = songs.slice(41, songs.length).map(item=>item.group);
	tours.push(tour_4);
	tour_answers.push(tour_answers_4);
	tour_5 = songs.slice(41, 51);
	tour_answers_5 = songs.slice(51, songs.length).map(item=>item.group);
	tours.push(tour_5);
	tour_answers.push(tour_answers_5);
	nextTour(true);
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleMute() {
  var video=document.getElementById("song");
  video.muted = !video.muted;
}

function toggleVisible(){
	var video=document.getElementById("song");
	const style = getComputedStyle(video);
	if(style.visibility == 'visible'){		
		$('#song').css("visibility", "hidden");
	} else {
		$('#song').css("visibility", "visible");
	}
}

function togglePoster(){
	if(toggleFlag){		
		$('#album').attr("src", imgPath + songs[song_count].id + ".1.jpg");
		$('#group').attr("src", imgPath + songs[song_count].id + ".2.jpg");
		$('#album').toggle();
		$('#group').toggle();
	} else {
		toggleFlag = true;
	}
}

function toggleArtist(){
	if(toggleFlag){		
		$('#artist').attr("src", imgPath + songs[song_count].id + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	mirror('Квиз "Король и Шут" в BBQ Bar 20.11.2022 в 16:45', 10, 'blue');
}

function twoPlayersMode(flag){
	if(flag.checked == true){
        $('#tournement').prop('checked', false);
		$('.single').hide();
		$('.double').show();
		player_1 = prompt("Укажите имя 1 игрока:", '');
		$('.p1').html(player_1);
		player_2 = prompt("Укажите имя 2 игрока:", '');
		$('.p2').html(player_2);
		$('#learn').html('Ход игрока: ' + player_1);
    }else{
        $('.single').show();
		$('.double').hide();
   }
}

function tournementMode(flag){
	if(flag.checked == true){
         $('#twoP').prop('checked', false);
		 isTournement = true;
    }else{
         isTournement = false;
   }
}

function enableScore(flag){
	if(flag.checked == true){
         $('.score').show();
    }else{
         $('.score').hide();
   }
}

let songs = [
		{
			id : 1,
			group : 'Masterboy',
			song : 'Masterboy "Generation of Love"',
			state: ' по Masterboy'
		},
		{
			id : 2,
			group : 'Ace Of Base',
			song : 'Ace Of Base "Beautiful Life"',
			state: ' по Ace Of Base'
		},
		{
			id : 3,
			group : 'Snap!',
			song : 'Snap! "Rythm is a Dancer"',
			state: ' по Snap!'
		},
		{
			id : 4,
			group : 'Culture Beat',
			song : 'Culture Beat "Mr. Vain"',
			state: ' по Culture Beat'
		},
		{
			id : 5,
			group : 'E-Type',
			song : 'E-Type "Russian Lullaby"',
			state: ' по E-Type'
		},
		{
			id : 6,
			group : 'Corona',
			song : 'Corona "The Rhythm of the Night"',
			state: ' по Corona'
		},
		{
			id : 7,
			group : 'La Bouche',
			song : 'La Bouche "Sweet Dreams"',
			state: ' по La Bouche'
		},
		{
			id : 8,
			group : '2 Unlimited',
			song : '2 Unlimited "No Limit"',
			state: ' по 2 Unlimited'
		},
		{
			id : 9,
			group : '2 Brothers on the 4th Floor',
			song : '2 Brothers on the 4th Floor "Dreams"',
			state: ' по 2 Brothers on the 4th Floor'
		},
		{
			id : 10,
			group : 'E-Rotic',
			song : `E-Rotic "Max don't have Sex with your Ex"`,
			state: ' по E-Rotic'
		},
		{
			id : 11,
			group : 'Ace Of Base',
			song : 'Ace Of Base "The Sign"',
			state: ' по Ace Of Base'
		},
		{
			id : 12,
			group : 'Masterboy',
			song : 'Masterboy "Get It On"',
			state: ' по Masterboy'
		},
		{
			id : 13,
			group : 'La Bouche',
			song : 'La Bouche "Be My Lover"',
			state: ' по La Bouche'
		},
		{
			id : 14,
			group : 'Pandora',
			song : 'Pandora "Trust Me"',
			state: ' по Pandora'
		},
		{
			id : 15,
			group : 'Bellini',
			song : 'Bellini "Samba De Janeiro"',
			state: ' по Bellini'
		},
		{
			id : 16,
			group : 'Aqua',
			song : 'Aqua "Barbie Girl"',
			state: ' по Aqua'
		},
		{
			id : 17,
			group : 'E-Type',
			song : 'E-Type "Angels Crying"',
			state: ' по E-Type'
		},
		{
			id : 18,
			group : 'Culture Beat',
			song : 'Culture Beat "Crying in the Rain"',
			state: ' по Culture Beat'
		},
		{
			id : 19,
			group : '2 Unlimited',
			song : '2 Unlimited "Let the Beat Control Your Body"',
			state: ' по 2 Unlimited'
		},
		{
			id : 20,
			group : 'Ice MC',
			song : 'Ice MC "Think About the Way"',
			state: ' по Ice MC'
		},
		{
			id : 21,
			group : 'Capella',
			song : 'Capella "U Got 2 Let the Music"',
			state: ' по Capella'
		}
];

let ru_clips = [
		{
			id : 1,
			group : 'Комбинация',
			song : 'Комбинация "Бухгалтер"',
			state: ' по Комбинации'
		},
		{
			id : 2,
			group : 'Дюна',
			song : 'Дюна "Привет с Большого Бодуна"',
			state: ' по Дюне'
		},
		{
			id : 3,
			group : 'Наташа Королёва',
			song : 'Наташа Королёва "Жёлтые Тюльпаны"',
			state: ' по Королёвой'
		},
		{
			id : 4,
			group : 'Анжелика Варум',
			song : 'Анжелика Варум "Художник, что рисует дождь"',
			state: ' по Варум'
		},
		{
			id : 5,
			group : 'Демо',
			song : 'Демо "Солнышко"',
			state: ' по Демо'
		},
		{
			id : 6,
			group : 'Чайф',
			song : 'Чайф "Аргентина - Ямайка 5:0"',
			state: ' по Чайфу'
		},
		{
			id : 7,
			group : 'Татьяна Овсиенко',
			song : 'Татьяна Овсиенко "Капитан"',
			state: ' по Овсиенко'
		}
];

let ru_songs = [
		{
			id : 1,
			group : 'Руки вверх',
			song : 'Малыш',
			state: ' по Рукам Вверх'
		},
		{
			id : 2,
			group : 'Натали',
			song : 'Ветер с моря дул',
			state: ' по Натали'
		},
		{
			id : 3,
			group : 'Технология',
			song : 'Нажми на кнопку',
			state: ' по Технологии'
		},
		{
			id : 4,
			group : 'Диана',
			song : 'Скатертью дорога',
			state: ' по Диане'
		},
		{
			id : 5,
			group : 'Кай Метов',
			song : 'Position №2',
			state: ' по Каю Метову'
		},
		{
			id : 6,
			group : 'Русский размер',
			song : 'Юаю',
			state: ' по Русскому Размеру'
		},
		{
			id : 7,
			group : 'Татьяна Овсиенко',
			song : 'Колечко',
			state: ' по Татьяне Овсиенко',
			shorten: 'Овсиенко'
		},
		{
			id : 8,
			group : 'Дискотека Авария',
			song : 'Некуда деваться',
			state: ' по Дискотеке Аварии'
		},
		{
			id : 9,
			group : 'Сергей Васюта и группа Сладкий Сон',
			song : 'На белом покрывале января',
			state: ' по Сергею Васюте',
			shorten: 'Васюта'
		},
		{
			id : 10,
			group : 'Профессор Лебединский',
			song : 'Бегут года',
			state: ' по Профессору Лебединскому',
			shorten: 'Лебединский'
		},
		{
			id : 11,
			group : 'Татьяна Буланова',
			song : 'Ясный мой свет',
			state: ' по Татьяне Булановой',
			shorten: 'Буланова'
		},
		{
			id : 12,
			group : 'Забытый Разговор',
			song : 'Арабское золото',
			state: ' по Забытому Разговору'
		},
		{
			id : 13,
			group : 'Валерия',
			song : 'Моя Москва',
			state: ' по Валерии'
		},
		{
			id : 14,
			group : 'Светлана Рерих',
			song : 'Ладошки',
			state: ' по Рерих',
			shorten: 'Рерих'
		},
		{
			id : 15,
			group : 'Марина Хлебникова',
			song : 'Чашка Кофею',
			state: ' по Хлебниковой',
			shorten: 'Хлебникова'
		},
		{
			id : 16,
			group : 'Светлана Владимирская',
			song : 'Мальчик мой',
			state: ' по Владимирской',
			shorten: 'Владимирская'
		},
		{
			id : 17,
			group : 'Жанна Агузарова',
			song : 'Ты, только ты',
			state: ' по Агузаровой',
			shorten: 'Агузарова'
		},
		{
			id : 18,
			group : 'Валерия',
			song : 'Самолёт',
			state: ' по Валерии'
		},
		{
			id : 19,
			group : 'Олег Газманов',
			song : 'Есаул',
			state: ' по Газманову',
			shorten: 'Газманов'
		},
		{
			id : 20,
			group : 'Сергей Минаев',
			song : '22 притопа',
			state: ' по Минаеву',
			shorten: 'Минаев'
		},
		{
			id : 21,
			group : 'Лариса Долина',
			song : 'Льдинка',
			state: ' по Долиной',
			shorten: 'Долина'
		},
		{
			id : 22,
			group : 'Лариса Черникова',
			song : 'Влюблённый самолёт',
			state: ' по Черниковой',
			shorten: 'Черникова'
		},
		{
			id : 23,
			group : 'Браво',
			song : 'Любите девушки',
			state: ' по Браво'
		},
		{
			id : 24,
			group : 'Иванушки International',
			song : 'Кукла',
			state: ' по Иванушкам',
			shorten: 'Иванушки'
		},
		{
			id : 25,
			group : 'Стелла',
			song : 'Позови',
			state: ' по Стелле'
		},
		{
			id : 26,
			group : "A'Studio",
			song : 'Нелюбимая',
			state: " по A'Studio"
		},
		{
			id : 27,
			group : "На-на",
			song : 'Шляпа',
			state: " по На-на"
		},
		{
			id : 28,
			group : "Роман Жуков",
			song : 'Млечный путь',
			state: " по Жукову",
			shorten: 'Жуков'
		},
		{
			id : 29,
			group : "Манго-Манго",
			song : 'Аквалангисты',
			state: " по Манго-Манго"
		},
		{
			id : 30,
			group : "Алла Пугачёва",
			song : 'Позови меня с собой',
			state: " по Пугачёвой",
			shorten: 'Пугачёва'
		},
		{
			id : 31,
			group : "Фристайл",
			song : 'Кораблик любви',
			state: " по Фристайл"
		},
		{
			id : 32,
			group : 'Натали',
			song : 'Улыбочка',
			state: ' по Натали'
		},
		{
			id : 33,
			group : 'Леонид Агутин',
			song : 'Хоп-хей Лала Лэй',
			state: ' по Агутину',
			shorten: 'Агутин'
		},
		{
			id : 34,
			group : 'Валерий Леонтьев',
			song : 'Казанова',
			state: ' по Леонтьеву',
			shorten: 'Леонтьев'
		},
		{
			id : 35,
			group : 'Дискотека Авария',
			song : 'Труба зовёт',
			state: ' по Дискотеке Аварии'
		},
		{
			id : 36,
			group : "Фристайл",
			song : 'Больно мне больно',
			state: " по Фристайл"
		},
		{
			id : 37,
			group : "Демо",
			song : '2000 лет',
			state: " по Демо"
		},
		{
			id : 38,
			group : "Шоколад",
			song : 'Улыбнись',
			state: " по Шоколаду"
		},
		{
			id : 39,
			group : "Арамис",
			song : 'Девочка ждет, мальчик не идет',
			state: " по Арамису"
		},
		{
			id : 40,
			group : "Божья Коровка",
			song : 'Гранитный камушек',
			state: " по Божьей Коровке"
		},
		{
			id : 41,
			group : "Лайма Вайкуле",
			song : 'Ещё не вечер',
			state: " по Лайме Вайкуле",
			shorten: 'Вайкуле'
		},
		{
			id : 42,
			group : "Алексей Глызин",
			song : 'Зимний сад',
			state: " по Глызину",
			shorten: 'Глызин'
		},
		{
			id : 43,
			group : "Наташа Королёва",
			song : 'Маленькая страна',
			state: " по Королёвой",
			shorten: 'Королёва'
		},
		{
			id : 44,
			group : 'Татьяна Овсиенко',
			song : 'Школьная пора',
			state: ' по Татьяне Овсиенко',
			shorten: 'Овсиенко'
		},
		{
			id : 45,
			group : 'Hi-Fi',
			song : 'Не дано',
			state: ' по Hi-Fi'
		},
		{
			id : 46,
			group : 'Света',
			song : 'Увидимся',
			state: ' по Свете'
		},
		{
			id : 47,
			group : 'Блестящие',
			song : 'Ча-ча-ча',
			state: ' по Блестящим'
		},
		{
			id : 48,
			group : 'Руки вверх',
			song : 'Последний поцелуй',
			state: ' по Рукам Вверх'
		},
		{
			id : 49,
			group : 'Кар-Мэн',
			song : 'Париж',
			state: ' по Кар-Мэн'
		},
		{
			id : 50,
			group : 'Стрелки',
			song : 'На вечеринке',
			state: ' по Стрелкам'
		},
		{
			id : 51,
			group : 'Алёна Апина',
			song : 'Электричка',
			state: ' по Апиной',
			shorten: 'Апина'
		},
		{
			id : 52,
			group : 'Балаган Лимитед',
			song : 'Чё те надо',
			state: ' по Балагану Лимитед',
			shorten: 'Балаган LTD'
		},
		{
			id : 53,
			group : 'Полина Ростова',
			song : 'По краю дождя',
			state: ' по Ростовой',
			shorten: 'Ростова'
		},
		{
			id : 54,
			group : 'Анжелика Варум',
			song : 'Ля-ля-фа',
			state: ' по Варум',
			shorten: 'Варум'
		},
		{
			id : 55,
			group : 'Иванушки International',
			song : 'Колечко',
			state: ' по Иванушкам',
			shorten: 'Иванушки'
		},
		{
			id : 56,
			group : 'Лада Дэнс',
			song : 'Жить нужно в кайф',
			state: ' по Ладе Дэнс'
		},
		{
			id : 57,
			group : 'Мумий Тролль',
			song : 'Лунные Девицы',
			state: ' по Мумий Троллю'
		},
		{
			id : 58,
			group : 'Гости из будущего',
			song : 'Беги от меня',
			state: ' по Гостям из будущего'
		},
		{
			id : 59,
			group : 'Дмитрий Маликов',
			song : 'Ты одна ты такая',
			state: ' по Маликову',
			shorten: 'Маликов'
		},
		{
			id : 60,
			group : 'Электронный мальчик',
			song : 'Видеосалон',
			state: ' по Электронному мальчику'
		}
];

let eldo_songs = [
		{
			id : 1,
			group : 'Phil Collins',
			song : 'Another day in paradise',
			state: ' по Коллинзу'
		},
		{
			id : 2,
			group : 'Eric Clapton',
			song : 'Tears in heaven',
			state: ' по Клэптену'
		},
		{
			id : 3,
			group : 'Beloved',
			song : 'Sweet harmony',
			state: ' по Белавд'
		},
		{
			id : 4,
			group : 'Ardis',
			song : "Ain't nobody's business",
			state: ' по Белавд'
		},
		{
			id : 5,
			group : 'R.E.M.',
			song : "Loosing My Religion"
		},
		{
			id : 6,
			group : 'Kriss Kross',
			song : "Jump"
		},
		{
			id : 7,
			group : 'Coolio',
			song : "Gangsta's Paradise"
		},
		{
			id : 8,
			group : 'Robert Miles',
			song : "Children"
		},
		{
			id : 9,
			group : 'Will Smith',
			song : "Men in black"
		},
		{
			id : 10,
			group : 'Enrique Iglesias',
			song : "Bailamos"
		},
		{
			id : 11,
			group : "Sinead O'Connor",
			song : "Nothing Compares 2 U"
		},
		{
			id : 12,
			group : 'Suzanne Vega',
			song : "Tom's Diner"
		},
		{
			id : 13,
			group : 'Toni Braxton',
			song : "Un-Break My Heart"
		},
		{
			id : 14,
			group : 'Shania Twain',
			song : "You're Still The One"
		},
		{
			id : 15,
			group : 'Jennifer Paige',
			song : "Crush"
		},
		{
			id : 16,
			group : 'Shania Twain',
			song : "Man! I Feel Like A Woman!"
		},
		{
			id : 17,
			group : 'Jennifer Lopez',
			song : "If You Had My Love"
		},
		{
			id : 18,
			group : 'Jennifer Lopez',
			song : "Waiting for Tonight"
		},
		{
			id : 19,
			group : 'Jennifer Lopez',
			song : "No Me Ames"
		},
		{
			id : 20,
			group : 'Jennifer Lopez',
			song : "Let's Get Loud"
		},
		{
			id : 21,
			group : 'Christina Aguilera',
			song : "Genie In A Bottle"
		},
		{
			id : 22,
			group : 'Extreme',
			song : "More Than Words"
		},
		{
			id : 23,
			group : 'Fools Garden',
			song : "Lemon Tree"
		},
		{
			id : 24,
			group : 'Duran Duran',
			song : "Ordinary World"
		},
		{
			id : 25,
			group : 'Duran Duran',
			song : "Come Undone"
		},
		{
			id : 26,
			group : 'Texas',
			song : "Summer Son"
		},
		{
			id : 27,
			group : 'UB40',
			song : "I Can't Help Falling In Love With You"
		},
		{
			id : 28,
			group : 'No Mercy',
			song : "Where Do You Go"
		},
		{
			id : 29,
			group : 'Celine Dion',
			song : "The Power of Love"
		},
		{
			id : 30,
			group : 'Celine Dion',
			song : "Because You Loved Me"
		},
		{
			id : 31,
			group : 'Celine Dion',
			song : "It's All Coming Back To Me Now"
		},
		{
			id : 32,
			group : 'Bruce Springsteen',
			song : "Streets of Philadelphia"
		},
		{
			id : 33,
			group : 'Natalia Oreiro',
			song : "Que Si, Que Si"
		},
		{
			id : 34,
			group : 'Natalia Oreiro',
			song : "De Tu Amor"
		},
		{
			id : 35,
			group : 'Natalia Oreiro',
			song : "Cambio Dolor"
		},
		{
			id : 36,
			group : 'Natalia Oreiro',
			song : "Me Muero De Amor"
		},
		{
			id : 37,
			group : 'Wet Wet Wet',
			song : "Love Is All Around"
		},
		{
			id : 38,
			group : 'Seal',
			song : "Kiss From A Rose"
		},
		{
			id : 39,
			group : 'Nazareth',
			song : "Cocaine"
		},
		{
			id : 40,
			group : 'Bon Jovi',
			song : "Always"
		},	
		{
			id : 41,
			group : 'The Fugges',
			song : "Killing Me Softly"
		},	
		{
			id : 42,
			group : 'The Fugges',
			song : "Ready Or Not"
		},
		{
			id : 43,
			group : 'Bon Jovi',
			song : "Bed Of Roses"
		},
		{
			id : 44,
			group : 'Eagle-Eye Cherry',
			song : "Save Tonight"
		},
		{
			id : 45,
			group : 'Vanessa Paradis',
			song : "Joe le taxi"
		},
		{
			id : 46,
			group : 'Joan Osbourne',
			song : "One Of Us"
		},
		{
			id : 47,
			group : 'Bon Jovi',
			song : "Blaze Of Glory"
		},
		{
			id : 48,
			group : 'Sting',
			song : "Desert Rose"
		},
		{
			id : 49,
			group : 'Sting',
			song : "Shape Of My Heart"
		}
];

let songs_2000 = [
		{
			id : 1,
			group : 'Katy Perry',
			song : 'I Kissed A Girl',
			state: ' по Кэти Перри'
		},
		{
			id : 2,
			group : 'Lady Gaga',
			song : 'Poker Face',
			state: ' по Леди Гаге'
		},
		{
			id : 3,
			group : 'Ke$ha',
			song : 'Tick Tock',
			state: ' по Кеше'
		},
		{
			id : 4,
			group : 'Britney Spears',
			song : 'Womanizer',
			state: ' по Бритни Спирс'
		},
		{
			id : 5,
			group : 'Flo Rida',
			song : 'Right Round',
			state: ' по Флоу Райда'
		},
		{
			id : 6,
			group : 'Kid Cudi',
			song : "Day 'N' Nite",
			state: ' по Кид Куди'
		},
		{
			id : 7,
			group : 'Lady Antebellum',
			song : 'Need You Now',
			state: ' по Леди Антебеллум'
		},
		{
			id : 8,
			group : 'Justin Bieber',
			song : 'Baby',
			state: ' по Джастину Биберу'
		},
		{
			id : 9,
			group : 'P!nk',
			song : 'So What',
			state: ' по Pink'
		},
		{
			id : 10,
			group : 'Owl City',
			song : 'Fireflies',
			state: ' по Оул Сити'
		},
		{
			id : 11,
			group : 'Jamie Foxx',
			song : 'Blame It',
			state: ' по Джемми Фоксу'
		},
		{
			id : 12,
			group : 'Iyaz',
			song : 'Replay',
			state: ' по Иязу'
		},
		{
			id : 13,
			group : 'Jay Sean',
			song : 'Down',
			state: ' по Джею Шону'
		},
		{
			id : 14,
			group : 'Taio Cruz',
			song : 'Break Your Heart',
			state: ' по Тайо Крузу'
		},
		{
			id : 15,
			group : 'Papa Roach',
			song : 'Last Resort',
			state: ' по Папа Роуч'
		},
		{
			id : 16,
			group : 'Red Hot Chilli Peppers',
			song : 'Otherside',
			state: ' по Перцам'
		},
		{
			id : 17,
			group : 'Snoop Dogg & Dr. Dre',
			song : 'The Next Episode',
			state: ' по Снуп Догу и Доктору Дре'
		},
		{
			id : 18,
			group : "Destiny's Child",
			song : 'Say My Name',
			state: ' по Дестиниз Чайльду'
		},
		{
			id : 19,
			group : 'OutKast',
			song : 'Ms. Jackson',
			state: ' по Ауткасту'
		},
		{
			id : 20,
			group : 'Eminem & Dido',
			song : 'Stan',
			state: ' по Эминему'
		},
		{
			id : 21,
			group : 'Eminem',
			song : 'The Real Slim Shady',
			state: ' по Эминему'
		},
		{
			id : 22,
			group : 'Britney Spears',
			song : 'Ooops!... I did it again',
			state: ' по Бритни Спирс'
		},
		{
			id : 23,
			group : 'Bon Jovi',
			song : "It's My Life",
			state: ' по Бонджови'
		},
		{
			id : 24,
			group : 'Red Hot Chilli Peppers',
			song : 'Californication',
			state: ' по Перцам'
		},
		{
			id : 25,
			group : 'Nelly',
			song : 'Ride With Me',
			state: ' по Нелли'
		},
		{
			id : 26,
			group : "P!nk, Christina Aguilera, Mya, Lil' Kim",
			song : 'Lady Marmalade',
			state: ' по Леди Мармелад'
		},
		{
			id : 27,
			group : "Drowning Pool",
			song : 'Bodies',
			state: ' по Drowning Pool'
		},
		{
			id : 28,
			group : "Shaggy, Rayvon",
			song : 'Angel',
			state: ' по Shaggy, Rayvon'
		},
		{
			id : 29,
			group : "Mary J. Blige",
			song : 'Family Affair',
			state: ' по Mary J. Blige'
		},
		{
			id : 30,
			group : "Nickelback",
			song : 'How You Remind Me',
			state: ' по Nickelback'
		},
		{
			id : 31,
			group : "Gorillaz",
			song : 'Clint Eastwood',
			state: ' по Gorillaz'
		},
		{
			id : 32,
			group : "System of a Down",
			song : 'Chop Suey!',
			state: ' по System of a Down'
		},
		{
			id : 33,
			group : "Shakira",
			song : 'Whenever, Wherever',
			state: ' по Shakira'
		},
		{
			id : 34,
			group : "Linkin Park",
			song : 'In the end',
			state: ' по Linkin Park'
		},
		{
			id : 35,
			group : "Christina Aguilera",
			song : 'Beautiful',
			state: ' по Christina Aguilera'
		},
		{
			id : 36,
			group : "Coldplay",
			song : 'The Scientist',
			state: ' по Coldplay'
		},
		{
			id : 37,
			group : "Las Ketchup",
			song : 'Aserejé',
			state: ' по Las Ketchup'
		},
		{
			id : 38,
			group : "Avril Lavigne",
			song : 'Complicated',
			state: ' по Avril Lavigne'
		},
		{
			id : 39,
			group : "Vanessa Carlton",
			song : 'A Thousand Miles',
			state: ' по Vanessa Carlton'
		},
		{
			id : 40,
			group : 'Nelly',
			song : 'Hot In Herre',
			state: ' по Нелли'
		},
		{
			id : 41,
			group : 'Eminem',
			song : 'Cleaning Out My Closet',
			state: ' по Эминему'
		},
		{
			id : 42,
			group : 'Nelly, Kelly Rowland',
			song : 'Dilemma',
			state: ' по Nelly, Kelly Rowland'
		},
		{
			id : 43,
			group : 'Eminem',
			song : 'Without Me',
			state: ' по Эминему'
		},
		{
			id : 44,
			group : 'Eminem',
			song : 'Lose Yourself',
			state: ' по Эминему'
		},
		{
			id : 45,
			group : 'Red Hot Chilli Peppers',
			song : "Can't Stop",
			state: ' по Перцам'
		},
		{
			id : 46,
			group : "The Black Eyed Peas",
			song : 'Where Is The Love?',
			state: ' по The Black Eyed Peas'
		},
		{
			id : 47,
			group : 'Coldplay',
			song : 'Clocks',
			state: ' по Coldplay'
		},
		{
			id : 48,
			group : 'Justin Timberlake',
			song : 'Cry Me A River',
			state: ' по Justin Timberlake'
		},
		{
			id : 49,
			group : "Linkin Park",
			song : 'Numb',
			state: ' по Linkin Park'
		},
		{
			id : 50,
			group : "Evanescence",
			song : 'Bring Me To Life',
			state: ' по Evanescence'
		},
		{
			id : 51,
			group : "The White Stripes",
			song : 'Seven Nation Army',
			state: ' по The White Stripes'
		},
		{
			id : 52,
			group : "Beyonce feat. Jay-Z",
			song : 'Crazy In Love',
			state: ' по Beyonce и Jay-Z'
		},
		{
			id : 53,
			group : '50 Cent',
			song : 'In Da Club',
			state: ' по 50 Cent'
		},
		{
			id : 54,
			group : 'OutKast',
			song : 'Hey Ya!',
			state: ' по Ауткасту'
		},
		{
			id : 55,
			group : 'Maroon 5',
			song : 'This Love',
			state: ' по Maroon 5'
		},
		{
			id : 56,
			group : 'Green Day',
			song : 'American Idiot',
			state: ' по Green Day'
		},
		{
			id : 57,
			group : 'The Killers',
			song : 'Mr. Brightside',
			state: ' по The Killers'
		},
		{
			id : 58,
			group : 'Hoobastank',
			song : 'The Reason',
			state: ' по Hoobastank'
		},
		{
			id : 59,
			group : 'Alicia Keys',
			song : "If I Ain't Got You",
			state: ' по Alicia Keys'
		},
		{
			id : 60,
			group : "The Black Eyed Peas",
			song : "Let's Get It Started",
			state: ' по The Black Eyed Peas'
		},
		{
			id : 61,
			group : 'Maroon 5',
			song : 'She Will Be Loved',
			state: ' по Maroon 5'
		},
		{
			id : 62,
			group : 'Pharrell Williams, Snoop Dogg',
			song : "Drop It Like It's Hot",
			state: ' по Фарелу Уильямсу и Снуп Догу'
		},
		{
			id : 63,
			group : 'Britney Spears',
			song : 'Toxic',
			state: ' по Бритни Спирс'
		},
		{
			id : 64,
			group : 'Usher',
			song : 'Yeah!',
			state: ' по Usher'
		},
		{
			id : 65,
			group : "Gorillaz",
			song : 'Dare',
			state: ' по Gorillaz'
		},
		{
			id : 66,
			group : "Cascada",
			song : 'Everytime We Touch',
			state: ' по Cascada'
		},
		{
			id : 67,
			group : "Daniel Powter",
			song : 'Bad Day',
			state: ' по Daniel Powter'
		},
		{
			id : 68,
			group : 'Green Day',
			song : 'Boulevard Of Broken Dreams',
			state: ' по Green Day'
		},
		{
			id : 69,
			group : 'The Pussycat Dolls',
			song : "Don't Cha",
			state: ' по The Pussycat Dolls'
		},
		{
			id : 70,
			group : "The Black Eyed Peas",
			song : "Humps",
			state: ' по The Black Eyed Peas'
		},
		{
			id : 71,
			group : "50 Cent, Olivia",
			song : "Candy Shop",
			state: ' по 50 Cent, Olivia'
		},
		{
			id : 72,
			group : "James Blunt",
			song : "You're Beautiful",
			state: ' по James Blunt'
		},
		{
			id : 73,
			group : "Gwen Stefani",
			song : "Hollaback Girl",
			state: ' по Gwen Stefani'
		},
		{
			id : 74,
			group : "Gorillaz",
			song : 'Feel Good Inc',
			state: ' по Gorillaz'
		},
		{
			id : 75,
			group : "Panic! At The Disco",
			song : 'I Write Sins Not Tragedies',
			state: ' по Panic! At The Disco'
		},
		{
			id : 76,
			group : "Fergie, will.i.am",
			song : 'Fergalicious',
			state: ' по Fergie, will.i.am'
		},
		{
			id : 77,
			group : "Gnarls Barkley",
			song : 'Crazy',
			state: ' по Gnarls Barkley'
		},
		{
			id : 78,
			group : "Timbaland, Nelly Furtado",
			song : 'Promiscuous',
			state: ' по Timbaland, Nelly Furtado'
		},
		{
			id : 79,
			group : "Pussycat Dolls, Snoop Dogg",
			song : 'Buttons',
			state: ' по Pussycat Dolls, Snoop Dogg'
		},
		{
			id : 80,
			group : "Sean Paul",
			song : 'Temperature',
			state: ' по Sean Paul'
		},
		{
			id : 81,
			group : "Nelly Furtado",
			song : 'Say It Right',
			state: ' по Nelly Furtado'
		},
		{
			id : 82,
			group : "Akon, Eminem",
			song : 'Smack That',
			state: ' по Akon, Eminem'
		},
		{
			id : 83,
			group : "The Black Eyed Peas",
			song : "Pump It",
			state: ' по The Black Eyed Peas'
		},
		{
			id : 84,
			group : "Shakira",
			song : "Hips Don't Lie",
			state: ' по Shakira'
		},
		{
			id : 85,
			group : "Beyonce & Shakira",
			song : "Beautiful Lier",
			state: ' по Beyonce & Shakira'
		},
		{
			id : 86,
			group : "Leona Lewis",
			song : "Bleeding Love",
			state: ' по Leona Lewis'
		},
		{
			id : 87,
			group : "Gwen Stefani, Akon",
			song : "The sweet escape",
			state: ' по Gwen Stefani, Akon'
		},
		{
			id : 88,
			group : "Kanye West",
			song : "Stronger",
			state: ' по Kanye West'
		},
		{
			id : 89,
			group : "Timbaland, OneRepublic",
			song : "Apologize",
			state: ' по Timbaland, OneRepublic'
		},
		{
			id : 90,
			group : "Amy Winehouse",
			song : "Back to Black",
			state: ' по Amy Winehouse'
		},
		{
			id : 91,
			group : "Avril Lavigne",
			song : 'Girlfriend',
			state: ' по Avril Lavigne'
		},
		{
			id : 92,
			group : "Sean Kingston",
			song : 'Beautiful Girls',
			state: ' по Sean Kingston'
		},
		{
			id : 93,
			group : "Soulja Boy Tell'em",
			song : 'Crank That',
			state: " по Soulja Boy Tell'em"
		},
		{
			id : 94,
			group : "Rihanna, Jay-Z",
			song : 'Umbrella',
			state: " по Rihanna, Jay-Z"
		},
		{
			id : 95,
			group : "Taylor Swift",
			song : 'Love Story',
			state: " по Taylor Swift"
		},
		{
			id : 96,
			group : "MGMT",
			song : 'Kids',
			state: " по MGMT"
		},
		{
			id : 97,
			group : "Jason Mraz",
			song : "I'm Yours",
			state: " по Jason Mraz"
		},
		{
			id : 98,
			group : "Coldplay",
			song : "Viva La Vida",
			state: " по Coldplay"
		},
		{
			id : 99,
			group : "Lady Gaga, Colby ODonis",
			song : "Just Dance",
			state: " по Lady Gaga, Colby ODonis"
		},
		{
			id : 100,
			group : "Beyonce",
			song : "Single Ladies",
			state: " по Beyonce"
		}
];

let ru_2007 = [
	{
		id : 1,
		group : 'МакSим',
		song : 'Знаешь ли ты'
	},
	{
		id : 2,
		group : 'Serebro',
		song : 'Song #1'
	},
	{
		id : 3,
		group : 'Дима Билан',
		song : 'Number one fan'
	},
	{
		id : 4,
		group : 'Дмитрий Колдун',
		song : 'Дай мне силу'
	},
	{
		id : 5,
		group : 'Сергей Трофимов',
		song : 'Московская песня'
	},
	{
		id : 6,
		group : 'Согдиана',
		song : 'Синее небо'
	},
	{
		id : 7,
		group : 'Земфира',
		song : 'Мы разбиваемся'
	},
	{
		id : 8,
		group : 'Фабрика',
		song : 'Зажигают огоньки'
	},
	{
		id : 9,
		group : 'Лигалайз и Dato',
		song : 'Джаная'
	},
	{
		id : 10,
		group : 'Бумбокс',
		song : 'Вахтерам'
	},
	{
		id : 11,
		group : 'Настя Задорожная',
		song : 'Буду'
	},
	{
		id : 12,
		group : 'Стас Михайлов',
		song : 'Берега мечты'
	},
	{
		id : 13,
		group : 'Елена Терлеева',
		song : 'Солнце'
	},
	{
		id : 14,
		group : 'Анжелика Агурбаш',
		song : 'Я буду жить для тебя'
	},
	{
		id : 15,
		group : 'Григорий Лепс и Ирина Аллегрова',
		song : 'Я тебе не верю'
	},
	{
		id : 16,
		group : 'Филипп Киркоров',
		song : 'Сердце в 1000 свечей'
	},
	{
		id : 17,
		group : 'Звери',
		song : 'Блондинки и брюнетки'
	},
	{
		id : 18,
		group : "Банд'Эрос",
		song : 'Про красивую жизнь'
	},
	{
		id : 19,
		group : 'ВИА Гра',
		song : 'Поцелуи'
	},
	{
		id : 20,
		group : 'Чи-Ли',
		song : 'Сердце'
	}
];

let en_2007 = [
	{
		id : 1,
		group : 'Timbaland',
		song : 'The Way I Are'
	},
	{
		id : 2,
		group : 'Basshunter',
		song : "Now You're Gone"
	},
	{
		id : 3,
		group : 'Morandi',
		song : 'Save Me'
	},
	{
		id : 4,
		group : 'Britney Spears',
		song : 'Gimme More'
	},
	{
		id : 5,
		group : 'MIKA',
		song : 'Relax, Take It Easy'
	},
	{
		id : 6,
		group : 'Morandi',
		song : 'Angels'
	},
	{
		id : 7,
		group : 'Basshunter',
		song : 'Boten Anna'
	},
	{
		id : 8,
		group : 'Enrique Iglesias',
		song : 'Tired Of Being Sorry'
	},
	{
		id : 9,
		group : 'David Guetta & Chris Willis',
		song : 'Love Is Gone'
	},
	{
		id : 10,
		group : 'Rihanna',
		song : "Don't Stop The Music"
	},
	{
		id : 11,
		group : 'Shantel',
		song : 'DISKO PARTIZANI'
	},
	{
		id : 12,
		group : 'Timbaland ft OneRepublic',
		song : 'Apologize'
	},
	{
		id : 13,
		group : 'Beyoncé, Shakira',
		song : 'Beautiful Liar'
	},
	{
		id : 14,
		group : 'Britney Spears',
		song : 'Piece Of Me'
	},
	{
		id : 15,
		group : 'Alicia Keys',
		song : 'No One'
	},
	{
		id : 16,
		group : 'Rashni',
		song : 'Baboushka'
	},
	{
		id : 17,
		group : 'Kanye West',
		song : 'Stronger'
	},
	{
		id : 18,
		group : 'Rihanna ft. JAY-Z',
		song : 'Umbrella'
	},
	{
		id : 19,
		group : 'Avril Lavigne',
		song : 'Girlfriend'
	},
	{
		id : 20,
		group : 'Maroon 5',
		song : 'Wake Up Call'
	},
	{
		id : 21,
		group : 'The Killers',
		song : 'Read My Mind'
	},
	{
		id : 22,
		group : 'Foo Fighters',
		song : 'The Pretender'
	},
	{
		id : 23,
		group : 'Apocalyptica feat Adam Gontier',
		song : 'I Dont Care'
	},
	{
		id : 24,
		group : 'Linkin Park',
		song : 'Bleed It Out'
	},
	{
		id : 25,
		group : 'Kaiser Chiefs',
		song : 'Ruby'
	},
	{
		id : 26,
		group : 'Sunrise Avenue',
		song : 'Fairytale Gone Bad'
	},
	{
		id : 27,
		group : 'Sum 41',
		song : 'With Me'
	},
	{
		id : 28,
		group : 'Linkin Park',
		song : 'Shadow Of The Day'
	},
	{
		id : 29,
		group : 'Tokio Hotel',
		song : 'Monsoon'
	},
	{
		id : 30,
		group : 'Skillet',
		song : 'Looking for Angels'
	},
	{
		id : 31,
		group : 'Fall Out Boy',
		song : 'Thanks for the Memories'
	},
	{
		id : 32,
		group : 'My Chemical Romance',
		song : 'Teenagers'
	},
	{
		id : 33,
		group : 'Avril Lavigne',
		song : "When You're Gone"
	},
	{
		id : 34,
		group : 'Paramore',
		song : 'Misery Business'
	},
	{
		id : 35,
		group : 'NIGHTWISH',
		song : 'Bye Bye Beautiful'
	},
	{
		id : 36,
		group : 'Arctic Monkeys',
		song : 'Old Yellow Bricks'
	},
	{
		id : 37,
		group : 'Linkin Park',
		song : "What I've Done"
	},
	{
		id : 38,
		group : 'My Chemical Romance',
		song : 'Famous Last Words'
	},
	{
		id : 39,
		group : 'Maroon 5',
		song : 'Makes Me Wonder'
	},
	{
		id : 40,
		group : 'Avril Lavigne',
		song : 'Hot'
	}
];

let en_1940 = [
	{
		id : 1,
		group : 'Tommy Dorsey',
		song : "I'll Never Smile Again"
	},
	{
		id : 2,
		group : 'Bing Crosby',
		song : "Only Forever"
	},
	{
		id : 3,
		group : 'Artie Shaw',
		song : "I'll Never Smile Again"
	},
	{
		id : 4,
		group : 'Jimmy Dorsey',
		song : "Amapola"
	},
	{
		id : 5,
		group : 'Freddy Martin',
		song : "Piano Concerto in B Flat"
	},
	{
		id : 6,
		group : 'Glenn Miller',
		song : "Chattanooga Choo Choo"
	},
	{
		id : 7,
		group : 'Glenn Miller',
		song : "Moonlight Cocktail"
	},
	{
		id : 8,
		group : 'Kay Kyser',
		song : "Jingle Jangle Jingle"
	},
	{
		id : 9,
		group : 'Bing Crosby',
		song : "White Christmas"
	},
	{
		id : 10,
		group : 'Harry James',
		song : "I've Heard That Song Before"
	},
	{
		id : 11,
		group : 'Mills Brothers',
		song : "Paper Doll"
	},
	{
		id : 12,
		group : 'Bing Crosby',
		song : "Swinging On A Star"
	},
	{
		id : 13,
		group : 'Artie Shaw',
		song : "Frenesi"
	},
	{
		id : 14,
		group : 'Ted Weems',
		song : "Heartaches"
	},
	{
		id : 15,
		group : 'Francis Craig',
		song : "Near You"
	},
	{
		id : 16,
		group : 'Vaughn Monroe',
		song : "Riders In The Sky"
	},
	{
		id : 17,
		group : 'The Ink Spots',
		song : "The Gypsy"
	},
	{
		id : 18,
		group : 'Vaughn Monroe',
		song : "Ballerina"
	}
];

let en_1950 = [
	{
		id : 1,
		group : 'Gordon Jenkins and The Weavers',
		song : "Goodnight Irene"
	},
	{
		id : 2,
		group : 'Elvis Presley',
		song : "Don't Be Cruel"
	},
	{
		id : 3,
		group : 'Elvis Presley',
		song : "Hound Dog"
	},
	{
		id : 4,
		group : 'Les Paul and Mary Ford',
		song : "Vaya Con Dios"
	},
	{
		id : 5,
		group : 'Johnnie Ray and The Four Lads',
		song : "Cry"
	},
	{
		id : 6,
		group : 'Anton Karas',
		song : "The Third Man Theme"
	},
	{
		id : 7,
		group : 'Patti Page',
		song : "The Tennessee Waltz"
	},
	{
		id : 8,
		group : 'Perry Como',
		song : "If"
	},
	{
		id : 9,
		group : 'Patti Page',
		song : "I Went To Your Wedding"
	},
	{
		id : 10,
		group : 'Leroy Anderson',
		song : "Blue Tango"
	},
	{
		id : 11,
		group : 'Perry Como',
		song : "Don't Let the Stars Get in Your Eyes"
	},
	{
		id : 12,
		group : 'Eddie Fisher',
		song : "I'm Walking Behind You"
	},
	{
		id : 13,
		group : 'Eddie Fisher',
		song : "Oh! My Pa-pa (O Mein Papa)"
	},
	{
		id : 14,
		group : 'Rosemary Clooney',
		song : "Hey There"
	},
	{
		id : 15,
		group : 'Dean Martin',
		song : "Memories Are Made Of This"
	},
	{
		id : 16,
		group : 'Elvis Presley',
		song : "Don't"
	},
	{
		id : 17,
		group : 'Elvis Presley',
		song : "Jailhouse Rock"
	},
	{
		id : 18,
		group : 'Elvis Presley',
		song : "Teddy Bear"
	},
	{
		id : 19,
		group : 'Elvis Presley',
		song : "All Shook Up"
	},
	{
		id : 20,
		group : 'Elvis Presley',
		song : "Heartbreak Hotel"
	}
];

let en_1960 = [
	{
		id : 1,
		group : 'Bobby Darin',
		song : "Mack the Knife"
	},
	{
		id : 2,
		group : 'Percy Faith',
		song : "Theme from A Summer Place"
	},
	{
		id : 3,
		group : 'The Beatles',
		song : "Hey Jude"
	},
	{
		id : 4,
		group : 'Bobby Lewis',
		song : "Tossin' and Turnin'"
	},
	{
		id : 5,
		group : 'The Beatles',
		song : "I Want to Hold Your Hand"
	},
	{
		id : 6,
		group : 'The Monkees',
		song : "I'm a Believer"
	},
	{
		id : 7,
		group : 'Marvin Gaye',
		song : "I Heard It Through the Grapevine"
	},
	{
		id : 8,
		group : 'Tommy Edwards',
		song : "It's All in the Game"
	},
	{
		id : 9,
		group : 'Johnny Horton',
		song : "The Battle of New Orleans"
	},
	{
		id : 10,
		group : 'Elvis Presley',
		song : "Are You Lonesome Tonight"
	},
	{
		id : 11,
		group : 'The 5th Dimension',
		song : "Aquarius/Let the Sunshine In"
	},
	{
		id : 12,
		group : 'Zager and Evans',
		song : "In the Year 2525"
	}
];

let en_2010_gr = [
	{
		id : 1,
		group : 'The Chainsmokers',
		song : "Closer"
	},	
	{
		id : 2,
		group : 'LMFAO',
		song : "Party Rock Anthem"
	},	
	{
		id : 3,
		group : 'One Direction',
		song : "What Makes You Beautiful"
	},	
	{
		id : 4,
		group : 'One Direction',
		song : "Live While We're Young"
	},	
	{
		id : 5,
		group : 'One Direction',
		song : "Little Things"
	},	
	{
		id : 6,
		group : 'One Direction',
		song : "One Way or Another (ft. Teenage Kicks)"
	},	
	{
		id : 7,
		group : 'One Direction',
		song : "Best Song Ever"
	},	
	{
		id : 8,
		group : 'One Direction',
		song : "Story of My Life"
	},	
	{
		id : 9,
		group : 'One Direction',
		song : "Midnight Memories"
	},	
	{
		id : 10,
		group : 'One Direction',
		song : "You & I"
	},	
	{
		id : 11,
		group : 'One Direction',
		song : "Drag Me Down"
	},	
	{
		id : 12,
		group : 'One Direction',
		song : "Perfect"
	},	
	{
		id : 13,
		group : 'Twenty One Pilots',
		song : "Ode To Sleep"
	},	
	{
		id : 14,
		group : 'Twenty One Pilots',
		song : "Stressed Out"
	},	
	{
		id : 15,
		group : 'Twenty One Pilots',
		song : "Ride"
	},	
	{
		id : 16,
		group : 'Twenty One Pilots',
		song : "Heathens"
	}
];

let en_2010_f = [
	{
		id : 1,
		group : 'Rihanna',
		song : "We Found Love"
	},
	{
		id : 2,
		group : 'Adele',
		song : "Hello"
	},
	{
		id : 3,
		group : 'Ariana Grande',
		song : "Break Free"
	},
	{
		id : 4,
		group : 'Katy Perry',
		song : "California Gurls (ft. Snoop Dogg)"
	},
	{
		id : 5,
		group : 'Adele',
		song : "Rolling in the Deep"
	},
	{
		id : 6,
		group : 'Lady Gaga',
		song : "Born This Way"
	},
	{
		id : 7,
		group : 'Katy Perry',
		song : "E.T. (ft. Kanye West)"
	},
	{
		id : 8,
		group : 'Lady Gaga',
		song : "Bad Romance"
	},
	{
		id : 9,
		group : 'Lady Gaga',
		song : "Telephone (ft. Beyoncé)"
	},
	{
		id : 10,
		group : 'Lady Gaga',
		song : "Shallow (ft. Bradley Cooper)"
	},
	{
		id : 11,
		group : 'Lady Gaga',
		song : "Rain On Me (ft. Ariane Grande)"
	},
	{
		id : 12,
		group : 'Katy Perry',
		song : "Teenage Dream"
	},
	{
		id : 13,
		group : 'Katy Perry',
		song : "Firework"
	},
	{
		id : 14,
		group : 'Katy Perry',
		song : "Last Friday Night"
	},
	{
		id : 15,
		group : 'Katy Perry',
		song : "Wide Awake"
	},
	{
		id : 16,
		group : 'Katy Perry',
		song : "Roar"
	},
	{
		id : 17,
		group : 'Katy Perry',
		song : "Dark Horse (ft. Juicy J)"
	},
	{
		id : 18,
		group : 'Katy Perry',
		song : "Chained To The Rhythm"
	},
	{
		id : 19,
		group : 'Rihanna',
		song : "Rude Boy"
	},
	{
		id : 20,
		group : 'Rihanna',
		song : "Only Girl"
	},
	{
		id : 21,
		group : 'Rihanna',
		song : "Diamonds"
	},
	{
		id : 22,
		group : 'Rihanna',
		song : "Monster (ft. Eminem)"
	},
	{
		id : 23,
		group : 'Rihanna',
		song : "Wild Thoughts (ft. DJ Khaled and Bryson Tiller)"
	},
	{
		id : 24,
		group : 'Rihanna',
		song : "Where Have You Been (ft. Eminem)"
	},
	{
		id : 25,
		group : 'Adele',
		song : "Someone Like You"
	},
	{
		id : 26,
		group : 'Adele',
		song : "Skyfall"
	},
	{
		id : 27,
		group : 'Taylor Swift',
		song : "We Are Never Ever Getting Back Together"
	},
	{
		id : 28,
		group : 'Taylor Swift',
		song : "Shake It Off"
	},
	{
		id : 29,
		group : 'Taylor Swift',
		song : "Blank Space"
	},
	{
		id : 30,
		group : 'Taylor Swift',
		song : "Look What You Made Me Do"
	},
	{
		id : 31,
		group : 'Taylor Swift',
		song : "I Knew You Were Trouble"
	},
	{
		id : 32,
		group : 'Ariana Grande',
		song : "Problem"
	},
	{
		id : 33,
		group : 'Ariana Grande',
		song : "No Tears Left To Cry"
	},
	{
		id : 34,
		group : 'Ariana Grande',
		song : "thank u, next"
	},
	{
		id : 35,
		group : 'Ariana Grande',
		song : "7 rings"
	},
	{
		id : 36,
		group : 'Ariana Grande',
		song : "Positions"
	}
];

let en_2010_m = [
	{
		id : 1,
		group : 'Lil Nas X',
		song : "Old Town Road"
	},
	{
		id : 2,
		group : 'Luis Fonsi and Daddy Yankee',
		song : "Despacito"
	},
	{
		id : 3,
		group : 'Bruno Mars',
		song : "Uptown Funk (ft. Mark Ronson)"
	},
	{
		id : 4,
		group : 'Pharrell Williams, T.I., Robin Thicke',
		song : "Blurred Lines"
	},
	{
		id : 5,
		group : 'Wiz Khalifa',
		song : "See You Again"
	},
	{
		id : 6,
		group : 'Ed Sheeran',
		song : "Shape of You"
	},
	{
		id : 7,
		group : 'Drake',
		song : "God's Plan"
	},
	{
		id : 8,
		group : 'Pharrell Williams',
		song : "Happy"
	},
	{
		id : 9,
		group : 'Drake',
		song : "One Dance (ft. Kyla, Wizkid)"
	},
	{
		id : 10,
		group : 'Drake',
		song : "In My Feelings"
	},
	{
		id : 11,
		group : 'Eminem',
		song : "Love the Way You Lie (ft. Rihanna)"
	},
	{
		id : 12,
		group : 'Bruno Mars',
		song : "Nothin' on You (ft. B.o.B)"
	},
	{
		id : 13,
		group : 'Bruno Mars',
		song : "Just the Way You Are"
	},
	{
		id : 14,
		group : 'Bruno Mars',
		song : "Grenade"
	},
	{
		id : 15,
		group : 'Bruno Mars',
		song : "Locked Out Of Heaven"
	},
	{
		id : 16,
		group : 'Bruno Mars',
		song : "When I Was Your Man"
	},
	{
		id : 17,
		group : 'Bruno Mars',
		song : "24K Magic"
	},
	{
		id : 18,
		group : 'Bruno Mars',
		song : "That's What I Like"
	},
	{
		id : 19,
		group : 'Bruno Mars',
		song : "Finesse"
	},
	{
		id : 20,
		group : 'Ed Sheeran',
		song : "Shape of You"
	},
	{
		id : 21,
		group : 'Ed Sheeran',
		song : "Perfect"
	},
	{
		id : 22,
		group : 'Ed Sheeran',
		song : "I Don't Care (ft. Justin Bieber)"
	},
	{
		id : 23,
		group : 'Ed Sheeran',
		song : "Bad Habits"
	},
	{
		id : 24,
		group : 'Justin Bieber',
		song : "What Do You Mean?"
	},
	{
		id : 25,
		group : 'Justin Bieber',
		song : "Stay (ft. The Kid LAROI)"
	},
	{
		id : 26,
		group : 'Justin Bieber',
		song : "Sorry"
	},
	{
		id : 27,
		group : 'Justin Bieber',
		song : "Love Yourself"
	},
	{
		id : 28,
		group : 'Justin Bieber',
		song : "I'm the One (ft. DJ Khaled)"
	},
	{
		id : 29,
		group : 'Justin Bieber',
		song : "Live My Life (ft. Far East Movement)"
	},
	{
		id : 30,
		group : 'Justin Bieber',
		song : "Yummy"
	},
	{
		id : 31,
		group : 'Pitbull',
		song : "Give Me Everything (ft. Ne-Yo, Afrojack, Nayer)"
	},
	{
		id : 32,
		group : 'Pitbull',
		song : "Timber (ft. Ke$ha)"
	},
	{
		id : 33,
		group : 'Pitbull',
		song : "Back in Time"
	},
	{
		id : 34,
		group : 'Drake',
		song : "Hotline Bling"
	},
	{
		id : 35,
		group : 'Drake',
		song : "Work (ft. Rihanna)"
	},
	{
		id : 36,
		group : 'Drake',
		song : "One Dance (ft. Kyla & Wizkid)"
	},
	{
		id : 37,
		group : 'Drake',
		song : "God's Plan"
	},
	{
		id : 38,
		group : 'Drake',
		song : "In My Feelings"
	}
];

let en_2020 = [
	{
		id : 1,
		group : 'Harry Styles',
		song : "As It Was"
	},
	{
		id : 2,
		group : 'Roddy Ricch',
		song : "The Box"
	},
	{
		id : 3,
		group : 'BTS',
		song : "Butter"
	},
	{
		id : 4,
		group : 'Adele',
		song : "Easy on Me"
	},
	{
		id : 5,
		group : '24kGoldn ft. Iann Dior',
		song : "Mood"
	},
	{
		id : 6,
		group : 'Olivia Rodrigo',
		song : "Drivers License"
	},
	{
		id : 7,
		group : 'DaBaby ft. Roddy Ricch',
		song : "Rockstar"
	},
	{
		id : 8,
		group : 'The Kid Laroi and Justin Bieber',
		song : "Stay"
	},
	{
		id : 9,
		group : 'Mariah Carey',
		song : "All I Want for Christmas Is You"
	},
	{
		id : 10,
		group : 'The Weeknd',
		song : "Blinding Lights"
	},
	{
		id : 11,
		group : 'Cardi B ft. Megan Thee Stallion',
		song : "WAP"
	},
	{
		id : 12,
		group : 'BTS',
		song : "Dynamite"
	},
	{
		id : 13,
		group : 'Ariana Grande',
		song : "Positions"
	},
	{
		id : 14,
		group : 'Taylor Swift',
		song : "Willow"
	},
	{
		id : 15,
		group : 'The Weeknd and Ariana Grande',
		song : "Save Your Tears"
	},
	{
		id : 16,
		group : 'Glass Animals',
		song : "Heat Waves"
	},
	{
		id : 17,
		group : 'Beyoncé',
		song : "Break My Soul"
	}
];

let ru_2020 = [
	{
		id : 1,
		group : 'Laboda',
		song : "Мой"
	},
	{
		id : 2,
		group : 'Artik & Asti',
		song : "Девочка танцуй"
	},
	{
		id : 3,
		group : 'Сергей Лазарев',
		song : "Я не боюсь"
	},
	{
		id : 4,
		group : 'Ани Лорак',
		song : "Твоей любимой"
	},
	{
		id : 5,
		group : 'Юлианна Караулова',
		song : "Градусы"
	},
	{
		id : 6,
		group : 'Артур Пирожков',
		song : "Перетанцуй меня"
	},
	{
		id : 7,
		group : 'Макс Барских',
		song : "Лей, не жалей"
	},
	{
		id : 8,
		group : 'Руки вверх!',
		song : "Укради меня!"
	},
	{
		id : 9,
		group : 'Владимир Пресняков',
		song : "Странная"
	},
	{
		id : 10,
		group : 'Артём Качер',
		song : "Одинокая Луна"
	},
	{
		id : 11,
		group : 'Zivert',
		song : "ЯЛТ"
	},
	{
		id : 12,
		group : 'Слава',
		song : "Подруга"
	},
	{
		id : 13,
		group : 'Денис Клявер',
		song : "Тебя удача найдёт"
	},
	{
		id : 14,
		group : 'Artik & Asti',
		song : "Истеричка"
	},
	{
		id : 15,
		group : 'Ирина Дубцова, Артем Качер',
		song : "Под дождём"
	},
	{
		id : 16,
		group : 'МакSим',
		song : "Спасибо"
	},
	{
		id : 17,
		group : 'Дмитрий Маликов',
		song : "Мир без твоей любви"
	},
	{
		id : 18,
		group : 'Слава',
		song : "Без тебя меня нет"
	},
	{
		id : 19,
		group : 'Ваня Дмитриенко',
		song : "Венера-Юпитер"
	},
	{
		id : 20,
		group : 'Полина Гагарина',
		song : "На расстоянии"
	},
	{
		id : 21,
		group : 'Emin',
		song : "Отпусти"
	},
	{
		id : 22,
		group : 'Filatov & Karas',
		song : "Чилить"
	},
	{
		id : 23,
		group : 'Люся Чеботина',
		song : "Солнце Монако"
	},
	{
		id : 24,
		group : 'Dabro',
		song : "Услышит весь район"
	},
	{
		id : 25,
		group : 'Николай Басков',
		song : "Лучший день"
	},
	{
		id : 26,
		group : 'Юлия Савичева',
		song : "Майский дождь"
	},
	{
		id : 27,
		group : 'Дмитрий Маликов',
		song : "Ночь расскажет"
	},
	{
		id : 28,
		group : 'Дима Билан, Zivert',
		song : "Это была любовь"
	},
	{
		id : 29,
		group : 'Митя Фомин',
		song : "Полутона"
	},
	{
		id : 30,
		group : 'Artik & Asti',
		song : "Гармония"
	}
];

let ru_2010 = [
	{
		id : 1,
		group : 'Слава',
		song : "Одиночество"
	},
	{
		id : 2,
		group : 'Вера Брежнева',
		song : "Любовь спасёт мир"
	},
	{
		id : 3,
		group : 'Чай вдвоём',
		song : "Белое платье"
	},
	{
		id : 4,
		group : 'Сергей Трофимов',
		song : "Не расказывай"
	},
	{
		id : 5,
		group : 'Митя Фомин',
		song : "Ла-Ла"
	},
	{
		id : 6,
		group : 'Любэ',
		song : "Всё опять начинается"
	},
	{
		id : 7,
		group : 'Стас Михайлов ft. Таисия Повалий',
		song : "Отпусти"
	},
	{
		id : 8,
		group : 'Филипп Киркоров',
		song : "Струны"
	},
	{
		id : 9,
		group : 'Валерия',
		song : "Капелькой неба"
	},
	{
		id : 10,
		group : 'Ирина Аллегрова',
		song : "Не обернусь"
	},
	{
		id : 11,
		group : 'Ани Лорак',
		song : "С первого взгляда"
	},
	{
		id : 12,
		group : 'Киркоров Филипп ft. Нетребко Анна',
		song : "Голос"
	},
	{
		id : 13,
		group : 'Нюша',
		song : "Выбирать чудо"
	},
	{
		id : 14,
		group : 'Зара',
		song : "Недолюбила"
	},
	{
		id : 15,
		group : 'Елена Ваенга',
		song : "Аэропорт"
	},
	{
		id : 16,
		group : 'Горячий шоколад',
		song : "Береги"
	},
	{
		id : 17,
		group : 'Жанна Фриске',
		song : "А на море белый песок"
	},
	{
		id : 18,
		group : 'Филипп Киркоров',
		song : "Снег"
	},
	{
		id : 19,
		group : 'Стас Пьеха и Слава',
		song : "Я и ты"
	},
	{
		id : 20,
		group : 'Ёлка',
		song : "Прованс"
	},
	{
		id : 21,
		group : 'Григорий Лепс',
		song : "Самый лучший день"
	},
	{
		id : 22,
		group : 'Митя Фомин',
		song : "Paninaro (Огни большого города)"
	},
	{
		id : 23,
		group : 'Стас Михайлов',
		song : "Только ты"
	},
	{
		id : 24,
		group : 'Вера Брежнева',
		song : "Реальная жизнь"
	},
	{
		id : 25,
		group : 'Потап и Настя',
		song : "Чумачечая весна"
	},
	{
		id : 26,
		group : 'Ёлка',
		song : "На большом воздушном шаре"
	},
	{
		id : 27,
		group : 'Потап и Настя',
		song : "Если вдруг"
	},
	{
		id : 28,
		group : 'Дима Билан',
		song : "Я просто люблю тебя"
	},
	{
		id : 29,
		group : 'Градусы',
		song : "Голая"
	},
	{
		id : 30,
		group : 'Зара',
		song : "Амели"
	},
	{
		id : 31,
		group : 'Виктория Дайнеко',
		song : "Сотри его из memory"
	},
	{
		id : 32,
		group : 'Нюша',
		song : "Воспоминание"
	},
	{
		id : 33,
		group : 'Reflex',
		song : "Я буду небом твоим"
	},
	{
		id : 34,
		group : 'Доминик Джокер',
		song : "Если ты со мной"
	},
	{
		id : 35,
		group : 'Григорий Лепс',
		song : "Я стану водопадом"
	},
	{
		id : 36,
		group : 'Ёлка',
		song : "Около тебя"
	},
	{
		id : 37,
		group : 'Полина Гагарина',
		song : "Спектакль окончен"
	},
	{
		id : 38,
		group : 'Филипп Киркоров',
		song : "Я отпускаю тебя"
	},
	{
		id : 39,
		group : '5ivesta Family',
		song : "Вместе мы"
	},
	{
		id : 40,
		group : 'Елена Ваенга',
		song : "Шопен"
	},
	{
		id : 41,
		group : 'Иракли ft. Даша Суворова',
		song : "Нелюбовь"
	},
	{
		id : 42,
		group : 'Стас Пьеха',
		song : "Старая история"
	},
	{
		id : 43,
		group : 'Джиган',
		song : "Нас больше нет"
	},
	{
		id : 44,
		group : 'Дискотека Авария ft. Орбакайте Кристина',
		song : "Прогноз погоды"
	},
	{
		id : 45,
		group : 'Dan Balan',
		song : "Лишь до утра"
	},
	{
		id : 46,
		group : 'Градусы',
		song : "Заметает"
	},
	{
		id : 47,
		group : 'Семён Слепаков',
		song : "Круглосуточно красивая женщина"
	},
	{
		id : 48,
		group : 'Слава',
		song : "Sex не любовь"
	},
	{
		id : 49,
		group : 'Анита Цой',
		song : "Зима-Лето"
	},
	{
		id : 50,
		group : 'Григорий Лепс',
		song : "Я счастливый"
	},
	{
		id : 51,
		group : 'Натали',
		song : "О боже, какой мужчина"
	}
];

let sov = [
	{
		id : 1,
		group : 'ВИА Орэра',
		song : "Тополя"
	},
	{
		id : 2,
		group : 'Вокальный квартет «Аккорд»',
		song : "Котёнок"
	},
	{
		id : 3,
		group : 'Вокальный квартет «Аккорд»',
		song : "Пингвины"
	},
	{
		id : 4,
		group : 'ВИА Поющие гитары',
		song : "Нет тебя прекрасней"
	},
	{
		id : 5,
		group : 'Эдуард Хиль',
		song : "Песня о друге"
	},
	{
		id : 6,
		group : 'Эдуард Хиль',
		song : "Как провожают пароходы"
	},
	{
		id : 7,
		group : 'Эдуард Хиль',
		song : "Человек из дома вышел"
	},
	{
		id : 8,
		group : 'Владимир Трошин',
		song : "Журавлёнок"
	},
	{
		id : 9,
		group : 'Марк Бернес',
		song : "Я люблю тебя, жизнь"
	},
	{
		id : 10,
		group : 'Марк Бернес',
		song : "С чего начинается родина"
	},
	{
		id : 11,
		group : 'Марк Бернес',
		song : "Враги сожгли родную хату"
	},
	{
		id : 12,
		group : 'Станислав Пожлаков',
		song : "Ребята 70-й широты"
	},
	{
		id : 13,
		group : 'Вадим Мулерман',
		song : "Лейся песня на просторе"
	},
	{
		id : 14,
		group : 'Вадим Мулерман',
		song : "Король-победитель"
	},
	{
		id : 15,
		group : 'Иосиф Кобзон',
		song : "И опять во дворе"
	},
	{
		id : 16,
		group : 'Иосиф Кобзон',
		song : "А у нас во дворе"
	},
	{
		id : 17,
		group : 'Муслим Магомаев',
		song : "Лучший город Земли"
	},
	{
		id : 18,
		group : 'Муслим Магомаев',
		song : "Улыбнись"
	},
	{
		id : 19,
		group : 'Валерий Ободзинский',
		song : "Восточная песня"
	},
	{
		id : 20,
		group : 'Владимир Макаров',
		song : "Последняя электричка"
	},
	{
		id : 21,
		group : 'Борис Кузнецов и Лев Полосин',
		song : "Орлята учатся летать"
	},
	{
		id : 22,
		group : 'Лев Барашков',
		song : "А ты пиши мне"
	},
	{
		id : 23,
		group : 'Кальмер Тенносаар',
		song : "Летка - Енька"
	},
	{
		id : 24,
		group : 'Ян Френкель',
		song : "Русское поле"
	},
	{
		id : 25,
		group : 'Олег Анофриев',
		song : "Песня о друге"
	},
	{
		id : 26,
		group : 'Эмиль Горовец',
		song : "Дилайла"
	},
	{
		id : 27,
		group : 'Эдита Пьеха',
		song : "Зачем снятся сны"
	},
	{
		id : 28,
		group : 'Эдита Пьеха',
		song : "Песня остаётся с человеком"
	},
	{
		id : 29,
		group : 'Эдита Пьеха',
		song : "Белый свет"
	},
	{
		id : 30,
		group : 'Эдита Пьеха',
		song : "Мама"
	},
	{
		id : 31,
		group : 'Эдита Пьеха',
		song : "Наш сосед"
	},
	{
		id : 32,
		group : 'Эдита Пьеха',
		song : "Билет в детство"
	},
	{
		id : 33,
		group : 'Лидия Клемент',
		song : "Звезды в кондукторской сумке"
	},
	{
		id : 34,
		group : 'Людмила Зыкина',
		song : "Ой, снег-снежок"
	},
	{
		id : 35,
		group : 'Людмила Зыкина',
		song : "Течёт река Волга"
	},
	{
		id : 36,
		group : 'Людмила Зыкина',
		song : "На побывку едет"
	},
	{
		id : 37,
		group : 'Людмила Зыкина',
		song : "Оренбургский пуховый платок"
	},
	{
		id : 38,
		group : 'Людмила Зыкина',
		song : "Тонкая рябина"
	},
	{
		id : 39,
		group : 'Людмила Зыкина',
		song : "Степь да степь кругом"
	},
	{
		id : 40,
		group : 'Майя Кристалинская',
		song : "Я тебя подожду"
	},
	{
		id : 41,
		group : 'Майя Кристалинская',
		song : "А снег идёт"
	},
	{
		id : 42,
		group : 'Майя Кристалинская',
		song : "Вальс о вальсе"
	},
	{
		id : 43,
		group : 'Ольга Воронец',
		song : "На тебе сошёлся клином белый свет"
	},
	{
		id : 44,
		group : 'Вероника Круглова',
		song : "Да"
	},
	{
		id : 45,
		group : 'Гелена Великанова',
		song : "Ландыши"
	},
	{
		id : 46,
		group : 'Гелена Великанова',
		song : "Стоят девчонки"
	},
	{
		id : 47,
		group : 'Гелена Великанова',
		song : "Может быть"
	},
	{
		id : 48,
		group : 'Тамара Миансарова',
		song : "Летка-Енка"
	},
	{
		id : 49,
		group : 'Майя Кристалинская',
		song : "Нежность"
	},
	{
		id : 50,
		group : 'Тамара Миансарова',
		song : "Пусть всегда будет солнце"
	}
];

let en_1980 = [
	{
		id : 1,
		group : 'Madonna',
		song : "Like A Virgin"
	},
	{
		id : 2,
		group : 'Madonna',
		song : "Material Girl"
	},
	{
		id : 3,
		group : 'Madonna',
		song : "Borderline"
	},
	{
		id : 4,
		group : 'Madonna',
		song : "Lucky Star"
	},
	{
		id : 5,
		group : 'Madonna',
		song : "Crazy for You"
	},
	{
		id : 6,
		group : 'Toto',
		song : "Africa"
	},
	{
		id : 7,
		group : 'Van Halen',
		song : "Jump"
	},
	{
		id : 8,
		group : 'Dolly Parton',
		song : "9 to 5"
	},
	{
		id : 9,
		group : 'UB40',
		song : "Red Red Wine"
	},
	{
		id : 10,
		group : 'Bruce Springsteen',
		song : "Dancing In the Dark"
	},
	{
		id : 11,
		group : 'Bruce Springsteen',
		song : "Born in the U.S.A."
	},
	{
		id : 12,
		group : 'Richard Marx',
		song : "Right Here Waiting"
	},
	{
		id : 13,
		group : 'Willie Nelson',
		song : "Always On My Mind"
	},
	{
		id : 14,
		group : 'Kool & The Gang',
		song : "Celebration"
	},
	{
		id : 15,
		group : 'Janet Jackson',
		song : "When I Think Of You"
	},
	{
		id : 16,
		group : 'Soft Cell',
		song : "Tainted Love"
	},
	{
		id : 17,
		group : 'Run-DMC',
		song : "It's Like That"
	},
	{
		id : 18,
		group : 'Tracy Chapman',
		song : "Fast Car"
	},
	{
		id : 19,
		group : 'Stevie Wonder, Paul McCartney',
		song : "Ebony And Ivory"
	},
	{
		id : 20,
		group : 'Bob Marley & The Wailers',
		song : "Redemption Song"
	},
	{
		id : 21,
		group : 'Bob Marley & The Wailers',
		song : "Could You be Loved"
	},
	{
		id : 22,
		group : 'N.W.A.',
		song : "Gangsta Gangsta"
	},
	{
		id : 23,
		group : 'Ray Charles, Willie Nelson',
		song : "Seven Spanish Angels"
	},
	{
		id : 24,
		group : 'Michael Jackson',
		song : "Billie Jean"
	},
	{
		id : 25,
		group : 'Michael Jackson',
		song : "Beat It"
	},
	{
		id : 26,
		group : 'Michael Jackson',
		song : "Smooth Criminal"
	},
	{
		id : 27,
		group : 'Michael Jackson',
		song : "Thriller"
	},
	{
		id : 28,
		group : 'Michael Jackson',
		song : "Rock with You"
	},
	{
		id : 29,
		group : 'Cutting Crew',
		song : "I Just Died in Your Arms Tonight"
	},
	{
		id : 30,
		group : 'Rick Astley',
		song : "Never Gonna Give You Up"
	},
	{
		id : 31,
		group : 'A-Ha',
		song : "Take On Me"
	},
	{
		id : 32,
		group : 'Nena',
		song : "99 Red Baloons"
	},
	{
		id : 33,
		group : 'Lipps Inc.',
		song : "Funkytown"
	},
	{
		id : 34,
		group : 'Technotronic',
		song : "Pump Up The Jam"
	},
	{
		id : 35,
		group : 'Culture Club',
		song : "Karma Chameleon"
	},
	{
		id : 36,
		group : 'Swing Out Sister',
		song : "Breakout"
	},
	{
		id : 37,
		group : 'Foreigner',
		song : "I Want To Know What Love Is"
	},
	{
		id : 38,
		group : 'Foreigner',
		song : "Urgent"
	},
	{
		id : 39,
		group : 'Level 42',
		song : "Lessons In Love"
	},
	{
		id : 40,
		group : 'Double Trouble',
		song : "Just Keep Rockin"
	},
	{
		id : 41,
		group : 'Wham!',
		song : "Wake Me Up Before You Go-Go"
	},
	{
		id : 42,
		group : 'Wham!',
		song : "Young Guns (Go For It!)"
	},
	{
		id : 43,
		group : 'The Pointer Sisters',
		song : "I'm So Excited"
	},
	{
		id : 44,
		group : 'Genesis',
		song : "Land Of Confusion"
	},
	{
		id : 45,
		group : 'KING',
		song : "Love and Pride"
	},
	{
		id : 46,
		group : 'A Flock Of Seagulls',
		song : "I Ran"
	},
	{
		id : 47,
		group : 'Bruce Springsteen',
		song : "I'm on Fire"
	},
	{
		id : 48,
		group : 'Rick Astley',
		song : "Together Forever"
	},
	{
		id : 49,
		group : 'Eddy Huntington',
		song : "USSR"
	},
	{
		id : 50,
		group : 'Eddy Huntington',
		song : "Hey Senorita"
	},
	{
		id : 51,
		group : 'Eddy Huntington',
		song : "Bang Bang Baby"
	},
	{
		id : 52,
		group : 'Eddy Huntington',
		song : "Meet My Friend"
	},
	{
		id : 53,
		group : 'Eddy Huntington',
		song : "Love For Russia (Ruble Version)"
	},
	{
		id : 54,
		group : 'Eddy Huntington',
		song : "Up And Down"
	},
	{
		id : 55,
		group : 'Eddy Huntington',
		song : "Honey, Honey!"
	},
	{
		id : 56,
		group : 'Stevie Wonder',
		song : "Master Blaster (Jammin')"
	},
	{
		id : 57,
		group : 'Stevie Wonder',
		song : "I Just Called To Say I Love You"
	},
	{
		id : 58,
		group : 'Bon Jovi',
		song : "You Give Love A Bad Name"
	},
	{
		id : 59,
		group : 'Bon Jovi',
		song : "Livin' On A Prayer"
	},
	{
		id : 60,
		group : 'Survivor',
		song : "Burning Heart"
	},
	{
		id : 61,
		group : 'Survivor',
		song : "Eye Of The Tiger"
	},
	{
		id : 62,
		group : 'Scorpions',
		song : "Rock You Like a Hurricane"
	},
	{
		id : 63,
		group : 'Def Leppard',
		song : "Pour Some Sugar on Me"
	},
	{
		id : 64,
		group : 'Twisted Sister',
		song : "We're Not Gonna Take It"
	},
	{
		id : 65,
		group : 'Kiss',
		song : "Heaven's On Fire"
	},
	{
		id : 66,
		group : 'Metallica',
		song : "Master Of Puppets"
	},
	{
		id : 67,
		group : 'Metallica',
		song : "Seek & Destroy"
	},
	{
		id : 68,
		group : 'Iron Maiden',
		song : "The Trooper"
	},
	{
		id : 69,
		group : "Guns N' Roses",
		song : "Sweet Child O' Mine"
	},
	{
		id : 70,
		group : "Guns N' Roses",
		song : "Mr. Brownstone"
	},
	{
		id : 71,
		group : "Guns N' Roses",
		song : "Welcome To The Jungle"
	},
	{
		id : 72,
		group : 'AC/DC',
		song : "Hells Bells"
	},
	{
		id : 73,
		group : 'AC/DC',
		song : "You Shook Me All Night Long"
	},
	{
		id : 74,
		group : 'Judas Priest',
		song : "Breaking the Law"
	},
	{
		id : 75,
		group : 'George Thorogood',
		song : "Bad To The Bone"
	},
	{
		id : 76,
		group : 'Ozzy Osbourne',
		song : "Crazy Train"
	},
	{
		id : 77,
		group : 'Danzig',
		song : "Mother"
	},
	{
		id : 78,
		group : 'Anthrax',
		song : "A.I.R."
	},
	{
		id : 79,
		group : 'Morrissey',
		song : "Everyday Is Like Sunday"
	},
	{
		id : 80,
		group : 'Daryl Hall & John Oates',
		song : "Private Eyes"
	},
	{
		id : 81,
		group : 'Daryl Hall & John Oates',
		song : "Maneater"
	},
	{
		id : 82,
		group : 'Daryl Hall & John Oates',
		song : "Kiss on My List"
	},
	{
		id : 83,
		group : 'Daryl Hall & John Oates',
		song : "I Can't Go For That (No Can Do)"
	},
	{
		id : 84,
		group : 'Daryl Hall & John Oates',
		song : "Out of Touch"
	},
	{
		id : 85,
		group : 'Ultravox',
		song : "Dancing With Tears In My Eyes"
	},
	{
		id : 86,
		group : 'Soul II Soul, Caron Wheeler',
		song : "Back to Life"
	},
	{
		id : 87,
		group : 'Men At Work',
		song : "Down Under"
	},
	{
		id : 88,
		group : 'Men At Work',
		song : "Who Can It Be Now?"
	},
	{
		id : 89,
		group : 'The Beach Boys, Fat Boys',
		song : "Wipeout"
	},
	{
		id : 90,
		group : 'Simple Minds',
		song : "Don't You"
	},
	{
		id : 91,
		group : 'Journey',
		song : "Don't Stop Believin'"
	},
	{
		id : 92,
		group : 'Tears For Fears',
		song : "Everybody Wants to Rule the World"
	},
	{
		id : 93,
		group : 'Tears For Fears',
		song : "Shout"
	},
	{
		id : 94,
		group : 'My Mine',
		song : "Hypnotic Tango"
	},
	{
		id : 95,
		group : 'Real Life',
		song : "Send Me An Angel"
	},
	{
		id : 96,
		group : 'Bronski Beat',
		song : "Smalltown Boy"
	},
	{
		id : 97,
		group : 'The Bangles',
		song : "Walk Like an Egyptian"
	},
	{
		id : 98,
		group : 'The Bangles',
		song : "Manic Monday"
	},
	{
		id : 99,
		group : 'Naked Eyes',
		song : "Always Something There To Remind Me"
	},
	{
		id : 100,
		group : "The Go-Go's",
		song : "Vacation"
	},
	{
		id : 101,
		group : "Eurythmix",
		song : "Sweet Dreams"
	},
	{
		id : 102,
		group : "Eurythmix",
		song : "Love Is a Stranger"
	},
	{
		id : 103,
		group : "The Outfield",
		song : "Your Love"
	},
	{
		id : 104,
		group : "ABC",
		song : "When Smokey Sings"
	},
	{
		id : 105,
		group : "Earth Wind & Fire",
		song : "Let's Groove"
	},
	{
		id : 106,
		group : "KC & The Sunshine Band",
		song : "Please Don't Go"
	},
	{
		id : 107,
		group : "Lionel Richie",
		song : "Truly"
	},
	{
		id : 108,
		group : "Lionel Richie",
		song : "All Night Long (All Night)"
	},
	{
		id : 109,
		group : "Lionel Richie",
		song : "Hello"
	},
	{
		id : 110,
		group : "Kenny Loggins",
		song : "Footloose"
	},
	{
		id : 111,
		group : "Rob Base & DJ E-Z Rock",
		song : "It Takes Two"
	},
	{
		id : 112,
		group : "Jennifer Warnes, Bill Medley",
		song : "(I've Had) The Time of My Life"
	},
	{
		id : 113,
		group : "Philip Bailey & Phil Collins",
		song : "Easy Lover"
	},
	{
		id : 114,
		group : "Phil Collins",
		song : "Another Day In Paradise"
	},
	{
		id : 115,
		group : "Phil Collins",
		song : "In The Air Tonight"
	},
	{
		id : 116,
		group : "Phil Collins",
		song : "Against All Odds (Take A Look At Me Now)"
	},
	{
		id : 117,
		group : "Phil Collins",
		song : "One More Night"
	},
	{
		id : 118,
		group : "Bryan Adams",
		song : "Heaven"
	},
	{
		id : 119,
		group : "Bryan Adams",
		song : "Summer Of '69"
	},
	{
		id : 120,
		group : "Nik Kershaw",
		song : "I Won't Let The Sun Go Down On Me"
	},
	{
		id : 121,
		group : "Nik Kershaw",
		song : "The Riddle"
	},
	{
		id : 122,
		group : "Jermaine Jackson, Pia Zadora",
		song : "When the Rain Begins to Fall"
	},
	{
		id : 123,
		group : "Bobby Brown",
		song : "My Prerogative"
	},
	{
		id : 124,
		group : "Bobby McFerrin",
		song : "Dont Worry, Be Happy"
	},
	{
		id : 125,
		group : "Savage",
		song : "Goodbye"
	},
	{
		id : 126,
		group : "Savage",
		song : "Only You"
	},
	{
		id : 127,
		group : "Savage",
		song : "Don'T Cry Tonight"
	},
	{
		id : 128,
		group : "Savage",
		song : "Fugitive"
	},
	{
		id : 129,
		group : "Savage",
		song : "Radio"
	},
	{
		id : 130,
		group : "Mr. Mister",
		song : "Broken Wings"
	},
	{
		id : 131,
		group : "Roy Orbison",
		song : "You Got It"
	},
	{
		id : 132,
		group : "Joan Jett & The Blackhearts",
		song : "I Love Rock 'N' Roll"
	},
	{
		id : 133,
		group : "The Clash",
		song : "Should I Stay or Should I Go"
	},
	{
		id : 134,
		group : "The Clash",
		song : "Rock the Casbah"
	}
];

let en_pop_1980 = [
	{
		id : 1,
		group : 'Madonna',
		song : "Like A Virgin"
	},
	{
		id : 2,
		group : 'Madonna',
		song : "Material Girl"
	},
	{
		id : 3,
		group : 'Madonna',
		song : "Borderline"
	},
	{
		id : 4,
		group : 'Madonna',
		song : "Lucky Star"
	},
	{
		id : 5,
		group : 'Madonna',
		song : "Crazy for You"
	},
	{
		id : 6,
		group : 'Toto',
		song : "Africa"
	},
	{
		id : 7,
		group : 'Van Halen',
		song : "Jump"
	},
	{
		id : 8,
		group : 'Dolly Parton',
		song : "9 to 5"
	},
	{
		id : 9,
		group : 'UB40',
		song : "Red Red Wine"
	},
	{
		id : 10,
		group : 'Bruce Springsteen',
		song : "Dancing In the Dark"
	},
	{
		id : 11,
		group : 'Bruce Springsteen',
		song : "Born in the U.S.A."
	},
	{
		id : 12,
		group : 'Richard Marx',
		song : "Right Here Waiting"
	},
	{
		id : 13,
		group : 'Willie Nelson',
		song : "Always On My Mind"
	},
	{
		id : 14,
		group : 'Kool & The Gang',
		song : "Celebration"
	},
	{
		id : 15,
		group : 'Janet Jackson',
		song : "When I Think Of You"
	},
	{
		id : 16,
		group : "Roy Orbison",
		song : "You Got It"
	},
	{
		id : 17,
		group : 'Run-DMC',
		song : "It's Like That"
	},
	{
		id : 18,
		group : 'Tracy Chapman',
		song : "Fast Car"
	},
	{
		id : 19,
		group : 'Stevie Wonder, Paul McCartney',
		song : "Ebony And Ivory"
	},
	{
		id : 20,
		group : 'Bob Marley & The Wailers',
		song : "Redemption Song"
	},
	{
		id : 21,
		group : 'Bob Marley & The Wailers',
		song : "Could You be Loved"
	},
	{
		id : 22,
		group : 'N.W.A.',
		song : "Gangsta Gangsta"
	},
	{
		id : 23,
		group : 'Ray Charles, Willie Nelson',
		song : "Seven Spanish Angels"
	},
	{
		id : 24,
		group : 'Michael Jackson',
		song : "Billie Jean"
	},
	{
		id : 25,
		group : 'Michael Jackson',
		song : "Beat It"
	},
	{
		id : 26,
		group : 'Michael Jackson',
		song : "Smooth Criminal"
	},
	{
		id : 27,
		group : 'Michael Jackson',
		song : "Thriller"
	},
	{
		id : 28,
		group : 'Michael Jackson',
		song : "Rock with You"
	},
	{
		id : 29,
		group : "Mr. Mister",
		song : "Broken Wings"
	},
	{
		id : 30,
		group : "Bobby McFerrin",
		song : "Dont Worry, Be Happy"
	},
	{
		id : 31,
		group : "Bobby Brown",
		song : "My Prerogative"
	},
	{
		id : 32,
		group : "Nik Kershaw",
		song : "I Won't Let The Sun Go Down On Me"
	},
	{
		id : 33,
		group : "Nik Kershaw",
		song : "The Riddle"
	},
	{
		id : 34,
		group : 'Technotronic',
		song : "Pump Up The Jam"
	},
	{
		id : 35,
		group : "Bryan Adams",
		song : "Summer Of '69"
	},
	{
		id : 36,
		group : 'Swing Out Sister',
		song : "Breakout"
	},
	{
		id : 37,
		group : "Phil Collins",
		song : "In The Air Tonight"
	},
	{
		id : 38,
		group : "Phil Collins",
		song : "Against All Odds (Take A Look At Me Now)"
	},
	{
		id : 39,
		group : "Phil Collins",
		song : "One More Night"
	},
	{
		id : 40,
		group : "Bryan Adams",
		song : "Heaven"
	},
	{
		id : 41,
		group : 'Wham!',
		song : "Wake Me Up Before You Go-Go"
	},
	{
		id : 42,
		group : 'Wham!',
		song : "Young Guns (Go For It!)"
	},
	{
		id : 43,
		group : 'Genesis',
		song : "Land Of Confusion"
	},
	{
		id : 44,
		group : 'A Flock Of Seagulls',
		song : "I Ran"
	},
	{
		id : 45,
		group : 'Bruce Springsteen',
		song : "I'm on Fire"
	},
	{
		id : 46,
		group : 'Stevie Wonder',
		song : "Master Blaster (Jammin')"
	},
	{
		id : 47,
		group : 'Stevie Wonder',
		song : "I Just Called To Say I Love You"
	},
	{
		id : 48,
		group : 'Morrissey',
		song : "Everyday Is Like Sunday"
	},
	{
		id : 49,
		group : 'Daryl Hall & John Oates',
		song : "Private Eyes"
	},
	{
		id : 50,
		group : 'Daryl Hall & John Oates',
		song : "Maneater"
	},
	{
		id : 51,
		group : 'Daryl Hall & John Oates',
		song : "Kiss on My List"
	},
	{
		id : 52,
		group : 'Daryl Hall & John Oates',
		song : "I Can't Go For That (No Can Do)"
	},
	{
		id : 53,
		group : 'Daryl Hall & John Oates',
		song : "Out of Touch"
	},
	{
		id : 54,
		group : 'Soul II Soul, Caron Wheeler',
		song : "Back to Life"
	},
	{
		id : 55,
		group : 'Men At Work',
		song : "Down Under"
	},
	{
		id : 56,
		group : 'Men At Work',
		song : "Who Can It Be Now?"
	},
	{
		id : 57,
		group : 'Fat Boys, The Beach Boys',
		song : "Wipeout"
	},
	{
		id : 58,
		group : 'Simple Minds',
		song : "Don't You"
	},
	{
		id : 59,
		group : 'Journey',
		song : "Don't Stop Believin'"
	},
	{
		id : 60,
		group : 'Tears For Fears',
		song : "Everybody Wants to Rule the World"
	},
	{
		id : 61,
		group : 'Tears For Fears',
		song : "Shout"
	},
	{
		id : 62,
		group : 'Real Life',
		song : "Send Me An Angel"
	},
	{
		id : 63,
		group : 'The Bangles',
		song : "Walk Like an Egyptian"
	},
	{
		id : 64,
		group : 'The Bangles',
		song : "Manic Monday"
	},
	{
		id : 65,
		group : 'Naked Eyes',
		song : "Always Something There To Remind Me"
	},
	{
		id : 66,
		group : "The Go-Go's",
		song : "Vacation"
	},
	{
		id : 67,
		group : "Eurythmix",
		song : "Sweet Dreams"
	},
	{
		id : 68,
		group : "Eurythmix",
		song : "Love Is a Stranger"
	},
	{
		id : 69,
		group : "The Outfield",
		song : "Your Love"
	},
	{
		id : 70,
		group : "ABC",
		song : "When Smokey Sings"
	},
	{
		id : 71,
		group : "Earth Wind & Fire",
		song : "Let's Groove"
	},
	{
		id : 72,
		group : "KC & The Sunshine Band",
		song : "Please Don't Go"
	},
	{
		id : 73,
		group : "Lionel Richie",
		song : "Truly"
	},
	{
		id : 74,
		group : "Lionel Richie",
		song : "All Night Long (All Night)"
	},
	{
		id : 75,
		group : "Lionel Richie",
		song : "Hello"
	},
	{
		id : 76,
		group : "Kenny Loggins",
		song : "Footloose"
	},
	{
		id : 77,
		group : "Rob Base & DJ E-Z Rock",
		song : "It Takes Two"
	},
	{
		id : 78,
		group : "Jennifer Warnes, Bill Medley",
		song : "(I've Had) The Time of My Life"
	},
	{
		id : 79,
		group : "Philip Bailey & Phil Collins",
		song : "Easy Lover"
	},
	{
		id : 80,
		group : "Phil Collins",
		song : "Another Day In Paradise"
	},
	{
		id : 81,
		group : "Europe",
		song : "The Final Countdown"
	},
	{
		id : 82,
		group : "Europe",
		song : "Carrie"
	},
	{
		id : 83,
		group : "Starship",
		song : "We Built This City"
	},
	{
		id : 84,
		group : "Chris Norman",
		song : "Stumblin' In"
	}
];

let en_rock_1980 = [
	{
		id : 1,
		group : 'Bon Jovi',
		song : "You Give Love A Bad Name"
	},
	{
		id : 2,
		group : 'Bon Jovi',
		song : "Livin' On A Prayer"
	},
	{
		id : 3,
		group : 'Survivor',
		song : "Burning Heart"
	},
	{
		id : 4,
		group : 'Survivor',
		song : "Eye Of The Tiger"
	},
	{
		id : 5,
		group : 'Scorpions',
		song : "Rock You Like a Hurricane"
	},
	{
		id : 6,
		group : 'Def Leppard',
		song : "Pour Some Sugar on Me"
	},
	{
		id : 7,
		group : 'Twisted Sister',
		song : "We're Not Gonna Take It"
	},
	{
		id : 8,
		group : 'Kiss',
		song : "Heaven's On Fire"
	},
	{
		id : 9,
		group : 'Metallica',
		song : "Master Of Puppets"
	},
	{
		id : 10,
		group : 'Metallica',
		song : "Seek & Destroy"
	},
	{
		id : 11,
		group : 'Iron Maiden',
		song : "The Trooper"
	},
	{
		id : 12,
		group : "Guns N' Roses",
		song : "Sweet Child O' Mine"
	},
	{
		id : 13,
		group : "Guns N' Roses",
		song : "Mr. Brownstone"
	},
	{
		id : 14,
		group : "Guns N' Roses",
		song : "Welcome To The Jungle"
	},
	{
		id : 15,
		group : 'AC/DC',
		song : "Hells Bells"
	},
	{
		id : 16,
		group : 'AC/DC',
		song : "You Shook Me All Night Long"
	},
	{
		id : 17,
		group : 'Judas Priest',
		song : "Breaking the Law"
	},
	{
		id : 18,
		group : 'George Thorogood',
		song : "Bad To The Bone"
	},
	{
		id : 19,
		group : 'Ozzy Osbourne',
		song : "Crazy Train"
	},
	{
		id : 20,
		group : 'Danzig',
		song : "Mother"
	},
	{
		id : 21,
		group : 'Anthrax',
		song : "A.I.R."
	},
	{
		id : 22,
		group : "Joan Jett & The Blackhearts",
		song : "I Love Rock 'N' Roll"
	},
	{
		id : 23,
		group : "The Clash",
		song : "Should I Stay or Should I Go"
	},
	{
		id : 24,
		group : "The Clash",
		song : "Rock the Casbah"
	},
	{
		id : 25,
		group : "Prince",
		song : "When Doves Cry"
	},
	{
		id : 26,
		group : "Prince And The Revolution",
		song : "Let's Go Crazy"
	},
	{
		id : 27,
		group : "Prince",
		song : "Purple Rain"
	},
	{
		id : 28,
		group : "Prince",
		song : "Raspberry Beret"
	},
	{
		id : 29,
		group : "Duran Duran",
		song : "Rio"
	},
	{
		id : 30,
		group : "Duran Duran",
		song : "A View to a Kill"
	},
	{
		id : 31,
		group : "Duran Duran",
		song : "The Reflex"
	},
	{
		id : 32,
		group : "U2",
		song : "I Still Haven't Found What I'm Looking For"
	},
	{
		id : 33,
		group : "U2",
		song : "With Or Without You"
	},
	{
		id : 34,
		group : "R.E.M.",
		song : "Orange Crush"
	},
	{
		id : 35,
		group : "Queen",
		song : "A Kind Of Magic"
	},
	{
		id : 36,
		group : "Queen",
		song : "Crazy Little Thing Called Love"
	},
	{
		id : 37,
		group : "Queen",
		song : "Another One Bites The Dust"
	},
	{
		id : 38,
		group : "Queen, David Bowie",
		song : "Under Pressure"
	},
	{
		id : 39,
		group : "Pink Floyd",
		song : "Another Brick In The Wall, Pt. 2"
	},
	{
		id : 40,
		group : "Blondie",
		song : "Call Me"
	},
	{
		id : 41,
		group : "Blondie",
		song : "The Tide Is High"
	},
	{
		id : 42,
		group : "Blondie",
		song : "Rapture"
	},
	{
		id : 43,
		group : "Blondie",
		song : "Atomic"
	},
	{
		id : 44,
		group : "Alice Cooper",
		song : "Bed of Nails"
	},
	{
		id : 45,
		group : "Whitesnake",
		song : "Here I Go Again"
	},
	{
		id : 46,
		group : "Roxette",
		song : "Listen To Your Heart"
	},
	{
		id : 47,
		group : "The Cure",
		song : "Close To Me"
	},
	{
		id : 48,
		group : "Aerosmith",
		song : "Lightning Strikes"
	},
	{
		id : 49,
		group : "Aerosmith",
		song : "Let The Music Do The Talking"
	},
	{
		id : 50,
		group : "Aerosmith",
		song : "Walk This Way"
	},
	{
		id : 51,
		group : "Aerosmith",
		song : "Dude (Looks Like A Lady)"
	},
	{
		id : 52,
		group : "Aerosmith",
		song : "Rag Doll"
	},
	{
		id : 53,
		group : "Aerosmith",
		song : "Angel"
	},
	{
		id : 54,
		group : "Aerosmith",
		song : "Janie's Got A Gun"
	},
	{
		id : 55,
		group : "Aerosmith",
		song : "Love In An Elevator"
	},
	{
		id : 56,
		group : "Aerosmith",
		song : "What It Takes"
	},
	{
		id : 57,
		group : "Aerosmith",
		song : "Monkey On My Back"
	},
	{
		id : 58,
		group : "INXS",
		song : "Devil Inside"
	},
	{
		id : 59,
		group : "Whitesnake",
		song : "Is this love"
	}
];

let en_disco_1980 = [
	{
		id : 1,
		group : 'Soft Cell',
		song : "Tainted Love"
	},
	{
		id : 2,
		group : 'Cutting Crew',
		song : "I Just Died in Your Arms Tonight"
	},
	{
		id : 3,
		group : 'Rick Astley',
		song : "Never Gonna Give You Up"
	},
	{
		id : 4,
		group : 'A-Ha',
		song : "Take On Me"
	},
	{
		id : 5,
		group : 'Nena',
		song : "99 Red Baloons"
	},
	{
		id : 6,
		group : 'Lipps Inc.',
		song : "Funkytown"
	},
	{
		id : 7,
		group : 'Culture Club',
		song : "Karma Chameleon"
	},
	{
		id : 8,
		group : 'Foreigner',
		song : "I Want To Know What Love Is"
	},
	{
		id : 9,
		group : 'Foreigner',
		song : "Urgent"
	},
	{
		id : 10,
		group : 'Level 42',
		song : "Lessons In Love"
	},
	{
		id : 11,
		group : 'The Pointer Sisters',
		song : "I'm So Excited"
	},
	{
		id : 12,
		group : 'KING',
		song : "Love and Pride"
	},
	{
		id : 13,
		group : 'Rick Astley',
		song : "Together Forever"
	},
	{
		id : 14,
		group : 'Eddy Huntington',
		song : "USSR"
	},
	{
		id : 15,
		group : 'Eddy Huntington',
		song : "Hey Senorita"
	},
	{
		id : 16,
		group : 'Eddy Huntington',
		song : "Bang Bang Baby"
	},
	{
		id : 17,
		group : 'Eddy Huntington',
		song : "Meet My Friend"
	},
	{
		id : 18,
		group : 'Eddy Huntington',
		song : "Love For Russia (Ruble Version)"
	},
	{
		id : 19,
		group : 'Eddy Huntington',
		song : "Up And Down"
	},
	{
		id : 20,
		group : 'Eddy Huntington',
		song : "Honey, Honey!"
	},
	{
		id : 21,
		group : 'Ultravox',
		song : "Dancing With Tears In My Eyes"
	},
	{
		id : 22,
		group : 'My Mine',
		song : "Hypnotic Tango"
	},
	{
		id : 23,
		group : 'Bronski Beat',
		song : "Smalltown Boy"
	},
	{
		id : 24,
		group : "Jermaine Jackson, Pia Zadora",
		song : "When the Rain Begins to Fall"
	},
	{
		id : 25,
		group : "Savage",
		song : "Goodbye"
	},
	{
		id : 26,
		group : "Savage",
		song : "Only You"
	},
	{
		id : 27,
		group : "Savage",
		song : "Don'T Cry Tonight"
	},
	{
		id : 28,
		group : "Savage",
		song : "Fugitive"
	},
	{
		id : 29,
		group : "Savage",
		song : "Radio"
	},
	{
		id : 30,
		group : "A La Carte",
		song : "Ring Me Honey"
	},
	{
		id : 31,
		group : "Opus",
		song : "Life Is Life"
	},
	{
		id : 32,
		group : "Digital Emotion",
		song : "Get Up Action"
	},
	{
		id : 33,
		group : "Digital Emotion",
		song : "Go Go Yellow Screen"
	},
	{
		id : 34,
		group : "Baccara",
		song : "Yes Sir, I Can Boogie"
	},
	{
		id : 35,
		group : "Baccara",
		song : "Sorry, I'm a Lady"
	},
	{
		id : 36,
		group : "Blue System",
		song : "My Bed Is Too Big"
	},
	{
		id : 37,
		group : "London Boys",
		song : "London Nights"
	},
	{
		id : 38,
		group : "Al Bano & Romina Power",
		song : "Al ritmo di beguine (ti amo)"
	},
	{
		id : 39,
		group : "Al Bano & Romina Power",
		song : "Its Forever"
	},
	{
		id : 40,
		group : "Al Bano & Romina Power",
		song : "Felicita"
	},
	{
		id : 41,
		group : "Al Bano & Romina Power",
		song : "Liberta"
	},
	{
		id : 42,
		group : "Al Bano & Romina Power",
		song : "Cisara"
	},
	{
		id : 43,
		group : "Goombay Dance Band",
		song : "Seven Tears"
	},
	{
		id : 44,
		group : "Ricchi E Poveri",
		song : "Mamma Maria"
	},
	{
		id : 45,
		group : "Ricchi E Poveri",
		song : "Hasta La Vista"
	},
	{
		id : 46,
		group : "Ricchi E Poveri",
		song : "Sarà perchè ti amo"
	},
	{
		id : 47,
		group : "Ricchi E Poveri",
		song : "Piccolo Amore"
	},
	{
		id : 48,
		group : "Ricchi E Poveri",
		song : "Voulez-Vous Danser"
	},
	{
		id : 49,
		group : "Ricchi E Poveri",
		song : "Se M'innamoro"
	},
	{
		id : 50,
		group : "Baby's Gang",
		song : "Challenger"
	},
	{
		id : 51,
		group : "Soultans",
		song : "Cant Take My Hands Off You"
	},
	{
		id : 52,
		group : "Mozzart",
		song : "Jasmin China Girl"
	},
	{
		id : 53,
		group : "Gazebo",
		song : "I Like Chopin"
	},
	{
		id : 54,
		group : "Gazebo",
		song : "Masterpiece"
	},
	{
		id : 55,
		group : "Joe Esposito",
		song : "You're The Best Around"
	},
	{
		id : 56,
		group : "George Michael",
		song : "Faith"
	},
	{
		id : 57,
		group : "George Michael",
		song : "Careless Whisper"
	},
	{
		id : 58,
		group : "Detto Mariano feat. Clown, Patrizia Tapparelli",
		song : "La pigiatura"
	},
	{
		id : 59,
		group : "Adriano Celentano",
		song : "Uh Uh"
	},
	{
		id : 60,
		group : "Adriano Celentano",
		song : "Pay - Pay - Pay"
	},
	{
		id : 61,
		group : "Adriano Celentano",
		song : "Soli"
	},
	{
		id : 62,
		group : "Adriano Celentano",
		song : "Susanna"
	},
	{
		id : 63,
		group : "Adriano Celentano",
		song : "Azzurro"
	},
	{
		id : 64,
		group : "Adriano Celentano",
		song : "Stivali E Colbacco"
	},
	{
		id : 65,
		group : "Toto Cutugno",
		song : "Serenata"
	},
	{
		id : 66,
		group : "Toto Cutugno",
		song : "L'italiano"
	},
	{
		id : 67,
		group : "Toto Cutugno",
		song : "La Mia Musica"
	},
	{
		id : 68,
		group : "Toto Cutugno",
		song : "Solo Noi"
	},
	{
		id : 69,
		group : "Toto Cutugno",
		song : "Donna Donna Mia"
	},
	{
		id : 70,
		group : "Toto Cutugno",
		song : "Enamorados"
	},
	{
		id : 71,
		group : "FRDavid",
		song : "Words"
	},
	{
		id : 72,
		group : "FRDavid",
		song : "Pick Up the Phone"
	},
	{
		id : 73,
		group : "Sandra",
		song : "Stop For A Minute"
	},
	{
		id : 74,
		group : "Sandra",
		song : "One More Night"
	},
	{
		id : 75,
		group : "Sandra",
		song : "In The Heat Of The Night"
	},
	{
		id : 76,
		group : "Sandra",
		song : "Maria Magdalena"
	},
	{
		id : 77,
		group : "Sandra",
		song : "Don't Cry"
	},
	{
		id : 78,
		group : "Sandra",
		song : "Heaven Can Wait"
	},
	{
		id : 79,
		group : "Sandra",
		song : "Moscow Nights"
	},
	{
		id : 80,
		group : "Sandra",
		song : "Secret Land"
	},
	{
		id : 81,
		group : "Sandra",
		song : "Around My Heart"
	},
	{
		id : 82,
		group : "Sabrina",
		song : "Boys Boys Boys"
	},
	{
		id : 83,
		group : "Laura Branigan",
		song : "Gloria"
	},
	{
		id : 84,
		group : "Laura Branigan",
		song : "Self Control"
	},
	{
		id : 85,
		group : "Kim Wilde",
		song : "You Keep Me Hangin' On"
	},
	{
		id : 86,
		group : "Kim Wilde",
		song : "Cambodia"
	},
	{
		id : 87,
		group : "Kim Wilde",
		song : "Kids In America"
	},
	{
		id : 88,
		group : "Samantha Fox",
		song : "Touch Me (I Want Your Body)"
	},
	{
		id : 89,
		group : "Samantha Fox",
		song : "I Only Wanna Be With You"
	},
	{
		id : 90,
		group : "Belinda Carlisle",
		song : "Circle In The Sand"
	},
	{
		id : 91,
		group : "Belinda Carlisle",
		song : "Leave A Light On"
	},
	{
		id : 92,
		group : "Belinda Carlisle",
		song : "Heaven Is A Place On Earth"
	},
	{
		id : 93,
		group : "Bonnie Tyler",
		song : "Total Eclipse of the Heart"
	},
	{
		id : 94,
		group : "Bonnie Tyler",
		song : "Holding Out for a Hero"
	},
	{
		id : 95,
		group : "Bonnie Tyler",
		song : "It's a Heartache"
	},
	{
		id : 96,
		group : "Donna Summer",
		song : "I Feel Love"
	},
	{
		id : 97,
		group : "Donna Summer",
		song : "Love To Love You Baby"
	},
	{
		id : 98,
		group : "Donna Summer",
		song : "Hot Stuff"
	},
	{
		id : 99,
		group : "Raffaella Carra",
		song : "Pedro"
	},
	{
		id : 100,
		group : "Captain & Tennille",
		song : "Do That To Me One More Time"
	},
	{
		id : 101,
		group : "Olivia Newton-John",
		song : "Magic"
	},
	{
		id : 102,
		group : "Olivia Newton-John",
		song : "Physical"
	},
	{
		id : 103,
		group : "Diana Ross",
		song : "Upside Down"
	},
	{
		id : 104,
		group : "Lionel Richie and Diana Ross",
		song : "Endless Love"
	},
	{
		id : 105,
		group : "Irene Cara",
		song : "Flashdance... What a Feeling"
	},
	{
		id : 106,
		group : "Irene Cara",
		song : "Fame"
	}
];

let ru_1980 = [
	{
		id : 1,
		group : 'Ласковый май',
		song : "Пусть будет ночь"
	},
	{
		id : 2,
		group : 'Весёлые ребята',
		song : "Бродячие артисты"
	},
	{
		id : 3,
		group : 'Земляне',
		song : "Трава у дома"
	},
	{
		id : 4,
		group : 'Земляне',
		song : "Поверь в мечту"
	},
	{
		id : 5,
		group : 'Браво',
		song : "Жёлтые ботинки"
	},
	{
		id : 6,
		group : 'Форум',
		song : "Островок"
	},
	{
		id : 7,
		group : 'Форум',
		song : "Улетели листья"
	},
	{
		id : 8,
		group : 'Мираж',
		song : "Солнечное лето"
	},
	{
		id : 9,
		group : 'Зодиак',
		song : "Провинциальное диско"
	},
	{
		id : 10,
		group : 'Зодиак',
		song : "Рок на льду"
	},
	{
		id : 11,
		group : 'Динамик',
		song : "Ещё вчера"
	},
	{
		id : 12,
		group : 'Круг',
		song : "Кара-кум"
	},
	{
		id : 13,
		group : 'Сёстры Базыкины',
		song : "О чём ты думаешь"
	},
	{
		id : 14,
		group : 'Маленький принц',
		song : "Мы встретимся снова"
	},
	{
		id : 15,
		group : 'Виктор Салтыков',
		song : "Белая ночь"
	},
	{
		id : 16,
		group : 'Игорь Корнелюк',
		song : "Билет на балет"
	},
	{
		id : 17,
		group : 'Игорь Корнелюк',
		song : "Возвращайся"
	},
	{
		id : 18,
		group : 'Вячеслав Добрынин',
		song : "Не сыпь мне соль на рану"
	},
	{
		id : 19,
		group : 'Юрий Лоза',
		song : "Плот"
	},
	{
		id : 20,
		group : 'Александр Барыкин',
		song : "Букет"
	},
	{
		id : 21,
		group : 'Владимир Кузьмин',
		song : "Пристань твоей надежды"
	},
	{
		id : 22,
		group : 'Владимир Маркин',
		song : "Сиреневый туман"
	},
	{
		id : 23,
		group : 'Владимир Маркин',
		song : "Я готов целовать песок"
	},
	{
		id : 24,
		group : 'Игорь Николаев',
		song : "Королевство кривых зеркал"
	},
	{
		id : 25,
		group : 'Юрий Антонов',
		song : "Поверь в мечту"
	},
	{
		id : 26,
		group : 'Юрий Антонов',
		song : "Золотая лестница"
	},
	{
		id : 27,
		group : 'Юрий Антонов',
		song : "Лунная дорожка"
	},
	{
		id : 28,
		group : 'Юрий Антонов',
		song : "Зеркало"
	},
	{
		id : 29,
		group : 'Юрий Антонов',
		song : "Море"
	},
	{
		id : 30,
		group : 'Юрий Антонов',
		song : "Дорога к морю"
	},
	{
		id : 31,
		group : 'Юрий Антонов',
		song : "На улице Каштановой"
	},
	{
		id : 32,
		group : 'Игорь Тальков',
		song : "Чистые пруды"
	},
	{
		id : 33,
		group : 'Игорь Скляр',
		song : "Комарово"
	},
	{
		id : 34,
		group : 'Тынис Мяги',
		song : "Я не умею танцевать"
	},
	{
		id : 35,
		group : 'Сергей Рогожин',
		song : "На соседней улице"
	},
	{
		id : 36,
		group : 'Анне Веске',
		song : "Радоваться жизни"
	},
	{
		id : 37,
		group : 'Анне Веске',
		song : "Позади крутой поворот"
	},
	{
		id : 38,
		group : 'Юрий Антонов',
		song : "Анастасия"
	},
	{
		id : 39,
		group : 'Браво',
		song : "Ленинградский рок-н-ролл"
	},
	{
		id : 40,
		group : 'ВИА Здравствуй, песня',
		song : "Синий иней"
	},
	{
		id : 41,
		group : 'Наутилус Помпилиус',
		song : "Гудбай, Америка"
	},
	{
		id : 42,
		group : 'Наутилус Помпилиус',
		song : "Я Хочу Быть С Тобой"
	},
	{
		id : 43,
		group : 'Михаил Боярский',
		song : "Сивка-Бурка"
	},
	{
		id : 44,
		group : 'Ярослав Евдокимов',
		song : "Фантазёр"
	},
	{
		id : 45,
		group : 'Ярослав Евдокимов',
		song : "Колодец"
	},
	{
		id : 46,
		group : 'Вячеслав Добрынин',
		song : "Синий Туман"
	},
	{
		id : 47,
		group : 'Юрий Антонов',
		song : "20 лет спустя"
	},
	{
		id : 48,
		group : 'Валентина Толкунова',
		song : "Я не могу иначе"
	},
	{
		id : 49,
		group : 'София Ротару',
		song : "Было, но прошло"
	},
	{
		id : 50,
		group : 'София Ротару',
		song : "Лаванда"
	},
	{
		id : 51,
		group : 'София Ротару',
		song : "Только этого мало"
	},
	{
		id : 52,
		group : 'София Ротару',
		song : "Луна, луна"
	},
	{
		id : 53,
		group : 'Ольга Зарубина',
		song : "На теплоходе музыка играет"
	},
	{
		id : 54,
		group : 'Алла Пугачёва',
		song : "Миллион алых роз"
	},
	{
		id : 55,
		group : 'Алла Пугачёва',
		song : "Айсберг"
	},
	{
		id : 56,
		group : 'Алла Пугачёва',
		song : "Старинные часы"
	},
	{
		id : 57,
		group : 'Алла Пугачёва',
		song : "Надо же"
	},
	{
		id : 58,
		group : 'Алла Пугачёва И Кристина Орбакайте',
		song : "А знаешь, всё ещё будет"
	},
	{
		id : 59,
		group : 'Ольга Седова',
		song : "Радоваться жизни"
	},
	{
		id : 60,
		group : 'Ирина Муравьёва',
		song : "Позвони мне, позвони"
	},
	{
		id : 61,
		group : 'Лариса Долина',
		song : "Половинка"
	},
	{
		id : 62,
		group : 'Леонтьев и Вайкуле',
		song : "Вернисаж"
	},
	{
		id : 63,
		group : 'Ирина Аллегрова',
		song : "Найди меня"
	},
	{
		id : 64,
		group : 'Игра',
		song : "Неспелая вишня"
	},
	{
		id : 65,
		group : 'ВИА «Верасы»',
		song : "Белый снег (Завируха)"
	},
	{
		id : 66,
		group : 'ВИА «Верасы»',
		song : "Малиновка"
	},
	{
		id : 67,
		group : 'Сябры',
		song : "Вы шумите, берёзы"
	},
	{
		id : 68,
		group : 'ВИА «Синяя птица»',
		song : "Я иду тебе навстречу"
	},
	{
		id : 69,
		group : 'Трио Меридиан',
		song : "Прекрасное далёко"
	},
	{
		id : 70,
		group : 'Агата Кристи',
		song : "Пантера"
	},
	{
		id : 71,
		group : 'Игорь Николаев',
		song : "Старая Мельница"
	},
	{
		id : 72,
		group : 'Валентина Легкоступова',
		song : "Хамелион"
	},
	{
		id : 73,
		group : 'Валентина Легкоступова',
		song : "Где искать тебя"
	},
	{
		id : 74,
		group : 'Валентина Легкоступова',
		song : "Хрустальные башмачки"
	},
	{
		id : 75,
		group : 'Ирина Понаровская',
		song : "Музыка любви"
	},
	{
		id : 76,
		group : 'Ирина Понаровская',
		song : "Однажды"
	},
	{
		id : 77,
		group : 'Ирина Понаровская',
		song : "Кроссворд"
	},
	{
		id : 78,
		group : 'Маша Распутина',
		song : "Городская сумасшедшая"
	},
	{
		id : 79,
		group : 'Маша Распутина',
		song : "Рыжая корова"
	},
	{
		id : 80,
		group : 'Маша Распутина',
		song : "Дождь прошёл"
	},
	{
		id : 81,
		group : 'Электроклуб',
		song : "Тёмная лошадка"
	},
	{
		id : 82,
		group : 'Электроклуб',
		song : "Кони в яблоках"
	},
	{
		id : 83,
		group : 'Электроклуб',
		song : "Ты замуж за него не выходи"
	},
	{
		id : 84,
		group : 'Электроклуб',
		song : "Игрушка"
	},
	{
		id : 85,
		group : 'Фристайл',
		song : "Прощай навеки, последняя любовь"
	},
	{
		id : 86,
		group : 'Фристайл',
		song : "Принцесса"
	},
	{
		id : 87,
		group : 'ВИА Пламя',
		song : "Не повторяется такое никогда"
	},
	{
		id : 88,
		group : 'ВИА Пламя',
		song : "Не надо печалиться"
	},
	{
		id : 89,
		group : 'ВИА Ариэль',
		song : "На острове Буяне"
	},
	{
		id : 90,
		group : 'ВИА Ариэль',
		song : "Каждый день твой"
	},
	{
		id : 91,
		group : 'ВИА Ариэль',
		song : "По полю, полю"
	},
	{
		id : 92,
		group : 'Цветы',
		song : "Мы желаем счастья вам"
	},
	{
		id : 93,
		group : 'Цветы',
		song : "Богатырская сила"
	},
	{
		id : 94,
		group : 'Любэ',
		song : "Атас"
	},
	{
		id : 95,
		group : 'Любэ',
		song : "Не губите, мужики"
	},
	{
		id : 96,
		group : 'Любэ',
		song : "Клетки"
	},
	{
		id : 97,
		group : 'Сёстры Базыкины',
		song : "Moscow Nights"
	}
];

let ru_rock_1980 = [
	{
		id : 1,
		group : 'Крематорий',
		song : "Маленькая девочка"
	},
	{
		id : 2,
		group : 'Крематорий',
		song : "Мусорный ветер"
	},
	{
		id : 3,
		group : 'Крематорий',
		song : "Безобразная Эльза"
	},
	{
		id : 4,
		group : 'Крематорий',
		song : "Катманду"
	},
	{
		id : 5,
		group : 'Крематорий',
		song : "Клубника со льдом"
	},
	{
		id : 6,
		group : 'Пикник',
		song : "Иероглиф"
	},
	{
		id : 7,
		group : 'Пикник',
		song : "Праздник"
	},
	{
		id : 8,
		group : 'Пикник',
		song : "Телефон"
	},
	{
		id : 9,
		group : 'Пикник',
		song : "Остров"
	},
	{
		id : 10,
		group : 'Пикник',
		song : "Пикник"
	},
	{
		id : 11,
		group : 'ЧайФ',
		song : "Вольный ветер"
	},
	{
		id : 12,
		group : 'ЧайФ',
		song : "Никто не услышит (Ой-йо)"
	},
	{
		id : 13,
		group : 'ЧайФ',
		song : "Всему своё время"
	},
	{
		id : 14,
		group : 'ЧайФ',
		song : "Не спеши"
	},
	{
		id : 15,
		group : 'Звуки Му',
		song : "Бутылка водки"
	},
	{
		id : 16,
		group : 'Звуки Му',
		song : "Серый голубь"
	},
	{
		id : 17,
		group : 'Звуки Му',
		song : "Бумажные цветы"
	},
	{
		id : 18,
		group : 'Звуки Му',
		song : "Досуги-буги"
	},
	{
		id : 19,
		group : 'Звуки Му',
		song : "Крым"
	},
	{
		id : 20,
		group : 'АукцЫон',
		song : "Нэпман"
	},
	{
		id : 21,
		group : 'АукцЫон',
		song : "Волчица"
	},
	{
		id : 22,
		group : 'АукцЫон',
		song : "Банзай"
	},
	{
		id : 23,
		group : 'АукцЫон',
		song : "Дорога"
	},
	{
		id : 24,
		group : 'АукцЫон',
		song : "Осколки"
	},
	{
		id : 25,
		group : 'Гражданская оборона',
		song : "Всё идёт по плану"
	},
	{
		id : 26,
		group : 'Гражданская оборона',
		song : "Зоопарк"
	},
	{
		id : 27,
		group : 'Гражданская оборона',
		song : "На наших глазах"
	},
	{
		id : 28,
		group : 'Гражданская оборона',
		song : "Дезертир"
	},
	{
		id : 29,
		group : 'Гражданская оборона',
		song : "Слепое бельмо"
	},
	{
		id : 30,
		group : 'Круиз',
		song : "Крутится волчок"
	},
	{
		id : 31,
		group : 'Круиз',
		song : "Не позволяй душе ленится"
	},
	{
		id : 32,
		group : 'Круиз',
		song : "Стремленья"
	},
	{
		id : 33,
		group : 'Круиз',
		song : "Виза для Круиза"
	},
	{
		id : 34,
		group : 'Круиз',
		song : "Кто-то же должен"
	},
	{
		id : 35,
		group : 'Зоопарк',
		song : "Буги-вуги каждый день"
	},
	{
		id : 36,
		group : 'Зоопарк',
		song : "Пригородный блюз"
	},
	{
		id : 37,
		group : 'Зоопарк',
		song : "Сидя на белой полосе"
	},
	{
		id : 38,
		group : 'Зоопарк',
		song : "Песня простого человека"
	},
	{
		id : 39,
		group : 'Зоопарк',
		song : "Растафара (Натти Дрэда)"
	},
	{
		id : 40,
		group : 'Чёрный кофе',
		song : "Листья"
	},
	{
		id : 41,
		group : 'Чёрный кофе',
		song : "Жизни рассвет"
	},
	{
		id : 42,
		group : 'Чёрный кофе',
		song : "Это - рок"
	},
	{
		id : 43,
		group : 'Чёрный кофе',
		song : "Церквушки"
	},
	{
		id : 44,
		group : 'Алиса',
		song : "Красное на чёрном"
	},
	{
		id : 45,
		group : 'Алиса',
		song : "Моё поколение"
	},
	{
		id : 46,
		group : 'Алиса',
		song : "Воздух"
	},
	{
		id : 47,
		group : 'Алиса',
		song : "Время менять имена"
	},
	{
		id : 48,
		group : 'Карнавал',
		song : "Аэропорт"
	},
	{
		id : 49,
		group : 'Карнавал',
		song : "Запасной игрок"
	},
	{
		id : 50,
		group : 'Альянс',
		song : "На заре"
	},
	{
		id : 51,
		group : 'Альянс',
		song : "Дайте огня"
	},
	{
		id : 52,
		group : 'Альянс',
		song : "День освобождения"
	},
	{
		id : 53,
		group : 'Альянс',
		song : "Фальстарт"
	},
	{
		id : 54,
		group : 'Альянс',
		song : "Вальс"
	},
	{
		id : 55,
		group : 'Автограф',
		song : "Головокруженье"
	},
	{
		id : 56,
		group : 'Автограф',
		song : "Ирландия. Ольстер"
	},
	{
		id : 57,
		group : 'Автограф',
		song : "Корабль"
	},
	{
		id : 58,
		group : 'Автограф',
		song : "О мой мальчик"
	},
	{
		id : 59,
		group : 'ДК',
		song : "Ветер перемен"
	},
	{
		id : 60,
		group : 'ДК',
		song : "Вот так вота!"
	},
	{
		id : 61,
		group : 'ДК',
		song : "Заберите вашу жизнь"
	},
	{
		id : 62,
		group : 'ДК',
		song : "Зиба"
	},
	{
		id : 63,
		group : 'Воскресение',
		song : "Кто виноват"
	},
	{
		id : 64,
		group : 'Воскресение',
		song : "Воскресение"
	},
	{
		id : 65,
		group : 'Воскресение',
		song : "Мчится поезд"
	},
	{
		id : 66,
		group : 'Воскресение',
		song : "Я ни разу за морем не был"
	},
	{
		id : 67,
		group : 'Секрет',
		song : "Ты и я"
	},
	{
		id : 68,
		group : 'Секрет',
		song : "Кеды"
	},
	{
		id : 69,
		group : 'Секрет',
		song : "Привет"
	},
	{
		id : 70,
		group : 'Секрет',
		song : "Алиса"
	},
	{
		id : 71,
		group : 'Секрет',
		song : "Ленинградское время"
	},
	{
		id : 72,
		group : 'Ария',
		song : "Улица роз"
	},
	{
		id : 73,
		group : 'Ария',
		song : "Позади Америка"
	},
	{
		id : 74,
		group : 'Ария',
		song : "Воля и разум"
	},
	{
		id : 75,
		group : 'Ария',
		song : "Дай жару!"
	},
	{
		id : 76,
		group : 'Аквариум',
		song : "Поезд в огне"
	},
	{
		id : 77,
		group : 'Бригада С',
		song : "Бродяга"
	},
	{
		id : 78,
		group : 'ДДТ',
		song : "Родина"
	},
	{
		id : 79,
		group : 'Черный кофе',
		song : "Черный кофе"
	},
	{
		id : 80,
		group : 'Черный кофе',
		song : "Вольному воля"
	},
	{
		id : 81,
		group : 'Черный кофе',
		song : "Светлый металл"
	}
];

let ru_2000 = [
	{
		id : 1,
		group : 'Корни',
		song : "Вика"
	},
	{
		id : 2,
		group : 'Надежда Кадышева ft. Антон Зацепин',
		song : "Широка река"
	},
	{
		id : 3,
		group : 'Кристина Орбакайте',
		song : "Губки бантиком"
	},
	{
		id : 4,
		group : 'Ирина Дубцова',
		song : "О нём"
	},
	{
		id : 5,
		group : 'Фабрика',
		song : "Рыбка"
	},
	{
		id : 6,
		group : 'Уматурман',
		song : "Проститься"
	},
	{
		id : 7,
		group : 'Стас Пьеха',
		song : "Одна звезда"
	},
	{
		id : 8,
		group : 'Тутси',
		song : "Самый, самый"
	},
	{
		id : 9,
		group : 'Дима Билан',
		song : "На берегу неба"
	},
	{
		id : 10,
		group : 'Валерий Кипелов',
		song : "Я свободен"
	},
	{
		id : 11,
		group : 'Иракли',
		song : "Лондон-Париж"
	},
	{
		id : 12,
		group : 'Вячеслав Бутусов',
		song : "Девушка по городу"
	},
	{
		id : 13,
		group : 'Звери',
		song : "Всё, что тебя касается"
	},
	{
		id : 14,
		group : 'Верка Сердючка ft. Глюкоза',
		song : "Жениха хотела"
	},
	{
		id : 15,
		group : 'Николай Расторгуев & Сергей Безруков',
		song : "Берёзы"
	}
];

let ru_kish_gr = [
	{
		id : 1,
		group : 'Смельчак и ветер',
		song : "Камнем по голове"
	},
	{
		id : 2,
		group : 'Проказник Скоморох',
		song : "Камнем по голове"
	},
	{
		id : 3,
		group : 'Верная жена',
		song : "Камнем по голове"
	},
	{
		id : 4,
		group : 'Лесник',
		song : "Будь как дома, путник"
	},
	{
		id : 5,
		group : 'Охотник',
		song : "Будь как дома, путник"
	},
	{
		id : 6,
		group : 'Сапоги мертвеца',
		song : "Будь как дома, путник"
	},
	{
		id : 7,
		group : 'Кукла колдуна',
		song : "Акустический Альбом"
	},
	{
		id : 8,
		group : 'Прыгну со скалы',
		song : "Акустический Альбом"
	},
	{
		id : 9,
		group : 'Девушка и Граф',
		song : "Акустический Альбом"
	},
	{
		id : 10,
		group : 'Дед на свадьбе',
		song : "Герои и Злодеи"
	},
	{
		id : 11,
		group : 'Запрет отца',
		song : "Герои и Злодеи"
	},
	{
		id : 12,
		group : 'Кузнец',
		song : "Герои и Злодеи"
	},
	{
		id : 13,
		group : 'Проклятый старый дом',
		song : "Как в старой сказке"
	},
	{
		id : 14,
		group : 'Тайна хозяйки старинных часов',
		song : "Как в старой сказке"
	},
	{
		id : 15,
		group : 'Скотный двор',
		song : "Как в старой сказке"
	},
	{
		id : 16,
		group : 'Мертвый анархист',
		song : "Жаль, нет ружья"
	},
	{
		id : 17,
		group : 'Генрих и смерть',
		song : "Жаль, нет ружья"
	},
	{
		id : 18,
		group : 'Жаль, нет ружья',
		song : "Жаль, нет ружья"
	},
	{
		id : 19,
		group : 'Месть Гарри',
		song : "Бунт на корабле"
	},
	{
		id : 20,
		group : 'Северный флот',
		song : "Бунт на корабле"
	},
	{
		id : 21,
		group : 'Хозяин леса',
		song : "Бунт на корабле"
	},
	{
		id : 22,
		group : 'Марионетки',
		song : "Продавец Кошмаров"
	},
	{
		id : 23,
		group : 'Ром',
		song : "Продавец Кошмаров"
	},
	{
		id : 24,
		group : 'Джокер',
		song : "Продавец Кошмаров"
	},
	{
		id : 25,
		group : 'Тень Клоуна',
		song : "Тень Клоуна"
	},
	{
		id : 26,
		group : 'Дагон',
		song : "Тень Клоуна"
	},
	{
		id : 27,
		group : 'Двое против всех',
		song : "Тень Клоуна"
	},
	{
		id : 28,
		group : 'Послание',
		song : "Театр Демона"
	},
	{
		id : 29,
		group : 'Театральный демон',
		song : "Театр Демона"
	},
	{
		id : 30,
		group : 'Киногерой',
		song : "Театр Демона"
	},
	{
		id : 31,
		group : 'Добрые люди (Хор нищих)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 32,
		group : 'Баллада о Бедном Цирюльнике (Ария Бродяги)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 33,
		group : 'Каторжник (Ария Тодда)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 34,
		group : 'Смерть на балу (Ария Солиста и Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 35,
		group : 'Маленький остров (Ария Ловетт)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 36,
		group : 'Неупокоенный (Ария Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 37,
		group : 'Садовник',
		song : "Камнем по голове"
	},
	{
		id : 38,
		group : 'Блуждают тени',
		song : "Камнем по голове"
	},
	{
		id : 39,
		group : 'Внезапная голова',
		song : "Камнем по голове"
	},
	{
		id : 40,
		group : 'Шар голубой',
		song : "Камнем по голове"
	},
	{
		id : 41,
		group : 'Злодей и шапка',
		song : "Камнем по голове"
	},
	{
		id : 42,
		group : 'От женщин кругом голова',
		song : "Камнем по голове"
	},
	{
		id : 43,
		group : 'Рыбак',
		song : "Камнем по голове"
	},
	{
		id : 44,
		group : 'Мотоцикл',
		song : "Камнем по голове"
	},
	{
		id : 45,
		group : 'Холодное тело',
		song : "Камнем по голове"
	},
	{
		id : 46,
		group : 'Дурак и молния',
		song : "Камнем по голове"
	},
	{
		id : 47,
		group : 'Леший обиделся',
		song : "Камнем по голове"
	},
	{
		id : 48,
		group : 'Два вора и монета',
		song : "Камнем по голове"
	},
	{
		id : 49,
		group : 'Любовь и пропеллер',
		song : "Камнем по голове"
	},
	{
		id : 50,
		group : 'Камнем по голове',
		song : "Камнем по голове"
	},
	{
		id : 51,
		group : 'С тех пор, как он ушел',
		song : "Камнем по голове"
	},
	{
		id : 52,
		group : 'В доме суета',
		song : "Камнем по голове"
	},
	{
		id : 53,
		group : 'Лесные разбойники',
		song : "Камнем по голове"
	},
	{
		id : 54,
		group : 'Мария',
		song : "Камнем по голове"
	},
	{
		id : 55,
		group : 'Король и шут',
		song : "Будь как дома, путник"
	},
	{
		id : 56,
		group : 'Два друга и разбойники',
		song : "Будь как дома, путник"
	},
	{
		id : 57,
		group : 'Паника в селе',
		song : "Будь как дома, путник"
	},
	{
		id : 58,
		group : 'Истинный убийца',
		song : "Будь как дома, путник"
	},
	{
		id : 59,
		group : 'Помоги мне',
		song : "Будь как дома, путник"
	},
	{
		id : 60,
		group : 'История о мертвой женщине',
		song : "Будь как дома, путник"
	},
	{
		id : 61,
		group : 'Кукольный театр',
		song : "Будь как дома, путник"
	},
	{
		id : 62,
		group : 'Валет и дама',
		song : "Будь как дома, путник"
	},
	{
		id : 63,
		group : 'Веселые тролли',
		song : "Будь как дома, путник"
	},
	{
		id : 64,
		group : 'Он не знает, что такое жить',
		song : "Будь как дома, путник"
	},
	{
		id : 65,
		group : 'Отец и маски',
		song : "Будь как дома, путник"
	},
	{
		id : 66,
		group : 'Сказка про дракона',
		song : "Будь как дома, путник"
	},
	{
		id : 67,
		group : 'Инструмент',
		song : "Будь как дома, путник"
	},
	{
		id : 68,
		group : 'Собрание',
		song : "Будь как дома, путник"
	},
	{
		id : 69,
		group : 'Наблюдатель',
		song : "Акустический Альбом"
	},
	{
		id : 70,
		group : 'Бедняжка',
		song : "Акустический Альбом"
	},
	{
		id : 71,
		group : 'Песня мушкетёров',
		song : "Акустический Альбом"
	},
	{
		id : 72,
		group : 'Тяни!',
		song : "Акустический Альбом"
	},
	{
		id : 73,
		group : 'Утренний рассвет',
		song : "Акустический Альбом"
	},
	{
		id : 74,
		group : 'Сосиска',
		song : "Акустический Альбом"
	},
	{
		id : 75,
		group : 'Карапуз',
		song : "Акустический Альбом"
	},
	{
		id : 76,
		group : 'Спятил отец',
		song : "Акустический Альбом"
	},
	{
		id : 77,
		group : 'Ведьма и осёл',
		song : "Акустический Альбом"
	},
	{
		id : 78,
		group : 'Екатерина',
		song : "Акустический Альбом"
	},
	{
		id : 79,
		group : 'Прерванная любовь, или Арбузная корка',
		song : "Акустический Альбом"
	},
	{
		id : 80,
		group : 'Голые коки',
		song : "Акустический Альбом"
	},
	{
		id : 81,
		group : 'Забытые ботинки',
		song : "Акустический Альбом"
	},
	{
		id : 82,
		group : 'Разговор с гоблином',
		song : "Герои и Злодеи"
	},
	{
		id : 83,
		group : 'Вор, граф и графиня',
		song : "Герои и Злодеи"
	},
	{
		id : 84,
		group : 'Что видел малыш',
		song : "Герои и Злодеи"
	},
	{
		id : 85,
		group : 'Невеста палача',
		song : "Герои и Злодеи"
	},
	{
		id : 86,
		group : 'Мастер приглашает в гости',
		song : "Герои и Злодеи"
	},
	{
		id : 87,
		group : 'Бродяга и старик',
		song : "Герои и Злодеи"
	},
	{
		id : 88,
		group : 'Смерть халдея',
		song : "Герои и Злодеи"
	},
	{
		id : 89,
		group : 'Помнят с горечью древляне',
		song : "Герои и Злодеи"
	},
	{
		id : 90,
		group : 'Про Ивана',
		song : "Герои и Злодеи"
	},
	{
		id : 91,
		group : 'Воспоминания о былой любви',
		song : "Герои и Злодеи"
	},
	{
		id : 92,
		group : 'Гимн шута',
		song : "Как в старой сказке"
	},
	{
		id : 93,
		group : 'Кузьма и барин',
		song : "Как в старой сказке"
	},
	{
		id : 94,
		group : 'Пират',
		song : "Как в старой сказке"
	},
	{
		id : 95,
		group : 'Возвращение колдуна',
		song : "Как в старой сказке"
	},
	{
		id : 96,
		group : 'Зловещий кузен',
		song : "Как в старой сказке"
	},
	{
		id : 97,
		group : 'Ответ — лютая месть',
		song : "Как в старой сказке"
	},
	{
		id : 98,
		group : 'Рогатый',
		song : "Как в старой сказке"
	},
	{
		id : 99,
		group : 'Двухголовый отпрыск',
		song : "Как в старой сказке"
	},
	{
		id : 100,
		group : 'Два монаха в одну ночь',
		song : "Как в старой сказке"
	},
	{
		id : 101,
		group : 'Кто это все придумал',
		song : "Как в старой сказке"
	},
	{
		id : 102,
		group : 'Пивной череп',
		song : "Как в старой сказке"
	},
	{
		id : 103,
		group : 'Парень и леший',
		song : "Как в старой сказке"
	},
	{
		id : 104,
		group : 'Похороны панка',
		song : "Как в старой сказке"
	},
	{
		id : 105,
		group : 'Хороший пират — мертвый пират',
		song : "Бунт на корабле"
	},
	{
		id : 106,
		group : 'Волосокрад',
		song : "Жаль, нет ружья"
	},
	{
		id : 107,
		group : 'Смешной совет',
		song : "Жаль, нет ружья"
	},
	{
		id : 108,
		group : 'Некромант',
		song : "Жаль, нет ружья"
	},
	{
		id : 109,
		group : 'Защитник свиней',
		song : "Жаль, нет ружья"
	},
	{
		id : 110,
		group : 'Представляю я',
		song : "Жаль, нет ружья"
	},
	{
		id : 111,
		group : 'Мой характер',
		song : "Жаль, нет ружья"
	},
	{
		id : 112,
		group : 'Песенка пьяного деда',
		song : "Жаль, нет ружья"
	},
	{
		id : 113,
		group : 'Водяной',
		song : "Жаль, нет ружья"
	},
	{
		id : 114,
		group : 'Вдова и Горбун',
		song : "Жаль, нет ружья"
	},
	{
		id : 115,
		group : 'Вино хоббитов',
		song : "Жаль, нет ружья"
	},
	{
		id : 116,
		group : 'Разборки из-за баб',
		song : "Жаль, нет ружья"
	},
	{
		id : 117,
		group : 'Утопленник',
		song : "Жаль, нет ружья"
	},
	{
		id : 118,
		group : 'Медведь',
		song : "Жаль, нет ружья"
	},
	{
		id : 119,
		group : 'Пьянка',
		song : "Жаль, нет ружья"
	},
	{
		id : 120,
		group : 'Хардкор по-русски',
		song : "Бунт на корабле"
	},
	{
		id : 121,
		group : 'Волшебный глаз старика Алонса',
		song : "Бунт на корабле"
	},
	{
		id : 122,
		group : 'Исповедь вампира',
		song : "Бунт на корабле"
	},
	{
		id : 123,
		group : 'Идол',
		song : "Бунт на корабле"
	},
	{
		id : 124,
		group : 'Бунт на корабле',
		song : "Бунт на корабле"
	},
	{
		id : 124,
		group : 'Бунт на корабле',
		song : "Бунт на корабле"
	},
	{
		id : 125,
		group : 'Хороший пират — мертвый пират',
		song : "Бунт на корабле"
	},
	{
		id : 126,
		group : 'Рыцарь',
		song : "Бунт на корабле"
	},
	{
		id : 127,
		group : 'Звонок',
		song : "Бунт на корабле"
	},
	{
		id : 128,
		group : 'Инквизитор',
		song : "Бунт на корабле"
	},
	{
		id : 129,
		group : 'Задира и солдат',
		song : "Бунт на корабле"
	},
	{
		id : 130,
		group : 'Раненый воин',
		song : "Бунт на корабле"
	},
	{
		id : 131,
		group : 'Маска',
		song : "Бунт на корабле"
	},
	{
		id : 132,
		group : 'Гробовщик',
		song : "Продавец Кошмаров"
	},
	{
		id : 133,
		group : 'Дочка вурдалака',
		song : "Продавец Кошмаров"
	},
	{
		id : 134,
		group : 'Свой среди чужих',
		song : "Продавец Кошмаров"
	},
	{
		id : 135,
		group : 'Отражение',
		song : "Продавец Кошмаров"
	},
	{
		id : 136,
		group : 'Та, что смотрит из пруда',
		song : "Продавец Кошмаров"
	},
	{
		id : 137,
		group : 'В гостях у соседа',
		song : "Продавец Кошмаров"
	},
	{
		id : 138,
		group : 'Хозяин таверны',
		song : "Продавец Кошмаров"
	},
	{
		id : 139,
		group : 'Писатель Гудвин',
		song : "Продавец Кошмаров"
	},
	{
		id : 140,
		group : 'Пляски на могиле',
		song : "Продавец Кошмаров"
	},
	{
		id : 141,
		group : 'Матерый волк',
		song : "Продавец Кошмаров"
	},
	{
		id : 142,
		group : 'Продавец кошмаров',
		song : "Продавец Кошмаров"
	},
	{
		id : 143,
		group : 'Город мертвецов',
		song : "Продавец Кошмаров"
	},
	{
		id : 144,
		group : 'В Париж – домой',
		song : "Тень Клоуна"
	},
	{
		id : 145,
		group : 'Ричард Гордон',
		song : "Тень Клоуна"
	},
	{
		id : 146,
		group : 'Фред',
		song : "Тень Клоуна"
	},
	{
		id : 147,
		group : 'Санта-Клаус',
		song : "Тень Клоуна"
	},
	{
		id : 148,
		group : 'Кода',
		song : "Тень Клоуна"
	},
	{
		id : 149,
		group : 'Невидимка',
		song : "Тень Клоуна"
	},
	{
		id : 150,
		group : 'A.M.T.V.',
		song : "Тень Клоуна"
	},
	{
		id : 151,
		group : 'Ходит зомби',
		song : "Тень Клоуна"
	},
	{
		id : 152,
		group : 'Смешной пистолет',
		song : "Тень Клоуна"
	},
	{
		id : 153,
		group : 'Вестник',
		song : "Тень Клоуна"
	},
	{
		id : 154,
		group : 'Клеймённый огнём',
		song : "Тень Клоуна"
	},
	{
		id : 155,
		group : 'Тринадцатая рана',
		song : "Тень Клоуна"
	},
	{
		id : 156,
		group : 'Суфлёр',
		song : "Тень Клоуна"
	},
	{
		id : 157,
		group : 'Фокусник',
		song : "Театр Демона"
	},
	{
		id : 158,
		group : 'Танец злобного гения',
		song : "Театр Демона"
	},
	{
		id : 159,
		group : 'Энди Кауфман',
		song : "Театр Демона"
	},
	{
		id : 160,
		group : 'Мадам Жоржетт',
		song : "Театр Демона"
	},
	{
		id : 161,
		group : 'Бунтарь',
		song : "Театр Демона"
	},
	{
		id : 162,
		group : 'Темный учитель',
		song : "Театр Демона"
	},
	{
		id : 163,
		group : 'Король вечного сна',
		song : "Театр Демона"
	},
	{
		id : 164,
		group : 'Бал лицемеров',
		song : "Театр Демона"
	},
	{
		id : 165,
		group : 'Защитники',
		song : "Театр Демона"
	},
	{
		id : 166,
		group : 'Пирожки от Ловетт (Хор нищих и бродяг)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 167,
		group : 'Праздник крови (Ария Судьи)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 168,
		group : 'Машина смерти (Ария Ловетт и Мясника)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 169,
		group : 'Смертный приговор (Ария Тодда и Мясника)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 170,
		group : 'Признание Ловетт (Ария Ловетт)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 171,
		group : 'Первая кровь (Ария Священника и Тодда)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 172,
		group : 'Новая пирожковая (Ария благородной толпы)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 173,
		group : 'Счастье? (Ария Тодда)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		id : 174,
		group : 'Выход Судьи (Ария Судьи)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 175,
		group : 'Христова невеста (Дуэт Элизы и Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 176,
		group : 'Священник больше ничего не скажет (Ария Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 177,
		group : 'Небесный суд (Дуэт Судьи и Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 178,
		group : 'Почему ты жива? (Ария Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 179,
		group : 'Смерть Ловетт (Ария Ловетт)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		id : 180,
		group : 'На краю (Последняя ария Тодда)',
		song : "Todd. Акт 2 – На краю"
	}
];

let states = ["Знаток", "Специалист", "Профессионал", "Дока", "Гуру", "Профессор", "Мастер", 
			  "Эксперт", "Виртуоз", "Маэстро", "Эрудит", "Мастак", "Всезнайка"];
			  
let teams = [
	{
		name : 'Ос.Од.',
		score: 0,
		percent : 100
	},
	{
		name : 'Васаби',
		score: 0,
		percent : 90
	},
	{
		name : 'Чехов',
		score: 0,
		percent : 85
	},
	{
		name : '19:17',
		score: 0,
		percent : 80
	},
	{
		name : 'Чаёчек',
		score: 0,
		percent : 70
	}
];

function teamRandomScore(){
	teams.forEach(team => {
		if(team.name !== 'Ос.Од.') randomScore(team)
		else team.score = score;
	});
	teams.sort((a, b) => b.score - a.score);
	let i = -1;	
	teams.forEach(team => {
		$('#team_' + ++i).html(team.name);
		$('#score_' + i).html(team.score);
	});
}

function randomScore(team){
	if(getRandomInt(0,100) < team.percent) team.score++;
}
		
function en(){
	lang = 'en';
	$('#ru').hide();
	$('#en').hide();
	$('.settings').hide();
	$('.en').show();
}

function ru(){
	lang = 'ru';
	$('#ru').hide();
	$('#en').hide();
	$('.settings').hide();
	$('.ru').show();
}

function group(){
	setPaths('gr');
}

function female(){
	setPaths('f');
}

function male(){
	setPaths('m');
}

function setPaths(artist_type){
		$('.artist').hide();
		let songs_str = '';
		if(!artist_type){
			songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '_' + year + '/';
			imgPath = 'img/' + lang + '_' + year + '/';
		} else {
			songs_str = lang + '_' + year + '_' + artist_type;
			audioPath = 'audio/' + lang + '_' + year + '_' + artist_type + '/';
			imgPath = 'img/' + lang + '_' + year + '_' + artist_type + '/';
		}
		songs = eval(songs_str);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}
		
function mode(num){
	$('.mode').hide();
	$('#mirror').hide();
	$('#song').show();
	/* if(num == 0){
		videoPath = 'video/ru/';
		songs = ru_clips;
		modeToggle = toggleVisible;
	} */
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	$('#song').hide();
	if(num == 0){
		audioPath = 'audio/eldo/';
		imgPath = 'img/eldo/';
		songs = eldo_songs;
	}
	if(num == 1){
		songs = ru_songs;
		modeToggle = togglePoster;
	}
	if(num == 2){
		$('#song').show();
		videoPath = 'video/clip/';
		modeToggle = toggleMute;
		setMedia = setVideo;
		rightAnswer = rightAnswer_EN;
	}
	if(num == 3){
		$('#song').show();
		videoPath = 'video/song/';
		modeToggle = toggleVisible;
		setMedia = setVideo;
		rightAnswer = rightAnswer_EN;
	}
	if(num == 4){
		audioPath = 'audio/2000/';
		imgPath = 'img/2000/';
		songs = songs_2000;
		finalMessage = finalMessage_00;
	}
	if(num == 5){
		audioPath = 'audio/ru_2007/';
		imgPath = 'img/ru_2007/';
		songs = ru_2007;
		finalMessage = finalMessage_00;
	}
	if(num == 6){
		audioPath = 'audio/en_2007/';
		imgPath = 'img/en_2007/';
		songs = en_2007;
		finalMessage = finalMessage_00;
	}
	if(num == 7){
		audioPath = 'audio/en_1940/';
		imgPath = 'img/en_1940/';
		songs = en_1940;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1940-х"!';
	}
	if(num == 8){
		audioPath = 'audio/en_1950/';
		imgPath = 'img/en_1950/';
		songs = en_1950;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1950-х"!';
	}
	if(num == 9){
		audioPath = 'audio/en_1960/';
		imgPath = 'img/en_1960/';
		songs = en_1960;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1960-х"!';
	}
	if(num == 10){
		year = '2010';
		$('#song').hide();
		$('.artist').show();
	}
	if(num == 11){
		audioPath = 'audio/en_2020/';
		imgPath = 'img/en_2020/';
		songs = en_2020;
		finalMessage = ' Ура! Вы освоили "Дискотеку 2020-х"!';
	}
	if(num == 12){
		audioPath = 'audio/ru_2020/';
		imgPath = 'img/ru_2020/';
		songs = ru_2020;
		finalMessage = ' Ура! Вы освоили "Дискотеку 2020-х"!';
	}
	if(num == 13){
		audioPath = 'audio/ru_2010/';
		imgPath = 'img/ru_2010/';
		songs = ru_2010;
		finalMessage = ' Ура! Вы освоили "Дискотеку 2010-х"!';
	}
	if(num == 14){
		audioPath = 'audio/sov/';
		imgPath = 'img/sov/';
		songs = sov;
		finalMessage = ' Ура! Вы освоили "Дискотеку СССР"!';
	}
	if(num == 15){
		audioPath = 'audio/en_1980/';
		imgPath = 'img/en_1980/';
		songs = en_1980;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1980-х"!';
	}
	if(num == 16){
		audioPath = 'audio/ru_1980/';
		imgPath = 'img/ru_1980/';
		songs = ru_1980;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1980-х"!';
	}
	if(num == 17){
		audioPath = 'audio/en_pop_1980/';
		imgPath = 'img/en_pop_1980/';
		songs = en_pop_1980;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1980-х"!';
	}
	if(num == 18){
		audioPath = 'audio/en_rock_1980/';
		imgPath = 'img/en_rock_1980/';
		songs = en_rock_1980;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1980-х"!';
	}
	if(num == 19){
		$('#song').hide();
		audioPath = 'audio/en_disco_1980/';
		imgPath = 'img/en_disco_1980/';
		songs = en_disco_1980;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1980-х"!';
	}
	if(num == 20){
		audioPath = 'audio/ru_rock_1980/';
		imgPath = 'img/ru_rock_1980/';
		songs = ru_rock_1980;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1980-х"!';
	}
	if(num == 21){
		audioPath = 'audio/ru_2000/';
		imgPath = 'img/ru_2000/';
		songs = ru_2000;
		finalMessage = ' Ура! Вы освоили "Дискотеку 2000-х"!';
	}
	if(num == 22){
		$('.settings').hide();
		lang='ru';
		year = 'kish';
		sec_per_turn = 60;
		$('#learn').html('Угадай песню КиШа');
		setPaths('gr');
	}
	if(isSingle){
		$('#total').html(songs.length);
	} else{
		$('#p1_total').html(songs.length/2);
		$('#p2_total').html(songs.length/2);
	}
	shuffle(songs);
	if(isTournement){
		prepareTournement();
	}
	toggleLearn();
}