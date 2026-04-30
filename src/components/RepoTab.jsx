import pkg from '../../package.json';
import { useEffect, useState } from 'react';

function parseRepoUrl(url) {
  if (!url) return null;
  const cleaned = url.replace(/^git\+/, '').replace(/\.git$/, '');
  try {
    const u = new URL(cleaned);
    const parts = u.pathname.replace(/^\//, '').split('/');
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
  } catch {}
  const m = cleaned.match(/github.com[:\/]([^/]+)\/(.+)$/);
  if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
  return null;
}

export default function RepoTab({ onClose, isDark, repoUrl }) {
  const fallbackUrl = repoUrl || pkg.repository?.url || pkg.homepage || null;
  const parsed = parseRepoUrl(fallbackUrl);
  const [loading, setLoading] = useState(Boolean(parsed));
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    if (!parsed) return;
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const base = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;
        const [repoRes, issuesRes, contribRes] = await Promise.all([
          fetch(base),
          fetch(`${base}/issues?state=open&per_page=6`),
          fetch(`${base}/contributors?per_page=6`),
        ]);
        if (!repoRes.ok) throw new Error('Repo not found');
        const repoJson = await repoRes.json();
        const issuesJson = issuesRes.ok ? await issuesRes.json() : [];
        const contribJson = contribRes.ok ? await contribRes.json() : [];
        if (!mounted) return;
        setData(repoJson);
        setIssues(Array.isArray(issuesJson) ? issuesJson : []);
        setContributors(Array.isArray(contribJson) ? contribJson : []);
      } catch (e) {
        if (!mounted) return;
        setError(String(e.message || e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => (mounted = false);
  }, [parsed, repoUrl]);

  const repoLink = parsed ? `https://github.com/${parsed.owner}/${parsed.repo}` : fallbackUrl;
  const viewersCount = data
    ? data.subscribers_count != null
      ? data.subscribers_count.toLocaleString()
      : data.watchers_count != null
        ? data.watchers_count.toLocaleString()
        : '0'
    : '0';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className={`text-xs font-mono font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            Repository
          </p>
          <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {pkg.name} · v{pkg.version}
          </p>
        </div>
        <div>
          <a
            href={repoLink || '#'}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono underline"
          >
            Open repo
          </a>
        </div>
      </div>

      <div
        className={`p-3 rounded-xl border transition-none min-h-[180px] ${isDark ? 'bg-zinc-800/40 border-zinc-700' : 'bg-white border-zinc-100'}`}
      >
        {!parsed && (
          <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            No repository URL found in package.json
          </p>
        )}

        {parsed && loading && <p className="text-sm font-mono">Loading repository data…</p>}
        {parsed && error && <p className="text-sm font-mono text-red-400">{error}</p>}

        {data && (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}
                >
                  {data.full_name}
                </h4>
                <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {data.description}
                </p>
              </div>
              <div className="flex items-center gap-3 text-[12px] font-mono">
                <span>★ {data.stargazers_count?.toLocaleString() || 0}</span>
                <span>🍴 {data.forks_count?.toLocaleString() || 0}</span>
                <span>👀 {viewersCount}</span>
                <span>⚠️ {data.open_issues_count?.toLocaleString() || 0}</span>
              </div>
            </div>

            <hr className="my-3" />

            <div>
              <p className={`text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                Open issues
              </p>
              {issues.length === 0 ? (
                <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  No recent open issues (or access restricted).
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {issues.map(issue => (
                    <li key={issue.id} className="text-[13px]">
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className={`font-mono ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}
                      >
                        #{issue.number} {issue.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <hr className="my-3" />

            <div>
              <p className={`text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                Top contributors
              </p>
              {contributors.length === 0 ? (
                <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  No contributors found.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {contributors.map(c => (
                    <a
                      key={c.id}
                      href={c.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-mono"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={c.avatar_url}
                        alt={c.login}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>{c.login}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
