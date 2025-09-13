// --- VALORES NECESARIOS PARA LA NUEVA FUNCIONALIDAD ---
const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '𖥔ᰔᩚ⋆｡˚ ꒰🍒 ʀᴜʙʏ-ʜᴏꜱʜɪɴᴏ | ᴄʜᴀɴɴᴇʟ-ʙᴏᴛ 💫꒱࣭';
const packname = '⏤͟͞ू⃪  ̸̷͢𝐑𝐮𝐛y͟ 𝐇𝐨𝐬𝐡𝐢n͟ᴏ 𝐁𝐨t͟˚₊·—̳͟͞͞♡̥';

// Array de miniaturas
const iconos = [
      'https://files.catbox.moe/7bn1pf.jpg',
      'https://files.catbox.moe/fsdo40.jpg',
      'https://files.catbox.moe/fe6pw6.jpeg',
      'https://files.catbox.moe/z79x8o.jpeg', 
];

// Función para obtener una aleatoria
const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 */
const handler = (type, conn, m, comando) => {
  const msg = {
  rowner: '「🌺」 *Gomenasai~! Esta función solo la puede usar mi creador celestial...* 🌌\n\n> *Dioneibi-sama.*',
  owner: '「🌸」 *¡Nyaa~! Solo mi creador y programadores pueden usar este comando~!* 💾💕',
  mods: '「🌟」 *Uguu~ Esto eso solo lo pueden usar mis desarrolladores mágicos~!* 🔮',
  premium: '「🍡」 *Ehh~? Esta función es exclusiva para usuarios Premium-desu~!* ✨\n\n💫 *¿No eres premium aún? Consíguelo ahora usando:*\n> ✨ *.comprarpremium 2 dias*  (o reemplaza "2 dias" por la cantidad que desees).',
  group: '「🐾」 *¡Onii-chan~! Este comando solo puede usarse en grupos grupales~!* 👥',
  private: '「🎀」 *Shh~ Este comando es solo para ti y para mí, en privado~* 💌',
  admin: '「🧸」 *¡Kyah~! Solo los admin-senpai pueden usar esta habilidad~!* 🛡️',
  botAdmin: '「🔧」 *¡Espera! Necesito ser admin para que este comando funcione correctamente.*\n\n🔧 *Hazme admin y desataré todo mi poder~*',
  unreg: `🍥 𝑶𝒉 𝒏𝒐~! *¡Aún no estás registrado~!* 😿\nNecesito conocerte para que uses mis comandos~ ✨\n\n📝 Por favor regístrate con:\n */reg nombre.edad*\n\n🎶 Ejemplo encantado:\n */reg Dioneibi-kun.15*\n\n💖 ¡Así podré reconocerte~! (⁎˃ᴗ˂⁎)`,
  restrict: '「📵」 *¡Ouh~! Esta función está dormida por ahora~* 💤'
  }[type];

  if (msg) {
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: 'I🎀 𓈒꒰ 𝐘𝐚𝐲~ 𝐇𝐨𝐥𝐚𝐚𝐚! (≧∇≦)/',
        thumbnailUrl: getRandomIcono(), // ← aleatoria
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };

    return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('✖️'));
  }

  return true;
};

export default handler;