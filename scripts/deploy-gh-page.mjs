import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const branch = 'gh-page';
const remote = 'origin';
const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const buildDir = resolve(repoRoot, 'dist');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (options.capture && result.stderr) process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(' ')} exited with code ${result.status}`);
  }

  return result.stdout?.trim() ?? '';
}

function git(args, options = {}) {
  return run('git', args, options);
}

function build() {
  const packageManager = process.env.npm_execpath;

  if (packageManager) {
    run(process.execPath, [packageManager, 'run', 'build']);
    return;
  }

  run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', ['run', 'build']);
}

async function main() {
  build();

  const buildStats = await stat(buildDir).catch(() => null);
  if (!buildStats?.isDirectory() || (await readdir(buildDir)).length === 0) {
    throw new Error(`Build output is missing or empty: ${buildDir}`);
  }

  const remoteRef = `refs/heads/${branch}`;
  const remoteBranch = spawnSync(
    'git',
    ['ls-remote', '--exit-code', '--heads', remote, remoteRef],
    { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );

  if (remoteBranch.error) throw remoteBranch.error;
  if (![0, 2].includes(remoteBranch.status)) {
    if (remoteBranch.stderr) process.stderr.write(remoteBranch.stderr);
    throw new Error(`Could not inspect ${remote}/${branch}`);
  }

  let parent;
  if (remoteBranch.status === 0) {
    git(['fetch', '--no-tags', remote, remoteRef]);
    parent = git(['rev-parse', 'FETCH_HEAD'], { capture: true });
  }

  const gitDir = git(['rev-parse', '--absolute-git-dir'], { capture: true });
  const tempDir = await mkdtemp(join(tmpdir(), 'ah-bestia-gh-page-'));
  const deployEnv = { ...process.env, GIT_INDEX_FILE: join(tempDir, 'index') };
  const deploymentGit = (args, options = {}) => git(
    [`--git-dir=${gitDir}`, `--work-tree=${buildDir}`, ...args],
    { ...options, cwd: options.cwd ?? buildDir, env: deployEnv },
  );

  try {
    deploymentGit(['read-tree', '--empty']);
    deploymentGit(['add', '--all', '--force', '.']);
    const tree = deploymentGit(['write-tree'], { capture: true });
    const commitArgs = ['commit-tree', tree, '-m', 'Deploy site'];
    if (parent) commitArgs.splice(2, 0, '-p', parent);
    const commit = deploymentGit(commitArgs, { capture: true });

    git(['push', remote, `${commit}:${remoteRef}`]);
    console.log(`Published dist/ to ${remote}/${branch}.`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
