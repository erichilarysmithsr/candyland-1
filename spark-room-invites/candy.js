/**
 * Allows Candy to accept room invitiations from the Spark client. This
 * may work with some other jabber clients.
 */

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.SparkRoomInvites = (function(self, Candy, $) {
   
   var _options = {
      /* When true the plugin will automatically join the user to
       * the chat room including filling in the password. When false
       * the user will be prompted inside all of their chat rooms.
       */
      autoJoin: true,
      // Number of ms to consider the invitation expired. Defaults to 10 minutes
      expireMs: 600000,
      // Number of ms between checking for expired invites.
      reapInterval: 5000
   };
   
   // Stores any invites if sent to the tab.
   var _invitations = {};
   var _invitationPasswords = {};
      
   self.reapInvitations = function reapInvitations(){
      var expired = (new Date).getTime() - _options.expireMs;
      
      $( "li.spark-invite").each(function( index ) {
         var invite = $(this);
         var expires = invite.attr('timestamp');
         var roomJid = invite.find('a.spark-invite-link').attr('room-jid');
         
         // Check to see if this invitation is expired.
         if (expires < expired) {
            // Convert this to an expired request.
            invite.removeAttr('timestamp').removeClass('spark-invite').addClass('spark-invite-expired');
            self.deleteInvitation(roomJid);
            // Replace the link with the expired message.
            invite.find('a').remove();
            invite.append($.i18n._('candyshopSparkRoomInvitesExpired'));
         }
      });
   }
   
   self.deleteInvitation = function deleteInvitation(roomJid) {
      delete _invitations[roomJid];
      delete _invitationPasswords[roomJid];
   }

   self.init = function initSparkRoomInvites(options) {
      $.extend(_options, options);
      self.applyTranslations();
      
      // Set the interval at which we look for expired requests.
      setInterval(self.reapInvitations, _options.reapInterval);

      // Listen for room invitations.
      $(Candy).bind('candy:core:chat:message:other', function(e, msg) {

         // Inspect the message.
         var message = $(msg.message);
         var inviteData = message.find('invite');

         if (inviteData.length > 0) {

            var invite = {
               from: inviteData.attr('from'),
               to: message.attr('from'),
               reason: inviteData[0].textContent
            };
            
            var password = message.find('password')[0].textContent || null;
            console.log('password was ', password);
            
            invite.name = invite.from.split('@')[0];
            
            if (_options.autoJoin === true) {
               Candy.Core.Action.Jabber.Room.Join(invite.from, password);
            } else {
               // Add the new entry to the list.
               _invitations[invite.to] = invite;
               _invitationPasswords[invite.to] =  password;

               var inviteMessage = Mustache.to_html(
                  CandyShop.SparkRoomInvites.Template.invite,
                  {
                     title: $.i18n._('candyshopSparkRoomInvitesTitle'),
                     message: $.i18n._('candyshopSparkRoomInvitesMessage'),
                     from: invite.from,
                     fromShort: invite.from.split('@')[0],
                     to: invite.to,
                     reason: invite.reason,
                     timestamp: (new Date).getTime(),
                     time: (new Date).toTimeString().split(' ')[0]
                  }
               );
               
               // Send the invite to each chat session so the user sees it.
               $.each(Candy.Core.getRooms(), function(k, v){
                  Candy.View.Pane.Room.appendToMessagePane(k, inviteMessage);
                  Candy.View.Pane.Room.scrollToBottom(k);
               });
               
               // Handle uses clicking on the accept link.
               $("a.spark-invite-link").click(function(){
                  var request = $(this);
                  var roomJid = request.attr('room-jid');
                  var roomPassword = _invitationPasswords[roomJid] || null;
                  console.log(roomJid, roomPassword);
                  // Delete the request information.
                  self.deleteInvitation(roomJid);
                  Candy.Core.Action.Jabber.Room.Join(roomJid, roomPassword);
                  // Switch the active tab to the new chat room.
                  Candy.View.Pane.Chat.setActiveTab(roomJid);
                  // Delete the invitations from the chats.
                     
                  $( "li.spark-invite").each(function(index) {
                     var curInvite = $(this);
                     var inviteJid = curInvite.attr('room-jid');
                     if (inviteJid === roomJid) {
                        curInvite.removeAttr('timestamp').removeClass('spark-invite').addClass('spark-invite-accepted')
                           .append($.i18n._('candyshopSparkRoomInvitesAccepted'));
                        curInvite.find('a').remove();
                     }
                  })
               });
            }
         }
         
      });
    
      return true;
   
   }
   
   self.applyTranslations = function() {
      var translations = {
         'en' : ['Invite: ', 'Accept Invitation', 'This invitation has expired.', 'You accepted this invitation']
      };
      $.each(translations, function(k, v) {
         if(Candy.View.Translation[k]) {
            Candy.View.Translation[k].candyshopSparkRoomInvitesTitle = v[0];
            Candy.View.Translation[k].candyshopSparkRoomInvitesMessage = v[1];
            Candy.View.Translation[k].candyshopSparkRoomInvitesExpired = v[2];
            Candy.View.Translation[k].candyshopSparkRoomInvitesAccepted = v[3];
         }
      });
    };
   
   return self;

}(CandyShop.SparkRoomInvites || {}, Candy, jQuery));

CandyShop.SparkRoomInvites.Template = (function (self) {
    var inviteParts = [
      '<li class="spark-invite" timestamp="{{timestamp}}" room-jid="{{to}}"><small>{{time}}</small>',
      '<span><strong>{{title}} {{fromShort}}</strong> ({{reason}})</span></br>',
      '<a class="spark-invite-link" href="#" room-jid="{{to}}">{{message}}</a>',
      '</li>'
    ];
    self.invite = inviteParts.join('');
    return self;
})(CandyShop.SparkRoomInvites.Template || {});