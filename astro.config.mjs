import { defineConfig } from "astro/config";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [icon({ svgoOptions: { plugins: [{ name: "inlineStyles", params: { onlyMatchedOnce: false } }] } })]
});
