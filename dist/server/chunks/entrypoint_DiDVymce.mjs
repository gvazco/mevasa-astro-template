import { n as nullToEmptyString } from "./helpers_ByppY79C.mjs";
import { l as fetchStateSymbol } from "./server_DidpFoBq.mjs";
import { C as ActionCalledFromServerError, x as AstroError } from "./remote_BDgnQ4b8.mjs";
import { M as createGetActionPath, i as getAction, j as createActionsProxy, t as defineAction } from "./server_zsgnQvm-.mjs";
import * as mod from "zod/v4";
createGetActionPath({
	baseUrl: "/",
	shouldAppendTrailingSlash: true
});
createActionsProxy({ handleAction: async (param, path, context) => {
	const state = context ? Reflect.get(context, fetchStateSymbol) : void 0;
	if (!state) throw new AstroError(ActionCalledFromServerError);
	const action = await getAction(state.manifest, path);
	if (!action) throw new Error(`Action not found: ${path}`);
	return action.bind(context)(param);
} });
// src/actions/index.ts
var server = { contact: { sendEmail: defineAction({
	accept: "form",
	input: mod.object({
		name: mod.preprocess(nullToEmptyString, mod.string().min(1, { message: "El nombre es requerido" })),
		email: mod.preprocess(nullToEmptyString, mod.string().min(1, { message: "El email es requerido" }).email()),
		subject: mod.preprocess(nullToEmptyString, mod.string().min(1, { message: "El asunto es requerido" })),
		message: mod.preprocess(nullToEmptyString, mod.string().min(15, { message: "El mensaje es requerido" }))
	}),
	handler: async (input) => {
		const url = `https://api-mevasa.mevasa-comercializadora.com/wp-json/contact-form-7/v1/contact-forms/158/feedback`;
		const formData = new FormData();
		formData.append("your-name", input.name);
		formData.append("your-email", input.email);
		formData.append("your-subject", input.subject);
		formData.append("your-message", input.message);
		formData.append("_wpcf7_unit_tag", "wpcf7-123");
		await (await fetch(url, {
			method: "POST",
			body: formData
		})).json();
		return {
			error: false,
			message: "Tu mensaje se envió correctamente"
		};
	}
}) } };
export { server };
