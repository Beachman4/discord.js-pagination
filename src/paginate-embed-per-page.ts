import { Message, MessageEmbed } from 'discord.js';

export async function paginateEmbedPerPage(msg: Message, initialPage: MessageEmbed, limit: number, totalPages: number, fetchPageFunction: (page: number, limit: number, extraData: any) => Promise<MessageEmbed | null>, extraData: any = {}, emojiList = ['⏪', '⏩'], timeout = 120000): Promise<Message> {
  if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
  if (emojiList.length !== 2) throw new Error('Need two emojis.');

  let page = 1

  const paginatedMessage = await msg.channel.send({
    embeds: [
      initialPage.setFooter(`Page ${page} / ${totalPages}`)
    ]
  })

  for (const emoji of emojiList) await paginatedMessage.react(emoji)

  const filter = (reaction, user) => {
    return emojiList.includes(reaction.emoji.name) && !user.bot
  }

  const reactionCollector = paginatedMessage.createReactionCollector({
    filter,
    time: timeout
  });

  reactionCollector.on('collect', async reaction => {
    await reaction.users.remove(msg.author);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 1 ? --page : totalPages;
        break;
      case emojiList[1]:
        page = page < totalPages ? ++page : 1;
        break;
      default:
        break;
    }

    const nextEmbed = await fetchPageFunction(page, limit, extraData)

    paginatedMessage.edit({
      embeds: [nextEmbed.setFooter(`Page ${page} / ${totalPages}`)]
    });
  });
  reactionCollector.on('end', () => {
    if (!paginatedMessage.deleted) {
      paginatedMessage.reactions.removeAll()
    }
  });
  return paginatedMessage;
}
