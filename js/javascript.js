$(document).ready(function () {
    
    
    // Define the base path for the Scrabble tile images
    const basePath = '/Users/nabil/Documents/XCode/GUI_I_HW_5/graphics_data/Scrabble_Tiles/';

    // Define the Scrabble tiles with their values, original distribution, and remaining numbers
    const ScrabbleTiles = {
        "A": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
        "B": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "C": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "D": { "value": 2, "original-distribution": 4, "number-remaining": 4 },
        "E": { "value": 1, "original-distribution": 12, "number-remaining": 12 },
        "F": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "G": { "value": 2, "original-distribution": 3, "number-remaining": 3 },
        "H": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "I": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
        "J": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
        "K": { "value": 5, "original-distribution": 1, "number-remaining": 1 },
        "L": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "M": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "N": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "O": { "value": 1, "original-distribution": 8, "number-remaining": 8 },
        "P": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "Q": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
        "R": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "S": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "T": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "U": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "V": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "W": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "X": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
        "Y": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "Z": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
        "Blank": { "value": 0, "original-distribution": 2, "number-remaining": 2 }
    };

    // Create a pool of tiles from the ScrabbleTiles object
    let tilePool = Object.keys(ScrabbleTiles);

    // Create a 1x15 grid for the Scrabble board
    let board = Array(15).fill(null);
    let cumulativeScore = 0; // Variable to hold the cumulative score

    // Function to get random tiles from the pool
    function getRandomTiles(pool, numTiles) {
        let selectedTiles = [];
        for (let i = 0; i < numTiles; i++) {
            // Filter out tiles with number-remaining equal to 0
            let availableTiles = pool.filter(tile => ScrabbleTiles[tile]['number-remaining'] > 0);
            
            if (availableTiles.length === 0) {
                console.warn('No more tiles remaining.');
                break; // Exit loop if no tiles available
            }

            let randomIndex = Math.floor(Math.random() * availableTiles.length);
            let tile = availableTiles[randomIndex];
            selectedTiles.push(tile);

            // Log remaining number of tiles for the selected tile
            console.log(`Remaining ${tile} tiles: ${ScrabbleTiles[tile]['number-remaining']}`);
            
            // Decrease number-remaining for the selected tile
            ScrabbleTiles[tile]['number-remaining']--;

            // If number-remaining reaches 0, remove tile from pool
            if (ScrabbleTiles[tile]['number-remaining'] === 0) {
                pool = pool.filter(item => item !== tile);
            }
        }
        return selectedTiles;
    }

    // Function to display the selected tiles
    function displayTiles(selectedTiles) {
        const $container = $('#letter-container').empty();

        // Create an image element for each selected tile and append it to the container
        selectedTiles.forEach(tile => {
            const $img = $('<img>').attr('src', `${basePath}Scrabble_Tile_${tile}.jpg`).attr('data-tile', tile).css({
                'width': '70px',
                'height': '70px'
            }).addClass('draggable-tile');
            $container.append($img);
        });

        // Make the tiles draggable
        $(".draggable-tile").draggable({
            revert: "invalid"
        });
    }

    // Reset button click event to clear the board and display new tiles
    $("#reset").click(function () {
        $(".board-cell").empty(); // Clear the images currently on the board
        board = Array(15).fill(null); // Reset the board array
        displayTiles(getRandomTiles([...tilePool], 7)); // Display new set of tiles
        cumulativeScore = 0; // Reset cumulative score
        $('#score').text(`Score: ${cumulativeScore}`); // Reset score display
        $('#error-message').text(''); // Clear any error message
    });

    // Next button click event to start a new word without resetting the score
    $("#next").click(function () {
        $(".board-cell").empty(); // Clear the images currently on the board
        board = Array(15).fill(null); // Reset the board array

        // Get currently held tiles
        let currentTiles = [];
        $(".draggable-tile").each(function() {
            currentTiles.push($(this).data('tile'));
        });

        // Determine how many new tiles are needed to make the hand 7 tiles
        let tilesNeeded = 7 - currentTiles.length;

        // Get new tiles and combine with current tiles
        let newTiles = getRandomTiles([...tilePool], tilesNeeded);
        let combinedTiles = currentTiles.concat(newTiles);

        // Display the combined set of tiles
        displayTiles(combinedTiles);

        $('#error-message').text(''); // Clear any error message
        cumulativeScore += currentScore;
        console.log(`Score after next =` + currentScore);
        console.log(`CumScore after next = ${cumulativeScore}`);
    });

    // Function to notify when a tile is dropped
    function tileDropped(event, ui, position) {
        const droppedTile = ui.helper;
        const tile = droppedTile.data('tile');

        // Add the tile to the board array at the specified position
        board[position - 1] = tile;

        console.log(`A tile was dropped: Tile: ${tile}, Position: ${position}`);
        
        // Update player score
        const currentScore = calculateScore(board);
        
        console.log(`Score after calculating = ${currentScore}`);
        console.log(`CumScore after calculating= ${cumulativeScore}`);
        $('#score').text(`Score: ${cumulativeScore + currentScore}`);
    }
    let currentScore = 0;

    // Function to calculate the score based on tiles placed on the board
    function calculateScore(board) {
        currentScore = 0;
        let doubleScore = false;

        board.forEach((tile, index) => {
            if (tile) {
                if (index === 2 || index === 12) {
                    doubleScore = true;
                }

                if (index === 6 || index === 8) {
                    currentScore += ScrabbleTiles[tile].value * 2;
                } else {
                    currentScore += ScrabbleTiles[tile].value;
                }
            }
        });

        if (doubleScore) {
            currentScore *= 2;
        }
        
        return currentScore;
    }

    // Function to check if a tile can be placed at a given position
    function canPlaceTile(position) {
        if (board.every(tile => tile === null)) {
            // Allow placing the first tile anywhere
            return true;
        }

        // Check if there is a tile next to the current position
        const left = position > 1 ? board[position - 2] : null;
        const right = position < 15 ? board[position] : null;

        return left !== null || right !== null;
    }

    // Make the Scrabble board cells droppable
    $(".board-cell").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            const $cell = $(this);
            const position = $cell.data('position');

            if (canPlaceTile(position)) {
                $cell.append(ui.helper.css({
                    position: 'relative',
                    top: '4px',
                    left: '3px'
                }));
                tileDropped(event, ui, position); // Call the notification function
                $('#error-message').text(''); // Clear any error message
            } else {
                ui.helper.draggable('option', 'revert', true);
                $('#error-message').text('Tiles can only be placed next to an existing tile.');
            }
        }
    });

    // Initial display of tiles
    displayTiles(getRandomTiles([...tilePool], 7));
    
   
});
