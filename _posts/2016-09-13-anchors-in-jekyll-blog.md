---
layout: post
title:  "Generate anchors to link to every heading and paragraph in a Jekyll blog post"
date:   2016-09-13
permalink: generate-anchors-in-jekyll-blog-post
excerpt: Generate anchors to link to every heading and paragraph in a Jekyll blog post
comments: true
disqus_identifier: 20160903
---

In this post you can learn how to add clickable links to every header and paragraph in a Jekyll blog post!

# Like this! ➠

I recently wanted to link someone to a specific section of a blog post I had written. However, at the time I had no anchor elements to link to that specific section (which would act <a href='#'>like this underlined text</a> but maybe looks like a button or an icon). To fix this I could've manually added an anchor to link to the section I wanted, uploaded that one change, and used my single and very manually generated link to refer to that specific section of the blog post. However, this could mean many manually generated links in the future which isn't a very clean solution. Is there some way I could automatically generate anchor elements to link to every header and paragraph in *all* of my blog posts? 

This blog is currently a [Jekyll](https://jekyllrb.com/) site. Each post is written in [markdown](https://en.wikipedia.org/wiki/Markdown) and then converted to a static HTML page by Jekyll. Hooking into the markdown to HTML conversion process probably isn't practical, but generating links programmatically for every paragraph or header element using JavaScript is probably easy.

After some research I found two libraries that can do this: [anchorify](https://github.com/willdurand/anchorify.js) and [anchorjs](http://bryanbraun.github.io/anchorjs/). The examples for anchorjs showing a clickable chain link icon next to headers was exactly what I was looking for, and the anchorjs code examples looked simple enough so I went with it.

Here's how you can do it too.

# 1. Download jQuery and anchorjs

You can get anchorjs from the [releases page of its GitHub repo](https://github.com/bryanbraun/anchorjs/releases). Get jQuery from its [downloads](https://jquery.com/download/) page. Download the compressed, production version.

Put `anchor.min.js` and `jquery-3.1.0.min.js` in `\assets\global` in your Jekyll directory. Your version of jQuery might be different. The version doesn't really matter.

# 2. Use them!

Below the header element in `\_layouts\post.html` reference the two files you just added:

```html
<script src="assets/global/anchor.min.js"></script>
<script src="assets/global/jquery-3.1.0.min.js"></script>
```

Now below that, specify a script section and add the following snippet:

```html
<script>
	$(function() {
		anchors.options.visible = 'always'; 
		anchors.add('.post-content > h1, h2, h3, h4, h5, h6');
	});
</script>
```

If you only want links on every header, you're done!

To add them to every paragraph when the user hovers over that paragraph like in this post, add this below the above `anchors.add` call:

```js
anchors.options.icon = '❡';
anchors.options.placement = 'left';
anchors.options.visible = 'hover';
anchors.add('.post-content > p');
```

# Images and Tables

anchorjs works by taking the id of an element its generating an anchor element for and using that id in the href property of the anchor tag. If no id exists, it takes the text content of the element and 'urlify'ies it to sanitize the text and uses that in the anchor href.

#### Images

In my Jekyll template image (img) elements are added inside paragraph (p) elements with no text content in the paragraph element. Since there's no text content in the paragraph elements with images in them, it won't generate valid ids for these elements. If you specify alt text for your image, this snippet will extract that alt text, urlify it the same way anchorjs does, and set it as the id of the paragraph element so anchorjs can correctly generate anchor for it:

```js
// if a p only has an img inside of it, urlify the alt text 
// of the img and set that as the p's id so anchors can use it
$(".post-content > p > img").each(function(idx, el) { 
	var $el = $(el);
	var idText = anchors.urlify("img-" + $el.attr("alt")); 
	$el.parent().attr("id", idText); 
});
```

Here's an example of it in action:

![picture of purple mountains](/assets/anchorsinjekyllblogpost/purplemountains.jpg){: .center-this }

#### Tables

I also wanted to generate anchors for tables. There's no standard meta-data for tables like there is with the alt property for images to extract and use for the id text. However, I can still define the alt property myself if I want a customized id text to make the links look nicer other than an incremented number for the index of the table on the page. This snippet will pick up this alt property and set the table's id with it:

```js
// if a table has the "alt" property, use it to set the table's 
// id otherwise just use the index of that table within .post-content
$(".post-content > table").each(function(idx, el) { 
	var $el = $(el);
	var uniqueTextForTable = $el.attr("alt") ? $el.attr("alt") : idx;
	var idText = anchors.urlify("table-" + uniqueTextForTable); 
	$el.attr("id", idText); 
});
```

And then use it by explicitly telling anchorjs to generate anchors for table elements: 

```js
anchors.add('.post-content > table');
```

Now this table has an anchor:

| Column | Column |
|--------|--------|
| row    | row    |
| row    | row    |
{: alt="some random table" }

This is the fully integrated script:

```html
<script>
	  $(function() {
		// if a p only has an img inside of it, urlify the alt text 
		// of the img and set that as the p's id so anchors can use it
		$(".post-content > p > img").each(function(idx, el) { 
			var $el = $(el);
			var idText = anchors.urlify("img-" + $el.attr("alt")); 
			$el.parent().attr("id", idText); 
		});
		// if a table has the "alt" property, use it to set the table's 
		// id otherwise just use the index of that table within .post-content
		$(".post-content > table").each(function(idx, el) { 
			var $el = $(el);
			var uniqueTextForTable = $el.attr("alt") ? $el.attr("alt") : idx;
			var idText = anchors.urlify("table-" + uniqueTextForTable); 
			$el.attr("id", idText); 
		});
		anchors.options.visible = 'always'; 
		anchors.add('.post-content > h1, h2, h3, h4, h5, h6');
		anchors.options.icon = '❡';
		anchors.options.placement = 'left';
		anchors.options.visible = 'hover';
		anchors.add('.post-content > p');
		anchors.add('.post-content > table');
	  });
  </script>
```

Check out my full `\_layouts\post.html` [here in my GitHub repository for this blog](https://github.com/bdrupieski/bdrupieski.github.io/blob/master/_layouts/post.html).