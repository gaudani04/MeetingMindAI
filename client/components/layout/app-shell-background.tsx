/**
 * Shared ambient layer: multicolor corner glows (matches /landing engineering aesthetic).
 */
export function AppShellBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-32 -top-32 h-[min(420px,80vw)] w-[min(420px,80vw)] rounded-full bg-purple-500/20 blur-[100px] dark:bg-purple-600/18" />
      <div className="absolute -right-24 top-20 h-[min(380px,70vw)] w-[min(380px,70vw)] rounded-full bg-cyan-500/18 blur-[100px] dark:bg-cyan-400/14" />
      <div className="absolute -bottom-32 left-1/4 h-[min(360px,65vw)] w-[min(360px,65vw)] rounded-full bg-amber-500/14 blur-[100px] dark:bg-amber-500/11" />
      <div className="absolute bottom-0 right-0 h-[min(320px,55vw)] w-[min(320px,55vw)] rounded-full bg-blue-600/18 blur-[90px] dark:bg-blue-500/12" />
    </div>
  );
}
