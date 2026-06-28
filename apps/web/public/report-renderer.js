/**
 * Shared report renderer — the SINGLE source of truth for how an artifact's
 * UI looks. Used identically by:
 *   - the Cowork preview (inlined into the preview HTML)
 *   - the Rockets web page /report/[name] (imported as a module)
 *
 * Framework-agnostic: call renderReport(container, uiSchema, data).
 * No external dependencies. Injects its own polished CSS once. Light + dark.
 *
 * uiSchema shape:
 * {
 *   title, subtitle,
 *   data: "tasks",                       // path into `data` to the row array (optional)
 *   accent: "#2f6bff",                   // optional brand accent
 *   blocks: [
 *     { type:"metric", items:[ {label, value:"count"} | {label, where:{field,equals}, label} ] },
 *     { type:"filter", search:true, fields:["status","project"] },
 *     { type:"table", columns:[ {key,label,as?:"status"|"badge"|"mono"} ] },
 *     { type:"cards", title:"title", subtitle:"owner", badge:"status", fields:["project"] },
 *     { type:"detail", fields:[ {key,label} ] }
 *   ]
 * }
 */
(function (global) {
  const CSS = `
  .sgr{--sg-bg:#f6f8fc;--sg-sf:#fff;--sg-sf2:#f3f6fc;--sg-ink:#141a2e;--sg-mut:#5d6b8c;
    --sg-ln:#e4e9f4;--sg-acc:#2f6bff;--sg-accsoft:#eaf0ff;--sg-ok:#0fae7e;--sg-oksoft:#e7f8f1;
    --sg-warn:#c2790f;--sg-warnsoft:#fdf1dc;--sg-err:#d6455b;--sg-errsoft:#fdecee;--sg-shadow:0 1px 2px rgba(20,40,80,.05),0 1px 8px rgba(20,40,80,.04);
    color:var(--sg-ink);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;line-height:1.5;}
  @media (prefers-color-scheme:dark){.sgr{--sg-bg:#0e131f;--sg-sf:#161c29;--sg-sf2:#1b2333;--sg-ink:#e9edf6;--sg-mut:#93a0bf;
    --sg-ln:#27314a;--sg-acc:#6ea8fe;--sg-accsoft:#1a2740;--sg-ok:#2ee0a6;--sg-oksoft:#10312a;--sg-warn:#e6b25e;--sg-warnsoft:#332912;
    --sg-err:#ff7488;--sg-errsoft:#3a1c22;--sg-shadow:0 1px 2px rgba(0,0,0,.35);}}
  .sgr *{box-sizing:border-box}
  .sgr .sg-head{margin:0 0 20px}
  .sgr .sg-title{font-size:22px;font-weight:800;letter-spacing:-.01em;margin:0}
  .sgr .sg-sub{color:var(--sg-mut);font-size:14px;margin:4px 0 0}
  .sgr .sg-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:0 0 18px}
  .sgr .sg-metric{background:var(--sg-sf);border:1px solid var(--sg-ln);border-radius:14px;padding:16px 18px;box-shadow:var(--sg-shadow)}
  .sgr .sg-metric .v{font-size:26px;font-weight:800;letter-spacing:-.02em}
  .sgr .sg-metric .l{color:var(--sg-mut);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-top:2px}
  .sgr .sg-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 14px}
  .sgr .sg-search{flex:1;min-width:200px;position:relative}
  .sgr .sg-search input{width:100%;background:var(--sg-sf);border:1px solid var(--sg-ln);border-radius:10px;
    padding:10px 12px 10px 34px;font-size:14px;color:var(--sg-ink);outline:none}
  .sgr .sg-search input:focus{border-color:var(--sg-acc);box-shadow:0 0 0 3px var(--sg-accsoft)}
  .sgr .sg-search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);opacity:.5}
  .sgr .sg-chips{display:flex;gap:7px;flex-wrap:wrap}
  .sgr .sg-chip{background:var(--sg-sf);border:1px solid var(--sg-ln);color:var(--sg-mut);border-radius:999px;
    padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer;user-select:none;transition:.12s}
  .sgr .sg-chip:hover{border-color:var(--sg-acc);color:var(--sg-ink)}
  .sgr .sg-chip.on{background:var(--sg-acc);border-color:var(--sg-acc);color:#fff}
  .sgr .sg-card-wrap{background:var(--sg-sf);border:1px solid var(--sg-ln);border-radius:16px;box-shadow:var(--sg-shadow);overflow:hidden}
  .sgr table{width:100%;border-collapse:collapse;font-size:14px}
  .sgr thead th{text-align:left;padding:12px 16px;color:var(--sg-mut);font-size:11px;font-weight:700;
    text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--sg-ln);background:var(--sg-sf2)}
  .sgr tbody td{padding:13px 16px;border-bottom:1px solid var(--sg-ln);vertical-align:middle}
  .sgr tbody tr:last-child td{border-bottom:0}
  .sgr tbody tr{transition:background .1s}
  .sgr tbody tr:hover td{background:var(--sg-sf2)}
  .sgr .sg-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;color:var(--sg-mut)}
  .sgr .sg-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;
    font-size:12px;font-weight:700;line-height:1}
  .sgr .sg-pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.9}
  .sgr .sg-pill.ok{background:var(--sg-oksoft);color:var(--sg-ok)}
  .sgr .sg-pill.warn{background:var(--sg-warnsoft);color:var(--sg-warn)}
  .sgr .sg-pill.acc{background:var(--sg-accsoft);color:var(--sg-acc)}
  .sgr .sg-pill.mut{background:var(--sg-sf2);color:var(--sg-mut)}
  .sgr .sg-badge{display:inline-block;padding:3px 9px;border-radius:7px;font-size:12px;font-weight:600;background:var(--sg-sf2);color:var(--sg-mut);border:1px solid var(--sg-ln)}
  .sgr .sg-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
  .sgr .sg-c{background:var(--sg-sf);border:1px solid var(--sg-ln);border-radius:14px;padding:15px 16px;box-shadow:var(--sg-shadow)}
  .sgr .sg-c .ct{font-weight:700;font-size:15px;margin:0 0 2px}
  .sgr .sg-c .cs{color:var(--sg-mut);font-size:13px}
  .sgr .sg-c .cf{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
  .sgr .sg-detail{background:var(--sg-sf);border:1px solid var(--sg-ln);border-radius:14px;overflow:hidden}
  .sgr .sg-detail .row{display:flex;justify-content:space-between;gap:16px;padding:12px 16px;border-bottom:1px solid var(--sg-ln)}
  .sgr .sg-detail .row:last-child{border-bottom:0}
  .sgr .sg-detail .k{color:var(--sg-mut);font-size:13px}
  .sgr .sg-detail .val{font-weight:600;font-size:14px;text-align:right}
  .sgr .sg-empty{text-align:center;color:var(--sg-mut);padding:48px 16px;background:var(--sg-sf);border:1px dashed var(--sg-ln);border-radius:16px}
  .sgr .sg-empty .em-t{font-weight:700;color:var(--sg-ink);margin-bottom:4px}
  .sgr .sg-err{background:var(--sg-errsoft);border:1px solid var(--sg-err);color:var(--sg-err);border-radius:14px;padding:16px 18px;font-size:14px}
  .sgr .sg-foot{margin-top:14px;color:var(--sg-mut);font-size:12px;text-align:right}
  .sgr .sg-conn{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--sg-oksoft);border:1px solid var(--sg-ok);border-radius:10px;padding:10px 14px;margin:0 0 16px;font-size:12.5px;color:var(--sg-ok)}
  .sgr .sg-conn .live{display:flex;align-items:center;gap:7px;font-weight:700}
  .sgr .sg-pulse{width:9px;height:9px;border-radius:50%;background:var(--sg-ok);animation:sgpulse 2s infinite}
  @keyframes sgpulse{0%{box-shadow:0 0 0 0 rgba(23,178,106,.5)}70%{box-shadow:0 0 0 7px rgba(23,178,106,0)}100%{box-shadow:0 0 0 0 rgba(23,178,106,0)}}
  .sgr .sg-conn .meta{color:var(--sg-mut)}
  .sgr .sg-bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}
  .sgr .sg-bcard{background:var(--sg-sf);border:1px solid var(--sg-ln);border-radius:14px;padding:16px 18px;box-shadow:var(--sg-shadow)}
  .sgr .sg-bcn{font-size:16px;font-weight:700}
  .sgr .sg-bcy{font-size:12px;color:var(--sg-mut);margin:2px 0 12px}
  .sgr .sg-kpis{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
  .sgr .sg-kpi{border:1px solid var(--sg-ln);border-radius:8px;padding:7px 11px;min-width:92px}
  .sgr .sg-kpi.creator{border-color:var(--sg-ok);background:var(--sg-oksoft)}
  .sgr .sg-kpi .l{font-size:9.5px;color:var(--sg-mut);text-transform:uppercase;letter-spacing:.4px}
  .sgr .sg-kpi .v{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums}
  .sgr .sg-kpi .v .pend{font-size:12px;color:var(--sg-warn);font-weight:600}
  .sgr .sg-bk{margin-bottom:9px}
  .sgr .sg-bk-r{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:3px}
  .sgr .sg-bk-n{font-weight:500}
  .sgr .sg-bk-v{color:var(--sg-mut);font-variant-numeric:tabular-nums}
  .sgr .sg-bar{height:11px;background:var(--sg-sf2);border-radius:6px;overflow:hidden}
  .sgr .sg-bar>i{display:block;height:100%;border-radius:6px;background:var(--sg-acc)}
  .sgr .sg-bar>i.buf{background:var(--sg-mut)}
  .sgr .sg-bar>i.green{background:var(--sg-ok)}
  .sgr .sg-bar>i.amber{background:var(--sg-warn)}
  .sgr .sg-bar>i.red{background:var(--sg-err)}
  .sgr .sg-bnote{margin-top:12px;background:var(--sg-warnsoft);border:1px solid var(--sg-warn);border-radius:8px;padding:9px 11px;font-size:11.5px;color:var(--sg-warn)}
  .sgr .sg-bjoin{margin-top:10px;font-size:10.5px;color:var(--sg-mut);font-variant-numeric:tabular-nums;border-top:1px solid var(--sg-ln);padding-top:8px}
  .sgr a.sg-clickable{display:block;text-decoration:none;color:inherit;transition:transform .12s,border-color .12s,box-shadow .12s}
  .sgr a.sg-clickable:hover{transform:translateY(-2px);border-color:var(--sg-acc);box-shadow:0 6px 20px rgba(47,107,255,.12)}
  .sgr .sg-bmore{margin-top:12px;font-size:12px;font-weight:700;color:var(--sg-acc)}
  `;

  function injectCss() {
    if (typeof document === "undefined") return;
    if (document.getElementById("sg-renderer-css")) return;
    const s = document.createElement("style");
    s.id = "sg-renderer-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]),
    );
  }
  function getPath(obj, path) {
    if (!path) return obj;
    return path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
  }
  // Find the first array-of-objects anywhere in a result tree.
  function findRows(obj) {
    if (Array.isArray(obj) && obj.length && typeof obj[0] === "object" && !Array.isArray(obj[0])) return obj;
    if (obj && typeof obj === "object") {
      for (const k of Object.keys(obj)) {
        const r = findRows(obj[k]);
        if (r) return r;
      }
    }
    return null;
  }
  // Map a status-ish value to a pill style.
  function pillClass(v) {
    const s = String(v).toLowerCase();
    if (/(done|complete|completed|closed|paid|active|ok|success)/.test(s)) return "ok";
    if (/(open|pending|todo|waiting|new)/.test(s)) return "warn";
    if (/(progress|review|running|doing)/.test(s)) return "acc";
    return "mut";
  }

  function rowsFrom(uiSchema, data) {
    const explicit = uiSchema.data ? getPath(data, uiSchema.data) : null;
    const rows = Array.isArray(explicit) ? explicit : findRows(data);
    return rows || [];
  }

  // ---- block renderers (return HTML strings; filter wires events after mount) ----
  function metricBlock(block, rows) {
    const items = (block.items || []).map((it) => {
      let v;
      if (it.where) {
        v = rows.filter((r) => String(r[it.where.field]) === String(it.where.equals)).length;
      } else if (it.sum) {
        v = Math.round(rows.reduce((s, r) => s + (Number(r[it.sum]) || 0), 0) * 100) / 100;
      } else if (it.distinct) {
        v = new Set(rows.map((r) => r[it.distinct]).filter((x) => x != null)).size;
      } else if (it.value === "count" || it.value == null) {
        v = rows.length;
      } else {
        v = getPath(rows[0] || {}, it.value);
      }
      const text = esc(v) + (it.suffix ? esc(it.suffix) : "");
      return `<div class="sg-metric"><div class="v">${text}</div><div class="l">${esc(it.label)}</div></div>`;
    });
    return `<div class="sg-metrics">${items.join("")}</div>`;
  }

  function tableBlock(block, rows) {
    const cols = block.columns || inferColumns(rows);
    const head = cols.map((c) => `<th>${esc(c.label || c.key)}</th>`).join("");
    const body = rows.map((r) => "<tr>" + cols.map((c) => `<td>${cell(r[c.key], c.as)}</td>`).join("") + "</tr>").join("");
    return `<div class="sg-card-wrap"><table data-sg-table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function cell(v, as) {
    if (as === "status") return `<span class="sg-pill ${pillClass(v)}">${esc(v)}</span>`;
    if (as === "badge") return `<span class="sg-badge">${esc(v)}</span>`;
    if (as === "mono") return `<span class="sg-mono">${esc(v)}</span>`;
    if (v != null && typeof v === "object") return `<span class="sg-mono">${esc(JSON.stringify(v))}</span>`;
    return esc(v);
  }
  function inferColumns(rows) {
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r || {})))].slice(0, 7);
    return keys.map((k) => ({ key: k, label: k, as: /status|state/i.test(k) ? "status" : undefined }));
  }

  function cardsBlock(block, rows) {
    const cards = rows
      .map((r) => {
        const badge = block.badge ? `<span class="sg-pill ${pillClass(r[block.badge])}">${esc(r[block.badge])}</span>` : "";
        const fields = (block.fields || []).map((f) => `<span class="sg-badge">${esc(r[f])}</span>`).join("");
        return `<div class="sg-c"><div class="ct">${esc(r[block.title || "title"])}</div>
          <div class="cs">${esc(r[block.subtitle || ""] || "")}</div>
          <div class="cf">${badge}${fields}</div></div>`;
      })
      .join("");
    return `<div class="sg-cards" data-sg-table>${cards}</div>`;
  }

  function detailBlock(block, rows) {
    const r = rows[0] || {};
    const fields = block.fields || Object.keys(r).map((k) => ({ key: k, label: k }));
    const out = fields
      .map((f) => `<div class="row"><div class="k">${esc(f.label || f.key)}</div><div class="val">${cell(r[f.key], f.as)}</div></div>`)
      .join("");
    return `<div class="sg-detail">${out}</div>`;
  }

  function fmtH(v) {
    const n = Number(v) || 0;
    return (Math.round(n * 100) / 100).toLocaleString() + "h";
  }
  // Drill-down: build a link to another report from a row.
  // block.link = { to:"flow-name", param:"project", from:"id", base?:"/report/" }
  // The target report receives ?param=<row[from]>, passed to the flow as input.
  function linkHref(block, row) {
    const l = block && block.link;
    if (!l || !l.to) return null;
    const base = l.base || "/report/";
    const val = encodeURIComponent(row[l.from || "id"] == null ? "" : row[l.from || "id"]);
    return `${base}${encodeURIComponent(l.to)}?${encodeURIComponent(l.param || "id")}=${val}`;
  }
  // Budget cards: each account row shows KPIs + per-bucket budget bars.
  // row = { name, cycle, total, buckets:[{label,value,buffer?}], logged?, utilization?, note?, join? }
  function budgetBlock(block, rows) {
    const K = {
      name: block.name || "name",
      cycle: block.cycle || "cycle",
      total: block.total || "total",
      buckets: block.buckets || "buckets",
    };
    const cards = rows
      .map((a) => {
        const total = Number(a[K.total]) || 0;
        const buckets = Array.isArray(a[K.buckets]) ? a[K.buckets] : [];
        const maxLogged = Math.max(1, ...buckets.map((b) => Number(b.logged != null ? b.logged : b.value) || 0));
        const healthOf = (u) => (u == null ? "" : u <= 0.85 ? "green" : u <= 1 ? "amber" : "red");
        const bars = buckets
          .map((b) => {
            const budget = b.budget == null ? null : Number(b.budget);
            const logged = Number(b.logged != null ? b.logged : b.value) || 0;
            const isBuf = b.buffer === true || b.buffer === "true" || /buffer/i.test(b.label || "");
            let pct, right, cls;
            if (budget != null && budget > 0) {
              const u = logged / budget;
              pct = Math.min(100, u * 100);
              right = `${esc(fmtH(logged))} / ${esc(fmtH(budget))} · ${Math.round(u * 100)}%`;
              cls = b.health || healthOf(u);
            } else {
              pct = Math.min(100, (logged / maxLogged) * 100);
              right = esc(fmtH(logged));
              cls = isBuf ? "buf" : "";
            }
            return `<div class="sg-bk"><div class="sg-bk-r"><span class="sg-bk-n">${esc(b.label)}</span><span class="sg-bk-v">${right}</span></div><div class="sg-bar"><i class="${cls}" style="width:${pct}%"></i></div></div>`;
          })
          .join("");
        const logged = a.logged == null ? `<span class="pend">sync pending</span>` : esc(fmtH(a.logged));
        const util = a.utilization == null ? "—" : `${Math.round(Number(a.utilization) * 100)}%`;
        const note = a.note ? `<div class="sg-bnote">${esc(a.note)}</div>` : "";
        const join = a.join ? `<div class="sg-bjoin">${esc(a.join)}</div>` : "";
        const href = linkHref(block, a);
        const tag = href ? "a" : "div";
        const attr = href ? ` href="${href}"` : "";
        const more = href ? `<div class="sg-bmore">View details &rarr;</div>` : "";
        return `<${tag} class="sg-bcard${href ? " sg-clickable" : ""}"${attr}>
          <div class="sg-bcn">${esc(a[K.name])}</div>
          <div class="sg-bcy">${esc(a[K.cycle] || "")}</div>
          <div class="sg-kpis">
            ${total > 0 ? `<div class="sg-kpi creator"><div class="l">Budget total</div><div class="v">${esc(fmtH(total))}</div></div>` : ""}
            <div class="sg-kpi"><div class="l">Logged</div><div class="v">${logged}</div></div>
            ${total > 0 ? `<div class="sg-kpi"><div class="l">Utilization</div><div class="v">${util}</div></div>` : ""}
          </div>
          ${bars}${note}${join}${more}
        </${tag}>`;
      })
      .join("");
    return `<div class="sg-bgrid">${cards}</div>`;
  }

  function filterBlock(block) {
    const search = block.search === false ? "" :
      `<div class="sg-search">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
         <input type="text" data-sg-search placeholder="Search..." /></div>`;
    return `<div class="sg-toolbar" data-sg-filter>${search}<div class="sg-chips" data-sg-chips></div></div>`;
  }

  function renderReport(container, uiSchema, data) {
    injectCss();
    uiSchema = uiSchema || {};
    const rows = rowsFrom(uiSchema, data);
    const accent = uiSchema.accent;
    const root = document.createElement("div");
    root.className = "sgr";
    if (accent) root.style.setProperty("--sg-acc", accent);

    let html = `<div class="sg-head">
      <h1 class="sg-title">${esc(uiSchema.title || "Report")}</h1>
      ${uiSchema.subtitle ? `<p class="sg-sub">${esc(uiSchema.subtitle)}</p>` : ""}
    </div>`;

    if (uiSchema.connection) {
      const c = uiSchema.connection;
      html += `<div class="sg-conn"><span class="live"><span class="sg-pulse"></span>${esc(c.label || "Connected")}</span>${c.meta ? `<span class="meta">${esc(c.meta)}</span>` : ""}</div>`;
    }

    if (!rows.length && !(uiSchema.blocks || []).some((b) => b.type === "detail")) {
      html += `<div class="sg-empty"><div class="em-t">No data</div><div>The workflow returned no rows to display.</div></div>`;
      root.innerHTML = html;
      container.innerHTML = "";
      container.appendChild(root);
      return;
    }

    const blocks = uiSchema.blocks && uiSchema.blocks.length
      ? uiSchema.blocks
      : [{ type: "table" }]; // sensible default
    const filterFields = [];
    for (const b of blocks) {
      if (b.type === "metric") html += metricBlock(b, rows);
      else if (b.type === "filter") { html += filterBlock(b); (b.fields || []).forEach((f) => filterFields.push(f)); }
      else if (b.type === "table") html += tableBlock(b, rows);
      else if (b.type === "cards") html += cardsBlock(b, rows);
      else if (b.type === "detail") html += detailBlock(b, rows);
      else if (b.type === "budget") html += budgetBlock(b, rows);
    }
    html += `<div class="sg-foot">${rows.length} ${rows.length === 1 ? "record" : "records"}</div>`;

    root.innerHTML = html;
    container.innerHTML = "";
    container.appendChild(root);

    wireFilter(root, uiSchema, rows, filterFields);
  }

  // Client-side search + chip filtering over the rendered table/cards.
  function wireFilter(root, uiSchema, allRows, filterFields) {
    const filterBar = root.querySelector("[data-sg-filter]");
    if (!filterBar) return;
    const tableBlockDef = (uiSchema.blocks || []).find((b) => b.type === "table");
    const cardsBlockDef = (uiSchema.blocks || []).find((b) => b.type === "cards");
    const searchEl = root.querySelector("[data-sg-search]");
    const chipsEl = root.querySelector("[data-sg-chips]");
    const active = {}; // field -> value

    // build chips from distinct values of the first filter field
    const chipField = filterFields[0];
    if (chipField && chipsEl) {
      const vals = [...new Set(allRows.map((r) => r[chipField]).filter((v) => v != null))];
      chipsEl.innerHTML = [`<span class="sg-chip on" data-v="">Todos</span>`]
        .concat(vals.map((v) => `<span class="sg-chip" data-v="${esc(v)}">${esc(v)}</span>`))
        .join("");
      chipsEl.querySelectorAll(".sg-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          chipsEl.querySelectorAll(".sg-chip").forEach((c) => c.classList.remove("on"));
          chip.classList.add("on");
          active[chipField] = chip.getAttribute("data-v");
          apply();
        });
      });
    }
    if (searchEl) searchEl.addEventListener("input", apply);

    function apply() {
      const q = (searchEl && searchEl.value || "").toLowerCase().trim();
      const filtered = allRows.filter((r) => {
        if (chipField && active[chipField]) {
          if (String(r[chipField]) !== String(active[chipField])) return false;
        }
        if (q) return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
        return true;
      });
      // re-render only the table/cards container
      const tbl = root.querySelector("table[data-sg-table]");
      if (tbl && tableBlockDef) {
        const cols = tableBlockDef.columns || inferColumns(allRows);
        tbl.querySelector("tbody").innerHTML = filtered
          .map((r) => "<tr>" + cols.map((c) => `<td>${cell(r[c.key], c.as)}</td>`).join("") + "</tr>")
          .join("");
      }
      const cardsC = root.querySelector(".sg-cards[data-sg-table]");
      if (cardsC && cardsBlockDef) cardsC.outerHTML = cardsBlock(cardsBlockDef, filtered);
      const foot = root.querySelector(".sg-foot");
      if (foot) foot.textContent = `${filtered.length} ${filtered.length === 1 ? "record" : "records"}`;
    }
  }

  function renderError(container, message) {
    injectCss();
    const root = document.createElement("div");
    root.className = "sgr";
    root.innerHTML = `<div class="sg-err"><strong>Could not load the report.</strong><br>${esc(message)}</div>`;
    container.innerHTML = "";
    container.appendChild(root);
  }

  const api = { renderReport, renderError, findRows };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.SGReport = api;
})(typeof window !== "undefined" ? window : globalThis);
