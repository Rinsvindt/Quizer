let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let options;
let skill = '';
let rate = '';
let videoPath = 'video/clip/';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
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
	modeToggle();
	if(options[num-1] == songs[song_count].group){
		mirror_eval(rightAnswer(), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		levelup();
	} else {
		mirror_eval(rightAnswer(), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill+='<br/>' + songs[song_count].group + ',');
	}
	$('.blink').show();
}

function like(){
	let group = songs[song_count].shorten;
	if(!group) group = songs[song_count].group;
	if (!~rate.indexOf(group)){
		$('#rate').html(rate = '+ ' + group + ',<br/>' + rate);
	}
	$('.blink').hide();
	next();
}

function dislike(){
	let group = songs[song_count].shorten;
	if(!group) group = songs[song_count].group;
	if(!~rate.indexOf(group)){
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
		$('#song_count').html(song_count+1);
		$('.game_button').prop('disabled', true);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Вы правильно ответили: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=' Поздравляем! Вы освоили "Дискотеку 90-х"!'; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		mirror(song_count + 1 + ' песня:', 20, 'blue');
		toggle();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function levelup(){
	shuffle(states);
	$('#status').html(states[0] + songs[song_count].state);
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

function learn(){
	decolorOptions();
	modeToggle();
	toggle();
	randomAnswers();
	setMedia();
	count_down();
	mirror(song_count + 1 + ' песня:', 20, 'blue');
}

async function count_down(){
	start_count_down = true;
	while(start_count_down){
		await sleep(1000);
		$('#sec').html(new Intl.NumberFormat().format(sec+=1));
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
	answers = songs.map(item=>item.group);
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

// function nextPoster(){
	// poster_count++;
	// $('#album').attr("src", imgPath + poster_count + ".1.jpg");
	// $('#group').attr("src", imgPath + poster_count + ".2.jpg");
// }

function mode(num){
	$('#mode_0').hide();
	$('#mode_1').hide();
	$('#mode_2').hide();
	$('#mirror').hide();
	$('#song').show();
	/* if(num == 0){
		videoPath = 'video/ru/';
		songs = ru_clips;
		modeToggle = toggleVisible;
	} */
	if(num == 0){
		$('#song').hide();
		songs = ru_songs;
		modeToggle = togglePoster;
		setMedia = setAudio;
		rightAnswer = rightAnswer_RU;
	}
	if(num == 1){
		videoPath = 'video/clip/';
		modeToggle = toggleMute;
		setMedia = setVideo;
		rightAnswer = rightAnswer_EN;
	}
	if(num == 2){
		videoPath = 'video/song/';
		modeToggle = toggleVisible;
		setMedia = setVideo;
		rightAnswer = rightAnswer_EN;
	}
	$('#total').html(songs.length);
	shuffle(songs);
	toggle();
}

function load(){
	mirror('Русская музыка / Зарубужные клипы или песни', 10, 'blue');
}

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

let states = ["Знаток", "Специалист", "Профессионал", "Дока", "Гуру", "Профессор", "Мастер", 
			  "Эксперт", "Виртуоз", "Маэстро", "Эрудит", "Мастак", "Всезнайка"];