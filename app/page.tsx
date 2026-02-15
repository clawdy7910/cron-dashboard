"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Cake, CalendarClock, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Job = {
  id: string;
  name: string;
  nextRun: string;
  category: "reminder" | "birthday" | string;
};

const categoryConfig: Record<
  string,
  { label: string; icon: typeof Bell; accent: string }
> = {
  reminder: {
    label: "Erinnerung",
    icon: Bell,
    accent: "text-neon-400"
  },
  birthday: {
    label: "Geburtstag",
    icon: Cake,
    accent: "text-orange-300"
  },
  default: {
    label: "Job",
    icon: Clock,
    accent: "text-sky-300"
  }
};

function formatGermanDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin"
  }).format(new Date(iso));
}

function formatCountdown(targetIso: string, now: number) {
  const diff = new Date(targetIso).getTime() - now;
  if (diff <= 0) {
    return "Jetzt fällig";
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [] as string[];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let isMounted = true;

    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data: Job[]) => {
        if (isMounted) setJobs(data);
      })
      .catch(() => {
        if (isMounted) setJobs([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort(
      (a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime()
    );
  }, [jobs]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/40">
          <CalendarClock className="h-4 w-4" />
          Cron Dashboard
        </div>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Aktive Cron-Jobs
        </h1>
        <p className="max-w-2xl text-sm text-white/60">
          Behalte anstehende Aufgaben im Blick. Alle Zeiten werden in deutscher
          Zeit angezeigt.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedJobs.map((job) => {
          const config = categoryConfig[job.category] ?? categoryConfig.default;
          const Icon = config.icon;

          return (
            <Card key={job.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                  <Icon className={`h-6 w-6 ${config.accent}`} />
                </div>
                <div className="flex-1">
                  <CardTitle>{job.name}</CardTitle>
                  <p className="text-xs text-white/50">ID: {job.id}</p>
                </div>
                <Badge className="self-start">Aktiv</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-xs uppercase tracking-[0.2em]">Kategorie</span>
                  <span className="text-sm font-medium text-white">{config.label}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-xs uppercase tracking-[0.2em]">Nächste Ausführung</span>
                  <span className="text-sm font-medium text-white">
                    {formatGermanDate(job.nextRun)}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-night-800/80 px-4 py-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                    <span>Countdown</span>
                    <span className="text-neon-400">{formatCountdown(job.nextRun, now)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
