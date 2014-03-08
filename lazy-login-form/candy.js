var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.LazyLoginForm = (function(self, Candy, $) {
    self.init = function(domain) {
        /** Function: showLoginForm
		 * Show the login form modal
		 *
		 * Parameters:
		 *  (String) message - optional message to display above the form
		 *	(String) presetJid - optional user jid. if set, the user will only be prompted for password.
		 */
        
        $(Candy).on('candy:core.login', function(){
			// Unbind the existing submit handler.
            $("#login-form").unbind('submit');
     		// Add a new login form submit handler.
            $('#login-form').submit(function() {
                var username = $('#username').val(),
                    password = $('#password').val();
                    

                if (!Candy.Core.isAnonymousConnection()) {

	                // Add the domain to the end of the JID if needed.
	                if (username.indexOf("@") < 0) {
	                    username = username + "@" + domain;
	                }
					
					
                    // guess the input and create a jid out of it
                    var jid = Candy.Core.getUser() && username.indexOf("@") < 0 ?
                        username + '@' + Strophe.getDomainFromJid(Candy.Core.getUser().getJid()) : username;

                    if(jid.indexOf("@") < 0 && !Candy.Core.getUser()) {
                        
                        Candy.View.Pane.Chat.Modal.showLoginForm($.i18n._('loginInvalid'));
                    } else {
                        //Candy.View.Pane.Chat.Modal.hide();
                        Candy.Core.connect(jid, password);
                    }
                } else { // anonymous login
                    Candy.Core.connect(presetJid, null, username);
                }
                return false;
            });
        })
        return self;
    };
    return self;

}(CandyShop.LazyLoginForm  || {}, Candy, jQuery));
