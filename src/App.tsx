import { useEffect, useRef, useState } from 'react'

type AgentId = 'req' | 'architect' | 'exec' | 'report'

type AgentColor = 'blue' | 'indigo' | 'emerald' | 'rose'

interface WorkflowStep {
  step: string
  detail: string
}

interface AgentDetail {
  title: string
  role: string
  tech: string
  objective: string
  workflow: WorkflowStep[]
  color: AgentColor
  icon: string
}

const QA_AGENT_DETAILS: Record<AgentId, AgentDetail> = {
  req: {
    title: 'Analysis Agent',
    role: '요구사항 파악 및 지식 추출',
    tech: 'GPT-5 Turbo / Llama-4-70B',
    objective: '비정형 기획 문서를 정형화된 테스트 요구사항 데이터로 변환',
    workflow: [
      { step: 'Data Ingestion', detail: 'Confluence, Figma, Jira 문서 자동 수집' },
      { step: 'Context Analysis', detail: '기존 기능과의 연관 관계 및 영향도 분석' },
      { step: 'Requirement Synthesis', detail: 'Atomic 단위의 테스트 요구사항 도출' },
      { step: 'RAG Alignment', detail: '사내 표준 가이드라인 대조' },
    ],
    color: 'blue',
    icon: '🔍',
  },
  architect: {
    title: 'Scenario Architect',
    role: '테스트 전략 및 논리 구조 설계',
    tech: 'Multi-modal Reasoning / GraphRAG',
    objective: '비즈니스 로직 기반의 최적화된 테스트 경로 설계',
    workflow: [
      { step: 'Path Discovery', detail: '사용자 여정 기반 동적 플로우 차트 생성' },
      { step: 'Edge Case Gen', detail: '경계값 및 비정상 케이스 자동 합성' },
      { step: 'Scripting', detail: 'Playwright 기반 코드 자동 생성' },
      { step: 'Data Mocking', detail: '테스트용 가상 데이터 생성' },
    ],
    color: 'indigo',
    icon: '🏗️',
  },
  exec: {
    title: 'Execution Agent',
    role: '병렬 실행 및 실시간 검증',
    tech: 'Distributed Cluster / Vision-Language',
    objective: '무중단 병렬 테스트 수행 및 시각적 결함 검증',
    workflow: [
      { step: 'Cloud Provisioning', detail: '실행 환경 즉시 할당' },
      { step: 'VLM Inspection', detail: 'AI 비전을 이용한 UI 레이아웃 검증' },
      { step: 'Dynamic Scaling', detail: '실행 인스턴스 자동 확장' },
      { step: 'Telemetery', detail: '네트워크 패킷 실시간 수집' },
    ],
    color: 'emerald',
    icon: '⚡',
  },
  report: {
    title: 'Bug Agent',
    role: '심층 분석 및 의사결정 지원',
    tech: 'RCA Expert System / Predictive AI',
    objective: '결함 발생 원인 특정 및 품질 리포트 자동화',
    workflow: [
      { step: 'Log Analysis', detail: '서버 로그 자동 분석' },
      { step: 'RCA Modeling', detail: '원인 예측(Root Cause)' },
      { step: 'Report Generation', detail: '이해관계자용 리포트 자동 작성' },
      { step: 'Jira Automation', detail: '티켓 발행 및 우선순위 제안' },
    ],
    color: 'rose',
    icon: '🐞',
  },
}

type ViewId = 'overview' | 'agents' | 'stats'

function App() {
  const [view, setView] = useState<ViewId>('overview')
  const [activeAgent, setActiveAgent] = useState<AgentId>('req')
  const [simulating, setSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState<AgentId | null>(null)
  const [simLog, setSimLog] = useState<string[]>([
    '> 에이전트 시스템 커널 초기화 완료 (v4.5.0)',
  ])
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [simLog])

  const runSimulation = () => {
    if (simulating) return
    setSimulating(true)
    setSimLog(['> 자율 에이전트 군집 실행: 하이-엔드 워크플로우 가동'])

    const steps: AgentId[] = ['req', 'architect', 'exec', 'report']
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(step)
        setActiveAgent(step)
        setSimLog((prev) => [
          ...prev,
          `> [${QA_AGENT_DETAILS[step].title}] 프로세스 진입...`,
          `> Objective: ${QA_AGENT_DETAILS[step].objective}`,
        ])
        if (index === steps.length - 1) {
          setTimeout(() => {
            setSimulating(false)
            setCurrentStep(null)
            setSimLog((prev) => [...prev, '> 모든 에이전트 임무 종료. 통합 리포트 생성 완료.'])
          }, 2500)
        }
      }, index * 3000)
    })
  }

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Object.entries(QA_AGENT_DETAILS).map(([id, data]) => {
          const agentId = id as AgentId
          const isActive = currentStep === agentId
          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveAgent(agentId)
                setView('agents')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveAgent(agentId)
                  setView('agents')
                }
              }}
              className={`glass-card group relative cursor-pointer overflow-hidden rounded-[38px] border p-10 transition-all duration-500 ${
                isActive
                  ? `active-glow border-${data.color}-500/50 scale-[1.02]`
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-br from-${data.color}-500/20 to-transparent opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100`}
              />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center space-x-7">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/80 text-4xl shadow-2xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                    {data.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold uppercase leading-tight tracking-tight text-white transition-transform group-hover:translate-x-1">
                      {data.title}
                    </h3>
                    <div
                      className={`mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-${data.color}-400 opacity-90`}
                    >
                      {data.role}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center space-x-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Active
                    </span>
                  </div>
                )}
              </div>

              <div className="relative z-10 mt-12">
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  Core Objective
                </div>
                <p
                  className={`border-l-2 border-white/10 pl-6 font-medium leading-relaxed tracking-tight text-slate-300 transition-colors group-hover:border-${data.color}-500/50`}
                >
                  {data.objective}
                </p>
              </div>

              {isActive ? (
                <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                      Processing Synapse
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">87.2%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 p-[2px]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-${data.color}-600 to-${data.color}-400 animate-[progress_3s_linear_infinite]`}
                      style={{
                        boxShadow: `0 0 15px rgba(var(--${data.color}-rgb), 0.5)`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-12 flex flex-wrap gap-2">
                  {data.workflow.slice(0, 3).map((w, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:bg-white/5"
                    >
                      {w.step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="glass-card group flex flex-col items-center justify-between gap-10 rounded-[40px] border border-white/10 p-10 shadow-2xl backdrop-blur-3xl md:flex-row">
        <div className="flex items-center space-x-10">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/5 bg-slate-950 shadow-inner">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-blue-500/20 to-transparent" />
            <span className="z-10 text-sm font-black tracking-[0.3em] text-white">RAG</span>
          </div>
          <div>
            <h4 className="text-base font-bold uppercase tracking-[0.5em] text-white transition-colors group-hover:text-blue-400">
              Knowledge Grid Interface
            </h4>
            <p className="mt-2 text-sm font-medium tracking-tight text-slate-400">
              전체 에이전트 간의 지식 동기화 및 실시간 컨텍스트 주입 시스템
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {['Vector Engine', 'PRD Sync'].map((item) => (
            <div
              key={item}
              className="cursor-crosshair rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all hover:scale-105 hover:bg-white/10"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/40 p-8 font-mono shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-5">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/50" />
              <div className="h-3 w-3 rounded-full bg-amber-500/50" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
              Real-time Execution Stream
            </span>
          </div>
          <div className="animate-pulse rounded border border-white/5 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase text-slate-500">
            Live
          </div>
        </div>
        <div ref={logContainerRef} className="custom-scrollbar h-40 space-y-4 overflow-y-auto">
          {simLog.map((log, i) => (
            <div
              key={i}
              className="group flex animate-in fade-in slide-in-from-left-4 items-start duration-500"
            >
              <span className="mr-6 whitespace-nowrap font-medium text-slate-700">
                [
                {new Date().toLocaleTimeString([], {
                  hour12: false,
                  minute: '2-digit',
                  second: '2-digit',
                })}
                ]
              </span>
              <span
                className={`tracking-tight transition-colors group-hover:text-slate-300 ${
                  log.includes('시작') || log.includes('진입')
                    ? 'font-bold text-blue-400'
                    : 'font-medium text-slate-500'
                }`}
              >
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAgentDeepDive = () => (
    <div className="grid animate-in fade-in grid-cols-1 gap-10 duration-1000 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        {Object.entries(QA_AGENT_DETAILS).map(([id, data]) => {
          const agentId = id as AgentId
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveAgent(agentId)}
              className={`relative w-full overflow-hidden rounded-[30px] border p-8 text-left shadow-lg transition-all duration-500 ${
                activeAgent === agentId
                  ? 'z-10 scale-[1.03] border-white bg-white text-black shadow-white/10'
                  : 'border-white/5 bg-slate-900/40 text-slate-500 hover:border-white/20 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-6">
                <span
                  className={`text-3xl transition-all duration-700 ${
                    activeAgent === agentId
                      ? 'scale-110 drop-shadow-md'
                      : 'scale-90 opacity-20 grayscale'
                  }`}
                >
                  {data.icon}
                </span>
                <div>
                  <div
                    className={`mb-2 text-[8px] font-black uppercase tracking-[0.5em] ${
                      activeAgent === agentId ? 'text-black/50' : 'text-slate-700'
                    }`}
                  >
                    Module Node 0{Object.keys(QA_AGENT_DETAILS).indexOf(id) + 1}
                  </div>
                  <div className="text-xl font-bold uppercase tracking-tighter">{data.title}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="glass-card relative col-span-1 overflow-hidden rounded-[50px] border border-white/10 p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] lg:col-span-8">
        <div
          className={`absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-${QA_AGENT_DETAILS[activeAgent].color}-500/5 blur-[150px]`}
        />

        <div className="relative z-10">
          <div className="mb-20 flex flex-col items-start justify-between gap-10 md:flex-row">
            <div className="max-w-2xl">
              <div className="mb-10 inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
                Neural Unit Definition
              </div>
              <h2 className="mb-8 text-6xl font-black uppercase leading-none tracking-tighter text-white">
                {QA_AGENT_DETAILS[activeAgent].title}
              </h2>
              <p className="border-l-4 border-blue-500/30 pl-8 text-2xl font-medium italic leading-relaxed tracking-tight text-slate-400">
                {QA_AGENT_DETAILS[activeAgent].role}
              </p>
            </div>
            <div
              className={`active-glow flex h-28 w-28 items-center justify-center rounded-[35px] border border-white/10 bg-slate-950 text-5xl shadow-2xl border-${QA_AGENT_DETAILS[activeAgent].color}-500/40`}
            >
              {QA_AGENT_DETAILS[activeAgent].icon}
            </div>
          </div>

          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group rounded-[40px] border border-white/5 bg-black/40 p-10 backdrop-blur-3xl transition-colors hover:border-white/10">
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
                Operating Logic
              </h4>
              <p className="text-xl font-bold leading-relaxed tracking-tight text-white/90">
                &quot;{QA_AGENT_DETAILS[activeAgent].objective}&quot;
              </p>
            </div>

            <div className="group rounded-[40px] border border-white/5 bg-black/40 p-10 backdrop-blur-3xl transition-colors hover:border-white/10">
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
                Intelligence Stack
              </h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-wider text-slate-500">Engine</span>
                  <span
                    className={`font-mono text-xs font-black text-${QA_AGENT_DETAILS[activeAgent].color}-400`}
                  >
                    {QA_AGENT_DETAILS[activeAgent].tech.split(' / ')[0]}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 p-1">
                  <div
                    className={`h-full w-[85%] rounded-full bg-gradient-to-r from-${QA_AGENT_DETAILS[activeAgent].color}-600 to-transparent`}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold tracking-wider text-slate-500">
                    Cluster Status
                  </span>
                  <span className="animate-pulse font-mono text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    Optimal
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="flex items-center text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">
              Internal Pipeline
              <div className="ml-12 h-px flex-grow bg-white/10" />
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {QA_AGENT_DETAILS[activeAgent].workflow.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-start rounded-[30px] border border-white/5 bg-white/[0.02] p-8 transition-all hover:translate-y-[-4px] hover:border-white/20"
                >
                  <div className="mr-6 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950 font-mono text-xs font-black text-slate-600 transition-colors group-hover:text-white">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="mb-1.5 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
                      {item.step}
                    </div>
                    <div className="text-sm font-medium leading-normal tracking-tight text-slate-500">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#010204] p-8 font-sans text-slate-300 selection:bg-blue-500/30 selection:text-white md:p-16">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-[200px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[200px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <header className="relative z-10 mx-auto mb-32 flex max-w-7xl flex-col items-end justify-between gap-16 lg:flex-row">
        <div className="group flex items-center space-x-12">
          <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-[30px] bg-white text-black shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-transform duration-[1.5s] ease-in-out group-hover:rotate-[360deg]">
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.45L20.14 19H3.86L12 5.45z" />
            </svg>
          </div>
          <div>
            <h1 className="mb-4 text-5xl font-black uppercase leading-none tracking-tighter text-white">
              Agentic QA OS
            </h1>
            <div className="flex items-center space-x-6">
              <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-white">
                v4.5.0 STABLE
              </span>
              <div className="h-1.5 w-1.5 animate-ping rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-600">
                Enterprise Autonomous Layer
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-end gap-8 lg:w-auto">
          <div className="flex w-full rounded-[24px] border border-white/10 bg-slate-900/40 p-2 shadow-2xl backdrop-blur-3xl lg:w-auto">
            {[
              { id: 'overview' as const, label: 'Dashboard' },
              { id: 'agents' as const, label: 'Node Map' },
              { id: 'stats' as const, label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`flex-1 rounded-[18px] px-10 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 lg:flex-none ${
                  view === tab.id
                    ? 'bg-white text-black shadow-white/20'
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={runSimulation}
            disabled={simulating}
            className={`group relative w-full overflow-hidden rounded-[22px] px-14 py-6 text-[12px] font-black uppercase tracking-[0.6em] transition-all duration-700 lg:w-auto ${
              simulating
                ? 'bg-white/5 text-slate-700'
                : 'bg-white text-black hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-10" />
            <span className="relative z-10">{simulating ? 'Simulating...' : 'Initiate Swarm'}</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto min-h-[600px] max-w-7xl">
        {view === 'overview' && renderOverview()}
        {view === 'agents' && renderAgentDeepDive()}

        {view === 'stats' && (
          <div className="grid animate-in fade-in slide-in-from-bottom-10 grid-cols-1 gap-8 duration-1000 md:grid-cols-3">
            {[
              {
                label: 'Efficiency Boost',
                description:
                  '기존 수동 테스트 프로세스 대비 에이전트 도입 후 시간 절감 효율',
                value: '84.2',
                unit: '%',
                color: 'blue' as const,
              },
              {
                label: 'Test Coverage',
                description: 'AI가 자동 생성 및 검증한 요구사항 대비 시나리오 포함 비중',
                value: '99.7',
                unit: '%',
                color: 'emerald' as const,
              },
              {
                label: 'Resource Saved',
                description: '인적 리소스 투입 대신 AI가 처리하여 절감된 월평균 공수(M/D)',
                value: '124',
                unit: 'MD',
                color: 'indigo' as const,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass-card group relative overflow-hidden rounded-[50px] border border-white/5 p-16 transition-all hover:border-white/20"
              >
                <div
                  className={`absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-${stat.color}-500/10 blur-[80px]`}
                />

                <div className="flex h-full flex-col">
                  <div className="relative z-10 mb-4 text-[11px] font-black uppercase tracking-[0.6em] text-slate-600">
                    {stat.label}
                  </div>
                  <p className="mb-16 text-xs font-medium leading-relaxed text-slate-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {stat.description}
                  </p>

                  <div className="relative z-10 mt-auto flex items-baseline space-x-4">
                    <div className="text-8xl font-black tracking-tighter text-white transition-all duration-700 group-hover:scale-105 group-hover:text-white">
                      {stat.value}
                    </div>
                    <div className="text-2xl font-bold uppercase tracking-widest text-slate-800">
                      {stat.unit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="relative z-10 mx-auto mt-40 flex flex-col items-center justify-between gap-10 border-t border-white/5 pb-20 pt-16 text-slate-700 md:flex-row">
        <div className="flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.5em]">
          <span className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            System Operational
          </span>
          <div className="h-5 w-px bg-white/10" />
          <span className="cursor-pointer opacity-50 transition-opacity hover:opacity-100">
            Security Protocol: AES-512
          </span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.6em] opacity-20 transition-opacity hover:opacity-50">
          Autonomous Quality Assurance & Infrastructure Layer
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;700;900&family=Pretendard+Variable&display=swap');

        body {
          font-family: 'Montserrat', 'Pretendard Variable', 'Pretendard', sans-serif;
          letter-spacing: -0.03em;
          -webkit-font-smoothing: antialiased;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .active-glow {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.2), inset 0 0 10px rgba(59, 130, 246, 0.1);
          animation: borderGlow 2s ease-in-out infinite alternate;
        }

        @keyframes borderGlow {
          from { border-color: rgba(255, 255, 255, 0.1); }
          to { border-color: rgba(59, 130, 246, 0.5); }
        }

        h1, h2, h3, h4, p, span, div {
          word-break: keep-all;
        }

        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        :root {
          --blue-rgb: 59, 130, 246;
          --indigo-rgb: 99, 102, 241;
          --emerald-rgb: 16, 185, 129;
          --rose-rgb: 244, 63, 94;
        }
      `}</style>

      {/* Tailwind: dynamic color utilities */}
      <div className="pointer-events-none fixed left-0 top-0 -z-10 hidden h-0 w-0 overflow-hidden opacity-0">
        <span className="border-blue-500/50 border-indigo-500/50 border-emerald-500/50 border-rose-500/50" />
        <span className="from-blue-500/20 from-indigo-500/20 from-emerald-500/20 from-rose-500/20" />
        <span className="text-blue-400 text-indigo-400 text-emerald-400 text-rose-400" />
        <span className="from-blue-600 from-indigo-600 from-emerald-600 from-rose-600 to-blue-400 to-indigo-400 to-emerald-400 to-rose-400" />
        <span className="border-blue-500/40 border-indigo-500/40 border-emerald-500/40 border-rose-500/40" />
        <span className="bg-blue-500/5 bg-indigo-500/5 bg-emerald-500/5 bg-rose-500/5" />
        <span className="bg-blue-500/10 bg-indigo-500/10 bg-emerald-500/10 bg-rose-500/10" />
      </div>
    </div>
  )
}

export default App
