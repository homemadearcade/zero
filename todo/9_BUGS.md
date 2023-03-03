--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
KNOWN BUGS
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

When the game is paused, it doesnt change relations ( when editing them ) until the next reload?
  If game is paused and theres a relation update then reload the game... again

Game host requires you to reload the game doesnt it. Because host is decided in PreloaderScene

the size of the game edges messes up the mouse preview I believe

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
PERFORMANCE
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

I think potentially we need to the limit the amount of projectiles or like you can turn projectiles into active objects or not. Some projectiles just straight up dont do anything. Object Instance vs Projectile Instance. It was only when I added projectiles that there was a problem.

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
WATCHING THESE BUGS
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

Stopping a bunch destroyed the playground

BETTER REDIRECT ( cuz its broken sometimes )
  So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop

IF KEY ISSUES PERSIST
set Interval for keyboard capture issue?
Can Phaser just register keys without taking them over??


--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
LOW PRIORITY
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

Fix with Cobrowsing?? right now broken af when switching between two different users

if theres no player spawn zone it leads to the camrea not being destroyed thing? so thats a way to reproduce the bug FYI

undo canvas stuff doesnt work now between stages... Codrawing system needs to undo by texture Id not ... canvas id?

