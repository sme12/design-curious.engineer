import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";

import appCss from "../styles.css?url";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

const SITE_URL = "https://design-curious.engineer";
const TITLE = "Vitalii's Website";
const DESCRIPTION = "Vitalii Sazanov — a design-curious engineer";
const SOCIAL_IMAGE = `${SITE_URL}/og-image-v2.png`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: TITLE,
			},
			{
				name: "description",
				content: DESCRIPTION,
			},
			{
				name: "theme-color",
				content: "#262626",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: SITE_URL,
			},
			{
				property: "og:title",
				content: TITLE,
			},
			{
				property: "og:description",
				content: DESCRIPTION,
			},
			{
				property: "og:image",
				content: SOCIAL_IMAGE,
			},
			{
				property: "og:image:width",
				content: "1200",
			},
			{
				property: "og:image:height",
				content: "630",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: TITLE,
			},
			{
				name: "twitter:description",
				content: DESCRIPTION,
			},
			{
				name: "twitter:image",
				content: SOCIAL_IMAGE,
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			// Fonts are needed above the fold and gate the polaroid animation
			// via document.fonts.ready; the desktop-only caption italic is left
			// to load on demand
			{
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href: "/fonts/geist-variable.woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href: "/fonts/shantell-sans-medium.woff2",
				crossOrigin: "anonymous",
			},
			// Only used by the scramble effect, which first fires ~7s in — but
			// without a preload the first flicker would flash fallback mono
			{
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href: "/fonts/geist-pixel-square.woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const missingPostHogEnvVar = !posthogKey
		? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
		: !posthogHost
			? "VITE_PUBLIC_POSTHOG_HOST"
			: undefined;

	if (missingPostHogEnvVar) {
		if (import.meta.env.DEV) {
			throw new Error(
				`${missingPostHogEnvVar} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingPostHogEnvVar} is configured`,
			);
		}

		return <Document>{children}</Document>;
	}

	return (
		<PostHogProvider
			apiKey={posthogKey}
			options={{
				api_host: posthogHost,
				capture_exceptions: {
					capture_unhandled_errors: true,
					capture_unhandled_rejections: true,
					capture_console_errors: false,
				},
				// No cookies, no local/session storage: identity comes from a
				// privacy-preserving hash computed on PostHog's servers.
				// Requires "Cookieless server hash mode" in project settings.
				cookieless_mode: "always",
				debug: import.meta.env.DEV,
				defaults: "2025-05-24",
			}}
		>
			<Document>{children}</Document>
		</PostHogProvider>
	);
}

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
