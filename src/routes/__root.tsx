import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

const SITE_URL = "https://design-curious.engineer";
const TITLE = "Vitalii Sazanov — design-curious engineer";
const DESCRIPTION =
	"Hi, I'm Vitalii — a design-curious engineer. Lead developer at Kraftvaerk by day, studying exceptional UIs by night & weekends. Greetings from Finland.";

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
				content: `${SITE_URL}/og-image.png`,
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
				content: `${SITE_URL}/og-image.png`,
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
			{
				rel: "preload",
				as: "image",
				href: "/polaroid.jpg",
				fetchPriority: "high",
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
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
