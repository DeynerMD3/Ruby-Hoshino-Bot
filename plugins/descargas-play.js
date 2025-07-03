import yts from "yt-search";
import fetch from "node-fetch";

const SIZE_LIMIT_MB = 100;
const newsletterJid  = '120363335626706839@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 Ruby-Hoshino-Channel 』࿐⟡';

const handler = async (m, { conn, text, command }) => {
  const name = conn.getName(m.sender);
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
      body: "🎧 Ruby Hoshino Downloader",
      thumbnail: icons,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!text) {
    return conn.reply(
      m.chat,
      `🌸 *Konnichiwa ${name}-chan~!* Necesito que me digas el nombre de un video o me pegues el link de YouTube 💕\n\n✨ *Ejemplos:*\n.play Shinzou wo Sasageyo\n.play https://youtu.be/xxx`,
      m,
      { contextInfo }
    );
  }

  await m.react("🕝");

  const search = await yts(text);
  if (!search?.all || search.all.length === 0) {
    return conn.reply(m.chat, `💦 *Gomen ne, no encontré nada con:* "${text}"`, m, { contextInfo });
  }

  const video = search.all[0];

  const caption = `
╭─ꨪᰰ━۪  ࣪  ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ ࣪🍵᮫໋⃨𝆬 ࣪ ׅ⏜ׄ᷼⌒╼࡙֟፝͝ ╾ 
 𝆡𑘴⃞ֵ݄݁ׄ🫖ׄׄ ⃨֟፝★̫᤺.݁ׄ⋆⃨݁ 𝐏𝕝𝕒𝕪 𝕗𝕠𝕣 𝕪𝕠𝕦, 𝐨𝕟𝕚𝕚-𝕔𝕙𝕒𝕟~🌸
     ╰─ꨪᰰ━۪  ࣪  ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ ࣪🍵᮫໋⃨𝆬 ࣪ ׅ⏜ׄ᷼⌒╼࡙֟፝͝ ╾  
╭─ꨪᰰ━۪  ࣪ ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ 🍵᮫໋⃨𝆬 ࣪ ⏜ׄ᷼⌒╼࡙֟፝͝ ╾ 
> 𑁯᧙  🍓 *Título:* ${video.title}
> 𑁯᧙  📏 *Duración:* ${video.duration.timestamp}
> 𑁯᧙  👁️ *Vistas:*  ${video.views.toLocaleString()}
> 𑁯᧙  🎨 *Autor:* ${video.author.name}
> 𑁯᧙  📝 *vídeo url:* ${video.url}
╰─ꨪᰰ━۪  ࣪ ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ 🍵᮫໋⃨𝆬 ࣪ ⏜ׄ᷼⌒╼࡙֟፝͝ ╾
💌 Arigatou por usarme, siempre estaré aquí para ti~ ✨
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      image: { url: video.thumbnail },
      caption,
      contextInfo
    },
    { quoted: m }
  );

  const urlAudio = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(video.url)}`;
  const urlVideo = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(video.url)}`;

  try {
    if (command === "play") {
      const resAudio = await fetch(urlAudio);
      const json = await resAudio.json();

      if (!json?.status || !json?.result?.download?.url) {
        const cause = json?.message || json?.error || "Servidor no respondió correctamente.";
        return conn.reply(m.chat, `❌ No pude obtener el audio, gomen~\n📛 *Causa:* ${cause}`, m, { contextInfo });
      }

      const audioUrl = json.result.download.url;
      const title = json.result.metadata?.title || "audio.mp3";

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: title + ".mp3",
          ptt: false
        },
        { quoted: m }
      );
      await m.react("🎶");

    } else if (command === "play2" || command === "playvid") {
      const resVideo = await fetch(urlVideo);
      const json = await resVideo.json();

      if (!json?.status || !json?.result?.download?.url) {
        const cause = json?.message || json?.error || "Servidor no respondió correctamente.";
        return conn.reply(m.chat, `❌ No se pudo obtener el video...\n📛 *Causa:* ${cause}`, m, { contextInfo });
      }

      const videoUrl = json.result.download.url;
      const title = json.result.metadata?.title || "video.mp4";

      const head = await fetch(videoUrl, { method: "HEAD" });
      const contentLength = head.headers.get("content-length");
      const fileSizeMB = parseInt(contentLength || "0") / (1024 * 1024);
      const asDocument = fileSizeMB > SIZE_LIMIT_MB;

      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          fileName: title,
          mimetype: "video/mp4",
          caption: `🎞️ *Listo ${name}-chan!* Aquí está tu video!`,
          contextInfo
        },
        {
          quoted: m,
          ...(asDocument ? { asDocument: true } : {})
        }
      );
      await m.react("🎥");
    }
  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, `❌ Ocurrió un error inesperado:\n\`\`\`${e.message}\`\`\``, m, { contextInfo });
  }
};

handler.help = ["play", "play2", "playvid"];
handler.tags = ["descargas"];
handler.command = ["play", "play2", "playvid"];
handler.register = true;
handler.limit = true;

export default handler;