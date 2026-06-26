"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "@/lib/api";

interface BudgetBucket {
  key: string;
  label: string;
  budgetHours: number;
  loggedHours: number;
  remainingHours: number;
  utilizationPct: number;
  health: BudgetHealth;
}

type BudgetHealth = "green" | "amber" | "red" | "pending";

interface BudgetAccount {
  projectId: string;
  sprintId: string;
  name: string;
  cycle: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  totalBudgetHours: number;
  loggedHours: number;
  remainingHours: number;
  utilizationPct: number;
  unclassifiedHours: number;
  unclassifiedPct: number;
  allocatedHours: number;
  availableHours: number;
  buckets: BudgetBucket[];
  health: BudgetHealth;
}

interface BudgetAlert {
  id: string;
  accountName: string;
  bucketKey?: string;
  severity: "info" | "warning" | "critical";
  message: string;
}

interface ZohoTask {
  id: string;
  title: string;
  projectId: string;
  bucketKey: string;
  requester: string;
  priority: "low" | "medium" | "high";
  status: "new" | "triaged" | "estimated";
  requestedAt: string;
  estimatedHours: number;
  loggedHours: number;
  totalHours: number;
}

interface BudgetSnapshot {
  id: string;
  snapshotId: string;
  capturedAt: string;
  source: {
    app: string;
    report: string;
    owner: string;
  };
  syncAgeHours: number;
  stale: boolean;
  alerts: BudgetAlert[];
  totalBudgetHours: number;
  accounts: BudgetAccount[];
}

interface FeatureEstimate {
  id: string;
  projectId: string;
  featureTitle: string;
  featureDescription: string;
  estimatedHours: number;
  confidence: "low" | "medium" | "high";
  canFitBudget: boolean;
  budgetAvailableHours: number;
  codeAnalysis: {
    touchedAreas: string[];
    riskLevel: "low" | "medium" | "high";
    notes: string[];
  };
  recommendation: string;
  dateCreated: string;
}

interface BudgetDashboard {
  snapshot: BudgetSnapshot | null;
  tasks: ZohoTask[];
  estimates: FeatureEstimate[];
}

const TASKS_PAGE_SIZE = 5;
const ALL_FILTER = "all";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<BudgetDashboard>({
    snapshot: null,
    tasks: [],
    estimates: [],
  });
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const accounts = useMemo(
    () => dashboard.snapshot?.accounts ?? [],
    [dashboard.snapshot],
  );
  const account = useMemo(
    () => accounts.find((item) => item.projectId === selectedProjectId),
    [accounts, selectedProjectId],
  );
  const redAccounts = accounts.filter((item) => item.health === "red").length;
  const watchAccounts = accounts.filter(
    (item) => item.health === "amber",
  ).length;

  const accountTasks = useMemo(
    () =>
      account
        ? dashboard.tasks.filter((task) => task.projectId === account.projectId)
        : [],
    [dashboard.tasks, account],
  );

  useEffect(() => {
    void loadDashboard();
  }, []);

  const openProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedTaskId("");
  };

  const closeProject = () => {
    setSelectedProjectId("");
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      setDashboard(await apiFetch<BudgetDashboard>("/budget/dashboard"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dashboard failed.");
    } finally {
      setLoading(false);
    }
  };

  const syncZoho = async () => {
    setSyncing(true);
    setError("");

    try {
      setDashboard(
        await apiFetch<BudgetDashboard>("/budget/sync", {
          method: "POST",
          body: JSON.stringify({}),
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Zoho sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="rise space-y-6">
        <header className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <SourcePill tone="rockets">Rockets</SourcePill>
              <SourcePill tone="stargate">Stargate</SourcePill>
              <SourcePill tone="zoho">Zoho Creator</SourcePill>
              <SourcePill tone="sprints">Zoho Sprints</SourcePill>
              <SourcePill tone="computed">Computed</SourcePill>
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground sm:text-3xl">
              Budget Tracker
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Account budget health by service bucket, with Zoho task intake and
              Stargate estimation against remaining capacity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-md border border-line px-4 py-2.5 font-mono text-xs uppercase text-foreground transition-colors hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={syncZoho}
              disabled={syncing}
              className="rounded-md bg-foreground px-4 py-2.5 font-mono text-xs uppercase text-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {syncing ? "Syncing" : "Sync Zoho"}
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-md border border-red-400/50 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-100">
            {error}
          </div>
        ) : null}

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Accounts" value={`${accounts.length}`} />
          <MetricCard
            label="Portfolio Budget"
            value={
              dashboard.snapshot
                ? `${dashboard.snapshot.totalBudgetHours}h`
                : "--"
            }
            tone="zoho"
          />
          <MetricCard label="Red Accounts" value={`${redAccounts}`} tone="red" />
          <MetricCard
            label="Watch Accounts"
            value={`${watchAccounts}`}
            tone="amber"
          />
          <MetricCard
            label="Sync"
            value={
              dashboard.snapshot
                ? dashboard.snapshot.stale
                  ? "Stale"
                  : `${dashboard.snapshot.syncAgeHours}h`
                : "--"
            }
            tone={dashboard.snapshot?.stale ? "red" : "stargate"}
          />
        </section>

        {account ? (
          <ProjectDetail
            key={account.projectId}
            account={account}
            tasks={accountTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onBack={closeProject}
          />
        ) : (
          <Panel title="Portfolio" meta={`${accounts.length} accounts`}>
            {accounts.length ? (
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {accounts.map((item) => (
                  <ProjectCard
                    key={item.projectId}
                    account={item}
                    onOpen={() => openProject(item.projectId)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Run Sync Zoho to load accounts." />
            )}
          </Panel>
        )}

      </div>
    </div>
  );
}

function ProjectCard({
  account,
  onOpen,
}: {
  account: BudgetAccount;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col rounded-md border border-line bg-white/[0.02] p-4 text-left transition-colors hover:border-white/25 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-lg font-bold text-foreground">
          {account.name}
        </span>
        <HealthBadge value={account.health} />
      </div>
      <div className="mt-1 font-mono text-[11px] text-muted">
        {account.cycle}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase text-muted">
            Budget Total
          </div>
          <div className="mt-1 font-display text-xl font-extrabold text-foreground">
            {account.totalBudgetHours}h
          </div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase text-muted">
            Logged
          </div>
          <div className="mt-1 font-display text-xl font-extrabold text-foreground">
            {account.loggedHours}h
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>Utilization</span>
        <span className={toneText(healthTone(account.health))}>
          {account.utilizationPct}%
        </span>
      </div>
      <ProgressBar value={account.utilizationPct} />

      <div className="mt-4 space-y-2 border-t border-line pt-3">
        {account.buckets.map((bucket) => (
          <div key={bucket.key} className="flex items-center gap-3">
            <span className="w-32 flex-none truncate font-mono text-[11px] text-muted">
              {bucket.label}
            </span>
            <div className="flex-1">
              <ProgressBar value={bucket.utilizationPct} compact />
            </div>
            <span className="w-20 flex-none text-right font-mono text-[11px] text-muted">
              {bucket.budgetHours}h · {bucket.utilizationPct}%
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}

function ProjectDetail({
  account,
  tasks,
  selectedTaskId,
  onSelectTask,
  onBack,
}: {
  account: BudgetAccount;
  tasks: ZohoTask[];
  selectedTaskId: string;
  onSelectTask: (id: string) => void;
  onBack: () => void;
}) {
  const [taskSearch, setTaskSearch] = useState("");
  const [taskBucketFilter, setTaskBucketFilter] = useState(ALL_FILTER);
  const [taskPriorityFilter, setTaskPriorityFilter] = useState(ALL_FILTER);
  const [taskStatusFilter, setTaskStatusFilter] = useState(ALL_FILTER);
  const [taskPage, setTaskPage] = useState(1);
  const workItemsRef = useRef<HTMLDivElement>(null);
  const filterKey = `${taskSearch}|${taskBucketFilter}|${taskPriorityFilter}|${taskStatusFilter}`;
  const [appliedFilterKey, setAppliedFilterKey] = useState(filterKey);

  if (filterKey !== appliedFilterKey) {
    setAppliedFilterKey(filterKey);
    setTaskPage(1);
  }

  const buckets = displayBuckets(account, tasks);

  const filteredTasks = useMemo(() => {
    const search = taskSearch.trim().toLowerCase();

    return tasks.filter((task) => {
      if (taskBucketFilter !== ALL_FILTER && task.bucketKey !== taskBucketFilter) {
        return false;
      }

      if (taskPriorityFilter !== ALL_FILTER && task.priority !== taskPriorityFilter) {
        return false;
      }

      if (taskStatusFilter !== ALL_FILTER && task.status !== taskStatusFilter) {
        return false;
      }

      if (!search) return true;

      return (
        task.title.toLowerCase().includes(search) ||
        task.requester.toLowerCase().includes(search)
      );
    });
  }, [tasks, taskSearch, taskBucketFilter, taskPriorityFilter, taskStatusFilter]);

  const taskPageCount = Math.max(
    1,
    Math.ceil(filteredTasks.length / TASKS_PAGE_SIZE),
  );
  const taskPageSafe = Math.min(taskPage, taskPageCount);
  const pagedTasks = filteredTasks.slice(
    (taskPageSafe - 1) * TASKS_PAGE_SIZE,
    taskPageSafe * TASKS_PAGE_SIZE,
  );

  const selectedBucket =
    taskBucketFilter === ALL_FILTER
      ? undefined
      : buckets.find((bucket) => bucket.key === taskBucketFilter);
  const filteredLoggedHours = filteredTasks.reduce(
    (total, task) => total + task.loggedHours,
    0,
  );
  const filteredEstimatedHours = filteredTasks.reduce(
    (total, task) => total + task.estimatedHours,
    0,
  );
  const filteredTotalHours = filteredTasks.reduce(
    (total, task) => total + task.totalHours,
    0,
  );

  const toggleBucketFilter = (bucketKey: string) => {
    setTaskBucketFilter((current) =>
      current === bucketKey ? ALL_FILTER : bucketKey,
    );
    workItemsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase text-muted transition-colors hover:text-foreground"
      >
        ← Portfolio
      </button>

      <Panel
        title={account.name}
        meta={`Project ${account.projectId} · ${account.cycle}`}
      >
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Budget (Total)"
              value={`${account.totalBudgetHours}h`}
              tone="zoho"
            />
            <MetricCard
              label="Used"
              value={`${account.loggedHours}h`}
              tone="sprints"
            />
            <MetricCard
              label="Remaining"
              value={`${account.remainingHours}h`}
              tone="computed"
            />
            <MetricCard
              label="Utilization"
              value={`${account.utilizationPct}%`}
              tone={healthTone(account.health)}
            />
          </div>

          <div>
            <div className="mb-2 font-mono text-[11px] uppercase text-muted">
              New work capacity — accounts for estimates already queued
            </div>
            <CapacityBar account={account} />
          </div>

          <div className="rounded-md border border-line bg-white/[0.02] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-mono text-xs text-muted">
                Join keys — Project ID {account.projectId} · Sprint ID{" "}
                {account.sprintId}
              </div>
              <div className="font-mono text-xs text-muted">
                {account.startDate} to {account.endDate}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line bg-white/[0.02]">
                  <Th label="Service Bucket" hint="Sprints: Service Bucket field" />
                  <Th label="Budget" hint="Creator" align="right" />
                  <Th label="Used" hint="Sprint logs" align="right" />
                  <Th label="Remaining" hint="computed" align="right" />
                  <Th label="Utilization" hint="computed" align="right" />
                  <Th label="Status" hint="computed" align="center" />
                </tr>
              </thead>
              <tbody>
                {buckets.map((bucket) => (
                  <tr
                    key={bucket.key}
                    onClick={() => toggleBucketFilter(bucket.key)}
                    aria-selected={taskBucketFilter === bucket.key}
                    className={`cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-white/[0.04] ${
                      taskBucketFilter === bucket.key ? "bg-white/[0.06]" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {bucket.label}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                      {bucket.budgetHours}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                      {bucket.loggedHours}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                      {bucket.remainingHours}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                      {bucket.utilizationPct}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusDot health={bucket.health} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[11px] text-muted">
            Click a row to filter Work Items below by that bucket.
          </p>
        </div>
      </Panel>

      <div ref={workItemsRef}>
        <Panel
          title="Work Items"
          meta={
            selectedBucket
              ? `${filteredEstimatedHours}h estimated · ${filteredLoggedHours}h used · ${filteredTotalHours}h total · ${selectedBucket.label}`
              : `${filteredTasks.length} of ${tasks.length} tasks`
          }
        >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={taskSearch}
              onChange={(event) => setTaskSearch(event.target.value)}
              placeholder="Search title or requester"
              className="rounded-md border border-line bg-white/[0.04] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-white/30 focus:ring-2 focus:ring-white/10 sm:col-span-2 lg:col-span-1"
            />
            <select
              value={taskBucketFilter}
              onChange={(event) => setTaskBucketFilter(event.target.value)}
              className="rounded-md border border-line bg-white/[0.04] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-white/30 focus:ring-2 focus:ring-white/10"
            >
              <option value={ALL_FILTER}>All buckets</option>
              {buckets.map((bucket) => (
                <option key={bucket.key} value={bucket.key}>
                  {bucket.label}
                </option>
              ))}
            </select>
            <select
              value={taskPriorityFilter}
              onChange={(event) => setTaskPriorityFilter(event.target.value)}
              className="rounded-md border border-line bg-white/[0.04] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-white/30 focus:ring-2 focus:ring-white/10"
            >
              <option value={ALL_FILTER}>All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={taskStatusFilter}
              onChange={(event) => setTaskStatusFilter(event.target.value)}
              className="rounded-md border border-line bg-white/[0.04] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-white/30 focus:ring-2 focus:ring-white/10"
            >
              <option value={ALL_FILTER}>All statuses</option>
              <option value="new">New</option>
              <option value="triaged">Triaged</option>
              <option value="estimated">Estimated</option>
            </select>
          </div>

          {pagedTasks.length ? (
            <div className="space-y-2">
              {pagedTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                  className={`w-full rounded-md border p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 ${
                    selectedTaskId === task.id
                      ? "border-white/25 bg-white/[0.07]"
                      : "border-line bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-5 text-foreground">
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Tag value={bucketLabelFor(account, task.bucketKey)} />
                      <Tag value={task.priority} tone={task.priority} />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs text-muted">
                      {task.requester} · {task.status}
                    </p>
                    <p className="font-mono text-xs text-muted">
                      Est <span className="text-foreground">{task.estimatedHours}h</span>
                      {" · "}
                      Used <span className="text-foreground">{task.loggedHours}h</span>
                      {" · "}
                      Total <span className="text-foreground">{task.totalHours}h</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState text="No tasks match these filters." />
          )}

          {filteredTasks.length > TASKS_PAGE_SIZE ? (
            <div className="flex items-center justify-between font-mono text-xs text-muted">
              <button
                type="button"
                onClick={() => setTaskPage(taskPageSafe - 1)}
                disabled={taskPageSafe <= 1}
                className="rounded-md border border-line px-3 py-1.5 uppercase transition-colors hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                Page {taskPageSafe} of {taskPageCount}
              </span>
              <button
                type="button"
                onClick={() => setTaskPage(taskPageSafe + 1)}
                disabled={taskPageSafe >= taskPageCount}
                className="rounded-md border border-line px-3 py-1.5 uppercase transition-colors hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
        </Panel>
      </div>
    </div>
  );
}

function Th({
  label,
  hint,
  align = "left",
}: {
  label: string;
  hint: string;
  align?: "left" | "right" | "center";
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <th className={`px-4 py-3 font-mono text-[11px] uppercase text-muted ${alignClass}`}>
      <div>{label}</div>
      <div className="font-normal normal-case text-muted/60">{hint}</div>
    </th>
  );
}

function StatusDot({ health }: { health: BudgetHealth }) {
  const color =
    health === "red"
      ? "bg-red-400"
      : health === "amber"
        ? "bg-amber-300"
        : health === "green"
          ? "bg-emerald-400"
          : "bg-white/30";

  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${color}`}
      aria-label={health}
    />
  );
}

function bucketLabelFor(account: BudgetAccount, bucketKey: string): string {
  return (
    account.buckets.find((bucket) => bucket.key === bucketKey)?.label ??
    "Unclassified"
  );
}

function Panel({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-line bg-[#0d1117]/95 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="font-mono text-xs uppercase text-muted">{title}</h2>
        <span className="truncate font-mono text-xs text-muted">{meta}</span>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  return (
    <div
      className={`rounded-md border bg-white/[0.03] p-4 ${toneBorder(tone)}`}
    >
      <div className="font-mono text-xs uppercase text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-extrabold text-foreground">
        {value}
      </div>
    </div>
  );
}

function SourcePill({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <span
      className={`rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase ${toneBorder(tone)} ${toneText(tone)}`}
    >
      {children}
    </span>
  );
}

function Tag({
  value,
  tone = "neutral",
}: {
  value: string;
  tone?: Tone | BudgetAlert["severity"] | ZohoTask["priority"];
}) {
  return (
    <span
      className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase ${toneBorder(tone)} ${toneText(tone)}`}
    >
      {value}
    </span>
  );
}

function HealthBadge({ value }: { value: BudgetHealth }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase ${toneBorder(healthTone(value))} ${toneText(healthTone(value))}`}
    >
      {value}
    </span>
  );
}

function ProgressBar({
  value,
  compact = false,
}: {
  value: number;
  compact?: boolean;
}) {
  const clamped = Math.max(0, Math.min(value, 125));
  const width = `${Math.min(clamped, 100)}%`;
  const over = clamped > 100;

  return (
    <div
      className={`overflow-hidden rounded-full bg-white/[0.07] ${compact ? "h-1.5" : "mt-3 h-2"}`}
    >
      <div
        className={`h-full rounded-full ${over ? "bg-red-400" : value > 85 ? "bg-amber-300" : "bg-emerald-400"}`}
        style={{ width }}
      />
    </div>
  );
}

function CapacityBar({ account }: { account: BudgetAccount }) {
  const total = Math.max(account.totalBudgetHours, 1);
  const loggedPct = clampPct((account.loggedHours / total) * 100);
  const allocatedPct = clampPct(
    (account.allocatedHours / total) * 100,
    100 - loggedPct,
  );
  const overflowPct = Math.max(
    0,
    Math.round(
      ((account.loggedHours + account.allocatedHours - total) / total) * 100,
    ),
  );

  return (
    <div className="rounded-md border border-line bg-white/[0.02] p-4">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase text-muted">
        <span>Capacity</span>
        <span>
          {account.loggedHours}h logged + {account.allocatedHours}h estimated
          of {account.totalBudgetHours}h
        </span>
      </div>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full bg-cyan-400"
          style={{ width: `${loggedPct}%` }}
        />
        <div
          className="h-full bg-orange-400/70"
          style={{ width: `${allocatedPct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
        <span className="text-emerald-300">
          {Math.max(account.availableHours, 0)}h available for new work
        </span>
        {overflowPct > 0 ? (
          <span className="text-red-300">
            {Math.abs(account.availableHours)}h over capacity
          </span>
        ) : null}
      </div>
    </div>
  );
}

function clampPct(value: number, max = 100): number {
  return Math.max(0, Math.min(value, max));
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-line py-8 text-center text-sm text-muted">
      {text}
    </div>
  );
}

type Tone =
  | "neutral"
  | "rockets"
  | "stargate"
  | "zoho"
  | "sprints"
  | "computed"
  | "green"
  | "amber"
  | "red"
  | "critical"
  | "warning"
  | "info"
  | "high"
  | "medium"
  | "low";

function healthTone(value: BudgetHealth): Tone {
  if (value === "red") return "red";
  if (value === "amber") return "amber";
  if (value === "green") return "green";
  return "neutral";
}

const UNCLASSIFIED_BUCKET_KEY = "unclassified";

function knownBucketKeys(account: BudgetAccount): Set<string> {
  return new Set(account.buckets.map((bucket) => bucket.key));
}

function unclassifiedTasksFor(
  account: BudgetAccount,
  accountTasks: ZohoTask[],
): ZohoTask[] {
  const known = knownBucketKeys(account);

  return accountTasks.filter((task) => !known.has(task.bucketKey));
}

function displayBuckets(
  account: BudgetAccount,
  accountTasks: ZohoTask[],
): BudgetBucket[] {
  const hasUnclassified =
    account.unclassifiedHours > 0 ||
    unclassifiedTasksFor(account, accountTasks).length > 0;

  if (!hasUnclassified) return account.buckets;

  return [
    ...account.buckets,
    {
      key: UNCLASSIFIED_BUCKET_KEY,
      label: "Unclassified",
      budgetHours: 0,
      loggedHours: account.unclassifiedHours,
      remainingHours: 0,
      utilizationPct: account.unclassifiedPct,
      health: account.unclassifiedHours > 0 ? "amber" : "green",
    },
  ];
}

function toneBorder(tone: Tone) {
  const styles: Record<Tone, string> = {
    neutral: "border-line",
    rockets: "border-violet-400/45",
    stargate: "border-blue-400/45",
    zoho: "border-emerald-400/45",
    sprints: "border-cyan-400/45",
    computed: "border-orange-400/45",
    green: "border-emerald-400/50",
    amber: "border-amber-300/55",
    red: "border-red-400/55",
    critical: "border-red-400/55",
    warning: "border-amber-300/55",
    info: "border-blue-400/45",
    high: "border-red-400/55",
    medium: "border-amber-300/55",
    low: "border-emerald-400/50",
  };

  return styles[tone];
}

function toneText(tone: Tone) {
  const styles: Record<Tone, string> = {
    neutral: "text-muted",
    rockets: "text-violet-300",
    stargate: "text-blue-300",
    zoho: "text-emerald-300",
    sprints: "text-cyan-300",
    computed: "text-orange-300",
    green: "text-emerald-300",
    amber: "text-amber-200",
    red: "text-red-300",
    critical: "text-red-300",
    warning: "text-amber-200",
    info: "text-blue-300",
    high: "text-red-300",
    medium: "text-amber-200",
    low: "text-emerald-300",
  };

  return styles[tone];
}
