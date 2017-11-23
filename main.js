//Model
let CardModel = function (data) {
		this._value = data.value,
		this._view = "card",
		this._img = data.img
	}, 

	temporaryData = {
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
	    	this.userName = document.getElementById("user").value + '';	
		}
	},

	menu = {
		container: document.getElementById('container'),
		pauseBtn: document.getElementById('pause'),
		continueBtn: document.getElementById('continue'),
		chooseUser: document.getElementById('submit'),
		area: document.getElementById('selectAreaSize'),
		showScore: document.getElementById('scores'),
		getStorage: function () {
			return JSON.parse(localStorage.getItem('pair'))
		},
		setStorage: function (obj) {
			localStorage.setItem('pair', JSON.stringify(obj))
		}
	},

	timer = {
		start: function () {
			let time = this.getTime();
			menu.container.style.display = '';
			menu.pauseBtn.style.display = '';
			menu.continueBtn.style.display = 'none';
			
			this.interval = setInterval(function () {
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
			clearInterval(this.interval);
			menu.pauseBtn.style.display = 'none';
			menu.continueBtn.style.display = '';
			menu.container.style.display = 'none';
		},

		stop: function () {
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
	};

//Controller
let controller = {
	init: function() {
		menu.chooseUser.onclick=function () {
			game.getUsername();
			timer.stop();
	    	timer.start();
		}
		menu.continueBtn.onclick = this.continueGame;
		menu.pauseBtn.onclick = this.pauseGame;
		menu.showScore.onclick = this.userScores;
		
        cardView.init();
    },

    changeArea: function () {
		menu.area.onchange=function () {
	    		cardView.init();
	    		timer.stop();
	    		timer.start();	
		};
	},

	pauseGame: function () {
		timer.pause();
	},

	continueGame: function () {
		timer.start();
	},

    finishGame: function () {
    	let t = timer.getTime();
    	game.time = `${t.h.innerHTML}:${t.m.innerHTML}:${t.s.innerHTML}`;
    	
    	game.score = Math.floor(temporaryData.areaSize * 10 +
    		(temporaryData.areaSize * 100 - 
    		(temporaryData.wrongAttempt - temporaryData.areaSize/2)) *
    		temporaryData.areaSize * 100/
    		(+t.h.innerHTML + +t.m.innerHTML * 60 + +t.s.innerHTML * 3600));

		let	newStorage = ({[game.userName + '']: [{date: new Date(), score: game.score}]});
		console.log(newStorage)
		let storage = menu.getStorage();//{user: [{},{},{}], user2: [{},{},{}]}
		console.log(storage)
		if(storage === null) {
			storage = newStorage;
			
		}else if(storage !== null && storage[game.userName + ''] === undefined){
			console.log('1', storage, storage[game.userName + ''], game.userName)
			storage[game.userName] = newStorage[game.userName + '']
			// storage[game.userName] = newStorage
			// console.log(storage.game.userName)
		}else{
			// for (key in storage) {
			// 	// statement
			// }
			console.log('2', game.userName, storage[game.userName + ''].length, newStorage[game.userName + ''][0])
			// storage !== null && storage[game.userName] !== undefined
			storage[game.userName][storage[game.userName + ''].length] = newStorage[game.userName + ''][0]
			console.log('3', storage)
		}
		menu.setStorage(storage); 

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
	},

	userScores: function () {
		let storage = menu.getStorage();
		console.log(storage)
	}
}

//View
let cardView = {
	init: function() {
		let cardsInstances = [];
		temporaryData.areaSize = menu.area
			.options[menu.area
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
		menu.continueBtn.style.display = 'none';
		let cardsArea = menu.container;

		while (container.firstChild) {
    		cardsArea.removeChild(container.firstChild);
		}

		temporaryData.cards.sort(this.shuffle);
		// timer.stop();
		
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