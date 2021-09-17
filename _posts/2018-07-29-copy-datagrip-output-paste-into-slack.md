---
layout: post
title:  "Copy DataGrip output and paste it into Slack"
date:   2018-07-29
permalink: copy-datagrip-output-paste-into-slack
excerpt: Copy DataGrip output and paste it into Slack
---

Have you ever wanted to copy output from DataGrip... 

![DataGrip output table](/assets/2018-07-29-copy-datagrip-output-paste-into-slack/datagrip_output.png){: .center-this }

...and paste it as a fixed-width table, like this?

```
| id      | date       | isValid | countOfTransactions |
|---------|------------|---------|---------------------|
| 2100045 | 2018-07-28 | 0       | 271                 |
| 2100050 | 2018-07-28 | 0       | 2                   |
| 2100050 | 2018-07-28 | 1       | 2                   |
```

I tried finding a custom DataGrip extractor script to do this. The closest thing
I could find formats it as a Markdown table, which produces text that looks like
this:

```
|id|date|isValid|countOfTransactions|
|----|----|-------|-------------------|
|2100045|2018-07-28|0|271|
|2100050|2018-07-28|0|2|
|2100050|2018-07-28|1|2|
```

But will render a table in Markdown like this:

|id|date|isValid|countOfTransactions|
|----|----|-------|-------------------|
|2100045|2018-07-28|0|271|
|2100050|2018-07-28|0|2|
|2100050|2018-07-28|1|2|

That doesn't help if I want to paste something into Slack, or any other destination 
that can do fixed-width text but won't render a Markdown table from that input. I 
modified one of the Markdown table extractor scripts I found to add whitespace in 
order to do this.

[You can find it in this Gist.](https://gist.github.com/bdrupieski/d18f271680c0952900d389c6c284af55)

It also handles transposed output:

```
| id                  | 2100045    | 2100050    | 2100050    |
| date                | 2018-07-28 | 2018-07-28 | 2018-07-28 |
| isValid             | 0          | 0          | 1          |
| countOfTransactions | 271        | 2          | 2          |
```

Hopefully Google ranks this page highly for some combination of 
"copy", "paste", "DataGrip", "Slack", and/or "fixed width" so this
can help someone else who wants to do the same thing.

The script is not very efficient. Other extractors stream the results,
reading and writing out rows one at a time. In order to determine the 
amount of whitespace to insert I read all rows before writing them 
out. However, since no one is likely to want this kind of output for 
very many rows, this shouldn't be a problem.

#### 2021-09-16 Update

DataGrip has supported this out-of-the-box now for a while with the 'Pretty'
data extractor, so there's no need for a custom data extractor anymore:

![DataGrip pretty output option](/assets/2018-07-29-copy-datagrip-output-paste-into-slack/datagrip-built-in-pretty-data-extractor.png){: .center-this }
