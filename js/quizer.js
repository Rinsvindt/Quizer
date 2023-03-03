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
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let options;
let skill = '';
let p1_skill = '';
let p2_skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
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
let withoutAnswers = false;
let isSingle = true;
let isP1Turn = true;
let isTournement = false;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(), 20, "green");
		$("#option_" + num).addClass("green");
		if(isSingle){
			correct++;
			if (!~rate.indexOf('+ ' + group)){
				$('#rate').html(rate = '+ ' + group + '<br/>' + rate);
			}
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
			$('#skill').html(skill = '<br/>- ' + group + skill);
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
			// $('.blink').show();
			next();
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

let lang_letter;

function learn(){
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	if(!alphabetMode){
		$('#mirror').hide();
	} else {
		if(minusMode){
			$('#mirror').show();
			mirror(songs[song_count].type, 10, 'blue');
		} else {
			$('#mirror').show();
			mirror(songs[song_count].type + ' на ' + lang_letter + ' букву ' + songs[song_count].letter, 10, 'blue');
		}
	}
}

async function sec_15(){
	if(audio.paused){
		// $('#sec_15').hide();
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
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

async function play_non_stop(time){
	for(let i = 0; i < songs.length; i++){
			$('#song_count').html(song_count+1);
			setAudio();
			$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
			mirror_eval(rightAnswer(), 20, "green");
			await sleep(time);
			song_count++;
		}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
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
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	// if(!isTournement){
		// answers = songs.map(item=>item.group);
	// }
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
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
		if(!songs[song_count].imgPath) {
			$('#artist').attr("src", imgPath + songs[song_count].id + ".jpg");
		} else {
			$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		}
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	createChartData();
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	mirror('Русская / Зарубежная музыка?', 10, 'blue');
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

let alphabetMode = false;
let minusMode = false;

function enableAlphabetMode(flag){
	withoutAnswers = flag.checked;
	alphabetMode = flag.checked;
}

function enableScore(flag){
	if(flag.checked == true){
         $('.score').show();
    }else{
         $('.score').hide();
   }
}

function disableAnswers(flag){
	withoutAnswers = flag.checked;
}

// EN songs

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
		group : 'Ink Spots',
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
		group : 'Beatles',
		song : "Hey Jude"
	},
	{
		id : 4,
		group : 'Bobby Lewis',
		song : "Tossin' and Turnin'"
	},
	{
		id : 5,
		group : 'Beatles',
		song : "I Want to Hold Your Hand"
	},
	{
		id : 6,
		group : 'Monkees',
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
		group : '5th Dimension',
		song : "Aquarius/Let the Sunshine In"
	},
	{
		id : 12,
		group : 'Zager and Evans',
		song : "In the Year 2525"
	}
];

const en_1980_gr_icon = [
	'pop_rock',
	'rock',
	'pop_medium',
	'pop_hard',
	'pop_very_hard',
	'disco'
];

const EN_1980_GR_PACK_1 = 1;
const EN_1980_GR_PACK_2 = 2;
const EN_1980_GR_PACK_3 = 4;
const EN_1980_GR_PACK_4 = 3;
const EN_1980_GR_PACK_5 = 5;
const EN_1980_GR_PACK_6 = 6;

let en_1980_gr = [
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "You Give Love A Bad Name"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "Livin' On A Prayer"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Survivor',
		song : "Burning Heart"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Survivor',
		song : "Eye Of The Tiger"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Twisted Sister',
		song : "We're Not Gonna Take It"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "Heaven's On Fire"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Clash",
		song : "Should I Stay or Should I Go"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Clash",
		song : "Rock the Casbah"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Duran Duran",
		song : "Rio"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Duran Duran",
		song : "A View to a Kill"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Duran Duran",
		song : "The Reflex"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "U2",
		song : "I Still Haven't Found What I'm Looking For"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "U2",
		song : "With Or Without You"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "REM",
		song : "Orange Crush"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "Call Me"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "The Tide Is High"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "Rapture"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "Atomic"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Roxette",
		song : "Listen To Your Heart"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Close To Me"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "INXS",
		song : "Devil Inside"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "Wanted Dead Or Alive"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "Bed Of Roses"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Solid Rock"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Brothers In Arms"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Money For Nothing"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Sultans Of Swing"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "So Far Away"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Twisted Sister',
		song : "I Wanna Rock"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Duran Duran",
		song : "Hungry Like The Wolf"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "U2",
		song : "Sunday Bloody Sunday"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "One Way Or Another"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Lullaby"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Friday I'm In Love"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Just Like Heaven"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Boys Don't Cry"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Lovesong"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "A Forest"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "INXS",
		song : "Never Tear Us Apart"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "INXS",
		song : "Need You Tonight"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Crowded House",
		song : "Don't Dream It's Over"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "I Was Made for Loving You"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "Rock And Roll All Nite"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "REM",
		song : "Its The End Of The World As We Know It (And I Feel Fine)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "REM",
		song : "The One I Love"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Scorpions',
		song : "Rock You Like a Hurricane"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Def Leppard',
		song : "Pour Some Sugar on Me"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Master Of Puppets"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Seek & Destroy"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Iron Maiden',
		song : "The Trooper"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Sweet Child O' Mine"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Mr. Brownstone"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Welcome To The Jungle"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'ACDC',
		song : "Hells Bells"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'ACDC',
		song : "You Shook Me All Night Long"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Judas Priest',
		song : "Breaking the Law"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Anthrax',
		song : "A.I.R."
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Pink Floyd",
		song : "Another Brick In The Wall, Pt. 2"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Alice Cooper",
		song : "Bed of Nails"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Whitesnake",
		song : "Here I Go Again"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Lightning Strikes"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Let The Music Do The Talking"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Walk This Way"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Dude (Looks Like A Lady)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Rag Doll"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Angel"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Janie's Got A Gun"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Love In An Elevator"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "What It Takes"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Monkey On My Back"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Whitesnake",
		song : "Is this love"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Rolling Stones',
		song : "Start Me Up"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Battery"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Fade To Black"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Iron Maiden',
		song : "Run To The Hills"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Iron Maiden',
		song : "2 Minutes To Midnight"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Paradise City"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Knockin' On Heaven's Door"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'ACDC',
		song : "Back In Black"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Alice Cooper",
		song : "Poison"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "A Kind Of Magic"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Crazy Little Thing Called Love"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Another One Bites The Dust"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Under Pressure (ft David Bowie)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Wo Wants To Live Forever"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "I Want It All"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "One Vision"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Fat Bottomed Girls"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "ZZ Top",
		song : "Sharp Dressed Man"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "ZZ Top",
		song : "Gimme All Your Lovin'"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Dio",
		song : "Rainbow In The Dark"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Every Breath You Take"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Roxanne"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Message In A Bottle"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Don't Stand So Close To Me"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Walking On The Moon"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Can't Stand Losing You"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "So Lonely"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "De Do Do Do, De Da Da Da"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Every Little Thing She Does Is Magic"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'New Order',
		song : "Blue Monday"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'New Order',
		song : "Age Of Consent"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Toto',
		song : "Africa"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Van Halen',
		song : "Jump"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'UB40',
		song : "Red Red Wine"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Wham',
		song : "Wake Me Up Before You Go-Go"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Wham',
		song : "Young Guns (Go For It!)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Genesis',
		song : "Land Of Confusion"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Flock Of Seagulls',
		song : "I Ran"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Private Eyes"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Maneater"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Kiss on My List"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "I Can't Go For That (No Can Do)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Out of Touch"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Soul II Soul',
		song : "Back to Life (ft Caron Wheeler)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Men At Work',
		song : "Down Under"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Men At Work',
		song : "Who Can It Be Now?"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Beach Boys',
		song : "Wipeout (ft Fat Boys)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Simple Minds',
		song : "Don't You"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Everybody Wants to Rule the World"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Shout"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Bangles',
		song : "Walk Like an Egyptian"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Bangles',
		song : "Manic Monday"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Go-Go's",
		song : "Vacation"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Eurythmix",
		song : "Sweet Dreams"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Eurythmix",
		song : "Love Is a Stranger"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Outfield",
		song : "Your Love"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Earth Wind & Fire",
		song : "Let's Groove"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Europe",
		song : "The Final Countdown"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Europe",
		song : "Carrie"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Genesis",
		song : "In Too Deep"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Genesis",
		song : "Invisible touch"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Genesis",
		song : "Misunderstanding"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Genesis",
		song : "That’s all"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Flock Of Seagulls",
		song : "Wishing (If I Had A Photograph Of You)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Mad world"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Head Over Heels"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Men At Work',
		song : "It’s a mistake"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'UB40',
		song : "I'll Be Your Baby Tonight (ft Robert Palmer)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'UB40',
		song : "Kingston Town"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Eurythmix',
		song : "There must be an angel"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Wham',
		song : "Everything She Wants"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Yazoo',
		song : "Don't Go"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Yazoo',
		song : "Only You"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Black',
		song : "Wonderful Life"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Kool & The Gang',
		song : "Celebration"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Run-DMC',
		song : "It's Like That"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'NWA',
		song : "Gangsta Gangsta"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Mr Mister",
		song : "Broken Wings"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Technotronic',
		song : "Pump Up The Jam"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Swing Out Sister',
		song : "Breakout"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Journey',
		song : "Don't Stop Believin'"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Real Life',
		song : "Send Me An Angel"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Naked Eyes',
		song : "Always Something There To Remind Me"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "ABC",
		song : "When Smokey Sings"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "KC & The Sunshine Band",
		song : "Please Don't Go"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Rob Base & DJ E-Z Rock",
		song : "It Takes Two"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Starship",
		song : "We Built This City"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'My Mine',
		song : "Hypnotic Tango"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Soultans",
		song : "Cant Take My Hands Off You"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Captain & Tennille",
		song : "Do That To Me One More Time"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'KING',
		song : "Love and Pride"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "REO Speedwagon",
		song : "Keep on Loving You"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "REO Speedwagon",
		song : "Can't Fight This Feeling"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Soft Cell',
		song : "Tainted Love"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Cutting Crew',
		song : "I Just Died in Your Arms Tonight"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'A-Ha',
		song : "Take On Me"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Lipps Inc',
		song : "Funkytown"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Culture Club',
		song : "Karma Chameleon"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Foreigner',
		song : "I Want To Know What Love Is"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Foreigner',
		song : "Urgent"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Level 42',
		song : "Lessons In Love"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Pointer Sisters',
		song : "I'm So Excited"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Ultravox',
		song : "Dancing With Tears In My Eyes"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Bronski Beat',
		song : "Smalltown Boy"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "A La Carte",
		song : "Ring Me Honey"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Opus",
		song : "Life Is Life"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Digital Emotion",
		song : "Get Up Action"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Digital Emotion",
		song : "Go Go Yellow Screen"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Baccara",
		song : "Yes Sir, I Can Boogie"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Baccara",
		song : "Sorry, I'm a Lady"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Blue System",
		song : "My Bed Is Too Big"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "London Boys",
		song : "London Nights"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Al Bano & Romina Power",
		song : "Al ritmo di beguine (ti amo)"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Al Bano & Romina Power",
		song : "Its Forever"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Al Bano & Romina Power",
		song : "Felicita"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Al Bano & Romina Power",
		song : "Liberta"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Al Bano & Romina Power",
		song : "Cisara"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Goombay Dance Band",
		song : "Seven Tears"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Ricchi E Poveri",
		song : "Mamma Maria"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Ricchi E Poveri",
		song : "Hasta La Vista"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Ricchi E Poveri",
		song : "Sarà perchè ti amo"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Ricchi E Poveri",
		song : "Piccolo Amore"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Ricchi E Poveri",
		song : "Voulez-Vous Danser"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Ricchi E Poveri",
		song : "Se M'innamoro"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Baby's Gang",
		song : "Challenger"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Righeira",
		song : "Vamos A La Playa"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "ELO (Electric Light Orchestra)",
		song : "Don't Bring Me Down"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "ELO (Electric Light Orchestra)",
		song : "Here Is The News"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "ELO (Electric Light Orchestra)",
		song : "Ticket To The Moon"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Spandau Ballet",
		song : "True"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Spandau Ballet",
		song : "To Cut A Long Story Short"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Berlin",
		song : "Take My Breath Away"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Laid back",
		song : "Sunshine reggae"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Laid back",
		song : "Bakerman"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : "Laid back",
		song : "Elevator Boy"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Culture Club',
		song : "Do You Really Want to Hurt Me"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Yazz',
		song : "The Only Way Is Up (ft The Plastic Population)"
	},
	{
		pack : EN_1980_GR_PACK_6,
		group : 'Chicago',
		song : "Hard To Say I'M Sorry"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Bangles',
		song : "Eternal Flame"
	}
];

let en_1980_gr_1 =	en_1980_gr.filter(item => item.pack == 1);
let en_1980_gr_2 =	en_1980_gr.filter(item => item.pack == 2);
let en_1980_gr_3 =	en_1980_gr.filter(item => item.pack == 3);
let en_1980_gr_4 =	en_1980_gr.filter(item => item.pack == 4);
let en_1980_gr_5 =	en_1980_gr.filter(item => item.pack == 5);
let en_1980_gr_6 =	en_1980_gr.filter(item => item.pack == 6);

const en_1980_m_icon = [
	'easy',
	'medium',
	'hard',
	'disco',
	'italo_disco'
];

const EN_1980_M_PACK_1 = 1;
const EN_1980_M_PACK_2 = 4;
const EN_1980_M_PACK_3 = 2;
const EN_1980_M_PACK_4 = 3;
const EN_1980_M_PACK_5 = 5;

let en_1980_m = [
	{
		pack : EN_1980_M_PACK_1,
		group : 'Bruce Springsteen',
		song : "Dancing In the Dark"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Bruce Springsteen',
		song : "Born in the U.S.A."
	},
	{
		pack : EN_1980_M_PACK_3,
		group : 'Richard Marx',
		song : "Right Here Waiting"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : 'Willie Nelson',
		song : "Always On My Mind"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Roy Orbison",
		song : "You Got It"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : 'Stevie Wonder',
		song : "Ebony And Ivory (ft Paul McCartney)"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : 'Bob Marley',
		song : "Redemption Song (ft The Wailers)"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : 'Bob Marley',
		song : "Could You be Loved (ft The Wailers)"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : 'Willie Nelson',
		song : "Seven Spanish Angels (ft Ray Charles)"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Bobby McFerrin",
		song : "Dont Worry, Be Happy"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Bobby Brown",
		song : "My Prerogative"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Nik Kershaw",
		song : "I Won't Let The Sun Go Down On Me"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Nik Kershaw",
		song : "The Riddle"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Bryan Adams",
		song : "Summer Of '69"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Phil Collins",
		song : "In The Air Tonight"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Phil Collins",
		song : "Against All Odds (Take A Look At Me Now)"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Phil Collins",
		song : "One More Night"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Bryan Adams",
		song : "Heaven"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Bruce Springsteen',
		song : "I'm on Fire"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : 'Stevie Wonder',
		song : "Master Blaster (Jammin')"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : 'Stevie Wonder',
		song : "I Just Called To Say I Love You"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Lionel Richie",
		song : "Truly"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Lionel Richie",
		song : "All Night Long (All Night)"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Lionel Richie",
		song : "Hello"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Phil Collins",
		song : "Easy Lover (ft Philip Bailey)"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Phil Collins",
		song : "Another Day In Paradise"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Norman",
		song : "Stumblin' In"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Lionel Richie",
		song : "Endless Love (ft Diana Ross)"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Joel",
		song : "A matter of trust"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Joel",
		song : "Allentown"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Joel",
		song : "It’s still rock and roll to me"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Joel",
		song : "Uptown girl"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Joel",
		song : "Tell her about it"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Bryan Ferry",
		song : "Don’t stop the dance"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris De Burgh",
		song : "Missing you"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Isaak",
		song : "Wicked game"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Norman",
		song : "Hunters of the Night"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Norman",
		song : "Midnight lady"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Norman",
		song : "Some hearts are diamonds"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Rea",
		song : "Looking for the summer"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Chris Rea",
		song : "The road to hell"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "George Michael",
		song : "Faith"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "George Michael",
		song : "Careless Whisper"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "George Harrison",
		song : "Got My Mind Set On You"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Joe Esposito",
		song : "You're The Best Around"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Joe Cocker",
		song : "Unchain my heart"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Joe Cocker",
		song : "Up where we belong"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Lionel Richie",
		song : "Say you. say me"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Leonard Cohen",
		song : "Hallelujah"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Paul McCartney",
		song : "Coming up"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Paul McCartney",
		song : "Say Say Say (ft Michael Jackson)"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Phil Collins",
		song : "Sussudio"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Rick Astley',
		song : "Never Gonna Give You Up"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Rick Astley',
		song : "Together Forever"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "USSR"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "Hey Senorita"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "Bang Bang Baby"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "Meet My Friend"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "Love For Russia (Ruble Version)"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "Up And Down"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : 'Eddy Huntington',
		song : "Honey, Honey!"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Jermaine Jackson",
		song : "When the Rain Begins to Fall (ft Pia Zadora)"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Savage",
		song : "Goodbye"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Savage",
		song : "Only You"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Savage",
		song : "Don'T Cry Tonight"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Savage",
		song : "Fugitive"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Savage",
		song : "Radio"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Mozzart",
		song : "Jasmin China Girl"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Gazebo",
		song : "I Like Chopin"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "Gazebo",
		song : "Masterpiece"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Detto Mariano",
		song : "La pigiatura (ft Clown, Patrizia Tapparelli)"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Adriano Celentano",
		song : "Uh Uh"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Adriano Celentano",
		song : "Pay - Pay - Pay"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Adriano Celentano",
		song : "Soli"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Adriano Celentano",
		song : "Susanna"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Adriano Celentano",
		song : "Azzurro"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Adriano Celentano",
		song : "Stivali E Colbacco"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Toto Cutugno",
		song : "Serenata"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Toto Cutugno",
		song : "L'italiano"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Toto Cutugno",
		song : "La Mia Musica"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Toto Cutugno",
		song : "Solo Noi"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Toto Cutugno",
		song : "Donna Donna Mia"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Toto Cutugno",
		song : "Enamorados"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "FRDavid",
		song : "Words"
	},
	{
		pack : EN_1980_M_PACK_2,
		group : "FRDavid",
		song : "Pick Up the Phone"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Michael Jackson',
		song : "Billie Jean"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Michael Jackson',
		song : "Beat It"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Michael Jackson',
		song : "Smooth Criminal"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Michael Jackson',
		song : "Thriller"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : 'Michael Jackson',
		song : "Rock with You"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : 'Morrissey',
		song : "Everyday Is Like Sunday"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Kenny Loggins",
		song : "Footloose"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : 'George Thorogood',
		song : "Bad To The Bone"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : 'Ozzy Osbourne',
		song : "Crazy Train"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : 'Danzig',
		song : "Mother"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Prince",
		song : "When Doves Cry"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Prince",
		song : "Let's Go Crazy (ft The Revolution)"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Prince",
		song : "Purple Rain"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Prince",
		song : "Raspberry Beret"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Freddie Mercury",
		song : "Living on my own"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Freddie Mercury",
		song : "The great pretender"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Rupert Holmes",
		song : "Escape (The Pina Colada Song)"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Christopher Cross",
		song : "Sailing"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Christopher Cross",
		song : "Arthur's Theme (Best That You Can Do)"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Kenny Rogers",
		song : "Lady"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Kenny Rogers",
		song : "Islands In The Stream"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "John Lennon",
		song : "(Just Like) Starting Over"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "John Lennon",
		song : "Woman"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Elton John",
		song : "Sacrifice"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Elton John",
		song : "A Word In Spanish"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Elton John",
		song : "Candle In The Wind"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Elton John",
		song : "I'm Still Standing"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Rick Springfield",
		song : "Jessie's Girl"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Vangelis",
		song : "Chariots Of Fire"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "John Waite",
		song : "Missing You"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Marvin Gaye",
		song : "Sexual Healing"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Tom Petty",
		song : "Free Fallin'"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Tom Petty",
		song : "I Won't Back Down"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Tom Petty",
		song : "American Girl (ft The Heartbreakers)"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Howard Jones",
		song : "What Is Love?"
	},
	{
		pack : EN_1980_M_PACK_4,
		group : "Dave Stewart",
		song : "Lily Was Here (ft Candy Dulfer)"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Sting",
		song : "Englishman In New York"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Sting",
		song : "Fields Of Gold"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Sting",
		song : "Fragile"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Idol",
		song : "Rebel Yell"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Idol",
		song : "Dancing With Myself"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Idol",
		song : "White Wedding"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Billy Idol",
		song : "Eyes Without A Face"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "Changes"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "Starman"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "Let's Dance"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "Ashes To Ashes"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "The Man Who Sold The World"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "China Girl"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "David Bowie",
		song : "Modern Love"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Pupo",
		song : "Gelato al cioccolato"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Pupo",
		song : "Burattino Telecomandato"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Pupo",
		song : "Su Di Noi"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Pupo",
		song : "Lo Devo Solo A Te"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Riccardo Fogli",
		song : "Malinconia"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Riccardo Fogli",
		song : "Storie di tutti i giorni"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Riccardo Fogli",
		song : "Storie di tutti i giorni"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Umberto Tozzi",
		song : "Tu"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Umberto Tozzi",
		song : "Ti amo"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Eros Ramazotti",
		song : "Ad un amico"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Eros Ramazotti",
		song : "Terra promessa"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Eros Ramazotti",
		song : "Una storia importante"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Eros Ramazotti",
		song : "Adesso tu"
	},
	{
		pack : EN_1980_M_PACK_5,
		group : "Eros Ramazotti",
		song : "La Luce Buona Delle Stelle"
	},
	{
		pack : EN_1980_M_PACK_3,
		group : "Bryan Ferry",
		song : "Slave To Love"
	},
	{
		pack : EN_1980_M_PACK_1,
		group : "Taco",
		song : "Puttin’ On The Ritz"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Rocky M',
		song : "Disco Lady"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Rocky M',
		song : "Fly with Me to Wonderland"
	}
];

let en_1980_m_1 =	en_1980_m.filter(item => item.pack == 1);
let en_1980_m_2 =	en_1980_m.filter(item => item.pack == 2);
let en_1980_m_3 =	en_1980_m.filter(item => item.pack == 3);
let en_1980_m_4 =	en_1980_m.filter(item => item.pack == 4);
let en_1980_m_5 =	en_1980_m.filter(item => item.pack == 5);

const en_1980_f_icon = [
	'pop',
	'disco'
];

const EN_1980_F_PACK_1 = 1;
const EN_1980_F_PACK_2 = 2;

let en_1980_f = [
	{
		pack : EN_1980_F_PACK_1,
		group : 'Madonna',
		song : "Like A Virgin"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Madonna',
		song : "Material Girl"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Madonna',
		song : "Borderline"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Madonna',
		song : "Lucky Star"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Madonna',
		song : "Crazy for You"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Dolly Parton',
		song : "9 to 5"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Janet Jackson',
		song : "When I Think Of You"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : 'Tracy Chapman',
		song : "Fast Car"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : "Jennifer Warnes",
		song : "(I've Had) The Time of My Life (ft Bill Medley)"
	},
	{
		pack : EN_1980_F_PACK_1,
		group : "Joan Jett",
		song : "I Love Rock 'N' Roll (ft The Blackhearts)"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : 'Nena',
		song : "99 Red Baloons"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Stop For A Minute"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "One More Night"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "In The Heat Of The Night"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Maria Magdalena"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Don't Cry"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Heaven Can Wait"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Moscow Nights"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Secret Land"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sandra",
		song : "Around My Heart"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Sabrina",
		song : "Boys Boys Boys"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Laura Branigan",
		song : "Gloria"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Laura Branigan",
		song : "Self Control"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Kim Wilde",
		song : "You Keep Me Hangin' On"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Kim Wilde",
		song : "Cambodia"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Kim Wilde",
		song : "Kids In America"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Samantha Fox",
		song : "Touch Me (I Want Your Body)"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Samantha Fox",
		song : "I Only Wanna Be With You"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Belinda Carlisle",
		song : "Circle In The Sand"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Belinda Carlisle",
		song : "Leave A Light On"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Belinda Carlisle",
		song : "Heaven Is A Place On Earth"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Bonnie Tyler",
		song : "Total Eclipse of the Heart"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Bonnie Tyler",
		song : "Holding Out for a Hero"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Bonnie Tyler",
		song : "It's a Heartache"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Donna Summer",
		song : "I Feel Love"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Donna Summer",
		song : "Love To Love You Baby"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Donna Summer",
		song : "Hot Stuff"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Raffaella Carra",
		song : "Pedro"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Olivia Newton-John",
		song : "Magic"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Olivia Newton-John",
		song : "Physical"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Diana Ross",
		song : "Upside Down"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Irene Cara",
		song : "Flashdance... What a Feeling"
	},
	{
		pack : EN_1980_F_PACK_2,
		group : "Irene Cara",
		song : "Fame"
	}
];

let en_1980_f_1 =	en_1980_f.filter(item => item.pack == 1);
let en_1980_f_2 =	en_1980_f.filter(item => item.pack == 2);

const en_1990_gr_icon = [
	'rock_medium',
	'rock_hard',
	'pop_medium',
	'pop_hard',
	'pop_very_hard',
	'womens_vocals',
	'eurodance'
];

const EN_1990_GR_PACK_1 = 1;
const EN_1990_GR_PACK_2 = 2;
const EN_1990_GR_PACK_3 = 3;
const EN_1990_GR_PACK_4 = 4;
const EN_1990_GR_PACK_5 = 6;
const EN_1990_GR_PACK_6 = 7;
const EN_1990_GR_PACK_7 = 5;

let en_1990_gr = [
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Hole In My Soul"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Pink"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Walk This Way"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Longview"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Basket Case"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "When I Come Around"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "J.A.R."
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Brain Stew"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Good Riddance"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Redundant"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Minority"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Warning"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Hitchin' A Ride"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Why Don't You Get A Job"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "The Kids Aren't Alright"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Original Prankster"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Come Out and Play"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Self Esteem"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "All I Want"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Gone Away"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Pretty Fly"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "You Could Be Mine"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "Don't Cry"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "November Rain"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "Knockin' On Heaven's Door"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "Sympathy For The Devil"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Thunderstuck"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Moneytalks"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Are You Ready"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Highway to Hell"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Big Gun"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Hard as a Rock"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Give It Away"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Under The Bridge"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Soul To Squeeze"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Warped"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "My Friends"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Scar Tissue"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Otherside"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Californication"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Road Trippin'"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "I Don't Want to Miss a Thing"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Livin' on the Edge"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Eat The Rich"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Cryin'"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Crazy"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Amazing"
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Falling In Love"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Loosing My Religion"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Everybody Hurts"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Shiny Happy People"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Wonderwall"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "D'You Know What I Mean?"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Don't Look Back In Anger"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Champagne Supernova"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Live Forever"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Blaze Of Glory"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Always"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Bed Of Roses"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "One"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "I Think I'm Paranoid"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "Only Happy When It Rains"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "#1 Crush"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "Push It"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "You Look So Fine"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "Stupid Girl"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "The Fly"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Mysterious Ways"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Even Better Than The Real Thing"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Stay (Faraway, So Close!)"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Hold Me, Thrill Me, Kiss Me, Kill Me"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Discotheque"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Staring At The Sun"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Sweetest Thing"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Beautiful Day"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Blink 182',
			song : "Dammit"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Blink 182',
			song : "What's My Age Again?"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Blink 182',
			song : "All The Small Things"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Blink 182',
			song : "Adam's Song"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Blink 182',
			song : "Man Overboard"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Man On The Moon"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Queen',
			song : "Made In Heaven"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Chumbawamba',
			song : "Tubthumping"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Soundgarden',
			song : "Black Hole Sun"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Nazareth',
			song : "Cocaine"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Goo Goo Dolls',
			song : "Iris"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Goo Goo Dolls',
			song : "Slide"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Soundgarden',
			song : "Spoonman"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Soundgarden',
			song : "Fell On Black Days"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Drive"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Urge Overkill',
			song : "Girl, You'll Be A Woman Soon"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "My Head's In Mississippi"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Doubleback"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Concrete And Steel"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Give It Up"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Viva Las Vegas"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Pincushion"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Massive Attack',
			song : "Unfinished Sympathy"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Massive Attack',
			song : "Teardrop"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "Insane In The Brain"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "Hits from the Bong"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "How I Could Just Kill a Man"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "Tequila Sunrise"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "I Wanna Get High"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Suicide Blonde"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Disappear"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "By My Side"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Bitter Tears"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Shining Star"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Taste It"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "All Around"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Baby Dont Cry"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "The Strangest Party"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Deliver Me"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "Monkey Wrench"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "Everlong"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Jamiroquai',
			song : "Virtual Insanity"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Moloko',
			song : "Sing in Back"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Beloved',
			song : 'Sweet harmony',
			state: ' по Белавд'
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fugees',
			song : "Killing Me Softly"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Kriss Kross',
			song : "Jump"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Reamonn',
			song : "Supergirl"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Extreme',
			song : "More Than Words"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fools Garden',
			song : "Lemon Tree"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Duran Duran',
			song : "Ordinary World"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Duran Duran',
			song : "Come Undone"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Texas',
			song : "Summer Son"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'UB40',
			song : "I Can't Help Falling In Love With You"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'No Mercy',
			song : "Where Do You Go"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Wet Wet Wet',
			song : "Love Is All Around"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Tears For Fears',
			song : "Break It Down Again"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fugees',
			song : "Ready Or Not"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fools Garden',
			song : "Probably"
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'TLC',
			song : "No Scrubs"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Ten Sharp',
			song : "You"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Soul Asylum',
			song : "Runaway Train"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Boyz II Men',
			song : "I'll Make Love To You"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Boyz II Men',
			song : "End Of The Road"
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'TLC',
			song : "Waterfalls"
		},		
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Mike + The Mechanics',
			song : "Over My Shoulder"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Mike + The Mechanics',
			song : "Another Cup of Coffee"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Hanson',
			song : "MMMBop"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'White Town',
			song : "Your Woman"
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : '4 Non Blondes',
			song : "What's Up?"
		},		
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Touch & Go',
			song : "Would You...?"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Touch & Go',
			song : "Tango In Harlem"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Pretenders',
			song : "I'll Stand by You"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Sixpence None The Richer',
			song : "Kiss Me"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Everything But The Girl',
			song : "Missing"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Genesis',
			song : "I Can't Dance"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Genesis',
			song : "No Son Of Mine"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Lightning Seeds',
			song : "You Showed Me"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Vaya Con Dios',
			song : "What's a Woman"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Vaya Con Dios',
			song : "Nah Neh Nah"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Mr Big',
			song : "Wild World"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Lighthouse Family',
			song : "Ain't No Sunshine"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "Enjoy The Silence"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "Policy Of Truth"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "World In My Eyes"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "It's No Good"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Girls And Boys"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Country House"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "The Universal"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Beetlebum"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Song 2"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Tender"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Too Much"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Wannabe"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Say You'll Be There"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Move Over"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "Bitter Sweet Symphony"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "Do You Believe"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "My Favourite Game"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "Erase / Rewind"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "Lovefool"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "NSYNC",
			song : "Bye Bye Bye"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "NSYNC",
			song : "It's Gonna Be Me"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cranberries',
			song : "Zombie"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cranberries',
			song : "Dreams"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cranberries',
			song : "Linger"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cranberries',
			song : "Ode To My Family"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'No Doubt',
			song : "Just A Girl"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'No Doubt',
			song : "Don't Speak"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Do What You Like"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "A Million Love Songs"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "I Found Heaven"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Could It Be Magic"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Back for Good"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Pray"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Relight My Fire"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Everything Changes"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Babe"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Slam Dunk (Da Funk)"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "When the Lights Go Out"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Got the Feelin'"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Everybody Get Up"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Until the Time Is Through"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Invincible"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Don't Wanna Let You Go"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "The Drugs Don't Work"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "Lucky Man"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "Sonnet"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Paradisio',
			song : "Bailando"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Paradisio',
			song : "Vamos a la Discoteca"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "Can You Feel It (feat. The Mad Stuntman)"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "Go On Move (ft The Mad Stuntman)"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "I Like to Move It (ft The Mad Stuntman)"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "The New Anthem (ft Erick Moore)"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Blue (Da Ba Dee)"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Move Your Body"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Crazy Town',
			song : "Butterfly"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "The Power"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "Believe In It"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "Oops Up"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "Rhythm Is A Dancer"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Capella',
			song : "U Got 2 Let The Music"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Urban Cookie Collective',
			song : "High On A Happy Vibe"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'CoRo',
			song : "Because the Night (ft Taleesa)"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'New Order',
			song : "World In Motion"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Culture Beat',
			song : "Mr. Vain"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Culture Beat',
			song : "Anything"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Antique',
			song : "Opa Opa"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "No Limit"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Let The Beat Control Your Body"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Dream a Dream"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "The Rhythm of the Night"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Masterboy',
			song : "Feel the Heat of the Night"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'EMF',
			song : "Unbelievable"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Pharao',
			song : "There Is A Star"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Pharao',
			song : "I Show You Secrets"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Pharao',
			song : "Gold In The Pyramid"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Inner Circle',
			song : "Sweat (A La La La La Song)"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Smash Mouth',
			song : "All Star"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Smash Mouth',
			song : "I'm A Believer"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Yaki-Da',
			song : "I Saw You Dancing"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Yaki-Da',
			song : "Just a Dream"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Sade',
			song : "No Ordinary Love"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Domino',
			song : "Baila baila conmigo"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Real McCoy',
			song : "Another Night"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'New Order',
			song : "Regret"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Back in Time"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Too Much Of Heaven"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Get Up"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Together and Forever"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Only You"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Soldier Soldier"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Captain Jack"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Little Boy"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Drill Instructor"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Holiday"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Sash',
			song : "Equador"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Sash',
			song : "Adelante"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Dub I Dub"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Let The Love Go On"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Baby Boy"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Secret Garden"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "Learn to Fly"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "My Hero"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "Big Me"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Inner Circle',
			song : "Bad Boys"
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Cue',
			song : "Hello"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "Touch"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "Move Me"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "The Promise Man"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "Leave It Behind"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "The Ride"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "Shame"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Get Ready For This"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Keep The Faith"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Someday I'll Be Saturday Night"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "This Ain't A Love Song"
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Real Love"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "Baby Baby"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "I Don’t Wanna Be A Star"
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "Try Me Out"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Twilight Zone"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Tribal Dance"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Portishead',
			song : "Numb"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Portishead',
			song : "Sour Times"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Portishead',
			song : "Glory Box"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Portishead',
			song : "All Mine"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Portishead',
			song : "Over"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Portishead',
			song : "Only You"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'L7',
			song : "Drama"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'L7',
			song : "Off the Wagon"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "Open Your Eyes"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "Rain"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "Lords Of The Boards"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "Don't You Turn Your Back On Me"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "Big in Japan"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "No Speech"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Guano Apes',
			song : "Living in a Lie"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Brooklyn Bounce',
			song : "Bass, Beats & Melody"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Brooklyn Bounce',
			song : "Get Ready to Bounce"
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Brooklyn Bounce',
			song : "Take a Ride"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'NSYNC',
			song : "Tearing up my heart"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "Chained to You"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "All Around Me"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "Violet"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "Crash and Burn"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "The Animal Song"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "Break Me Shake Me"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Common People"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Disco 2000"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Mis-Shapes"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Help The Aged"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "This Is Hardcore"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'UB40',
			song : "Kingston Town"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'East 17',
			song : "Deep"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'East 17',
			song : "Stay Another Day"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'East 17',
			song : "Hey Child"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : 'I Knew I Loved You'
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "We've Got It Goin' On"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "I'll never break your heart"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "Larger than life"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "I want it that way"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Pearl Jam',
			song : "Alive"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Pearl Jam',
			song : "Jeremy"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Pearl Jam',
			song : "Black"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Alice In Chains',
			song : "Would?"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Alice In Chains',
			song : "Man in the Box"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Alice In Chains',
			song : "Down in a Hole"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "Bomfunk MCs",
			song : "Rocking, Just To Make Ya Move"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "Bomfunk MCs",
			song : "Uprocking Beats"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "Bomfunk MCs",
			song : "B-Boys & Flygirls"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Digital Underground",
			song : "The Humpty Dance"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Digital Underground",
			song : "Kiss You Back"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Black Box",
			song : "Everybody Everybody"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Black Box",
			song : "Strike It Up"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "New Radicals",
			song : "You Get What You Give"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "New Radicals",
			song : "Someday We’ll Know"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : "Semisonic",
			song : "Singing in My Sleep"
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : "Semisonic",
			song : "Secret Smile"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Faithless",
			song : "Insomnia"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Faithless",
			song : "Salva Mea"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Faithless",
			song : "God Is a DJ"
		}
];

let en_1990_gr_1 =	en_1990_gr.filter(item => item.pack == 1);
let en_1990_gr_2 =	en_1990_gr.filter(item => item.pack == 2);
let en_1990_gr_3 =	en_1990_gr.filter(item => item.pack == 3);
let en_1990_gr_4 =	en_1990_gr.filter(item => item.pack == 4);
let en_1990_gr_5 =	en_1990_gr.filter(item => item.pack == 5);
let en_1990_gr_6 =	en_1990_gr.filter(item => item.pack == 6);

const en_1990_m_icon = [
	'easy',
	'medium',
	'hard'
];

const EN_1990_M_PACK_1 = 1;
const EN_1990_M_PACK_2 = 2;
const EN_1990_M_PACK_3 = 3;

let en_1990_m = [
		{
			pack : EN_1990_M_PACK_1,
			group : 'Sin With Sebastian',
			song : "Shut Up (And Sleep With Me)"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robert Miles',
			song : "One And One"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Coolio',
			song : "Gangsta's Paradise (ft LV)"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robert Miles',
			song : "Children"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Will Smith',
			song : "Men in black"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Enrique Iglesias',
			song : "Bailamos"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Bruce Springsteen',
			song : "Streets of Philadelphia"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Seal',
			song : "Kiss From A Rose"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Eagle-Eye Cherry',
			song : "Save Tonight"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Eagle-Eye Cherry',
			song : "Indecision"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Haddaway',
			song : "What Is Love?"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Haddaway',
			song : "Life"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Haddaway',
			song : "I Miss You"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Haddaway',
			song : "What About Me"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Fatboy Slim',
			song : "The Rockafeller Skank"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Michael Bolton',
			song : "Can I Touch You...There?"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Lenny Kravitz',
			song : "Fly Away"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Joe Cocker',
			song : "N'Oubliez Jamais"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Paul McCartney',
			song : "Hope Of Deliverance"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Marc Anthony',
			song : "When I Dream At Night"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Maxi Priest',
			song : "Close To You"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Snoop Dogg',
			song : "Jin & Guice"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Chris Isaak',
			song : "Somebody's Crying"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Tom Petty',
			song : "Mary Jane's Last Dance (ft The Heartbreakers)"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Chris Rea',
			song : "The Blue Cafe"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Ronan Keating',
			song : "When You Say Nothing At All"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'David Gray',
			song : "Sail Away"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'George Michael',
			song : "The Strangest Thing"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : '2Pac',
			song : "California Love (ft Dr. Dre, Roger Troutman)"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Vanilla Ice',
			song : "Ice Ice Baby"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'MC Hammer',
			song : "U Can't Touch This"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Guru Josh',
			song : "Infinity"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Dr Alban',
			song : "It's My Life"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Dr Alban',
			song : "Let The Beat Go On"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Alex Christensen',
			song : "Du hast den schönsten Arsch der Welt"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Snow',
			song : "Informer"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Ini Kamoze',
			song : "Here Comes the Hotstepper"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Scatman John',
			song : "Scatman"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Scatman John',
			song : "Scatman's World"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'George Michael',
			song : "Jesus to a Child"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'George Michael',
			song : "Roxanne"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Prince',
			song : "The most beautiful girl in the world"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Prince',
			song : "Cream"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Edwyn Collins',
			song : "A Girl Like You"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Beck',
			song : "Where It's At"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Beck',
			song : "Loser"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Andrea Bocelli',
			song : "Con Te Partiro"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Rod Stewart',
			song : "Have I Told You Lately"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Richard Marx',
			song : "Now And Forever"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Ricky Martin',
			song : "The Cup of Life"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Ricky Martin',
			song : "Livin' la Vida Loca"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Lou Bega',
			song : "Mamba 5"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Shaggy',
			song : "Boombastic"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Carlos Santana',
			song : "Smooth (ft Rob Thomas)"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Carlos Santana',
			song : "Corazon Espinado"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Khaled',
			song : "Aisha"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Adriano Celentano',
			song : "Angel"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Elton John',
			song : "Candle In The Wind"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Elton John',
			song : "Circle Of Life"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Elton John',
			song : "The One"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Elton John',
			song : "Something About The Way You Look Tonight"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Bryan Adams',
			song : "All For Love (ft Sting, Rod Stewart)"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Bryan Adams',
			song : "Please Forgive Me"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Bryan Adams',
			song : "(Everything I Do) I Do It For You"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Bryan Adams',
			song : "Have You Ever Really Loved A Woman?"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "Remember the Time"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "Heal The World"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "Scream (ft Janet Jackson)"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "You Are Not Alone"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "Earth Song"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "They Don't Care About Us"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "Jam"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Michael Jackson',
			song : "Black or White"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Sting',
			song : "Fields Of Gold"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Sting',
			song : "Desert Rose"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Sting',
			song : "Shape Of My Heart"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'R. Kelly',
			song : "I Believe I Can Fly"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Phil Collins',
			song : 'Another day in paradise',
			state: ' по Коллинзу'
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Eric Clapton',
			song : 'Tears in heaven',
			state: ' по Клэптену'
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Freedom"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Old Before I Die"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Lazy Days"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "South Of The Border"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Angels"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Millenium"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "No Regrets"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Rock DJ"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Kids (ft Kylie Minogue)"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Supreme"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Robbie Williams',
			song : "Better Man"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Moby',
			song : "Go"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Moby',
			song : "Move"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Moby',
			song : "James Bond Theme"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Moby',
			song : "Why Does My Heart Feel So Bad?"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Moby',
			song : "Natural Blues"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Moby',
			song : "Porcelain"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Fatboy Slim',
			song : "Praise You"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Seal',
			song : "Crazy"
		},
		{
			pack : EN_1990_M_PACK_1,
			group : 'Ricky Martin',
			song : "Private Emotion (ft Meja)"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Eric Clapton',
			song : "Over The Rainbow"
		},
		{
			pack : EN_1990_M_PACK_2,
			group : 'Michael Bolton',
			song : "When a Man Loves a Woman"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Lenny Kravitz',
			song : "Are You Gonna Go My Way"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Chris Isaak',
			song : "Wicked Game"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Ozzy Osbourne',
			song : "Mama, I'm Coming Home"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Ozzy Osbourne',
			song : "See You on the Other Side"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Youssou NDour',
			song : "7 Seconds (ft Neneh Cherry)"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Everlast',
			song : "Put your lights on (ft Santana)"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Everlast',
			song : "What Its Like"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Everlast',
			song : "Ends"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Fatboy Slim',
			song : "Gangster Trippin'"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Fatboy Slim',
			song : "Sunset (Bird Of Prey)"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Fatboy Slim',
			song : "Going Out of My Head"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Fatboy Slim',
			song : "Right Here Right Now"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'ATB',
			song : "9 PM - Till I Come"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'ATB',
			song : "Don’t Stop"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'ATB',
			song : "Killer"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Snoop Dogg',
			song : "Who Am I (What's My Name?)"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Snoop Dogg',
			song : "Still A G Thang"
		},
		{
			pack : EN_1990_M_PACK_3,
			group : 'Paul Van Dyk',
			song : "For an Angel"
		}
];

let en_1990_m_1 =	en_1990_m.filter(item => item.pack == 1);
let en_1990_m_2 =	en_1990_m.filter(item => item.pack == 2);
let en_1990_m_3 =	en_1990_m.filter(item => item.pack == 3);

const en_1990_f_icon = [
	'many',
	'few'
];

const EN_1990_F_PACK_1 = 1;
const EN_1990_F_PACK_2 = 2;

let en_1990_f = [
		{
			pack : EN_1990_F_PACK_2,
			group : 'Ardis',
			song : "Ain't nobody's business",
			state: ' по Ардис'
		},
		{
			pack : EN_1990_F_PACK_2,
			group : "Sinead O'Connor",
			song : "Nothing Compares 2 U"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Suzanne Vega',
			song : "Tom's Diner"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Toni Braxton',
			song : "Un-Break My Heart"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Shania Twain',
			song : "You're Still The One"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Jennifer Paige',
			song : "Crush"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Shania Twain',
			song : "Man! I Feel Like A Woman!"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Sheryl Crow',
			song : "All I Wanna Do"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Sheryl Crow',
			song : "If It Makes You Happy"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Janet Jackson',
			song : "That's The Way Love Goes"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Lisa Loeb',
			song : "Stay"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Christina Aguilera',
			song : "Genie In A Bottle"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Tasmin Archer',
			song : "Sleeping Satellite"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Lara Fabian',
			song : "I Will Love Again"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'LeAnn Rimes',
			song : "Can't Fight The Moonlight"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Natalia Oreiro',
			song : "Que Si, Que Si"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Natalia Oreiro',
			song : "De Tu Amor"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Natalia Oreiro',
			song : "Cambio Dolor"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Natalia Oreiro',
			song : "Me Muero De Amor"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Vanessa Paradis',
			song : "Joe le taxi"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Joan Osbourne',
			song : "One Of Us"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Dido',
			song : "Thank You"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Sandy Lee',
			song : "Paradise"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Toni Braxton',
			song : "I Dont Want To"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Cher',
			song : "Believe"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Britney Spears',
			song : "...Baby One More Time"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Tori Amos',
			song : "Cornflake Girl"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Whigfield',
			song : "Saturday Night"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Brandy',
			song : "The Boy Is Mine (ft Monica)"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Maggie Reilly',
			song : "Everytime We Touch"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Cesaria Evora',
			song : "Besame Mucho"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Natalie Imbruglia',
			song : "Torn"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Donna Lewis',
			song : "I Love You Always Forever"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : "Desree",
			song : "Life"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : "Desree",
			song : "You Gotta Be"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Shivaree',
			song : "Goodnight Moon"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Neneh Cherry',
			song : "Woman"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Melanie C',
			song : "I Turn To You"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Emilia',
			song : "Big Big World"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Lauren Christy',
			song : "The color of the night"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Meredith Brooks',
			song : "Bitch"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Jennifer Lopez',
			song : "If You Had My Love"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Jennifer Lopez',
			song : "Waiting for Tonight"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Jennifer Lopez',
			song : "No Me Ames"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Jennifer Lopez',
			song : "Let's Get Loud"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Celine Dion',
			song : "The Power of Love"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Celine Dion',
			song : "Because You Loved Me"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Celine Dion',
			song : "It's All Coming Back To Me Now"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Celine Dion',
			song : "My Heart Will Go On"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Celine Dion',
			song : "Here There & Everywhere"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Vogue"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Erotica"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Rain"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Secret"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Frozen"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Beautiful Stranger"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Madonna',
			song : "Ray Of Light"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Whitney Houston',
			song : "I'm Your Baby Tonight"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Whitney Houston',
			song : "I Will Always Love You"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Whitney Houston',
			song : "I Have Nothing"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Whitney Houston',
			song : "All The Man That I Need"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Alanis Morissette',
			song : "Ironic"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Alanis Morissette',
			song : "You Oughta Know"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Alanis Morissette',
			song : "Hand In My Pocket"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Alanis Morissette',
			song : "You Learn"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Alanis Morissette',
			song : "Head Over Feet"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Mariah Carey',
			song : "When You Believe"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Mariah Carey',
			song : "Hero"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Mariah Carey',
			song : "One Sweet Day"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Mariah Carey',
			song : "Without You"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Mariah Carey',
			song : "All I Want For Christmas Is You"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Bjork',
			song : "Big Time Sensuality"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Bjork',
			song : "Army of Me"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Bjork',
			song : "Hyperballad"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Annie Lennox',
			song : "Walking on Broken Glass"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Annie Lennox',
			song : "Why"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Annie Lennox',
			song : "Love Song for a Vampire"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Annie Lennox',
			song : "No More I Love You's"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Annie Lennox',
			song : "A Whiter Shade of Pale"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Geri Halliwell',
			song : "Mi Chico Latino"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Geri Halliwell',
			song : "Look At Me"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Geri Halliwell',
			song : "Lift Me Up"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Geri Halliwell',
			song : "Bag It Up"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Toni Braxton',
			song : "Spanish Guitar"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Shania Twain',
			song : "From This Moment On"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Vanessa Paradis',
			song : "Be My Baby"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Gala',
			song : "Freed from desire"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Gala',
			song : "Let a boy cry"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Gala',
			song : "Come into my life"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Lene Marlin',
			song : "Sitting Down Here"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Diana Ross',
			song : "When You Tell Me That You Love Me"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Meredith Brooks',
			song : "What Would Happen"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "Tears On My Pillow"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "Better the Devil You Know"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "Shocked"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "Confide in Me"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "Where the Wild Roses Grow"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "Spinning Around"
		},
		{
			pack : EN_1990_F_PACK_1,
			group : 'Kylie Minogue',
			song : "On A Night Like This"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Gina G',
			song : "Ooh Aah (Just A Little Bit)"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Gina G',
			song : "I Belong to You"
		},
		{
			pack : EN_1990_F_PACK_2,
			group : 'Gina G',
			song : "Fresh"
		}
];

let en_1990_f_1 =	en_1990_f.filter(item => item.pack == 1);
let en_1990_f_2 =	en_1990_f.filter(item => item.pack == 2);

let en_1990_minus = [
	{
		group : 'ACDC',
		song : "Highway to Hell",
		letter : 'A',
		type : 'Группа',
	},
	{
		group : 'Aerosmith',
		song : "Cryin'",
		letter : 'A',
		type : 'Группа',
	},
	{
		group : 'Green Day',
		song : "Basket Case",
		letter : 'G',
		type : 'Группа',
	},
	{
		group : 'Offspring',
		song : "Pretty Fly",
		letter : 'O',
		type : 'Группа',
	}
];

const en_2000_gr_icon = [
	'rock_1',
	'rock_2',
	'rock_hard',
	'womens_vocals',
	'pop_medium',
	'pop_hard'
];

const EN_2000_GR_PACK_1 = 1;
const EN_2000_GR_PACK_2 = 2;
const EN_2000_GR_PACK_3 = 3;
const EN_2000_GR_PACK_4 = 4;
const EN_2000_GR_PACK_5 = 5;
const EN_2000_GR_PACK_6 = 6;

let en_2000_gr = [
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'Boulevard Of Broken Dreams'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'American Idiot'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'Wake Me Up When September Ends'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'The Saints Are Coming (ft U2)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'The Simpsons Theme'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'Know Your Enemy'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : '21 Guns'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Want You Bad"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Million Miles Away"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Defy You"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Hit That"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Next to you"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Can't Repeat"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Hammerhead"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "You're Gonna Go Far, Kid"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Kristy, Are You Doing Okay?"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "Fat Lip"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "Pieces"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "Still Waiting"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "In Too Deep"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "I Miss You"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "Man Overboard"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "Always"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "Stay Together For The Kids"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Otherside'
		},	
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Californication'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Nickelback",
			song : 'How You Remind Me'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Linkin Park",
			song : 'In the end'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : "Can't Stop"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Linkin Park",
			song : 'Numb'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : 'Mr. Brightside'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : 'Breaking The Habit'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : 'Numb / Encore (ft Jay-Z)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : "What I've Done"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : "Bleed It Out"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : "We Made It (ft Busta Rhymes)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'By the way'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'The Zephyr Song'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Fortune Faded'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Dani California'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Tell Me Baby'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Snow (Hey Oh)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Desecration Smile'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Hump de Bump'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Stuck In A Moment You Can't Get Out Of"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Elevation"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Walk On"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Electrical Storm"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Vertigo"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "All Because Of You"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Sometimes You Can't Make It On Your Own"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "City Of Blinding Lights"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Window In The Skies"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'U2',
			song : "Get On Your Boots"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Rockstar"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "Somebody Told Me"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "When You Were Young"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "Read My Mind"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "Human"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "Spaceman"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Someday"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Figured You Out"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Photograph"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Far Away"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Gotta Be Somebody"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "If Today Was Your Last Day"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "Behind Blue Eyes"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "Almost Over"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "Take A Look Around"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "My Generation"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "Rollin' (Air Raid Vehicle)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "My Way"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Papa Roach',
			song : 'Last Resort'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Bon Jovi',
			song : "It's My Life"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Drowning Pool",
			song : 'Bodies'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "System of a Down",
			song : 'Chop Suey!'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Evanescence",
			song : 'Bring Me To Life'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "White Stripes",
			song : 'Seven Nation Army'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Hoobastank',
			song : 'The Reason'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'DragonForce',
			song : 'Fury Of The Storm'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Three Days Grace',
			song : 'I Hate Everything About You'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Skillet',
			song : "Comatose"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Skillet',
			song : "Hero"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Skillet',
			song : "Monster"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Skillet',
			song : "Awake and Alive"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : '3 Doors Down',
			song : "Train"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : '3 Doors Down',
			song : "Kryptonite"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : '3 Doors Down',
			song : "Here Without You"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Deep Purple',
			song : "Clearly Quite Absurd"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Why Do You Love Me"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Androgyny"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Run Baby Run"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Cherry Lips"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Evanescence",
			song : 'My Immortal'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "My Chemical Romance",
			song : 'Welcome to the Black Parade'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Kaiser Chiefs",
			song : 'Ruby'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Paramore",
			song : 'Emergency'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Kasabian",
			song : 'Fire'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Kasabian",
			song : 'Club Foot'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Kasabian",
			song : 'L.S.F.'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Kasabian",
			song : 'Underdog'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Foo Fighters",
			song : 'No Way Back'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Metallica",
			song : 'The Day That Never Comes'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Destiny's Child",
			song : 'Say My Name'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OutKast',
			song : 'Ms. Jackson'
		},		
		{
			pack : EN_2000_GR_PACK_5,
			group : "Coldplay",
			song : 'The Scientist'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Coldplay',
			song : 'Clocks'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OutKast',
			song : 'Hey Ya!'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'This Love'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'She Will Be Loved'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Pussycat Dolls',
			song : "Don't Cha"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Pussycat Dolls",
			song : 'Buttons (ft Snoop Dogg)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "OneRepublic",
			song : "Apologize (ft Timbaland)"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Coldplay",
			song : "Viva La Vida"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Pump It"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : 'Clint Eastwood'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : 'Where Is The Love?'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Let's Get It Started"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : 'Dare'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "My Humps"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : 'Feel Good Inc'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Falling asleep'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Love Me'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Angels (Love Is The Answer)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Save Me'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Colors'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "OneRepublic",
			song : "Stop And Stare"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "OneRepublic",
			song : "All The Right Moves"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Muse",
			song : "Uprising"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Muse",
			song : "Starlight"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Muse",
			song : "Undisclosed Desires"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Cure",
			song : "Cut Here"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Cure",
			song : "The Only One"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Akcent",
			song : "Kylie"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Akcent",
			song : "Stay with Me"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Akcent",
			song : "Jokero"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Akcent",
			song : "My Passion"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OutKast',
			song : 'The Way You Move (ft Sleep Brown)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Boom Boom Pow"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "I Gotta Feeling"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Mas Que Nada (ft Sergio Mendes)"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Don't Phunk With My Heart"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Meet Me Half Way"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Destiny's Child",
			song : 'Independent Women, Pt. I'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Destiny's Child",
			song : 'Survivor'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Pussycat Dolls',
			song : "Hush Hush"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Pussycat Dolls',
			song : "When I Grow Up"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Pussycat Dolls',
			song : "Sway"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'Makes Me Wonder'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'Wake Up Call'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Lady Antebellum',
			song : 'Need You Now'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Owl City',
			song : 'Fireflies'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Las Ketchup",
			song : 'Aserejé'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Cascada",
			song : 'Everytime We Touch'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Panic! At The Disco",
			song : 'I Write Sins Not Tragedies'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "MGMT",
			song : 'Kids'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Straight through my heart"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Hi Tack",
			song : "Say Say Say"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Global Deejays",
			song : "The Sound Of San Francisco"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Benassi Bros",
			song : "Hit My Heart"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Narcotic Thrust",
			song : "I Like It"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Reamonn",
			song : "Tonight"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Terror Squad",
			song : "Lean Back"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Travis",
			song : "Sing"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Nina Sky',
			song : 'Move Ya Body'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Blue',
			song : 'Guilty'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Morcheeba',
			song : 'Otherwise'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Morcheeba',
			song : 'World Looking In'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Westlife',
			song : 'Mandy'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'ATC',
			song : 'Around the World'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "NSYNC",
			song : 'Bye Bye Bye'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Simply Red',
			song : 'Sunrise'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'ATC',
			song : "I'm in Heaven"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Snow Patrol',
			song : 'Chasing Cars'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Baha Men',
			song : 'Who Let The Dogs Out'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Madcon',
			song : "Beggin'"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'No Angels',
			song : "Still In Love With You"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Brainstorm',
			song : "Maybe"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Five',
			song : "Rock the Party"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Florence + The Machine',
			song : "Rabbit Heart (Raise It Up)"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Florence + The Machine',
			song : "Cosmic Love"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Train',
			song : "Hey, Soul Sister"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Wheatus',
			song : "Teenage Dirtbag"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Beastie Boys',
			song : "An Open Letter To NYC"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Daft Punk',
			song : "One More Time"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Fort Minor',
			song : "Believe Me"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Chemical Brothers',
			song : "Galvanize"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Hurts',
			song : "Wonderful Life"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Hurts',
			song : "Stay"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Basic Element',
			song : "To You"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Mondotek',
			song : "Alive"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Aly & AJ',
			song : "Potential Breakup Song"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Whizzkids',
			song : "Rumours (Digi Digi) (ft Inusa, Dawuda)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Lighthouse Family',
			song : "Run"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Shape of My Heart"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Incomplete"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Inconsolable"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Bomfunk MCs",
			song : "Super Electric"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Bomfunk MCs",
			song : "Hypnotic"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Bomfunk MCs",
			song : "Live Your Life"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "RIO",
			song : "Shine On"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "RIO",
			song : "When the Sun Comes Down"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "RIO",
			song : "After the Love"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Fall Out Boy",
			song : "Dance, Dance"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Fall Out Boy",
			song : "Sugar, We're Goin Down"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Fall Out Boy",
			song : "This Ain’t a Scene, It’s an Arms Race"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Fall Out Boy",
			song : "Thanks for the Memories"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Tokio Hotel",
			song : "By Your Side"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Tokio Hotel",
			song : "1000 Oceans"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Tokio Hotel",
			song : "Darkside of the Sun"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : "On Melancholy Hill"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : "Dirty Harry"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : "Kids With Guns"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Jakarta",
			song : "One Desire"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Jakarta",
			song : "Superstar"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Sylver",
			song : "Forgiven"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Sylver",
			song : "Turn The Tide"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Guns N Roses",
			song : "Chinese Democracy"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Semisonic",
			song : "Chemistry"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "INXS",
			song : "Afterglow"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "INXS",
			song : "Original Sin"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Pussycat Dolls",
			song : "I don't need a man"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Faithless",
			song : "We Come 1"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Faithless",
			song : "One Step Too Far (ft Dido)"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Da Buzz",
			song : "Dangerous"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Da Buzz",
			song : "Wonder Where You Are"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Da Buzz",
			song : "Dangerous"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Papa Roach',
			song : 'Lifeline'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Papa Roach',
			song : 'Forever'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Papa Roach',
			song : 'Scars'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Papa Roach',
			song : 'Getting Away with Murder'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Papa Roach',
			song : 'She Loves Me Not'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Klubbheads',
			song : 'Hiphopping'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'OK Go',
			song : 'Here It Goes Again'
		}
];

let en_2000_gr_1 =	en_2000_gr.filter(item => item.pack == 1);
let en_2000_gr_2 =	en_2000_gr.filter(item => item.pack == 2);
let en_2000_gr_3 =	en_2000_gr.filter(item => item.pack == 3);
let en_2000_gr_4 =	en_2000_gr.filter(item => item.pack == 4);
let en_2000_gr_5 =	en_2000_gr.filter(item => item.pack == 5);
let en_2000_gr_6 =	en_2000_gr.filter(item => item.pack == 6);

const en_2000_m_icon = [
	'pop',
	'dj',
	'rap'
];

const EN_2000_M_PACK_1 = 1;
const EN_2000_M_PACK_2 = 2;
const EN_2000_M_PACK_3 = 3;

let en_2000_m = [
		{
			pack : EN_2000_M_PACK_1,
			group : 'Justin Bieber',
			song : 'Baby'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Shaggy",
			song : 'Angel (ft Rayvon)'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Justin Timberlake',
			song : 'Cry Me A River'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Sean Kingston",
			song : 'Beautiful Girls'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Daniel Powter",
			song : 'Bad Day'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "James Blunt",
			song : "You're Beautiful"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Gnarls Barkley",
			song : 'Crazy'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Jason Mraz",
			song : "I'm Yours"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Justin Timberlake',
			song : 'Sexy back (ft Timbaland)'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Justin Timberlake',
			song : 'My Love (ft TI)'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Justin Timberlake',
			song : 'Like I Love You'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Robbie Williams',
			song : 'The Road To Mandalay'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Robbie Williams',
			song : "Somethin' Stupid (ft Nicole Kidman)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Darren Hayes',
			song : 'I Miss You'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Darren Hayes',
			song : 'Strange Relationship'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'George Michael',
			song : 'The Long And Winding Road'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Leonard Cohen',
			song : 'A Thousand Kisses Deep'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Arash',
			song : 'Boro Boro'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Seal',
			song : "It's A Man's Man's World"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Enrique Iglesias',
			song : 'Be With You'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Enrique Iglesias',
			song : 'Do You Know?'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Enrique Iglesias',
			song : 'Hero'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Ronan Keating',
			song : 'If Tomorrow Never Comes'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Arash',
			song : 'Tike Tike Kardi'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Fred Puppet',
			song : 'Mahna Mahna (ft Monster Crew)'
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Lemar',
			song : "If There's Any Justice"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Mario',
			song : "Let Me Love You"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Travie McCoy',
			song : "Billionaire"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Ne-Yo',
			song : "So Sick"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Ne-Yo',
			song : "Closer"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Adam Lambert',
			song : "For your entertainment"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Adam Lambert',
			song : "Whataya Want from Me"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Johnny Cash",
			song : "I Won't Back Down"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Juanes",
			song : "La Camisa Negra"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Santana",
			song : "Smooth (ft Rob Thomas)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Santana",
			song : "Maria Maria (ft The Product G&B)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Santana",
			song : "The Game of Love (ft Michelle Branch)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Shaggy",
			song : "It Wasnt Me (ft Rik Rok)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Chris Brown",
			song : "Run It! (ft Juelz Santana)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Chris Brown",
			song : "Kiss Kiss (ft T-Pain)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "BoB",
			song : "Nothin' on You (ft Bruno Mars)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Bruno Mars",
			song : "Just the Way You Are"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Mika",
			song : "Grace Kelly"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Mika",
			song : "Relax, Take It Easy"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Mika",
			song : "Love Today"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Craig David",
			song : "Rise and fall (ft Sting)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Craig David",
			song : "Insomnia"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Eros Ramazzotti",
			song : "Fuoco nel fuoco"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Eros Ramazzotti",
			song : "Parla con me"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Tomas Nevergreen",
			song : "Since You Been Gone"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Tomas Nevergreen",
			song : "Every Time"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Rob Thomas",
			song : "Lonely No More"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Joe",
			song : "Stutter (ft Mystikal)"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Nek",
			song : "Instabile"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Giorgos Mazonakis",
			song : "To Gucci Forema"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : "Darren Hayes",
			song : "Crush (1980 Me)"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Tom Novy",
			song : "Take it (ft Lima)"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Bob Sinclar",
			song : "Love Generation"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Bob Sinclar",
			song : "Kiss My Eyes"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Moby",
			song : "Slipping Away"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Timo Maas",
			song : "First Day (ft Brian Molko)"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Crazy Frog",
			song : "Axel F"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Danzel",
			song : "Pump It Up"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Danzel",
			song : "Put Your Hands up in the Air!"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Zac Efron",
			song : "Breaking Free (ft Vanessa Hudgens)"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Eric Prydz",
			song : "Call on Me"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Gigi D'Agostino",
			song : "L'Amour Toujours"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Paul Van Dyk",
			song : "Let Go (ft Rea Garvey)"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Moby",
			song : "Lift Me Up"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'David Guetta',
			song : 'The World Is Mine'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'David Guetta',
			song : 'Memories'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'David Guetta',
			song : 'Love is gone'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Alex Gaudino',
			song : 'Destination Calabria (ft Crystal Waters)'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Dj Bobo',
			song : 'Chihuahua'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Yves Larock',
			song : 'Rise Up'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'K-Maro',
			song : "Let's go"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Stromae',
			song : 'Alors On Danse'
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Benny Benassi',
			song : 'Satisfaction'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Flo Rida',
			song : 'Right Round'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Kid Cudi',
			song : "Day 'N' Nite"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Jamie Foxx',
			song : 'Blame It'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Iyaz',
			song : 'Replay'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Jay Sean',
			song : 'Down'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Taio Cruz',
			song : 'Break Your Heart'
		},	
		{
			pack : EN_2000_M_PACK_3,
			group : 'Snoop Dogg',
			song : 'The Next Episode (ft Dr. Dre)'
		},	
		{
			pack : EN_2000_M_PACK_3,
			group : 'Eminem',
			song : 'Stan (ft Dido)'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Eminem',
			song : 'The Real Slim Shady'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Nelly',
			song : 'Ride With Me'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Nelly',
			song : 'Hot In Herre'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Eminem',
			song : 'Cleaning Out My Closet'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Nelly',
			song : 'Dilemma (ft Kelly Rowland)'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Eminem',
			song : 'Without Me',
			state: ' по Эминему'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Eminem',
			song : 'Lose Yourself'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : '50 Cent',
			song : 'In Da Club'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Pharrell Williams',
			song : "Drop It Like It's Hot (ft Snoop Dogg)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "50 Cent",
			song : "Candy Shop (ft Olivia)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Timbaland",
			song : 'Promiscuous (ft Nelly Furtado)'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Eminem",
			song : 'Smack That (ft Akon)'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Kanye West",
			song : "Stronger"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Soulja Boy Tell'em",
			song : 'Crank That'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Usher',
			song : 'Yeah!'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Sean Paul",
			song : 'Temperature'
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Young Buck",
			song : "Get Buck"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "P. Diddy",
			song : "Shake Ya Tailfeather (ft Nelly, Murphy Lee)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Eminem",
			song : "When I'm Gone"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "50 Cent",
			song : "21 Questions (ft Nate Dogg)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Busta Rhymes",
			song : "I Know What You Want (ft Mariah Carey)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Nelly",
			song : "Grillz (ft Paul Wall, Ali & Gipp)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Akon",
			song : "Don't Matter"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Akon",
			song : "Right Now (Na Na Na)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Akon",
			song : "Lonely"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Jay-Z",
			song : "Empire State Of Mind (ft Alicia Keys)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Jay-Z",
			song : "99 Problems"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Usher",
			song : "U Remind Me"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Usher",
			song : "U Got It Bad"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Usher",
			song : "My Boo (ft Alicia Keys)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Usher",
			song : "Love in This Club (ft Young Jeezy)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Usher",
			song : "Burn"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Usher",
			song : "Confessions"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Flo Rida",
			song : "Low"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Sean Paul",
			song : "Get Busy"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Sean Paul",
			song : "We Be Burnin'"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Timbaland",
			song : "The Way I Are (ft Keri Hilson, D.O.E.)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Timbaland",
			song : "Give It To Me (ft Justin Timberlake, Nelly Furtado)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Pitbull",
			song : "I Know You Want Me"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Kanye West",
			song : "Gold Digger (ft Jamie Foxx)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "TI",
			song : "Whatever You Like"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "TI",
			song : "Live Your Life (ft Rihanna)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "DMX",
			song : "Party Up"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Lil Jon",
			song : "Get Low (ft The East Side Boyz)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Lil Wayne",
			song : "Lollipop (ft Static Major)"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Fatboy Slim",
			song : "Star 69"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Fatboy Slim",
			song : "Weapon Of Choice"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "Fatboy Slim",
			song : "Slash Dot Dash"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "ATB",
			song : "The Summer"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "ATB",
			song : "Ecstasy"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : "ATB",
			song : "Let U Go"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Jay Sean",
			song : "Do You Remember (ft Sean Paul, Lil Jon)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : "Jay Sean",
			song : "Ride It"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Snoop Dogg',
			song : "Beautiful (ft Pharell Williams, Uncle Charlie Wilson)"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Snoop Dogg',
			song : "Sexual Eruption"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Pakito',
			song : "Living on Video"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Pakito',
			song : "Moving on Stereo"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Pakito',
			song : "Are You Ready"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Laurent Wolf',
			song : "No Stress"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Eminem',
			song : "Ass Like That"
		},
		{
			pack : EN_2000_M_PACK_1,
			group : 'Mustafa Sandal',
			song : "All My Life"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Calvin Harris',
			song : "Acceptable in the 80s"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Calvin Harris',
			song : "The Girls"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Panjabi MC',
			song : "Mundian to Bach Ke"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Yves Larock',
			song : "By Your Side"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Lexter',
			song : "Freedom to Love"
		},
		{
			pack : EN_2000_M_PACK_3,
			group : 'Afroman',
			song : "Because I Got High"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Dim Chris',
			song : "Sucker"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Paul Van Dyk',
			song : "Nothing But You"
		},
		{
			pack : EN_2000_M_PACK_2,
			group : 'Roger Sanchez',
			song : "Another Chance"
		}
];

let en_2000_m_1 =	en_2000_m.filter(item => item.pack == 1);
let en_2000_m_2 =	en_2000_m.filter(item => item.pack == 2);
let en_2000_m_3 =	en_2000_m.filter(item => item.pack == 3);

const en_2000_f_icon = [
	'easy',
	'medium',
	'rnb'
];

const EN_2000_F_PACK_1 = 1;
const EN_2000_F_PACK_2 = 2;
const EN_2000_F_PACK_3 = 3;

let en_2000_f = [
		{
			pack : EN_2000_F_PACK_1,
			group : 'Katy Perry',
			song : 'I Kissed A Girl'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Lady Gaga',
			song : 'Poker Face'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Britney Spears',
			song : 'Womanizer'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Pink',
			song : 'So What'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Britney Spears',
			song : 'Ooops!... I did it again'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : "Lady Marmalade (ft Pink, Mya, Lil' Kim)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Shakira",
			song : 'Whenever, Wherever'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : 'Beautiful'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'Complicated'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Britney Spears',
			song : 'Toxic'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Shakira",
			song : "Hips Don't Lie"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'Girlfriend'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Taylor Swift",
			song : 'Love Story'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Lady Gaga",
			song : "Just Dance (ft Colby ODonis)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Katy Perry',
			song : "California Gurls (ft. Snoop Dogg)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Katy Perry',
			song : "Teenage Dream"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Katy Perry',
			song : "Firework"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Katy Perry',
			song : "Hot N Cold"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Katy Perry',
			song : "Waking Up In Vegas"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Taylor Swift",
			song : 'You Belong With Me'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Gwen Stefani",
			song : "Hollaback Girl"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Gwen Stefani",
			song : "The sweet escape (ft Akon)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Lady Gaga',
			song : "Telephone (ft. Beyonce)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : 'Come on over Baby (All I Want Is You)'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : 'Hurt'
		},
		{
			group : "Inna",
			song : 'Hot'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Inna",
			song : 'Amazing'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Inna",
			song : 'Sun Is Up'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Pink',
			song : 'Get the Party Started'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Pink',
			song : 'Trouble'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Lady Gaga',
			song : "Bad Romance"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : 'Britney Spears',
			song : 'Gimme More'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Shakira",
			song : 'Underneath Your Clothes'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Shakira",
			song : 'Objection (Tango)'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Shakira",
			song : 'La Tortura (ft Alejandro Sanz)'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Shakira",
			song : 'Waka Waka (This Time for Africa) (ft Freshlyground)'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'Losing Grip'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'My Happy Ending'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : "Nobody's Home"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : "He Wasn't"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : "When You're Gone"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'Hot'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'The Best Damn Thing'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Avril Lavigne",
			song : 'Alice'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Jennifer Lopez",
			song : "Ain't It Funny"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Jennifer Lopez",
			song : "I'm Real (ft Ja Rule)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Jennifer Lopez",
			song : "All I Have (ft LL Cool J)"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Jennifer Lopez",
			song : "Love Don't Cost a Thing"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Jennifer Lopez",
			song : "Jenny from the Block"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Mary J. Blige",
			song : 'Family Affair'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Vanessa Carlton",
			song : 'A Thousand Miles'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Leona Lewis",
			song : "Bleeding Love"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Amy Winehouse",
			song : "Back to Black"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Despina Vandi",
			song : "Come Along Now"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Kelis",
			song : "Milkshake"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Kelis",
			song : "Trick Me"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "MIA",
			song : "Paper Planes"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Ida Corr",
			song : "Let Me Think About It (ft Fedde Le Grand)"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Duffy',
			song : "Mercy"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Celine Dion',
			song : "A New Day Has Come"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Madonna',
			song : "Music"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Madonna',
			song : "Hung Up"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Madonna',
			song : "4 minutes"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kelly Clarkson',
			song : "Because of You"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kelly Clarkson',
			song : "A Moment Like This"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kelly Clarkson',
			song : "My Life Would Suck Without You"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Geri Halliwell',
			song : "Calling"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kesha',
			song : 'Tick Tock'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Dido',
			song : 'Thank You'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Dido',
			song : 'White Flag'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kylie Minogue',
			song : 'Spinning Around'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kylie Minogue',
			song : "Can't Get You Out of My Head"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Mariah Carey',
			song : 'We Belong Together'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Mariah Carey',
			song : 'Touch My Body'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Janet Jackson',
			song : 'All For You'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Ashanti',
			song : 'Foolish'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'LeAnn Rimes',
			song : "Can't Fight The Moonlight"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Amy McDonald',
			song : 'This Is The Life'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : 'Aaliyah',
			song : 'Try Again'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Kat Deluna',
			song : 'Whine up (ft Elephant Man)'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Myriam Faris',
			song : 'Chamarni (Enta bel hayat)'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Mya',
			song : 'Case Of The Ex'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'September',
			song : 'Cry For You'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Enya',
			song : 'And Winter Came'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : 'Oceana',
			song : 'Cry cry'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : 'Crazy In Love (ft Jay-Z)'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : 'Alicia Keys',
			song : "If I Ain't Got You"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "Beautiful Lier (ft Shakira)"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'Umbrella (ft Jay-Z)'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "Single Ladies"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Fergie",
			song : 'Fergalicious (ft will.i.am)'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Nelly Furtado",
			song : 'Say It Right'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "Baby Boy (ft Sean Paul)"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "Halo"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "If I Were a Boy"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "Check On It (ft Slim Thug, Bun B)"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Beyonce",
			song : "Irreplaceable"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'SOS'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'Live Your Life (ft TI)'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'Only Girl (In The World))'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : "Don't Stop The Music"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'Rude Boy'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'Disturbia'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Rihanna",
			song : 'Unfaithful'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : 'Alicia Keys',
			song : "Falling"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : 'Alicia Keys',
			song : "No One"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Fergie",
			song : 'Big Girls Don`t Cry'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Fergie",
			song : 'London Bridge'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Fergie",
			song : 'Glamorous'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Fergie",
			song : 'Clumsy'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Nelly Furtado",
			song : "I'm Like A Bird"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Nelly Furtado",
			song : 'Promiscuous (ft Timbaland)'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Miley Cyrus",
			song : 'See You Again'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Miley Cyrus",
			song : '7 Things'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Miley Cyrus",
			song : 'The Climb'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Miley Cyrus",
			song : 'Hoedown Throwdown'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Miley Cyrus",
			song : 'Party In The U.S.A.'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Miley Cyrus",
			song : "Can't Be Tamed"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Ciara",
			song : 'Goodies'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Ciara",
			song : 'One, Two Step'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Missy Elliott",
			song : 'Work It'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Missy Elliott",
			song : 'Get Ur Freak On'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Missy Elliott",
			song : 'Lose Control (ft Ciara ft Fat Man Scoop)'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Missy Elliott",
			song : 'Bomb Intro Pass That Dutch'
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Missy Elliott",
			song : 'Gossip Folks'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Sia",
			song : 'Clap Your Hands'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Sia",
			song : 'The Girl You Lost To Cocaine'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Sia",
			song : "Soon We’ll Be Found"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Nelly Furtado",
			song : 'Forca'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Titiyo",
			song : 'Come Along'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Natasha Bedingfield",
			song : 'These Words'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Natasha Bedingfield",
			song : 'Single'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Natasha Bedingfield",
			song : 'Unwritten'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Lady Gaga",
			song : "Boys Boys Boys"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Madonna",
			song : "Hollywood"
		},
		{
			pack : EN_2000_F_PACK_3,
			group : "Fergie",
			song : 'Party People (ft Nelly)'
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Despina Vandi",
			song : "Opa Opa"
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : 'Candy Man'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : 'Fighter'
		},
		{
			pack : EN_2000_F_PACK_1,
			group : "Christina Aguilera",
			song : "Keeps Gettin' Better"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Hilary Duff",
			song : "So Yesterday"
		},
		{
			pack : EN_2000_F_PACK_2,
			group : "Hilary Duff",
			song : "Come Clean"
		}
];

let en_2000_f_1 =	en_2000_f.filter(item => item.pack == 1);
let en_2000_f_2 =	en_2000_f.filter(item => item.pack == 2);
let en_2000_f_3 =	en_2000_f.filter(item => item.pack == 3);

let en_2000_minus = [
	{
		group : 'Killers',
		song : "Mr. Brightside",
		type: "Группа"
	},
	{
		group : 'Nickelback',
		song : "Rockstar",
		type: "Группа"
	},
	{
		group : 'U2',
		song : "Vertigo",
		type: "Группа"
	},
	{
		group : 'Kaiser Chiefs',
		song : "Ruby",
		type: "Группа"
	},
	{
		group : 'Garbage',
		song : "Androgyny",
		type: "Группа"
	},
	{
		group : 'Adam Lambert',
		song : "Whataya Want from Me",
		type: "Исполнитель"
	},
	{
		group : 'Gnarls Barkley',
		song : "Crazy",
		type: "Исполнитель"
	},
	{
		group : 'Sean Paul',
		song : "Temperature",
		type: "Исполнитель"
	},
	{
		group : 'Eminem',
		song : "The Real Slim Shady",
		type: "Исполнитель"
	},
	{
		group : 'Avril Lavigne',
		song : "Complicated",
		type: "Исполнительница"
	},
	{
		group : 'Inna',
		song : "Sun Is Up",
		type: "Исполнительница"
	},
	{
		group : 'Katy Perry',
		song : "I Kissed A Girl",
		type: "Исполнительница"
	}
]

let en_2007_gr_1 = [
	{
		id : 1,
		group : 'Killers',
		song : 'Read My Mind'
	},
	{
		id : 2,
		group : 'Foo Fighters',
		song : 'The Pretender'
	},
	{
		id : 3,
		group : 'Apocalyptica',
		song : 'I Dont Care (ft Adam Gontier)'
	},
	{
		id : 4,
		group : 'Linkin Park',
		song : 'Bleed It Out'
	},
	{
		id : 5,
		group : 'Kaiser Chiefs',
		song : 'Ruby'
	},
	{
		id : 6,
		group : 'Sunrise Avenue',
		song : 'Fairytale Gone Bad'
	},
	{
		id : 7,
		group : 'Sum 41',
		song : 'With Me'
	},
	{
		id : 8,
		group : 'Linkin Park',
		song : 'Shadow Of The Day'
	},
	{
		id : 9,
		group : 'Skillet',
		song : 'Looking for Angels'
	},
	{
		id : 10,
		group : 'Fall Out Boy',
		song : 'Thanks for the Memories'
	},
	{
		id : 11,
		group : 'My Chemical Romance',
		song : 'Teenagers'
	},
	{
		id : 12,
		group : 'Paramore',
		song : 'Misery Business'
	},
	{
		id : 13,
		group : 'Nightwish',
		song : 'Bye Bye Beautiful'
	},
	{
		id : 14,
		group : 'Arctic Monkeys',
		song : 'Old Yellow Bricks'
	},
	{
		id : 15,
		group : 'Linkin Park',
		song : "What I've Done"
	},
	{
		id : 16,
		group : 'My Chemical Romance',
		song : 'Famous Last Words'
	}
];

let en_2007_gr_2 = [
	{
		id : 1,
		group : 'Morandi',
		song : 'Save Me'
	},
	{
		id : 2,
		group : 'Morandi',
		song : 'Angels'
	},
	{
		id : 3,
		group : 'OneRepublic',
		song : 'Apologize (ft Timbaland)'
	},
	{
		id : 4,
		group : 'Maroon 5',
		song : 'Wake Up Call'
	},
	{
		id : 5,
		group : 'Tokio Hotel',
		song : 'Monsoon'
	},
	{
		id : 6,
		group : 'Maroon 5',
		song : 'Makes Me Wonder'
	}
];

let en_2007_m_1 = [
	{
		id : 1,
		group : 'Basshunter',
		song : "Now You're Gone"
	},
	{
		id : 2,
		group : 'Mika',
		song : 'Relax, Take It Easy'
	},
	{
		id : 3,
		group : 'Basshunter',
		song : 'Boten Anna'
	},
	{
		id : 4,
		group : 'Enrique Iglesias',
		song : 'Tired Of Being Sorry'
	},
	{
		id : 5,
		group : 'David Guetta',
		song : 'Love Is Gone (ft Chris Willis)'
	}
];

let en_2007_m_2 = [
	{
		id : 1,
		group : 'Timbaland',
		song : 'The Way I Are'
	},
	{
		id : 2,
		group : 'Shantel',
		song : 'DISKO PARTIZANI'
	},
	{
		id : 3,
		group : 'Rashni',
		song : 'Baboushka'
	},
	{
		id : 4,
		group : 'Kanye West',
		song : 'Stronger'
	}
];

let en_2007_f_1 = [
	{
		id : 1,
		group : 'Britney Spears',
		song : 'Gimme More'
	},
	{
		id : 2,
		group : 'Britney Spears',
		song : 'Piece Of Me'
	},
	{
		id : 3,
		group : 'Avril Lavigne',
		song : 'Girlfriend'
	},
	{
		id : 4,
		group : 'Avril Lavigne',
		song : "When You're Gone"
	},
	{
		id : 5,
		group : 'Avril Lavigne',
		song : 'Hot'
	}
];

let en_2007_f_2 = [
	{
		id : 1,
		group : 'Rihanna',
		song : "Don't Stop The Music"
	},
	{
		id : 2,
		group : 'Beyonce',
		song : 'Beautiful Liar (ft Shakira)'
	},
	{
		id : 3,
		group : 'Alicia Keys',
		song : 'No One'
	},
	{
		id : 4,
		group : 'Rihanna',
		song : 'Umbrella (ft. JAY-Z)'
	}
];

let en_2010_gr = [
	{
		id : 1,
		group : 'Chainsmokers',
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
	},	
	{
		id : 17,
		group : 'OneRepublic',
		song : "If I Loose Myself"
	},	
	{
		id : 18,
		group : 'OneRepublic',
		song : "Counting Stars"
	},	
	{
		id : 19,
		group : 'OneRepublic',
		song : "Something I Need"
	},	
	{
		id : 20,
		group : 'OneRepublic',
		song : "Love Runs Out"
	},	
	{
		id : 21,
		group : 'OneRepublic',
		song : "Wherever I Go"
	},	
	{
		id : 22,
		group : 'OneRepublic',
		song : "Let's Hurt Tonight"
	},	
	{
		id : 23,
		group : 'OneRepublic',
		song : "Rich Love (ft Seeb)"
	},	
	{
		id : 24,
		group : 'OneRepublic',
		song : "No Vacancy"
	},	
	{
		id : 25,
		group : 'Imagine Dragons',
		song : "It's Time"
	},	
	{
		id : 26,
		group : 'Imagine Dragons',
		song : "Radioactive"
	},	
	{
		id : 27,
		group : 'Imagine Dragons',
		song : "Believer"
	},	
	{
		id : 28,
		group : 'Imagine Dragons',
		song : "Hear Me"
	},	
	{
		id : 29,
		group : 'Imagine Dragons',
		song : "Demons"
	},	
	{
		id : 30,
		group : 'Imagine Dragons',
		song : "On Top of the World"
	},	
	{
		id : 31,
		group : 'Imagine Dragons',
		song : "I Bet My Life"
	},	
	{
		id : 32,
		group : 'Imagine Dragons',
		song : "Shots"
	},	
	{
		id : 33,
		group : 'Imagine Dragons',
		song : "Sucker for Pain (ft Lil Wayne and Wiz Khalifa)"
	},	
	{
		id : 34,
		group : 'Imagine Dragons',
		song : "Thunder"
	},	
	{
		id : 35,
		group : 'Imagine Dragons',
		song : "Whatever It Takes"
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
		group : 'Luis Fonsi',
		song : "Despacito (ft Daddy Yankee)"
	},
	{
		id : 3,
		group : 'Bruno Mars',
		song : "Uptown Funk (ft. Mark Ronson)"
	},
	{
		id : 4,
		group : 'Pharrell Williams',
		song : "Blurred Lines (ft TI, Robin Thicke)"
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
		group : 'Drake',
		song : "Work (ft. Rihanna)"
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
		song : "Timber (ft. Kesha)"
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
		group : 'Ed Sheeran',
		song : "Thinking Out Loud"
	},
	{
		id : 36,
		group : 'Pharrell Williams',
		song : "Get Lucky (ft Daft Punk)"
	},
	{
		id : 37,
		group : 'Flo Rida',
		song : "Good Feeling"
	},
	{
		id : 38,
		group : 'Flo Rida',
		song : "Whistle"
	},
	{
		id : 39,
		group : 'will.i.am',
		song : "This Is Love (ft Eva Simons)"
	},
	{
		id : 40,
		group : 'will.i.am',
		song : "Scream & Shout (ft Britney Spears)"
	},
	{
		id : 41,
		group : 'Weeknd',
		song : "Blinding Lights"
	},
	{
		id : 42,
		group : 'Weeknd',
		song : "The Hills"
	},
	{
		id : 43,
		group : 'Weeknd',
		song : "Can't Feel My Face"
	},
	{
		id : 44,
		group : 'Weeknd',
		song : "Starboy (ft Daft Punk)"
	},
	{
		id : 45,
		group : 'Weeknd',
		song : "Save Your Tears"
	},
	{
		id : 46,
		group : 'Weeknd',
		song : "Heartless"
	},
	{
		id : 47,
		group : 'will.i.am',
		song : "#thatPOWER (ft Justin Bieber)"
	},
	{
		id : 48,
		group : 'will.i.am',
		song : "It’s My Birthday (ft Cody Wise)"
	},
	{
		id : 49,
		group : 'Harry Styles',
		song : "Watermelon Sugar"
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
		id : 9,
		group : 'Lady Gaga',
		song : "Telephone (ft. Beyonce)"
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
	},
	{
		id : 37,
		group : 'Lady Gaga',
		song : "Always Remember Us This Way"
	},
	{
		id : 38,
		group : 'Rihanna',
		song : "Love The Way You Lie (ft Eminem)"
	},
	{
		id : 39,
		group : 'Rihanna',
		song : "Work (ft Drake)"
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
		group : 'Kid Laroi and Justin Bieber',
		song : "Stay"
	},
	{
		id : 9,
		group : 'Mariah Carey',
		song : "All I Want for Christmas Is You"
	},
	{
		id : 10,
		group : 'Weeknd',
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
		group : 'Weeknd and Ariana Grande',
		song : "Save Your Tears"
	},
	{
		id : 16,
		group : 'Glass Animals',
		song : "Heat Waves"
	},
	{
		id : 17,
		group : 'Beyonce',
		song : "Break My Soul"
	}
];


// RU songs

const ru_1980_gr_icon = [
	'ru_pop',
	'ru_via',
	'ru_rock_1',
	'ru_rock_2'
];

const RU_1980_GR_PACK_1 = 1;
const RU_1980_GR_PACK_2 = 2;
const RU_1980_GR_PACK_3 = 3;
const RU_1980_GR_PACK_4 = 4;

let ru_1980_gr = [
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Ласковый май',
		song : "Пусть будет ночь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Браво',
		song : "Жёлтые ботинки"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Форум',
		song : "Островок"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Форум',
		song : "Улетели листья"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Мираж',
		song : "Солнечное лето"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Зодиак',
		song : "Провинциальное диско"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Зодиак',
		song : "Рок на льду"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Динамик',
		song : "Ещё вчера"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Круг',
		song : "Кара-кум"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Сёстры Базыкины',
		song : "О чём ты думаешь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Маленький принц',
		song : "Мы встретимся снова"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Браво',
		song : "Ленинградский рок-н-ролл"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Игра',
		song : "Неспелая вишня"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Трио Меридиан',
		song : "Прекрасное далёко"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Тёмная лошадка"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Кони в яблоках"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Ты замуж за него не выходи"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Игрушка"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Фристайл',
		song : "Прощай навеки, последняя любовь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Фристайл',
		song : "Принцесса"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Любэ',
		song : "Атас"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Любэ',
		song : "Не губите, мужики"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Любэ',
		song : "Клетки"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Сёстры Базыкины',
		song : "Moscow Nights"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Бродячие артисты"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Земляне',
		song : "Трава у дома"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Земляне',
		song : "Поверь в мечту"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Здравствуй, песня',
		song : "Синий иней"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Верасы',
		song : "Белый снег (Завируха)"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Верасы',
		song : "Малиновка"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Сябры',
		song : "Вы шумите, берёзы"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Синяя птица',
		song : "Я иду тебе навстречу"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Не повторяется такое никогда"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Не надо печалиться"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "На острове Буяне"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "Каждый день твой"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "По полю, полю"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Цветы',
		song : "Мы желаем счастья вам"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Цветы',
		song : "Богатырская сила"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Добры Молодцы',
		song : "Песенка о снежинке"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Коробейники',
		song : "Первый снег"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Красные маки',
		song : "Если не расстанемся"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Лейся, песня',
		song : "Я так и знал"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Не волнуйтесь, тётя"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Напиши мне письмо"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Люди встречаются"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Земляне',
		song : "Каскадёры"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Здравствуй, песня',
		song : "Не обещай"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Здравствуй, песня',
		song : "Птица счастья"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Верасы',
		song : "Я у бабушки живу"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Синяя птица',
		song : "Так вот какая ты"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Синяя птица',
		song : "Белый теплоход"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Цветы',
		song : "Звездочка моя ясная"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Аты-баты"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Снег кружится"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "На два дня"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "В краю магнолий"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "Порушка-Параня"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ялла',
		song : "Три колодца"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ялла',
		song : "Канатоходцы"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Лейся, песня',
		song : "Обручальное кольцо"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Вольный ветер"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Никто не услышит (Ой-йо)"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Всему своё время"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Не спеши"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Крутится волчок"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Не позволяй душе ленится"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Стремленья"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Виза для Круиза"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Кто-то же должен"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Листья"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Жизни рассвет"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Это - рок"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Церквушки"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Красное на чёрном"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Моё поколение"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Воздух"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Время менять имена"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Карнавал',
		song : "Аэропорт"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Карнавал',
		song : "Запасной игрок"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "На заре"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "Дайте огня"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "День освобождения"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "Фальстарт"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "Вальс"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "Головокруженье"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "Ирландия. Ольстер"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "Корабль"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "О мой мальчик"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Кто виноват"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Воскресение"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Мчится поезд"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Я ни разу за морем не был"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Ты и я"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Кеды"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Привет"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Алиса"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Ленинградское время"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Улица роз"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Позади Америка"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Воля и разум"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Дай жару!"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Аквариум',
		song : "Поезд в огне"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Бригада С',
		song : "Бродяга"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'ДДТ',
		song : "Родина"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Чёрный кофе"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Вольному воля"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Светлый металл"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Nautilus Pompilius',
		song : "Гудбай, Америка"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Nautilus Pompilius',
		song : "Я Хочу Быть С Тобой"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Агата Кристи',
		song : "Пантера"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Маленькая девочка"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Мусорный ветер"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Безобразная Эльза"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Катманду"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Клубника со льдом"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Иероглиф"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Праздник"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Телефон"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Остров"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Пикник"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Бутылка водки"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Серый голубь"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Бумажные цветы"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Досуги-буги"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Крым"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Нэпман"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Волчица"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Банзай"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Дорога"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Осколки"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "Всё идёт по плану"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "Зоопарк"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "На наших глазах"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "Дезертир"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "Слепое бельмо"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Буги-вуги каждый день"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Пригородный блюз"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Сидя на белой полосе"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Песня простого человека"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Растафара (Натти Дрэда)"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Ветер перемен"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Вот так вота!"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Заберите вашу жизнь"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Зиба"
	}
];

let ru_1980_gr_1 =	ru_1980_gr.filter(item => item.pack == 1);
let ru_1980_gr_2 =	ru_1980_gr.filter(item => item.pack == 2);
let ru_1980_gr_3 =	ru_1980_gr.filter(item => item.pack == 3);
let ru_1980_gr_4 =	ru_1980_gr.filter(item => item.pack == 4);

const ru_1980_m_icon = [
	'easy',
	'medium'
];

const RU_1980_M_PACK_1 = 1;
const RU_1980_M_PACK_2 = 2;

let ru_1980_m = [
	{
		pack : RU_1980_M_PACK_1,
		group : 'Виктор Салтыков',
		song : "Белая ночь"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Корнелюк',
		song : "Билет на балет"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Корнелюк',
		song : "Возвращайся"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вячеслав Добрынин',
		song : "Не сыпь мне соль на рану"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Лоза',
		song : "Плот"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Барыкин',
		song : "Букет"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Владимир Кузьмин',
		song : "Пристань твоей надежды"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Владимир Маркин',
		song : "Сиреневый туман"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Владимир Маркин',
		song : "Я готов целовать песок"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Николаев',
		song : "Королевство кривых зеркал"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Поверь в мечту"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Золотая лестница"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Лунная дорожка"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Зеркало"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Море"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Дорога к морю"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "На улице Каштановой"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Тальков',
		song : "Чистые пруды"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Скляр',
		song : "Комарово"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Тынис Мяги',
		song : "Я не умею танцевать"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Сергей Рогожин',
		song : "На соседней улице"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Анастасия"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Михаил Боярский',
		song : "Сивка-Бурка"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Ярослав Евдокимов',
		song : "Фантазёр"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Ярослав Евдокимов',
		song : "Колодец"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вячеслав Добрынин',
		song : "Синий Туман"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "20 лет спустя"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Николаев',
		song : "Старая Мельница"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Лоза',
		song : "Я умею мечтать"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Лоза',
		song : "Сто часов"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Лоза',
		song : "Баба Люба"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Крис Кельми',
		song : "Ночное рандеву"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Владимир Маркин',
		song : "Белая Черемуха"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "О тебе и обо мне"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Юрий Антонов',
		song : "Крыша дома твоего"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Скляр',
		song : "Старый рояль (ft Ольга Пирагс)"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Тынис Мяги',
		song : "Спасите разбитое сердце моё (Детектив)"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Тынис Мяги',
		song : "Олимпиада-80"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Андрей Державин',
		song : "Катя-Катерина"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Саруханов',
		song : "Дорогие мои старики"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Игорь Саруханов',
		song : "Зелёные глаза"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Виктор Попов',
		song : "Ты не забывай (ft Твой день)"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Дмитрий Маликов',
		song : "До завтра"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Дмитрий Маликов',
		song : "Студент"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Дмитрий Маликов',
		song : "Брачный кортеж"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Дмитрий Маликов',
		song : "Ты моей никогда не будешь"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Дмитрий Маликов',
		song : "Все Вернется"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Дмитрий Маликов',
		song : "Сторона родная"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Лев Лещенко',
		song : "До свидания, Москва (ft Татьяна Анциферова)"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Лев Лещенко',
		song : "Где мой дом родной"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Михаил Муромов',
		song : "Яблоки на снегу"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Серов',
		song : "Мадонна"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Серов',
		song : "Ты меня любишь"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Серов',
		song : "Круиз (ft Ольга Зарубина)"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Серов',
		song : "Как быть"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Серов',
		song : "Междугородный разговор (ft Татьяна Анциферова)"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Сергей Беликов',
		song : "Снится мне деревня"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Сергей Беликов',
		song : "Радуга"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Сергей Беликов',
		song : "Живи родник"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вилли Токарев',
		song : "В шумном балагане"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вилли Токарев',
		song : "Над Гудзоном"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вилли Токарев',
		song : "Небоскребы"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вахтанг Кикабидзе',
		song : "Проводы любви"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Вахтанг Кикабидзе',
		song : "Мои года – моё богатство"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Владимир Пресняков',
		song : "Белый снег"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Владимир Пресняков',
		song : "Зурбаган"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Алексей Глызин',
		song : "Зимний сад"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Николай Гнатюк',
		song : "Птица счастья"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Николай Гнатюк',
		song : "Танец на барабане"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Валерий Леонтьев',
		song : "Полет на дельтаплане"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Валерий Леонтьев',
		song : "Маргарита"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Валерий Леонтьев',
		song : "Разноцветные ярмарки"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Валерий Леонтьев',
		song : "Зеленый свет"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Валерий Леонтьев',
		song : "Наедине со всеми"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Александр Розенбаум',
		song : "Утинная охота"
	},
	{
		pack : RU_1980_M_PACK_1,
		group : 'Владимир Высоцкий',
		song : "Все не так, ребята"
	},
	{
		pack : RU_1980_M_PACK_2,
		group : 'Алексей Вишня',
		song : "Танцы на битом стекле"
	}
];

let ru_1980_m_1 =	ru_1980_m.filter(item => item.pack == 1);
let ru_1980_m_2 =	ru_1980_m.filter(item => item.pack == 2);

let ru_1980_f = [
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
		group : 'Алла Пугачёва',
		song : "А знаешь, всё ещё будет (ft Кристина Орбакайте)"
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
		group : 'Лайма Вайкуле',
		song : "Вернисаж (ft Валерий Леонтьев)"
	},
	{
		id : 63,
		group : 'Ирина Аллегрова',
		song : "Найди меня"
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
		group : 'Маша Распутина',
		song : "Дождь прошёл"
	},
	{
		group : 'Эдита Пьеха',
		song : "Город детства"
	},
	{
		group : 'Эдита Пьеха',
		song : "Дорога домой"
	},
	{
		group : 'Эдита Пьеха',
		song : "Нам рано жить воспоминаниями"
	},
	{
		group : 'Эдита Пьеха',
		song : "Ссорятся люди"
	},
	{
		group : 'Эдита Пьеха',
		song : "Дети Земли"
	},
	{
		group : 'Ирина Отиева',
		song : "Последняя поэма"
	},
	{
		group : 'Ирина Отиева',
		song : "Карточный домик"
	},
	{
		group : 'Ирина Отиева',
		song : "Ведьма-речка"
	},
	{
		group : 'Алиса Мон',
		song : "Подорожник"
	},
	{
		group : 'Алиса Мон',
		song : "Возьми моё сердце"
	},
	{
		group : 'Янка Дягилева',
		song : "От большого ума"
	},
	{
		group : 'Татьяна Дасковская',
		song : "Прекрасное Далеко"
	},
	{
		group : 'Людмила Сенчина',
		song : "Страна детства"
	},
	{
		group : 'Алла Пугачёва',
		song : "Воздушный змей"
	},
	{
		group : 'Алла Пугачёва',
		song : "Делу время"
	}
];

const ru_1990_gr_icon = [
	'ru_pop_m',
	'ru_pop_f',
	'ru_rock_1',
	'ru_rock_2'
];

const RU_1990_GR_PACK_1 = 1;
const RU_1990_GR_PACK_2 = 2;
const RU_1990_GR_PACK_3 = 3;
const RU_1990_GR_PACK_4 = 4;

let ru_1990_gr = [
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Руки Вверх',
			song : 'Малыш',
			state: ' по Рукам Вверх'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Технология',
			song : 'Нажми на кнопку',
			state: ' по Технологии'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Русский размер',
			song : 'Юаю',
			state: ' по Русскому Размеру'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ногу свело',
			song : 'Московский романс'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Забытый Разговор',
			song : 'Арабское золото',
			state: ' по Забытому Разговору'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : 'Любите девушки',
			state: ' по Браво'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Иванушки International',
			song : 'Кукла',
			state: ' по Иванушкам',
			shorten: 'Иванушки'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Стелла',
			song : 'Позови',
			state: ' по Стелле'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "A’Studio",
			song : 'Нелюбимая',
			state: " по A’Studio"
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "На-на",
			song : 'Шляпа',
			state: " по На-на"
		},		
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Океан Эльзы',
			song : 'Коли тебе нема'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "Фристайл",
			song : 'Кораблик любви',
			state: " по Фристайл"
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Леприконсы',
			song : 'Москвич'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Отпетые мошенники',
			song : 'Я учусь танцевать'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "Шоколад",
			song : 'Улыбнись',
			state: " по Шоколаду"
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "Арамис",
			song : 'Девочка ждет, мальчик не идет',
			state: " по Арамису"
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "Божья Коровка",
			song : 'Гранитный камушек',
			state: " по Божьей Коровке"
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Hi-Fi',
			song : 'Не дано',
			state: ' по Hi-Fi'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Руки Вверх',
			song : 'Назови его как меня'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Руки Вверх',
			song : 'Последний поцелуй',
			state: ' по Рукам Вверх'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Кар-Мэн',
			song : 'Париж',
			state: ' по Кар-Мэн'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Отпетые мошенники',
			song : 'Девушки бывают разные'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Твой день',
			song : 'Ху-ан-хэ – жёлтая река'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Иванушки International',
			song : 'Колечко',
			state: ' по Иванушкам',
			shorten: 'Иванушки'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Отпетые мошенники',
			song : 'Люби меня, люби'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Турбомода',
			song : 'Турболюбовь'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Электронный мальчик',
			song : 'Видеосалон',
			state: ' по Электронному мальчику'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Hi-Fi',
			song : 'Беспризорник'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Hi-Fi',
			song : 'Пионер'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Электронный мальчик',
			song : 'Дитер Болен Не Курит',
			state: ' по Электронному мальчику'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Технология',
			song : 'Странные танцы',
			state: ' по Технологии'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Технология',
			song : 'Всё, что ты хочешь',
			state: ' по Технологии'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Технология',
			song : 'Полчаса',
			state: ' по Технологии'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Комиссар',
			song : 'Дрянь'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Комиссар',
			song : 'Ты уйдёшь'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Комиссар',
			song : 'Я тебе объявляю войну'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Комиссар',
			song : 'Адреналин'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Белый Орел',
			song : 'Потому что нельзя быть красивой такой'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "На-на",
			song : 'Фаина'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "На-на",
			song : 'Похитительница Сна'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "Стекловата",
			song : 'Новый год'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : 'Девчонка 16 лет'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : 'Вася'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : 'Московский бит'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : 'Чёрный кот'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : 'Этот город'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Браво',
			song : '20-й век'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Леприконсы',
			song : 'Хали-гали, паратрупер'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Фактор 2',
			song : 'Красавица'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Фактор 2',
			song : 'Шалава'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Дюна',
			song : 'Привет с большого бодуна'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Мальчишник',
			song : 'Ночь'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Мальчишник',
			song : 'Последний раз'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "Фристайл",
			song : 'Ах, какая женщина...'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : "A’Studio",
			song : 'Солдат любви'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Рок-острова',
			song : 'Ничего не говори'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Русский размер',
			song : 'Ангел дня'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Русский размер',
			song : 'Вот так'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : '140 ударов в минуту',
			song : 'Тополя'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : '140 ударов в минуту',
			song : 'Я тебя люблю'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : "Демо",
			song : '2000 лет',
			state: " по Демо"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Блестящие',
			song : 'Ча-ча-ча',
			state: ' по Блестящим'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Стрелки',
			song : 'На вечеринке',
			state: ' по Стрелкам'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Балаган Лимитед',
			song : 'Чё те надо',
			state: ' по Балагану Лимитед',
			shorten: 'Балаган LTD'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'ЛаМанш',
			song : 'Погляд'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Блестящие',
			song : 'Там, только там'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Блестящие',
			song : 'Цветы'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Блестящие',
			song : 'Облака'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Стрелки',
			song : 'Мамочка'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Стрелки',
			song : 'Ты бросил меня'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'МГК',
			song : 'Свечи'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Вирус',
			song : 'Ручки'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Вирус',
			song : 'Ты меня не ищи'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Неигрушки',
			song : '100 дней до приказа'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Гости из будущего',
			song : 'Зима в сердце'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Гости из будущего',
			song : 'Нелюбовь'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Восток',
			song : 'Танец жёлтых листьев'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Восток',
			song : 'Миражи'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Восток',
			song : 'До встречи'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Восток',
			song : 'Всё небо'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Ночные Снайперы',
			song : '31 весна'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Маша и медведи',
			song : 'Любочка'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Маша и медведи',
			song : 'Земля'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Маша и медведи',
			song : 'Рейкьявик'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Зараза'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Я обиделась'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'За пивом'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Хочешь, но молчишь'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Унесённые ветром',
			song : 'Какао'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Амега',
			song : 'Это была она'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Гости из будущего',
			song : 'Беги от меня'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "След на воде"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "Небо"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "Моя любовь"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "Домашний арест"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "Хороший парень"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "Девушка-зима"
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Лицей',
			song : "Красная помада"
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Кукрыниксы',
			song : 'Артист'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Кукрыниксы',
			song : 'Шторм'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Кукрыниксы',
			song : 'Вера'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Кукрыниксы',
			song : 'Экклезиаст'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Кукрыниксы',
			song : 'Последняя песня'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'Ау'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'Яблони'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'В платие белом'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'Розочка'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'Дружбан'
			
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'По аллеям'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'Спорт прошёл'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'НЛО'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Аквариум',
			song : 'Поезд в огне'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Аквариум',
			song : 'Не пей вина, Гертруда'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Аквариум',
			song : 'Древнерусская тоска'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Агата Кристи',
			song : 'Секрет'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Агата Кристи',
			song : 'Как на войне'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Агата Кристи',
			song : 'Опиум для никого'
		},		
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Лирика'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Солнышко лучистое'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : '30 лет'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Туман'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Твой звонок'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Ява'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Тёща'		
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Частушки'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Сектор Газа',
			song : 'Гуляй, мужик'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Би-2',
			song : 'Полковнику никто не пишет'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Би-2',
			song : 'Варвара'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Би-2',
			song : 'Серебро'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Би-2',
			song : 'Счастье'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Алиса',
			song : 'Путь домой'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Алиса',
			song : 'Веретено'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Nautilus Pompilius',
			song : 'Безымянная река'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Nautilus Pompilius',
			song : 'Прогулки по воде'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Nautilus Pompilius',
			song : 'Крылья'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Nautilus Pompilius',
			song : 'Зверь'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Алиса',
			song : 'Небо славян'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Ундервуд',
			song : 'Гагарин, я вас любила'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Конец Фильма',
			song : 'Здравствуй, небо в облаках'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Мумий Тролль',
			song : 'Лунные Девицы',
			state: ' по Мумий Троллю'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Леприконсы',
			song : 'Липа-облепиха'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Леприконсы',
			song : 'Вовочка'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Несчастный Случай',
			song : 'Генералы песчаных карьеров'		
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Несчастный Случай',
			song : 'Что ты имела в виду'		
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Танцы Минус',
			song : 'Иду'		
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Танцы Минус',
			song : 'Половинка'		
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Танцы Минус',
			song : 'Город'		
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Мегаполис',
			song : 'Звездочка'		
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : '7Б',
			song : 'Молодые ветра'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Сплин',
			song : 'Линия жизни'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Смысловые Галлюцинации',
			song : 'Розовые очки'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Смысловые Галлюцинации',
			song : 'Вечно молодой'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'АукцЫон',
			song : 'Дорога'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Пикник',
			song : 'Фиолетово-черный'
		},		
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Чиж & Co',
			song : 'О любви'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Чиж & Co',
			song : 'Фантом'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Пурген',
			song : 'Философия урбанистического безвремения'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Пурген',
			song : 'Kristall nacht'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Lumen',
			song : 'Сид и Нэнси'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Тараканы',
			song : 'Я смотрю на них'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Крематорий',
			song : 'Катманду'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Дорога'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Ты неси меня, река'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Комбат'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Солдат'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Атас'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Там, за туманами'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Позови меня тихо по имени'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Любэ',
			song : 'Конь'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Пикник',
			song : 'Там, на самом краю земли'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Пикник',
			song : 'Настоящие дни'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Ария',
			song : 'Беспечный ангел'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Ария',
			song : 'Потерянный рай'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Ария',
			song : 'Возьми мое сердце'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Ария',
			song : 'Ангельская пыль'
		},
		{
			pack : RU_1990_GR_PACK_4,
			group : 'Ария',
			song : 'Все, что было'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ляпис Трубецкой',
			song : 'Огоньки'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Леприконсы',
			song : 'Тополя'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Дюна',
			song : 'Страна Лимония'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Дюна',
			song : 'Пулемет'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Русский размер',
			song : 'Это весна'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Агата Кристи',
			song : 'Чёрная луна'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Господин Дадуда',
			song : 'Даду Внедреж'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Bad Balance',
			song : 'Город джунглей'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Bad Balance',
			song : 'Дети Сатаны'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Лесоповал',
			song : 'Столыпинский вагон'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Лесоповал',
			song : 'Я куплю тебе дом'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Гости из будущего',
			song : 'Время песок'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Вирус',
			song : 'Попрошу тебя'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Империя',
			song : 'Мой сон'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Империя',
			song : 'Поезд на Ленинград'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Леприконсы',
			song : 'Лена'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Дискотека Авария',
			song : 'Пей пиво!'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Ту-ту-ту'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Дискотека Авария',
			song : 'Давай, Авария!'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Кирпичи',
			song : 'Плюю я'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ногу свело',
			song : 'Хару мамбуру'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ногу свело',
			song : 'Лилипутская любовь'
		},
		{
			pack : RU_1990_GR_PACK_3,
			group : 'Ногу свело',
			song : 'Сибирская любовь'
		},
		{
			pack : RU_1990_GR_PACK_2,
			group : 'Земфира',
			song : 'Ромашки'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Амега',
			song : 'Новый год (ft Блестящие)'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Амега',
			song : 'Ноги'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Амега',
			song : 'Лететь'
		},
		{
			pack : RU_1990_GR_PACK_1,
			group : 'Турбомода',
			song : 'Позови'
		}
];

let ru_1990_gr_1 =	ru_1990_gr.filter(item => item.pack == 1);
let ru_1990_gr_2 =	ru_1990_gr.filter(item => item.pack == 2);
let ru_1990_gr_3 =	ru_1990_gr.filter(item => item.pack == 3);
let ru_1990_gr_4 =	ru_1990_gr.filter(item => item.pack == 4);

const ru_1990_m_icon = [
	'easy',
	'medium',
	'hard'
];

const RU_1990_M_PACK_1 = 1;
const RU_1990_M_PACK_2 = 2;
const RU_1990_M_PACK_3 = 3;

let ru_1990_m = [
		{
			pack : RU_1990_M_PACK_2,
			group : 'Кай Метов',
			song : 'Position №2',
			state: ' по Каю Метову'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Сергей Васюта',
			song : 'На белом покрывале января (ft. Сладкий Сон)',
			state: ' по Сергею Васюте',
			shorten: 'Васюта'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Профессор Лебединский',
			song : 'Бегут года',
			state: ' по Профессору Лебединскому (ft. Русский Размер)',
			shorten: 'Лебединский'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Ярослав Евдокимов',
			song : 'Фантазёр'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Сергей Минаев',
			song : '22 притопа',
			state: ' по Минаеву',
			shorten: 'Минаев'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : "Роман Жуков",
			song : 'Млечный путь',
			state: " по Жукову",
			shorten: 'Жуков'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Леонид Агутин',
			song : 'Хоп-хей Лала Лэй'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Юрий Шатунов',
			song : 'Розовый вечер'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : "Алексей Глызин",
			song : 'Зимний сад',
			state: " по Глызину",
			shorten: 'Глызин'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Михаил Шифутинский',
			song : '3-е Сентября'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Сергей Васюта',
			song : 'Снег на розах (ft. Сладкий Сон)',
			state: ' по Сергею Васюте',
			shorten: 'Васюта'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Леонид Агутин',
			song : 'Оле-оле'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Леонид Агутин',
			song : 'Кого не стоило бы ждать'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Михаил Шифутинский',
			song : 'Пальма де Майорка'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Крутой',
			song : 'Незаконченный роман (ft Ирина Аллегрова)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Казаченко',
			song : 'Белая метелица'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Казаченко',
			song : 'Больно мне, больно'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Вадим Казаченко',
			song : 'Жёлтые розы'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Тальков',
			song : 'Моя любовь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Тальков',
			song : 'Я вернусь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Тальков',
			song : 'Чистые пруды'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Егор Летов',
			song : 'Моя оборона'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Егор Летов',
			song : 'Всё идёт по плану'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Егор Летов',
			song : 'Далеко бежит дорога'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Михаил Круг',
			song : 'Владимирский централ'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Михаил Круг',
			song : 'Кольщик'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Ты не ангел'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Поздний вечер в Соренто'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Стас Михайлов',
			song : 'Тёмные глаза'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Стас Михайлов',
			song : 'Всё для тебя'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Серов',
			song : 'Я люблю тебя до слёз'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Андрей Державин',
			song : 'Не плачь, Алиса'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Андрей Державин',
			song : 'Чужая свадьба'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Андрей Державин',
			song : 'Песня о первой любви'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Николаев',
			song : 'Выпьем за любовь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Николаев',
			song : 'Такси (ft Наташа Королёва)'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Игорь Николаев',
			song : 'Старая Мельница'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Ефрем Амиратов',
			song : 'Молодая'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Роман Жуков',
			song : 'Фея'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Медляк'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Воздушный шар'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : 'Бег По Острию Ножа'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Роман Жуков',
			song : 'Первый снег'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Роман Жуков',
			song : 'Я люблю вас, девочки'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : 'Между мной и тобой'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Зима-холода'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Мальчик-бродяга'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Ночь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Без тебя'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Андрей Губин',
			song : 'Милая моя далеко'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Позови меня в ночи'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Глаза чайного цвета'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Вечерочки - вечерки'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Влад Сташевский',
			song : 'Девочка с перекрёсточка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Ты одна ты такая'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Звезда моя далёкая'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Кто тебе сказал'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Все вернется'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Дмитрий Маликов',
			song : 'Птицелов'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Ты не верь слезам'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Холодная луна'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Don-don-don'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Иволга'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Не надо, не плачь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Плачет девушка в автомате'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Студентка-практикантка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Осин',
			song : 'Попутчица'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Белоусов',
			song : 'Девчонка-девчоночка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Евгений Белоусов',
			song : 'Алёшка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Есаул'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Эскадрон'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Морячка'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Олег Газманов',
			song : 'Танцуй, пока молодой'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Танго разбитых сердец'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Девять хризантем'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Казанова'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Богдан Титомир',
			song : 'Делай как я'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Богдан Титомир',
			song : 'Ерунда'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Пресняков',
			song : 'Стюардесса по имени Жанна'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Пресняков',
			song : 'Замок из дождя'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Бегущая по волнам'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Зайка моя'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Мышь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Игорь Корнелюк',
			song : 'Дожди'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Игорь Корнелюк',
			song : 'Пора домой'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Аркадий Укупник',
			song : 'Я на тебе никогда не женюсь'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Аркадий Укупник',
			song : 'Сим-Сим'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Гарик Сукачёв',
			song : 'Моя бабушка курит трубку'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Мурат Насыров',
			song : 'Я это ты'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Мурат Насыров',
			song : 'Мальчик хочет в Тамбов'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Михаил Боярский',
			song : 'Спасибо родная'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Девушки из высшего общества'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Кузьмин',
			song : 'Я не забуду тебя никогда'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Кузьмин',
			song : 'Моя любовь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Владимир Кузьмин',
			song : 'Семь морей'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Григорий Лепс',
			song : 'Рюмка водки на столе'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Григорий Лепс',
			song : 'Самый лучший день'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Григорий Лепс',
			song : 'Натали'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Любовь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Дверь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Если просто'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Я люблю людей'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Дилер'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Дельфин',
			song : 'Я буду жить'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Сука Любовь (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Туда (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Мы Дети Большого Города (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Михей',
			song : 'Мы поплывем по волнам (ft Джуманджи)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Романс'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Я тебя люблю'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Паранойя'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Это здорово'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Носков',
			song : 'Снег'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Крылов',
			song : 'Девочка'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Крылов',
			song : 'Осень-золотые листопады (ft Александр Добронравов)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Крылов',
			song : 'Короче, я звоню из Сочи'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Женская Любовь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Научись играть на гитаре'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Пять минут'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Голубая луна (ft Борис Моисеев)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Щелкунчик (ft Борис Моисеев)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Лодочка (ft Николай Трубач)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Николай Трубач',
			song : 'Адреналин'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Лошадка'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Верхом на звезде'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Последняя песня'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Три слова'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Найк Борзов',
			song : 'Загадка'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Чумаков',
			song : 'Жених'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Чумаков',
			song : 'От весны до весны'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Сергей Чумаков',
			song : 'Гадюка'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорёк',
			song : 'Подождем мою маму'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Любимая моя'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Девушка у алтаря'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Я прихожу к тебе когда город спит'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Садовник'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Девочка-ночь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Вячеслав Быков',
			song : 'Девочка Моя'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Скрипка-лиса'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Желаю тебе'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Портрет в карандаше'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Дорогие мои старики'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Зеленые глаза'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Моя любовь по городу'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Бухта радости'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Маскарад'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Падал снег'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Падают листья'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Капитан Каталкин'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Мои финансы поют романсы'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Александр Буйнов',
			song : 'Шансоньетка (ft Ирина Аллегрова)'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Максим Фадеев',
			song : 'Беги по небу'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Витас',
			song : 'Опера 2'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Олег Пахомов',
			song : 'Белые лебеди'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Боже, какой пустяк'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Пуля'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Я постелю тебе под ноги небо'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Иванов',
			song : 'Моя неласковая русь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Филипп Киркоров',
			song : 'Единственная моя'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Гарик Сукачёв',
			song : 'А по асфальту каблучки'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Самба белого мотылька'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'То ли воля, то ли неволя'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Всё позади'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Письма издалека'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Счастье ты моё'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Алексей Глызин',
			song : 'Пепел любви'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Шура',
			song : 'Отшумели летние дожди'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Александр Градский',
			song : 'Песня без названия'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Леонтьев',
			song : 'Кaждый xoчeт любить'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Никита',
			song : 'Улетели навсегда'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Никита',
			song : 'Однажды'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Никита',
			song : 'С неба ты сошла'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Игорь Саруханов',
			song : 'Парень с гитарой'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Lambada'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'Давай, лавэ'
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Mr Credo',
			song : 'HSH-Bola'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Красиво'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Разведи огонь'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Валерий Меладзе',
			song : 'Сэра'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Серов',
			song : 'Мадонна'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Серов',
			song : 'Как быть'
		},
		{
			pack : RU_1990_M_PACK_1,
			group : 'Александр Серов',
			song : 'Ворованная ночь'
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Борис Моисеев',
			song : "Звёздочка"
		},
		{
			pack : RU_1990_M_PACK_3,
			group : 'Борис Моисеев',
			song : "Чёрный бархат"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : "Мажь вазелином"
		},
		{
			pack : RU_1990_M_PACK_2,
			group : 'Оскар',
			song : "Паноптикум"
		}
];

let ru_1990_m_1 =	ru_1990_m.filter(item => item.pack == 1);
let ru_1990_m_2 =	ru_1990_m.filter(item => item.pack == 2);
let ru_1990_m_3 =	ru_1990_m.filter(item => item.pack == 3);

const ru_1990_f_icon = [
	'easy',
	'medium',
	'hard'
];

const RU_1990_F_PACK_1 = 1;
const RU_1990_F_PACK_2 = 2;
const RU_1990_F_PACK_3 = 3;

let ru_1990_f = [
		{
			pack : RU_1990_F_PACK_1,
			group : 'Натали',
			song : 'Ветер с моря дул',
			state: ' по Натали'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Диана',
			song : 'Скатертью дорога',
			state: ' по Диане'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Каролина',
			song : 'Звёздный вечер'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Каролина',
			song : 'Мама, всё ОК'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Валерия',
			song : 'Моя Москва',
			state: ' по Валерии'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Светлана Рерих',
			song : 'Ладошки',
			state: ' по Рерих',
			shorten: 'Рерих'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Марина Хлебникова',
			song : 'Чашка Кофею',
			state: ' по Хлебниковой',
			shorten: 'Хлебникова'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Светлана Владимирская',
			song : 'Мальчик мой',
			state: ' по Владимирской',
			shorten: 'Владимирская'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Жанна Агузарова',
			song : 'Ты, только ты',
			state: ' по Агузаровой',
			shorten: 'Агузарова'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Валерия',
			song : 'Самолёт',
			state: ' по Валерии'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Долина',
			song : 'Льдинка'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Черникова',
			song : 'Влюблённый самолёт',
			state: ' по Черниковой',
			shorten: 'Черникова'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : "Алла Пугачёва",
			song : 'Позови меня с собой',
			state: " по Пугачёвой",
			shorten: 'Пугачёва'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Натали',
			song : 'Улыбочка',
			state: ' по Натали'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Лайма Вайкуле",
			song : 'Ещё не вечер',
			state: " по Лайме Вайкуле",
			shorten: 'Вайкуле'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лада Дэнс',
			song : 'Сотри кассету'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лада Дэнс',
			song : 'Аромат любви'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Света',
			song : 'Увидимся',
			state: ' по Свете'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Апина',
			song : 'Электричка',
			state: ' по Апиной',
			shorten: 'Апина'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Полина Ростова',
			song : 'По краю дождя',
			state: ' по Ростовой',
			shorten: 'Ростова'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лика Стар',
			song : 'Одинокая луна'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лада Дэнс',
			song : 'Жить нужно в кайф',
			state: ' по Ладе Дэнс'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Полина Ростова',
			song : 'Падала звезда'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Светлана Владимирская',
			song : 'Дави на газ'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Света',
			song : 'Дорога в аэропорт'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Светлана Разина',
			song : 'Каменный лев'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Светлана Рерих',
			song : 'Вредная девчонка'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Светлана Рерих',
			song : 'Дай мне музыку'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Татьяна Маркова',
			song : 'Я плачу'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Марина Журавлева',
			song : 'Белая черемуха'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лада Дэнс',
			song : 'Танцы у моря'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ника',
			song : 'Три хризантемы'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ника',
			song : 'Сколько Лет, Сколько зим'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ника',
			song : 'Это не мой секрет'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Алёна Иванцова',
			song : 'Человек дождя'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Линда',
			song : 'Ворона'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Линда',
			song : 'Мало огня'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Надежда Кадышева',
			song : 'Виновата ли я'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Надежда Кадышева',
			song : 'У церкви стояла карета'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Вика Цыганова',
			song : 'Приходите в мой дом'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Вика Цыганова',
			song : 'Гроздья рябины'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Вика Цыганова',
			song : 'Лето пьяное'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Вика Цыганова',
			song : 'Любовь и смерть'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Диана Гурцкая',
			song : 'Ты здесь'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Диана Гурцкая',
			song : 'Я не люблю тебя'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Диана Гурцкая',
			song : 'Волшебное стекло моей души'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Диана Гурцкая',
			song : 'Две луны'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Алиса Мон',
			song : 'Алмаз'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Настя',
			song : 'Голоса'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Яна',
			song : 'Одинокий голубь'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Яна',
			song : 'Сигаретный дым'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Яна',
			song : 'Хулиган'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Лена Зосимова',
			song : 'Подружки Мои, Не Ревнуйте'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Анастасия Минцковская',
			song : 'Губа не дура'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Алика Смехова',
			song : 'Не перебивай (ft Александр Буйнов)'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Саша',
			song : 'По ночному городу'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Саша',
			song : 'Это просто дождь'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Саша',
			song : 'Любовь — это война'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Свиридова',
			song : 'Бедная овечка'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Свиридова',
			song : 'Это ведь я'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Свиридова',
			song : 'Два ангела'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Свиридова',
			song : 'Розовый фламинго'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталья Ветлицкая',
			song : 'Лунный кот'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталья Ветлицкая',
			song : 'Playboy'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталья Ветлицкая',
			song : 'Посмотри в глаза'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталья Ветлицкая',
			song : 'Глупые мечты'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталья Ветлицкая',
			song : 'Была не была'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наташа Королёва',
			song : 'Желтые тюльпаны'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наташа Королёва",
			song : 'Маленькая страна'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наташа Королёва",
			song : 'Мужичок с гармошкой'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наташа Королёва",
			song : 'Серые Глаза'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталья Сенчукова",
			song : 'Я по тебе скучаю'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталья Сенчукова",
			song : 'Лодка'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталья Сенчукова",
			song : 'Ты меня обидел'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталия Гулькина",
			song : 'Айвенго'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталия Гулькина",
			song : 'Это Китай'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталия Гулькина",
			song : 'Мелодия любви'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Наталия Гулькина",
			song : 'Дискотека'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : "Татьяна Овсиенко",
			song : 'За розовым морем'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Овсиенко',
			song : 'Школьная пора'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Овсиенко',
			song : 'Колечко'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Овсиенко',
			song : 'Дальнобойщик'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Овсиенко',
			song : 'Женское счастье'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Овсиенко',
			song : 'Запомни меня'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Овсиенко',
			song : 'Капитан'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Фотография 9х12'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Привет, Андрей'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Младший лейтенант'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Угонщица'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Императрица'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'С днём рождения!'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Гарем'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Отпусти'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Серые глаза'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Да и нет'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Сокол ясный'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Голубые глазки'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Белый шарфик'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Бай-бай'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Солнечный друг'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Ирина Салтыкова',
			song : 'Огоньки'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Буланова',
			song : 'Ясный мой свет'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Буланова',
			song : 'Мой ненаглядный'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Буланова',
			song : 'Не плачь'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Буланова',
			song : 'Вот и солнце село'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Буланова',
			song : 'Ледяное сердце'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Татьяна Буланова',
			song : 'Старшая сестра'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Ля-ля-фа'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Художник, что рисует дождь'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Зимняя вишня'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Городок'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Осенний джаз'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Другая женщина'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Все в твоих руках'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Анжелика Варум',
			song : 'Королева (ft Леонид Агутин)'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Я останусь с тобой'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Клава'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Тараканы'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Белый мерседес'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Шарманщик'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Беспутная'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Ах, Одесса!..'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Хулиганчики'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Ты упал с луны'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Ты меня не буди'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Маша Распутина',
			song : 'Платье из роз'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алла Пугачёва',
			song : 'В Петербурге сегодня дожди'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алла Пугачёва',
			song : 'Две звезды (ft Владимир Кузьмин)'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алла Пугачёва',
			song : 'Настоящий Полковник'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алла Пугачёва',
			song : 'Любовь, похожая на сон'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Кристина Орбакайте',
			song : 'Позови меня'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Кристина Орбакайте',
			song : 'Ну почему?'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Кристина Орбакайте',
			song : 'Без тебя'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Апина',
			song : 'Узелки'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Апина',
			song : 'Леха'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Апина',
			song : 'Летучий голландец'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Апина',
			song : 'Ксюша'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Алёна Свиридова',
			song : 'Никто-никогда'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Натали',
			song : 'Черепашка'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталия Власова',
			song : 'Я у твоих ног'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Черникова',
			song : 'Ты не приходи (розовые очки)'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Черникова',
			song : 'Да ты не смейся'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Черникова',
			song : 'Одинокий волк'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Черникова',
			song : 'Тайна'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Долина',
			song : 'Погода в доме'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Долина',
			song : 'Стена'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лариса Долина',
			song : 'Прости меня'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лада Дэнс',
			song : 'Один раз в год сады цветут'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Лада Дэнс',
			song : 'Baby tonight'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Диана',
			song : 'Не говори'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Света',
			song : 'Не сходи с ума'
		},
		{
			pack : RU_1990_F_PACK_1,
			group : 'Наталья Сенчукова',
			song : 'Ты пришла любовь'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Ирина Аллегрова',
			song : 'Странник'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'София Ротару',
			song : 'Хуторянка'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'София Ротару',
			song : 'Каким ты был'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'София Ротару',
			song : 'Ночь любви'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'София Ротару',
			song : 'Нет мне места в твоём сердце'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'София Ротару',
			song : 'Было время'
		},
		{
			pack : RU_1990_F_PACK_2,
			group : 'Каролина',
			song : 'Дискобар'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ани Лорак',
			song : 'Манекенщица'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ани Лорак',
			song : 'Я вернусь'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ани Лорак',
			song : 'Считалочка'
		},
		{
			pack : RU_1990_F_PACK_3,
			group : 'Ани Лорак',
			song : 'Зеркала'
		}
];

let ru_1990_f_1 =	ru_1990_f.filter(item => item.pack == 1);
let ru_1990_f_2 =	ru_1990_f.filter(item => item.pack == 2);
let ru_1990_f_3 =	ru_1990_f.filter(item => item.pack == 3);

let ru_1990_minus = [
	{
		group : 'Александр Серов',
		song : "Я люблю тебя до слёз",
		type: "Исполнитель"
	},
	{
		group : 'Алексей Глызин',
		song : "Поздний вечер в Соренто",
		type: "Исполнитель"
	},
	{
		group : 'Алла Пугачёва',
		song : "Настоящий Полковник",
		type: "Исполнительница"
	},
	{
		group : 'Лада Дэнс',
		song : "Baby tonight",
		type: "Исполнительница"
	},
	{
		group : 'Lumen',
		song : "Сид и Нэнси",
		type: "Группа"
	},
	{
		group : 'Восток',
		song : "Танец жёлтых листьев",
		type: "Группа"
	},
	{
		group : 'Жуки',
		song : "Батарейка",
		type: "Группа"
	},
	{
		group : 'Божья Коровка',
		song : "Гранитный камушек",
		type: "Группа"
	},
	{
		group : 'Неигрушки',
		song : "100 дней до приказа",
		type: "Группа"
	},
	{
		group : 'Ирина Салтыкова',
		song : "Солнечный друг",
		type: "Исполнительница"
	},
	{
		group : 'Наталья Ветлицкая',
		song : "Лунный кот",
		type: "Исполнительница"
	},
	{
		group : 'София Ротару',
		song : "Каким ты был",
		type: "Исполнительница"
	},
	{
		group : 'Александр Буйнов',
		song : "Падают листья",
		type: "Исполнитель"
	},
	{
		group : 'Крематорий',
		song : "Катманду",
		type: "Группа"
	},
	{
		group : 'Игорь Тальков',
		song : "Чистые пруды",
		type: "Исполнитель"
	},
	{
		group : 'Михаил Круг',
		song : "Владимирский централ",
		type: "Исполнитель"
	},
	{
		group : 'Мурат Насыров',
		song : "Я это ты",
		type: "Исполнитель"
	},
	{
		group : 'Дмитрий Маликов',
		song : "Птицелов",
		type: "Исполнитель"
	},
	{
		group : 'Владимир Кузьмин',
		song : "Я не забуду тебя никогда",
		type: "Исполнитель"
	},
	{
		group : 'Алёна Свиридова',
		song : "Бедная овечка",
		type: "Исполнительца"
	}
];

const ru_2000_gr_icon = [
	'ru_rock',
	'ru_pop_m',
	'ru_pop_f_medium_1',
	'ru_pop_f_medium_2'
];

const RU_2000_GR_PACK_1 = 1;
const RU_2000_GR_PACK_2 = 2;
const RU_2000_GR_PACK_3 = 3;
const RU_2000_GR_PACK_4 = 4;

let ru_2000_gr = [
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Hi-Fi',
		song : "А мы любили"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Hi-Fi',
		song : "Седьмой лепесток"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Отпетые мошенники',
		song : "Девушки бывают разные"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Отпетые мошенники',
		song : "Граница (ft Леонид Агутин)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Отпетые мошенники',
		song : "А у реки"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Отпетые мошенники',
		song : "Обратите внимание"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискотека Авария',
		song : "Малинки (ft Жанна Фриске)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискотека Авария',
		song : "Небо"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бумбокс',
		song : "Вахтерам"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Иванушки International',
		song : "Реви"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Иванушки International',
		song : "Золотые облака"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Иванушки International',
		song : "Тополиный пух"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай вдвоём',
		song : "День рождения"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай вдвоём',
		song : "А ты все ждешь"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Уматурман',
		song : "Проститься"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Многоточие',
		song : "Щемит в душе тоска"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "Районы-кварталы"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "До скорой встречи!"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Quest Pistols',
		song : "Белая стрекоза любви"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "Вика"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "Ты узнаешь её"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "Плакала береза"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Другие правила',
		song : "Лети! Беги!"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дыши',
		song : "Взгляни на небо"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Сценакардия',
		song : "Времена года"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Градусы',
		song : "Режиссер"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "Всё, что тебя касается"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "25 этаж"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Hi-Fi',
		song : "Глупые люди"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Quest Pistols',
		song : "Я устал"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бумбокс',
		song : "Eva"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискотека Авария',
		song : "Если хочешь остаться"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискотека Авария',
		song : "Модный танец Арам Зам Зам"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "Напитки покрепче"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "Просто такая сильная любовь"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "Капканы"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Отпетые мошенники',
		song : "Моя звезда (ft Сливки)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Уматурман',
		song : "Прасковья"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Уматурман',
		song : "Дождь"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Уматурман',
		song : "Ночной дозор"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : "Брюнетки и блондинки"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай вдвоём',
		song : "Ласковая моя"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бутырка',
		song : "Запахло весной"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бутырка',
		song : "Аттестат"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Игра слов',
		song : "Алина Кабаева"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Нэнси',
		song : "Ты такая заводная"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Кораблики"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Банда',
		song : "Плачут небеса"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Пятница",
		song : "Солдат"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Triplex",
		song : "Бригада"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "5ivesta family",
		song : "Я буду (23-45)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Revoльvers",
		song : "Ты у меня одна"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Revoльvers",
		song : "Целуешь меня"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Каста",
		song : "Ревность"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Т9",
		song : "Ода нашей любви"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Бумер",
		song : "Не плачь"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : '140 ударов в минуту',
		song : 'Не сходи с ума'
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Блестящие',
		song : "А я всё летала"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Блестящие',
		song : "За четыре моря"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Моя попытка номер пять"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Бриллианты"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Я не вернусь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Мелом"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Никто"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Про любовь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Не виноватая я"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Серебро',
		song : "Song No.1"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Серебро',
		song : "Дыши (ft Баста)"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Серебро',
		song : "Опиум"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Серебро',
		song : "Скажи, не молчи"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Серебро',
		song : "Сладко"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Холодно"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Кто?"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Пять минут на любовь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Рефлекс',
		song : "Падали звезды"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Рефлекс',
		song : "Non-stop"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Я люблю тебя, Сергей"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Те, кто любит (ft Андрей Губин)"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Хочешь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Всего 15 лет"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Фанат"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Мальчик с открытки"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Девочка танцует"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Старший брат"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Оранжевое солнце"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Такси"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Солнце моё"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Весна"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Мне мальчик твой не нужен"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Роман"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Плохая девочка"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Одиночество любви"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Ева"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Так и быть"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Дождь по крыше"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Она не верит больше в любовь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Падает дождь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Как ты о нем мечтала"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Планета Пять"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Ты станешь взрослой"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Рыбка"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Ай-я"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Супер детка"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Quanto Costa"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Зажигают огоньки"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Блестящие',
		song : "Пальмы парами"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тату',
		song : "Нас не догонят"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тату',
		song : "Я сошла с ума"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Любовные Истории',
		song : "Школа"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Подиум',
		song : "Танцуй, пока молодая"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тотал',
		song : "Бьет по глазам"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тутси',
		song : "Самый-самый"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Город 312',
		song : "Останусь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Город 312',
		song : "Вне зоны доступа"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тату',
		song : "All about us"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Fleur',
		song : "Отречение"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Горячий шоколад',
		song : "Береги"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Сливки',
		song : "Самая лучшая (ft Анжелика Варум)"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Сливки',
		song : "Иногда"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Сливки',
		song : "Летели недели"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Ранетки',
		song : "Ангелы"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Ранетки',
		song : "Это все о ней"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Гости из будущего',
		song : "Грустные сказки"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Гости из будущего',
		song : "Зима в сердце"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Гости из будущего',
		song : "Метко"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Гости из будущего',
		song : "Почему ты"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Чили',
		song : "Лето"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Чили',
		song : "Сердце"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Вельвет',
		song : "Прости"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Инфинити',
		song : "Слезы вода"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Наоми я бы Кэмпбел"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Про красивую жизнь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Манхэттен"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Адьос"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Синьорита"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Не зарекайся"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Коламбия Пикчерз не представляет"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Полосы"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Не вспоминай"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "До весны"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Не под этим солнцем"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "Улетаю"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "S.O.S."
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "Две половинки"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "Ещё люблю"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Потап и Настя",
		song : "Непара"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Потап и Настя",
		song : "Почему молчишь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Потап и Настя",
		song : "Новый год"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Серебро"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Неприкасаемые',
		song : "Моя бабушка курит трубку"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ленинград',
		song : "Мне бы в небо"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Земфира',
		song : "До свиданья"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Невеста"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Танцы минус',
		song : "Половинка"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Сплин',
		song : "Моё сердце"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Смысловые Галлюцинации',
		song : "Вечно молодой"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чичерина',
		song : "Ту-лу-ла"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Кукрыниксы',
		song : "По раскрашенной душе"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ляпис Трубецкой',
		song : "Сочи"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Пикник',
		song : "Фиолетово-чёрный"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Агата Кристи',
		song : "Секрет"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Алиса',
		song : "Веретено"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'ДДТ',
		song : "Новое сердце"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чайф',
		song : "Время не ждёт"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Крематорий',
		song : "Катманду"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ю-питер',
		song : "Девушка по городу"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Пилот',
		song : "Тюрьма"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Тараканы',
		song : "Я смотрю на них"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Наив',
		song : "Суперзвезда"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Кирпичи',
		song : "Данила Блюз"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мельница',
		song : "Ночная Кобыла"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ночные снайперы',
		song : "Катастрофически"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Сурганова и Оркестр',
		song : "Мураками"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чичерина',
		song : "Жара"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Маша и медведи',
		song : "Земля"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Юта',
		song : "Хмель и солод"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Zdob si Zdub',
		song : "Видели ночь"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ундервуд',
		song : "Гагарин, я вас любила"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "Яды"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : '7Б',
		song : "Молодые ветра"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Animal ДжаZ',
		song : "Три полоски"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Воплi вiдоплясова',
		song : "День нароDjення"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Lumen',
		song : "Сид и Нэнси"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мёртвые дельфины',
		song : "На моей луне"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Amatory',
		song : "Дыши со мной"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Слот',
		song : "2 войны"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Catharsis',
		song : "Крылья"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Элизиум',
		song : "Острова"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Владивосток 2000"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Такие девчонки"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Контрабанды"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Алиса',
		song : "Пересмотри"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Танцы минус',
		song : "Ю"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Король и Шут',
		song : "В Париж — домой"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Король и Шут',
		song : "MTV"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Варвара"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Полковнику никто не пишет"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Моя любовь"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Сплин',
		song : "Весь этот бред"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чайф',
		song : "Нахреноза"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Смысловые Галлюцинации',
		song : "Зачем топтать мою любовь"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Смысловые Галлюцинации',
		song : "Полюса"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "За нами следят"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "Магнитофон"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "Пистолет"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Земфира',
		song : "Хочешь?"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Земфира',
		song : "Кто?"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ляпис Трубецкой',
		song : "Капитал"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : "Театр Теней",
		song : "Дорога всех ветров"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : "Stigmata",
		song : "Сентябрь"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : "Океан Эльзы",
		song : "Без бою"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : "Ва-Банкъ",
		song : "Украла"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'NikitA',
		song : "Верёвки"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Монокини',
		song : "Дотянуться до солнца"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Монокини',
		song : "Сидим на облаках"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Монокини',
		song : "До встречи на звезде"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Русский размер',
		song : 'Льдами'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Русский размер',
		song : '!Слушай'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Русский размер',
		song : 'До тебя'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Непара',
		song : 'Другая причина'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Непара',
		song : 'Плачь и смотри'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Непара',
		song : 'Бог тебя выдумал'
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Рефлекс',
		song : "Первый раз"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Каста',
		song : "Горячее время"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Челси',
		song : "Самая любимая"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Челси',
		song : "Почему"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Токио',
		song : "Мы будем вместе всегда"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Токио',
		song : "Кто я без тебя"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Токио',
		song : "Когда ты плачешь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Инфинити',
		song : "Где ты"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Инфинити',
		song : "Я не боюсь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тутси',
		song : "Чашка капучино"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тутси',
		song : "Сама по себе"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Амега',
		song : 'Десант'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Амега',
		song : 'Я летая пою'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Амега',
		song : 'Убегаю'
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Lumen',
		song : 'Кофе'
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ногу свело',
		song : 'Наши юные смешные голоса'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Отпетые мошенники',
		song : 'Насосы'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Звери',
		song : 'Дожди-пистолеты'
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Притяженья больше нет"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "ЛМЛ"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Перемирие"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Поцелуи"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Не оставляй меня, любимый"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Обмани, но останься"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Океан и три реки"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Биология"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Стоп стоп стоп"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : "Школа"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Твой или ничей"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Катя, возьми телефон"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Катя, возьми телефон"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай Вдвоём',
		song : "Желанная"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Каникулы'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Ассорти',
		song : 'Красивая любовь'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Ассорти',
		song : 'Зажги моё тело'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Хитрое солнышко'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Лето'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Мы будем вместе'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Море'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Зацелую'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Любовные Истории',
		song : 'Путь домой'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Як-40',
		song : "Девочка-луна"
	}
];

let ru_2000_gr_1 =	ru_2000_gr.filter(item => item.pack == 1);
let ru_2000_gr_2 =	ru_2000_gr.filter(item => item.pack == 2);
let ru_2000_gr_3 =	ru_2000_gr.filter(item => item.pack == 3);
let ru_2000_gr_4 =	ru_2000_gr.filter(item => item.pack == 4);

const ru_2000_m_icon = [
	'easy',
	'medium'
];

const RU_2000_M_PACK_1 = 1;
const RU_2000_M_PACK_2 = 2;	

let ru_2000_m = [
	{
		pack : RU_2000_M_PACK_1,
		group : 'Стас Пьеха',
		song : "Одна звезда"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дима Билан',
		song : "На берегу неба"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Кипелов',
		song : "Я свободен"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Иракли',
		song : "Лондон-Париж"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Вячеслав Бутусов',
		song : "Девушка по городу"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Николай Расторгуев',
		song : "Берёзы (ft Сергей Безруков)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Андрей Губин',
		song : "Такие девушки как звезды"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Андрей Губин',
		song : "Танцы"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Параллельные"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дима Билан',
		song : "Невозможное возможно"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дима Билан',
		song : "Мулатка"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Филипп Киркоров',
		song : "Просто подари"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Леонтьев',
		song : "Августин"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Влад Топалов',
		song : "За любовь твою"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Александр Маршал',
		song : "Белый пепел"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Игорь Корнелюк',
		song : "Город, которого нет"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Григорий Лепс',
		song : "Рюмка водки"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Григорий Лепс',
		song : "Водопадом"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Данко',
		song : "Малыш"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Иракли',
		song : "Капли абсента"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Игорёк',
		song : "Грачи (ft ЭНДИ)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Александр Буйнов',
		song : "Песня о Настоящей Любви"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Стас Пьеха',
		song : "На ладони линия"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Сергей Трофимов',
		song : "Город в пробках"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Денис Майданов',
		song : "Вечная любовь"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Владимир Кузьмин',
		song : "Зачем уходишь ты?"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Шура',
		song : "Осень пришла"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Леонид Агутин',
		song : "Граница (ft Отпетые мошенники)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Леонид Агутин',
		song : "Аэропорты (ft Владимир Пресняков)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Аркадиас',
		song : "Художник"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Абдулла',
		song : "Губки не целованы"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Чудная долина"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Эд Шульжевский',
		song : "My Baby"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Андрей Алексин',
		song : "Страшная"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Тимати',
		song : "Не сходи с ума"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'DJ SMASH',
		song : "Moscow Never Sleeps"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'DJ Дождик',
		song : "Почему же"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Noise MC',
		song : "За Закрытой Дверью"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Черный бумер"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Возле дома твоего"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Кружим по району"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Ностальгия (ft Lg)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Джаная (ft Dato)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Я Хочу Быть С Тобой (ft Бархат)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Лигалайз',
		song : "Моя Москва"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Юрий Шатунов',
		song : "Забудь"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Баста',
		song : "Моя игра"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Юрий Титов',
		song : "Понарошку"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Сергей Зверев',
		song : "Алла"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Джанго',
		song : "Холодная весна"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Отель"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Айдамир Мугу',
		song : "Чёрные Глаза"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Паскаль',
		song : "Шёлковое Сердце"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дмитрий Колдун',
		song : "Я для тебя"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дмитрий Колдун',
		song : "Звезда"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дмитрий Колдун',
		song : "Настройся на меня"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дмитрий Колдун',
		song : "Work Your Magic"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Слова Как Пули"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Не бойся и беги"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Безумие лета"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Капли"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита',
		song : "Я не люблю тебя (ft Анастасия Стоцкая)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Звезда востока"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Буду, думать"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Mr Credo',
		song : "Автобан"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Небеса"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Иностранец"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Валерий Меладзе',
		song : "Вопреки"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дима Билан',
		song : "Это была любовь"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дима Билан',
		song : "Changes"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Дима Билан',
		song : "Я твой номер один"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Антон Зацепин',
		song : "Ниже ростом только Губин"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Антон Зацепин',
		song : "Книжки о любви"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Антон Зацепин',
		song : "Улетаю"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'DJ SMASH',
		song : "Волна (ft Fast Food, Люды Соколовой и Павла «Снежка» Воли)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'DJ SMASH',
		song : "Любовь побеждает время (ft Дмитрий Дибров)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Юрий Шатунов',
		song : "Не бойся"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Юрий Шатунов',
		song : "Запиши мой голос на кассету"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Евгений Анегин',
		song : "Луна"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Евгений Анегин',
		song : "Песня О Любви"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Серёга',
		song : "Мой бит"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Никита Малинин',
		song : "Вспышка в ночи"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Борис Моисеев',
		song : "Петербург - Ленинград (ft Людмила Гурченко)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Борис Моисеев',
		song : "Sexual revolution (ft Стрелки)"
	},
	{
		pack : RU_2000_M_PACK_1,
		group : 'Борис Моисеев',
		song : "Две свечи (ft Алла Пугачёва)"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Децл',
		song : "Письмо"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Децл',
		song : "Legalize"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Децл',
		song : "Потабачим"
	},
	{
		pack : RU_2000_M_PACK_2,
		group : 'Леонид Руденко',
		song : "Everybody"
	}
];

let ru_2000_m_1 =	ru_2000_m.filter(item => item.pack == 1);
let ru_2000_m_2 =	ru_2000_m.filter(item => item.pack == 2);

const ru_2000_f_icon = [
	'medium',
	'hard'
];

const RU_2000_F_PACK_1 = 1;
const RU_2000_F_PACK_2 = 2;

let ru_2000_f = [
	{
		pack : RU_2000_F_PACK_1,
		group : 'Надежда Кадышева',
		song : "Широка река (ft. Антон Зацепин)"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Кристина Орбакайте',
		song : "Губки бантиком"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Ирина Дубцова',
		song : "О нём"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Верка Сердючка',
		song : "Жениха хотела (ft. Глюкоза)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Мика Ньютон',
		song : "Белые лошади"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Жанна Фриске',
		song : "Малинки (ft Дискотека Авария)"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Жанна Фриске',
		song : "Ла-ла-ла"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Жанна Фриске',
		song : "А на море белый песок"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Жанна Фриске',
		song : "Я была"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Жасмин',
		song : "Головоломка"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Жасмин',
		song : "Дольче вита"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Мара',
		song : "Холодным мужчинам"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Блондинка Ксю',
		song : "Вместо жизни"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Вика Дайнеко',
		song : "Я просто сразу от тебя уйду"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Вика Дайнеко',
		song : "Лейла"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Вика Дайнеко',
		song : "Клякса"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Катя Лель',
		song : "Мой мармеладный"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Катя Лель',
		song : "Долетай"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Катя Лель',
		song : "Муси-пуси"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Слава',
		song : "Попутчица"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Юлия Савичева',
		song : "Если в сердце живет любовь"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Юлия Савичева',
		song : "Привет"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Нюша',
		song : "Вою на луну"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Ирина Дубцова',
		song : "Как ты там"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ани Лорак',
		song : "Солнце"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Юлианна Караулова',
		song : "Я попала в сети"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Юлианна Караулова',
		song : "Я кину джокер на стол"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Настя Задорожная',
		song : "Буду"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Елена Терлеева',
		song : "Солнце"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Татьяна Буланова',
		song : "Мой сон (ft DJ Цветкоff)"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Кристина Орбакайте',
		song : "Перелётная птица"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Кристина Орбакайте',
		song : "Просто любить тебя (ft Авраам Руссо)"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Кристина Орбакайте',
		song : "Да-ди-дам"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Кристина Орбакайте',
		song : "Свет твоей любви"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Ирина Тонева',
		song : "Понимаешь (ft Павел Артемьев)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Зара',
		song : "Недолюбила"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Евгения Отрадная',
		song : "Зачем Любовь"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Евгения Отрадная',
		song : "Уходи и дверь закрой"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Алла Пугачёва',
		song : "Опять Метель"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Елена Ваенга',
		song : "Курю"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Лариса Черникова',
		song : "Тебя я ждала"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Дайкири',
		song : "Любишь - таешь"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Наталья Ветлицкая',
		song : "Изучай Меня"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Наталья Ветлицкая',
		song : "Половинки"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Анжелика Варум',
		song : "Не жди меня"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Анжелика Варум',
		song : "Стоп, любопытство"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Алёна Иванцова',
		song : "Все пройдет"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Катя Чехова',
		song : "Я — робот"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Максим',
		song : "Сон"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Максим',
		song : "Знаешь ли ты"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Максим',
		song : "Небо засыпай (ft Лигалайз)"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Акула',
		song : "Мало"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Акула',
		song : "Кислотный DJ"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Света',
		song : "Твои глаза"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Полина Гагарина',
		song : "Колыбельная"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Полина Гагарина',
		song : "Кому, зачем? (ft Ирина Дубцова)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Полина Гагарина',
		song : "Любовь под солнцем"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Полина Гагарина',
		song : "Я тебя не прощу никогда"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Полина Гагарина',
		song : "Я твоя"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анна Семенович',
		song : "На моря (ft Arash)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Бьянка',
		song : "Про лето"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Бьянка',
		song : "Несчастливая любовь"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Бьянка',
		song : "Были танцы"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Лера Массква',
		song : "7 этаж"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Мария Ржевская',
		song : "Когда я стану кошкой"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Линда',
		song : "Цепи и кольца"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Мара',
		song : "Самолеты"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Мара',
		song : "Дельфины"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Мара',
		song : "Целуя сердце"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : "Глюкоза",
		song : "Танцуй, Россия!!!"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : "Глюкоза",
		song : "Снег идёт"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : "Глюкоза",
		song : "Невеста"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Саша',
		song : "Не получилось, не срослось"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Саша',
		song : "За туманом"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Саша Project',
		song : "Говорила мама"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Саша Project',
		song : "Очень Нужен Ты"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Алекса',
		song : "Где же ты"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Алекса',
		song : "Лунная Тропа"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Алекса',
		song : "Я живу тобой"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Алекса',
		song : "Когда ты рядом (ft Тимати)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Рита Дакота',
		song : "Спички"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ангина',
		song : "Болела"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ангина',
		song : "Кому какое дело"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Алёна Свиридова',
		song : '17 лет'
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Алёна Свиридова',
		song : 'Самба прошедшей любви'
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Алёна Свиридова',
		song : 'Шу-би-ду'
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Алёна Свиридова',
		song : 'Не дам скучать'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Наталья Подольская',
		song : 'Nobody Hurt No One'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Наталья Подольская',
		song : 'Поздно'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Наталья Подольская',
		song : 'Одна'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Слава',
		song : 'Одиночество'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Слава',
		song : 'Классный'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Слава',
		song : 'Люблю или ненавижу'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Слава',
		song : 'В небо'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Слава',
		song : 'Восьмёрка на нули'
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анастасия Стоцкая',
		song : "Can't take my eyes off you"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анастасия Стоцкая',
		song : "Вены-реки"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анастасия Стоцкая',
		song : "Дай мне 5 минут"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анастасия Стоцкая',
		song : "И ты скажешь (ft Филипп Киркоров)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анастасия Стоцкая',
		song : "Tease"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Анастасия Стоцкая',
		song : "Shadows dance all around me"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Ты грустишь (ft Стас Пьеха)"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Маленький самолёт"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Нежность моя"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Я лечу"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Мы вместе"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Разрушить любовь"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Никто, как ты"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Валерия',
		song : "Капелькою"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ани Лорак',
		song : "Smile"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ани Лорак',
		song : "Верни мою любовь (ft Валерий Меладзе)"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ани Лорак',
		song : "С первого взгляда"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ани Лорак',
		song : "Shady Lady"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Ани Лорак',
		song : "Небеса-ладони"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Кристина Орбакайте',
		song : "Май"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Наталья Ветлицкая',
		song : "Мальчики"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : 'Лера Массква',
		song : "Разные"
	},
	{
		pack : RU_2000_F_PACK_1,
		group : "Глюкоза",
		song : "Юра"
	},
	{
		pack : RU_2000_F_PACK_2,
		group : 'Бьянка',
		song : "Мулен Руж"
	}
];

let ru_2000_f_1 =	ru_2000_f.filter(item => item.pack == 1);
let ru_2000_f_2 =	ru_2000_f.filter(item => item.pack == 2);

let ru_2000_minus = [
	{
		group : 'Бумбокс',
		song : "Вахтерам",
		type: "Группа"
	},
	{
		group : 'Звери',
		song : "Брюнетки и блондинки",
		type: "Группа"
	},
	{
		group : 'Иванушки International',
		song : "Золотые облака",
		type: "Группа"
	},
	{
		group : 'Уматурман',
		song : "Прасковья",
		type: "Группа"
	},
	{
		group : 'Чай вдвоём',
		song : "День рождения",
		type: "Группа"
	},
	{
		group : 'Блестящие',
		song : "Пальмы парами",
		type: "Группа"
	},
	{
		group : 'Винтаж',
		song : "Роман",
		type: "Группа"
	},
	{
		group : 'Пропаганда',
		song : "Мелом",
		type: "Группа"
	},
	{
		group : 'Валерий Кипелов',
		song : "Я свободен",
		type: "Исполнитель"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Августин",
		type: "Исполнитель"
	},
	{
		group : 'Григорий Лепс',
		song : "Рюмка водки",
		type: "Исполнитель"
	},
	{
		group : 'Елена Ваенга',
		song : "Курю",
		type: "Исполнительница"
	},
	{
		group : 'Жасмин',
		song : "Головоломка",
		type: "Исполнительница"
	},
	{
		group : 'Максим',
		song : "Знаешь ли ты",
		type: "Исполнительница"
	} 
];

let ru_2007 = [
	{
		id : 1,
		group : 'Максим',
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

let ru_2010_gr_1 = [
	{
		id : 1,
		group : 'Чай вдвоём',
		song : "Белое платье"
	},
	{
		id : 2,
		group : 'Любэ',
		song : "Всё опять начинается"
	},
	{
		id : 4,
		group : 'Потап и Настя',
		song : "Чумачечая весна"
	},
	{
		id : 5,
		group : 'Потап и Настя',
		song : "Если вдруг"
	},
	{
		id : 6,
		group : 'Градусы',
		song : "Голая"
	},
	{
		id : 7,
		group : 'Reflex',
		song : "Я буду небом твоим"
	},
	{
		id : 8,
		group : '5ivesta Family',
		song : "Вместе мы"
	},
	{
		id : 9,
		group : 'Дискотека Авария ft. Орбакайте Кристина',
		song : "Прогноз погоды"
	},
	{
		id : 10,
		group : 'Градусы',
		song : "Заметает"
	},
	{
		id : 11,
		group : 'Пикник',
		song : 'Сияние'
	},
	{
		id : 12,
		group : 'Burito',
		song : "По волнам"
	}
];

let ru_2010_gr_2 = [
	{
		id : 1,
		group : 'ДДТ',
		song : "Песня о свободе"
	},
	{
		id : 2,
		group : 'Hatters',
		song : "Да, со мной не просто"
	},
	{
		id : 3,
		group : 'Сплин',
		song : "Когда пройдёт 100 лет"
	},
	{
		id : 4,
		group : 'Алиса',
		song : "Дождь и я"
	},
	{
		id : 5,
		group : 'Мумий Тролль',
		song : "Девочкодруг"
	},
	{
		id : 6,
		group : 'Ю-Питер',
		song : "Дети минут"
	},
	{
		id : 7,
		group : 'Stigmata',
		song : "Время"
	},
	{
		id : 8,
		group : 'СерьГа',
		song : "Детское сердце"
	},
	{
		id : 9,
		group : 'Би-2',
		song : "Компромисс"
	},
	{
		id : 10,
		group : 'Тараканы',
		song : "Пойдём на улицу!"
	},
	{
		id : 11,
		group : 'Чайф',
		song : "Про бобра и барабан"
	},
	{
		id : 12,
		group : 'Ночные Снайперы',
		song : "Поговори со мной, Ольга"
	},
	{
		id : 13,
		group : 'Ленинград',
		song : "В Питере — пить"
	},
	{
		id : 14,
		group : 'Animal ДжаZ',
		song : "Здесь и сейчас"
	},
	{
		id : 15,
		group : 'Мураками',
		song : "Нулевой километр"
	},
	{
		id : 16,
		group : 'Кукрыниксы',
		song : "Жизнь бывает разная!"
	},
	{
		id : 17,
		group : 'АукцЫон',
		song : "Огонь"
	},
	{
		id : 18,
		group : 'Louna',
		song : "Бойцовский клуб"
	},
	{
		id : 19,
		group : 'Машина времени',
		song : "Однажды"
	},
	{
		id : 20,
		group : 'Lumen',
		song : "Дух времени"
	},
	{
		id : 21,
		group : 'Сплин',
		song : "Рай в шалаше"
	}
];

let ru_2010_m_1 = [
	{
		id : 1,
		group : 'Сергей Трофимов',
		song : "Не расказывай"
	},
	{
		id : 2,
		group : 'Митя Фомин',
		song : "Ла-Ла"
	},
	{
		id : 3,
		group : 'Стас Михайлов',
		song : "Отпусти (ft Таисия Повалий)"
	},
	{
		id : 4,
		group : 'Филипп Киркоров',
		song : "Струны"
	},
	{
		id : 5,
		group : 'Киркоров Филипп',
		song : "Голос (ft Нетребко Анна)"
	},
	
	{
		id : 6,
		group : 'Филипп Киркоров',
		song : "Снег"
	},
	{
		id : 7,
		group : 'Стас Пьеха',
		song : "Я и ты (ft Слава)"
	},
	{
		id : 8,
		group : 'Григорий Лепс',
		song : "Самый лучший день"
	},
	{
		id : 9,
		group : 'Митя Фомин',
		song : "Paninaro (Огни большого города)"
	},
	{
		id : 10,
		group : 'Стас Михайлов',
		song : "Только ты"
	},
	{
		id : 11,
		group : 'Дима Билан',
		song : "Я просто люблю тебя"
	},
	{
		id : 12,
		group : 'Доминик Джокер',
		song : "Если ты со мной"
	},
	{
		id : 13,
		group : 'Григорий Лепс',
		song : "Я стану водопадом"
	},
	{
		id : 14,
		group : 'Филипп Киркоров',
		song : "Я отпускаю тебя"
	},
	{
		id : 15,
		group : 'Иракли',
		song : "Нелюбовь (ft Даша Суворова)"
	},
	{
		id : 16,
		group : 'Стас Пьеха',
		song : "Старая история"
	},
	{
		id : 17,
		group : 'Джиган',
		song : "Нас больше нет"
	},
	{
		id : 18,
		group : 'Dan Balan',
		song : "Лишь до утра"
	},
	{
		id : 19,
		group : 'Семён Слепаков',
		song : "Круглосуточно красивая женщина"
	},
	{
		id : 20,
		group : 'Григорий Лепс',
		song : "Я счастливый"
	}
];

let ru_2010_m_2 = [
	{
		id : 1,
		group : 'Егор Крид',
		song : "Больше, чем любовь (ft Алексей Воробьёв)"
	},
	{
		id : 2,
		group : 'Егор Крид',
		song : "Надо ли"
	},
	{
		id : 3,
		group : 'Егор Крид',
		song : "Самая-самая"
	},
	{
		id : 4,
		group : 'Егор Крид',
		song : "Невеста"
	},
	{
		id : 5,
		group : 'Егор Крид',
		song : "Будильник"
	},
	{
		id : 6,
		group : 'Егор Крид',
		song : "Мне нравится"
	},
	{
		id : 7,
		group : 'Егор Крид',
		song : "Если ты меня не любишь (ft Molly)"
	},
	{
		id : 8,
		group : 'Егор Крид',
		song : "Потрачу"
	},
	{
		id : 9,
		group : 'Егор Крид',
		song : "Часики (ft Валерия)"
	},
	{
		id : 10,
		group : 'Егор Крид',
		song : "Цвет настроения чёрный"
	},
	{
		id : 11,
		group : 'Макс Корж',
		song : "Небо поможет нам"
	},
	{
		id : 12,
		group : 'Макс Корж',
		song : "Малый повзрослел"
	},
	{
		id : 13,
		group : 'Макс Корж',
		song : "Это наш путь"
	},
	{
		id : 14,
		group : 'Иван Дорн',
		song : "Бигуди"
	},
	{
		id : 15,
		group : 'Баста',
		song : "Сансара"
	},
	{
		id : 16,
		group : 'Баста',
		song : "Солнца не видно"
	},
	{
		id : 17,
		group : 'Баста',
		song : "Вселенная"
	},
	{
		id : 18,
		group : 'Баста',
		song : "Каменные цветы"
	},
	{
		id : 19,
		group : 'Баста',
		song : "Райские яблоки"
	},
	{
		id : 20,
		group : 'Иван Дорн',
		song : "Северное сияние"
	},
	{
		id : 21,
		group : 'Иван Дорн',
		song : "Школьное окно"
	},
	{
		id : 22,
		group : 'Иван Дорн',
		song : "Стыцамэн"
	}
];

let ru_2010_f = [
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
		group : 'Валерия',
		song : "Капелькой неба"
	},
	{
		id : 4,
		group : 'Ирина Аллегрова',
		song : "Не обернусь"
	},
	{
		id : 5,
		group : 'Ани Лорак',
		song : "С первого взгляда"
	},
	{
		id : 6,
		group : 'Нюша',
		song : "Выбирать чудо"
	},
	{
		id : 7,
		group : 'Зара',
		song : "Недолюбила"
	},
	{
		id : 8,
		group : 'Елена Ваенга',
		song : "Аэропорт"
	},
	{
		id : 9,
		group : 'Жанна Фриске',
		song : "А на море белый песок"
	},
	{
		id : 10,
		group : 'Ёлка',
		song : "Прованс"
	},
	{
		id : 11,
		group : 'Вера Брежнева',
		song : "Реальная жизнь"
	},
	{
		id : 12,
		group : 'Ёлка',
		song : "На большом воздушном шаре"
	},
	{
		id : 13,
		group : 'Зара',
		song : "Амели"
	},
	{
		id : 14,
		group : 'Виктория Дайнеко',
		song : "Сотри его из memory"
	},
	{
		id : 15,
		group : 'Нюша',
		song : "Воспоминание"
	},
	{
		id : 16,
		group : 'Ёлка',
		song : "Около тебя"
	},
	{
		id : 17,
		group : 'Полина Гагарина',
		song : "Спектакль окончен"
	},
	{
		id : 18,
		group : 'Елена Ваенга',
		song : "Шопен"
	},
	{
		id : 19,
		group : 'Слава',
		song : "Sex не любовь"
	},
	{
		id : 20,
		group : 'Анита Цой',
		song : "Зима-Лето"
	},
	{
		id : 21,
		group : 'Натали',
		song : "О боже, какой мужчина"
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
		group : 'Руки Вверх',
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
		group : 'Максим',
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


// Other formats

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
			group : 'SNAP',
			song : 'SNAP "Rythm is a Dancer"',
			state: ' по SNAP'
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

let ru_kish_gr_album_1 =	ru_kish_gr.filter(item => item.song == 'Камнем по голове');
let ru_kish_gr_album_2 =	ru_kish_gr.filter(item => item.song == 'Будь как дома, путник');
let ru_kish_gr_album_3 =	ru_kish_gr.filter(item => item.song == 'Акустический Альбом');
let ru_kish_gr_album_4 =	ru_kish_gr.filter(item => item.song == 'Герои и Злодеи');
let ru_kish_gr_album_5 =	ru_kish_gr.filter(item => item.song == 'Как в старой сказке');
let ru_kish_gr_album_6 =    ru_kish_gr.filter(item => item.song == 'Жаль, нет ружья');
let ru_kish_gr_album_7 =	ru_kish_gr.filter(item => item.song == 'Бунт на корабле');
let ru_kish_gr_album_8 =	ru_kish_gr.filter(item => item.song == 'Продавец Кошмаров');
let ru_kish_gr_album_9 =	ru_kish_gr.filter(item => item.song == 'Тень Клоуна');
let ru_kish_gr_album_10 =	ru_kish_gr.filter(item => item.song == 'Театр Демона');
let ru_kish_gr_album_11 =	ru_kish_gr.filter(item => item.song == 'Todd. Акт 1 – Праздник Крови' ||
													  item.song == 'Todd. Акт 2 – На краю');

let ru_kish_gr_1 = [
	{
		group : 'Смельчак и ветер',
		song : "Камнем по голове"
	},
	{
		group : 'Проказник скоморох',
		song : "Камнем по голове"
	},
	{
		group : 'Верная жена',
		song : "Камнем по голове"
	},
	{
		group : 'Садовник',
		song : "Камнем по голове"
	},
	{
		group : 'Блуждают тени',
		song : "Камнем по голове"
	},
	{
		group : 'Внезапная голова',
		song : "Камнем по голове"
	},
	{
		group : 'Шар голубой',
		song : "Камнем по голове"
	},
	{
		group : 'Злодей и шапка',
		song : "Камнем по голове"
	},
	{
		group : 'От женщин кругом голова',
		song : "Камнем по голове"
	},
	{
		group : 'Рыбак',
		song : "Камнем по голове"
	},
	{
		group : 'Мотоцикл',
		song : "Камнем по голове"
	},
	{
		group : 'Холодное тело',
		song : "Камнем по голове"
	},
	{
		group : 'Дурак и молния',
		song : "Камнем по голове"
	},
	{
		group : 'Леший обиделся',
		song : "Камнем по голове"
	},
	{
		group : 'Два вора и монета',
		song : "Камнем по голове"
	},
	{
		group : 'Любовь и пропеллер',
		song : "Камнем по голове"
	},
	{
		group : 'Камнем по голове',
		song : "Камнем по голове"
	},
	{
		group : 'С тех пор, как он ушел',
		song : "Камнем по голове"
	},
	{
		group : 'В доме суета',
		song : "Камнем по голове"
	},
	{
		group : 'Мария',
		song : "Камнем по голове"
	}
];

let ru_kish_gr_2 = [
	{
		group : 'Король и шут',
		song : "Будь как дома, путник"
	},
	{
		group : 'Два друга и разбойники',
		song : "Будь как дома, путник"
	},
	{
		group : 'Сапоги мертвеца',
		song : "Будь как дома, путник"
	},
	{
		group : 'Охотник',
		song : "Будь как дома, путник"
	},
	{
		group : 'Паника в селе',
		song : "Будь как дома, путник"
	},
	{
		group : 'Истинный убийца',
		song : "Будь как дома, путник"
	},
	{
		group : 'Лесник',
		song : "Будь как дома, путник"
	},
	{
		group : 'Помоги мне',
		song : "Будь как дома, путник"
	},
	{
		group : 'История о мертвой женщине',
		song : "Будь как дома, путник"
	},
	{
		group : 'Кукольный театр',
		song : "Будь как дома, путник"
	},
	{
		group : 'Валет и дама',
		song : "Будь как дома, путник"
	},
	{
		group : 'Веселые тролли',
		song : "Будь как дома, путник"
	},
	{
		group : 'Он не знает, что такое жить',
		song : "Будь как дома, путник"
	},
	{
		group : 'Отец и маски',
		song : "Будь как дома, путник"
	},
	{
		group : 'Сказка про дракона',
		song : "Будь как дома, путник"
	},
	{
		group : 'Инструмент',
		song : "Будь как дома, путник"
	},
	{
		group : 'Собрание',
		song : "Будь как дома, путник"
	}
];

let ru_kish_gr_3 = [
    {
		group : 'Кукла колдуна',
		song : "Акустический Альбом"
	},
	{
		group : 'Наблюдатель',
		song : "Акустический Альбом"
	},
	{
		group : 'Бедняжка',
		song : "Акустический Альбом"
	},
	{
		group : 'Прыгну со скалы',
		song : "Акустический Альбом"
	},
	{
		group : 'Девушка и Граф',
		song : "Акустический Альбом"
	},
	{
		group : 'Песня мушкетёров',
		song : "Акустический Альбом"
	},
	{
		group : 'Тяни',
		song : "Акустический Альбом"
	},
	{
		group : 'Утренний рассвет',
		song : "Акустический Альбом"
	},
	{
		group : 'Сосиска',
		song : "Акустический Альбом"
	},
	{
		group : 'Спятил отец',
		song : "Акустический Альбом"
	},
	{
		group : 'Ведьма и осёл',
		song : "Акустический Альбом"
	},
	{
		group : 'Екатерина',
		song : "Акустический Альбом"
	},
	{
		group : 'Прерванная любовь, или Арбузная корка',
		song : "Акустический Альбом"
	},
	{
		group : 'Мотоцикл',
		song : "Акустический Альбом"
	},
	{
		group : 'Голые коки',
		song : "Акустический Альбом"
	},
	{
		group : 'Забытые ботинки',
		song : "Акустический Альбом"
	}
];

let ru_kish_gr_4 = [
	{
		group : 'Дед на свадьбе',
		song : "Герои и Злодеи"
	},
	{
		group : 'Запрет отца',
		song : "Герои и Злодеи"
	},
	{
		group : 'Кузнец',
		song : "Герои и Злодеи"
	},
	{
		group : 'Разговор с гоблином',
		song : "Герои и Злодеи"
	},
	{
		group : 'Что делал малыш',
		song : "Герои и Злодеи"
	},
	{
		group : 'Невеста палача',
		song : "Герои и Злодеи"
	},
	{
		group : 'Мастер приглашает в гости',
		song : "Герои и Злодеи"
	},
	{
		group : 'Бродяга и старик',
		song : "Герои и Злодеи"
	},
	{
		group : 'Смерть халдея',
		song : "Герои и Злодеи"
	},
	{
		group : 'Помнят с горечью древляне',
		song : "Герои и Злодеи"
	},
	{
		group : 'Про Ивана',
		song : "Герои и Злодеи"
	},
	{
		group : 'Воспоминания о былой любви',
		song : "Герои и Злодеи"
	}
];

let ru_kish_gr_5 = [
	{
		group : 'Гимн шута',
		song : "Как в старой сказке"
	},
	{
		group : 'Проклятый старый дом',
		song : "Как в старой сказке"
	},
	{
		group : 'Тайна хозяйки старинных часов',
		song : "Как в старой сказке"
	},
	{
		group : 'Кузьма и барин',
		song : "Как в старой сказке"
	},
	{
		group : 'Пират',
		song : "Как в старой сказке"
	},
	{
		group : 'Скотный двор',
		song : "Как в старой сказке"
	},
	{
		group : 'Возвращение колдуна',
		song : "Как в старой сказке"
	},
	{
		group : 'Зловещий кузен',
		song : "Как в старой сказке"
	},
	{
		group : 'Ответ – лютая месть',
		song : "Как в старой сказке"
	},
	{
		group : 'Рогатый',
		song : "Как в старой сказке"
	},
	{
		group : 'Двухголовый отпрыск',
		song : "Как в старой сказке"
	},
	{
		group : 'Два монаха в одну ночь',
		song : "Как в старой сказке"
	},
	{
		group : 'Кто это все придумал',
		song : "Как в старой сказке"
	},
	{
		group : 'Пивной череп',
		song : "Как в старой сказке"
	},
	{
		group : 'Парень и леший',
		song : "Как в старой сказке"
	},
	{
		group : 'Похороны панка',
		song : "Как в старой сказке"
	},
	{
		group : 'Воспоминания о былой любви',
		song : "Как в старой сказке"
	}
];

let ru_kish_gr_6 = [
	{
		group : 'Волосокрад',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Мертвый анархист',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Смешной совет',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Некромант',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Защитник свиней',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Генрих и смерть',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Жаль, нет ружья',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Представляю я',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Мой характер',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Песенка пьяного деда',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Вдова и Горбун',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Вино хоббитов',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Утопленник',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Медведь',
		song : "Жаль, нет ружья"
	},
	{
		group : 'Пьянка',
		song : "Жаль, нет ружья"
	}
];

let ru_kish_gr_7 = [
	{
		group : 'Хардкор по-русски',
		song : "Бунт на корабле"
	},
	{
		group : 'Исповедь вампира',
		song : "Бунт на корабле"
	},
	{
		group : 'Месть Гарри',
		song : "Бунт на корабле"
	},
	{
		group : 'Северный флот',
		song : "Бунт на корабле"
	},
	{
		group : 'Идол',
		song : "Бунт на корабле"
	},
	{
		group : 'Бунт на корабле',
		song : "Бунт на корабле"
	},
	{
		group : 'Хороший пират – мертвый пират',
		song : "Бунт на корабле"
	},
	{
		group : 'Рыцарь',
		song : "Бунт на корабле"
	},
	{
		group : 'Звонок',
		song : "Бунт на корабле"
	},
	{
		group : 'Задира и солдат',
		song : "Бунт на корабле"
	},
	{
		group : 'Хозяин леса',
		song : "Бунт на корабле"
	}
];

let ru_kish_gr_8 = [
	{
		group : 'Марионетки',
		song : "Продавец кошмаров"
	},
	{
		group : 'Маска',
		song : "Продавец кошмаров"
	},
	{
		group : 'Ром',
		song : "Продавец кошмаров"
	},
	{
		group : 'Гробовщик',
		song : "Продавец кошмаров"
	},
	{
		group : 'Дочка вурдалака',
		song : "Продавец кошмаров"
	},
	{
		group : 'Свой среди чужих',
		song : "Продавец кошмаров"
	},
	{
		group : 'Отражение',
		song : "Продавец кошмаров"
	},
	{
		group : 'Та, что смотрит из пруда',
		song : "Продавец кошмаров"
	},
	{
		group : 'В гостях у соседа',
		song : "Продавец кошмаров"
	},
	{
		group : 'Хозяин таверны',
		song : "Продавец кошмаров"
	},
	{
		group : 'Писатель Гудвин',
		song : "Продавец кошмаров"
	},
	{
		group : 'Джокер',
		song : "Продавец кошмаров"
	},
	{
		group : 'Продавец кошмаров',
		song : "Продавец кошмаров"
	},
	{
		group : 'Город мертвецов',
		song : "Продавец кошмаров"
	}
];

let ru_kish_gr_9 = [
    {
		group : 'Тень Клоуна',
		song : "Тень Клоуна"
	},
	{
		group : 'Дагон',
		song : "Тень Клоуна"
	},
	{
		group : 'Двое против всех',
		song : "Тень Клоуна"
	},
	{
		group : 'В Париж – домой',
		song : "Тень Клоуна"
	},
	{
		group : 'Фред',
		song : "Тень Клоуна"
	},
	{
		group : 'Кода',
		song : "Тень Клоуна"
	},
	{
		group : 'A.M.T.V.',
		song : "Тень Клоуна"
	},
	{
		group : 'Смешной пистолет',
		song : "Тень Клоуна"
	}
];

let ru_kish_gr_10 = [
	{
		group : 'Театральный демон',
		song : "Театр Демона"
	},
	{
		group : 'Киногерой',
		song : "Театр Демона"
	},
	{
		group : 'Фокусник',
		song : "Театр Демона"
	},
	{
		group : 'Танец злобного гения',
		song : "Театр Демона"
	},
	{
		group : 'Мадам Жоржетт',
		song : "Театр Демона"
	},
	{
		group : 'Бунтарь',
		song : "Театр Демона"
	},
	{
		group : 'Темный учитель',
		song : "Театр Демона"
	},
	{
		group : 'Король вечного сна',
		song : "Театр Демона"
	},
	{
		group : 'Бал лицемеров',
		song : "Театр Демона"
	}
];

let ru_kish_gr_11 = [
	{
		group : 'Добрые люди (Хор нищих)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		group : 'Смертный приговор (Ария Тодда и Мясника)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		group : 'Признание Ловетт (Ария Ловетт)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		group : 'Счастье? (Ария Тодда)',
		song : "Todd. Акт 1 – Праздник Крови"
	},
	{
		group : 'Смерть на балу (Ария Солиста и Тодда)',
		song : "Todd. Акт 2 – На краю"
	},
	{
		group : 'Маленький остров (Ария Ловетт)',
		song : "Todd. Акт 2 – На краю"
	},
	{
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

let all_songs = [
	en_1940, 
	en_1950, 
	en_1960, 
	en_1980_gr_1, en_1980_gr_2, en_1980_gr_3, en_1980_gr_4, en_1980_gr_5, en_1980_gr_6,
	en_1980_m_1, en_1980_m_2, en_1980_m_3, en_1980_f_1, en_1980_f_2,
	en_1990_gr_1, en_1990_gr_2, en_1990_gr_3, en_1990_gr_4, en_1990_gr_5, en_1990_gr_6, 
	en_1990_m_1, en_1990_m_2, en_1990_m_3, en_1990_f_1, en_1990_f_2,
	en_2000_gr_1, en_2000_gr_2, en_2000_gr_3, en_2000_gr_4, en_2000_gr_5, en_2000_m_1, en_2000_m_2, en_2000_m_3, en_2000_f_1, en_2000_f_2, en_2000_f_3,
	en_2007_gr_1, en_2007_gr_2, en_2007_m_1, en_2007_m_2, en_2007_f_1, en_2007_f_2,
	en_2010_gr, en_2010_m, en_2010_f, 
	en_2020,
	sov,
	ru_1980_gr_1, ru_1980_gr_2, ru_1980_gr_3, ru_1980_gr_4, ru_1980_m, ru_1980_f,
	ru_1990_gr_1, ru_1990_gr_2, ru_1990_gr_3, ru_1990_gr_4,
	ru_1990_m_1, ru_1990_m_2, ru_1990_m_3, ru_1990_f_1, ru_1990_f_2, ru_1990_f_3,
	ru_2000_gr_1, ru_2000_gr_2, ru_2000_gr_3, ru_2000_gr_4, ru_2000_m, ru_2000_f_1, ru_2000_f_2,
	ru_2007, 
	ru_2010_gr_1, ru_2010_gr_2, ru_2010_m_1, ru_2010_m_2, ru_2010_f,
	ru_2020,
	songs, ru_clips
];

let all_songs_by_lang_and_type = {
	'en' : {
		'gr' : [en_1980_gr_1, en_1980_gr_2, en_1980_gr_3, , en_1980_gr_4, en_1980_gr_5, en_1980_gr_6,
				en_1990_gr_1, en_1990_gr_2, en_1990_gr_3, en_1990_gr_4, en_1990_gr_5, en_1990_gr_6,
				en_2000_gr_1, en_2000_gr_2, en_2000_gr_3, en_2000_gr_4, en_2000_gr_5, en_2007_gr_1, en_2007_gr_2, en_2010_gr],
		'm' : [en_1980_m_1, en_1980_m_2, en_1980_m_3, en_1990_m_1, en_1990_m_2, en_2000_m_1, en_2000_m_2, en_2000_m_3, 
				 en_2007_m_1, en_2007_m_2, en_2010_m],
		'f' : [en_1980_f_1, en_1980_f_2, en_1990_f_1, en_1990_f_2, en_2000_f_1, en_2000_f_2, en_2000_f_3, en_2007_f_1, en_2007_f_2, en_2010_f]
		},
	'ru' : {
		'gr' : [ru_1980_gr_1, ru_1980_gr_2, ru_1980_gr_3, ru_1980_gr_4, ru_1990_gr_1, ru_1990_gr_2, ru_1990_gr_3, ru_1990_gr_4,
				ru_2000_gr_1, ru_2000_gr_2, ru_2000_gr_3, ru_2000_gr_4, ru_2010_gr_1, ru_2010_gr_2],
		'm'  : [ru_1980_m, ru_1990_m_1, ru_1990_m_2, ru_1990_m_3, ru_2000_m, ru_2010_m_1, ru_2010_m_2],
		'f'  : [ru_1980_f, ru_1990_f_1, ru_1990_f_2, ru_1990_f_3, ru_2000_f_1, ru_2000_f_2, ru_2010_f]
	}
};

let songs_en_1940 = [en_1940];
let songs_names_en_1940 = ['1940'];
let songs_en_1950 = [en_1950];
let songs_names_en_1950 = ['1950'];
let songs_en_1960 = [en_1960];
let songs_names_en_1960 = ['1960'];

let songs_en_1980 = [en_1980_gr_1, en_1980_gr_2, en_1980_gr_3, en_1980_gr_4, en_1980_gr_5, en_1980_gr_6,
	en_1980_m_1, en_1980_m_2, en_1980_m_3, en_1980_f_1, en_1980_f_2];
let songs_names_en_1980 = [ 
	'1980 Группы (Эльдорадио)', '1980 Группы (странные)', '1980 Группы (Depeche Mode, Police, New Order)', 
	'1980 Группы (Диско)', '1980 Группы (Поп-рок)', '1980 Группы (Рок)',
	'1980 Исполнители (Эльдорадио)', '1980 Исполнители (Диско)', '1980 Исполнители (Рок)', 
	'1980 Исполнительницы (Эльдорадио)', '1980 Исполнительницы (Диско)'
	];

let songs_en_1990 = [en_1990_gr_1, en_1990_gr_2, en_1990_gr_3, en_1990_gr_4, en_1990_gr_5, en_1990_gr_6,
					 en_1990_m_1, en_1990_m_2,
					 en_1990_f_1, en_1990_f_2];
let songs_names_en_1990 = ['1990 Группы (Rock Medium)', '1990 Группы (Rock Hard)', '1990 Группы (Pop Medium)', 
	'1990 Группы (Pop Hard)', '1990 Группы (Women)', '1990 Группы (Eurodance)',
	'1990 Исполнители (Easy)', '1990 Исполнители (Medium)', '1990 Исполнители (Hard)',
	'1990 Исполнительницы (Donna Lewis+)', '1990 Исполнительницы (Gala+)'];

let songs_en_2000 = [en_2000_gr, en_2000_m, en_2000_f];
let songs_names_en_2000 = ['2000 Группы (Рок: Green Day+)', '2000 Группы (Рок: U2+)', '2000 Группы (Рок, менее известный)', '2000 Группы (Европа Плюс)',
	'2000 Группы (Европа Плюс, менее известные)', '2000 Исполнители (Pop)', '2000 Исполнители (Dj)', '2000 Исполнители (Rap)',
	'2000 Исполнительницы (популярные)', '2000 Исполнительницы (менее известные)', '2000 Исполнительницы (RnB)'];
	
let songs_en_2007 = [en_2007_gr_1, en_2007_gr_2, en_2007_m_1, en_2007_m_2, en_2007_f_1, en_2007_f_2];
let songs_names_en_2007 = ['2007 Группы (Рок)', '2007 Группы (Поп)',
	'2007 Исполнители (по 1 песне)', '2007 Исполнители (по много песен)',
	'2007 Исполнительницы (популярные)', '2007 Исполнительницы (менее известные)'];
	
let songs_en_2010 = [en_2010_gr, en_2010_m, en_2010_f];
let songs_names_en_2010 = ['2010 Группы', '2010 Исполнители', '2010 Исполнительницы'];

let songs_en_2020 = [en_2020];
let songs_names_en_2020 = ['2020'];

let songs_ru_1970 = [sov];
let songs_names_ru_1970 = ['1970 Русская эстрада'];

let songs_ru_1980 = [ru_1980_gr_1, ru_1980_gr_2, ru_1980_gr_3, ru_1980_gr_4, ru_1980_m, ru_1980_f];
let songs_names_ru_1980 = ['1980 Группы (Русская эстрада)', '1980 Группы (ВИА)', '1980 Группы (Русский Рок 1)', '1980 Группы (Русский Рок 2)',
	'1980 Исполнители (Русская эстрада)', '1980 Исполнительницы (Русская эстрада)'];
	
let songs_ru_1990 = [ru_1990_gr_1, ru_1990_gr_2, ru_1990_gr_3, ru_1990_gr_4,
	ru_1990_m_1, ru_1990_m_2, ru_1990_m_3, ru_1990_f_1, ru_1990_f_2, ru_1990_f_3];
let songs_names_ru_1990 = ['1990 Группы (Мужские)', '1990 Группы (Женские)', '1990 Группы (Русский Рок 1)', '1990 Группы (Русский Рок 2)',
	'1990 Исполнители (EASY)', '1990 Исполнители (MEDIUM)', '1990 Исполнители (HARD)',
	'1990 Исполнительницы (EASY)', '1990 Исполнительницы (MEDIUM)',
	'1990 Исполнительницы (HARD)'];
	
let songs_ru_2000 =	[ru_2000_gr, ru_2000_m, ru_2000_f];
let songs_names_ru_2000 = ['2000 Группы (Поп, мужские)', '2000 Группы (Поп, женские)',
	'2000 Группы (Поп, женские, менее популярные)', '2000 Группы (Рок)',
	'2000 Исполнители', '2000 Исполнительницы 1', '2000 Исполнительницы 2'];
	
let songs_ru_2007 = [ru_2007];
let songs_names_ru_2007 = ['2007 Русская эстрада'];

let songs_ru_2010 = [ru_2010_gr_1, ru_2010_gr_2, ru_2010_m_1, ru_2010_m_2, ru_2010_f];
let songs_names_ru_2010 = ['2010 Группы (Русская эстрада)', '2010 Группы (Русский Рок)',
	'2010 Исполнители (Русская эстрада)', '2010 Исполнители (Баста, Дорн, Корж, Крид)', '2010 Исполнительницы'];
	
let songs_ru_2020 = [ru_2020];
let songs_names_ru_2020 = ['2020 (Русская эстрада)'];

let songs_en_clips = [songs];
let songs_names_en_clips = ['Иностранные клипы: Евродэнс (1990-е)'];

let songs_ru_clips = [ru_clips];
let songs_names_ru_clips = ['Русские клипы (1990-е)'];

let songs_1990 = [songs_en_1990.flat(), songs_ru_1990.flat()];
let songs_2000 = [songs_en_2000.flat(), songs_ru_2000.flat()];

//Arrays for charts

// all gr
let songs_gr_1980 = [en_1980_gr_1, en_1980_gr_2, en_1980_gr_3, en_1980_gr_4, en_1980_gr_5, en_1980_gr_6,
ru_1980_gr_1, ru_1980_gr_2, ru_1980_gr_3, ru_1980_gr_4];
let songs_gr_1990 = [en_1990_gr_1, en_1990_gr_2, en_1990_gr_3, en_1990_gr_4, en_1990_gr_5, en_1990_gr_6,
ru_1990_gr_1, ru_1990_gr_2, ru_1990_gr_3, ru_1990_gr_4];
let songs_gr_2000 = [en_2000_gr_1, en_2000_gr_2, en_2000_gr_3, en_2000_gr_4, en_2000_gr_5, ru_2000_gr_1, ru_2000_gr_2, ru_2000_gr_3, ru_2000_gr_4,
en_2007_gr_1, en_2007_gr_2];
let songs_gr_2010 = [en_2010_gr, ru_2010_gr_1, ru_2010_gr_2];

// en gr
let songs_en_gr_1980 = [en_1980_gr_1, en_1980_gr_2, en_1980_gr_3, en_1980_gr_4, en_1980_gr_5, en_1980_gr_6];
let songs_en_gr_1990 = [en_1990_gr_1, en_1990_gr_2, en_1990_gr_3, en_1990_gr_4, en_1990_gr_5, en_1990_gr_6];
let songs_en_gr_2000 = [en_2000_gr_1, en_2000_gr_2, en_2000_gr_3, en_2000_gr_4, en_2000_gr_5, en_2007_gr_1, en_2007_gr_2];
let songs_en_gr_2010 = [en_2010_gr];

// ru gr
let songs_ru_gr_1980 = [ru_1980_gr_1, ru_1980_gr_2, ru_1980_gr_3, ru_1980_gr_4];
let songs_ru_gr_1990 = [ru_1990_gr_1, ru_1990_gr_2, ru_1990_gr_3, ru_1990_gr_4];
let songs_ru_gr_2000 = [ru_2000_gr_1, ru_2000_gr_2, ru_2000_gr_3, ru_2000_gr_4];
let songs_ru_gr_2010 = [ru_2010_gr_1, ru_2010_gr_2];

// all m
let songs_m_1980 = [en_1980_m_1, en_1980_m_2, en_1980_m_3, ru_1980_m];
let songs_m_1990 = [en_1990_m_1, en_1990_m_2, ru_1990_m_1, ru_1990_m_2, ru_1990_m_3];
let songs_m_2000 = [en_2000_m_1, en_2000_m_2, en_2000_m_3, en_2007_m_1, en_2007_m_2, ru_2000_m]
let songs_m_2010 = [en_2010_m, ru_2010_m_1, ru_2010_m_2];

// en m
let songs_en_m_1980 = [en_1980_m_1, en_1980_m_2, en_1980_m_3];
let songs_en_m_1990 = [en_1990_m_1, en_1990_m_2];
let songs_en_m_2000 = [en_2000_m_1, en_2000_m_2, en_2000_m_3, en_2007_m_1, en_2007_m_2];
let songs_en_m_2010 = [en_2010_m];

// ru m
let songs_ru_m_1980 = [ru_1980_m];
let songs_ru_m_1990 = [ru_1990_m_1, ru_1990_m_2, ru_1990_m_3];
let songs_ru_m_2000 = [ru_2000_m]
let songs_ru_m_2010 = [ru_2010_m_1, ru_2010_m_2];

// all f
let songs_f_1980 = [en_1980_f_1, en_1980_f_2, ru_1980_f];
let songs_f_1990 = [en_1990_f_1, en_1990_f_2, ru_1990_f_1, ru_1990_f_2];
let songs_f_2000 = [en_2000_f_1, en_2000_f_2, en_2000_f_3, en_2007_f_1, en_2007_f_2, ru_2000_f_1, ru_2000_f_2]
let songs_f_2010 = [en_2010_m, ru_2010_f];

// en f
let songs_en_f_1980 = [en_1980_f_1, en_1980_f_2];
let songs_en_f_1990 = [en_1990_f_1, en_1990_f_2];
let songs_en_f_2000 = [en_2000_f_1, en_2000_f_2, en_2000_f_3, en_2007_f_1, en_2007_f_2];
let songs_en_f_2010 = [en_2010_f];

// ru f
let songs_ru_f_1980 = [ru_1980_f];
let songs_ru_f_1990 = [ru_1990_f_1, ru_1990_f_2, ru_1990_f_3];
let songs_ru_f_2000 = [ru_2000_f_1, ru_2000_f_2];
let songs_ru_f_2010 = [ru_2010_f];

let en_songs_years = [songs_en_1940, songs_en_1950, songs_en_1960, songs_en_1980, songs_en_1990, songs_en_2000, songs_en_2007,
songs_en_2010, songs_en_2020, songs_en_clips];
let en_songs_years_names_arr = [songs_names_en_1940, songs_names_en_1950, songs_names_en_1960, songs_names_en_1980, 
songs_names_en_1990, songs_names_en_2000, songs_names_en_2007, songs_names_en_2010, songs_names_en_2020, songs_names_en_clips];
let en_songs_years_names = ['1940', '1950', '1960', '1980', '1990', '2000', '2007', '2010', '2020', 'Клипы'];

let ru_songs_years = [songs_ru_1970, songs_ru_1980, songs_ru_1990, songs_ru_2000, songs_ru_2007,
songs_ru_2010, songs_ru_2020, songs_ru_clips];
let ru_songs_years_names_arr = [songs_names_ru_1970, songs_names_ru_1980, songs_names_ru_1990, songs_names_ru_2000, songs_names_ru_2007,
songs_names_ru_2010, songs_names_ru_2020, songs_names_ru_clips];
let ru_songs_years_names = ['1970', '1980', '1990', '2000', '2007', '2010', '2020', 'Клипы'];

let songs_langs = [en_songs_years, ru_songs_years];
let songs_langs_names_year = [en_songs_years_names, ru_songs_years_names];
let songs_langs_names_category = [en_songs_years_names_arr, ru_songs_years_names_arr];
let songs_langs_names = ['EN', 'RU'];

let distinct_artists;
let distinct_pack_songs;

let all_gr_artists_num;
let all_m_artists_num;
let all_f_artists_num;
let en_gr_artists_num;
let en_m_artists_num;
let en_f_artists_num;
let ru_gr_artists_num;
let ru_m_artists_num;
let ru_f_artists_num;

let all_gr_songs_num;
let all_m_songs_num;
let all_f_songs_num;
let en_gr_songs_num;
let en_m_songs_num;
let en_f_songs_num;
let ru_gr_songs_num;
let ru_m_songs_num;
let ru_f_songs_num;

function createChartData(){
	  anychart.onDocumentReady(function() {
	
	var all_chart = anychart.bar([
			{x: "1940", value: songs_en_1940.flat().length, fill: "#44944A"},
			{x: "1950", value: songs_en_1950.flat().length, fill: "#9966CC"},
			{x: "1960", value: songs_en_1960.flat().length, fill: "#FF0000"},
			{x: "1980", value: songs_ru_1980.flat().length + songs_en_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_ru_1990.flat().length + songs_en_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_ru_2000.flat().length + songs_en_2000.flat().length 
				+ songs_ru_2007.flat().length + songs_en_2007.flat().length, fill: "#480607"},
			{x: "2010", value: songs_ru_2010.flat().length + songs_en_2010.flat().length, fill: "#FAF0BE"},
			{x: "2020", value: songs_ru_2020.flat().length + songs_en_2020.flat().length, fill: "#98FB98"}
	  ]);
	  
	var en_chart = anychart.bar([
			{x: "1940", value: songs_en_1940.flat().length, fill: "#44944A"},
			{x: "1950", value: songs_en_1950.flat().length, fill: "#9966CC"},
			{x: "1960", value: songs_en_1960.flat().length, fill: "#FF0000"},
			{x: "1980", value: songs_en_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_en_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_en_2000.flat().length + songs_en_2007.flat().length, fill: "#480607"},
			{x: "2010", value: songs_en_2010.flat().length, fill: "#FAF0BE"},
			{x: "2020", value: songs_en_2020.flat().length, fill: "#98FB98"}
	  ]);
	  
	var ru_chart = anychart.bar([
			{x: "1980", value: songs_ru_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_ru_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_ru_2000.flat().length + songs_ru_2007.flat().length, fill: "#480607"},
			{x: "2010", value: songs_ru_2010.flat().length, fill: "#FAF0BE"},
			{x: "2020", value: songs_ru_2020.flat().length, fill: "#98FB98"}
	  ]);
	  
	var all_gr_chart = anychart.bar([
			{x: "1980", value: songs_gr_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_gr_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_gr_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_gr_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var en_gr_chart = anychart.bar([
			{x: "1980", value: songs_en_gr_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_en_gr_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_en_gr_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_en_gr_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var ru_gr_chart = anychart.bar([
			{x: "1980", value: songs_ru_gr_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_ru_gr_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_ru_gr_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_ru_gr_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var all_m_chart = anychart.bar([
			{x: "1980", value: songs_m_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_m_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_m_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_m_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var en_m_chart = anychart.bar([
			{x: "1980", value: songs_en_m_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_en_m_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_en_m_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_en_m_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var ru_m_chart = anychart.bar([
			{x: "1980", value: songs_ru_m_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_ru_m_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_ru_m_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_ru_m_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	  var all_f_chart = anychart.bar([
			{x: "1980", value: songs_f_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_f_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_f_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_f_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var en_f_chart = anychart.bar([
			{x: "1980", value: songs_en_f_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_en_f_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_en_f_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_en_f_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	  
	var ru_f_chart = anychart.bar([
			{x: "1980", value: songs_ru_f_1980.flat().length, fill: "#A5260A"},
			{x: "1990", value: songs_ru_f_1990.flat().length, fill: "#2A8D9C"},
			{x: "2000", value: songs_ru_f_2000.flat().length, fill: "#480607"},
			{x: "2010", value: songs_ru_f_2010.flat().length, fill: "#FAF0BE"}
	  ]);
	
    // set the chart title
    all_chart.title("Количество песен в разные годы");
	en_chart.title("Количество иностранных песен в разные годы");
	ru_chart.title("Количество русских песен в разные годы");
	all_gr_chart.title("Количество песен русских и иностранных групп в разные годы");
	en_gr_chart.title("Количество песен иностранных групп в разные годы");
	ru_gr_chart.title("Количество песен русских групп в разные годы");
	all_m_chart.title("Количество песен русских и иностранных исполнителей в разные годы");
	en_m_chart.title("Количество песен иностранных исполнителей в разные годы");
	ru_m_chart.title("Количество песен русских исполнителей в разные годы");
	all_f_chart.title("Количество песен русских и иностранных исполнительниц в разные годы");
	en_f_chart.title("Количество песен иностранных исполнительниц в разные годы");
	ru_f_chart.title("Количество песен русских исполнительниц в разные годы");

    // set the padding between bar groups
    all_chart.barGroupsPadding(0.5);
	en_chart.barGroupsPadding(0.5);
	ru_chart.barGroupsPadding(0.5);
	all_gr_chart.barGroupsPadding(0.5);
	en_gr_chart.barGroupsPadding(0.5);
	ru_gr_chart.barGroupsPadding(0.5);
	all_m_chart.barGroupsPadding(0.5);
	en_m_chart.barGroupsPadding(0.5);
	ru_m_chart.barGroupsPadding(0.5);
	all_f_chart.barGroupsPadding(0.5);
	en_f_chart.barGroupsPadding(0.5);
	ru_f_chart.barGroupsPadding(0.5);

    // set the titles of the axes
    all_chart.xAxis().title("Музыкальные эпохи");
	all_chart.yAxis().title("Композиции");
	
	en_chart.xAxis().title("Музыкальные эпохи");
	en_chart.yAxis().title("Композиции");
	
	ru_chart.xAxis().title("Музыкальные эпохи");
	ru_chart.yAxis().title("Композиции");
	
	all_gr_chart.xAxis().title("Музыкальные эпохи");
	all_gr_chart.yAxis().title("Композиции");
	
	en_gr_chart.xAxis().title("Музыкальные эпохи");
	en_gr_chart.yAxis().title("Композиции");
	
	ru_gr_chart.xAxis().title("Музыкальные эпохи");
	ru_gr_chart.yAxis().title("Композиции");
	
	all_m_chart.xAxis().title("Музыкальные эпохи");
	all_m_chart.yAxis().title("Композиции");
	
	en_m_chart.xAxis().title("Музыкальные эпохи");
	en_m_chart.yAxis().title("Композиции");
	
	ru_m_chart.xAxis().title("Музыкальные эпохи");
	ru_m_chart.yAxis().title("Композиции");
	
	all_f_chart.xAxis().title("Музыкальные эпохи");
	all_f_chart.yAxis().title("Композиции");
	
	en_f_chart.xAxis().title("Музыкальные эпохи");
	en_f_chart.yAxis().title("Композиции");
	
	ru_f_chart.xAxis().title("Музыкальные эпохи");
	ru_f_chart.yAxis().title("Композиции");

    // set the container id
    all_chart.container("all_chart");
	en_chart.container("en_chart");
	ru_chart.container("ru_chart");
	all_gr_chart.container("all_gr_chart");
	en_gr_chart.container("en_gr_chart");
	ru_gr_chart.container("ru_gr_chart");
	all_m_chart.container("all_m_chart");
	en_m_chart.container("en_m_chart");
	ru_m_chart.container("ru_m_chart");
	all_f_chart.container("all_f_chart");
	en_f_chart.container("en_f_chart");
	ru_f_chart.container("ru_f_chart");

    // initiate drawing the chart
    all_chart.draw();
	en_chart.draw();
	ru_chart.draw();
	all_gr_chart.draw();
	en_gr_chart.draw();
	ru_gr_chart.draw();
	all_m_chart.draw();
	en_m_chart.draw();
	ru_m_chart.draw();
	all_f_chart.draw();
	en_f_chart.draw();
	ru_f_chart.draw();
	 
	});
}

function chart_show(id){
	$('#' + id).show();
}

let chart_lang = 'all';
let chart_type = 'all';

function lang_chart(suffix){
	chart_lang = suffix;
	$('.chart').hide();
	$('#all_lang_chart').attr('src', 'img/chart/all.png');
	$('#en_lang_chart').attr('src', 'img/chart/en.png');
	$('#ru_lang_chart').attr('src', 'img/chart/ru.png');
	let selected = 'img/chart/' + suffix + '_selected.png';
	$('#' + suffix + '_lang_chart').attr('src', selected);
	show_chart();
}

function type_chart(suffix){
	chart_type = suffix;
	$('.chart').hide();
	$('#all_type_chart').attr('src', 'img/chart/all.png');
	$('#gr_type_chart').attr('src', 'img/chart/gr.png');
	$('#m_type_chart').attr('src', 'img/chart/m.png');
	$('#f_type_chart').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + suffix + '_selected.png';
	$('#' + suffix + '_type_chart').attr('src', selected);
	show_chart();
}

function show_chart(){
	if(chart_lang == 'all'){
		if(chart_type == 'all'){
			$('#all_chart').show();
			$('#artists_num').html(artists_num);
			$('#songs_num').html(songs_num);
		} else if(chart_type == 'gr'){
			$('#all_gr_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.gr.flat().map(item => item.group)).length 
			+ removeDuplicates(all_songs_by_lang_and_type.ru.gr.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.gr.flat().length +
			all_songs_by_lang_and_type.ru.gr.flat().length);
		} else if(chart_type == 'm'){
			$('#all_m_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.m.flat().map(item => item.group)).length 
			+ removeDuplicates(all_songs_by_lang_and_type.ru.m.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.m.flat().length +
			all_songs_by_lang_and_type.ru.m.flat().length);
		} else if(chart_type == 'f'){
			$('#all_f_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.f.flat().map(item => item.group)).length 
			+ removeDuplicates(all_songs_by_lang_and_type.ru.f.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.f.flat().length +
			all_songs_by_lang_and_type.ru.f.flat().length);
		}
	} else if(chart_lang == 'en'){
		if(chart_type == 'all'){
			$('#en_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.gr.flat().map(item => item.group)).length +
			removeDuplicates(all_songs_by_lang_and_type.en.m.flat().map(item => item.group)).length +
			removeDuplicates(all_songs_by_lang_and_type.en.f.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.gr.flat().length +
			all_songs_by_lang_and_type.en.m.flat().length + all_songs_by_lang_and_type.en.f.flat().length);
		} else if(chart_type == 'gr'){
			$('#en_gr_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.gr.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.gr.flat().length);
		} else if(chart_type == 'm'){
			$('#en_m_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.m.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.m.flat().length);
		} else if(chart_type == 'f'){
			$('#en_f_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.en.f.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.en.f.flat().length);
		}
	} else if(chart_lang == 'ru'){
		if(chart_type == 'all'){
			$('#ru_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.ru.gr.flat().map(item => item.group)).length +
			removeDuplicates(all_songs_by_lang_and_type.ru.m.flat().map(item => item.group)).length +
			removeDuplicates(all_songs_by_lang_and_type.ru.f.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.ru.gr.flat().length +
			all_songs_by_lang_and_type.ru.m.flat().length + all_songs_by_lang_and_type.ru.f.flat().length);
		} else if(chart_type == 'gr'){
			$('#ru_gr_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.ru.gr.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.ru.gr.flat().length);
		} else if(chart_type == 'm'){
			$('#ru_m_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.ru.m.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.ru.m.flat().length);
		} else if(chart_type == 'f'){
			$('#ru_f_chart').show();
			$('#artists_num').html(removeDuplicates(all_songs_by_lang_and_type.ru.f.flat().map(item => item.group)).length);
			$('#songs_num').html(all_songs_by_lang_and_type.ru.f.flat().length);
		}
	} 
}

let music = [
	{
		arr: en_1980_gr,
		lang: 'en',
		year: '1980',
		type: 'gr',
		packs: [
				{
					arr: en_1980_gr_1,
					name: 'EN 1980s Groups: Pop-Rock',
				},
				{
					arr: en_1980_gr_2,
					name: 'EN 1980s Groups: Rock',
				},
				{
					arr: en_1980_gr_3,
					name: 'EN 1980s Groups: Pop Medium',
				},
				{
					arr: en_1980_gr_4,
					name: 'EN 1980s Groups: Pop Hard',
				},
				{
					arr: en_1980_gr_5,
					name: "EN 1980s Groups: Pop Very Hard",
				},
				{
					arr: en_1980_gr_6,
					name: 'EN 1980s Groups: Disco',
				}
			]
	},
	{
		arr: en_1980_m,
		lang: 'en',
		year: '1980',
		type: 'm',
		packs: [
				{
					arr: en_1980_m_1,
					name: 'EN 1980s Male: Pop',
				},
				{
					arr: en_1980_m_2,
					name: 'EN 1980s Male: Disco',
				},
				{
					arr: en_1980_m_3,
					name: 'EN 1980s Male: Rock',
				}
			]
	},
	{
		arr: en_1980_f,
		lang: 'en',
		year: '1980',
		type: 'f',
		packs: [
				{
					arr: en_1980_f_1,
					name: 'EN 1980s Female: Pop',
				},
				{
					arr: en_1980_f_2,
					name: 'EN 1980s Female: Disco',
				}
			]
	},
	{
		arr: en_1990_gr,
		lang: 'en',
		year: '1990',
		type: 'gr',
		packs: [
				{
					arr: en_1990_gr_1,
					name: 'EN 1990s Groups: Rock Medium',
				},
				{
					arr: en_1990_gr_2,
					name: 'EN 1990s Groups: Rock Hard',
				},
				{
					arr: en_1990_gr_3,
					name: 'EN 1990s Groups: Pop Medium',
				},
				{
					arr: en_1990_gr_4,
					name: 'EN 1990s Groups: Pop Hard',
				},
				{
					arr: en_1990_gr_5,
					name: "EN 1990s Groups: Women's Vocals",
				},
				{
					arr: en_1990_gr_6,
					name: 'EN 1990s Groups: Eurodance',
				}
			]
	},
	{
		arr: en_1990_m,
		lang: 'en',
		year: '1990',
		type: 'm',
		packs: [
				{
					arr: en_1990_m_1,
					name: 'EN 1990s Male: Easy',
				},
				{
					arr: en_1990_m_2,
					name: 'EN 1990s Male: Medium',
				},
				{
					arr: en_1990_m_3,
					name: 'EN 1990s Male: Hard',
				}
			]
	},
	{
		arr: en_1990_f,
		lang: 'en',
		year: '1990',
		type: 'f',
		packs: [
				{
					arr: en_1990_f_1,
					name: 'EN 1990s Female: Many Songs',
				},
				{
					arr: en_1990_f_2,
					name: 'EN 1990s Female: Few Songs',
				}
			]
	},
	{
		arr: en_2000_gr,
		lang: 'en',
		year: '2000',
		type: 'gr',
		packs: [
				{
					arr: en_2000_gr_1,
					name: 'EN 1990s Groups: Rock#1',
				},
				{
					arr: en_2000_gr_2,
					name: 'EN 2000s Groups: Rock#2',
				},
				{
					arr: en_2000_gr_3,
					name: 'EN 2000s Groups: Rock Hard',
				},
				{
					arr: en_2000_gr_4,
					name: "EN 2000s Groups: Women's Vocals",
				},
				{
					arr: en_2000_gr_5,
					name: "EN 2000s Groups: Pop Medium",
				},
				{
					arr: en_2000_gr_6,
					name: 'EN 2000s Groups: Pop Hard',
				}
			]
	},
	{
		arr: en_2000_m,
		lang: 'en',
		year: '2000',
		type: 'm',
		packs: [
				{
					arr: en_2000_m_1,
					name: 'EN 2000s Male: Pop',
				},
				{
					arr: en_2000_m_2,
					name: 'EN 2000s Male: Dj',
				},
				{
					arr: en_2000_m_3,
					name: 'EN 2000s Male: Rap',
				}
			]
	},
	{
		arr: en_2000_f,
		lang: 'en',
		year: '2000',
		type: 'f',
		packs: [
				{
					arr: en_2000_f_1,
					name: 'EN 2000s Female: Easy',
				},
				{
					arr: en_2000_f_2,
					name: 'EN 2000s Female: Medium',
				},
				{
					arr: en_2000_f_3,
					name: 'EN 2000s Female: RnB',
				}
			]
	},
	{
		arr: ru_1980_gr,
		lang: 'ru',
		year: '1980',
		type: 'gr',
		packs: [
				{
					arr: ru_1980_gr_1,
					name: 'RU 1980s Groups: Pop',
				},
				{
					arr: ru_1980_gr_2,
					name: 'RU 1980s Groups: VIA',
				},
				{
					arr: ru_1980_gr_3,
					name: 'RU 1980s Groups: Rock#1',
				},
				{
					arr: ru_1980_gr_4,
					name: 'RU 1980s Groups: Rock#2',
				}
			]
	},
	{
		arr: ru_1980_m,
		lang: 'ru',
		year: '1980',
		type: 'm',
		packs: [
				{
					arr: ru_1980_m,
					name: 'RU 1980s Male: Medium',
				}
			]
	},
	{
		arr: ru_1980_f,
		lang: 'ru',
		year: '1980',
		type: 'f',
		packs: [
				{
					arr: ru_1980_f,
					name: 'RU 1980s Female: Medium',
				}
			]
	},
	{
		arr: ru_1990_gr,
		lang: 'ru',
		year: '1990',
		type: 'gr',
		packs: [
				{
					arr: ru_1990_gr_1,
					name: 'RU 1990s Groups: Pop Men',
				},
				{
					arr: ru_1990_gr_2,
					name: 'RU 1990s Groups: Pop Women',
				},
				{
					arr: ru_1990_gr_3,
					name: 'RU 1990s Groups: Rock#1',
				},
				{
					arr: ru_1990_gr_4,
					name: 'RU 1990s Groups: Rock#2',
				}
			]
	},
	{
		arr: ru_1990_m,
		lang: 'ru',
		year: '1990',
		type: 'm',
		packs: [
				{
					arr: ru_1990_m_1,
					name: 'RU 1990s Male: Easy',
				},
				{
					arr: ru_1990_m_2,
					name: 'RU 1990s Male: Medium',
				},
				{
					arr: ru_1990_m_3,
					name: 'RU 1990s Male: Hard',
				}
			]
	},
	{
		arr: ru_1990_f,
		lang: 'ru',
		year: '1990',
		type: 'f',
		packs: [
				{
					arr: ru_1990_f_1,
					name: 'RU 1990s Female: Easy',
				},
				{
					arr: ru_1990_f_2,
					name: 'RU 1990s Female: Medium',
				},
				{
					arr: ru_1990_f_3,
					name: 'RU 1990s Female: Hard',
				}
			]
	},
	{
		arr: ru_2000_gr,
		lang: 'ru',
		year: '2000',
		type: 'gr',
		packs: [
				{
					arr: ru_2000_gr_1,
					name: 'RU 2000s Groups: Pop Men',
				},
				{
					arr: ru_2000_gr_2,
					name: 'RU 2000s Groups: Pop Women Medium#1',
				},
				{
					arr: ru_2000_gr_3,
					name: 'RU 2000s Groups: Pop Women Medium#2',
				},
				{
					arr: ru_2000_gr_4,
					name: 'RU 2000s Groups: Rock',
				}
			]
	},
	{
		arr: ru_2000_m,
		lang: 'ru',
		year: '2000',
		type: 'm',
		packs: [
				{
					arr: ru_2000_m_1,
					name: 'RU 2000s Male: Easy',
				},
				{
					arr: ru_2000_m_2,
					name: 'RU 2000s Male: Medium',
				}
			]
	},
	{
		arr: ru_2000_f,
		lang: 'ru',
		year: '2000',
		type: 'f',
		packs: [
				{
					arr: ru_2000_f_1,
					name: 'RU 2000s Female: Medium',
				},
				{
					arr: ru_2000_f_2,
					name: 'RU 2000s Female: Hard',
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	$('#ru').hide();
	$('#en').hide();
	$('#mirror').hide();
	$('#wheel').hide();
	$('#map').hide();
	$('#mapping').show();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end + br;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		if(year == '1980' || year == '1990' || year == '2000'){
			arr[i-1].imgPath = imgPath + 'avatar/' + arr[i-1].group;
		} else {
			arr[i-1].imgPath = imgPath + id;
		}
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	let h2_start = `<h2>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif;' >`;
	let h3_end = `</h3>`;
	let br = `<br/>`;
	let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	let result = img_start + songs_to_map[0].imgPath + img_end + br
		+ h2_start + curr_group + ':' + h2_end;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += br + img_start + songs_to_map[i].imgPath + img_end + br
			+ h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + h3_end;
		} else {
			result += h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ h3_end;
		}
	}
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

let artists_num;
let songs_num;
function wheel(){
	$('#ru').hide();
	$('#en').hide();
	$('#mirror').hide();
	$('#wheel').hide();
	$('#map').hide();
	$('#year_graph').show();
	
	distinct_artists = removeDuplicates(all_songs.flat().map(item => item.group)).sort();
	artists_num = distinct_artists.length;
	songs_num = all_songs.flat().length;
	let tag_1 = `<h2 class='pack_artist'><label class='checkbox-google'><input class='group_item' type='checkbox' onchange='showYears(this,`;
	let tag_2 = `);'><span class='checkbox-google-switch'></span></label> `;
	let tag_3 =	`<div id='lang_`;
	let tag_4 = `'></div></h2>`;
	let result = `<h2 class='blue'> Исполнителей: <span id='artists_num' class='red'>` +  artists_num
	+ `</span> Композиций: <span id='songs_num' class='red'>` + songs_num + `</span></h2>`;
	for(let i = 0; i < songs_langs.length; i++){
		result += tag_1 + i + tag_2 + songs_langs_names[i] + tag_3 + i + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
}

function showYears(flag, lang_index){
	if(flag.checked){
		distinct_artists = removeDuplicates(songs_langs[lang_index].flat().map(item => item.group)).sort();
		let tag_1 = `<h3 class='pack_artist'><label class='checkbox-google'><input class='group_item' type='checkbox' onchange='showCategories(this,`;
		let tag_2 = `,`;
		let tag_3 = `);'><span class='checkbox-google-switch'></span></label> `;
		let tag_4 =	`<div id='category_`;
		let tag_5 = `'></div></h3>`;
		let result = `<h2 class='blue'> Музыкальных эпох: <span class='red'>` + songs_langs[lang_index].length 
		+ `</span> Композиций: <span class='red'>` + songs_langs[lang_index].flat().length + `</span></h2>`;
		for(let i = 0; i < songs_langs[lang_index].length; i++){
			result += tag_1 + lang_index + tag_2 + i + tag_3 + songs_langs_names_year[lang_index][i] 
			+ tag_4 + lang_index + '_' + i + tag_5;
		}
		$('#lang_' + lang_index).html(result);
	} else {
		$('#lang_' + lang_index).html('');
	}	
}

function showCategories(flag, lang_index, year_index){
	if(flag.checked){
		distinct_artists = removeDuplicates(songs_langs[lang_index][year_index].flat().map(item => item.group)).sort();
		let tag_1 = `<h3 class='pack_artist'><label class='checkbox-google'><input class='group_item' type='checkbox' onchange='showArtists(this,`;
		let tag_2 = `,`;
		let tag_3 = `,`;
		let tag_4 = `);'><span class='checkbox-google-switch'></span></label> `;
		let tag_5 =	`<div id='pack_`;
		let tag_6 = `'></div></h3>`;
		let result = `<h2 class='blue'> Пакетов: <span class='red'>` + songs_langs[lang_index][year_index].length 
		+ `</span> Композиций: <span class='red'>` + songs_langs[lang_index][year_index].flat().length + `</span></h2>`;
		for(let i = 0; i < songs_langs[lang_index][year_index].length; i++){
			result += tag_1 + lang_index + tag_2 + year_index + tag_3 + i + tag_4 
			+ songs_langs_names_category[lang_index][year_index][i] 
			+ tag_5 + lang_index + '_' + year_index + '_' + i + tag_6;
		}
		$('#category_' + lang_index + '_' + year_index).html(result);
	} else {
		$('#category_' + lang_index + '_' + year_index).html('');
	}
}

function showArtists(flag, lang_index, year_index, category_index){
	if(flag.checked){
		distinct_artists = removeDuplicates(songs_langs[lang_index][year_index][category_index].map(item => item.group)).sort();
		let tag_1 = `<h4 class='pack_artist'><label class='checkbox-google'><input class='group_item' type='checkbox' onchange='showSongs(this,`;
		let tag_2 = `,`;
		let tag_3 = `,`;
		let tag_4 = `,`;
		let tag_5 = `,"`;
		let tag_6 = `");'><span class='checkbox-google-switch'></span></label> `;
		let tag_7 =	`<div id='group_`;
		let tag_8 = `'></div></h4>`;
		let result = `<h3 class='blue'> Композиций: <span class='red'>` + songs_langs[lang_index][year_index][category_index].length + `</span></h3>`;
		for(let i = 0; i < distinct_artists.length; i++){
			result += tag_1 + lang_index + tag_2 + year_index + tag_3 + category_index + tag_4 + i + tag_5 +
			distinct_artists[i].replace("'", "#") + tag_6 + distinct_artists[i] 
			+ tag_7 + lang_index + '_' + year_index + '_' + category_index + '_' + i + tag_8;
		}
		$('#pack_' + lang_index + '_' + year_index + '_' + category_index).html(result);
	} else {
		$('#pack_' + lang_index + '_' + year_index + '_' + category_index).html('');
	}
}

function showSongs(flag, lang_index, year_index, category_index, group_index, group){
	if(flag.checked){
		group = group.replace("#", "'");
		let result = '<h4><ul>';
		let tag_1 = `<li>`;
		let tag_2 = `</li>`;
		let songs = songs_langs[lang_index][year_index][category_index].filter(item => item.group == group);
		songs = songs.map(item => item.song).sort();
		for(let i = 0; i < songs.length; i++){			
			result += tag_1 + songs[i] + tag_2;
		}
		result += '</ul></h4>'
		$('#group_' + lang_index + '_' + year_index + '_' + category_index + '_' + group_index).html(result);
	} else {
		$('#group_' + lang_index + '_' + year_index + '_' + category_index + '_' + group_index).html('');
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

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
	lang_letter = 'латинскую';
	hide_navi_icons();
	if(!alphabetMode){
		$('.en').show();
	} else {
		$('.en_alphabet').show();
	}
	count_time();
}

function ru(){
	lang = 'ru';
	lang_letter = 'русскую';
	hide_navi_icons();
	if(!alphabetMode){
		$('.ru').show();
	} else {
		$('.ru_alphabet').show();
	}
	count_time();
}

function hide_navi_icons(){
	$('#wheel').hide();
	$('#map').hide();
	$('#sec_15').show();
	$('#ru').hide();
	$('#en').hide();
	$('.settings').hide();
}

function group(){
	back = back_to_year;
	artist_type = 'gr';
	package_names = gr_package_names;
	check_package_num(gr_package_names.length);
}

function female(){
	back = back_to_year;
	artist_type = 'f';
	package_names = f_package_names;
	check_package_num(f_package_names.length);
}

function male(){
	back = back_to_year;
	artist_type = 'm';
	package_names = m_package_names;
	check_package_num(m_package_names.length);
}

function check_package_num(num){
	$('.artist').hide();
	if(num > 1){
		show_packages(num);
	} else {
		if(!genre){
			setPaths(artist_type);
		} else {
			setPaths(artist_type, null, genre);
		}
		showGroupNames();
	}
}

let gr_package_names = [];
let m_package_names = [];
let f_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	back = back_to_packages;
	$('.package').hide();
	if(year == '1980' || year == '1990' || year == '2000'){
		setPathsByPack(num);
	} else {
		setPaths(artist_type, num, genre);
	}
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		if(year == '1980' || year == '1990' || year == '2000'){
			song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/avatar/' + song.group;
		}
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}

//[en_1990_gr_1, en_1990_gr_2, en_1990_gr_3, en_1990_gr_4, en_1990_gr_5, en_1990_gr_6, 
	// en_1990_m_1, en_1990_m_2, en_1990_f_1, en_1990_f_2]
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.id;
		if(year == '1990' || year == '2000'){
			song.imgPath = imgPath + 'avatar/' + song.group;
		}
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

function back_to_mode(){
	$('#back').hide();
	$('.artist').hide();
	if(lang == 'ru'){
		$('.ru').show();
	} else {
		$('.en').show();
	}
	$('#mirror').show();
	gr_package_names = ['', '', '', '', ''];
    m_package_names = ['', '', '', '', ''];
    f_package_names = ['', '', '', '', ''];
	f_packages = 1;
	m_packages = 1;
	gr_packages = 1;
}

function back_to_year(){
	back = back_to_mode;
	$('.package').hide();
	$('#package_content').hide();
	$('.artist').show();
}

function back_to_packages(){
	back = back_to_year;
	$('#current_pack').hide();
	$('#package_content').hide();
	toggleLearn();
	if(artist_type == 'gr'){
		group();
	} else if (artist_type == 'm'){
		male();
	} else if (artist_type == 'f'){
		female();
	}
}

let back = back_to_mode;
let expressMode = false;
		
function mode(num, album, album_num){
	$('.mode').hide();
	$('#mirror').hide();
	$('#back').show();
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	
	// EN
	// 1940
	if(num == 7){
		audioPath = 'audio/en_1940/';
		imgPath = 'img/en_1940/';
		songs = en_1940;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1940-х"!';
	}
	// 1950
	if(num == 8){
		audioPath = 'audio/en_1950/';
		imgPath = 'img/en_1950/';
		songs = en_1950;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1950-х"!';
	}
	// 1960
	if(num == 9){
		audioPath = 'audio/en_1960/';
		imgPath = 'img/en_1960/';
		songs = en_1960;
		finalMessage = ' Ура! Вы освоили "Дискотеку 1960-х"!';
	}
	// 1980
	if (num == 15){
		year = '1980';
		gr_package_names = en_1980_gr_icon;
		m_package_names = en_1980_m_icon;
		f_package_names = en_1980_f_icon;
		if(!alphabetMode){
			$('.artist').show();
		}
	}
	// 1990
	if(num == 0){
		year = '1990';
		gr_package_names =  en_1990_gr_icon;
		m_package_names = en_1990_m_icon;
		f_package_names = en_1990_f_icon;
		if(!alphabetMode){
			$('.artist').show();
		}
	}
	// 1990 minus
	if(num == 24){
		year = 1990;
		minusMode = true;
		$('.en_alphabet').hide();
		audioPath = 'audio/en/1990/minus/';
		imgPath = 'img/en/1990/minus/';
		songs = generateSongIds(en_1990_minus);
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
		toggleLearn();
	}
	// 2000
	if(num == 4){
		year = '2000';
		gr_package_names =  en_2000_gr_icon;
		m_package_names = en_2000_m_icon;
		f_package_names = en_2000_f_icon;
		if(!alphabetMode){
			$('.artist').show();
		}
	}
	// 2000 minus
	if(num == 26){
		year = 2000;
		minusMode = true;
		$('.en_alphabet').hide();
		audioPath = 'audio/en/2000/minus/';
		imgPath = 'img/en/2000/minus/';
		songs = generateSongIdsWithPrefix(en_2000_minus, lang, year, 'minus');
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
		toggleLearn();
	}
	// 2007
	if(num == 6){
		year = '2007';
		gr_packages = 2;
		m_packages = 2;
		f_packages = 2;
		gr_package_names[0] = 'rock_1';
		gr_package_names[1] = 'pop_1';
		$('#song').hide();
		$('.artist').show();
	}	
	// 2010
	if(num == 10){
		year = '2010';
		$('#song').hide();
		$('.artist').show();
	}
	// 2020
	if(num == 11){
		audioPath = 'audio/en_2020/';
		imgPath = 'img/en_2020/';
		songs = en_2020;
		finalMessage = ' Ура! Вы освоили "Дискотеку 2020-х"!';
	}
	
	// RU
	// До 1980
	if(num == 14){
		audioPath = 'audio/sov/';
		imgPath = 'img/sov/';
		songs = sov;
		finalMessage = ' Ура! Вы освоили "Дискотеку СССР"!';
	}
	// 1980
	if(num == 16){
		year = '1980';
		gr_package_names = ru_1980_gr_icon;
		m_package_names = ru_1980_m_icon;
		$('.artist').show();
	}
	// 1980 Эстрада
	if(num == 23){
		year = '1980';
		genre = 'pop';
		gr_packages = 2;
		gr_package_names[0] = 'ru_pop_1';
		gr_package_names[1] = 'ru_via';
		$('.ru_1980').hide();
		$('.artist').show();
	}
	// 1980 Рок
	if(num == 20){
		year = '1980';
		genre = 'rock'
		$('.ru_1980').hide();
		artist_type = 'gr';
		gr_packages = 2;
		gr_package_names[0] = 'ru_rock_1';
		gr_package_names[1] = 'ru_rock_2';
		package_names = gr_package_names;
		check_package_num(gr_packages);
	}
	// 1990
	if(num == 1){
		year = '1990';
		gr_package_names = ru_1990_gr_icon;
		m_package_names = ru_1990_m_icon;
		m_package_names = ru_1990_f_icon;
		$('#song').hide();
		if(!alphabetMode){
			$('.artist').show();
		}
	}
	// 1990 минус
	if(num == 25){
		year = 1990;
		minusMode = true;
		$('.ru_alphabet').hide();
		audioPath = 'audio/ru/1990/minus/';
		imgPath = 'img/ru/1990/minus/';
		songs = generateSongIds(ru_1990_minus);
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
		toggleLearn();
	}
	// 2000
	if(num == 21){
		year = '2000';
		gr_package_names = ru_2000_gr_icon;
		m_package_names = ru_2000_m_icon;
		m_package_names = ru_2000_f_icon;
		$('#song').hide();
		if(!alphabetMode){
			$('.artist').show();
		}
	}
	// 2000 минус
	if(num == 27){
		year = 2000;
		minusMode = true;
		$('.ru_alphabet').hide();
		audioPath = 'audio/ru/2000/minus/';
		imgPath = 'img/ru/2000/minus/';
		songs = generateSongIdsWithPrefix(ru_2000_minus, lang, year, 'minus');
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
		toggleLearn();
	}
	// 2007
	if(num == 5){
		audioPath = 'audio/ru_2007/';
		imgPath = 'img/ru_2007/';
		songs = ru_2007;
		finalMessage = finalMessage_00;
	}
	// 2010
	if(num == 13){
		year = '2010';
		m_packages = 2;
		gr_packages = 2;
		gr_package_names[0] = 'ru_pop_1';
		gr_package_names[1] = 'ru_rock_1';
		$('#song').hide();
		$('.artist').show();
	}
	// 2020
	if(num == 12){
		audioPath = 'audio/ru_2020/';
		imgPath = 'img/ru_2020/';
		songs = ru_2020;
		finalMessage = ' Ура! Вы освоили "Дискотеку 2020-х"!';
	}
	// Король и Шут!!!
	if(num == 28){
		$('#back').hide();
		$('.submode').show();
	}
	if(num == 22){
		$('#back').hide();
		$('.submode').hide();
		year = 'kish';
		sec_per_turn = 20;
		$('#learn').html('Угадай песню КиШа');
		songs = setMusicalAlphabetPack(generateSongIds(ru_kish_gr), 'Песня', 'audio/ru_kish_gr/', 'img/ru_kish_gr/');
		shuffle(songs);
		songs = songs.slice(0, 20);
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "КиШа"!';
		$('#total').html(songs.length);
		showGroupNames();
	}
	if(num == 29){
		$('#back').hide();
		$('.submode').hide();
		$('.kish_minus').show();
	}
	if(num == 30){
		$('#back').hide();
		$('.kish_minus').hide();
		if(!expressMode){
			minusMode = true;
			audioPath = 'audio/ru_kish_gr/minus/' + album + '/';
			imgPath = 'img/ru_kish_gr/avatar/';
			songs = generateSongIdsByPaths(eval('ru_kish_gr_' + album_num), audioPath, imgPath);
			answers = songs.map(item=>item.group);
			finalMessage = ' Ура! Вы освоили "' + album + '"!';
			$('#total').html(songs.length);
			shuffle(songs);
			toggleLearn();
		} else {
			audioPath = 'audio/ru_kish_gr/';
			imgPath = 'img/ru_kish_gr/avatar/';
			songs = generateSongIdsByPaths(ru_kish_gr, audioPath, imgPath);
			songs = eval('ru_kish_gr_album_' + album_num);
			$('#total').html(songs.length);
			$('#artist').show();
			play_non_stop(10000);
		}
	}
	if(num == 31){
		$('#back').hide();
		$('.submode').hide();
		expressMode = true;
		$('.kish_minus').show();
	}
	
	// Media
	if (num === 'media'){
		$('.media').show();
		return;
	}
	// 1990 Songs
	if(num == 3){
		$('.media').hide();
		$('#song').show();
		videoPath = 'video/song/';
		modeToggle = toggleVisible;
		setMedia = setVideo;
		rightAnswer = rightAnswer_EN;
	}
	// 1990 Clips
	if(num == 2){
		$('.media').hide();
		$('#song').show();
		videoPath = 'video/clip/';
		modeToggle = toggleMute;
		setMedia = setVideo;
		rightAnswer = rightAnswer_EN;
	}
	
	if(alphabetMode && !minusMode){
		$('.en_alphabet').hide();
		$('.ru_alphabet').hide();
		setMusicalAlphabet();
	} 
		
	if(isSingle){
		// $('#total').html(songs.length);
	} else{
		$('#p1_total').html(songs.length/2);
		$('#p2_total').html(songs.length/2);
	}
	shuffle(songs);
	if(isTournement){
		prepareTournement();
	}
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}