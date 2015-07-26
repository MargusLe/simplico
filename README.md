# simplico

A simplistic cooperation exercise

## The Starting Point

Every client application instance connects the coordination server
via web socket, receives an identity (a color) and will report it's virtual
position to the server.

Server broadcasts client position updates to all other connected clients, so
they all can see each other as coloured dots moving on the map.

Initial positioning uses OpenLayers API, which may use internet IP addresses
for client positioning. Then, we can change our virtual position by simply
panning the map. The point under the crosshair is my virtual position.

Not so much, really.

## The Next Step

With some more features, this app might become much more interesting,
perhaps even useful.

1. **Server-side transactions database** logging all relevant user actions so these
will be available for later analysis, playback and so on.

2. **User notes** - every user can type in some text or even create multimedia
content. All this will become automatically geocoded and stored in server.

3. **Real-time communication** - users can exchange messages. Technically, these
could be user notes as well.

1. **Find-my-friend** - if I have lost somebody from sight (my map view), then I can
easily position my map to see my friend's whereabouts. It is a good question,
whether this should result in changing my own virtual position or not.

1. **Anything** we can think of.

Whatever we'll do, it should be done in mobile-friendly way.

## Links

[ovela.us/walk](http://ovela.us/walk) is almost identical to our *Starting Point*.
