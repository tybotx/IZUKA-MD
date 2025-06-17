const fs = require('fs/promises');
const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "sticker",
  alias: ["s", "autosticker"],
  desc: "Convert image/video to sticker + auto-sticker mode",
  category: "sticker",
  use: "sticker | s | autosticker on/off",
  filename: __filename,
  execute: async (m, gss) => {
    const prefix = config.PREFIX || '/';
    const [cmdName, arg] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ') : ['', ''];

    const packname = global.packname || "IZUKA-MD";
    const author = global.author || "DAWENS BOY";

    const validCommands = ['sticker', 's', 'autosticker'];

    // Handle autosticker toggle
    if (cmdName === 'autosticker') {
      if (arg === 'on') {
        config.AUTO_STICKER = true;
        await m.reply('✅ Auto-sticker is now enabled.');
      } else if (arg === 'off') {
        config.AUTO_STICKER = false;
        await m.reply('❌ Auto-sticker is now disabled.');
      } else {
        await m.reply('Usage: /autosticker on|off');
      }
      return;
    }

    // Auto-sticker mode (if enabled)
    if (config.AUTO_STICKER && !m.key.fromMe) {
      if (m.type === 'imageMessage') {
        const media = await m.download();
        if (media) await gss.sendImageAsSticker(m.from, media, m, { packname, author });
        return;
      } else if (m.type === 'videoMessage' && m.msg.seconds <= 11) {
        const media = await m.download();
        if (media) await gss.sendVideoAsSticker(m.from, media, m, { packname, author });
        return;
      }
    }

    // Regular sticker command
    if (validCommands.includes(cmdName)) {
      const quoted = m.quoted || {};
      if (!quoted || (quoted.mtype !== 'imageMessage' && quoted.mtype !== 'videoMessage')) {
        return m.reply(`Reply to an image or video to convert it into a sticker: ${prefix + cmdName}`);
      }

      const media = await quoted.download();
      if (!media) throw new Error('❌ Failed to download media.');

      const filePath = `./${Date.now()}.${quoted.mtype === 'imageMessage' ? 'png' : 'mp4'}`;
      await fs.writeFile(filePath, media);

      if (quoted.mtype === 'imageMessage') {
        const stickerBuffer = await fs.readFile(filePath);
        await gss.sendImageAsSticker(m.from, stickerBuffer, m, { packname, author });
      } else if (quoted.mtype === 'videoMessage') {
        await gss.sendVideoAsSticker(m.from, filePath, m, { packname, author });
      }

      await fs.unlink(filePath); // clean temp file
    }
  }
});
