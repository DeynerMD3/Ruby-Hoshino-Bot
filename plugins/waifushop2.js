import fs from 'fs';

let handler = async (m, { conn, args }) => {
  let ventas = [];
  try {
    // Leer archivo y parsear
    ventas = JSON.parse(fs.readFileSync('./src/database/waifusVenta.json', 'utf-8'));
    if (!Array.isArray(ventas)) throw new Error('El archivo no contiene una lista válida.');
  } catch (e) {
    return m.reply(`✘ Error al leer las waifus en venta.\n\n*Detalles:* ${e.message}`);
  }

  if (!ventas.length) {
    return m.reply('✿ Actualmente no hay waifus en venta.');
  }

  // Paginación segura
  let page = 1;
  if (args[0] && !isNaN(args[0])) page = Math.max(1, parseInt(args[0]));
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(ventas.length / pageSize));
  if (page > totalPages) {
    return m.reply(`✧ Página inválida. Solo hay *${totalPages}* página(s).`);
  }

  const inicio = (page - 1) * pageSize;
  const waifusPagina = ventas.slice(inicio, inicio + pageSize);

  let texto = `◢✿ *Waifus en venta* ✿◤\n\n`;
  let mencionados = [];

  for (let i = 0; i < waifusPagina.length; i++) {
    try {
      let { name, precio, vendedor } = waifusPagina[i];
      let username = await conn.getName(vendedor).catch(() => `@${(vendedor || '').split('@')[0] || 'desconocido'}`);
      texto += `✰ ${inicio + i + 1} » *${name || '-'}*\n`;
      texto += `  🛒 Precio: *¥${(precio || '-').toLocaleString()} ᴅᴀʀᴋᴏs*\n`;
      texto += `  👤 Vendedor: @${(vendedor || '').split('@')[0]}\n\n`;
      if (vendedor) mencionados.push(vendedor);
    } catch (err) {
      texto += `✘ Error al mostrar una waifu: ${err.message}\n\n`;
    }
  }

  texto += `> Página *${page}* de *${totalPages}*\n`;
  if (page < totalPages) {
    texto += `> Usa *#waifusventa ${page + 1}* para ver la siguiente.\n`;
  }

  try {
    await conn.sendMessage(m.chat, {
      text: texto,
      mentions: mencionados
    }, { quoted: m });
  } catch (err) {
    return m.reply(`✘ Error al enviar la lista:\n${err.message}`);
  }
};

handler.help = ['waifusventa [página]'];
handler.tags = ['waifus'];
handler.command = ['waifusventa', 'waifusenventa'];
handler.group = true;
handler.register = true;

export default handler;