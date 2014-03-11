/*
 * RoleColors:
 * Changes the style of messages based on users role and affiliation.
 */

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.RoleColors = (function(self, Candy, $) {
    self.init = function() {
        $(Candy).on('candy:view.message.after-show', changeMessageRoleColors);
        return self;
    };

    function changeMessageRoleColors(e, args) {
        try {
            var localNick = Candy.Core.getUser().getNick();
            var nickDetected = new RegExp("@" + localNick + "([ .!><\":\/@-]|$)", 'im');    
            var senderJid = args.roomJid + '/' + args.name;
            var room = Candy.Core.getRoom(args.roomJid);
            if (!room) return;
            var roster = room.roster;
            if (!roster) return;
            var sender = roster.items[senderJid];
            var role = sender.getRole();
            var affiliation = sender.getAffiliation();
            
            // Set the role and affiliation colors.
            args.element.addClass('rc-role-color-' + role + ' rc-affiliation-color-' + affiliation);
            
            if (nickDetected.test(args.message)) {
                // 
                if ((role === 'moderator') || (affiliation === 'owner' || affiliation === 'admin')) {
                    args.element.addClass('rc-mentioned-with-rights');
                } else {
                    args.element.addClass('rc-mentioned');
                }
            } else {
                // Set the images based on role and affilaition.
                args.element.addClass('rc-role-img-' + role + ' rc-affiliation-img-' + affiliation);
            }
            
        } catch(er) {
            Candy.Core.log('[Plugin Error: RoleColors]');
        }
    }
    return self;

}(CandyShop.RoleColors || {}, Candy, jQuery));
