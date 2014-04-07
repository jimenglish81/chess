(function(){

   /*
      Responds with a chess move when required along with a positions object containing the men by coordinate.
      Exposes things that UIs may want to use.
    */


   'use strict';

   function Engine(){
      this.buildPositions();
   }

   Engine.prototype = Object.create(Subscribable.prototype);

   Engine.prototype.positions = {};

   Engine.prototype.turn = 'white';

   Engine.prototype.checkMoveLegal = function(move, isHuman) {
      var moveBreakdown = move.split(/-|x/);
      var isTake = moveBreakdown[1] == "x";
      var selectedCoord = moveBreakdown[0];
      var newCoord = moveBreakdown[1];
      if (this._checkLegal(selectedCoord, newCoord)) {
         if (isHuman) {
            this.place(selectedCoord, newCoord);
            this.fire(Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.positions);
         }
      } else if (isHuman) {
         this.fire(Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.positions);
      }
   };

   Engine.prototype._checkLegal = function(selectedCoord, newCoord) {
     var selectedCoordFile = selectedCoord.slice(0,1);
     var selectedCoordRow = +selectedCoord.slice(1);
     var newCoordFile = newCoord.slice(0,1);
     var newCoordRow = +newCoord.slice(1);

      if ((this.positions[newCoord] instanceof C.Piece && (this.positions[selectedCoord].colour == this.positions[newCoord].colour))
         || this.positions[selectedCoord].colour != this.turn
         // prevent moving backwards
         || this.turn == 'white' && newCoordRow < selectedCoordRow
         || this.turn == 'black' && newCoordRow > selectedCoordRow
         ) {
         return false;
      }
      return true;
   };

   Engine.prototype.place = function(selectedCoord, newCoord){
      this.positions[newCoord] = this.positions[selectedCoord];
      this.positions[selectedCoord] = {};
      this.changeTurn(this.positions[newCoord].colour);
   };

   Engine.prototype.changeTurn = function(colour) {
     this.turn = (colour == 'white') ? 'black' : 'white';
   };

   Engine.prototype.buildPositions = function(){
      var piece;

      for (var i = 0; i < Engine.SQUARES_PER_ROW; i++) {
         for (var x = 0; x < Engine.SQUARES_PER_ROW; x++) {
            this.positions[Engine.ALPHABET[x] + (Engine.SQUARES_PER_ROW-i)] = {}
         }
      }

      for (var i = 0; i < Engine.SQUARES_PER_ROW; i++) {
         this.positions[Engine.ALPHABET[i] + 2] = new C.Pawn('white');
         this.positions[Engine.ALPHABET[i] + (Engine.SQUARES_PER_ROW - 1)] = new C.Pawn('black');
         piece = new C[Engine.PIECE_ORDER[i]]('white');
         this.positions[Engine.ALPHABET[i] + 1] = piece;
         piece = new C[Engine.PIECE_ORDER[i]]('black');
         this.positions[Engine.ALPHABET[i] + Engine.SQUARES_PER_ROW] = piece;
      }
   };

   Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT = "humanMoveDeemedLegalEvent";

   Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT = "humanMoveDeemedIllegalEvent";

   Engine.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   Engine.PIECE_ORDER = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

   Engine.SQUARES_PER_ROW = 8;

   C.Engine = Engine;

})();
