/**
 * Auto accept room invitations.
 */

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.AcceptRoomInvites = (function(self, Candy, $) {

   self.init = function AcceptRoomInvites() {

      $(Candy).bind('candy:core:chat:message:normal', function(e, msg) {
        try {
            var message = $(msg.message);
            var inviteData = message.find('invite');
            if (inviteData.length > 0) {
                var password = message.find('password')[0].textContent || null;
                Candy.Core.Action.Jabber.Room.Join(message.attr('from'), password);
            }
        } catch(er) {
            
        }
      });
   }
   return self;
}(CandyShop.AcceptRoomInvites || {}, Candy, jQuery));
