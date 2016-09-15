---
layout: post
title:  "Configurable polymorphic fluent interfaces in C#"
date:   2016-07-20
permalink: fluent-interfaces-csharp
excerpt: Building configurable polymorphic fluent interfaces in C#
comments: true
disqus_identifier: 20160720
---

I recently needed to write a C# wrapper for a quirky REST API. One of the quirks is that most methods take a parameter called "select" that is a comma-separated list of additional sub-parameters representing data you want to retrieve with the call. 

For example, let's say you're retrieving a list of enrollments for a school. If you pass `"user,course,metrics"`, then in addition to enrollment information the call will also return information on the user for each enrollment, what course they're enrolled in, and metrics of the enrollment. You can also drill down further and specify `"course,course.history()"` to get a history of the changes to the course, and even specify ranges of dates for the history with something like `"course,course.history(range,2016-05-01T00:00:00Z,2016-06-01T00:00:00Z)"`. This parameter is like a little domain specific language for specifying what extra data you want returned in a call.

Exposing this parameter in the wrapper as a string seemed like a pretty bad design and hostile to users of the library. You'll know what to pass if you read the API documentation, but as a string it's hard to know what's available. It's also easy to pass invalid parameters, like by misspelling "course" as "cuorse". The total set of possible legal values of the string type is much greater than the total set of possible legal values for this parameter. I would rather represent this using a type where it is only possible to pass legal values and to provide a good IDE auto-complete experience to indicate what can possibly be passed.

A fluent interface to build up this comma-separated list is one way to ensure the wrapper is only provided valid input and to provide documentation on what options are available. For example, instead of passing "user,course,metrics" as a string, a builder could be fluently constructed by:

{% highlight csharp %}
ListEnrollmentsSelectBuilder.Create()
	.User()
	.Course()
	.Metrics()
	.Build();
{% endhighlight %}

More complex calls, with additional attributes specified for higher-level entities, could be constructed by:

{% highlight csharp %}
ListEnrollmentsSelectBuilder.Create()
	.Data()
	.HistoryOn(DateTime.Now)
	.Course(x => x.Data().HistoryOn(DateTime.Now))
	.Domain()
	.User(x => x.Session().Data().HistoryOn(DateTime.Now))
	.Metrics(x => x.AllHistory())
	.Build();
{% endhighlight %}

The above call generates the following string:

`"data,history(on,2016-06-01T00:00:00Z),course,course.data,course.history(range,2016-05-01T00:00:00Z2016-06-01T00:00:00Z),domain,user,user.session,user.data,user.history(all),metrics,metrics.history(all)"`

To ensure that `"course.data"` is only emitted in the presence of `"course"`, `"course.data"` is specified by a sub-builder in a lambda expression inside of the `.Course()` call, as `.Course(x => x.Data())`. 


# Implementing a simple fluent interface

If we build the fluent interface _just_ for this call the code is straightforward. We need a type that defines a collection of strings and for each fluent call appends to that collection its respective element of the comma-separated string.

The base type that defines this collection and methods for adding sub-builder collections to it might look like this:

{% highlight csharp %}
public abstract class SelectBuilder<T> where T : new()
{
    public List<string> SelectItems { get; } = new List<string>();

    public static T Create()
    {
        return new T();
    }

    public string Build()
    {
        return string.Join(",", SelectItems);
    }

    protected void AddSubBuilder<TSubBuilder>(Action<TSubBuilder> action)
        where TSubBuilder : SelectBuilder<TSubBuilder>, new()
    {
        var selectBuilder = new TSubBuilder();
        action(selectBuilder);
        SelectItems.AddRange(selectBuilder.SelectItems);
    }
}
{% endhighlight %}

We can then define a sub-class that contains a method for each sub-parameter in the list:

{% highlight csharp %}
public class ListEnrollmentsSelectBuilder : 
	SelectBuilder<ListEnrollmentsSelectBuilder>
{
    public ListEnrollmentsSelectBuilder Data()
    {
        SelectItems.Add("data");
        return this;
    }

    public ListEnrollmentsSelectBuilder AllHistory()
    {
        SelectItems.Add("history(all)");
        return this;
    }

    public ListEnrollmentsSelectBuilder HistoryOn(DateTime date)
    {
        SelectItems.Add($"history(on,{date.SelectFormat()})");
        return this;
    }

    public ListEnrollmentsSelectBuilder HistoryInRange(DateTime from, 
	DateTime to)
    {
        SelectItems.Add($"history(range,{from.SelectFormat()}{to.SelectFormat()})");
        return this;
    }

    public ListEnrollmentsSelectBuilder Domain()
    {
        SelectItems.Add("domain");
        return this;
    }

    public ListEnrollmentsSelectBuilder Course(
	Action<CourseSelectBuilder> action)
    {
        SelectItems.Add("course");
        AddSubBuilder(action);
        return this;
    }

    public ListEnrollmentsSelectBuilder User(
	Action<UserSelectBuilder> action)
    {
        SelectItems.Add("user");
        AddSubBuilder(action);
        return this;
    }

    public ListEnrollmentsSelectBuilder Metrics(
	Action<MetricsSelectBuilder> action)
    {
        SelectItems.Add("metrics");
        AddSubBuilder(action);
        return this;
    }
}
{% endhighlight %}

The sub-builders are sub-types of SelectBuilder<T> as well, such as CourseSelectBuilder:

{% highlight csharp %}
public class CourseSelectBuilder : SelectBuilder<CourseSelectBuilder>
{
    public CourseSelectBuilder Data()
    {
        SelectItems.Add("course.data");
        return this;
    }

    public CourseSelectBuilder AllHistory()
    {
        SelectItems.Add("course.history(all)");
        return this;
    }

    public CourseSelectBuilder HistoryOn(DateTime date)
    {
        SelectItems.Add($"course.history(on,{date.SelectFormat()})");
        return this;
    }

    public CourseSelectBuilder HistoryInRange(DateTime from, DateTime to)
    {
        SelectItems.Add(
		$"course.history(range,{from.SelectFormat()},{to.SelectFormat()})");
        return this;
    }
}
{% endhighlight %}

This is relatively straightforward with a clear one-to-one mapping between elements in the select parameter and methods in our class with sub-components in another builder class of their own.

# Configurable polymorphic fluent interface

Unfortunately the API I'm wrapping accepts different sub-parameters in the select parameter based on the call. If I wanted to use the above design, I would need to copy it and customize it for every single call I'm wrapping. Although this would be relatively simple since these methods are not complex, this presents an excessive surface area for maintenance and bugs. I'd like to be able to declare a builder type and control what components are available based on the declaration alone, without needing to provide any duplicate implementation. In other words, if multiple wrapped calls can accept the "data" sub-parameter in their select parameter, I'd like to write `SelectItems.Add("data"); return this;` only once for maximum reuse and so that I can use the types polymorphically.

One way to achieve this might be to define a single huge builder class that defines all sub-parameters possible in the API I'm wrapping, and then inherit from that class to hide the sub-parameters that are not available for that API call. Unfortunately this is not possible because it is not possible to change access modifiers of base class methods from a sub-class. It is also not possible to hide them in this way with the C# `new` keyword on the method declaration.

However the same sentiment can be achieved using extension methods. Instead of defining a type that defines all of the possible parameters, an extension method can be defined for each parameter. If each extension method is defined as an extension off of an interface for that specific parameter, then it should be possible to simulate a type containing only the fluent interface signature I want by defining types that implement each interface corresponding to the parameters available for that call. In other words, my `ListEnrollmentsSelectBuilder` now has no implementation of its own. All of its implementation is defined either in extension methods or its base class, meeting my desire to only implement those methods once:

{% highlight csharp %}
public class ListEnrollmentsSelectBuilder : SelectBuilder<ListEnrollmentsSelectBuilder>,
    IWithData, 
    IWithDomain, 
    IWithHistory, 
    IWithCourse, 
    IWithCourseBuilder, IWithCourseData, IWithCourseHistory, 
    IWithUser, 
    IWithUserBuilder, 
    IWithUserData, IWithUserHistory, IWithUserSession, 
    IWithMetrics, 
    IWithMetricsBuilder, IWithMetricsHistory
{ }
{% endhighlight %}

The calling code, e.g. `ListEnrollmentsSelectBuilder.Create().User().Course().Metrics().Build();` looks the same as the previous approach.

Other calls I wrap with their own select parameters can be defined in the same way:

{% highlight csharp %}
public class ListCoursesSelectBuilder : SelectBuilder<ListCoursesSelectBuilder>,
    IWithData, 
    IWithHistory, 
    IWithDomain, 
    IWithDomainBuilder, IWithDomainData,
    IWithBase,
    IWithBaseBuilder, IWithBaseData, 
    IWithEnrollmentMetrics
{ }
{% endhighlight %}

The base class needed for this is mostly the same:

{% highlight csharp %}
public class SelectBuilder
{
    public List<string> SelectItems { get; }

    public SelectBuilder()
    {
        SelectItems = new List<string>();
    }

    public string Build()
    {
        return string.Join(",", SelectItems);
    }

    internal void AddSubBuilder<TSelectBuilder>(Action<TSelectBuilder> action)
        where TSelectBuilder : SelectBuilder, new()
    {
        var selectBuilder = new TSelectBuilder();
        action(selectBuilder);
        SelectItems.AddRange(selectBuilder.SelectItems);
    }
}

public class SelectBuilder<T> : SelectBuilder
{
    public static SelectBuilder<T> Create()
    {
        return new SelectBuilder<T>();
    }
}
{% endhighlight %}

However in order to define extension methods on an interface per parameter, an empty marker interface must be defined for each parameter:

{% highlight csharp %}
public interface IWithData { }

public interface IWithDomain { }
public interface IWithDomainBuilder { }
public interface IWithDomainData { }

public interface IWithCourse { }
public interface IWithCourseBuilder { }
public interface IWithCourseData { }
public interface IWithCourseHistory { }

public interface IWithHistory { }

public interface IWithEnrollmentMetrics { }

public interface IWithMetrics { }
public interface IWithMetricsBuilder { }
public interface IWithMetricsHistory { }

public interface IWithUser { }
public interface IWithUserBuilder { }
public interface IWithUserData { }
public interface IWithUserSession { }
public interface IWithUserHistory { }

public interface IWithBase { }
public interface IWithBaseBuilder { }
public interface IWithBaseData { }
{% endhighlight %}

They're empty since they're used solely for the purpose of defining an extension method only on types that implement that interface. For example, if a type implements IWithData and IWithDomain, like ListEnrollmentsSelectBuilder above, then the extension methods for IWithData and IWithDomain will be available for that type.

The extensions themselves look like this:

{% highlight csharp %}
public static class SelectBuilderExtensions
{
    public static SelectBuilder<T> Data<T>(
	this SelectBuilder<T> builder) 
	where T : IWithData
    {
        builder.SelectItems.Add("data");
        return builder;
    }

    public static SelectBuilder<T> Course<T>(
	this SelectBuilder<T> builder) 
	where T : IWithCourse
    {
        builder.SelectItems.Add("course");
        return builder;
    }

    public static SelectBuilder<T> Course<T>(
	this SelectBuilder<T> builder, Action<CourseSelectBuilder<T>> action) 
	where T : IWithCourseBuilder
    {
        builder.SelectItems.Add("course");
        builder.AddSubBuilder(action);
        return builder;
    }

    /* Additional methods elided */
}
{% endhighlight %}

Note that each extension is constrained to type T where T implements the interface relevant for that parameter. This is what restricts the availability of these methods only to the types that implement those interfaces.

Sub-builders, such as for CourseSelectBuilder in the last extension above, look similar to the first approach but are now all constrained to an interface too: 

{% highlight csharp %}
public static class CourseSelectBuilderExtensions
{
    public static CourseSelectBuilder<T> Data<T>(this CourseSelectBuilder<T> builder) 
	where T : IWithCourseData
    {
        builder.SelectItems.Add("course.data");
        return builder;
    }

    public static CourseSelectBuilder<T> AllHistory<T>(
	this CourseSelectBuilder<T> builder) 
	where T : IWithCourseHistory
    {
        builder.SelectItems.Add("course.history(all)");
        return builder;
    }

    public static CourseSelectBuilder<T> HistoryOn<T>(
	this CourseSelectBuilder<T> builder, DateTime date) 
	where T : IWithCourseHistory
    {
        builder.SelectItems.Add($"course.history(on,{date.SelectFormat()})");
        return builder;
    }

    public static CourseSelectBuilder<T> HistoryInRange<T>(
	this CourseSelectBuilder<T> builder, DateTime from, DateTime to) 
	where T : IWithCourseHistory
    {
        builder.SelectItems.Add(
		$"course.history(range,{from.SelectFormat()},{to.SelectFormat()})");
        return builder;
    }
}
{% endhighlight %}

#### Bonus

If we add an implicit conversion to `string` we can remove the `.Build()` call at the end of each builder invocation:

{% highlight csharp %}
public static implicit operator string(SelectBuilder<T> d)
{
    return d.Build();
}
{% endhighlight %}

This makes the following call possible:

{% highlight csharp %}
string s = ListEnrollmentsSelectBuilder.Create()
    .User()
    .Course()
    .Metrics();
{% endhighlight %}
	
# Conclusion

With the first approach we can build a fluent interface easily, but cannot easily modify or extend it to customize it for specific cases, such as for toggling the presence of `.Course()` or `.User()` options if a specific wrapped call does not expose those options.

With the second approach we can solve the above problem by constructing a type that implements many individual interfaces, with extension methods only on the applicable interfaces. We can configure the fluent interface through type declaration alone by specifying in the type definition which interfaces that type implements.

And what in the world do you call it? I have no idea. When trying to research how to accomplish this, my gut reaction was to call it a _polymorphic fluent interface_. However this isn't really the same as type polymorphism. I want to be able to _configure_ the type, which I suppose is in the same area as type polymorphism in my mind map. I'll go with configurable polymorphic fluent interface. If you have a better idea let me know.

# Code

A complete and working example of the code for the simple fluent interface can be found [here](https://gist.github.com/bdrupieski/c8adbb419a5843e5b1b852f22758dc09).

A complete and working example of the code for the configurable polymorphic fluent interface can be found [here](https://gist.github.com/bdrupieski/30438b0f4356f77610234c3d8f41cf73).