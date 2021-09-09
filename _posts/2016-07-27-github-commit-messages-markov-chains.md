---
layout: post
title:  "Generating commit messages using GitHub and Markov Chains"
date:   2016-07-27
permalink: github-commit-messages-markov-chains
excerpt: Generating commit messages using GitHub and Markov Chains
comments: true
disqus_identifier: 20160727
---

A few years ago I saw someone had shaped letters out of git commits to form their name on their GitHub profile contribution graph. I thought this was a really cool idea and so I set to do the same thing for myself to see how easy or hard it would be. There are many other projects that do the same thing but I wanted to do it myself. I ended up writing a very small C# app to do it using lib2git. Chances are at any point you can probably see my name written in commits somewhere on my GitHub profile contribution graph.

![screenshot of portion of github contribution graph with the name 'brian' spelled out in commit messages](/assets/2016-07-27-github-commit-messages-markov-chains/github_graph.png){: .center-this }

However for a long time my fake commits had a very boring commit message: a single period. I thought, wouldn't it be cool to generate realistic commit messages, maybe from a markov chain generator seeded with real commit messages scraped from GitHub?

A while ago I attended an Apache Spark workshop where we did something similar but with Enron e-mails instead of GitHub commit messages. I wrote a [markov chain text generator in C#](https://github.com/bdrupieski/MarkovChainTextGenerator) one night inspired by [code from the workshop](https://github.com/jt-halbert/spark-workshop/blob/master/followalong-20151206.scala). 

More recently, I retrieved all commit messages from the top 1,000 repositories (by stars) on GitHub for a few languages. This took a while since GitHub rate limits you to 5,000 API calls an hour, meaning I could only retrieve about 150,000 commit messages an hour.

All commits in the top 1,000 repositories amounts to the following number of commit messages by language:

| Language   | # Commits |
|------------|-----------|
| Python     | 2,045,273 |
| JavaScript | 1,277,640 |
| Java       | 1,732,027 |
| C#         | 1,225,178 |
| Scala      | 643,811   |
| Ruby       | 1,676,239 |
| ObjectiveC | 348,195   |
| PHP        | 1,884,030 |

That's a total of 10,832,393 commits retrieved from GitHub.

One neat feature of markov models is that they can determine the _most_ probable generated sentence from a given corpus. After building a markov model with each language's respective commits, here are the _most_ probable sentences from each language's set of commits:

| Language   | Most probable sentence |
|------------|-----------|
| Python     | Merge pull request #1 from wbond/master Update  |
| JavaScript | Merge pull request #1 from RubyLouvre/master merge avalon  |
| Java       | Merge pull request #1 from alibaba/master merge  |
| CSharp     | Merge pull request #1 from PFCKrutonium/master things  |
| Scala      | Merge pull request #1 from apache/master   |
| Ruby       | Merge pull request #1 from citation-style-language/master Update  |
| ObjectiveC | Merge pull request #1 from jeffreyjackson/patch-1 Update README.md   |
| Php        | Merge pull request #1 from woothemes/master Update  |

A little anti-climactic, but it makes sense. What's the one thing almost all repositories on GitHub have in common? They merge pull requests.

Here's a sample of likely commit messages for Java:

- Push method changed to call getDistanceFromView(), causing an NPE.
- WFLY-6127 Throw IllegalStateException if DynamicChannelBuffer exceed the renderer is destroyed e.g. in a merge issue 
- extract collision detectors for Java Maps 
- Fix a problem in the DefaultDaemonConnector and made MessagesController more restful 
- Add missing failure when a drawable in our palette, which leads to wrong cluster resource to suppress the compiler's complaint 

I generated 5,000 likely messages from the C# model and then sampled within those to use as messages for my fake commits. If you want to see them in action, look at my GitHub profile and check out the repository with fake commits that spells out my name. Maybe my next project could be to generate fake code diffs.

Here are 1,000 likely messages generated from the model for each language:

- [Python](/assets/2016-07-27-github-commit-messages-markov-chains/python.txt)
- [JavaScript](/assets/2016-07-27-github-commit-messages-markov-chains/javascript.txt)
- [Java](/assets/2016-07-27-github-commit-messages-markov-chains/java.txt)
- [C#](/assets/2016-07-27-github-commit-messages-markov-chains/csharp.txt)
- [Scala](/assets/2016-07-27-github-commit-messages-markov-chains/scala.txt)
- [Ruby](/assets/2016-07-27-github-commit-messages-markov-chains/ruby.txt)
- [ObjectiveC](/assets/2016-07-27-github-commit-messages-markov-chains/objectivec.txt)
- [PHP](/assets/2016-07-27-github-commit-messages-markov-chains/php.txt)
