import { Message } from 'discord.js';

export async function paginateEmbedFullList(msg: Message, pages, emojiList = ['⏪', '⏩'], timeout = 120000): Promise<Message> {
  if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
  if (!pages) throw new Error('Pages are not given.');
  if (pages.length == 0) throw new Error('Pages should not be empty')
  if (emojiList.length !== 2) throw new Error('Need two emojis.');
  let page = 0;
  const curPage = await msg.channel.send(
    {
      embeds: [
        pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)
      ]
    }
  );
  for (const emoji of emojiList) await curPage.react(emoji);

  const filter = (reaction, user) => {
    return emojiList.includes(reaction.emoji.name) && !user.bot
  }


  const reactionCollector = curPage.createReactionCollector({
    filter,
    time: timeout
  });
  reactionCollector.on('collect', reaction => {
    reaction.users.remove(msg.author);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[1]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
    curPage.edit({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)]
    });
  });
  reactionCollector.on('end', () => {
    if (!curPage.deleted) {
      curPage.reactions.removeAll()
    }
  });
  return curPage;
};
