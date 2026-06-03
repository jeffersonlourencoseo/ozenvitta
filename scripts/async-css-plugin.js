// Plugin Vite para transformar CSS externo em carregamento assíncrono
export default function asyncCss() {
  return {
    name: 'async-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"\n\t\t<noscript><link rel="stylesheet" href="$1"></noscript>'
      );
    }
  };
}
