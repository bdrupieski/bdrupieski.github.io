---
layout: post
title:  "Indeed.com tech job trends from 7/2015 to 7/2016"
date:   2016-08-01
permalink: indeed-tech-job-trends
excerpt: Indeed.com tech job trends from 7/2015 to 7/2016
---

A few years ago out of curiosity I started recording counts of the number of jobs on indeed.com every week for specific tech keywords in specific metropolitan areas. The original motivation for doing this was to spot software development job trends relevant to my interests to try to gauge the relative popularity or popularity trends of specific technologies for cities across the U.S.

After a few weeks of manually recording these numbers in a spreadsheet I realized I could write a program to do this a lot faster and for more keywords and more cities. I wrote a small C# program to loop over a few keywords and a whole bunch of cities. [Here](/assets/indeedtechjobtrends/cities.txt) are the cities and [here](/assets/indeedtechjobtrends/keywords.txt) are the keywords I used. I ran searches for both 25 and 50 mile distances within the selected city.

I ran it somewhat sporadically since once I wrote the program to automate this task I, of course, lost interest in the data or the prospect of eventually doing anything with it. When cleaning up some files I accidentally deleted a few months of recorded data (oops), however in July 2015 I set up a scheduled task to run it consistently every week so that given time I might have enough accumulated data to eventually play with it.

Now that July 2016 has ended a little over a year has passed so I thought I might take a look at it. I don't really care about applying rigorous statistical analysis to this data -- I really just want to plot it and see if anything obvious pops out.

Adding all the jobs within a 25 mile radius for all cities and keywords searched results in a disappointing -0.3% loss for the past year, starting and ending with 174,251 and 173,710 jobs respectively. I would have thought there'd be at the very least a modest net gain for tech jobs for a whole year, however this may just be because of the specific keywords I chose -- they could be doing far worse than the rest of the market.

![Sum of all jobs within 25 miles of all cities by date showing a pretty flat line](/assets/indeedtechjobtrends/all_jobs.png){: .center-this }

This isn't accurate since some of the keywords overlap, resulting in counting the same job multiple times. Some of the cities I searched overlap within 25 miles of each other too. For example, many jobs between Washington D.C. and Baltimore would be counted twice here.

Despite the above caveats it's interesting that there's a dip at the new year (175,822 on 1/4/2016) and a peak at the beginning of March (198,214 on 3/7/2016). I wonder if this is possibly because hiring slows around the holidays and then picks up the slack in the first quarter of the new year. However this may be noise, or variations due to employers posting on indeed at some times of the year and not others, or perhaps a cull of spam/duplicate postings around Christmas and a surge of them around the end of February, followed by another cull.

When breaking apart the above chart by keyword it seems the general trend of a dip at the end of the year and a peak by March holds.

![All jobs by keyword within 25 miles of all cities](/assets/indeedtechjobtrends/all_jobs_by_keyword.png){: .center-this }

However the total number of jobs by keyword changed over the year:

| Keyword          | Postings ± | % change |
|------------------|------------|----------|
| angular          | 2,429      | 31.3%    |
| C#               | -2,560     | -9.7%    |
| C# mvc           | -389       | -6.3%    |
| C# mvc angular   | 495        | 51.1%    |
| C++              | -1,826     | -7.0%    |
| java             | -4,418     | -7.0%    |
| machine learning | 3,019      | 34.7%    |
| python           | 1,876      | 5.8%     |
| scala            | 833        | 25.4%    |
| Total		       | -541       | -0.3%    |

Across all cities these keywords have some variation between them. However, what about the jobs for specific cities?

I initially started this with simply way, way too many cities. My thinking at the time was that maybe some specific keyword was _really_ popular in some smaller city. This doesn't happen. The top 10-15 or so cities dominate for every keyword I searched for. To give you an idea of the distribution visually here's a chart of all jobs within 25 miles by city. Each line represents the number of jobs for each city I searched throughout the year. I excluded the legend because it's just simply too many cities.

![All jobs by each city](/assets/indeedtechjobtrends/all_jobs_by_city.png){: .center-this }

This becomes a little more readable when limited to only the top 10 cities.

![All jobs within 25 miles for the top 10 cities](/assets/indeedtechjobtrends/top_10_cities_total_jobs.png){: .center-this }

From the chart we can see New York has lost a lot of postings over the past year. San Francisco seems to have dropped too. Here are the numbers:

| City              | Postings ± | % change |
|-------------------|------------|----------|
| Boston, MA        | 599        | 6.0%     |
| Chicago, IL       | 1,939      | 30.6%    |
| Columbia, MD      | 590        | 8.6%     |
| Dallas, TX        | 435        | 8.9%     |
| Los Angeles, CA   | -361       | -5.9%    |
| New York, NY      | -4,217     | -21.8%   |
| San Francisco, CA | -1,040     | -7.4%    |
| San Jose, CA      | -479       | -2.9%    |
| Seattle, WA       | 2,083      | 24.8%    |
| Washington, DC    | 1,821      | 11.7%    |
| Grand Total       | 1,370      | 1.3%     |

New York dropped quite a bit. San Francisco to some degree too. Seattle and Chicago had a great year and Washington, D.C. had modest growth.

I'm a little shocked New York dropped so much. Is the tech job market collapsing there? As I mentioned earlier there are problems with this data, like the overlap between the keywords I'm using. To try to eliminate this, let's look at each city only looking at the number of Java job postings.

![Java jobs within 25 miles of the top 10 cities](/assets/indeedtechjobtrends/java_jobs_top_10_cities.png){: .center-this }

| City              | Postings ± | % change |
|-------------------|------------|----------|
| Atlanta, GA       | -63        | -3.1%    | 
| Boston, MA        | -231       | -6.7%    | 
| Chicago, IL       | 326        | 16.1%    | 
| Columbia, MD      | 8          | 0.3%     | 
| Dallas, TX        | 54         | 2.8%     | 
| New York, NY      | -2,069     | -29.6%   | 
| San Francisco, CA | -836       | -16.4%   | 
| San Jose, CA      | -299       | -5.5%    | 
| Seattle, WA       | 464        | 18.8%    | 
| Washington, DC    | 259        | 3.9%     | 
| Grand Total       | -2,387     | -6.1%    | 

The drops in New York and San Francisco are even more pronounced. Let's look at each of these a little more closely.

Instead of charts I'll just show the data.

### New York by keyword (25 miles)

| Keyword          | Postings ± | % change |
|------------------|------------|----------|
| angular          | 83         | 9.3%     | 
| C#               | -816       | -31.6%   | 
| C# mvc           | -93        | -20.5%   | 
| C# mvc angular   | 49         | 86.0%    | 
| C++              | -854       | -30.7%   | 
| java             | -2,069     | -29.6%   | 
| machine learning | 55         | 6.1%     | 
| python           | -544       | -13.3%   | 
| scala            | -28        | -4.6%    | 
| Grand Total      | -4,217     | -21.8%   | 

Big losses in C#, C++, Java, and Python. If you know machine learning and angular you're still OK.

### San Francisco by keyword (25 miles)

| Keyword          | Postings ± | % change |
|------------------|------------|----------|
| angular          | 41         | 6.1%     |
| C#               | -131       | -13.7%   |
| C# mvc           | -35        | -22.6%   |
| C# mvc angular   | -1         | -2.9%    |
| C++              | -160       | -9.1%    |
| java             | -836       | -16.4%   |
| machine learning | 195        | 18.4%    |
| python           | -188       | -5.0%    |
| scala            | 75         | 12.3%    |
| Grand Total      | -1,040     | -7.4%    |

Similar story as New York, but not as bad.

### Chicago by keyword (25 miles)

| Keyword          | Postings ± | % change |
|------------------|------------|----------|
| angular          | 334        | 100.6%   |  
| C#               | 173        | 14.3%    |  
| C# mvc           | 158        | 45.7%    |  
| C# mvc angular   | 114        | 167.6%   |  
| C++              | 139        | 16.7%    |  
| java             | 326        | 16.1%    |  
| machine learning | 203        | 67.2%    |  
| python           | 413        | 36.5%    |  
| scala            | 79         | 86.8%    |  
| Grand Total      | 1,939      | 30.6%    |  

### Seattle by keyword (25 miles)

| Keyword          | Postings ± | % change |
|------------------|------------|----------|
| angular          | 172        | 72.3%    |    
| C#               | 149        | 8.6%     |    
| C# mvc           | -4         | -1.6%    |    
| C# mvc angular   | 2          | 4.7%     |    
| C++              | 320        | 20.1%    |    
| java             | 464        | 18.8%    |    
| machine learning | 360        | 58.3%    |    
| python           | 531        | 40.2%    |    
| scala            | 89         | 61.8%    |    
| Grand Total      | 2,083      | 24.8%    |    

### Conclusions?

If we could trust this data, what kind of conclusions could be tenatively draw?

- Tech job postings are pretty flat across the country as a whole.
- Job postings trend down at the end of the year and spike in the first quarter.
- New York and San Francisco might be going through a contraction.
- The Chicago and Seattle tech job markets are growing.
- Within a 25 mile radius Washington D.C. has more jobs for these keywords than San Jose, New York, or San Francisco. Weird.

However we really can't trust this data. Any patterns and conclusions we think we might be able to draw could be completely spurious. It's fun to look at but to review, here are some problems with this data and why we shouldn't actually draw any conclusions from it at all:

- Jobs are counted multiple times. They're counted multiple times because of:
  - Similarity between keywords. For example, the same job could appear for "java", "scala", and "machine learning" if the posting contained all of those keywords.
  - The geographical regions for some of the cities overlap. For example, even within a 25 mile radius some jobs will show up for all of Washington D.C., Baltimore, MD, and Columbia, MD.
- This data is only from indeed.com. It may only represent changes in the postings for this particular site. For example, any change in any keyword for any city may simply be due to how companies and recruiters in that particular part of the industry were using recruiting tools at that particular time. It's possible that recruiters in New York as a whole tended to migrate away from indeed.com over the past year and relied more on other methods.
- The counts I recorded are for job _postings_ and not _jobs_. I used a job posting as a proxy for a job every time I used the word job in this post. A single job can be posted multiple times and by multiple recruiters. Many jobs are also not posted to sites like indeed.com at all.

I am now quite sick of making charts and formatting tables in markdown. I'm very tired of thinking about where tech jobs are. The most important job is the one you have. If you'd like to play around with this data [here is the file I used](/assets/indeedtechjobtrends/results.csv) to prepare this post. The code used to generate that file is [here](https://github.com/bdrupieski/IndeedKeywordTrends).