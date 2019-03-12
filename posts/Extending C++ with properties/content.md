I love the programming concept of properties but I've never enjoyed using them in languages that have no native support, C++ being one of them. Properties being the concept of having things behaving like data fields in a class, which actually call functions that can control the flow of data. See examples in [C#](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/properties) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

I came up with an idea on implementing properties and this here is a description on doing that.

#### Quick link to demo

* Get the code from [pastebin][demo-link]

We'll be using a small object to wrap the getter and setter. The object is dependent on the type of the property AND on the type of the class owning the property (you'll see why) thus we need a template:

```cpp
template<typename T, typename P> // P is the property type, T is the owner
class Property
{ };
```

Next, our object must contain the aforementioned getter / setter pair and a reference to the class owning the property.

```cpp
template<typename T, typename P>
class Property
{
private:
    // Function pointers to the getter and setter
    P(*getter)(const T&);
    void(*setter)(T&, P);
    // A reference to our owner
    T& object;
};
```

A property is meaningless without those 3 key components so all of them must be passed on initialization. Secondly, copying a property makes no sense so disable that:

```cpp
Property(T& object, P(*getter)(const T&), void(*setter)(T&, P)):
    object(object),
    getter(getter),
    setter(setter)
{ }

Property(const Property& other) = delete;
Property(Property& other) = delete;
```

Now for the interesting stuff. We can implement the getter using a cast operator - let the compiler do some implicit casting.

```cpp
operator P()
{
    return this->getter(this->object);
}
```

Overriding the assignment operator gets the setter working.

```cpp
P operator=(const P& rhs)
{
    this->setter(this->object, rhs);
    return *this;
}
```
Aaand, that's it. Here's how to use it.

```cpp
class Animal
{
private:
    int legsCount;
    // Our allmighty getter
    static int getLegsCount(const Animal& animal)
    {
        cout << "The getter got called" << endl;
        return animal.legsCount;
    }

    // And his friend the setter
    static void setLegsCount(Animal& animal, int value)
    {
        cout << "The setter got called" << endl;
        animal.legsCount = value;
    }

public:
    // Expose the property. That's safe since the property is immutable.
    Property<Animal, int> LegsCount;

    // Initialize the property
    Animal(int legs) : LegsCount(*this, Animal::getLegsCount, Animal::setLegsCount)
    {
        this->legsCount = legs;
    }
};

int main()
{
    Animal cow(4);
    cout << cow.LegsCount << endl;
    cow.LegsCount = cow.LegsCount + 1; // Radioactive cows can grow another leg
    cout << cow.LegsCount << endl;

    return 0;
}
```

Whenever the property's value is read and used in an expression / function call (such as `cout << cow.LegsCount`), the compiler tries to find a suitable argument conversion to match the signature of the operator / function. He will succeed as long as the property's type itself matches the signature.

On the other hand, setting the value invokes the assignment operator of the property. The operator is defined only for types convertible to `P` so there's nothing you can assign the property to that you can't assign the property value to.

Finally, since the methods' bodies are so tiny, every self-respecting compiler will inline them for zero overhead minus the extra memory for the property object and minus the compilation time increase.

Pretty neat, isn't it? You can check [the demo][demo-link] to see the thing in action.

Note that just because we *can* implement properties this way, doesn't mean we *should*. Don't just blindly go adding properties to your code and think whether you actually need them - C++ users are accustomed to using the pattern `GetFoo()` / `SetFoo(const Foo& foo)` so sometimes this might increase the mental work.

[demo-link]: https://pastebin.com/jjK3jwD6