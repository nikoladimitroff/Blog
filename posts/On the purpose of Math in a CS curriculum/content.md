
It's been a while since I started [teaching programming at academia](http://dimitroff.bg/intro-to-programming-materials/) and the question of 'Why is there so much math in our curriculum?'* has been raised often by students. It's not like this hasn't been answered quadrillion [times][opinion-1][with][opinion-2] [highly][opinion-3] [varying][opinion-3] [results][opinion-4], but I'd rather put forth my own understanding of the reasons behind it.

## A distant beginning

Think of the first time someone explained to you what a programmer does.

> A programmer writes code for your computer to run!

...he might've said. Or perhaps you've looked up [programmer on Wikipedia][programmer-wiki]:

> A programmer, computer programmer, developer, dev, coder, or software
> engineer is a person who writes computer software.

Now what's the deal with that *computer* prefix in *computer programmer*? And if the programmer's job is to program computers by definition, why does one have to use *computer* in front of it?

Here's the key part - programming is not about computers. It's about coming up with formally specified, sound algorithms to make *something* run in a predictable, most-often repeatable, most-often deterministic manner. Note that *something* may be a computer, but it may also be an arbitrary device or even a living creature. Let me put some examples:

* DNA programs the process of cell multiplication
* An electrical engineer programs the heating process of an oven by connecting
the proper components at the proper junctions
* A pupil programs his summer vacation day by scheduling what TV shows to watch
and when to play with his neighbour's child

These are all examples of programming and none of them have anything to do with computers. In fact, there's an entire branch of Mathematics called programming aka [mathematical optimization][math-optimization] which deals with the best way to allocate some fixed resources in order to achieve a given goal. That is, it finds the best way to _program_ a process.

It just happens that as of now, programming is most effective when done by writing code on a computer. Similarly, a personal driver's job is most effective when driving a car but it used to be about driving carriages 100 years ago. Tools certainly improve the job, but they do not define it.

To reify this point let me ask you a question. IT companies often employ consultants for the sole purpose of suggesting an architecture / algorithm improvement. Would you say these consultants or even your own's system architects aren't programmers just because they don't write code but instead produce specifications and suggestions?

## Back to math

Bulgarian high-schoolers learn mathematics by doing.<sup>1</sup> Teachers present new topics by introducing concrete problems, instead of showing what drives the creation of the solution.

* *Here, find $x$ in this equation*
* *But I don't know how!*
* *Just move this number and this expression on the other side and you are done*

A minority of students will learn from it. Most will lose interest in Math as they don't see any practical application for learning how to move expressions on the opposite sides of an equation. Some years later, for the same reason, they wouldn't see practical applications in computing the derivative of irrational functions. It makes children wonder how can this even be a real job. I would suggest that they imagine asking any professional mathematician, about how they make their living, to result in:

> My day-to-day work involves manually doing immensely boring, computational work on paper
> including, but not limited to finding exes and triangle sides.
>
> -- <cite>No Mathematician Ever</cite>

Math is not about computation, it's about modelling - describing in an abstract, formal language what something is, what governs its existence and what facts stem from this description. Math doesn't care about finding $x$. It cares about creating a model for describing sets of values which are bound together via relations. And Math isn't the only modelling framework - OOP and other programming paradigms are modelling frameworks too but they focus on completely different representations.

## $Math \longleftrightarrow Programming$

Just as programming is not about writing code, math is not about raw computation. Sure, the value of both would be greatly diminished if code & computation didn't exist but in the end that's not what defines either.

When you put both subjects into that perspective it becomes clear how they complement one another - math helps you describe what you are working on, programming helps you describe how to achieve it. If you think about it, those are the two sides of the same coin - an algorithm can be described by saying what its inputs, outputs and the relations between its inputs and outputs are and a mathematical construction can be described using a set of programming statements! The programming-math relationship is the same as recursion-vs-iteration - they complete the same task using different approaches which have their own characteristics, allow for different extensions, learning each is a skill on its own and in many situations you can hardly solve the problem without using a specific tool.

As any tool metaphor goes - if you only have a hammer, everything will look like a nail and you'll try to [hammer your way into problems that required a screwdriver][hammer-screwdriver].

This is the moment someone screams *BUT I DON'T NEED MATH TO GET X WORKING!* at me. Sure, you don't need it. Just like how solving the trivial equations in school didn't require you to understand the full picture. There's plenty of room for people believing that code is the most important outcome of their job. If you are working on the next PHP blogging platform or on the next micro-service-based JS framework - you will be fine without math. [Go write the package manager 90% of Google's techies use even.](https://twitter.com/mxcl/status/608682016205344768)<sup>2</sup> Nonetheless, should you choose to work on something challenging enough the benefits of the Math-Programming symbiosis are there for your taking.

What do fancy trending word such as machine learning and AI mean? ML algorithms are absolutely unusable without understanding their background - you can sort lists without knowing how a sorting procedure works but you cannot reason about the effectiveness of your neural network without understanding the model behind it. What does it take for your HTML and CSS to appear on screen and be pretty? How are games made? What makes the CGI in Hollywood movies so indistinguishable from reality? And no, none of the above are learnable 'in a day, if I need them', there's a reason each can be covered within at least one university course.

The question is what would you rather do. A programmer with no math skills can confidently work at a very good level. A programmer with [deep][programmer-1] [understanding][programmer-2] [of math][programmer-3] can move the industry and the world forward. Higher education has obviously made a choice about creating people that can change the world when designing the standard CS curriculum. If that's not your thing - there's nothing wrong with it, but be aware of your limits.

<sup>1</sup> I'd wager math education is virtually the same in most of the world.

<sup>2</sup> I don't mean that as an undervaluation of the work of people writing PHP blogging platforms.
Their work is irreplaceable and I highly value it. Heck, this blog used to run on WordPress!

[opinion-1]: https://stackoverflow.com/questions/157354/is-mathematics-necessary-for-programming
[opinion-2]: https://www.quora.com/What-is-the-relation-between-programming-and-mathematics
[opinion-3]: https://www.cs.virginia.edu/~evans/cs655/readings/ewd498.html
[opinion-4]: http://www.sarahmei.com/blog/2014/07/15/programming-is-not-math/
[opinion-5]: http://www.skorks.com/2010/03/you-dont-need-math-skills-to-be-a-good-developer-but-you-do-need-them-to-be-a-great-one/
[programmer-wiki]: https://en.wikipedia.org/wiki/Programmer
[math-optimization]: https://www.wolframalpha.com/examples/Optimization.html
[hammer-screwdriver]: http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/
[programmer-1]: https://en.wikipedia.org/wiki/Edsger_W._Dijkstra
[programmer-2]: https://en.wikipedia.org/wiki/Donald_Knuth
[programmer-3]: https://en.wikipedia.org/wiki/Peter_Norvig