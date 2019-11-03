const GameScript = {
	GameContainer: {
		width: 320,
		height: 270,
		el: function(){
			return GameScript.getEl('tictactoe');
		},
		initialize: function(){
			const el = GameScript.GameContainer.el();
			el.style.width = GameScript.GameContainer.width + 'px';
			el.style.height = GameScript.GameContainer.height + 'px';
			el.style.backgroundColor = "#032935";
			el.style.display = "inline-block";
			el.style.textAlign = "center";
			el.innerHTML = '';
		}
	},
	StartButton: {
		width: 182,
		height: 65,
		createEl: function(){
			const btn = document.createElement("div");
			btn.style.width = GameScript.StartButton.width + 'px';
			btn.style.height = GameScript.StartButton.height + 'px';
			btn.style.backgroundColor = "white";
			btn.style.color = "#032935";
			btn.style.margin = "auto";
			btn.style.textAlign = "center";
			btn.style.lineHeight = btn.style.height;
			btn.style.fontSize = "22px";
			btn.style.fontFamily = "Arial, sans-serif";
			btn.style.cursor = "pointer";
			btn.style.display = "block";
			btn.style.marginTop = ((GameScript.GameContainer.height / 2) - (GameScript.StartButton.height/2)) + "px";
			
			btn.innerText = "Start Game";
			return btn;
		}
	},
	showStartMenu: function(){
		
		GameScript.GameContainer.initialize();
		
		const startBtn = GameScript.StartButton.createEl();
		GameScript.GameContainer.el().appendChild(startBtn);
		
		startBtn.onclick = function(){
			startBtn.style.display = "none";
			GameScript.PlayerSelection.show();
		};
		
	},
	startNewGame: function(){
		GameScript.GameBoard.PlayableArea.CurrentGame.reset();
		GameScript.GameBoard.PlayerTurn.setPlayer(null);
		GameScript.showStartMenu();
	},
	PlayerSelection: {
		Player: {
			X: 'X',
			O: 'O'
		},
		createLabel: function(txt,fs,mtop,display){
			const label = document.createElement("div");
			label.innerText = txt;
			label.style.color = "white";
			label.style.fontSize = fs + "px";
			label.style.fontFamily = "Arial, sans-serif";
			label.style.textAlign = "center";
			label.style.display = display;
			label.style.marginTop = mtop + 'px';
			return label;
		},
		selectedPlayer: null,
		selectPlayer: function(player){
			GameScript.PlayerSelection.selectedPlayer = player;
			GameScript.GameBoard.show();
		},
		show: function(){
			const selectPlayerLabel = GameScript.PlayerSelection.createLabel('Select your player:',22,80,'block');
			GameScript.GameContainer.el().appendChild(selectPlayerLabel);
			
			const playerXLabel = GameScript.PlayerSelection.createLabel(GameScript.PlayerSelection.Player.X,60,10,'inline-block');
			playerXLabel.style.marginRight = "42px";
			playerXLabel.style.cursor = "pointer";
			
			const playerOLabel = GameScript.PlayerSelection.createLabel(GameScript.PlayerSelection.Player.O,60,10,'inline-block');
			playerOLabel.style.cursor = "pointer";
			
			GameScript.GameContainer.el().appendChild(playerXLabel);
			GameScript.GameContainer.el().appendChild(playerOLabel);
			
			playerXLabel.onclick = function(){
				GameScript.PlayerSelection.selectPlayer(GameScript.PlayerSelection.Player.X);
			};
			
			playerOLabel.onclick = function(){
				GameScript.PlayerSelection.selectPlayer(GameScript.PlayerSelection.Player.O);
			};
		}
	},
	GameBoard: {
		initialize: function(){
			GameScript.GameContainer.initialize();
			
			GameScript.GameBoard.PlayerTurn.setPlayer(GameScript.PlayerSelection.selectedPlayer);
			GameScript.GameContainer.el().appendChild(GameScript.GameBoard.PlayerTurn.StatusLabel.create());
			
			GameScript.GameContainer.el().appendChild(GameScript.GameBoard.PlayableArea.create());
			GameScript.GameContainer.el().appendChild(GameScript.GameBoard.createStartNewGameLabel());
			
		},
		show: function(){
			GameScript.GameBoard.initialize();
			
		},
		PlayerTurn: {
			player: null,
			setPlayer: function(player){
				GameScript.GameBoard.PlayerTurn.player = player;
			},
			StatusLabel: {
				getId: function(){
					return 'player_turn';
				},
				create: function(){
					const statusLabel = GameScript.PlayerSelection.createLabel(GameScript.GameBoard.PlayerTurn.StatusLabel.getPlayerTurnString(),20,10,'block');
					const labelId = GameScript.GameBoard.PlayerTurn.StatusLabel.getId();
					statusLabel.setAttribute('id',labelId);
					return statusLabel;
				},
				getPlayerTurnString: function(){
					return 'Your turn player ' + GameScript.GameBoard.PlayerTurn.player;
				},
				getPlayerWonString: function(){
					return 'Player ' + GameScript.GameBoard.PlayerTurn.player + ' has won the game!';
				},
				getGameTiedString: function(){
					return 'Game tied.';
				},
				setText: function(text){
					GameScript.getEl(GameScript.GameBoard.PlayerTurn.StatusLabel.getId()).innerText = text;
				},
				setColor: function(color){
					GameScript.getEl(GameScript.GameBoard.PlayerTurn.StatusLabel.getId()).style.color = color;
				},
				refresh: function(){
					GameScript.GameBoard.PlayerTurn.StatusLabel.setText(GameScript.GameBoard.PlayerTurn.StatusLabel.getPlayerTurnString());
				}
			},
			switchPlayer: function(){
				if(GameScript.GameBoard.PlayerTurn.player === GameScript.PlayerSelection.Player.X){
					GameScript.GameBoard.PlayerTurn.player = GameScript.PlayerSelection.Player.O;
				} else {
					GameScript.GameBoard.PlayerTurn.player = GameScript.PlayerSelection.Player.X;
				}
				
				GameScript.GameBoard.PlayerTurn.StatusLabel.refresh();
			}
		},
		PlayableArea: {
			getPlayableBoxIdString: function(id){
				return 'playable_box_' + id;
			},
			CurrentGame: {
				hasEnded: false,
				status: [null,null,null,null,null,null,null,null,null],
				reset: function(){
					GameScript.GameBoard.PlayableArea.CurrentGame.status = [null,null,null,null,null,null,null,null,null];
					GameScript.GameBoard.PlayableArea.CurrentGame.hasEnded = false;
				},
				getBoxStatus: function(box_id){
					return GameScript.GameBoard.PlayableArea.CurrentGame.status[box_id-1];
				},
				playAt: function(position){
					position -= 1;
					
					if(GameScript.GameBoard.PlayableArea.CurrentGame.status[position] !== null)return;
					
					GameScript.GameBoard.PlayableArea.CurrentGame.status[position] = GameScript.GameBoard.PlayerTurn.player;
					GameScript.GameBoard.PlayableArea.CurrentGame.refresh();
					
					GameScript.GameBoard.PlayableArea.CurrentGame.checkStatus();
					if(GameScript.GameBoard.PlayableArea.CurrentGame.hasEnded)return;
					
					GameScript.GameBoard.PlayerTurn.switchPlayer();
				},
				refresh: function(){
					for(var i = 1; i <= 9; i++){
						const boxEl = GameScript.getEl(GameScript.GameBoard.PlayableArea.getPlayableBoxIdString(i));
						boxEl.innerText = GameScript.GameBoard.PlayableArea.CurrentGame.status[i-1];
					}
				},
				checkLineStatus: function(box_id1,box_id2,box_id3){
					const currentPlayer = GameScript.GameBoard.PlayerTurn.player;
					
					const result = GameScript.GameBoard.PlayableArea.CurrentGame.getBoxStatus(box_id1) === currentPlayer
					&& GameScript.GameBoard.PlayableArea.CurrentGame.getBoxStatus(box_id2) === currentPlayer
					&& GameScript.GameBoard.PlayableArea.CurrentGame.getBoxStatus(box_id3) === currentPlayer;
					
					
					if(result){
						GameScript.GameBoard.PlayableArea.CurrentGame.hasEnded = true;
						
						const box1 = GameScript.getEl(GameScript.GameBoard.PlayableArea.getPlayableBoxIdString(box_id1));
						const box2 = GameScript.getEl(GameScript.GameBoard.PlayableArea.getPlayableBoxIdString(box_id2));
						const box3 = GameScript.getEl(GameScript.GameBoard.PlayableArea.getPlayableBoxIdString(box_id3));
						
						const greenColor = "#33ff00";
						box1.style.color = greenColor;
						box2.style.color = greenColor;
						box3.style.color = greenColor;
						
						GameScript.GameBoard.PlayerTurn.StatusLabel.setText(GameScript.GameBoard.PlayerTurn.StatusLabel.getPlayerWonString());
						GameScript.GameBoard.PlayerTurn.StatusLabel.setColor(greenColor);
					}
				},
				checkTie: function(){
					var emptyBoxes = 0;
					var i;
					for(i = 1; i <= 9; i++){
						if(null === GameScript.GameBoard.PlayableArea.CurrentGame.status[i-1])
							emptyBoxes++;
					}
					
					if(0 === emptyBoxes && false === GameScript.GameBoard.PlayableArea.CurrentGame.hasEnded){
						GameScript.GameBoard.PlayableArea.CurrentGame.hasEnded = true;
						
						const yellowColor = "#ffa500";
						
						for(i = 1; i <= 9; i++){
							const box = GameScript.getEl(GameScript.GameBoard.PlayableArea.getPlayableBoxIdString(i));
							box.style.color = yellowColor;
						}
						
						GameScript.GameBoard.PlayerTurn.StatusLabel.setText(GameScript.GameBoard.PlayerTurn.StatusLabel.getGameTiedString());
						GameScript.GameBoard.PlayerTurn.StatusLabel.setColor(yellowColor);
					}
				},
				checkStatus: function(){
					
					// horizontal check 1
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(1,2,3);
					// horizontal check 2
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(4,5,6);
					// horizontal check 3
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(7,8,9);
					
					// vertical check 1
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(1,4,7);
					// vertical check 2
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(2,5,8);
					// vertical check 3
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(3,6,9);
					
					// diagonal check 1
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(1,5,9);
					// diagonal check 2
					GameScript.GameBoard.PlayableArea.CurrentGame.checkLineStatus(3,5,7);
					
					// and in the end, check for a game tie:
					GameScript.GameBoard.PlayableArea.CurrentGame.checkTie();
					
				}
			},
			createContainer: function(){
				const container = document.createElement("div");
				container.style.width = '228px';
				container.style.height = '195px';
				container.style.display = 'block';
				container.style.margin = "10px auto";
				return container;
			},
			createPlayableBox: function(id){
				const box = document.createElement("div");
				const box_id = GameScript.GameBoard.PlayableArea.getPlayableBoxIdString(id);
				box.setAttribute('id',box_id);
				box.style.width = '74px';
				box.style.height = '63px';
				box.style.float = 'left';
				box.style.fontFamily = 'Arial, sans-serif';
				box.style.fontSize = '50px';
				box.style.color = 'white';
				box.style.border = "1px solid white";
				box.style.cursor = "pointer";
				
				const boxStatus = GameScript.GameBoard.PlayableArea.CurrentGame.getBoxStatus(id);
				if(boxStatus !== null){
					box.innerText = boxStatus;
				}
				
				if([1,2,3].includes(id)){
					box.style.borderTop = "none";
				}
				
				if([1,4,7].includes(id)){
					box.style.borderLeft = "none";
				}
				
				if([3,6,9].includes(id)){
					box.style.borderRight = "none";
				}
				
				if([7,8,9].includes(id)){
					box.style.borderBottom = "none";
				}
				
				box.onclick = function(){
					if(!GameScript.GameBoard.PlayableArea.CurrentGame.hasEnded)
						GameScript.GameBoard.PlayableArea.CurrentGame.playAt(id);
				};
				
				return box;
			},
			create: function(){
				const container = GameScript.GameBoard.PlayableArea.createContainer();
				
				for(var i = 1; i <= 9; i++){
					container.appendChild(GameScript.GameBoard.PlayableArea.createPlayableBox(i));
				}
				
				return container;
			}
		},
		createStartNewGameLabel: function(){
			const label = GameScript.PlayerSelection.createLabel('Start new game',14,0,'block');
			label.style.cursor = "pointer";
			
			label.onclick = function(){
				GameScript.startNewGame();
			};
			
			return label;
		}
	},
	getEl: function(elementId){
		return document.getElementById(elementId);
	},
	
}