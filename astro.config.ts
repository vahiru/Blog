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
                author: "Vahiru",
                waline: {
                    serverURL: "https://waline-fawn-nine.vercel.app",
                },
            },
            pages: {
                "/archives/[...page]": false,
                "/blog/[...slug]": false,
                "/categories/[category]/[...page]": false,
                "/tags/[tag]/[...page]": false,
            },
            overrides: {},
        }),
    ],
});
