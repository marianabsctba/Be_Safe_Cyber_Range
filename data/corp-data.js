window.BSC_DATA = {
  company: {
    name: 'Be Safe Corp .Inc', domain: 'besafecorp.inc', employees: 642, endpoints: 718, servers: 82,
    firewalls: 6, switches: 34, aps: 78, cloudAccounts: 3, applications: 41, databases: 16, internetServices: 19,
    sites: ['BSC-HQ-SP','BSC-DC1-SP','BSC-RJ','BSC-BSB','BSC-CWB','BSC-REC','BSC-POA']
  },
  techStack: [
    ['Identity','Active Directory','Microsoft Entra ID','Keycloak','PAM / MFA'],
    ['SOC / SIEM','Wazuh','OpenSearch','Sysmon','Sigma'],
    ['DFIR / Hunting','Velociraptor','YARA','KAPE-like collection','Timeline Explorer-like workflow'],
    ['Threat Intel','OpenCTI','MISP','STIX/TAXII','MITRE ATT&CK'],
    ['Network Security','Be Safe EdgeGate NGFW','IPsec','BGP/OSPF','LACP / VLAN / SD-WAN'],
    ['Endpoint','Be Safe XDR','Windows Defender telemetry','Linux auditd','EDR live response'],
    ['Cloud','AWS','Azure','Kubernetes','Cloud audit logs'],
    ['ITSM / Change','Be Safe Service Desk','Incident / Problem / Change','SLA','CMDB']
  ],
  people: [
    {id:'u1001',name:'Lucas Almeida',role:'SOC Analyst N1',team:'SOC',email:'lucas.almeida@besafecorp.inc'},
    {id:'u1002',name:'Renata Mello',role:'Infrastructure Lead',team:'Infra',email:'renata.mello@besafecorp.inc'},
    {id:'u1003',name:'Carla Nunes',role:'CFO',team:'Finance',email:'carla.nunes@besafecorp.inc'},
    {id:'u1004',name:'Paulo Martins',role:'Security Manager',team:'Cybersecurity',email:'paulo.martins@besafecorp.inc'},
    {id:'u1005',name:'Ana Costa',role:'Financial Analyst',team:'Finance',email:'ana.costa@besafecorp.inc'},
    {id:'u1006',name:'Bruno Reis',role:'IAM Analyst',team:'Identity',email:'bruno.reis@besafecorp.inc'},
    {id:'u1007',name:'Marcos Lima',role:'Network Engineer',team:'Network',email:'marcos.lima@besafecorp.inc'}
  ],
  assets: [
    {id:'WS-FIN-021',type:'Workstation',os:'Windows 11 24H2',ip:'10.20.21.44',vlan:20,site:'BSC-HQ-SP',owner:'Ana Costa',criticality:'High',edr:'Online',risk:'Critical'},
    {id:'WS-FIN-044',type:'Workstation',os:'Windows 11 24H2',ip:'10.20.44.62',vlan:20,site:'BSC-HQ-SP',owner:'Carla Nunes',criticality:'Critical',edr:'Online',risk:'Low'},
    {id:'APP-PROD-01',type:'Server',os:'Ubuntu 24.04 LTS',ip:'10.40.10.21',vlan:40,site:'BSC-DC1-SP',owner:'ERP Platform',criticality:'Critical',edr:'Online',risk:'High'},
    {id:'DB-PROD-01',type:'Server',os:'RHEL 9',ip:'10.40.20.15',vlan:40,site:'BSC-DC1-SP',owner:'Database Team',criticality:'Critical',edr:'Online',risk:'Medium'},
    {id:'DC01',type:'Server',os:'Windows Server 2025',ip:'10.40.1.10',vlan:40,site:'BSC-DC1-SP',owner:'Identity',criticality:'Critical',edr:'Online',risk:'Low'},
    {id:'BSC-FW-A',type:'NGFW',os:'BeSafeOS 8.2',ip:'10.255.10.11',vlan:60,site:'BSC-DC1-SP',owner:'Network Security',criticality:'Critical',edr:'N/A',risk:'Low'},
    {id:'BSC-FW-B',type:'NGFW',os:'BeSafeOS 8.2',ip:'10.255.10.12',vlan:60,site:'BSC-DC1-SP',owner:'Network Security',criticality:'Critical',edr:'N/A',risk:'Medium'}
  ],
  tickets: [
    {id:'INC-2026-0001',type:'Security Incident',title:'Comportamento suspeito em endpoint do Financeiro',priority:'P1',status:'In Progress',assignee:'Você',sla:78,asset:'WS-FIN-021',requester:'SOCBOT',description:'Correlação detectou autenticações falhas, PowerShell codificado e conexão outbound incomum. Confirmar escopo, preservar evidência e conter sem interromper fechamento financeiro desnecessariamente.',notes:[]},
    {id:'INC-2026-0042',type:'Incident',title:'Cluster NGFW BSC-EDGE-HA degraded',priority:'P2',status:'Open',assignee:'Network Security',sla:164,asset:'BSC-FW-B',requester:'NOC',description:'Heartbeat HA2 perdeu sincronismo às 07:41. Nó B permanece standby, mas session sync está parcial. Validar interfaces HA e executar failover controlado apenas em janela aprovada.',notes:[]},
    {id:'SEC-2026-0018',type:'Security Incident',title:'Possível phishing executivo - NF Agosto',priority:'P2',status:'Open',assignee:'SOC',sla:202,asset:'WS-FIN-044',requester:'Carla Nunes',description:'CFO recebeu mensagem com anexo ZIP e pede validação antes de abrir.',notes:[]},
    {id:'CHG-2026-0193',type:'Change',title:'Remediação OpenSSL em APP-PROD-01',priority:'P2',status:'Pending Approval',assignee:'Platform',sla:480,asset:'APP-PROD-01',requester:'Vulnerability Mgmt',description:'Atualização emergencial planejada. Rollback: snapshot + package rollback. Janela 21:00-22:00.',notes:[]},
    {id:'IAM-2026-0007',type:'Access Review',title:'Offboarding incompleto - usuário svc-marketing',priority:'P2',status:'Open',assignee:'Identity',sla:240,asset:'DC01',requester:'IGA',description:'Conta associada a ex-colaborador permanece habilitada e ainda pertence ao grupo VPN-External.',notes:[]}
  ],
  logs: [
    {ts:'08:31:02',source:'windows',host:'WS-FIN-021',event:'4625',user:'acosta',src:'10.20.21.44',message:'An account failed to log on. LogonType=3 Status=0xC000006D'},
    {ts:'08:31:07',source:'windows',host:'WS-FIN-021',event:'4625',user:'acosta',src:'10.20.21.44',message:'An account failed to log on. LogonType=3 Status=0xC000006A'},
    {ts:'08:31:12',source:'windows',host:'WS-FIN-021',event:'4625',user:'acosta',src:'10.20.21.44',message:'An account failed to log on. LogonType=3 Status=0xC000006A'},
    {ts:'08:31:21',source:'windows',host:'WS-FIN-021',event:'4624',user:'acosta',src:'10.20.21.44',message:'Successful logon. LogonType=2 AuthenticationPackage=Negotiate'},
    {ts:'08:33:04',source:'sysmon',host:'WS-FIN-021',event:'1',user:'BSC\\acosta',src:'-',message:'Process Create: powershell.exe -NoP -W Hidden -enc SQBFAFgAIAAo... Parent=WINWORD.EXE'},
    {ts:'08:34:42',source:'edr',host:'WS-FIN-021',event:'behavior',user:'BSC\\acosta',src:'-',message:'Credential access behavior: process attempted LSASS handle with PROCESS_VM_READ'},
    {ts:'08:36:02',source:'windows',host:'WS-FIN-021',event:'5140',user:'BSC\\acosta',src:'10.20.21.44',message:'Network share accessed: \\10.40.1.10\\SYSVOL'},
    {ts:'08:39:17',source:'firewall',host:'BSC-FW-A',event:'allow',user:'acosta',src:'10.20.21.44',dst:'185.231.72.19',message:'ALLOW tcp/443 Finance-to-Internet bytes_out=48211 app=tls'},
    {ts:'08:39:20',source:'dns',host:'DNS01',event:'query',user:'-',src:'10.20.21.44',dst:'-',message:'Query update-check-security[.]com A -> 185.231.72.19'},
    {ts:'08:41:06',source:'proxy',host:'PROXY01',event:'connect',user:'acosta',src:'10.20.21.44',dst:'185.231.72.19',message:'CONNECT update-check-security.com:443 status=200 bytes=48211'},
    {ts:'07:41:14',source:'firewall',host:'BSC-FW-B',event:'ha',user:'system',src:'169.254.253.2',dst:'169.254.253.1',message:'HA2 heartbeat missed. peer_state=reachable session_sync=partial'},
    {ts:'07:41:18',source:'firewall',host:'BSC-FW-A',event:'ha',user:'system',src:'169.254.253.1',dst:'169.254.253.2',message:'Cluster health degraded. active=BSC-FW-A standby=BSC-FW-B'},
    {ts:'06:14:19',source:'vuln',host:'APP-PROD-01',event:'CVE-2026-41102',user:'scanner',src:'10.50.3.10',dst:'10.40.10.21',message:'OpenSSL remote memory disclosure signature matched. CVSS=9.8 EPSS=0.91 exposure=internet-facing'},
    {ts:'07:12:02',source:'identity',host:'DC01',event:'4728',user:'svc-marketing',src:'10.10.18.20',dst:'-',message:'Member present in VPN-External after HR termination event. accountEnabled=true'}
  ],
  xdr: {
    endpoints: {
      'WS-FIN-021': {status:'Online',isolation:'Not isolated',risk:'Critical',lastUser:'BSC\\acosta',evidenceCollected:false,processes:[
        ['08:32:58','WINWORD.EXE','C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE','normal'],
        ['08:33:04','powershell.exe','powershell.exe -NoP -W Hidden -enc SQBFAFgAIAAo...','critical'],
        ['08:34:41','rundll32.exe','rundll32.exe C:\\Users\\acosta\\AppData\\Local\\Temp\\upd.dll,Start','high'],
        ['08:35:10','svchost.exe','svchost.exe -k netsvcs','normal']
      ], network:[['08:39:17','185.231.72.19:443','TLS','48211 B'],['08:36:02','10.40.1.10:445','SMB','8124 B']]},
      'WS-FIN-044': {status:'Online',isolation:'Not isolated',risk:'Low',lastUser:'BSC\\cnunes',evidenceCollected:false,processes:[['08:20:11','outlook.exe','outlook.exe','normal']],network:[]}
    }, blockedIOCs:[]
  },
  firewall: {
    cluster:{name:'BSC-EDGE-HA',active:'BSC-FW-A',standby:'BSC-FW-B',ha1:'UP',ha2:'DEGRADED',sync:'PARTIAL',failovers:0},
    interfaces:[
      {name:'port1',alias:'WAN1',ip:'203.0.113.10/29',zone:'WAN',link:'UP'},
      {name:'port2',alias:'WAN2',ip:'198.51.100.10/29',zone:'WAN',link:'UP'},
      {name:'port3',alias:'LAN-LACP-A',ip:'LACP1',zone:'LAN',link:'UP'},
      {name:'port4',alias:'LAN-LACP-B',ip:'LACP1',zone:'LAN',link:'UP'},
      {name:'port7',alias:'HA1',ip:'169.254.254.1/30',zone:'HA',link:'UP'},
      {name:'port8',alias:'HA2',ip:'169.254.253.1/30',zone:'HA',link:'FLAP'}
    ],
    rules:[
      {id:1,name:'FINANCE_TO_ERP',source:'VLAN20_FIN',destination:'APP-PROD-01',service:'HTTPS',action:'ALLOW',logging:true,hits:8831},
      {id:2,name:'APP_TO_DB',source:'APP-PROD-01',destination:'DB-PROD-01',service:'TCP/5432',action:'ALLOW',logging:true,hits:44105},
      {id:3,name:'USERS_TO_INTERNET',source:'CORP_USERS',destination:'INTERNET',service:'WEB',action:'ALLOW',logging:true,hits:188402}
    ], blockedIPs:[]
  },
  mail:[
    {id:'m1',from:'faturamento@fornecedor-brasil.co',to:'carla.nunes@besafecorp.inc',subject:'NF Agosto - vencimento hoje',time:'08:18',unread:true,body:'Bom dia Carla, segue NF atualizada. Precisamos do pagamento ainda hoje para evitar suspensão. Favor abrir o arquivo e confirmar.',attachment:'NF_AGOSTO_88291.zip',headers:{returnPath:'bounce@mailer-fornecedor.net',spf:'softfail',dkim:'none',dmarc:'fail',received:'mx12.mailer-fornecedor.net [185.231.72.42]'},flagged:false},
    {id:'m2',from:'paulo.martins@besafecorp.inc',to:'you@besafecorp.inc',subject:'Onboarding - primeiro turno',time:'07:55',unread:true,body:'Bem-vindo ao time. Não trate console como videogame: documente, valide impacto e deixe trilha de auditoria. Se algo parecer fácil demais, provavelmente faltou contexto.',attachment:null,headers:{spf:'pass',dkim:'pass',dmarc:'pass'},flagged:false}
  ],
  chats:{
    slack:[
      {channel:'#soc',messages:[
        {time:'08:43',from:'Lucas Almeida',text:'Pessoal, alguém tá olhando o alerta do WS-FIN-021? Começou com falhas de login e agora apareceu PowerShell estranho.'},
        {time:'08:46',from:'Renata Mello',text:'Fechamento financeiro hoje. Se forem isolar endpoint, confirmem qual usuário e preservem evidência antes, por favor.'}
      ]},
      {channel:'#infra',messages:[{time:'07:49',from:'Marcos Lima',text:'FW-B segue standby, mas HA2 tá flapping. Sem impacto percebido até agora. Não quero failover surpresa em horário comercial.'}]},
      {channel:'#security-ops',messages:[{time:'08:10',from:'Paulo Martins',text:'Prioridade do turno: resolver com método. Fato, hipótese, evidência, ação, validação.'}]}
    ],
    teams:[
      {channel:'Cybersecurity Operations',messages:[{time:'08:40',from:'Paulo Martins',text:'INC-2026-0001 foi atribuído ao turno. Atualizem o ticket com fatos e pendências; nada de conclusão por feeling.'}]},
      {channel:'Incident War Room',messages:[{time:'08:47',from:'SOCBOT',text:'War room disponível caso o incidente financeiro seja confirmado como comprometimento.'}]}
    ]
  },
  vulnerabilities:[
    {id:'VULN-7712',asset:'APP-PROD-01',cve:'CVE-2026-41102',cvss:9.8,epss:0.91,kev:true,exposure:'Internet-facing',status:'Open',business:'ERP / Critical',remediation:'Upgrade OpenSSL package to fixed vendor build; restart application service; validate health checks.'},
    {id:'VULN-6610',asset:'LAB-PC-88',cve:'CVE-2025-22110',cvss:10.0,epss:0.02,kev:false,exposure:'Offline lab segment',status:'Open',business:'Lab / Low',remediation:'Patch during next lab maintenance window.'}
  ],
  identity:{accounts:[
    {user:'svc-marketing',display:'Marketing Integration Service',enabled:true,mfa:false,groups:['VPN-External','Marketing-Apps'],lastLogin:'2026-08-20 18:42',owner:'Former employee: Julia Prado',risk:'High'},
    {user:'acosta',display:'Ana Costa',enabled:true,mfa:true,groups:['Finance-Users','ERP-Users'],lastLogin:'2026-08-21 08:31',owner:'Finance',risk:'Medium'},
    {user:'cnunes',display:'Carla Nunes',enabled:true,mfa:true,groups:['Finance-Executives','ERP-Approvers'],lastLogin:'2026-08-21 08:02',owner:'Finance',risk:'Low'}
  ]},
  missions:[
    {id:'M01',ticket:'INC-2026-0001',title:'03:17 — Finance under suspicion',duration:'45–60 min',status:'active',skills:['SOC','SIEM','XDR','IR','ITSM','COMMS'],objectives:[
      ['ticket_opened','Abrir e ler o incidente atribuído'],['siem_investigated','Investigar telemetria correlata no SIEM'],['xdr_inspected','Inspecionar a timeline do endpoint'],['evidence_collected','Coletar evidência antes da contenção'],['endpoint_isolated','Conter o endpoint comprometido'],['ioc_blocked','Bloquear o IOC confirmado'],['ticket_updated','Atualizar o ticket com fatos e próximos passos'],['soc_comms','Comunicar o SOC'],['incident_resolved','Resolver o ticket somente após validar contenção']
    ]},
    {id:'M02',ticket:'INC-2026-0042',title:'HA degraded — sem susto em produção',duration:'40–60 min',status:'active',skills:['NGFW','HA','NETWORK','CHANGE'],objectives:[['fw_opened','Inspecionar cluster e interfaces'],['ha_diagnosed','Identificar HA2 degradado'],['ha_fixed','Restabelecer HA2 e session sync'],['failover_tested','Executar failover controlado'],['ha_ticket_updated','Registrar resultado no incidente']]},
    {id:'M03',ticket:'SEC-2026-0018',title:'A NF que veio com pressa demais',duration:'35–50 min',status:'active',skills:['EMAIL','PHISHING','CTI','SOC'],objectives:[['mail_opened','Abrir e inspecionar a mensagem'],['headers_inspected','Validar headers SPF/DKIM/DMARC'],['mail_flagged','Marcar mensagem como phishing'],['mail_ioc_blocked','Bloquear infraestrutura maliciosa relacionada'],['phish_ticket_updated','Atualizar o caso com evidências']]},
    {id:'M04',ticket:'CHG-2026-0193',title:'CVSS não manda sozinho',duration:'45–60 min',status:'active',skills:['VM','CTEM','CHANGE','RISK'],objectives:[['vuln_opened','Analisar vulnerabilidade com contexto'],['change_opened','Revisar change e rollback'],['patch_applied','Aplicar remediação planejada'],['patch_validated','Validar serviço após patch']]},
    {id:'M05',ticket:'IAM-2026-0007',title:'A conta que esqueceu de sair',duration:'35–50 min',status:'active',skills:['IAM','JML','MFA','RBAC'],objectives:[['iam_opened','Investigar conta e grupos'],['account_disabled','Desabilitar conta órfã'],['access_revoked','Remover acesso VPN'],['iam_ticket_updated','Documentar o offboarding corretivo']]}
  ]
};
