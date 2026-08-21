from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

ROOT=Path(__file__).resolve().parent
DOCS=ROOT/'docs'; DOCS.mkdir(exist_ok=True)
pdfmetrics.registerFont(TTFont('BSC','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('BSC-Bold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
NAVY=colors.HexColor('#071018'); PANEL=colors.HexColor('#0e1b25'); CYAN=colors.HexColor('#17b9d4'); LIME=colors.HexColor('#83b51e'); ORANGE=colors.HexColor('#e8762e'); RED=colors.HexColor('#db3944'); INK=colors.HexColor('#14202a'); MUTED=colors.HexColor('#5e7481'); LIGHT=colors.HexColor('#edf3f6'); LINE=colors.HexColor('#c8d5dc')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BTitle',fontName='BSC-Bold',fontSize=23,leading=27,textColor=NAVY,spaceAfter=7))
styles.add(ParagraphStyle(name='BSub',fontName='BSC',fontSize=9.5,leading=14,textColor=MUTED,spaceAfter=12))
styles.add(ParagraphStyle(name='H1B',fontName='BSC-Bold',fontSize=15,leading=19,textColor=NAVY,spaceBefore=8,spaceAfter=7))
styles.add(ParagraphStyle(name='H2B',fontName='BSC-Bold',fontSize=11,leading=14,textColor=CYAN,spaceBefore=6,spaceAfter=5))
styles.add(ParagraphStyle(name='BodyB',fontName='BSC',fontSize=8.8,leading=13,textColor=INK,spaceAfter=6))
styles.add(ParagraphStyle(name='SmallB',fontName='BSC',fontSize=7.2,leading=10,textColor=MUTED))
styles.add(ParagraphStyle(name='Callout',fontName='BSC-Bold',fontSize=9,leading=13,textColor=NAVY,backColor=colors.HexColor('#e8f7fa'),borderColor=CYAN,borderWidth=0.7,borderPadding=7,spaceBefore=5,spaceAfter=8))

def header_footer(canvas,doc):
    canvas.saveState(); w,h=doc.pagesize
    canvas.setFillColor(NAVY); canvas.rect(0,h-13*mm,w,13*mm,fill=1,stroke=0)
    canvas.setFillColor(CYAN); canvas.rect(0,h-13*mm,4*mm,13*mm,fill=1,stroke=0)
    canvas.setFont('BSC-Bold',8); canvas.setFillColor(colors.white); canvas.drawString(10*mm,h-8.3*mm,'BE SAFE CORP .INC')
    canvas.setFont('BSC',6.5); canvas.setFillColor(colors.HexColor('#a9bdc7')); canvas.drawRightString(w-10*mm,h-8.3*mm,'CYBER RANGE · DOCUMENTO INTERNO SIMULADO')
    canvas.setStrokeColor(LINE); canvas.line(12*mm,10*mm,w-12*mm,10*mm)
    canvas.setFont('BSC',6.5); canvas.setFillColor(MUTED); canvas.drawString(12*mm,6.5*mm,'Todos os dados são fictícios e exclusivos do ambiente de treinamento.')
    canvas.drawRightString(w-12*mm,6.5*mm,f'Página {doc.page}')
    canvas.restoreState()

def doc(path,title,subtitle,pagesize=A4):
    d=SimpleDocTemplate(str(path),pagesize=pagesize,rightMargin=14*mm,leftMargin=14*mm,topMargin=21*mm,bottomMargin=15*mm,title=title,author='Be Safe Corp .Inc Cyber Range')
    story=[Spacer(1,4*mm),Paragraph(title,styles['BTitle']),Paragraph(subtitle,styles['BSub'])]
    return d,story

def tbl(data,widths=None,header=True,font=7.5):
    t=Table(data,colWidths=widths,repeatRows=1 if header else 0,hAlign='LEFT')
    st=[('FONTNAME',(0,0),(-1,-1),'BSC'),('FONTSIZE',(0,0),(-1,-1),font),('TEXTCOLOR',(0,0),(-1,-1),INK),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),0.35,LINE),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]
    if header: st += [('BACKGROUND',(0,0),(-1,0),NAVY),('TEXTCOLOR',(0,0),(-1,0),colors.white),('FONTNAME',(0,0),(-1,0),'BSC-Bold')]
    for r in range(1 if header else 0,len(data)):
        if r%2==0: st.append(('BACKGROUND',(0,r),(-1,r),colors.HexColor('#f3f7f9')))
    t.setStyle(TableStyle(st)); return t

def bullet(text): return Paragraph('• '+text,styles['BodyB'])
def p(text): return Paragraph(text,styles['BodyB'])
def h1(text): return Paragraph(text,styles['H1B'])
def h2(text): return Paragraph(text,styles['H2B'])

# 1 Architecture/topology
D,S=doc(DOCS/'Be_Safe_Corp_Arquitetura_e_Topologia_de_Rede.pdf','Arquitetura e Topologia de Rede','Documento canônico do Cyber Range · versão 7 · 21/08/2026',landscape(A4))
S += [Paragraph('Este documento é a fonte de verdade para topologia lógica e física. SIEM, XDR, NDR, firewall, CMDB, ITSM, datacenter e missões devem usar estes mesmos objetos.',styles['Callout'])]
drawing=svg2rlg(str(ROOT/'assets/topologia-be-safe-corp.svg')); drawing.width=255*mm; drawing.height=drawing.height*(255*mm/drawing.width); drawing.scale(255*mm/drawing.minWidth(),255*mm/drawing.minWidth()) if False else None
# Render SVG to a temporary PDF page is awkward in Platypus; rasterize using cairosvg if available, otherwise use reportlab drawing scaled.
scale=min((255*mm)/drawing.width,(150*mm)/drawing.height); drawing.scale(scale,scale); drawing.width*=scale; drawing.height*=scale
S += [drawing,PageBreak(),h1('1. Princípios de arquitetura'),p('A Be Safe Corp .Inc usa segmentação por função, NGFW em HA ativo-passivo, core L3 redundante, management plane separado, telemetria centralizada no SOC e acesso administrativo via PAM/jump host.'),tbl([
['Camada','Componentes','Objetivo'],['Edge','ISP-A, ISP-B, BSC-EDGE-HA','Internet, SD-WAN, VPN, NAT, inspeção e publicação'],['DMZ','WAF/API, WEB-DMZ-01, SEG','Serviços públicos e controle de aplicação'],['Core','CORE-SW-01/02','Roteamento interno, LACP, VRRP e inter-VLAN controlado'],['Security Plane','SIEM, XDR, NDR, CTI, IAM/PAM, DFIR','Detecção, resposta, evidência e governança'],['Datacenter','R03, R07, R12','Rede/segurança, identidade/management, aplicações/dados']
],[45*mm,100*mm,110*mm]),h1('2. Fluxos críticos'),tbl([
['Fluxo','Origem','Destino','Controle esperado'],['Financeiro → ERP','VLAN20','APP-PROD-01 / VLAN40','HTTPS + NGFW + XDR + SIEM'],['ERP → Banco','APP-PROD-01','DB-PROD-01','TCP/5432 restrito + logging'],['Administração','SOC/NetSec','JUMP-ADM-01 → VLAN60','PAM, MFA, sessão gravada e change'],['Backup','VLAN40','BKP-CTRL-01 / BSC-IMM-01','VLAN70, credencial separada e imutabilidade'],['RH → File Server','VLAN30','FILE-HR-01 / VLAN40','SMB autenticado + NDR/XDR'],['Internet → Portal','WAN','WAF/API → WEB-DMZ-01','WAF, bot, rate limit, API schema']
],[42*mm,50*mm,80*mm,85*mm]),h1('3. Datacenter BSC-DC1-SP'),tbl([
['Rack','Função','Ativos principais'],['R03','Network & Security','CORE-SW-01/02, BSC-FW-A/B, NDR-SENSOR-01'],['R07','Identity & Management','DC01, JUMP-ADM-01, SIEM-01'],['R12','Applications & Data','APP-PROD-01, DB-PROD-01, BKP-CTRL-01, BSC-IMM-01']
],[35*mm,75*mm,160*mm]),p('O link HA2 entre BSC-FW-A e BSC-FW-B é físico e lógico. Uma falha de cabeamento no R03 deve aparecer como degradação de session sync no EdgeGate e como evento no SIEM/NOC.')]
D.build(S,onFirstPage=header_footer,onLaterPages=header_footer)

# 2 IP plan
D,S=doc(DOCS/'Be_Safe_Corp_IP_Plan_VLANs_e_Sites.pdf','Plano de IP, VLANs e Sites','Endereçamento canônico do ambiente de simulação · versão 7')
vlans=[['VLAN','Nome','Rede','Gateway lógico','Uso'],['20','FINANCE','10.20.0.0/16','10.20.0.1','Estações do Financeiro'],['30','RH','10.30.0.0/16','10.30.0.1','Estações de RH / People'],['40','SERVERS','10.40.0.0/16','10.40.0.1','Servidores e aplicações'],['50','SOC','10.50.0.0/16','10.50.0.1','SOC, SIEM e hunting'],['60','MGMT','10.255.10.0/24','10.255.10.1','Gerenciamento de infraestrutura'],['70','BACKUP','10.70.0.0/16','10.70.0.1','Control plane e repositórios de backup'],['80','GUEST','10.80.0.0/16','10.80.0.1','Wi-Fi visitante, sem acesso interno'],['90','CI-CLOUD','10.90.0.0/16','10.90.0.1','CI/CD e integrações cloud'],['100','DMZ','172.16.10.0/24','172.16.10.1','Serviços publicados']]
assets=[['Ativo','IP','VLAN/Zona','Site','Função'],['WS-FIN-021','10.20.21.44','20','BSC-HQ-SP','Endpoint Financeiro'],['WS-FIN-044','10.20.44.62','20','BSC-HQ-SP','Endpoint CFO'],['WS-HR-019','10.30.33.19','30','BSC-HQ-SP','Patient zero BLACK FROST'],['WS-HR-027','10.30.33.27','30','BSC-HQ-SP','Endpoint RH'],['DC01','10.40.1.10','40','BSC-DC1-SP','AD/DNS'],['APP-PROD-01','10.40.10.21','40','BSC-DC1-SP','ERP'],['DB-PROD-01','10.40.20.15','40','BSC-DC1-SP','Database'],['FILE-HR-01','10.40.30.25','40','BSC-DC1-SP','File Server RH'],['BKP-CTRL-01','10.70.10.11','70','BSC-DC1-SP','Backup controller'],['BSC-FW-A','10.255.10.11','60','BSC-DC1-SP','NGFW Active'],['BSC-FW-B','10.255.10.12','60','BSC-DC1-SP','NGFW Standby'],['Cluster VIP','10.255.10.10','60','BSC-DC1-SP','Gerência do cluster']]
S += [Paragraph('Regra: qualquer ferramenta do range deve referenciar estes mesmos endereços. Não há “IP alternativo” por missão.',styles['Callout']),h1('1. VLANs e segmentos'),tbl(vlans,[13*mm,28*mm,38*mm,34*mm,65*mm]),h1('2. Ativos canônicos'),tbl(assets,[31*mm,33*mm,23*mm,35*mm,57*mm]),h1('3. WAN e HA'),tbl([['Item','Endereço'],['WAN1 / ISP-A','203.0.113.10/29 · gateway 203.0.113.9'],['WAN2 / ISP-B','198.51.100.10/29 · gateway 198.51.100.9'],['HA1 A/B','169.254.254.1/30 · 169.254.254.2/30'],['HA2 A/B','169.254.253.1/30 · 169.254.253.2/30']],[50*mm,125*mm]),h1('4. Sites'),tbl([['Site','Papel','Conectividade'],['BSC-HQ-SP','Sede / usuários / SOC','Dual-WAN + DC1'],['BSC-DC1-SP','Datacenter primário','Core + edge + backup'],['BSC-RJ','Filial','IPsec / SD-WAN'],['BSC-BSB','Filial','IPsec / SD-WAN'],['BSC-CWB','Filial','IPsec / SD-WAN'],['BSC-REC','Filial','IPsec / SD-WAN'],['BSC-POA','Filial','IPsec / SD-WAN']],[38*mm,70*mm,70*mm])]
D.build(S,onFirstPage=header_footer,onLaterPages=header_footer)

# 3 Runbook operational
D,S=doc(DOCS/'Be_Safe_Corp_Runbook_Operacional_e_Seguranca.pdf','Runbook Operacional e de Segurança','Como trabalhar dentro da Be Safe Corp .Inc sem transformar produção em laboratório')
S += [Paragraph('Princípio central: primeiro entenda o contexto, depois execute. O range aceita decisões ruins, mas registra o impacto no assessment.',styles['Callout']),h1('1. Sequência operacional mínima')]
for x in ['Ler o ticket, impacto, SLA, requester, ativo e dependências.','Coletar evidência suficiente antes de ações destrutivas, quando o risco permitir.','Correlacionar fontes: SIEM, XDR, NDR, identidade, firewall, aplicação e contexto de negócio.','Registrar hipótese como hipótese; não transformar suspeita em fato.','Para produção, validar change, janela, rollback e owner.','Executar a menor ação capaz de reduzir o risco.','Validar tecnicamente e com o negócio.','Atualizar ITSM e comunicação antes de encerrar o caso.']: S.append(bullet(x))
S += [h1('2. Regras de mudança'),tbl([['Situação','Exigência'],['Firewall / WAF / cloud em produção','Change, impacto, rollback, owner e validação'],['Contenção emergencial','Pode anteceder change quando risco é imediato; documentar justificativa'],['Failover de HA','Saúde de heartbeat/session sync validada antes do teste'],['Patch crítico','Contexto de exposição + janela + rollback + health check'],['Restauração','Containment e recovery point validados antes do retorno à produção']],[60*mm,115*mm]),h1('3. Evidência e DFIR'),p('Aquisições devem registrar origem, horário, coletor, hash e cadeia de custódia. Isolamento pode ser necessário antes da coleta em risco imediato; neste caso a justificativa deve constar do ticket e da timeline.'),h1('4. Comunicação'),tbl([['Público','Conteúdo mínimo'],['SOC / NOC','Fato, hipótese, evidência, ação, impacto, pendência'],['Gestão','Impacto, risco, decisão necessária, ETA e próximo update'],['Cliente MSS','SLA, impacto confirmado, ação, status e próximo update'],['Legal / Privacy','Dados potencialmente afetados, escopo conhecido, incertezas e preservação']],[45*mm,130*mm]),h1('5. Encerramento'),p('Um incidente não está resolvido porque “o alerta sumiu”. Antes do fechamento: containment validado, causa/hipótese documentada, serviço validado, risco residual registrado, evidências preservadas e próximos passos atribuídos.')]
D.build(S,onFirstPage=header_footer,onLaterPages=header_footer)

# 4 ransomware runbook
D,S=doc(DOCS/'Be_Safe_Corp_Resposta_a_Incidentes_BLACK_FROST.pdf','Resposta a Incidentes - BLACK FROST','Runbook de ransomware do Cyber Range · execução simulada, não destrutiva')
S += [Paragraph('BLACK FROST é um cenário totalmente sintético. A propagação depende do tempo e das decisões do participante e não executa malware real.',styles['Callout']),h1('1. Fluxo de resposta')]
for i,x in enumerate(['Confirmar sinal e declarar Major Incident quando aplicável.','Definir Incident Commander e abrir war room.','Mapear patient zero, identidades, hosts, shares, aplicações e backup.','Conter identidade comprometida e reduzir movimento lateral.','Preservar evidência de hosts prioritários.','Proteger control plane e cópias imutáveis.','Erradicar persistência e credenciais comprometidas.','Validar restore point em modo read-only.','Restaurar em clean room / rede segmentada.','Validar AD, arquivos, aplicações e negócio antes de produção.','Comunicar executivo e Legal/Privacy com fatos.','Iniciar RCA, lessons learned e backlog de controles.'],1): S.append(Paragraph(f'<b>{i:02d}.</b> {x}',styles['BodyB']))
S += [h1('2. Controles no range'),tbl([['Domínio','Ações disponíveis'],['XDR','Triage, isolamento, IOC block, live response'],['SIEM','Pesquisa, correlação e timeline'],['NDR','Fluxos SMB leste-oeste e contenção de caminho'],['IAM','Desabilitar svc-hr-sync e invalidar acesso'],['Backup','Emergency lockdown, imutabilidade e validação de restore point'],['ITSM / IR Command','SEV-1, decisões, comunicações e encerramento']],[45*mm,130*mm]),h1('3. Gaps avaliados'),p('O assessment registra restauração prematura, contenção sem contexto, perda de evidência, escopo incompleto, ausência de comunicação, encerramento antes da validação de negócio e decisões excessivamente disruptivas.')]
D.build(S,onFirstPage=header_footer,onLaterPages=header_footer)

# 5 quick guide
D,S=doc(DOCS/'Be_Safe_Corp_Guia_Rapido_do_Cyber_Range.pdf','Guia Rápido do Cyber Range','Primeiros 10 minutos dentro da Be Safe Corp .Inc')
S += [Paragraph('Não é quiz. Vc entrou numa empresa simulada. As ferramentas, pessoas, SLAs e incidentes continuam existindo enquanto vc trabalha.',styles['Callout']),h1('Primeiro acesso'),tbl([['Passo','O que fazer'],['1','Crie sua identidade escolhendo cargo e equipe.'],['2','Baixe seu crachá ou abra o perfil para conferir acessos e responsabilidades.'],['3','Abra a Work Queue e identifique prioridades do seu cargo.'],['4','Leia o ITSM antes de atuar no console.'],['5','Use SIEM/XDR/NDR/firewall/DFIR conforme evidência e necessidade.'],['6','Acompanhe Teams e Slack: clientes, PMO, MSS e consultoria enviam mensagens em tempo real.'],['7','Consulte Documentação Corporativa para IPs, VLANs, topologia e runbooks.'],['8','Documente e valide antes de resolver incidentes.'],['9','Baixe o PDF de assessment quando quiser revisar evolução.']],[16*mm,160*mm]),h1('Como o tempo funciona'),p('O relógio corporativo avança com ações e também em tempo real. SLAs diminuem. BLACK FROST pode ampliar o blast radius enquanto o navegador permanece aberto.'),h1('O que o sistema avalia'),p('Sequência de ações, preservação de evidência, qualidade de investigação, segurança das mudanças, impacto no negócio, comunicação, documentação e gaps por domínio.'),h1('Perfis'),p('SOC Analyst, Security Engineer, DFIR Analyst, Network Security Analyst e Cybersecurity Analyst recebem desktop, prioridades, competências e responsabilidades iniciais diferentes. O range continua permitindo exploração cross-functional.')]
D.build(S,onFirstPage=header_footer,onLaterPages=header_footer)

# 6 tech/roles
D,S=doc(DOCS/'Be_Safe_Corp_Matriz_de_Tecnologias_e_Responsabilidades.pdf','Tecnologias e Responsabilidades','Matriz de ferramentas e foco por função · Be Safe Corp .Inc')
S += [h1('1. Stack técnico'),tbl([['Domínio','Tecnologias simuladas'],['SOC/SIEM','Wazuh, OpenSearch, Sysmon, Sigma, MITRE ATT&CK'],['Endpoint','Be Safe XDR, EDR live response, Windows/Linux telemetry'],['Network','EdgeGate NGFW, NDR, VLAN, LACP, HA, SD-WAN, IPsec'],['App/API','WAF, bot management, rate limit, API schema'],['Identity','AD, Entra-like, MFA, PAM, access review'],['DFIR','Aquisição, hash, cadeia de custódia, timeline'],['Cloud/AppSec','AWS/Azure/Kubernetes, CI/CD, secrets, posture'],['Resilience','Backup, imutabilidade, clean-room recovery'],['CTI','OpenCTI, MISP, STIX/TAXII'],['Governance','ITSM, Change, GRC, DLP, MSS SLA']],[45*mm,130*mm]),h1('2. Foco por cargo'),tbl([['Cargo','Ferramentas primárias','Responsabilidade dominante'],['SOC Analyst I','SIEM, XDR, NDR, CTI, ITSM','Triagem, correlação, contenção e escalonamento'],['Security Engineer I','NGFW, WAF, Cloud, VM, IAM/PAM','Hardening, mudança, remediação e validação'],['DFIR Analyst I','DFIR, XDR, SIEM, Backup, IR Command','Evidência, timeline, escopo, erradicação e recovery'],['Network Security Analyst I','NGFW, NDR, Topologia, Datacenter, WAF','Segmentação, HA, tráfego e acesso administrativo'],['Cybersecurity Analyst I','SOC, XDR, VM, CTI, IR, ITSM','Operação multidisciplinar e coordenação técnica']],[43*mm,65*mm,68*mm]),h1('3. Regra de perfil'),p('O cargo muda o conjunto de atalhos, missões prioritárias, foco do perfil, competências esperadas e contexto de onboarding. Não altera a topologia ou cria dados diferentes para o mesmo ativo.')]
D.build(S,onFirstPage=header_footer,onLaterPages=header_footer)
print('PDFs gerados em',DOCS)
