import { defineConfig } from "astro/config";
import MochiTones from "astro-mochi-tones";
import mdx from "@astrojs/mdx";

export default defineConfig({
    site: 'https://vahiru.is-cute.cat/',
    integrations: [
        mdx(),
        MochiTones({
            config: {
                title: "Vahiru Blog",
                description: "A personal blog powered by Astro Mochi Tones",
            },
            pages: {},
            overrides: {},
        }),
    ],
});
