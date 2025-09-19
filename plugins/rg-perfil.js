import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let userId
  if (m.quoted?.sender) {
    userId = m.quoted.sender
  } else if (m.mentionedJid?.[0]) {
    userId = m.mentionedJid[0]
  } else {
    userId = m.sender
  }

  let user = global.db.data.users[userId]
  if (!user) {
    return m.reply('⚠️ El usuario no existe en la base de datos.')
  }

  try {
    let name
    try {
      name = await conn.getName(userId)
    } catch {
      name = "𖤐 Sin Nombre 𖤐"
    }

    let cumpleanos = user.birth || '𖠿 No especificado'
    let genero = user.genre || '𖠿 No especificado'

    let parejaId = user.marry || null
    let parejaTag = '✘ Nadie'
    let mentions = [userId]
    if (parejaId && global.db.data.users[parejaId]) {
      parejaTag = `⚝ @${parejaId.split('@')[0]}`
      mentions.push(parejaId)
    }

    let description = user.description || '˖ ࣪⊹ Ninguna descripción'
    let exp = user.exp || 0
    let nivel = user.level || 0
    let role = user.role || '✧ Sin rango'
    let coins = user.coin || 0
    let bankCoins = user.bank || 0

    let perfil = await conn.profilePictureUrl(userId, 'image')
      .catch(() => 'https://files.catbox.moe/xr2m6u.jpg')

    let profileText = `
﹙𖤍﹚︩︪ ⌗ 𝖯𝖤𝖱𝖥𝖨𝖫 𝖣𝖤 ${name}
ㅤㅤ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯  
⧉ 𖦹 𝖴𝗌𝖾𝗋 » @${userId.split('@')[0]}
⧉ 𖦹 𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇 » ${description}

⧉ 𖦹 𝖠𝗀𝖾 » ${user.age || '𖠿 Desconocida'}
⧉ 𖦹 𝖢𝗎𝗆𝗉𝗅𝖾 » ${cumpleanos}
⧉ 𖦹 𝖦énero » ${genero}
⧉ 𖦹 𝖬𝖺𝗋𝗋𝗒 » ${parejaTag}
ㅤㅤ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯  
⧉ 𖦹 𝖭𝗂𝗏𝖾𝗅 » ${nivel}
⧉ 𖦹 𝖤𝗑𝗉 » ${exp.toLocaleString()}
⧉ 𖦹 𝖱𝖺𝗇𝗀𝗈 » ${role}

⧉ 𖦹 𝖢𝗈𝗂𝗇𝗌 » ${coins.toLocaleString()} ${moneda}
⧉ 𖦹 𝖡𝖺𝗇𝗄 » ${bankCoins.toLocaleString()} ${moneda}
⧉ 𖦹 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 » ${user.premium ? '✔ Activo' : '✘ Inactivo'}
ㅤㅤ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯ ⎯  
⋆｡°✩ 𝖯𝗋𝗈𝗉𝗂𝖾𝗍𝖺𝗋𝗂𝗈 ᴅᴇ ʟᴀ ʙᴏᴛ: *${dev}* ⋆｡°✩
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        text: profileText,
        contextInfo: {
          mentionedJid: mentions,
          externalAdReply: {
            title: '𝘵𝘶 𝘱𝘦𝘳𝘧𝘪𝘭 (*•̀ᴗ•́*)و ̑̑',
            body: "﹙𖤍﹚ 𝘪𝘯𝘧𝘰𝘳𝘮𝘢𝘤𝘪𝘰 𝘥𝘦𝘭 𝘶𝘴𝘶𝘢𝘳𝘪𝘰.",
            thumbnailUrl: perfil,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )
  } catch (e) {
    await m.reply(`⚠️ Error al mostrar el perfil:\n\n${e.message}`)
  }
}

handler.help = ['profile', 'perfil']
handler.tags = ['rg']
handler.command = ['profile', 'perfil']

export default handler
