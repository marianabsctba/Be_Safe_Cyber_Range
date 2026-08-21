window.BE_SAFE_CORP = {
  name: "BE SAFE CORP. INC.",
  fictional: true,
  industry: "Tecnologia & Serviços",
  workers: 2847,
  endpoints: 3412,
  servers: 186,
  branches: 7,
  cloud: ["AWS", "Azure"],
  soc: "24x7",
  canon: "Todos os laboratórios acontecem no mesmo universo corporativo e podem reutilizar trabalhadores, ativos, identidades, evidências e consequências de cenários anteriores."
};

window.BE_SAFE_LABS = [
  {
    id: "soc-0317",
    order: 1,
    title: "SOC — 03:17",
    short: "Trinta alertas. Um incidente real. Descubra qual antes que a madrugada fique pior.",
    track: "SOC",
    level: "START → JR",
    duration: "25–35 MIN",
    status: "live",
    accent: "#ff3d98",
    skills: ["TRIAGEM", "SIEM", "EDR", "MITRE"],
    description: "Você assumiu o turno noturno do SOC da Be Safe Corp. O SIEM está barulhento, a fila cresceu e há sinais discretos de comprometimento em um endpoint financeiro.",
    objectives: [
      "Priorizar a fila sem cair no alerta mais barulhento",
      "Correlacionar endpoint, identidade, DNS e rede",
      "Escolher uma contenção proporcional",
      "Mapear comportamento ao MITRE ATT&CK",
      "Produzir um resumo de escalonamento"
    ],
    scenario: {
      company: "BE SAFE CORP. INC.",
      role: "ANALISTA SOC — TURNO NOTURNO",
      startTime: "03:17",
      briefing: "O N1 anterior saiu às 03:10. Você encontra nove alertas abertos. A maioria parece rotina, mas um deles possui sinais em fontes diferentes. Seu objetivo não é clicar em tudo: é construir contexto, conter o que importa e preservar evidências.",
      stages: [
        {
          id: "triage",
          title: "A fila está gritando. O que você abre primeiro?",
          narrative: "O dashboard mostra 9 alertas. Três estão em vermelho por severidade do fabricante, dois têm alto volume e quatro são eventos pontuais. Você tem poucos minutos antes do próximo ciclo de ingestão.",
          evidence: [
            {type:"QUEUE", title:"VPN — 4 falhas + sucesso", text:"juliana.souza | mesmo device_id conhecido | origem São Paulo | 03:02–03:04"},
            {type:"QUEUE", title:"Endpoint FIN-WS023 — cadeia incomum", text:"WINWORD.EXE → powershell.exe [comando codificado redigido] | 03:11"},
            {type:"QUEUE", title:"Firewall — pico HTTPS", text:"SRV-BKP01 → endpoints do provedor de backup | 03:00–03:15"},
            {type:"QUEUE", title:"AD — conta de serviço", text:"svc_backup autenticou em SRV-BKP01 durante janela cadastrada | 03:01"}
          ],
          options: [
            {key:"A", label:"Abrir o alerta de endpoint e buscar correlação", detail:"Processo pai/filho incomum em estação financeira merece contexto em DNS, identidade e rede.", points:20, quality:"good", feedback:"Boa priorização. Severidade não é só a cor do dashboard: cadeia de processo + contexto do ativo torna FIN-WS023 mais interessante."},
            {key:"B", label:"Bloquear imediatamente todos os logins VPN", detail:"Interromper o serviço remoto até entender as falhas de autenticação.", points:-10, quality:"bad", feedback:"Ação desproporcional. As falhas vieram do mesmo dispositivo conhecido e terminaram em sucesso. Investigar é válido; derrubar toda VPN não é."},
            {key:"C", label:"Investigar primeiro o pico HTTPS do backup", detail:"É o alerta com maior volume de eventos na fila.", points:2, quality:"bad", feedback:"Volume não equivale a risco. O destino e a janela estão coerentes com o backup cadastrado."},
            {key:"D", label:"Fechar os nove alertas e aguardar reincidência", detail:"Evitar falso positivo até existir evidência mais forte.", points:-20, quality:"bad", feedback:"Você perdeu a oportunidade de investigar sinais convergentes. Ausência de certeza não significa ausência de incidente."}
          ],
          mitre:["T1204.002","T1059.001"]
        },
        {
          id: "correlate",
          title: "FIN-WS023 parece estranho. Qual correlação vale mais agora?",
          narrative: "O EDR confirma que um documento abriu um interpretador de comandos. Não há bloqueio automático. Você precisa descobrir se isso ficou só no endpoint ou se houve comunicação externa.",
          evidence: [
            {type:"EDR", title:"Process tree", text:"OUTLOOK.EXE → WINWORD.EXE → powershell.exe [conteúdo redigido]"},
            {type:"DNS", title:"Consulta rara", text:"FIN-WS023 consultou cdn-sync-check[.]com às 03:12; domínio não visto nos últimos 30 dias"},
            {type:"PROXY", title:"Conexão externa", text:"FIN-WS023 → 185.231.***.74:443 | 1.8 MB enviados | categoria uncategorized"}
          ],
          options: [
            {key:"A", label:"Cruzar usuário, DNS raro, proxy e telemetria do endpoint", detail:"Validar temporalidade e procurar ações posteriores na mesma máquina/identidade.", points:20, quality:"good", feedback:"Perfeito. A força está na convergência: execução suspeita, domínio raro e tráfego externo no mesmo intervalo."},
            {key:"B", label:"Pesquisar somente o hash do documento em um serviço público", detail:"Se não houver detecção, considerar o arquivo limpo.", points:0, quality:"bad", feedback:"Reputação de hash ajuda, mas não encerra análise. Arquivos novos ou modificados podem não ter reputação e o comportamento continua suspeito."},
            {key:"C", label:"Ignorar DNS porque HTTPS criptografa o conteúdo", detail:"Focar apenas no payload do tráfego de rede.", points:-8, quality:"bad", feedback:"Mesmo sem conteúdo TLS, metadados de DNS e conexão são valiosos para correlação e hunting."},
            {key:"D", label:"Reiniciar a estação para limpar processos", detail:"Depois investigar o que sobrou nos logs.", points:-14, quality:"bad", feedback:"Reiniciar cedo demais pode destruir contexto volátil e ainda não resolve identidade, persistência ou comunicação."}
          ],
          mitre:["T1071.001","T1071.004"]
        },
        {
          id: "contain",
          title: "A evidência ficou forte. Como conter sem explodir a empresa?",
          narrative: "O endpoint é de uma analista financeira. A conta possui acesso ao ERP, e o EDR mostra tentativa bloqueada de acesso a credenciais do processo LSASS às 03:14.",
          evidence: [
            {type:"EDR", title:"Credential access blocked", text:"FIN-WS023 | tentativa de acesso a processo sensível | bloqueado pelo sensor | 03:14"},
            {type:"IAM", title:"Sessões da usuária", text:"juliana.souza | FIN-WS023 + sessão web ERP ativa | MFA habilitado"}
          ],
          options: [
            {key:"A", label:"Isolar FIN-WS023 no EDR e revogar sessões da identidade", detail:"Preservar gestão pelo sensor, encerrar tokens/sessões e iniciar reset controlado de credenciais.", points:25, quality:"good", feedback:"Contenção proporcional e orientada a risco. Você reduz movimento lateral/exfiltração sem derrubar serviços não relacionados."},
            {key:"B", label:"Desligar todos os controladores de domínio", detail:"Garantir que nenhuma credencial continue válida.", points:-25, quality:"bad", feedback:"Isso transformaria o incidente em indisponibilidade corporativa. Não há evidência que justifique desligar AD."},
            {key:"C", label:"Bloquear todo tráfego HTTPS de saída", detail:"Impedir qualquer comunicação C2 imediatamente.", points:-18, quality:"bad", feedback:"Bloqueio global de HTTPS causaria impacto enorme. O host e indicadores específicos podem ser contidos sem paralisar a organização."},
            {key:"D", label:"Aguardar confirmação do usuário antes de conter", detail:"Ela pode explicar se abriu algo legítimo.", points:-8, quality:"bad", feedback:"Contato com o usuário pode fazer parte da investigação, mas a combinação atual já justifica contenção do endpoint e da sessão."}
          ],
          mitre:["T1003.001"]
        },
        {
          id: "hunt",
          title: "Contido não significa terminado. Qual hunting você dispara?",
          narrative: "FIN-WS023 está isolado. Agora você precisa saber se o mesmo padrão ocorreu em outros ativos e se o domínio foi resolvido por mais alguém.",
          evidence: [
            {type:"SIEM", title:"IOC pivot", text:"cdn-sync-check[.]com apareceu em FIN-WS023 e em mais 1 endpoint: HR-WS014 às 02:51"},
            {type:"MAIL", title:"Campanha correlata", text:"2 mensagens com assunto 'Ajuste de benefícios 2026' entregues a juliana.souza e bruno.lima"}
          ],
          options: [
            {key:"A", label:"Pivotar domínio + assunto + cadeia de processo em todo ambiente", detail:"Procurar recipients, DNS, process ancestry e conexões externas relacionadas.", points:20, quality:"good", feedback:"Excelente. Você transformou um IOC em hipótese de campanha e ampliou o escopo com comportamento."},
            {key:"B", label:"Bloquear apenas o IP observado", detail:"O IP é a evidência mais concreta do incidente.", points:5, quality:"bad", feedback:"É útil bloquear o IP, mas hunting só por um indicador frágil pode perder infraestrutura alternativa e outros recipients."},
            {key:"C", label:"Encerrar incidente porque o endpoint principal já está isolado", detail:"Abrir um ticket de acompanhamento para o dia seguinte.", points:-15, quality:"bad", feedback:"Há evidência de outro endpoint e de campanha de e-mail. O escopo ainda não está fechado."},
            {key:"D", label:"Apagar as mensagens imediatamente sem registrar recipients", detail:"Reduzir risco antes de qualquer outra ação.", points:-5, quality:"bad", feedback:"Remediação pode ser necessária, mas primeiro preserve o escopo mínimo: recipients, message IDs, URLs/attachments e timeline."}
          ],
          mitre:["T1566.001","T1204.002"]
        },
        {
          id: "escalate",
          title: "Agora escreva como alguém que o N2/N3 vai agradecer.",
          narrative: "Você precisa escalar o caso. O plantonista N2 vai receber apenas o que você registrar no incidente.",
          evidence: [
            {type:"TIMELINE", title:"Resumo temporal", text:"02:51 HR-WS014 DNS raro | 03:11 FIN-WS023 cadeia Office→PowerShell | 03:12 DNS raro | 03:13 conexão externa | 03:14 credential access bloqueado | 03:18 isolamento"}
          ],
          options: [
            {key:"A", label:"Registrar timeline, ativos, identidade, IOCs, ações e pendências", detail:"Separar fatos observados de hipóteses e indicar próximo passo de hunting/coleta.", points:15, quality:"good", feedback:"É isso. Um bom escalonamento reduz retrabalho e deixa claro o que é evidência, decisão tomada e o que ainda falta confirmar."},
            {key:"B", label:"Escrever apenas 'malware detectado e máquina isolada'", detail:"O N2 consegue consultar o SIEM se precisar de detalhes.", points:-8, quality:"bad", feedback:"Escalonamento sem contexto força o próximo analista a refazer a investigação e pode perder decisões importantes."},
            {key:"C", label:"Afirmar que houve ransomware e exfiltração confirmada", detail:"É melhor pecar pelo excesso de severidade.", points:-12, quality:"bad", feedback:"Não invente impacto. Há indício de execução, comunicação e tentativa de credential access; ransomware e exfiltração confirmada não foram demonstrados."},
            {key:"D", label:"Copiar todos os logs brutos para a descrição", detail:"Quanto mais informação, melhor.", points:2, quality:"bad", feedback:"Logs podem ficar anexos. A descrição precisa transformar dados em contexto, timeline e decisões, não virar um despejo de telemetria."}
          ],
          mitre:["T1566.001","T1059.001","T1071.001","T1003.001"]
        }
      ]
    }
  },
  {id:"patient-zero",order:2,title:"Paciente Zero",short:"Reconstrua a timeline e encontre o primeiro endpoint comprometido.",track:"DFIR",level:"JR",duration:"35–50 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#3de7ff",skills:["WINDOWS","TIMELINE","DNS","EDR"]},
  {id:"ransomware-corp",order:3,title:"Ransomware na Be Safe Corp",short:"SOC + DFIR + IR + crise executiva em um cenário encadeado.",track:"IR",level:"JR → PL",duration:"60–90 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff5b5b",skills:["IR","DFIR","DECISÃO","CRISE"]},
  {id:"firewall-ha",order:4,title:"Firewall HA From Hell",short:"Rack, cabeamento, interfaces, VLANs, HA, NAT, políticas, VPN e failover.",track:"NETWORK",level:"JR → PL",duration:"60–120 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff7a3d",skills:["NGFW","HA","VLAN","VPN"]},
  {id:"dfir-who",order:5,title:"DFIR — Quem fez isso?",short:"Artefatos, evidências e timeline para descobrir o vetor inicial.",track:"DFIR",level:"JR",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#9e62ff",skills:["DFIR","FORENSICS","TIMELINE"]},
  {id:"hunt-no-alert",order:6,title:"Threat Hunting sem alerta",short:"Ninguém te deu uma regra pronta. Crie hipótese, procure comportamento e prove.",track:"HUNTING",level:"PL",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#caff33",skills:["HUNTING","SIEM","HYPOTHESIS"]},
  {id:"mitre-detective",order:7,title:"MITRE ATT&CK Detective",short:"Converta comportamento bruto em técnicas, subtécnicas e cadeia de ataque.",track:"DETECTION",level:"START → JR",duration:"25–40 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#5777ff",skills:["MITRE","DETECTION","ANALYSIS"]},
  {id:"phishing-center",order:8,title:"Phishing Investigation Center",short:"Headers, domínio, SPF/DKIM/DMARC, URLs, anexos e decisão de resposta.",track:"SOC",level:"START → JR",duration:"30–45 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff3d98",skills:["EMAIL","IOC","SOC"]},
  {id:"web-attack",order:9,title:"SOC vs Web Attack",short:"Veja o mesmo ataque pelos olhos da aplicação e da defesa.",track:"APPSEC",level:"JR",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#3de7ff",skills:["WAZUH","WEB","CORRELATION"]},
  {id:"cti-board",order:10,title:"CTI Murder Board",short:"Comece com um domínio e pivote até campanha, infraestrutura e ator.",track:"CTI",level:"JR → PL",duration:"45–75 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#9e62ff",skills:["CTI","PIVOT","OPENCTI"]},
  {id:"ioc-intel",order:11,title:"IOC não é inteligência",short:"Transforme uma pilha de indicadores em inteligência acionável.",track:"CTI",level:"JR",duration:"30–45 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#9e62ff",skills:["CTI","CONTEXT","CONFIDENCE"]},
  {id:"cloud-door",order:12,title:"Cloud — Quem deixou essa porta aberta?",short:"Permissões excessivas, secrets, storage público e caminhos de privilégio.",track:"CLOUD",level:"JR → PL",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#5777ff",skills:["IAM","CLOUD","MISCONFIG"]},
  {id:"iam-disaster",order:13,title:"IAM Disaster",short:"Offboarding falhou. Encontre privilégios órfãos e quebre o caminho de abuso.",track:"IAM",level:"JR → PL",duration:"35–50 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#caff33",skills:["JML","MFA","RBAC","IGA"]},
  {id:"soc-ai",order:14,title:"SOC + IA — Confie, mas nem tanto",short:"A IA analisa incidentes. Algumas respostas estão erradas. Valide tudo.",track:"AI",level:"JR → PL",duration:"30–45 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#3de7ff",skills:["AI","VALIDATION","SOC"]},
  {id:"prompt-injection",order:15,title:"Prompt Injection Incident",short:"Defenda uma aplicação com LLM contra manipulação de instruções e abuso de contexto.",track:"AI",level:"PL",duration:"40–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff3d98",skills:["LLM","GUARDRAILS","APPSEC"]},
  {id:"api-attack",order:16,title:"API Under Attack",short:"Autorização quebrada, abuso de autenticação, rate abuse e exposição de dados.",track:"APPSEC",level:"JR → PL",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff7a3d",skills:["API","OWASP","AUTH"]},
  {id:"siem-cost",order:17,title:"O SIEM ficou caro pra cacete",short:"Escolha fontes, filtros, retenção, EPS e armazenamento sem matar visibilidade.",track:"ARCH",level:"PL",duration:"40–55 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#caff33",skills:["SIEM","EPS","LOGS","COST"]},
  {id:"false-positive",order:18,title:"False Positive Factory",short:"Uma regra dispara milhares de vezes. Tune sem deixar o atacante passar.",track:"DETECTION",level:"JR → PL",duration:"30–45 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#5777ff",skills:["TUNING","SIEM","FP"]},
  {id:"detection-engineering",order:19,title:"Detection Engineering",short:"Da técnica ofensiva à telemetria, regra, teste e redução de falsos positivos.",track:"DETECTION",level:"PL",duration:"45–70 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#5777ff",skills:["SIGMA","MITRE","TEST"]},
  {id:"purple-arena",order:20,title:"Purple Team Arena",short:"Execute uma técnica controlada, valide cobertura e melhore a detecção.",track:"PURPLE",level:"PL",duration:"60–90 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#9e62ff",skills:["PURPLE","BAS","DETECTION"]},
  {id:"linux-compromised",order:21,title:"Servidor Linux comprometido",short:"SSH, auth.log, cron, systemd, processos e conexões. Sem ferramenta mágica.",track:"DFIR",level:"JR",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#caff33",skills:["LINUX","DFIR","SSH"]},
  {id:"windows-events",order:22,title:"Windows Event Logs Challenge",short:"Resolva o incidente quase só com Event Logs, Sysmon e PowerShell.",track:"DFIR",level:"START → JR",duration:"35–50 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#3de7ff",skills:["WINDOWS","SYSMON","EVENTS"]},
  {id:"container-crime",order:23,title:"Container Crime Scene",short:"Imagem, secrets, processos e rede em um workload comprometido.",track:"CLOUD",level:"PL",duration:"45–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#5777ff",skills:["CONTAINER","K8S","DFIR"]},
  {id:"ciso-30",order:24,title:"Você é o CISO por 30 minutos",short:"Orçamento curto, riscos demais e um board pedindo decisão.",track:"GRC",level:"PL → SR",duration:"30 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff7a3d",skills:["RISK","BOARD","PRIORITY"]},
  {id:"cve-priority",order:25,title:"CVE ≠ prioridade",short:"500 vulnerabilidades. Descubra quais realmente merecem parar a fila.",track:"VM",level:"JR → PL",duration:"35–50 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#caff33",skills:["CTEM","EPSS","KEV","RISK"]},
  {id:"incident-commander",order:26,title:"Incident Commander",short:"CEO, jurídico, DPO, SOC, imprensa e fornecedor perguntando ao mesmo tempo.",track:"IR",level:"PL → SR",duration:"40–60 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff5b5b",skills:["CRISIS","IR","COMMS"]},
  {id:"timeline",order:27,title:"Timeline Challenge",short:"Firewall, AD, endpoint, proxy e DNS embaralhados. Reconstrua o ataque.",track:"DFIR",level:"JR",duration:"30–45 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#3de7ff",skills:["TIMELINE","CORRELATION","SIEM"]},
  {id:"chain-custody",order:28,title:"Cadeia de Custódia Digital",short:"Colete, registre, hasheie e transfira evidências sem destruir a rastreabilidade.",track:"DFIR",level:"START → JR",duration:"30–45 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#9e62ff",skills:["EVIDENCE","HASH","FORENSICS"]},
  {id:"security-architect",order:29,title:"Arquiteto de Segurança",short:"Requisitos, orçamento e riscos viram uma arquitetura que precisa fazer sentido.",track:"ARCH",level:"PL → SR",duration:"60–90 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff7a3d",skills:["ARCH","DESIGN","TRADEOFF"]},
  {id:"presales",order:30,title:"Pré-vendas Cyber Challenge",short:"TR, P2P, sizing, BoM, arquitetura e pegadinhas de uma oportunidade realista.",track:"PRESALES",level:"JR → SR",duration:"60–120 MIN",status:"planned",company:"BE SAFE CORP. INC.",accent:"#ff3d98",skills:["RFP","SIZING","BOM","P2P"]}
];
