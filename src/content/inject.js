let m = /__soulsign_inject__=([^;]+)/.exec(document.cookie);
if (m) {
	document.cookie = `__soulsign_inject__=; expires=${new Date(0).toGMTString()}`;
	let code = decodeURIComponent(m[1]);
	var s = document.createElement("script");
	s.setAttribute("soulsign", "");
	s.innerHTML = code;
	(document.head || document.documentElement).appendChild(s);
}
