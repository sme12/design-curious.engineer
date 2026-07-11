// Clipboard API exists only in secure contexts — absent over plain http,
// e.g. LAN dev on a phone
export function copyText(text: string) {
	if (navigator.clipboard) {
		void navigator.clipboard.writeText(text);
		return;
	}
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.readOnly = true;
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.append(textarea);
	textarea.select();
	textarea.setSelectionRange(0, text.length);
	document.execCommand("copy");
	textarea.remove();
}
