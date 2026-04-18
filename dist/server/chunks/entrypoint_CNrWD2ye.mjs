import { n as nullToEmptyString } from './index_By2z1dI5.mjs';
import { c as createActionsProxy, p as pipelineSymbol, A as AstroError, a as ActionCalledFromServerError, d as defineAction } from './server_IgTxxMnd.mjs';
import * as z from 'zod/v4';

createActionsProxy({
  handleAction: async (param, path, context) => {
    const pipeline = context ? Reflect.get(context, pipelineSymbol) : void 0;
    if (!pipeline) {
      throw new AstroError(ActionCalledFromServerError);
    }
    const action = await pipeline.getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
});

const contact = {
  sendEmail: defineAction({
    accept: "form",
    input: z.object({
      name: z.preprocess(
        nullToEmptyString,
        z.string().min(1, { message: "El nombre es requerido" })
      ),
      email: z.preprocess(
        nullToEmptyString,
        z.string().min(1, { message: "El email es requerido" }).email()
      ),
      subject: z.preprocess(
        nullToEmptyString,
        z.string().min(1, { message: "El asunto es requerido" })
      ),
      message: z.preprocess(
        nullToEmptyString,
        z.string().min(15, { message: "El mensaje es requerido" })
      )
    }),
    handler: async (input) => {
      const url = `${"https://api-mevasa.mevasa-comercializadora.com"}/wp-json/contact-form-7/v1/contact-forms/158/feedback`;
      const formData = new FormData();
      formData.append("your-name", input.name);
      formData.append("your-email", input.email);
      formData.append("your-subject", input.subject);
      formData.append("your-message", input.message);
      formData.append("_wpcf7_unit_tag", "wpcf7-123");
      const res = await fetch(url, {
        method: "POST",
        body: formData
      });
      await res.json();
      return {
        error: false,
        message: "Tu mensaje se envió correctamente"
      };
    }
  })
};

const server = {
  contact
};

export { server };
