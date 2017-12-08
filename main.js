;(function (argument) {
	"use strict";

	//Model
	let CardModel = function (data) {
			this._value = data.value,
			this._view = "card",
			this._img = data.img
		}, 

		Results = function (data) {
			this.user = data.user,
			this.score = data.score,
			this.date = (new Date(data.date)).toLocaleString('en-GB'),
			this.cell = function () {
				return `
					<tr class="table__row">
						<td class="table__cell">${this.user}</td>
						<td class="table__cell">${this.score}</td>
						<td class="table__cell">${this.date}</td>
					</tr class="table__row">
				`
			}
		},

		ResultTabCreate = function (rows) {
			this.rows = rows,
			this.tabCreate = function (rows) {
				return `
					<table class="table table--theme-${menu.theme
						.options[menu.theme.options.selectedIndex].value}">
						<tbody>
							${this.rows}
						</tbody>
					</table>
				`
			}
		},

		temporaryData = {
			resultsArray: [],
			cards: [],
			areaSize: 0,
			wrongAttempt: 0,
			rightAttempt: 0,
			pageResults: {},
			cardSize: {
				36: 's',
				64: 'm',
				100: 'l',
				144: 'xl',
			}
		},

		game = {
			userName: 'Deer',
			time: 0,
			score: 0,
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
			theme: document.getElementById('selectTheme'),
			showScore: document.getElementById('scores'),
			getStorage: function () {
				return JSON.parse(localStorage.getItem('pair'))
			},
			setStorage: function (obj) {
				localStorage.setItem('pair', JSON.stringify(obj))
			}
		},

		popUp = {
			content: function (data, fun) {
				let popUpContainer = document.createElement('div'),
					popUpContant = document.createElement('div'),
					button = document.createElement('div');
					button.innerHTML = 'Ok';
					button.classList.add('button', 
						'popup__button',
						 `popup__button--theme-${menu.theme
						.options[menu.theme.options.selectedIndex].value}`);
					popUpContainer.id = 'cover';
					popUpContainer.classList.add('cover-layer', 
						`cover-layer--theme-${menu.theme
						.options[menu.theme.options.selectedIndex].value}`);
					popUpContant.classList.add('popup', `popup--theme-${menu.theme
						.options[menu.theme.options.selectedIndex].value}`);
					popUpContainer.appendChild(popUpContant);
					
					popUpContant.appendChild(data);
					popUpContant.appendChild(button);
				
				setTimeout(function () {
					document.body.appendChild(popUpContainer);
				}, 700);

				button.onclick = function () {
					document.getElementById('cover').remove();
					fun();
				}
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
					}else if(+time.s.innerHTML < 59 && +time.m.innerHTML > 59) {
						time.s.innerHTML = time.s.innerHTML++ < 9 
							? ('0' + time.s.innerHTML++) : time.s.innerHTML++;
					}else if(+time.m.innerHTML === 59){
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
			menu.continueBtn.onclick = this.continueGame;
			menu.pauseBtn.onclick = this.pauseGame;
			menu.showScore.onclick = this.userScores;
			
			cardView.init();
		},

		changeUser: function () {
			menu.chooseUser.onclick=function () {
				timer.stop();

				cardView.init();
			}
		},

		changeArea: function () {
			menu.area.onchange=function () {
				timer.stop();

				cardView.init();
			}
		},

		changeTheme: function () {
			menu.theme.onchange=function (e) {
				let arr = document.querySelectorAll(`[class*="--theme-"]`),
					themeName = menu.theme.options[menu.theme
						.options.selectedIndex].value;
					for (let i = 0; i < arr.length; i++) {
						arr[i].className = (arr[i].className)
							.replace(/--theme-\w+/g, `--theme-${themeName}`);
					}
				
			}
		},

		pauseGame: function () {
			timer.pause();
		},

		continueGame: function () {
			timer.start();
		},

		finishGame: function () {
			let t = timer.getTime(),
				newStorage,
			 	storage = menu.getStorage(),
			 	data = document.createElement('div');

			data.className = 'content-block' 	
			game.time = `${t.h.innerHTML}:${t.m.innerHTML}:${t.s.innerHTML}`;
			game.score = Math.floor(temporaryData.areaSize * 10 +
				(temporaryData.areaSize * 100 - 
				(temporaryData.wrongAttempt - temporaryData.areaSize/2)) *
				temporaryData.areaSize * 100/
				(+t.h.innerHTML + +t.m.innerHTML * 60 + +t.s.innerHTML * 3600));
			newStorage = ({[temporaryData.areaSize + '']: [{
				user: game.userName, 
				date: new Date(), 
				score: game.score}
			]});

			if(storage === null) {
				storage = newStorage;	
			}else if(storage !== null 
				&& storage[temporaryData.areaSize] 
					=== undefined){
					storage[temporaryData.areaSize] 
					= newStorage[temporaryData.areaSize]
			}else{
				storage[temporaryData.areaSize][storage[temporaryData
				.areaSize].length] = newStorage[temporaryData.areaSize][0]
			}

			menu.setStorage(storage); 
			timer.stop();

			data.innerHTML = `<h2 class="content-block__header">${game.userName}, you win</h2> 
				<p class="text content-block__text">Your time: ${game.time}</p>
				<p class="text content-block__text">Your score: ${game.score}</p>`
			popUp.content(data, function () {controller.init()});
			temporaryData.rightAttempt = temporaryData.wrongAttempt = 0;
		},

		checkPair: function(className) {
			let x = document.getElementsByClassName('container__card--flipped');
			setTimeout(function() {

				for(let i = 1; i >= 0; i--) {
					x[i].classList.add(className);
					x[i].classList.remove('container__card--flipped');
				}
			},600);
		},

		userScores: function () {
			let storage = menu.getStorage(),
				tab = {};
			for (let key in storage) {
				let tabName = `${Math.sqrt(+key)}x${Math.sqrt(+key)}`,
					arr = (storage[key].sort((a, b) => b.score - a.score)).slice(0, 9),
					rows = `<td class="table__cell
									table__cell--head">User</td>
								<td class="table__cell
									table__cell--head">Score</td>
								<td class="table__cell
									table__cell--head">Date</td>`;

				for (let i = 0; i < arr.length; i++) {
					rows = rows.concat((new Results(arr[i])).cell());
				}

				tab[tabName] = (new ResultTabCreate(rows))
					.tabCreate(tabName, rows);
				temporaryData.pageResults = tab;
			}

			cardView.pagesRender();
		},
		chooseTab: function (event) {
			let resultsContainer = document.getElementById('results'),
				tabsContainer = document.getElementById('tabs');

			for (let i = 0; i < tabsContainer.children.length; i++) {
				tabsContainer.children[i].className = 'tab-container__item';
			}

			event.target.classList.add('tab-container__item--active');
			resultsContainer.innerHTML = temporaryData
				.pageResults[tabsContainer
				.getElementsByClassName('tab-container__item--active')[0]
				.innerHTML];
		}
	}

	//View
	let cardView = {
		init: function() {
			let cardsInstances = [];
			temporaryData.areaSize = menu.area
				.options[menu.area.options.selectedIndex].value;
			controller.changeTheme();
			controller.changeArea();
			controller.changeUser();
			
			for (let i = 1; i <= temporaryData.areaSize/2; i++) {
				let instance = new CardModel({
					value: i <= 50 ? i : i - 50, 
					img: `./img/heroes/${i <= 50 ? i : i - 50}.jpg`
				});

				cardsInstances.push(instance);
			};

			temporaryData.cards = cardsInstances
				.concat(cardsInstances);

			cardView.render();
		},

		render: function () {
			menu.continueBtn.style.display = 'none';
			let cardsArea = menu.container;

			while (container.firstChild) {
				cardsArea.removeChild(container.firstChild);
			}

			temporaryData.cards.sort(this.shuffle);
			timer.start();

			for (let i = 0; i < temporaryData.cards.length; i++) {
				let card = document.createElement('div');
				card.dataset.value = temporaryData.cards[i]._value;
				card.dataset.view = temporaryData.cards[i]._view;
				card.classList.add(
					'container__card',
					`container__card--theme-${menu.theme
						.options[menu.theme.options.selectedIndex].value}`, 
					`container__card--${temporaryData
						.cardSize[temporaryData.areaSize]}-size`)
				card.style.background = `
					url('./${temporaryData.cards[i]._img}') 
					center center no-repeat #fff
					`;
				card.style.backgroundSize = 'cover';
				cardsArea.appendChild(card);

				card.onclick = this.flip;
			}
		},

		flip: function (e) {
			let x = document.getElementsByClassName('container__card--flipped');

				if (x.length < 2 && (e.target.className)
					.indexOf('container__card--flipped') === -1 
					&& (e.target.className)
					.indexOf('container__card--correct') === -1){

					e.target.classList.add('container__card--flipped');
					let result = e.target.dataset.value;

					if (temporaryData.resultsArray.length < 2){
						temporaryData.resultsArray.push(result);

					}
				}

				if (temporaryData.resultsArray.length === 2) {

					if (temporaryData.resultsArray[0] 
						=== temporaryData.resultsArray[1]) {
						controller.checkPair('container__card--correct');
						temporaryData.resultsArray = [];
						temporaryData.rightAttempt++;

						if(temporaryData.rightAttempt 
							=== temporaryData.areaSize/2) {
								controller.finishGame();
						}

					} else {
						controller.checkPair('container__card--reverse');
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
		},

		pagesRender: function () {
			let data = document.createElement('div'),
				tabs = document.createElement('div'),
				results = document.createElement('div');
				tabs.id = 'tabs';
				results.id = 'results';
				
				timer.pause();
			for (let k in temporaryData.pageResults) {
				tabs.innerHTML = (tabs.innerHTML)
					.concat(`<div class="tab-container__item">${k}</div>`);
				tabs.classList.add('tab-container');
			}

			data.appendChild(tabs);
			data.appendChild(results);
			tabs.firstChild.classList.add('tab-container__item--active');
			popUp.content(data, function () {controller.continueGame()});
			data.onclick = controller.chooseTab;
			results.innerHTML = temporaryData
				.pageResults[tabs.firstChild.innerHTML];
		}
	};

	controller.init();
})();