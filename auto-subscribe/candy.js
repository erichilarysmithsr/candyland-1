/** File: candy.js
 *
 * Authors:
 *   - Joshua Heiks <joshuaheiks@gmail.com>
 *
 * Copyright:
 *   (c) 2014 Joshua Heiks. All rights reserved.
 */
var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.AutoSubscribe = (function(self, Candy, $) {
    var _options = {
        // Automatically accept subscription/unsubscriptions.
        enabled: true
    };
    
    /** Function: init
     * 
     */
    self.init = function(options) {
        $.extend(_options, options);
        
        $(Candy).bind('candy:core.presence', function(e, msg){
            if (_options.enabled == false) return;
            var type = msg.stanza.attr('type');
            if (!type) return;
           
            switch(type) {
                case 'subscribe':
                    var conn = Candy.Core.getConnection();
                    conn.send($pres({to: msg.from, type: type + 'd'}));
                    conn.send($pres({to: msg.from, type: type}));
                    break;
                case 'subscribed':
                    break;
                case 'unsubscribe':
                    var conn = Candy.Core.getConnection();
                    conn.send($pres({to: msg.from, type: type + 'd'}));
                    conn.send($pres({to: msg.from, type: type}));
                    break;
                case 'unsubscribed':
                    break;
                case 'unavailable':
                    break;
                case 'error':
                    break;
                default:
                    // Other conditions.
            }
        })
        return self;
    };
    return self;
}(CandyShop.AutoSubscribe || {}, Candy, jQuery));