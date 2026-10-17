// MODULE worker (new Worker(url, { type: "module" })): Pyodide 314 ships as an ES module only.
// Runs the student's Python in an isolated Web Worker (Pyodide = CPython in WebAssembly).
// The page owns the time limit: it terminates this worker if a run takes too long
// (an infinite loop can't be interrupted from inside) and starts a fresh one.
//
// Protocol  page -> worker: { id, code, files: { name: text } }
//           worker -> page: { type: "ready" } | { id, type: "done", stdout, stderr, outputs: { name: text } }
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/pyodide.mjs";

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/";

const ready = loadPyodide({ indexURL: PYODIDE_URL }).then((py) => {
  postMessage({ type: "ready" });
  return py;
});

const WORKDIR = "/home/pyodide";

function listFiles(py) {
  const map = {};
  for (const name of py.FS.readdir(WORKDIR)) {
    if (name === "." || name === "..") continue;
    const stat = py.FS.stat(`${WORKDIR}/${name}`);
    if (py.FS.isFile(stat.mode)) map[name] = stat.mtime.getTime() + ":" + stat.size;
  }
  return map;
}

onmessage = async (event) => {
  const { id, code, files } = event.data;
  const py = await ready;
  let stdout = "";
  let stderr = "";
  py.setStdout({ batched: (line) => (stdout += line + "\n") });
  py.setStderr({ batched: (line) => (stderr += line + "\n") });
  py.setStdin({ stdin: () => undefined }); // input() just hits EOF

  // fresh working directory for every run
  for (const name of Object.keys(listFiles(py))) py.FS.unlink(`${WORKDIR}/${name}`);
  for (const [name, text] of Object.entries(files || {})) py.FS.writeFile(`${WORKDIR}/${name}`, text);
  const before = listFiles(py);

  const globals = py.globals.get("dict")();
  try {
    await py.runPythonAsync(code, { globals });
  } catch (err) {
    // Python tracebacks: keep only the part about the student's code
    stderr += String(err && err.message ? err.message : err)
      .split("\n")
      .filter((line) => !line.includes("/lib/python") && !line.includes("_pyodide"))
      .join("\n");
  } finally {
    globals.destroy();
  }

  const after = listFiles(py);
  const outputs = {};
  for (const [name, sig] of Object.entries(after)) {
    if (before[name] !== sig) outputs[name] = py.FS.readFile(`${WORKDIR}/${name}`, { encoding: "utf8" });
  }
  postMessage({ id, type: "done", stdout, stderr, outputs });
};
