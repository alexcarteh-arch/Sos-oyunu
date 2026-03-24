import telebot
from telebot.types import InlineQueryResultGame

TOKEN = 'BURAYA_BOT_TOKEN_YAZ'
GAME_SHORT_NAME = 'SOSGAME' # BotFather'a verdiğin kısa isim
URL = 'https://kullaniciadin.github.io/sos/' # index.html'i yüklediğin link

bot = telebot.Telebot(TOKEN)

@bot.message_handler(commands=['start'])
def send_game(message):
    bot.send_game(message.chat.id, GAME_SHORT_NAME)

@bot.callback_query_handler(func=lambda call: call.game_short_name == GAME_SHORT_NAME)
def game_callback(call):
    # Oyunu açan URL'yi gönderir
    bot.answer_callback_query(call.id, url=URL)

@bot.inline_handler(lambda query: len(query.query) == 0)
def query_game(inline_query):
    # Arkadaşınla oynamak için @Smaleess_bot yazınca oyunu çıkarır
    try:
        game = InlineQueryResultGame('1', GAME_SHORT_NAME)
        bot.answer_inline_query(inline_query.id, [game])
    except Exception as e:
        print(e)

bot.polling()
