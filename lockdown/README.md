# Lockdown

Limits the use of private chat to between room owner/admin/moderator and users.

* Users can only start private chats with owner/admin/moderator.
* Room owner/admin/moderator can start private chats with anyone.
* Allows you to disable ignore.
* Allows you to disable ban and kick.

## Import

    <script type="text/javascript" src="candyland/lockdown/candy.js"></script>

## Bootstrap

    CandyShop.Lockdown.init({
        // Enforce limits on private chat usage.
        limitPrivateChat: true,
        // Disable the ignore context menu.
        disableIgnore: true,
        // Disable the kick context menu.
        disableKick: true,
        // Disable the ban context menu.
        disableBan: true
    });

