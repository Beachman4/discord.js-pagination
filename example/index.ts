import { Client, Intents, MessageEmbed } from 'discord.js';
import { token } from './config.json'
import { paginateEmbedFullList } from '../src'

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: [
    'REACTION',
    'MESSAGE',
    'REACTION'
  ]
})

const rows = []

const pages = []
let embedContent = []
for (let i = 0; i < rows.length; i++) {
  const row = rows[i]
  const content = 'create embed'

  embedContent.push(content)

  if (i % 10 == 0) {
    const embed = embedContent.join('\n')

    pages.push(embed)

    embedContent = []
  }
}

// Call library

function makeid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

client.on('ready', () => {
  console.log('ready')
})

client.on('messageCreate', async message => {
  if (message.author.bot) {
    return
  }

  if (!message.content.includes('!test-pagination')) {
    return
  }

  const embeds = []

  for (let i = 0; i < 20; i++) {
    embeds.push(new MessageEmbed({
      title: 'test',
      footer: {
        text: 't123',
      },
      fields: [
        {
          value: makeid(120),
          name: 'test'
        }
      ]
    }))
  }

  await paginateEmbedFullList(message, embeds)


})

client.login(token)
