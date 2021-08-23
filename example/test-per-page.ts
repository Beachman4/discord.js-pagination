import { Client, Intents, MessageEmbed } from 'discord.js';
import { token } from './config.json'
import { paginateEmbedPerPage } from '../src'
import * as database from './database.json'
import { createConnection } from 'mysql2/promise'

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

let connection

client.on('ready', async () => {
  console.log('ready')

  connection = await createConnection({
    database: database.database,
    user: database.user,
    password: database.password,
    port: database.port
  })
})



async function getEmployeePage(page: number, limit: number, extraData: any = {}): Promise<MessageEmbed | null> {
  const offset = (page - 1) * limit
  const [ rows ] = await connection.execute(`SELECT * FROM employees LIMIT ${offset}, ${limit}`)

  const embed = new MessageEmbed()

  const content = []

  for (const row of rows) {
    content.push(`${row.first_name} ${row.last_name}`)
  }

  if (content.length == 0) {
    return null
  }

  embed.addField('content', content.join('\n'))

  return embed
}

async function getTotalEmployeePages(limit: number): Promise<number> {
  const [ rows ] = await connection.query('SELECT COUNT(*) as count FROM employees')

  let page = rows[0].count / limit

  if (page % 1 !== 0) {
    page = Math.floor(page) + 1
  }

  return page
}

client.on('messageCreate', async message => {
  if (message.author.bot) {
    return
  }

  if (!message.content.includes('!test-pagination')) {
    return
  }

  await paginateEmbedPerPage(message, await getEmployeePage(1, 10), 10, await getTotalEmployeePages(10), getEmployeePage)
})

client.login(token)
