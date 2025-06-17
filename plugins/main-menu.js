const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const axios = require('axios');

function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

function runtime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

cmd({
  pattern: "menu",
  alias: ["allmenu", "gotar"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "🍷",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let menuText = `
╭━━━〘 *IZUKA MD* 〙━━━╮
┃★│ 👤 *Utilisateur* : @${m.sender.split("@")[0]}
┃★│ ⏱️ *Uptime* : ${uptime()}
┃★│ 🕐 *Runtime* : ${runtime(process.uptime())}
┃★│ ⚙️ *Mode* : ${config.MODE}
┃★│ 💠 *Préfixe* : [${config.PREFIX}]
┃★│ 📦 *Modules* : ${totalCommands}
┃★│ 🧩 *Platform* : GITHUB
┃★│ 👨‍💻 *Dev* : DAWENS BOY🩸
┃★│ 🔖 *Version* : 1.0.0 aura💀🍷
┃★│ 📆 *Date* : ${date}
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

🩸 *_WELCOME TO IZUKA MD_* 🩸
🌐 Repo: https://github.com/DAWENS-BOY96/IZUKA-MD
`;

    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();
    for (let k of keys) {
      menuText += `\n\n🌺『 *${k.toUpperCase()}* 』\n`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        menuText += `🌸 *${config.PREFIX}${toSmallCaps(usage)}*\n`;
      });
      menuText += `╰─────────────✦`;
    }

    // Voye videyo a kòm meni
    await conn.sendMessage(
      from,
      {
        video: { url: `https://files.catbox.moe/8ugvyk.mov` },
        caption: menuText,
        mimetype: 'video/mp4',
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363398101781980@newsletter',
            newsletterName: "⪨IZUKA-𝗠𝗗⪩",
            serverMessageId: 143
          }
        }
      },
      { quoted: mek }
    );

    // Voye son an (audio PTT)
    await conn.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/m4zrro.mp4' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply(`❌ Error: ${e}`);
  }
});
