const axios = require('axios');
const config = require("../config");
const { cmd } = require("../command");

cmd({ on: "body" }, async (conn, m, msg, { from, body }) => {
  try {
    const jsonUrl = "https://raw.githubusercontent.com/DAWENS-BOY96/IZUKA-MD/main/autovoice.json"; // updated
    const res = await axios.get(jsonUrl);
    const voiceMap = res.data;

    for (const keyword in voiceMap) {
      if (body.toLowerCase() === keyword.toLowerCase()) {
        if (config.AUTO_VOICE === "true") {
          const audioUrl = voiceMap[keyword];
          if (!audioUrl.endsWith(".mp3") && !audioUrl.endsWith(".m4a")) {
            return conn.sendMessage(from, { text: "Invalid audio format. Only .mp3 and .m4a supported." }, { quoted: m });
          }

          await conn.sendPresenceUpdate("recording", from);
          await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            ptt: true
          }, { quoted: m });
        }
      }
    }
  } catch (e) {
    console.error("AutoVoice error:", e);
    return conn.sendMessage(from, { text: "Error fetching voice: " + e.message }, { quoted: m });
  }
});
