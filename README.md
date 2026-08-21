# Be Safe Cyber Range

Laboratórios gratuitos de cibersegurança baseados em cenários de trabalho real.

## O que já existe

- Landing page seguindo a identidade visual do **Be Safe Academy**.
- Catálogo com 30 cenários planejados.
- Filtros por frente de atuação.
- Motor genérico de laboratório orientado a etapas, evidências e decisões.
- Primeiro lab jogável: **SOC — 03:17**.
- Score final, métricas, MITRE ATT&CK e relatório copiável.
- Progresso local com `localStorage`.
- Layout responsivo.
- GitHub Pages sem backend e sem chave de API.

## Estrutura

```text
.
├── index.html
├── lab.html
├── 404.html
├── .nojekyll
├── assets/
│   ├── styles.css
│   ├── app.js
│   └── lab-engine.js
├── data/
│   └── labs.js
└── .github/workflows/
    └── pages.yml
```

## Como adicionar outro lab

A arquitetura foi feita para evitar uma página diferente por cenário. Os metadados ficam em `data/labs.js`. Um lab jogável precisa ter:

- `status: "live"`
- `objectives`
- `scenario`
- `scenario.stages[]`
- evidências por etapa
- opções de decisão com score e feedback
- técnicas MITRE associadas

O player em `assets/lab-engine.js` renderiza o cenário automaticamente.

## Publicar no GitHub Pages

1. Crie um repositório público, por exemplo `Be_Safe_Cyber_Range`.
2. Envie estes arquivos para a branch `main`.
3. Em **Settings → Pages**, selecione **GitHub Actions** como Source.
4. O workflow incluído publica o site automaticamente.

## Segurança e escopo

A Cyber Range é educacional. Cenários devem priorizar defesa, investigação, hardening, arquitetura e simulações controladas. Credenciais, chaves e tokens nunca devem ser colocados no front-end.

## Identidade

Projeto comunitário Be Safe / Mariana BS.
