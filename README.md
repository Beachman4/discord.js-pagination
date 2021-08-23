<div align="center">
  <p>
    <a href="https://nodei.co/npm/discord.js-pagination
/"><img src="https://nodei.co/npm/discord.js-pagination.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>


# discord.js-pagination
A simple utility to paginate discord embeds. Built on discord.js@^12.0.0 (master) but should work on older versions. Compatible with MessageEmbeds, RichEmbeds (not tested). Pages are embeds.

# Installation
* `npm install discord-pagination`

# Notice

There are 2 ways you can use this package. First, you can build a full list of pages. This can be good for smaller data sets, but if you're working with larger data sets from a database, this can cause lag on the database.

The other way works much better with large datasets.

# Usage
### Entire Page List version
```js
// Import the discord.js-pagination package
const paginationEmbed = require('discord.js-pagination');

// Use either MessageEmbed or RichEmbed to make pages
// Keep in mind that Embeds should't have their footers set since the pagination method sets page info there
const { MessageEmbed } = require('discord.js');
const embed1 = new MessageEmbed();

// Create an array of embeds
pages = [
	embed1,
	embed2,
	//....
	embedn
];

// Call the paginationEmbed method, first two arguments are required
// emojiList is the pageturners defaults to ['⏪', '⏩']
// timeout is the time till the reaction collectors are active, after this you can't change pages (in ms), defaults to 120000
paginationEmbed.paginateEmbedFullList(msg, pages, emojiList, timeout);
// There you go, now you have paged embeds
```

### Per page version
```js
function getTotalResults(limit) {
  // Return total number of results to calculate how many pages
  return 100
}

function getPage(page, limit, extraData = {}) {
  // Call database or something else using page, limit and extradata
  
  // Extra data is something you pass in, so for example, if we have a list of people and a person runs a command to get all persons with the name John, you would pass John into extradata to be used in this function
  
  return embed;
}

// Like above, emoji list defaults to the above list and timeout defaults to 120 seconds. When passing in a value, multiple seconds by 1000
paginationEmbed.paginateEmbedPerPage(message, await getPage(1, 10), 10, await getTotalResults(10), getPage, emojiList, timeout)

```
# Preview
![Demo](https://raw.githubusercontent.com/saanuregh/discord.js-pagination/master/example/demo.png)
Here is the package used for paging song queue.
