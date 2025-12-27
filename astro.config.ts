import { defineConfig } from "astro/config";
import MochiTones from "astro-mochi-tones";

export default defineConfig({
    site: 'https://vahiru.is-cute.cat/',
    integrations: [
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
