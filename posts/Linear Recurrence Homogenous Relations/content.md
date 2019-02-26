Every programmer has written a program that finds the nth Fibonacci number. Some of you did it with recursion, others went a step ahead and used dynamic programming. Still, even with dynamic programming your algorithm was $O(n)$. We can go even further and write an $O(1)$ algorithm for finding the nth number of any sequence of the type:

*This article will have quite a few equations but they are not as hard to follow as they look so bear with me.*


<div>
$$
a_n = C_1a_{n-1} + C_2a{n-2} + ... + C_ka_{n-k}
$$
</div>

where $k$ is some positive integer, $C_i (i=1,2,\dots,k)$ are some constants and $a_{n-i}$ is the $(n-i)$-th member of the sequence. A sequence defined as above is called a **linear recurrence homogenous relation (LRHR) of order k**.

Clearly, the Fibonacci sequence is a LRHR of order $k = 2$ since it is defined as:

$$
a_n = 1 * a_{n-1} + 1 * a_{n-2}
$$

So how do we calculate the nth Fibonacci number in $O(\log⁡ n)$?

To do so we must find a closed form of our relation. We'll explore how to do that by first giving the general solution to such a problem and then applying it to the Fibonacci sequence as an example.

## Algorithm for solving linear recurrence homogenous relations

1. In the equation

    <div>
    $$
    a_n=C_1 a_{n-1}+C_2 a_{n-2} + \dots + C_k a_{n-k}
    $$
    </div>

    replace all the <span>$a_{n-i}$</span> with <span>$x^{k-i} (i=0,1,…k)$</span> and you get:

    <div>
    $$
    \begin{equation}
    \begin{aligned}

    &x^k=C_1 x^{k-1}+C_2x^{k-2} + \dots + C_{k-1}x + C_k \\\\
    &\text{and let's assign that} \\\\
    &P(x) = x^k-{C_1 x^{k-1}+C_2 x^{k-2}+\dots+C_{k-1} x+C_k}

    \end{aligned}
    \end{equation}

    $$
    </div>

    Call the polynomial $P(x)$ the characteristic polynomial of the relation.

    **Applied to our example:**

    Replacing $a_{n-i}$ as described above yields $x^2 = x + 1$
    Therefore, the characteristic polynomial of the Fibonacci sequence is $P(x) = x^2-x-1$.

1. Find the roots of the characteristic polynomial.

    **Applied to our example:**

    Roots of the Fibonacci's polynomial are $x=\frac {1 ± \sqrt 5} 2$. (Side note: the number $\varphi = \frac {1+ \sqrt 5} 2$ is known as the [Golden Ratio][golden-ratio])

1. Let the roots of the characteristic polynomial be $r\_1, r\_2, \dots ,r\_k$. For now let's assume that all roots are unique. Then the closed form of our sequence is

    <div>
    $$
    a_n = A_1r_1^n+A_2 r_2^n+\dots+A_k r_k^n
    $$
    </div>

    where $A\_i (i=1,2,\dots,k)$ are some unknown (for now) constants.
    We will consider the case in which some roots repeat later.

    **Applied to our example:**

    For the Fibonacci sequence, applying step 3 gives us:

    <div>
    $$
    a_n=A_1 {\left(\frac {1+\sqrt 5} 2\right)}^n + A_2 {\left(\frac {1-\sqrt 5} 2 \right)}^n
    $$
    </div>

1. Assuming that you know the first $k$ members of the sequence, you can now calculate the unknown constants $A_i$ by substituting the values of the first members in the equation of step 3.

    **Applied to our example:**

    The first two members of the Fibonacci sequence are $a\_0=0, a\_1=1$.
    Substitute for $n=0$ and we get:

    <div>
    $$
    0=A_1 {\left(\frac {1+\sqrt 5} 2\right)}^0+A_2 {\left(\frac {1-\sqrt 5} 2 \right)}^0=A_1+A_2
    $$
    </div>

    Substitute for $n=1$ and we arrive at:

    <div>
    $$
    \begin{equation}
    \begin{aligned}

    &1=A_1{\left(\frac {1+\sqrt 5} 2\right)} + A_2{\left(\frac {1-\sqrt 5} 2 \right)} \\\\
    &2=A_1 + \sqrt 5 A_1 + A_2 - \sqrt 5 A_2

    \end{aligned}
    \end{equation}
    $$
    </div>

    But since we already know that $A_1=-A_2$:

    <div>
    $$
    \begin{equation}
    \begin{aligned}

    2 &= A_1+\sqrt 5 A_1+A_2 - \sqrt 5 A_2 \\\\
      &= A_1 + \sqrt 5 A_1-A_1+ \sqrt 5 A_1 \\\\
      &= 2\sqrt 5 A_1

    \end{aligned}
    \end{equation}
    $$
    </div>

    Therefore:

    <div>
    $$
    A_1 = \frac 1 {\sqrt 5} \\\\
    A_2 = -\frac 1 {\sqrt 5}
    $$
    </div>

1. Go back to the equation in step 3 and replace all the $A_i$ with the values that you just calculated to receive the final closed form.

    **Applied to our example:**

    Substitute $A\_1=\frac 1 {\sqrt 5}, A\_2=-\frac 1 {\sqrt 5}$ in $(1)$ and:

    <div>
    $$
    \begin{equation}
    \begin{aligned}

    a_n &= \frac 1 {\sqrt 5} {\left(\frac {1+\sqrt 5} 2\right)}^n - \frac 1 {\sqrt 5} {\left(\frac {1 - \sqrt 5} 2 \right)}^n \\\\
        &= \frac 1 {\sqrt 5}
            \left[
                {\left(\frac {1+\sqrt 5} 2\right)}^n -
                {\left(\frac {1-\sqrt 5} 2 \right)}^n
            \right]

    \end{aligned}
    \end{equation}
    $$
    </div>

    Finally, the closed form of the Fibonacci sequence is:

    <div>

    $$
    \begin{equation}
    \begin{aligned}

    a_n=\frac 1 {\sqrt 5}
            \left[
                {\left(\frac {1+\sqrt 5} 2\right)}^n -
                {\left(\frac {1-\sqrt 5} 2 \right)}^n
            \right]

    \end{aligned}
    \end{equation}
    $$
    </div>

Obviously the above formula can be calculated in $O(\log n)$ because it exponentiation can be computed in $O(\log n)$ so that completes our algorithm.

Here's an [example implementation in C#][c-sharp-impl]. I tested it by computing the first 92 Fibonacci numbers a million times (the 92nd number is the last one that can be stored in a `Int64`). Results prove that direct computation with the formula is $O(1)$ (every number was calculated a million times in ~0.17s), while dynamic programming is slower for all numbers after the 18th. Average running time (over 10 tests):

| Direct formula | Dynamic programming |
| -------------- | ------------------- |
| 14.4s          | 33.575s             |

Here's the same code [implemented in JavaScript][js-impl] for you to play with.

There are a few things to note though:

1. The roots in the Fibonacci sequence are not integers. Therefore, we cannot hope to effectively calculate every single number in the sequence due to floating – point arithmetic errors. Test the example implementations above and see for yourself that the last number to be calculated correctly is the 71st for the C# code and the 75th for the JS one. If the roots were integers it would've been a whole another story.
2. In the JS example, even the dynamic programming approach fails after 78th number due to [the way JavaScript integers work][js-ints-workings]. To see the error, compare the results from our example with [this calculator][error-calc].

## Repeated roots

Now as promised let's take a look at what happens when one of the roots of the characteristic polynomial is repeated in step 3. For simplicity's sake, let's assume that only the first root is repeated and let $m$ denote the number of times it is repeated. The last statement is equivalent to saying that the roots of our polynomial are $r\_1, r\_2, \dots, r\_(k-m)$. In this case, our closed form solution will look like this:

<div>
$$
a_n = (A_1n^{m-1} + A_2n^{m-2} + \dots + A_m)r_1^n + A_{m+1}r_2^n + \dots + A_kr_{k-m}^n
$$
</div>

(Of course if more than one root repeats, do the same)

And since that last equation looks a little horrifying, let's give an example. The characteristic roots of the sequence $a\_n = 4a\_{n-1}-4a\_{n-2}$ are $r\_1 = r\_2 = 2$. Applying what we said above we get the following closed form:

<div>
$$
a_n = (A_1n + A_2)2^n
$$
</div>

Say that the first 2 members of the sequence are $a\_0=0$ and $a\_1=1$ as in the Fibonacci numbers. Substitute for $a\_0=0$ and you get:

<div>
$$
0 = (A_1 * 0 + A_2 )2^0 = A_2
$$
</div>

Substitute $a_1=1$:

<div>
$$
1=(A_1.1+A_2 ) 2^1=(A_1+0)2=2A_1 \\\\
A_1=\frac 1 2
$$
</div>

Therefore the closed form solution of the relation is precisely:

<div>
$$
a_n=\frac 1 2 n2^n=n2^{n-1}
$$
</div>

## Summary

For every linear recurrence homogenous relation there exists a closed form solution. Hence, since you can model any recursive function like a sequence, you can find a closed form for every recursive function knowing only its first few values. It may not always be the case you need the performance boost from using LRHR over DP but it is always a good thing to know that such an algorithm exists if a problem of this kind arises.

Things to note:

* The order $k$ must be a constant. (i.e. the factorial function cannot be solved by the above algorithm since it depends on *all* previous values which is a variable amount)

[golden-ratio]: http://en.wikipedia.org/wiki/Golden_ratio
[c-sharp-impl]: http://pastebin.com/tFhFEn6E
[js-impl]: http://demos.dimitroff.bg/lrhr
[js-ints-workings]: http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-t
[error-calc]: http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibCalcX.html