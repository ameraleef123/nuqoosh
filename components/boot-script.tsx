/**
 * Runs before first paint, and — critically — runs even if the React bundle
 * never arrives. It does three things:
 *
 *  1. Adds `.js` to <html>. The reveal guard in globals.css is scoped to
 *     `html.js`, so with JS disabled nothing is ever hidden.
 *  2. Resolves the stored theme before paint, so there is no flash.
 *  2b. Honours ?theme= and ?lang= in the URL, which beats the stored value.
 *     This makes a link reproducible — it is what QA screenshots use, and it
 *     lets a student send a recruiter a page already in English.
 *  3. Arms a watchdog: if the motion layer has not reported ready within 3s
 *     (slow network, failed chunk, thrown error), it force-reveals everything.
 */
const BOOT = `(function(){
  var d = document.documentElement;
  d.classList.add('js');
  var q = {};
  try {
    var sp = new URLSearchParams(location.search);
    if (sp.get('theme')) q.theme = sp.get('theme');
    if (sp.get('lang')) q.lang = sp.get('lang');
  } catch (e) {}
  try {
    var t = q.theme || localStorage.getItem('nuqush-theme');
    if (t === 'dark' || t === 'light') d.setAttribute('data-theme', t);
    var l = q.lang || localStorage.getItem('nuqush-lang');
    if (l === 'en') { d.setAttribute('lang','en'); d.setAttribute('dir','ltr'); }
  } catch (e) {}
  setTimeout(function(){
    if (d.dataset.motionReady !== '1') d.classList.add('motion-failsafe');
  }, 3000);
})()`

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT }} />
}
