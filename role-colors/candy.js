/*
 *
 *
 */


var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.RoleColors = (function(self, Candy, $) {
    self.init = function() {
        
        $(Candy).on('candy:view.message.after-show', changeMessageRoleColors);
        
        return self;
    };
    
    function changeMessageRoleColors(e, args) {
        var senderJid = args.roomJid + '/' + args.name;
        var sender = Candy.Core.getRoom(args.roomJid).roster.items[senderJid];
        var role = sender.getRole();
        var affiliation = sender.getAffiliation();
        args.element.addClass('rolecolors-role-' + role);
        args.element.addClass('rolecolors-affiliation-' + affiliation);
    }
    return self;

}(CandyShop.RoleColors || {}, Candy, jQuery));
