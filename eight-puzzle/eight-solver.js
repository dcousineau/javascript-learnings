////////////////////////////////////////////////////////////////////////////////
// BOARD ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Board(board, expected, movePiece)
{
    if( movePiece != null )
        this.movePiece = movePiece;
    else
        this.movePiece = 0;
    
    if( expected != undefined )
        this.expected = expected
    else
        this.expected = [
            [1, 2, 3],
            [4, 5, 6], 
            [7, 8, 0]
        ];
    
    if( board != undefined )
        this.board = board;
    else
        this.board = Board.generateRandom(this.expected, this.movePiece, 5, 20);
}

Board.MOVE_UP = 'UP';
Board.MOVE_DOWN = 'DOWN';
Board.MOVE_LEFT = 'LEFT';
Board.MOVE_RIGHT = 'RIGHT';

/**
 * Generates a random board, based on the expected board.
 */
Board.generateRandom = function(expected, movePiece, from, to)
{
    if( movePiece == undefined )
        movePiece = 0;
    
    if( from == undefined )
        from = 10;
    
    if( to == undefined )
        to = 25;
        
    var randomNumber = function(to, from)
    {
        if( from == undefined )
        {
            return Math.floor( Math.random() * to )
        }
        else
        {
            return Math.floor( (to - (from - 1)) * Math.random() ) + from;
        }
        
    };
    
    board = [];
    for( var row in expected )
    {
        board[row] = [];
        
        for( var column in expected[row] )
        {
            board[row][column] = expected[row][column];
        }
    }
    
    puzzle = new Board(board, expected, movePiece);
    
    for( var i = 0; i < randomNumber(to, from); i++ )
    {
        var valid = puzzle.validMoves();
        
        puzzle.move( valid[randomNumber(valid.length)] );
    }
    
    return puzzle.board;
};

Board.prototype.clone = function()
{
    var clone = function(obj)
    {
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = obj.constructor(); // changed

        for(var key in obj)
            temp[key] = clone(obj[key]);
        
        return temp;
    };
    
    var temp = new Board();
    
    for( var key in this )
    {
        temp[key] = clone(this[key]);
    }
    
    return temp;
};

/**
 * Returns all the pieces in the expected board
 * 
 * @return array( piece1, piece2, ..., pieceN )
 */
Board.prototype.getPiecePool = function()
{
    if( this.pool == undefined )
    {
        this.pool = [];
        
        for( var row in this.expected )
        {
            for( var column in this.expected )
            {
                this.pool.push(this.expected[row][column]);
            }
        }
    }
    
    return this.pool.slice(0, this.pool.length);
};

/**
 * Returns the diemnsions of the (expected) board
 *
 * @return object( width: int, height: int )
 */
Board.prototype.getDimensions = function()
{
    return {
        width: parseInt(this.expected[0].length) - 1, 
        height: parseInt(this.expected.length) - 1
    };
};


/**
 * Finds the location of a piece on the board
 *
 * @arg piece Piece to look for
 * @arg board|null The board to search, null searches the default board
 * @return object( row: int, column: int )
 */
Board.prototype._pieceLocation = function( piece, board )
{
    if( board == null )
        board = this.board;
    
    for( var row in board )
    {
        for( var column in board[row] )
        {
            if( board[row][column] == piece )
                return {
                    row: parseInt(row), 
                    column: parseInt(column)
                };
        }
    }
    
};

/**
 * Returns the move piece location
 *
 * @return object( row: int, column: int )
 * @throws Exception when the movePiece is not found
 */
Board.prototype.movePieceLocation = function()
{
    try
    {
        return this._pieceLocation(this.movePiece, this.board);
    }
    catch( err )
    {
        throw "Move piece not found";
    }
    
};

/**
 * Returns the expected move piece location
 *
 * @return object( row: int, column: int )
 * @throws Exception when the movePiece is not found
 */
Board.prototype.expectedMovePieceLocation = function()
{
    try
    {
        return this._pieceLocation(this.movePiece, this.expected);
    }
    catch( err )
    {
        throw "Move piece not found";
    }
    
};

/**
 * Returns an array of valid moves based on the current board
 *
 * @return array( move1, move2, ..., moveN )
 */
Board.prototype.validMoves = function()
{
    var valid = [];
    
    var dimension = this.getDimensions();
    var loc = this.movePieceLocation();
    
    if( loc.column > 0 )
        valid.push(Board.MOVE_LEFT);
    
    if( loc.column < dimension.width )
        valid.push(Board.MOVE_RIGHT);
    
    if( loc.row > 0 )
        valid.push(Board.MOVE_UP);
    
    if( loc.row < dimension.height )
        valid.push(Board.MOVE_DOWN);
    
    return valid;
};

/**
 * Moves the movePiece in the direction specified
 * 
 * @return board
 * @throws On invalid move direction
 */
Board.prototype.move = function( direction )
{
    var valid = this.validMoves();
    var loc = this.movePieceLocation();
    
    if( valid.indexOf( direction ) < 0 )
        throw "Invalid Move";
        
    var swap = function(board, row, column)
    {
        var swp = board[row][column];
        board[row][column] = board[loc.row][loc.column];
        board[loc.row][loc.column] = swp;
        
        return board;
    };
    
    switch( direction )
    {
        case Board.MOVE_UP:
            swap(this.board, loc.row - 1, loc.column);
            
            break;
            
        case Board.MOVE_DOWN:
            swap(this.board, loc.row + 1, loc.column);
            
            break;
        
        case Board.MOVE_LEFT:
            swap(this.board, loc.row, loc.column - 1);
        
            break;
        
        case Board.MOVE_RIGHT:
            swap(this.board, loc.row, loc.column + 1);
        
            break;
        
        default:
            throw "Invalid Direction";
    }
};

/**
 * Determines if the current board matches the expected board
 *
 * @return boolean
 */
Board.prototype.isSolved = function()
{
    if( this.board.length != this.expected.length )
        return false;
    
    
    for( var row in this.board )
    {
        for( var column in this.board[row] )
        {
            if( this.board[row][column] != this.expected[row][column] )
                return false;
        }
    }
    
    return true;
};

////////////////////////////////////////////////////////////////////////////////
// ALGORITHMS //////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function a_star(puzzle, max_iterations)
{
    a_star.heuristic = function(puzzle)
    {        
        current_loc = puzzle.movePieceLocation();
        expected_loc = puzzle.expectedMovePieceLocation();
        
        var manhattan = function() 
        {
            
            var x = Math.abs( current_loc.column - expected_loc.column );
            var y = Math.abs( current_loc.row - expected_loc.row );
            
            return x + y;
        };
        
        var outofplace = function()
        {
            var retval = 0;
            
            for( var row in puzzle.expected )
            {
                for( var column in puzzle.expected[row] )
                {
                    if( puzzle.board[row][column] != puzzle.expected[row][column] )
                        retval++;
                }
            }
            
            return retval;
        };
        
        return outofplace() + manhattan();
    };
    
    a_star.expand = function(state)
    {
        var moves = [];
        var valid = state.puzzle.validMoves();
        
        for( var i in valid )
        {
            //Check if we're moving backwards by checking to make sure our
            //attempted direction isn't the same as the last direction taken
            if( state.moves.length > 0 )
            {
                switch( state.moves[state.moves.length - 1] )
                {
                    case Board.MOVE_UP:
                        if( valid[i] == Board.MOVE_DOWN )
                            continue;
                        break;
                        
                    case Board.MOVE_DOWN:
                        if( valid[i] == Board.MOVE_UP )
                            continue;
                        break;
                        
                    case Board.MOVE_LEFT:
                        if( valid[i] == Board.MOVE_RIGHT )
                            continue;
                        break;
                        
                    case Board.MOVE_RIGHT:
                        if( valid[i] == Board.MOVE_LEFT )
                            continue;
                        break;
                    
                    default:
                        throw "A move exists in the state that shouldn't";
                }
            }
            
            var new_puzzle = state.puzzle.clone();
            
            new_puzzle.move(valid[i]);
            
            var move = {
                moves: state.moves.concat([valid[i]]),
                heuristic: a_star.heuristic(new_puzzle),
                puzzle: new_puzzle
            };
            
            moves.push(move);
        }
        
        return moves;
    };
    
    a_star.sort_queue = function(queue)
    {
        return queue.sort(function(a, b){
            if( a.heuristic < b.heuristic )
                return -1;
            else if( a.heuristic > b.heuristic )
                return 1;
            else
                return 0;
        });
    };
    
    a_star.has_state = function(queue, state)
    {
        /*if( queue.length == 0 )
            return false;
        
        for( var i in queue )
        {
            for( var row in queue[i].puzzle.board )
            {
                for( var column in queue[i].puzzle.board[row] )
                {
                    if( queue[i].puzzle.board[row][column] != state.puzzle.board[row][column] )
                        return false;
                }
            }
        }*/
        
        if( queue.length == 0 )
            return false;
            
        var board_equal = function(board1, board2)
        {
            for( var row in board1 )
            {
                for( var column in board1[row] )
                {
                    if( board1[row][column] != board2[row][column] )
                    {
                        return false;
                    }
                }
            }
            
            return true;
        };
        
        for( var i in queue )
        {
            if( board_equal(queue[i].puzzle.board, state.puzzle.board) )
            {
                return true;
            }
        }
        
        return false;
    };
    
    var queue = [{
        moves: [],
        heuristic: a_star.heuristic(puzzle),
        puzzle: puzzle
    }];
    
    if( max_iterations == undefined )
        max_iterations = 1000;
    
    var iteration = 0;
    while( queue.length != 0 )
    { 
        if( max_iterations == -1 || iteration < max_iterations )
            iteration++;
        else
            return false;
        
        var current = queue.shift();
        
        if( current.puzzle.isSolved() )
        {
            return current.moves;
        }
        else
        {
            var expansion = a_star.expand(current);
            
            for( var i in expansion )
            {
                if( !a_star.has_state(queue, expansion[i]) )
                {
                    queue.push(expansion[i]);
                }
            }
            
            a_star.sort_queue(queue);
        }
    }
}