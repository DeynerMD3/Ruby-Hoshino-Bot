const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const cooldown = 2 * 60 * 60 * 1000; // 2 horas
    const now = Date.now(); // usar número (ms) para todas las comparaciones
    const user = global.db?.data?.users?.[m.sender];

    if (!user) return conn.reply(m.chat, `${emoji2} *Tu usuario no está registrado en la base de datos.*`, m);

    let target = null;
    if (m.isGroup) {
      target = (m.mentionedJid && m.mentionedJid.length > 0) ? m.mentionedJid[0] : (m.quoted && m.quoted.sender ? m.quoted.sender : null);
    } else {
      target = m.chat;
    }

    if (!target) {
      return conn.reply(m.chat, `${emoji2} *Debes mencionar a alguien para intentar robarle.*`, m);
    }

    if (target === m.sender) {
      return conn.reply(m.chat, `${emoji2} *No puedes robarte a ti mismo.*`, m);
    }

    if (!global.db?.data?.users?.[target]) {
      return conn.reply(m.chat, `${emoji2} *Ese usuario no está registrado en la base de datos.*`, m);
    }

    const targetUser = global.db.data.users[target];

    targetUser.coin = Number.isFinite(targetUser.coin) ? Math.max(0, Number(targetUser.coin)) : 0;
    user.coin = Number.isFinite(user.coin) ? Number(user.coin) : 0;

    if (user.lastrob2 && (now - Number(user.lastrob2) < cooldown)) {
      const remaining = Number(user.lastrob2) + cooldown - now;
      const time = msToTime(remaining);
      return conn.reply(m.chat, `${emoji3} ✿ ¡Ya intentaste un robo! ✿\n⏳ Vuelve en *${time}* para hacerlo de nuevo.`, m);
    }

    const MIN_ROB = 1000;
    const MAX_ROB = 20000;
    const robAmount = Math.floor(Math.random() * (MAX_ROB - MIN_ROB + 1)) + MIN_ROB;

    if (targetUser.coin < MIN_ROB) {
      return conn.reply(m.chat, `${emoji2} @${target.split("@")[0]} *no tiene al menos ¥${MIN_ROB.toLocaleString()} ${moneda} fuera del banco para que valga la pena intentarlo.*`, m, { mentions: [target] });
    }

    const finalRob = Math.min(robAmount, targetUser.coin);

    targetUser.coin = Math.max(0, targetUser.coin - finalRob);
    user.coin = (user.coin || 0) + finalRob;

    user.lastrob2 = now;

    // if (global.db.write) await global.db.write();

    const frases = [
      `✿ ¡𝚁𝚘𝚋𝚘 𝙴𝚇𝙸𝚃𝙾𝚂𝙾! ✿\nHas saqueado a @${target.split("@")[0]} y te llevaste *¥${finalRob.toLocaleString()} ${moneda}* 💸`,
      `✿ Tu operación fue silenciosa y eficaz...\n¡Robaste *¥${finalRob.toLocaleString()} ${moneda}* a @${target.split("@")[0]}!`,
      `✿ Te pusiste la capucha y sin ser visto robaste *¥${finalRob.toLocaleString()} ${moneda}* a @${target.split("@")[0]} 😈`,
      `✿ 🏃 Escapaste por los callejones oscuros tras robar *¥${finalRob.toLocaleString()} ${moneda}* de @${target.split("@")[0]}`
    ];

    await conn.reply(m.chat, pickRandom(frases), m, { mentions: [target] });
  } catch (err) {
    console.error('Error en comando rob:', err);
    return conn.reply(m.chat, `${emoji2} Ocurrió un error al intentar ejecutar el comando. Intenta de nuevo más tarde.`, m);
  }
};

handler.help = ['rob'];
handler.tags = ['rpg'];
handler.command = ['robar', 'steal', 'rob'];
handler.group = true;
handler.register = true;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
  // duration en ms (número >= 0)
  const totalSeconds = Math.max(0, Math.floor(duration / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours} Hora(s) ${minutes} Minuto(s)`;
}
