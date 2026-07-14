// Clipboard API exists only in secure contexts — absent over plain http,
// e.g. LAN dev on a phone
export async function copyText(text: string): Promise<boolean> {
	if (navigator.clipboard) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// fall through to the execCommand fallback
		}
	}
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.readOnly = true;
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.append(textarea);
	textarea.select();
	textarea.setSelectionRange(0, text.length);
	let copied = false;
	try {
		copied = document.execCommand("copy");
	} catch {
		copied = false;
	}
	textarea.remove();
	return copied;
}
