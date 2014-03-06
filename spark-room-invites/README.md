# SparkRoomInvites
Allows Candy users the ability to receive group chat invites from Spark.


    <script type="text/javascript" src="candyland/spark-room-invites/candy.js"></script>
    <link rel="stylesheet" type="text/css" href="candyland/spark-room-invites/candy.css" />

To bootstrap.

    CandyShop.SparkRoomInvites.init({
      /* When true the plugin will automatically join the user to
       * the chat room including filling in the password. When false
       * the user will be prompted inside all of their chat rooms.
       */
      autoJoin: false,
      // Number of ms to consider the invitation expired. Defaults to 10 minutes
      expireMs: 600000,
      // Number of ms between checking for expired invites.
      reapInterval: 5000
    });

![SparkRoomInvites](screenshot.png)
