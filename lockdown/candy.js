/** File: candy.js
 *
 * Authors:
 *   - Joshua Heiks <joshuaheiks@gmail.com>
 *
 * Copyright:
 *   (c) 2014 Joshua Heiks. All rights reserved.
 */
var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Lockdown = (function(self, Candy, $) {
    var _options = {
        // Enforce limits on private chat usage.
        limitPrivateChat: true,
        // Disable the ignore context menu.
        disableIgnore: true,
        // Disable the kick context menu.
        disableKick: true,
        // Disable the ban context menu.
        disableBan: true
    };
    
    /** Function: init
     * 
     */
    self.init = function(options) {
        $.extend(_options, options);
        
        if (_options.limitPrivateChat === true) {
            // Disable the click action for starting private chats.
            
            // Overide the default behaviour of the roster userClick
            Candy.View.Pane.Roster.userClick = function userClick() {
            	var elem = $(this);
                try {
                    var curView = Candy.View.getCurrent();
                    var curRoom = Candy.Core.getRoom(curView.roomJid);
                    var me = curRoom.getUser();
                
                    // Room owner/admin and moderator get all links.
                    if (isOwnerOrAdmin(me) || isModerator(me)) {
                        Candy.View.Pane.PrivateRoom.open(elem.attr('data-jid'), elem.attr('data-nick'), true);
                    } else {
                        // Check to see if the user clicked on is an owner/admin moderator.
                        if ((['owner', 'admin'].indexOf(elem.attr('data-affiliation')) !== -1) || elem.attr('data-role') === 'moderator') {
                            Candy.View.Pane.PrivateRoom.open(elem.attr('data-jid'), elem.attr('data-nick'), true);
                        }
                    }
                } catch(er) {
                
                }
            },
        
            // Modify the message template so the chat link is disabled.
            Candy.View.Template.Message.item =  '<li><small>{{time}}</small><div>' +
            	'<span class="label"class="name">{{displayName}}</span>' +
            	'<span class="spacer">▸</span>{{{message}}}</div></li>';
        }
        
        var isOwnerOrAdmin = function isOwnerOrAdmin(user) {
            return ['owner', 'admin'].indexOf(user.getAffiliation()) !== -1;
        };
        var isModerator = function isModerator(user) {
            return user.getRole() === 'moderator';
        };

        $(Candy).bind('candy:view.roster.context-menu', function(e, args) {
            
            // Overide the default Candy private chat menu if needed.
            args.menulinks.private.requiredPermission = function(user, me) {
                if (isModerator(me) || isOwnerOrAdmin(me)) {
                    return true;
                }
                if (isModerator(user) || isOwnerOrAdmin(user)) {
                    return true;
                }
                return false;
            }
            
            if (_options.disableIgnore === true) {
                delete args.menulinks['ignore'];
            }
            if (_options.disableBan === true) {
                delete args.menulinks['ban'];
            }
            if (_options.disableKick === true) {
                delete args.menulinks['kick'];
            }
        });
      };
    return self;
}(CandyShop.Lockdown || {}, Candy, jQuery));