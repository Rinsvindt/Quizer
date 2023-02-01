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
let audio = '';
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

let en_1980_gr_1 = [
	{
		id : 1,
		group : 'Toto',
		song : "Africa"
	},
	{
		id : 2,
		group : 'Van Halen',
		song : "Jump"
	},
	{
		id : 3,
		group : 'UB40',
		song : "Red Red Wine"
	},
	{
		id : 10,
		group : 'Wham!',
		song : "Wake Me Up Before You Go-Go"
	},
	{
		id : 11,
		group : 'Wham!',
		song : "Young Guns (Go For It!)"
	},
	{
		id : 12,
		group : 'Genesis',
		song : "Land Of Confusion"
	},
	{
		id : 13,
		group : 'Flock Of Seagulls',
		song : "I Ran"
	},
	{
		id : 14,
		group : 'Daryl Hall & John Oates',
		song : "Private Eyes"
	},
	{
		id : 15,
		group : 'Daryl Hall & John Oates',
		song : "Maneater"
	},
	{
		id : 16,
		group : 'Daryl Hall & John Oates',
		song : "Kiss on My List"
	},
	{
		id : 17,
		group : 'Daryl Hall & John Oates',
		song : "I Can't Go For That (No Can Do)"
	},
	{
		id : 18,
		group : 'Daryl Hall & John Oates',
		song : "Out of Touch"
	},
	{
		id : 19,
		group : 'Soul II Soul',
		song : "Back to Life (ft Caron Wheeler)"
	},
	{
		id : 20,
		group : 'Men At Work',
		song : "Down Under"
	},
	{
		id : 21,
		group : 'Men At Work',
		song : "Who Can It Be Now?"
	},
	{
		id : 22,
		group : 'Beach Boys',
		song : "Wipeout (ft Fat Boys)"
	},
	{
		id : 23,
		group : 'Simple Minds',
		song : "Don't You"
	},
	{
		id : 25,
		group : 'Tears For Fears',
		song : "Everybody Wants to Rule the World"
	},
	{
		id : 26,
		group : 'Tears For Fears',
		song : "Shout"
	},
	{
		id : 28,
		group : 'Bangles',
		song : "Walk Like an Egyptian"
	},
	{
		id : 29,
		group : 'Bangles',
		song : "Manic Monday"
	},
	{
		id : 31,
		group : "Go-Go's",
		song : "Vacation"
	},
	{
		id : 32,
		group : "Eurythmix",
		song : "Sweet Dreams"
	},
	{
		id : 33,
		group : "Eurythmix",
		song : "Love Is a Stranger"
	},
	{
		id : 34,
		group : "Outfield",
		song : "Your Love"
	},
	{
		id : 36,
		group : "Earth Wind & Fire",
		song : "Let's Groove"
	},
	{
		id : 39,
		group : "Europe",
		song : "The Final Countdown"
	},
	{
		id : 40,
		group : "Europe",
		song : "Carrie"
	},
	{
		group : "Genesis",
		song : "In Too Deep"
	},
	{
		group : "Genesis",
		song : "Invisible touch"
	},
	{
		group : "Genesis",
		song : "Misunderstanding"
	},
	{
		group : "Genesis",
		song : "That’s all"
	},
	{
		group : "Flock Of Seagulls",
		song : "Wishing (If I Had A Photograph Of You)"
	},
	{
		group : 'Tears For Fears',
		song : "Mad world"
	},
	{
		group : 'Tears For Fears',
		song : "Head Over Heels"
	},
	{
		group : 'Men At Work',
		song : "It’s a mistake"
	},
	{
		group : 'UB40',
		song : "I'll Be Your Baby Tonight (ft Robert Palmer)"
	},
	{
		group : 'UB40',
		song : "Kingston Town"
	},
	{
		group : 'Eurythmix',
		song : "There must be an angel"
	},
	{
		group : 'Wham!',
		song : "Everything She Wants"
	},
	{
		group : 'Yazoo',
		song : "Don't Go"
	},
	{
		group : 'Yazoo',
		song : "Only You"
	},
	{
		group : 'Black',
		song : "Wonderful Life"
	}
];

let en_1980_gr_2 = [
	{
		group : 'Kool & The Gang',
		song : "Celebration"
	},
	{
		group : 'Run-DMC',
		song : "It's Like That"
	},
	{
		group : 'N.W.A.',
		song : "Gangsta Gangsta"
	},
	{
		group : "Mr. Mister",
		song : "Broken Wings"
	},
	{
		group : 'Technotronic',
		song : "Pump Up The Jam"
	},
	{
		group : 'Swing Out Sister',
		song : "Breakout"
	},
	{
		group : 'Journey',
		song : "Don't Stop Believin'"
	},
	{
		group : 'Real Life',
		song : "Send Me An Angel"
	},
	{
		group : 'Naked Eyes',
		song : "Always Something There To Remind Me"
	},
	{
		group : "ABC",
		song : "When Smokey Sings"
	},
	{
		group : "KC & The Sunshine Band",
		song : "Please Don't Go"
	},
	{
		group : "Rob Base & DJ E-Z Rock",
		song : "It Takes Two"
	},
	
	{
		group : "Starship",
		song : "We Built This City"
	},
	{
		group : 'My Mine',
		song : "Hypnotic Tango"
	},
	{
		group : "Soultans",
		song : "Cant Take My Hands Off You"
	},
	{
		group : "Captain & Tennille",
		song : "Do That To Me One More Time"
	},
	{
		group : 'KING',
		song : "Love and Pride"
	},
	{
		group : "REO Speedwagon",
		song : "Keep on Loving You"
	},
	{
		group : "REO Speedwagon",
		song : "Can't Fight This Feeling"
	}
];

let en_1980_gr_3 = [
	{
		group : 'Police',
		song : "Every Breath You Take"
	},
	{
		group : 'Police',
		song : "Roxanne"
	},
	{
		group : 'Police',
		song : "Message In A Bottle"
	},
	{
		group : 'Police',
		song : "Don't Stand So Close To Me"
	},
	{
		group : 'Police',
		song : "Walking On The Moon"
	},
	{
		group : 'Police',
		song : "Can't Stand Losing You"
	},
	{
		group : 'Police',
		song : "So Lonely"
	},
	{
		group : 'Police',
		song : "De Do Do Do, De Da Da Da"
	},
	{
		group : 'Police',
		song : "Every Little Thing She Does Is Magic"
	},
	{
		group : 'New Order',
		song : "Blue Monday"
	},
	{
		group : 'New Order',
		song : "Age Of Consent"
	}
];

let en_1980_gr_4 = [
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
		id : 4,
		group : 'A-Ha',
		song : "Take On Me"
	},
	{
		id : 6,
		group : 'Lipps Inc.',
		song : "Funkytown"
	},
	{
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
		group : 'Pointer Sisters',
		song : "I'm So Excited"
	},
	{
		id : 21,
		group : 'Ultravox',
		song : "Dancing With Tears In My Eyes"
	},
	{
		id : 23,
		group : 'Bronski Beat',
		song : "Smalltown Boy"
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
		group : "Al Bano & Romina Power",
		song : "Cisara"
	},
	{
		group : "Goombay Dance Band",
		song : "Seven Tears"
	},
	{
		group : "Ricchi E Poveri",
		song : "Mamma Maria"
	},
	{
		group : "Ricchi E Poveri",
		song : "Hasta La Vista"
	},
	{
		group : "Ricchi E Poveri",
		song : "Sarà perchè ti amo"
	},
	{
		group : "Ricchi E Poveri",
		song : "Piccolo Amore"
	},
	{
		group : "Ricchi E Poveri",
		song : "Voulez-Vous Danser"
	},
	{
		group : "Ricchi E Poveri",
		song : "Se M'innamoro"
	},
	{
		group : "Baby's Gang",
		song : "Challenger"
	},
	{
		group : "Righeira",
		song : "Vamos A La Playa"
	},
	{
		group : "ELO (Electric Light Orchestra)",
		song : "Don't Bring Me Down"
	},
	{
		group : "ELO (Electric Light Orchestra)",
		song : "Here Is The News"
	},
	{
		group : "ELO (Electric Light Orchestra)",
		song : "Ticket To The Moon"
	},
	{
		group : "Spandau Ballet",
		song : "True"
	},
	{
		group : "Spandau Ballet",
		song : "To Cut A Long Story Short"
	},
	{
		group : "Berlin",
		song : "Take My Breath Away"
	},
	{
		group : "Laid back",
		song : "Sunshine reggae"
	},
	{
		group : "Laid back",
		song : "Bakerman"
	},
	{
		group : "Laid back",
		song : "Elevator Boy"
	},
	{
		group : 'Culture Club',
		song : "Do You Really Want to Hurt Me"
	},
	{
		group : 'Yazz',
		song : "The Only Way Is Up (ft The Plastic Population)"
	},
	{
		group : 'Chicago',
		song : "Hard To Say I'M Sorry"
	}
];

let en_1980_gr_5 = [
	{
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
		id : 7,
		group : 'Twisted Sister',
		song : "We're Not Gonna Take It"
	},
	{
		group : 'Kiss',
		song : "Heaven's On Fire"
	},
	{
		id : 23,
		group : "Clash",
		song : "Should I Stay or Should I Go"
	},
	{
		id : 24,
		group : "Clash",
		song : "Rock the Casbah"
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
		group : "Duran Duran",
		song : "The Reflex"
	},
	{
		id : 32,
		group : "U2",
		song : "I Still Haven't Found What I'm Looking For"
	},
	{
		group : "U2",
		song : "With Or Without You"
	},
	{
		group : "REM",
		song : "Orange Crush"
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
		id : 46,
		group : "Roxette",
		song : "Listen To Your Heart"
	},
	{
		group : "Cure",
		song : "Close To Me"
	},
	{
		group : "INXS",
		song : "Devil Inside"
	},
	{
		group : 'Bon Jovi',
		song : "Wanted Dead Or Alive"
	},
	{
		group : 'Bon Jovi',
		song : "Bed Of Roses"
	},
	{
		group : 'Dire Straits',
		song : "Solid Rock"
	},
	{
		group : 'Dire Straits',
		song : "Brothers In Arms"
	},
	{
		group : 'Dire Straits',
		song : "Money For Nothing"
	},
	{
		group : 'Dire Straits',
		song : "Sultans Of Swing"
	},
	{
		group : 'Dire Straits',
		song : "So Far Away"
	},
	{
		group : 'Twisted Sister',
		song : "I Wanna Rock"
	},
	{
		group : "Duran Duran",
		song : "Hungry Like The Wolf"
	},
	{
		group : "U2",
		song : "Sunday Bloody Sunday"
	},
	{
		group : "Blondie",
		song : "One Way Or Another"
	},
	{
		group : "Cure",
		song : "Lullaby"
	},
	{
		group : "Cure",
		song : "Friday I'm In Love"
	},
	{
		group : "Cure",
		song : "Just Like Heaven"
	},
	{
		group : "Cure",
		song : "Boys Don't Cry"
	},
	{
		group : "Cure",
		song : "Lovesong"
	},
	{
		group : "Cure",
		song : "A Forest"
	},
	{
		group : "INXS",
		song : "Never Tear Us Apart"
	},
	{
		group : "INXS",
		song : "Need You Tonight"
	},
	{
		group : "Crowded House",
		song : "Don't Dream It's Over"
	},
	{
		group : 'Kiss',
		song : "I Was Made for Loving You"
	},
	{
		group : 'Kiss',
		song : "Rock And Roll All Nite"
	},
	{
		group : "REM",
		song : "Its The End Of The World As We Know It (And I Feel Fine)"
	},
	{
		group : "REM",
		song : "The One I Love"
	}
];

let en_1980_gr_6 = [
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
		group : 'Metallica',
		song : "Master Of Puppets"
	},
	{
		id : 10,
		group : 'Metallica',
		song : "Seek & Destroy"
	},
	{
		group : 'Iron Maiden',
		song : "The Trooper"
	},
	{
		id : 12,
		group : "Guns N Roses",
		song : "Sweet Child O' Mine"
	},
	{
		id : 13,
		group : "Guns N Roses",
		song : "Mr. Brownstone"
	},
	{
		id : 14,
		group : "Guns N Roses",
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
		group : 'Anthrax',
		song : "A.I.R."
	},
	{
		id : 39,
		group : "Pink Floyd",
		song : "Another Brick In The Wall, Pt. 2"
	},
	{
		group : "Alice Cooper",
		song : "Bed of Nails"
	},
	{
		id : 45,
		group : "Whitesnake",
		song : "Here I Go Again"
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
		id : 59,
		group : "Whitesnake",
		song : "Is this love"
	},
	{
		group : 'Rolling Stones',
		song : "Start Me Up"
	},
	{
		group : 'Metallica',
		song : "Battery"
	},
	{
		group : 'Metallica',
		song : "Fade To Black"
	},
	{
		group : 'Iron Maiden',
		song : "Run To The Hills"
	},
	{
		group : 'Iron Maiden',
		song : "2 Minutes To Midnight"
	},
	{
		group : "Guns N Roses",
		song : "Paradise City"
	},
	{
		group : "Guns N Roses",
		song : "Knockin' On Heaven's Door"
	},
	{
		group : 'AC/DC',
		song : "Back In Black"
	},
	{
		group : "Alice Cooper",
		song : "Poison"
	},
	{
		group : "Queen",
		song : "A Kind Of Magic"
	},
	{
		group : "Queen",
		song : "Crazy Little Thing Called Love"
	},
	{
		group : "Queen",
		song : "Another One Bites The Dust"
	},
	{
		group : "Queen",
		song : "Under Pressure (ft David Bowie)"
	},
	{
		group : "Queen",
		song : "Wo Wants To Live Forever"
	},
	{
		group : "Queen",
		song : "I Want It All"
	},
	{
		group : "Queen",
		song : "One Vision"
	},
	{
		group : "Queen",
		song : "Fat Bottomed Girls"
	},
	{
		group : "ZZ Top",
		song : "Sharp Dressed Man"
	},
	{
		group : "ZZ Top",
		song : "Gimme All Your Lovin'"
	},
	{
		group : "Dio",
		song : "Rainbow In The Dark"
	}
];

let en_1980_m_1 = [
	{
		id : 1,
		group : 'Bruce Springsteen',
		song : "Dancing In the Dark"
	},
	{
		id : 2,
		group : 'Bruce Springsteen',
		song : "Born in the U.S.A."
	},
	{
		id : 3,
		group : 'Richard Marx',
		song : "Right Here Waiting"
	},
	{
		id : 4,
		group : 'Willie Nelson',
		song : "Always On My Mind"
	},
	{
		id : 5,
		group : "Roy Orbison",
		song : "You Got It"
	},
	{
		id : 6,
		group : 'Stevie Wonder',
		song : "Ebony And Ivory (ft Paul McCartney)"
	},
	{
		id : 7,
		group : 'Bob Marley',
		song : "Redemption Song (ft The Wailers)"
	},
	{
		id : 8,
		group : 'Bob Marley',
		song : "Could You be Loved (ft The Wailers)"
	},
	{
		id : 9,
		group : 'Willie Nelson',
		song : "Seven Spanish Angels (ft Ray Charles)"
	},
	{
		id : 15,
		group : "Bobby McFerrin",
		song : "Dont Worry, Be Happy"
	},
	{
		id : 16,
		group : "Bobby Brown",
		song : "My Prerogative"
	},
	{
		id : 17,
		group : "Nik Kershaw",
		song : "I Won't Let The Sun Go Down On Me"
	},
	{
		id : 18,
		group : "Nik Kershaw",
		song : "The Riddle"
	},
	{
		id : 19,
		group : "Bryan Adams",
		song : "Summer Of '69"
	},
	{
		id : 20,
		group : "Phil Collins",
		song : "In The Air Tonight"
	},
	{
		id : 21,
		group : "Phil Collins",
		song : "Against All Odds (Take A Look At Me Now)"
	},
	{
		id : 22,
		group : "Phil Collins",
		song : "One More Night"
	},
	{
		id : 23,
		group : "Bryan Adams",
		song : "Heaven"
	},
	{
		id : 24,
		group : 'Bruce Springsteen',
		song : "I'm on Fire"
	},
	{
		id : 25,
		group : 'Stevie Wonder',
		song : "Master Blaster (Jammin')"
	},
	{
		id : 26,
		group : 'Stevie Wonder',
		song : "I Just Called To Say I Love You"
	},
	{
		id : 28,
		group : "Lionel Richie",
		song : "Truly"
	},
	{
		id : 29,
		group : "Lionel Richie",
		song : "All Night Long (All Night)"
	},
	{
		id : 30,
		group : "Lionel Richie",
		song : "Hello"
	},
	{
		group : "Phil Collins",
		song : "Easy Lover (ft Philip Bailey)"
	},
	{
		group : "Phil Collins",
		song : "Another Day In Paradise"
	},
	{
		group : "Chris Norman",
		song : "Stumblin' In"
	},
	{
		group : "Lionel Richie",
		song : "Endless Love (ft Diana Ross)"
	},
	{
		group : "Billy Joel",
		song : "A matter of trust"
	},
	{
		group : "Billy Joel",
		song : "Allentown"
	},
	{
		group : "Billy Joel",
		song : "It’s still rock and roll to me"
	},
	{
		group : "Billy Joel",
		song : "Uptown girl"
	},
	{
		group : "Billy Joel",
		song : "Tell her about it"
	},
	{
		group : "Bryan Ferry",
		song : "Don’t stop the dance"
	},
	{
		group : "Chris De Burgh",
		song : "Missing you"
	},
	{
		group : "Chris Isaak",
		song : "Wicked game"
	},
	{
		group : "Chris Norman",
		song : "Hunters of the Night"
	},
	{
		group : "Chris Norman",
		song : "Midnight lady"
	},
	{
		group : "Chris Norman",
		song : "Some hearts are diamonds"
	},
	{
		group : "Chris Rea",
		song : "Looking for the summer"
	},
	{
		group : "Chris Rea",
		song : "The road to hell"
	},
	{
		group : "George Michael",
		song : "Faith"
	},
	{
		group : "George Michael",
		song : "Careless Whisper"
	},
	{
		group : "George Harrison",
		song : "Got My Mind Set On You"
	},
	{
		group : "Joe Esposito",
		song : "You're The Best Around"
	},
	{
		group : "Joe Cocker",
		song : "Unchain my heart"
	},
	{
		group : "Joe Cocker",
		song : "Up where we belong"
	},
	{
		group : "Lionel Richie",
		song : "Say you. say me"
	},
	{
		group : "Leonard Cohen",
		song : "Hallelujah"
	},
	{
		group : "Paul McCartney",
		song : "Coming up"
	},
	{
		group : "Paul McCartney",
		song : "Say Say Say (ft Michael Jackson)"
	},
	{
		group : "Phil Collins",
		song : "Sussudio"
	}
];

let en_1980_m_2 = [
	{
		id : 3,
		group : 'Rick Astley',
		song : "Never Gonna Give You Up"
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
		id : 24,
		group : "Jermaine Jackson",
		song : "When the Rain Begins to Fall (ft Pia Zadora)"
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
		id : 58,
		group : "Detto Mariano",
		song : "La pigiatura (ft Clown, Patrizia Tapparelli)"
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
	}
];

let en_1980_m_3 = [
	{
		id : 10,
		group : 'Michael Jackson',
		song : "Billie Jean"
	},
	{
		id : 11,
		group : 'Michael Jackson',
		song : "Beat It"
	},
	{
		id : 12,
		group : 'Michael Jackson',
		song : "Smooth Criminal"
	},
	{
		id : 13,
		group : 'Michael Jackson',
		song : "Thriller"
	},
	{
		id : 14,
		group : 'Michael Jackson',
		song : "Rock with You"
	},
	{
		id : 27,
		group : 'Morrissey',
		song : "Everyday Is Like Sunday"
	},
	{
		id : 31,
		group : "Kenny Loggins",
		song : "Footloose"
	},
	{
		group : 'George Thorogood',
		song : "Bad To The Bone"
	},
	{
		group : 'Ozzy Osbourne',
		song : "Crazy Train"
	},
	{
		group : 'Danzig',
		song : "Mother"
	},
	{
		group : "Prince",
		song : "When Doves Cry"
	},
	{
		group : "Prince",
		song : "Let's Go Crazy (ft The Revolution)"
	},
	{
		group : "Prince",
		song : "Purple Rain"
	},
	{
		group : "Prince",
		song : "Raspberry Beret"
	},
	{
		group : "Freddie Mercury",
		song : "Living on my own"
	},
	{
		group : "Freddie Mercury",
		song : "The great pretender"
	},
	{
		group : "Rupert Holmes",
		song : "Escape (The Pina Colada Song)"
	},
	{
		group : "Christopher Cross",
		song : "Sailing"
	},
	{
		group : "Christopher Cross",
		song : "Arthur's Theme (Best That You Can Do)"
	},
	{
		group : "Kenny Rogers",
		song : "Lady"
	},
	{
		group : "Kenny Rogers",
		song : "Islands In The Stream"
	},
	{
		group : "John Lennon",
		song : "(Just Like) Starting Over"
	},
	{
		group : "John Lennon",
		song : "Woman"
	},
	{
		group : "Elton John",
		song : "Sacrifice"
	},
	{
		group : "Elton John",
		song : "A Word In Spanish"
	},
	{
		group : "Elton John",
		song : "Candle In The Wind"
	},
	{
		group : "Elton John",
		song : "I'm Still Standing"
	},
	{
		group : "Rick Springfield",
		song : "Jessie's Girl"
	},
	{
		group : "Vangelis",
		song : "Chariots Of Fire"
	},
	{
		group : "John Waite",
		song : "Missing You"
	},
	{
		group : "Marvin Gaye",
		song : "Sexual Healing"
	},
	{
		group : "Tom Petty",
		song : "Free Fallin'"
	},
	{
		group : "Tom Petty",
		song : "I Won't Back Down"
	},
	{
		group : "Tom Petty",
		song : "American Girl (ft The Heartbreakers)"
	},
	{
		group : "Howard Jones",
		song : "What Is Love?"
	},
	{
		group : "Dave Stewart",
		song : "Lily Was Here (ft Candy Dulfer)"
	},
	{
		group : "Sting",
		song : "Englishman In New York"
	},
	{
		group : "Sting",
		song : "Fields Of Gold"
	},
	{
		group : "Sting",
		song : "Fragile"
	},
	{
		group : "Billy Idol",
		song : "Rebel Yell"
	},
	{
		group : "Billy Idol",
		song : "Dancing With Myself"
	},
	{
		group : "Billy Idol",
		song : "White Wedding"
	},
	{
		group : "Billy Idol",
		song : "Eyes Without A Face"
	},
	{
		group : "David Bowie",
		song : "Changes"
	},
	{
		group : "David Bowie",
		song : "Starman"
	},
	{
		group : "David Bowie",
		song : "Let's Dance"
	},
	{
		group : "David Bowie",
		song : "Ashes To Ashes"
	},
	{
		group : "David Bowie",
		song : "The Man Who Sold The World"
	},
	{
		group : "David Bowie",
		song : "China Girl"
	},
	{
		group : "David Bowie",
		song : "Modern Love"
	}
];

let en_1980_f_1 = [
	{
		group : 'Madonna',
		song : "Like A Virgin"
	},
	{
		group : 'Madonna',
		song : "Material Girl"
	},
	{
		group : 'Madonna',
		song : "Borderline"
	},
	{
		group : 'Madonna',
		song : "Lucky Star"
	},
	{
		group : 'Madonna',
		song : "Crazy for You"
	},
	{
		group : 'Dolly Parton',
		song : "9 to 5"
	},
	{
		group : 'Janet Jackson',
		song : "When I Think Of You"
	},
	{
		group : 'Tracy Chapman',
		song : "Fast Car"
	},
	{
		group : "Jennifer Warnes",
		song : "(I've Had) The Time of My Life (ft Bill Medley)"
	},
	{
		group : "Joan Jett",
		song : "I Love Rock 'N' Roll (ft The Blackhearts)"
	}
];

let en_1980_f_2 = [
	{
		id : 5,
		group : 'Nena',
		song : "99 Red Baloons"
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

let en_1990_gr = [
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Hole In My Soul"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Pink"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Walk This Way"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Longview"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Basket Case"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "When I Come Around"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "J.A.R."
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Brain Stew"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Good Riddance"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Redundant"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Minority"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Warning"
		},
		{
			pack : 1,
			group : 'Green Day',
			song : "Hitchin' A Ride"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "Why Don't You Get A Job"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "The Kids Aren't Alright"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "Original Prankster"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "Come Out and Play"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "Self Esteem"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "All I Want"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "Gone Away"
		},
		{
			pack : 1,
			group : 'Offspring',
			song : "Pretty Fly"
		},
		{
			pack : 1,
			group : "Guns N Roses",
			song : "You Could Be Mine"
		},
		{
			pack : 1,
			group : "Guns N Roses",
			song : "Don't Cry"
		},
		{
			pack : 1,
			group : "Guns N Roses",
			song : "November Rain"
		},
		{
			pack : 1,
			group : "Guns N Roses",
			song : "Knockin' On Heaven's Door"
		},
		{
			pack : 1,
			group : "Guns N Roses",
			song : "Sympathy For The Devil"
		},
		{
			pack : 1,
			group : 'AC/DC',
			song : "Thunderstuck"
		},
		{
			pack : 1,
			group : 'AC/DC',
			song : "Moneytalks"
		},
		{
			pack : 1,
			group : 'AC/DC',
			song : "Are You Ready"
		},
		{
			pack : 1,
			group : 'AC/DC',
			song : "Highway to Hell"
		},
		{
			pack : 1,
			group : 'AC/DC',
			song : "Big Gun"
		},
		{
			pack : 1,
			group : 'AC/DC',
			song : "Hard as a Rock"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Give It Away"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Under The Bridge"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Soul To Squeeze"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Warped"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "My Friends"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Scar Tissue"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Otherside"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Californication"
		},
		{
			pack : 1,
			group : 'Red Hot Chili Peppers',
			song : "Road Trippin'"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "I Don't Want to Miss a Thing"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Livin' on the Edge"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Eat The Rich"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Cryin'"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Crazy"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Amazing"
		},
		{
			pack : 1,
			group : 'Aerosmith',
			song : "Falling In Love"
		},
		{
			pack : 2,
			group : 'REM',
			song : "Loosing My Religion"
		},
		{
			pack : 2,
			group : 'REM',
			song : "Everybody Hurts"
		},
		{
			pack : 2,
			group : 'REM',
			song : "Shiny Happy People"
		},
		{
			pack : 2,
			group : 'Oasis',
			song : "Wonderwall"
		},
		{
			pack : 2,
			group : 'Oasis',
			song : "D'You Know What I Mean?"
		},
		{
			pack : 2,
			group : 'Oasis',
			song : "Don't Look Back In Anger"
		},
		{
			pack : 2,
			group : 'Oasis',
			song : "Champagne Supernova"
		},
		{
			pack : 2,
			group : 'Oasis',
			song : "Live Forever"
		},
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "Blaze Of Glory"
		},
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "Always"
		},
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "Bed Of Roses"
		},
		{
			pack : 2,
			group : 'U2',
			song : "One"
		},
		{
			pack : 3,
			group : 'Garbage',
			song : "I Think I'm Paranoid"
		},
		{
			pack : 3,
			group : 'Garbage',
			song : "Only Happy When It Rains"
		},
		{
			pack : 3,
			group : 'Garbage',
			song : "#1 Crush"
		},
		{
			pack : 3,
			group : 'Garbage',
			song : "Push It"
		},
		{
			pack : 3,
			group : 'Garbage',
			song : "You Look So Fine"
		},
		{
			pack : 3,
			group : 'Garbage',
			song : "Stupid Girl"
		},
		{
			pack : 2,
			group : 'U2',
			song : "The Fly"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Mysterious Ways"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Even Better Than The Real Thing"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Stay (Faraway, So Close!)"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Hold Me, Thrill Me, Kiss Me, Kill Me"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Discotheque"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Staring At The Sun"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Sweetest Thing"
		},
		{
			pack : 2,
			group : 'U2',
			song : "Beautiful Day"
		},
		{
			pack : 2,
			group : 'Blink 182',
			song : "Dammit"
		},
		{
			pack : 2,
			group : 'Blink 182',
			song : "What's My Age Again?"
		},
		{
			pack : 2,
			group : 'Blink 182',
			song : "All The Small Things"
		},
		{
			pack : 2,
			group : 'Blink 182',
			song : "Adam's Song"
		},
		{
			pack : 2,
			group : 'Blink 182',
			song : "Man Overboard"
		},
		{
			pack : 2,
			group : 'REM',
			song : "Man On The Moon"
		},
		{
			pack : 2,
			group : 'Queen',
			song : "Made In Heaven"
		},
		{
			pack : 2,
			group : 'Chumbawamba',
			song : "Tubthumping"
		},	
		{
			pack : 2,
			group : 'Soundgarden',
			song : "Black Hole Sun"
		},
		{
			pack : 2,
			group : 'Nazareth',
			song : "Cocaine"
		},
		{
			pack : 2,
			group : 'Goo Goo Dolls',
			song : "Iris"
		},
		{
			pack : 2,
			group : 'Goo Goo Dolls',
			song : "Slide"
		},	
		{
			pack : 2,
			group : 'Soundgarden',
			song : "Spoonman"
		},	
		{
			pack : 2,
			group : 'Soundgarden',
			song : "Fell On Black Days"
		},
		{
			pack : 2,
			group : 'REM',
			song : "Drive"
		},
		{
			pack : 4,
			group : 'Urge Overkill',
			song : "Girl, You'll Be A Woman Soon"
		},
		{
			pack : 2,
			group : 'ZZ Top',
			song : "My Head's In Mississippi"
		},
		{
			pack : 2,
			group : 'ZZ Top',
			song : "Doubleback"
		},
		{
			pack : 2,
			group : 'ZZ Top',
			song : "Concrete And Steel"
		},
		{
			pack : 2,
			group : 'ZZ Top',
			song : "Give It Up"
		},
		{
			pack : 2,
			group : 'ZZ Top',
			song : "Viva Las Vegas"
		},
		{
			pack : 2,
			group : 'ZZ Top',
			song : "Pincushion"
		},
		{
			pack : 3,
			group : 'Massive Attack',
			song : "Unfinished Sympathy"
		},
		{
			pack : 3,
			group : 'Massive Attack',
			song : "Teardrop"
		},
		{
			pack : 2,
			group : 'Cypress Hill',
			song : "Insane In The Brain"
		},
		{
			pack : 2,
			group : 'Cypress Hill',
			song : "Hits from the Bong"
		},
		{
			pack : 2,
			group : 'Cypress Hill',
			song : "How I Could Just Kill a Man"
		},
		{
			pack : 2,
			group : 'Cypress Hill',
			song : "Tequila Sunrise"
		},
		{
			pack : 2,
			group : 'Cypress Hill',
			song : "I Wanna Get High"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Suicide Blonde"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Disappear"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "By My Side"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Bitter Tears"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Shining Star"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Taste It"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "All Around"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Baby Dont Cry"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "The Strangest Party"
		},
		{
			pack : 3,
			group : 'INXS',
			song : "Deliver Me"
		},
		{
			pack : 3,
			group : 'Foo Fighters',
			song : "Monkey Wrench"
		},
		{
			pack : 3,
			group : 'Foo Fighters',
			song : "Everlong"
		},
		{
			pack : 3,
			group : 'Jamiroquai',
			song : "Virtual Insanity"
		},
		{
			pack : 4,
			group : 'Moloko',
			song : "Sing in Back"
		},
		{
			pack : 4,
			group : 'Beloved',
			song : 'Sweet harmony',
			state: ' по Белавд'
		},
		{
			pack : 4,
			group : 'Fugees',
			song : "Killing Me Softly"
		},
		{
			pack : 4,
			group : 'Kriss Kross',
			song : "Jump"
		},
		{
			pack : 4,
			group : 'Reamonn',
			song : "Supergirl"
		},
		{
			pack : 4,
			group : 'Extreme',
			song : "More Than Words"
		},
		{
			pack : 4,
			group : 'Fools Garden',
			song : "Lemon Tree"
		},
		{
			pack : 4,
			group : 'Duran Duran',
			song : "Ordinary World"
		},
		{
			pack : 4,
			group : 'Duran Duran',
			song : "Come Undone"
		},
		{
			pack : 4,
			group : 'Texas',
			song : "Summer Son"
		},
		{
			pack : 4,
			group : 'UB40',
			song : "I Can't Help Falling In Love With You"
		},
		{
			pack : 4,
			group : 'No Mercy',
			song : "Where Do You Go"
		},
		{
			pack : 4,
			group : 'Wet Wet Wet',
			song : "Love Is All Around"
		},
		{
			pack : 4,
			group : 'Tears For Fears',
			song : "Break It Down Again"
		},
		{
			pack : 4,
			group : 'Fugees',
			song : "Ready Or Not"
		},
		{
			pack : 4,
			group : 'Fools Garden',
			song : "Probably"
		},	
		{
			pack : 4,
			group : 'TLC',
			song : "No Scrubs"
		},
		{
			pack : 4,
			group : 'Ten Sharp',
			song : "You"
		},
		{
			pack : 4,
			group : 'Soul Asylum',
			song : "Runaway Train"
		},
		{
			pack : 4,
			group : 'Boyz II Men',
			song : "I'll Make Love To You"
		},
		{
			pack : 4,
			group : 'Boyz II Men',
			song : "End Of The Road"
		},	
		{
			pack : 4,
			group : 'TLC',
			song : "Waterfalls"
		},		
		{
			pack : 4,
			group : 'Mike + The Mechanics',
			song : "Over My Shoulder"
		},
		{
			pack : 4,
			group : 'Mike + The Mechanics',
			song : "Another Cup of Coffee"
		},
		{
			pack : 4,
			group : 'Hanson',
			song : "MMMBop"
		},
		{
			pack : 4,
			group : 'White Town',
			song : "Your Woman"
		},	
		{
			pack : 4,
			group : '4 Non Blondes',
			song : "What's Up?"
		},		
		{
			pack : 4,
			group : 'Touch & Go',
			song : "Would You...?"
		},
		{
			pack : 4,
			group : 'Touch & Go',
			song : "Tango In Harlem"
		},
		{
			pack : 4,
			group : 'Pretenders',
			song : "I'll Stand by You"
		},
		{
			pack : 4,
			group : 'Sixpence None The Richer',
			song : "Kiss Me"
		},
		{
			pack : 4,
			group : 'Everything But The Girl',
			song : "Missing"
		},
		{
			pack : 4,
			group : 'Genesis',
			song : "I Can't Dance"
		},
		{
			pack : 4,
			group : 'Genesis',
			song : "No Son Of Mine"
		},
		{
			pack : 4,
			group : 'Lightning Seeds',
			song : "You Showed Me"
		},
		{
			pack : 4,
			group : 'Vaya Con Dios',
			song : "What's a Woman"
		},
		{
			pack : 4,
			group : 'Vaya Con Dios',
			song : "Nah Neh Nah"
		},
		{
			pack : 4,
			group : 'Mr Big',
			song : "Wild World"
		},
		{
			pack : 4,
			group : 'Lighthouse Family',
			song : "Ain't No Sunshine"
		},
		{
			pack : 5,
			group : 'Depeche Mode',
			song : "Enjoy The Silence"
		},
		{
			pack : 5,
			group : 'Depeche Mode',
			song : "Policy Of Truth"
		},
		{
			pack : 5,
			group : 'Depeche Mode',
			song : "World In My Eyes"
		},
		{
			pack : 5,
			group : 'Depeche Mode',
			song : "It's No Good"
		},
		{
			pack : 5,
			group : 'Blur',
			song : "Girls And Boys"
		},
		{
			pack : 5,
			group : 'Blur',
			song : "Country House"
		},
		{
			pack : 5,
			group : 'Blur',
			song : "The Universal"
		},
		{
			pack : 5,
			group : 'Blur',
			song : "Beetlebum"
		},
		{
			pack : 5,
			group : 'Blur',
			song : "Song 2"
		},
		{
			pack : 5,
			group : 'Blur',
			song : "Tender"
		},
		{
			pack : 5,
			group : 'Spice Girls',
			song : "Too Much"
		},
		{
			pack : 5,
			group : 'Spice Girls',
			song : "Wannabe"
		},
		{
			pack : 5,
			group : 'Spice Girls',
			song : "Say You'll Be There"
		},
		{
			pack : 5,
			group : 'Spice Girls',
			song : "Move Over"
		},
		{
			pack : 5,
			group : 'Verve',
			song : "Bitter Sweet Symphony"
		},
		{
			pack : 5,
			group : 'Cardigans',
			song : "Do You Believe"
		},
		{
			pack : 5,
			group : 'Cardigans',
			song : "My Favourite Game"
		},
		{
			pack : 5,
			group : 'Cardigans',
			song : "Erase / Rewind"
		},
		{
			pack : 5,
			group : 'Cardigans',
			song : "Lovefool"
		},
		{
			pack : 5,
			group : "NSYNK",
			song : "Bye Bye Bye"
		},
		{
			pack : 5,
			group : "NSYNK",
			song : "It's Gonna Be Me"
		},
		{
			pack : 5,
			group : 'Cranberries',
			song : "Zombie"
		},
		{
			pack : 5,
			group : 'Cranberries',
			song : "Dreams"
		},
		{
			pack : 5,
			group : 'Cranberries',
			song : "Linger"
		},
		{
			pack : 5,
			group : 'Cranberries',
			song : "Ode To My Family"
		},
		{
			pack : 5,
			group : 'No Doubt',
			song : "Just A Girl"
		},
		{
			pack : 5,
			group : 'No Doubt',
			song : "Don't Speak"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Do What You Like"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "A Million Love Songs"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "I Found Heaven"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Could It Be Magic"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Back for Good"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Pray"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Relight My Fire"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Everything Changes"
		},
		{
			pack : 5,
			group : 'Take That',
			song : "Babe"
		},
		{
			pack : 5,
			group : 'Five',
			song : "Slam Dunk (Da Funk)"
		},
		{
			pack : 5,
			group : 'Five',
			song : "When the Lights Go Out"
		},
		{
			pack : 5,
			group : 'Five',
			song : "Got the Feelin'"
		},
		{
			pack : 5,
			group : 'Five',
			song : "Everybody Get Up"
		},
		{
			pack : 5,
			group : 'Five',
			song : "Until the Time Is Through"
		},
		{
			pack : 5,
			group : 'Five',
			song : "Invincible"
		},
		{
			pack : 5,
			group : 'Five',
			song : "Don't Wanna Let You Go"
		},
		{
			pack : 5,
			group : 'Verve',
			song : "The Drugs Don't Work"
		},
		{
			pack : 5,
			group : 'Verve',
			song : "Lucky Man"
		},
		{
			pack : 5,
			group : 'Verve',
			song : "Sonnet"
		},
		{
			pack : 6,
			group : 'Paradisio',
			song : "Bailando"
		},
		{
			pack : 6,
			group : 'Paradisio',
			song : "Vamos a la Discoteca"
		},
		{
			pack : 6,
			group : 'Reel 2 Real',
			song : "Can You Feel It (feat. The Mad Stuntman)"
		},
		{
			pack : 6,
			group : 'Reel 2 Real',
			song : "Go On Move (ft The Mad Stuntman)"
		},
		{
			pack : 6,
			group : 'Reel 2 Real',
			song : "I Like to Move It (ft The Mad Stuntman)"
		},
		{
			pack : 6,
			group : 'Reel 2 Real',
			song : "The New Anthem (ft Erick Moore)"
		},	
		{
			pack : 6,
			group : 'Eiffel 65',
			song : "Blue (Da Ba Dee)"
		},
		{
			pack : 6,
			group : 'Eiffel 65',
			song : "Move Your Body"
		},
		{
			pack : 6,
			group : 'Crazy Town',
			song : "Butterfly"
		},
		{
			pack : 6,
			group : 'SNAP',
			song : "The Power"
		},
		{
			pack : 6,
			group : 'SNAP',
			song : "Believe In It"
		},
		{
			pack : 6,
			group : 'SNAP',
			song : "Oops Up"
		},
		{
			pack : 6,
			group : 'SNAP',
			song : "Rhythm Is A Dancer"
		},
		{
			pack : 6,
			group : 'Capella',
			song : "U Got 2 Let The Music"
		},
		{
			pack : 6,
			group : 'Urban Cookie Collective',
			song : "High On A Happy Vibe"
		},
		{
			pack : 6,
			group : 'CoRo',
			song : "Because the Night (ft Taleesa)"
		},
		{
			pack : 6,
			group : 'New Order',
			song : "World In Motion"
		},
		{
			pack : 6,
			group : 'Culture Beat',
			song : "Mr. Vain"
		},
		{
			pack : 6,
			group : 'Culture Beat',
			song : "Anything"
		},
		{
			pack : 6,
			group : 'Antique',
			song : "Opa Opa"
		},
		{
			pack : 6,
			group : '2 Unlimited',
			song : "No Limit"
		},
		{
			pack : 6,
			group : '2 Unlimited',
			song : "Let The Beat Control Your Body"
		},
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Dream a Dream"
		},
		{
			pack : 6,
			group : 'Corona',
			song : "The Rhythm of the Night"
		},
		{
			pack : 6,
			group : 'Masterboy',
			song : "Feel the Heat of the Night"
		},
		{
			pack : 6,
			group : 'EMF',
			song : "Unbelievable"
		},
		{
			pack : 6,
			group : 'Pharao',
			song : "There Is A Star"
		},
		{
			pack : 6,
			group : 'Pharao',
			song : "I Show You Secrets"
		},
		{
			pack : 6,
			group : 'Pharao',
			song : "Gold In The Pyramid"
		},	
		{
			pack : 6,
			group : 'Inner Circle',
			song : "Sweat (A La La La La Song)"
		},
		{
			pack : 6,
			group : 'Smash Mouth',
			song : "All Star"
		},
		{
			pack : 6,
			group : 'Smash Mouth',
			song : "I'm A Believer"
		},
		{
			pack : 6,
			group : 'Yaki-Da',
			song : "I Saw You Dancing"
		},
		{
			pack : 6,
			group : 'Yaki-Da',
			song : "Just a Dream"
		},
		{
			pack : 6,
			group : 'Sade',
			song : "No Ordinary Love"
		},
		{
			pack : 6,
			group : 'Domino',
			song : "Baila baila conmigo"
		},
		{
			pack : 6,
			group : 'Real McCoy',
			song : "Another Night"
		},
		{
			pack : 6,
			group : 'New Order',
			song : "Regret"
		},	
		{
			pack : 6,
			group : 'Eiffel 65',
			song : "Back in Time"
		},	
		{
			pack : 6,
			group : 'Eiffel 65',
			song : "Too Much Of Heaven"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Get Up"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Together and Forever"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Only You"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Soldier Soldier"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Captain Jack"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Little Boy"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Drill Instructor"
		},	
		{
			pack : 6,
			group : 'Captain Jack',
			song : "Holiday"
		},	
		{
			pack : 6,
			group : 'Sash',
			song : "Equador"
		},	
		{
			pack : 6,
			group : 'Sash',
			song : "Adelante"
		},	
		{
			pack : 6,
			group : 'Me & My',
			song : "Dub I Dub"
		},	
		{
			pack : 6,
			group : 'Me & My',
			song : "Let The Love Go On"
		},	
		{
			pack : 6,
			group : 'Me & My',
			song : "Baby Boy"
		},	
		{
			pack : 6,
			group : 'Me & My',
			song : "Secret Garden"
		},	
		{
			pack : 3,
			group : 'Foo Fighters',
			song : "Learn to Fly"
		},	
		{
			pack : 3,
			group : 'Foo Fighters',
			song : "My Hero"
		},	
		{
			pack : 3,
			group : 'Foo Fighters',
			song : "Big Me"
		},	
		{
			pack : 6,
			group : 'Inner Circle',
			song : "Bad Boys"
		},	
		{
			pack : 4,
			group : 'Cue',
			song : "Hello"
		},	
		{
			pack : 6,
			group : 'Basic Element',
			song : "Touch"
		},	
		{
			pack : 6,
			group : 'Basic Element',
			song : "Move Me"
		},	
		{
			pack : 6,
			group : 'Basic Element',
			song : "The Promise Man"
		},	
		{
			pack : 6,
			group : 'Basic Element',
			song : "Leave It Behind"
		},	
		{
			pack : 6,
			group : 'Basic Element',
			song : "The Ride"
		},	
		{
			pack : 6,
			group : 'Basic Element',
			song : "Shame"
		},	
		{
			pack : 6,
			group : '2 Unlimited',
			song : "Get Ready For This"
		},	
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "Keep The Faith"
		},	
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "Someday I'll Be Saturday Night"
		},	
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "This Ain't A Love Song"
		},	
		{
			pack : 2,
			group : 'Bon Jovi',
			song : "Real Love"
		},	
		{
			pack : 6,
			group : 'Corona',
			song : "Baby Baby"
		},	
		{
			pack : 6,
			group : 'Corona',
			song : "I Don’t Wanna Be A Star"
		},	
		{
			pack : 6,
			group : 'Corona',
			song : "Try Me Out"
		},
		{
			pack : 6,
			group : '2 Unlimited',
			song : "Twilight Zone"
		},
		{
			pack : 6,
			group : '2 Unlimited',
			song : "Tribal Dance"
		},
		{
			pack : 3,
			group : 'Portishead',
			song : "Numb"
		},
		{
			pack : 3,
			group : 'Portishead',
			song : "Sour Times"
		},
		{
			pack : 3,
			group : 'Portishead',
			song : "Glory Box"
		},
		{
			pack : 3,
			group : 'Portishead',
			song : "All Mine"
		},
		{
			pack : 3,
			group : 'Portishead',
			song : "Over"
		},
		{
			pack : 3,
			group : 'Portishead',
			song : "Only You"
		},
		{
			pack : 3,
			group : 'L7',
			song : "Drama"
		},
		{
			pack : 3,
			group : 'L7',
			song : "Off the Wagon"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "Open Your Eyes"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "Rain"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "Lords Of The Boards"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "Don't You Turn Your Back On Me"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "Big in Japan"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "No Speech"
		},
		{
			pack : 3,
			group : 'Guano Apes',
			song : "Living in a Lie"
		},
		{
			pack : 6,
			group : 'Brooklyn Bounce',
			song : "Bass, Beats & Melody"
		},
		{
			pack : 6,
			group : 'Brooklyn Bounce',
			song : "Get Ready to Bounce"
		},
		{
			pack : 6,
			group : 'Brooklyn Bounce',
			song : "Take a Ride"
		}
];

let en_1990_gr_1 =	en_1990_gr.filter(item => item.pack == 1);
let en_1990_gr_2 =	en_1990_gr.filter(item => item.pack == 2);
let en_1990_gr_3 =	en_1990_gr.filter(item => item.pack == 3);
let en_1990_gr_4 =	en_1990_gr.filter(item => item.pack == 4);
let en_1990_gr_5 =	en_1990_gr.filter(item => item.pack == 5);
let en_1990_gr_6 =	en_1990_gr.filter(item => item.pack == 6);

let en_1990_m = [
		{
			pack : 3,
			group : 'Sin With Sebastian',
			song : "Shut Up (And Sleep With Me)"
		},
		{
			pack : 1,
			group : 'Robert Miles',
			song : "One And One"
		},
		{
			pack : 1,
			group : 'Coolio',
			song : "Gangsta's Paradise (ft LV)"
		},
		{
			pack : 1,
			group : 'Robert Miles',
			song : "Children"
		},
		{
			pack : 1,
			group : 'Will Smith',
			song : "Men in black"
		},
		{
			pack : 1,
			group : 'Enrique Iglesias',
			song : "Bailamos"
		},
		{
			pack : 1,
			group : 'Bruce Springsteen',
			song : "Streets of Philadelphia"
		},
		{
			pack : 1,
			group : 'Seal',
			song : "Kiss From A Rose"
		},
		{
			pack : 1,
			group : 'Eagle-Eye Cherry',
			song : "Save Tonight"
		},
		{
			pack : 1,
			group : 'Eagle-Eye Cherry',
			song : "Indecision"
		},
		{
			pack : 3,
			group : 'Haddaway',
			song : "What Is Love?"
		},
		{
			pack : 3,
			group : 'Haddaway',
			song : "Life"
		},
		{
			pack : 3,
			group : 'Haddaway',
			song : "I Miss You"
		},
		{
			pack : 3,
			group : 'Haddaway',
			song : "What About Me"
		},
		{
			pack : 1,
			group : 'Fatboy Slim',
			song : "The Rockafeller Skank"
		},
		{
			pack : 1,
			group : 'Michael Bolton',
			song : "Can I Touch You...There?"
		},
		{
			pack : 1,
			group : 'Lenny Kravitz',
			song : "Fly Away"
		},
		{
			pack : 1,
			group : 'Joe Cocker',
			song : "N'Oubliez Jamais"
		},
		{
			pack : 1,
			group : 'Paul McCartney',
			song : "Hope Of Deliverance"
		},
		{
			pack : 1,
			group : 'Marc Anthony',
			song : "When I Dream At Night"
		},
		{
			pack : 1,
			group : 'Maxi Priest',
			song : "Close To You"
		},
		{
			pack : 1,
			group : 'Snoop Dogg',
			song : "Jin & Guice"
		},
		{
			pack : 1,
			group : 'Chris Isaak',
			song : "Somebody's Crying"
		},
		{
			pack : 1,
			group : 'Tom Petty',
			song : "Mary Jane's Last Dance (ft The Heartbreakers)"
		},
		{
			pack : 1,
			group : 'Chris Rea',
			song : "The Blue Cafe"
		},
		{
			pack : 1,
			group : 'Ronan Keating',
			song : "When You Say Nothing At All"
		},
		{
			pack : 1,
			group : 'David Gray',
			song : "Sail Away"
		},
		{
			pack : 1,
			group : 'George Michael',
			song : "The Strangest Thing"
		},
		{
			pack : 1,
			group : '2Pac',
			song : "California Love (ft Dr. Dre, Roger Troutman)"
		},
		{
			pack : 3,
			group : 'Vanilla Ice',
			song : "Ice Ice Baby"
		},
		{
			pack : 3,
			group : 'MC Hammer',
			song : "U Can't Touch This"
		},
		{
			pack : 3,
			group : 'Guru Josh',
			song : "Infinity"
		},
		{
			pack : 3,
			group : 'Dr Alban',
			song : "It's My Life"
		},
		{
			pack : 3,
			group : 'Dr Alban',
			song : "Let The Beat Go On"
		},
		{
			pack : 3,
			group : 'Alex Christensen',
			song : "Du hast den schönsten Arsch der Welt"
		},
		{
			pack : 3,
			group : 'Snow',
			song : "Informer"
		},
		{
			pack : 3,
			group : 'Ini Kamoze',
			song : "Here Comes the Hotstepper"
		},
		{
			pack : 3,
			group : 'Scatman John',
			song : "Scatman"
		},
		{
			pack : 3,
			group : 'Scatman John',
			song : "Scatman's World"
		},
		{
			pack : 1,
			group : 'George Michael',
			song : "Jesus to a Child"
		},
		{
			pack : 1,
			group : 'George Michael',
			song : "Roxanne"
		},
		{
			pack : 1,
			group : 'Prince',
			song : "The most beautiful girl in the world"
		},
		{
			pack : 1,
			group : 'Prince',
			song : "Cream"
		},
		{
			pack : 1,
			group : 'Edwyn Collins',
			song : "A Girl Like You"
		},
		{
			pack : 1,
			group : 'Beck',
			song : "Where It's At"
		},
		{
			pack : 1,
			group : 'Beck',
			song : "Loser"
		},
		{
			pack : 1,
			group : 'Andrea Bocelli',
			song : "Con Te Partiro"
		},
		{
			pack : 1,
			group : 'Rod Stewart',
			song : "Have I Told You Lately"
		},
		{
			pack : 1,
			group : 'Richard Marx',
			song : "Now And Forever"
		},
		{
			pack : 2,
			group : 'Ricky Martin',
			song : "The Cup of Life"
		},
		{
			pack : 2,
			group : 'Ricky Martin',
			song : "Livin' la Vida Loca"
		},
		{
			pack : 2,
			group : 'Lou Bega',
			song : "Mamba 5"
		},
		{
			pack : 3,
			group : 'Shaggy',
			song : "Boombastic"
		},
		{
			pack : 2,
			group : 'Carlos Santana',
			song : "Smooth (ft Rob Thomas)"
		},
		{
			pack : 2,
			group : 'Carlos Santana',
			song : "Corazon Espinado"
		},
		{
			pack : 2,
			group : 'Khaled',
			song : "Aisha"
		},
		{
			pack : 2,
			group : 'Adriano Celentano',
			song : "Angel"
		},
		{
			pack : 2,
			group : 'Elton John',
			song : "Candle In The Wind"
		},
		{
			pack : 2,
			group : 'Elton John',
			song : "Circle Of Life"
		},
		{
			pack : 2,
			group : 'Elton John',
			song : "The One"
		},
		{
			pack : 2,
			group : 'Elton John',
			song : "Something About The Way You Look Tonight"
		},
		{
			pack : 2,
			group : 'Bryan Adams',
			song : "All For Love (ft Sting, Rod Stewart)"
		},
		{
			pack : 2,
			group : 'Bryan Adams',
			song : "Please Forgive Me"
		},
		{
			pack : 2,
			group : 'Bryan Adams',
			song : "(Everything I Do) I Do It For You"
		},
		{
			pack : 2,
			group : 'Bryan Adams',
			song : "Have You Ever Really Loved A Woman?"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "Remember the Time"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "Heal The World"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "Scream (ft Janet Jackson)"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "You Are Not Alone"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "Earth Song"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "They Don't Care About Us"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "Jam"
		},
		{
			pack : 2,
			group : 'Michael Jackson',
			song : "Black or White"
		},
		{
			pack : 2,
			group : 'Sting',
			song : "Fields Of Gold"
		},
		{
			pack : 2,
			group : 'Sting',
			song : "Desert Rose"
		},
		{
			pack : 2,
			group : 'Sting',
			song : "Shape Of My Heart"
		},
		{
			pack : 2,
			group : 'R. Kelly',
			song : "I Believe I Can Fly"
		},
		{
			pack : 2,
			group : 'Phil Collins',
			song : 'Another day in paradise',
			state: ' по Коллинзу'
		},
		{
			pack : 2,
			group : 'Eric Clapton',
			song : 'Tears in heaven',
			state: ' по Клэптену'
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Freedom"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Old Before I Die"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Lazy Days"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "South Of The Border"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Angels"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Millenium"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "No Regrets"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Rock DJ"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Kids (ft Kylie Minogue)"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Supreme"
		},
		{
			pack : 2,
			group : 'Robbie Williams',
			song : "Better Man"
		},
		{
			pack : 2,
			group : 'Moby',
			song : "Go"
		},
		{
			pack : 2,
			group : 'Moby',
			song : "Move"
		},
		{
			pack : 2,
			group : 'Moby',
			song : "James Bond Theme"
		},
		{
			pack : 2,
			group : 'Moby',
			song : "Why Does My Heart Feel So Bad?"
		},
		{
			pack : 2,
			group : 'Moby',
			song : "Natural Blues"
		},
		{
			pack : 2,
			group : 'Moby',
			song : "Porcelain"
		},
		{
			pack : 1,
			group : 'Fatboy Slim',
			song : "Praise You"
		},
		{
			pack : 1,
			group : 'Seal',
			song : "Crazy"
		},
		{
			pack : 2,
			group : 'Ricky Martin',
			song : "Private Emotion (ft Meja)"
		},
		{
			pack : 2,
			group : 'Eric Clapton',
			song : "Over The Rainbow"
		},
		{
			pack : 1,
			group : 'Michael Bolton',
			song : "When a Man Loves a Woman"
		},
		{
			pack : 1,
			group : 'Lenny Kravitz',
			song : "Are You Gonna Go My Way"
		},
		{
			pack : 1,
			group : 'Chris Isaak',
			song : "Wicked Game"
		},
		{
			pack : 1,
			group : 'Ozzy Osbourne',
			song : "Mama, I'm Coming Home"
		},
		{
			pack : 1,
			group : 'Ozzy Osbourne',
			song : "See You on the Other Side"
		},
		{
			pack : 1,
			group : 'Youssou NDour',
			song : "7 Seconds (ft Neneh Cherry)"
		},
		{
			pack : 2,
			group : 'Everlast',
			song : "Put your lights on (ft Santana)"
		},
		{
			pack : 2,
			group : 'Everlast',
			song : "What Its Like"
		},
		{
			pack : 2,
			group : 'Everlast',
			song : "Ends"
		}
];

let en_1990_m_1 =	en_1990_m.filter(item => item.pack == 1);
let en_1990_m_2 =	en_1990_m.filter(item => item.pack == 2);
let en_1990_m_3 =	en_1990_m.filter(item => item.pack == 3);

let en_1990_f = [
		{
			pack : 1,
			group : 'Ardis',
			song : "Ain't nobody's business",
			state: ' по Ардис'
		},
		{
			pack : 1,
			group : "Sinead O'Connor",
			song : "Nothing Compares 2 U"
		},
		{
			pack : 1,
			group : 'Suzanne Vega',
			song : "Tom's Diner"
		},
		{
			pack : 1,
			group : 'Toni Braxton',
			song : "Un-Break My Heart"
		},
		{
			pack : 1,
			group : 'Shania Twain',
			song : "You're Still The One"
		},
		{
			pack : 1,
			group : 'Jennifer Paige',
			song : "Crush"
		},
		{
			pack : 1,
			group : 'Shania Twain',
			song : "Man! I Feel Like A Woman!"
		},
		{
			pack : 1,
			group : 'Sheryl Crow',
			song : "All I Wanna Do"
		},
		{
			pack : 1,
			group : 'Sheryl Crow',
			song : "If It Makes You Happy"
		},
		{
			pack : 1,
			group : 'Janet Jackson',
			song : "That's The Way Love Goes"
		},
		{
			pack : 1,
			group : 'Lisa Loeb',
			song : "Stay"
		},
		{
			pack : 1,
			group : 'Christina Aguilera',
			song : "Genie In A Bottle"
		},
		{
			pack : 1,
			group : 'Tasmin Archer',
			song : "Sleeping Satellite"
		},
		{
			pack : 1,
			group : 'Lara Fabian',
			song : "I Will Love Again"
		},
		{
			pack : 1,
			group : 'LeAnn Rimes',
			song : "Can't Fight The Moonlight"
		},
		{
			pack : 1,
			group : 'Natalia Oreiro',
			song : "Que Si, Que Si"
		},
		{
			pack : 1,
			group : 'Natalia Oreiro',
			song : "De Tu Amor"
		},
		{
			pack : 1,
			group : 'Natalia Oreiro',
			song : "Cambio Dolor"
		},
		{
			pack : 1,
			group : 'Natalia Oreiro',
			song : "Me Muero De Amor"
		},
		{
			pack : 1,
			group : 'Vanessa Paradis',
			song : "Joe le taxi"
		},
		{
			pack : 1,
			group : 'Joan Osbourne',
			song : "One Of Us"
		},
		{
			pack : 1,
			group : 'Dido',
			song : "Thank You"
		},
		{
			pack : 1,
			group : 'Sandy Lee',
			song : "Paradise"
		},
		{
			pack : 1,
			group : 'Toni Braxton',
			song : "I Dont Want To"
		},
		{
			pack : 1,
			group : 'Cher',
			song : "Believe"
		},
		{
			pack : 1,
			group : 'Britney Spears',
			song : "...Baby One More Time"
		},
		{
			pack : 1,
			group : 'Tori Amos',
			song : "Cornflake Girl"
		},
		{
			pack : 1,
			group : 'Whigfield',
			song : "Saturday Night"
		},
		{
			pack : 1,
			group : 'Brandy',
			song : "The Boy Is Mine (ft Monica)"
		},
		{
			pack : 1,
			group : 'Maggie Reilly',
			song : "Everytime We Touch"
		},
		{
			pack : 1,
			group : 'Cesaria Evora',
			song : "Besame Mucho"
		},
		{
			pack : 1,
			group : 'Natalie Imbruglia',
			song : "Torn"
		},
		{
			pack : 1,
			group : 'Donna Lewis',
			song : "I Love You Always Forever"
		},
		{
			pack : 1,
			group : "Des'ree",
			song : "Life"
		},
		{
			pack : 1,
			group : "Des'ree",
			song : "You Gotta Be"
		},
		{
			pack : 1,
			group : 'Shivaree',
			song : "Goodnight Moon"
		},
		{
			pack : 1,
			group : 'Neneh Cherry',
			song : "Woman"
		},
		{
			pack : 1,
			group : 'Melanie C',
			song : "I Turn To You"
		},
		{
			pack : 1,
			group : 'Emilia',
			song : "Big Big World"
		},
		{
			pack : 1,
			group : 'Lauren Christy',
			song : "The color of the night"
		},
		{
			pack : 1,
			group : 'Meredith Brooks',
			song : "Bitch"
		},
		{
			pack : 2,
			group : 'Jennifer Lopez',
			song : "If You Had My Love"
		},
		{
			pack : 2,
			group : 'Jennifer Lopez',
			song : "Waiting for Tonight"
		},
		{
			pack : 2,
			group : 'Jennifer Lopez',
			song : "No Me Ames"
		},
		{
			pack : 2,
			group : 'Jennifer Lopez',
			song : "Let's Get Loud"
		},
		{
			pack : 2,
			group : 'Celine Dion',
			song : "The Power of Love"
		},
		{
			pack : 2,
			group : 'Celine Dion',
			song : "Because You Loved Me"
		},
		{
			pack : 2,
			group : 'Celine Dion',
			song : "It's All Coming Back To Me Now"
		},
		{
			pack : 2,
			group : 'Celine Dion',
			song : "My Heart Will Go On"
		},
		{
			pack : 2,
			group : 'Celine Dion',
			song : "Here There & Everywhere"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Vogue"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Erotica"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Rain"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Secret"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Frozen"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Beautiful Stranger"
		},
		{
			pack : 2,
			group : 'Madonna',
			song : "Ray Of Light"
		},
		{
			pack : 2,
			group : 'Whitney Houston',
			song : "I'm Your Baby Tonight"
		},
		{
			pack : 2,
			group : 'Whitney Houston',
			song : "I Will Always Love You"
		},
		{
			pack : 2,
			group : 'Whitney Houston',
			song : "I Have Nothing"
		},
		{
			pack : 2,
			group : 'Whitney Houston',
			song : "All The Man That I Need"
		},
		{
			pack : 2,
			group : 'Alanis Morissette',
			song : "Ironic"
		},
		{
			pack : 2,
			group : 'Alanis Morissette',
			song : "You Oughta Know"
		},
		{
			pack : 2,
			group : 'Alanis Morissette',
			song : "Hand In My Pocket"
		},
		{
			pack : 2,
			group : 'Alanis Morissette',
			song : "You Learn"
		},
		{
			pack : 2,
			group : 'Alanis Morissette',
			song : "Head Over Feet"
		},
		{
			pack : 2,
			group : 'Mariah Carey',
			song : "When You Believe"
		},
		{
			pack : 2,
			group : 'Mariah Carey',
			song : "Hero"
		},
		{
			pack : 2,
			group : 'Mariah Carey',
			song : "One Sweet Day"
		},
		{
			pack : 2,
			group : 'Mariah Carey',
			song : "Without You"
		},
		{
			pack : 2,
			group : 'Mariah Carey',
			song : "All I Want For Christmas Is You"
		},
		{
			pack : 2,
			group : 'Bjork',
			song : "Big Time Sensuality"
		},
		{
			pack : 2,
			group : 'Bjork',
			song : "Army of Me"
		},
		{
			pack : 2,
			group : 'Bjork',
			song : "Hyperballad"
		},
		{
			pack : 2,
			group : 'Annie Lennox',
			song : "Walking on Broken Glass"
		},
		{
			pack : 2,
			group : 'Annie Lennox',
			song : "Why"
		},
		{
			pack : 2,
			group : 'Annie Lennox',
			song : "Love Song for a Vampire"
		},
		{
			pack : 2,
			group : 'Annie Lennox',
			song : "No More I Love You's"
		},
		{
			pack : 2,
			group : 'Annie Lennox',
			song : "A Whiter Shade of Pale"
		},
		{
			pack : 2,
			group : 'Geri Halliwell',
			song : "Mi Chico Latino"
		},
		{
			pack : 2,
			group : 'Geri Halliwell',
			song : "Look At Me"
		},
		{
			pack : 2,
			group : 'Geri Halliwell',
			song : "Lift Me Up"
		},
		{
			pack : 2,
			group : 'Geri Halliwell',
			song : "Bag It Up"
		},
		{
			pack : 1,
			group : 'Toni Braxton',
			song : "Spanish Guitar"
		},
		{
			pack : 1,
			group : 'Shania Twain',
			song : "From This Moment On"
		},
		{
			pack : 1,
			group : 'Vanessa Paradis',
			song : "Be My Baby"
		},
		{
			pack : 2,
			group : 'Gala',
			song : "Freed from desire"
		},
		{
			pack : 2,
			group : 'Gala',
			song : "Let a boy cry"
		},
		{
			pack : 2,
			group : 'Gala',
			song : "Come into my life"
		},
		{
			pack : 1,
			group : 'Lene Marlin',
			song : "Sitting Down Here"
		},
		{
			pack : 2,
			group : 'Diana Ross',
			song : "When You Tell Me That You Love Me"
		},
		{
			pack : 1,
			group : 'Meredith Brooks',
			song : "What Would Happen"
		}
];

let en_1990_f_1 =	en_1990_f.filter(item => item.pack == 1);
let en_1990_f_2 =	en_1990_f.filter(item => item.pack == 2);

let en_1990_minus = [
	{
		group : 'AC/DC',
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

let en_2000_gr_1 = [
		{
			id : 7,
			group : 'Green Day',
			song : 'Boulevard Of Broken Dreams'
		},
		{
			id : 14,
			group : 'Green Day',
			song : 'American Idiot'
		},
		{
			id : 19,
			group : 'Green Day',
			song : 'Wake Me Up When September Ends'
		},
		{
			id : 20,
			group : 'Green Day',
			song : 'The Saints Are Coming (ft U2)'
		},
		{
			id : 21,
			group : 'Green Day',
			song : 'The Simpsons Theme'
		},
		{
			id : 22,
			group : 'Green Day',
			song : 'Know Your Enemy'
		},
		{
			id : 23,
			group : 'Green Day',
			song : '21 Guns'
		},
		{
			id : 29,
			group : 'Offspring',
			song : "Want You Bad"
		},
		{
			id : 30,
			group : 'Offspring',
			song : "Million Miles Away"
		},
		{
			id : 31,
			group : 'Offspring',
			song : "Defy You"
		},
		{
			id : 32,
			group : 'Offspring',
			song : "Hit That"
		},
		{
			id : 33,
			group : 'Offspring',
			song : "Next to you"
		},
		{
			id : 34,
			group : 'Offspring',
			song : "Can't Repeat"
		},
		{
			id : 35,
			group : 'Offspring',
			song : "Hammerhead"
		},
		{
			id : 36,
			group : 'Offspring',
			song : "You're Gonna Go Far, Kid"
		},
		{
			id : 37,
			group : 'Offspring',
			song : "Kristy, Are You Doing Okay?"
		},
		{
			group : 'Sum 41',
			song : "Fat Lip"
		},
		{
			group : 'Sum 41',
			song : "Pieces"
		},
		{
			group : 'Sum 41',
			song : "Still Waiting"
		},
		{
			group : 'Sum 41',
			song : "In Too Deep"
		},
		{
			group : 'Blink 182',
			song : "I Miss You"
		},
		{
			group : 'Blink 182',
			song : "Man Overboard"
		},
		{
			group : 'Blink 182',
			song : "Always"
		},
		{
			group : 'Blink 182',
			song : "Stay Together For The Kids"
		}
];

let en_2000_gr_2 = [
		{
			id : 2,
			group : 'Red Hot Chili Peppers',
			song : 'Otherside'
		},	
		{
			id : 4,
			group : 'Red Hot Chili Peppers',
			song : 'Californication'
		},
		{
			id : 6,
			group : "Nickelback",
			song : 'How You Remind Me'
		},
		{
			id : 9,
			group : "Linkin Park",
			song : 'In the end'
		},
		{
			id : 10,
			group : 'Red Hot Chili Peppers',
			song : "Can't Stop"
		},
		{
			id : 11,
			group : "Linkin Park",
			song : 'Numb'
		},
		{
			id : 15,
			group : 'Killers',
			song : 'Mr. Brightside'
		},
		{
			id : 24,
			group : 'Linkin Park',
			song : 'Breaking The Habit'
		},
		{
			id : 25,
			group : 'Linkin Park',
			song : 'Numb / Encore (ft Jay-Z)'
		},
		{
			id : 26,
			group : 'Linkin Park',
			song : "What I've Done"
		},
		{
			id : 27,
			group : 'Linkin Park',
			song : "Bleed It Out"
		},
		{
			id : 28,
			group : 'Linkin Park',
			song : "We Made It (ft Busta Rhymes)"
		},
		{
			id : 38,
			group : 'Red Hot Chili Peppers',
			song : 'By the way'
		},
		{
			id : 39,
			group : 'Red Hot Chili Peppers',
			song : 'The Zephyr Song'
		},
		{
			id : 40,
			group : 'Red Hot Chili Peppers',
			song : 'Fortune Faded'
		},
		{
			id : 41,
			group : 'Red Hot Chili Peppers',
			song : 'Dani California'
		},
		{
			id : 42,
			group : 'Red Hot Chili Peppers',
			song : 'Tell Me Baby'
		},
		{
			id : 43,
			group : 'Red Hot Chili Peppers',
			song : 'Snow (Hey Oh)'
		},
		{
			id : 44,
			group : 'Red Hot Chili Peppers',
			song : 'Desecration Smile'
		},
		{
			id : 45,
			group : 'Red Hot Chili Peppers',
			song : 'Hump de Bump'
		},
		{
			id : 46,
			group : 'U2',
			song : "Stuck In A Moment You Can't Get Out Of"
		},
		{
			id : 47,
			group : 'U2',
			song : "Elevation"
		},
		{
			id : 48,
			group : 'U2',
			song : "Walk On"
		},
		{
			id : 49,
			group : 'U2',
			song : "Electrical Storm"
		},
		{
			id : 50,
			group : 'U2',
			song : "Vertigo"
		},
		{
			id : 51,
			group : 'U2',
			song : "All Because Of You"
		},
		{
			id : 52,
			group : 'U2',
			song : "Sometimes You Can't Make It On Your Own"
		},
		{
			id : 53,
			group : 'U2',
			song : "City Of Blinding Lights"
		},
		{
			id : 54,
			group : 'U2',
			song : "Window In The Skies"
		},
		{
			id : 55,
			group : 'U2',
			song : "Get On Your Boots"
		},
		{
			group : 'Nickelback',
			song : "Rockstar"
		},
		{
			group : 'Killers',
			song : "Somebody Told Me"
		},
		{
			group : 'Killers',
			song : "When You Were Young"
		},
		{
			group : 'Killers',
			song : "Read My Mind"
		},
		{
			group : 'Killers',
			song : "Human"
		},
		{
			group : 'Killers',
			song : "Spaceman"
		},
		{
			group : 'Nickelback',
			song : "Someday"
		},
		{
			group : 'Nickelback',
			song : "Figured You Out"
		},
		{
			group : 'Nickelback',
			song : "Photograph"
		},
		{
			group : 'Nickelback',
			song : "Far Away"
		},
		{
			group : 'Nickelback',
			song : "Gotta Be Somebody"
		},
		{
			group : 'Nickelback',
			song : "If Today Was Your Last Day"
		},
		{
			group : 'Limp Bizkit',
			song : "Behind Blue Eyes"
		},
		{
			group : 'Limp Bizkit',
			song : "Almost Over"
		},
		{
			group : 'Limp Bizkit',
			song : "Take A Look Around"
		},
		{
			group : 'Limp Bizkit',
			song : "My Generation"
		},
		{
			group : 'Limp Bizkit',
			song : "Rollin' (Air Raid Vehicle)"
		},
		{
			group : 'Limp Bizkit',
			song : "My Way"
		}
];

let en_2000_gr_3 = [
	{
		id : 1,
		group : 'Papa Roach',
		song : 'Last Resort'
	},
	{
		id : 3,
		group : 'Bon Jovi',
		song : "It's My Life"
	},
	{
		id : 5,
		group : "Drowning Pool",
		song : 'Bodies'
	},
	{
		id : 8,
		group : "System of a Down",
		song : 'Chop Suey!'
	},
	{
		id : 12,
		group : "Evanescence",
		song : 'Bring Me To Life'
	},
	{
		id : 13,
		group : "White Stripes",
		song : 'Seven Nation Army'
	},
	{
		id : 16,
		group : 'Hoobastank',
		song : 'The Reason'
	},
	{
		id : 17,
		group : 'DragonForce',
		song : 'Fury Of The Storm'
	},
	{
		id : 18,
		group : 'Three Days Grace',
		song : 'I Hate Everything About You'
	},
	{
		group : 'Skillet',
		song : "Comatose"
	},
	{
		group : 'Skillet',
		song : "Hero"
	},
	{
		group : 'Skillet',
		song : "Monster"
	},
	{
		group : 'Skillet',
		song : "Awake and Alive"
	},
	{
		group : '3 Doors Down',
		song : "Train"
	},
	{
		group : '3 Doors Down',
		song : "Kryptonite"
	},
	{
		group : '3 Doors Down',
		song : "Here Without You"
	},
	{
		group : 'Deep Purple',
		song : "Clearly Quite Absurd"
	},
	{
		group : 'Garbage',
		song : "Why Do You Love Me"
	},
	{
		group : 'Garbage',
		song : "Androgyny"
	},
	{
		group : 'Garbage',
		song : "Run Baby Run"
	},
	{
		group : 'Garbage',
		song : "Cherry Lips"
	},
	{
		group : "Evanescence",
		song : 'My Immortal'
	},
	{
		group : "My Chemical Romance",
		song : 'Welcome to the Black Parade'
	},
	{
		group : "Kaiser Chiefs",
		song : 'Ruby'
	},
	{
		group : "Paramore",
		song : 'Emergency'
	},
	{
		group : "Kasabian",
		song : 'Fire'
	},
	{
		group : "Kasabian",
		song : 'Club Foot'
	},
	{
		group : "Kasabian",
		song : 'L.S.F.'
	},
	{
		group : "Kasabian",
		song : 'Underdog'
	},
	{
		group : "Foo Fighters",
		song : 'No Way Back'
	},
	{
		group : "Metallica",
		song : 'The Day That Never Comes'
	}
];

let en_2000_gr_4 = [
		{
			id : 3,
			group : "Destiny's Child",
			song : 'Say My Name'
		},
		{
			id : 4,
			group : 'OutKast',
			song : 'Ms. Jackson'
		},		
		{
			id : 5,
			group : "Coldplay",
			song : 'The Scientist'
		},
		{
			id : 7,
			group : 'Coldplay',
			song : 'Clocks'
		},
		{
			id : 8,
			group : 'OutKast',
			song : 'Hey Ya!'
		},
		{
			id : 9,
			group : 'Maroon 5',
			song : 'This Love'
		},
		{
			id : 10,
			group : 'Maroon 5',
			song : 'She Will Be Loved'
		},
		{
			id : 12,
			group : 'Pussycat Dolls',
			song : "Don't Cha"
		},
		{
			id : 14,
			group : "Pussycat Dolls",
			song : 'Buttons (ft Snoop Dogg)'
		},
		{
			id : 15,
			group : "OneRepublic",
			song : "Apologize (ft Timbaland)"
		},
		{
			id : 17,
			group : "Coldplay",
			song : "Viva La Vida"
		},
		{
			id : 23,
			group : "Black Eyed Peas",
			song : "Pump It"
		},
		{
			id : 24,
			group : "Gorillaz",
			song : 'Clint Eastwood'
		},
		{
			id : 25,
			group : "Black Eyed Peas",
			song : 'Where Is The Love?'
		},
		{
			id : 26,
			group : "Black Eyed Peas",
			song : "Let's Get It Started"
		},
		{
			id : 27,
			group : "Gorillaz",
			song : 'Dare'
		},
		{
			id : 28,
			group : "Black Eyed Peas",
			song : "My Humps"
		},
		{
			id : 29,
			group : "Gorillaz",
			song : 'Feel Good Inc'
		},
		{
			group : "Morandi",
			song : 'Falling asleep'
		},
		{
			group : "Morandi",
			song : 'Love Me'
		},
		{
			group : "Morandi",
			song : 'Angels (Love Is The Answer)'
		},
		{
			group : "Morandi",
			song : 'Save Me'
		},
		{
			group : "Morandi",
			song : 'Colors'
		},
		{
			group : "OneRepublic",
			song : "Stop And Stare"
		},
		{
			group : "OneRepublic",
			song : "All The Right Moves"
		},
		{
			group : "Muse",
			song : "Uprising"
		},
		{
			group : "Muse",
			song : "Starlight"
		},
		{
			group : "Muse",
			song : "Undisclosed Desires"
		},
		{
			group : "Cure",
			song : "Cut Here"
		},
		{
			group : "Cure",
			song : "The Only One"
		},
		{
			group : "Akcent",
			song : "Kylie"
		},
		{
			group : "Akcent",
			song : "Stay with Me"
		},
		{
			group : "Akcent",
			song : "Jokero"
		},
		{
			group : "Akcent",
			song : "My Passion"
		},
		{
			group : 'OutKast',
			song : 'The Way You Move (ft Sleep Brown)'
		},
		{
			group : "Black Eyed Peas",
			song : "Boom Boom Pow"
		},
		{
			group : "Black Eyed Peas",
			song : "I Gotta Feeling"
		},
		{
			group : "Black Eyed Peas",
			song : "Mas Que Nada (ft Sergio Mendes)"
		},
		{
			group : "Black Eyed Peas",
			song : "Don't Phunk With My Heart"
		},
		{
			group : "Black Eyed Peas",
			song : "Boom Boom Pow"
		},
		{
			group : "Destiny's Child",
			song : 'Independent Women, Pt. I'
		},
		{
			group : "Destiny's Child",
			song : 'Survivor'
		},
		{
			group : 'Pussycat Dolls',
			song : "Hush Hush"
		},
		{
			group : 'Pussycat Dolls',
			song : "When I Grow Up"
		},
		{
			group : 'Pussycat Dolls',
			song : "Sway"
		},
		{
			group : 'Maroon 5',
			song : 'Makes Me Wonder'
		},
		{
			group : 'Maroon 5',
			song : 'Wake Up Call'
		}
];

let en_2000_gr_5 = [
	{
		id : 1,
		group : 'Lady Antebellum',
		song : 'Need You Now'
	},
	{
		id : 2,
		group : 'Owl City',
		song : 'Fireflies'
	},
	{
		id : 6,
		group : "Las Ketchup",
		song : 'Aserejé'
	},
	{
		id : 11,
		group : "Cascada",
		song : 'Everytime We Touch'
	},
	{
		id : 13,
		group : "Panic! At The Disco",
		song : 'I Write Sins Not Tragedies'
	},
	{
		id : 16,
		group : "MGMT",
		song : 'Kids'
	},
	{
		id : 18,
		group : "M.O.P.",
		song : "Ante Up Remix (ft Busta Rhymes, Teflon, Remi Martin)"
	},
	{
		id : 19,
		group : "Hi Tack",
		song : "Say Say Say"
	},
	{
		id : 20,
		group : "Global Deejays",
		song : "The Sound Of San Francisco"
	},
	{
		id : 21,
		group : "Benassi Bros.",
		song : "Hit My Heart"
	},
	{
		id : 22,
		group : "Narcotic Thrust",
		song : "I Like It"
	},
	{
		group : "Reamonn",
		song : "Tonight"
	},
	{
		group : "Terror Squad",
		song : "Lean Back"
	},
	{
		group : "Travis",
		song : "Sing"
	},
	{
		group : 'Nina Sky',
		song : 'Move Ya Body'
	},
	{
		group : 'Blue',
		song : 'Guilty'
	},
	{
		group : 'Morcheeba',
		song : 'Otherwise'
	},
	{
		group : 'Morcheeba',
		song : 'World Looking In'
	},
	{
		group : 'Westlife',
		song : 'Mandy'
	},
	{
		group : 'ATC',
		song : 'Around the World'
	},
	{
		group : "NSYNK",
		song : 'Bye Bye Bye'
	},
	{
		group : 'Simply Red',
		song : 'Sunrise'
	},
	{
		group : 'Savage Garden',
		song : 'I Knew I Loved You'
	},
	{
		group : 'Snow Patrol',
		song : 'Chasing Cars'
	},
	{
		group : 'Baha Men',
		song : 'Who Let The Dogs Out'
	},
	{
		group : 'Madcon',
		song : "Beggin'"
	},
	{
		group : 'No Angels',
		song : "Still In Love With You"
	},
	{
		group : 'Brainstorm',
		song : "Maybe"
	},
	{
		group : 'Five',
		song : "Rock the Party"
	},
	{
		group : 'Florence + The Machine',
		song : "Rabbit Heart (Raise It Up)"
	},
	{
		group : 'Florence + The Machine',
		song : "Cosmic Love"
	},
	{
		group : 'Train',
		song : "Hey, Soul Sister"
	},
	{
		group : 'Wheatus',
		song : "Teenage Dirtbag"
	},
	{
		group : 'Beastie Boys',
		song : "An Open Letter To NYC"
	},
	{
		group : 'Daft Punk',
		song : "One More Time"
	},
	{
		group : 'Fort Minor',
		song : "Believe Me"
	},
	{
		group : 'Chemical Brothers',
		song : "Galvanize"
	},
	{
		group : 'Hurts',
		song : "Wonderful Life"
	},
	{
		group : 'Hurts',
		song : "Stay"
	},
	{
		group : 'Basic Element',
		song : "To You"
	},
	{
		group : 'Mondotek',
		song : "Alive"
	},
	{
		group : 'Aly & AJ',
		song : "Potential Breakup Song"
	},
	{
		group : 'Whizzkids',
		song : "Rumours (Digi Digi) (ft Inusa, Dawuda)"
	},
	{
		group : 'Lighthouse Family',
		song : "Run"
	}
];

let en_2000_m_1 = [
		{
			id : 1,
			group : 'Justin Bieber',
			song : 'Baby'
		},
		{
			id : 2,
			group : "Shaggy",
			song : 'Angel (ft Rayvon)'
		},
		{
			id : 3,
			group : 'Justin Timberlake',
			song : 'Cry Me A River'
		},
		{
			id : 4,
			group : "Sean Kingston",
			song : 'Beautiful Girls'
		},
		{
			id : 5,
			group : "Daniel Powter",
			song : 'Bad Day'
		},
		{
			id : 6,
			group : "James Blunt",
			song : "You're Beautiful"
		},
		{
			id : 7,
			group : "Gnarls Barkley",
			song : 'Crazy'
		},
		{
			id : 8,
			group : "Jason Mraz",
			song : "I'm Yours"
		},
		{
			id : 9,
			group : 'Justin Timberlake',
			song : 'Sexy back (ft Timbaland)'
		},
		{
			id : 10,
			group : 'Justin Timberlake',
			song : 'My Love (ft T.I.)'
		},
		{
			id : 11,
			group : 'Justin Timberlake',
			song : 'Like I Love You'
		},
		{
			id : 12,
			group : 'Robbie Williams',
			song : 'The Road To Mandalay'
		},
		{
			id : 13,
			group : 'Robbie Williams',
			song : "Somethin' Stupid (ft Nicole Kidman)"
		},
		{
			id : 14,
			group : 'Darren Hayes',
			song : 'I Miss You'
		},
		{
			id : 15,
			group : 'Darren Hayes',
			song : 'Strange Relationship'
		},
		{
			id : 16,
			group : 'George Michael',
			song : 'The Long And Winding Road'
		},
		{
			id : 17,
			group : 'Leonard Kohen',
			song : 'A Thousand Kisses Deep'
		},
		{
			id : 18,
			group : 'Arash',
			song : 'Boro Boro'
		},
		{
			id : 19,
			group : 'Seal',
			song : "It's A Man's Man's World"
		},
		{
			id : 20,
			group : 'Enrique Iglesias',
			song : 'Be With You'
		},
		{
			id : 21,
			group : 'Enrique Iglesias',
			song : 'Do You Know?'
		},
		{
			id : 22,
			group : 'Enrique Iglesias',
			song : 'Hero'
		},
		{
			id : 26,
			group : 'Ronan Keating',
			song : 'If Tomorrow Never Comes'
		},
		{
			id : 27,
			group : 'Arash',
			song : 'Tike Tike Kardi'
		},
		{
			id : 29,
			group : 'Fred Puppet',
			song : 'Mahna Mahna (ft Monster Crew)'
		},
		{
			id : 30,
			group : 'Lemar',
			song : "If There's Any Justice"
		},
		{
			id : 31,
			group : 'Mario',
			song : "Let Me Love You"
		},
		{
			id : 32,
			group : 'Travie McCoy',
			song : "Billionaire"
		},
		{
			id : 33,
			group : 'Ne-Yo',
			song : "So Sick"
		},
		{
			id : 34,
			group : 'Ne-Yo',
			song : "Closer"
		},
		{
			group : 'Adam Lambert',
			song : "For your entertainment"
		},
		{
			group : 'Adam Lambert',
			song : "Whataya Want from Me"
		},
		{
			id : 9,
			group : "Johnny Cash",
			song : "I Won't Back Down"
		},
		{
			group : "Juanes",
			song : "La Camisa Negra"
		},
		{
			group : "Santana",
			song : "Smooth (ft Rob Thomas)"
		},
		{
			group : "Santana",
			song : "Maria Maria (ft The Product G&B)"
		},
		{
			group : "Santana",
			song : "The Game of Love (ft Michelle Branch)"
		},
		{
			group : "Shaggy",
			song : "It Wasnt Me (ft Rik Rok)"
		},
		{
			group : "Chris Brown",
			song : "Run It! (ft Juelz Santana)"
		},
		{
			group : "Chris Brown",
			song : "Kiss Kiss (ft T-Pain)"
		},
		{
			group : "B.o.B.",
			song : "Nothin' on You (ft Bruno Mars)"
		},
		{
			group : "Bruno Mars",
			song : "Just the Way You Are"
		},
		{
			group : "Mika",
			song : "Grace Kelly"
		},
		{
			group : "Mika",
			song : "Relax, Take It Easy"
		},
		{
			group : "Mika",
			song : "Love Today"
		},
		{
			group : "Craig David",
			song : "Rise and fall (ft Sting)"
		},
		{
			group : "Craig David",
			song : "Insomnia"
		},
		{
			group : "Eros Ramazzotti",
			song : "Fuoco nel fuoco"
		},
		{
			group : "Eros Ramazzotti",
			song : "Parla con me"
		},
		{
			group : "Tomas Nevergreen",
			song : "Since You Been Gone"
		},
		{
			group : "Tomas Nevergreen",
			song : "Every Time"
		},
		{
			group : "Rob Thomas",
			song : "Lonely No More"
		},
		{
			group : "Joe",
			song : "Stutter (ft Mystikal)"
		},
		{
			group : "Nek",
			song : "Instabile"
		},
		{
			group : "Giorgos Mazonakis",
			song : "To Gucci Forema"
		},
		{
			group : "Darren Hayes",
			song : "Crush (1980 Me)"
		}
];

let en_2000_m_2 = [
		{
			id : 1,
			group : "Tom Novy",
			song : "Take it (ft Lima)"
		},
		{
			id : 2,
			group : "Bob Sinclar",
			song : "Love Generation"
		},
		{
			id : 3,
			group : "Bob Sinclar",
			song : "Kiss My Eyes"
		},
		{
			id : 4,
			group : "Moby",
			song : "Slipping Away"
		},
		{
			id : 5,
			group : "Timo Maas",
			song : "First Day (ft Brian Molko)"
		},
		{
			id : 6,
			group : "Crazy Frog",
			song : "Axel F"
		},
		{
			id : 7,
			group : "Danzel",
			song : "Pump It Up"
		},
		{
			id : 8,
			group : "Danzel",
			song : "Put Your Hands up in the Air!"
		},
		{
			id : 10,
			group : "Zac Efron",
			song : "Breaking Free (ft Vanessa Hudgens)"
		},
		{
			id : 11,
			group : "Eric Prydz",
			song : "Call on Me"
		},
		{
			id : 12,
			group : "Gigi D'Agostino",
			song : "L'Amour Toujours"
		},
		{
			id : 13,
			group : "Paul Van Dyk",
			song : "Let Go (ft Rea Garvey)"
		},
		{
			id : 14,
			group : "Moby",
			song : "Lift Me Up"
		},
		{
			group : 'David Guetta',
			song : 'The World Is Mine'
		},
		{
			group : 'David Guetta',
			song : 'Memories'
		},
		{
			group : 'David Guetta',
			song : 'Love is gone'
		},
		{
			group : 'Alex Gaudino',
			song : 'Destination Calabria (ft Crystal Waters)'
		},
		{
			group : 'Dj Bobo',
			song : 'Chihuahua'
		},
		{
			group : 'Yves Larock',
			song : 'Rise Up'
		},
		{
			group : 'K-Maro',
			song : "Let's go"
		},
		{
			group : 'Stromae',
			song : 'Alors On Danse'
		},
		{
			group : 'Beni Benassi',
			song : 'Satisfaction'
		}
];

let en_2000_m_3 = [	
		{
			id : 1,
			group : 'Flo Rida',
			song : 'Right Round'
		},
		{
			id : 2,
			group : 'Kid Cudi',
			song : "Day 'N' Nite"
		},
		{
			id : 3,
			group : 'Jamie Foxx',
			song : 'Blame It'
		},
		{
			id : 4,
			group : 'Iyaz',
			song : 'Replay'
		},
		{
			id : 5,
			group : 'Jay Sean',
			song : 'Down'
		},
		{
			id : 6,
			group : 'Taio Cruz',
			song : 'Break Your Heart'
		},	
		{
			id : 7,
			group : 'Snoop Dogg',
			song : 'The Next Episode (ft Dr. Dre)'
		},	
		{
			id : 8,
			group : 'Eminem',
			song : 'Stan (ft Dido)'
		},
		{
			id : 9,
			group : 'Eminem',
			song : 'The Real Slim Shady'
		},
		{
			id : 10,
			group : 'Nelly',
			song : 'Ride With Me'
		},
		{
			id : 11,
			group : 'Nelly',
			song : 'Hot In Herre'
		},
		{
			id : 12,
			group : 'Eminem',
			song : 'Cleaning Out My Closet'
		},
		{
			id : 13,
			group : 'Nelly',
			song : 'Dilemma (ft Kelly Rowland)'
		},
		{
			id : 14,
			group : 'Eminem',
			song : 'Without Me',
			state: ' по Эминему'
		},
		{
			id : 15,
			group : 'Eminem',
			song : 'Lose Yourself'
		},
		{
			id : 16,
			group : '50 Cent',
			song : 'In Da Club'
		},
		{
			id : 17,
			group : 'Pharrell Williams',
			song : "Drop It Like It's Hot (ft Snoop Dogg)"
		},
		{
			id : 18,
			group : "50 Cent",
			song : "Candy Shop (ft Olivia)"
		},
		{
			id : 19,
			group : "Timbaland",
			song : 'Promiscuous (ft Nelly Furtado)'
		},
		{
			id : 20,
			group : "Eminem",
			song : 'Smack That (ft Akon)'
		},
		{
			id : 21,
			group : "Kanye West",
			song : "Stronger"
		},
		{
			id : 22,
			group : "Soulja Boy Tell'em",
			song : 'Crank That'
		},
		{
			id : 23,
			group : 'Usher',
			song : 'Yeah!'
		},
		{
			id : 24,
			group : "Sean Paul",
			song : 'Temperature'
		},
		{
			id : 25,
			group : "Young Buck",
			song : "Get Buck"
		},
		{
			id : 26,
			group : "P. Diddy",
			song : "Shake Ya Tailfeather (ft Nelly, Murphy Lee)"
		},
		{
			group : "Eminem",
			song : "When I'm Gone"
		},
		{
			group : "50 Cent",
			song : "21 Questions (ft Nate Dogg)"
		},
		{
			group : "Busta Rhymes",
			song : "I Know What You Want (ft Mariah Carey)"
		},
		{
			group : "Nelly",
			song : "Grillz (ft Paul Wall, Ali & Gipp)"
		},
		{
			group : "Akon",
			song : "Don't Matter"
		},
		{
			group : "Akon",
			song : "Right Now (Na Na Na)"
		},
		{
			group : "Akon",
			song : "Lonely"
		},
		{
			group : "Jay-Z",
			song : "Empire State Of Mind (ft Alicia Keys)"
		},
		{
			group : "Jay-Z",
			song : "99 Problems"
		},
		{
			group : "Usher",
			song : "U Remind Me"
		},
		{
			group : "Usher",
			song : "U Got It Bad"
		},
		{
			group : "Usher",
			song : "My Boo (ft Alicia Keys)"
		},
		{
			group : "Usher",
			song : "Love in This Club (ft Young Jeezy)"
		},
		{
			group : "Usher",
			song : "Burn"
		},
		{
			group : "Usher",
			song : "Confessions"
		},
		{
			group : "Flo Rida",
			song : "Low"
		},
		{
			group : "Sean Paul",
			song : "Get Busy"
		},
		{
			group : "Sean Paul",
			song : "We Be Burnin'"
		},
		{
			group : "Timbaland",
			song : "The Way I Are (ft Keri Hilson, D.O.E.)"
		},
		{
			group : "Timbaland",
			song : "Give It To Me (ft Justin Timberlake, Nelly Furtado)"
		},
		{
			group : "Pitbull",
			song : "I Know You Want Me"
		},
		{
			group : "Kanye West",
			song : "Gold Digger (ft Jamie Foxx)"
		},
		{
			group : "T.I.",
			song : "Whatever You Like"
		},
		{
			group : "T.I.",
			song : "Live Your Life (ft Rihanna)"
		},
		{
			group : "DMX",
			song : "Party Up"
		},
		{
			group : "Lil Jon",
			song : "Get Low (ft The East Side Boyz)"
		},
		{
			group : "Lil Wayne",
			song : "Lollipop (ft Static Major)"
		}
];

let en_2000_f_1 = [
		{
			id : 1,
			group : 'Katy Perry',
			song : 'I Kissed A Girl'
		},
		{
			id : 2,
			group : 'Lady Gaga',
			song : 'Poker Face'
		},
		{
			id : 4,
			group : 'Britney Spears',
			song : 'Womanizer'
		},
		{
			id : 5,
			group : 'P!nk',
			song : 'So What'
		},
		{
			id : 6,
			group : 'Britney Spears',
			song : 'Ooops!... I did it again'
		},
		{
			id : 7,
			group : "Christina Aguilera",
			song : "Lady Marmalade (ft P!nk, Mya, Lil' Kim)"
		},
		{
			id : 8,
			group : "Shakira",
			song : 'Whenever, Wherever'
		},
		{
			id : 9,
			group : "Christina Aguilera",
			song : 'Beautiful'
		},
		{
			id : 10,
			group : "Avril Lavigne",
			song : 'Complicated'
		},
		{
			id : 11,
			group : 'Britney Spears',
			song : 'Toxic'
		},
		{
			id : 12,
			group : "Shakira",
			song : "Hips Don't Lie"
		},
		{
			id : 13,
			group : "Avril Lavigne",
			song : 'Girlfriend'
		},
		{
			id : 14,
			group : "Taylor Swift",
			song : 'Love Story'
		},
		{
			id : 15,
			group : "Lady Gaga",
			song : "Just Dance (ft Colby ODonis)"
		},
		{
			id : 16,
			group : 'Katy Perry',
			song : "California Gurls (ft. Snoop Dogg)"
		},
		{
			id : 17,
			group : 'Katy Perry',
			song : "Teenage Dream"
		},
		{
			id : 18,
			group : 'Katy Perry',
			song : "Firework"
		},
		{
			id : 19,
			group : 'Katy Perry',
			song : "Hot N Cold"
		},
		{
			id : 20,
			group : 'Katy Perry',
			song : "Waking Up In Vegas"
		},
		{
			id : 21,
			group : "Taylor Swift",
			song : 'You Belong With Me'
		},
		{
			id : 22,
			group : "Gwen Stefani",
			song : "Hollaback Girl"
		},
		{
			id : 23,
			group : "Gwen Stefani",
			song : "The sweet escape (ft Akon)"
		},
		{
			id : 24,
			group : 'Lady Gaga',
			song : "Telephone (ft. Beyonce)"
		},
		{
			id : 25,
			group : "Christina Aguilera",
			song : 'Come on over Baby (All I Want Is You)'
		},
		{
			group : "Christina Aguilera",
			song : 'Hurt'
		},
		{
			group : "Inna",
			song : 'Hot'
		},
		{
			group : "Inna",
			song : 'Amazing'
		},
		{
			group : "Inna",
			song : 'Sun Is Up'
		},
		{
			group : 'P!nk',
			song : 'Get the Party Started'
		},
		{
			group : 'P!nk',
			song : 'Trouble'
		},
		{
			group : 'Lady Gaga',
			song : "Bad Romance"
		},
		{
			group : 'Britney Spears',
			song : 'Gimme More'
		},
		{
			group : "Shakira",
			song : 'Underneath Your Clothes'
		},
		{
			group : "Shakira",
			song : 'Objection (Tango)'
		},
		{
			group : "Shakira",
			song : 'La Tortura (ft Alejandro Sanz)'
		},
		{
			group : "Shakira",
			song : 'Waka Waka (This Time for Africa) (ft Freshlyground)'
		},
		{
			group : "Avril Lavigne",
			song : 'Losing Grip'
		},
		{
			group : "Avril Lavigne",
			song : 'My Happy Ending'
		},
		{
			group : "Avril Lavigne",
			song : "Nobody's Home"
		},
		{
			group : "Avril Lavigne",
			song : "He Wasn't"
		},
		{
			group : "Avril Lavigne",
			song : "When You're Gone"
		},
		{
			group : "Avril Lavigne",
			song : 'Hot'
		},
		{
			group : "Avril Lavigne",
			song : 'The Best Damn Thing'
		},
		{
			group : "Avril Lavigne",
			song : 'Alice'
		},
		{
			group : "Jennifer Lopez",
			song : "Ain't It Funny"
		},
		{
			group : "Jennifer Lopez",
			song : "I'm Real (ft Ja Rule)"
		},
		{
			group : "Jennifer Lopez",
			song : "All I Have (ft LL Cool J)"
		},
		{
			group : "Jennifer Lopez",
			song : "Love Don't Cost a Thing"
		},
		{
			group : "Jennifer Lopez",
			song : "Jenny from the Block"
		}
];

let en_2000_f_2 = [
		{
			id : 1,
			group : "Mary J. Blige",
			song : 'Family Affair'
		},
		{
			id : 2,
			group : "Vanessa Carlton",
			song : 'A Thousand Miles'
		},
		{
			id : 3,
			group : "Leona Lewis",
			song : "Bleeding Love"
		},
		{
			id : 4,
			group : "Amy Winehouse",
			song : "Back to Black"
		},
		{
			id : 5,
			group : "Despina Vandi",
			song : "Come Along Now"
		},
		{
			id : 6,
			group : "Kelis",
			song : "Milkshake"
		},
		{
			id : 7,
			group : "Kelis",
			song : "Trick Me"
		},
		{
			id : 8,
			group : "M.I.A.",
			song : "Paper Planes"
		},
		{
			id : 9,
			group : "Ida Corr",
			song : "Let Me Think About It (ft Fedde Le Grand)"
		},
		{
			id : 10,
			group : 'Duffy',
			song : "Mercy"
		},
		{
			group : 'Celine Dion',
			song : "A New Day Has Come"
		},
		{
			group : 'Madonna',
			song : "Music"
		},
		{
			group : 'Madonna',
			song : "Hung Up"
		},
		{
			group : 'Madonna',
			song : "4 minutes"
		},
		{
			group : 'Kelly Clarkson',
			song : "Because of You"
		},
		{
			group : 'Kelly Clarkson',
			song : "A Moment Like This"
		},
		{
			group : 'Kelly Clarkson',
			song : "My Life Would Suck Without You"
		},
		{
			group : 'Geri Halliwell',
			song : "Calling"
		},
		{
			group : 'Ke$ha',
			song : 'Tick Tock'
		},
		{
			group : 'Dido',
			song : 'Thank You'
		},
		{
			group : 'Dido',
			song : 'White Flag'
		},
		{
			group : 'Kylie Minogue',
			song : 'Spinning Around'
		},
		{
			group : 'Kylie Minogue',
			song : "Can't Get You Out of My Head"
		},
		{
			group : 'Mariah Carey',
			song : 'We Belong Together'
		},
		{
			group : 'Mariah Carey',
			song : 'Touch My Body'
		},
		{
			group : 'Janet Jackson',
			song : 'All For You'
		},
		{
			group : 'Ashanti',
			song : 'Foolish'
		},
		{
			group : 'LeAnn Rimes',
			song : "Can't Fight The Moonlight"
		},
		{
			group : 'Amy McDonald',
			song : 'This Is The Life'
		},
		{
			group : 'Aaliyah',
			song : 'Try Again'
		},
		{
			group : 'Kat Deluna',
			song : 'Whine up (ft Elephant Man)'
		},
		{
			group : 'Myriam Faris',
			song : 'Chamarni (Enta bel hayat)'
		},
		{
			group : 'Mya',
			song : 'Case Of The Ex'
		},
		{
			group : 'September',
			song : 'Cry For You'
		},
		{
			group : 'Enya',
			song : 'And Winter Came'
		},
		{
			group : 'Oceana',
			song : 'Cry cry'
		}
];

let en_2000_f_3 = [
		{
			id : 1,
			group : "Beyonce",
			song : 'Crazy In Love (ft Jay-Z)'
		},
		{
			id : 2,
			group : 'Alicia Keys',
			song : "If I Ain't Got You"
		},
		{
			id : 3,
			group : "Beyonce",
			song : "Beautiful Lier (ft Shakira)"
		},
		{
			id : 4,
			group : "Rihanna",
			song : 'Umbrella (ft Jay-Z)'
		},
		{
			id : 5,
			group : "Beyonce",
			song : "Single Ladies"
		},
		{
			id : 6,
			group : "Fergie",
			song : 'Fergalicious (ft will.i.am)'
		},
		{
			id : 7,
			group : "Nelly Furtado",
			song : 'Say It Right'
		},
		{
			id : 8,
			group : "Beyonce",
			song : "Baby Boy (ft Sean Paul)"
		},
		{
			id : 9,
			group : "Beyonce",
			song : "Halo"
		},
		{
			id : 10,
			group : "Beyonce",
			song : "If I Were a Boy"
		},
		{
			id : 11,
			group : "Beyonce",
			song : "Check On It (ft Slim Thug, Bun B)"
		},
		{
			id : 12,
			group : "Beyonce",
			song : "Irreplaceable"
		},
		{
			id : 13,
			group : "Rihanna",
			song : 'SOS'
		},
		{
			id : 14,
			group : "Rihanna",
			song : 'Live Your Life (ft T.I.)'
		},
		{
			id : 15,
			group : "Rihanna",
			song : 'Only Girl (In The World))'
		},
		{
			id : 16,
			group : "Rihanna",
			song : "Don't Stop The Music"
		},
		{
			id : 17,
			group : "Rihanna",
			song : 'Rude Boy'
		},
		{
			id : 18,
			group : "Rihanna",
			song : 'Disturbia'
		},
		{
			id : 19,
			group : "Rihanna",
			song : 'Unfaithful'
		},
		{
			id : 20,
			group : 'Alicia Keys',
			song : "Falling"
		},
		{
			id : 21,
			group : 'Alicia Keys',
			song : "No One"
		},
		{
			id : 22,
			group : "Fergie",
			song : 'Big Girls Don`t Cry'
		},
		{
			id : 23,
			group : "Fergie",
			song : 'London Bridge'
		},
		{
			id : 24,
			group : "Fergie",
			song : 'Glamorous'
		},
		{
			id : 25,
			group : "Fergie",
			song : 'Clumsy'
		},
		{
			id : 26,
			group : "Nelly Furtado",
			song : "I'm Like A Bird"
		},
		{
			id : 27,
			group : "Nelly Furtado",
			song : 'Promiscuous (ft Timbaland)'
		},
		{
			id : 28,
			group : "Miley Cyrus",
			song : 'See You Again'
		},
		{
			id : 29,
			group : "Miley Cyrus",
			song : '7 Things'
		},
		{
			id : 30,
			group : "Miley Cyrus",
			song : 'The Climb'
		},
		{
			id : 31,
			group : "Miley Cyrus",
			song : 'Hoedown Throwdown'
		},
		{
			id : 32,
			group : "Miley Cyrus",
			song : 'Party In The U.S.A.'
		},
		{
			id : 33,
			group : "Miley Cyrus",
			song : "Can't Be Tamed"
		},
		{
			id : 34,
			group : "Ciara",
			song : 'Goodies'
		},
		{
			id : 35,
			group : "Ciara",
			song : 'One, Two Step'
		},
		{
			id : 36,
			group : "Missy Elliott",
			song : 'Work It'
		},
		{
			id : 37,
			group : "Missy Elliott",
			song : 'Get Ur Freak On'
		},
		{
			id : 38,
			group : "Missy Elliott",
			song : 'Lose Control (ft Ciara ft Fat Man Scoop)'
		},
		{
			id : 39,
			group : "Missy Elliott",
			song : 'Bomb Intro Pass That Dutch'
		},
		{
			id : 40,
			group : "Missy Elliott",
			song : 'Gossip Folks'
		}
];

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
		song : "Blurred Lines (ft T.I., Robin Thicke)"
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

let ru_1980_gr_1 = [
	{
		id : 1,
		group : 'Ласковый май',
		song : "Пусть будет ночь"
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
		id : 39,
		group : 'Браво',
		song : "Ленинградский рок-н-ролл"
	},
	{
		id : 64,
		group : 'Игра',
		song : "Неспелая вишня"
	},
	{
		id : 69,
		group : 'Трио Меридиан',
		song : "Прекрасное далёко"
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

let ru_1980_gr_2 = [
	{
		id : 2,
		group : 'ВИА Весёлые ребята',
		song : "Бродячие артисты"
	},
	{
		id : 3,
		group : 'ВИА Земляне',
		song : "Трава у дома"
	},
	{
		id : 4,
		group : 'ВИА Земляне',
		song : "Поверь в мечту"
	},
	{
		id : 40,
		group : 'ВИА Здравствуй, песня',
		song : "Синий иней"
	},
	{
		id : 65,
		group : 'ВИА Верасы',
		song : "Белый снег (Завируха)"
	},
	{
		id : 66,
		group : 'ВИА Верасы',
		song : "Малиновка"
	},
	{
		id : 67,
		group : 'ВИА Сябры',
		song : "Вы шумите, берёзы"
	},
	{
		group : 'ВИА Синяя птица',
		song : "Я иду тебе навстречу"
	},
	{
		id : 87,
		group : 'ВИА Пламя',
		song : "Не повторяется такое никогда"
	},
	{
		group : 'ВИА Пламя',
		song : "Не надо печалиться"
	},
	{
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
		group : 'ВИА Цветы',
		song : "Мы желаем счастья вам"
	},
	{
		id : 93,
		group : 'ВИА Цветы',
		song : "Богатырская сила"
	},
	{
		group : 'ВИА Добры Молодцы',
		song : "Песенка о снежинке"
	},
	{
		group : 'ВИА Коробейники',
		song : "Первый снег"
	},
	{
		group : 'ВИА Красные маки',
		song : "Если не расстанемся"
	},
	{
		group : 'ВИА Лейся, песня',
		song : "Я так и знал"
	},
	{
		group : 'ВИА Весёлые ребята',
		song : "Не волнуйтесь, тётя"
	},
	{
		group : 'ВИА Весёлые ребята',
		song : "Напиши мне письмо"
	},
	{
		group : 'ВИА Весёлые ребята',
		song : "Люди встречаются"
	},
	{
		group : 'ВИА Земляне',
		song : "Каскадёры"
	},
	{
		group : 'ВИА Здравствуй, песня',
		song : "Не обещай"
	},
	{
		group : 'ВИА Здравствуй, песня',
		song : "Птица счастья"
	},
	{
		group : 'ВИА Верасы',
		song : "Я у бабушки живу"
	},
	{
		group : 'ВИА Синяя птица',
		song : "Так вот какая ты"
	},
	{
		group : 'ВИА Синяя птица',
		song : "Белый теплоход"
	},
	{
		group : 'ВИА Цветы',
		song : "Звездочка моя ясная"
	},
	{
		group : 'ВИА Пламя',
		song : "Аты-баты"
	},
	{
		group : 'ВИА Пламя',
		song : "Снег кружится"
	},
	{
		group : 'ВИА Пламя',
		song : "На два дня"
	},
	{
		group : 'ВИА Ариэль',
		song : "В краю магнолий"
	},
	{
		group : 'ВИА Ариэль',
		song : "Порушка-Параня"
	},
	{
		group : 'ВИА Ялла',
		song : "Три колодца"
	},
	{
		group : 'ВИА Ялла',
		song : "Канатоходцы"
	},
	{
		group : 'ВИА Лейся, песня',
		song : "Обручальное кольцо"
	}
];

let ru_1980_gr_3 = [
	
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
		group : 'Чёрный кофе',
		song : "Чёрный кофе"
	},
	{
		id : 80,
		group : 'Чёрный кофе',
		song : "Вольному воля"
	},
	{
		id : 81,
		group : 'Чёрный кофе',
		song : "Светлый металл"
	},
	{
		id : 41,
		group : 'Nautilus Pompilius',
		song : "Гудбай, Америка"
	},
	{
		id : 42,
		group : 'Nautilus Pompilius',
		song : "Я Хочу Быть С Тобой"
	},
	{
		id : 70,
		group : 'Агата Кристи',
		song : "Пантера"
	},
];

let ru_1980_gr_4 = [
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
	}
];

let ru_1980_m = [
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
		id : 38,
		group : 'Юрий Антонов',
		song : "Анастасия"
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
		id : 71,
		group : 'Игорь Николаев',
		song : "Старая Мельница"
	},
	{
		group : 'Юрий Лоза',
		song : "Я умею мечтать"
	},
	{
		group : 'Юрий Лоза',
		song : "Сто часов"
	},
	{
		group : 'Юрий Лоза',
		song : "Баба Люба"
	},
	{
		group : 'Крис Кельми',
		song : "Ночное рандеву"
	},
	{
		group : 'Владимир Маркин',
		song : "Белая Черемуха"
	},
	{
		group : 'Юрий Антонов',
		song : "О тебе и обо мне"
	},
	{
		group : 'Юрий Антонов',
		song : "Крыша дома твоего"
	},
	{
		group : 'Игорь Скляр',
		song : "Старый рояль (ft Ольга Пирагс)"
	},
	{
		group : 'Тынис Мяги',
		song : "Спасите разбитое сердце моё (Детектив)"
	},
	{
		group : 'Тынис Мяги',
		song : "Олимпиада-80"
	},
	{
		group : 'Андрей Державин',
		song : "Катя-Катерина"
	},
	{
		group : 'Игорь Суруханов',
		song : "Дорогие мои старики"
	},
	{
		group : 'Игорь Суруханов',
		song : "Зелёные глаза"
	},
	{
		group : 'Виктор Попов',
		song : "Ты не забывай (ft Твой день)"
	},
	{
		group : 'Дмитрий Маликов',
		song : "До завтра"
	},
	{
		group : 'Дмитрий Маликов',
		song : "Студент"
	},
	{
		group : 'Дмитрий Маликов',
		song : "Брачный кортеж"
	},
	{
		group : 'Дмитрий Маликов',
		song : "Ты моей никогда не будешь"
	},
	{
		group : 'Дмитрий Маликов',
		song : "Все Вернется"
	},
	{
		group : 'Дмитрий Маликов',
		song : "Сторона родная"
	},
	{
		group : 'Лев Лещенко',
		song : "До свидания, Москва (ft Татьяна Анциферова)"
	},
	{
		group : 'Лев Лещенко',
		song : "Где мой дом родной"
	},
	{
		group : 'Михаил Муромов',
		song : "Яблоки на снегу"
	},
	{
		group : 'Александр Серов',
		song : "Мадонна"
	},
	{
		group : 'Александр Серов',
		song : "Ты меня любишь"
	},
	{
		group : 'Александр Серов',
		song : "Круиз (ft Ольга Зарубина)"
	},
	{
		group : 'Александр Серов',
		song : "Как быть"
	},
	{
		group : 'Александр Серов',
		song : "Междугородный разговор (ft Татьяна Анциферова)"
	},
	{
		group : 'Сергей Беликов',
		song : "Снится мне деревня"
	},
	{
		group : 'Сергей Беликов',
		song : "Радуга"
	},
	{
		group : 'Сергей Беликов',
		song : "Живи родник"
	},
	{
		group : 'Вилли Токарев',
		song : "В шумном балагане"
	},
	{
		group : 'Вилли Токарев',
		song : "Над Гудзоном"
	},
	{
		group : 'Вилли Токарев',
		song : "Небоскребы"
	},
	{
		group : 'Вахтанг Кикабидзе',
		song : "Проводы любви"
	},
	{
		group : 'Вахтанг Кикабидзе',
		song : "Мои года – моё богатство"
	},
	{
		group : 'Владимир Пресняков',
		song : "Белый снег"
	},
	{
		group : 'Владимир Пресняков',
		song : "Зурбаган"
	},
	{
		group : 'Алексей Глызин',
		song : "Зимний сад"
	},
	{
		group : 'Николай Гнатюк',
		song : "Птица счастья"
	},
	{
		group : 'Николай Гнатюк',
		song : "Танец на барабане"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Полет на дельтаплане"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Маргарита"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Разноцветные ярмарки"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Зеленый свет"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Наедине со всеми"
	},
	{
		group : 'Александр Розенбаум',
		song : "Утинная охота"
	},
	{
		group : 'Владимир Высоцкий',
		song : "Все не так, ребята"
	},
	{
		group : 'Алексей Вишня',
		song : "Танцы на битом стекле"
	}
];

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

let ru_1990_gr = [
		{
			pack : 1,
			group : 'Руки Вверх',
			song : 'Малыш',
			state: ' по Рукам Вверх'
		},
		{
			pack : 1,
			group : 'Технология',
			song : 'Нажми на кнопку',
			state: ' по Технологии'
		},
		{
			pack : 1,
			group : 'Русский размер',
			song : 'Юаю',
			state: ' по Русскому Размеру'
		},
		{
			pack : 1,
			group : 'Дискотека Авария',
			song : 'Некуда деваться',
			state: ' по Дискотеке Аварии'
		},
		{
			pack : 1,
			group : 'Забытый Разговор',
			song : 'Арабское золото',
			state: ' по Забытому Разговору'
		},
		{
			pack : 1,
			group : 'Браво',
			song : 'Любите девушки',
			state: ' по Браво'
		},
		{
			pack : 1,
			group : 'Иванушки International',
			song : 'Кукла',
			state: ' по Иванушкам',
			shorten: 'Иванушки'
		},
		{
			pack : 1,
			group : 'Стелла',
			song : 'Позови',
			state: ' по Стелле'
		},
		{
			pack : 1,
			group : "А-Студио",
			song : 'Нелюбимая',
			state: " по А-Студио"
		},
		{
			pack : 1,
			group : "На-на",
			song : 'Шляпа',
			state: " по На-на"
		},		
		{
			pack : 1,
			group : 'Океан Эльзы',
			song : 'Коли тебе нема'
		},
		{
			pack : 1,
			group : "Фристайл",
			song : 'Кораблик любви',
			state: " по Фристайл"
		},
		{
			pack : 1,
			group : 'Дискотека Авария',
			song : 'Труба зовёт',
			state: ' по Дискотеке Аварии'
		},
		{
			pack : 1,
			group : 'Отпетые мошенники',
			song : 'Я учусь танцевать'
		},
		{
			pack : 1,
			group : "Шоколад",
			song : 'Улыбнись',
			state: " по Шоколаду"
		},
		{
			pack : 1,
			group : "Арамис",
			song : 'Девочка ждет, мальчик не идет',
			state: " по Арамису"
		},
		{
			pack : 1,
			group : "Божья Коровка",
			song : 'Гранитный камушек',
			state: " по Божьей Коровке"
		},
		{
			pack : 1,
			group : 'Hi-Fi',
			song : 'Не дано',
			state: ' по Hi-Fi'
		},
		{
			pack : 1,
			group : 'Руки Вверх',
			song : 'Назови его как меня'
		},
		{
			pack : 1,
			group : 'Руки Вверх',
			song : 'Последний поцелуй',
			state: ' по Рукам Вверх'
		},
		{
			pack : 1,
			group : 'Кар-Мэн',
			song : 'Париж',
			state: ' по Кар-Мэн'
		},
		{
			pack : 1,
			group : 'Отпетые мошенники',
			song : 'Девушки бывают разные'
		},
		{
			pack : 1,
			group : 'Твой день',
			song : 'Ху-ан-хэ – жёлтая река'
		},
		{
			pack : 1,
			group : 'Иванушки International',
			song : 'Колечко',
			state: ' по Иванушкам',
			shorten: 'Иванушки'
		},
		{
			pack : 1,
			group : 'Отпетые мошенники',
			song : 'Люби меня, люби'
		},
		{
			pack : 1,
			group : 'Турбомода',
			song : 'Турболюбовь'
		},
		{
			pack : 1,
			group : 'Электронный мальчик',
			song : 'Видеосалон',
			state: ' по Электронному мальчику'
		},
		{
			pack : 1,
			group : 'Hi-Fi',
			song : 'Беспризорник'
		},
		{
			pack : 1,
			group : 'Hi-Fi',
			song : 'Пионер'
		},
		{
			pack : 1,
			group : 'Электронный мальчик',
			song : 'Дитер Болен Не Курит',
			state: ' по Электронному мальчику'
		},
		{
			pack : 1,
			group : 'Технология',
			song : 'Странные танцы',
			state: ' по Технологии'
		},
		{
			pack : 1,
			group : 'Технология',
			song : 'Всё, что ты хочешь',
			state: ' по Технологии'
		},
		{
			pack : 1,
			group : 'Технология',
			song : 'Полчаса',
			state: ' по Технологии'
		},
		{
			pack : 1,
			group : 'Комиссар',
			song : 'Дрянь'
		},
		{
			pack : 1,
			group : 'Комиссар',
			song : 'Ты уйдёшь'
		},
		{
			pack : 1,
			group : 'Комиссар',
			song : 'Я тебе объявляю войну'
		},
		{
			pack : 1,
			group : 'Комиссар',
			song : 'Адреналин'
		},
		{
			pack : 1,
			group : 'Белый Орел',
			song : 'Потому что нельзя быть красивой такой'
		},
		{
			pack : 1,
			group : "На-на",
			song : 'Фаина'
		},
		{
			pack : 1,
			group : "На-на",
			song : 'Похитительница Сна'
		},
		{
			pack : 1,
			group : "Стекловата",
			song : 'Новый год'
		},
		{
			pack : 1,
			group : 'Браво',
			song : 'Девчонка 16 лет'
		},
		{
			pack : 1,
			group : 'Браво',
			song : 'Вася'
		},
		{
			pack : 1,
			group : 'Браво',
			song : 'Московский бит'
		},
		{
			pack : 1,
			group : 'Браво',
			song : 'Чёрный кот'
		},
		{
			pack : 1,
			group : 'Браво',
			song : 'Этот город'
		},
		{
			pack : 1,
			group : 'Браво',
			song : '20-й век'
		},
		{
			pack : 3,
			group : 'Леприконсы',
			song : 'Хали-гали, паратрупер'
		},
		{
			pack : 1,
			group : 'Фактор 2',
			song : 'Красавица'
		},
		{
			pack : 1,
			group : 'Фактор 2',
			song : 'Шалава'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Привет с большого бодуна'
		},
		{
			pack : 1,
			group : 'Мальчишник',
			song : 'Ночь'
		},
		{
			pack : 1,
			group : 'Мальчишник',
			song : 'Последний раз'
		},
		{
			pack : 1,
			group : "Фристайл",
			song : 'Ах, какая женщина...'
		},
		{
			pack : 1,
			group : "А-Студио",
			song : 'Солдат любви'
		},
		{
			pack : 1,
			group : 'Рок-острова',
			song : 'Ничего не говори'
		},
		{
			pack : 1,
			group : 'Русский размер',
			song : 'Ангел дня'
		},
		{
			pack : 1,
			group : 'Русский размер',
			song : 'Вот так'
		},
		{
			pack : 1,
			group : '140 ударов в минуту',
			song : 'Тополя'
		},
		{
			pack : 1,
			group : '140 ударов в минуту',
			song : 'Я тебя люблю'
		},
		{
			pack : 2,
			group : "Демо",
			song : '2000 лет',
			state: " по Демо"
		},
		{
			pack : 2,
			group : 'Блестящие',
			song : 'Ча-ча-ча',
			state: ' по Блестящим'
		},
		{
			pack : 2,
			group : 'Стрелки',
			song : 'На вечеринке',
			state: ' по Стрелкам'
		},
		{
			pack : 2,
			group : 'Балаган Лимитед',
			song : 'Чё те надо',
			state: ' по Балагану Лимитед',
			shorten: 'Балаган LTD'
		},
		{
			pack : 2,
			group : 'ЛаМанш',
			song : 'Погляд'
		},
		{
			pack : 2,
			group : 'Блестящие',
			song : 'Там, только там'
		},
		{
			pack : 2,
			group : 'Блестящие',
			song : 'Цветы'
		},
		{
			pack : 2,
			group : 'Блестящие',
			song : 'Облака'
		},
		{
			pack : 2,
			group : 'Стрелки',
			song : 'Мамочка'
		},
		{
			pack : 2,
			group : 'Стрелки',
			song : 'Ты бросил меня'
		},
		{
			pack : 2,
			group : 'МГК',
			song : 'Свечи'
		},
		{
			pack : 2,
			group : 'Вирус',
			song : 'Ручки'
		},
		{
			pack : 2,
			group : 'Вирус',
			song : 'Ты меня не ищи'
		},
		{
			pack : 2,
			group : 'Неигрушки',
			song : '100 дней до приказа'
		},
		{
			pack : 2,
			group : 'Гости из будущего',
			song : 'Зима в сердце'
		},
		{
			pack : 2,
			group : 'Гости из будущего',
			song : 'Нелюбовь'
		},
		{
			pack : 2,
			group : 'Восток',
			song : 'Танец жёлтых листьев'
		},
		{
			pack : 2,
			group : 'Восток',
			song : 'Миражи'
		},
		{
			pack : 2,
			group : 'Восток',
			song : 'До встречи'
		},
		{
			pack : 2,
			group : 'Восток',
			song : 'Всё небо'
		},
		{
			pack : 2,
			group : 'Ночные Снайперы',
			song : '31 весна'
		},
		{
			pack : 2,
			group : 'Маша и медведи',
			song : 'Любочка'
		},
		{
			pack : 2,
			group : 'Маша и медведи',
			song : 'Земля'
		},
		{
			pack : 2,
			group : 'Маша и медведи',
			song : 'Рейкьявик'
		},
		{
			pack : 2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Зараза'
		},
		{
			pack : 2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Я обиделась'
		},
		{
			pack : 2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'За пивом'
		},
		{
			pack : 2,
			group : 'Кабаре-дуэт «Академия»',
			song : 'Хочешь, но молчишь'
		},
		{
			pack : 2,
			group : 'Унесённые ветром',
			song : 'Какао'
		},
		{
			pack : 2,
			group : 'Каникулы',
			song : 'Завтра я на все забью'
		},
		{
			pack : 2,
			group : 'Гости из будущего',
			song : 'Беги от меня'
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "След на воде"
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "Небо"
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "Моя любовь"
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "Домашний арест"
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "Хороший парень"
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "Девушка-зима"
		},
		{
			pack : 2,
			group : 'Лицей',
			song : "Красная помада"
		},
		{
			pack : 3,
			group : 'Кукрыниксы',
			song : 'Артист'
		},
		{
			pack : 3,
			group : 'Кукрыниксы',
			song : 'Шторм'
		},
		{
			pack : 3,
			group : 'Кукрыниксы',
			song : 'Вера'
		},
		{
			pack : 3,
			group : 'Кукрыниксы',
			song : 'Экклезиаст'
		},
		{
			pack : 3,
			group : 'Кукрыниксы',
			song : 'Последняя песня'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'Ау'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'Яблони'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'В платие белом'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'Розочка'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'Дружбан'
			
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'По аллеям'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'Спорт прошёл'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'НЛО'		
		},
		{
			pack : 3,
			group : 'Аквариум',
			song : 'Поезд в огне'
		},
		{
			pack : 3,
			group : 'Аквариум',
			song : 'Не пей вина, Гертруда'
		},
		{
			pack : 3,
			group : 'Аквариум',
			song : 'Древнерусская тоска'
		},
		{
			pack : 3,
			group : 'Агата Кристи',
			song : 'Секрет'
		},
		{
			pack : 3,
			group : 'Агата Кристи',
			song : 'Как на войне'
		},
		{
			pack : 3,
			group : 'Агата Кристи',
			song : 'Опиум для никого'
		},		
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Лирика'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Солнышко лучистое'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : '30 лет'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Туман'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Твой звонок'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Ява'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Тёща'		
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Частушки'
		},
		{
			pack : 3,
			group : 'Сектор Газа',
			song : 'Гуляй, мужик'
		},
		{
			pack : 3,
			group : 'Би-2',
			song : 'Полковнику никто не пишет'
		},
		{
			pack : 3,
			group : 'Би-2',
			song : 'Варвара'
		},
		{
			pack : 3,
			group : 'Би-2',
			song : 'Серебро'
		},
		{
			pack : 3,
			group : 'Би-2',
			song : 'Счастье'
		},
		{
			pack : 3,
			group : 'Алиса',
			song : 'Путь домой'
		},
		{
			pack : 3,
			group : 'Алиса',
			song : 'Веретено'
		},
		{
			pack : 3,
			group : 'Nautilus Pompilius',
			song : 'Безымянная река'
		},
		{
			pack : 3,
			group : 'Nautilus Pompilius',
			song : 'Прогулки по воде'
		},
		{
			pack : 3,
			group : 'Nautilus Pompilius',
			song : 'Крылья'
		},
		{
			pack : 3,
			group : 'Nautilus Pompilius',
			song : 'Зверь'
		},
		{
			pack : 3,
			group : 'Алиса',
			song : 'Небо славян'
		},
		{
			pack : 4,
			group : 'Ундервуд',
			song : 'Гагарин, я вас любила'
		},
		{
			pack : 4,
			group : 'Конец Фильма',
			song : 'Здравствуй, небо в облаках'
		},
		{
			pack : 4,
			group : 'Мумий Тролль',
			song : 'Лунные Девицы',
			state: ' по Мумий Троллю'
		},
		{
			pack : 4,
			group : 'Манго-Манго',
			song : 'Тарантелла'
			
		},
		{
			pack : 4,
			group : "Манго-Манго",
			song : 'Аквалангисты',
			state: " по Манго-Манго"
		},
		{
			pack : 4,
			group : 'Несчастный Случай',
			song : 'Генералы песчаных карьеров'		
		},
		{
			pack : 4,
			group : 'Несчастный Случай',
			song : 'Что ты имела в виду'		
		},
		{
			pack : 4,
			group : 'Танцы Минус',
			song : 'Иду'		
		},
		{
			pack : 4,
			group : 'Танцы Минус',
			song : 'Половинка'		
		},
		{
			pack : 4,
			group : 'Танцы Минус',
			song : 'Город'		
		},
		{
			pack : 4,
			group : 'Мегаполис',
			song : 'Звездочка'		
		},
		{
			pack : 4,
			group : '7Б',
			song : 'Молодые ветра'
		},
		{
			pack : 4,
			group : 'Сплин',
			song : 'Линия жизни'
		},
		{
			pack : 4,
			group : 'Смысловые Галлюцинации',
			song : 'Розовые очки'
		},
		{
			pack : 4,
			group : 'Смысловые Галлюцинации',
			song : 'Вечно молодой'
		},
		{
			pack : 4,
			group : 'АукцЫон',
			song : 'Дорога'
		},
		{
			pack : 4,
			group : 'Пикник',
			song : 'Фиолетово-черный'
		},		
		{
			pack : 4,
			group : 'Чиж & Co',
			song : 'О любви'
		},
		{
			pack : 4,
			group : 'Чиж & Co',
			song : 'Фантом'
		},
		{
			pack : 4,
			group : 'Пурген',
			song : 'Философия урбанистического безвремения'
		},
		{
			pack : 4,
			group : 'Пурген',
			song : 'Kristall nacht'
		},
		{
			pack : 4,
			group : 'Lumen',
			song : 'Сид и Нэнси'
		},
		{
			pack : 4,
			group : 'Тараканы',
			song : 'Я смотрю на них'
		},
		{
			pack : 4,
			group : 'Крематорий',
			song : 'Катманду'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Дорога'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Ты неси меня, река'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Комбат'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Солдат'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Атас'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Там, за туманами'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Позови меня тихо по имени'
		},
		{
			pack : 4,
			group : 'Любэ',
			song : 'Конь'
		},
		{
			pack : 4,
			group : 'Пикник',
			song : 'Там, на самом краю земли'
		},
		{
			pack : 4,
			group : 'Пикник',
			song : 'Настоящие дни'
		},
		{
			pack : 4,
			group : 'Ария',
			song : 'Беспечный ангел'
		},
		{
			pack : 4,
			group : 'Ария',
			song : 'Потерянный рай'
		},
		{
			pack : 4,
			group : 'Ария',
			song : 'Возьми мое сердце'
		},
		{
			pack : 4,
			group : 'Ария',
			song : 'Ангельская пыль'
		},
		{
			pack : 4,
			group : 'Ария',
			song : 'Все, что было'
		},
		{
			pack : 3,
			group : 'Ляпис Трубецкой',
			song : 'Огоньки'
		},
		{
			pack : 3,
			group : 'Леприконсы',
			song : 'Тополя'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Страна Лимония'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Пулемет'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Женька'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Коммунальная квартира'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Фонарики'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Борька-бабник'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Наш Вася'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Корефана'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Мечта (Море пива)'
		},
		{
			pack : 1,
			group : 'Дюна',
			song : 'Караганда'
		},
		{
			pack : 2,
			group : 'Вирус',
			song : 'Попрошу тебя'
		},
		{
			pack : 1,
			group : 'Империя',
			song : 'Мой сон'
		},
		{
			pack : 1,
			group : 'Империя',
			song : 'Поезд на Ленинград'
		},
		{
			pack : 1,
			group : 'Дискотека Авария',
			song : 'Новогодняя'
		},
		{
			pack : 1,
			group : 'Дискотека Авария',
			song : 'Пей пиво!'
		},
		{
			pack : 1,
			group : 'Дискотека Авария',
			song : 'Влечение'
		},
		{
			pack : 1,
			group : 'Дискотека Авария',
			song : 'Давай, Авария!'
		},
		{
			pack : 1,
			group : 'Кирпичи',
			song : 'Плюю я'
		},
		{
			pack : 3,
			group : 'Ногу свело',
			song : 'Хару мамбуру'
		},
		{
			pack : 3,
			group : 'Ногу свело',
			song : 'Лилипутская любовь'
		},
		{
			pack : 3,
			group : 'Ногу свело',
			song : 'Сибирская любовь'
		},
		{
			pack : 3,
			group : 'Ногу свело',
			song : 'Московский романс'
		},
		{
			pack : 3,
			group : 'Леприконсы',
			song : 'Москвич'
		},
		{
			pack : 3,
			group : 'Леприконсы',
			song : 'Лена'
		},
		{
			pack : 3,
			group : 'Леприконсы',
			song : 'Липа-облепиха'
		},
		{
			pack : 3,
			group : 'Леприконсы',
			song : 'Вовочка'
		}
];

let ru_1990_gr_1 =	ru_1990_gr.filter(item => item.pack == 1);
let ru_1990_gr_2 =	ru_1990_gr.filter(item => item.pack == 2);
let ru_1990_gr_3 =	ru_1990_gr.filter(item => item.pack == 3);
let ru_1990_gr_4 =	ru_1990_gr.filter(item => item.pack == 4);

let ru_1990_m = [
		{
			pack : 2,
			group : 'Кай Метов',
			song : 'Position №2',
			state: ' по Каю Метову'
		},
		{
			pack : 2,
			group : 'Сергей Васюта',
			song : 'На белом покрывале января (ft. Сладкий Сон)',
			state: ' по Сергею Васюте',
			shorten: 'Васюта'
		},
		{
			pack : 2,
			group : 'Профессор Лебединский',
			song : 'Бегут года',
			state: ' по Профессору Лебединскому (ft. Русский Размер)',
			shorten: 'Лебединский'
		},
		{
			pack : 2,
			group : 'Ярослав Евдокимов',
			song : 'Фантазёр'
		},
		{
			pack : 2,
			group : 'Сергей Минаев',
			song : '22 притопа',
			state: ' по Минаеву',
			shorten: 'Минаев'
		},
		{
			pack : 2,
			group : "Роман Жуков",
			song : 'Млечный путь',
			state: " по Жукову",
			shorten: 'Жуков'
		},
		{
			pack : 1,
			group : 'Леонид Агутин',
			song : 'Хоп-хей Лала Лэй'
		},
		{
			pack : 2,
			group : 'Юрий Шатунов',
			song : 'Розовый вечер'
		},
		{
			pack : 2,
			group : "Алексей Глызин",
			song : 'Зимний сад',
			state: " по Глызину",
			shorten: 'Глызин'
		},
		{
			pack : 2,
			group : 'Михаил Шифутинский',
			song : '3-е Сентября'
		},
		{
			pack : 2,
			group : 'Сергей Васюта',
			song : 'Снег на розах (ft. Сладкий Сон)',
			state: ' по Сергею Васюте',
			shorten: 'Васюта'
		},
		{
			pack : 1,
			group : 'Леонид Агутин',
			song : 'Оле-оле'
		},
		{
			pack : 1,
			group : 'Леонид Агутин',
			song : 'Кого не стоило бы ждать'
		},
		{
			pack : 2,
			group : 'Михаил Шифутинский',
			song : 'Пальма де Майорка'
		},
		{
			pack : 2,
			group : 'Игорь Крутой',
			song : 'Незаконченный роман (ft Ирина Аллегрова)'
		},
		{
			pack : 2,
			group : 'Вадим Казаченко',
			song : 'Белая метелица'
		},
		{
			pack : 2,
			group : 'Вадим Казаченко',
			song : 'Больно мне, больно'
		},
		{
			pack : 2,
			group : 'Вадим Казаченко',
			song : 'Жёлтые розы'
		},
		{
			pack : 2,
			group : 'Игорь Тальков',
			song : 'Моя любовь'
		},
		{
			pack : 2,
			group : 'Игорь Тальков',
			song : 'Я вернусь'
		},
		{
			pack : 2,
			group : 'Игорь Тальков',
			song : 'Чистые пруды'
		},
		{
			pack : 2,
			group : 'Егор Летов',
			song : 'Моя оборона'
		},
		{
			pack : 2,
			group : 'Егор Летов',
			song : 'Всё идёт по плану'
		},
		{
			pack : 2,
			group : 'Егор Летов',
			song : 'Далеко бежит дорога'
		},
		{
			pack : 2,
			group : 'Михаил Круг',
			song : 'Владимирский централ'
		},
		{
			pack : 2,
			group : 'Михаил Круг',
			song : 'Кольщик'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'Ты не ангел'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'Поздний вечер в Соренто'
		},
		{
			pack : 2,
			group : 'Стас Михайлов',
			song : 'Тёмные глаза'
		},
		{
			pack : 2,
			group : 'Стас Михайлов',
			song : 'Всё для тебя'
		},
		{
			pack : 2,
			group : 'Александр Серов',
			song : 'Я люблю тебя до слёз'
		},
		{
			pack : 2,
			group : 'Андрей Державин',
			song : 'Не плачь, Алиса'
		},
		{
			pack : 2,
			group : 'Андрей Державин',
			song : 'Чужая свадьба'
		},
		{
			pack : 2,
			group : 'Андрей Державин',
			song : 'Песня о первой любви'
		},
		{
			pack : 2,
			group : 'Игорь Николаев',
			song : 'Выпьем за любовь'
		},
		{
			pack : 2,
			group : 'Игорь Николаев',
			song : 'Такси (ft Наташа Королёва)'
		},
		{
			pack : 2,
			group : 'Игорь Николаев',
			song : 'Старая Мельница'
		},
		{
			pack : 2,
			group : 'Ефрем Амиратов',
			song : 'Молодая'
		},
		{
			pack : 2,
			group : 'Роман Жуков',
			song : 'Фея'
		},
		{
			pack : 2,
			group : 'Mr Credo',
			song : 'Медляк'
		},
		{
			pack : 2,
			group : 'Mr Credo',
			song : 'Воздушный шар'
		},
		{
			pack : 2,
			group : 'Оскар',
			song : 'Бег По Острию Ножа'
		},
		{
			pack : 2,
			group : 'Роман Жуков',
			song : 'Первый снег'
		},
		{
			pack : 2,
			group : 'Роман Жуков',
			song : 'Я люблю вас, девочки'
		},
		{
			pack : 2,
			group : 'Оскар',
			song : 'Между мной и тобой'
		},
		{
			pack : 1,
			group : 'Андрей Губин',
			song : 'Зима-холода'
		},
		{
			pack : 1,
			group : 'Андрей Губин',
			song : 'Мальчик-бродяга'
		},
		{
			pack : 1,
			group : 'Андрей Губин',
			song : 'Ночь'
		},
		{
			pack : 1,
			group : 'Андрей Губин',
			song : 'Без тебя'
		},
		{
			pack : 1,
			group : 'Андрей Губин',
			song : 'Милая моя далеко'
		},
		{
			pack : 1,
			group : 'Влад Сташевский',
			song : 'Позови меня в ночи'
		},
		{
			pack : 1,
			group : 'Влад Сташевский',
			song : 'Глаза чайного цвета'
		},
		{
			pack : 1,
			group : 'Влад Сташевский',
			song : 'Вечерочки - вечерки'
		},
		{
			pack : 1,
			group : 'Влад Сташевский',
			song : 'Девочка с перекрёсточка'
		},
		{
			pack : 1,
			group : 'Дмитрий Маликов',
			song : 'Ты одна ты такая'
		},
		{
			pack : 1,
			group : 'Дмитрий Маликов',
			song : 'Звезда моя далёкая'
		},
		{
			pack : 1,
			group : 'Дмитрий Маликов',
			song : 'Кто тебе сказал'
		},
		{
			pack : 1,
			group : 'Дмитрий Маликов',
			song : 'Все вернется'
		},
		{
			pack : 1,
			group : 'Дмитрий Маликов',
			song : 'Птицелов'
		},
		{
			pack : 1,
			group : 'Шура',
			song : 'Ты не верь слезам'
		},
		{
			pack : 1,
			group : 'Шура',
			song : 'Холодная луна'
		},
		{
			pack : 1,
			group : 'Шура',
			song : 'Don-don-don'
		},
		{
			pack : 1,
			group : 'Евгений Осин',
			song : 'Иволга'
		},
		{
			pack : 1,
			group : 'Евгений Осин',
			song : 'Не надо, не плачь'
		},
		{
			pack : 1,
			group : 'Евгений Осин',
			song : 'Плачет девушка в автомате'
		},
		{
			pack : 1,
			group : 'Евгений Осин',
			song : 'Студентка-практикантка'
		},
		{
			pack : 1,
			group : 'Евгений Осин',
			song : 'Попутчица'
		},
		{
			pack : 1,
			group : 'Евгений Белоусов',
			song : 'Девчонка-девчоночка'
		},
		{
			pack : 1,
			group : 'Евгений Белоусов',
			song : 'Алёшка'
		},
		{
			pack : 1,
			group : 'Олег Газманов',
			song : 'Есаул'
		},
		{
			pack : 1,
			group : 'Олег Газманов',
			song : 'Эскадрон'
		},
		{
			pack : 1,
			group : 'Олег Газманов',
			song : 'Морячка'
		},
		{
			pack : 1,
			group : 'Олег Газманов',
			song : 'Танцуй, пока молодой'
		},
		{
			pack : 1,
			group : 'Валерий Леонтьев',
			song : 'Полет на дельтаплане'
		},
		{
			pack : 1,
			group : 'Валерий Леонтьев',
			song : 'Девять хризантем'
		},
		{
			pack : 1,
			group : 'Валерий Леонтьев',
			song : 'Казанова'
		},
		{
			pack : 1,
			group : 'Богдан Титомир',
			song : 'Делай как я'
		},
		{
			pack : 1,
			group : 'Богдан Титомир',
			song : 'Ерунда'
		},
		{
			pack : 1,
			group : 'Владимир Пресняков',
			song : 'Стюардесса по имени Жанна'
		},
		{
			pack : 1,
			group : 'Владимир Пресняков',
			song : 'Замок из дождя'
		},
		{
			pack : 1,
			group : 'Филипп Киркоров',
			song : 'Бегущая по волнам'
		},
		{
			pack : 1,
			group : 'Филипп Киркоров',
			song : 'Зайка моя'
		},
		{
			pack : 1,
			group : 'Филипп Киркоров',
			song : 'Мышь'
		},
		{
			pack : 1,
			group : 'Игорь Корнелюк',
			song : 'Дожди'
		},
		{
			pack : 1,
			group : 'Игорь Корнелюк',
			song : 'Пора домой'
		},
		{
			pack : 2,
			group : 'Аркадий Укупник',
			song : 'Я на тебе никогда не женюсь'
		},
		{
			pack : 2,
			group : 'Аркадий Укупник',
			song : 'Сим-Сим'
		},
		{
			pack : 2,
			group : 'Гарик Сукачёв',
			song : 'Моя бабушка курит трубку'
		},
		{
			pack : 1,
			group : 'Мурат Насыров',
			song : 'Я это ты'
		},
		{
			pack : 1,
			group : 'Мурат Насыров',
			song : 'Мальчик хочет в Тамбов'
		},
		{
			pack : 1,
			group : 'Михаил Боярский',
			song : 'Спасибо родная'
		},
		{
			pack : 1,
			group : 'Валерий Меладзе',
			song : 'Девушки из высшего общества'
		},
		{
			pack : 1,
			group : 'Владимир Кузьмин',
			song : 'Я не забуду тебя никогда'
		},
		{
			pack : 1,
			group : 'Владимир Кузьмин',
			song : 'Моя любовь'
		},
		{
			pack : 1,
			group : 'Владимир Кузьмин',
			song : 'Семь морей'
		},
		{
			pack : 1,
			group : 'Григорий Лепс',
			song : 'Рюмка водки на столе'
		},
		{
			pack : 1,
			group : 'Григорий Лепс',
			song : 'Самый лучший день'
		},
		{
			pack : 1,
			group : 'Григорий Лепс',
			song : 'Натали'
		},
		{
			pack : 3,
			group : 'Дельфин',
			song : 'Любовь'
		},
		{
			pack : 3,
			group : 'Дельфин',
			song : 'Дверь'
		},
		{
			pack : 3,
			group : 'Дельфин',
			song : 'Если просто'
		},
		{
			pack : 3,
			group : 'Дельфин',
			song : 'Я люблю людей'
		},
		{
			pack : 3,
			group : 'Дельфин',
			song : 'Дилер'
		},
		{
			pack : 3,
			group : 'Дельфин',
			song : 'Я буду жить'
		},
		{
			pack : 3,
			group : 'Михей',
			song : 'Сука Любовь (ft Джуманджи)'
		},
		{
			pack : 3,
			group : 'Михей',
			song : 'Туда (ft Джуманджи)'
		},
		{
			pack : 3,
			group : 'Михей',
			song : 'Мы Дети Большого Города (ft Джуманджи)'
		},
		{
			pack : 3,
			group : 'Михей',
			song : 'Мы поплывем по волнам (ft Джуманджи)'
		},
		{
			pack : 3,
			group : 'Николай Носков',
			song : 'Романс'
		},
		{
			pack : 3,
			group : 'Николай Носков',
			song : 'Я тебя люблю'
		},
		{
			pack : 3,
			group : 'Николай Носков',
			song : 'Паранойя'
		},
		{
			pack : 3,
			group : 'Николай Носков',
			song : 'Это здорово'
		},
		{
			pack : 3,
			group : 'Николай Носков',
			song : 'Снег'
		},
		{
			pack : 3,
			group : 'Сергей Крылов',
			song : 'Девочка'
		},
		{
			pack : 3,
			group : 'Сергей Крылов',
			song : 'Осень-золотые листопады (ft Александр Добронравов)'
		},
		{
			pack : 3,
			group : 'Сергей Крылов',
			song : 'Короче, я звоню из Сочи'
		},
		{
			pack : 3,
			group : 'Николай Трубач',
			song : 'Женская Любовь'
		},
		{
			pack : 3,
			group : 'Николай Трубач',
			song : 'Научись играть на гитаре'
		},
		{
			pack : 3,
			group : 'Николай Трубач',
			song : 'Пять минут'
		},
		{
			pack : 3,
			group : 'Николай Трубач',
			song : 'Голубая луна (ft Борис Моисеев)'
		},
		{
			pack : 3,
			group : 'Николай Трубач',
			song : 'Щелкунчик (ft Борис Моисеев)'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Лодочка (ft Николай Трубач)'
		},
		{
			pack : 3,
			group : 'Николай Трубач',
			song : 'Адреналин'
		},
		{
			pack : 3,
			group : 'Найк Борзов',
			song : 'Лошадка'
		},
		{
			pack : 3,
			group : 'Найк Борзов',
			song : 'Верхом на звезде'
		},
		{
			pack : 3,
			group : 'Найк Борзов',
			song : 'Последняя песня'
		},
		{
			pack : 3,
			group : 'Найк Борзов',
			song : 'Три слова'
		},
		{
			pack : 3,
			group : 'Найк Борзов',
			song : 'Загадка'
		},
		{
			pack : 3,
			group : 'Сергей Чумаков',
			song : 'Жених'
		},
		{
			pack : 3,
			group : 'Сергей Чумаков',
			song : 'От весны до весны'
		},
		{
			pack : 3,
			group : 'Сергей Чумаков',
			song : 'Гадюка'
		},
		{
			pack : 3,
			group : 'Игорек',
			song : 'Подождем мою маму'
		},
		{
			pack : 3,
			group : 'Вячеслав Быков',
			song : 'Любимая моя'
		},
		{
			pack : 3,
			group : 'Вячеслав Быков',
			song : 'Девушка у алтаря'
		},
		{
			pack : 3,
			group : 'Вячеслав Быков',
			song : 'Я прихожу к тебе когда город спит'
		},
		{
			pack : 3,
			group : 'Вячеслав Быков',
			song : 'Садовник'
		},
		{
			pack : 3,
			group : 'Вячеслав Быков',
			song : 'Девочка-ночь'
		},
		{
			pack : 3,
			group : 'Вячеслав Быков',
			song : 'Девочка Моя'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Скрипка-лиса'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Желаю тебе'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Портрет в карандаше'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Дорогие мои старики'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Зеленые глаза'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Моя любовь по городу'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Бухта радости'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Маскарад'
		},
		{
			pack : 3,
			group : 'Игорь Саруханов',
			song : 'Падал снег'
		},
		{
			pack : 3,
			group : 'Александр Буйнов',
			song : 'Падают листья'
		},
		{
			pack : 3,
			group : 'Александр Буйнов',
			song : 'Капитан Каталкин'
		},
		{
			pack : 3,
			group : 'Александр Буйнов',
			song : 'Мои финансы поют романсы'
		},
		{
			pack : 3,
			group : 'Александр Буйнов',
			song : 'Шансоньетка (ft Ирина Аллегрова)'
		},
		{
			pack : 3,
			group : 'Максим Фадеев',
			song : 'Беги по небу'
		},
		{
			pack : 2,
			group : 'Витас',
			song : 'Опера 2'
		},
		{
			pack : 2,
			group : 'Олег Пахомов',
			song : 'Белые лебеди'
		},
		{
			pack : 2,
			group : 'Александр Иванов',
			song : 'Боже, какой пустяк'
		},
		{
			pack : 2,
			group : 'Александр Иванов',
			song : 'Пуля'
		},
		{
			pack : 2,
			group : 'Александр Иванов',
			song : 'Я постелю тебе под ноги небо'
		},
		{
			pack : 2,
			group : 'Александр Иванов',
			song : 'Моя неласковая русь'
		},
		{
			pack : 1,
			group : 'Филипп Киркоров',
			song : 'Единственная моя'
		},
		{
			pack : 2,
			group : 'Гарик Сукачёв',
			song : 'А по асфальту каблучки'
		},
		{
			pack : 1,
			group : 'Валерий Меладзе',
			song : 'Самба белого мотылька'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'То ли воля, то ли неволя'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'Всё позади'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'Письма издалека'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'Счастье ты моё'
		},
		{
			pack : 2,
			group : 'Алексей Глызин',
			song : 'Пепел любви'
		},
		{
			pack : 1,
			group : 'Шура',
			song : 'Отшумели летние дожди'
		}
];

let ru_1990_m_1 =	ru_1990_m.filter(item => item.pack == 1);
let ru_1990_m_2 =	ru_1990_m.filter(item => item.pack == 2);
let ru_1990_m_3 =	ru_1990_m.filter(item => item.pack == 3);

let ru_1990_f = [
		{
			pack : 1,
			group : 'Натали',
			song : 'Ветер с моря дул',
			state: ' по Натали'
		},
		{
			pack : 3,
			group : 'Диана',
			song : 'Скатертью дорога',
			state: ' по Диане'
		},
		{
			pack : 2,
			group : 'Каролина',
			song : 'Звёздный вечер'
		},
		{
			pack : 2,
			group : 'Каролина',
			song : 'Мама, всё ОК'
		},
		{
			pack : 2,
			group : 'Валерия',
			song : 'Моя Москва',
			state: ' по Валерии'
		},
		{
			pack : 3,
			group : 'Светлана Рерих',
			song : 'Ладошки',
			state: ' по Рерих',
			shorten: 'Рерих'
		},
		{
			pack : 2,
			group : 'Марина Хлебникова',
			song : 'Чашка Кофею',
			state: ' по Хлебниковой',
			shorten: 'Хлебникова'
		},
		{
			pack : 3,
			group : 'Светлана Владимирская',
			song : 'Мальчик мой',
			state: ' по Владимирской',
			shorten: 'Владимирская'
		},
		{
			pack : 3,
			group : 'Жанна Агузарова',
			song : 'Ты, только ты',
			state: ' по Агузаровой',
			shorten: 'Агузарова'
		},
		{
			pack : 2,
			group : 'Валерия',
			song : 'Самолёт',
			state: ' по Валерии'
		},
		{
			pack : 3,
			group : 'Лариса Долина',
			song : 'Льдинка',
			state: ' по Долиной',
			shorten: 'Долина'
		},
		{
			pack : 2,
			group : 'Лариса Черникова',
			song : 'Влюблённый самолёт',
			state: ' по Черниковой',
			shorten: 'Черникова'
		},
		{
			pack : 2,
			group : "Алла Пугачёва",
			song : 'Позови меня с собой',
			state: " по Пугачёвой",
			shorten: 'Пугачёва'
		},
		{
			pack : 1,
			group : 'Натали',
			song : 'Улыбочка',
			state: ' по Натали'
		},
		{
			pack : 1,
			group : "Лайма Вайкуле",
			song : 'Ещё не вечер',
			state: " по Лайме Вайкуле",
			shorten: 'Вайкуле'
		},
		{
			pack : 2,
			group : 'Лада Дэнс',
			song : 'Сотри кассету'
		},
		{
			pack : 2,
			group : 'Лада Дэнс',
			song : 'Аромат любви'
		},
		{
			pack : 3,
			group : 'Света',
			song : 'Увидимся',
			state: ' по Свете'
		},
		{
			pack : 2,
			group : 'Алёна Апина',
			song : 'Электричка',
			state: ' по Апиной',
			shorten: 'Апина'
		},
		{
			pack : 3,
			group : 'Полина Ростова',
			song : 'По краю дождя',
			state: ' по Ростовой',
			shorten: 'Ростова'
		},
		{
			pack : 2,
			group : 'Лика Стар',
			song : 'Одинокая луна'
		},
		{
			pack : 2,
			group : 'Лада Дэнс',
			song : 'Жить нужно в кайф',
			state: ' по Ладе Дэнс'
		},
		{
			pack : 3,
			group : 'Полина Ростова',
			song : 'По краю дождя'
		},
		{
			pack : 3,
			group : 'Светлана Владимирская',
			song : 'Дави на газ'
		},
		{
			pack : 3,
			group : 'Света',
			song : 'Дорога в аэропорт'
		},
		{
			pack : 3,
			group : 'Светлана Разина',
			song : 'Каменный лев'
		},
		{
			pack : 3,
			group : 'Светлана Рерих',
			song : 'Вредная девчонка'
		},
		{
			pack : 3,
			group : 'Светлана Рерих',
			song : 'Дай мне музыку'
		},
		{
			pack : 3,
			group : 'Татьяна Маркова',
			song : 'Я плачу'
		},
		{
			pack : 3,
			group : 'Марина Журавлева',
			song : 'Белая черемуха'
		},
		{
			pack : 2,
			group : 'Лада Дэнс',
			song : 'Танцы у моря'
		},
		{
			pack : 3,
			group : 'Ника',
			song : 'Три хризантемы'
		},
		{
			pack : 3,
			group : 'Ника',
			song : 'Сколько Лет, Сколько зим'
		},
		{
			pack : 3,
			group : 'Ника',
			song : 'Это не мой секрет'
		},
		{
			pack : 3,
			group : 'Алёна Иванцова',
			song : 'Человек дождя'
		},
		{
			pack : 2,
			group : 'Линда',
			song : 'Ворона'
		},
		{
			pack : 2,
			group : 'Линда',
			song : 'Мало огня'
		},
		{
			pack : 3,
			group : 'Надежда Кадышева',
			song : 'Виновата ли я'
		},
		{
			pack : 3,
			group : 'Надежда Кадышева',
			song : 'У церкви стояла карета'
		},
		{
			pack : 3,
			group : 'Вика Цыганова',
			song : 'Приходите в мой дом'
		},
		{
			pack : 3,
			group : 'Вика Цыганова',
			song : 'Гроздья рябины'
		},
		{
			pack : 3,
			group : 'Вика Цыганова',
			song : 'Лето пьяное'
		},
		{
			pack : 3,
			group : 'Вика Цыганова',
			song : 'Любовь и смерть'
		},
		{
			pack : 3,
			group : 'Диана Гурцкая',
			song : 'Ты здесь'
		},
		{
			pack : 3,
			group : 'Диана Гурцкая',
			song : 'Я не люблю тебя'
		},
		{
			pack : 3,
			group : 'Диана Гурцкая',
			song : 'Волшебное стекло моей души'
		},
		{
			pack : 3,
			group : 'Диана Гурцкая',
			song : 'Две луны'
		},
		{
			pack : 3,
			group : 'Алиса Мон',
			song : 'Алмаз'
		},
		{
			pack : 3,
			group : 'Настя',
			song : 'Голоса'
		},
		{
			pack : 3,
			group : 'Яна',
			song : 'Одинокий голубь'
		},
		{
			pack : 3,
			group : 'Яна',
			song : 'Сигаретный дым'
		},
		{
			pack : 3,
			group : 'Яна',
			song : 'Хулиган'
		},
		{
			pack : 3,
			group : 'Лена Зосимова',
			song : 'Подружки Мои, Не Ревнуйте'
		},
		{
			pack : 3,
			group : 'Анастасия Минцковская',
			song : 'Губа не дура'
		},
		{
			pack : 3,
			group : 'Алика Смехова',
			song : 'Не перебивай (ft Александр Буйнов)'
		},
		{
			pack : 3,
			group : 'Саша',
			song : 'По ночному городу'
		},
		{
			pack : 3,
			group : 'Саша',
			song : 'Это просто дождь'
		},
		{
			pack : 3,
			group : 'Саша',
			song : 'Любовь — это война'
		},
		{
			pack : 2,
			group : 'Алёна Свиридова',
			song : 'Бедная овечка'
		},
		{
			pack : 2,
			group : 'Алёна Свиридова',
			song : 'Это ведь я'
		},
		{
			pack : 2,
			group : 'Алёна Свиридова',
			song : 'Два ангела'
		},
		{
			pack : 2,
			group : 'Алёна Свиридова',
			song : 'Розовый фламинго'
		},
		{
			pack : 1,
			group : 'Наталья Ветлицкая',
			song : 'Лунный кот'
		},
		{
			pack : 1,
			group : 'Наталья Ветлицкая',
			song : 'Playboy'
		},
		{
			pack : 1,
			group : 'Наталья Ветлицкая',
			song : 'Посмотри в глаза'
		},
		{
			pack : 1,
			group : 'Наталья Ветлицкая',
			song : 'Глупые мечты'
		},
		{
			pack : 1,
			group : 'Наталья Ветлицкая',
			song : 'Была не была'
		},
		{
			pack : 1,
			group : 'Наташа Королёва',
			song : 'Желтые тюльпаны'
		},
		{
			pack : 1,
			group : "Наташа Королёва",
			song : 'Маленькая страна'
		},
		{
			pack : 1,
			group : "Наташа Королёва",
			song : 'Мужичок с гармошкой'
		},
		{
			pack : 1,
			group : "Наташа Королёва",
			song : 'Серые Глаза'
		},
		{
			pack : 1,
			group : "Наталья Сенчукова",
			song : 'Я по тебе скучаю'
		},
		{
			pack : 1,
			group : "Наталья Сенчукова",
			song : 'Лодка'
		},
		{
			pack : 1,
			group : "Наталья Сенчукова",
			song : 'Ты меня обидел'
		},
		{
			pack : 1,
			group : "Наталия Гулькина",
			song : 'Айвенго'
		},
		{
			pack : 1,
			group : "Наталия Гулькина",
			song : 'Это Китай'
		},
		{
			pack : 1,
			group : "Наталия Гулькина",
			song : 'Мелодия любви'
		},
		{
			pack : 1,
			group : "Наталия Гулькина",
			song : 'Дискотека'
		},
		{
			pack : 1,
			group : "Татьяна Овсиенко",
			song : 'За розовым морем'
		},
		{
			pack : 1,
			group : 'Татьяна Овсиенко',
			song : 'Школьная пора'
		},
		{
			pack : 1,
			group : 'Татьяна Овсиенко',
			song : 'Колечко'
		},
		{
			pack : 1,
			group : 'Татьяна Овсиенко',
			song : 'Дальнобойщик'
		},
		{
			pack : 1,
			group : 'Татьяна Овсиенко',
			song : 'Женское счастье'
		},
		{
			pack : 1,
			group : 'Татьяна Овсиенко',
			song : 'Запомни меня'
		},
		{
			pack : 1,
			group : 'Татьяна Овсиенко',
			song : 'Капитан'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Фотография 9х12'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Привет, Андрей'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Младший лейтенант'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Угонщица'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Императрица'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'С днём рождения!'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Гарем'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Отпусти'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Серые глаза'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Да и нет'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Сокол ясный'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Голубые глазки'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Белый шарфик'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Бай-бай'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Солнечный друг'
		},
		{
			pack : 1,
			group : 'Ирина Салтыкова',
			song : 'Огоньки'
		},
		{
			pack : 1,
			group : 'Татьяна Буланова',
			song : 'Ясный мой свет'
		},
		{
			pack : 1,
			group : 'Татьяна Буланова',
			song : 'Мой ненаглядный'
		},
		{
			pack : 1,
			group : 'Татьяна Буланова',
			song : 'Не плачь'
		},
		{
			pack : 1,
			group : 'Татьяна Буланова',
			song : 'Вот и солнце село'
		},
		{
			pack : 1,
			group : 'Татьяна Буланова',
			song : 'Ледяное сердце'
		},
		{
			pack : 1,
			group : 'Татьяна Буланова',
			song : 'Старшая сестра'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Ля-ля-фа'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Художник, что рисует дождь'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Зимняя вишня'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Городок'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Осенний джаз'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Другая женщина'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Все в твоих руках'
		},
		{
			pack : 1,
			group : 'Анжелика Варум',
			song : 'Королева (ft Леонид Агутин)'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Я останусь с тобой'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Клава'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Тараканы'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Белый мерседес'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Шарманщик'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Беспутная'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Ах, Одесса!..'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Хулиганчики'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Ты упал с луны'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Ты меня не буди'
		},
		{
			pack : 2,
			group : 'Маша Распутина',
			song : 'Платье из роз'
		},
		{
			pack : 2,
			group : 'Алла Пугачёва',
			song : 'В Петербурге сегодня дожди'
		},
		{
			pack : 2,
			group : 'Алла Пугачёва',
			song : 'Две звезды (ft Владимир Кузьмин)'
		},
		{
			pack : 2,
			group : 'Алла Пугачёва',
			song : 'Настоящий Полковник'
		},
		{
			pack : 2,
			group : 'Алла Пугачёва',
			song : 'Любовь, похожая на сон'
		},
		{
			pack : 2,
			group : 'Кристина Орбакайте',
			song : 'Позови меня'
		},
		{
			pack : 2,
			group : 'Кристина Орбакайте',
			song : 'Ну почему?'
		},
		{
			pack : 2,
			group : 'Кристина Орбакайте',
			song : 'Без тебя'
		},
		{
			pack : 2,
			group : 'Алёна Апина',
			song : 'Узелки'
		},
		{
			pack : 2,
			group : 'Алёна Апина',
			song : 'Леха'
		},
		{
			pack : 2,
			group : 'Алёна Апина',
			song : 'Летучий голландец'
		},
		{
			pack : 2,
			group : 'Алёна Апина',
			song : 'Ксюша'
		},
		{
			pack : 2,
			group : 'Алёна Свиридова',
			song : 'Никто-никогда'
		},
		{
			pack : 1,
			group : 'Натали',
			song : 'Черепашка'
		},
		{
			pack : 1,
			group : 'Наталия Власова',
			song : 'Я у твоих ног'
		},
		{
			pack : 2,
			group : 'Лариса Черникова',
			song : 'Ты не приходи (розовые очки)'
		},
		{
			pack : 2,
			group : 'Лариса Черникова',
			song : 'Да ты не смейся'
		},
		{
			pack : 2,
			group : 'Лариса Черникова',
			song : 'Одинокий волк'
		},
		{
			pack : 2,
			group : 'Лариса Черникова',
			song : 'Тайна'
		},
		{
			pack : 2,
			group : 'Лариса Долина',
			song : 'Погода в доме'
		},
		{
			pack : 2,
			group : 'Лариса Долина',
			song : 'Стена'
		},
		{
			pack : 2,
			group : 'Лариса Долина',
			song : 'Прости меня'
		},
		{
			pack : 2,
			group : 'Лада Дэнс',
			song : 'Один раз в год сады цветут'
		},
		{
			pack : 2,
			group : 'Лада Дэнс',
			song : 'Baby tonight'
		},
		{
			pack : 3,
			group : 'Диана',
			song : 'Не говори'
		},
		{
			pack : 3,
			group : 'Света',
			song : 'Не сходи с ума'
		},
		{
			pack : 1,
			group : 'Наталья Сенчукова',
			song : 'Ты пришла любовь'
		},
		{
			pack : 2,
			group : 'Ирина Аллегрова',
			song : 'Странник'
		},
		{
			pack : 2,
			group : 'София Ротару',
			song : 'Хуторянка'
		},
		{
			pack : 2,
			group : 'София Ротару',
			song : 'Каким ты был'
		},
		{
			pack : 2,
			group : 'София Ротару',
			song : 'Ночь любви'
		},
		{
			pack : 2,
			group : 'София Ротару',
			song : 'Нет мне места в твоём сердце'
		},
		{
			pack : 2,
			group : 'София Ротару',
			song : 'Было время'
		},
		{
			pack : 2,
			group : 'Каролина',
			song : 'Дискобар'
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

let ru_2000_gr_1 = [
	{
		id : 1,
		group : 'Hi-Fi',
		song : "А мы любили"
	},
	{
		group : 'Hi-Fi',
		song : "Седьмой лепесток"
	},
	{
		id : 3,
		group : 'Отпетые мошенники',
		song : "Девушки бывают разные"
	},
	{
		id : 4,
		group : 'Отпетые мошенники',
		song : "Граница (ft Леонид Агутин)"
	},
	{
		id : 5,
		group : 'Отпетые мошенники',
		song : "А у реки"
	},
	{
		id : 6,
		group : 'Отпетые мошенники',
		song : "Обратите внимание"
	},
	{
		id : 7,
		group : 'Дискотека Авария',
		song : "Малинки (ft Жанна Фриске)"
	},
	{
		group : 'Дискотека Авария',
		song : "Небо"
	},
	{
		group : 'Бумбокс',
		song : "Вахтерам"
	},
	{
		id : 10,
		group : 'Иванушки International',
		song : "Реви"
	},
	{
		id : 11,
		group : 'Иванушки International',
		song : "Золотые облака"
	},
	{
		group : 'Иванушки International',
		song : "Тополиный пух"
	},
	{
		group : 'Чай вдвоём',
		song : "День рождения"
	},
	{
		id : 14,
		group : 'Чай вдвоём',
		song : "А ты все ждешь"
	},
	{
		group : 'Uma2rman',
		song : "Проститься"
	},
	{
		id : 16,
		group : 'Многоточие',
		song : "Щемит в душе тоска"
	},
	{
		id : 17,
		group : 'Звери',
		song : "Районы-кварталы"
	},
	{
		id : 18,
		group : 'Звери',
		song : "До скорой встречи!"
	},
	{
		group : 'Quest Pistols',
		song : "Белая стрекоза любви"
	},
	{
		id : 20,
		group : 'Корни',
		song : "Вика"
	},
	{
		id : 21,
		group : 'Корни',
		song : "Ты узнаешь её"
	},
	{
		id : 22,
		group : 'Корни',
		song : "Плакала береза"
	},
	{
		id : 23,
		group : 'Другие правила',
		song : "Лети! Беги!"
	},
	{
		id : 24,
		group : 'Дыши',
		song : "Взгляни на небо"
	},
	{
		id : 26,
		group : 'Сценакардия',
		song : "Времена года"
	},
	{
		id : 27,
		group : 'Градусы',
		song : "Режиссер"
	},
	{
		id : 30,
		group : 'Звери',
		song : "Всё, что тебя касается"
	},
	{
		group : 'Корни',
		song : "25 этаж"
	},
	{
		group : 'Hi-Fi',
		song : "Глупые люди"
	},
	{
		group : 'Quest Pistols',
		song : "Я устал"
	},
	{
		group : 'Бумбокс',
		song : "Eva"
	},
	{
		group : 'Дискотека Авария',
		song : "Если хочешь остаться"
	},
	{
		group : 'Дискотека Авария',
		song : "Модный танец Арам Зам Зам"
	},
	{
		group : 'Звери',
		song : "Напитки покрепче"
	},
	{
		group : 'Звери',
		song : "Просто такая сильная любовь"
	},
	{
		group : 'Звери',
		song : "Капканы"
	},
	{
		group : 'Отпетые мошенники',
		song : "Моя звезда (ft ВИА «Сливки»)"
	},
	{
		group : 'Uma2rman',
		song : "Прасковья"
	},
	{
		group : 'Uma2rman',
		song : "Дождь"
	},
	{
		group : 'Uma2rman',
		song : "Ночной дозор"
	},
	{
		group : 'Звери',
		song : "Брюнетки и блондинки"
	},
	{
		group : 'Чай вдвоём',
		song : "Ласковая моя"
	},
	{
		group : 'Бутырка',
		song : "Запахло весной"
	},
	{
		group : 'Бутырка',
		song : "Аттестат"
	},
	{
		group : 'Игра слов',
		song : "Алина Кабаева"
	},
	{
		group : 'Нэнси',
		song : "Ты такая заводная"
	},
	{
		group : 'БиС',
		song : "Кораблики"
	},
	{
		group : 'Банда',
		song : "Плачут небеса"
	},
	{
		group : "5'nizza",
		song : "Солдат"
	},
	{
		group : "Triplex",
		song : "Бригада"
	},
	{
		group : "5ivesta family",
		song : "Я буду (23-45)"
	},
	{
		group : "Revoльvers",
		song : "Ты у меня одна"
	},
	{
		group : "Revoльvers",
		song : "Целуешь меня"
	},
	{
		group : "Каста",
		song : "Ревность"
	},
	{
		group : "Т9",
		song : "Ода нашей любви"
	},
	{
		group : "Бумер",
		song : "Не плачь"
	},
	{
		group : '140 ударов в минуту',
		song : 'Не сходи с ума'
	}
];

let ru_2000_gr_2 = [
	{
		id : 1,
		group : 'Блестящие',
		song : "А я всё летала"
	},
	{
		id : 2,
		group : 'Блестящие',
		song : "За четыре моря"
	},
	{
		id : 3,
		group : 'Виагра',
		song : "Моя попытка номер пять"
	},
	{
		id : 4,
		group : 'Виагра',
		song : "Бриллианты"
	},
	{
		id : 5,
		group : 'Виагра',
		song : "Я не вернусь"
	},
	{
		id : 6,
		group : 'Пропаганда',
		song : "Мелом"
	},
	{
		id : 7,
		group : 'Пропаганда',
		song : "Никто"
	},
	{
		id : 8,
		group : 'Фабрика',
		song : "Про любовь"
	},
	{
		id : 9,
		group : 'Фабрика',
		song : "Не виноватая я"
	},
	{
		id : 10,
		group : 'Серебро',
		song : "Song No.1"
	},
	{
		id : 11,
		group : 'Серебро',
		song : "Дыши (ft Баста)"
	},
	{
		id : 12,
		group : 'Серебро',
		song : "Опиум"
	},
	{
		id : 13,
		group : 'Серебро',
		song : "Скажи, не молчи"
	},
	{
		id : 14,
		group : 'Серебро',
		song : "Сладко"
	},
	{
		id : 15,
		group : 'Пропаганда',
		song : "Холодно"
	},
	{
		id : 16,
		group : 'Пропаганда',
		song : "Кто?"
	},
	{
		id : 17,
		group : 'Пропаганда',
		song : "Пять минут на любовь"
	},
	{
		id : 18,
		group : 'Рефлекс',
		song : "Падали звезды"
	},
	{
		id : 19,
		group : 'Рефлекс',
		song : "Non-stop"
	},
	{
		id : 20,
		group : 'Краски',
		song : "Я люблю тебя, Сергей"
	},
	{
		id : 21,
		group : 'Краски',
		song : "Те, кто любит (ft Андрей Губин)"
	},
	{
		id : 22,
		group : 'Краски',
		song : "Хочешь"
	},
	{
		id : 23,
		group : 'Краски',
		song : "Всего 15 лет"
	},
	{
		id : 24,
		group : 'Краски',
		song : "Фанат"
	},
	{
		id : 25,
		group : 'Краски',
		song : "Мальчик с открытки"
	},
	{
		id : 26,
		group : 'Краски',
		song : "Девочка танцует"
	},
	{
		id : 27,
		group : 'Краски',
		song : "Старший брат"
	},
	{
		id : 28,
		group : 'Краски',
		song : "Оранжевое солнце"
	},
	{
		id : 29,
		group : 'Краски',
		song : "Такси"
	},
	{
		id : 30,
		group : 'Краски',
		song : "Солнце моё"
	},
	{
		id : 31,
		group : 'Краски',
		song : "Весна"
	},
	{
		id : 32,
		group : 'Краски',
		song : "Мне мальчик твой не нужен"
	},
	{
		id : 33,
		group : 'Винтаж',
		song : "Роман"
	},
	{
		id : 34,
		group : 'Винтаж',
		song : "Плохая девочка"
	},
	{
		id : 35,
		group : 'Винтаж',
		song : "Одиночество любви"
	},
	{
		id : 36,
		group : 'Винтаж',
		song : "Ева"
	},
	{
		id : 37,
		group : 'Пропаганда',
		song : "Так и быть"
	},
	{
		id : 38,
		group : 'Пропаганда',
		song : "Дождь по крыше"
	},
	{
		id : 39,
		group : 'Лицей',
		song : "Она не верит больше в любовь"
	},
	{
		id : 40,
		group : 'Лицей',
		song : "Падает дождь"
	},
	{
		id : 41,
		group : 'Лицей',
		song : "Как ты о нем мечтала"
	},
	{
		id : 42,
		group : 'Лицей',
		song : "Планета Пять"
	},
	{
		id : 43,
		group : 'Лицей',
		song : "Ты станешь взрослой"
	},
	{
		group : 'Фабрика',
		song : "Рыбка"
	},
	{
		id : 45,
		group : 'Пропаганда',
		song : "Ай-я"
	},
	{
		id : 46,
		group : 'Пропаганда',
		song : "Супер детка"
	},
	{
		id : 47,
		group : 'Пропаганда',
		song : "Quanto Costa"
	},
	{
		group : 'Фабрика',
		song : "Зажигают огоньки"
	},
	{
		group : 'Блестящие',
		song : "Пальмы парами"
	}
];

let ru_2000_gr_3 = [
	{
		id : 6,
		group : 'Тату',
		song : "Нас не догонят"
	},
	{
		group : 'Тату',
		song : "Я сошла с ума"
	},
	{
		id : 15,
		group : 'Любовные Истории',
		song : "Школа"
	},
	{
		id : 16,
		group : 'Подиум',
		song : "Танцуй, пока молодая"
	},
	{
		id : 17,
		group : 'Тотал',
		song : "Бьет по глазам"
	},
	{
		group : 'Тутси',
		song : "Самый-самый"
	},
	{
		group : 'Город 312',
		song : "Останусь"
	},
	{
		group : 'Город 312',
		song : "Вне зоны доступа"
	},
	{
		group : 'Тату',
		song : "All about us"
	},
	{
		group : 'Fleur',
		song : "Отречение"
	},
	{
		group : 'Горячий шоколад',
		song : "Береги"
	},
	{
		group : 'ВИА «Сливки»',
		song : "Самая лучшая (ft Анжелика Варум)"
	},
	{
		group : 'ВИА «Сливки»',
		song : "Иногда"
	},
	{
		group : 'ВИА «Сливки»',
		song : "Летели недели"
	},
	{
		group : 'Ранетки',
		song : "Ангелы"
	},
	{
		group : 'Ранетки',
		song : "Это все о ней"
	},
	{
		group : 'Гости из будущего',
		song : "Грустные сказки"
	},
	{
		group : 'Гости из будущего',
		song : "Зима в сердце"
	},
	{
		group : 'Гости из будущего',
		song : "Метко"
	},
	{
		group : 'Гости из будущего',
		song : "Почему ты"
	},
	{
		group : 'Чили',
		song : "Лето"
	},
	{
		group : 'Чили',
		song : "Сердце"
	},
	{
		group : 'Вельвет',
		song : "Прости"
	},
	{
		group : 'Инфинити',
		song : "Слезы вода"
	},
	{
		group : "Банд’Эрос",
		song : "Наоми я бы Кэмпбел"
	},
	{
		group : "Банд’Эрос",
		song : "Про красивую жизнь"
	},
	{
		group : "Банд’Эрос",
		song : "Манхэттен"
	},
	{
		group : "Банд’Эрос",
		song : "Адьос"
	},
	{
		group : "Банд’Эрос",
		song : "Синьорита"
	},
	{
		group : "Банд’Эрос",
		song : "Не зарекайся"
	},
	{
		group : "Банд’Эрос",
		song : "Коламбия Пикчерз не представляет"
	},
	{
		group : "Банд’Эрос",
		song : "Полосы"
	},
	{
		group : "Банд’Эрос",
		song : "Не вспоминай"
	},
	{
		group : "Банд’Эрос",
		song : "До весны"
	},
	{
		group : "Банд’Эрос",
		song : "Не под этим солнцем"
	},
	{
		group : "А-Студио",
		song : "Улетаю"
	},
	{
		group : "А-Студио",
		song : "S.O.S."
	},
	{
		group : "А-Студио",
		song : "Две половинки"
	},
	{
		group : "А-Студио",
		song : "Ещё люблю"
	},
	{
		group : "Потап и Настя",
		song : "Непара"
	},
	{
		group : "Потап и Настя",
		song : "Почему молчишь"
	},
	{
		group : "Потап и Настя",
		song : "Новый год"
	}
];

let ru_2000_gr_4 = [
	{
		group : 'Би-2',
		song : "Серебро"
	},
	{
		id : 2,
		group : 'Неприкасаемые',
		song : "Моя бабушка курит трубку"
	},
	{
		id : 3,
		group : 'Ленинград',
		song : "Мне бы в небо"
	},
	{
		id : 4,
		group : 'Земфира',
		song : "До свиданья"
	},
	{
		group : 'Мумий Тролль',
		song : "Невеста"
	},
	{
		group : 'Танцы минус',
		song : "Половинка"
	},
	{
		group : 'Сплин',
		song : "Моё сердце"
	},
	{
		id : 8,
		group : 'Смысловые Галлюцинации',
		song : "Вечно молодой"
	},
	{
		group : 'Чичерина',
		song : "Ту-лу-ла"
	},
	{
		id : 10,
		group : 'Кукрыниксы',
		song : "По раскрашенной душе"
	},
	{
		group : 'Ляпис Трубецкой',
		song : "Сочи"
	},
	{
		id : 12,
		group : 'Пикник',
		song : "Фиолетово-чёрный"
	},
	{
		id : 13,
		group : 'Агата Кристи',
		song : "Секрет"
	},
	{
		group : 'Алиса',
		song : "Веретено"
	},
	{
		id : 15,
		group : 'ДДТ',
		song : "Новое сердце"
	},
	{
		id : 16,
		group : 'Чайф',
		song : "Время не ждёт"
	},
	{
		id : 17,
		group : 'Крематорий',
		song : "Катманду"
	},
	{
		id : 18,
		group : 'Ю-питер',
		song : "Девушка по городу"
	},
	{
		id : 19,
		group : 'Пилот',
		song : "Тюрьма"
	},
	{
		id : 20,
		group : 'Тараканы',
		song : "Я смотрю на них"
	},
	{
		id : 21,
		group : 'Наив',
		song : "Суперзвезда"
	},
	{
		id : 22,
		group : 'Кирпичи',
		song : "Данила Блюз"
	},
	{
		id : 23,
		group : 'Мельница',
		song : "Ночная Кобыла"
	},
	{
		id : 24,
		group : 'Ночные снайперы',
		song : "Катастрофически"
	},
	{
		id : 25,
		group : 'Сурганова и Оркестр',
		song : "Мураками"
	},
	{
		id : 26,
		group : 'Чичерина',
		song : "Жара"
	},
	{
		id : 28,
		group : 'Маша и медведи',
		song : "Земля"
	},
	{
		id : 29,
		group : 'Юта',
		song : "Хмель и солод"
	},
	{
		id : 30,
		group : 'Zdob si Zdub',
		song : "Видели ночь"
	},
	{
		id : 31,
		group : 'Ундервуд',
		song : "Гагарин, я вас любила"
	},
	{
		group : 'МультFильмы',
		song : "Яды"
	},
	{
		id : 33,
		group : '7Б',
		song : "Молодые ветра"
	},
	{
		id : 34,
		group : 'Animal ДжаZ',
		song : "Три полоски"
	},
	{
		id : 35,
		group : 'Воплi вiдоплясова',
		song : "День нароDjення"
	},
	{
		id : 36,
		group : 'Lumen',
		song : "Сид и Нэнси"
	},
	{
		id : 37,
		group : 'Мертвые дельфины',
		song : "На моей луне"
	},
	{
		id : 38,
		group : 'Amatory',
		song : "Дыши со мной"
	},
	{
		id : 39,
		group : 'Слот',
		song : "2 войны"
	},
	{
		id : 40,
		group : 'Catharsis',
		song : "Крылья"
	},
	{
		id : 41,
		group : 'Элизиум',
		song : "Острова"
	},
	{
		group : 'Мумий Тролль',
		song : "Владивосток 2000"
	},
	{
		group : 'Мумий Тролль',
		song : "Такие девчонки"
	},
	{
		group : 'Мумий Тролль',
		song : "Контрабанды"
	},
	{
		group : 'Алиса',
		song : "Пересмотри"
	},
	{
		group : 'Танцы минус',
		song : "Ю"
	},
	{
		group : 'Король и Шут',
		song : "В Париж — домой"
	},
	{
		group : 'Король и Шут',
		song : "MTV"
	},
	{
		group : 'Би-2',
		song : "Варвара"
	},
	{
		group : 'Би-2',
		song : "Полковнику никто не пишет"
	},
	{
		group : 'Би-2',
		song : "Моя любовь"
	},
	{
		group : 'Сплин',
		song : "Весь этот бред"
	},
	{
		group : 'Чайф',
		song : "Нахреноза"
	},
	{
		group : 'Смысловые Галлюцинации',
		song : "Зачем топтать мою любовь"
	},
	{
		group : 'Смысловые Галлюцинации',
		song : "Полюса"
	},
	{
		group : 'МультFильмы',
		song : "За нами следят"
	},
	{
		group : 'МультFильмы',
		song : "Магнитофон"
	},
	{
		group : 'МультFильмы',
		song : "Пистолет"
	},
	{
		group : 'Земфира',
		song : "Хочешь?"
	},
	{
		group : 'Земфира',
		song : "Кто?"
	},
	{
		group : 'Ляпис Трубецкой',
		song : "Капитал"
	},
	{
		group : "Театр Теней",
		song : "Дорога всех ветров"
	},
	{
		group : "Stigmata",
		song : "Сентябрь"
	},
	{
		group : "Океан Эльзы",
		song : "Без бою"
	},
	{
		group : "Ва-Банкъ",
		song : "Украла"
	}
];

let ru_2000_m = [
	{
		group : 'Стас Пьеха',
		song : "Одна звезда"
	},
	{
		group : 'Дима Билан',
		song : "На берегу неба"
	},
	{
		group : 'Валерий Кипелов',
		song : "Я свободен"
	},
	{
		group : 'Иракли',
		song : "Лондон-Париж"
	},
	{
		group : 'Вячеслав Бутусов',
		song : "Девушка по городу"
	},
	{
		group : 'Николай Расторгуев',
		song : "Берёзы (ft Сергей Безруков)"
	},
	{
		group : 'Андрей Губин',
		song : "Такие девушки как звезды"
	},
	{
		group : 'Андрей Губин',
		song : "Танцы"
	},
	{
		group : 'Валерий Меладзе',
		song : "Параллельные"
	},
	{
		group : 'Дима Билан',
		song : "Невозможное возможно"
	},
	{
		group : 'Дима Билан',
		song : "Мулатка"
	},
	{
		group : 'Филипп Киркоров',
		song : "Просто подари"
	},
	{
		group : 'Валерий Леонтьев',
		song : "Августин"
	},
	{
		group : 'Влад Топалов',
		song : "За любовь твою"
	},
	{
		group : 'Александр Маршал',
		song : "Белый пепел"
	},
	{
		group : 'Игорь Корнелюк',
		song : "Город, которого нет"
	},
	{
		group : 'Григорий Лепс',
		song : "Рюмка водки"
	},
	{
		group : 'Григорий Лепс',
		song : "Водопадом"
	},
	{
		group : 'Данко',
		song : "Малыш"
	},
	{
		group : 'Иракли',
		song : "Капли абсента"
	},
	{
		group : 'Игорёк и ЭНДИ',
		song : "Грачи"
	},
	{
		group : 'Александр Буйнов',
		song : "Песня о Настоящей Любви"
	},
	{
		group : 'Стас Пьеха',
		song : "На ладони линия"
	},
	{
		group : 'Сергей Трофимов',
		song : "Город в пробках"
	},
	{
		group : 'Денис Майданов',
		song : "Вечная любовь"
	},
	{
		group : 'Владимир Кузьмин',
		song : "Зачем уходишь ты?"
	},
	{
		group : 'Шура',
		song : "Осень пришла"
	},
	{
		group : 'Леонид Агутин',
		song : "Граница (ft Отпетые мошенники)"
	},
	{
		group : 'Леонид Агутин',
		song : "Аэропорты (ft Владимир Пресняков)"
	},
	{
		group : 'Аркадиас',
		song : "Художник"
	},
	{
		group : 'Абдулла',
		song : "Губки не целованы"
	},
	{
		group : 'Mr Credo',
		song : "Чудная долина"
	},
	{
		group : 'Эд Шульжевский',
		song : "My Baby"
	},
	{
		group : 'Андрей Алексин',
		song : "Страшная"
	},
	{
		group : 'Тимати',
		song : "Не сходи с ума"
	},
	{
		group : 'DJ SMASH',
		song : "Moscow Never Sleeps"
	},
	{
		group : 'DJ Дождик',
		song : "Почему же"
	},
	{
		group : 'Noise MC',
		song : "За Закрытой Дверью"
	},
	{
		group : 'Серёга',
		song : "Черный бумер"
	},
	{
		group : 'Серёга',
		song : "Возле дома твоего"
	},
	{
		group : 'Серёга',
		song : "Кружим по району"
	},
	{
		group : 'Лигалайз',
		song : "Ностальгия (ft Lg)"
	},
	{
		group : 'Лигалайз',
		song : "Джаная (ft Dato)"
	},
	{
		group : 'Лигалайз',
		song : "Я Хочу Быть С Тобой (ft Бархат)"
	},
	{
		group : 'Лигалайз',
		song : "Моя Москва"
	},
	{
		group : 'Юрий Шатунов',
		song : "Забудь"
	},
	{
		group : 'Баста',
		song : "Моя игра"
	},
	{
		group : 'Юрий Титов',
		song : "Понарошку"
	},
	{
		group : 'Сергей Зверев',
		song : "Алла"
	},
	{
		group : 'Джанго',
		song : "Холодная весна"
	},
	{
		group : 'Никита',
		song : "Верёвки"
	},
	{
		group : 'Айдамир Мугу',
		song : "Чёрные Глаза"
	},
	{
		group : 'Паскаль',
		song : "Шёлковое Сердце"
	},
	{
		group : 'Дмитрий Колдун',
		song : "Я для тебя"
	},
	{
		group : 'Дмитрий Колдун',
		song : "Звезда"
	},
	{
		group : 'Дмитрий Колдун',
		song : "Настройся на меня"
	}
];

let ru_2000_f_1 = [
	{
		group : 'Надежда Кадышева',
		song : "Широка река (ft. Антон Зацепин)"
	},
	{
		group : 'Кристина Орбакайте',
		song : "Губки бантиком"
	},
	{
		group : 'Ирина Дубцова',
		song : "О нём"
	},
	{
		group : 'Верка Сердючка',
		song : "Жениха хотела (ft. Глюк'oZa)"
	},
	{
		group : 'Мика Ньютон',
		song : "Белые лошади"
	},
	{
		group : 'Жанна Фриске',
		song : "Малинки (ft Дискотека Авария)"
	},
	{
		group : 'Жанна Фриске',
		song : "Ла-ла-ла"
	},
	{
		group : 'Жанна Фриске',
		song : "А на море белый песок"
	},
	{
		group : 'Жанна Фриске',
		song : "Я была"
	},
	{
		group : 'Жасмин',
		song : "Головоломка"
	},
	{
		group : 'Жасмин',
		song : "Дольче вита"
	},
	{
		group : 'Мара',
		song : "Холодным мужчинам"
	},
	{
		group : 'Блондинка Ксю',
		song : "Вместо жизни"
	},
	{
		group : 'Вика Дайнеко',
		song : "Я просто сразу от тебя уйду"
	},
	{
		group : 'Вика Дайнеко',
		song : "Лейла"
	},
	{
		group : 'Вика Дайнеко',
		song : "Клякса"
	},
	{
		group : 'Катя Лель',
		song : "Мой мармеладный"
	},
	{
		group : 'Катя Лель',
		song : "Долетай"
	},
	{
		group : 'Катя Лель',
		song : "Муси-пуси"
	},
	{
		group : 'Слава',
		song : "Попутчица"
	},
	{
		group : 'Юлия Савичева',
		song : "Если в сердце живет любовь"
	},
	{
		group : 'Юлия Савичева',
		song : "Привет"
	},
	{
		group : 'Нюша',
		song : "Вою на луну"
	},
	{
		group : 'Ирина Дубцова',
		song : "Как ты там"
	},
	{
		group : 'Ани Лорак',
		song : "Солнце"
	},
	{
		group : 'Юлианна Караулова',
		song : "Я попала в сети"
	},
	{
		group : 'Юлианна Караулова',
		song : "Я кину джокер на стол"
	},
	{
		group : 'Настя Задорожная',
		song : "Буду"
	},
	{
		group : 'Елена Терлеева',
		song : "Солнце"
	},
	{
		group : 'Татьяна Буланова',
		song : "Мой сон (ft DJ Цветкоff)"
	},
	{
		group : 'Кристина Орбакайте',
		song : "Перелётная птица"
	},
	{
		group : 'Кристина Орбакайте',
		song : "Просто любить тебя (ft Авраам Руссо)"
	},
	{
		group : 'Кристина Орбакайте',
		song : "Да-ди-дам"
	},
	{
		group : 'Кристина Орбакайте',
		song : "Свет твоей любви"
	},
	{
		group : 'Ирина Тонева',
		song : "Понимаешь (ft Павел Артемьев)"
	},
	{
		group : 'Зара',
		song : "Недолюбила"
	},
	{
		group : 'Евгения Отрадная',
		song : "Зачем Любовь"
	},
	{
		group : 'Евгения Отрадная',
		song : "Уходи и дверь закрой"
	},
	{
		group : 'Алла Пугачёва',
		song : "Опять Метель"
	},
	{
		group : 'Елена Ваенга',
		song : "Курю"
	},
	{
		group : 'Лариса Черникова',
		song : "Тебя я ждала"
	},
	{
		group : 'Дайкири',
		song : "Любишь - таешь"
	},
	{
		group : 'Наталья Ветлицкая',
		song : "Изучай Меня"
	},
	{
		group : 'Наталья Ветлицкая',
		song : "Половинки"
	},
	{
		group : 'Анжелика Варум',
		song : "Не жди меня"
	},
	{
		group : 'Анжелика Варум',
		song : "Стоп, любопытство"
	},
	{
		group : 'Алена Иванцова',
		song : "Все пройдет"
	},
	{
		group : 'Катя Чехова',
		song : "Я — робот"
	},
	{
		group : 'МакSим',
		song : "Сон"
	},
	{
		group : 'МакSим',
		song : "Знаешь ли ты"
	},
	{
		group : 'МакSим',
		song : "Небо засыпай (ft Лигалайз)"
	},
	{
		group : 'Акула',
		song : "Мало"
	},
	{
		group : 'Акула',
		song : "Кислотный DJ"
	},
	{
		group : 'Света',
		song : "Твои глаза"
	},
	{
		group : 'Полина Гагарина',
		song : "Колыбельная"
	},
	{
		group : 'Полина Гагарина',
		song : "Кому, зачем? (ft Ирина Дубцова)"
	},
	{
		group : 'Полина Гагарина',
		song : "Любовь под солнцем"
	},
	{
		group : 'Полина Гагарина',
		song : "Я тебя не прощу никогда"
	},
	{
		group : 'Полина Гагарина',
		song : "Я твоя"
	},
	{
		group : 'Анна Семенович',
		song : "На моря (ft Arash)"
	},
	{
		group : 'Бьянка',
		song : "Про лето"
	},
	{
		group : 'Бьянка',
		song : "Несчастливая любовь"
	},
	{
		group : 'Бьянка',
		song : "Были танцы"
	},
	{
		group : 'Лера Массква',
		song : "7 этаж"
	},
	{
		group : 'Мария Ржевская',
		song : "Когда я стану кошкой"
	},
	{
		group : 'Линда',
		song : "Цепи и кольца"
	},
	{
		group : 'Мара',
		song : "Самолеты"
	},
	{
		group : 'Мара',
		song : "Дельфины"
	},
	{
		group : 'Мара',
		song : "Целуя сердце"
	},
	{
		group : "Глюк'oZa",
		song : "Танцуй, Россия!!!"
	},
	{
		group : "Глюк'oZa",
		song : "Снег идёт"
	},
	{
		group : "Глюк'oZa",
		song : "Невеста"
	}
];

let ru_2000_f_2 = [
	{
		group : 'Саша',
		song : "Не получилось, не срослось"
	},
	{
		group : 'Саша',
		song : "За туманом"
	},
	{
		group : 'Саша Project',
		song : "Говорила мама"
	},
	{
		group : 'Саша Project',
		song : "Очень Нужен Ты"
	},
	{
		group : 'Алекса',
		song : "Где же ты"
	},
	{
		group : 'Алекса',
		song : "Лунная Тропа"
	},
	{
		group : 'Алекса',
		song : "Я живу тобой"
	},
	{
		group : 'Алекса',
		song : "Когда ты рядом (ft Тимати)"
	},
	{
		group : 'Рита Дакота',
		song : "Спички"
	},
	{
		group : 'Ангина',
		song : "Болела"
	},
	{
		group : 'Ангина',
		song : "Кому какое дело"
	},
	{
		group : 'Алёна Свиридова',
		song : '17 лет'
	},
	{
		group : 'Алёна Свиридова',
		song : 'Самба прошедшей любви'
	},
	{
		group : 'Алёна Свиридова',
		song : 'Шу-би-ду'
	},
	{
		group : 'Алёна Свиридова',
		song : 'Не дам скучать'
	},
	{
		group : 'Наталья Подольская',
		song : 'Nobody Hurt No One'
	},
	{
		group : 'Наталья Подольская',
		song : 'Поздно'
	},
	{
		group : 'Наталья Подольская',
		song : 'Одна'
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
		group : 'ЧайФ',
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
	en_1990_m_1, en_1990_m_2, en_1990_f_1, en_1990_f_2,
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
let songs_names_en_1990 = ['1990 Группы (Металл)', '1990 Группы (Рок)', '1990 Группы (INXS)', 
	'1990 Группы (Эльдорадио)', '1990 Группы (Европа Плюс)', '1990 Группы (Евродэнс)',
	'1990 Исполнители (Tom Petty+)', '1990 Исполнители (Robbie Williams+)',
	'1990 Исполнительницы (Donna Lewis+)', '1990 Исполнительницы (Gala+)'];
	
let songs_en_2000 = [en_2000_gr_1, en_2000_gr_2, en_2000_gr_3, en_2000_gr_4, en_2000_gr_5, en_2000_m_1, en_2000_m_2, en_2000_m_3, en_2000_f_1, en_2000_f_2, en_2000_f_3];
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
	'1990 Исполнители (Русская эстрада 1)', '1990 Исполнители (Русская эстрада 2)', '1990 Исполнители (Русская эстрада 3)',
	'1990 Исполнительницы (Русская эстрада 1)', '1990 Исполнительницы (Русская эстрада 2)'];
	
let songs_ru_2000 =	[ru_2000_gr_1, ru_2000_gr_2, ru_2000_gr_3, ru_2000_gr_4, ru_2000_m, ru_2000_f_1, ru_2000_f_2];
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

let artists_num;
let songs_num;
function wheel(){
	$('#ru').hide();
	$('#en').hide();
	$('#mirror').hide();
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
	$('#wheel').hide();
	$('#ru').hide();
	$('#en').hide();
	$('.settings').hide();
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
	$('#wheel').hide();
	$('#ru').hide();
	$('#en').hide();
	$('.settings').hide();
	if(!alphabetMode){
		$('.ru').show();
	} else {
		$('.ru_alphabet').show();
	}
	count_time();
}

function group(){
	back = back_to_year;
	artist_type = 'gr';
	package_names = gr_package_names;
	check_package_num(gr_packages);
}

function female(){
	back = back_to_year;
	artist_type = 'f';
	package_names = f_package_names;
	check_package_num(f_packages);
}

function male(){
	back = back_to_year;
	artist_type = 'm';
	package_names = m_package_names;
	check_package_num(m_packages);
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

let gr_package_names = ['', '', '', '', ''];
let m_package_names = ['', '', '', '', ''];
let f_package_names = ['', '', '', '', ''];
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
	back = back_to_packages;
	$('.package').hide();
	if(year == '1990'){
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
		
function mode(num){
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
		gr_packages = 6;	
		gr_package_names[0] = 'pop_1';
		gr_package_names[1] = 'pop_2';
		gr_package_names[2] = 'pop_3';
		gr_package_names[3] = 'disco';
		gr_package_names[4] = 'pop_rock';
		gr_package_names[5] = 'rock';
		m_packages = 3;
		m_package_names[0] = 'pop';
		m_package_names[1] = 'disco';
		m_package_names[2] = 'rock';
		f_packages = 2;
		f_package_names[0] = 'pop';
		f_package_names[1] = 'disco';
		$('.artist').show();
	}
	// 1990
	if(num == 0){
		year = '1990';
		m_packages = 3;
		m_package_names[0] = 'tom_petty';
		m_package_names[1] = 'shaggy';
		m_package_names[2] = 'eurodance';
		gr_packages = 6;
		gr_package_names[0] = 'aerosmith';
		gr_package_names[1] = 'rem';
		gr_package_names[2] = 'inxs';
		gr_package_names[3] = 'extreme';
		gr_package_names[4] = 'blur';
		gr_package_names[5] = 'eurodance';
		f_packages = 2;
		f_package_names[0] = 'few';
		f_package_names[1] = 'many';
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
		gr_packages = 5;
		gr_package_names[0] = 'green_day';
		gr_package_names[1] = 'u2';
		gr_package_names[2] = 'kasabian';
		gr_package_names[3] = 'black_eyed_peas';
		gr_package_names[4] = 'mgmt';
		m_packages = 3;
		m_package_names[0] = 'pop';
		m_package_names[1] = 'dj';
		m_package_names[2] = 'rap';
		f_packages = 3;
		f_package_names[0] = 'katy_perry';
		f_package_names[1] = 'leona_lewis';
		f_package_names[2] = 'rnb';
		if(!alphabetMode){
			$('.artist').show();
		}
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
		gr_packages = 4;	
		gr_package_names[0] = 'ru_pop';
		gr_package_names[1] = 'ru_via';
		gr_package_names[2] = 'ru_rock_1';
		gr_package_names[3] = 'ru_rock_2';
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
		m_packages = 3;
		m_package_names[0] = 'easy';
		m_package_names[1] = 'medium';
		m_package_names[2] = 'hard';
		f_packages = 3;
		f_package_names[0] = 'easy';
		f_package_names[1] = 'medium';
		f_package_names[2] = 'hard';
		gr_packages = 4;
		gr_package_names[0] = 'ru_pop_1';
		gr_package_names[1] = 'ru_pop_2';
		gr_package_names[2] = 'ru_rock_1';
		gr_package_names[3] = 'ru_rock_2';
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
		gr_packages = 4;
		gr_package_names[0] = 'quest_pistols';
		gr_package_names[1] = 'vintazh';
		gr_package_names[2] = 'infinity';
		gr_package_names[3] = 'ru_rock';
		f_packages = 2;
		$('#song').hide();
		if(!alphabetMode){
			$('.artist').show();
		}
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
	if(num == 22){
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