import { t as __exportAll } from "./chunks/rolldown-runtime_D8jQpDG7.mjs";
import { A as getSetCookiesFromResponse, B as setRenderOptions, C as getI18n, D as getLogger, E as validateAndDecodePathname, F as getUsedFeatures, H as manifest, I as markFeatureUsed, L as createCrossOriginForbiddenResponse, N as ALL_FETCH_FEATURES, O as getResolvedLogger, P as FetchFeatures, R as isForbiddenCrossOriginRequest, S as finalizeI18n, T as getEnvironment, V as getAmbientManifest, _ as matchAllRoutes, a as FetchState, b as handlePages, c as renderErrorFromState, d as validateForwardedHeaders, f as validateHost, g as getRouteTable, h as provideCache, k as getDefaultStatusCode, l as renderErrorPage, m as handleCache, n as getActionContext, o as computePathnameFromDomain, p as provideSession, r as serializeActionResult, s as handleMiddleware, u as getFirstForwardedValue, v as matchRoute, w as getRouteGenerator, x as prepareResponse, y as updateRouteTable, z as getRenderOptions } from "./chunks/server_zsgnQvm-.mjs";
import { c as clientAddressSymbol, n as ASTRO_ERROR_HEADER, o as REROUTABLE_STATUS_CODES, u as nodeRequestAbortControllerCleanupSymbol } from "./chunks/server_DidpFoBq.mjs";
import { K as LocalsNotAnObject, _ as removeTrailingForwardSlash, c as hasFileExtension, l as isInternalPath, o as collapseDuplicateTrailingSlashes, p as prependForwardSlash$1, r as appendForwardSlash, x as AstroError, y as stripRequestBase } from "./chunks/remote_BDgnQ4b8.mjs";
import { D as isRoute3xx, n as AstroIntegrationLogger } from "./chunks/console_Wxr6KIb-.mjs";
import { escape } from "html-escaper";
import { AsyncLocalStorage } from "node:async_hooks";
import fs, { createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { Http2ServerResponse } from "node:http2";
import url from "node:url";
import http from "node:http";
import https from "node:https";
import enableDestroy from "server-destroy";
import os from "node:os";
import send from "send";
// node_modules/astro/dist/core/routing/invalid-encoding.js
/**
* Returns an empty `400 Bad Request` response when the request path was
* encoded too many times to fully decode, or is not valid percent-encoded
* UTF-8 (`state.invalidEncoding`), or `undefined` otherwise.
*
* Every entry point that routes the request or runs middleware calls this
* first, so composable pipelines reject the request the same way
* `handleRequest` does regardless of which handlers they include.
*/
function rejectInvalidEncoding(state) {
	if (state.invalidEncoding) return new Response(null, {
		status: 400,
		statusText: "Bad Request"
	});
}
// node_modules/astro/dist/actions/handler.js
/**
* Handles Astro Action requests in both modes:
*
* - **RPC**: POST requests to `/_actions/<name>` (originating from the
*   generated JS client). Runs the action and returns the serialized result
*   as the response, so the caller can short-circuit rendering.
* - **Form**: POST requests with `?_action=<name>` targeting a page route
*   (originating from an HTML `<form action={actions.foo}>`). Runs the
*   action, stashes the result into `locals._actionPayload`, and returns
*   `undefined` so the caller continues to render the page.
*
* Non-action requests are a no-op (`undefined`).
*
* This handler is invoked at the bottom of the middleware chain, before
* page dispatch. That placement preserves the existing behavior where
* user middleware sees action requests and response finalization (cookies,
* sessions, etc.) runs around the action response.
*
* Expects the APIContext that is already being used by the render pipeline.
* Returns a `Response` when the action fully handles the request (RPC),
* or `undefined` when the caller should continue processing the request
* (form actions or non-action requests).
*/
function handleAction(apiContext, state) {
	markFeatureUsed(state.manifest, FetchFeatures.actions);
	const invalidEncodingResponse = rejectInvalidEncoding(state);
	if (invalidEncodingResponse) return Promise.resolve(invalidEncodingResponse);
	if (apiContext.isPrerendered) return;
	const { action, setActionResult } = getActionContext(apiContext);
	if (!action) return;
	if (state.manifest.checkOrigin && isForbiddenCrossOriginRequest(apiContext.request, apiContext.url, apiContext.isPrerendered)) return Promise.resolve(createCrossOriginForbiddenResponse(apiContext.request));
	return executeAction(action, setActionResult);
}
async function executeAction(action, setActionResult) {
	const actionResult = await action.handler();
	const serialized = serializeActionResult(actionResult);
	if (action.calledFrom === "rpc") {
		if (serialized.type === "empty") return new Response(null, { status: serialized.status });
		return new Response(serialized.body, {
			status: serialized.status,
			headers: { "Content-Type": serialized.contentType }
		});
	}
	setActionResult(action.name, serialized);
}
// node_modules/astro/dist/core/routing/3xx.js
/**
* Generates a minimal HTML redirect page used for SSR redirects.
*/
function redirectTemplate({ status, absoluteLocation, relativeLocation, from }) {
	const delay = status === 302 ? 2 : 0;
	const rel = escape(String(relativeLocation));
	return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escape(String(absoluteLocation))}">
<body>
	<a href="${rel}">Redirecting ${from ? `from <code>${escape(from)}</code> ` : ""}to <code>${rel}</code></a>
</body>`;
}
// node_modules/astro/dist/core/routing/trailing-slash-handler.js
/**
* Handles trailing-slash normalization for incoming requests. If the
* request's pathname does not match the manifest's configured
* `trailingSlash` policy, a redirect `Response` is returned. Otherwise,
* returns `undefined` so the caller can continue processing the request.
* Paths encoded too many times to decode get a 400 instead of a redirect.
*/
function handleTrailingSlash(state) {
	const invalidEncodingResponse = rejectInvalidEncoding(state);
	if (invalidEncodingResponse) return invalidEncodingResponse;
	const url = new URL(state.request.url);
	const redirect = redirectTrailingSlash(state.manifest.trailingSlash, url.pathname);
	if (redirect === url.pathname) return;
	const addCookieHeader = state.renderOptions.addCookieHeader;
	const status = state.request.method === "GET" ? 301 : 308;
	const location = redirect + url.search;
	const response = new Response(redirectTemplate({
		status,
		relativeLocation: location,
		absoluteLocation: location,
		from: state.request.url
	}), {
		status,
		headers: { location }
	});
	prepareResponse(response, { addCookieHeader });
	return response;
}
function redirectTrailingSlash(trailingSlash, pathname) {
	if (pathname === "/" || isInternalPath(pathname)) return pathname;
	const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
	if (path !== pathname) return path;
	if (trailingSlash === "ignore") return pathname;
	if (trailingSlash === "always" && !hasFileExtension(pathname)) return appendForwardSlash(pathname);
	if (trailingSlash === "never") return removeTrailingForwardSlash(pathname);
	return pathname;
}
// node_modules/astro/dist/core/errors/not-found.js
/**
* Renders the 404 error page when no route matched the request, or returns
* `undefined` when a route matched. Returns an empty `400` when the request
* path is over-encoded.
*
* `FetchState` only falls back to an SSR `404.astro`, so this renders a
* prerendered (or absent) custom 404 page: through
* `renderOptions.prerenderedErrorPageFetch` in production, or by rendering
* the page source in dev.
*/
function handleNotFound(state) {
	const invalidEncodingResponse = rejectInvalidEncoding(state);
	if (invalidEncodingResponse) return Promise.resolve(invalidEncodingResponse);
	if (state.routeData) return;
	return renderErrorFromState(state, state.request, {
		...state.renderOptions,
		status: 404,
		pathname: state.pathname
	});
}
// node_modules/astro/dist/core/redirects/render.js
function isExternalURL(url) {
	return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
	if (typeof redirect === "string") return isExternalURL(redirect);
	else return isExternalURL(redirect.destination);
}
/**
* Computes the HTTP status code for a redirect response.
*
* - If the route has a `redirectRoute` and an explicit numeric status, that status is used.
* - Otherwise: GET → 301, non-GET (e.g. POST) → 308.
*/
function computeRedirectStatus(method, redirect, redirectRoute) {
	return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
/**
* Resolves the final redirect target URL by substituting dynamic params into
* the redirect string (e.g. `/[slug]/page` → `/hello/page`).
*
* When `redirectRoute` is provided its route generator is used; otherwise params
* are substituted manually into the string redirect target.
*/
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
	if (typeof redirectRoute !== "undefined") return getRouteGenerator(redirectRoute.segments, trailingSlash)(params) || redirectRoute?.pathname || "/";
	else if (typeof redirect === "string") {
		if (redirectIsExternal(redirect)) return redirect;
		else {
			let target = redirect;
			for (const param of Object.keys(params)) {
				const paramValue = params[param];
				target = target.replace(`[${param}]`, () => paramValue).replace(`[...${param}]`, () => paramValue);
			}
			return target;
		}
	} else if (typeof redirect === "undefined") return "/";
	return redirect.destination;
}
async function renderRedirect(state) {
	markFeatureUsed(state.manifest, FetchFeatures.redirects);
	const { redirect, redirectRoute } = state.routeData;
	const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
	const headers = { location: encodeURI(resolveRedirectTarget(state.params, redirect, redirectRoute, state.manifest.trailingSlash)) };
	if (redirect && redirectIsExternal(redirect)) {
		if (typeof redirect === "string") return Response.redirect(redirect, status);
		else return Response.redirect(redirect.destination, status);
	}
	return new Response(null, {
		status,
		headers
	});
}
// node_modules/astro/dist/core/routing/redirect-page.js
/** The delay Astro's built-in redirect page uses for `status`. */
function redirectDelayFor(status) {
	return status === 302 ? 2 : 0;
}
/**
* Renders the project's `src/pages/3xx.astro` as the body of a redirect,
* returning its HTML.
*
* Returns `undefined` when the project has no `3xx.astro`, or when rendering it
* fails — the caller falls back to Astro's built-in redirect page so a broken
* custom page degrades to a working redirect instead of failing the build.
*
* Middleware is skipped: it already ran for the request that produced the
* redirect, and re-running it around a template render would let a middleware
* that redirects recurse.
*/
async function renderRedirectPage(manifest, request, props) {
	const route = getRouteTable(manifest).routes.find((candidate) => isRoute3xx(candidate.route));
	if (!route) return;
	const state = new FetchState(manifest, request);
	try {
		state.skipMiddleware = true;
		state.routeData = route;
		state.pathname = route.route;
		state.status = 200;
		state.componentInstance = await getEnvironment(manifest).getComponentByRoute(manifest, route);
		state.initialProps = { ...props };
		return await (await handleMiddleware(state, handlePages)).text();
	} catch (err) {
		state.logger.error("redirects", `Failed to render \`src/pages/3xx.astro\` for the redirect from \`${props.from}\` to \`${props.to}\`. Falling back to the built-in redirect page.\n${err instanceof Error ? err.stack ?? err.message : String(err)}`);
		return;
	} finally {
		try {
			const finalize = state.finalizeAll();
			if (finalize) await finalize;
		} catch (err) {
			state.logger.error("redirects", `Failed to finalize the \`src/pages/3xx.astro\` render for the redirect from \`${props.from}\` to \`${props.to}\`.\n${err instanceof Error ? err.stack ?? err.message : String(err)}`);
		}
	}
}
// node_modules/astro/dist/core/routing/handler.js
/**
* Dispatches request logging: through the facade's late-bound
* `logThisRequest` hook when the state was built by `BaseApp.render`'s fast
* path (preserving subclass overrides), else through the environment's
* `logRequest` behavior (dev request lines; prod/build/container no-op).
*/
function logRequestFromState(state, payload) {
	if (state.logRequest) state.logRequest(payload);
	else getEnvironment(state.manifest).logRequest(state.manifest, payload);
}
/**
* Runs actions then pages — the callback at the bottom of the middleware
* chain. A module-level function so passing it by reference costs zero
* per-request allocation.
*/
function actionsAndPages(state, ctx) {
	if (!state.skipMiddleware) {
		const actionResult = handleAction(ctx, state);
		if (actionResult) return actionResult.then((response) => response ?? handlePages(state, ctx));
	}
	return handlePages(state, ctx);
}
/**
* Swaps a bodiless redirect response for one carrying the project's rendered
* `src/pages/3xx.astro`.
*
* Only the build environment opts in (see `RenderEnvironment.rendersRedirectPage`):
* a static site has no `Location` header to follow, so the HTML body is the
* redirect. Responses that already carry a body — the trailing-slash
* normalizer's, or a page that rendered its own — are left alone.
*/
async function withRedirectPageBody(state, response) {
	const status = response.status;
	if (status < 300 || status >= 400 || response.body !== null) return response;
	if (!getEnvironment(state.manifest).rendersRedirectPage()) return response;
	const to = response.headers.get("location");
	if (!to) return response;
	const html = await renderRedirectPage(state.manifest, state.request, {
		from: state.pathname,
		to,
		status,
		delay: redirectDelayFor(status)
	});
	if (html === void 0) return response;
	const headers = new Headers(response.headers);
	if (!headers.has("content-type")) headers.set("content-type", "text/html");
	return new Response(html, {
		status,
		statusText: response.statusText,
		headers
	});
}
/**
* The composite "batteries-included" handler that wires up every request
* feature internally; `astro(state)` (astro/fetch) delegates here, as does
* `BaseApp.render`'s default-handler fast path.
*/
async function handleRequest(state) {
	await getResolvedLogger(state.manifest);
	markFeatureUsed(state.manifest, ALL_FETCH_FEATURES);
	const invalidEncodingResponse = rejectInvalidEncoding(state);
	if (invalidEncodingResponse) return invalidEncodingResponse;
	const trailingSlashRedirect = handleTrailingSlash(state);
	if (trailingSlashRedirect) return trailingSlashRedirect;
	const notFoundResponse = handleNotFound(state);
	if (notFoundResponse) return notFoundResponse;
	return render(state);
}
/**
* Renders a response for the given `FetchState`. Assumes trailing-slash
* redirects and routeData resolution have already run.
*
* User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
* `executeRewrite` on the current `FetchState` — they mutate the existing
* state in place and re-run middleware + page dispatch.
*/
async function render(state) {
	const routeData = state.routeData;
	const pathname = state.pathname;
	const request = state.request;
	const { addCookieHeader } = state.renderOptions;
	state.status = getDefaultStatusCode(state.manifest, routeData, pathname);
	let response;
	let finalizeError;
	try {
		const sessionP = state.manifest.sessionConfig ? provideSession(state) : void 0;
		const cacheP = provideCache(state);
		if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
		markFeatureUsed(state.manifest, FetchFeatures.sessions);
		if (routeData.type === "redirect") {
			const redirectResponse = await withRedirectPageBody(state, await renderRedirect(state));
			logRequestFromState(state, {
				pathname,
				method: request.method,
				statusCode: redirectResponse.status,
				isRewrite: false,
				timeStart: state.timeStart
			});
			prepareResponse(redirectResponse, { addCookieHeader });
			state.logger.flush();
			return redirectResponse;
		}
		const i18n = getI18n(state.manifest);
		if (!state.manifest.cacheProvider) {
			markFeatureUsed(state.manifest, FetchFeatures.cache);
			response = await handleMiddleware(state, actionsAndPages);
			if (i18n) response = await finalizeI18n(i18n, state, response);
		} else {
			const runPipeline = async () => {
				let res = await handleMiddleware(state, actionsAndPages);
				if (i18n) res = await finalizeI18n(i18n, state, res);
				return res;
			};
			response = await handleCache(state, runPipeline);
		}
		logRequestFromState(state, {
			pathname,
			method: request.method,
			statusCode: response.status,
			isRewrite: state.isRewriting,
			timeStart: state.timeStart
		});
	} catch (err) {
		state.logger.error(null, err.stack || err.message || String(err));
		return renderErrorFromState(state, request, {
			...state.renderOptions,
			status: 500,
			error: err,
			pathname: state.pathname
		});
	} finally {
		try {
			const finalize = state.finalizeAll();
			if (finalize) await finalize;
		} catch (err) {
			finalizeError = err;
			state.logger.error(null, err.stack || err.message || String(err));
		}
	}
	if (finalizeError) return renderErrorFromState(state, request, {
		...state.renderOptions,
		status: 500,
		error: finalizeError,
		pathname: state.pathname
	});
	if (REROUTABLE_STATUS_CODES.includes(response.status) && response.body === null && !state.skipErrorReroute) return renderErrorFromState(state, request, {
		...state.renderOptions,
		response,
		status: response.status,
		error: response.status === 500 ? null : void 0,
		pathname: state.pathname
	});
	response = await withRedirectPageBody(state, response);
	prepareResponse(response, { addCookieHeader });
	state.logger.flush();
	return response;
}
// node_modules/astro/dist/core/fetch/default-handler.js
/**
* The default request handler for `BaseApp`. Stateless: builds the
* per-request `FetchState` from the manifest and delegates to
* `handleRequest`.
*
* The export path (`astro/app/fetch/default-handler`), the class name, and
* no-arg constructibility are baked into generated builds
* (`core/fetch/vite-plugin.ts` emits `new DefaultFetchHandler()`), so all
* three survive.
*/
var DefaultFetchHandler = class {
	#manifest;
	/**
	* `BaseApp` passes itself so states resolve that app's manifest ahead of
	* the ambient one; generated builds construct the handler with no
	* arguments and use the ambient manifest.
	*/
	constructor(app) {
		this.#manifest = app?.manifest;
	}
	fetch = (request) => {
		const options = getRenderOptions(request);
		const manifest = this.#manifest ?? getAmbientManifest();
		return handleRequest(new FetchState(manifest, request, options));
	};
};
// \0virtual:astro:fetchable
var _virtual_astro_fetchable_default = new DefaultFetchHandler();
// node_modules/astro/dist/core/routing/match-request.js
/**
* Fully decodes a pathname, falling back to a single decode and then the raw pathname
* when validation fails. Matching runs before `render()`, so it must not throw for
* request input that render-time validation handles.
*/
function safeDecodePathname(manifest, pathname) {
	try {
		return validateAndDecodePathname(pathname);
	} catch (e) {
		new AstroIntegrationLogger(getLogger(manifest).options, manifest.adapterName).debug(e.toString());
		try {
			return decodeURI(pathname);
		} catch {
			return pathname;
		}
	}
}
/**
* Given a `Request`, returns the `RouteData` that matches its pathname — the
* appless, purely functional body of `BaseApp.match()`. By default, prerendered
* routes aren't returned, even if they are matched; when
* `allowPrerenderedRoutes` is `true`, matched prerendered routes are returned
* too.
*/
function matchRequest(manifest, request, allowPrerenderedRoutes = false) {
	const url = new URL(request.url);
	if (manifest.assets.has(url.pathname)) return void 0;
	let pathname = computePathnameFromDomain(request, url, manifest.i18n, manifest.base, manifest.trailingSlash, manifest.allowedDomains, getLogger(manifest));
	if (!pathname) pathname = prependForwardSlash$1(stripRequestBase(url.pathname, manifest.base));
	pathname = safeDecodePathname(manifest, pathname);
	const routeData = matchRoute(manifest, pathname);
	if (!routeData) return void 0;
	if (allowPrerenderedRoutes) return routeData;
	if (routeData.prerender) {
		if (routeData.params.length > 0) return matchAllRoutes(manifest, pathname).find((r) => !r.prerender);
		return;
	}
	return routeData;
}
// node_modules/astro/dist/core/app/base.js
var BaseApp = class BaseApp {
	manifest;
	#adapterLogger;
	baseWithoutTrailingSlash;
	/**
	* The streaming flag passed to the constructor, surfaced through the
	* protected `resolveStreaming()` hook and fed into the internal
	* `FetchState` facade hooks on the fast path.
	*/
	#streaming;
	/**
	* The handler that turns incoming `Request` objects into `Response`s.
	* Defaults to a `DefaultFetchHandler` pinned to this app and can be
	* overridden via `setFetchHandler` — typically by the bundled
	* entrypoint after importing `virtual:astro:fetchable`.
	*/
	#fetchHandler;
	#errorHandler;
	/**
	* Whether a custom fetch handler (from `src/fetch.ts`) has been set
	* via `setFetchHandler`. When false, the `DefaultFetchHandler` is
	* in use and all features are implicitly active.
	*/
	#hasCustomFetchHandler = false;
	/**
	* Whether the missing-feature check has already run. We only want
	* to warn once — after the first request in dev, or at build end.
	*/
	#featureCheckDone = false;
	get logger() {
		return getLogger(this.manifest);
	}
	/**
	* Route data derived from the manifest, used for route matching. Reads and
	* writes go through the single per-manifest route table, so HMR updates are
	* visible to every consumer at once.
	*/
	get manifestData() {
		return getRouteTable(this.manifest);
	}
	set manifestData(routesList) {
		updateRouteTable(this.manifest, routesList.routes);
	}
	get adapterLogger() {
		const currentOptions = this.logger.options;
		if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
		return this.#adapterLogger;
	}
	constructor(manifest, streaming = true) {
		this.manifest = manifest;
		this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
		this.#streaming = streaming;
		getRouteTable(manifest);
		getLogger(manifest);
		this.#fetchHandler = new DefaultFetchHandler(this);
		this.#errorHandler = this.createErrorHandler();
	}
	/**
	* Resolves the user-configured logger destination from the manifest and
	* returns the logger. Lazy and only resolves once; safe to call before
	* the first render (adapters use this to log startup messages through
	* the configured destination).
	*/
	getLogger() {
		return getResolvedLogger(this.manifest);
	}
	/**
	* The streaming flag fed into the internal `FetchState` facade hooks on
	* the fast path. Returns the constructor flag by
	* default; `BuildApp` overrides this to return `undefined` so streaming
	* falls through to the environment default (`manifest.serverLike`).
	*/
	resolveStreaming() {
		return this.#streaming;
	}
	/**
	* Override the fetch handler used to dispatch requests. Entrypoints
	* call this with the default export of `virtual:astro:fetchable` to
	* plug in a user-authored handler from `src/fetch.ts`.
	*/
	setFetchHandler(handler) {
		this.#fetchHandler = handler;
		this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
	}
	/**
	* Returns the error handler used by this app. The default is a thin
	* bridge over the functional error API — strategy selection (production
	* default / dev / build) is environment-driven inside `renderErrorPage`.
	* External subclasses can override this to customize error rendering.
	*/
	createErrorHandler() {
		return { renderError: (request, options) => renderErrorPage(this.manifest, request, options) };
	}
	/**
	* Resets the cached adapter logger so it picks up a new logger instance.
	* Used by BuildApp when the logger is replaced via setOptions().
	*/
	resetAdapterLogger() {
		this.#adapterLogger = void 0;
	}
	getAllowedDomains() {
		return this.manifest.allowedDomains;
	}
	matchesAllowedDomains(forwardedHost, protocol) {
		return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
	}
	static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
		return validateHost(forwardedHost, protocol || "https", allowedDomains) !== void 0;
	}
	set setManifestData(newManifestData) {
		updateRouteTable(this.manifest, newManifestData.routes);
	}
	removeBase(pathname) {
		return stripRequestBase(pathname, this.manifest.base);
	}
	/**
	* Fully decodes a pathname, falling back to a single decode and then the raw pathname
	* when validation fails. Adapter matching runs before `render()`, so it must not throw
	* for request input that render-time validation handles.
	*/
	safeDecodePathname(pathname) {
		try {
			return validateAndDecodePathname(pathname);
		} catch (e) {
			this.adapterLogger.debug(e.toString());
			try {
				return decodeURI(pathname);
			} catch {
				return pathname;
			}
		}
	}
	/**
	* Extracts the base-stripped, decoded pathname from a request.
	* Used by adapters to compute the pathname for dev-mode route matching.
	*/
	getPathnameFromRequest(request) {
		const url = new URL(request.url);
		const pathname = prependForwardSlash$1(this.removeBase(url.pathname));
		return this.safeDecodePathname(pathname);
	}
	/**
	* Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
	* routes aren't returned, even if they are matched.
	*
	* When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
	* @param request
	* @param allowPrerenderedRoutes
	*/
	match(request, allowPrerenderedRoutes = false) {
		return matchRequest(this.manifest, request, allowPrerenderedRoutes);
	}
	/**
	* A matching route function to use in the development server.
	* Contrary to the `.match` function, this function resolves props and params, returning the correct
	* route based on the priority, segments. It also returns the correct, resolved pathname.
	* @param pathname
	*/
	devMatch(pathname) {}
	computePathnameFromDomain(request) {
		return computePathnameFromDomain(request, new URL(request.url), this.manifest.i18n, this.manifest.base, this.manifest.trailingSlash, this.manifest.allowedDomains, this.logger);
	}
	async render(request, { addCookieHeader = false, clientAddress = Reflect.get(request, clientAddressSymbol), locals, prerenderedErrorPageFetch = fetch, routeData, waitUntil } = {}) {
		await getResolvedLogger(this.manifest);
		if (routeData) {
			this.logger.debug("router", "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ", request.url);
			this.logger.debug("router", "RouteData");
			this.logger.debug("router", routeData);
		}
		if (locals) {
			if (typeof locals !== "object") {
				const error = new AstroError(LocalsNotAnObject);
				this.logger.error(null, error.stack);
				return this.renderError(request, {
					addCookieHeader,
					clientAddress,
					prerenderedErrorPageFetch,
					locals: void 0,
					routeData,
					waitUntil,
					status: 500,
					error
				});
			}
		}
		if (!routeData) {
			const domainPathname = this.computePathnameFromDomain(request);
			if (domainPathname) routeData = matchRoute(this.manifest, this.safeDecodePathname(domainPathname));
		}
		const resolvedOptions = {
			addCookieHeader,
			clientAddress,
			prerenderedErrorPageFetch,
			locals,
			routeData,
			waitUntil
		};
		let response;
		if (this.#fetchHandler instanceof DefaultFetchHandler) response = await handleRequest(new FetchState(this.manifest, request, resolvedOptions, {
			streaming: this.resolveStreaming(),
			renderError: (req, opts) => this.renderError(req, opts),
			logRequest: (payload) => this.logThisRequest(payload)
		}));
		else {
			setRenderOptions(request, resolvedOptions);
			response = await this.#fetchHandler.fetch(request);
		}
		this.#warnMissingFeatures();
		if (response.headers.get("X-Astro-Error")) {
			response.headers.delete(ASTRO_ERROR_HEADER);
			return this.renderError(request, {
				addCookieHeader,
				clientAddress,
				prerenderedErrorPageFetch,
				locals,
				routeData,
				waitUntil,
				response,
				status: response.status,
				error: response.status === 500 ? null : void 0
			});
		}
		return response;
	}
	setCookieHeaders(response) {
		return getSetCookiesFromResponse(response);
	}
	/**
	* Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
	* For example,
	* ```ts
	* for (const cookie_ of App.getSetCookieFromResponse(response)) {
	*     const cookie: string = cookie_
	* }
	* ```
	* @param response The response to read cookies from.
	* @returns An iterator that yields key-value pairs as equal-sign-separated strings.
	*/
	static getSetCookieFromResponse = getSetCookiesFromResponse;
	/**
	* If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
	* This also handles pre-rendered /404 or /500 routes.
	*
	* Delegates to the app's configured `ErrorHandler`. To customize behavior
	* for a specific environment, override `createErrorHandler()` rather than
	* this method.
	*/
	async renderError(request, options) {
		return this.#errorHandler.renderError(request, options);
	}
	/**
	* One-shot check: after the first request with a custom `src/fetch.ts`,
	* compare `usedFeatures` against the manifest and warn about any
	* configured features the user's pipeline doesn't call.
	*/
	#warnMissingFeatures() {
		if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
		this.#featureCheckDone = true;
		const manifest = this.manifest;
		const missing = [];
		const used = getUsedFeatures(this.manifest);
		if (manifest.routes.some((r) => r.routeData.type === "redirect") && !(used & FetchFeatures.redirects)) missing.push("redirects");
		if (manifest.sessionConfig && !(used & FetchFeatures.sessions)) missing.push("sessions");
		if (manifest.actions && !(used & FetchFeatures.actions)) missing.push("actions");
		if (manifest.middleware && !(used & FetchFeatures.middleware)) missing.push("middleware");
		if (manifest.i18n && manifest.i18n.strategy !== "manual" && !(used & FetchFeatures.i18n)) missing.push("i18n");
		if (manifest.cacheConfig && !(used & FetchFeatures.cache)) missing.push("cache");
		for (const feature of missing) this.logger.warn("router", `Your project uses ${feature}, but your custom src/fetch.ts does not call the ${feature}() handler. This feature will not work unless your fetch handler calls it.`);
	}
	getDefaultStatusCode(routeData, pathname) {
		return getDefaultStatusCode(this.manifest, routeData, pathname);
	}
	getManifest() {
		return this.manifest;
	}
	logThisRequest({ pathname, method, statusCode, isRewrite, timeStart }) {
		const timeEnd = performance.now();
		this.logRequest({
			pathname,
			method,
			statusCode,
			isRewrite,
			reqTime: timeEnd - timeStart
		});
	}
};
// node_modules/astro/dist/core/app/app.js
var App = class extends BaseApp {
	isDev() {
		return false;
	}
	logRequest(_options) {}
};
// node_modules/astro/dist/core/app/entrypoints/virtual/prod.js
var createApp$1 = ({ streaming } = {}) => {
	const app = new App(manifest, streaming);
	app.setFetchHandler(_virtual_astro_fetchable_default);
	return app;
};
// node_modules/astro/dist/core/app/entrypoints/virtual/index.js
var createApp = createApp$1;
// \0virtual:astro-node:config
var _virtual_astro_node_config_exports = /* @__PURE__ */ __exportAll({
	bodySizeLimit: () => bodySizeLimit,
	client: () => client,
	experimentalDisableStreaming: () => false,
	host: () => false,
	mode: () => mode,
	port: () => port,
	server: () => server,
	staticHeaders: () => false
});
var mode = "standalone";
var port = 4321;
var client = "file:///home/gustavovazco/Documentos/GitHub/mevasa-astro-template/dist/client/";
var server = "file:///home/gustavovazco/Documentos/GitHub/mevasa-astro-template/dist/server/";
var bodySizeLimit = 1073741824;
// node_modules/astro/dist/core/app/createOutgoingHttpHeaders.js
/**
* Takes in a nullable WebAPI Headers object and produces a NodeJS OutgoingHttpHeaders object suitable for usage
* with ServerResponse.writeHead(..) or ServerResponse.setHeader(..)
*
* @param headers WebAPI Headers object
* @returns {OutgoingHttpHeaders} NodeJS OutgoingHttpHeaders object with multiple set-cookie handled as an array of values
*/
var createOutgoingHttpHeaders = (headers) => {
	if (!headers) return;
	const nodeHeaders = Object.fromEntries(headers.entries());
	if (Object.keys(nodeHeaders).length === 0) return;
	if (headers.has("set-cookie")) {
		const cookieHeaders = headers.getSetCookie();
		if (cookieHeaders.length > 1) nodeHeaders["set-cookie"] = cookieHeaders;
	}
	return nodeHeaders;
};
// node_modules/astro/dist/core/app/node.js
/**
* Converts a NodeJS IncomingMessage into a web standard Request.
* ```js
* import { createApp } from 'astro/app/entrypoint';
* import { createRequest } from 'astro/app/node';
* import { createServer } from 'node:http';
*
* const app = createApp();
*
* const server = createServer(async (req, res) => {
*     const request = createRequest(req);
*     const response = await app.render(request);
* })
* ```
*/
/**
* Internal version of `createRequest` that skips X-Forwarded-* header
* validation. Forwarded headers are resolved later inside `FetchState`,
* so doing it here too would duplicate work on every request.
*
* Use this for all internal call sites that go through `app.render()`
* (which creates a `FetchState`). The public `createRequest` keeps the
* forwarded header logic for external adapters that may not use
* `FetchState`.
*/
function createRequestFromNodeRequest(req, { skipBody = false, allowedDomains = [], bodySizeLimit, port: serverPort } = {}) {
	const controller = new AbortController();
	const protocol = "encrypted" in req.socket && req.socket.encrypted ? "https" : "http";
	const untrustedHostname = typeof req.headers.host === "string" ? req.headers.host : typeof req.headers[":authority"] === "string" ? req.headers[":authority"] : void 0;
	const validatedForwardedHeaders = validateForwardedHeaders(getFirstForwardedValue(req.headers["x-forwarded-proto"]), getFirstForwardedValue(req.headers["x-forwarded-host"]), getFirstForwardedValue(req.headers["x-forwarded-port"]), allowedDomains, {
		protocol,
		host: untrustedHostname
	});
	const validatedHostname = validateHost(untrustedHostname, validatedForwardedHeaders.protocol ?? protocol, allowedDomains);
	const fallbackHostname = serverPort ? `localhost:${serverPort}` : "localhost";
	const url = buildRequestUrl(protocol, validatedHostname ?? fallbackHostname, req.url, serverPort);
	const options = {
		method: req.method || "GET",
		headers: makeRequestHeaders(req),
		signal: controller.signal
	};
	if (options.method !== "HEAD" && options.method !== "GET" && skipBody === false) Object.assign(options, makeRequestBody(req, bodySizeLimit));
	const request = new Request(url, options);
	wireAbortController(req, controller);
	const clientIp = (validatedHostname !== void 0 || validatedForwardedHeaders.host !== void 0 ? getFirstForwardedValue(req.headers["x-forwarded-for"]) : void 0) || req.socket?.remoteAddress;
	if (clientIp) Reflect.set(request, clientAddressSymbol, clientIp);
	return request;
}
/**
* Wires an AbortController to the underlying socket so the request
* signal is aborted when the connection closes. Shared by both
* `createRequest` and `createRequestFromNodeRequest`.
*/
function wireAbortController(req, controller) {
	const socket = getRequestSocket(req);
	if (socket && typeof socket.on === "function") {
		const existingCleanup = getAbortControllerCleanup(req);
		if (existingCleanup) existingCleanup();
		let cleanedUp = false;
		const removeSocketListener = () => {
			if (typeof socket.off === "function") socket.off("close", onSocketClose);
			else if (typeof socket.removeListener === "function") socket.removeListener("close", onSocketClose);
		};
		const cleanup = () => {
			if (cleanedUp) return;
			cleanedUp = true;
			removeSocketListener();
			controller.signal.removeEventListener("abort", cleanup);
			Reflect.deleteProperty(req, nodeRequestAbortControllerCleanupSymbol);
		};
		const onSocketClose = () => {
			cleanup();
			if (!controller.signal.aborted) controller.abort();
		};
		socket.on("close", onSocketClose);
		controller.signal.addEventListener("abort", cleanup, { once: true });
		Reflect.set(req, nodeRequestAbortControllerCleanupSymbol, cleanup);
		if (socket.destroyed) onSocketClose();
	}
}
/**
* Streams a web-standard Response into a NodeJS Server Response.
* ```js
* import { createApp } from 'astro/app/entrypoint';
* import { createRequest, writeResponse } from 'astro/app/node';
* import { createServer } from 'node:http';
*
* const app = createApp();
*
* const server = createServer(async (req, res) => {
*     const request = createRequest(req);
*     const response = await app.render(request);
*     await writeResponse(response, res);
* })
* ```
* @param source WhatWG Response
* @param destination NodeJS ServerResponse
*/
async function writeResponse(source, destination) {
	const { status, headers, body, statusText } = source;
	if (!(destination instanceof Http2ServerResponse)) destination.statusMessage = statusText;
	destination.writeHead(status, createOutgoingHttpHeaders(headers));
	const cleanupAbortFromDestination = getAbortControllerCleanup(destination.req ?? void 0);
	if (cleanupAbortFromDestination) {
		const runCleanup = () => {
			cleanupAbortFromDestination();
			if (typeof destination.off === "function") {
				destination.off("finish", runCleanup);
				destination.off("close", runCleanup);
			} else {
				destination.removeListener?.("finish", runCleanup);
				destination.removeListener?.("close", runCleanup);
			}
		};
		destination.on("finish", runCleanup);
		destination.on("close", runCleanup);
	}
	if (!body) return destination.end();
	try {
		const reader = body.getReader();
		destination.on("close", () => {
			reader.cancel().catch((err) => {
				if (err?.[Symbol.for("astro.streamErrorLogged")]) return;
				console.error("There was an uncaught error in the middle of the stream while rendering %s.", destination.req.url, err);
			});
		});
		let result = await reader.read();
		while (!result.done) {
			destination.write(result.value);
			result = await reader.read();
		}
		destination.end();
	} catch (err) {
		destination.write("Internal server error", () => {
			err instanceof Error ? destination.destroy(err) : destination.destroy();
		});
	}
}
/**
* Builds the request URL from a client-supplied host, which may contain an
* unparseable port (e.g. `example.com:65536`). Parsing degrades in steps so
* that construction always yields a URL:
*
* 1. Full URL including the request path.
* 2. Origin only, dropping a request path that alone made the URL invalid.
* 3. A host the server controls, when the host itself is unparseable — using
*    the listening port when known so the origin still carries the right port.
*/
function buildRequestUrl(protocol, hostnamePort, requestPath, serverPort) {
	const path = requestPath ?? "";
	if (URL.canParse(`${protocol}://${hostnamePort}${path}`)) return new URL(`${protocol}://${hostnamePort}${path}`);
	if (URL.canParse(`${protocol}://${hostnamePort}`)) return new URL(`${protocol}://${hostnamePort}`);
	const fallbackHost = serverPort ? `localhost:${serverPort}` : "localhost";
	return new URL(`${protocol}://${fallbackHost}`);
}
function makeRequestHeaders(req) {
	const headers = new Headers();
	for (const [name, value] of Object.entries(req.headers)) {
		if (value === void 0) continue;
		if (Array.isArray(value)) for (const item of value) headers.append(name, item);
		else headers.append(name, value);
	}
	return headers;
}
function makeRequestBody(req, bodySizeLimit) {
	if (req.body !== void 0) {
		if (typeof req.body === "string" && req.body.length > 0) return { body: Buffer.from(req.body) };
		if (req.body instanceof ArrayBuffer || ArrayBuffer.isView(req.body)) return { body: req.body };
		if (typeof req.body === "object" && req.body !== null && Object.keys(req.body).length > 0) return { body: Buffer.from(JSON.stringify(req.body)) };
		if (typeof req.body === "object" && req.body !== null && typeof req.body[Symbol.asyncIterator] !== "undefined") return asyncIterableToBodyProps(req.body, bodySizeLimit);
	}
	return asyncIterableToBodyProps(req, bodySizeLimit);
}
function asyncIterableToBodyProps(iterable, bodySizeLimit) {
	return {
		body: bodySizeLimit != null ? limitAsyncIterable(iterable, bodySizeLimit) : iterable,
		duplex: "half"
	};
}
/**
* Wraps an async iterable with a size limit. If the total bytes received
* exceed the limit, an error is thrown.
*/
async function* limitAsyncIterable(iterable, limit) {
	let received = 0;
	for await (const chunk of iterable) {
		const byteLength = chunk instanceof Uint8Array ? chunk.byteLength : typeof chunk === "string" ? Buffer.byteLength(chunk) : 0;
		received += byteLength;
		if (received > limit) throw new Error(`Body size limit exceeded: received more than ${limit} bytes`);
		yield chunk;
	}
}
/**
* Returns the cleanup function for the AbortController and socket listeners created by `createRequest()`
* for the NodeJS IncomingMessage. This should only be called directly if the request is not
* being handled by Astro, i.e. if not calling `writeResponse()` after `createRequest()`.
* ```js
* import { createRequest, getAbortControllerCleanup } from 'astro/app/node';
* import { createServer } from 'node:http';
*
* const server = createServer(async (req, res) => {
*     const request = createRequest(req);
*     const cleanup = getAbortControllerCleanup(req);
*     if (cleanup) cleanup();
*     // can now safely call another handler
* })
* ```
*/
function getAbortControllerCleanup(req) {
	if (!req) return void 0;
	const cleanup = Reflect.get(req, nodeRequestAbortControllerCleanupSymbol);
	return typeof cleanup === "function" ? cleanup : void 0;
}
function getRequestSocket(req) {
	if (req.socket && typeof req.socket.on === "function") return req.socket;
	const http2Socket = req.stream?.session?.socket;
	if (http2Socket && typeof http2Socket.on === "function") return http2Socket;
}
/**
* Resolves the client directory path at runtime.
*
* At build time, we know the relative path between server and client directories.
* At runtime, we need to find the actual location based on where the server entry is running.
*
* ## Error
*
* It throws an error if it can't find the directory while walking the parent directories.
*/
function resolveClientDir(options) {
	const clientURLRaw = new URL(options.client);
	const serverURLRaw = new URL(options.server);
	const rel = path.relative(url.fileURLToPath(serverURLRaw), url.fileURLToPath(clientURLRaw));
	const serverFolder = path.basename(options.server);
	let serverEntryFolderURL = path.dirname(import.meta.url);
	let previous = "";
	while (!serverEntryFolderURL.endsWith(serverFolder)) {
		if (serverEntryFolderURL === previous) throw new Error(`[@astrojs/node] Could not find the server directory "${serverFolder}" by walking up from "${import.meta.url}". This can happen when the server entry point is bundled into a single file (e.g. with a bundler) so that import.meta.url no longer contains the original "${serverFolder}" path segment. When bundling the server entry, make sure the output path contains a "${serverFolder}" directory segment, or avoid bundling the server entry entirely.`);
		previous = serverEntryFolderURL;
		serverEntryFolderURL = path.dirname(serverEntryFolderURL);
	}
	const serverEntryURL = serverEntryFolderURL + "/entry.mjs";
	const clientURL = new URL(appendForwardSlash(rel), serverEntryURL);
	return url.fileURLToPath(clientURL);
}
// node_modules/@astrojs/node/dist/serve-app.js
var PRERENDERED_ROUTE_TYPES = ["page", "endpoint"];
/**
* Shared across every `createAppHandler` call so standalone mode (which builds
* the handler twice) does not register duplicate `unhandledRejection` listeners
* with separate AsyncLocalStorage stores. (#18624)
*/
var requestContext = new AsyncLocalStorage();
var abortedRequestErrors = /* @__PURE__ */ new WeakSet();
var unhandledRejectionListenerInstalled = false;
/**
* `fallbackLogger` is the adapter logger of the first handler, used for rejections
* that happen outside any request.
*/
function installUnhandledRejectionListener(fallbackLogger) {
	if (unhandledRejectionListenerInstalled) return;
	unhandledRejectionListenerInstalled = true;
	process.on("unhandledRejection", (reason) => {
		const store = requestContext.getStore();
		if (!store) {
			const error = reason instanceof Error ? reason.stack || reason.message : String(reason);
			fallbackLogger.error(`Unhandled rejection outside request context\n${error}`);
			process.exitCode = 1;
			return;
		}
		if (reason instanceof Error && abortedRequestErrors.has(reason)) return;
		const error = reason instanceof Error ? reason.stack || reason.message : String(reason);
		store.logger.error(`Unhandled rejection while rendering ${store.url}\n${error}`);
	});
}
/**
* Read a prerendered error page from disk and return it as a Response.
* Returns undefined if the file doesn't exist or can't be read.
*/
async function readErrorPageFromDisk(client, status) {
	const filePaths = [`${status}.html`, `${status}/index.html`];
	for (const filePath of filePaths) {
		const fullPath = path.join(client, filePath);
		let stream;
		try {
			stream = createReadStream(fullPath);
			await new Promise((resolve, reject) => {
				stream.once("open", () => resolve());
				stream.once("error", reject);
			});
			const webStream = Readable.toWeb(stream);
			return new Response(webStream, { headers: { "Content-Type": "text/html; charset=utf-8" } });
		} catch {
			stream?.destroy();
		}
	}
}
/**
* Creates a Node.js http listener for on-demand rendered pages, compatible with http.createServer and Connect middleware.
* If the next callback is provided, it will be called if the request does not have a matching route.
* Intended to be used in both standalone and middleware mode.
*/
function createAppHandler(app, options) {
	const logger = app.adapterLogger;
	installUnhandledRejectionListener(logger);
	const client = resolveClientDir(options);
	const prerenderedErrorPageFetch = async (url) => {
		const { pathname } = new URL(url);
		if (pathname.endsWith("/404.html") || pathname.endsWith("/404/index.html")) {
			const response = await readErrorPageFromDisk(client, 404);
			if (response) return response;
		}
		if (pathname.endsWith("/500.html") || pathname.endsWith("/500/index.html")) {
			const response = await readErrorPageFromDisk(client, 500);
			if (response) return response;
		}
		return new Response(null, { status: 404 });
	};
	const effectiveBodySizeLimit = options.bodySizeLimit === 0 || options.bodySizeLimit === Number.POSITIVE_INFINITY ? void 0 : options.bodySizeLimit;
	return async (req, res, next, locals) => {
		req.once("error", (error) => {
			if (error.code === "ECONNRESET") abortedRequestErrors.add(error);
		});
		let request;
		try {
			request = createRequestFromNodeRequest(req, {
				allowedDomains: app.getAllowedDomains?.() ?? [],
				bodySizeLimit: effectiveBodySizeLimit,
				port: options.port
			});
		} catch (err) {
			logger.error(`Could not render ${req.url}`);
			console.error(err);
			res.statusCode = 500;
			res.end("Internal Server Error");
			return;
		}
		try {
			let routeData = app.match(request, true);
			if (routeData?.prerender && PRERENDERED_ROUTE_TYPES.includes(routeData.type)) routeData = app.match(request);
			if (routeData) await requestContext.run({
				url: request.url,
				logger
			}, async () => {
				await writeResponse(await app.render(request, {
					addCookieHeader: true,
					locals,
					routeData,
					prerenderedErrorPageFetch
				}), res);
			});
			else if (next) {
				const cleanup = getAbortControllerCleanup(req);
				if (cleanup) cleanup();
				return next();
			} else await requestContext.run({
				url: request.url,
				logger
			}, async () => {
				await writeResponse(await app.render(request, {
					addCookieHeader: true,
					prerenderedErrorPageFetch
				}), res);
			});
		} catch (err) {
			if (err instanceof Error && abortedRequestErrors.has(err)) return;
			const error = err instanceof Error ? err.stack || err.message : String(err);
			logger.error(`Could not render ${request.url}\n${error}`);
			if (!res.headersSent) {
				res.statusCode = 500;
				res.end("Internal Server Error");
			} else res.destroy();
		}
	};
}
// node_modules/@astrojs/node/dist/log-listening-on.js
var wildcardHosts = /* @__PURE__ */ new Set([
	"0.0.0.0",
	"::",
	"0000:0000:0000:0000:0000:0000:0000:0000"
]);
async function logListeningOn(logger, server, configuredHost) {
	if (!server.listening) await new Promise((resolve) => server.once("listening", resolve));
	const protocol = server instanceof https.Server ? "https" : "http";
	const host = getResolvedHostForHttpServer(configuredHost);
	const { port } = server.address();
	const address = getNetworkAddress(protocol, host, port);
	if (host === void 0 || wildcardHosts.has(host)) logger.info(`Server listening on \n  local: ${address.local[0]} \t\n  network: ${address.network[0]}\n`);
	else logger.info(`Server listening on ${address.local[0]}`);
}
function getResolvedHostForHttpServer(host) {
	if (host === false) return "localhost";
	else if (host === true) return;
	else return host;
}
function getNetworkAddress(protocol = "http", hostname, port, base) {
	const NetworkAddress = {
		local: [],
		network: []
	};
	Object.values(os.networkInterfaces()).flatMap((nInterface) => nInterface ?? []).filter((detail) => detail && detail.address && detail.family === "IPv4").forEach((detail) => {
		let host = detail.address.replace("127.0.0.1", hostname === void 0 || wildcardHosts.has(hostname) ? "localhost" : hostname);
		if (host.includes(":")) host = `[${host}]`;
		const url = `${protocol}://${host}:${port}${base ? base : ""}`;
		if (detail.address.includes("127.0.0.1")) NetworkAddress.local.push(url);
		else NetworkAddress.network.push(url);
	});
	return NetworkAddress;
}
// node_modules/@astrojs/node/dist/serve-static.js
/**
* Resolves a URL path to a filesystem path within the client directory,
* and checks whether it is a directory.
*
* Returns `isDirectory: false` if the resolved path escapes the client root
* (e.g. via `..` path traversal segments).
*/
function resolveStaticPath(client, urlPath) {
	const filePath = path.join(client, urlPath);
	const resolved = path.resolve(filePath);
	const resolvedClient = path.resolve(client);
	if (resolved !== resolvedClient && !resolved.startsWith(resolvedClient + path.sep)) return {
		filePath: resolved,
		isDirectory: false
	};
	let isDirectory = false;
	try {
		isDirectory = fs.lstatSync(filePath).isDirectory();
	} catch {}
	return {
		filePath: resolved,
		isDirectory
	};
}
/**
* Creates a Node.js http listener for static files and prerendered pages.
* In standalone mode, the static handler is queried first for the static files.
* If one matching the request path is not found, it relegates to the SSR handler.
* Intended to be used only in the standalone mode.
*/
function createStaticHandler(app, options, headersMap) {
	const client = resolveClientDir(options);
	/**
	* @param ssr The SSR handler to be called if the static handler does not find a matching file.
	*/
	return (req, res, ssr) => {
		if (req.url) {
			let fullUrl = req.url;
			if (req.url.includes("#")) fullUrl = fullUrl.slice(0, req.url.indexOf("#"));
			const qIndex = fullUrl.indexOf("?");
			const urlPath = qIndex >= 0 ? fullUrl.slice(0, qIndex) : fullUrl;
			const urlQuery = qIndex >= 0 ? fullUrl.slice(qIndex + 1) : "";
			let fsPath = app.removeBase(urlPath);
			try {
				fsPath = decodeURI(fsPath);
			} catch {}
			const { isDirectory } = resolveStaticPath(client, fsPath);
			const hasSlash = urlPath.endsWith("/");
			let pathname = urlPath;
			if (headersMap && headersMap.length > 0) {
				const request = createRequestFromNodeRequest(req, {
					skipBody: true,
					port: options.port
				});
				const routeData = app.match(request, true);
				getAbortControllerCleanup(req)?.();
				if (routeData && routeData.prerender) {
					const baselessPathname = prependForwardSlash(app.removeBase(urlPath));
					const matchedRoute = headersMap.find((header) => header.pathname.includes(baselessPathname));
					if (matchedRoute) for (const header of matchedRoute.headers) res.setHeader(header.key, header.value);
				}
			}
			switch (app.manifest.trailingSlash) {
				case "never":
					if (isDirectory && urlPath !== "/" && hasSlash) {
						pathname = urlPath.slice(0, -1) + (urlQuery ? "?" + urlQuery : "");
						res.statusCode = 301;
						res.setHeader("Location", pathname);
						return res.end();
					}
					if (isDirectory && !hasSlash) pathname = `${urlPath}/index.html`;
					break;
				case "ignore":
					if (isDirectory && !hasSlash) pathname = `${urlPath}/index.html`;
					break;
				case "always": if (!hasSlash && !hasFileExtension(urlPath) && !isInternalPath(urlPath)) {
					pathname = urlPath + "/" + (urlQuery ? "?" + urlQuery : "");
					res.statusCode = 301;
					res.setHeader("Location", pathname);
					return res.end();
				}
			}
			pathname = prependForwardSlash(app.removeBase(pathname));
			const normalizedPathname = path.posix.normalize(pathname);
			const stream = send(req, normalizedPathname, {
				root: client,
				dotfiles: normalizedPathname.startsWith("/.well-known/") ? "allow" : "deny",
				extensions: app.manifest.buildFormat === "file" || app.manifest.buildFormat === "preserve" ? ["html"] : []
			});
			let forwardError = false;
			stream.on("error", (err) => {
				if (forwardError) {
					const status = "statusCode" in err ? err.statusCode : 500;
					if (status >= 500) console.error(err.toString());
					res.writeHead(status);
					res.end(status >= 500 ? "Internal server error" : "");
					return;
				}
				ssr();
			});
			stream.on("file", () => {
				forwardError = true;
			});
			stream.on("stream", () => {
				if (normalizedPathname.startsWith(`/${app.manifest.assetsDir}/`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
			});
			stream.pipe(res);
		} else ssr();
	};
}
function prependForwardSlash(pth) {
	return pth.startsWith("/") ? pth : "/" + pth;
}
// node_modules/@astrojs/node/dist/standalone.js
var hostOptions = (host) => {
	if (typeof host === "boolean") return host ? "0.0.0.0" : "localhost";
	return host;
};
function standalone(app, options, headersMap) {
	const port = process.env.PORT ? Number(process.env.PORT) : options.port ?? 8080;
	const host = process.env.HOST ?? hostOptions(options.host);
	const server = createServer(createStandaloneHandler(app, {
		...options,
		port
	}, headersMap), host, port);
	server.server.listen(port, host);
	if (process.env.ASTRO_NODE_LOGGING !== "disabled") app.getLogger().then(() => logListeningOn(app.adapterLogger, server.server, host));
	server.server.on("close", () => {
		app.logger.close();
	});
	return {
		server,
		done: server.closed()
	};
}
function createStandaloneHandler(app, options, headersMap) {
	const appHandler = createAppHandler(app, options);
	const staticHandler = createStaticHandler(app, options, headersMap);
	return (req, res) => {
		try {
			decodeURI(req.url);
		} catch {
			res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Bad request.");
			return;
		}
		staticHandler(req, res, () => appHandler(req, res));
	};
}
function createServer(listener, host, port) {
	let httpServer;
	if (process.env.SERVER_CERT_PATH && process.env.SERVER_KEY_PATH) httpServer = https.createServer({
		key: fs.readFileSync(process.env.SERVER_KEY_PATH),
		cert: fs.readFileSync(process.env.SERVER_CERT_PATH)
	}, listener);
	else httpServer = http.createServer(listener);
	enableDestroy(httpServer);
	const closed = new Promise((resolve, reject) => {
		httpServer.addListener("close", resolve);
		httpServer.addListener("error", reject);
	});
	return {
		server: httpServer,
		host,
		port,
		closed() {
			return closed;
		},
		async stop() {
			await new Promise((resolve, reject) => {
				httpServer.destroy((err) => err ? reject(err) : resolve(void 0));
			});
		}
	};
}
var app = createApp({ streaming: true });
var headersMap = void 0;
var handler = createStandaloneHandler(app, _virtual_astro_node_config_exports, headersMap);
var startServer = () => standalone(app, _virtual_astro_node_config_exports, headersMap);
if (process.env.ASTRO_NODE_AUTOSTART !== "disabled") {
	const { done } = startServer();
	done.catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
export { handler, _virtual_astro_node_config_exports as options, startServer };
