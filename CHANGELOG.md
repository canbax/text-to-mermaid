## 0.0.7 (2026-02-09)

### Features

- neural layer implemented ([1f6a644](https://github.com/canbax/text-to-mermaid/commit/1f6a644ba460d987ad3d0b2bc36a3d3b48b11269))
- add failing demo script ([9bc8c0a](https://github.com/canbax/text-to-mermaid/commit/9bc8c0a895734e8486c46abf25fa71999eb9d59f))
- add support for local or other LLM API usages ([cbb8dda](https://github.com/canbax/text-to-mermaid/commit/cbb8dda204da1bca7d8349abc6a17fd4532a3f06))
- create readme and install dependencies ([42ff937](https://github.com/canbax/text-to-mermaid/commit/42ff93728e702a712bba6a37ddd6f4eec61e9497))
- deterministic parse for sentence "Why participate?" ([8749291](https://github.com/canbax/text-to-mermaid/commit/8749291238cef353a2a47d30e00e4ef26160a8be))
- deterministic parser, stage 1 ([cf0ee69](https://github.com/canbax/text-to-mermaid/commit/cf0ee696c7813133f0a457cbca8b2a3c544e5ee6))
- don't return null for simple sentences in deterministic parsing ([0653448](https://github.com/canbax/text-to-mermaid/commit/0653448fe6ce9eb5f5e07504d2a44ec7a0161c80))
- enhance the deterministic rule parser for longer sentences ([1ec08c8](https://github.com/canbax/text-to-mermaid/commit/1ec08c860fbfd83c2a966e8056c15329018b4e43))
- fix util to convert JSON to grammar ([aaf2487](https://github.com/canbax/text-to-mermaid/commit/aaf2487d3abfaa7d35e3631db58e671ee99d74da))
- genaiParse with @google/genai ([533c548](https://github.com/canbax/text-to-mermaid/commit/533c548e680ab88122fb241acae18a44a279a8a0))
- generate 2 texts on demo ([2568b50](https://github.com/canbax/text-to-mermaid/commit/2568b503ce3df080d2481663db400dd3449ad2b2))
- handle sentences with no nouns ([3088c34](https://github.com/canbax/text-to-mermaid/commit/3088c34281e8abf2ac27cce1a28194d6744832ec))
- more tests for simple short sentences ([de7b2c4](https://github.com/canbax/text-to-mermaid/commit/de7b2c4344146f236020d6b87689a0e1823ba6dd))
- replace `useAiFallback` with `useAI` option ([9f49c9a](https://github.com/canbax/text-to-mermaid/commit/9f49c9ac537cdbb08fcdbfcefceb0c3e0feadfd9))
- rework deterministic parser to generate multi-node graphs ([b85c6aa](https://github.com/canbax/text-to-mermaid/commit/b85c6aa2626c56dee780723742ab85ac3316c9d7))
- rework deterministic rule parsing to a verb-pivot strategy ([98c1fb3](https://github.com/canbax/text-to-mermaid/commit/98c1fb3dc4c289d1a3117f4665446f1845e4c951))
- sanitize Mermaid node IDs ([651ec22](https://github.com/canbax/text-to-mermaid/commit/651ec2224865d65bcda5d9d91246584a3b67233c))
- update demo ([d770f75](https://github.com/canbax/text-to-mermaid/commit/d770f75ec612926ee33d80ca488a94c0ad76e0c5))
- use @huggingface/transformers and use complex sentence for testing ([4bb1f66](https://github.com/canbax/text-to-mermaid/commit/4bb1f66f73f9540d9a17f8f84d43c71e149d555c))
- wire deterministic parser with Neural parser and define `textToMermaid` function ([da6b382](https://github.com/canbax/text-to-mermaid/commit/da6b38216cbac3ead82b0d0451aa7fdfcf03a1a6))

### Bug Fixes

- escape and quote node labels in Mermaid output ([cde1749](https://github.com/canbax/text-to-mermaid/commit/cde1749ebce7d968ff4cd1eeb78913a87191a0fc))
- fix dist for esm output ([81856d5](https://github.com/canbax/text-to-mermaid/commit/81856d5c3861474c1835b18ee5f551a36e82fbc4))
