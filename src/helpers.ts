import { Context } from "grammy";
import { MaybePromise, Predicate } from "./types";

export const not =
  <C extends Context>(predicate: Predicate<C>) =>
  (ctx: C) =>
    Promise.resolve(predicate(ctx)).then((v) => !v);

export const reply =
  <C extends Context>(
    errorMessage: string | ((ctx: C) => MaybePromise<string>)
  ) =>
  async (ctx: C) => {
    const text =
      typeof errorMessage === "function"
        ? await errorMessage(ctx)
        : errorMessage;

    if (ctx.callbackQuery) {
      return await ctx.answerCallbackQuery({
        text,
      });
    }

    return await ctx.reply(text, {
      reply_to_message_id: ctx.msg?.message_id,
    });
  };
