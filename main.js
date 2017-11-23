//Model
let temporaryData = {
	resultsArray: [],
	cards: [],
	areaSize: 0,
	wrongAttempt: 0,
	rightAttempt: 0,
	},

	game = {
		userName: 'Deer',
		time: 0,
		score: 100000,
		getUsername: function () {
	    	this.userName = document.getElementById("user").value;	
		}
	},

	timer = {
		// seconds: 0,
		// minutes: 0,
		// hours: 0,
		start: function () {
			// this.getTime();
			let time = this.getTime();
			this.interval = setInterval(function () {
				// this.getTime();
				// console.log(timer)
				
				// let s = document.getElementById("seconds"),
				// 	m = document.getElementById("minutes"),
				// 	h = document.getElementById("hours");
			  	if(+time.s.innerHTML < 59 && +time.m.innerHTML !== 59) {
			  		time.s.innerHTML = time.s.innerHTML++ < 9 
			  			? ('0' + time.s.innerHTML++) : time.s.innerHTML++;
			  	}else if (+time.s.innerHTML < 59 && +time.m.innerHTML < 59){
			  		time.s.innerHTML = '00';
			  		time.m.innerHTML = '00';
			  		time.h.innerHTML = time.h.innerHTML++ < 9
			  			? ('0' + time.h.innerHTML++) : time.h.innerHTML++;
			  	}else{
			  		time.m.innerHTML = time.m.innerHTML++ < 9
			  			? ('0' + time.m.innerHTML++) : time.m.innerHTML++;
			  		time.s.innerHTML = '00';
			  	}
			}, 1000)


		},
		pause: function function_name() {
			// this.seconds = +document.getElementById("seconds").innerHTML; 
			// this.minutes = +document.getElementById("minutes").innerHTML;
			// this.hours = +document.getElementById("hours").innerHTML;
			
			console.log(timer)
			clearInterval(this.interval);
		}, 
		stop: function () {
			// console.log(timer)
			// this.seconds = this.minutes = this.hours = 0; 
			// console.log(timer)
			this.setTime(0, 0, 0);
			clearInterval(this.interval);
			temporaryData.wrongAttempt = 0;
		},
		getTime: function () {
			let time = {
				s: document.getElementById("seconds"), 
				m: document.getElementById("minutes"),
				h: document.getElementById("hours")
			}
			return time;	
		},
		setTime: function (s, m, h) {
			document.getElementById("seconds").innerHTML = 
				s < 9 ? ('0' + s) : s;
			document.getElementById("minutes").innerHTML = 
				m < 9 ? ('0' + m) : m;
			document.getElementById("hours").innerHTML = 
				h < 9 ? ('0' + h) : h;	
		}
		// getTime: function () {
		// 	this.seconds = +document.getElementById("seconds").innerHTML,
		// 	this.minutes = +document.getElementById("minutes").innerHTML,
		// 	this.hours = +document.getElementById("hours").innerHTML;
		// 	// return;
		// }
	}


let CardModel = function (data) {
	this._value = data.value,
	this._view = "card",
	this._img = data.img
};




//Controller

let controller = {
	changeArea: function () {
		document.getElementById('selectAreaSize')
			.onchange=function (event) {
	    		cardView.init();	
		};
	},

	init: function() {
		document.getElementById('submit')
		.onclick=function (event) {
			game.getUsername();
		}
		
        cardView.init();
    },
    finishGame: function () {
    	let t = timer.getTime();
    	game.time = `${t.h.innerHTML}:${t.m.innerHTML}:${t.s.innerHTML}`;
    	
    	game.score = Math.floor(temporaryData.areaSize * 10 +
    		(temporaryData.areaSize * 100 - 
    		(temporaryData.wrongAttempt - temporaryData.areaSize/2)) *
    		temporaryData.areaSize * 100/
    		(+t.h.innerHTML + +t.m.innerHTML * 60 + +t.s.innerHTML * 3600));

		let storage = JSON.parse(localStorage.getItem(game.userName));????????????
		console.log(storage);
		let	newStorage = JSON.stringify(storage.push({date: new Date(), score: game.score}));
		// let arr = [].push(newStorage)
			
			localStorage.setItem(game.userName, newStorage)
			console.log(newStorage);
	    console.log(
	    	`${game.userName}, you win, 
	    	your time: ${game.time},
	    	your score: ${game.score}`
	    	);
	    timer.stop();
	    temporaryData.rightAttempt = temporaryData.wrongAttempt = 0;
	},

	checkPair: function(className) {
  
		let x = document.getElementsByClassName("flipped");
		setTimeout(function() {

			for(let i = 1; i >= 0; i--) {
			  	x[0].className = className;
			}
		},600);
	}
	
}
//View

let cardView = {
	init: function() {
		let cardsInstances = [];

		temporaryData.areaSize = document.getElementById('selectAreaSize')
			.options[document.getElementById('selectAreaSize')
			.options.selectedIndex].value;
		controller.changeArea();
		
	    for (let i = 1; i <= temporaryData.areaSize/2; i++) {
			let instance = new CardModel({
				value: i <= 50 ? i : i - 50, 
				img: `./img/heroes/${i <= 50 ? i : i - 50}.jpg`
			});

			cardsInstances.push(instance);
		};

		temporaryData.cards = cardsInstances.concat(cardsInstances);

	    cardView.render();
	    
	},

	render: function () {
		let cardsArea = document.getElementById('container');

		while (container.firstChild) {
    		cardsArea.removeChild(container.firstChild);
		}

		temporaryData.cards.sort(this.shuffle);
		timer.stop();
		timer.start();
		for (let i = 0; i < temporaryData.cards.length; i++) {
			let card = document.createElement('div');
			card.dataset.value = temporaryData.cards[i]._value;
			card.dataset.view = temporaryData.cards[i]._view;
			card.style.background = `url('./${temporaryData.cards[i]._img}') 
				center center no-repeat #fff`;
			cardsArea.appendChild(card);

			card.onclick = this.flip;
			
		}
	},

	flip: function (e) {
		let x = document.getElementsByClassName("flipped");	
			if (x.length < 2 && e.target.className != 'flipped' 
				&& e.target.className != 'correct'){

				e.target.className = 'flipped';
				let result = e.target.dataset.value;

				if (temporaryData.resultsArray.length < 2){
					temporaryData.resultsArray.push(result);

				}

				// clearInterval(Interval);
				// Interval = setInterval(startTimer, 10);
			}

			if (temporaryData.resultsArray.length === 2) {

				if (temporaryData.resultsArray[0] === temporaryData.resultsArray[1]) {
					controller.checkPair("correct");
					temporaryData.resultsArray = [];
					temporaryData.rightAttempt++;

					if(temporaryData.rightAttempt === temporaryData.areaSize/2) {
						controller.finishGame();
					}
				} else {
					controller.checkPair("reverse");
					temporaryData.resultsArray = [];
					temporaryData.wrongAttempt++;
				}
			}
			if(x.length === 2) {
				return;
			}
		},

 	shuffle: function(a, b) {
		return Math.random() - 0.5;
	}

	// setUserName: function () {
		
	// }

	

	// console.log(data.cards);
	// render()
	// 		subscribe to model changes
	// cardInstance.addSubscriber( render );
	// photoEl.addEventListener( "click", function () {
	// 	//controller do some work
	// 	cardController.handleEvent( "click", photoModel );
	// });

};
// cardView()

		
		


controller.init();

	//    var CardController = function () {
	//     this.handleEvent = function(){
	//         //do something important
	//         //e.g. update model
	//     }
	//     this.init = function () {
	//         var cardInstance = new PhotoModel({
	//             name: 'myPhoto',
	//             date: 'today',
	//             url: 'http://example.com/mPhoto.jpg'
	//         });
	//         var photoViewInstance = new cardView(cardInstance, this);
	//     }
	//     return this;
	// };