define(
  [ 'core/World', 'core/Message', 'collection/LinkedList' ], function( World, Message, LinkedList ) {

    var instance = null;

    var MessageManager = function() {
      this.messages = new LinkedList();
    };

    MessageManager.prototype.register = function( message ) {
      this.messages.put( message );
    };

    MessageManager.prototype.send = function( message ) {
      var go = World.gameobject.find( message.to );
      if( go ) {
        go.messages.put( message );
      }
    };

    MessageManager.prototype.update = function() {

    };

    MessageManager.getInstance = function() {
      if( instance === null ) {
        instance = new MessageManager();
      }
      return instance;
    };

    return MessageManager.getInstance();
  }
);