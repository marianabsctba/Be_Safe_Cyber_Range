(function(){
  const D=window.BSC_DATA;
  D.company.datacenters=['BSC-DC1-SP','BSC-DR1-CWB'];
  D.company.clients=['BlueBank','MedCare','AeroLog'];
  D.company.regions=['Brazil South','Brazil Southeast'];
  D.techStack.push(
    ['Network Detection','Be Safe NDR','NetFlow','Zeek-like telemetry','East-west analytics'],
    ['Application Security','Be Safe WAF/API','OWASP controls','Rate limiting','API schema enforcement'],
    ['Data Security','Be Safe DLP','Endpoint DLP','Email DLP','Cloud DLP'],
    ['Privileged Access','Be Safe PAM','Vault','Session recording','JIT elevation'],
    ['Backup / Resilience','Be Safe Recovery','Immutable repository','Recovery orchestration','Ransomware telemetry'],
    ['Purple Team','Be Safe BAS','Atomic simulations','Detection validation','Coverage mapping'],
    ['GRC','Be Safe Governance','Risk register','Controls','Exceptions','Audit evidence'],
    ['Physical / DC','Be Safe DC Ops','Racks','PDUs','Environmental monitoring','Access control']
  );

  D.people.push(
    {id:'u1008',name:'Diego Rocha',role:'DFIR Lead',team:'Incident Response',email:'diego.rocha@besafecorp.inc'},
    {id:'u1009',name:'Fernanda Souza',role:'Cloud Security Engineer',team:'Cloud Security',email:'fernanda.souza@besafecorp.inc'},
    {id:'u1010',name:'Mateus Tavares',role:'AppSec Engineer',team:'Application Security',email:'mateus.tavares@besafecorp.inc'},
    {id:'u1011',name:'Bianca Lopes',role:'GRC Analyst',team:'Governance',email:'bianca.lopes@besafecorp.inc'},
    {id:'u1012',name:'Henrique Vidal',role:'DC Operations',team:'Infrastructure',email:'henrique.vidal@besafecorp.inc'},
    {id:'u1013',name:'Otavio Campos',role:'MSS Customer Success',team:'MSS',email:'otavio.campos@besafecorp.inc'}
  );

  D.assets.push(
    {id:'WEB-DMZ-01',type:'Server',os:'Ubuntu 24.04 LTS',ip:'172.16.10.20',vlan:110,site:'BSC-DC1-SP',owner:'Digital Platform',criticality:'High',edr:'Online',risk:'High'},
    {id:'WAF-01',type:'WAF/API Gateway',os:'BeSafe Application Shield 4.2',ip:'172.16.10.5',vlan:110,site:'BSC-DC1-SP',owner:'AppSec',criticality:'Critical',edr:'N/A',risk:'Medium'},
    {id:'JUMP-ADM-01',type:'Privileged Jump Host',os:'Windows Server 2025',ip:'10.60.10.20',vlan:60,site:'BSC-DC1-SP',owner:'PAM',criticality:'Critical',edr:'Online',risk:'High'},
    {id:'BKP-CTRL-01',type:'Backup Server',os:'Hardened Linux',ip:'10.70.10.11',vlan:70,site:'BSC-DC1-SP',owner:'Backup Team',criticality:'Critical',edr:'Online',risk:'Low'},
    {id:'BSC-IMM-01',type:'Immutable Repository',os:'Hardened Linux',ip:'10.70.20.12',vlan:70,site:'BSC-DC1-SP',owner:'Backup Team',criticality:'Critical',edr:'N/A',risk:'Low'},
    {id:'K8S-API-01',type:'Kubernetes Control Plane',os:'Kubernetes 1.34',ip:'10.80.10.10',vlan:80,site:'BSC-DC1-SP',owner:'Cloud Platform',criticality:'Critical',edr:'N/A',risk:'High'},
    {id:'FILE-HR-01',type:'File Server',os:'Windows Server 2025',ip:'10.40.30.25',vlan:40,site:'BSC-DC1-SP',owner:'HR',criticality:'High',edr:'Online',risk:'Medium'},
    {id:'WS-HR-019',type:'Workstation',os:'Windows 11 24H2',ip:'10.20.33.19',vlan:20,site:'BSC-HQ-SP',owner:'Helena Rodrigues',criticality:'Medium',edr:'Online',risk:'High'},
    {id:'WS-HR-027',type:'Workstation',os:'Windows 11 24H2',ip:'10.20.33.27',vlan:20,site:'BSC-HQ-SP',owner:'People Ops',criticality:'Medium',edr:'Online',risk:'Medium'},
    {id:'FILE-FIN-01',type:'File Server',os:'Windows Server 2025',ip:'10.40.30.35',vlan:40,site:'BSC-DC1-SP',owner:'Finance',criticality:'Critical',edr:'Online',risk:'Medium'},
    {id:'ERP-FILE-01',type:'Application File Node',os:'RHEL 9',ip:'10.40.10.31',vlan:40,site:'BSC-DC1-SP',owner:'ERP Platform',criticality:'Critical',edr:'Online',risk:'Low'},
    {id:'NDR-SENSOR-01',type:'NDR Sensor',os:'Be Safe SensorOS',ip:'10.50.20.10',vlan:50,site:'BSC-DC1-SP',owner:'SOC',criticality:'High',edr:'N/A',risk:'Low'},
    {id:'CI-RUNNER-01',type:'CI/CD Runner',os:'Ubuntu 24.04',ip:'10.90.10.20',vlan:90,site:'BSC-DC1-SP',owner:'Platform Engineering',criticality:'High',edr:'Online',risk:'Medium'}
  );

  D.tickets.push(
    {id:'SEC-2026-0061',type:'Security Incident',title:'Possível credential stuffing contra API de clientes',priority:'P1',status:'Open',assignee:'AppSec / SOC',sla:64,asset:'WAF-01',requester:'SOCBOT',description:'WAF detectou aumento de POST /api/login distribuído por múltiplos ASN. Validar automação, false positives e aplicar controle sem bloquear clientes legítimos.',notes:[]},
    {id:'CLD-2026-0021',type:'Cloud Security',title:'Bucket de exportação de Marketing com ACL pública',priority:'P1',status:'Open',assignee:'Cloud Security',sla:93,asset:'aws-prod-02',requester:'CSPM',description:'Bucket bsc-marketing-export expõe objetos via public-read herdado. Confirmar conteúdo, owner, logs de acesso e remediar mantendo integração autorizada.',notes:[]},
    {id:'SEC-2026-0077',type:'Security Incident',title:'Possible ransomware precursor on FILE-HR-01',priority:'P1',status:'Open',assignee:'IR',sla:49,asset:'FILE-HR-01',requester:'XDR',description:'XDR e backup telemetry reportam shadow copy enumeration, high-rate file rename e tentativa de autenticação no controlador de backup.',notes:[]},
    {id:'DLP-2026-0014',type:'Data Loss Prevention',title:'Exportação de dados pessoais para storage não aprovado',priority:'P2',status:'Open',assignee:'Data Security',sla:181,asset:'WS-FIN-044',requester:'DLP',description:'Arquivo clientes_Q3.xlsx foi enviado para storage pessoal por navegador. Validar contexto e aplicar política adequada sem presumir intenção maliciosa.',notes:[]},
    {id:'PAM-2026-0009',type:'Privileged Access',title:'Sessão privilegiada fora da janela aprovada',priority:'P1',status:'Open',assignee:'IAM / SOC',sla:71,asset:'JUMP-ADM-01',requester:'PAM',description:'Conta adm_vendor iniciou sessão RDP via jump host sem ticket de change correlato. Sessão permanece ativa.',notes:[]},
    {id:'NDR-2026-0028',type:'Network Security',title:'SMB lateral movement pattern detected',priority:'P1',status:'Open',assignee:'SOC',sla:58,asset:'NDR-SENSOR-01',requester:'NDR',description:'Sensor detectou fan-out SMB/445 e Kerberos anômalo entre workstation, jump host e DC01. Correlacionar endpoint, identidade e rede.',notes:[]},
    {id:'DFIR-2026-0012',type:'DFIR Case',title:'Preservação forense de WS-FIN-021',priority:'P2',status:'Open',assignee:'DFIR',sla:360,asset:'WS-FIN-021',requester:'Incident Commander',description:'Criar aquisição lógica mínima, hashes, cadeia de custódia e timeline antes de qualquer reimage.',notes:[]},
    {id:'DET-2026-0033',type:'Detection Engineering',title:'Regra PowerShell gera excesso de falso positivo',priority:'P3',status:'Open',assignee:'Detection Engineering',sla:720,asset:'SIEM',requester:'SOC Lead',description:'Regra genérica para powershell.exe -enc gera alertas legítimos de automação. Ajustar lógica sem perder cobertura do incidente financeiro.',notes:[]},
    {id:'PUR-2026-0004',type:'Purple Team',title:'Validar cobertura de credential access + lateral movement',priority:'P3',status:'Open',assignee:'Purple Team',sla:1440,asset:'BSC-LAB',requester:'Security Manager',description:'Executar simulações seguras e verificar quais camadas detectam T1003 e T1021.002. Registrar gaps e melhorar detections.',notes:[]},
    {id:'GRC-2026-0030',type:'Risk / Compliance',title:'Exceção de MFA para conta técnica expira hoje',priority:'P2',status:'Open',assignee:'GRC / IAM',sla:300,asset:'svc-legacy-erp',requester:'Risk Engine',description:'Exceção temporária de MFA aprovada por 30 dias vence hoje. Owner solicita extensão sem plano de remediação atualizado.',notes:[]},
    {id:'MSS-BLUE-2026-0091',type:'Customer Incident',title:'BlueBank reporta indisponibilidade após bloqueio do SOC',priority:'P1',status:'Open',assignee:'MSS SOC',sla:38,asset:'BLUE-WEB-02',requester:'BlueBank NOC',description:'Cliente afirma que um IP de parceiro foi bloqueado durante investigação. Validar evidência, escopo do bloqueio e comunicação conforme SLA contratual.',notes:[]},
    {id:'DC-2026-0011',type:'Datacenter Incident',title:'Acesso físico + interface de management fora do padrão',priority:'P1',status:'Open',assignee:'DC Ops / SOC',sla:54,asset:'BSC-DC1-SP',requester:'Physical Security',description:'Catraca registrou acesso de fornecedor e, 7 minutos depois, JUMP-ADM-01 iniciou conexão à rede de management. Correlacionar badge, PAM, NDR e firewall.',notes:[]},
    {id:'RED-2026-0001',type:'Authorized Adversary Simulation',title:'External-to-DC attack path validation',priority:'P3',status:'Open',assignee:'Red / Purple Team',sla:1440,asset:'WEB-DMZ-01',requester:'CISO',description:'Exercício autorizado e totalmente simulado. Objetivo: demonstrar caminho de ataque de serviço público até zona de management e depois investigar o rastro defensivo.',notes:[]},
    {id:'APP-2026-0019',type:'AppSec',title:'Secret encontrado em pipeline CI',priority:'P1',status:'Open',assignee:'AppSec / Platform',sla:88,asset:'CI-RUNNER-01',requester:'Secret Scanner',description:'Scanner detectou token de integração em variável de pipeline legada. Revogar, rotacionar, revisar logs e corrigir origem.',notes:[]}
  );

  D.logs.push(
    {ts:'09:02:12',source:'waf',host:'WAF-01',event:'credential_stuffing',user:'-',src:'198.18.1.31',dst:'172.16.10.20',message:'POST /api/login rate=284/min distributed user-agent cluster confidence=92%'},
    {ts:'09:03:01',source:'api',host:'WEB-DMZ-01',event:'401_burst',user:'multiple',src:'198.18.1.0/24',dst:'172.16.10.20',message:'Authentication failures exceeded baseline x18 for /api/login'},
    {ts:'09:14:02',source:'cloud',host:'aws-prod-02',event:'PublicAccessBlockChanged',user:'marketing-ci',src:'10.90.10.20',dst:'bsc-marketing-export',message:'Bucket public access block disabled by legacy pipeline role'},
    {ts:'09:17:51',source:'cloud',host:'aws-prod-02',event:'GetObject',user:'anonymous',src:'203.0.113.77',dst:'bsc-marketing-export',message:'Anonymous object read: campaign_leads_Q3.csv'},
    {ts:'09:31:22',source:'xdr',host:'FILE-HR-01',event:'ransomware_behavior',user:'BSC\\hrodrigues',src:'10.20.33.19',dst:'-',message:'High-rate rename + vssadmin shadow copy enumeration observed'},
    {ts:'09:32:10',source:'backup',host:'BKP-CTRL-01',event:'auth_failure',user:'backup-admin',src:'10.40.30.25',dst:'10.70.10.11',message:'Multiple failed logins from FILE-HR-01 to backup controller'},
    {ts:'09:40:18',source:'dlp',host:'WS-FIN-044',event:'web_upload',user:'cnunes',src:'10.20.44.62',dst:'personal-drive.example',message:'clientes_Q3.xlsx contains CPF/email patterns; browser upload 18.2MB'},
    {ts:'09:48:06',source:'pam',host:'JUMP-ADM-01',event:'session_start',user:'adm_vendor',src:'10.60.20.44',dst:'10.40.1.10',message:'RDP privileged session started without correlated approved change'},
    {ts:'09:49:33',source:'ndr',host:'NDR-SENSOR-01',event:'east_west_fanout',user:'adm_vendor',src:'10.60.10.20',dst:'10.40.0.0/16',message:'SMB fan-out 37 hosts / 90s + Kerberos service ticket anomaly'},
    {ts:'10:06:44',source:'physical',host:'BSC-DC1-ACS',event:'badge_granted',user:'vendor-8831',src:'DOOR-DC1-MANTRAP',dst:'R03',message:'Temporary vendor badge granted access to row R03; escort=required'},
    {ts:'10:13:57',source:'firewall',host:'BSC-FW-A',event:'mgmt_allow',user:'adm_vendor',src:'10.60.10.20',dst:'10.255.10.11',message:'ALLOW TCP/443 JUMP-ADM-01 -> FW management zone policy=ADMIN_MGMT'},
    {ts:'10:27:12',source:'ci',host:'CI-RUNNER-01',event:'secret_detection',user:'pipeline',src:'10.90.10.20',dst:'-',message:'Potential API token exposed in environment variable LEGACY_EXPORT_TOKEN'},
    {ts:'10:41:10',source:'waf',host:'WAF-01',event:'path_probe',user:'-',src:'198.18.10.77',dst:'172.16.10.20',message:'Authorized simulation: unusual path enumeration against /legacy-support'},
    {ts:'10:44:31',source:'web',host:'WEB-DMZ-01',event:'sim_foothold',user:'svc-web',src:'198.18.10.77',dst:'172.16.10.20',message:'AUTHORIZED RANGE EVENT: simulated foothold token issued by exercise engine'},
    {ts:'10:48:55',source:'ndr',host:'NDR-SENSOR-01',event:'sim_pivot',user:'svc-web',src:'172.16.10.20',dst:'10.60.10.20',message:'AUTHORIZED RANGE EVENT: DMZ-to-jump lateral path simulation'},
    {ts:'10:52:04',source:'identity',host:'DC01',event:'sim_ticket',user:'svc-web',src:'10.60.10.20',dst:'10.40.1.10',message:'AUTHORIZED RANGE EVENT: anomalous service ticket request used by purple-team scenario'}
  );

  D.xdr.endpoints['FILE-HR-01']={status:'Online',isolation:'Not isolated',risk:'Critical',lastUser:'BSC\\hrodrigues',evidenceCollected:false,processes:[['09:30:58','cmd.exe','cmd.exe /c whoami','normal'],['09:31:22','vssadmin.exe','vssadmin list shadows','critical'],['09:31:31','powershell.exe','powershell.exe -File inventory.ps1','high'],['09:31:49','rename-worker.exe','rename-worker.exe --path D:\\HR','critical']],network:[['09:32:10','10.70.10.11:443','HTTPS','12 KB'],['09:30:44','10.40.1.10:88','Kerberos','4 KB']]};

  D.cloudFindings=[
    {id:'CLD-F-001',severity:'High',resource:'s3://bsc-marketing-export',account:'aws-prod-02',finding:'Public read ACL inherited from legacy deployment',status:'Open',public:true,owner:'Marketing Data',lastAccess:'203.0.113.77'},
    {id:'CLD-F-002',severity:'Medium',resource:'sg-01e443',account:'aws-prod-01',finding:'SSH permitted from partner VPN range',status:'Accepted',public:false,owner:'Platform',lastAccess:'partner-vpn'},
    {id:'CLD-F-003',severity:'High',resource:'k8s/legacy-payments',account:'k8s-prod',finding:'Service account token mounted in legacy workload',status:'Open',public:false,owner:'Payments',lastAccess:'internal'}
  ];
  D.identity.accounts.push(
    {user:'svc-hr-sync',display:'HR File Synchronization',enabled:true,mfa:false,groups:['HR-Servers','File-Replication'],lastLogin:'2026-08-21 09:30',owner:'HR Infrastructure',risk:'High'},
    {user:'hrodrigues',display:'Helena Rodrigues',enabled:true,mfa:true,groups:['HR-Users'],lastLogin:'2026-08-21 09:29',owner:'HR',risk:'Medium'}
  );
  D.xdr.endpoints['WS-HR-019']={status:'Online',isolation:'Not isolated',risk:'High',lastUser:'BSC\\hrodrigues',evidenceCollected:false,processes:[['09:28:04','outlook.exe','outlook.exe','normal'],['09:29:18','mshta.exe','mshta.exe hxxp://hr-policy.invalid/update','critical'],['09:29:46','powershell.exe','powershell.exe -nop -w hidden <simulated>','critical']],network:[['09:30:01','10.40.30.25:445','SMB','1.8 MB'],['09:29:55','198.18.44.19:443','TLS','44 KB']]};
  D.xdr.endpoints['WS-HR-027']={status:'Online',isolation:'Not isolated',risk:'Medium',lastUser:'BSC\\peopleops',evidenceCollected:false,processes:[['09:45:02','explorer.exe','explorer.exe','normal']],network:[]};
  D.xdr.endpoints['FILE-FIN-01']={status:'Online',isolation:'Not isolated',risk:'Medium',lastUser:'BSC\\svc-fin-files',evidenceCollected:false,processes:[['09:00:00','System','System','normal']],network:[]};
  D.xdr.endpoints['ERP-FILE-01']={status:'Online',isolation:'Not isolated',risk:'Low',lastUser:'svc-erp',evidenceCollected:false,processes:[['09:00:00','systemd','/sbin/init','normal']],network:[]};

  D.waf={mode:'Detect',rateLimit:500,botProtection:'Monitor',schemaEnforcement:'Monitor',blockedSources:[],routes:[
    {path:'/api/login',risk:'High',rps:34,auth:'OIDC',status:'Degraded'},
    {path:'/api/customers',risk:'Critical',rps:11,auth:'OAuth2',status:'Healthy'},
    {path:'/api/payment',risk:'Critical',rps:8,auth:'mTLS + OAuth2',status:'Healthy'},
    {path:'/legacy-support',risk:'High',rps:1,auth:'Legacy token',status:'Exposed'}
  ]};
  D.ndr={sensors:[{id:'NDR-SENSOR-01',tap:'CORE-L3 SPAN 3',status:'Online',pps:18420}],flows:[
    {time:'09:31',src:'10.20.33.19',dst:'10.40.30.25',proto:'SMB/Kerberos',score:98,note:'ransomware SMB spread + service-account reuse'},
    {time:'09:32',src:'10.40.30.25',dst:'10.70.10.11',proto:'HTTPS/Auth',score:97,note:'file server probing backup control plane during ransomware behavior'},
    {time:'09:49',src:'10.60.10.20',dst:'10.40.1.10',proto:'SMB/Kerberos',score:92,note:'fan-out + ticket anomaly'},
    {time:'10:48',src:'172.16.10.20',dst:'10.60.10.20',proto:'HTTPS/RDP',score:88,note:'authorized attack simulation pivot'},
    {time:'08:39',src:'10.20.21.44',dst:'185.231.72.19',proto:'TLS',score:89,note:'rare external destination'}
  ],blocked:[]};
  D.dlp={policies:[
    {id:'DLP-P01',name:'Personal Data - Web Upload',mode:'Monitor',matches:['CPF','Email','Customer ID'],exceptions:['approved-secure-transfer']},
    {id:'DLP-P02',name:'Source Code / Secrets',mode:'Block',matches:['Private key','API token'],exceptions:['approved-repositories']}
  ],events:[{id:'DLP-E14',user:'cnunes',host:'WS-FIN-044',file:'clientes_Q3.xlsx',channel:'Web upload',destination:'personal-drive.example',size:'18.2 MB',status:'Open',classification:'Personal Data'}]};
  D.pam={vaultHealth:'Healthy',sessions:[
    {id:'PAM-S-9001',user:'adm_vendor',target:'DC01',via:'JUMP-ADM-01',started:'09:48',ticket:null,status:'Active',recording:true,risk:'Critical'},
    {id:'PAM-S-8992',user:'adm_db',target:'DB-PROD-01',via:'JUMP-ADM-01',started:'07:12',ticket:'CHG-2026-0188',status:'Closed',recording:true,risk:'Low'}
  ],secrets:[{id:'sec-db-prod',owner:'Database Team',rotationDays:30,lastRotated:'2026-08-03',status:'Healthy'},{id:'sec-legacy-export',owner:'Marketing',rotationDays:90,lastRotated:'2026-03-10',status:'Overdue'}]};
  D.backupState={lockdown:false,immutability:true,repositories:[{id:'BSC-IMM-01',free:'34 TB',immutableUntil:'2026-09-20',health:'Healthy'}],jobs:[
    {id:'JOB-ERP',workload:'ERP-PROD',last:'07:30',rpo:'30m',status:'Success',restoreTest:'2026-08-19'},
    {id:'JOB-AD',workload:'AD-TIER0',last:'07:10',rpo:'60m',status:'Success',restoreTest:'2026-08-15'},
    {id:'JOB-HR',workload:'FILE-HR-01',last:'09:00',rpo:'30m',status:'Success',restoreTest:'2026-08-10'}
  ],alerts:[{time:'09:32',severity:'Critical',event:'Failed authentication from FILE-HR-01 to backup controller'}]};
  D.ransomware={
    name:'Operation Black Frost',active:false,stage:'precursor',elapsed:0,startedAt:null,contained:false,eradicated:false,recoveryValidated:false,incidentDeclared:false,warRoom:false,legalNotified:false,execNotified:false,credentialRevoked:false,networkSegmented:false,backupProtected:false,patientZero:'WS-HR-019',initialServer:'FILE-HR-01',compromisedIdentity:'svc-hr-sync',
    impact:{encryptedFiles:86,unavailableServices:[],affectedUsers:6,dataExfiltration:'Not confirmed',businessImpact:'HR shared folders degraded'},
    hosts:[
      {id:'WS-HR-019',role:'Patient zero',status:'Compromised',encrypted:12,criticality:'Medium',vector:'User execution',wave:0},
      {id:'FILE-HR-01',role:'HR file server',status:'Encrypting',encrypted:74,criticality:'High',vector:'SMB + svc-hr-sync',wave:0},
      {id:'WS-HR-027',role:'HR workstation',status:'At risk',encrypted:0,criticality:'Medium',vector:'SMB',wave:1},
      {id:'FILE-FIN-01',role:'Finance file server',status:'At risk',encrypted:0,criticality:'Critical',vector:'svc-hr-sync reuse',wave:2},
      {id:'DC01',role:'Domain controller',status:'Protected',encrypted:0,criticality:'Critical',vector:'Tier-0 boundary',wave:3},
      {id:'BKP-CTRL-01',role:'Backup controller',status:'Targeted',encrypted:0,criticality:'Critical',vector:'Credential attack',wave:3},
      {id:'BSC-IMM-01',role:'Immutable repository',status:'Protected',encrypted:0,criticality:'Critical',vector:'Backup deletion attempt',wave:4},
      {id:'APP-PROD-01',role:'ERP application',status:'At risk',encrypted:0,criticality:'Critical',vector:'Shared admin path',wave:4}
    ],
    timeline:[
      {time:'09:28',type:'Initial access',detail:'WS-HR-019 launched a simulated malicious HTML application from a realistic HR-themed lure.'},
      {time:'09:30',type:'Credential use',detail:'svc-hr-sync authenticated from WS-HR-019 and accessed FILE-HR-01 over SMB.'},
      {time:'09:31',type:'Impact',detail:'FILE-HR-01 began high-rate rename/encryption behavior; shadow copy enumeration observed.'},
      {time:'09:32',type:'Defense evasion / recovery targeting',detail:'FILE-HR-01 attempted authentication to BKP-CTRL-01.'}
    ],
    actions:[],recovery:{selectedRestorePoint:null,cleanRoom:false,adHealth:false,filesValidated:false,businessValidated:false,restoreStarted:false,restoreComplete:false},
    decisions:{severity:null,scope:null,containment:null,eradication:null,recovery:null}
  };
  D.dfir={caseId:'DFIR-2026-0012',evidence:[],chain:[],timeline:[
    {time:'08:33:04',artifact:'Sysmon EID 1',detail:'PowerShell encoded command spawned by WINWORD.EXE'},
    {time:'08:34:42',artifact:'EDR',detail:'LSASS access attempt'},
    {time:'08:39:17',artifact:'Firewall',detail:'Outbound TLS to 185.231.72.19'}
  ]};
  D.detections=[
    {id:'DET-PS-001',title:'Encoded PowerShell',enabled:true,logic:'process.name=powershell.exe AND command_line contains -enc',threshold:1,falsePositives:47,hits:53,mitre:'T1059.001'},
    {id:'DET-SMB-004',title:'SMB Fan-out',enabled:true,logic:'distinct(dst_host) > 20 over 120s AND dst_port=445',threshold:20,falsePositives:2,hits:6,mitre:'T1021.002'}
  ];
  D.purple={tests:[
    {id:'BAS-1003',technique:'T1003',name:'Credential dumping telemetry simulation',status:'Not Run',expected:['XDR','SIEM','NDR']},
    {id:'BAS-1021',technique:'T1021.002',name:'SMB lateral movement simulation',status:'Not Run',expected:['NDR','SIEM','Firewall']},
    {id:'BAS-1059',technique:'T1059.001',name:'Encoded PowerShell simulation',status:'Not Run',expected:['XDR','SIEM']}
  ]};
  D.grc={risks:[
    {id:'RISK-019',title:'Legacy ERP service account without MFA',likelihood:4,impact:5,owner:'ERP Platform',status:'Exception expiring',control:'IAM-07',due:'2026-08-21'},
    {id:'RISK-022',title:'Public cloud export path',likelihood:3,impact:4,owner:'Marketing Data',status:'Treatment in progress',control:'CLD-12',due:'2026-08-28'}
  ],controls:[{id:'IAM-07',name:'MFA for privileged and remote access',status:'Partial'},{id:'IR-04',name:'Evidence preservation and chain of custody',status:'Implemented'},{id:'NET-09',name:'Segmentation of management networks',status:'Implemented'}]};
  D.datacenter={site:'BSC-DC1-SP',temperature:22.4,humidity:46,power:'A/B Healthy',ups:'96%',cables:{HA1:'seated',HA2:'loose',LACP1:'seated',LACP2:'seated',WAN1:'seated',WAN2:'seated'},access:[
    {time:'07:02',badge:'EMP-2191',person:'Henrique Vidal',door:'DC1-MANTRAP',result:'Granted',escort:'N/A'},
    {time:'10:06',badge:'VENDOR-8831',person:'NetServ Field Engineer',door:'DC1-MANTRAP',result:'Granted',escort:'Required'},
    {time:'10:07',badge:'VENDOR-8831',person:'NetServ Field Engineer',door:'ROW-R03',result:'Granted',escort:'Missing'}
  ],racks:[
    {id:'R03',name:'Network & Security',units:[{u:42,item:'CORE-SW-01',type:'Core Switch',status:'Healthy'},{u:41,item:'CORE-SW-02',type:'Core Switch',status:'Healthy'},{u:20,item:'BSC-FW-A',type:'NGFW Active',status:'Healthy'},{u:19,item:'BSC-FW-B',type:'NGFW Standby',status:'Degraded'},{u:14,item:'NDR-SENSOR-01',type:'NDR Sensor',status:'Healthy'}]},
    {id:'R07',name:'Identity & Management',units:[{u:40,item:'DC01',type:'Domain Controller',status:'Healthy'},{u:36,item:'JUMP-ADM-01',type:'PAM Jump Host',status:'Risk'},{u:30,item:'SIEM-01',type:'SIEM Indexer',status:'Healthy'}]},
    {id:'R12',name:'Applications & Data',units:[{u:42,item:'APP-PROD-01',type:'ERP App',status:'Patch Pending'},{u:40,item:'DB-PROD-01',type:'Database',status:'Healthy'},{u:20,item:'BKP-CTRL-01',type:'Backup Controller',status:'Alert'},{u:18,item:'BSC-IMM-01',type:'Immutable Repo',status:'Healthy'}]}
  ]};
  D.clients=[
    {id:'BLUE',name:'BlueBank',sector:'Financial Services',sla:'P1 acknowledge 15m / update 30m',assets:1240,status:'Major incident',contacts:['bluebank.noc@example.invalid','BlueBank SOC Bridge']},
    {id:'MED',name:'MedCare',sector:'Healthcare',sla:'P1 acknowledge 15m / update 30m',assets:860,status:'Normal',contacts:['medcare.soc@example.invalid']},
    {id:'AERO',name:'AeroLog',sector:'Logistics',sla:'P1 acknowledge 30m / update 60m',assets:640,status:'Normal',contacts:['aerolog.it@example.invalid']}
  ];
  D.appsec={findings:[{id:'SEC-SECRET-19',asset:'CI-RUNNER-01',severity:'Critical',finding:'Legacy integration token exposed in pipeline variable',status:'Open',token:'LEGACY_EXPORT_TOKEN',lastUsed:'2026-08-21 09:14'}],pipelines:[{id:'bsc-marketing-export',branch:'main',lastRun:'09:14',status:'Passed with security warning'}]};
  D.redteam={authorized:true,scope:['portal.besafecorp.inc','WEB-DMZ-01','JUMP-ADM-01','DC01','BSC-DC1 management simulation'],outOfScope:['real Internet','third parties','destructive actions'],stage:'outside',history:[],discovered:[],session:null,flags:{}};

  D.missions.push(
    {id:'M06',ticket:'SEC-2026-0061',title:'API sob pressão — credential stuffing',duration:'45–60 min',status:'active',skills:['WAF','API SECURITY','BOT','SOC'],objectives:[['waf_inspected','Analisar tráfego e rota afetada'],['rate_limit_tuned','Ajustar rate limit de forma proporcional'],['bot_protection_enabled','Elevar proteção automatizada'],['api_validated','Validar clientes legítimos após mitigação'],['waf_ticket_updated','Documentar a intervenção']]},
    {id:'M07',ticket:'CLD-2026-0021',title:'Cloud não perdoa ACL herdada',duration:'45–60 min',status:'active',skills:['CLOUD','IAM','STORAGE','AUDIT'],objectives:[['cloud_finding_opened','Investigar finding de exposição'],['cloud_access_logs_checked','Verificar acesso ao objeto'],['public_acl_removed','Remover exposição pública'],['cloud_owner_notified','Registrar owner e impacto'],['cloud_ticket_updated','Atualizar caso']]},
    {id:'M08',ticket:'SEC-2026-0077',title:'BLACK FROST — ransomware em propagação',duration:'90–140 min',status:'active',skills:['INCIDENT RESPONSE','XDR','SIEM','NDR','IAM','BACKUP','BCP','COMMS'],objectives:[['ransomware_signal_reviewed','Confirmar sinais e patient zero'],['major_incident_declared','Declarar Major Incident e abrir war room'],['ransom_scope_mapped','Mapear blast radius no SIEM/NDR'],['ransom_identity_revoked','Revogar credencial comprometida'],['ransom_network_segmented','Conter propagação lateral'],['backup_lockdown','Proteger control plane e cópias imutáveis'],['ransom_hosts_contained','Conter hosts comprometidos'],['ransom_eradicated','Executar erradicação e validar persistência'],['restore_point_validated','Validar restore point limpo'],['ransom_recovery_validated','Restaurar em clean room e validar negócio'],['ransom_comms_done','Comunicar executivo/jurídico com fatos'],['ransom_ticket_updated','Documentar timeline, impacto, decisões e risco residual']]},
    {id:'M09',ticket:'DLP-2026-0014',title:'DLP sem acusar usuário por feeling',duration:'40–55 min',status:'active',skills:['DLP','PRIVACY','RISK','COMMS'],objectives:[['dlp_event_opened','Analisar evento e classificação'],['dlp_context_checked','Verificar contexto e destino'],['dlp_policy_enforced','Aplicar política adequada'],['dlp_user_contacted','Registrar contato/contexto'],['dlp_ticket_updated','Atualizar incidente']]},
    {id:'M10',ticket:'PAM-2026-0009',title:'Privilegiado sem change',duration:'45–60 min',status:'active',skills:['PAM','IAM','SOC','CHANGE'],objectives:[['pam_session_reviewed','Revisar sessão e gravação'],['pam_ticket_correlated','Confirmar ausência de change'],['pam_session_terminated','Encerrar sessão indevida'],['pam_secret_rotated','Rotacionar credencial relacionada'],['pam_ticket_updated','Registrar ação']]},
    {id:'M11',ticket:'NDR-2026-0028',title:'Leste-oeste não é invisível',duration:'45–65 min',status:'active',skills:['NDR','NETWORK','HUNTING','AD'],objectives:[['ndr_flow_reviewed','Revisar fluxo anômalo'],['ndr_pivot_siem','Pivotar para SIEM'],['ndr_identity_correlated','Correlacionar identidade'],['ndr_containment','Conter caminho lateral'],['ndr_ticket_updated','Documentar hipótese e evidências']]},
    {id:'M12',ticket:'DFIR-2026-0012',title:'DFIR — antes de reformatar tudo',duration:'60–90 min',status:'active',skills:['DFIR','EVIDENCE','TIMELINE','CUSTODY'],objectives:[['dfir_case_opened','Abrir caso forense'],['dfir_triage_acquired','Coletar aquisição lógica'],['dfir_hash_created','Calcular hash da evidência'],['dfir_custody_recorded','Registrar cadeia de custódia'],['dfir_timeline_built','Construir timeline mínima']]},
    {id:'M13',ticket:'DET-2026-0033',title:'Detection engineering sem alert fatigue',duration:'50–70 min',status:'active',skills:['SIEM','SIGMA','DETECTION','MITRE'],objectives:[['detection_opened','Revisar regra problemática'],['detection_tested','Testar regra atual'],['detection_tuned','Ajustar lógica/threshold'],['detection_retested','Retestar dataset'],['detection_ticket_updated','Documentar trade-off']]},
    {id:'M14',ticket:'PUR-2026-0004',title:'Purple Team — provar que detecta',duration:'60–90 min',status:'active',skills:['BAS','PURPLE TEAM','MITRE','DETECTION'],objectives:[['bas_started','Iniciar validação autorizada'],['bas_1003_run','Executar T1003 simulado'],['bas_1021_run','Executar T1021.002 simulado'],['coverage_reviewed','Revisar cobertura por camada'],['purple_improvement','Registrar melhoria de detection']]},
    {id:'M15',ticket:'GRC-2026-0030',title:'Exceção não é eternidade',duration:'35–50 min',status:'active',skills:['GRC','RISK','IAM','GOVERNANCE'],objectives:[['grc_risk_opened','Analisar risco e exceção'],['grc_owner_checked','Validar owner e justificativa'],['grc_treatment_defined','Definir tratamento'],['grc_exception_decided','Aprovar ou negar com prazo'],['grc_ticket_updated','Registrar decisão']]},
    {id:'M16',ticket:'MSS-BLUE-2026-0091',title:'Cliente pingando enquanto produção cai',duration:'55–75 min',status:'active',skills:['MSS','SOC','SLA','CUSTOMER COMMS'],objectives:[['client_case_opened','Abrir caso BlueBank'],['client_block_reviewed','Validar bloqueio e evidência'],['client_service_restored','Restaurar serviço com segurança'],['client_update_sent','Enviar atualização ao cliente'],['client_rca_started','Iniciar RCA']]},
    {id:'M17',ticket:'DC-2026-0011',title:'Datacenter — badge, PAM e management',duration:'55–80 min',status:'active',skills:['DATACENTER','PHYSICAL','PAM','NETWORK'],objectives:[['dc_map_opened','Inspecionar datacenter e rack'],['dc_access_reviewed','Correlacionar acesso físico'],['dc_asset_correlated','Relacionar JUMP-ADM-01 e firewall'],['dc_vendor_contained','Suspender acesso do fornecedor'],['dc_ticket_updated','Documentar incidente físico-lógico']]},
    {id:'M18',ticket:'RED-2026-0001',title:'Operation Glasshouse — do exterior ao DC',duration:'75–120 min',status:'active',skills:['RED TEAM','PURPLE','WEB','NETWORK','AD','DFIR'],objectives:[['attack_scope_read','Ler escopo autorizado'],['attack_surface_mapped','Mapear superfície simulada'],['sim_foothold','Obter foothold simulado'],['sim_pivot','Pivotar até jump zone simulada'],['sim_dc_access','Alcançar zona de management simulada'],['attack_blue_handoff','Investigar o próprio rastro no Blue Team'],['attack_reported','Registrar achados e correções']]},
    {id:'M19',ticket:'APP-2026-0019',title:'AppSec — segredo não é variável eterna',duration:'40–60 min',status:'active',skills:['APPSEC','CI/CD','SECRETS','CLOUD'],objectives:[['appsec_finding_opened','Investigar secret no pipeline'],['secret_usage_checked','Revisar onde o token foi usado'],['secret_revoked','Revogar token exposto'],['secret_rotated','Criar substituto e corrigir origem'],['appsec_ticket_updated','Documentar remediação']]}
  );
})();
