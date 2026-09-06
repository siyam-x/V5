const fs = require("fs-extra");
const path = require("path");

const passwordFilePath = path.join(__dirname, "passwords_data.json");

const defaultPasswords = [
    "19602", "129483", "905812", "347109", "562841",
    "819203", "451029", "673914", "238491", "901248",
    "314159", "271828", "582094", "192837", "465738",
    "918273", "647382", "538192", "827104", "102938",
    "475610", "392014", "857412", "610293", "748392",
    "203948", "594837", "182736", "948372", "302918"
];

function loadData() {
    if (!fs.existsSync(passwordFilePath)) {
        const initialData = { passwords: defaultPasswords, used: [], attempts: {} };
        fs.writeFileSync(passwordFilePath, JSON.stringify(initialData, null, 4));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(passwordFilePath, "utf-8"));
}

function saveData(data) {
    fs.writeFileSync(passwordFilePath, JSON.stringify(data, null, 4));
}

module.exports = {
    config: {
        name: "alllist",
        version: "2.1.0",
        author: "Siyam Hasan",
        countDown: 5,
        role: 2,
        description: "Password protected bot info system",
        category: "info"
    },

    onStart: async function ({ message, args, api, event }) {
        let data = loadData();

        if (args[0] === "plist" || (args[0] === "password" && args[1] === "list")) {
            let listMsg = "🔐 PASSWORD USAGE STATUS 🔐\n────────────────\n";
            data.passwords.forEach((pass, index) => {
                const isUsed = data.used.includes(pass);
                listMsg += `${index + 1}. ${pass} -> ${isUsed ? "❌ (Used)" : "✅ (Available)"}\n`;
            });
            return message.reply(listMsg);
        }

        if (args[0] === "reset") {
            data.used = [];
            data.attempts = {};
            saveData(data);
            return message.reply("🔄 সফলভাবে সকল পাসওয়ার্ড রিসেট করা হয়েছে!");
        }

        if (args && args.length > 0) return;

        if (data.passwords.length === data.used.length) {
            data.used = [];
            saveData(data);
            message.reply("ℹ️ সকল পাসওয়ার্ড একবার ব্যবহার হয়ে যাওয়ায় সিস্টেম স্বয়ংক্রিয়ভাবে পাসওয়ার্ড লিস্ট রিসেট করেছে।");
        }

        return message.reply(
            "🔒 পাসওয়ার্ড সিকিউরিটি:\nদয়া করে এই মেসেজের Reply দিয়ে লিখুন:\n👉 সিয়াম ভাই তোমার পাসওয়ার্ড লেখ <পাসওয়ার্ড>\n\n⚠️ আপনার হাতে সময় আছে ১ মিনিট।",
            (err, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    timestamp: Date.now()
                });
            }
        );
    },

    onReply: async function ({ message, event, Reply, api }) {
        if (event.senderID !== Reply.author) return;

        let data = loadData();
        const bodyText = event.body.trim();
        const prefixText = "সিয়াম ভাই তোমার পাসওয়ার্ড লেখ";

        if (Date.now() - Reply.timestamp > 60000) {
            api.unsendMessage(Reply.messageID);
            return message.reply("⏱️ সময় পার হয়ে গেছে! আবার কমান্ড দিন।");
        }

        if (!bodyText.startsWith(prefixText)) return;

        const userAttempts = data.attempts[event.senderID] || 0;
        if (userAttempts >= 3) {
            return message.reply("🚫 আপনি ৩ বার ভুল পাসওয়ার্ড দিয়েছেন! আপনার এক্সেস ব্লক করা হয়েছে। রিসেট করতে কম্যান্ড দিন: ,alllist reset");
        }

        const inputPassword = bodyText.replace(prefixText, "").trim();

        try {
            api.unsendMessage(event.messageID);
        } catch (e) {}

        if (!inputPassword) {
            return message.reply("❌ কোনো পাসওয়ার্ড পাওয়া যায়নি!");
        }

        if (data.used.includes(inputPassword)) {
            data.attempts[event.senderID] = userAttempts + 1;
            saveData(data);
            return message.reply(`❌ এই পাসওয়ার্ডটি ইতোমধ্যে ব্যবহৃত! (ভুল চেষ্টা: ${userAttempts + 1}/3)`);
        }

        if (!data.passwords.includes(inputPassword)) {
            data.attempts[event.senderID] = userAttempts + 1;
            saveData(data);
            return message.reply(`❌ ভুল পাসওয়ার্ড! (ভুল চেষ্টা: ${userAttempts + 1}/3)`);
        }

        data.used.push(inputPassword);
        data.attempts[event.senderID] = 0;
        saveData(data);

        api.unsendMessage(Reply.messageID);

        const infoText = `────────────────
📊 ALL COMMANDS & BOT INFO LIST
────────────────

🤖 BOT INFO
┠ নি্ঁঝু্ঁম্ঁ চ্যা্ঁট্ঁ ব্ঁট্ঁ • রা্ঁশি্ঁয়া্ঁন্ নি্ঁঝু্ঁম্ • 🤖 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧
┖ 𓆩»̶̶͓͓͓̽̽̽𝆠꯭፝֟ɴɪᴊʜᴜᴍ-ᴄʜᴀᴛ-ʙᴏᴛ𝆠꯭፝֟⚜️𓆪

📞 CONTACT & EMAIL
┠ mj6048157@gmail.com • mdsiyam13536@gmail.com
┖ 01741496661 • +𝟴𝟴𝟬𝟭𝟳𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳

👥 USERS & NICKNAMES
┠ ヽ｟ᏟᎬϴ｠▁▁ዐዐዐ 🙁😚☺️👿 • সি্ঁয়া্ঁম্ঁ
┠  হ্ঁট্ঁ ভ্ঁই্ঁ পি্ঁচ্চি্ঁ হৃ্ঁদয়্ঁ • পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ
┠ অ্যা্ঁঁটি্ঁঁটি্ঁঁউ্ঁঁড্ঁ কু্ঁঁই্ঁঁন্ সা্ঁঁদি্ঁঁয়া • আ্ঁসো্ঁ সে্ঁক্স্ঁ ক্ঁরি্ঁ
┖ তো্ঁমা্ঁগো্ঁ পি্ঁচ্চি্ মো্ঁহি্ঁনী্ঁ • তো্ঁমা্ঁগো্ঁ তো্ঁমা্ঁগো্ঁ পি্ঁচ্চি্ঁ আ্ঁপু্ঁ

👑 BOT OWNER INFO
┖ নাম: হৃদয় হাসান • বাসা: কিশোরগঞ্জ • বয়স: ১৭+

📊 BOT STATUS
┠ 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
┠ 🔰 𝗣𝗥𝗘𝗙𝗜𝗫 ➜ { , } • 📊 𝗧𝗢𝗧𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➜ 700+
┠ ⚙️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 ➜ V2 💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠
┖ 👑-𝐒𝐈𝐘𝐀𝐌-👑 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩2 • 𝟔𝟎𝟗𝟔

⚙️ BOT COMMANDS
🛠 ADMIN & SYSTEM
┖ antiInbox • police • ,wl on • ,autotimer on • ,allnoti hi • /namaz • ban • kick • protect on • autotimer on • senlock • autoseen off • botstatus • rankup on

📦 BOX & GROUP
┖ allgroup • goatstore show 16 • supportgc • allnick • cancelmarry • mentionspam

😂 FUN & ADULT
┖ ,chipay • ,chor • ,nude, • bonk • propose • love • kiss

💖 LOVE & PAIR
┖ .pair • ,pair4 • pairedit

📂 FILES & TOOLS
┖ /File uns • Voicehelp • webss • catbox • imgur • search • xray • chakrun

🖼 MEDIA & PINTEREST
┖ manga • pinterest • pinterestpro • catvideo

ℹ️ INFO & ECONOMY
┖ age 5/05/209 • ,userinfo • balance
» 😌fork
https://github.com/siyam-officialpfo/bot.git
────────────────`;

        return message.reply(infoText, (err, info) => {
            if (!err) {
                setTimeout(() => {
                    api.unsendMessage(info.messageID);
                }, 10000);
            }
        });
    }
};
