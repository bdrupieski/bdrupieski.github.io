---
layout: post
title:  "Conway's Game of Life in TypeScript"
date:   2015-11-11
permalink: game-of-life-typescript
excerpt: Implementing the Game of Life using the HTML5 Canvas API and obelisk.js
---

For developer interviews at my current company we give candidates a programming test. We sit them down with a laptop and during the interview have them code up a solution to a very simple exercise involving some basic object-oriented concepts. A lot of people can't do it. This often makes us think we need to change our test or maybe have people complete it at home, then when they come in they can talk through their implementation with us.

I recently proposed using Conway's Game of Life as an exercise for candidates to complete at home and then come in to talk about their code. Since our stack is .NET and we mostly use C# I wrote [one possible model solution](https://github.com/bdrupieski/GameOfLife) in C# using one of the simplest ways to render cells that I could think of: writing characters to the console.

![game of life blue and green blocks in console](/assets/gameoflifetypescript/gameoflifecsharpconsole.gif){: .center-image }

It works but is crude. The dimensions of the cells can't easily be changed and showing more than two colors at a time is a pain.

For fun I thought I'd try the same exercise using the HTML5 Canvas API with TypeScript. The amount of Canvas API knowledge you need to do this is both a disappointment and a relief:

{% highlight javascript %}
this.ctx.fillRect(x, y, 1, 1);
{% endhighlight %}

That's it. I'm drawing 1x1 rectangles at the coordinates (x, y). 

OK, I lied. You also need to initialize the HTMLCanvasElement and CanvasRenderingContext2D, but that just gets copied from somewhere off the internet anyway:

{% highlight javascript %}
this.canvas = <HTMLCanvasElement>document.getElementById('board');
this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
{% endhighlight %}

Here's one frame of the end result:

![game of life black and white space filler](/assets/gameoflifetypescript/gameoflifespacefiller.png){: .center-image }

[Click here](/assets/gameoflifetypescript/GameOfLife.html) to see it live. I'm using the [space filler pattern](https://en.wikipedia.org/wiki/Spacefiller) to generate a more exciting initial state than setting the board to a random state.

When implementing this I came across [obelisk.js](https://github.com/nosir/obelisk.js/), a JavaScript library for drawing isometric 3D objects, and figured I'd try implementing the Game of Life using it. At the time I started, however, there existed no TypeScript type definitions for obelisk.js, and in order to use a JavaScript library from TypeScript you *must* statically define all functions and types you use. Fortunately this is not very difficult, and obelisk.js is designed so well that after I started declaring the functions and types I needed it wasn't too much to do it for the rest of the library. I contributed the definition file to [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped).

One minor annoyance when writing the definition file was that TypeScript didn't support abstract classes until 1.6, released shortly after I wrote the definition. obelisk.js has a few abstract classes. For example, `Cube` has `AbstractPrimitive` in its prototype chain:

{% highlight javascript %}
var Cube, p;
Cube = function(dimension, color, border, useDefaultCanvas) {
    // elided
};
p = Cube.prototype = new obelisk.AbstractPrimitive();
{% endhighlight %}

It does not make sense for consumers of this library to create instances of `AbstractPrimitive`, and unfortunately without abstract classes this cannot be statically enforced.

Here's one frame of the end result:

![game of life using obelisk showing green cubes](/assets/gameoflifetypescript/gameoflifeobelisk.png){: .center-image }

[Click here](/assets/gameoflifetypescript/GameOfLifeObelisk.html) to see it live. The code can be found [here](https://github.com/bdrupieski/GameOfLifeTypeScript).