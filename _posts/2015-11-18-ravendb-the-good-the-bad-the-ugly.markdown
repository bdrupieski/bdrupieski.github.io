---
layout: post
title:  "RavenDB - The Good, the Bad, and the Ugly"
date:   2015-11-18
permalink: ravendb-the-good-the-bad-the-ugly
---

At my day job my team practices polyglot persistence by using a combination of RavenDB and SQL Server. We use RavenDB for our transactional database and for reports replicate data from RavenDB to SQL Server. 

When talking with other software engineers at meetups and other events the topic of day job technology stacks typically comes up and many people are intrigued when I mention that I use RavenDB. I'm frequently asked what it's like and why we chose it. Most of the time the person asking has only used relational databases, so I try to describe RavenDB in terms of how it compares and contrasts with relational databases. I've answered this line of questioning a few times and have converged on a few points that I put into three buckets: the good, the bad, and the ugly. 

# The Good: Storing and retrieving objects is very easy

In RavenDB objects are stored as JSON documents. You do not need an ORM, and without an ORM there are no complex object-relational mappings. If your object graph can be serialized to JSON, you're done. An ORM isn’t needed because there is no impedance mismatch.

Modeling a complex type in a relational database may require dozens of tables and significant configuration for ORM mappings. You may need a dedicated expert on your team to manage these, and once you get everything mapped you may still have a headache of performance issues resulting from the number of joins needed to hydrate an object graph. None of these problems exist in RavenDB because that type is now represented by a single document. 

This story is even more compelling if your data is unstructured, semi-structured, or dynamic. Imagine a type that would be a bear to map, such as one with multiple collections, with sub-collections in those, each storing dynamic data of some sort which can have further nested properties of its own (such as `System.Dynamic.ExpandoObject` in .NET, which is like working with `IDictionary<string, object>`). This can be a chore with an ORM, but with RavenDB is as simple as defining a serializable class.

# The Bad: Querying is harder

Compared to RavenDB, with relational databases you get querying for free. If your database is normalized to at least third normal form, then if you are able to articulate what you want you can write the SQL for it. Thanks to query optimizers and the amount of effort poured into making these systems performant, even if you join many tables the performance will probably be pretty good. If it isn’t, there’s always a way forward; you can start by adding column indexes, progressing to more read-oriented models that start to denormalize the schema.

With RavenDB querying is not free. For every type of query you want to perform, you must write an index that supports that query. This means you need to carefully structure your documents and indexes to support the queries you need.

Some types of queries are very easy in RavenDB. For example, it’s very simple to write an index that supports queries only on properties of a single document. For example, *show me all orders with a price of $8.00 or more* where `Price` is a property of the `Order` document.

Some queries are more difficult. Joins don’t exist in RavenDB. A more complicated query like *show me all orders with a price of $8.00 where the customer name starts with John* that would require a join in a relational database requires a map-reduce index in RavenDB. Map-reduce indexes are like materialized views in relational databases. For every type of join you wish to perform, you will need to write an index specifically for that join.

# The Ugly: Operations

#### Index deployments

Writing indexes doesn't seem so bad until you have to deploy them. Indexes take a long time to build. A really long time. Once you're in production and have a few million documents, new indexes or changes to existing indexes take hours to deploy. While that index is rebuilding, queries against that index will not return complete data. The deployment process has gotten better in [newer versions]( http://ravendb.net/docs/article-page/3.0/Csharp/indexes/side-by-side-indexes) but we still expect to see indexes take up to 10 hours to rebuild in production and up to 48 hours on slower development servers using our production dataset.

####  Queries return incorrect results

About once every few million database updates, an index will not be correctly updated based on document changes. For example, imagine an `Order` document with a `Price` property. If `Price` is changed from $8.00 to $6.50, every once in a while the index will fail to update with this change and will still think the price is $8.00. This means if you query for orders with a price higher than $7.50, you'll get a document that has a price of $6.50 because the index still thinks the price is $8.00.

#### SQL Replication failures

Similar to indexes not updating correctly, we sometimes experience replication failures when replicating from RavenDB to SQL Server for reports, resulting in differences in what is stored in RavenDB versus what is stored in SQL Server. It's hard to know what data to trust when there are so many possible points of failure. 

# Summary

RavenDB boils down to a set of engineering tradeoffs and risks. It's just another tool that might be a good fit depending on your requirements. 

If you have very complex data and a very defined or limited set of queries, it might be a great fit for your project. If you have very simple data and unbounded query requirements, it's likely not a good fit.
