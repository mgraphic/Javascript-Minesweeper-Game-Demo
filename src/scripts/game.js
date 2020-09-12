import '../styles/index.scss';
import { Config } from './config';

export class Game {
    // Class names for tile game piece types:
    static TYPE_BOMB = 'bomb';
    static TYPE_VALID = 'valid';

    // Class names for tile game piece status:
    static STATUS_FLAGGED = 'flag';
    static STATUS_CHECKED = 'checked';

    gameBoardElement;
    leaderBarElement;
    flagElement;
    startElement;
    timerElement;
    gridElement;
    resultElement;
    settingsElement;
    gameOver;
    tiles;
    flags;
    width;
    height;
    bombCount;
    timer;

    constructor(gameBoard) {
        this.gameBoardElement = gameBoard;
        this.constructElements();
        this.setListeners();

        this.width = Config.DEFAULT_GRID_COUNT_HORIZONTAL;
        this.height = Config.DEFAULT_GRID_COUNT_VERTICAL;
        this.bombCount = Config.DEFAULT_BOMB_COUNT;
    }

    setListeners() {
        let clickTimer;

        window.addEventListener('mousedown', ($event) => {
            const element = $event.target;
            if (!this.gameOver && element.classList.contains('tile')) {
                if (!this.timer) {
                    this.startTimer();
                }

                this.startElement.innerHTML = Config.START_EMOJI_ACTIVE;

                clickTimer = setTimeout(() => {
                    const tile = this.tiles[
                        element.getAttribute('data-tile-id')
                    ];

                    tile.skip = true;
                    this.toggleFlag(tile);

                    clickTimer = null;
                }, 400);
            }
        });

        window.addEventListener('mouseup', ($event) => {
            const element = $event.target;

            if (!this.gameOver && element.classList.contains('tile')) {
                this.startElement.innerHTML = Config.START_EMOJI_GOOD;
            }

            if (clickTimer) {
                clearTimeout(clickTimer);
            }
        });
    }

    constructElements() {
        this.leaderBarElement = this.newElement('leaderbar');

        this.flagElement = this.newElement('flags');
        this.leaderBarElement.appendChild(this.flagElement);

        this.startElement = this.newElement('start');
        this.startElement.addEventListener('click', () => {
            this.stopTimer();
            this.run();
        });
        this.leaderBarElement.appendChild(this.startElement);

        this.timerElement = this.newElement('timer');
        this.leaderBarElement.appendChild(this.timerElement);

        this.gameBoardElement.appendChild(this.leaderBarElement);

        this.gridElement = this.newElement('grid');
        this.gameBoardElement.appendChild(this.gridElement);

        this.resultElement = this.newElement('result');
        this.gameBoardElement.appendChild(this.resultElement);

        this.settingsElement = this.newElement('settings');
        this.settingsElement.innerHTML = 'Settings';
        this.settingsElement.addEventListener('click', () => {
            this.settings();
        });
        this.gameBoardElement.appendChild(this.settingsElement);
    }

    run() {
        this.resetParameters();
        this.refreshUI();
        this.createGameBoard();
    }

    settings() {
        let width = parseInt(prompt('How many blocks wide?', this.width));

        if (width > 1) {
            this.width = width;
        } else {
            this.width = Config.DEFAULT_GRID_COUNT_HORIZONTAL;
        }

        let height = parseInt(prompt('How many blocks tall?', this.height));

        if (height > 1) {
            this.height = height;
        } else {
            this.height = Config.DEFAULT_GRID_COUNT_VERTICAL;
        }

        let count = parseInt(prompt('How many bombs?', this.bombCount));
        const tiles = this.width * this.height;

        if (count < tiles && count >= 0) {
            this.bombCount = count;
        } else {
            const tiles = this.width * this.height;
            this.bombCount = Math.floor((tiles * 20) / tiles);
        }

        this.run();
    }

    resetParameters() {
        this.flags = 0;
        this.tiles = [];
        this.gameOver = false;
        this.timer = null;
    }

    refreshUI() {
        this.gridElement.style.width = Config.TILE_SIZE * this.width + 'px';
        this.gridElement.style.height = Config.TILE_SIZE * this.height + 'px';
        this.resultElement.style.width = Config.TILE_SIZE * this.width + 'px';
        this.resultElement.style.height = Config.TILE_SIZE * this.height + 'px';
        this.leaderBarElement.style.width =
            Config.TILE_SIZE * this.width + 'px';

        this.gridElement.innerHTML = '';
        this.resultElement.innerHTML = '';
        this.flagElement.innerHTML = this.bombCount;
        this.startElement.innerHTML = Config.START_EMOJI_GOOD;
        this.timerElement.innerHTML = '000';

        this.gameBoardElement.classList.remove('shake');
        this.resultElement.classList.add('hide');
    }

    createGameBoard() {
        const bombsArray = Array(this.bombCount).fill(Game.TYPE_BOMB);

        const emptyArray = Array(
            this.width * this.height - this.bombCount
        ).fill(Game.TYPE_VALID);

        const tilesArray = emptyArray.concat(bombsArray);

        tilesArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < this.width * this.height; i++) {
            const gamePieceElement = this.createGamePieceElement(
                i,
                tilesArray[i]
            );
            const tile = {
                position: i,
                row: Math.floor(i / this.width) + 1,
                element: gamePieceElement,
                type: tilesArray[i],
                flagged: false,
                uncovered: false,
                skip: false,
                bombCount: 0,
            };

            this.addTileResponders(tile);
            this.gridElement.appendChild(gamePieceElement);

            this.tiles.push(tile);
        }

        // add bomb count
        this.tiles.forEach((tile) => {
            let total = 0;

            this.checkSurrounding(tile, (gamePiece) => {
                if (gamePiece.type === Game.TYPE_BOMB) {
                    total++;
                }
            });

            tile.bombCount = total;

            switch (total) {
                case 1:
                    tile.element.classList.add('count-one');
                    break;
                case 2:
                    tile.element.classList.add('count-two');
                    break;
                case 3:
                    tile.element.classList.add('count-three');
                    break;
                case 4:
                    tile.element.classList.add('count-four');
                    break;
                case 5:
                    tile.element.classList.add('count-five');
                    break;
                case 6:
                    tile.element.classList.add('count-six');
                    break;
                case 7:
                    tile.element.classList.add('count-seven');
                    break;
                case 8:
                    tile.element.classList.add('count-eight');
                    break;
            }
        });
    }

    createGamePieceElement(id, className) {
        const element = this.newElement('tile', className);
        element.setAttribute('data-tile-id', id);
        return element;
    }

    newElement(...classNames) {
        const element = document.createElement('div');
        element.classList.add(...classNames);
        return element;
    }

    addTileResponders(tile) {
        tile.element.addEventListener('click', ($event) => {
            $event.preventDefault();

            if (!tile.skip) {
                this.uncoverTile(tile);
            }

            tile.skip = false;
        });

        tile.element.addEventListener('contextmenu', ($event) => {
            $event.preventDefault();
            this.toggleFlag(tile);
        });
    }

    uncoverTile(tile) {
        if (this.gameOver || tile.uncovered || tile.flagged || tile.skip)
            return;

        if (tile.type === Game.TYPE_BOMB) {
            this.endGame(false);
        } else if (tile.bombCount > 0) {
            tile.element.innerHTML = tile.bombCount;
        } else {
            this.checkTile(tile);
        }

        tile.uncovered = true;
        tile.element.classList.add(Game.STATUS_CHECKED);
        this.checkForWin();
    }

    toggleFlag(tile) {
        if (this.gameOver) return;

        if (!tile.uncovered) {
            if (tile.flagged) {
                tile.element.classList.remove(Game.STATUS_FLAGGED);
                tile.element.innerHTML = '';
                this.flags--;
                this.flagElement.innerHTML = this.bombCount - this.flags;
                tile.flagged = false;
            } else if (!tile.flagged && this.flags < this.bombCount) {
                tile.element.classList.add(Game.STATUS_FLAGGED);
                tile.element.innerHTML = Config.FLAG_EMOJI;
                this.flags++;
                this.flagElement.innerHTML = this.bombCount - this.flags;
                tile.flagged = true;
                this.checkForWin();
            }
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            const time = (parseInt(this.timerElement.innerHTML) + 1)
                .toString()
                .padStart(3, '0');
            this.timerElement.innerHTML = time;
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    checkSurrounding(tile, callback) {
        const pos = tile.position;
        const row = tile.row;

        const isTopEdge = row === 1;
        const isBottomEdge = row >= this.height;
        const isLeftEdge = pos % this.width === 0;
        const isRightEdge = pos % this.width === this.width - 1;

        // Top Left
        if (!isLeftEdge && !isTopEdge && this.tiles[pos - this.width - 1]) {
            callback.apply(null, [this.tiles[pos - this.width - 1]]);
        }

        // Top Middle
        if (!isTopEdge && this.tiles[pos - this.width]) {
            callback.apply(null, [this.tiles[pos - this.width]]);
        }

        // Top Right
        if (!isTopEdge && !isRightEdge && this.tiles[pos - this.width + 1]) {
            callback.apply(null, [this.tiles[pos - this.width + 1]]);
        }

        // Middle Left
        if (!isLeftEdge && this.tiles[pos - 1]) {
            callback.apply(null, [this.tiles[pos - 1]]);
        }

        // Middle Right
        if (!isRightEdge && this.tiles[pos + 1]) {
            callback.apply(null, [this.tiles[pos + 1]]);
        }

        // Bottom Left
        if (!isBottomEdge && !isLeftEdge && this.tiles[pos + this.width - 1]) {
            callback.apply(null, [this.tiles[pos + this.width - 1]]);
        }

        // Bottom Middle
        if (!isBottomEdge && this.tiles[pos + this.width]) {
            callback.apply(null, [this.tiles[pos + this.width]]);
        }

        // Bottom Right
        if (!isBottomEdge && !isRightEdge && this.tiles[pos + this.width + 1]) {
            callback.apply(null, [this.tiles[pos + this.width + 1]]);
        }
    }

    checkTile(tile) {
        setTimeout(() => {
            this.checkSurrounding(tile, (gamePiece) => {
                this.uncoverTile(gamePiece);
            });
        });
    }

    endGame(hasWon) {
        this.stopTimer();

        if (hasWon) {
            const winElement = this.newElement('win');
            winElement.innerHTML = 'You Win!';
            this.resultElement.appendChild(winElement);
            this.startElement.innerHTML = Config.START_EMOJI_WIN;
        } else {
            this.detonateGrid();
            const loseElement = this.newElement('lose');
            loseElement.innerHTML = 'Game Over!';
            this.resultElement.appendChild(loseElement);
            this.startElement.innerHTML = Config.START_EMOJI_LOSE;
        }

        this.resultElement.classList.remove('hide');

        this.gameOver = true;
    }

    detonateGrid() {
        this.tiles.forEach((tile) => {
            if (tile.type === Game.TYPE_BOMB) {
                tile.element.innerHTML = Config.BOMB_EMOJI;
                tile.element.classList.add(Game.STATUS_CHECKED);
            }
        });

        this.gameBoardElement.classList.add('shake');
    }

    checkForWin() {
        if (this.gameOver) return;

        const count = {
            matches: 0,
            uncovered: 0,
        };

        this.tiles.forEach((tile) => {
            if (tile.flagged && tile.type === Game.TYPE_BOMB) {
                count.matches++;
            }

            if (tile.uncovered && tile.type === Game.TYPE_VALID) {
                count.uncovered++;
            }
        });

        if (
            count.matches === this.bombCount ||
            count.uncovered === this.width * this.height - this.bombCount
        ) {
            this.endGame(true);
        }
    }
}
