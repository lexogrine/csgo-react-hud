const regex = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;

const isSvg = (img: Buffer) =>
    regex.test(
        img
            .toString()
            .replace(/\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim, '')
            .replace(/<!--([\s\S]*?)-->/g, '')
    );

export default isSvg;
