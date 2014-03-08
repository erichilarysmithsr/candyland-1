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
            var senderJid = args.roomJid + '/' + args.name;
            var room = Candy.Core.getRoom(args.roomJid);
            if (!room) return;
            var roster = room.roster;
            if (!roster) return;
            var sender = roster.items[senderJid];
            var role = sender.getRole();
            var affiliation = sender.getAffiliation();
            args.element.addClass('rolecolors-role-' + role);
            args.element.addClass('rolecolors-affiliation-' + affiliation);
        } catch(er) {
            Candy.Core.log('[Plugin Error: RoleColors]');
        }
    }
    return self;

}(CandyShop.RoleColors || {}, Candy, jQuery));
