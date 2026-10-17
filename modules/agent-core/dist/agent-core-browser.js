var Vm = Object.create, sd = Object.defineProperty, Jm = Object.getOwnPropertyDescriptor, Km = Object.getOwnPropertyNames, Wm = Object.getPrototypeOf, zm = Object.prototype.hasOwnProperty, Go = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), Ym = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (var o = Km(t), i = 0, s = o.length, u; i < s; i++)
      u = o[i], !zm.call(e, u) && u !== n && sd(e, u, {
        get: ((c) => t[c]).bind(null, u),
        enumerable: !(r = Jm(t, u)) || r.enumerable
      });
  return e;
}, Xm = (e, t, n) => (n = e != null ? Vm(Wm(e)) : {}, Ym(t || !e || !e.__esModule ? sd(n, "default", {
  value: e,
  enumerable: !0
}) : n, e)), ad = "littlewhitebox-server", Yb = `/api/plugins/${ad}`, $s = Object.freeze([{
  id: "tavily",
  label: "Tavily",
  baseUrl: "https://api.tavily.com"
}, {
  id: "exa",
  label: "Exa",
  baseUrl: "https://api.exa.ai"
}]), ld = "tavily", Xb = Object.freeze({
  provider: "联网渠道（全局）",
  key: "API Key",
  show: "显示",
  exaBackend: `Exa 官方接口需安装并启用 ${ad}。`
});
function Qm(e) {
  return $s.some((t) => t.id === e) ? e : ld;
}
function ud(e = "") {
  return String(e || "").trim();
}
function On(e = "", t = ld) {
  return String(e || "").trim().replace(/\/+$/, "") || $s.find((n) => n.id === t).baseUrl;
}
function vo(e = {}, t = {}) {
  return {
    webProvider: Qm(e.webProvider ?? t.webProvider),
    ...Object.fromEntries($s.flatMap(({ id: n }) => [[`${n}ApiKey`, ud(e[`${n}ApiKey`] ?? t[`${n}ApiKey`])], [`${n}BaseUrl`, On(e[`${n}BaseUrl`] ?? t[`${n}BaseUrl`], n)]]))
  };
}
var Qb = Object.freeze([
  Object.freeze({
    value: "inherit",
    label: "跟随模型默认"
  }),
  Object.freeze({
    value: "on",
    label: "开启"
  }),
  Object.freeze({
    value: "off",
    label: "关闭"
  })
]);
function Zm(e = "") {
  return e === "on" || e === "off" ? e : "inherit";
}
function jm(e) {
  return String(e ?? "").trim().toLowerCase() || void 0;
}
function eg(e) {
  if (e == null || e === "") return;
  const t = Number(e);
  return Number.isFinite(t) ? Math.floor(t) : void 0;
}
function Ls(e = {}) {
  const t = e && typeof e == "object" ? e : {}, n = jm(t.effort), r = eg(t.budgetTokens);
  return {
    mode: Zm(t.mode),
    ...n ? { effort: n } : {},
    ...r !== void 0 ? { budgetTokens: r } : {}
  };
}
function z(e = {}) {
  return e?.mode !== "off" && e?.output === "show";
}
var tg = "agent-core-no-auth";
function cd(e) {
  return String(e ?? "").trim();
}
function Bo(e, t) {
  const n = cd(t);
  if (e === "google") return {
    apiKey: n,
    headers: { "x-goog-api-key": n },
    sdkOptions: {
      apiKey: n,
      vertexai: !1
    }
  };
  if (e === "anthropic") return {
    apiKey: n,
    headers: n ? { "x-api-key": n } : {},
    sdkOptions: {
      apiKey: n,
      authToken: null,
      ...n ? {} : { defaultHeaders: {
        "X-Api-Key": null,
        Authorization: null
      } }
    }
  };
  const r = n ? { Authorization: `Bearer ${n}` } : {}, o = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...r
  };
  return {
    apiKey: n,
    headers: r,
    requestHeaders: o,
    sdkOptions: {
      apiKey: n || tg,
      adminAPIKey: null,
      defaultHeaders: {
        Authorization: null,
        "api-key": null,
        ...o
      },
      fetch: (i, s) => globalThis.fetch(i, {
        ...s,
        headers: o
      })
    }
  };
}
var Ao = "x-api-key", Zb = Object.freeze([{
  value: Ao,
  label: "x-api-key"
}, {
  value: "bearer",
  label: "Bearer"
}]);
function $i(e) {
  return e === "anthropic" || e === "sillytavern-claude";
}
function ng(e) {
  return e === "bearer" ? e : Ao;
}
var dd = "openai-compatible", Us = "默认", fd = "default", rg = "deny", Xe = 32e3;
var jb = Object.freeze([{
  value: "default",
  label: "默认权限"
}, {
  value: "full",
  label: "完全权限"
}]), eR = Object.freeze([{
  value: "deny",
  label: "禁止"
}, {
  value: "allow",
  label: "允许"
}]), Li = {
  "openai-responses": {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4.1-mini",
    apiKey: "",
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0
  },
  "openai-compatible": {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    apiKey: "",
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0,
    toolMode: "tagged-json"
  },
  "sillytavern-openai-compatible": {
    baseUrl: "",
    model: "gpt-4o-mini",
    apiKey: "",
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0,
    toolMode: "tagged-json"
  },
  "sillytavern-claude": {
    baseUrl: "",
    model: "claude-sonnet-4-0",
    apiKey: "",
    modelListAuth: Ao,
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0
  },
  "sillytavern-google": {
    baseUrl: "",
    model: "gemini-2.5-pro",
    apiKey: "",
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0
  },
  "sillytavern-vertex": {
    baseUrl: "",
    model: "gemini-2.5-pro",
    apiKey: "",
    vertexAuthMode: "full",
    vertexRegion: "us-central1",
    serviceAccountJson: "",
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0
  },
  anthropic: {
    baseUrl: "https://api.anthropic.com",
    model: "claude-sonnet-4-0",
    apiKey: "",
    modelListAuth: Ao,
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0
  },
  google: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    model: "gemini-2.5-pro",
    apiKey: "",
    temperature: 1,
    maxTokens: Xe,
    sendTemperature: !0
  }
};
function jt() {
  return JSON.parse(JSON.stringify(Li));
}
function Et() {
  return {
    provider: dd,
    modelConfigs: jt(),
    permissionMode: fd
  };
}
function hd(e = Et()) {
  const t = e && typeof e == "object" ? e : Et();
  return {
    provider: Os(t.provider),
    modelConfigs: Fs(t.modelConfigs || {})
  };
}
function pd(e) {
  return e === "full" ? "full" : fd;
}
function md(e) {
  return e === "allow" ? "allow" : rg;
}
function Gn(e, t = Xe) {
  const n = Number(e);
  if (!Number.isFinite(n) || n <= 0) {
    const r = Number(t);
    return Number.isFinite(r) && r > 0 ? Math.floor(r) : Xe;
  }
  return Math.min(Number.MAX_SAFE_INTEGER, Math.floor(n));
}
function ut(e) {
  return String(e || "").trim() || "默认";
}
function Fs(e = {}) {
  const t = jt();
  return Object.keys(Li).forEach((n) => {
    const r = e && typeof e[n] == "object" ? e[n] : {}, o = Li[n], i = n === "sillytavern-vertex";
    t[n] = {
      baseUrl: String(r.baseUrl ?? o.baseUrl ?? ""),
      model: String(r.model ?? o.model ?? ""),
      apiKey: cd(r.apiKey ?? o.apiKey),
      ...$i(n) ? { modelListAuth: ng(r.modelListAuth) } : {},
      temperature: r.temperature ?? o.temperature,
      maxTokens: Gn(r.maxTokens, o.maxTokens),
      sendTemperature: typeof r.sendTemperature == "boolean" ? r.sendTemperature : o.sendTemperature,
      ..."toolMode" in o ? { toolMode: String(r.toolMode || o.toolMode || "native") } : {},
      reasoning: Ls(r.reasoning),
      ...i ? {
        vertexAuthMode: r.vertexAuthMode || o.vertexAuthMode || "full",
        vertexRegion: r.vertexRegion || o.vertexRegion || "us-central1",
        serviceAccountJson: String(r.serviceAccountJson || o.serviceAccountJson || "")
      } : {}
    };
  }), t;
}
function Os(e) {
  return typeof e == "string" && e.trim() ? e : dd;
}
function Gs(e = {}, t) {
  return e && typeof e.presets == "object" && e.presets ? e.presets : e?.modelConfigs ? { [t]: {
    provider: e.provider || "openai-compatible",
    modelConfigs: e.modelConfigs,
    permissionMode: e.permissionMode
  } } : {};
}
function gd(e = {}, t) {
  const n = {}, r = Gs(e, t);
  return Object.entries(r).forEach(([o, i]) => {
    if (!i || typeof i != "object") return;
    const s = ut(o);
    n[s] = {
      provider: Os(i.provider),
      modelConfigs: Fs(i.modelConfigs || {}),
      permissionMode: pd(i.permissionMode)
    };
  }), Object.keys(n).length || (n[Us] = Et()), n;
}
function _d(e, t) {
  const n = ut(t);
  return e[n] ? n : Object.keys(e)[0];
}
function yd(e, t, n) {
  const r = ut(t || n);
  return e[r] ? r : e[n] ? n : Object.keys(e)[0];
}
function Bs(e = {}, t = Et()) {
  const n = hd(t), r = e && typeof e == "object" ? e : {};
  return {
    provider: Os(r.provider || n.provider),
    modelConfigs: Fs(r.modelConfigs || n.modelConfigs)
  };
}
function vd(e = {}, t = {}, n = Us, r = n) {
  if (e?.delegateConfigured === !1) return !1;
  if (r !== n) return !0;
  const o = e?.delegateConfig;
  if (!o || typeof o != "object" || Array.isArray(o) || !(typeof o.provider == "string" && o.provider.trim() || o.modelConfigs && typeof o.modelConfigs == "object" && Object.keys(o.modelConfigs).length)) return !1;
  if (e?.delegateConfigured === !0) return !0;
  const i = t[n] || Et(), s = hd(i), u = Bs(o, i);
  return JSON.stringify(u) !== JSON.stringify(s);
}
function og(e = {}, t, n, r, o) {
  const i = o(e?.[r]);
  if (i) return i;
  const s = Gs(e, t), u = [
    n,
    t,
    e?.currentPresetName,
    e?.delegatePresetName,
    ...Object.keys(s || {})
  ].map(ut), c = /* @__PURE__ */ new Set();
  for (const d of u) {
    if (c.has(d)) continue;
    c.add(d);
    const h = o(s?.[d]?.[r]);
    if (h) return h;
  }
  return o(e?.delegateConfig?.[r]);
}
function ig(e = {}, t, n) {
  const r = (u) => String(u || "").trim();
  if (r(e?.tavilyBaseUrl)) return On(e.tavilyBaseUrl);
  const o = Gs(e, t), i = [
    n,
    t,
    e?.currentPresetName,
    e?.delegatePresetName,
    ...Object.keys(o || {})
  ].map(ut), s = /* @__PURE__ */ new Set();
  for (const u of i) {
    if (s.has(u)) continue;
    s.add(u);
    const c = o?.[u]?.tavilyBaseUrl;
    if (r(c)) return On(c);
  }
  return r(e?.delegateConfig?.tavilyBaseUrl) ? On(e.delegateConfig.tavilyBaseUrl) : On();
}
function Ad(e = {}, t, n) {
  return {
    tavilyApiKey: og(e, t, n, "tavilyApiKey", ud),
    tavilyBaseUrl: ig(e, t, n)
  };
}
function tR(e = {}, t = {}) {
  const { defaultWorkspaceFileName: n = "", normalizeWorkspaceName: r = (p) => String(p || "") } = t, o = ut(e.currentPresetName || e.presetName || "默认"), i = gd(e, o), s = _d(i, e.currentPresetName), u = yd(i, e.delegatePresetName, s), c = i[u] || i[s] || Et(), d = Bs(e.delegateConfig, c), h = vd(e, i, s, u), f = vo(e, Ad(e, o, s));
  return {
    workspaceFileName: r(e.workspaceFileName || n),
    jsApiPermission: md(e.jsApiPermission),
    currentPresetName: s,
    delegatePresetName: u,
    delegateConfig: d,
    delegateConfigured: h,
    presets: i,
    ...f,
    updatedAt: Number(e.updatedAt) || 0,
    configVersion: 1
  };
}
function sg(e = {}) {
  const t = ut(e.currentPresetName || e.presetDraftName || "默认"), n = gd(e, t), r = _d(n, e.currentPresetName), o = yd(n, e.delegatePresetName, r), i = n[r] || Et(), s = n[o] || i, u = Bs(e.delegateConfig, s), c = vd(e, n, r, o), d = vo(e, Ad(e, t, r));
  return {
    workspaceFileName: String(e.workspaceFileName || ""),
    updatedAt: Number(e.updatedAt) || 0,
    jsApiPermission: md(e.jsApiPermission),
    currentPresetName: r,
    delegatePresetName: o,
    delegateConfig: u,
    delegateConfigured: c,
    presetDraftName: ut(e.presetDraftName || r),
    presetNames: Object.keys(n),
    presets: n,
    provider: i.provider,
    modelConfigs: i.modelConfigs,
    permissionMode: pd(i.permissionMode),
    ...d
  };
}
function ag(e = "") {
  return String(e || "").trim().toLowerCase();
}
function qo(e = "") {
  const t = ag(e);
  return t.includes("deepseek") ? "deepseek" : t.includes("kimi") || t.includes("moonshot") ? "kimi" : t.includes("gemini") ? "gemini" : t.includes("claude") ? "claude" : /(?:^|[/_.-])gpt(?:\d|[/_.-]|$)/.test(t) || /(?:^|[/_.-])o\d+(?:[/_.-]|$)/.test(t) ? "openai" : "";
}
var lg = Object.freeze({
  minimal: "最小",
  low: "低",
  medium: "中",
  high: "高",
  xhigh: "超高",
  max: "最大",
  min: "最小"
});
function Td(e) {
  const t = e.intensity || { kind: "none" };
  return Object.freeze({
    ...e,
    modes: Object.freeze([...e.modes || ["inherit"]]),
    outputModes: Object.freeze([...e.outputModes || ["hide", "show"]]),
    temperatureOmitModes: Object.freeze([...e.temperatureOmitModes || []]),
    intensity: Object.freeze({
      ...t,
      ...Array.isArray(t.values) ? { values: Object.freeze([...t.values]) } : {}
    })
  });
}
function je(e, t, n, r, o = {}) {
  return Td({
    profileId: e,
    modes: t,
    intensity: {
      kind: "effort",
      values: n,
      defaultValue: r
    },
    outputModes: o.outputModes,
    temperatureOmitModes: o.temperatureOmitModes
  });
}
var qs = Td({
  profileId: "unsupported",
  modes: ["inherit"],
  outputModes: ["hide"],
  intensity: { kind: "none" },
  unsupportedReason: "当前 Provider、传输方式与模型组合没有已验证的 Reasoning 控制协议。"
}), mr = Object.freeze(["on"]), Hs = Object.freeze([
  "inherit",
  "on",
  "off"
]), Sd = je("openai-gpt-5.6", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
], "medium", { temperatureOmitModes: Hs }), ug = je("kimi-k3", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "high",
  "max"
], "max", { temperatureOmitModes: mr }), cg = je("deepseek-thinking", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "high",
  "max"
], "high", { temperatureOmitModes: mr }), dg = je("openai-compatible-gemini-latest", [
  "inherit",
  "on",
  "off"
], [
  "minimal",
  "low",
  "medium",
  "high"
], "high", { temperatureOmitModes: mr }), fg = je("openai-compatible-claude-latest", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
], "high", { temperatureOmitModes: mr }), hg = je("openai-compatible-default", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "medium",
  "high"
], "medium", { temperatureOmitModes: mr }), pg = je("anthropic-adaptive", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
], "high", { temperatureOmitModes: Hs }), mg = je("sillytavern-claude-adaptive", [
  "inherit",
  "on",
  "off"
], [
  "low",
  "medium",
  "high",
  "max"
], "high", { temperatureOmitModes: Hs }), gg = je("google-gemini-3-flash", ["inherit", "on"], [
  "minimal",
  "low",
  "medium",
  "high"
], "high"), Wa = je("sillytavern-google-3-flash", ["inherit", "on"], [
  "min",
  "low",
  "medium",
  "high"
], "high");
function _g(e = "") {
  switch (qo(e)) {
    case "deepseek":
      return cg;
    case "kimi":
      return ug;
    case "gemini":
      return dg;
    case "claude":
      return fg;
    case "openai":
      return Sd;
    default:
      return hg;
  }
}
function Vs(e = {}) {
  const t = String(e.provider || "").trim(), n = String(e.model || "").trim().toLowerCase();
  switch (t) {
    case "openai-responses":
      return Sd;
    case "openai-compatible":
    case "sillytavern-openai-compatible":
      return _g(n);
    case "anthropic":
      return pg;
    case "sillytavern-claude":
      return mg;
    case "google":
      return gg;
    case "sillytavern-google":
      return Wa;
    case "sillytavern-vertex":
      return Wa;
    default:
      return qs;
  }
}
function nR(e = qs) {
  const t = new Set(e.modes || ["inherit"]);
  return [
    {
      value: "inherit",
      label: "跟随模型默认",
      disabled: !1
    },
    {
      value: "on",
      label: "开启",
      disabled: !t.has("on")
    },
    {
      value: "off",
      label: "关闭",
      disabled: !t.has("off")
    }
  ];
}
function rR(e = qs) {
  return e.intensity?.kind !== "effort" ? [] : e.intensity.values.map((t) => ({
    value: t,
    label: lg[t] || t
  }));
}
function ci(e, t, n, r = "REASONING_CAPABILITY_UNSUPPORTED") {
  return {
    ...e,
    profileId: t.profileId,
    valid: !1,
    error: n,
    code: r
  };
}
function yg(e, t) {
  const n = { ...e };
  return delete n.effort, delete n.budgetTokens, t.intensity?.kind === "effort" ? {
    ...n,
    ...e.effort ? { effort: e.effort } : {}
  } : n;
}
function To(e = {}, t = {}) {
  const n = Vs(e), r = Ls(t), o = t?.output === "show" || t?.output === "hide" ? t.output : null, i = yg({
    ...r,
    output: r.mode === "off" ? "hide" : o || (n.outputModes.includes("show") ? "show" : "hide")
  }, n);
  if (!n.outputModes.includes(i.output)) return ci(i, n, "当前任务要求返回 Reasoning 内容，但所选模型不支持。");
  if (!n.modes.includes(i.mode)) return ci(i, n, i.mode === "off" ? "当前模型不支持显式关闭 Reasoning。请选择“跟随模型默认”。" : n.unsupportedReason || "当前模型不支持显式开启 Reasoning。");
  if (i.mode !== "on") return {
    ...i,
    profileId: n.profileId,
    valid: !0
  };
  if (n.intensity.kind === "effort") {
    const s = i.effort || n.intensity.defaultValue;
    return n.intensity.values.includes(s) ? {
      ...i,
      effort: s,
      profileId: n.profileId,
      valid: !0
    } : ci(i, n, `当前模型不支持 Reasoning 强度“${s}”。`, "REASONING_CONFIG_INVALID");
  }
  return {
    ...i,
    profileId: n.profileId,
    valid: !0
  };
}
var vg = class extends Error {
  constructor(e = {}) {
    super(e.error || "当前模型不支持所选 Reasoning 配置。"), this.name = "ReasoningCapabilityError", this.code = e.code || "REASONING_CAPABILITY_UNSUPPORTED", this.profileId = e.profileId || "unsupported", this.reasoning = e;
  }
};
function Ed(e = {}) {
  if (e.valid === !1) throw new vg(e);
  return e;
}
function j(e = "", t = {}, n = {}, r = {}) {
  return Ed(To({
    provider: e,
    baseUrl: t.baseUrl,
    model: t.model,
    maxTokens: r.maxTokens ?? t.maxTokens
  }, n));
}
function gr(e = {}, t = {}) {
  return Vs(e).temperatureOmitModes.includes(t.mode);
}
var oR = 900 * 1e3, iR = Object.freeze([{
  value: "native",
  label: "原生 Tool Calling"
}, {
  value: "tagged-json",
  label: "Tagged JSON 兼容模式"
}]), Ag = Object.freeze([
  {
    value: "openai-responses",
    label: "OpenAI Responses"
  },
  {
    value: "openai-compatible",
    label: "OpenAI 兼容"
  },
  {
    value: "sillytavern-openai-compatible",
    label: "酒馆 OpenAI 兼容"
  },
  {
    value: "sillytavern-claude",
    label: "酒馆 Claude"
  },
  {
    value: "sillytavern-google",
    label: "酒馆 Google AI"
  },
  {
    value: "sillytavern-vertex",
    label: "酒馆 Vertex AI"
  },
  {
    value: "anthropic",
    label: "Anthropic"
  },
  {
    value: "google",
    label: "Google AI"
  }
]);
function sR(e = "") {
  return e === "sillytavern-openai-compatible" || e === "sillytavern-claude" || e === "sillytavern-google" || e === "sillytavern-vertex";
}
function Cd(e, t = 1) {
  const n = typeof e == "string" && !e.trim() ? t : e, r = Number(n);
  return Number.isFinite(r) ? Math.max(0, Math.min(2, r)) : Cd(t, 1);
}
function Ui(e = {}) {
  return e.sendTemperature !== !1;
}
function za(e = {}) {
  return Ui(e) ? Cd(e.temperature, 1) : void 0;
}
function aR(e = "", t = {}) {
  return t && typeof t == "object" && t[e] ? t[e] : Ag.find((n) => n.value === e)?.label || e || "未配置";
}
function lR(e = {}) {
  const t = String(e.provider || "").trim();
  return t === "openai-compatible" || t === "sillytavern-openai-compatible" ? e.toolMode === "tagged-json" ? "Tagged JSON 兼容模式" : "原生 Tool Calling" : "Provider 原生工具";
}
function uR(e = {}, t = {}) {
  const n = sg(e || {});
  if (t.role === "delegate" && n.delegateConfig) {
    const d = n.delegateConfig.provider || "openai-compatible", h = (n.delegateConfig.modelConfigs || jt())[d] || jt()[d] || {}, f = {
      provider: d,
      baseUrl: String(h.baseUrl || ""),
      model: String(h.model || ""),
      maxTokens: Gn(h.maxTokens)
    };
    return {
      currentPresetName: String(n.delegatePresetName || n.currentPresetName || ""),
      provider: d,
      baseUrl: String(h.baseUrl || ""),
      model: String(h.model || ""),
      apiKey: String(h.apiKey || ""),
      ...$i(d) ? { modelListAuth: h.modelListAuth } : {},
      ...vo(n),
      temperature: za(h),
      sendTemperature: Ui(h),
      maxTokens: Gn(h.maxTokens),
      timeoutMs: Number(t.timeoutMs) || 9e5,
      toolMode: h.toolMode || "native",
      reasoning: To(f, h.reasoning),
      ...d === "sillytavern-vertex" ? {
        vertexAuthMode: h.vertexAuthMode || "full",
        vertexRegion: h.vertexRegion || "us-central1",
        serviceAccountJson: String(h.serviceAccountJson || "")
      } : {}
    };
  }
  const r = ut(t.presetName || (t.role === "delegate" ? n.delegatePresetName : n.currentPresetName) || "默认"), o = n.presets?.[r] ? r : n.presets?.[n.currentPresetName] ? n.currentPresetName : Us, i = n.presets?.[o] || Et(), s = i.provider || n.provider || "openai-compatible", u = (i.modelConfigs || n.modelConfigs || jt())[s] || jt()[s] || {}, c = {
    provider: s,
    baseUrl: String(u.baseUrl || ""),
    model: String(u.model || ""),
    maxTokens: Gn(u.maxTokens)
  };
  return {
    currentPresetName: String(o || ""),
    provider: s,
    baseUrl: String(u.baseUrl || ""),
    model: String(u.model || ""),
    apiKey: String(u.apiKey || ""),
    ...$i(s) ? { modelListAuth: u.modelListAuth } : {},
    ...vo(n),
    temperature: za(u),
    sendTemperature: Ui(u),
    maxTokens: Gn(u.maxTokens),
    timeoutMs: Number(t.timeoutMs) || 9e5,
    toolMode: u.toolMode || "native",
    reasoning: To(c, u.reasoning),
    ...s === "sillytavern-vertex" ? {
      vertexAuthMode: u.vertexAuthMode || "full",
      vertexRegion: u.vertexRegion || "us-central1",
      serviceAccountJson: String(u.serviceAccountJson || "")
    } : {}
  };
}
function D(e, t, n, r, o) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !o) throw new TypeError("Private accessor was defined without a setter");
  if (typeof t == "function" ? e !== t || !o : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? o.call(e, n) : o ? o.value = n : t.set(e, n), n;
}
function T(e, t, n, r) {
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof t == "function" ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return n === "m" ? r : n === "a" ? r.call(e) : r ? r.value : t.get(e);
}
var wd = function() {
  const { crypto: e } = globalThis;
  if (e?.randomUUID)
    return wd = e.randomUUID.bind(e), e.randomUUID();
  const t = new Uint8Array(1), n = e ? () => e.getRandomValues(t)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (r) => (+r ^ n() & 15 >> +r / 4).toString(16));
};
function lr(e) {
  return typeof e == "object" && e !== null && ("name" in e && e.name === "AbortError" || "message" in e && String(e.message).includes("FetchRequestCanceledException"));
}
var Fi = (e) => {
  if (e instanceof Error) return e;
  if (typeof e == "object" && e !== null) {
    try {
      if (Object.prototype.toString.call(e) === "[object Error]") {
        const t = new Error(e.message, e.cause ? { cause: e.cause } : {});
        return e.stack && (t.stack = e.stack), e.cause && !t.cause && (t.cause = e.cause), e.name && (t.name = e.name), t;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(e));
    } catch {
    }
  }
  return new Error(e);
}, B = class extends Error {
}, be = class Oi extends B {
  constructor(t, n, r, o, i) {
    super(`${Oi.makeMessage(t, n, r)}`), this.status = t, this.headers = o, this.requestID = o?.get("request-id"), this.error = n, this.type = i ?? null;
  }
  static makeMessage(t, n, r) {
    const o = n?.message ? typeof n.message == "string" ? n.message : JSON.stringify(n.message) : n ? JSON.stringify(n) : r;
    return t && o ? `${t} ${o}` : t ? `${t} status code (no body)` : o || "(no status code or body)";
  }
  static generate(t, n, r, o) {
    if (!t || !o) return new Ho({
      message: r,
      cause: Fi(n)
    });
    const i = n, s = i?.error?.type;
    return t === 400 ? new bd(t, i, r, o, s) : t === 401 ? new Rd(t, i, r, o, s) : t === 403 ? new Pd(t, i, r, o, s) : t === 404 ? new Md(t, i, r, o, s) : t === 409 ? new xd(t, i, r, o, s) : t === 422 ? new Nd(t, i, r, o, s) : t === 429 ? new kd(t, i, r, o, s) : t >= 500 ? new Dd(t, i, r, o, s) : new Oi(t, i, r, o, s);
  }
}, Ve = class extends be {
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}, Ho = class extends be {
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}, Id = class extends Ho {
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}, bd = class extends be {
}, Rd = class extends be {
}, Pd = class extends be {
}, Md = class extends be {
}, xd = class extends be {
}, Nd = class extends be {
}, kd = class extends be {
}, Dd = class extends be {
}, Tg = /^[a-z][a-z0-9+.-]*:/i, Sg = (e) => Tg.test(e), Gi = (e) => (Gi = Array.isArray, Gi(e)), Ya = Gi;
function Bi(e) {
  return typeof e != "object" ? {} : e ?? {};
}
function Xa(e) {
  if (!e) return !0;
  for (const t in e) return !1;
  return !0;
}
function Eg(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var Cg = (e, t) => {
  if (typeof t != "number" || !Number.isInteger(t)) throw new B(`${e} must be an integer`);
  if (t < 0) throw new B(`${e} must be a positive integer`);
  return t;
}, $d = (e) => {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}, wg = (e) => new Promise((t) => setTimeout(t, e)), zt = "0.91.1", Ig = () => typeof window < "u" && typeof window.document < "u" && typeof navigator < "u";
function bg() {
  return typeof Deno < "u" && Deno.build != null ? "deno" : typeof EdgeRuntime < "u" ? "edge" : Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]" ? "node" : "unknown";
}
var Rg = () => {
  const e = bg();
  if (e === "deno") return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": zt,
    "X-Stainless-OS": Za(Deno.build.os),
    "X-Stainless-Arch": Qa(Deno.build.arch),
    "X-Stainless-Runtime": "deno",
    "X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : Deno.version?.deno ?? "unknown"
  };
  if (typeof EdgeRuntime < "u") return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": zt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": `other:${EdgeRuntime}`,
    "X-Stainless-Runtime": "edge",
    "X-Stainless-Runtime-Version": globalThis.process.version
  };
  if (e === "node") return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": zt,
    "X-Stainless-OS": Za(globalThis.process.platform ?? "unknown"),
    "X-Stainless-Arch": Qa(globalThis.process.arch ?? "unknown"),
    "X-Stainless-Runtime": "node",
    "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
  };
  const t = Pg();
  return t ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": zt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${t.browser}`,
    "X-Stainless-Runtime-Version": t.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": zt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
};
function Pg() {
  if (typeof navigator > "u" || !navigator) return null;
  for (const { key: e, pattern: t } of [
    {
      key: "edge",
      pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "ie",
      pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "ie",
      pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "chrome",
      pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "firefox",
      pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "safari",
      pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
    }
  ]) {
    const n = t.exec(navigator.userAgent);
    if (n) return {
      browser: e,
      version: `${n[1] || 0}.${n[2] || 0}.${n[3] || 0}`
    };
  }
  return null;
}
var Qa = (e) => e === "x32" ? "x32" : e === "x86_64" || e === "x64" ? "x64" : e === "arm" ? "arm" : e === "aarch64" || e === "arm64" ? "arm64" : e ? `other:${e}` : "unknown", Za = (e) => (e = e.toLowerCase(), e.includes("ios") ? "iOS" : e === "android" ? "Android" : e === "darwin" ? "MacOS" : e === "win32" ? "Windows" : e === "freebsd" ? "FreeBSD" : e === "openbsd" ? "OpenBSD" : e === "linux" ? "Linux" : e ? `Other:${e}` : "Unknown"), ja, Mg = () => ja ?? (ja = Rg());
function xg() {
  if (typeof fetch < "u") return fetch;
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function Ld(...e) {
  const t = globalThis.ReadableStream;
  if (typeof t > "u") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new t(...e);
}
function Ud(e) {
  let t = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
  return Ld({
    start() {
    },
    async pull(n) {
      const { done: r, value: o } = await t.next();
      r ? n.close() : n.enqueue(o);
    },
    async cancel() {
      await t.return?.();
    }
  });
}
function Js(e) {
  if (e[Symbol.asyncIterator]) return e;
  const t = e.getReader();
  return {
    async next() {
      try {
        const n = await t.read();
        return n?.done && t.releaseLock(), n;
      } catch (n) {
        throw t.releaseLock(), n;
      }
    },
    async return() {
      const n = t.cancel();
      return t.releaseLock(), await n, {
        done: !0,
        value: void 0
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function Ng(e) {
  if (e === null || typeof e != "object") return;
  if (e[Symbol.asyncIterator]) {
    await e[Symbol.asyncIterator]().return?.();
    return;
  }
  const t = e.getReader(), n = t.cancel();
  t.releaseLock(), await n;
}
var kg = ({ headers: e, body: t }) => ({
  bodyHeaders: { "content-type": "application/json" },
  body: JSON.stringify(t)
});
function Dg(e) {
  return Object.entries(e).filter(([t, n]) => typeof n < "u").map(([t, n]) => {
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") return `${encodeURIComponent(t)}=${encodeURIComponent(n)}`;
    if (n === null) return `${encodeURIComponent(t)}=`;
    throw new B(`Cannot stringify type ${typeof n}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
  }).join("&");
}
function $g(e) {
  let t = 0;
  for (const o of e) t += o.length;
  const n = new Uint8Array(t);
  let r = 0;
  for (const o of e)
    n.set(o, r), r += o.length;
  return n;
}
var el;
function Ks(e) {
  let t;
  return (el ?? (t = new globalThis.TextEncoder(), el = t.encode.bind(t)))(e);
}
var tl;
function nl(e) {
  let t;
  return (tl ?? (t = new globalThis.TextDecoder(), tl = t.decode.bind(t)))(e);
}
var Se, Ee, _r = class {
  constructor() {
    Se.set(this, void 0), Ee.set(this, void 0), D(this, Se, new Uint8Array(), "f"), D(this, Ee, null, "f");
  }
  decode(e) {
    if (e == null) return [];
    const t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? Ks(e) : e;
    D(this, Se, $g([T(this, Se, "f"), t]), "f");
    const n = [];
    let r;
    for (; (r = Lg(T(this, Se, "f"), T(this, Ee, "f"))) != null; ) {
      if (r.carriage && T(this, Ee, "f") == null) {
        D(this, Ee, r.index, "f");
        continue;
      }
      if (T(this, Ee, "f") != null && (r.index !== T(this, Ee, "f") + 1 || r.carriage)) {
        n.push(nl(T(this, Se, "f").subarray(0, T(this, Ee, "f") - 1))), D(this, Se, T(this, Se, "f").subarray(T(this, Ee, "f")), "f"), D(this, Ee, null, "f");
        continue;
      }
      const o = T(this, Ee, "f") !== null ? r.preceding - 1 : r.preceding, i = nl(T(this, Se, "f").subarray(0, o));
      n.push(i), D(this, Se, T(this, Se, "f").subarray(r.index), "f"), D(this, Ee, null, "f");
    }
    return n;
  }
  flush() {
    return T(this, Se, "f").length ? this.decode(`
`) : [];
  }
};
Se = /* @__PURE__ */ new WeakMap(), Ee = /* @__PURE__ */ new WeakMap();
_r.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
_r.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function Lg(e, t) {
  for (let o = t ?? 0; o < e.length; o++) {
    if (e[o] === 10) return {
      preceding: o,
      index: o + 1,
      carriage: !1
    };
    if (e[o] === 13) return {
      preceding: o,
      index: o + 1,
      carriage: !0
    };
  }
  return null;
}
function Ug(e) {
  for (let r = 0; r < e.length - 1; r++) {
    if (e[r] === 10 && e[r + 1] === 10 || e[r] === 13 && e[r + 1] === 13) return r + 2;
    if (e[r] === 13 && e[r + 1] === 10 && r + 3 < e.length && e[r + 2] === 13 && e[r + 3] === 10) return r + 4;
  }
  return -1;
}
var So = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
}, rl = (e, t, n) => {
  if (e) {
    if (Eg(So, e)) return e;
    he(n).warn(`${t} was set to ${JSON.stringify(e)}, expected one of ${JSON.stringify(Object.keys(So))}`);
  }
};
function Bn() {
}
function Pr(e, t, n) {
  return !t || So[e] > So[n] ? Bn : t[e].bind(t);
}
var Fg = {
  error: Bn,
  warn: Bn,
  info: Bn,
  debug: Bn
}, ol = /* @__PURE__ */ new WeakMap();
function he(e) {
  const t = e.logger, n = e.logLevel ?? "off";
  if (!t) return Fg;
  const r = ol.get(t);
  if (r && r[0] === n) return r[1];
  const o = {
    error: Pr("error", t, n),
    warn: Pr("warn", t, n),
    info: Pr("info", t, n),
    debug: Pr("debug", t, n)
  };
  return ol.set(t, [n, o]), o;
}
var xt = (e) => (e.options && (e.options = { ...e.options }, delete e.options.headers), e.headers && (e.headers = Object.fromEntries((e.headers instanceof Headers ? [...e.headers] : Object.entries(e.headers)).map(([t, n]) => [t, t.toLowerCase() === "x-api-key" || t.toLowerCase() === "authorization" || t.toLowerCase() === "cookie" || t.toLowerCase() === "set-cookie" ? "***" : n]))), "retryOfRequestLogID" in e && (e.retryOfRequestLogID && (e.retryOf = e.retryOfRequestLogID), delete e.retryOfRequestLogID), e), An, ur = class qn {
  constructor(t, n, r) {
    this.iterator = t, An.set(this, void 0), this.controller = n, D(this, An, r, "f");
  }
  static fromSSEResponse(t, n, r) {
    let o = !1;
    const i = r ? he(r) : console;
    async function* s() {
      if (o) throw new B("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      o = !0;
      let u = !1;
      try {
        for await (const c of Og(t, n)) {
          if (c.event === "completion") try {
            yield JSON.parse(c.data);
          } catch (d) {
            throw i.error("Could not parse message into JSON:", c.data), i.error("From chunk:", c.raw), d;
          }
          if (c.event === "message_start" || c.event === "message_delta" || c.event === "message_stop" || c.event === "content_block_start" || c.event === "content_block_delta" || c.event === "content_block_stop" || c.event === "message" || c.event === "user.message" || c.event === "user.interrupt" || c.event === "user.tool_confirmation" || c.event === "user.custom_tool_result" || c.event === "agent.message" || c.event === "agent.thinking" || c.event === "agent.tool_use" || c.event === "agent.tool_result" || c.event === "agent.mcp_tool_use" || c.event === "agent.mcp_tool_result" || c.event === "agent.custom_tool_use" || c.event === "agent.thread_context_compacted" || c.event === "session.status_running" || c.event === "session.status_idle" || c.event === "session.status_rescheduled" || c.event === "session.status_terminated" || c.event === "session.error" || c.event === "session.deleted" || c.event === "span.model_request_start" || c.event === "span.model_request_end") try {
            yield JSON.parse(c.data);
          } catch (d) {
            throw i.error("Could not parse message into JSON:", c.data), i.error("From chunk:", c.raw), d;
          }
          if (c.event !== "ping" && c.event === "error") {
            const d = $d(c.data) ?? c.data, h = d?.error?.type;
            throw new be(void 0, d, void 0, t.headers, h);
          }
        }
        u = !0;
      } catch (c) {
        if (lr(c)) return;
        throw c;
      } finally {
        u || n.abort();
      }
    }
    return new qn(s, n, r);
  }
  static fromReadableStream(t, n, r) {
    let o = !1;
    async function* i() {
      const u = new _r(), c = Js(t);
      for await (const d of c) for (const h of u.decode(d)) yield h;
      for (const d of u.flush()) yield d;
    }
    async function* s() {
      if (o) throw new B("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      o = !0;
      let u = !1;
      try {
        for await (const c of i())
          u || c && (yield JSON.parse(c));
        u = !0;
      } catch (c) {
        if (lr(c)) return;
        throw c;
      } finally {
        u || n.abort();
      }
    }
    return new qn(s, n, r);
  }
  [(An = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return this.iterator();
  }
  tee() {
    const t = [], n = [], r = this.iterator(), o = (i) => ({ next: () => {
      if (i.length === 0) {
        const s = r.next();
        t.push(s), n.push(s);
      }
      return i.shift();
    } });
    return [new qn(() => o(t), this.controller, T(this, An, "f")), new qn(() => o(n), this.controller, T(this, An, "f"))];
  }
  toReadableStream() {
    const t = this;
    let n;
    return Ld({
      async start() {
        n = t[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          const { value: o, done: i } = await n.next();
          if (i) return r.close();
          const s = Ks(JSON.stringify(o) + `
`);
          r.enqueue(s);
        } catch (o) {
          r.error(o);
        }
      },
      async cancel() {
        await n.return?.();
      }
    });
  }
};
async function* Og(e, t) {
  if (!e.body)
    throw t.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new B("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new B("Attempted to iterate over a response with no body");
  const n = new Bg(), r = new _r(), o = Js(e.body);
  for await (const i of Gg(o)) for (const s of r.decode(i)) {
    const u = n.decode(s);
    u && (yield u);
  }
  for (const i of r.flush()) {
    const s = n.decode(i);
    s && (yield s);
  }
}
async function* Gg(e) {
  let t = new Uint8Array();
  for await (const n of e) {
    if (n == null) continue;
    const r = n instanceof ArrayBuffer ? new Uint8Array(n) : typeof n == "string" ? Ks(n) : n;
    let o = new Uint8Array(t.length + r.length);
    o.set(t), o.set(r, t.length), t = o;
    let i;
    for (; (i = Ug(t)) !== -1; )
      yield t.slice(0, i), t = t.slice(i);
  }
  t.length > 0 && (yield t);
}
var Bg = class {
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length) return null;
      const o = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], o;
    }
    if (this.chunks.push(e), e.startsWith(":")) return null;
    let [t, n, r] = qg(e, ":");
    return r.startsWith(" ") && (r = r.substring(1)), t === "event" ? this.event = r : t === "data" && this.data.push(r), null;
  }
};
function qg(e, t) {
  const n = e.indexOf(t);
  return n !== -1 ? [
    e.substring(0, n),
    t,
    e.substring(n + t.length)
  ] : [
    e,
    "",
    ""
  ];
}
async function Fd(e, t) {
  const { response: n, requestLogID: r, retryOfRequestLogID: o, startTime: i } = t, s = await (async () => {
    if (t.options.stream)
      return he(e).debug("response", n.status, n.url, n.headers, n.body), t.options.__streamClass ? t.options.__streamClass.fromSSEResponse(n, t.controller) : ur.fromSSEResponse(n, t.controller);
    if (n.status === 204) return null;
    if (t.options.__binaryResponse) return n;
    const u = n.headers.get("content-type")?.split(";")[0]?.trim();
    return u?.includes("application/json") || u?.endsWith("+json") ? n.headers.get("content-length") === "0" ? void 0 : Od(await n.json(), n) : await n.text();
  })();
  return he(e).debug(`[${r}] response parsed`, xt({
    retryOfRequestLogID: o,
    url: n.url,
    status: n.status,
    body: s,
    durationMs: Date.now() - i
  })), s;
}
function Od(e, t) {
  return !e || typeof e != "object" || Array.isArray(e) ? e : Object.defineProperty(e, "_request_id", {
    value: t.headers.get("request-id"),
    enumerable: !1
  });
}
var Hn, Gd = class Bd extends Promise {
  constructor(t, n, r = Fd) {
    super((o) => {
      o(null);
    }), this.responsePromise = n, this.parseResponse = r, Hn.set(this, void 0), D(this, Hn, t, "f");
  }
  _thenUnwrap(t) {
    return new Bd(T(this, Hn, "f"), this.responsePromise, async (n, r) => Od(t(await this.parseResponse(n, r), r), r.response));
  }
  asResponse() {
    return this.responsePromise.then((t) => t.response);
  }
  async withResponse() {
    const [t, n] = await Promise.all([this.parse(), this.asResponse()]);
    return {
      data: t,
      response: n,
      request_id: n.headers.get("request-id")
    };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then((t) => this.parseResponse(T(this, Hn, "f"), t))), this.parsedPromise;
  }
  then(t, n) {
    return this.parse().then(t, n);
  }
  catch(t) {
    return this.parse().catch(t);
  }
  finally(t) {
    return this.parse().finally(t);
  }
};
Hn = /* @__PURE__ */ new WeakMap();
var Mr, qd = class {
  constructor(e, t, n, r) {
    Mr.set(this, void 0), D(this, Mr, e, "f"), this.options = r, this.response = t, this.body = n;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageRequestOptions() != null : !1;
  }
  async getNextPage() {
    const e = this.nextPageRequestOptions();
    if (!e) throw new B("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    return await T(this, Mr, "f").requestAPIList(this.constructor, e);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(Mr = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const e of this.iterPages()) for (const t of e.getPaginatedItems()) yield t;
  }
}, Hg = class extends Gd {
  constructor(e, t, n) {
    super(e, t, async (r, o) => new n(r, o.response, await Fd(r, o), o.options));
  }
  async *[Symbol.asyncIterator]() {
    const e = await this;
    for await (const t of e) yield t;
  }
}, yr = class extends qd {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.has_more = n.has_more || !1, this.first_id = n.first_id || null, this.last_id = n.last_id || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    if (this.options.query?.before_id) {
      const t = this.first_id;
      return t ? {
        ...this.options,
        query: {
          ...Bi(this.options.query),
          before_id: t
        }
      } : null;
    }
    const e = this.last_id;
    return e ? {
      ...this.options,
      query: {
        ...Bi(this.options.query),
        after_id: e
      }
    } : null;
  }
}, Ae = class extends qd {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.next_page = n.next_page || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  nextPageRequestOptions() {
    const e = this.next_page;
    return e ? {
      ...this.options,
      query: {
        ...Bi(this.options.query),
        page: e
      }
    } : null;
  }
}, Hd = () => {
  if (typeof File > "u") {
    const { process: e } = globalThis, t = typeof e?.versions?.node == "string" && parseInt(e.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (t ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
};
function ln(e, t, n) {
  return Hd(), new File(e, t ?? "unknown_file", n);
}
function oo(e, t) {
  const n = typeof e == "object" && e !== null && ("name" in e && e.name && String(e.name) || "url" in e && e.url && String(e.url) || "filename" in e && e.filename && String(e.filename) || "path" in e && e.path && String(e.path)) || "";
  return t ? n.split(/[\\/]/).pop() || void 0 : n;
}
var Vd = (e) => e != null && typeof e == "object" && typeof e[Symbol.asyncIterator] == "function", Ws = async (e, t, n = !0) => ({
  ...e,
  body: await Jg(e.body, t, n)
}), il = /* @__PURE__ */ new WeakMap();
function Vg(e) {
  const t = typeof e == "function" ? e : e.fetch, n = il.get(t);
  if (n) return n;
  const r = (async () => {
    try {
      const o = "Response" in t ? t.Response : (await t("data:,")).constructor, i = new FormData();
      return i.toString() !== await new o(i).text();
    } catch {
      return !0;
    }
  })();
  return il.set(t, r), r;
}
var Jg = async (e, t, n = !0) => {
  if (!await Vg(t)) throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  const r = new FormData();
  return await Promise.all(Object.entries(e || {}).map(([o, i]) => qi(r, o, i, n))), r;
}, Kg = (e) => e instanceof Blob && "name" in e, qi = async (e, t, n, r) => {
  if (n !== void 0) {
    if (n == null) throw new TypeError(`Received null for "${t}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") e.append(t, String(n));
    else if (n instanceof Response) {
      let o = {};
      const i = n.headers.get("Content-Type");
      i && (o = { type: i }), e.append(t, ln([await n.blob()], oo(n, r), o));
    } else if (Vd(n)) e.append(t, ln([await new Response(Ud(n)).blob()], oo(n, r)));
    else if (Kg(n)) e.append(t, ln([n], oo(n, r), { type: n.type }));
    else if (Array.isArray(n)) await Promise.all(n.map((o) => qi(e, t + "[]", o, r)));
    else if (typeof n == "object") await Promise.all(Object.entries(n).map(([o, i]) => qi(e, `${t}[${o}]`, i, r)));
    else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${n} instead`);
  }
}, Jd = (e) => e != null && typeof e == "object" && typeof e.size == "number" && typeof e.type == "string" && typeof e.text == "function" && typeof e.slice == "function" && typeof e.arrayBuffer == "function", Wg = (e) => e != null && typeof e == "object" && typeof e.name == "string" && typeof e.lastModified == "number" && Jd(e), zg = (e) => e != null && typeof e == "object" && typeof e.url == "string" && typeof e.blob == "function";
async function Yg(e, t, n) {
  if (Hd(), e = await e, t || (t = oo(e, !0)), Wg(e))
    return e instanceof File && t == null && n == null ? e : ln([await e.arrayBuffer()], t ?? e.name, {
      type: e.type,
      lastModified: e.lastModified,
      ...n
    });
  if (zg(e)) {
    const o = await e.blob();
    return t || (t = new URL(e.url).pathname.split(/[\\/]/).pop()), ln(await Hi(o), t, n);
  }
  const r = await Hi(e);
  if (!n?.type) {
    const o = r.find((i) => typeof i == "object" && "type" in i && i.type);
    typeof o == "string" && (n = {
      ...n,
      type: o
    });
  }
  return ln(r, t, n);
}
async function Hi(e) {
  let t = [];
  if (typeof e == "string" || ArrayBuffer.isView(e) || e instanceof ArrayBuffer) t.push(e);
  else if (Jd(e)) t.push(e instanceof Blob ? e : await e.arrayBuffer());
  else if (Vd(e)) for await (const n of e) t.push(...await Hi(n));
  else {
    const n = e?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof e}${n ? `; constructor: ${n}` : ""}${Xg(e)}`);
  }
  return t;
}
function Xg(e) {
  return typeof e != "object" || e === null ? "" : `; props: [${Object.getOwnPropertyNames(e).map((t) => `"${t}"`).join(", ")}]`;
}
var Z = class {
  constructor(e) {
    this._client = e;
  }
}, Kd = /* @__PURE__ */ Symbol.for("brand.privateNullableHeaders");
function* Qg(e) {
  if (!e) return;
  if (Kd in e) {
    const { values: r, nulls: o } = e;
    yield* r.entries();
    for (const i of o) yield [i, null];
    return;
  }
  let t = !1, n;
  e instanceof Headers ? n = e.entries() : Ya(e) ? n = e : (t = !0, n = Object.entries(e ?? {}));
  for (let r of n) {
    const o = r[0];
    if (typeof o != "string") throw new TypeError("expected header name to be a string");
    const i = Ya(r[1]) ? r[1] : [r[1]];
    let s = !1;
    for (const u of i)
      u !== void 0 && (t && !s && (s = !0, yield [o, null]), yield [o, u]);
  }
}
var R = (e) => {
  const t = new Headers(), n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const [i, s] of Qg(r)) {
      const u = i.toLowerCase();
      o.has(u) || (t.delete(i), o.add(u)), s === null ? (t.delete(i), n.add(u)) : (t.append(i, s), n.delete(u));
    }
  }
  return {
    [Kd]: !0,
    values: t,
    nulls: n
  };
};
function Wd(e) {
  return e.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null)), Zg = (e = Wd) => function(n, ...r) {
  if (n.length === 1) return n[0];
  let o = !1;
  const i = [], s = n.reduce((h, f, p) => {
    /[?#]/.test(f) && (o = !0);
    const m = r[p];
    let g = (o ? encodeURIComponent : e)("" + m);
    return p !== r.length && (m == null || typeof m == "object" && m.toString === Object.getPrototypeOf(Object.getPrototypeOf(m.hasOwnProperty ?? sl) ?? sl)?.toString) && (g = m + "", i.push({
      start: h.length + f.length,
      length: g.length,
      error: `Value of type ${Object.prototype.toString.call(m).slice(8, -1)} is not a valid path parameter`
    })), h + f + (p === r.length ? "" : g);
  }, ""), u = s.split(/[?#]/, 1)[0], c = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
  let d;
  for (; (d = c.exec(u)) !== null; ) i.push({
    start: d.index,
    length: d[0].length,
    error: `Value "${d[0]}" can't be safely passed as a path parameter`
  });
  if (i.sort((h, f) => h.start - f.start), i.length > 0) {
    let h = 0;
    const f = i.reduce((p, m) => {
      const g = " ".repeat(m.start - h), _ = "^".repeat(m.length);
      return h = m.start + m.length, p + g + _;
    }, "");
    throw new B(`Path parameters result in path with invalid segments:
${i.map((p) => p.error).join(`
`)}
${s}
${f}`);
  }
  return s;
}, U = /* @__PURE__ */ Zg(Wd), zd = class extends Z {
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/environments?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/environments/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/environments/${e}?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/environments?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/environments/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  archive(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/environments/${e}/archive?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
}, nr = /* @__PURE__ */ Symbol("anthropic.sdk.stainlessHelper");
function io(e) {
  return typeof e == "object" && e !== null && nr in e;
}
function Yd(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (e)
    for (const r of e) io(r) && n.add(r[nr]);
  if (t) {
    for (const r of t)
      if (io(r) && n.add(r[nr]), Array.isArray(r.content))
        for (const o of r.content) io(o) && n.add(o[nr]);
  }
  return Array.from(n);
}
function Xd(e, t) {
  const n = Yd(e, t);
  return n.length === 0 ? {} : { "x-stainless-helper": n.join(", ") };
}
function jg(e) {
  return io(e) ? { "x-stainless-helper": e[nr] } : {};
}
var Qd = class extends Z {
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/files?beta=true", yr, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/files/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString() }, n?.headers])
    });
  }
  download(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/files/${e}/content?beta=true`, {
      ...n,
      headers: R([{
        "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString(),
        Accept: "application/binary"
      }, n?.headers]),
      __binaryResponse: !0
    });
  }
  retrieveMetadata(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/files/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString() }, n?.headers])
    });
  }
  upload(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/files?beta=true", Ws({
      body: r,
      ...t,
      headers: R([
        { "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString() },
        jg(r.file),
        t?.headers
      ])
    }, this._client));
  }
}, Zd = class extends Z {
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/models/${e}?beta=true`, {
      ...n,
      headers: R([{ ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/models?beta=true", yr, {
      query: r,
      ...t,
      headers: R([{ ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 }, t?.headers])
    });
  }
}, jd = class extends Z {
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/user_profiles?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "user-profiles-2026-03-24"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/user_profiles/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "user-profiles-2026-03-24"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/user_profiles/${e}?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "user-profiles-2026-03-24"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/user_profiles?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "user-profiles-2026-03-24"].toString() }, t?.headers])
    });
  }
  createEnrollmentURL(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/user_profiles/${e}/enrollment_url?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "user-profiles-2026-03-24"].toString() }, n?.headers])
    });
  }
}, ef = class extends Z {
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/agents/${e}/versions?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
}, zs = class extends Z {
  constructor() {
    super(...arguments), this.versions = new ef(this._client);
  }
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/agents?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.get(U`/v1/agents/${e}?beta=true`, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/agents/${e}?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/agents?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  archive(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/agents/${e}/archive?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
};
zs.Versions = ef;
var tf = class extends Z {
  create(e, t, n) {
    const { view: r, betas: o, ...i } = t;
    return this._client.post(U`/v1/memory_stores/${e}/memories?beta=true`, {
      query: { view: r },
      body: i,
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  retrieve(e, t, n) {
    const { memory_store_id: r, betas: o, ...i } = t;
    return this._client.get(U`/v1/memory_stores/${r}/memories/${e}?beta=true`, {
      query: i,
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { memory_store_id: r, view: o, betas: i, ...s } = t;
    return this._client.post(U`/v1/memory_stores/${r}/memories/${e}?beta=true`, {
      query: { view: o },
      body: s,
      ...n,
      headers: R([{ "anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/memory_stores/${e}/memories?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  delete(e, t, n) {
    const { memory_store_id: r, expected_content_sha256: o, betas: i } = t;
    return this._client.delete(U`/v1/memory_stores/${r}/memories/${e}?beta=true`, {
      query: { expected_content_sha256: o },
      ...n,
      headers: R([{ "anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
}, nf = class extends Z {
  retrieve(e, t, n) {
    const { memory_store_id: r, betas: o, ...i } = t;
    return this._client.get(U`/v1/memory_stores/${r}/memory_versions/${e}?beta=true`, {
      query: i,
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/memory_stores/${e}/memory_versions?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  redact(e, t, n) {
    const { memory_store_id: r, betas: o } = t;
    return this._client.post(U`/v1/memory_stores/${r}/memory_versions/${e}/redact?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
}, Vo = class extends Z {
  constructor() {
    super(...arguments), this.memories = new tf(this._client), this.memoryVersions = new nf(this._client);
  }
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/memory_stores?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/memory_stores/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/memory_stores/${e}?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/memory_stores?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/memory_stores/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  archive(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/memory_stores/${e}/archive?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
};
Vo.Memories = tf;
Vo.MemoryVersions = nf;
var rf = {
  "claude-opus-4-20250514": 8192,
  "claude-opus-4-0": 8192,
  "claude-4-opus-20250514": 8192,
  "anthropic.claude-opus-4-20250514-v1:0": 8192,
  "claude-opus-4@20250514": 8192,
  "claude-opus-4-1-20250805": 8192,
  "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
  "claude-opus-4-1@20250805": 8192
};
function of(e) {
  return e?.output_format ?? e?.output_config?.format;
}
function al(e, t, n) {
  const r = of(t);
  return !t || !("parse" in (r ?? {})) ? {
    ...e,
    content: e.content.map((o) => {
      if (o.type === "text") {
        const i = Object.defineProperty({ ...o }, "parsed_output", {
          value: null,
          enumerable: !1
        });
        return Object.defineProperty(i, "parsed", {
          get() {
            return n.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), null;
          },
          enumerable: !1
        });
      }
      return o;
    }),
    parsed_output: null
  } : sf(e, t, n);
}
function sf(e, t, n) {
  let r = null;
  const o = e.content.map((i) => {
    if (i.type === "text") {
      const s = e_(t, i.text);
      r === null && (r = s);
      const u = Object.defineProperty({ ...i }, "parsed_output", {
        value: s,
        enumerable: !1
      });
      return Object.defineProperty(u, "parsed", {
        get() {
          return n.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), s;
        },
        enumerable: !1
      });
    }
    return i;
  });
  return {
    ...e,
    content: o,
    parsed_output: r
  };
}
function e_(e, t) {
  const n = of(e);
  if (n?.type !== "json_schema") return null;
  try {
    return "parse" in n ? n.parse(t) : JSON.parse(t);
  } catch (r) {
    throw new B(`Failed to parse structured output: ${r}`);
  }
}
var t_ = (e) => {
  let t = 0, n = [];
  for (; t < e.length; ) {
    let r = e[t];
    if (r === "\\") {
      t++;
      continue;
    }
    if (r === "{") {
      n.push({
        type: "brace",
        value: "{"
      }), t++;
      continue;
    }
    if (r === "}") {
      n.push({
        type: "brace",
        value: "}"
      }), t++;
      continue;
    }
    if (r === "[") {
      n.push({
        type: "paren",
        value: "["
      }), t++;
      continue;
    }
    if (r === "]") {
      n.push({
        type: "paren",
        value: "]"
      }), t++;
      continue;
    }
    if (r === ":") {
      n.push({
        type: "separator",
        value: ":"
      }), t++;
      continue;
    }
    if (r === ",") {
      n.push({
        type: "delimiter",
        value: ","
      }), t++;
      continue;
    }
    if (r === '"') {
      let s = "", u = !1;
      for (r = e[++t]; r !== '"'; ) {
        if (t === e.length) {
          u = !0;
          break;
        }
        if (r === "\\") {
          if (t++, t === e.length) {
            u = !0;
            break;
          }
          s += r + e[t], r = e[++t];
        } else
          s += r, r = e[++t];
      }
      r = e[++t], u || n.push({
        type: "string",
        value: s
      });
      continue;
    }
    if (r && /\s/.test(r)) {
      t++;
      continue;
    }
    let o = /[0-9]/;
    if (r && o.test(r) || r === "-" || r === ".") {
      let s = "";
      for (r === "-" && (s += r, r = e[++t]); r && o.test(r) || r === "."; )
        s += r, r = e[++t];
      n.push({
        type: "number",
        value: s
      });
      continue;
    }
    let i = /[a-z]/i;
    if (r && i.test(r)) {
      let s = "";
      for (; r && i.test(r) && t !== e.length; )
        s += r, r = e[++t];
      if (s == "true" || s == "false" || s === "null") n.push({
        type: "name",
        value: s
      });
      else {
        t++;
        continue;
      }
      continue;
    }
    t++;
  }
  return n;
}, Yt = (e) => {
  if (e.length === 0) return e;
  let t = e[e.length - 1];
  switch (t.type) {
    case "separator":
      return e = e.slice(0, e.length - 1), Yt(e);
    case "number":
      let n = t.value[t.value.length - 1];
      if (n === "." || n === "-")
        return e = e.slice(0, e.length - 1), Yt(e);
    case "string":
      let r = e[e.length - 2];
      if (r?.type === "delimiter")
        return e = e.slice(0, e.length - 1), Yt(e);
      if (r?.type === "brace" && r.value === "{")
        return e = e.slice(0, e.length - 1), Yt(e);
      break;
    case "delimiter":
      return e = e.slice(0, e.length - 1), Yt(e);
  }
  return e;
}, n_ = (e) => {
  let t = [];
  return e.map((n) => {
    n.type === "brace" && (n.value === "{" ? t.push("}") : t.splice(t.lastIndexOf("}"), 1)), n.type === "paren" && (n.value === "[" ? t.push("]") : t.splice(t.lastIndexOf("]"), 1));
  }), t.length > 0 && t.reverse().map((n) => {
    n === "}" ? e.push({
      type: "brace",
      value: "}"
    }) : n === "]" && e.push({
      type: "paren",
      value: "]"
    });
  }), e;
}, r_ = (e) => {
  let t = "";
  return e.map((n) => {
    n.type === "string" ? t += '"' + n.value + '"' : t += n.value;
  }), t;
}, af = (e) => JSON.parse(r_(n_(Yt(t_(e))))), Me, pt, Ht, Tn, xr, Sn, En, Nr, Cn, et, wn, kr, Dr, Rt, $r, Lr, In, di, ll, Ur, fi, hi, pi, ul, cl = "__json_buf";
function dl(e) {
  return e.type === "tool_use" || e.type === "server_tool_use" || e.type === "mcp_tool_use";
}
var o_ = class Vi {
  constructor(t, n) {
    Me.add(this), this.messages = [], this.receivedMessages = [], pt.set(this, void 0), Ht.set(this, null), this.controller = new AbortController(), Tn.set(this, void 0), xr.set(this, () => {
    }), Sn.set(this, () => {
    }), En.set(this, void 0), Nr.set(this, () => {
    }), Cn.set(this, () => {
    }), et.set(this, {}), wn.set(this, !1), kr.set(this, !1), Dr.set(this, !1), Rt.set(this, !1), $r.set(this, void 0), Lr.set(this, void 0), In.set(this, void 0), Ur.set(this, (r) => {
      if (D(this, kr, !0, "f"), lr(r) && (r = new Ve()), r instanceof Ve)
        return D(this, Dr, !0, "f"), this._emit("abort", r);
      if (r instanceof B) return this._emit("error", r);
      if (r instanceof Error) {
        const o = new B(r.message);
        return o.cause = r, this._emit("error", o);
      }
      return this._emit("error", new B(String(r)));
    }), D(this, Tn, new Promise((r, o) => {
      D(this, xr, r, "f"), D(this, Sn, o, "f");
    }), "f"), D(this, En, new Promise((r, o) => {
      D(this, Nr, r, "f"), D(this, Cn, o, "f");
    }), "f"), T(this, Tn, "f").catch(() => {
    }), T(this, En, "f").catch(() => {
    }), D(this, Ht, t, "f"), D(this, In, n?.logger ?? console, "f");
  }
  get response() {
    return T(this, $r, "f");
  }
  get request_id() {
    return T(this, Lr, "f");
  }
  async withResponse() {
    D(this, Rt, !0, "f");
    const t = await T(this, Tn, "f");
    if (!t) throw new Error("Could not resolve a `Response` object");
    return {
      data: this,
      response: t,
      request_id: t.headers.get("request-id")
    };
  }
  static fromReadableStream(t) {
    const n = new Vi(null);
    return n._run(() => n._fromReadableStream(t)), n;
  }
  static createMessage(t, n, r, { logger: o } = {}) {
    const i = new Vi(n, { logger: o });
    for (const s of n.messages) i._addMessageParam(s);
    return D(i, Ht, {
      ...n,
      stream: !0
    }, "f"), i._run(() => i._createMessage(t, {
      ...n,
      stream: !0
    }, {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), i;
  }
  _run(t) {
    t().then(() => {
      this._emitFinal(), this._emit("end");
    }, T(this, Ur, "f"));
  }
  _addMessageParam(t) {
    this.messages.push(t);
  }
  _addMessage(t, n = !0) {
    this.receivedMessages.push(t), n && this._emit("message", t);
  }
  async _createMessage(t, n, r) {
    const o = r?.signal;
    let i;
    o && (o.aborted && this.controller.abort(), i = this.controller.abort.bind(this.controller), o.addEventListener("abort", i));
    try {
      T(this, Me, "m", fi).call(this);
      const { response: s, data: u } = await t.create({
        ...n,
        stream: !0
      }, {
        ...r,
        signal: this.controller.signal
      }).withResponse();
      this._connected(s);
      for await (const c of u) T(this, Me, "m", hi).call(this, c);
      if (u.controller.signal?.aborted) throw new Ve();
      T(this, Me, "m", pi).call(this);
    } finally {
      o && i && o.removeEventListener("abort", i);
    }
  }
  _connected(t) {
    this.ended || (D(this, $r, t, "f"), D(this, Lr, t?.headers.get("request-id"), "f"), T(this, xr, "f").call(this, t), this._emit("connect"));
  }
  get ended() {
    return T(this, wn, "f");
  }
  get errored() {
    return T(this, kr, "f");
  }
  get aborted() {
    return T(this, Dr, "f");
  }
  abort() {
    this.controller.abort();
  }
  on(t, n) {
    return (T(this, et, "f")[t] || (T(this, et, "f")[t] = [])).push({ listener: n }), this;
  }
  off(t, n) {
    const r = T(this, et, "f")[t];
    if (!r) return this;
    const o = r.findIndex((i) => i.listener === n);
    return o >= 0 && r.splice(o, 1), this;
  }
  once(t, n) {
    return (T(this, et, "f")[t] || (T(this, et, "f")[t] = [])).push({
      listener: n,
      once: !0
    }), this;
  }
  emitted(t) {
    return new Promise((n, r) => {
      D(this, Rt, !0, "f"), t !== "error" && this.once("error", r), this.once(t, n);
    });
  }
  async done() {
    D(this, Rt, !0, "f"), await T(this, En, "f");
  }
  get currentMessage() {
    return T(this, pt, "f");
  }
  async finalMessage() {
    return await this.done(), T(this, Me, "m", di).call(this);
  }
  async finalText() {
    return await this.done(), T(this, Me, "m", ll).call(this);
  }
  _emit(t, ...n) {
    if (T(this, wn, "f")) return;
    t === "end" && (D(this, wn, !0, "f"), T(this, Nr, "f").call(this));
    const r = T(this, et, "f")[t];
    if (r && (T(this, et, "f")[t] = r.filter((o) => !o.once), r.forEach(({ listener: o }) => o(...n))), t === "abort") {
      const o = n[0];
      !T(this, Rt, "f") && !r?.length && Promise.reject(o), T(this, Sn, "f").call(this, o), T(this, Cn, "f").call(this, o), this._emit("end");
      return;
    }
    if (t === "error") {
      const o = n[0];
      !T(this, Rt, "f") && !r?.length && Promise.reject(o), T(this, Sn, "f").call(this, o), T(this, Cn, "f").call(this, o), this._emit("end");
    }
  }
  _emitFinal() {
    this.receivedMessages.at(-1) && this._emit("finalMessage", T(this, Me, "m", di).call(this));
  }
  async _fromReadableStream(t, n) {
    const r = n?.signal;
    let o;
    r && (r.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), r.addEventListener("abort", o));
    try {
      T(this, Me, "m", fi).call(this), this._connected(null);
      const i = ur.fromReadableStream(t, this.controller);
      for await (const s of i) T(this, Me, "m", hi).call(this, s);
      if (i.controller.signal?.aborted) throw new Ve();
      T(this, Me, "m", pi).call(this);
    } finally {
      r && o && r.removeEventListener("abort", o);
    }
  }
  [(pt = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ new WeakMap(), xr = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ new WeakMap(), Nr = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), Dr = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap(), $r = /* @__PURE__ */ new WeakMap(), Lr = /* @__PURE__ */ new WeakMap(), In = /* @__PURE__ */ new WeakMap(), Ur = /* @__PURE__ */ new WeakMap(), Me = /* @__PURE__ */ new WeakSet(), di = function() {
    if (this.receivedMessages.length === 0) throw new B("stream ended without producing a Message with role=assistant");
    return this.receivedMessages.at(-1);
  }, ll = function() {
    if (this.receivedMessages.length === 0) throw new B("stream ended without producing a Message with role=assistant");
    const n = this.receivedMessages.at(-1).content.filter((r) => r.type === "text").map((r) => r.text);
    if (n.length === 0) throw new B("stream ended without producing a content block with type=text");
    return n.join(" ");
  }, fi = function() {
    this.ended || D(this, pt, void 0, "f");
  }, hi = function(n) {
    if (this.ended) return;
    const r = T(this, Me, "m", ul).call(this, n);
    switch (this._emit("streamEvent", n, r), n.type) {
      case "content_block_delta": {
        const o = r.content.at(-1);
        switch (n.delta.type) {
          case "text_delta":
            o.type === "text" && this._emit("text", n.delta.text, o.text || "");
            break;
          case "citations_delta":
            o.type === "text" && this._emit("citation", n.delta.citation, o.citations ?? []);
            break;
          case "input_json_delta":
            dl(o) && o.input && this._emit("inputJson", n.delta.partial_json, o.input);
            break;
          case "thinking_delta":
            o.type === "thinking" && this._emit("thinking", n.delta.thinking, o.thinking);
            break;
          case "signature_delta":
            o.type === "thinking" && this._emit("signature", o.signature);
            break;
          case "compaction_delta":
            o.type === "compaction" && o.content && this._emit("compaction", o.content);
            break;
          default:
            n.delta;
        }
        break;
      }
      case "message_stop":
        this._addMessageParam(r), this._addMessage(al(r, T(this, Ht, "f"), { logger: T(this, In, "f") }), !0);
        break;
      case "content_block_stop":
        this._emit("contentBlock", r.content.at(-1));
        break;
      case "message_start":
        D(this, pt, r, "f");
        break;
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, pi = function() {
    if (this.ended) throw new B("stream has ended, this shouldn't happen");
    const n = T(this, pt, "f");
    if (!n) throw new B("request ended without sending any chunks");
    return D(this, pt, void 0, "f"), al(n, T(this, Ht, "f"), { logger: T(this, In, "f") });
  }, ul = function(n) {
    let r = T(this, pt, "f");
    if (n.type === "message_start") {
      if (r) throw new B(`Unexpected event order, got ${n.type} before receiving "message_stop"`);
      return n.message;
    }
    if (!r) throw new B(`Unexpected event order, got ${n.type} before "message_start"`);
    switch (n.type) {
      case "message_stop":
        return r;
      case "message_delta":
        return r.container = n.delta.container, r.stop_reason = n.delta.stop_reason, r.stop_sequence = n.delta.stop_sequence, r.usage.output_tokens = n.usage.output_tokens, r.context_management = n.context_management, n.usage.input_tokens != null && (r.usage.input_tokens = n.usage.input_tokens), n.usage.cache_creation_input_tokens != null && (r.usage.cache_creation_input_tokens = n.usage.cache_creation_input_tokens), n.usage.cache_read_input_tokens != null && (r.usage.cache_read_input_tokens = n.usage.cache_read_input_tokens), n.usage.server_tool_use != null && (r.usage.server_tool_use = n.usage.server_tool_use), n.usage.iterations != null && (r.usage.iterations = n.usage.iterations), r;
      case "content_block_start":
        return r.content.push(n.content_block), r;
      case "content_block_delta": {
        const o = r.content.at(n.index);
        switch (n.delta.type) {
          case "text_delta":
            o?.type === "text" && (r.content[n.index] = {
              ...o,
              text: (o.text || "") + n.delta.text
            });
            break;
          case "citations_delta":
            o?.type === "text" && (r.content[n.index] = {
              ...o,
              citations: [...o.citations ?? [], n.delta.citation]
            });
            break;
          case "input_json_delta":
            if (o && dl(o)) {
              let i = o[cl] || "";
              i += n.delta.partial_json;
              const s = { ...o };
              if (Object.defineProperty(s, cl, {
                value: i,
                enumerable: !1,
                writable: !0
              }), i) try {
                s.input = af(i);
              } catch (u) {
                const c = new B(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${u}. JSON: ${i}`);
                T(this, Ur, "f").call(this, c);
              }
              r.content[n.index] = s;
            }
            break;
          case "thinking_delta":
            o?.type === "thinking" && (r.content[n.index] = {
              ...o,
              thinking: o.thinking + n.delta.thinking
            });
            break;
          case "signature_delta":
            o?.type === "thinking" && (r.content[n.index] = {
              ...o,
              signature: n.delta.signature
            });
            break;
          case "compaction_delta":
            o?.type === "compaction" && (r.content[n.index] = {
              ...o,
              content: (o.content || "") + n.delta.content
            });
            break;
          default:
            n.delta;
        }
        return r;
      }
      case "content_block_stop":
        return r;
    }
  }, Symbol.asyncIterator)]() {
    const t = [], n = [];
    let r = !1;
    return this.on("streamEvent", (o) => {
      const i = n.shift();
      i ? i.resolve(o) : t.push(o);
    }), this.on("end", () => {
      r = !0;
      for (const o of n) o.resolve(void 0);
      n.length = 0;
    }), this.on("abort", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), this.on("error", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), {
      next: async () => t.length ? {
        value: t.shift(),
        done: !1
      } : r ? {
        value: void 0,
        done: !0
      } : new Promise((o, i) => n.push({
        resolve: o,
        reject: i
      })).then((o) => o ? {
        value: o,
        done: !1
      } : {
        value: void 0,
        done: !0
      }),
      return: async () => (this.abort(), {
        value: void 0,
        done: !0
      })
    };
  }
  toReadableStream() {
    return new ur(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
}, lf = class extends Error {
  constructor(e) {
    const t = typeof e == "string" ? e : e.map((n) => n.type === "text" ? n.text : `[${n.type}]`).join(" ");
    super(t), this.name = "ToolError", this.content = e;
  }
};
var i_ = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`, bn, Vt, Pt, ne, _e, Te, st, mt, Rn, fl, Ji;
function hl() {
  let e, t;
  return {
    promise: new Promise((n, r) => {
      e = n, t = r;
    }),
    resolve: e,
    reject: t
  };
}
var uf = class {
  constructor(e, t, n) {
    bn.add(this), this.client = e, Vt.set(this, !1), Pt.set(this, !1), ne.set(this, void 0), _e.set(this, void 0), Te.set(this, void 0), st.set(this, void 0), mt.set(this, void 0), Rn.set(this, 0), D(this, ne, { params: {
      ...t,
      messages: structuredClone(t.messages)
    } }, "f");
    const r = ["BetaToolRunner", ...Yd(t.tools, t.messages)].join(", ");
    D(this, _e, {
      ...n,
      headers: R([{ "x-stainless-helper": r }, n?.headers])
    }, "f"), D(this, mt, hl(), "f"), t.compactionControl?.enabled && console.warn('Anthropic: The `compactionControl` parameter is deprecated and will be removed in a future version. Use server-side compaction instead by passing `edits: [{ type: "compact_20260112" }]` in the params passed to `toolRunner()`. See https://platform.claude.com/docs/en/build-with-claude/compaction');
  }
  async *[(Vt = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), ne = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), Te = /* @__PURE__ */ new WeakMap(), st = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ new WeakMap(), Rn = /* @__PURE__ */ new WeakMap(), bn = /* @__PURE__ */ new WeakSet(), fl = async function() {
    const t = T(this, ne, "f").params.compactionControl;
    if (!t || !t.enabled) return !1;
    let n = 0;
    if (T(this, Te, "f") !== void 0) try {
      const c = await T(this, Te, "f");
      n = c.usage.input_tokens + (c.usage.cache_creation_input_tokens ?? 0) + (c.usage.cache_read_input_tokens ?? 0) + c.usage.output_tokens;
    } catch {
      return !1;
    }
    const r = t.contextTokenThreshold ?? 1e5;
    if (n < r) return !1;
    const o = t.model ?? T(this, ne, "f").params.model, i = t.summaryPrompt ?? i_, s = T(this, ne, "f").params.messages;
    if (s[s.length - 1].role === "assistant") {
      const c = s[s.length - 1];
      if (Array.isArray(c.content)) {
        const d = c.content.filter((h) => h.type !== "tool_use");
        d.length === 0 ? s.pop() : c.content = d;
      }
    }
    const u = await this.client.beta.messages.create({
      model: o,
      messages: [...s, {
        role: "user",
        content: [{
          type: "text",
          text: i
        }]
      }],
      max_tokens: T(this, ne, "f").params.max_tokens
    }, {
      signal: T(this, _e, "f").signal,
      headers: R([T(this, _e, "f").headers, { "x-stainless-helper": "compaction" }])
    });
    if (u.content[0]?.type !== "text") throw new B("Expected text response for compaction");
    return T(this, ne, "f").params.messages = [{
      role: "user",
      content: u.content
    }], !0;
  }, Symbol.asyncIterator)]() {
    var e;
    if (T(this, Vt, "f")) throw new B("Cannot iterate over a consumed stream");
    D(this, Vt, !0, "f"), D(this, Pt, !0, "f"), D(this, st, void 0, "f");
    try {
      for (; ; ) {
        let t;
        try {
          if (T(this, ne, "f").params.max_iterations && T(this, Rn, "f") >= T(this, ne, "f").params.max_iterations) break;
          D(this, Pt, !1, "f"), D(this, st, void 0, "f"), D(this, Rn, (e = T(this, Rn, "f"), e++, e), "f"), D(this, Te, void 0, "f");
          const { max_iterations: n, compactionControl: r, ...o } = T(this, ne, "f").params;
          if (o.stream ? (t = this.client.beta.messages.stream({ ...o }, T(this, _e, "f")), D(this, Te, t.finalMessage(), "f"), T(this, Te, "f").catch(() => {
          }), yield t) : (D(this, Te, this.client.beta.messages.create({
            ...o,
            stream: !1
          }, T(this, _e, "f")), "f"), yield T(this, Te, "f")), !await T(this, bn, "m", fl).call(this)) {
            if (!T(this, Pt, "f")) {
              const { role: s, content: u } = await T(this, Te, "f");
              T(this, ne, "f").params.messages.push({
                role: s,
                content: u
              });
            }
            const i = await T(this, bn, "m", Ji).call(this, T(this, ne, "f").params.messages.at(-1));
            if (i) T(this, ne, "f").params.messages.push(i);
            else if (!T(this, Pt, "f")) break;
          }
        } finally {
          t && t.abort();
        }
      }
      if (!T(this, Te, "f")) throw new B("ToolRunner concluded without a message from the server");
      T(this, mt, "f").resolve(await T(this, Te, "f"));
    } catch (t) {
      throw D(this, Vt, !1, "f"), T(this, mt, "f").promise.catch(() => {
      }), T(this, mt, "f").reject(t), D(this, mt, hl(), "f"), t;
    }
  }
  setMessagesParams(e) {
    typeof e == "function" ? T(this, ne, "f").params = e(T(this, ne, "f").params) : T(this, ne, "f").params = e, D(this, Pt, !0, "f"), D(this, st, void 0, "f");
  }
  setRequestOptions(e) {
    typeof e == "function" ? D(this, _e, e(T(this, _e, "f")), "f") : D(this, _e, {
      ...T(this, _e, "f"),
      ...e
    }, "f");
  }
  async generateToolResponse(e = T(this, _e, "f").signal) {
    const t = await T(this, Te, "f") ?? this.params.messages.at(-1);
    return t ? T(this, bn, "m", Ji).call(this, t, e) : null;
  }
  done() {
    return T(this, mt, "f").promise;
  }
  async runUntilDone() {
    if (!T(this, Vt, "f")) for await (const e of this) ;
    return this.done();
  }
  get params() {
    return T(this, ne, "f").params;
  }
  pushMessages(...e) {
    this.setMessagesParams((t) => ({
      ...t,
      messages: [...t.messages, ...e]
    }));
  }
  then(e, t) {
    return this.runUntilDone().then(e, t);
  }
};
Ji = async function(t, n = T(this, _e, "f").signal) {
  return T(this, st, "f") !== void 0 ? T(this, st, "f") : (D(this, st, s_(T(this, ne, "f").params, t, {
    ...T(this, _e, "f"),
    signal: n
  }), "f"), T(this, st, "f"));
};
async function s_(e, t = e.messages.at(-1), n) {
  if (!t || t.role !== "assistant" || !t.content || typeof t.content == "string") return null;
  const r = t.content.filter((o) => o.type === "tool_use");
  return r.length === 0 ? null : {
    role: "user",
    content: await Promise.all(r.map(async (o) => {
      const i = e.tools.find((s) => ("name" in s ? s.name : s.mcp_server_name) === o.name);
      if (!i || !("run" in i)) return {
        type: "tool_result",
        tool_use_id: o.id,
        content: `Error: Tool '${o.name}' not found`,
        is_error: !0
      };
      try {
        let s = o.input;
        "parse" in i && i.parse && (s = i.parse(s));
        const u = await i.run(s, {
          toolUseBlock: o,
          signal: n?.signal
        });
        return {
          type: "tool_result",
          tool_use_id: o.id,
          content: u
        };
      } catch (s) {
        return {
          type: "tool_result",
          tool_use_id: o.id,
          content: s instanceof lf ? s.content : `Error: ${s instanceof Error ? s.message : String(s)}`,
          is_error: !0
        };
      }
    }))
  };
}
var cf = class df {
  constructor(t, n) {
    this.iterator = t, this.controller = n;
  }
  async *decoder() {
    const t = new _r();
    for await (const n of this.iterator) for (const r of t.decode(n)) yield JSON.parse(r);
    for (const n of t.flush()) yield JSON.parse(n);
  }
  [Symbol.asyncIterator]() {
    return this.decoder();
  }
  static fromResponse(t, n) {
    if (!t.body)
      throw n.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new B("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new B("Attempted to iterate over a response with no body");
    return new df(Js(t.body), n);
  }
}, ff = class extends Z {
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/messages/batches?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/messages/batches/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/messages/batches?beta=true", yr, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/messages/batches/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() }, n?.headers])
    });
  }
  cancel(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/messages/batches/${e}/cancel?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() }, n?.headers])
    });
  }
  async results(e, t = {}, n) {
    const r = await this.retrieve(e);
    if (!r.results_url) throw new B(`No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`);
    const { betas: o } = t ?? {};
    return this._client.get(r.results_url, {
      ...n,
      headers: R([{
        "anthropic-beta": [...o ?? [], "message-batches-2024-09-24"].toString(),
        Accept: "application/binary"
      }, n?.headers]),
      stream: !0,
      __binaryResponse: !0
    })._thenUnwrap((i, s) => cf.fromResponse(s.response, s.controller));
  }
}, pl = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
}, a_ = ["claude-mythos-preview", "claude-opus-4-6"], vr = class extends Z {
  constructor() {
    super(...arguments), this.batches = new ff(this._client);
  }
  create(e, t) {
    const n = ml(e), { betas: r, ...o } = n;
    o.model in pl && console.warn(`The model '${o.model}' is deprecated and will reach end-of-life on ${pl[o.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`), a_.includes(o.model) && o.thinking && o.thinking.type === "enabled" && console.warn(`Using Claude with ${o.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
    let i = this._client._options.timeout;
    if (!o.stream && i == null) {
      const u = rf[o.model] ?? void 0;
      i = this._client.calculateNonstreamingTimeout(o.max_tokens, u);
    }
    const s = Xd(o.tools, o.messages);
    return this._client.post("/v1/messages?beta=true", {
      body: o,
      timeout: i ?? 6e5,
      ...t,
      headers: R([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        s,
        t?.headers
      ]),
      stream: n.stream ?? !1
    });
  }
  parse(e, t) {
    return t = {
      ...t,
      headers: R([{ "anthropic-beta": [...e.betas ?? [], "structured-outputs-2025-12-15"].toString() }, t?.headers])
    }, this.create(e, t).then((n) => sf(n, e, { logger: this._client.logger ?? console }));
  }
  stream(e, t) {
    return o_.createMessage(this, e, t);
  }
  countTokens(e, t) {
    const { betas: n, ...r } = ml(e);
    return this._client.post("/v1/messages/count_tokens?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "token-counting-2024-11-01"].toString() }, t?.headers])
    });
  }
  toolRunner(e, t) {
    return new uf(this._client, e, t);
  }
};
function ml(e) {
  if (!e.output_format) return e;
  if (e.output_config?.format) throw new B("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
  const { output_format: t, ...n } = e;
  return {
    ...n,
    output_config: {
      ...e.output_config,
      format: t
    }
  };
}
vr.Batches = ff;
vr.BetaToolRunner = uf;
vr.ToolError = lf;
var hf = class extends Z {
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/sessions/${e}/events?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  send(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/sessions/${e}/events?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  stream(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/sessions/${e}/events/stream?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers]),
      stream: !0
    });
  }
}, pf = class extends Z {
  retrieve(e, t, n) {
    const { session_id: r, betas: o } = t;
    return this._client.get(U`/v1/sessions/${r}/resources/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { session_id: r, betas: o, ...i } = t;
    return this._client.post(U`/v1/sessions/${r}/resources/${e}?beta=true`, {
      body: i,
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/sessions/${e}/resources?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  delete(e, t, n) {
    const { session_id: r, betas: o } = t;
    return this._client.delete(U`/v1/sessions/${r}/resources/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  add(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/sessions/${e}/resources?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
}, Jo = class extends Z {
  constructor() {
    super(...arguments), this.events = new hf(this._client), this.resources = new pf(this._client);
  }
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/sessions?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/sessions/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/sessions/${e}?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/sessions?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/sessions/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  archive(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/sessions/${e}/archive?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
};
Jo.Events = hf;
Jo.Resources = pf;
var mf = class extends Z {
  create(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.post(U`/v1/skills/${e}/versions?beta=true`, Ws({
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() }, n?.headers])
    }, this._client));
  }
  retrieve(e, t, n) {
    const { skill_id: r, betas: o } = t;
    return this._client.get(U`/v1/skills/${r}/versions/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "skills-2025-10-02"].toString() }, n?.headers])
    });
  }
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/skills/${e}/versions?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() }, n?.headers])
    });
  }
  delete(e, t, n) {
    const { skill_id: r, betas: o } = t;
    return this._client.delete(U`/v1/skills/${r}/versions/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "skills-2025-10-02"].toString() }, n?.headers])
    });
  }
}, Ys = class extends Z {
  constructor() {
    super(...arguments), this.versions = new mf(this._client);
  }
  create(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.post("/v1/skills?beta=true", Ws({
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() }, t?.headers])
    }, this._client, !1));
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/skills/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/skills?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/skills/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() }, n?.headers])
    });
  }
};
Ys.Versions = mf;
var gf = class extends Z {
  create(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/vaults/${e}/credentials?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  retrieve(e, t, n) {
    const { vault_id: r, betas: o } = t;
    return this._client.get(U`/v1/vaults/${r}/credentials/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { vault_id: r, betas: o, ...i } = t;
    return this._client.post(U`/v1/vaults/${r}/credentials/${e}?beta=true`, {
      body: i,
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e, t = {}, n) {
    const { betas: r, ...o } = t ?? {};
    return this._client.getAPIList(U`/v1/vaults/${e}/credentials?beta=true`, Ae, {
      query: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  delete(e, t, n) {
    const { vault_id: r, betas: o } = t;
    return this._client.delete(U`/v1/vaults/${r}/credentials/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  archive(e, t, n) {
    const { vault_id: r, betas: o } = t;
    return this._client.post(U`/v1/vaults/${r}/credentials/${e}/archive?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
}, Xs = class extends Z {
  constructor() {
    super(...arguments), this.credentials = new gf(this._client);
  }
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/vaults?beta=true", {
      body: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/vaults/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  update(e, t, n) {
    const { betas: r, ...o } = t;
    return this._client.post(U`/v1/vaults/${e}?beta=true`, {
      body: o,
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/vaults?beta=true", Ae, {
      query: r,
      ...t,
      headers: R([{ "anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString() }, t?.headers])
    });
  }
  delete(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.delete(U`/v1/vaults/${e}?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
  archive(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.post(U`/v1/vaults/${e}/archive?beta=true`, {
      ...n,
      headers: R([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers])
    });
  }
};
Xs.Credentials = gf;
var $e = class extends Z {
  constructor() {
    super(...arguments), this.models = new Zd(this._client), this.messages = new vr(this._client), this.agents = new zs(this._client), this.environments = new zd(this._client), this.sessions = new Jo(this._client), this.vaults = new Xs(this._client), this.memoryStores = new Vo(this._client), this.files = new Qd(this._client), this.skills = new Ys(this._client), this.userProfiles = new jd(this._client);
  }
};
$e.Models = Zd;
$e.Messages = vr;
$e.Agents = zs;
$e.Environments = zd;
$e.Sessions = Jo;
$e.Vaults = Xs;
$e.MemoryStores = Vo;
$e.Files = Qd;
$e.Skills = Ys;
$e.UserProfiles = jd;
var _f = class extends Z {
  create(e, t) {
    const { betas: n, ...r } = e;
    return this._client.post("/v1/complete", {
      body: r,
      timeout: this._client._options.timeout ?? 6e5,
      ...t,
      headers: R([{ ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 }, t?.headers]),
      stream: e.stream ?? !1
    });
  }
};
function yf(e) {
  return e?.output_config?.format;
}
function gl(e, t, n) {
  const r = yf(t);
  return !t || !("parse" in (r ?? {})) ? {
    ...e,
    content: e.content.map((o) => o.type === "text" ? Object.defineProperty({ ...o }, "parsed_output", {
      value: null,
      enumerable: !1
    }) : o),
    parsed_output: null
  } : vf(e, t, n);
}
function vf(e, t, n) {
  let r = null;
  const o = e.content.map((i) => {
    if (i.type === "text") {
      const s = l_(t, i.text);
      return r === null && (r = s), Object.defineProperty({ ...i }, "parsed_output", {
        value: s,
        enumerable: !1
      });
    }
    return i;
  });
  return {
    ...e,
    content: o,
    parsed_output: r
  };
}
function l_(e, t) {
  const n = yf(e);
  if (n?.type !== "json_schema") return null;
  try {
    return "parse" in n ? n.parse(t) : JSON.parse(t);
  } catch (r) {
    throw new B(`Failed to parse structured output: ${r}`);
  }
}
var xe, gt, Jt, Pn, Fr, Mn, xn, Or, Nn, tt, kn, Gr, Br, Mt, qr, Hr, Dn, mi, _l, gi, _i, yi, vi, yl, vl = "__json_buf";
function Al(e) {
  return e.type === "tool_use" || e.type === "server_tool_use";
}
var u_ = class Ki {
  constructor(t, n) {
    xe.add(this), this.messages = [], this.receivedMessages = [], gt.set(this, void 0), Jt.set(this, null), this.controller = new AbortController(), Pn.set(this, void 0), Fr.set(this, () => {
    }), Mn.set(this, () => {
    }), xn.set(this, void 0), Or.set(this, () => {
    }), Nn.set(this, () => {
    }), tt.set(this, {}), kn.set(this, !1), Gr.set(this, !1), Br.set(this, !1), Mt.set(this, !1), qr.set(this, void 0), Hr.set(this, void 0), Dn.set(this, void 0), gi.set(this, (r) => {
      if (D(this, Gr, !0, "f"), lr(r) && (r = new Ve()), r instanceof Ve)
        return D(this, Br, !0, "f"), this._emit("abort", r);
      if (r instanceof B) return this._emit("error", r);
      if (r instanceof Error) {
        const o = new B(r.message);
        return o.cause = r, this._emit("error", o);
      }
      return this._emit("error", new B(String(r)));
    }), D(this, Pn, new Promise((r, o) => {
      D(this, Fr, r, "f"), D(this, Mn, o, "f");
    }), "f"), D(this, xn, new Promise((r, o) => {
      D(this, Or, r, "f"), D(this, Nn, o, "f");
    }), "f"), T(this, Pn, "f").catch(() => {
    }), T(this, xn, "f").catch(() => {
    }), D(this, Jt, t, "f"), D(this, Dn, n?.logger ?? console, "f");
  }
  get response() {
    return T(this, qr, "f");
  }
  get request_id() {
    return T(this, Hr, "f");
  }
  async withResponse() {
    D(this, Mt, !0, "f");
    const t = await T(this, Pn, "f");
    if (!t) throw new Error("Could not resolve a `Response` object");
    return {
      data: this,
      response: t,
      request_id: t.headers.get("request-id")
    };
  }
  static fromReadableStream(t) {
    const n = new Ki(null);
    return n._run(() => n._fromReadableStream(t)), n;
  }
  static createMessage(t, n, r, { logger: o } = {}) {
    const i = new Ki(n, { logger: o });
    for (const s of n.messages) i._addMessageParam(s);
    return D(i, Jt, {
      ...n,
      stream: !0
    }, "f"), i._run(() => i._createMessage(t, {
      ...n,
      stream: !0
    }, {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), i;
  }
  _run(t) {
    t().then(() => {
      this._emitFinal(), this._emit("end");
    }, T(this, gi, "f"));
  }
  _addMessageParam(t) {
    this.messages.push(t);
  }
  _addMessage(t, n = !0) {
    this.receivedMessages.push(t), n && this._emit("message", t);
  }
  async _createMessage(t, n, r) {
    const o = r?.signal;
    let i;
    o && (o.aborted && this.controller.abort(), i = this.controller.abort.bind(this.controller), o.addEventListener("abort", i));
    try {
      T(this, xe, "m", _i).call(this);
      const { response: s, data: u } = await t.create({
        ...n,
        stream: !0
      }, {
        ...r,
        signal: this.controller.signal
      }).withResponse();
      this._connected(s);
      for await (const c of u) T(this, xe, "m", yi).call(this, c);
      if (u.controller.signal?.aborted) throw new Ve();
      T(this, xe, "m", vi).call(this);
    } finally {
      o && i && o.removeEventListener("abort", i);
    }
  }
  _connected(t) {
    this.ended || (D(this, qr, t, "f"), D(this, Hr, t?.headers.get("request-id"), "f"), T(this, Fr, "f").call(this, t), this._emit("connect"));
  }
  get ended() {
    return T(this, kn, "f");
  }
  get errored() {
    return T(this, Gr, "f");
  }
  get aborted() {
    return T(this, Br, "f");
  }
  abort() {
    this.controller.abort();
  }
  on(t, n) {
    return (T(this, tt, "f")[t] || (T(this, tt, "f")[t] = [])).push({ listener: n }), this;
  }
  off(t, n) {
    const r = T(this, tt, "f")[t];
    if (!r) return this;
    const o = r.findIndex((i) => i.listener === n);
    return o >= 0 && r.splice(o, 1), this;
  }
  once(t, n) {
    return (T(this, tt, "f")[t] || (T(this, tt, "f")[t] = [])).push({
      listener: n,
      once: !0
    }), this;
  }
  emitted(t) {
    return new Promise((n, r) => {
      D(this, Mt, !0, "f"), t !== "error" && this.once("error", r), this.once(t, n);
    });
  }
  async done() {
    D(this, Mt, !0, "f"), await T(this, xn, "f");
  }
  get currentMessage() {
    return T(this, gt, "f");
  }
  async finalMessage() {
    return await this.done(), T(this, xe, "m", mi).call(this);
  }
  async finalText() {
    return await this.done(), T(this, xe, "m", _l).call(this);
  }
  _emit(t, ...n) {
    if (T(this, kn, "f")) return;
    t === "end" && (D(this, kn, !0, "f"), T(this, Or, "f").call(this));
    const r = T(this, tt, "f")[t];
    if (r && (T(this, tt, "f")[t] = r.filter((o) => !o.once), r.forEach(({ listener: o }) => o(...n))), t === "abort") {
      const o = n[0];
      !T(this, Mt, "f") && !r?.length && Promise.reject(o), T(this, Mn, "f").call(this, o), T(this, Nn, "f").call(this, o), this._emit("end");
      return;
    }
    if (t === "error") {
      const o = n[0];
      !T(this, Mt, "f") && !r?.length && Promise.reject(o), T(this, Mn, "f").call(this, o), T(this, Nn, "f").call(this, o), this._emit("end");
    }
  }
  _emitFinal() {
    this.receivedMessages.at(-1) && this._emit("finalMessage", T(this, xe, "m", mi).call(this));
  }
  async _fromReadableStream(t, n) {
    const r = n?.signal;
    let o;
    r && (r.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), r.addEventListener("abort", o));
    try {
      T(this, xe, "m", _i).call(this), this._connected(null);
      const i = ur.fromReadableStream(t, this.controller);
      for await (const s of i) T(this, xe, "m", yi).call(this, s);
      if (i.controller.signal?.aborted) throw new Ve();
      T(this, xe, "m", vi).call(this);
    } finally {
      r && o && r.removeEventListener("abort", o);
    }
  }
  [(gt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), Pn = /* @__PURE__ */ new WeakMap(), Fr = /* @__PURE__ */ new WeakMap(), Mn = /* @__PURE__ */ new WeakMap(), xn = /* @__PURE__ */ new WeakMap(), Or = /* @__PURE__ */ new WeakMap(), Nn = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ new WeakMap(), kn = /* @__PURE__ */ new WeakMap(), Gr = /* @__PURE__ */ new WeakMap(), Br = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), qr = /* @__PURE__ */ new WeakMap(), Hr = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap(), gi = /* @__PURE__ */ new WeakMap(), xe = /* @__PURE__ */ new WeakSet(), mi = function() {
    if (this.receivedMessages.length === 0) throw new B("stream ended without producing a Message with role=assistant");
    return this.receivedMessages.at(-1);
  }, _l = function() {
    if (this.receivedMessages.length === 0) throw new B("stream ended without producing a Message with role=assistant");
    const n = this.receivedMessages.at(-1).content.filter((r) => r.type === "text").map((r) => r.text);
    if (n.length === 0) throw new B("stream ended without producing a content block with type=text");
    return n.join(" ");
  }, _i = function() {
    this.ended || D(this, gt, void 0, "f");
  }, yi = function(n) {
    if (this.ended) return;
    const r = T(this, xe, "m", yl).call(this, n);
    switch (this._emit("streamEvent", n, r), n.type) {
      case "content_block_delta": {
        const o = r.content.at(-1);
        switch (n.delta.type) {
          case "text_delta":
            o.type === "text" && this._emit("text", n.delta.text, o.text || "");
            break;
          case "citations_delta":
            o.type === "text" && this._emit("citation", n.delta.citation, o.citations ?? []);
            break;
          case "input_json_delta":
            Al(o) && o.input && this._emit("inputJson", n.delta.partial_json, o.input);
            break;
          case "thinking_delta":
            o.type === "thinking" && this._emit("thinking", n.delta.thinking, o.thinking);
            break;
          case "signature_delta":
            o.type === "thinking" && this._emit("signature", o.signature);
            break;
          default:
            n.delta;
        }
        break;
      }
      case "message_stop":
        this._addMessageParam(r), this._addMessage(gl(r, T(this, Jt, "f"), { logger: T(this, Dn, "f") }), !0);
        break;
      case "content_block_stop":
        this._emit("contentBlock", r.content.at(-1));
        break;
      case "message_start":
        D(this, gt, r, "f");
        break;
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, vi = function() {
    if (this.ended) throw new B("stream has ended, this shouldn't happen");
    const n = T(this, gt, "f");
    if (!n) throw new B("request ended without sending any chunks");
    return D(this, gt, void 0, "f"), gl(n, T(this, Jt, "f"), { logger: T(this, Dn, "f") });
  }, yl = function(n) {
    let r = T(this, gt, "f");
    if (n.type === "message_start") {
      if (r) throw new B(`Unexpected event order, got ${n.type} before receiving "message_stop"`);
      return n.message;
    }
    if (!r) throw new B(`Unexpected event order, got ${n.type} before "message_start"`);
    switch (n.type) {
      case "message_stop":
        return r;
      case "message_delta":
        return r.stop_reason = n.delta.stop_reason, r.stop_sequence = n.delta.stop_sequence, r.usage.output_tokens = n.usage.output_tokens, n.usage.input_tokens != null && (r.usage.input_tokens = n.usage.input_tokens), n.usage.cache_creation_input_tokens != null && (r.usage.cache_creation_input_tokens = n.usage.cache_creation_input_tokens), n.usage.cache_read_input_tokens != null && (r.usage.cache_read_input_tokens = n.usage.cache_read_input_tokens), n.usage.server_tool_use != null && (r.usage.server_tool_use = n.usage.server_tool_use), r;
      case "content_block_start":
        return r.content.push({ ...n.content_block }), r;
      case "content_block_delta": {
        const o = r.content.at(n.index);
        switch (n.delta.type) {
          case "text_delta":
            o?.type === "text" && (r.content[n.index] = {
              ...o,
              text: (o.text || "") + n.delta.text
            });
            break;
          case "citations_delta":
            o?.type === "text" && (r.content[n.index] = {
              ...o,
              citations: [...o.citations ?? [], n.delta.citation]
            });
            break;
          case "input_json_delta":
            if (o && Al(o)) {
              let i = o[vl] || "";
              i += n.delta.partial_json;
              const s = { ...o };
              Object.defineProperty(s, vl, {
                value: i,
                enumerable: !1,
                writable: !0
              }), i && (s.input = af(i)), r.content[n.index] = s;
            }
            break;
          case "thinking_delta":
            o?.type === "thinking" && (r.content[n.index] = {
              ...o,
              thinking: o.thinking + n.delta.thinking
            });
            break;
          case "signature_delta":
            o?.type === "thinking" && (r.content[n.index] = {
              ...o,
              signature: n.delta.signature
            });
            break;
          default:
            n.delta;
        }
        return r;
      }
      case "content_block_stop":
        return r;
    }
  }, Symbol.asyncIterator)]() {
    const t = [], n = [];
    let r = !1;
    return this.on("streamEvent", (o) => {
      const i = n.shift();
      i ? i.resolve(o) : t.push(o);
    }), this.on("end", () => {
      r = !0;
      for (const o of n) o.resolve(void 0);
      n.length = 0;
    }), this.on("abort", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), this.on("error", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), {
      next: async () => t.length ? {
        value: t.shift(),
        done: !1
      } : r ? {
        value: void 0,
        done: !0
      } : new Promise((o, i) => n.push({
        resolve: o,
        reject: i
      })).then((o) => o ? {
        value: o,
        done: !1
      } : {
        value: void 0,
        done: !0
      }),
      return: async () => (this.abort(), {
        value: void 0,
        done: !0
      })
    };
  }
  toReadableStream() {
    return new ur(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
}, Af = class extends Z {
  create(e, t) {
    return this._client.post("/v1/messages/batches", {
      body: e,
      ...t
    });
  }
  retrieve(e, t) {
    return this._client.get(U`/v1/messages/batches/${e}`, t);
  }
  list(e = {}, t) {
    return this._client.getAPIList("/v1/messages/batches", yr, {
      query: e,
      ...t
    });
  }
  delete(e, t) {
    return this._client.delete(U`/v1/messages/batches/${e}`, t);
  }
  cancel(e, t) {
    return this._client.post(U`/v1/messages/batches/${e}/cancel`, t);
  }
  async results(e, t) {
    const n = await this.retrieve(e);
    if (!n.results_url) throw new B(`No batch \`results_url\`; Has it finished processing? ${n.processing_status} - ${n.id}`);
    return this._client.get(n.results_url, {
      ...t,
      headers: R([{ Accept: "application/binary" }, t?.headers]),
      stream: !0,
      __binaryResponse: !0
    })._thenUnwrap((r, o) => cf.fromResponse(o.response, o.controller));
  }
}, Qs = class extends Z {
  constructor() {
    super(...arguments), this.batches = new Af(this._client);
  }
  create(e, t) {
    e.model in Tl && console.warn(`The model '${e.model}' is deprecated and will reach end-of-life on ${Tl[e.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`), c_.includes(e.model) && e.thinking && e.thinking.type === "enabled" && console.warn(`Using Claude with ${e.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
    let n = this._client._options.timeout;
    if (!e.stream && n == null) {
      const o = rf[e.model] ?? void 0;
      n = this._client.calculateNonstreamingTimeout(e.max_tokens, o);
    }
    const r = Xd(e.tools, e.messages);
    return this._client.post("/v1/messages", {
      body: e,
      timeout: n ?? 6e5,
      ...t,
      headers: R([r, t?.headers]),
      stream: e.stream ?? !1
    });
  }
  parse(e, t) {
    return this.create(e, t).then((n) => vf(n, e, { logger: this._client.logger ?? console }));
  }
  stream(e, t) {
    return u_.createMessage(this, e, t, { logger: this._client.logger ?? console });
  }
  countTokens(e, t) {
    return this._client.post("/v1/messages/count_tokens", {
      body: e,
      ...t
    });
  }
}, Tl = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026",
  "claude-3-5-haiku-latest": "February 19th, 2026",
  "claude-3-5-haiku-20241022": "February 19th, 2026",
  "claude-opus-4-0": "June 15th, 2026",
  "claude-opus-4-20250514": "June 15th, 2026",
  "claude-sonnet-4-0": "June 15th, 2026",
  "claude-sonnet-4-20250514": "June 15th, 2026"
}, c_ = ["claude-mythos-preview", "claude-opus-4-6"];
Qs.Batches = Af;
var Tf = class extends Z {
  retrieve(e, t = {}, n) {
    const { betas: r } = t ?? {};
    return this._client.get(U`/v1/models/${e}`, {
      ...n,
      headers: R([{ ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 }, n?.headers])
    });
  }
  list(e = {}, t) {
    const { betas: n, ...r } = e ?? {};
    return this._client.getAPIList("/v1/models", yr, {
      query: r,
      ...t,
      headers: R([{ ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 }, t?.headers])
    });
  }
}, Vr = (e) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[e]?.trim() || void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(e)?.trim() || void 0;
}, Wi, Zs, so, Sf, d_ = "\\n\\nHuman:", f_ = "\\n\\nAssistant:", ee = class {
  constructor({ baseURL: e = Vr("ANTHROPIC_BASE_URL"), apiKey: t = Vr("ANTHROPIC_API_KEY") ?? null, authToken: n = Vr("ANTHROPIC_AUTH_TOKEN") ?? null, ...r } = {}) {
    Wi.add(this), so.set(this, void 0);
    const o = {
      apiKey: t,
      authToken: n,
      ...r,
      baseURL: e || "https://api.anthropic.com"
    };
    if (!o.dangerouslyAllowBrowser && Ig()) throw new B(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
    this.baseURL = o.baseURL, this.timeout = o.timeout ?? Zs.DEFAULT_TIMEOUT, this.logger = o.logger ?? console;
    const i = "warn";
    this.logLevel = i, this.logLevel = rl(o.logLevel, "ClientOptions.logLevel", this) ?? rl(Vr("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? i, this.fetchOptions = o.fetchOptions, this.maxRetries = o.maxRetries ?? 2, this.fetch = o.fetch ?? xg(), D(this, so, kg, "f"), this._options = o, this.apiKey = typeof t == "string" ? t : null, this.authToken = n;
  }
  withOptions(e) {
    return new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      authToken: this.authToken,
      ...e
    });
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values: e, nulls: t }) {
    if (!(e.get("x-api-key") || e.get("authorization")) && !(this.apiKey && e.get("x-api-key")) && !t.has("x-api-key") && !(this.authToken && e.get("authorization")) && !t.has("authorization"))
      throw new Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  async authHeaders(e) {
    return R([await this.apiKeyAuth(e), await this.bearerAuth(e)]);
  }
  async apiKeyAuth(e) {
    if (this.apiKey != null)
      return R([{ "X-Api-Key": this.apiKey }]);
  }
  async bearerAuth(e) {
    if (this.authToken != null)
      return R([{ Authorization: `Bearer ${this.authToken}` }]);
  }
  stringifyQuery(e) {
    return Dg(e);
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${zt}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${wd()}`;
  }
  makeStatusError(e, t, n, r) {
    return be.generate(e, t, n, r);
  }
  buildURL(e, t, n) {
    const r = !T(this, Wi, "m", Sf).call(this) && n || this.baseURL, o = Sg(e) ? new URL(e) : new URL(r + (r.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), i = this.defaultQuery(), s = Object.fromEntries(o.searchParams);
    return (!Xa(i) || !Xa(s)) && (t = {
      ...s,
      ...i,
      ...t
    }), typeof t == "object" && t && !Array.isArray(t) && (o.search = this.stringifyQuery(t)), o.toString();
  }
  _calculateNonstreamingTimeout(e) {
    if (3600 * e / 128e3 > 600) throw new B("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    return 600 * 1e3;
  }
  async prepareOptions(e) {
  }
  async prepareRequest(e, { url: t, options: n }) {
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, n) {
    return this.request(Promise.resolve(n).then((r) => ({
      method: e,
      path: t,
      ...r
    })));
  }
  request(e, t = null) {
    return new Gd(this, this.makeRequest(e, t, void 0));
  }
  async makeRequest(e, t, n) {
    const r = await e, o = r.maxRetries ?? this.maxRetries;
    t == null && (t = o), await this.prepareOptions(r);
    const { req: i, url: s, timeout: u } = await this.buildRequest(r, { retryCount: o - t });
    await this.prepareRequest(i, {
      url: s,
      options: r
    });
    const c = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0"), d = n === void 0 ? "" : `, retryOf: ${n}`, h = Date.now();
    if (he(this).debug(`[${c}] sending request`, xt({
      retryOfRequestLogID: n,
      method: r.method,
      url: s,
      options: r,
      headers: i.headers
    })), r.signal?.aborted) throw new Ve();
    const f = new AbortController(), p = await this.fetchWithTimeout(s, i, u, f).catch(Fi), m = Date.now();
    if (p instanceof globalThis.Error) {
      const _ = `retrying, ${t} attempts remaining`;
      if (r.signal?.aborted) throw new Ve();
      const y = lr(p) || /timed? ?out/i.test(String(p) + ("cause" in p ? String(p.cause) : ""));
      if (t)
        return he(this).info(`[${c}] connection ${y ? "timed out" : "failed"} - ${_}`), he(this).debug(`[${c}] connection ${y ? "timed out" : "failed"} (${_})`, xt({
          retryOfRequestLogID: n,
          url: s,
          durationMs: m - h,
          message: p.message
        })), this.retryRequest(r, t, n ?? c);
      throw he(this).info(`[${c}] connection ${y ? "timed out" : "failed"} - error; no more retries left`), he(this).debug(`[${c}] connection ${y ? "timed out" : "failed"} (error; no more retries left)`, xt({
        retryOfRequestLogID: n,
        url: s,
        durationMs: m - h,
        message: p.message
      })), y ? new Id() : new Ho({ cause: p });
    }
    const g = `[${c}${d}${[...p.headers.entries()].filter(([_]) => _ === "request-id").map(([_, y]) => ", " + _ + ": " + JSON.stringify(y)).join("")}] ${i.method} ${s} ${p.ok ? "succeeded" : "failed"} with status ${p.status} in ${m - h}ms`;
    if (!p.ok) {
      const _ = await this.shouldRetry(p);
      if (t && _) {
        const P = `retrying, ${t} attempts remaining`;
        return await Ng(p.body), he(this).info(`${g} - ${P}`), he(this).debug(`[${c}] response error (${P})`, xt({
          retryOfRequestLogID: n,
          url: p.url,
          status: p.status,
          headers: p.headers,
          durationMs: m - h
        })), this.retryRequest(r, t, n ?? c, p.headers);
      }
      const y = _ ? "error; no more retries left" : "error; not retryable";
      he(this).info(`${g} - ${y}`);
      const E = await p.text().catch((P) => Fi(P).message), A = $d(E), w = A ? void 0 : E;
      throw he(this).debug(`[${c}] response error (${y})`, xt({
        retryOfRequestLogID: n,
        url: p.url,
        status: p.status,
        headers: p.headers,
        message: w,
        durationMs: Date.now() - h
      })), this.makeStatusError(p.status, A, w, p.headers);
    }
    return he(this).info(g), he(this).debug(`[${c}] response start`, xt({
      retryOfRequestLogID: n,
      url: p.url,
      status: p.status,
      headers: p.headers,
      durationMs: m - h
    })), {
      response: p,
      options: r,
      controller: f,
      requestLogID: c,
      retryOfRequestLogID: n,
      startTime: h
    };
  }
  getAPIList(e, t, n) {
    return this.requestAPIList(t, n && "then" in n ? n.then((r) => ({
      method: "get",
      path: e,
      ...r
    })) : {
      method: "get",
      path: e,
      ...n
    });
  }
  requestAPIList(e, t) {
    const n = this.makeRequest(t, null, void 0);
    return new Hg(this, n, e);
  }
  async fetchWithTimeout(e, t, n, r) {
    const { signal: o, method: i, ...s } = t || {}, u = this._makeAbort(r);
    o && o.addEventListener("abort", u, { once: !0 });
    const c = setTimeout(u, n), d = globalThis.ReadableStream && s.body instanceof globalThis.ReadableStream || typeof s.body == "object" && s.body !== null && Symbol.asyncIterator in s.body, h = {
      signal: r.signal,
      ...d ? { duplex: "half" } : {},
      method: "GET",
      ...s
    };
    i && (h.method = i.toUpperCase());
    try {
      return await this.fetch.call(void 0, e, h);
    } finally {
      clearTimeout(c);
    }
  }
  async shouldRetry(e) {
    const t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, n, r) {
    let o;
    const i = r?.get("retry-after-ms");
    if (i) {
      const u = parseFloat(i);
      Number.isNaN(u) || (o = u);
    }
    const s = r?.get("retry-after");
    if (s && !o) {
      const u = parseFloat(s);
      Number.isNaN(u) ? o = Date.parse(s) - Date.now() : o = u * 1e3;
    }
    if (o === void 0) {
      const u = e.maxRetries ?? this.maxRetries;
      o = this.calculateDefaultRetryTimeoutMillis(t, u);
    }
    return await wg(o), this.makeRequest(e, t - 1, n);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    const o = t - e;
    return Math.min(0.5 * Math.pow(2, o), 8) * (1 - Math.random() * 0.25) * 1e3;
  }
  calculateNonstreamingTimeout(e, t) {
    if (36e5 * e / 128e3 > 6e5 || t != null && e > t) throw new B("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    return 6e5;
  }
  async buildRequest(e, { retryCount: t = 0 } = {}) {
    const n = { ...e }, { method: r, path: o, query: i, defaultBaseURL: s } = n, u = this.buildURL(o, i, s);
    "timeout" in n && Cg("timeout", n.timeout), n.timeout = n.timeout ?? this.timeout;
    const { bodyHeaders: c, body: d } = this.buildBody({ options: n });
    return {
      req: {
        method: r,
        headers: await this.buildHeaders({
          options: e,
          method: r,
          bodyHeaders: c,
          retryCount: t
        }),
        ...n.signal && { signal: n.signal },
        ...globalThis.ReadableStream && d instanceof globalThis.ReadableStream && { duplex: "half" },
        ...d && { body: d },
        ...this.fetchOptions ?? {},
        ...n.fetchOptions ?? {}
      },
      url: u,
      timeout: n.timeout
    };
  }
  async buildHeaders({ options: e, method: t, bodyHeaders: n, retryCount: r }) {
    let o = {};
    this.idempotencyHeader && t !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), o[this.idempotencyHeader] = e.idempotencyKey);
    const i = R([
      o,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(r),
        ...e.timeout ? { "X-Stainless-Timeout": String(Math.trunc(e.timeout / 1e3)) } : {},
        ...Mg(),
        ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
        "anthropic-version": "2023-06-01"
      },
      await this.authHeaders(e),
      this._options.defaultHeaders,
      n,
      e.headers
    ]);
    return this.validateHeaders(i), i.values;
  }
  _makeAbort(e) {
    return () => e.abort();
  }
  buildBody({ options: { body: e, headers: t } }) {
    if (!e) return {
      bodyHeaders: void 0,
      body: void 0
    };
    const n = R([t]);
    return ArrayBuffer.isView(e) || e instanceof ArrayBuffer || e instanceof DataView || typeof e == "string" && n.values.has("content-type") || globalThis.Blob && e instanceof globalThis.Blob || e instanceof FormData || e instanceof URLSearchParams || globalThis.ReadableStream && e instanceof globalThis.ReadableStream ? {
      bodyHeaders: void 0,
      body: e
    } : typeof e == "object" && (Symbol.asyncIterator in e || Symbol.iterator in e && "next" in e && typeof e.next == "function") ? {
      bodyHeaders: void 0,
      body: Ud(e)
    } : typeof e == "object" && n.values.get("content-type") === "application/x-www-form-urlencoded" ? {
      bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
      body: this.stringifyQuery(e)
    } : T(this, so, "f").call(this, {
      body: e,
      headers: n
    });
  }
};
Zs = ee, so = /* @__PURE__ */ new WeakMap(), Wi = /* @__PURE__ */ new WeakSet(), Sf = function() {
  return this.baseURL !== "https://api.anthropic.com";
};
ee.Anthropic = Zs;
ee.HUMAN_PROMPT = d_;
ee.AI_PROMPT = f_;
ee.DEFAULT_TIMEOUT = 6e5;
ee.AnthropicError = B;
ee.APIError = be;
ee.APIConnectionError = Ho;
ee.APIConnectionTimeoutError = Id;
ee.APIUserAbortError = Ve;
ee.NotFoundError = Md;
ee.ConflictError = xd;
ee.RateLimitError = kd;
ee.BadRequestError = bd;
ee.AuthenticationError = Rd;
ee.InternalServerError = Dd;
ee.PermissionDeniedError = Pd;
ee.UnprocessableEntityError = Nd;
ee.toFile = Yg;
var Ar = class extends ee {
  constructor() {
    super(...arguments), this.completions = new _f(this), this.messages = new Qs(this), this.models = new Tf(this), this.beta = new $e(this);
  }
};
Ar.Completions = _f;
Ar.Messages = Qs;
Ar.Models = Tf;
Ar.Beta = $e;
var h_ = {
  openai: [
    "stop",
    "tool_calls",
    "function_call"
  ],
  anthropic: [
    "end_turn",
    "stop_sequence",
    "tool_use"
  ],
  google: ["STOP"]
};
function at(e, t, n = !1, r = "") {
  if (!n && h_[e]?.includes(t)) return t;
  const o = [
    "length",
    "max_tokens",
    "max_output_tokens",
    "MAX_TOKENS"
  ].includes(t), i = /* @__PURE__ */ new Error(o ? "Model response reached its output limit." : "Model response did not complete normally.");
  throw i.code = o ? "AGENT_RESPONSE_TRUNCATED" : "AGENT_RESPONSE_INCOMPLETE", i.reason = t || "missing_completion", r && (i.partialResponse = {
    text: r,
    finishReason: t,
    truncated: o
  }), i;
}
function Gt(e) {
  if (Array.isArray(e)) return e.map((n) => Gt(n));
  if (!e || typeof e != "object") return e;
  const t = {};
  return Object.entries(e).forEach(([n, r]) => {
    t[n] = /^(?:authorization|proxy[-_]?authorization|(?:x[-_])?csrf(?:[-_]?token)?|token|access[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|x[-_](?:goog[-_])?api[-_]?key|proxy[-_]?password|password|client[-_]?secret)$/i.test(n) ? r === "" ? "" : "[redacted]" : Gt(r);
  }), t;
}
function Ct(e = {}, t = {}) {
  const n = t.reasoning && typeof t.reasoning == "object" ? t.reasoning : {}, r = String(e.reasoning?.mode || "inherit"), o = e.reasoning?.output === "show" || e.reasoning?.output === "hide" ? e.reasoning.output : n.output === "show" ? "show" : "hide", i = String(n.mode || t.effectiveMode || r);
  return {
    reasoningRequestedMode: r,
    reasoningRequestedOutput: o,
    reasoningProfileId: String(n.profileId || t.profileId || e.reasoning?.profileId || "unsupported"),
    reasoningEffectiveMode: i,
    reasoningEffort: i === "on" ? String(t.effort ?? n.effort ?? e.reasoning?.effort ?? "") : "",
    reasoningBudgetTokens: i === "on" && Number.isFinite(Number(t.budgetTokens ?? n.budgetTokens ?? e.reasoning?.budgetTokens)) ? Number(t.budgetTokens ?? n.budgetTokens ?? e.reasoning?.budgetTokens) : null,
    reasoningControlFields: Gt(t.controlFields || {}),
    reasoningOutputVisible: i !== "off" && n.output === "show"
  };
}
function cr(e = {}) {
  return {
    provider: e.provider || "",
    model: e.model || "",
    transport: e.transport || "sdk",
    request: Gt({
      url: e.url || "",
      method: e.method || "POST",
      headers: e.headers || {},
      body: e.body || {},
      sdk: e.sdk || void 0
    }),
    ...e.effectiveConfig ? { effectiveConfig: e.effectiveConfig } : {}
  };
}
var p_ = Object.freeze({ type: "ephemeral" }), m_ = /* @__PURE__ */ new Set([
  "text",
  "image",
  "tool_use",
  "tool_result"
]), g_ = "[AgentCore][AnthropicUsage]";
function __(e) {
  e.system ? e.system = [{
    type: "text",
    text: e.system
  }] : delete e.system;
  const t = e.messages.flatMap((n) => n.content).filter((n) => m_.has(n.type) && (n.type !== "text" || n.text.trim())).at(-1);
  for (const n of [
    e.tools?.at(-1),
    e.system?.at(-1),
    t
  ]) n && (n.cache_control = { ...p_ });
}
function y_(e) {
  try {
    return JSON.parse(e || "{}");
  } catch {
    return {};
  }
}
function v_(e = "") {
  const t = String(e || "").match(/^data:([^;,]+);base64,(.+)$/);
  return t ? {
    mediaType: t[1],
    data: t[2]
  } : {
    mediaType: "",
    data: ""
  };
}
function Ef(e) {
  if (e !== void 0)
    try {
      return JSON.parse(JSON.stringify(e));
    } catch {
      return;
    }
}
function A_(e) {
  if (typeof e == "string") return [{
    type: "text",
    text: e
  }];
  if (!Array.isArray(e)) return [{
    type: "text",
    text: ""
  }];
  const t = e.map((n) => {
    if (!n || typeof n != "object") return null;
    if (n.type === "text") return {
      type: "text",
      text: n.text || ""
    };
    if (n.type === "image_url" && n.image_url?.url) {
      const r = v_(n.image_url.url);
      return !r.mediaType || !r.data ? null : {
        type: "image",
        source: {
          type: "base64",
          media_type: r.mediaType,
          data: r.data
        }
      };
    }
    return null;
  }).filter(Boolean);
  return t.length ? t : [{
    type: "text",
    text: ""
  }];
}
function T_(e) {
  const t = [String(e.systemPrompt || "").trim(), ...(e.messages || []).filter((n) => n.role === "system").map((n) => String(n.content || "").trim())].filter(Boolean);
  return t.length ? [...new Set(t)].join(`

`) : "";
}
function S_(e) {
  const t = e?.providerPayload?.anthropicContent;
  return Array.isArray(t) && t.length && Ef(t) || null;
}
function E_(e) {
  return Array.isArray(e?.content) && e.content.length ? { anthropicContent: Ef(e.content) || [] } : void 0;
}
function Sl(e = {}) {
  return {
    type: "tool_result",
    tool_use_id: e.tool_call_id,
    content: e.content
  };
}
function El(e = []) {
  return (Array.isArray(e) ? e : []).map((t) => {
    const n = String(t?.function?.name || "").trim();
    return n ? {
      type: "tool_use",
      id: t.id,
      name: n,
      input: y_(t.function.arguments)
    } : null;
  }).filter(Boolean);
}
function C_(e) {
  const t = [];
  for (let n = 0; n < e.length; n += 1) {
    const r = e[n];
    if (r.role !== "system") {
      if (r.role === "assistant") {
        const o = S_(r), i = El(r.tool_calls);
        if (o && i.length) {
          t.push({
            role: "assistant",
            content: o.filter((s) => s?.type !== "tool_use").concat(i)
          });
          continue;
        }
        if (o) {
          t.push({
            role: "assistant",
            content: o
          });
          continue;
        }
      }
      if (r.role === "tool") {
        const o = [Sl(r)];
        for (; e[n + 1]?.role === "tool"; )
          n += 1, o.push(Sl(e[n]));
        t.push({
          role: "user",
          content: o
        });
        continue;
      }
      if (r.role === "assistant" && Array.isArray(r.tool_calls) && r.tool_calls.length) {
        t.push({
          role: "assistant",
          content: [...r.content ? [{
            type: "text",
            text: r.content
          }] : [], ...El(r.tool_calls)]
        });
        continue;
      }
      t.push({
        role: r.role,
        content: A_(r.content)
      });
    }
  }
  return t;
}
function Jr(e, t) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: t.thoughts } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft ? { toolCallDraft: !0 } : {}
  });
}
function Cl(e = "") {
  return String(e || "https://api.anthropic.com").trim().replace(/\/+$/, "").replace(/\/v1$/i, "");
}
function w_(e = "auto", t = []) {
  const n = new Set((Array.isArray(t) ? t : []).map((o) => String(o?.function?.name || "").trim()).filter(Boolean)), r = String(e || "auto").trim() || "auto";
  if (r === "auto") return { type: "auto" };
  if (r === "required") return { type: "any" };
  if (r === "none") return { type: "none" };
  if (!n.has(r)) throw new Error(`Anthropic toolChoice 指定了不存在的工具：${r}`);
  return {
    type: "tool",
    name: r
  };
}
var I_ = "当前模型使用手动 thinking，与强制 Tool 调用冲突；本次请求已因强制 Tool 关闭 Reasoning。";
function Ai(e = {}, t = {}) {
  const n = Array.isArray(t.tools) ? t.tools : [], r = n.length ? w_(t.toolChoice, n) : void 0, o = t.reasoning?.output, i = {
    ...Ls(t.reasoning),
    ...o === "show" || o === "hide" ? { output: o } : {}
  }, s = Vs({
    provider: "anthropic",
    baseUrl: e.baseUrl,
    model: e.model
  }), u = i.mode === "on" && s.profileId === "anthropic-manual" && (r?.type === "any" || r?.type === "tool");
  return {
    toolChoice: r,
    effectiveReasoning: j("anthropic", e, {
      ...i,
      ...u ? { mode: "off" } : {}
    }, { maxTokens: t.maxTokens }),
    reasoningDisabledForForcedTool: u
  };
}
var b_ = class {
  constructor(e) {
    this.config = e, this.auth = Bo("anthropic", e.apiKey), this.client = new Ar({
      ...this.auth.sdkOptions,
      baseURL: Cl(e.baseUrl),
      timeout: Number(e.timeoutMs) || 900 * 1e3,
      maxRetries: 0,
      dangerouslyAllowBrowser: !0
    });
  }
  buildRequestBody(e, t = Ai(this.config, e)) {
    const n = t.effectiveReasoning, r = (Array.isArray(e.tools) ? e.tools : []).map((s) => ({
      name: s.function.name,
      description: s.function.description,
      input_schema: s.function.parameters
    })), o = T_(e), i = {
      model: this.config.model,
      system: o,
      messages: C_(e.messages),
      ...r.length ? {
        tools: r,
        tool_choice: t.toolChoice
      } : {},
      ...e.maxTokens ? { max_tokens: e.maxTokens } : {}
    };
    return qo(this.config.model) === "claude" && __(i), !gr({
      ...this.config,
      provider: "anthropic"
    }, n) && typeof e.temperature == "number" && (i.temperature = e.temperature), n.mode === "off" ? i.thinking = { type: "disabled" } : n.mode === "on" && n.profileId === "anthropic-adaptive" ? (i.thinking = {
      type: "adaptive",
      display: z(n) ? "summarized" : "omitted"
    }, i.output_config = { effort: n.effort }) : n.mode === "on" && n.profileId === "anthropic-manual" && (i.thinking = {
      type: "enabled",
      budget_tokens: n.budgetTokens,
      display: z(n) ? "summarized" : "omitted"
    }), i;
  }
  inspectRequest(e, t = {}) {
    const n = typeof e.onStreamProgress == "function", r = Cl(this.config.baseUrl), o = t.protocol || Ai(this.config, e), i = t.body || this.buildRequestBody(e, o), s = o.effectiveReasoning;
    return {
      ...cr({
        provider: "anthropic",
        model: this.config.model,
        transport: "anthropic-sdk",
        url: `${r}/v1/messages`,
        headers: {
          "Content-Type": "application/json",
          ...this.auth.headers
        },
        body: i,
        sdk: n ? "client.messages.stream" : "client.messages.create",
        effectiveConfig: Ct(e, {
          reasoning: s,
          effort: i.output_config?.effort,
          budgetTokens: i.thinking?.budget_tokens,
          controlFields: {
            ...i.thinking ? { thinking: i.thinking } : {},
            ...i.output_config ? { output_config: i.output_config } : {}
          }
        })
      }),
      ...o.reasoningDisabledForForcedTool ? { notices: [I_] } : {}
    };
  }
  async chat(e) {
    const t = Ai(this.config, e), n = t.effectiveReasoning, r = this.buildRequestBody(e, t), o = this.inspectRequest(e, {
      body: r,
      protocol: t
    });
    let i;
    if (typeof e.onStreamProgress == "function") {
      const f = this.client.messages.stream(r, { signal: e.signal }), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
      let g = "";
      const _ = () => z(n) ? Array.from(p.entries()).sort(([A], [w]) => A.localeCompare(w)).map(([A, w]) => ({
        label: A.startsWith("redacted:") ? "已脱敏思考块" : "思考块",
        text: w
      })).filter((A) => A.text) : [], y = () => Array.from(m.entries()).sort(([A], [w]) => Number(A) - Number(w)).map(([, A]) => ({
        id: A.id || "anthropic-tool-draft",
        name: A.name || "工具调用",
        arguments: A.inputJson || "{}",
        draft: !0
      })).filter((A) => A.name), E = () => {
        const A = y();
        A.length && Jr(e, {
          text: g,
          thoughts: _(),
          toolCalls: A,
          toolCallDraft: !0
        });
      };
      f.on("text", (A, w) => {
        g = w || "", Jr(e, {
          text: g,
          thoughts: _(),
          ...y().length ? {
            toolCalls: y(),
            toolCallDraft: !0
          } : {}
        });
      }), f.on("thinking", (A, w) => {
        p.set("thinking:0", w || ""), Jr(e, {
          thoughts: _(),
          ...y().length ? {
            text: g,
            toolCalls: y(),
            toolCallDraft: !0
          } : {}
        });
      }), f.on("streamEvent", (A) => {
        if (A?.type === "content_block_start" && A.content_block?.type === "tool_use") {
          const w = A.content_block.input && typeof A.content_block.input == "object" ? A.content_block.input : {};
          m.set(A.index, {
            id: A.content_block.id || `anthropic-tool-draft-${A.index + 1}`,
            name: A.content_block.name || "工具调用",
            inputJson: Object.keys(w).length ? JSON.stringify(w) : ""
          }), E();
          return;
        }
        if (A?.type === "content_block_delta" && A.delta?.type === "input_json_delta") {
          const w = m.get(A.index) || {
            id: `anthropic-tool-draft-${A.index + 1}`,
            name: "工具调用",
            inputJson: ""
          };
          m.set(A.index, {
            ...w,
            inputJson: `${w.inputJson || ""}${A.delta.partial_json || ""}`
          }), E();
        }
      }), f.on("contentBlock", (A) => {
        A?.type === "redacted_thinking" && (p.set("redacted:0", A.data || ""), Jr(e, {
          thoughts: _(),
          ...y().length ? {
            text: g,
            toolCalls: y(),
            toolCallDraft: !0
          } : {}
        }));
      }), i = await f.finalMessage();
    } else i = await this.client.messages.create(r, { signal: e.signal });
    const s = (i.content || []).filter((f) => f.type === "tool_use" && f.name).map((f, p) => ({
      id: f.id || `anthropic-tool-${p + 1}`,
      name: f.name,
      arguments: JSON.stringify(f.input || {})
    })), u = (i.content || []).filter((f) => f.type === "text").map((f) => f.text || "").join(`
`), c = z(n) ? (i.content || []).filter((f) => f.type === "thinking" || f.type === "redacted_thinking").map((f) => ({
      label: f.type === "thinking" ? "思考块" : "已脱敏思考块",
      text: f.type === "thinking" ? f.thinking || "" : f.data || ""
    })).filter((f) => f.text) : [], d = at("anthropic", i.stop_reason, !1, u), h = i.usage;
    return console.info(g_, {
      messageId: i.id,
      model: i.model || this.config.model,
      usage: h
    }), {
      text: u,
      toolCalls: s,
      thoughts: c,
      finishReason: d,
      usage: h,
      model: i.model || this.config.model,
      provider: "anthropic",
      providerPayload: E_(i),
      requestInspection: o
    };
  }
}, R_ = /* @__PURE__ */ Go(((e, t) => {
  function n(r, o) {
    typeof o == "boolean" && (o = { forever: o }), this._originalTimeouts = JSON.parse(JSON.stringify(r)), this._timeouts = r, this._options = o || {}, this._maxRetryTime = o && o.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._timer = null, this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0));
  }
  t.exports = n, n.prototype.reset = function() {
    this._attempts = 1, this._timeouts = this._originalTimeouts.slice(0);
  }, n.prototype.stop = function() {
    this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), this._timeouts = [], this._cachedTimeouts = null;
  }, n.prototype.retry = function(r) {
    if (this._timeout && clearTimeout(this._timeout), !r) return !1;
    var o = (/* @__PURE__ */ new Date()).getTime();
    if (r && o - this._operationStart >= this._maxRetryTime)
      return this._errors.push(r), this._errors.unshift(/* @__PURE__ */ new Error("RetryOperation timeout occurred")), !1;
    this._errors.push(r);
    var i = this._timeouts.shift();
    if (i === void 0) if (this._cachedTimeouts)
      this._errors.splice(0, this._errors.length - 1), i = this._cachedTimeouts.slice(-1);
    else return !1;
    var s = this;
    return this._timer = setTimeout(function() {
      s._attempts++, s._operationTimeoutCb && (s._timeout = setTimeout(function() {
        s._operationTimeoutCb(s._attempts);
      }, s._operationTimeout), s._options.unref && s._timeout.unref()), s._fn(s._attempts);
    }, i), this._options.unref && this._timer.unref(), !0;
  }, n.prototype.attempt = function(r, o) {
    this._fn = r, o && (o.timeout && (this._operationTimeout = o.timeout), o.cb && (this._operationTimeoutCb = o.cb));
    var i = this;
    this._operationTimeoutCb && (this._timeout = setTimeout(function() {
      i._operationTimeoutCb();
    }, i._operationTimeout)), this._operationStart = (/* @__PURE__ */ new Date()).getTime(), this._fn(this._attempts);
  }, n.prototype.try = function(r) {
    this.attempt(r);
  }, n.prototype.start = function(r) {
    this.attempt(r);
  }, n.prototype.start = n.prototype.try, n.prototype.errors = function() {
    return this._errors;
  }, n.prototype.attempts = function() {
    return this._attempts;
  }, n.prototype.mainError = function() {
    if (this._errors.length === 0) return null;
    for (var r = {}, o = null, i = 0, s = 0; s < this._errors.length; s++) {
      var u = this._errors[s], c = u.message, d = (r[c] || 0) + 1;
      r[c] = d, d >= i && (o = u, i = d);
    }
    return o;
  };
})), P_ = /* @__PURE__ */ Go(((e) => {
  var t = R_();
  e.operation = function(n) {
    return new t(e.timeouts(n), {
      forever: n && (n.forever || n.retries === 1 / 0),
      unref: n && n.unref,
      maxRetryTime: n && n.maxRetryTime
    });
  }, e.timeouts = function(n) {
    if (n instanceof Array) return [].concat(n);
    var r = {
      retries: 10,
      factor: 2,
      minTimeout: 1 * 1e3,
      maxTimeout: 1 / 0,
      randomize: !1
    };
    for (var o in n) r[o] = n[o];
    if (r.minTimeout > r.maxTimeout) throw new Error("minTimeout is greater than maxTimeout");
    for (var i = [], s = 0; s < r.retries; s++) i.push(this.createTimeout(s, r));
    return n && n.forever && !i.length && i.push(this.createTimeout(s, r)), i.sort(function(u, c) {
      return u - c;
    }), i;
  }, e.createTimeout = function(n, r) {
    var o = r.randomize ? Math.random() + 1 : 1, i = Math.round(o * Math.max(r.minTimeout, 1) * Math.pow(r.factor, n));
    return i = Math.min(i, r.maxTimeout), i;
  }, e.wrap = function(n, r, o) {
    if (r instanceof Array && (o = r, r = null), !o) {
      o = [];
      for (var i in n) typeof n[i] == "function" && o.push(i);
    }
    for (var s = 0; s < o.length; s++) {
      var u = o[s], c = n[u];
      n[u] = function(h) {
        var f = e.operation(r), p = Array.prototype.slice.call(arguments, 1), m = p.pop();
        p.push(function(g) {
          f.retry(g) || (g && (arguments[0] = f.mainError()), m.apply(this, arguments));
        }), f.attempt(function() {
          h.apply(n, p);
        });
      }.bind(n, c), n[u].options = r;
    }
  };
})), M_ = /* @__PURE__ */ Go(((e, t) => {
  t.exports = P_();
})), x_ = /* @__PURE__ */ Go(((e, t) => {
  var n = M_(), r = [
    "Failed to fetch",
    "NetworkError when attempting to fetch resource.",
    "The Internet connection appears to be offline.",
    "Network request failed"
  ], o = class extends Error {
    constructor(c) {
      super(), c instanceof Error ? (this.originalError = c, { message: c } = c) : (this.originalError = new Error(c), this.originalError.stack = this.stack), this.name = "AbortError", this.message = c;
    }
  }, i = (c, d, h) => {
    const f = h.retries - (d - 1);
    return c.attemptNumber = d, c.retriesLeft = f, c;
  }, s = (c) => r.includes(c), u = (c, d) => new Promise((h, f) => {
    d = {
      onFailedAttempt: () => {
      },
      retries: 10,
      ...d
    };
    const p = n.operation(d);
    p.attempt(async (m) => {
      try {
        h(await c(m));
      } catch (g) {
        if (!(g instanceof Error)) {
          f(/* @__PURE__ */ new TypeError(`Non-error was thrown: "${g}". You should only throw errors.`));
          return;
        }
        if (g instanceof o)
          p.stop(), f(g.originalError);
        else if (g instanceof TypeError && !s(g.message))
          p.stop(), f(g);
        else {
          i(g, m, d);
          try {
            await d.onFailedAttempt(g);
          } catch (_) {
            f(_);
            return;
          }
          p.retry(g) || f(p.mainError());
        }
      }
    });
  });
  t.exports = u, t.exports.default = u, t.exports.AbortError = o;
})), wl = /* @__PURE__ */ Xm(x_(), 1), N_ = void 0, k_ = void 0;
function D_() {
  return {
    geminiUrl: N_,
    vertexUrl: k_
  };
}
function $_(e, t, n, r) {
  var o, i;
  if (!e?.baseUrl) {
    const s = D_();
    return t ? (o = s.vertexUrl) !== null && o !== void 0 ? o : n : (i = s.geminiUrl) !== null && i !== void 0 ? i : r;
  }
  return e.baseUrl;
}
var dt = class {
};
function N(e, t) {
  return e.replace(/\{([^}]+)\}/g, (n, r) => {
    if (Object.prototype.hasOwnProperty.call(t, r)) {
      const o = t[r];
      return o != null ? String(o) : "";
    } else throw new Error(`Key '${r}' not found in valueMap.`);
  });
}
function l(e, t, n) {
  for (let i = 0; i < t.length - 1; i++) {
    const s = t[i];
    if (s.endsWith("[]")) {
      const u = s.slice(0, -2);
      if (!(u in e)) if (Array.isArray(n)) e[u] = Array.from({ length: n.length }, () => ({}));
      else throw new Error(`Value must be a list given an array path ${s}`);
      if (Array.isArray(e[u])) {
        const c = e[u];
        if (Array.isArray(n)) for (let d = 0; d < c.length; d++) {
          const h = c[d];
          l(h, t.slice(i + 1), n[d]);
        }
        else for (const d of c) l(d, t.slice(i + 1), n);
      }
      return;
    } else if (s.endsWith("[0]")) {
      const u = s.slice(0, -3);
      u in e || (e[u] = [{}]);
      const c = e[u];
      l(c[0], t.slice(i + 1), n);
      return;
    }
    (!e[s] || typeof e[s] != "object") && (e[s] = {}), e = e[s];
  }
  const r = t[t.length - 1], o = e[r];
  if (o !== void 0) {
    if (!n || typeof n == "object" && Object.keys(n).length === 0 || n === o) return;
    if (typeof o == "object" && typeof n == "object" && o !== null && n !== null) Object.assign(o, n);
    else throw new Error(`Cannot set value for an existing key. Key: ${r}`);
  } else r === "_self" && typeof n == "object" && n !== null && !Array.isArray(n) ? Object.assign(e, n) : e[r] = n;
}
function a(e, t, n = void 0) {
  try {
    if (t.length === 1 && t[0] === "_self") return e;
    for (let r = 0; r < t.length; r++) {
      if (typeof e != "object" || e === null) return n;
      const o = t[r];
      if (o.endsWith("[]")) {
        const i = o.slice(0, -2);
        if (i in e) {
          const s = e[i];
          return Array.isArray(s) ? s.map((u) => a(u, t.slice(r + 1), n)) : n;
        } else return n;
      } else e = e[o];
    }
    return e;
  } catch (r) {
    if (r instanceof TypeError) return n;
    throw r;
  }
}
function L_(e, t) {
  for (const [n, r] of Object.entries(t)) {
    const o = n.split("."), i = r.split("."), s = /* @__PURE__ */ new Set();
    let u = -1;
    for (let c = 0; c < o.length; c++) if (o[c] === "*") {
      u = c;
      break;
    }
    if (u !== -1 && i.length > u) for (let c = u; c < i.length; c++) {
      const d = i[c];
      d !== "*" && !d.endsWith("[]") && !d.endsWith("[0]") && s.add(d);
    }
    zi(e, o, i, 0, s);
  }
}
function zi(e, t, n, r, o) {
  if (r >= t.length || typeof e != "object" || e === null) return;
  const i = t[r];
  if (i.endsWith("[]")) {
    const s = i.slice(0, -2), u = e;
    if (s in u && Array.isArray(u[s])) for (const c of u[s]) zi(c, t, n, r + 1, o);
  } else if (i === "*") {
    if (typeof e == "object" && e !== null && !Array.isArray(e)) {
      const s = e, u = Object.keys(s).filter((d) => !d.startsWith("_") && !o.has(d)), c = {};
      for (const d of u) c[d] = s[d];
      for (const [d, h] of Object.entries(c)) {
        const f = [];
        for (const p of n.slice(r)) p === "*" ? f.push(d) : f.push(p);
        l(s, f, h);
      }
      for (const d of u) delete s[d];
    }
  } else {
    const s = e;
    i in s && zi(s[i], t, n, r + 1, o);
  }
}
function js(e) {
  if (typeof e != "string") throw new Error("fromImageBytes must be a string");
  return e;
}
function U_(e) {
  const t = {}, n = a(e, ["operationName"]);
  n != null && l(t, ["operationName"], n);
  const r = a(e, ["resourceName"]);
  return r != null && l(t, ["_url", "resourceName"], r), t;
}
function F_(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["metadata"]);
  r != null && l(t, ["metadata"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  i != null && l(t, ["error"], i);
  const s = a(e, ["response", "generateVideoResponse"]);
  return s != null && l(t, ["response"], G_(s)), t;
}
function O_(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["metadata"]);
  r != null && l(t, ["metadata"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  i != null && l(t, ["error"], i);
  const s = a(e, ["response"]);
  return s != null && l(t, ["response"], B_(s)), t;
}
function G_(e) {
  const t = {}, n = a(e, ["generatedSamples"]);
  if (n != null) {
    let i = n;
    Array.isArray(i) && (i = i.map((s) => q_(s))), l(t, ["generatedVideos"], i);
  }
  const r = a(e, ["raiMediaFilteredCount"]);
  r != null && l(t, ["raiMediaFilteredCount"], r);
  const o = a(e, ["raiMediaFilteredReasons"]);
  return o != null && l(t, ["raiMediaFilteredReasons"], o), t;
}
function B_(e) {
  const t = {}, n = a(e, ["videos"]);
  if (n != null) {
    let i = n;
    Array.isArray(i) && (i = i.map((s) => H_(s))), l(t, ["generatedVideos"], i);
  }
  const r = a(e, ["raiMediaFilteredCount"]);
  r != null && l(t, ["raiMediaFilteredCount"], r);
  const o = a(e, ["raiMediaFilteredReasons"]);
  return o != null && l(t, ["raiMediaFilteredReasons"], o), t;
}
function q_(e) {
  const t = {}, n = a(e, ["video"]);
  return n != null && l(t, ["video"], Y_(n)), t;
}
function H_(e) {
  const t = {}, n = a(e, ["_self"]);
  return n != null && l(t, ["video"], X_(n)), t;
}
function V_(e) {
  const t = {}, n = a(e, ["operationName"]);
  return n != null && l(t, ["_url", "operationName"], n), t;
}
function J_(e) {
  const t = {}, n = a(e, ["operationName"]);
  return n != null && l(t, ["_url", "operationName"], n), t;
}
function K_(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["metadata"]);
  r != null && l(t, ["metadata"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  i != null && l(t, ["error"], i);
  const s = a(e, ["response"]);
  return s != null && l(t, ["response"], W_(s)), t;
}
function W_(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["parent"]);
  r != null && l(t, ["parent"], r);
  const o = a(e, ["documentName"]);
  return o != null && l(t, ["documentName"], o), t;
}
function Cf(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["metadata"]);
  r != null && l(t, ["metadata"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  i != null && l(t, ["error"], i);
  const s = a(e, ["response"]);
  return s != null && l(t, ["response"], z_(s)), t;
}
function z_(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["parent"]);
  r != null && l(t, ["parent"], r);
  const o = a(e, ["documentName"]);
  return o != null && l(t, ["documentName"], o), t;
}
function Y_(e) {
  const t = {}, n = a(e, ["uri"]);
  n != null && l(t, ["uri"], n);
  const r = a(e, ["encodedVideo"]);
  r != null && l(t, ["videoBytes"], js(r));
  const o = a(e, ["encoding"]);
  return o != null && l(t, ["mimeType"], o), t;
}
function X_(e) {
  const t = {}, n = a(e, ["gcsUri"]);
  n != null && l(t, ["uri"], n);
  const r = a(e, ["bytesBase64Encoded"]);
  r != null && l(t, ["videoBytes"], js(r));
  const o = a(e, ["mimeType"]);
  return o != null && l(t, ["mimeType"], o), t;
}
var Il;
(function(e) {
  e.LANGUAGE_UNSPECIFIED = "LANGUAGE_UNSPECIFIED", e.PYTHON = "PYTHON";
})(Il || (Il = {}));
var bl;
(function(e) {
  e.OUTCOME_UNSPECIFIED = "OUTCOME_UNSPECIFIED", e.OUTCOME_OK = "OUTCOME_OK", e.OUTCOME_FAILED = "OUTCOME_FAILED", e.OUTCOME_DEADLINE_EXCEEDED = "OUTCOME_DEADLINE_EXCEEDED";
})(bl || (bl = {}));
var Rl;
(function(e) {
  e.SCHEDULING_UNSPECIFIED = "SCHEDULING_UNSPECIFIED", e.SILENT = "SILENT", e.WHEN_IDLE = "WHEN_IDLE", e.INTERRUPT = "INTERRUPT";
})(Rl || (Rl = {}));
var Tt;
(function(e) {
  e.TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED", e.STRING = "STRING", e.NUMBER = "NUMBER", e.INTEGER = "INTEGER", e.BOOLEAN = "BOOLEAN", e.ARRAY = "ARRAY", e.OBJECT = "OBJECT", e.NULL = "NULL";
})(Tt || (Tt = {}));
var Pl;
(function(e) {
  e.ENVIRONMENT_UNSPECIFIED = "ENVIRONMENT_UNSPECIFIED", e.ENVIRONMENT_BROWSER = "ENVIRONMENT_BROWSER";
})(Pl || (Pl = {}));
var Ml;
(function(e) {
  e.AUTH_TYPE_UNSPECIFIED = "AUTH_TYPE_UNSPECIFIED", e.NO_AUTH = "NO_AUTH", e.API_KEY_AUTH = "API_KEY_AUTH", e.HTTP_BASIC_AUTH = "HTTP_BASIC_AUTH", e.GOOGLE_SERVICE_ACCOUNT_AUTH = "GOOGLE_SERVICE_ACCOUNT_AUTH", e.OAUTH = "OAUTH", e.OIDC_AUTH = "OIDC_AUTH";
})(Ml || (Ml = {}));
var xl;
(function(e) {
  e.HTTP_IN_UNSPECIFIED = "HTTP_IN_UNSPECIFIED", e.HTTP_IN_QUERY = "HTTP_IN_QUERY", e.HTTP_IN_HEADER = "HTTP_IN_HEADER", e.HTTP_IN_PATH = "HTTP_IN_PATH", e.HTTP_IN_BODY = "HTTP_IN_BODY", e.HTTP_IN_COOKIE = "HTTP_IN_COOKIE";
})(xl || (xl = {}));
var Nl;
(function(e) {
  e.API_SPEC_UNSPECIFIED = "API_SPEC_UNSPECIFIED", e.SIMPLE_SEARCH = "SIMPLE_SEARCH", e.ELASTIC_SEARCH = "ELASTIC_SEARCH";
})(Nl || (Nl = {}));
var kl;
(function(e) {
  e.PHISH_BLOCK_THRESHOLD_UNSPECIFIED = "PHISH_BLOCK_THRESHOLD_UNSPECIFIED", e.BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE", e.BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE", e.BLOCK_HIGH_AND_ABOVE = "BLOCK_HIGH_AND_ABOVE", e.BLOCK_HIGHER_AND_ABOVE = "BLOCK_HIGHER_AND_ABOVE", e.BLOCK_VERY_HIGH_AND_ABOVE = "BLOCK_VERY_HIGH_AND_ABOVE", e.BLOCK_ONLY_EXTREMELY_HIGH = "BLOCK_ONLY_EXTREMELY_HIGH";
})(kl || (kl = {}));
var Dl;
(function(e) {
  e.UNSPECIFIED = "UNSPECIFIED", e.BLOCKING = "BLOCKING", e.NON_BLOCKING = "NON_BLOCKING";
})(Dl || (Dl = {}));
var $l;
(function(e) {
  e.MODE_UNSPECIFIED = "MODE_UNSPECIFIED", e.MODE_DYNAMIC = "MODE_DYNAMIC";
})($l || ($l = {}));
var en;
(function(e) {
  e.MODE_UNSPECIFIED = "MODE_UNSPECIFIED", e.AUTO = "AUTO", e.ANY = "ANY", e.NONE = "NONE", e.VALIDATED = "VALIDATED";
})(en || (en = {}));
var tn;
(function(e) {
  e.THINKING_LEVEL_UNSPECIFIED = "THINKING_LEVEL_UNSPECIFIED", e.MINIMAL = "MINIMAL", e.LOW = "LOW", e.MEDIUM = "MEDIUM", e.HIGH = "HIGH";
})(tn || (tn = {}));
var Ll;
(function(e) {
  e.DONT_ALLOW = "DONT_ALLOW", e.ALLOW_ADULT = "ALLOW_ADULT", e.ALLOW_ALL = "ALLOW_ALL";
})(Ll || (Ll = {}));
var Ul;
(function(e) {
  e.PROMINENT_PEOPLE_UNSPECIFIED = "PROMINENT_PEOPLE_UNSPECIFIED", e.ALLOW_PROMINENT_PEOPLE = "ALLOW_PROMINENT_PEOPLE", e.BLOCK_PROMINENT_PEOPLE = "BLOCK_PROMINENT_PEOPLE";
})(Ul || (Ul = {}));
var Fl;
(function(e) {
  e.HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED", e.HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT", e.HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH", e.HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT", e.HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT", e.HARM_CATEGORY_CIVIC_INTEGRITY = "HARM_CATEGORY_CIVIC_INTEGRITY", e.HARM_CATEGORY_IMAGE_HATE = "HARM_CATEGORY_IMAGE_HATE", e.HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT = "HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT", e.HARM_CATEGORY_IMAGE_HARASSMENT = "HARM_CATEGORY_IMAGE_HARASSMENT", e.HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT = "HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT", e.HARM_CATEGORY_JAILBREAK = "HARM_CATEGORY_JAILBREAK";
})(Fl || (Fl = {}));
var Ol;
(function(e) {
  e.HARM_BLOCK_METHOD_UNSPECIFIED = "HARM_BLOCK_METHOD_UNSPECIFIED", e.SEVERITY = "SEVERITY", e.PROBABILITY = "PROBABILITY";
})(Ol || (Ol = {}));
var Gl;
(function(e) {
  e.HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED", e.BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE", e.BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE", e.BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH", e.BLOCK_NONE = "BLOCK_NONE", e.OFF = "OFF";
})(Gl || (Gl = {}));
var Bl;
(function(e) {
  e.FINISH_REASON_UNSPECIFIED = "FINISH_REASON_UNSPECIFIED", e.STOP = "STOP", e.MAX_TOKENS = "MAX_TOKENS", e.SAFETY = "SAFETY", e.RECITATION = "RECITATION", e.LANGUAGE = "LANGUAGE", e.OTHER = "OTHER", e.BLOCKLIST = "BLOCKLIST", e.PROHIBITED_CONTENT = "PROHIBITED_CONTENT", e.SPII = "SPII", e.MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL", e.IMAGE_SAFETY = "IMAGE_SAFETY", e.UNEXPECTED_TOOL_CALL = "UNEXPECTED_TOOL_CALL", e.IMAGE_PROHIBITED_CONTENT = "IMAGE_PROHIBITED_CONTENT", e.NO_IMAGE = "NO_IMAGE", e.IMAGE_RECITATION = "IMAGE_RECITATION", e.IMAGE_OTHER = "IMAGE_OTHER";
})(Bl || (Bl = {}));
var ql;
(function(e) {
  e.HARM_PROBABILITY_UNSPECIFIED = "HARM_PROBABILITY_UNSPECIFIED", e.NEGLIGIBLE = "NEGLIGIBLE", e.LOW = "LOW", e.MEDIUM = "MEDIUM", e.HIGH = "HIGH";
})(ql || (ql = {}));
var Hl;
(function(e) {
  e.HARM_SEVERITY_UNSPECIFIED = "HARM_SEVERITY_UNSPECIFIED", e.HARM_SEVERITY_NEGLIGIBLE = "HARM_SEVERITY_NEGLIGIBLE", e.HARM_SEVERITY_LOW = "HARM_SEVERITY_LOW", e.HARM_SEVERITY_MEDIUM = "HARM_SEVERITY_MEDIUM", e.HARM_SEVERITY_HIGH = "HARM_SEVERITY_HIGH";
})(Hl || (Hl = {}));
var Vl;
(function(e) {
  e.URL_RETRIEVAL_STATUS_UNSPECIFIED = "URL_RETRIEVAL_STATUS_UNSPECIFIED", e.URL_RETRIEVAL_STATUS_SUCCESS = "URL_RETRIEVAL_STATUS_SUCCESS", e.URL_RETRIEVAL_STATUS_ERROR = "URL_RETRIEVAL_STATUS_ERROR", e.URL_RETRIEVAL_STATUS_PAYWALL = "URL_RETRIEVAL_STATUS_PAYWALL", e.URL_RETRIEVAL_STATUS_UNSAFE = "URL_RETRIEVAL_STATUS_UNSAFE";
})(Vl || (Vl = {}));
var Jl;
(function(e) {
  e.BLOCKED_REASON_UNSPECIFIED = "BLOCKED_REASON_UNSPECIFIED", e.SAFETY = "SAFETY", e.OTHER = "OTHER", e.BLOCKLIST = "BLOCKLIST", e.PROHIBITED_CONTENT = "PROHIBITED_CONTENT", e.IMAGE_SAFETY = "IMAGE_SAFETY", e.MODEL_ARMOR = "MODEL_ARMOR", e.JAILBREAK = "JAILBREAK";
})(Jl || (Jl = {}));
var Kl;
(function(e) {
  e.TRAFFIC_TYPE_UNSPECIFIED = "TRAFFIC_TYPE_UNSPECIFIED", e.ON_DEMAND = "ON_DEMAND", e.ON_DEMAND_PRIORITY = "ON_DEMAND_PRIORITY", e.ON_DEMAND_FLEX = "ON_DEMAND_FLEX", e.PROVISIONED_THROUGHPUT = "PROVISIONED_THROUGHPUT";
})(Kl || (Kl = {}));
var Eo;
(function(e) {
  e.MODALITY_UNSPECIFIED = "MODALITY_UNSPECIFIED", e.TEXT = "TEXT", e.IMAGE = "IMAGE", e.AUDIO = "AUDIO", e.VIDEO = "VIDEO";
})(Eo || (Eo = {}));
var Wl;
(function(e) {
  e.MODEL_STAGE_UNSPECIFIED = "MODEL_STAGE_UNSPECIFIED", e.UNSTABLE_EXPERIMENTAL = "UNSTABLE_EXPERIMENTAL", e.EXPERIMENTAL = "EXPERIMENTAL", e.PREVIEW = "PREVIEW", e.STABLE = "STABLE", e.LEGACY = "LEGACY", e.DEPRECATED = "DEPRECATED", e.RETIRED = "RETIRED";
})(Wl || (Wl = {}));
var zl;
(function(e) {
  e.MEDIA_RESOLUTION_UNSPECIFIED = "MEDIA_RESOLUTION_UNSPECIFIED", e.MEDIA_RESOLUTION_LOW = "MEDIA_RESOLUTION_LOW", e.MEDIA_RESOLUTION_MEDIUM = "MEDIA_RESOLUTION_MEDIUM", e.MEDIA_RESOLUTION_HIGH = "MEDIA_RESOLUTION_HIGH";
})(zl || (zl = {}));
var Yl;
(function(e) {
  e.TUNING_MODE_UNSPECIFIED = "TUNING_MODE_UNSPECIFIED", e.TUNING_MODE_FULL = "TUNING_MODE_FULL", e.TUNING_MODE_PEFT_ADAPTER = "TUNING_MODE_PEFT_ADAPTER";
})(Yl || (Yl = {}));
var Xl;
(function(e) {
  e.ADAPTER_SIZE_UNSPECIFIED = "ADAPTER_SIZE_UNSPECIFIED", e.ADAPTER_SIZE_ONE = "ADAPTER_SIZE_ONE", e.ADAPTER_SIZE_TWO = "ADAPTER_SIZE_TWO", e.ADAPTER_SIZE_FOUR = "ADAPTER_SIZE_FOUR", e.ADAPTER_SIZE_EIGHT = "ADAPTER_SIZE_EIGHT", e.ADAPTER_SIZE_SIXTEEN = "ADAPTER_SIZE_SIXTEEN", e.ADAPTER_SIZE_THIRTY_TWO = "ADAPTER_SIZE_THIRTY_TWO";
})(Xl || (Xl = {}));
var Yi;
(function(e) {
  e.JOB_STATE_UNSPECIFIED = "JOB_STATE_UNSPECIFIED", e.JOB_STATE_QUEUED = "JOB_STATE_QUEUED", e.JOB_STATE_PENDING = "JOB_STATE_PENDING", e.JOB_STATE_RUNNING = "JOB_STATE_RUNNING", e.JOB_STATE_SUCCEEDED = "JOB_STATE_SUCCEEDED", e.JOB_STATE_FAILED = "JOB_STATE_FAILED", e.JOB_STATE_CANCELLING = "JOB_STATE_CANCELLING", e.JOB_STATE_CANCELLED = "JOB_STATE_CANCELLED", e.JOB_STATE_PAUSED = "JOB_STATE_PAUSED", e.JOB_STATE_EXPIRED = "JOB_STATE_EXPIRED", e.JOB_STATE_UPDATING = "JOB_STATE_UPDATING", e.JOB_STATE_PARTIALLY_SUCCEEDED = "JOB_STATE_PARTIALLY_SUCCEEDED";
})(Yi || (Yi = {}));
var Ql;
(function(e) {
  e.TUNING_JOB_STATE_UNSPECIFIED = "TUNING_JOB_STATE_UNSPECIFIED", e.TUNING_JOB_STATE_WAITING_FOR_QUOTA = "TUNING_JOB_STATE_WAITING_FOR_QUOTA", e.TUNING_JOB_STATE_PROCESSING_DATASET = "TUNING_JOB_STATE_PROCESSING_DATASET", e.TUNING_JOB_STATE_WAITING_FOR_CAPACITY = "TUNING_JOB_STATE_WAITING_FOR_CAPACITY", e.TUNING_JOB_STATE_TUNING = "TUNING_JOB_STATE_TUNING", e.TUNING_JOB_STATE_POST_PROCESSING = "TUNING_JOB_STATE_POST_PROCESSING";
})(Ql || (Ql = {}));
var Zl;
(function(e) {
  e.AGGREGATION_METRIC_UNSPECIFIED = "AGGREGATION_METRIC_UNSPECIFIED", e.AVERAGE = "AVERAGE", e.MODE = "MODE", e.STANDARD_DEVIATION = "STANDARD_DEVIATION", e.VARIANCE = "VARIANCE", e.MINIMUM = "MINIMUM", e.MAXIMUM = "MAXIMUM", e.MEDIAN = "MEDIAN", e.PERCENTILE_P90 = "PERCENTILE_P90", e.PERCENTILE_P95 = "PERCENTILE_P95", e.PERCENTILE_P99 = "PERCENTILE_P99";
})(Zl || (Zl = {}));
var jl;
(function(e) {
  e.PAIRWISE_CHOICE_UNSPECIFIED = "PAIRWISE_CHOICE_UNSPECIFIED", e.BASELINE = "BASELINE", e.CANDIDATE = "CANDIDATE", e.TIE = "TIE";
})(jl || (jl = {}));
var eu;
(function(e) {
  e.TUNING_TASK_UNSPECIFIED = "TUNING_TASK_UNSPECIFIED", e.TUNING_TASK_I2V = "TUNING_TASK_I2V", e.TUNING_TASK_T2V = "TUNING_TASK_T2V", e.TUNING_TASK_R2V = "TUNING_TASK_R2V";
})(eu || (eu = {}));
var tu;
(function(e) {
  e.STATE_UNSPECIFIED = "STATE_UNSPECIFIED", e.STATE_PENDING = "STATE_PENDING", e.STATE_ACTIVE = "STATE_ACTIVE", e.STATE_FAILED = "STATE_FAILED";
})(tu || (tu = {}));
var nu;
(function(e) {
  e.MEDIA_RESOLUTION_UNSPECIFIED = "MEDIA_RESOLUTION_UNSPECIFIED", e.MEDIA_RESOLUTION_LOW = "MEDIA_RESOLUTION_LOW", e.MEDIA_RESOLUTION_MEDIUM = "MEDIA_RESOLUTION_MEDIUM", e.MEDIA_RESOLUTION_HIGH = "MEDIA_RESOLUTION_HIGH", e.MEDIA_RESOLUTION_ULTRA_HIGH = "MEDIA_RESOLUTION_ULTRA_HIGH";
})(nu || (nu = {}));
var ru;
(function(e) {
  e.TOOL_TYPE_UNSPECIFIED = "TOOL_TYPE_UNSPECIFIED", e.GOOGLE_SEARCH_WEB = "GOOGLE_SEARCH_WEB", e.GOOGLE_SEARCH_IMAGE = "GOOGLE_SEARCH_IMAGE", e.URL_CONTEXT = "URL_CONTEXT", e.GOOGLE_MAPS = "GOOGLE_MAPS", e.FILE_SEARCH = "FILE_SEARCH";
})(ru || (ru = {}));
var Xi;
(function(e) {
  e.COLLECTION = "COLLECTION";
})(Xi || (Xi = {}));
var ou;
(function(e) {
  e.UNSPECIFIED = "unspecified", e.FLEX = "flex", e.STANDARD = "standard", e.PRIORITY = "priority";
})(ou || (ou = {}));
var iu;
(function(e) {
  e.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED = "FEATURE_SELECTION_PREFERENCE_UNSPECIFIED", e.PRIORITIZE_QUALITY = "PRIORITIZE_QUALITY", e.BALANCED = "BALANCED", e.PRIORITIZE_COST = "PRIORITIZE_COST";
})(iu || (iu = {}));
var Co;
(function(e) {
  e.PREDICT = "PREDICT", e.EMBED_CONTENT = "EMBED_CONTENT";
})(Co || (Co = {}));
var su;
(function(e) {
  e.BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE", e.BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE", e.BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH", e.BLOCK_NONE = "BLOCK_NONE";
})(su || (su = {}));
var au;
(function(e) {
  e.auto = "auto", e.en = "en", e.ja = "ja", e.ko = "ko", e.hi = "hi", e.zh = "zh", e.pt = "pt", e.es = "es";
})(au || (au = {}));
var lu;
(function(e) {
  e.MASK_MODE_DEFAULT = "MASK_MODE_DEFAULT", e.MASK_MODE_USER_PROVIDED = "MASK_MODE_USER_PROVIDED", e.MASK_MODE_BACKGROUND = "MASK_MODE_BACKGROUND", e.MASK_MODE_FOREGROUND = "MASK_MODE_FOREGROUND", e.MASK_MODE_SEMANTIC = "MASK_MODE_SEMANTIC";
})(lu || (lu = {}));
var uu;
(function(e) {
  e.CONTROL_TYPE_DEFAULT = "CONTROL_TYPE_DEFAULT", e.CONTROL_TYPE_CANNY = "CONTROL_TYPE_CANNY", e.CONTROL_TYPE_SCRIBBLE = "CONTROL_TYPE_SCRIBBLE", e.CONTROL_TYPE_FACE_MESH = "CONTROL_TYPE_FACE_MESH";
})(uu || (uu = {}));
var cu;
(function(e) {
  e.SUBJECT_TYPE_DEFAULT = "SUBJECT_TYPE_DEFAULT", e.SUBJECT_TYPE_PERSON = "SUBJECT_TYPE_PERSON", e.SUBJECT_TYPE_ANIMAL = "SUBJECT_TYPE_ANIMAL", e.SUBJECT_TYPE_PRODUCT = "SUBJECT_TYPE_PRODUCT";
})(cu || (cu = {}));
var du;
(function(e) {
  e.EDIT_MODE_DEFAULT = "EDIT_MODE_DEFAULT", e.EDIT_MODE_INPAINT_REMOVAL = "EDIT_MODE_INPAINT_REMOVAL", e.EDIT_MODE_INPAINT_INSERTION = "EDIT_MODE_INPAINT_INSERTION", e.EDIT_MODE_OUTPAINT = "EDIT_MODE_OUTPAINT", e.EDIT_MODE_CONTROLLED_EDITING = "EDIT_MODE_CONTROLLED_EDITING", e.EDIT_MODE_STYLE = "EDIT_MODE_STYLE", e.EDIT_MODE_BGSWAP = "EDIT_MODE_BGSWAP", e.EDIT_MODE_PRODUCT_IMAGE = "EDIT_MODE_PRODUCT_IMAGE";
})(du || (du = {}));
var fu;
(function(e) {
  e.FOREGROUND = "FOREGROUND", e.BACKGROUND = "BACKGROUND", e.PROMPT = "PROMPT", e.SEMANTIC = "SEMANTIC", e.INTERACTIVE = "INTERACTIVE";
})(fu || (fu = {}));
var hu;
(function(e) {
  e.ASSET = "ASSET", e.STYLE = "STYLE";
})(hu || (hu = {}));
var pu;
(function(e) {
  e.INSERT = "INSERT", e.REMOVE = "REMOVE", e.REMOVE_STATIC = "REMOVE_STATIC", e.OUTPAINT = "OUTPAINT";
})(pu || (pu = {}));
var mu;
(function(e) {
  e.OPTIMIZED = "OPTIMIZED", e.LOSSLESS = "LOSSLESS";
})(mu || (mu = {}));
var gu;
(function(e) {
  e.SUPERVISED_FINE_TUNING = "SUPERVISED_FINE_TUNING", e.PREFERENCE_TUNING = "PREFERENCE_TUNING", e.DISTILLATION = "DISTILLATION";
})(gu || (gu = {}));
var _u;
(function(e) {
  e.STATE_UNSPECIFIED = "STATE_UNSPECIFIED", e.PROCESSING = "PROCESSING", e.ACTIVE = "ACTIVE", e.FAILED = "FAILED";
})(_u || (_u = {}));
var yu;
(function(e) {
  e.SOURCE_UNSPECIFIED = "SOURCE_UNSPECIFIED", e.UPLOADED = "UPLOADED", e.GENERATED = "GENERATED", e.REGISTERED = "REGISTERED";
})(yu || (yu = {}));
var vu;
(function(e) {
  e.TURN_COMPLETE_REASON_UNSPECIFIED = "TURN_COMPLETE_REASON_UNSPECIFIED", e.MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL", e.RESPONSE_REJECTED = "RESPONSE_REJECTED", e.NEED_MORE_INPUT = "NEED_MORE_INPUT", e.PROHIBITED_INPUT_CONTENT = "PROHIBITED_INPUT_CONTENT", e.IMAGE_PROHIBITED_INPUT_CONTENT = "IMAGE_PROHIBITED_INPUT_CONTENT", e.INPUT_TEXT_CONTAIN_PROMINENT_PERSON_PROHIBITED = "INPUT_TEXT_CONTAIN_PROMINENT_PERSON_PROHIBITED", e.INPUT_IMAGE_CELEBRITY = "INPUT_IMAGE_CELEBRITY", e.INPUT_IMAGE_PHOTO_REALISTIC_CHILD_PROHIBITED = "INPUT_IMAGE_PHOTO_REALISTIC_CHILD_PROHIBITED", e.INPUT_TEXT_NCII_PROHIBITED = "INPUT_TEXT_NCII_PROHIBITED", e.INPUT_OTHER = "INPUT_OTHER", e.INPUT_IP_PROHIBITED = "INPUT_IP_PROHIBITED", e.BLOCKLIST = "BLOCKLIST", e.UNSAFE_PROMPT_FOR_IMAGE_GENERATION = "UNSAFE_PROMPT_FOR_IMAGE_GENERATION", e.GENERATED_IMAGE_SAFETY = "GENERATED_IMAGE_SAFETY", e.GENERATED_CONTENT_SAFETY = "GENERATED_CONTENT_SAFETY", e.GENERATED_AUDIO_SAFETY = "GENERATED_AUDIO_SAFETY", e.GENERATED_VIDEO_SAFETY = "GENERATED_VIDEO_SAFETY", e.GENERATED_CONTENT_PROHIBITED = "GENERATED_CONTENT_PROHIBITED", e.GENERATED_CONTENT_BLOCKLIST = "GENERATED_CONTENT_BLOCKLIST", e.GENERATED_IMAGE_PROHIBITED = "GENERATED_IMAGE_PROHIBITED", e.GENERATED_IMAGE_CELEBRITY = "GENERATED_IMAGE_CELEBRITY", e.GENERATED_IMAGE_PROMINENT_PEOPLE_DETECTED_BY_REWRITER = "GENERATED_IMAGE_PROMINENT_PEOPLE_DETECTED_BY_REWRITER", e.GENERATED_IMAGE_IDENTIFIABLE_PEOPLE = "GENERATED_IMAGE_IDENTIFIABLE_PEOPLE", e.GENERATED_IMAGE_MINORS = "GENERATED_IMAGE_MINORS", e.OUTPUT_IMAGE_IP_PROHIBITED = "OUTPUT_IMAGE_IP_PROHIBITED", e.GENERATED_OTHER = "GENERATED_OTHER", e.MAX_REGENERATION_REACHED = "MAX_REGENERATION_REACHED";
})(vu || (vu = {}));
var Au;
(function(e) {
  e.MODALITY_UNSPECIFIED = "MODALITY_UNSPECIFIED", e.TEXT = "TEXT", e.IMAGE = "IMAGE", e.VIDEO = "VIDEO", e.AUDIO = "AUDIO", e.DOCUMENT = "DOCUMENT";
})(Au || (Au = {}));
var Tu;
(function(e) {
  e.VAD_SIGNAL_TYPE_UNSPECIFIED = "VAD_SIGNAL_TYPE_UNSPECIFIED", e.VAD_SIGNAL_TYPE_SOS = "VAD_SIGNAL_TYPE_SOS", e.VAD_SIGNAL_TYPE_EOS = "VAD_SIGNAL_TYPE_EOS";
})(Tu || (Tu = {}));
var Su;
(function(e) {
  e.TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED", e.ACTIVITY_START = "ACTIVITY_START", e.ACTIVITY_END = "ACTIVITY_END";
})(Su || (Su = {}));
var Eu;
(function(e) {
  e.START_SENSITIVITY_UNSPECIFIED = "START_SENSITIVITY_UNSPECIFIED", e.START_SENSITIVITY_HIGH = "START_SENSITIVITY_HIGH", e.START_SENSITIVITY_LOW = "START_SENSITIVITY_LOW";
})(Eu || (Eu = {}));
var Cu;
(function(e) {
  e.END_SENSITIVITY_UNSPECIFIED = "END_SENSITIVITY_UNSPECIFIED", e.END_SENSITIVITY_HIGH = "END_SENSITIVITY_HIGH", e.END_SENSITIVITY_LOW = "END_SENSITIVITY_LOW";
})(Cu || (Cu = {}));
var wu;
(function(e) {
  e.ACTIVITY_HANDLING_UNSPECIFIED = "ACTIVITY_HANDLING_UNSPECIFIED", e.START_OF_ACTIVITY_INTERRUPTS = "START_OF_ACTIVITY_INTERRUPTS", e.NO_INTERRUPTION = "NO_INTERRUPTION";
})(wu || (wu = {}));
var Iu;
(function(e) {
  e.TURN_COVERAGE_UNSPECIFIED = "TURN_COVERAGE_UNSPECIFIED", e.TURN_INCLUDES_ONLY_ACTIVITY = "TURN_INCLUDES_ONLY_ACTIVITY", e.TURN_INCLUDES_ALL_INPUT = "TURN_INCLUDES_ALL_INPUT", e.TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO = "TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO";
})(Iu || (Iu = {}));
var bu;
(function(e) {
  e.SCALE_UNSPECIFIED = "SCALE_UNSPECIFIED", e.C_MAJOR_A_MINOR = "C_MAJOR_A_MINOR", e.D_FLAT_MAJOR_B_FLAT_MINOR = "D_FLAT_MAJOR_B_FLAT_MINOR", e.D_MAJOR_B_MINOR = "D_MAJOR_B_MINOR", e.E_FLAT_MAJOR_C_MINOR = "E_FLAT_MAJOR_C_MINOR", e.E_MAJOR_D_FLAT_MINOR = "E_MAJOR_D_FLAT_MINOR", e.F_MAJOR_D_MINOR = "F_MAJOR_D_MINOR", e.G_FLAT_MAJOR_E_FLAT_MINOR = "G_FLAT_MAJOR_E_FLAT_MINOR", e.G_MAJOR_E_MINOR = "G_MAJOR_E_MINOR", e.A_FLAT_MAJOR_F_MINOR = "A_FLAT_MAJOR_F_MINOR", e.A_MAJOR_G_FLAT_MINOR = "A_MAJOR_G_FLAT_MINOR", e.B_FLAT_MAJOR_G_MINOR = "B_FLAT_MAJOR_G_MINOR", e.B_MAJOR_A_FLAT_MINOR = "B_MAJOR_A_FLAT_MINOR";
})(bu || (bu = {}));
var Ru;
(function(e) {
  e.MUSIC_GENERATION_MODE_UNSPECIFIED = "MUSIC_GENERATION_MODE_UNSPECIFIED", e.QUALITY = "QUALITY", e.DIVERSITY = "DIVERSITY", e.VOCALIZATION = "VOCALIZATION";
})(Ru || (Ru = {}));
var nn;
(function(e) {
  e.PLAYBACK_CONTROL_UNSPECIFIED = "PLAYBACK_CONTROL_UNSPECIFIED", e.PLAY = "PLAY", e.PAUSE = "PAUSE", e.STOP = "STOP", e.RESET_CONTEXT = "RESET_CONTEXT";
})(nn || (nn = {}));
var Qi = class {
  constructor(e) {
    const t = {};
    for (const n of e.headers.entries()) t[n[0]] = n[1];
    this.headers = t, this.responseInternal = e;
  }
  json() {
    return this.responseInternal.json();
  }
}, $n = class {
  get text() {
    var e, t, n, r, o, i, s, u;
    if (((r = (n = (t = (e = this.candidates) === null || e === void 0 ? void 0 : e[0]) === null || t === void 0 ? void 0 : t.content) === null || n === void 0 ? void 0 : n.parts) === null || r === void 0 ? void 0 : r.length) === 0) return;
    this.candidates && this.candidates.length > 1 && console.warn("there are multiple candidates in the response, returning text from the first one.");
    let c = "", d = !1;
    const h = [];
    for (const f of (u = (s = (i = (o = this.candidates) === null || o === void 0 ? void 0 : o[0]) === null || i === void 0 ? void 0 : i.content) === null || s === void 0 ? void 0 : s.parts) !== null && u !== void 0 ? u : []) {
      for (const [p, m] of Object.entries(f)) p !== "text" && p !== "thought" && p !== "thoughtSignature" && (m !== null || m !== void 0) && h.push(p);
      if (typeof f.text == "string") {
        if (typeof f.thought == "boolean" && f.thought) continue;
        d = !0, c += f.text;
      }
    }
    return h.length > 0 && console.warn(`there are non-text parts ${h} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`), d ? c : void 0;
  }
  get data() {
    var e, t, n, r, o, i, s, u;
    if (((r = (n = (t = (e = this.candidates) === null || e === void 0 ? void 0 : e[0]) === null || t === void 0 ? void 0 : t.content) === null || n === void 0 ? void 0 : n.parts) === null || r === void 0 ? void 0 : r.length) === 0) return;
    this.candidates && this.candidates.length > 1 && console.warn("there are multiple candidates in the response, returning data from the first one.");
    let c = "";
    const d = [];
    for (const h of (u = (s = (i = (o = this.candidates) === null || o === void 0 ? void 0 : o[0]) === null || i === void 0 ? void 0 : i.content) === null || s === void 0 ? void 0 : s.parts) !== null && u !== void 0 ? u : []) {
      for (const [f, p] of Object.entries(h)) f !== "inlineData" && (p !== null || p !== void 0) && d.push(f);
      h.inlineData && typeof h.inlineData.data == "string" && (c += atob(h.inlineData.data));
    }
    return d.length > 0 && console.warn(`there are non-data parts ${d} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`), c.length > 0 ? btoa(c) : void 0;
  }
  get functionCalls() {
    var e, t, n, r, o, i, s, u;
    if (((r = (n = (t = (e = this.candidates) === null || e === void 0 ? void 0 : e[0]) === null || t === void 0 ? void 0 : t.content) === null || n === void 0 ? void 0 : n.parts) === null || r === void 0 ? void 0 : r.length) === 0) return;
    this.candidates && this.candidates.length > 1 && console.warn("there are multiple candidates in the response, returning function calls from the first one.");
    const c = (u = (s = (i = (o = this.candidates) === null || o === void 0 ? void 0 : o[0]) === null || i === void 0 ? void 0 : i.content) === null || s === void 0 ? void 0 : s.parts) === null || u === void 0 ? void 0 : u.filter((d) => d.functionCall).map((d) => d.functionCall).filter((d) => d !== void 0);
    if (c?.length !== 0)
      return c;
  }
  get executableCode() {
    var e, t, n, r, o, i, s, u, c;
    if (((r = (n = (t = (e = this.candidates) === null || e === void 0 ? void 0 : e[0]) === null || t === void 0 ? void 0 : t.content) === null || n === void 0 ? void 0 : n.parts) === null || r === void 0 ? void 0 : r.length) === 0) return;
    this.candidates && this.candidates.length > 1 && console.warn("there are multiple candidates in the response, returning executable code from the first one.");
    const d = (u = (s = (i = (o = this.candidates) === null || o === void 0 ? void 0 : o[0]) === null || i === void 0 ? void 0 : i.content) === null || s === void 0 ? void 0 : s.parts) === null || u === void 0 ? void 0 : u.filter((h) => h.executableCode).map((h) => h.executableCode).filter((h) => h !== void 0);
    if (d?.length !== 0)
      return (c = d?.[0]) === null || c === void 0 ? void 0 : c.code;
  }
  get codeExecutionResult() {
    var e, t, n, r, o, i, s, u, c;
    if (((r = (n = (t = (e = this.candidates) === null || e === void 0 ? void 0 : e[0]) === null || t === void 0 ? void 0 : t.content) === null || n === void 0 ? void 0 : n.parts) === null || r === void 0 ? void 0 : r.length) === 0) return;
    this.candidates && this.candidates.length > 1 && console.warn("there are multiple candidates in the response, returning code execution result from the first one.");
    const d = (u = (s = (i = (o = this.candidates) === null || o === void 0 ? void 0 : o[0]) === null || i === void 0 ? void 0 : i.content) === null || s === void 0 ? void 0 : s.parts) === null || u === void 0 ? void 0 : u.filter((h) => h.codeExecutionResult).map((h) => h.codeExecutionResult).filter((h) => h !== void 0);
    if (d?.length !== 0)
      return (c = d?.[0]) === null || c === void 0 ? void 0 : c.output;
  }
}, Pu = class {
}, Mu = class {
}, Q_ = class {
}, Z_ = class {
}, j_ = class {
}, ey = class {
}, xu = class {
}, Nu = class {
}, ku = class {
}, ty = class {
}, Du = class wf {
  _fromAPIResponse({ apiResponse: t, _isVertexAI: n }) {
    const r = new wf();
    let o;
    const i = t;
    return n ? o = O_(i) : o = F_(i), Object.assign(r, o), r;
  }
}, $u = class {
}, Lu = class {
}, Uu = class {
}, Fu = class {
}, ny = class {
}, ry = class {
}, oy = class {
}, iy = class If {
  _fromAPIResponse({ apiResponse: t, _isVertexAI: n }) {
    const r = new If(), o = K_(t);
    return Object.assign(r, o), r;
  }
}, sy = class {
}, ay = class {
}, ly = class {
}, uy = class {
}, Ou = class {
}, cy = class {
  get text() {
    var e, t, n;
    let r = "", o = !1;
    const i = [];
    for (const s of (n = (t = (e = this.serverContent) === null || e === void 0 ? void 0 : e.modelTurn) === null || t === void 0 ? void 0 : t.parts) !== null && n !== void 0 ? n : []) {
      for (const [u, c] of Object.entries(s)) u !== "text" && u !== "thought" && c !== null && i.push(u);
      if (typeof s.text == "string") {
        if (typeof s.thought == "boolean" && s.thought) continue;
        o = !0, r += s.text;
      }
    }
    return i.length > 0 && console.warn(`there are non-text parts ${i} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`), o ? r : void 0;
  }
  get data() {
    var e, t, n;
    let r = "";
    const o = [];
    for (const i of (n = (t = (e = this.serverContent) === null || e === void 0 ? void 0 : e.modelTurn) === null || t === void 0 ? void 0 : t.parts) !== null && n !== void 0 ? n : []) {
      for (const [s, u] of Object.entries(i)) s !== "inlineData" && u !== null && o.push(s);
      i.inlineData && typeof i.inlineData.data == "string" && (r += atob(i.inlineData.data));
    }
    return o.length > 0 && console.warn(`there are non-data parts ${o} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`), r.length > 0 ? btoa(r) : void 0;
  }
}, dy = class {
  get audioChunk() {
    if (this.serverContent && this.serverContent.audioChunks && this.serverContent.audioChunks.length > 0) return this.serverContent.audioChunks[0];
  }
}, fy = class bf {
  _fromAPIResponse({ apiResponse: t, _isVertexAI: n }) {
    const r = new bf(), o = Cf(t);
    return Object.assign(r, o), r;
  }
};
function K(e, t) {
  if (!t || typeof t != "string") throw new Error("model is required and must be a string");
  if (t.includes("..") || t.includes("?") || t.includes("&")) throw new Error("invalid model parameter");
  if (e.isVertexAI()) {
    if (t.startsWith("publishers/") || t.startsWith("projects/") || t.startsWith("models/")) return t;
    if (t.indexOf("/") >= 0) {
      const n = t.split("/", 2);
      return `publishers/${n[0]}/models/${n[1]}`;
    } else return `publishers/google/models/${t}`;
  } else return t.startsWith("models/") || t.startsWith("tunedModels/") ? t : `models/${t}`;
}
function Rf(e, t) {
  const n = K(e, t);
  return n ? n.startsWith("publishers/") && e.isVertexAI() ? `projects/${e.getProject()}/locations/${e.getLocation()}/${n}` : n.startsWith("models/") && e.isVertexAI() ? `projects/${e.getProject()}/locations/${e.getLocation()}/publishers/google/${n}` : n : "";
}
function Pf(e) {
  return Array.isArray(e) ? e.map((t) => wo(t)) : [wo(e)];
}
function wo(e) {
  if (typeof e == "object" && e !== null) return e;
  throw new Error(`Could not parse input as Blob. Unsupported blob type: ${typeof e}`);
}
function Mf(e) {
  const t = wo(e);
  if (t.mimeType && t.mimeType.startsWith("image/")) return t;
  throw new Error(`Unsupported mime type: ${t.mimeType}`);
}
function xf(e) {
  const t = wo(e);
  if (t.mimeType && t.mimeType.startsWith("audio/")) return t;
  throw new Error(`Unsupported mime type: ${t.mimeType}`);
}
function Gu(e) {
  if (e == null) throw new Error("PartUnion is required");
  if (typeof e == "object") return e;
  if (typeof e == "string") return { text: e };
  throw new Error(`Unsupported part type: ${typeof e}`);
}
function Nf(e) {
  if (e == null || Array.isArray(e) && e.length === 0) throw new Error("PartListUnion is required");
  return Array.isArray(e) ? e.map((t) => Gu(t)) : [Gu(e)];
}
function Zi(e) {
  return e != null && typeof e == "object" && "parts" in e && Array.isArray(e.parts);
}
function Bu(e) {
  return e != null && typeof e == "object" && "functionCall" in e;
}
function qu(e) {
  return e != null && typeof e == "object" && "functionResponse" in e;
}
function se(e) {
  if (e == null) throw new Error("ContentUnion is required");
  return Zi(e) ? e : {
    role: "user",
    parts: Nf(e)
  };
}
function ea(e, t) {
  if (!t) return [];
  if (e.isVertexAI() && Array.isArray(t)) return t.flatMap((n) => {
    const r = se(n);
    return r.parts && r.parts.length > 0 && r.parts[0].text !== void 0 ? [r.parts[0].text] : [];
  });
  if (e.isVertexAI()) {
    const n = se(t);
    return n.parts && n.parts.length > 0 && n.parts[0].text !== void 0 ? [n.parts[0].text] : [];
  }
  return Array.isArray(t) ? t.map((n) => se(n)) : [se(t)];
}
function ve(e) {
  if (e == null || Array.isArray(e) && e.length === 0) throw new Error("contents are required");
  if (!Array.isArray(e)) {
    if (Bu(e) || qu(e)) throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");
    return [se(e)];
  }
  const t = [], n = [], r = Zi(e[0]);
  for (const o of e) {
    const i = Zi(o);
    if (i != r) throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");
    if (i) t.push(o);
    else {
      if (Bu(o) || qu(o)) throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");
      n.push(o);
    }
  }
  return r || t.push({
    role: "user",
    parts: Nf(n)
  }), t;
}
function hy(e, t) {
  e.includes("null") && (t.nullable = !0);
  const n = e.filter((r) => r !== "null");
  if (n.length === 1) t.type = Object.values(Tt).includes(n[0].toUpperCase()) ? n[0].toUpperCase() : Tt.TYPE_UNSPECIFIED;
  else {
    t.anyOf = [];
    for (const r of n) t.anyOf.push({ type: Object.values(Tt).includes(r.toUpperCase()) ? r.toUpperCase() : Tt.TYPE_UNSPECIFIED });
  }
}
function un(e) {
  const t = {}, n = ["items"], r = ["anyOf"], o = ["properties"];
  if (e.type && e.anyOf) throw new Error("type and anyOf cannot be both populated.");
  const i = e.anyOf;
  i != null && i.length == 2 && (i[0].type === "null" ? (t.nullable = !0, e = i[1]) : i[1].type === "null" && (t.nullable = !0, e = i[0])), e.type instanceof Array && hy(e.type, t);
  for (const [s, u] of Object.entries(e))
    if (u != null)
      if (s == "type") {
        if (u === "null") throw new Error("type: null can not be the only possible type for the field.");
        if (u instanceof Array) continue;
        t.type = Object.values(Tt).includes(u.toUpperCase()) ? u.toUpperCase() : Tt.TYPE_UNSPECIFIED;
      } else if (n.includes(s)) t[s] = un(u);
      else if (r.includes(s)) {
        const c = [];
        for (const d of u) {
          if (d.type == "null") {
            t.nullable = !0;
            continue;
          }
          c.push(un(d));
        }
        t[s] = c;
      } else if (o.includes(s)) {
        const c = {};
        for (const [d, h] of Object.entries(u)) c[d] = un(h);
        t[s] = c;
      } else {
        if (s === "additionalProperties") continue;
        t[s] = u;
      }
  return t;
}
function ta(e) {
  return un(e);
}
function na(e) {
  if (typeof e == "object") return e;
  if (typeof e == "string") return { voiceConfig: { prebuiltVoiceConfig: { voiceName: e } } };
  throw new Error(`Unsupported speechConfig type: ${typeof e}`);
}
function ra(e) {
  if ("multiSpeakerVoiceConfig" in e) throw new Error("multiSpeakerVoiceConfig is not supported in the live API.");
  return e;
}
function pn(e) {
  if (e.functionDeclarations) for (const t of e.functionDeclarations)
    t.parameters && (Object.keys(t.parameters).includes("$schema") ? t.parametersJsonSchema || (t.parametersJsonSchema = t.parameters, delete t.parameters) : t.parameters = un(t.parameters)), t.response && (Object.keys(t.response).includes("$schema") ? t.responseJsonSchema || (t.responseJsonSchema = t.response, delete t.response) : t.response = un(t.response));
  return e;
}
function mn(e) {
  if (e == null) throw new Error("tools is required");
  if (!Array.isArray(e)) throw new Error("tools is required and must be an array of Tools");
  const t = [];
  for (const n of e) t.push(n);
  return t;
}
function py(e, t, n, r = 1) {
  const o = !t.startsWith(`${n}/`) && t.split("/").length === r;
  return e.isVertexAI() ? t.startsWith("projects/") ? t : t.startsWith("locations/") ? `projects/${e.getProject()}/${t}` : t.startsWith(`${n}/`) ? `projects/${e.getProject()}/locations/${e.getLocation()}/${t}` : o ? `projects/${e.getProject()}/locations/${e.getLocation()}/${n}/${t}` : t : o ? `${n}/${t}` : t;
}
function ft(e, t) {
  if (typeof t != "string") throw new Error("name must be a string");
  return py(e, t, "cachedContents");
}
function kf(e) {
  switch (e) {
    case "STATE_UNSPECIFIED":
      return "JOB_STATE_UNSPECIFIED";
    case "CREATING":
      return "JOB_STATE_RUNNING";
    case "ACTIVE":
      return "JOB_STATE_SUCCEEDED";
    case "FAILED":
      return "JOB_STATE_FAILED";
    default:
      return e;
  }
}
function It(e) {
  return js(e);
}
function my(e) {
  return e != null && typeof e == "object" && "name" in e;
}
function gy(e) {
  return e != null && typeof e == "object" && "video" in e;
}
function _y(e) {
  return e != null && typeof e == "object" && "uri" in e;
}
function Df(e) {
  var t;
  let n;
  if (my(e) && (n = e.name), !(_y(e) && (n = e.uri, n === void 0)) && !(gy(e) && (n = (t = e.video) === null || t === void 0 ? void 0 : t.uri, n === void 0))) {
    if (typeof e == "string" && (n = e), n === void 0) throw new Error("Could not extract file name from the provided input.");
    if (n.startsWith("https://")) {
      const r = n.split("files/")[1].match(/[a-z0-9]+/);
      if (r === null) throw new Error(`Could not extract file name from URI ${n}`);
      n = r[0];
    } else n.startsWith("files/") && (n = n.split("files/")[1]);
    return n;
  }
}
function $f(e, t) {
  let n;
  return e.isVertexAI() ? n = t ? "publishers/google/models" : "models" : n = t ? "models" : "tunedModels", n;
}
function Lf(e) {
  for (const t of [
    "models",
    "tunedModels",
    "publisherModels"
  ]) if (yy(e, t)) return e[t];
  return [];
}
function yy(e, t) {
  return e !== null && typeof e == "object" && t in e;
}
function vy(e, t = {}) {
  const n = e, r = {
    name: n.name,
    description: n.description,
    parametersJsonSchema: n.inputSchema
  };
  return n.outputSchema && (r.responseJsonSchema = n.outputSchema), t.behavior && (r.behavior = t.behavior), { functionDeclarations: [r] };
}
function Ay(e, t = {}) {
  const n = [], r = /* @__PURE__ */ new Set();
  for (const o of e) {
    const i = o.name;
    if (r.has(i)) throw new Error(`Duplicate function name ${i} found in MCP tools. Please ensure function names are unique.`);
    r.add(i);
    const s = vy(o, t);
    s.functionDeclarations && n.push(...s.functionDeclarations);
  }
  return { functionDeclarations: n };
}
function Uf(e, t) {
  let n;
  if (typeof t == "string") if (e.isVertexAI()) if (t.startsWith("gs://")) n = {
    format: "jsonl",
    gcsUri: [t]
  };
  else if (t.startsWith("bq://")) n = {
    format: "bigquery",
    bigqueryUri: t
  };
  else throw new Error(`Unsupported string source for Vertex AI: ${t}`);
  else if (t.startsWith("files/")) n = { fileName: t };
  else throw new Error(`Unsupported string source for Gemini API: ${t}`);
  else if (Array.isArray(t)) {
    if (e.isVertexAI()) throw new Error("InlinedRequest[] is not supported in Vertex AI.");
    n = { inlinedRequests: t };
  } else n = t;
  const r = [n.gcsUri, n.bigqueryUri].filter(Boolean).length, o = [n.inlinedRequests, n.fileName].filter(Boolean).length;
  if (e.isVertexAI()) {
    if (o > 0 || r !== 1) throw new Error("Exactly one of `gcsUri` or `bigqueryUri` must be set for Vertex AI.");
  } else if (r > 0 || o !== 1) throw new Error("Exactly one of `inlinedRequests`, `fileName`, must be set for Gemini API.");
  return n;
}
function Ty(e) {
  if (typeof e != "string") return e;
  const t = e;
  if (t.startsWith("gs://")) return {
    format: "jsonl",
    gcsUri: t
  };
  if (t.startsWith("bq://")) return {
    format: "bigquery",
    bigqueryUri: t
  };
  throw new Error(`Unsupported destination: ${t}`);
}
function Ff(e) {
  if (typeof e != "object" || e === null) return {};
  const t = e, n = t.inlinedResponses;
  if (typeof n != "object" || n === null) return e;
  const r = n.inlinedResponses;
  if (!Array.isArray(r) || r.length === 0) return e;
  let o = !1;
  for (const i of r) {
    if (typeof i != "object" || i === null) continue;
    const s = i.response;
    if (!(typeof s != "object" || s === null) && s.embedding !== void 0) {
      o = !0;
      break;
    }
  }
  return o && (t.inlinedEmbedContentResponses = t.inlinedResponses, delete t.inlinedResponses), e;
}
function gn(e, t) {
  const n = t;
  if (!e.isVertexAI()) {
    if (/batches\/[^/]+$/.test(n)) return n.split("/").pop();
    throw new Error(`Invalid batch job name: ${n}.`);
  }
  if (/^projects\/[^/]+\/locations\/[^/]+\/batchPredictionJobs\/[^/]+$/.test(n)) return n.split("/").pop();
  if (/^\d+$/.test(n)) return n;
  throw new Error(`Invalid batch job name: ${n}.`);
}
function Of(e) {
  const t = e;
  return t === "BATCH_STATE_UNSPECIFIED" ? "JOB_STATE_UNSPECIFIED" : t === "BATCH_STATE_PENDING" ? "JOB_STATE_PENDING" : t === "BATCH_STATE_RUNNING" ? "JOB_STATE_RUNNING" : t === "BATCH_STATE_SUCCEEDED" ? "JOB_STATE_SUCCEEDED" : t === "BATCH_STATE_FAILED" ? "JOB_STATE_FAILED" : t === "BATCH_STATE_CANCELLED" ? "JOB_STATE_CANCELLED" : t === "BATCH_STATE_EXPIRED" ? "JOB_STATE_EXPIRED" : t;
}
function Sy(e) {
  return e.includes("gemini") && e !== "gemini-embedding-001" || e.includes("maas");
}
function Ey(e) {
  const t = {}, n = a(e, ["apiKey"]);
  if (n != null && l(t, ["apiKey"], n), a(e, ["apiKeyConfig"]) !== void 0) throw new Error("apiKeyConfig parameter is not supported in Gemini API.");
  if (a(e, ["authType"]) !== void 0) throw new Error("authType parameter is not supported in Gemini API.");
  if (a(e, ["googleServiceAccountConfig"]) !== void 0) throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");
  if (a(e, ["httpBasicAuthConfig"]) !== void 0) throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oauthConfig"]) !== void 0) throw new Error("oauthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oidcConfig"]) !== void 0) throw new Error("oidcConfig parameter is not supported in Gemini API.");
  return t;
}
function Cy(e) {
  const t = {}, n = a(e, ["responsesFile"]);
  n != null && l(t, ["fileName"], n);
  const r = a(e, ["inlinedResponses", "inlinedResponses"]);
  if (r != null) {
    let i = r;
    Array.isArray(i) && (i = i.map((s) => ov(s))), l(t, ["inlinedResponses"], i);
  }
  const o = a(e, ["inlinedEmbedContentResponses", "inlinedResponses"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["inlinedEmbedContentResponses"], i);
  }
  return t;
}
function wy(e) {
  const t = {}, n = a(e, ["predictionsFormat"]);
  n != null && l(t, ["format"], n);
  const r = a(e, ["gcsDestination", "outputUriPrefix"]);
  r != null && l(t, ["gcsUri"], r);
  const o = a(e, ["bigqueryDestination", "outputUri"]);
  return o != null && l(t, ["bigqueryUri"], o), t;
}
function Iy(e) {
  const t = {}, n = a(e, ["format"]);
  n != null && l(t, ["predictionsFormat"], n);
  const r = a(e, ["gcsUri"]);
  r != null && l(t, ["gcsDestination", "outputUriPrefix"], r);
  const o = a(e, ["bigqueryUri"]);
  if (o != null && l(t, ["bigqueryDestination", "outputUri"], o), a(e, ["fileName"]) !== void 0) throw new Error("fileName parameter is not supported in Vertex AI.");
  if (a(e, ["inlinedResponses"]) !== void 0) throw new Error("inlinedResponses parameter is not supported in Vertex AI.");
  if (a(e, ["inlinedEmbedContentResponses"]) !== void 0) throw new Error("inlinedEmbedContentResponses parameter is not supported in Vertex AI.");
  return t;
}
function ao(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["metadata", "displayName"]);
  r != null && l(t, ["displayName"], r);
  const o = a(e, ["metadata", "state"]);
  o != null && l(t, ["state"], Of(o));
  const i = a(e, ["metadata", "createTime"]);
  i != null && l(t, ["createTime"], i);
  const s = a(e, ["metadata", "endTime"]);
  s != null && l(t, ["endTime"], s);
  const u = a(e, ["metadata", "updateTime"]);
  u != null && l(t, ["updateTime"], u);
  const c = a(e, ["metadata", "model"]);
  c != null && l(t, ["model"], c);
  const d = a(e, ["metadata", "output"]);
  return d != null && l(t, ["dest"], Cy(Ff(d))), t;
}
function ji(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["displayName"]);
  r != null && l(t, ["displayName"], r);
  const o = a(e, ["state"]);
  o != null && l(t, ["state"], Of(o));
  const i = a(e, ["error"]);
  i != null && l(t, ["error"], i);
  const s = a(e, ["createTime"]);
  s != null && l(t, ["createTime"], s);
  const u = a(e, ["startTime"]);
  u != null && l(t, ["startTime"], u);
  const c = a(e, ["endTime"]);
  c != null && l(t, ["endTime"], c);
  const d = a(e, ["updateTime"]);
  d != null && l(t, ["updateTime"], d);
  const h = a(e, ["model"]);
  h != null && l(t, ["model"], h);
  const f = a(e, ["inputConfig"]);
  f != null && l(t, ["src"], by(f));
  const p = a(e, ["outputConfig"]);
  p != null && l(t, ["dest"], wy(Ff(p)));
  const m = a(e, ["completionStats"]);
  return m != null && l(t, ["completionStats"], m), t;
}
function by(e) {
  const t = {}, n = a(e, ["instancesFormat"]);
  n != null && l(t, ["format"], n);
  const r = a(e, ["gcsSource", "uris"]);
  r != null && l(t, ["gcsUri"], r);
  const o = a(e, ["bigquerySource", "inputUri"]);
  return o != null && l(t, ["bigqueryUri"], o), t;
}
function Ry(e, t) {
  const n = {};
  if (a(t, ["format"]) !== void 0) throw new Error("format parameter is not supported in Gemini API.");
  if (a(t, ["gcsUri"]) !== void 0) throw new Error("gcsUri parameter is not supported in Gemini API.");
  if (a(t, ["bigqueryUri"]) !== void 0) throw new Error("bigqueryUri parameter is not supported in Gemini API.");
  const r = a(t, ["fileName"]);
  r != null && l(n, ["fileName"], r);
  const o = a(t, ["inlinedRequests"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => rv(e, s))), l(n, ["requests", "requests"], i);
  }
  return n;
}
function Py(e) {
  const t = {}, n = a(e, ["format"]);
  n != null && l(t, ["instancesFormat"], n);
  const r = a(e, ["gcsUri"]);
  r != null && l(t, ["gcsSource", "uris"], r);
  const o = a(e, ["bigqueryUri"]);
  if (o != null && l(t, ["bigquerySource", "inputUri"], o), a(e, ["fileName"]) !== void 0) throw new Error("fileName parameter is not supported in Vertex AI.");
  if (a(e, ["inlinedRequests"]) !== void 0) throw new Error("inlinedRequests parameter is not supported in Vertex AI.");
  return t;
}
function My(e) {
  const t = {}, n = a(e, ["data"]);
  if (n != null && l(t, ["data"], n), a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function xy(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], gn(e, r)), n;
}
function Ny(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], gn(e, r)), n;
}
function ky(e) {
  const t = {}, n = a(e, ["content"]);
  n != null && l(t, ["content"], n);
  const r = a(e, ["citationMetadata"]);
  r != null && l(t, ["citationMetadata"], Dy(r));
  const o = a(e, ["tokenCount"]);
  o != null && l(t, ["tokenCount"], o);
  const i = a(e, ["finishReason"]);
  i != null && l(t, ["finishReason"], i);
  const s = a(e, ["groundingMetadata"]);
  s != null && l(t, ["groundingMetadata"], s);
  const u = a(e, ["avgLogprobs"]);
  u != null && l(t, ["avgLogprobs"], u);
  const c = a(e, ["index"]);
  c != null && l(t, ["index"], c);
  const d = a(e, ["logprobsResult"]);
  d != null && l(t, ["logprobsResult"], d);
  const h = a(e, ["safetyRatings"]);
  if (h != null) {
    let p = h;
    Array.isArray(p) && (p = p.map((m) => m)), l(t, ["safetyRatings"], p);
  }
  const f = a(e, ["urlContextMetadata"]);
  return f != null && l(t, ["urlContextMetadata"], f), t;
}
function Dy(e) {
  const t = {}, n = a(e, ["citationSources"]);
  if (n != null) {
    let r = n;
    Array.isArray(r) && (r = r.map((o) => o)), l(t, ["citations"], r);
  }
  return t;
}
function Gf(e) {
  const t = {}, n = a(e, ["parts"]);
  if (n != null) {
    let o = n;
    Array.isArray(o) && (o = o.map((i) => dv(i))), l(t, ["parts"], o);
  }
  const r = a(e, ["role"]);
  return r != null && l(t, ["role"], r), t;
}
function $y(e, t) {
  const n = {}, r = a(e, ["displayName"]);
  if (t !== void 0 && r != null && l(t, ["batch", "displayName"], r), a(e, ["dest"]) !== void 0) throw new Error("dest parameter is not supported in Gemini API.");
  const o = a(e, ["webhookConfig"]);
  return t !== void 0 && o != null && l(t, ["batch", "webhookConfig"], o), n;
}
function Ly(e, t) {
  const n = {}, r = a(e, ["displayName"]);
  t !== void 0 && r != null && l(t, ["displayName"], r);
  const o = a(e, ["dest"]);
  if (t !== void 0 && o != null && l(t, ["outputConfig"], Iy(Ty(o))), a(e, ["webhookConfig"]) !== void 0) throw new Error("webhookConfig parameter is not supported in Vertex AI.");
  return n;
}
function Hu(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["_url", "model"], K(e, r));
  const o = a(t, ["src"]);
  o != null && l(n, ["batch", "inputConfig"], Ry(e, Uf(e, o)));
  const i = a(t, ["config"]);
  return i != null && $y(i, n), n;
}
function Uy(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["model"], K(e, r));
  const o = a(t, ["src"]);
  o != null && l(n, ["inputConfig"], Py(Uf(e, o)));
  const i = a(t, ["config"]);
  return i != null && Ly(i, n), n;
}
function Fy(e, t) {
  const n = {}, r = a(e, ["displayName"]);
  return t !== void 0 && r != null && l(t, ["batch", "displayName"], r), n;
}
function Oy(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["_url", "model"], K(e, r));
  const o = a(t, ["src"]);
  o != null && l(n, ["batch", "inputConfig"], Ky(e, o));
  const i = a(t, ["config"]);
  return i != null && Fy(i, n), n;
}
function Gy(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], gn(e, r)), n;
}
function By(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], gn(e, r)), n;
}
function qy(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["name"]);
  r != null && l(t, ["name"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  return i != null && l(t, ["error"], i), t;
}
function Hy(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["name"]);
  r != null && l(t, ["name"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  return i != null && l(t, ["error"], i), t;
}
function Vy(e, t) {
  const n = {}, r = a(t, ["contents"]);
  if (r != null) {
    let i = ea(e, r);
    Array.isArray(i) && (i = i.map((s) => s)), l(n, [
      "requests[]",
      "request",
      "content"
    ], i);
  }
  const o = a(t, ["config"]);
  return o != null && (l(n, ["_self"], Jy(o, n)), L_(n, { "requests[].*": "requests[].request.*" })), n;
}
function Jy(e, t) {
  const n = {}, r = a(e, ["taskType"]);
  t !== void 0 && r != null && l(t, ["requests[]", "taskType"], r);
  const o = a(e, ["title"]);
  t !== void 0 && o != null && l(t, ["requests[]", "title"], o);
  const i = a(e, ["outputDimensionality"]);
  if (t !== void 0 && i != null && l(t, ["requests[]", "outputDimensionality"], i), a(e, ["mimeType"]) !== void 0) throw new Error("mimeType parameter is not supported in Gemini API.");
  if (a(e, ["autoTruncate"]) !== void 0) throw new Error("autoTruncate parameter is not supported in Gemini API.");
  if (a(e, ["documentOcr"]) !== void 0) throw new Error("documentOcr parameter is not supported in Gemini API.");
  if (a(e, ["audioTrackExtraction"]) !== void 0) throw new Error("audioTrackExtraction parameter is not supported in Gemini API.");
  return n;
}
function Ky(e, t) {
  const n = {}, r = a(t, ["fileName"]);
  r != null && l(n, ["file_name"], r);
  const o = a(t, ["inlinedRequests"]);
  return o != null && l(n, ["requests"], Vy(e, o)), n;
}
function Wy(e) {
  const t = {};
  if (a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const n = a(e, ["fileUri"]);
  n != null && l(t, ["fileUri"], n);
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function zy(e) {
  const t = {}, n = a(e, ["id"]);
  n != null && l(t, ["id"], n);
  const r = a(e, ["args"]);
  r != null && l(t, ["args"], r);
  const o = a(e, ["name"]);
  if (o != null && l(t, ["name"], o), a(e, ["partialArgs"]) !== void 0) throw new Error("partialArgs parameter is not supported in Gemini API.");
  if (a(e, ["willContinue"]) !== void 0) throw new Error("willContinue parameter is not supported in Gemini API.");
  return t;
}
function Yy(e) {
  const t = {}, n = a(e, ["allowedFunctionNames"]);
  n != null && l(t, ["allowedFunctionNames"], n);
  const r = a(e, ["mode"]);
  if (r != null && l(t, ["mode"], r), a(e, ["streamFunctionCallArguments"]) !== void 0) throw new Error("streamFunctionCallArguments parameter is not supported in Gemini API.");
  return t;
}
function Xy(e, t, n) {
  const r = {}, o = a(t, ["systemInstruction"]);
  n !== void 0 && o != null && l(n, ["systemInstruction"], Gf(se(o)));
  const i = a(t, ["temperature"]);
  i != null && l(r, ["temperature"], i);
  const s = a(t, ["topP"]);
  s != null && l(r, ["topP"], s);
  const u = a(t, ["topK"]);
  u != null && l(r, ["topK"], u);
  const c = a(t, ["candidateCount"]);
  c != null && l(r, ["candidateCount"], c);
  const d = a(t, ["maxOutputTokens"]);
  d != null && l(r, ["maxOutputTokens"], d);
  const h = a(t, ["stopSequences"]);
  h != null && l(r, ["stopSequences"], h);
  const f = a(t, ["responseLogprobs"]);
  f != null && l(r, ["responseLogprobs"], f);
  const p = a(t, ["logprobs"]);
  p != null && l(r, ["logprobs"], p);
  const m = a(t, ["presencePenalty"]);
  m != null && l(r, ["presencePenalty"], m);
  const g = a(t, ["frequencyPenalty"]);
  g != null && l(r, ["frequencyPenalty"], g);
  const _ = a(t, ["seed"]);
  _ != null && l(r, ["seed"], _);
  const y = a(t, ["responseMimeType"]);
  y != null && l(r, ["responseMimeType"], y);
  const E = a(t, ["responseSchema"]);
  E != null && l(r, ["responseSchema"], ta(E));
  const A = a(t, ["responseJsonSchema"]);
  if (A != null && l(r, ["responseJsonSchema"], A), a(t, ["routingConfig"]) !== void 0) throw new Error("routingConfig parameter is not supported in Gemini API.");
  if (a(t, ["modelSelectionConfig"]) !== void 0) throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");
  const w = a(t, ["safetySettings"]);
  if (n !== void 0 && w != null) {
    let V = w;
    Array.isArray(V) && (V = V.map((W) => fv(W))), l(n, ["safetySettings"], V);
  }
  const P = a(t, ["tools"]);
  if (n !== void 0 && P != null) {
    let V = mn(P);
    Array.isArray(V) && (V = V.map((W) => pv(pn(W)))), l(n, ["tools"], V);
  }
  const L = a(t, ["toolConfig"]);
  if (n !== void 0 && L != null && l(n, ["toolConfig"], hv(L)), a(t, ["labels"]) !== void 0) throw new Error("labels parameter is not supported in Gemini API.");
  const C = a(t, ["cachedContent"]);
  n !== void 0 && C != null && l(n, ["cachedContent"], ft(e, C));
  const k = a(t, ["responseModalities"]);
  k != null && l(r, ["responseModalities"], k);
  const I = a(t, ["mediaResolution"]);
  I != null && l(r, ["mediaResolution"], I);
  const x = a(t, ["speechConfig"]);
  if (x != null && l(r, ["speechConfig"], na(x)), a(t, ["audioTimestamp"]) !== void 0) throw new Error("audioTimestamp parameter is not supported in Gemini API.");
  const b = a(t, ["thinkingConfig"]);
  b != null && l(r, ["thinkingConfig"], b);
  const F = a(t, ["imageConfig"]);
  F != null && l(r, ["imageConfig"], nv(F));
  const X = a(t, ["enableEnhancedCivicAnswers"]);
  if (X != null && l(r, ["enableEnhancedCivicAnswers"], X), a(t, ["modelArmorConfig"]) !== void 0) throw new Error("modelArmorConfig parameter is not supported in Gemini API.");
  const J = a(t, ["serviceTier"]);
  return n !== void 0 && J != null && l(n, ["serviceTier"], J), r;
}
function Qy(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["candidates"]);
  if (r != null) {
    let d = r;
    Array.isArray(d) && (d = d.map((h) => ky(h))), l(t, ["candidates"], d);
  }
  const o = a(e, ["modelVersion"]);
  o != null && l(t, ["modelVersion"], o);
  const i = a(e, ["promptFeedback"]);
  i != null && l(t, ["promptFeedback"], i);
  const s = a(e, ["responseId"]);
  s != null && l(t, ["responseId"], s);
  const u = a(e, ["usageMetadata"]);
  u != null && l(t, ["usageMetadata"], u);
  const c = a(e, ["modelStatus"]);
  return c != null && l(t, ["modelStatus"], c), t;
}
function Zy(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], gn(e, r)), n;
}
function jy(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], gn(e, r)), n;
}
function ev(e) {
  const t = {}, n = a(e, ["authConfig"]);
  n != null && l(t, ["authConfig"], Ey(n));
  const r = a(e, ["enableWidget"]);
  return r != null && l(t, ["enableWidget"], r), t;
}
function tv(e) {
  const t = {}, n = a(e, ["searchTypes"]);
  if (n != null && l(t, ["searchTypes"], n), a(e, ["blockingConfidence"]) !== void 0) throw new Error("blockingConfidence parameter is not supported in Gemini API.");
  if (a(e, ["excludeDomains"]) !== void 0) throw new Error("excludeDomains parameter is not supported in Gemini API.");
  const r = a(e, ["timeRangeFilter"]);
  return r != null && l(t, ["timeRangeFilter"], r), t;
}
function nv(e) {
  const t = {}, n = a(e, ["aspectRatio"]);
  n != null && l(t, ["aspectRatio"], n);
  const r = a(e, ["imageSize"]);
  if (r != null && l(t, ["imageSize"], r), a(e, ["personGeneration"]) !== void 0) throw new Error("personGeneration parameter is not supported in Gemini API.");
  if (a(e, ["prominentPeople"]) !== void 0) throw new Error("prominentPeople parameter is not supported in Gemini API.");
  if (a(e, ["outputMimeType"]) !== void 0) throw new Error("outputMimeType parameter is not supported in Gemini API.");
  if (a(e, ["outputCompressionQuality"]) !== void 0) throw new Error("outputCompressionQuality parameter is not supported in Gemini API.");
  if (a(e, ["imageOutputOptions"]) !== void 0) throw new Error("imageOutputOptions parameter is not supported in Gemini API.");
  return t;
}
function rv(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["request", "model"], K(e, r));
  const o = a(t, ["contents"]);
  if (o != null) {
    let u = ve(o);
    Array.isArray(u) && (u = u.map((c) => Gf(c))), l(n, ["request", "contents"], u);
  }
  const i = a(t, ["metadata"]);
  i != null && l(n, ["metadata"], i);
  const s = a(t, ["config"]);
  return s != null && l(n, ["request", "generationConfig"], Xy(e, s, a(n, ["request"], {}))), n;
}
function ov(e) {
  const t = {}, n = a(e, ["response"]);
  n != null && l(t, ["response"], Qy(n));
  const r = a(e, ["metadata"]);
  r != null && l(t, ["metadata"], r);
  const o = a(e, ["error"]);
  return o != null && l(t, ["error"], o), t;
}
function iv(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  if (t !== void 0 && o != null && l(t, ["_query", "pageToken"], o), a(e, ["filter"]) !== void 0) throw new Error("filter parameter is not supported in Gemini API.");
  return n;
}
function sv(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  t !== void 0 && o != null && l(t, ["_query", "pageToken"], o);
  const i = a(e, ["filter"]);
  return t !== void 0 && i != null && l(t, ["_query", "filter"], i), n;
}
function av(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && iv(n, t), t;
}
function lv(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && sv(n, t), t;
}
function uv(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["operations"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => ao(s))), l(t, ["batchJobs"], i);
  }
  return t;
}
function cv(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["batchPredictionJobs"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => ji(s))), l(t, ["batchJobs"], i);
  }
  return t;
}
function dv(e) {
  const t = {}, n = a(e, ["mediaResolution"]);
  n != null && l(t, ["mediaResolution"], n);
  const r = a(e, ["codeExecutionResult"]);
  r != null && l(t, ["codeExecutionResult"], r);
  const o = a(e, ["executableCode"]);
  o != null && l(t, ["executableCode"], o);
  const i = a(e, ["fileData"]);
  i != null && l(t, ["fileData"], Wy(i));
  const s = a(e, ["functionCall"]);
  s != null && l(t, ["functionCall"], zy(s));
  const u = a(e, ["functionResponse"]);
  u != null && l(t, ["functionResponse"], u);
  const c = a(e, ["inlineData"]);
  c != null && l(t, ["inlineData"], My(c));
  const d = a(e, ["text"]);
  d != null && l(t, ["text"], d);
  const h = a(e, ["thought"]);
  h != null && l(t, ["thought"], h);
  const f = a(e, ["thoughtSignature"]);
  f != null && l(t, ["thoughtSignature"], f);
  const p = a(e, ["videoMetadata"]);
  p != null && l(t, ["videoMetadata"], p);
  const m = a(e, ["toolCall"]);
  m != null && l(t, ["toolCall"], m);
  const g = a(e, ["toolResponse"]);
  g != null && l(t, ["toolResponse"], g);
  const _ = a(e, ["partMetadata"]);
  return _ != null && l(t, ["partMetadata"], _), t;
}
function fv(e) {
  const t = {}, n = a(e, ["category"]);
  if (n != null && l(t, ["category"], n), a(e, ["method"]) !== void 0) throw new Error("method parameter is not supported in Gemini API.");
  const r = a(e, ["threshold"]);
  return r != null && l(t, ["threshold"], r), t;
}
function hv(e) {
  const t = {}, n = a(e, ["retrievalConfig"]);
  n != null && l(t, ["retrievalConfig"], n);
  const r = a(e, ["functionCallingConfig"]);
  r != null && l(t, ["functionCallingConfig"], Yy(r));
  const o = a(e, ["includeServerSideToolInvocations"]);
  return o != null && l(t, ["includeServerSideToolInvocations"], o), t;
}
function pv(e) {
  const t = {};
  if (a(e, ["retrieval"]) !== void 0) throw new Error("retrieval parameter is not supported in Gemini API.");
  const n = a(e, ["computerUse"]);
  n != null && l(t, ["computerUse"], n);
  const r = a(e, ["fileSearch"]);
  r != null && l(t, ["fileSearch"], r);
  const o = a(e, ["googleSearch"]);
  o != null && l(t, ["googleSearch"], tv(o));
  const i = a(e, ["googleMaps"]);
  i != null && l(t, ["googleMaps"], ev(i));
  const s = a(e, ["codeExecution"]);
  if (s != null && l(t, ["codeExecution"], s), a(e, ["enterpriseWebSearch"]) !== void 0) throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");
  const u = a(e, ["functionDeclarations"]);
  if (u != null) {
    let f = u;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["functionDeclarations"], f);
  }
  const c = a(e, ["googleSearchRetrieval"]);
  if (c != null && l(t, ["googleSearchRetrieval"], c), a(e, ["parallelAiSearch"]) !== void 0) throw new Error("parallelAiSearch parameter is not supported in Gemini API.");
  const d = a(e, ["urlContext"]);
  d != null && l(t, ["urlContext"], d);
  const h = a(e, ["mcpServers"]);
  if (h != null) {
    let f = h;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["mcpServers"], f);
  }
  return t;
}
var ct;
(function(e) {
  e.PAGED_ITEM_BATCH_JOBS = "batchJobs", e.PAGED_ITEM_MODELS = "models", e.PAGED_ITEM_TUNING_JOBS = "tuningJobs", e.PAGED_ITEM_FILES = "files", e.PAGED_ITEM_CACHED_CONTENTS = "cachedContents", e.PAGED_ITEM_FILE_SEARCH_STORES = "fileSearchStores", e.PAGED_ITEM_DOCUMENTS = "documents";
})(ct || (ct = {}));
var qt = class {
  constructor(e, t, n, r) {
    this.pageInternal = [], this.paramsInternal = {}, this.requestInternal = t, this.init(e, n, r);
  }
  init(e, t, n) {
    var r, o;
    this.nameInternal = e, this.pageInternal = t[this.nameInternal] || [], this.sdkHttpResponseInternal = t?.sdkHttpResponse, this.idxInternal = 0;
    let i = { config: {} };
    !n || Object.keys(n).length === 0 ? i = { config: {} } : typeof n == "object" ? i = Object.assign({}, n) : i = n, i.config && (i.config.pageToken = t.nextPageToken), this.paramsInternal = i, this.pageInternalSize = (o = (r = i.config) === null || r === void 0 ? void 0 : r.pageSize) !== null && o !== void 0 ? o : this.pageInternal.length;
  }
  initNextPage(e) {
    this.init(this.nameInternal, e, this.paramsInternal);
  }
  get page() {
    return this.pageInternal;
  }
  get name() {
    return this.nameInternal;
  }
  get pageSize() {
    return this.pageInternalSize;
  }
  get sdkHttpResponse() {
    return this.sdkHttpResponseInternal;
  }
  get params() {
    return this.paramsInternal;
  }
  get pageLength() {
    return this.pageInternal.length;
  }
  getItem(e) {
    return this.pageInternal[e];
  }
  [Symbol.asyncIterator]() {
    return {
      next: async () => {
        if (this.idxInternal >= this.pageLength) if (this.hasNextPage()) await this.nextPage();
        else return {
          value: void 0,
          done: !0
        };
        const e = this.getItem(this.idxInternal);
        return this.idxInternal += 1, {
          value: e,
          done: !1
        };
      },
      return: async () => ({
        value: void 0,
        done: !0
      })
    };
  }
  async nextPage() {
    if (!this.hasNextPage()) throw new Error("No more pages to fetch.");
    const e = await this.requestInternal(this.params);
    return this.initNextPage(e), this.page;
  }
  hasNextPage() {
    var e;
    return ((e = this.params.config) === null || e === void 0 ? void 0 : e.pageToken) !== void 0;
  }
}, mv = class extends dt {
  constructor(e) {
    super(), this.apiClient = e, this.list = async (t = {}) => new qt(ct.PAGED_ITEM_BATCH_JOBS, (n) => this.listInternal(n), await this.listInternal(t), t), this.create = async (t) => (this.apiClient.isVertexAI() && (t.config = this.formatDestination(t.src, t.config)), this.createInternal(t)), this.createEmbeddings = async (t) => {
      if (console.warn("batches.createEmbeddings() is experimental and may change without notice."), this.apiClient.isVertexAI()) throw new Error("Vertex AI does not support batches.createEmbeddings.");
      return this.createEmbeddingsInternal(t);
    };
  }
  createInlinedGenerateContentRequest(e) {
    const t = Hu(this.apiClient, e), n = t._url, r = N("{model}:batchGenerateContent", n), o = t.batch.inputConfig.requests, i = o.requests, s = [];
    for (const u of i) {
      const c = Object.assign({}, u);
      if (c.systemInstruction) {
        const d = c.systemInstruction;
        delete c.systemInstruction;
        const h = c.request;
        h.systemInstruction = d, c.request = h;
      }
      s.push(c);
    }
    return o.requests = s, delete t.config, delete t._url, delete t._query, {
      path: r,
      body: t
    };
  }
  getGcsUri(e) {
    if (typeof e == "string") return e.startsWith("gs://") ? e : void 0;
    if (!Array.isArray(e) && e.gcsUri && e.gcsUri.length > 0) return e.gcsUri[0];
  }
  getBigqueryUri(e) {
    if (typeof e == "string") return e.startsWith("bq://") ? e : void 0;
    if (!Array.isArray(e)) return e.bigqueryUri;
  }
  formatDestination(e, t) {
    const n = t ? Object.assign({}, t) : {}, r = Date.now().toString();
    if (n.displayName || (n.displayName = `genaiBatchJob_${r}`), n.dest === void 0) {
      const o = this.getGcsUri(e), i = this.getBigqueryUri(e);
      if (o) o.endsWith(".jsonl") ? n.dest = `${o.slice(0, -6)}/dest` : n.dest = `${o}_dest_${r}`;
      else if (i) n.dest = `${i}_dest_${r}`;
      else throw new Error("Unsupported source for Vertex AI: No GCS or BigQuery URI found.");
    }
    return n;
  }
  async createInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Uy(this.apiClient, e);
      return s = N("batchPredictionJobs", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => ji(d));
    } else {
      const c = Hu(this.apiClient, e);
      return s = N("{model}:batchGenerateContent", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => ao(d));
    }
  }
  async createEmbeddingsInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = Oy(this.apiClient, e);
      return o = N("{model}:asyncBatchEmbedContent", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => ao(u));
    }
  }
  async get(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = jy(this.apiClient, e);
      return s = N("batchPredictionJobs/{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => ji(d));
    } else {
      const c = Zy(this.apiClient, e);
      return s = N("batches/{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => ao(d));
    }
  }
  async cancel(e) {
    var t, n, r, o;
    let i = "", s = {};
    if (this.apiClient.isVertexAI()) {
      const u = Ny(this.apiClient, e);
      i = N("batchPredictionJobs/{name}:cancel", u._url), s = u._query, delete u._url, delete u._query, await this.apiClient.request({
        path: i,
        queryParams: s,
        body: JSON.stringify(u),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      });
    } else {
      const u = xy(this.apiClient, e);
      i = N("batches/{name}:cancel", u._url), s = u._query, delete u._url, delete u._query, await this.apiClient.request({
        path: i,
        queryParams: s,
        body: JSON.stringify(u),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      });
    }
  }
  async listInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = lv(e);
      return s = N("batchPredictionJobs", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = cv(d), f = new Ou();
        return Object.assign(f, h), f;
      });
    } else {
      const c = av(e);
      return s = N("batches", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = uv(d), f = new Ou();
        return Object.assign(f, h), f;
      });
    }
  }
  async delete(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = By(this.apiClient, e);
      return s = N("batchPredictionJobs/{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "DELETE",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => Hy(d));
    } else {
      const c = Gy(this.apiClient, e);
      return s = N("batches/{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "DELETE",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => qy(d));
    }
  }
};
function gv(e) {
  const t = {}, n = a(e, ["apiKey"]);
  if (n != null && l(t, ["apiKey"], n), a(e, ["apiKeyConfig"]) !== void 0) throw new Error("apiKeyConfig parameter is not supported in Gemini API.");
  if (a(e, ["authType"]) !== void 0) throw new Error("authType parameter is not supported in Gemini API.");
  if (a(e, ["googleServiceAccountConfig"]) !== void 0) throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");
  if (a(e, ["httpBasicAuthConfig"]) !== void 0) throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oauthConfig"]) !== void 0) throw new Error("oauthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oidcConfig"]) !== void 0) throw new Error("oidcConfig parameter is not supported in Gemini API.");
  return t;
}
function _v(e) {
  const t = {}, n = a(e, ["data"]);
  if (n != null && l(t, ["data"], n), a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function Vu(e) {
  const t = {}, n = a(e, ["parts"]);
  if (n != null) {
    let o = n;
    Array.isArray(o) && (o = o.map((i) => Gv(i))), l(t, ["parts"], o);
  }
  const r = a(e, ["role"]);
  return r != null && l(t, ["role"], r), t;
}
function Ju(e) {
  const t = {}, n = a(e, ["parts"]);
  if (n != null) {
    let o = n;
    Array.isArray(o) && (o = o.map((i) => Bv(i))), l(t, ["parts"], o);
  }
  const r = a(e, ["role"]);
  return r != null && l(t, ["role"], r), t;
}
function yv(e, t) {
  const n = {}, r = a(e, ["ttl"]);
  t !== void 0 && r != null && l(t, ["ttl"], r);
  const o = a(e, ["expireTime"]);
  t !== void 0 && o != null && l(t, ["expireTime"], o);
  const i = a(e, ["displayName"]);
  t !== void 0 && i != null && l(t, ["displayName"], i);
  const s = a(e, ["contents"]);
  if (t !== void 0 && s != null) {
    let h = ve(s);
    Array.isArray(h) && (h = h.map((f) => Vu(f))), l(t, ["contents"], h);
  }
  const u = a(e, ["systemInstruction"]);
  t !== void 0 && u != null && l(t, ["systemInstruction"], Vu(se(u)));
  const c = a(e, ["tools"]);
  if (t !== void 0 && c != null) {
    let h = c;
    Array.isArray(h) && (h = h.map((f) => Vv(f))), l(t, ["tools"], h);
  }
  const d = a(e, ["toolConfig"]);
  if (t !== void 0 && d != null && l(t, ["toolConfig"], qv(d)), a(e, ["kmsKeyName"]) !== void 0) throw new Error("kmsKeyName parameter is not supported in Gemini API.");
  return n;
}
function vv(e, t) {
  const n = {}, r = a(e, ["ttl"]);
  t !== void 0 && r != null && l(t, ["ttl"], r);
  const o = a(e, ["expireTime"]);
  t !== void 0 && o != null && l(t, ["expireTime"], o);
  const i = a(e, ["displayName"]);
  t !== void 0 && i != null && l(t, ["displayName"], i);
  const s = a(e, ["contents"]);
  if (t !== void 0 && s != null) {
    let f = ve(s);
    Array.isArray(f) && (f = f.map((p) => Ju(p))), l(t, ["contents"], f);
  }
  const u = a(e, ["systemInstruction"]);
  t !== void 0 && u != null && l(t, ["systemInstruction"], Ju(se(u)));
  const c = a(e, ["tools"]);
  if (t !== void 0 && c != null) {
    let f = c;
    Array.isArray(f) && (f = f.map((p) => Jv(p))), l(t, ["tools"], f);
  }
  const d = a(e, ["toolConfig"]);
  t !== void 0 && d != null && l(t, ["toolConfig"], Hv(d));
  const h = a(e, ["kmsKeyName"]);
  return t !== void 0 && h != null && l(t, ["encryption_spec", "kmsKeyName"], h), n;
}
function Av(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["model"], Rf(e, r));
  const o = a(t, ["config"]);
  return o != null && yv(o, n), n;
}
function Tv(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["model"], Rf(e, r));
  const o = a(t, ["config"]);
  return o != null && vv(o, n), n;
}
function Sv(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], ft(e, r)), n;
}
function Ev(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], ft(e, r)), n;
}
function Cv(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  return n != null && l(t, ["sdkHttpResponse"], n), t;
}
function wv(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  return n != null && l(t, ["sdkHttpResponse"], n), t;
}
function Iv(e) {
  const t = {};
  if (a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const n = a(e, ["fileUri"]);
  n != null && l(t, ["fileUri"], n);
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function bv(e) {
  const t = {}, n = a(e, ["id"]);
  n != null && l(t, ["id"], n);
  const r = a(e, ["args"]);
  r != null && l(t, ["args"], r);
  const o = a(e, ["name"]);
  if (o != null && l(t, ["name"], o), a(e, ["partialArgs"]) !== void 0) throw new Error("partialArgs parameter is not supported in Gemini API.");
  if (a(e, ["willContinue"]) !== void 0) throw new Error("willContinue parameter is not supported in Gemini API.");
  return t;
}
function Rv(e) {
  const t = {}, n = a(e, ["allowedFunctionNames"]);
  n != null && l(t, ["allowedFunctionNames"], n);
  const r = a(e, ["mode"]);
  if (r != null && l(t, ["mode"], r), a(e, ["streamFunctionCallArguments"]) !== void 0) throw new Error("streamFunctionCallArguments parameter is not supported in Gemini API.");
  return t;
}
function Pv(e) {
  const t = {}, n = a(e, ["description"]);
  n != null && l(t, ["description"], n);
  const r = a(e, ["name"]);
  r != null && l(t, ["name"], r);
  const o = a(e, ["parameters"]);
  o != null && l(t, ["parameters"], o);
  const i = a(e, ["parametersJsonSchema"]);
  i != null && l(t, ["parametersJsonSchema"], i);
  const s = a(e, ["response"]);
  s != null && l(t, ["response"], s);
  const u = a(e, ["responseJsonSchema"]);
  if (u != null && l(t, ["responseJsonSchema"], u), a(e, ["behavior"]) !== void 0) throw new Error("behavior parameter is not supported in Vertex AI.");
  return t;
}
function Mv(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], ft(e, r)), n;
}
function xv(e, t) {
  const n = {}, r = a(t, ["name"]);
  return r != null && l(n, ["_url", "name"], ft(e, r)), n;
}
function Nv(e) {
  const t = {}, n = a(e, ["authConfig"]);
  n != null && l(t, ["authConfig"], gv(n));
  const r = a(e, ["enableWidget"]);
  return r != null && l(t, ["enableWidget"], r), t;
}
function kv(e) {
  const t = {}, n = a(e, ["searchTypes"]);
  if (n != null && l(t, ["searchTypes"], n), a(e, ["blockingConfidence"]) !== void 0) throw new Error("blockingConfidence parameter is not supported in Gemini API.");
  if (a(e, ["excludeDomains"]) !== void 0) throw new Error("excludeDomains parameter is not supported in Gemini API.");
  const r = a(e, ["timeRangeFilter"]);
  return r != null && l(t, ["timeRangeFilter"], r), t;
}
function Dv(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  return t !== void 0 && o != null && l(t, ["_query", "pageToken"], o), n;
}
function $v(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  return t !== void 0 && o != null && l(t, ["_query", "pageToken"], o), n;
}
function Lv(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && Dv(n, t), t;
}
function Uv(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && $v(n, t), t;
}
function Fv(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["cachedContents"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["cachedContents"], i);
  }
  return t;
}
function Ov(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["cachedContents"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["cachedContents"], i);
  }
  return t;
}
function Gv(e) {
  const t = {}, n = a(e, ["mediaResolution"]);
  n != null && l(t, ["mediaResolution"], n);
  const r = a(e, ["codeExecutionResult"]);
  r != null && l(t, ["codeExecutionResult"], r);
  const o = a(e, ["executableCode"]);
  o != null && l(t, ["executableCode"], o);
  const i = a(e, ["fileData"]);
  i != null && l(t, ["fileData"], Iv(i));
  const s = a(e, ["functionCall"]);
  s != null && l(t, ["functionCall"], bv(s));
  const u = a(e, ["functionResponse"]);
  u != null && l(t, ["functionResponse"], u);
  const c = a(e, ["inlineData"]);
  c != null && l(t, ["inlineData"], _v(c));
  const d = a(e, ["text"]);
  d != null && l(t, ["text"], d);
  const h = a(e, ["thought"]);
  h != null && l(t, ["thought"], h);
  const f = a(e, ["thoughtSignature"]);
  f != null && l(t, ["thoughtSignature"], f);
  const p = a(e, ["videoMetadata"]);
  p != null && l(t, ["videoMetadata"], p);
  const m = a(e, ["toolCall"]);
  m != null && l(t, ["toolCall"], m);
  const g = a(e, ["toolResponse"]);
  g != null && l(t, ["toolResponse"], g);
  const _ = a(e, ["partMetadata"]);
  return _ != null && l(t, ["partMetadata"], _), t;
}
function Bv(e) {
  const t = {}, n = a(e, ["mediaResolution"]);
  n != null && l(t, ["mediaResolution"], n);
  const r = a(e, ["codeExecutionResult"]);
  r != null && l(t, ["codeExecutionResult"], r);
  const o = a(e, ["executableCode"]);
  o != null && l(t, ["executableCode"], o);
  const i = a(e, ["fileData"]);
  i != null && l(t, ["fileData"], i);
  const s = a(e, ["functionCall"]);
  s != null && l(t, ["functionCall"], s);
  const u = a(e, ["functionResponse"]);
  u != null && l(t, ["functionResponse"], u);
  const c = a(e, ["inlineData"]);
  c != null && l(t, ["inlineData"], c);
  const d = a(e, ["text"]);
  d != null && l(t, ["text"], d);
  const h = a(e, ["thought"]);
  h != null && l(t, ["thought"], h);
  const f = a(e, ["thoughtSignature"]);
  f != null && l(t, ["thoughtSignature"], f);
  const p = a(e, ["videoMetadata"]);
  if (p != null && l(t, ["videoMetadata"], p), a(e, ["toolCall"]) !== void 0) throw new Error("toolCall parameter is not supported in Vertex AI.");
  if (a(e, ["toolResponse"]) !== void 0) throw new Error("toolResponse parameter is not supported in Vertex AI.");
  if (a(e, ["partMetadata"]) !== void 0) throw new Error("partMetadata parameter is not supported in Vertex AI.");
  return t;
}
function qv(e) {
  const t = {}, n = a(e, ["retrievalConfig"]);
  n != null && l(t, ["retrievalConfig"], n);
  const r = a(e, ["functionCallingConfig"]);
  r != null && l(t, ["functionCallingConfig"], Rv(r));
  const o = a(e, ["includeServerSideToolInvocations"]);
  return o != null && l(t, ["includeServerSideToolInvocations"], o), t;
}
function Hv(e) {
  const t = {}, n = a(e, ["retrievalConfig"]);
  n != null && l(t, ["retrievalConfig"], n);
  const r = a(e, ["functionCallingConfig"]);
  if (r != null && l(t, ["functionCallingConfig"], r), a(e, ["includeServerSideToolInvocations"]) !== void 0) throw new Error("includeServerSideToolInvocations parameter is not supported in Vertex AI.");
  return t;
}
function Vv(e) {
  const t = {};
  if (a(e, ["retrieval"]) !== void 0) throw new Error("retrieval parameter is not supported in Gemini API.");
  const n = a(e, ["computerUse"]);
  n != null && l(t, ["computerUse"], n);
  const r = a(e, ["fileSearch"]);
  r != null && l(t, ["fileSearch"], r);
  const o = a(e, ["googleSearch"]);
  o != null && l(t, ["googleSearch"], kv(o));
  const i = a(e, ["googleMaps"]);
  i != null && l(t, ["googleMaps"], Nv(i));
  const s = a(e, ["codeExecution"]);
  if (s != null && l(t, ["codeExecution"], s), a(e, ["enterpriseWebSearch"]) !== void 0) throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");
  const u = a(e, ["functionDeclarations"]);
  if (u != null) {
    let f = u;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["functionDeclarations"], f);
  }
  const c = a(e, ["googleSearchRetrieval"]);
  if (c != null && l(t, ["googleSearchRetrieval"], c), a(e, ["parallelAiSearch"]) !== void 0) throw new Error("parallelAiSearch parameter is not supported in Gemini API.");
  const d = a(e, ["urlContext"]);
  d != null && l(t, ["urlContext"], d);
  const h = a(e, ["mcpServers"]);
  if (h != null) {
    let f = h;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["mcpServers"], f);
  }
  return t;
}
function Jv(e) {
  const t = {}, n = a(e, ["retrieval"]);
  n != null && l(t, ["retrieval"], n);
  const r = a(e, ["computerUse"]);
  if (r != null && l(t, ["computerUse"], r), a(e, ["fileSearch"]) !== void 0) throw new Error("fileSearch parameter is not supported in Vertex AI.");
  const o = a(e, ["googleSearch"]);
  o != null && l(t, ["googleSearch"], o);
  const i = a(e, ["googleMaps"]);
  i != null && l(t, ["googleMaps"], i);
  const s = a(e, ["codeExecution"]);
  s != null && l(t, ["codeExecution"], s);
  const u = a(e, ["enterpriseWebSearch"]);
  u != null && l(t, ["enterpriseWebSearch"], u);
  const c = a(e, ["functionDeclarations"]);
  if (c != null) {
    let p = c;
    Array.isArray(p) && (p = p.map((m) => Pv(m))), l(t, ["functionDeclarations"], p);
  }
  const d = a(e, ["googleSearchRetrieval"]);
  d != null && l(t, ["googleSearchRetrieval"], d);
  const h = a(e, ["parallelAiSearch"]);
  h != null && l(t, ["parallelAiSearch"], h);
  const f = a(e, ["urlContext"]);
  if (f != null && l(t, ["urlContext"], f), a(e, ["mcpServers"]) !== void 0) throw new Error("mcpServers parameter is not supported in Vertex AI.");
  return t;
}
function Kv(e, t) {
  const n = {}, r = a(e, ["ttl"]);
  t !== void 0 && r != null && l(t, ["ttl"], r);
  const o = a(e, ["expireTime"]);
  return t !== void 0 && o != null && l(t, ["expireTime"], o), n;
}
function Wv(e, t) {
  const n = {}, r = a(e, ["ttl"]);
  t !== void 0 && r != null && l(t, ["ttl"], r);
  const o = a(e, ["expireTime"]);
  return t !== void 0 && o != null && l(t, ["expireTime"], o), n;
}
function zv(e, t) {
  const n = {}, r = a(t, ["name"]);
  r != null && l(n, ["_url", "name"], ft(e, r));
  const o = a(t, ["config"]);
  return o != null && Kv(o, n), n;
}
function Yv(e, t) {
  const n = {}, r = a(t, ["name"]);
  r != null && l(n, ["_url", "name"], ft(e, r));
  const o = a(t, ["config"]);
  return o != null && Wv(o, n), n;
}
var Xv = class extends dt {
  constructor(e) {
    super(), this.apiClient = e, this.list = async (t = {}) => new qt(ct.PAGED_ITEM_CACHED_CONTENTS, (n) => this.listInternal(n), await this.listInternal(t), t);
  }
  async create(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Tv(this.apiClient, e);
      return s = N("cachedContents", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => d);
    } else {
      const c = Av(this.apiClient, e);
      return s = N("cachedContents", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => d);
    }
  }
  async get(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = xv(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => d);
    } else {
      const c = Mv(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => d);
    }
  }
  async delete(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Ev(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "DELETE",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = wv(d), f = new Uu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = Sv(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "DELETE",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = Cv(d), f = new Uu();
        return Object.assign(f, h), f;
      });
    }
  }
  async update(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Yv(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "PATCH",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => d);
    } else {
      const c = zv(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "PATCH",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => d);
    }
  }
  async listInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Uv(e);
      return s = N("cachedContents", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = Ov(d), f = new Fu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = Lv(e);
      return s = N("cachedContents", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = Fv(d), f = new Fu();
        return Object.assign(f, h), f;
      });
    }
  }
};
function St(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++) t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function Ku(e) {
  var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number") return { next: function() {
    return e && r >= e.length && (e = void 0), {
      value: e && e[r++],
      done: !e
    };
  } };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function q(e) {
  return this instanceof q ? (this.v = e, this) : new q(e);
}
function Je(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []), o, i = [];
  return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), u("next"), u("throw"), u("return", s), o[Symbol.asyncIterator] = function() {
    return this;
  }, o;
  function s(m) {
    return function(g) {
      return Promise.resolve(g).then(m, f);
    };
  }
  function u(m, g) {
    r[m] && (o[m] = function(_) {
      return new Promise(function(y, E) {
        i.push([
          m,
          _,
          y,
          E
        ]) > 1 || c(m, _);
      });
    }, g && (o[m] = g(o[m])));
  }
  function c(m, g) {
    try {
      d(r[m](g));
    } catch (_) {
      p(i[0][3], _);
    }
  }
  function d(m) {
    m.value instanceof q ? Promise.resolve(m.value.v).then(h, f) : p(i[0][2], m);
  }
  function h(m) {
    c("next", m);
  }
  function f(m) {
    c("throw", m);
  }
  function p(m, g) {
    m(g), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function Ke(e) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator], n;
  return t ? t.call(e) : (e = typeof Ku == "function" ? Ku(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
    return this;
  }, n);
  function r(i) {
    n[i] = e[i] && function(s) {
      return new Promise(function(u, c) {
        s = e[i](s), o(u, c, s.done, s.value);
      });
    };
  }
  function o(i, s, u, c) {
    Promise.resolve(c).then(function(d) {
      i({
        value: d,
        done: u
      });
    }, s);
  }
}
function Qv(e) {
  var t;
  if (e.candidates == null || e.candidates.length === 0) return !1;
  const n = (t = e.candidates[0]) === null || t === void 0 ? void 0 : t.content;
  return n === void 0 ? !1 : Bf(n);
}
function Bf(e) {
  if (e.parts === void 0 || e.parts.length === 0) return !1;
  for (const t of e.parts) if (t === void 0 || Object.keys(t).length === 0) return !1;
  return !0;
}
function Zv(e) {
  if (e.length !== 0) {
    for (const t of e) if (t.role !== "user" && t.role !== "model") throw new Error(`Role must be user or model, but got ${t.role}.`);
  }
}
function Wu(e) {
  if (e === void 0 || e.length === 0) return [];
  const t = [], n = e.length;
  let r = 0;
  for (; r < n; ) if (e[r].role === "user")
    t.push(e[r]), r++;
  else {
    const o = [];
    let i = !0;
    for (; r < n && e[r].role === "model"; )
      o.push(e[r]), i && !Bf(e[r]) && (i = !1), r++;
    i ? t.push(...o) : t.pop();
  }
  return t;
}
var jv = class {
  constructor(e, t) {
    this.modelsModule = e, this.apiClient = t;
  }
  create(e) {
    return new eA(this.apiClient, this.modelsModule, e.model, e.config, structuredClone(e.history));
  }
}, eA = class {
  constructor(e, t, n, r = {}, o = []) {
    this.apiClient = e, this.modelsModule = t, this.model = n, this.config = r, this.history = o, this.sendPromise = Promise.resolve(), Zv(o);
  }
  async sendMessage(e) {
    var t;
    await this.sendPromise;
    const n = se(e.message), r = this.modelsModule.generateContent({
      model: this.model,
      contents: this.getHistory(!0).concat(n),
      config: (t = e.config) !== null && t !== void 0 ? t : this.config
    });
    return this.sendPromise = (async () => {
      var o, i, s;
      const u = await r, c = (i = (o = u.candidates) === null || o === void 0 ? void 0 : o[0]) === null || i === void 0 ? void 0 : i.content, d = u.automaticFunctionCallingHistory, h = this.getHistory(!0).length;
      let f = [];
      d != null && (f = (s = d.slice(h)) !== null && s !== void 0 ? s : []);
      const p = c ? [c] : [];
      this.recordHistory(n, p, f);
    })(), await this.sendPromise.catch(() => {
      this.sendPromise = Promise.resolve();
    }), r;
  }
  async sendMessageStream(e) {
    var t;
    await this.sendPromise;
    const n = se(e.message), r = this.modelsModule.generateContentStream({
      model: this.model,
      contents: this.getHistory(!0).concat(n),
      config: (t = e.config) !== null && t !== void 0 ? t : this.config
    });
    this.sendPromise = r.then(() => {
    }).catch(() => {
    });
    const o = await r;
    return this.processStreamResponse(o, n);
  }
  getHistory(e = !1) {
    const t = e ? Wu(this.history) : this.history;
    return structuredClone(t);
  }
  processStreamResponse(e, t) {
    return Je(this, arguments, function* () {
      var r, o, i, s, u, c;
      const d = [];
      try {
        for (var h = !0, f = Ke(e), p; p = yield q(f.next()), r = p.done, !r; h = !0) {
          s = p.value, h = !1;
          const m = s;
          if (Qv(m)) {
            const g = (c = (u = m.candidates) === null || u === void 0 ? void 0 : u[0]) === null || c === void 0 ? void 0 : c.content;
            g !== void 0 && d.push(g);
          }
          yield yield q(m);
        }
      } catch (m) {
        o = { error: m };
      } finally {
        try {
          !h && !r && (i = f.return) && (yield q(i.call(f)));
        } finally {
          if (o) throw o.error;
        }
      }
      this.recordHistory(t, d);
    });
  }
  recordHistory(e, t, n) {
    let r = [];
    t.length > 0 && t.every((o) => o.role !== void 0) ? r = t : r.push({
      role: "model",
      parts: []
    }), n && n.length > 0 ? this.history.push(...Wu(n)) : this.history.push(e), this.history.push(...r);
  }
}, qf = class Hf extends Error {
  constructor(t) {
    super(t.message), this.name = "ApiError", this.status = t.status, Object.setPrototypeOf(this, Hf.prototype);
  }
};
function tA(e) {
  const t = {}, n = a(e, ["file"]);
  return n != null && l(t, ["file"], n), t;
}
function nA(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  return n != null && l(t, ["sdkHttpResponse"], n), t;
}
function rA(e) {
  const t = {}, n = a(e, ["name"]);
  return n != null && l(t, ["_url", "file"], Df(n)), t;
}
function oA(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  return n != null && l(t, ["sdkHttpResponse"], n), t;
}
function iA(e) {
  const t = {}, n = a(e, ["name"]);
  return n != null && l(t, ["_url", "file"], Df(n)), t;
}
function sA(e) {
  const t = {}, n = a(e, ["uris"]);
  return n != null && l(t, ["uris"], n), t;
}
function aA(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  return t !== void 0 && o != null && l(t, ["_query", "pageToken"], o), n;
}
function lA(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && aA(n, t), t;
}
function uA(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["files"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["files"], i);
  }
  return t;
}
function cA(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["files"]);
  if (r != null) {
    let o = r;
    Array.isArray(o) && (o = o.map((i) => i)), l(t, ["files"], o);
  }
  return t;
}
var dA = class extends dt {
  constructor(e) {
    super(), this.apiClient = e, this.list = async (t = {}) => new qt(ct.PAGED_ITEM_FILES, (n) => this.listInternal(n), await this.listInternal(t), t);
  }
  async upload(e) {
    if (this.apiClient.isVertexAI()) throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");
    return this.apiClient.uploadFile(e.file, e.config).then((t) => t);
  }
  async download(e) {
    await this.apiClient.downloadFile(e);
  }
  async registerFiles(e) {
    throw new Error("registerFiles is only supported in Node.js environments.");
  }
  async _registerFiles(e) {
    return this.registerFilesInternal(e);
  }
  async listInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = lA(e);
      return o = N("files", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => {
        const c = uA(u), d = new sy();
        return Object.assign(d, c), d;
      });
    }
  }
  async createInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = tA(e);
      return o = N("upload/v1beta/files", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = nA(u), d = new ay();
        return Object.assign(d, c), d;
      });
    }
  }
  async get(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = iA(e);
      return o = N("files/{file}", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => u);
    }
  }
  async delete(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = rA(e);
      return o = N("files/{file}", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "DELETE",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => {
        const c = oA(u), d = new ly();
        return Object.assign(d, c), d;
      });
    }
  }
  async registerFilesInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = sA(e);
      return o = N("files:register", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = cA(u), d = new uy();
        return Object.assign(d, c), d;
      });
    }
  }
};
function zu(e) {
  const t = {};
  if (a(e, ["languageCodes"]) !== void 0) throw new Error("languageCodes parameter is not supported in Gemini API.");
  return t;
}
function fA(e) {
  const t = {}, n = a(e, ["apiKey"]);
  if (n != null && l(t, ["apiKey"], n), a(e, ["apiKeyConfig"]) !== void 0) throw new Error("apiKeyConfig parameter is not supported in Gemini API.");
  if (a(e, ["authType"]) !== void 0) throw new Error("authType parameter is not supported in Gemini API.");
  if (a(e, ["googleServiceAccountConfig"]) !== void 0) throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");
  if (a(e, ["httpBasicAuthConfig"]) !== void 0) throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oauthConfig"]) !== void 0) throw new Error("oauthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oidcConfig"]) !== void 0) throw new Error("oidcConfig parameter is not supported in Gemini API.");
  return t;
}
function lo(e) {
  const t = {}, n = a(e, ["data"]);
  if (n != null && l(t, ["data"], n), a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function hA(e) {
  const t = {}, n = a(e, ["parts"]);
  if (n != null) {
    let o = n;
    Array.isArray(o) && (o = o.map((i) => MA(i))), l(t, ["parts"], o);
  }
  const r = a(e, ["role"]);
  return r != null && l(t, ["role"], r), t;
}
function pA(e) {
  const t = {}, n = a(e, ["parts"]);
  if (n != null) {
    let o = n;
    Array.isArray(o) && (o = o.map((i) => xA(i))), l(t, ["parts"], o);
  }
  const r = a(e, ["role"]);
  return r != null && l(t, ["role"], r), t;
}
function mA(e) {
  const t = {};
  if (a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const n = a(e, ["fileUri"]);
  n != null && l(t, ["fileUri"], n);
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function gA(e) {
  const t = {}, n = a(e, ["id"]);
  n != null && l(t, ["id"], n);
  const r = a(e, ["args"]);
  r != null && l(t, ["args"], r);
  const o = a(e, ["name"]);
  if (o != null && l(t, ["name"], o), a(e, ["partialArgs"]) !== void 0) throw new Error("partialArgs parameter is not supported in Gemini API.");
  if (a(e, ["willContinue"]) !== void 0) throw new Error("willContinue parameter is not supported in Gemini API.");
  return t;
}
function _A(e) {
  const t = {}, n = a(e, ["description"]);
  n != null && l(t, ["description"], n);
  const r = a(e, ["name"]);
  r != null && l(t, ["name"], r);
  const o = a(e, ["parameters"]);
  o != null && l(t, ["parameters"], o);
  const i = a(e, ["parametersJsonSchema"]);
  i != null && l(t, ["parametersJsonSchema"], i);
  const s = a(e, ["response"]);
  s != null && l(t, ["response"], s);
  const u = a(e, ["responseJsonSchema"]);
  if (u != null && l(t, ["responseJsonSchema"], u), a(e, ["behavior"]) !== void 0) throw new Error("behavior parameter is not supported in Vertex AI.");
  return t;
}
function yA(e) {
  const t = {}, n = a(e, ["modelSelectionConfig"]);
  n != null && l(t, ["modelConfig"], n);
  const r = a(e, ["responseJsonSchema"]);
  r != null && l(t, ["responseJsonSchema"], r);
  const o = a(e, ["audioTimestamp"]);
  o != null && l(t, ["audioTimestamp"], o);
  const i = a(e, ["candidateCount"]);
  i != null && l(t, ["candidateCount"], i);
  const s = a(e, ["enableAffectiveDialog"]);
  s != null && l(t, ["enableAffectiveDialog"], s);
  const u = a(e, ["frequencyPenalty"]);
  u != null && l(t, ["frequencyPenalty"], u);
  const c = a(e, ["logprobs"]);
  c != null && l(t, ["logprobs"], c);
  const d = a(e, ["maxOutputTokens"]);
  d != null && l(t, ["maxOutputTokens"], d);
  const h = a(e, ["mediaResolution"]);
  h != null && l(t, ["mediaResolution"], h);
  const f = a(e, ["presencePenalty"]);
  f != null && l(t, ["presencePenalty"], f);
  const p = a(e, ["responseLogprobs"]);
  p != null && l(t, ["responseLogprobs"], p);
  const m = a(e, ["responseMimeType"]);
  m != null && l(t, ["responseMimeType"], m);
  const g = a(e, ["responseModalities"]);
  g != null && l(t, ["responseModalities"], g);
  const _ = a(e, ["responseSchema"]);
  _ != null && l(t, ["responseSchema"], _);
  const y = a(e, ["routingConfig"]);
  y != null && l(t, ["routingConfig"], y);
  const E = a(e, ["seed"]);
  E != null && l(t, ["seed"], E);
  const A = a(e, ["speechConfig"]);
  A != null && l(t, ["speechConfig"], A);
  const w = a(e, ["stopSequences"]);
  w != null && l(t, ["stopSequences"], w);
  const P = a(e, ["temperature"]);
  P != null && l(t, ["temperature"], P);
  const L = a(e, ["thinkingConfig"]);
  L != null && l(t, ["thinkingConfig"], L);
  const C = a(e, ["topK"]);
  C != null && l(t, ["topK"], C);
  const k = a(e, ["topP"]);
  if (k != null && l(t, ["topP"], k), a(e, ["enableEnhancedCivicAnswers"]) !== void 0) throw new Error("enableEnhancedCivicAnswers parameter is not supported in Vertex AI.");
  return t;
}
function vA(e) {
  const t = {}, n = a(e, ["authConfig"]);
  n != null && l(t, ["authConfig"], fA(n));
  const r = a(e, ["enableWidget"]);
  return r != null && l(t, ["enableWidget"], r), t;
}
function AA(e) {
  const t = {}, n = a(e, ["searchTypes"]);
  if (n != null && l(t, ["searchTypes"], n), a(e, ["blockingConfidence"]) !== void 0) throw new Error("blockingConfidence parameter is not supported in Gemini API.");
  if (a(e, ["excludeDomains"]) !== void 0) throw new Error("excludeDomains parameter is not supported in Gemini API.");
  const r = a(e, ["timeRangeFilter"]);
  return r != null && l(t, ["timeRangeFilter"], r), t;
}
function TA(e, t) {
  const n = {}, r = a(e, ["generationConfig"]);
  t !== void 0 && r != null && l(t, ["setup", "generationConfig"], r);
  const o = a(e, ["responseModalities"]);
  t !== void 0 && o != null && l(t, [
    "setup",
    "generationConfig",
    "responseModalities"
  ], o);
  const i = a(e, ["temperature"]);
  t !== void 0 && i != null && l(t, [
    "setup",
    "generationConfig",
    "temperature"
  ], i);
  const s = a(e, ["topP"]);
  t !== void 0 && s != null && l(t, [
    "setup",
    "generationConfig",
    "topP"
  ], s);
  const u = a(e, ["topK"]);
  t !== void 0 && u != null && l(t, [
    "setup",
    "generationConfig",
    "topK"
  ], u);
  const c = a(e, ["maxOutputTokens"]);
  t !== void 0 && c != null && l(t, [
    "setup",
    "generationConfig",
    "maxOutputTokens"
  ], c);
  const d = a(e, ["mediaResolution"]);
  t !== void 0 && d != null && l(t, [
    "setup",
    "generationConfig",
    "mediaResolution"
  ], d);
  const h = a(e, ["seed"]);
  t !== void 0 && h != null && l(t, [
    "setup",
    "generationConfig",
    "seed"
  ], h);
  const f = a(e, ["speechConfig"]);
  t !== void 0 && f != null && l(t, [
    "setup",
    "generationConfig",
    "speechConfig"
  ], ra(f));
  const p = a(e, ["thinkingConfig"]);
  t !== void 0 && p != null && l(t, [
    "setup",
    "generationConfig",
    "thinkingConfig"
  ], p);
  const m = a(e, ["enableAffectiveDialog"]);
  t !== void 0 && m != null && l(t, [
    "setup",
    "generationConfig",
    "enableAffectiveDialog"
  ], m);
  const g = a(e, ["systemInstruction"]);
  t !== void 0 && g != null && l(t, ["setup", "systemInstruction"], hA(se(g)));
  const _ = a(e, ["tools"]);
  if (t !== void 0 && _ != null) {
    let I = mn(_);
    Array.isArray(I) && (I = I.map((x) => DA(pn(x)))), l(t, ["setup", "tools"], I);
  }
  const y = a(e, ["sessionResumption"]);
  t !== void 0 && y != null && l(t, ["setup", "sessionResumption"], kA(y));
  const E = a(e, ["inputAudioTranscription"]);
  t !== void 0 && E != null && l(t, ["setup", "inputAudioTranscription"], zu(E));
  const A = a(e, ["outputAudioTranscription"]);
  t !== void 0 && A != null && l(t, ["setup", "outputAudioTranscription"], zu(A));
  const w = a(e, ["realtimeInputConfig"]);
  t !== void 0 && w != null && l(t, ["setup", "realtimeInputConfig"], w);
  const P = a(e, ["contextWindowCompression"]);
  t !== void 0 && P != null && l(t, ["setup", "contextWindowCompression"], P);
  const L = a(e, ["proactivity"]);
  if (t !== void 0 && L != null && l(t, ["setup", "proactivity"], L), a(e, ["explicitVadSignal"]) !== void 0) throw new Error("explicitVadSignal parameter is not supported in Gemini API.");
  const C = a(e, ["avatarConfig"]);
  t !== void 0 && C != null && l(t, ["setup", "avatarConfig"], C);
  const k = a(e, ["safetySettings"]);
  if (t !== void 0 && k != null) {
    let I = k;
    Array.isArray(I) && (I = I.map((x) => NA(x))), l(t, ["setup", "safetySettings"], I);
  }
  return n;
}
function SA(e, t) {
  const n = {}, r = a(e, ["generationConfig"]);
  t !== void 0 && r != null && l(t, ["setup", "generationConfig"], yA(r));
  const o = a(e, ["responseModalities"]);
  t !== void 0 && o != null && l(t, [
    "setup",
    "generationConfig",
    "responseModalities"
  ], o);
  const i = a(e, ["temperature"]);
  t !== void 0 && i != null && l(t, [
    "setup",
    "generationConfig",
    "temperature"
  ], i);
  const s = a(e, ["topP"]);
  t !== void 0 && s != null && l(t, [
    "setup",
    "generationConfig",
    "topP"
  ], s);
  const u = a(e, ["topK"]);
  t !== void 0 && u != null && l(t, [
    "setup",
    "generationConfig",
    "topK"
  ], u);
  const c = a(e, ["maxOutputTokens"]);
  t !== void 0 && c != null && l(t, [
    "setup",
    "generationConfig",
    "maxOutputTokens"
  ], c);
  const d = a(e, ["mediaResolution"]);
  t !== void 0 && d != null && l(t, [
    "setup",
    "generationConfig",
    "mediaResolution"
  ], d);
  const h = a(e, ["seed"]);
  t !== void 0 && h != null && l(t, [
    "setup",
    "generationConfig",
    "seed"
  ], h);
  const f = a(e, ["speechConfig"]);
  t !== void 0 && f != null && l(t, [
    "setup",
    "generationConfig",
    "speechConfig"
  ], ra(f));
  const p = a(e, ["thinkingConfig"]);
  t !== void 0 && p != null && l(t, [
    "setup",
    "generationConfig",
    "thinkingConfig"
  ], p);
  const m = a(e, ["enableAffectiveDialog"]);
  t !== void 0 && m != null && l(t, [
    "setup",
    "generationConfig",
    "enableAffectiveDialog"
  ], m);
  const g = a(e, ["systemInstruction"]);
  t !== void 0 && g != null && l(t, ["setup", "systemInstruction"], pA(se(g)));
  const _ = a(e, ["tools"]);
  if (t !== void 0 && _ != null) {
    let x = mn(_);
    Array.isArray(x) && (x = x.map((b) => $A(pn(b)))), l(t, ["setup", "tools"], x);
  }
  const y = a(e, ["sessionResumption"]);
  t !== void 0 && y != null && l(t, ["setup", "sessionResumption"], y);
  const E = a(e, ["inputAudioTranscription"]);
  t !== void 0 && E != null && l(t, ["setup", "inputAudioTranscription"], E);
  const A = a(e, ["outputAudioTranscription"]);
  t !== void 0 && A != null && l(t, ["setup", "outputAudioTranscription"], A);
  const w = a(e, ["realtimeInputConfig"]);
  t !== void 0 && w != null && l(t, ["setup", "realtimeInputConfig"], w);
  const P = a(e, ["contextWindowCompression"]);
  t !== void 0 && P != null && l(t, ["setup", "contextWindowCompression"], P);
  const L = a(e, ["proactivity"]);
  t !== void 0 && L != null && l(t, ["setup", "proactivity"], L);
  const C = a(e, ["explicitVadSignal"]);
  t !== void 0 && C != null && l(t, ["setup", "explicitVadSignal"], C);
  const k = a(e, ["avatarConfig"]);
  t !== void 0 && k != null && l(t, ["setup", "avatarConfig"], k);
  const I = a(e, ["safetySettings"]);
  if (t !== void 0 && I != null) {
    let x = I;
    Array.isArray(x) && (x = x.map((b) => b)), l(t, ["setup", "safetySettings"], x);
  }
  return n;
}
function EA(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["setup", "model"], K(e, r));
  const o = a(t, ["config"]);
  return o != null && l(n, ["config"], TA(o, n)), n;
}
function CA(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["setup", "model"], K(e, r));
  const o = a(t, ["config"]);
  return o != null && l(n, ["config"], SA(o, n)), n;
}
function wA(e) {
  const t = {}, n = a(e, ["musicGenerationConfig"]);
  return n != null && l(t, ["musicGenerationConfig"], n), t;
}
function IA(e) {
  const t = {}, n = a(e, ["weightedPrompts"]);
  if (n != null) {
    let r = n;
    Array.isArray(r) && (r = r.map((o) => o)), l(t, ["weightedPrompts"], r);
  }
  return t;
}
function bA(e) {
  const t = {}, n = a(e, ["media"]);
  if (n != null) {
    let d = Pf(n);
    Array.isArray(d) && (d = d.map((h) => lo(h))), l(t, ["mediaChunks"], d);
  }
  const r = a(e, ["audio"]);
  r != null && l(t, ["audio"], lo(xf(r)));
  const o = a(e, ["audioStreamEnd"]);
  o != null && l(t, ["audioStreamEnd"], o);
  const i = a(e, ["video"]);
  i != null && l(t, ["video"], lo(Mf(i)));
  const s = a(e, ["text"]);
  s != null && l(t, ["text"], s);
  const u = a(e, ["activityStart"]);
  u != null && l(t, ["activityStart"], u);
  const c = a(e, ["activityEnd"]);
  return c != null && l(t, ["activityEnd"], c), t;
}
function RA(e) {
  const t = {}, n = a(e, ["media"]);
  if (n != null) {
    let d = Pf(n);
    Array.isArray(d) && (d = d.map((h) => h)), l(t, ["mediaChunks"], d);
  }
  const r = a(e, ["audio"]);
  r != null && l(t, ["audio"], xf(r));
  const o = a(e, ["audioStreamEnd"]);
  o != null && l(t, ["audioStreamEnd"], o);
  const i = a(e, ["video"]);
  i != null && l(t, ["video"], Mf(i));
  const s = a(e, ["text"]);
  s != null && l(t, ["text"], s);
  const u = a(e, ["activityStart"]);
  u != null && l(t, ["activityStart"], u);
  const c = a(e, ["activityEnd"]);
  return c != null && l(t, ["activityEnd"], c), t;
}
function PA(e) {
  const t = {}, n = a(e, ["setupComplete"]);
  n != null && l(t, ["setupComplete"], n);
  const r = a(e, ["serverContent"]);
  r != null && l(t, ["serverContent"], r);
  const o = a(e, ["toolCall"]);
  o != null && l(t, ["toolCall"], o);
  const i = a(e, ["toolCallCancellation"]);
  i != null && l(t, ["toolCallCancellation"], i);
  const s = a(e, ["usageMetadata"]);
  s != null && l(t, ["usageMetadata"], LA(s));
  const u = a(e, ["goAway"]);
  u != null && l(t, ["goAway"], u);
  const c = a(e, ["sessionResumptionUpdate"]);
  c != null && l(t, ["sessionResumptionUpdate"], c);
  const d = a(e, ["voiceActivityDetectionSignal"]);
  d != null && l(t, ["voiceActivityDetectionSignal"], d);
  const h = a(e, ["voiceActivity"]);
  return h != null && l(t, ["voiceActivity"], UA(h)), t;
}
function MA(e) {
  const t = {}, n = a(e, ["mediaResolution"]);
  n != null && l(t, ["mediaResolution"], n);
  const r = a(e, ["codeExecutionResult"]);
  r != null && l(t, ["codeExecutionResult"], r);
  const o = a(e, ["executableCode"]);
  o != null && l(t, ["executableCode"], o);
  const i = a(e, ["fileData"]);
  i != null && l(t, ["fileData"], mA(i));
  const s = a(e, ["functionCall"]);
  s != null && l(t, ["functionCall"], gA(s));
  const u = a(e, ["functionResponse"]);
  u != null && l(t, ["functionResponse"], u);
  const c = a(e, ["inlineData"]);
  c != null && l(t, ["inlineData"], lo(c));
  const d = a(e, ["text"]);
  d != null && l(t, ["text"], d);
  const h = a(e, ["thought"]);
  h != null && l(t, ["thought"], h);
  const f = a(e, ["thoughtSignature"]);
  f != null && l(t, ["thoughtSignature"], f);
  const p = a(e, ["videoMetadata"]);
  p != null && l(t, ["videoMetadata"], p);
  const m = a(e, ["toolCall"]);
  m != null && l(t, ["toolCall"], m);
  const g = a(e, ["toolResponse"]);
  g != null && l(t, ["toolResponse"], g);
  const _ = a(e, ["partMetadata"]);
  return _ != null && l(t, ["partMetadata"], _), t;
}
function xA(e) {
  const t = {}, n = a(e, ["mediaResolution"]);
  n != null && l(t, ["mediaResolution"], n);
  const r = a(e, ["codeExecutionResult"]);
  r != null && l(t, ["codeExecutionResult"], r);
  const o = a(e, ["executableCode"]);
  o != null && l(t, ["executableCode"], o);
  const i = a(e, ["fileData"]);
  i != null && l(t, ["fileData"], i);
  const s = a(e, ["functionCall"]);
  s != null && l(t, ["functionCall"], s);
  const u = a(e, ["functionResponse"]);
  u != null && l(t, ["functionResponse"], u);
  const c = a(e, ["inlineData"]);
  c != null && l(t, ["inlineData"], c);
  const d = a(e, ["text"]);
  d != null && l(t, ["text"], d);
  const h = a(e, ["thought"]);
  h != null && l(t, ["thought"], h);
  const f = a(e, ["thoughtSignature"]);
  f != null && l(t, ["thoughtSignature"], f);
  const p = a(e, ["videoMetadata"]);
  if (p != null && l(t, ["videoMetadata"], p), a(e, ["toolCall"]) !== void 0) throw new Error("toolCall parameter is not supported in Vertex AI.");
  if (a(e, ["toolResponse"]) !== void 0) throw new Error("toolResponse parameter is not supported in Vertex AI.");
  if (a(e, ["partMetadata"]) !== void 0) throw new Error("partMetadata parameter is not supported in Vertex AI.");
  return t;
}
function NA(e) {
  const t = {}, n = a(e, ["category"]);
  if (n != null && l(t, ["category"], n), a(e, ["method"]) !== void 0) throw new Error("method parameter is not supported in Gemini API.");
  const r = a(e, ["threshold"]);
  return r != null && l(t, ["threshold"], r), t;
}
function kA(e) {
  const t = {}, n = a(e, ["handle"]);
  if (n != null && l(t, ["handle"], n), a(e, ["transparent"]) !== void 0) throw new Error("transparent parameter is not supported in Gemini API.");
  return t;
}
function DA(e) {
  const t = {};
  if (a(e, ["retrieval"]) !== void 0) throw new Error("retrieval parameter is not supported in Gemini API.");
  const n = a(e, ["computerUse"]);
  n != null && l(t, ["computerUse"], n);
  const r = a(e, ["fileSearch"]);
  r != null && l(t, ["fileSearch"], r);
  const o = a(e, ["googleSearch"]);
  o != null && l(t, ["googleSearch"], AA(o));
  const i = a(e, ["googleMaps"]);
  i != null && l(t, ["googleMaps"], vA(i));
  const s = a(e, ["codeExecution"]);
  if (s != null && l(t, ["codeExecution"], s), a(e, ["enterpriseWebSearch"]) !== void 0) throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");
  const u = a(e, ["functionDeclarations"]);
  if (u != null) {
    let f = u;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["functionDeclarations"], f);
  }
  const c = a(e, ["googleSearchRetrieval"]);
  if (c != null && l(t, ["googleSearchRetrieval"], c), a(e, ["parallelAiSearch"]) !== void 0) throw new Error("parallelAiSearch parameter is not supported in Gemini API.");
  const d = a(e, ["urlContext"]);
  d != null && l(t, ["urlContext"], d);
  const h = a(e, ["mcpServers"]);
  if (h != null) {
    let f = h;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["mcpServers"], f);
  }
  return t;
}
function $A(e) {
  const t = {}, n = a(e, ["retrieval"]);
  n != null && l(t, ["retrieval"], n);
  const r = a(e, ["computerUse"]);
  if (r != null && l(t, ["computerUse"], r), a(e, ["fileSearch"]) !== void 0) throw new Error("fileSearch parameter is not supported in Vertex AI.");
  const o = a(e, ["googleSearch"]);
  o != null && l(t, ["googleSearch"], o);
  const i = a(e, ["googleMaps"]);
  i != null && l(t, ["googleMaps"], i);
  const s = a(e, ["codeExecution"]);
  s != null && l(t, ["codeExecution"], s);
  const u = a(e, ["enterpriseWebSearch"]);
  u != null && l(t, ["enterpriseWebSearch"], u);
  const c = a(e, ["functionDeclarations"]);
  if (c != null) {
    let p = c;
    Array.isArray(p) && (p = p.map((m) => _A(m))), l(t, ["functionDeclarations"], p);
  }
  const d = a(e, ["googleSearchRetrieval"]);
  d != null && l(t, ["googleSearchRetrieval"], d);
  const h = a(e, ["parallelAiSearch"]);
  h != null && l(t, ["parallelAiSearch"], h);
  const f = a(e, ["urlContext"]);
  if (f != null && l(t, ["urlContext"], f), a(e, ["mcpServers"]) !== void 0) throw new Error("mcpServers parameter is not supported in Vertex AI.");
  return t;
}
function LA(e) {
  const t = {}, n = a(e, ["promptTokenCount"]);
  n != null && l(t, ["promptTokenCount"], n);
  const r = a(e, ["cachedContentTokenCount"]);
  r != null && l(t, ["cachedContentTokenCount"], r);
  const o = a(e, ["candidatesTokenCount"]);
  o != null && l(t, ["responseTokenCount"], o);
  const i = a(e, ["toolUsePromptTokenCount"]);
  i != null && l(t, ["toolUsePromptTokenCount"], i);
  const s = a(e, ["thoughtsTokenCount"]);
  s != null && l(t, ["thoughtsTokenCount"], s);
  const u = a(e, ["totalTokenCount"]);
  u != null && l(t, ["totalTokenCount"], u);
  const c = a(e, ["promptTokensDetails"]);
  if (c != null) {
    let m = c;
    Array.isArray(m) && (m = m.map((g) => g)), l(t, ["promptTokensDetails"], m);
  }
  const d = a(e, ["cacheTokensDetails"]);
  if (d != null) {
    let m = d;
    Array.isArray(m) && (m = m.map((g) => g)), l(t, ["cacheTokensDetails"], m);
  }
  const h = a(e, ["candidatesTokensDetails"]);
  if (h != null) {
    let m = h;
    Array.isArray(m) && (m = m.map((g) => g)), l(t, ["responseTokensDetails"], m);
  }
  const f = a(e, ["toolUsePromptTokensDetails"]);
  if (f != null) {
    let m = f;
    Array.isArray(m) && (m = m.map((g) => g)), l(t, ["toolUsePromptTokensDetails"], m);
  }
  const p = a(e, ["trafficType"]);
  return p != null && l(t, ["trafficType"], p), t;
}
function UA(e) {
  const t = {}, n = a(e, ["type"]);
  return n != null && l(t, ["voiceActivityType"], n), t;
}
function FA(e, t) {
  const n = {}, r = a(e, ["apiKey"]);
  if (r != null && l(n, ["apiKey"], r), a(e, ["apiKeyConfig"]) !== void 0) throw new Error("apiKeyConfig parameter is not supported in Gemini API.");
  if (a(e, ["authType"]) !== void 0) throw new Error("authType parameter is not supported in Gemini API.");
  if (a(e, ["googleServiceAccountConfig"]) !== void 0) throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");
  if (a(e, ["httpBasicAuthConfig"]) !== void 0) throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oauthConfig"]) !== void 0) throw new Error("oauthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oidcConfig"]) !== void 0) throw new Error("oidcConfig parameter is not supported in Gemini API.");
  return n;
}
function OA(e, t) {
  const n = {}, r = a(e, ["data"]);
  if (r != null && l(n, ["data"], r), a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const o = a(e, ["mimeType"]);
  return o != null && l(n, ["mimeType"], o), n;
}
function GA(e, t) {
  const n = {}, r = a(e, ["content"]);
  r != null && l(n, ["content"], r);
  const o = a(e, ["citationMetadata"]);
  o != null && l(n, ["citationMetadata"], BA(o));
  const i = a(e, ["tokenCount"]);
  i != null && l(n, ["tokenCount"], i);
  const s = a(e, ["finishReason"]);
  s != null && l(n, ["finishReason"], s);
  const u = a(e, ["groundingMetadata"]);
  u != null && l(n, ["groundingMetadata"], u);
  const c = a(e, ["avgLogprobs"]);
  c != null && l(n, ["avgLogprobs"], c);
  const d = a(e, ["index"]);
  d != null && l(n, ["index"], d);
  const h = a(e, ["logprobsResult"]);
  h != null && l(n, ["logprobsResult"], h);
  const f = a(e, ["safetyRatings"]);
  if (f != null) {
    let m = f;
    Array.isArray(m) && (m = m.map((g) => g)), l(n, ["safetyRatings"], m);
  }
  const p = a(e, ["urlContextMetadata"]);
  return p != null && l(n, ["urlContextMetadata"], p), n;
}
function BA(e, t) {
  const n = {}, r = a(e, ["citationSources"]);
  if (r != null) {
    let o = r;
    Array.isArray(o) && (o = o.map((i) => i)), l(n, ["citations"], o);
  }
  return n;
}
function qA(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["contents"]);
  if (i != null) {
    let s = ve(i);
    Array.isArray(s) && (s = s.map((u) => _n(u))), l(r, ["contents"], s);
  }
  return r;
}
function HA(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["tokensInfo"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(n, ["tokensInfo"], i);
  }
  return n;
}
function VA(e, t) {
  const n = {}, r = a(e, ["values"]);
  r != null && l(n, ["values"], r);
  const o = a(e, ["statistics"]);
  return o != null && l(n, ["statistics"], JA(o)), n;
}
function JA(e, t) {
  const n = {}, r = a(e, ["truncated"]);
  r != null && l(n, ["truncated"], r);
  const o = a(e, ["token_count"]);
  return o != null && l(n, ["tokenCount"], o), n;
}
function Tr(e, t) {
  const n = {}, r = a(e, ["parts"]);
  if (r != null) {
    let i = r;
    Array.isArray(i) && (i = i.map((s) => eS(s))), l(n, ["parts"], i);
  }
  const o = a(e, ["role"]);
  return o != null && l(n, ["role"], o), n;
}
function _n(e, t) {
  const n = {}, r = a(e, ["parts"]);
  if (r != null) {
    let i = r;
    Array.isArray(i) && (i = i.map((s) => tS(s))), l(n, ["parts"], i);
  }
  const o = a(e, ["role"]);
  return o != null && l(n, ["role"], o), n;
}
function KA(e, t) {
  const n = {}, r = a(e, ["controlType"]);
  r != null && l(n, ["controlType"], r);
  const o = a(e, ["enableControlImageComputation"]);
  return o != null && l(n, ["computeControl"], o), n;
}
function WA(e, t) {
  const n = {};
  if (a(e, ["systemInstruction"]) !== void 0) throw new Error("systemInstruction parameter is not supported in Gemini API.");
  if (a(e, ["tools"]) !== void 0) throw new Error("tools parameter is not supported in Gemini API.");
  if (a(e, ["generationConfig"]) !== void 0) throw new Error("generationConfig parameter is not supported in Gemini API.");
  return n;
}
function zA(e, t, n) {
  const r = {}, o = a(e, ["systemInstruction"]);
  t !== void 0 && o != null && l(t, ["systemInstruction"], _n(se(o)));
  const i = a(e, ["tools"]);
  if (t !== void 0 && i != null) {
    let u = i;
    Array.isArray(u) && (u = u.map((c) => Wf(c))), l(t, ["tools"], u);
  }
  const s = a(e, ["generationConfig"]);
  return t !== void 0 && s != null && l(t, ["generationConfig"], OT(s)), r;
}
function YA(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["contents"]);
  if (i != null) {
    let u = ve(i);
    Array.isArray(u) && (u = u.map((c) => Tr(c))), l(r, ["contents"], u);
  }
  const s = a(t, ["config"]);
  return s != null && WA(s), r;
}
function XA(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["contents"]);
  if (i != null) {
    let u = ve(i);
    Array.isArray(u) && (u = u.map((c) => _n(c))), l(r, ["contents"], u);
  }
  const s = a(t, ["config"]);
  return s != null && zA(s, r), r;
}
function QA(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["totalTokens"]);
  o != null && l(n, ["totalTokens"], o);
  const i = a(e, ["cachedContentTokenCount"]);
  return i != null && l(n, ["cachedContentTokenCount"], i), n;
}
function ZA(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["totalTokens"]);
  return o != null && l(n, ["totalTokens"], o), n;
}
function jA(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  return o != null && l(r, ["_url", "name"], K(e, o)), r;
}
function eT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  return o != null && l(r, ["_url", "name"], K(e, o)), r;
}
function tT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  return r != null && l(n, ["sdkHttpResponse"], r), n;
}
function nT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  return r != null && l(n, ["sdkHttpResponse"], r), n;
}
function rT(e, t, n) {
  const r = {}, o = a(e, ["outputGcsUri"]);
  t !== void 0 && o != null && l(t, ["parameters", "storageUri"], o);
  const i = a(e, ["negativePrompt"]);
  t !== void 0 && i != null && l(t, ["parameters", "negativePrompt"], i);
  const s = a(e, ["numberOfImages"]);
  t !== void 0 && s != null && l(t, ["parameters", "sampleCount"], s);
  const u = a(e, ["aspectRatio"]);
  t !== void 0 && u != null && l(t, ["parameters", "aspectRatio"], u);
  const c = a(e, ["guidanceScale"]);
  t !== void 0 && c != null && l(t, ["parameters", "guidanceScale"], c);
  const d = a(e, ["seed"]);
  t !== void 0 && d != null && l(t, ["parameters", "seed"], d);
  const h = a(e, ["safetyFilterLevel"]);
  t !== void 0 && h != null && l(t, ["parameters", "safetySetting"], h);
  const f = a(e, ["personGeneration"]);
  t !== void 0 && f != null && l(t, ["parameters", "personGeneration"], f);
  const p = a(e, ["includeSafetyAttributes"]);
  t !== void 0 && p != null && l(t, ["parameters", "includeSafetyAttributes"], p);
  const m = a(e, ["includeRaiReason"]);
  t !== void 0 && m != null && l(t, ["parameters", "includeRaiReason"], m);
  const g = a(e, ["language"]);
  t !== void 0 && g != null && l(t, ["parameters", "language"], g);
  const _ = a(e, ["outputMimeType"]);
  t !== void 0 && _ != null && l(t, [
    "parameters",
    "outputOptions",
    "mimeType"
  ], _);
  const y = a(e, ["outputCompressionQuality"]);
  t !== void 0 && y != null && l(t, [
    "parameters",
    "outputOptions",
    "compressionQuality"
  ], y);
  const E = a(e, ["addWatermark"]);
  t !== void 0 && E != null && l(t, ["parameters", "addWatermark"], E);
  const A = a(e, ["labels"]);
  t !== void 0 && A != null && l(t, ["labels"], A);
  const w = a(e, ["editMode"]);
  t !== void 0 && w != null && l(t, ["parameters", "editMode"], w);
  const P = a(e, ["baseSteps"]);
  return t !== void 0 && P != null && l(t, [
    "parameters",
    "editConfig",
    "baseSteps"
  ], P), r;
}
function oT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["prompt"]);
  i != null && l(r, ["instances[0]", "prompt"], i);
  const s = a(t, ["referenceImages"]);
  if (s != null) {
    let c = s;
    Array.isArray(c) && (c = c.map((d) => aS(d))), l(r, ["instances[0]", "referenceImages"], c);
  }
  const u = a(t, ["config"]);
  return u != null && rT(u, r), r;
}
function iT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["predictions"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => Ko(s))), l(n, ["generatedImages"], i);
  }
  return n;
}
function sT(e, t, n) {
  const r = {}, o = a(e, ["taskType"]);
  t !== void 0 && o != null && l(t, ["requests[]", "taskType"], o);
  const i = a(e, ["title"]);
  t !== void 0 && i != null && l(t, ["requests[]", "title"], i);
  const s = a(e, ["outputDimensionality"]);
  if (t !== void 0 && s != null && l(t, ["requests[]", "outputDimensionality"], s), a(e, ["mimeType"]) !== void 0) throw new Error("mimeType parameter is not supported in Gemini API.");
  if (a(e, ["autoTruncate"]) !== void 0) throw new Error("autoTruncate parameter is not supported in Gemini API.");
  if (a(e, ["documentOcr"]) !== void 0) throw new Error("documentOcr parameter is not supported in Gemini API.");
  if (a(e, ["audioTrackExtraction"]) !== void 0) throw new Error("audioTrackExtraction parameter is not supported in Gemini API.");
  return r;
}
function aT(e, t, n) {
  const r = {};
  let o = a(n, ["embeddingApiType"]);
  if (o === void 0 && (o = "PREDICT"), o === "PREDICT") {
    const f = a(e, ["taskType"]);
    t !== void 0 && f != null && l(t, ["instances[]", "task_type"], f);
  } else if (o === "EMBED_CONTENT") {
    const f = a(e, ["taskType"]);
    t !== void 0 && f != null && l(t, ["embedContentConfig", "taskType"], f);
  }
  let i = a(n, ["embeddingApiType"]);
  if (i === void 0 && (i = "PREDICT"), i === "PREDICT") {
    const f = a(e, ["title"]);
    t !== void 0 && f != null && l(t, ["instances[]", "title"], f);
  } else if (i === "EMBED_CONTENT") {
    const f = a(e, ["title"]);
    t !== void 0 && f != null && l(t, ["embedContentConfig", "title"], f);
  }
  let s = a(n, ["embeddingApiType"]);
  if (s === void 0 && (s = "PREDICT"), s === "PREDICT") {
    const f = a(e, ["outputDimensionality"]);
    t !== void 0 && f != null && l(t, ["parameters", "outputDimensionality"], f);
  } else if (s === "EMBED_CONTENT") {
    const f = a(e, ["outputDimensionality"]);
    t !== void 0 && f != null && l(t, ["embedContentConfig", "outputDimensionality"], f);
  }
  let u = a(n, ["embeddingApiType"]);
  if (u === void 0 && (u = "PREDICT"), u === "PREDICT") {
    const f = a(e, ["mimeType"]);
    t !== void 0 && f != null && l(t, ["instances[]", "mimeType"], f);
  }
  let c = a(n, ["embeddingApiType"]);
  if (c === void 0 && (c = "PREDICT"), c === "PREDICT") {
    const f = a(e, ["autoTruncate"]);
    t !== void 0 && f != null && l(t, ["parameters", "autoTruncate"], f);
  } else if (c === "EMBED_CONTENT") {
    const f = a(e, ["autoTruncate"]);
    t !== void 0 && f != null && l(t, ["embedContentConfig", "autoTruncate"], f);
  }
  let d = a(n, ["embeddingApiType"]);
  if (d === void 0 && (d = "PREDICT"), d === "EMBED_CONTENT") {
    const f = a(e, ["documentOcr"]);
    t !== void 0 && f != null && l(t, ["embedContentConfig", "documentOcr"], f);
  }
  let h = a(n, ["embeddingApiType"]);
  if (h === void 0 && (h = "PREDICT"), h === "EMBED_CONTENT") {
    const f = a(e, ["audioTrackExtraction"]);
    t !== void 0 && f != null && l(t, ["embedContentConfig", "audioTrackExtraction"], f);
  }
  return r;
}
function lT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["contents"]);
  if (i != null) {
    let d = ea(e, i);
    Array.isArray(d) && (d = d.map((h) => h)), l(r, ["requests[]", "content"], d);
  }
  const s = a(t, ["content"]);
  s != null && Tr(se(s));
  const u = a(t, ["config"]);
  u != null && sT(u, r);
  const c = a(t, ["model"]);
  return c !== void 0 && l(r, ["requests[]", "model"], K(e, c)), r;
}
function uT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  let i = a(n, ["embeddingApiType"]);
  if (i === void 0 && (i = "PREDICT"), i === "PREDICT") {
    const c = a(t, ["contents"]);
    if (c != null) {
      let d = ea(e, c);
      Array.isArray(d) && (d = d.map((h) => h)), l(r, ["instances[]", "content"], d);
    }
  }
  let s = a(n, ["embeddingApiType"]);
  if (s === void 0 && (s = "PREDICT"), s === "EMBED_CONTENT") {
    const c = a(t, ["content"]);
    c != null && l(r, ["content"], _n(se(c)));
  }
  const u = a(t, ["config"]);
  return u != null && aT(u, r, n), r;
}
function cT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["embeddings"]);
  if (o != null) {
    let s = o;
    Array.isArray(s) && (s = s.map((u) => u)), l(n, ["embeddings"], s);
  }
  const i = a(e, ["metadata"]);
  return i != null && l(n, ["metadata"], i), n;
}
function dT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["predictions[]", "embeddings"]);
  if (o != null) {
    let s = o;
    Array.isArray(s) && (s = s.map((u) => VA(u))), l(n, ["embeddings"], s);
  }
  const i = a(e, ["metadata"]);
  if (i != null && l(n, ["metadata"], i), t && a(t, ["embeddingApiType"]) === "EMBED_CONTENT") {
    const s = a(e, ["embedding"]), u = a(e, ["usageMetadata"]), c = a(e, ["truncated"]);
    if (s) {
      const d = {};
      u && u.promptTokenCount && (d.tokenCount = u.promptTokenCount), c && (d.truncated = c), s.statistics = d, l(n, ["embeddings"], [s]);
    }
  }
  return n;
}
function fT(e, t) {
  const n = {}, r = a(e, ["endpoint"]);
  r != null && l(n, ["name"], r);
  const o = a(e, ["deployedModelId"]);
  return o != null && l(n, ["deployedModelId"], o), n;
}
function hT(e, t) {
  const n = {};
  if (a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const r = a(e, ["fileUri"]);
  r != null && l(n, ["fileUri"], r);
  const o = a(e, ["mimeType"]);
  return o != null && l(n, ["mimeType"], o), n;
}
function pT(e, t) {
  const n = {}, r = a(e, ["id"]);
  r != null && l(n, ["id"], r);
  const o = a(e, ["args"]);
  o != null && l(n, ["args"], o);
  const i = a(e, ["name"]);
  if (i != null && l(n, ["name"], i), a(e, ["partialArgs"]) !== void 0) throw new Error("partialArgs parameter is not supported in Gemini API.");
  if (a(e, ["willContinue"]) !== void 0) throw new Error("willContinue parameter is not supported in Gemini API.");
  return n;
}
function mT(e, t) {
  const n = {}, r = a(e, ["allowedFunctionNames"]);
  r != null && l(n, ["allowedFunctionNames"], r);
  const o = a(e, ["mode"]);
  if (o != null && l(n, ["mode"], o), a(e, ["streamFunctionCallArguments"]) !== void 0) throw new Error("streamFunctionCallArguments parameter is not supported in Gemini API.");
  return n;
}
function gT(e, t) {
  const n = {}, r = a(e, ["description"]);
  r != null && l(n, ["description"], r);
  const o = a(e, ["name"]);
  o != null && l(n, ["name"], o);
  const i = a(e, ["parameters"]);
  i != null && l(n, ["parameters"], i);
  const s = a(e, ["parametersJsonSchema"]);
  s != null && l(n, ["parametersJsonSchema"], s);
  const u = a(e, ["response"]);
  u != null && l(n, ["response"], u);
  const c = a(e, ["responseJsonSchema"]);
  if (c != null && l(n, ["responseJsonSchema"], c), a(e, ["behavior"]) !== void 0) throw new Error("behavior parameter is not supported in Vertex AI.");
  return n;
}
function _T(e, t, n, r) {
  const o = {}, i = a(t, ["systemInstruction"]);
  n !== void 0 && i != null && l(n, ["systemInstruction"], Tr(se(i)));
  const s = a(t, ["temperature"]);
  s != null && l(o, ["temperature"], s);
  const u = a(t, ["topP"]);
  u != null && l(o, ["topP"], u);
  const c = a(t, ["topK"]);
  c != null && l(o, ["topK"], c);
  const d = a(t, ["candidateCount"]);
  d != null && l(o, ["candidateCount"], d);
  const h = a(t, ["maxOutputTokens"]);
  h != null && l(o, ["maxOutputTokens"], h);
  const f = a(t, ["stopSequences"]);
  f != null && l(o, ["stopSequences"], f);
  const p = a(t, ["responseLogprobs"]);
  p != null && l(o, ["responseLogprobs"], p);
  const m = a(t, ["logprobs"]);
  m != null && l(o, ["logprobs"], m);
  const g = a(t, ["presencePenalty"]);
  g != null && l(o, ["presencePenalty"], g);
  const _ = a(t, ["frequencyPenalty"]);
  _ != null && l(o, ["frequencyPenalty"], _);
  const y = a(t, ["seed"]);
  y != null && l(o, ["seed"], y);
  const E = a(t, ["responseMimeType"]);
  E != null && l(o, ["responseMimeType"], E);
  const A = a(t, ["responseSchema"]);
  A != null && l(o, ["responseSchema"], ta(A));
  const w = a(t, ["responseJsonSchema"]);
  if (w != null && l(o, ["responseJsonSchema"], w), a(t, ["routingConfig"]) !== void 0) throw new Error("routingConfig parameter is not supported in Gemini API.");
  if (a(t, ["modelSelectionConfig"]) !== void 0) throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");
  const P = a(t, ["safetySettings"]);
  if (n !== void 0 && P != null) {
    let W = P;
    Array.isArray(W) && (W = W.map((ge) => lS(ge))), l(n, ["safetySettings"], W);
  }
  const L = a(t, ["tools"]);
  if (n !== void 0 && L != null) {
    let W = mn(L);
    Array.isArray(W) && (W = W.map((ge) => gS(pn(ge)))), l(n, ["tools"], W);
  }
  const C = a(t, ["toolConfig"]);
  if (n !== void 0 && C != null && l(n, ["toolConfig"], pS(C)), a(t, ["labels"]) !== void 0) throw new Error("labels parameter is not supported in Gemini API.");
  const k = a(t, ["cachedContent"]);
  n !== void 0 && k != null && l(n, ["cachedContent"], ft(e, k));
  const I = a(t, ["responseModalities"]);
  I != null && l(o, ["responseModalities"], I);
  const x = a(t, ["mediaResolution"]);
  x != null && l(o, ["mediaResolution"], x);
  const b = a(t, ["speechConfig"]);
  if (b != null && l(o, ["speechConfig"], na(b)), a(t, ["audioTimestamp"]) !== void 0) throw new Error("audioTimestamp parameter is not supported in Gemini API.");
  const F = a(t, ["thinkingConfig"]);
  F != null && l(o, ["thinkingConfig"], F);
  const X = a(t, ["imageConfig"]);
  X != null && l(o, ["imageConfig"], VT(X));
  const J = a(t, ["enableEnhancedCivicAnswers"]);
  if (J != null && l(o, ["enableEnhancedCivicAnswers"], J), a(t, ["modelArmorConfig"]) !== void 0) throw new Error("modelArmorConfig parameter is not supported in Gemini API.");
  const V = a(t, ["serviceTier"]);
  return n !== void 0 && V != null && l(n, ["serviceTier"], V), o;
}
function yT(e, t, n, r) {
  const o = {}, i = a(t, ["systemInstruction"]);
  n !== void 0 && i != null && l(n, ["systemInstruction"], _n(se(i)));
  const s = a(t, ["temperature"]);
  s != null && l(o, ["temperature"], s);
  const u = a(t, ["topP"]);
  u != null && l(o, ["topP"], u);
  const c = a(t, ["topK"]);
  c != null && l(o, ["topK"], c);
  const d = a(t, ["candidateCount"]);
  d != null && l(o, ["candidateCount"], d);
  const h = a(t, ["maxOutputTokens"]);
  h != null && l(o, ["maxOutputTokens"], h);
  const f = a(t, ["stopSequences"]);
  f != null && l(o, ["stopSequences"], f);
  const p = a(t, ["responseLogprobs"]);
  p != null && l(o, ["responseLogprobs"], p);
  const m = a(t, ["logprobs"]);
  m != null && l(o, ["logprobs"], m);
  const g = a(t, ["presencePenalty"]);
  g != null && l(o, ["presencePenalty"], g);
  const _ = a(t, ["frequencyPenalty"]);
  _ != null && l(o, ["frequencyPenalty"], _);
  const y = a(t, ["seed"]);
  y != null && l(o, ["seed"], y);
  const E = a(t, ["responseMimeType"]);
  E != null && l(o, ["responseMimeType"], E);
  const A = a(t, ["responseSchema"]);
  A != null && l(o, ["responseSchema"], ta(A));
  const w = a(t, ["responseJsonSchema"]);
  w != null && l(o, ["responseJsonSchema"], w);
  const P = a(t, ["routingConfig"]);
  P != null && l(o, ["routingConfig"], P);
  const L = a(t, ["modelSelectionConfig"]);
  L != null && l(o, ["modelConfig"], L);
  const C = a(t, ["safetySettings"]);
  if (n !== void 0 && C != null) {
    let Fe = C;
    Array.isArray(Fe) && (Fe = Fe.map((ui) => ui)), l(n, ["safetySettings"], Fe);
  }
  const k = a(t, ["tools"]);
  if (n !== void 0 && k != null) {
    let Fe = mn(k);
    Array.isArray(Fe) && (Fe = Fe.map((ui) => Wf(pn(ui)))), l(n, ["tools"], Fe);
  }
  const I = a(t, ["toolConfig"]);
  n !== void 0 && I != null && l(n, ["toolConfig"], mS(I));
  const x = a(t, ["labels"]);
  n !== void 0 && x != null && l(n, ["labels"], x);
  const b = a(t, ["cachedContent"]);
  n !== void 0 && b != null && l(n, ["cachedContent"], ft(e, b));
  const F = a(t, ["responseModalities"]);
  F != null && l(o, ["responseModalities"], F);
  const X = a(t, ["mediaResolution"]);
  X != null && l(o, ["mediaResolution"], X);
  const J = a(t, ["speechConfig"]);
  J != null && l(o, ["speechConfig"], na(J));
  const V = a(t, ["audioTimestamp"]);
  V != null && l(o, ["audioTimestamp"], V);
  const W = a(t, ["thinkingConfig"]);
  W != null && l(o, ["thinkingConfig"], W);
  const ge = a(t, ["imageConfig"]);
  if (ge != null && l(o, ["imageConfig"], JT(ge)), a(t, ["enableEnhancedCivicAnswers"]) !== void 0) throw new Error("enableEnhancedCivicAnswers parameter is not supported in Vertex AI.");
  const ze = a(t, ["modelArmorConfig"]);
  n !== void 0 && ze != null && l(n, ["modelArmorConfig"], ze);
  const Ue = a(t, ["serviceTier"]);
  return n !== void 0 && Ue != null && l(n, ["serviceTier"], Ue), o;
}
function Yu(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["contents"]);
  if (i != null) {
    let u = ve(i);
    Array.isArray(u) && (u = u.map((c) => Tr(c))), l(r, ["contents"], u);
  }
  const s = a(t, ["config"]);
  return s != null && l(r, ["generationConfig"], _T(e, s, r)), r;
}
function Xu(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["contents"]);
  if (i != null) {
    let u = ve(i);
    Array.isArray(u) && (u = u.map((c) => _n(c))), l(r, ["contents"], u);
  }
  const s = a(t, ["config"]);
  return s != null && l(r, ["generationConfig"], yT(e, s, r)), r;
}
function Qu(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["candidates"]);
  if (o != null) {
    let h = o;
    Array.isArray(h) && (h = h.map((f) => GA(f))), l(n, ["candidates"], h);
  }
  const i = a(e, ["modelVersion"]);
  i != null && l(n, ["modelVersion"], i);
  const s = a(e, ["promptFeedback"]);
  s != null && l(n, ["promptFeedback"], s);
  const u = a(e, ["responseId"]);
  u != null && l(n, ["responseId"], u);
  const c = a(e, ["usageMetadata"]);
  c != null && l(n, ["usageMetadata"], c);
  const d = a(e, ["modelStatus"]);
  return d != null && l(n, ["modelStatus"], d), n;
}
function Zu(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["candidates"]);
  if (o != null) {
    let h = o;
    Array.isArray(h) && (h = h.map((f) => f)), l(n, ["candidates"], h);
  }
  const i = a(e, ["createTime"]);
  i != null && l(n, ["createTime"], i);
  const s = a(e, ["modelVersion"]);
  s != null && l(n, ["modelVersion"], s);
  const u = a(e, ["promptFeedback"]);
  u != null && l(n, ["promptFeedback"], u);
  const c = a(e, ["responseId"]);
  c != null && l(n, ["responseId"], c);
  const d = a(e, ["usageMetadata"]);
  return d != null && l(n, ["usageMetadata"], d), n;
}
function vT(e, t, n) {
  const r = {};
  if (a(e, ["outputGcsUri"]) !== void 0) throw new Error("outputGcsUri parameter is not supported in Gemini API.");
  if (a(e, ["negativePrompt"]) !== void 0) throw new Error("negativePrompt parameter is not supported in Gemini API.");
  const o = a(e, ["numberOfImages"]);
  t !== void 0 && o != null && l(t, ["parameters", "sampleCount"], o);
  const i = a(e, ["aspectRatio"]);
  t !== void 0 && i != null && l(t, ["parameters", "aspectRatio"], i);
  const s = a(e, ["guidanceScale"]);
  if (t !== void 0 && s != null && l(t, ["parameters", "guidanceScale"], s), a(e, ["seed"]) !== void 0) throw new Error("seed parameter is not supported in Gemini API.");
  const u = a(e, ["safetyFilterLevel"]);
  t !== void 0 && u != null && l(t, ["parameters", "safetySetting"], u);
  const c = a(e, ["personGeneration"]);
  t !== void 0 && c != null && l(t, ["parameters", "personGeneration"], c);
  const d = a(e, ["includeSafetyAttributes"]);
  t !== void 0 && d != null && l(t, ["parameters", "includeSafetyAttributes"], d);
  const h = a(e, ["includeRaiReason"]);
  t !== void 0 && h != null && l(t, ["parameters", "includeRaiReason"], h);
  const f = a(e, ["language"]);
  t !== void 0 && f != null && l(t, ["parameters", "language"], f);
  const p = a(e, ["outputMimeType"]);
  t !== void 0 && p != null && l(t, [
    "parameters",
    "outputOptions",
    "mimeType"
  ], p);
  const m = a(e, ["outputCompressionQuality"]);
  if (t !== void 0 && m != null && l(t, [
    "parameters",
    "outputOptions",
    "compressionQuality"
  ], m), a(e, ["addWatermark"]) !== void 0) throw new Error("addWatermark parameter is not supported in Gemini API.");
  if (a(e, ["labels"]) !== void 0) throw new Error("labels parameter is not supported in Gemini API.");
  const g = a(e, ["imageSize"]);
  if (t !== void 0 && g != null && l(t, ["parameters", "sampleImageSize"], g), a(e, ["enhancePrompt"]) !== void 0) throw new Error("enhancePrompt parameter is not supported in Gemini API.");
  return r;
}
function AT(e, t, n) {
  const r = {}, o = a(e, ["outputGcsUri"]);
  t !== void 0 && o != null && l(t, ["parameters", "storageUri"], o);
  const i = a(e, ["negativePrompt"]);
  t !== void 0 && i != null && l(t, ["parameters", "negativePrompt"], i);
  const s = a(e, ["numberOfImages"]);
  t !== void 0 && s != null && l(t, ["parameters", "sampleCount"], s);
  const u = a(e, ["aspectRatio"]);
  t !== void 0 && u != null && l(t, ["parameters", "aspectRatio"], u);
  const c = a(e, ["guidanceScale"]);
  t !== void 0 && c != null && l(t, ["parameters", "guidanceScale"], c);
  const d = a(e, ["seed"]);
  t !== void 0 && d != null && l(t, ["parameters", "seed"], d);
  const h = a(e, ["safetyFilterLevel"]);
  t !== void 0 && h != null && l(t, ["parameters", "safetySetting"], h);
  const f = a(e, ["personGeneration"]);
  t !== void 0 && f != null && l(t, ["parameters", "personGeneration"], f);
  const p = a(e, ["includeSafetyAttributes"]);
  t !== void 0 && p != null && l(t, ["parameters", "includeSafetyAttributes"], p);
  const m = a(e, ["includeRaiReason"]);
  t !== void 0 && m != null && l(t, ["parameters", "includeRaiReason"], m);
  const g = a(e, ["language"]);
  t !== void 0 && g != null && l(t, ["parameters", "language"], g);
  const _ = a(e, ["outputMimeType"]);
  t !== void 0 && _ != null && l(t, [
    "parameters",
    "outputOptions",
    "mimeType"
  ], _);
  const y = a(e, ["outputCompressionQuality"]);
  t !== void 0 && y != null && l(t, [
    "parameters",
    "outputOptions",
    "compressionQuality"
  ], y);
  const E = a(e, ["addWatermark"]);
  t !== void 0 && E != null && l(t, ["parameters", "addWatermark"], E);
  const A = a(e, ["labels"]);
  t !== void 0 && A != null && l(t, ["labels"], A);
  const w = a(e, ["imageSize"]);
  t !== void 0 && w != null && l(t, ["parameters", "sampleImageSize"], w);
  const P = a(e, ["enhancePrompt"]);
  return t !== void 0 && P != null && l(t, ["parameters", "enhancePrompt"], P), r;
}
function TT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["prompt"]);
  i != null && l(r, ["instances[0]", "prompt"], i);
  const s = a(t, ["config"]);
  return s != null && vT(s, r), r;
}
function ST(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["prompt"]);
  i != null && l(r, ["instances[0]", "prompt"], i);
  const s = a(t, ["config"]);
  return s != null && AT(s, r), r;
}
function ET(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["predictions"]);
  if (o != null) {
    let s = o;
    Array.isArray(s) && (s = s.map((u) => $T(u))), l(n, ["generatedImages"], s);
  }
  const i = a(e, ["positivePromptSafetyAttributes"]);
  return i != null && l(n, ["positivePromptSafetyAttributes"], Jf(i)), n;
}
function CT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["predictions"]);
  if (o != null) {
    let s = o;
    Array.isArray(s) && (s = s.map((u) => Ko(u))), l(n, ["generatedImages"], s);
  }
  const i = a(e, ["positivePromptSafetyAttributes"]);
  return i != null && l(n, ["positivePromptSafetyAttributes"], Kf(i)), n;
}
function wT(e, t, n) {
  const r = {}, o = a(e, ["numberOfVideos"]);
  if (t !== void 0 && o != null && l(t, ["parameters", "sampleCount"], o), a(e, ["outputGcsUri"]) !== void 0) throw new Error("outputGcsUri parameter is not supported in Gemini API.");
  if (a(e, ["fps"]) !== void 0) throw new Error("fps parameter is not supported in Gemini API.");
  const i = a(e, ["durationSeconds"]);
  if (t !== void 0 && i != null && l(t, ["parameters", "durationSeconds"], i), a(e, ["seed"]) !== void 0) throw new Error("seed parameter is not supported in Gemini API.");
  const s = a(e, ["aspectRatio"]);
  t !== void 0 && s != null && l(t, ["parameters", "aspectRatio"], s);
  const u = a(e, ["resolution"]);
  t !== void 0 && u != null && l(t, ["parameters", "resolution"], u);
  const c = a(e, ["personGeneration"]);
  if (t !== void 0 && c != null && l(t, ["parameters", "personGeneration"], c), a(e, ["pubsubTopic"]) !== void 0) throw new Error("pubsubTopic parameter is not supported in Gemini API.");
  const d = a(e, ["negativePrompt"]);
  t !== void 0 && d != null && l(t, ["parameters", "negativePrompt"], d);
  const h = a(e, ["enhancePrompt"]);
  if (t !== void 0 && h != null && l(t, ["parameters", "enhancePrompt"], h), a(e, ["generateAudio"]) !== void 0) throw new Error("generateAudio parameter is not supported in Gemini API.");
  const f = a(e, ["lastFrame"]);
  t !== void 0 && f != null && l(t, ["instances[0]", "lastFrame"], Wo(f));
  const p = a(e, ["referenceImages"]);
  if (t !== void 0 && p != null) {
    let g = p;
    Array.isArray(g) && (g = g.map((_) => PS(_))), l(t, ["instances[0]", "referenceImages"], g);
  }
  if (a(e, ["mask"]) !== void 0) throw new Error("mask parameter is not supported in Gemini API.");
  if (a(e, ["compressionQuality"]) !== void 0) throw new Error("compressionQuality parameter is not supported in Gemini API.");
  if (a(e, ["labels"]) !== void 0) throw new Error("labels parameter is not supported in Gemini API.");
  const m = a(e, ["webhookConfig"]);
  return t !== void 0 && m != null && l(t, ["webhookConfig"], m), r;
}
function IT(e, t, n) {
  const r = {}, o = a(e, ["numberOfVideos"]);
  t !== void 0 && o != null && l(t, ["parameters", "sampleCount"], o);
  const i = a(e, ["outputGcsUri"]);
  t !== void 0 && i != null && l(t, ["parameters", "storageUri"], i);
  const s = a(e, ["fps"]);
  t !== void 0 && s != null && l(t, ["parameters", "fps"], s);
  const u = a(e, ["durationSeconds"]);
  t !== void 0 && u != null && l(t, ["parameters", "durationSeconds"], u);
  const c = a(e, ["seed"]);
  t !== void 0 && c != null && l(t, ["parameters", "seed"], c);
  const d = a(e, ["aspectRatio"]);
  t !== void 0 && d != null && l(t, ["parameters", "aspectRatio"], d);
  const h = a(e, ["resolution"]);
  t !== void 0 && h != null && l(t, ["parameters", "resolution"], h);
  const f = a(e, ["personGeneration"]);
  t !== void 0 && f != null && l(t, ["parameters", "personGeneration"], f);
  const p = a(e, ["pubsubTopic"]);
  t !== void 0 && p != null && l(t, ["parameters", "pubsubTopic"], p);
  const m = a(e, ["negativePrompt"]);
  t !== void 0 && m != null && l(t, ["parameters", "negativePrompt"], m);
  const g = a(e, ["enhancePrompt"]);
  t !== void 0 && g != null && l(t, ["parameters", "enhancePrompt"], g);
  const _ = a(e, ["generateAudio"]);
  t !== void 0 && _ != null && l(t, ["parameters", "generateAudio"], _);
  const y = a(e, ["lastFrame"]);
  t !== void 0 && y != null && l(t, ["instances[0]", "lastFrame"], We(y));
  const E = a(e, ["referenceImages"]);
  if (t !== void 0 && E != null) {
    let L = E;
    Array.isArray(L) && (L = L.map((C) => MS(C))), l(t, ["instances[0]", "referenceImages"], L);
  }
  const A = a(e, ["mask"]);
  t !== void 0 && A != null && l(t, ["instances[0]", "mask"], RS(A));
  const w = a(e, ["compressionQuality"]);
  t !== void 0 && w != null && l(t, ["parameters", "compressionQuality"], w);
  const P = a(e, ["labels"]);
  if (t !== void 0 && P != null && l(t, ["labels"], P), a(e, ["webhookConfig"]) !== void 0) throw new Error("webhookConfig parameter is not supported in Vertex AI.");
  return r;
}
function bT(e, t) {
  const n = {}, r = a(e, ["name"]);
  r != null && l(n, ["name"], r);
  const o = a(e, ["metadata"]);
  o != null && l(n, ["metadata"], o);
  const i = a(e, ["done"]);
  i != null && l(n, ["done"], i);
  const s = a(e, ["error"]);
  s != null && l(n, ["error"], s);
  const u = a(e, ["response", "generateVideoResponse"]);
  return u != null && l(n, ["response"], xT(u)), n;
}
function RT(e, t) {
  const n = {}, r = a(e, ["name"]);
  r != null && l(n, ["name"], r);
  const o = a(e, ["metadata"]);
  o != null && l(n, ["metadata"], o);
  const i = a(e, ["done"]);
  i != null && l(n, ["done"], i);
  const s = a(e, ["error"]);
  s != null && l(n, ["error"], s);
  const u = a(e, ["response"]);
  return u != null && l(n, ["response"], NT(u)), n;
}
function PT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["prompt"]);
  i != null && l(r, ["instances[0]", "prompt"], i);
  const s = a(t, ["image"]);
  s != null && l(r, ["instances[0]", "image"], Wo(s));
  const u = a(t, ["video"]);
  u != null && l(r, ["instances[0]", "video"], zf(u));
  const c = a(t, ["source"]);
  c != null && kT(c, r);
  const d = a(t, ["config"]);
  return d != null && wT(d, r), r;
}
function MT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["prompt"]);
  i != null && l(r, ["instances[0]", "prompt"], i);
  const s = a(t, ["image"]);
  s != null && l(r, ["instances[0]", "image"], We(s));
  const u = a(t, ["video"]);
  u != null && l(r, ["instances[0]", "video"], Yf(u));
  const c = a(t, ["source"]);
  c != null && DT(c, r);
  const d = a(t, ["config"]);
  return d != null && IT(d, r), r;
}
function xT(e, t) {
  const n = {}, r = a(e, ["generatedSamples"]);
  if (r != null) {
    let s = r;
    Array.isArray(s) && (s = s.map((u) => UT(u))), l(n, ["generatedVideos"], s);
  }
  const o = a(e, ["raiMediaFilteredCount"]);
  o != null && l(n, ["raiMediaFilteredCount"], o);
  const i = a(e, ["raiMediaFilteredReasons"]);
  return i != null && l(n, ["raiMediaFilteredReasons"], i), n;
}
function NT(e, t) {
  const n = {}, r = a(e, ["videos"]);
  if (r != null) {
    let s = r;
    Array.isArray(s) && (s = s.map((u) => FT(u))), l(n, ["generatedVideos"], s);
  }
  const o = a(e, ["raiMediaFilteredCount"]);
  o != null && l(n, ["raiMediaFilteredCount"], o);
  const i = a(e, ["raiMediaFilteredReasons"]);
  return i != null && l(n, ["raiMediaFilteredReasons"], i), n;
}
function kT(e, t, n) {
  const r = {}, o = a(e, ["prompt"]);
  t !== void 0 && o != null && l(t, ["instances[0]", "prompt"], o);
  const i = a(e, ["image"]);
  t !== void 0 && i != null && l(t, ["instances[0]", "image"], Wo(i));
  const s = a(e, ["video"]);
  return t !== void 0 && s != null && l(t, ["instances[0]", "video"], zf(s)), r;
}
function DT(e, t, n) {
  const r = {}, o = a(e, ["prompt"]);
  t !== void 0 && o != null && l(t, ["instances[0]", "prompt"], o);
  const i = a(e, ["image"]);
  t !== void 0 && i != null && l(t, ["instances[0]", "image"], We(i));
  const s = a(e, ["video"]);
  return t !== void 0 && s != null && l(t, ["instances[0]", "video"], Yf(s)), r;
}
function $T(e, t) {
  const n = {}, r = a(e, ["_self"]);
  r != null && l(n, ["image"], KT(r));
  const o = a(e, ["raiFilteredReason"]);
  o != null && l(n, ["raiFilteredReason"], o);
  const i = a(e, ["_self"]);
  return i != null && l(n, ["safetyAttributes"], Jf(i)), n;
}
function Ko(e, t) {
  const n = {}, r = a(e, ["_self"]);
  r != null && l(n, ["image"], Vf(r));
  const o = a(e, ["raiFilteredReason"]);
  o != null && l(n, ["raiFilteredReason"], o);
  const i = a(e, ["_self"]);
  i != null && l(n, ["safetyAttributes"], Kf(i));
  const s = a(e, ["prompt"]);
  return s != null && l(n, ["enhancedPrompt"], s), n;
}
function LT(e, t) {
  const n = {}, r = a(e, ["_self"]);
  r != null && l(n, ["mask"], Vf(r));
  const o = a(e, ["labels"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(n, ["labels"], i);
  }
  return n;
}
function UT(e, t) {
  const n = {}, r = a(e, ["video"]);
  return r != null && l(n, ["video"], IS(r)), n;
}
function FT(e, t) {
  const n = {}, r = a(e, ["_self"]);
  return r != null && l(n, ["video"], bS(r)), n;
}
function OT(e, t) {
  const n = {}, r = a(e, ["modelSelectionConfig"]);
  r != null && l(n, ["modelConfig"], r);
  const o = a(e, ["responseJsonSchema"]);
  o != null && l(n, ["responseJsonSchema"], o);
  const i = a(e, ["audioTimestamp"]);
  i != null && l(n, ["audioTimestamp"], i);
  const s = a(e, ["candidateCount"]);
  s != null && l(n, ["candidateCount"], s);
  const u = a(e, ["enableAffectiveDialog"]);
  u != null && l(n, ["enableAffectiveDialog"], u);
  const c = a(e, ["frequencyPenalty"]);
  c != null && l(n, ["frequencyPenalty"], c);
  const d = a(e, ["logprobs"]);
  d != null && l(n, ["logprobs"], d);
  const h = a(e, ["maxOutputTokens"]);
  h != null && l(n, ["maxOutputTokens"], h);
  const f = a(e, ["mediaResolution"]);
  f != null && l(n, ["mediaResolution"], f);
  const p = a(e, ["presencePenalty"]);
  p != null && l(n, ["presencePenalty"], p);
  const m = a(e, ["responseLogprobs"]);
  m != null && l(n, ["responseLogprobs"], m);
  const g = a(e, ["responseMimeType"]);
  g != null && l(n, ["responseMimeType"], g);
  const _ = a(e, ["responseModalities"]);
  _ != null && l(n, ["responseModalities"], _);
  const y = a(e, ["responseSchema"]);
  y != null && l(n, ["responseSchema"], y);
  const E = a(e, ["routingConfig"]);
  E != null && l(n, ["routingConfig"], E);
  const A = a(e, ["seed"]);
  A != null && l(n, ["seed"], A);
  const w = a(e, ["speechConfig"]);
  w != null && l(n, ["speechConfig"], w);
  const P = a(e, ["stopSequences"]);
  P != null && l(n, ["stopSequences"], P);
  const L = a(e, ["temperature"]);
  L != null && l(n, ["temperature"], L);
  const C = a(e, ["thinkingConfig"]);
  C != null && l(n, ["thinkingConfig"], C);
  const k = a(e, ["topK"]);
  k != null && l(n, ["topK"], k);
  const I = a(e, ["topP"]);
  if (I != null && l(n, ["topP"], I), a(e, ["enableEnhancedCivicAnswers"]) !== void 0) throw new Error("enableEnhancedCivicAnswers parameter is not supported in Vertex AI.");
  return n;
}
function GT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  return o != null && l(r, ["_url", "name"], K(e, o)), r;
}
function BT(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  return o != null && l(r, ["_url", "name"], K(e, o)), r;
}
function qT(e, t) {
  const n = {}, r = a(e, ["authConfig"]);
  r != null && l(n, ["authConfig"], FA(r));
  const o = a(e, ["enableWidget"]);
  return o != null && l(n, ["enableWidget"], o), n;
}
function HT(e, t) {
  const n = {}, r = a(e, ["searchTypes"]);
  if (r != null && l(n, ["searchTypes"], r), a(e, ["blockingConfidence"]) !== void 0) throw new Error("blockingConfidence parameter is not supported in Gemini API.");
  if (a(e, ["excludeDomains"]) !== void 0) throw new Error("excludeDomains parameter is not supported in Gemini API.");
  const o = a(e, ["timeRangeFilter"]);
  return o != null && l(n, ["timeRangeFilter"], o), n;
}
function VT(e, t) {
  const n = {}, r = a(e, ["aspectRatio"]);
  r != null && l(n, ["aspectRatio"], r);
  const o = a(e, ["imageSize"]);
  if (o != null && l(n, ["imageSize"], o), a(e, ["personGeneration"]) !== void 0) throw new Error("personGeneration parameter is not supported in Gemini API.");
  if (a(e, ["prominentPeople"]) !== void 0) throw new Error("prominentPeople parameter is not supported in Gemini API.");
  if (a(e, ["outputMimeType"]) !== void 0) throw new Error("outputMimeType parameter is not supported in Gemini API.");
  if (a(e, ["outputCompressionQuality"]) !== void 0) throw new Error("outputCompressionQuality parameter is not supported in Gemini API.");
  if (a(e, ["imageOutputOptions"]) !== void 0) throw new Error("imageOutputOptions parameter is not supported in Gemini API.");
  return n;
}
function JT(e, t) {
  const n = {}, r = a(e, ["aspectRatio"]);
  r != null && l(n, ["aspectRatio"], r);
  const o = a(e, ["imageSize"]);
  o != null && l(n, ["imageSize"], o);
  const i = a(e, ["personGeneration"]);
  i != null && l(n, ["personGeneration"], i);
  const s = a(e, ["prominentPeople"]);
  s != null && l(n, ["prominentPeople"], s);
  const u = a(e, ["outputMimeType"]);
  u != null && l(n, ["imageOutputOptions", "mimeType"], u);
  const c = a(e, ["outputCompressionQuality"]);
  c != null && l(n, ["imageOutputOptions", "compressionQuality"], c);
  const d = a(e, ["imageOutputOptions"]);
  return d != null && l(n, ["imageOutputOptions"], d), n;
}
function KT(e, t) {
  const n = {}, r = a(e, ["bytesBase64Encoded"]);
  r != null && l(n, ["imageBytes"], It(r));
  const o = a(e, ["mimeType"]);
  return o != null && l(n, ["mimeType"], o), n;
}
function Vf(e, t) {
  const n = {}, r = a(e, ["gcsUri"]);
  r != null && l(n, ["gcsUri"], r);
  const o = a(e, ["bytesBase64Encoded"]);
  o != null && l(n, ["imageBytes"], It(o));
  const i = a(e, ["mimeType"]);
  return i != null && l(n, ["mimeType"], i), n;
}
function Wo(e, t) {
  const n = {};
  if (a(e, ["gcsUri"]) !== void 0) throw new Error("gcsUri parameter is not supported in Gemini API.");
  const r = a(e, ["imageBytes"]);
  r != null && l(n, ["bytesBase64Encoded"], It(r));
  const o = a(e, ["mimeType"]);
  return o != null && l(n, ["mimeType"], o), n;
}
function We(e, t) {
  const n = {}, r = a(e, ["gcsUri"]);
  r != null && l(n, ["gcsUri"], r);
  const o = a(e, ["imageBytes"]);
  o != null && l(n, ["bytesBase64Encoded"], It(o));
  const i = a(e, ["mimeType"]);
  return i != null && l(n, ["mimeType"], i), n;
}
function WT(e, t, n, r) {
  const o = {}, i = a(t, ["pageSize"]);
  n !== void 0 && i != null && l(n, ["_query", "pageSize"], i);
  const s = a(t, ["pageToken"]);
  n !== void 0 && s != null && l(n, ["_query", "pageToken"], s);
  const u = a(t, ["filter"]);
  n !== void 0 && u != null && l(n, ["_query", "filter"], u);
  const c = a(t, ["queryBase"]);
  return n !== void 0 && c != null && l(n, ["_url", "models_url"], $f(e, c)), o;
}
function zT(e, t, n, r) {
  const o = {}, i = a(t, ["pageSize"]);
  n !== void 0 && i != null && l(n, ["_query", "pageSize"], i);
  const s = a(t, ["pageToken"]);
  n !== void 0 && s != null && l(n, ["_query", "pageToken"], s);
  const u = a(t, ["filter"]);
  n !== void 0 && u != null && l(n, ["_query", "filter"], u);
  const c = a(t, ["queryBase"]);
  return n !== void 0 && c != null && l(n, ["_url", "models_url"], $f(e, c)), o;
}
function YT(e, t, n) {
  const r = {}, o = a(t, ["config"]);
  return o != null && WT(e, o, r), r;
}
function XT(e, t, n) {
  const r = {}, o = a(t, ["config"]);
  return o != null && zT(e, o, r), r;
}
function QT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["nextPageToken"]);
  o != null && l(n, ["nextPageToken"], o);
  const i = a(e, ["_self"]);
  if (i != null) {
    let s = Lf(i);
    Array.isArray(s) && (s = s.map((u) => es(u))), l(n, ["models"], s);
  }
  return n;
}
function ZT(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["nextPageToken"]);
  o != null && l(n, ["nextPageToken"], o);
  const i = a(e, ["_self"]);
  if (i != null) {
    let s = Lf(i);
    Array.isArray(s) && (s = s.map((u) => ts(u))), l(n, ["models"], s);
  }
  return n;
}
function jT(e, t) {
  const n = {}, r = a(e, ["maskMode"]);
  r != null && l(n, ["maskMode"], r);
  const o = a(e, ["segmentationClasses"]);
  o != null && l(n, ["maskClasses"], o);
  const i = a(e, ["maskDilation"]);
  return i != null && l(n, ["dilation"], i), n;
}
function es(e, t) {
  const n = {}, r = a(e, ["name"]);
  r != null && l(n, ["name"], r);
  const o = a(e, ["displayName"]);
  o != null && l(n, ["displayName"], o);
  const i = a(e, ["description"]);
  i != null && l(n, ["description"], i);
  const s = a(e, ["version"]);
  s != null && l(n, ["version"], s);
  const u = a(e, ["_self"]);
  u != null && l(n, ["tunedModelInfo"], _S(u));
  const c = a(e, ["inputTokenLimit"]);
  c != null && l(n, ["inputTokenLimit"], c);
  const d = a(e, ["outputTokenLimit"]);
  d != null && l(n, ["outputTokenLimit"], d);
  const h = a(e, ["supportedGenerationMethods"]);
  h != null && l(n, ["supportedActions"], h);
  const f = a(e, ["temperature"]);
  f != null && l(n, ["temperature"], f);
  const p = a(e, ["maxTemperature"]);
  p != null && l(n, ["maxTemperature"], p);
  const m = a(e, ["topP"]);
  m != null && l(n, ["topP"], m);
  const g = a(e, ["topK"]);
  g != null && l(n, ["topK"], g);
  const _ = a(e, ["thinking"]);
  return _ != null && l(n, ["thinking"], _), n;
}
function ts(e, t) {
  const n = {}, r = a(e, ["name"]);
  r != null && l(n, ["name"], r);
  const o = a(e, ["displayName"]);
  o != null && l(n, ["displayName"], o);
  const i = a(e, ["description"]);
  i != null && l(n, ["description"], i);
  const s = a(e, ["versionId"]);
  s != null && l(n, ["version"], s);
  const u = a(e, ["deployedModels"]);
  if (u != null) {
    let p = u;
    Array.isArray(p) && (p = p.map((m) => fT(m))), l(n, ["endpoints"], p);
  }
  const c = a(e, ["labels"]);
  c != null && l(n, ["labels"], c);
  const d = a(e, ["_self"]);
  d != null && l(n, ["tunedModelInfo"], yS(d));
  const h = a(e, ["defaultCheckpointId"]);
  h != null && l(n, ["defaultCheckpointId"], h);
  const f = a(e, ["checkpoints"]);
  if (f != null) {
    let p = f;
    Array.isArray(p) && (p = p.map((m) => m)), l(n, ["checkpoints"], p);
  }
  return n;
}
function eS(e, t) {
  const n = {}, r = a(e, ["mediaResolution"]);
  r != null && l(n, ["mediaResolution"], r);
  const o = a(e, ["codeExecutionResult"]);
  o != null && l(n, ["codeExecutionResult"], o);
  const i = a(e, ["executableCode"]);
  i != null && l(n, ["executableCode"], i);
  const s = a(e, ["fileData"]);
  s != null && l(n, ["fileData"], hT(s));
  const u = a(e, ["functionCall"]);
  u != null && l(n, ["functionCall"], pT(u));
  const c = a(e, ["functionResponse"]);
  c != null && l(n, ["functionResponse"], c);
  const d = a(e, ["inlineData"]);
  d != null && l(n, ["inlineData"], OA(d));
  const h = a(e, ["text"]);
  h != null && l(n, ["text"], h);
  const f = a(e, ["thought"]);
  f != null && l(n, ["thought"], f);
  const p = a(e, ["thoughtSignature"]);
  p != null && l(n, ["thoughtSignature"], p);
  const m = a(e, ["videoMetadata"]);
  m != null && l(n, ["videoMetadata"], m);
  const g = a(e, ["toolCall"]);
  g != null && l(n, ["toolCall"], g);
  const _ = a(e, ["toolResponse"]);
  _ != null && l(n, ["toolResponse"], _);
  const y = a(e, ["partMetadata"]);
  return y != null && l(n, ["partMetadata"], y), n;
}
function tS(e, t) {
  const n = {}, r = a(e, ["mediaResolution"]);
  r != null && l(n, ["mediaResolution"], r);
  const o = a(e, ["codeExecutionResult"]);
  o != null && l(n, ["codeExecutionResult"], o);
  const i = a(e, ["executableCode"]);
  i != null && l(n, ["executableCode"], i);
  const s = a(e, ["fileData"]);
  s != null && l(n, ["fileData"], s);
  const u = a(e, ["functionCall"]);
  u != null && l(n, ["functionCall"], u);
  const c = a(e, ["functionResponse"]);
  c != null && l(n, ["functionResponse"], c);
  const d = a(e, ["inlineData"]);
  d != null && l(n, ["inlineData"], d);
  const h = a(e, ["text"]);
  h != null && l(n, ["text"], h);
  const f = a(e, ["thought"]);
  f != null && l(n, ["thought"], f);
  const p = a(e, ["thoughtSignature"]);
  p != null && l(n, ["thoughtSignature"], p);
  const m = a(e, ["videoMetadata"]);
  if (m != null && l(n, ["videoMetadata"], m), a(e, ["toolCall"]) !== void 0) throw new Error("toolCall parameter is not supported in Vertex AI.");
  if (a(e, ["toolResponse"]) !== void 0) throw new Error("toolResponse parameter is not supported in Vertex AI.");
  if (a(e, ["partMetadata"]) !== void 0) throw new Error("partMetadata parameter is not supported in Vertex AI.");
  return n;
}
function nS(e, t) {
  const n = {}, r = a(e, ["productImage"]);
  return r != null && l(n, ["image"], We(r)), n;
}
function rS(e, t, n) {
  const r = {}, o = a(e, ["numberOfImages"]);
  t !== void 0 && o != null && l(t, ["parameters", "sampleCount"], o);
  const i = a(e, ["baseSteps"]);
  t !== void 0 && i != null && l(t, ["parameters", "baseSteps"], i);
  const s = a(e, ["outputGcsUri"]);
  t !== void 0 && s != null && l(t, ["parameters", "storageUri"], s);
  const u = a(e, ["seed"]);
  t !== void 0 && u != null && l(t, ["parameters", "seed"], u);
  const c = a(e, ["safetyFilterLevel"]);
  t !== void 0 && c != null && l(t, ["parameters", "safetySetting"], c);
  const d = a(e, ["personGeneration"]);
  t !== void 0 && d != null && l(t, ["parameters", "personGeneration"], d);
  const h = a(e, ["addWatermark"]);
  t !== void 0 && h != null && l(t, ["parameters", "addWatermark"], h);
  const f = a(e, ["outputMimeType"]);
  t !== void 0 && f != null && l(t, [
    "parameters",
    "outputOptions",
    "mimeType"
  ], f);
  const p = a(e, ["outputCompressionQuality"]);
  t !== void 0 && p != null && l(t, [
    "parameters",
    "outputOptions",
    "compressionQuality"
  ], p);
  const m = a(e, ["enhancePrompt"]);
  t !== void 0 && m != null && l(t, ["parameters", "enhancePrompt"], m);
  const g = a(e, ["labels"]);
  return t !== void 0 && g != null && l(t, ["labels"], g), r;
}
function oS(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["source"]);
  i != null && sS(i, r);
  const s = a(t, ["config"]);
  return s != null && rS(s, r), r;
}
function iS(e, t) {
  const n = {}, r = a(e, ["predictions"]);
  if (r != null) {
    let o = r;
    Array.isArray(o) && (o = o.map((i) => Ko(i))), l(n, ["generatedImages"], o);
  }
  return n;
}
function sS(e, t, n) {
  const r = {}, o = a(e, ["prompt"]);
  t !== void 0 && o != null && l(t, ["instances[0]", "prompt"], o);
  const i = a(e, ["personImage"]);
  t !== void 0 && i != null && l(t, [
    "instances[0]",
    "personImage",
    "image"
  ], We(i));
  const s = a(e, ["productImages"]);
  if (t !== void 0 && s != null) {
    let u = s;
    Array.isArray(u) && (u = u.map((c) => nS(c))), l(t, ["instances[0]", "productImages"], u);
  }
  return r;
}
function aS(e, t) {
  const n = {}, r = a(e, ["referenceImage"]);
  r != null && l(n, ["referenceImage"], We(r));
  const o = a(e, ["referenceId"]);
  o != null && l(n, ["referenceId"], o);
  const i = a(e, ["referenceType"]);
  i != null && l(n, ["referenceType"], i);
  const s = a(e, ["maskImageConfig"]);
  s != null && l(n, ["maskImageConfig"], jT(s));
  const u = a(e, ["controlImageConfig"]);
  u != null && l(n, ["controlImageConfig"], KA(u));
  const c = a(e, ["styleImageConfig"]);
  c != null && l(n, ["styleImageConfig"], c);
  const d = a(e, ["subjectImageConfig"]);
  return d != null && l(n, ["subjectImageConfig"], d), n;
}
function Jf(e, t) {
  const n = {}, r = a(e, ["safetyAttributes", "categories"]);
  r != null && l(n, ["categories"], r);
  const o = a(e, ["safetyAttributes", "scores"]);
  o != null && l(n, ["scores"], o);
  const i = a(e, ["contentType"]);
  return i != null && l(n, ["contentType"], i), n;
}
function Kf(e, t) {
  const n = {}, r = a(e, ["safetyAttributes", "categories"]);
  r != null && l(n, ["categories"], r);
  const o = a(e, ["safetyAttributes", "scores"]);
  o != null && l(n, ["scores"], o);
  const i = a(e, ["contentType"]);
  return i != null && l(n, ["contentType"], i), n;
}
function lS(e, t) {
  const n = {}, r = a(e, ["category"]);
  if (r != null && l(n, ["category"], r), a(e, ["method"]) !== void 0) throw new Error("method parameter is not supported in Gemini API.");
  const o = a(e, ["threshold"]);
  return o != null && l(n, ["threshold"], o), n;
}
function uS(e, t) {
  const n = {}, r = a(e, ["image"]);
  return r != null && l(n, ["image"], We(r)), n;
}
function cS(e, t, n) {
  const r = {}, o = a(e, ["mode"]);
  t !== void 0 && o != null && l(t, ["parameters", "mode"], o);
  const i = a(e, ["maxPredictions"]);
  t !== void 0 && i != null && l(t, ["parameters", "maxPredictions"], i);
  const s = a(e, ["confidenceThreshold"]);
  t !== void 0 && s != null && l(t, ["parameters", "confidenceThreshold"], s);
  const u = a(e, ["maskDilation"]);
  t !== void 0 && u != null && l(t, ["parameters", "maskDilation"], u);
  const c = a(e, ["binaryColorThreshold"]);
  t !== void 0 && c != null && l(t, ["parameters", "binaryColorThreshold"], c);
  const d = a(e, ["labels"]);
  return t !== void 0 && d != null && l(t, ["labels"], d), r;
}
function dS(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["source"]);
  i != null && hS(i, r);
  const s = a(t, ["config"]);
  return s != null && cS(s, r), r;
}
function fS(e, t) {
  const n = {}, r = a(e, ["predictions"]);
  if (r != null) {
    let o = r;
    Array.isArray(o) && (o = o.map((i) => LT(i))), l(n, ["generatedMasks"], o);
  }
  return n;
}
function hS(e, t, n) {
  const r = {}, o = a(e, ["prompt"]);
  t !== void 0 && o != null && l(t, ["instances[0]", "prompt"], o);
  const i = a(e, ["image"]);
  t !== void 0 && i != null && l(t, ["instances[0]", "image"], We(i));
  const s = a(e, ["scribbleImage"]);
  return t !== void 0 && s != null && l(t, ["instances[0]", "scribble"], uS(s)), r;
}
function pS(e, t) {
  const n = {}, r = a(e, ["retrievalConfig"]);
  r != null && l(n, ["retrievalConfig"], r);
  const o = a(e, ["functionCallingConfig"]);
  o != null && l(n, ["functionCallingConfig"], mT(o));
  const i = a(e, ["includeServerSideToolInvocations"]);
  return i != null && l(n, ["includeServerSideToolInvocations"], i), n;
}
function mS(e, t) {
  const n = {}, r = a(e, ["retrievalConfig"]);
  r != null && l(n, ["retrievalConfig"], r);
  const o = a(e, ["functionCallingConfig"]);
  if (o != null && l(n, ["functionCallingConfig"], o), a(e, ["includeServerSideToolInvocations"]) !== void 0) throw new Error("includeServerSideToolInvocations parameter is not supported in Vertex AI.");
  return n;
}
function gS(e, t) {
  const n = {};
  if (a(e, ["retrieval"]) !== void 0) throw new Error("retrieval parameter is not supported in Gemini API.");
  const r = a(e, ["computerUse"]);
  r != null && l(n, ["computerUse"], r);
  const o = a(e, ["fileSearch"]);
  o != null && l(n, ["fileSearch"], o);
  const i = a(e, ["googleSearch"]);
  i != null && l(n, ["googleSearch"], HT(i));
  const s = a(e, ["googleMaps"]);
  s != null && l(n, ["googleMaps"], qT(s));
  const u = a(e, ["codeExecution"]);
  if (u != null && l(n, ["codeExecution"], u), a(e, ["enterpriseWebSearch"]) !== void 0) throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");
  const c = a(e, ["functionDeclarations"]);
  if (c != null) {
    let p = c;
    Array.isArray(p) && (p = p.map((m) => m)), l(n, ["functionDeclarations"], p);
  }
  const d = a(e, ["googleSearchRetrieval"]);
  if (d != null && l(n, ["googleSearchRetrieval"], d), a(e, ["parallelAiSearch"]) !== void 0) throw new Error("parallelAiSearch parameter is not supported in Gemini API.");
  const h = a(e, ["urlContext"]);
  h != null && l(n, ["urlContext"], h);
  const f = a(e, ["mcpServers"]);
  if (f != null) {
    let p = f;
    Array.isArray(p) && (p = p.map((m) => m)), l(n, ["mcpServers"], p);
  }
  return n;
}
function Wf(e, t) {
  const n = {}, r = a(e, ["retrieval"]);
  r != null && l(n, ["retrieval"], r);
  const o = a(e, ["computerUse"]);
  if (o != null && l(n, ["computerUse"], o), a(e, ["fileSearch"]) !== void 0) throw new Error("fileSearch parameter is not supported in Vertex AI.");
  const i = a(e, ["googleSearch"]);
  i != null && l(n, ["googleSearch"], i);
  const s = a(e, ["googleMaps"]);
  s != null && l(n, ["googleMaps"], s);
  const u = a(e, ["codeExecution"]);
  u != null && l(n, ["codeExecution"], u);
  const c = a(e, ["enterpriseWebSearch"]);
  c != null && l(n, ["enterpriseWebSearch"], c);
  const d = a(e, ["functionDeclarations"]);
  if (d != null) {
    let m = d;
    Array.isArray(m) && (m = m.map((g) => gT(g))), l(n, ["functionDeclarations"], m);
  }
  const h = a(e, ["googleSearchRetrieval"]);
  h != null && l(n, ["googleSearchRetrieval"], h);
  const f = a(e, ["parallelAiSearch"]);
  f != null && l(n, ["parallelAiSearch"], f);
  const p = a(e, ["urlContext"]);
  if (p != null && l(n, ["urlContext"], p), a(e, ["mcpServers"]) !== void 0) throw new Error("mcpServers parameter is not supported in Vertex AI.");
  return n;
}
function _S(e, t) {
  const n = {}, r = a(e, ["baseModel"]);
  r != null && l(n, ["baseModel"], r);
  const o = a(e, ["createTime"]);
  o != null && l(n, ["createTime"], o);
  const i = a(e, ["updateTime"]);
  return i != null && l(n, ["updateTime"], i), n;
}
function yS(e, t) {
  const n = {}, r = a(e, ["labels", "google-vertex-llm-tuning-base-model-id"]);
  r != null && l(n, ["baseModel"], r);
  const o = a(e, ["createTime"]);
  o != null && l(n, ["createTime"], o);
  const i = a(e, ["updateTime"]);
  return i != null && l(n, ["updateTime"], i), n;
}
function vS(e, t, n) {
  const r = {}, o = a(e, ["displayName"]);
  t !== void 0 && o != null && l(t, ["displayName"], o);
  const i = a(e, ["description"]);
  t !== void 0 && i != null && l(t, ["description"], i);
  const s = a(e, ["defaultCheckpointId"]);
  return t !== void 0 && s != null && l(t, ["defaultCheckpointId"], s), r;
}
function AS(e, t, n) {
  const r = {}, o = a(e, ["displayName"]);
  t !== void 0 && o != null && l(t, ["displayName"], o);
  const i = a(e, ["description"]);
  t !== void 0 && i != null && l(t, ["description"], i);
  const s = a(e, ["defaultCheckpointId"]);
  return t !== void 0 && s != null && l(t, ["defaultCheckpointId"], s), r;
}
function TS(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "name"], K(e, o));
  const i = a(t, ["config"]);
  return i != null && vS(i, r), r;
}
function SS(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["config"]);
  return i != null && AS(i, r), r;
}
function ES(e, t, n) {
  const r = {}, o = a(e, ["outputGcsUri"]);
  t !== void 0 && o != null && l(t, ["parameters", "storageUri"], o);
  const i = a(e, ["safetyFilterLevel"]);
  t !== void 0 && i != null && l(t, ["parameters", "safetySetting"], i);
  const s = a(e, ["personGeneration"]);
  t !== void 0 && s != null && l(t, ["parameters", "personGeneration"], s);
  const u = a(e, ["includeRaiReason"]);
  t !== void 0 && u != null && l(t, ["parameters", "includeRaiReason"], u);
  const c = a(e, ["outputMimeType"]);
  t !== void 0 && c != null && l(t, [
    "parameters",
    "outputOptions",
    "mimeType"
  ], c);
  const d = a(e, ["outputCompressionQuality"]);
  t !== void 0 && d != null && l(t, [
    "parameters",
    "outputOptions",
    "compressionQuality"
  ], d);
  const h = a(e, ["enhanceInputImage"]);
  t !== void 0 && h != null && l(t, [
    "parameters",
    "upscaleConfig",
    "enhanceInputImage"
  ], h);
  const f = a(e, ["imagePreservationFactor"]);
  t !== void 0 && f != null && l(t, [
    "parameters",
    "upscaleConfig",
    "imagePreservationFactor"
  ], f);
  const p = a(e, ["labels"]);
  t !== void 0 && p != null && l(t, ["labels"], p);
  const m = a(e, ["numberOfImages"]);
  t !== void 0 && m != null && l(t, ["parameters", "sampleCount"], m);
  const g = a(e, ["mode"]);
  return t !== void 0 && g != null && l(t, ["parameters", "mode"], g), r;
}
function CS(e, t, n) {
  const r = {}, o = a(t, ["model"]);
  o != null && l(r, ["_url", "model"], K(e, o));
  const i = a(t, ["image"]);
  i != null && l(r, ["instances[0]", "image"], We(i));
  const s = a(t, ["upscaleFactor"]);
  s != null && l(r, [
    "parameters",
    "upscaleConfig",
    "upscaleFactor"
  ], s);
  const u = a(t, ["config"]);
  return u != null && ES(u, r), r;
}
function wS(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["predictions"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => Ko(s))), l(n, ["generatedImages"], i);
  }
  return n;
}
function IS(e, t) {
  const n = {}, r = a(e, ["uri"]);
  r != null && l(n, ["uri"], r);
  const o = a(e, ["encodedVideo"]);
  o != null && l(n, ["videoBytes"], It(o));
  const i = a(e, ["encoding"]);
  return i != null && l(n, ["mimeType"], i), n;
}
function bS(e, t) {
  const n = {}, r = a(e, ["gcsUri"]);
  r != null && l(n, ["uri"], r);
  const o = a(e, ["bytesBase64Encoded"]);
  o != null && l(n, ["videoBytes"], It(o));
  const i = a(e, ["mimeType"]);
  return i != null && l(n, ["mimeType"], i), n;
}
function RS(e, t) {
  const n = {}, r = a(e, ["image"]);
  r != null && l(n, ["_self"], We(r));
  const o = a(e, ["maskMode"]);
  return o != null && l(n, ["maskMode"], o), n;
}
function PS(e, t) {
  const n = {}, r = a(e, ["image"]);
  r != null && l(n, ["image"], Wo(r));
  const o = a(e, ["referenceType"]);
  return o != null && l(n, ["referenceType"], o), n;
}
function MS(e, t) {
  const n = {}, r = a(e, ["image"]);
  r != null && l(n, ["image"], We(r));
  const o = a(e, ["referenceType"]);
  return o != null && l(n, ["referenceType"], o), n;
}
function zf(e, t) {
  const n = {}, r = a(e, ["uri"]);
  r != null && l(n, ["uri"], r);
  const o = a(e, ["videoBytes"]);
  o != null && l(n, ["encodedVideo"], It(o));
  const i = a(e, ["mimeType"]);
  return i != null && l(n, ["encoding"], i), n;
}
function Yf(e, t) {
  const n = {}, r = a(e, ["uri"]);
  r != null && l(n, ["gcsUri"], r);
  const o = a(e, ["videoBytes"]);
  o != null && l(n, ["bytesBase64Encoded"], It(o));
  const i = a(e, ["mimeType"]);
  return i != null && l(n, ["mimeType"], i), n;
}
function xS(e, t) {
  const n = {}, r = a(e, ["displayName"]);
  return t !== void 0 && r != null && l(t, ["displayName"], r), n;
}
function NS(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && xS(n, t), t;
}
function kS(e, t) {
  const n = {}, r = a(e, ["force"]);
  return t !== void 0 && r != null && l(t, ["_query", "force"], r), n;
}
function DS(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["_url", "name"], n);
  const r = a(e, ["config"]);
  return r != null && kS(r, t), t;
}
function $S(e) {
  const t = {}, n = a(e, ["name"]);
  return n != null && l(t, ["_url", "name"], n), t;
}
function LS(e, t) {
  const n = {}, r = a(e, ["customMetadata"]);
  if (t !== void 0 && r != null) {
    let i = r;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["customMetadata"], i);
  }
  const o = a(e, ["chunkingConfig"]);
  return t !== void 0 && o != null && l(t, ["chunkingConfig"], o), n;
}
function US(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["name"], n);
  const r = a(e, ["metadata"]);
  r != null && l(t, ["metadata"], r);
  const o = a(e, ["done"]);
  o != null && l(t, ["done"], o);
  const i = a(e, ["error"]);
  i != null && l(t, ["error"], i);
  const s = a(e, ["response"]);
  return s != null && l(t, ["response"], OS(s)), t;
}
function FS(e) {
  const t = {}, n = a(e, ["fileSearchStoreName"]);
  n != null && l(t, ["_url", "file_search_store_name"], n);
  const r = a(e, ["fileName"]);
  r != null && l(t, ["fileName"], r);
  const o = a(e, ["config"]);
  return o != null && LS(o, t), t;
}
function OS(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["parent"]);
  r != null && l(t, ["parent"], r);
  const o = a(e, ["documentName"]);
  return o != null && l(t, ["documentName"], o), t;
}
function GS(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  return t !== void 0 && o != null && l(t, ["_query", "pageToken"], o), n;
}
function BS(e) {
  const t = {}, n = a(e, ["config"]);
  return n != null && GS(n, t), t;
}
function qS(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["fileSearchStores"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["fileSearchStores"], i);
  }
  return t;
}
function Xf(e, t) {
  const n = {}, r = a(e, ["mimeType"]);
  t !== void 0 && r != null && l(t, ["mimeType"], r);
  const o = a(e, ["displayName"]);
  t !== void 0 && o != null && l(t, ["displayName"], o);
  const i = a(e, ["customMetadata"]);
  if (t !== void 0 && i != null) {
    let u = i;
    Array.isArray(u) && (u = u.map((c) => c)), l(t, ["customMetadata"], u);
  }
  const s = a(e, ["chunkingConfig"]);
  return t !== void 0 && s != null && l(t, ["chunkingConfig"], s), n;
}
function HS(e) {
  const t = {}, n = a(e, ["fileSearchStoreName"]);
  n != null && l(t, ["_url", "file_search_store_name"], n);
  const r = a(e, ["config"]);
  return r != null && Xf(r, t), t;
}
function VS(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  return n != null && l(t, ["sdkHttpResponse"], n), t;
}
var JS = "Content-Type", KS = "X-Server-Timeout", WS = "User-Agent", ns = "x-goog-api-client", zS = "google-genai-sdk/1.50.1", YS = "v1beta1", XS = "v1beta", QS = /* @__PURE__ */ new Set(["us", "eu"]), ZS = 5, jS = [
  408,
  429,
  500,
  502,
  503,
  504
], eE = class {
  constructor(e) {
    var t, n, r;
    this.clientOptions = Object.assign({}, e), this.customBaseUrl = (t = e.httpOptions) === null || t === void 0 ? void 0 : t.baseUrl, this.clientOptions.vertexai && (this.clientOptions.project && this.clientOptions.location ? this.clientOptions.apiKey = void 0 : this.clientOptions.apiKey && (this.clientOptions.project = void 0, this.clientOptions.location = void 0));
    const o = {};
    if (this.clientOptions.vertexai) {
      if (!this.clientOptions.location && !this.clientOptions.apiKey && !this.customBaseUrl && (this.clientOptions.location = "global"), !(this.clientOptions.project && this.clientOptions.location || this.clientOptions.apiKey) && !this.customBaseUrl) throw new Error("Authentication is not set up. Please provide either a project and location, or an API key, or a custom base URL.");
      const i = e.project && e.location || !!e.apiKey;
      this.customBaseUrl && !i ? (o.baseUrl = this.customBaseUrl, this.clientOptions.project = void 0, this.clientOptions.location = void 0) : this.clientOptions.apiKey || this.clientOptions.location === "global" ? o.baseUrl = "https://aiplatform.googleapis.com/" : this.clientOptions.project && this.clientOptions.location && QS.has(this.clientOptions.location) ? o.baseUrl = `https://aiplatform.${this.clientOptions.location}.rep.googleapis.com/` : this.clientOptions.project && this.clientOptions.location && (o.baseUrl = `https://${this.clientOptions.location}-aiplatform.googleapis.com/`), o.apiVersion = (n = this.clientOptions.apiVersion) !== null && n !== void 0 ? n : YS;
    } else
      this.clientOptions.apiKey || console.warn("API key should be set when using the Gemini API."), o.apiVersion = (r = this.clientOptions.apiVersion) !== null && r !== void 0 ? r : XS, o.baseUrl = "https://generativelanguage.googleapis.com/";
    o.headers = this.getDefaultHeaders(), this.clientOptions.httpOptions = o, e.httpOptions && (this.clientOptions.httpOptions = this.patchHttpOptions(o, e.httpOptions));
  }
  isVertexAI() {
    var e;
    return (e = this.clientOptions.vertexai) !== null && e !== void 0 ? e : !1;
  }
  getProject() {
    return this.clientOptions.project;
  }
  getLocation() {
    return this.clientOptions.location;
  }
  getCustomBaseUrl() {
    return this.customBaseUrl;
  }
  async getAuthHeaders() {
    const e = new Headers();
    return await this.clientOptions.auth.addAuthHeaders(e), e;
  }
  getApiVersion() {
    if (this.clientOptions.httpOptions && this.clientOptions.httpOptions.apiVersion !== void 0) return this.clientOptions.httpOptions.apiVersion;
    throw new Error("API version is not set.");
  }
  getBaseUrl() {
    if (this.clientOptions.httpOptions && this.clientOptions.httpOptions.baseUrl !== void 0) return this.clientOptions.httpOptions.baseUrl;
    throw new Error("Base URL is not set.");
  }
  getRequestUrl() {
    return this.getRequestUrlInternal(this.clientOptions.httpOptions);
  }
  getHeaders() {
    if (this.clientOptions.httpOptions && this.clientOptions.httpOptions.headers !== void 0) return this.clientOptions.httpOptions.headers;
    throw new Error("Headers are not set.");
  }
  getRequestUrlInternal(e) {
    if (!e || e.baseUrl === void 0 || e.apiVersion === void 0) throw new Error("HTTP options are not correctly set.");
    const t = [e.baseUrl.endsWith("/") ? e.baseUrl.slice(0, -1) : e.baseUrl];
    return e.apiVersion && e.apiVersion !== "" && t.push(e.apiVersion), t.join("/");
  }
  getBaseResourcePath() {
    return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`;
  }
  getApiKey() {
    return this.clientOptions.apiKey;
  }
  getWebsocketBaseUrl() {
    const e = this.getBaseUrl(), t = new URL(e);
    return t.protocol = t.protocol == "http:" ? "ws" : "wss", t.toString();
  }
  setBaseUrl(e) {
    if (this.clientOptions.httpOptions) this.clientOptions.httpOptions.baseUrl = e;
    else throw new Error("HTTP options are not correctly set.");
  }
  constructUrl(e, t, n) {
    const r = [this.getRequestUrlInternal(t)];
    return n && r.push(this.getBaseResourcePath()), e !== "" && r.push(e), new URL(`${r.join("/")}`);
  }
  shouldPrependVertexProjectPath(e, t) {
    return !(t.baseUrl && t.baseUrlResourceScope === Xi.COLLECTION || this.clientOptions.apiKey || !this.clientOptions.vertexai || e.path.startsWith("projects/") || e.httpMethod === "GET" && e.path.startsWith("publishers/google/models"));
  }
  async request(e) {
    let t = this.clientOptions.httpOptions;
    e.httpOptions && (t = this.patchHttpOptions(this.clientOptions.httpOptions, e.httpOptions));
    const n = this.shouldPrependVertexProjectPath(e, t), r = this.constructUrl(e.path, t, n);
    if (e.queryParams) for (const [i, s] of Object.entries(e.queryParams)) r.searchParams.append(i, String(s));
    let o = {};
    if (e.httpMethod === "GET") {
      if (e.body && e.body !== "{}") throw new Error("Request body should be empty for GET request, but got non empty request body");
    } else o.body = e.body;
    return o = await this.includeExtraHttpOptionsToRequestInit(o, t, r.toString(), e.abortSignal), this.unaryApiCall(r, o, e.httpMethod);
  }
  patchHttpOptions(e, t) {
    const n = JSON.parse(JSON.stringify(e));
    for (const [r, o] of Object.entries(t)) typeof o == "object" ? n[r] = Object.assign(Object.assign({}, n[r]), o) : o !== void 0 && (n[r] = o);
    return n;
  }
  async requestStream(e) {
    let t = this.clientOptions.httpOptions;
    e.httpOptions && (t = this.patchHttpOptions(this.clientOptions.httpOptions, e.httpOptions));
    const n = this.shouldPrependVertexProjectPath(e, t), r = this.constructUrl(e.path, t, n);
    (!r.searchParams.has("alt") || r.searchParams.get("alt") !== "sse") && r.searchParams.set("alt", "sse");
    let o = {};
    return o.body = e.body, o = await this.includeExtraHttpOptionsToRequestInit(o, t, r.toString(), e.abortSignal), this.streamApiCall(r, o, e.httpMethod);
  }
  async includeExtraHttpOptionsToRequestInit(e, t, n, r) {
    if (t && t.timeout || r) {
      const o = new AbortController(), i = o.signal;
      if (t.timeout && t?.timeout > 0) {
        const s = setTimeout(() => o.abort(), t.timeout);
        s && typeof s.unref == "function" && s.unref();
      }
      r && r.addEventListener("abort", () => {
        o.abort();
      }), e.signal = i;
    }
    return t && t.extraBody !== null && tE(e, t.extraBody), e.headers = await this.getHeadersInternal(t, n), e;
  }
  async unaryApiCall(e, t, n) {
    return this.apiCall(e.toString(), Object.assign(Object.assign({}, t), { method: n })).then(async (r) => (await ju(r), new Qi(r))).catch((r) => {
      throw r instanceof Error ? r : new Error(JSON.stringify(r));
    });
  }
  async streamApiCall(e, t, n) {
    return this.apiCall(e.toString(), Object.assign(Object.assign({}, t), { method: n })).then(async (r) => (await ju(r), this.processStreamResponse(r))).catch((r) => {
      throw r instanceof Error ? r : new Error(JSON.stringify(r));
    });
  }
  processStreamResponse(e) {
    return Je(this, arguments, function* () {
      var n;
      const r = (n = e?.body) === null || n === void 0 ? void 0 : n.getReader(), o = new TextDecoder("utf-8");
      if (!r) throw new Error("Response body is empty");
      try {
        let i = "";
        const s = "data:", u = [
          `

`,
          "\r\r",
          `\r
\r
`
        ];
        for (; ; ) {
          const { done: c, value: d } = yield q(r.read());
          if (c) {
            if (i.trim().length > 0) throw new Error("Incomplete JSON segment at the end");
            break;
          }
          const h = o.decode(d, { stream: !0 });
          try {
            const m = JSON.parse(h);
            if ("error" in m) {
              const g = JSON.parse(JSON.stringify(m.error)), _ = g.status, y = g.code, E = `got status: ${_}. ${JSON.stringify(m)}`;
              if (y >= 400 && y < 600) throw new qf({
                message: E,
                status: y
              });
            }
          } catch (m) {
            if (m.name === "ApiError") throw m;
          }
          i += h;
          let f = -1, p = 0;
          for (; ; ) {
            f = -1, p = 0;
            for (const _ of u) {
              const y = i.indexOf(_);
              y !== -1 && (f === -1 || y < f) && (f = y, p = _.length);
            }
            if (f === -1) break;
            const m = i.substring(0, f);
            i = i.substring(f + p);
            const g = m.trim();
            if (g.startsWith(s)) {
              const _ = g.substring(5).trim();
              try {
                yield yield q(new Qi(new Response(_, {
                  headers: e?.headers,
                  status: e?.status,
                  statusText: e?.statusText
                })));
              } catch (y) {
                throw new Error(`exception parsing stream chunk ${_}. ${y}`);
              }
            }
          }
        }
      } finally {
        r.releaseLock();
      }
    });
  }
  async apiCall(e, t) {
    var n;
    if (!this.clientOptions.httpOptions || !this.clientOptions.httpOptions.retryOptions) return fetch(e, t);
    const r = this.clientOptions.httpOptions.retryOptions, o = async () => {
      const i = await fetch(e, t);
      if (i.ok) return i;
      throw jS.includes(i.status) ? new Error(`Retryable HTTP Error: ${i.statusText}`) : new wl.AbortError(`Non-retryable exception ${i.statusText} sending request`);
    };
    return (0, wl.default)(o, { retries: ((n = r.attempts) !== null && n !== void 0 ? n : ZS) - 1 });
  }
  getDefaultHeaders() {
    const e = {}, t = zS + " " + this.clientOptions.userAgentExtra;
    return e[WS] = t, e[ns] = t, e[JS] = "application/json", e;
  }
  async getHeadersInternal(e, t) {
    const n = new Headers();
    if (e && e.headers) {
      for (const [r, o] of Object.entries(e.headers)) n.append(r, o);
      e.timeout && e.timeout > 0 && n.append(KS, String(Math.ceil(e.timeout / 1e3)));
    }
    return await this.clientOptions.auth.addAuthHeaders(n, t), n;
  }
  getFileName(e) {
    var t;
    let n = "";
    return typeof e == "string" && (n = e.replace(/[/\\]+$/, ""), n = (t = n.split(/[/\\]/).pop()) !== null && t !== void 0 ? t : ""), n;
  }
  async uploadFile(e, t) {
    var n;
    const r = {};
    t != null && (r.mimeType = t.mimeType, r.name = t.name, r.displayName = t.displayName), r.name && !r.name.startsWith("files/") && (r.name = `files/${r.name}`);
    const o = this.clientOptions.uploader, i = await o.stat(e);
    r.sizeBytes = String(i.size);
    const s = (n = t?.mimeType) !== null && n !== void 0 ? n : i.type;
    if (s === void 0 || s === "") throw new Error("Can not determine mimeType. Please provide mimeType in the config.");
    r.mimeType = s;
    const u = { file: r }, c = this.getFileName(e), d = N("upload/v1beta/files", u._url), h = await this.fetchUploadUrl(d, r.sizeBytes, r.mimeType, c, u, t?.httpOptions);
    return o.upload(e, h, this);
  }
  async uploadFileToFileSearchStore(e, t, n) {
    var r;
    const o = this.clientOptions.uploader, i = await o.stat(t), s = String(i.size), u = (r = n?.mimeType) !== null && r !== void 0 ? r : i.type;
    if (u === void 0 || u === "") throw new Error("Can not determine mimeType. Please provide mimeType in the config.");
    const c = `upload/v1beta/${e}:uploadToFileSearchStore`, d = this.getFileName(t), h = {};
    n != null && Xf(n, h);
    const f = await this.fetchUploadUrl(c, s, u, d, h, n?.httpOptions);
    return o.uploadToFileSearchStore(t, f, this);
  }
  async downloadFile(e) {
    await this.clientOptions.downloader.download(e, this);
  }
  async fetchUploadUrl(e, t, n, r, o, i) {
    var s;
    let u = {};
    i ? u = i : u = {
      apiVersion: "",
      headers: Object.assign({
        "Content-Type": "application/json",
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": `${t}`,
        "X-Goog-Upload-Header-Content-Type": `${n}`
      }, r ? { "X-Goog-Upload-File-Name": r } : {})
    };
    const c = await this.request({
      path: e,
      body: JSON.stringify(o),
      httpMethod: "POST",
      httpOptions: u
    });
    if (!c || !c?.headers) throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");
    const d = (s = c?.headers) === null || s === void 0 ? void 0 : s["x-goog-upload-url"];
    if (d === void 0) throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");
    return d;
  }
};
async function ju(e) {
  var t;
  if (e === void 0) throw new Error("response is undefined");
  if (!e.ok) {
    const n = e.status;
    let r;
    !((t = e.headers.get("content-type")) === null || t === void 0) && t.includes("application/json") ? r = await e.json() : r = { error: {
      message: await e.text(),
      code: e.status,
      status: e.statusText
    } };
    const o = JSON.stringify(r);
    throw n >= 400 && n < 600 ? new qf({
      message: o,
      status: n
    }) : new Error(o);
  }
}
function tE(e, t) {
  if (!t || Object.keys(t).length === 0) return;
  if (e.body instanceof Blob) {
    console.warn("includeExtraBodyToRequestInit: extraBody provided but current request body is a Blob. extraBody will be ignored as merging is not supported for Blob bodies.");
    return;
  }
  let n = {};
  if (typeof e.body == "string" && e.body.length > 0) try {
    const i = JSON.parse(e.body);
    if (typeof i == "object" && i !== null && !Array.isArray(i)) n = i;
    else {
      console.warn("includeExtraBodyToRequestInit: Original request body is valid JSON but not a non-array object. Skip applying extraBody to the request body.");
      return;
    }
  } catch {
    console.warn("includeExtraBodyToRequestInit: Original request body is not valid JSON. Skip applying extraBody to the request body.");
    return;
  }
  function r(i, s) {
    const u = Object.assign({}, i);
    for (const c in s) if (Object.prototype.hasOwnProperty.call(s, c)) {
      const d = s[c], h = u[c];
      d && typeof d == "object" && !Array.isArray(d) && h && typeof h == "object" && !Array.isArray(h) ? u[c] = r(h, d) : (h && d && typeof h != typeof d && console.warn(`includeExtraBodyToRequestInit:deepMerge: Type mismatch for key "${c}". Original type: ${typeof h}, New type: ${typeof d}. Overwriting.`), u[c] = d);
    }
    return u;
  }
  const o = r(n, t);
  e.body = JSON.stringify(o);
}
var nE = "mcp_used/unknown", rE = !1;
function Qf(e) {
  for (const t of e)
    if (oE(t) || typeof t == "object" && "inputSchema" in t) return !0;
  return rE;
}
function Zf(e) {
  var t;
  e[ns] = (((t = e[ns]) !== null && t !== void 0 ? t : "") + ` ${nE}`).trimStart();
}
function oE(e) {
  return e !== null && typeof e == "object" && e instanceof sE;
}
function iE(e) {
  return Je(this, arguments, function* (n, r = 100) {
    let o, i = 0;
    for (; i < r; ) {
      const s = yield q(n.listTools({ cursor: o }));
      for (const u of s.tools)
        yield yield q(u), i++;
      if (!s.nextCursor) break;
      o = s.nextCursor;
    }
  });
}
var sE = class jf {
  constructor(t = [], n) {
    this.mcpTools = [], this.functionNameToMcpClient = {}, this.mcpClients = t, this.config = n;
  }
  static create(t, n) {
    return new jf(t, n);
  }
  async initialize() {
    var t, n, r, o;
    if (this.mcpTools.length > 0) return;
    const i = {}, s = [];
    for (const h of this.mcpClients) try {
      for (var u = !0, c = (n = void 0, Ke(iE(h))), d; d = await c.next(), t = d.done, !t; u = !0) {
        o = d.value, u = !1;
        const f = o;
        s.push(f);
        const p = f.name;
        if (i[p]) throw new Error(`Duplicate function name ${p} found in MCP tools. Please ensure function names are unique.`);
        i[p] = h;
      }
    } catch (f) {
      n = { error: f };
    } finally {
      try {
        !u && !t && (r = c.return) && await r.call(c);
      } finally {
        if (n) throw n.error;
      }
    }
    this.mcpTools = s, this.functionNameToMcpClient = i;
  }
  async tool() {
    return await this.initialize(), Ay(this.mcpTools, this.config);
  }
  async callTool(t) {
    await this.initialize();
    const n = [];
    for (const r of t) if (r.name in this.functionNameToMcpClient) {
      const o = this.functionNameToMcpClient[r.name];
      let i;
      this.config.timeout && (i = { timeout: this.config.timeout });
      const s = await o.callTool({
        name: r.name,
        arguments: r.args
      }, void 0, i);
      n.push({ functionResponse: {
        name: r.name,
        response: s.isError ? { error: s } : s
      } });
    }
    return n;
  }
};
async function aE(e, t, n) {
  const r = new dy();
  let o;
  n.data instanceof Blob ? o = JSON.parse(await n.data.text()) : o = JSON.parse(n.data), Object.assign(r, o), t(r);
}
var lE = class {
  constructor(e, t, n) {
    this.apiClient = e, this.auth = t, this.webSocketFactory = n;
  }
  async connect(e) {
    var t, n;
    if (this.apiClient.isVertexAI()) throw new Error("Live music is not supported for Vertex AI.");
    console.warn("Live music generation is experimental and may change in future versions.");
    const r = this.apiClient.getWebsocketBaseUrl(), o = this.apiClient.getApiVersion(), i = dE(this.apiClient.getDefaultHeaders()), s = `${r}/ws/google.ai.generativelanguage.${o}.GenerativeService.BidiGenerateMusic?key=${this.apiClient.getApiKey()}`;
    let u = () => {
    };
    const c = new Promise((_) => {
      u = _;
    }), d = e.callbacks, h = function() {
      u({});
    }, f = this.apiClient, p = {
      onopen: h,
      onmessage: (_) => {
        aE(f, d.onmessage, _);
      },
      onerror: (t = d?.onerror) !== null && t !== void 0 ? t : function(_) {
      },
      onclose: (n = d?.onclose) !== null && n !== void 0 ? n : function(_) {
      }
    }, m = this.webSocketFactory.create(s, cE(i), p);
    m.connect(), await c;
    const g = { setup: { model: K(this.apiClient, e.model) } };
    return m.send(JSON.stringify(g)), new uE(m, this.apiClient);
  }
}, uE = class {
  constructor(e, t) {
    this.conn = e, this.apiClient = t;
  }
  async setWeightedPrompts(e) {
    if (!e.weightedPrompts || Object.keys(e.weightedPrompts).length === 0) throw new Error("Weighted prompts must be set and contain at least one entry.");
    const t = IA(e);
    this.conn.send(JSON.stringify({ clientContent: t }));
  }
  async setMusicGenerationConfig(e) {
    e.musicGenerationConfig || (e.musicGenerationConfig = {});
    const t = wA(e);
    this.conn.send(JSON.stringify(t));
  }
  sendPlaybackControl(e) {
    const t = { playbackControl: e };
    this.conn.send(JSON.stringify(t));
  }
  play() {
    this.sendPlaybackControl(nn.PLAY);
  }
  pause() {
    this.sendPlaybackControl(nn.PAUSE);
  }
  stop() {
    this.sendPlaybackControl(nn.STOP);
  }
  resetContext() {
    this.sendPlaybackControl(nn.RESET_CONTEXT);
  }
  close() {
    this.conn.close();
  }
};
function cE(e) {
  const t = {};
  return e.forEach((n, r) => {
    t[r] = n;
  }), t;
}
function dE(e) {
  const t = new Headers();
  for (const [n, r] of Object.entries(e)) t.append(n, r);
  return t;
}
var fE = "FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.";
async function hE(e, t, n) {
  const r = new cy();
  let o;
  n.data instanceof Blob ? o = await n.data.text() : n.data instanceof ArrayBuffer ? o = new TextDecoder().decode(n.data) : o = n.data;
  const i = JSON.parse(o);
  if (e.isVertexAI()) {
    const s = PA(i);
    Object.assign(r, s);
  } else Object.assign(r, i);
  t(r);
}
var pE = class {
  constructor(e, t, n) {
    this.apiClient = e, this.auth = t, this.webSocketFactory = n, this.music = new lE(this.apiClient, this.auth, this.webSocketFactory);
  }
  async connect(e) {
    var t, n, r, o, i, s;
    if (e.config && e.config.httpOptions) throw new Error("The Live module does not support httpOptions at request-level in LiveConnectConfig yet. Please use the client-level httpOptions configuration instead.");
    const u = this.apiClient.getWebsocketBaseUrl(), c = this.apiClient.getApiVersion();
    let d;
    const h = this.apiClient.getHeaders();
    e.config && e.config.tools && Qf(e.config.tools) && Zf(h);
    const f = yE(h);
    if (this.apiClient.isVertexAI()) {
      const I = this.apiClient.getProject(), x = this.apiClient.getLocation(), b = this.apiClient.getApiKey(), F = !!I && !!x || !!b;
      this.apiClient.getCustomBaseUrl() && !F ? d = u : (d = `${u}/ws/google.cloud.aiplatform.${c}.LlmBidiService/BidiGenerateContent`, await this.auth.addAuthHeaders(f, d));
    } else {
      const I = this.apiClient.getApiKey();
      let x = "BidiGenerateContent", b = "key";
      I?.startsWith("auth_tokens/") && (console.warn("Warning: Ephemeral token support is experimental and may change in future versions."), c !== "v1alpha" && console.warn("Warning: The SDK's ephemeral token support is in v1alpha only. Please use const ai = new GoogleGenAI({apiKey: token.name, httpOptions: { apiVersion: 'v1alpha' }}); before session connection."), x = "BidiGenerateContentConstrained", b = "access_token"), d = `${u}/ws/google.ai.generativelanguage.${c}.GenerativeService.${x}?${b}=${I}`;
    }
    let p = () => {
    };
    const m = new Promise((I) => {
      p = I;
    }), g = e.callbacks, _ = function() {
      var I;
      (I = g?.onopen) === null || I === void 0 || I.call(g), p({});
    }, y = this.apiClient, E = {
      onopen: _,
      onmessage: (I) => {
        hE(y, g.onmessage, I);
      },
      onerror: (t = g?.onerror) !== null && t !== void 0 ? t : function(I) {
      },
      onclose: (n = g?.onclose) !== null && n !== void 0 ? n : function(I) {
      }
    }, A = this.webSocketFactory.create(d, _E(f), E);
    A.connect(), await m;
    let w = K(this.apiClient, e.model);
    if (this.apiClient.isVertexAI() && w.startsWith("publishers/")) {
      const I = this.apiClient.getProject(), x = this.apiClient.getLocation();
      I && x && (w = `projects/${I}/locations/${x}/` + w);
    }
    let P = {};
    this.apiClient.isVertexAI() && ((r = e.config) === null || r === void 0 ? void 0 : r.responseModalities) === void 0 && (e.config === void 0 ? e.config = { responseModalities: [Eo.AUDIO] } : e.config.responseModalities = [Eo.AUDIO]), !((o = e.config) === null || o === void 0) && o.generationConfig && console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");
    const L = (s = (i = e.config) === null || i === void 0 ? void 0 : i.tools) !== null && s !== void 0 ? s : [], C = [];
    for (const I of L) if (this.isCallableTool(I)) {
      const x = I;
      C.push(await x.tool());
    } else C.push(I);
    C.length > 0 && (e.config.tools = C);
    const k = {
      model: w,
      config: e.config,
      callbacks: e.callbacks
    };
    return this.apiClient.isVertexAI() ? P = CA(this.apiClient, k) : P = EA(this.apiClient, k), delete P.config, A.send(JSON.stringify(P)), new gE(A, this.apiClient);
  }
  isCallableTool(e) {
    return "callTool" in e && typeof e.callTool == "function";
  }
}, mE = { turnComplete: !0 }, gE = class {
  constructor(e, t) {
    this.conn = e, this.apiClient = t;
  }
  tLiveClientContent(e, t) {
    if (t.turns !== null && t.turns !== void 0) {
      let n = [];
      try {
        n = ve(t.turns), e.isVertexAI() || (n = n.map((r) => Tr(r)));
      } catch {
        throw new Error(`Failed to parse client content "turns", type: '${typeof t.turns}'`);
      }
      return { clientContent: {
        turns: n,
        turnComplete: t.turnComplete
      } };
    }
    return { clientContent: { turnComplete: t.turnComplete } };
  }
  tLiveClienttToolResponse(e, t) {
    let n = [];
    if (t.functionResponses == null) throw new Error("functionResponses is required.");
    if (Array.isArray(t.functionResponses) ? n = t.functionResponses : n = [t.functionResponses], n.length === 0) throw new Error("functionResponses is required.");
    for (const r of n) {
      if (typeof r != "object" || r === null || !("name" in r) || !("response" in r)) throw new Error(`Could not parse function response, type '${typeof r}'.`);
      if (!e.isVertexAI() && !("id" in r)) throw new Error(fE);
    }
    return { toolResponse: { functionResponses: n } };
  }
  sendClientContent(e) {
    e = Object.assign(Object.assign({}, mE), e);
    const t = this.tLiveClientContent(this.apiClient, e);
    this.conn.send(JSON.stringify(t));
  }
  sendRealtimeInput(e) {
    let t = {};
    this.apiClient.isVertexAI() ? t = { realtimeInput: RA(e) } : t = { realtimeInput: bA(e) }, this.conn.send(JSON.stringify(t));
  }
  sendToolResponse(e) {
    if (e.functionResponses == null) throw new Error("Tool response parameters are required.");
    const t = this.tLiveClienttToolResponse(this.apiClient, e);
    this.conn.send(JSON.stringify(t));
  }
  close() {
    this.conn.close();
  }
};
function _E(e) {
  const t = {};
  return e.forEach((n, r) => {
    t[r] = n;
  }), t;
}
function yE(e) {
  const t = new Headers();
  for (const [n, r] of Object.entries(e)) t.append(n, r);
  return t;
}
var ec = 10;
function tc(e) {
  var t, n, r;
  if (!((t = e?.automaticFunctionCalling) === null || t === void 0) && t.disable) return !0;
  let o = !1;
  for (const s of (n = e?.tools) !== null && n !== void 0 ? n : []) if (cn(s)) {
    o = !0;
    break;
  }
  if (!o) return !0;
  const i = (r = e?.automaticFunctionCalling) === null || r === void 0 ? void 0 : r.maximumRemoteCalls;
  return i && (i < 0 || !Number.isInteger(i)) || i == 0 ? (console.warn("Invalid maximumRemoteCalls value provided for automatic function calling. Disabled automatic function calling. Please provide a valid integer value greater than 0. maximumRemoteCalls provided:", i), !0) : !1;
}
function cn(e) {
  return "callTool" in e && typeof e.callTool == "function";
}
function vE(e) {
  var t, n, r;
  return (r = (n = (t = e.config) === null || t === void 0 ? void 0 : t.tools) === null || n === void 0 ? void 0 : n.some((o) => cn(o))) !== null && r !== void 0 ? r : !1;
}
function nc(e) {
  var t;
  const n = [];
  return !((t = e?.config) === null || t === void 0) && t.tools && e.config.tools.forEach((r, o) => {
    if (cn(r)) return;
    const i = r;
    i.functionDeclarations && i.functionDeclarations.length > 0 && n.push(o);
  }), n;
}
function rc(e) {
  var t;
  return !(!((t = e?.automaticFunctionCalling) === null || t === void 0) && t.ignoreCallHistory);
}
var AE = class extends dt {
  constructor(e) {
    super(), this.apiClient = e, this.embedContent = async (t) => {
      if (!this.apiClient.isVertexAI())
        return t.model.includes("gemini-embedding-2") && (t.contents = ve(t.contents)), await this.embedContentInternal(t);
      if (t.model.includes("gemini") && t.model !== "gemini-embedding-001" || t.model.includes("maas")) {
        const n = ve(t.contents);
        if (n.length > 1) throw new Error("The embedContent API for this model only supports one content at a time.");
        const r = Object.assign(Object.assign({}, t), {
          content: n[0],
          embeddingApiType: Co.EMBED_CONTENT
        });
        return await this.embedContentInternal(r);
      } else {
        const n = Object.assign(Object.assign({}, t), { embeddingApiType: Co.PREDICT });
        return await this.embedContentInternal(n);
      }
    }, this.generateContent = async (t) => {
      var n, r, o, i, s;
      const u = await this.processParamsMaybeAddMcpUsage(t);
      if (this.maybeMoveToResponseJsonSchem(t), !vE(t) || tc(t.config)) return await this.generateContentInternal(u);
      const c = nc(t);
      if (c.length > 0) {
        const g = c.map((_) => `tools[${_}]`).join(", ");
        throw new Error(`Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations is not yet supported. Incompatible tools found at ${g}.`);
      }
      let d, h;
      const f = ve(u.contents), p = (o = (r = (n = u.config) === null || n === void 0 ? void 0 : n.automaticFunctionCalling) === null || r === void 0 ? void 0 : r.maximumRemoteCalls) !== null && o !== void 0 ? o : ec;
      let m = 0;
      for (; m < p && (d = await this.generateContentInternal(u), !(!d.functionCalls || d.functionCalls.length === 0)); ) {
        const g = d.candidates[0].content, _ = [];
        for (const y of (s = (i = t.config) === null || i === void 0 ? void 0 : i.tools) !== null && s !== void 0 ? s : []) if (cn(y)) {
          const E = await y.callTool(d.functionCalls);
          _.push(...E);
        }
        m++, h = {
          role: "user",
          parts: _
        }, u.contents = ve(u.contents), u.contents.push(g), u.contents.push(h), rc(u.config) && (f.push(g), f.push(h));
      }
      return rc(u.config) && (d.automaticFunctionCallingHistory = f), d;
    }, this.generateContentStream = async (t) => {
      var n, r, o, i, s;
      if (this.maybeMoveToResponseJsonSchem(t), tc(t.config)) {
        const h = await this.processParamsMaybeAddMcpUsage(t);
        return await this.generateContentStreamInternal(h);
      }
      const u = nc(t);
      if (u.length > 0) {
        const h = u.map((f) => `tools[${f}]`).join(", ");
        throw new Error(`Incompatible tools found at ${h}. Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations" is not yet supported.`);
      }
      const c = (o = (r = (n = t?.config) === null || n === void 0 ? void 0 : n.toolConfig) === null || r === void 0 ? void 0 : r.functionCallingConfig) === null || o === void 0 ? void 0 : o.streamFunctionCallArguments, d = (s = (i = t?.config) === null || i === void 0 ? void 0 : i.automaticFunctionCalling) === null || s === void 0 ? void 0 : s.disable;
      if (c && !d) throw new Error("Running in streaming mode with 'streamFunctionCallArguments' enabled, this feature is not compatible with automatic function calling (AFC). Please set 'config.automaticFunctionCalling.disable' to true to disable AFC or leave 'config.toolConfig.functionCallingConfig.streamFunctionCallArguments' to be undefined or set to false to disable streaming function call arguments feature.");
      return await this.processAfcStream(t);
    }, this.generateImages = async (t) => await this.generateImagesInternal(t).then((n) => {
      var r;
      let o;
      const i = [];
      if (n?.generatedImages) for (const u of n.generatedImages) u && u?.safetyAttributes && ((r = u?.safetyAttributes) === null || r === void 0 ? void 0 : r.contentType) === "Positive Prompt" ? o = u?.safetyAttributes : i.push(u);
      let s;
      return o ? s = {
        generatedImages: i,
        positivePromptSafetyAttributes: o,
        sdkHttpResponse: n.sdkHttpResponse
      } : s = {
        generatedImages: i,
        sdkHttpResponse: n.sdkHttpResponse
      }, s;
    }), this.list = async (t) => {
      var n;
      const r = { config: Object.assign(Object.assign({}, { queryBase: !0 }), t?.config) };
      if (this.apiClient.isVertexAI() && !r.config.queryBase) {
        if (!((n = r.config) === null || n === void 0) && n.filter) throw new Error("Filtering tuned models list for Vertex AI is not currently supported");
        r.config.filter = "labels.tune-type:*";
      }
      return new qt(ct.PAGED_ITEM_MODELS, (o) => this.listInternal(o), await this.listInternal(r), r);
    }, this.editImage = async (t) => {
      const n = {
        model: t.model,
        prompt: t.prompt,
        referenceImages: [],
        config: t.config
      };
      return t.referenceImages && t.referenceImages && (n.referenceImages = t.referenceImages.map((r) => r.toReferenceImageAPI())), await this.editImageInternal(n);
    }, this.upscaleImage = async (t) => {
      let n = {
        numberOfImages: 1,
        mode: "upscale"
      };
      t.config && (n = Object.assign(Object.assign({}, n), t.config));
      const r = {
        model: t.model,
        image: t.image,
        upscaleFactor: t.upscaleFactor,
        config: n
      };
      return await this.upscaleImageInternal(r);
    }, this.generateVideos = async (t) => {
      var n, r, o, i, s, u;
      if ((t.prompt || t.image || t.video) && t.source) throw new Error("Source and prompt/image/video are mutually exclusive. Please only use source.");
      return this.apiClient.isVertexAI() || (!((n = t.video) === null || n === void 0) && n.uri && (!((r = t.video) === null || r === void 0) && r.videoBytes) ? t.video = {
        uri: t.video.uri,
        mimeType: t.video.mimeType
      } : !((i = (o = t.source) === null || o === void 0 ? void 0 : o.video) === null || i === void 0) && i.uri && (!((u = (s = t.source) === null || s === void 0 ? void 0 : s.video) === null || u === void 0) && u.videoBytes) && (t.source.video = {
        uri: t.source.video.uri,
        mimeType: t.source.video.mimeType
      })), await this.generateVideosInternal(t);
    };
  }
  maybeMoveToResponseJsonSchem(e) {
    e.config && e.config.responseSchema && (e.config.responseJsonSchema || Object.keys(e.config.responseSchema).includes("$schema") && (e.config.responseJsonSchema = e.config.responseSchema, delete e.config.responseSchema));
  }
  async processParamsMaybeAddMcpUsage(e) {
    var t, n, r;
    const o = (t = e.config) === null || t === void 0 ? void 0 : t.tools;
    if (!o) return e;
    const i = await Promise.all(o.map(async (u) => cn(u) ? await u.tool() : u)), s = {
      model: e.model,
      contents: e.contents,
      config: Object.assign(Object.assign({}, e.config), { tools: i })
    };
    if (s.config.tools = i, e.config && e.config.tools && Qf(e.config.tools)) {
      const u = (r = (n = e.config.httpOptions) === null || n === void 0 ? void 0 : n.headers) !== null && r !== void 0 ? r : {};
      let c = Object.assign({}, u);
      Object.keys(c).length === 0 && (c = this.apiClient.getDefaultHeaders()), Zf(c), s.config.httpOptions = Object.assign(Object.assign({}, e.config.httpOptions), { headers: c });
    }
    return s;
  }
  async initAfcToolsMap(e) {
    var t, n, r;
    const o = /* @__PURE__ */ new Map();
    for (const i of (n = (t = e.config) === null || t === void 0 ? void 0 : t.tools) !== null && n !== void 0 ? n : []) if (cn(i)) {
      const s = i, u = await s.tool();
      for (const c of (r = u.functionDeclarations) !== null && r !== void 0 ? r : []) {
        if (!c.name) throw new Error("Function declaration name is required.");
        if (o.has(c.name)) throw new Error(`Duplicate tool declaration name: ${c.name}`);
        o.set(c.name, s);
      }
    }
    return o;
  }
  async processAfcStream(e) {
    var t, n, r;
    const o = (r = (n = (t = e.config) === null || t === void 0 ? void 0 : t.automaticFunctionCalling) === null || n === void 0 ? void 0 : n.maximumRemoteCalls) !== null && r !== void 0 ? r : ec;
    let i = !1, s = 0;
    const u = await this.initAfcToolsMap(e);
    return (function(c, d, h) {
      return Je(this, arguments, function* () {
        for (var f, p, m, g, _, y; s < o; ) {
          i && (s++, i = !1);
          const P = yield q(c.processParamsMaybeAddMcpUsage(h)), L = yield q(c.generateContentStreamInternal(P)), C = [], k = [];
          try {
            for (var E = !0, A = (p = void 0, Ke(L)), w; w = yield q(A.next()), f = w.done, !f; E = !0) {
              g = w.value, E = !1;
              const I = g;
              if (yield yield q(I), I.candidates && (!((_ = I.candidates[0]) === null || _ === void 0) && _.content)) {
                k.push(I.candidates[0].content);
                for (const x of (y = I.candidates[0].content.parts) !== null && y !== void 0 ? y : []) if (s < o && x.functionCall) {
                  if (!x.functionCall.name) throw new Error("Function call name was not returned by the model.");
                  if (d.has(x.functionCall.name)) {
                    const b = yield q(d.get(x.functionCall.name).callTool([x.functionCall]));
                    C.push(...b);
                  } else
                    throw new Error(`Automatic function calling was requested, but not all the tools the model used implement the CallableTool interface. Available tools: ${d.keys()}, mising tool: ${x.functionCall.name}`);
                }
              }
            }
          } catch (I) {
            p = { error: I };
          } finally {
            try {
              !E && !f && (m = A.return) && (yield q(m.call(A)));
            } finally {
              if (p) throw p.error;
            }
          }
          if (C.length > 0) {
            i = !0;
            const I = new $n();
            I.candidates = [{ content: {
              role: "user",
              parts: C
            } }], yield yield q(I);
            const x = [];
            x.push(...k), x.push({
              role: "user",
              parts: C
            }), h.contents = ve(h.contents).concat(x);
          } else break;
        }
      });
    })(this, u, e);
  }
  async generateContentInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Xu(this.apiClient, e);
      return s = N("{model}:generateContent", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = Zu(d), f = new $n();
        return Object.assign(f, h), f;
      });
    } else {
      const c = Yu(this.apiClient, e);
      return s = N("{model}:generateContent", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = Qu(d), f = new $n();
        return Object.assign(f, h), f;
      });
    }
  }
  async generateContentStreamInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = Xu(this.apiClient, e);
      return s = N("{model}:streamGenerateContent?alt=sse", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.requestStream({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }), i.then(function(d) {
        return Je(this, arguments, function* () {
          var h, f, p, m;
          try {
            for (var g = !0, _ = Ke(d), y; y = yield q(_.next()), h = y.done, !h; g = !0) {
              m = y.value, g = !1;
              const E = m, A = Zu(yield q(E.json()), e);
              A.sdkHttpResponse = { headers: E.headers };
              const w = new $n();
              Object.assign(w, A), yield yield q(w);
            }
          } catch (E) {
            f = { error: E };
          } finally {
            try {
              !g && !h && (p = _.return) && (yield q(p.call(_)));
            } finally {
              if (f) throw f.error;
            }
          }
        });
      });
    } else {
      const c = Yu(this.apiClient, e);
      return s = N("{model}:streamGenerateContent?alt=sse", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.requestStream({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }), i.then(function(d) {
        return Je(this, arguments, function* () {
          var h, f, p, m;
          try {
            for (var g = !0, _ = Ke(d), y; y = yield q(_.next()), h = y.done, !h; g = !0) {
              m = y.value, g = !1;
              const E = m, A = Qu(yield q(E.json()), e);
              A.sdkHttpResponse = { headers: E.headers };
              const w = new $n();
              Object.assign(w, A), yield yield q(w);
            }
          } catch (E) {
            f = { error: E };
          } finally {
            try {
              !g && !h && (p = _.return) && (yield q(p.call(_)));
            } finally {
              if (f) throw f.error;
            }
          }
        });
      });
    }
  }
  async embedContentInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = uT(this.apiClient, e, e);
      return s = N(Sy(e.model) ? "{model}:embedContent" : "{model}:predict", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = dT(d, e), f = new Pu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = lT(this.apiClient, e);
      return s = N("{model}:batchEmbedContents", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = cT(d), f = new Pu();
        return Object.assign(f, h), f;
      });
    }
  }
  async generateImagesInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = ST(this.apiClient, e);
      return s = N("{model}:predict", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = CT(d), f = new Mu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = TT(this.apiClient, e);
      return s = N("{model}:predict", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = ET(d), f = new Mu();
        return Object.assign(f, h), f;
      });
    }
  }
  async editImageInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = oT(this.apiClient, e);
      return o = N("{model}:predict", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => {
        const c = iT(u), d = new Q_();
        return Object.assign(d, c), d;
      });
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
  async upscaleImageInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = CS(this.apiClient, e);
      return o = N("{model}:predict", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => {
        const c = wS(u), d = new Z_();
        return Object.assign(d, c), d;
      });
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
  async recontextImage(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = oS(this.apiClient, e);
      return o = N("{model}:predict", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = iS(u), d = new j_();
        return Object.assign(d, c), d;
      });
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
  async segmentImage(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = dS(this.apiClient, e);
      return o = N("{model}:predict", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = fS(u), d = new ey();
        return Object.assign(d, c), d;
      });
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
  async get(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = BT(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => ts(d));
    } else {
      const c = GT(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => es(d));
    }
  }
  async listInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = XT(this.apiClient, e);
      return s = N("{models_url}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = ZT(d), f = new xu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = YT(this.apiClient, e);
      return s = N("{models_url}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = QT(d), f = new xu();
        return Object.assign(f, h), f;
      });
    }
  }
  async update(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = SS(this.apiClient, e);
      return s = N("{model}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "PATCH",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => ts(d));
    } else {
      const c = TS(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "PATCH",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => es(d));
    }
  }
  async delete(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = eT(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "DELETE",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = nT(d), f = new Nu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = jA(this.apiClient, e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "DELETE",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = tT(d), f = new Nu();
        return Object.assign(f, h), f;
      });
    }
  }
  async countTokens(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = XA(this.apiClient, e);
      return s = N("{model}:countTokens", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = ZA(d), f = new ku();
        return Object.assign(f, h), f;
      });
    } else {
      const c = YA(this.apiClient, e);
      return s = N("{model}:countTokens", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = QA(d), f = new ku();
        return Object.assign(f, h), f;
      });
    }
  }
  async computeTokens(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = qA(this.apiClient, e);
      return o = N("{model}:computeTokens", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => {
        const c = HA(u), d = new ty();
        return Object.assign(d, c), d;
      });
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
  async generateVideosInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = MT(this.apiClient, e);
      return s = N("{model}:predictLongRunning", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i.then((d) => {
        const h = RT(d), f = new Du();
        return Object.assign(f, h), f;
      });
    } else {
      const c = PT(this.apiClient, e);
      return s = N("{model}:predictLongRunning", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i.then((d) => {
        const h = bT(d), f = new Du();
        return Object.assign(f, h), f;
      });
    }
  }
}, TE = class extends dt {
  constructor(e) {
    super(), this.apiClient = e;
  }
  async getVideosOperation(e) {
    const t = e.operation, n = e.config;
    if (t.name === void 0 || t.name === "") throw new Error("Operation name is required.");
    if (this.apiClient.isVertexAI()) {
      const r = t.name.split("/operations/")[0];
      let o;
      n && "httpOptions" in n && (o = n.httpOptions);
      const i = await this.fetchPredictVideosOperationInternal({
        operationName: t.name,
        resourceName: r,
        config: { httpOptions: o }
      });
      return t._fromAPIResponse({
        apiResponse: i,
        _isVertexAI: !0
      });
    } else {
      const r = await this.getVideosOperationInternal({
        operationName: t.name,
        config: n
      });
      return t._fromAPIResponse({
        apiResponse: r,
        _isVertexAI: !1
      });
    }
  }
  async get(e) {
    const t = e.operation, n = e.config;
    if (t.name === void 0 || t.name === "") throw new Error("Operation name is required.");
    if (this.apiClient.isVertexAI()) {
      const r = t.name.split("/operations/")[0];
      let o;
      n && "httpOptions" in n && (o = n.httpOptions);
      const i = await this.fetchPredictVideosOperationInternal({
        operationName: t.name,
        resourceName: r,
        config: { httpOptions: o }
      });
      return t._fromAPIResponse({
        apiResponse: i,
        _isVertexAI: !0
      });
    } else {
      const r = await this.getVideosOperationInternal({
        operationName: t.name,
        config: n
      });
      return t._fromAPIResponse({
        apiResponse: r,
        _isVertexAI: !1
      });
    }
  }
  async getVideosOperationInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = J_(e);
      return s = N("{operationName}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json()), i;
    } else {
      const c = V_(e);
      return s = N("{operationName}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json()), i;
    }
  }
  async fetchPredictVideosOperationInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = U_(e);
      return o = N("{resourceName}:fetchPredictOperation", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r;
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
};
function oc(e) {
  const t = {};
  if (a(e, ["languageCodes"]) !== void 0) throw new Error("languageCodes parameter is not supported in Gemini API.");
  return t;
}
function SE(e) {
  const t = {}, n = a(e, ["apiKey"]);
  if (n != null && l(t, ["apiKey"], n), a(e, ["apiKeyConfig"]) !== void 0) throw new Error("apiKeyConfig parameter is not supported in Gemini API.");
  if (a(e, ["authType"]) !== void 0) throw new Error("authType parameter is not supported in Gemini API.");
  if (a(e, ["googleServiceAccountConfig"]) !== void 0) throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");
  if (a(e, ["httpBasicAuthConfig"]) !== void 0) throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oauthConfig"]) !== void 0) throw new Error("oauthConfig parameter is not supported in Gemini API.");
  if (a(e, ["oidcConfig"]) !== void 0) throw new Error("oidcConfig parameter is not supported in Gemini API.");
  return t;
}
function EE(e) {
  const t = {}, n = a(e, ["data"]);
  if (n != null && l(t, ["data"], n), a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function CE(e) {
  const t = {}, n = a(e, ["parts"]);
  if (n != null) {
    let o = n;
    Array.isArray(o) && (o = o.map((i) => kE(i))), l(t, ["parts"], o);
  }
  const r = a(e, ["role"]);
  return r != null && l(t, ["role"], r), t;
}
function wE(e, t, n) {
  const r = {}, o = a(t, ["expireTime"]);
  n !== void 0 && o != null && l(n, ["expireTime"], o);
  const i = a(t, ["newSessionExpireTime"]);
  n !== void 0 && i != null && l(n, ["newSessionExpireTime"], i);
  const s = a(t, ["uses"]);
  n !== void 0 && s != null && l(n, ["uses"], s);
  const u = a(t, ["liveConnectConstraints"]);
  n !== void 0 && u != null && l(n, ["bidiGenerateContentSetup"], NE(e, u));
  const c = a(t, ["lockAdditionalFields"]);
  return n !== void 0 && c != null && l(n, ["fieldMask"], c), r;
}
function IE(e, t) {
  const n = {}, r = a(t, ["config"]);
  return r != null && l(n, ["config"], wE(e, r, n)), n;
}
function bE(e) {
  const t = {};
  if (a(e, ["displayName"]) !== void 0) throw new Error("displayName parameter is not supported in Gemini API.");
  const n = a(e, ["fileUri"]);
  n != null && l(t, ["fileUri"], n);
  const r = a(e, ["mimeType"]);
  return r != null && l(t, ["mimeType"], r), t;
}
function RE(e) {
  const t = {}, n = a(e, ["id"]);
  n != null && l(t, ["id"], n);
  const r = a(e, ["args"]);
  r != null && l(t, ["args"], r);
  const o = a(e, ["name"]);
  if (o != null && l(t, ["name"], o), a(e, ["partialArgs"]) !== void 0) throw new Error("partialArgs parameter is not supported in Gemini API.");
  if (a(e, ["willContinue"]) !== void 0) throw new Error("willContinue parameter is not supported in Gemini API.");
  return t;
}
function PE(e) {
  const t = {}, n = a(e, ["authConfig"]);
  n != null && l(t, ["authConfig"], SE(n));
  const r = a(e, ["enableWidget"]);
  return r != null && l(t, ["enableWidget"], r), t;
}
function ME(e) {
  const t = {}, n = a(e, ["searchTypes"]);
  if (n != null && l(t, ["searchTypes"], n), a(e, ["blockingConfidence"]) !== void 0) throw new Error("blockingConfidence parameter is not supported in Gemini API.");
  if (a(e, ["excludeDomains"]) !== void 0) throw new Error("excludeDomains parameter is not supported in Gemini API.");
  const r = a(e, ["timeRangeFilter"]);
  return r != null && l(t, ["timeRangeFilter"], r), t;
}
function xE(e, t) {
  const n = {}, r = a(e, ["generationConfig"]);
  t !== void 0 && r != null && l(t, ["setup", "generationConfig"], r);
  const o = a(e, ["responseModalities"]);
  t !== void 0 && o != null && l(t, [
    "setup",
    "generationConfig",
    "responseModalities"
  ], o);
  const i = a(e, ["temperature"]);
  t !== void 0 && i != null && l(t, [
    "setup",
    "generationConfig",
    "temperature"
  ], i);
  const s = a(e, ["topP"]);
  t !== void 0 && s != null && l(t, [
    "setup",
    "generationConfig",
    "topP"
  ], s);
  const u = a(e, ["topK"]);
  t !== void 0 && u != null && l(t, [
    "setup",
    "generationConfig",
    "topK"
  ], u);
  const c = a(e, ["maxOutputTokens"]);
  t !== void 0 && c != null && l(t, [
    "setup",
    "generationConfig",
    "maxOutputTokens"
  ], c);
  const d = a(e, ["mediaResolution"]);
  t !== void 0 && d != null && l(t, [
    "setup",
    "generationConfig",
    "mediaResolution"
  ], d);
  const h = a(e, ["seed"]);
  t !== void 0 && h != null && l(t, [
    "setup",
    "generationConfig",
    "seed"
  ], h);
  const f = a(e, ["speechConfig"]);
  t !== void 0 && f != null && l(t, [
    "setup",
    "generationConfig",
    "speechConfig"
  ], ra(f));
  const p = a(e, ["thinkingConfig"]);
  t !== void 0 && p != null && l(t, [
    "setup",
    "generationConfig",
    "thinkingConfig"
  ], p);
  const m = a(e, ["enableAffectiveDialog"]);
  t !== void 0 && m != null && l(t, [
    "setup",
    "generationConfig",
    "enableAffectiveDialog"
  ], m);
  const g = a(e, ["systemInstruction"]);
  t !== void 0 && g != null && l(t, ["setup", "systemInstruction"], CE(se(g)));
  const _ = a(e, ["tools"]);
  if (t !== void 0 && _ != null) {
    let I = mn(_);
    Array.isArray(I) && (I = I.map((x) => LE(pn(x)))), l(t, ["setup", "tools"], I);
  }
  const y = a(e, ["sessionResumption"]);
  t !== void 0 && y != null && l(t, ["setup", "sessionResumption"], $E(y));
  const E = a(e, ["inputAudioTranscription"]);
  t !== void 0 && E != null && l(t, ["setup", "inputAudioTranscription"], oc(E));
  const A = a(e, ["outputAudioTranscription"]);
  t !== void 0 && A != null && l(t, ["setup", "outputAudioTranscription"], oc(A));
  const w = a(e, ["realtimeInputConfig"]);
  t !== void 0 && w != null && l(t, ["setup", "realtimeInputConfig"], w);
  const P = a(e, ["contextWindowCompression"]);
  t !== void 0 && P != null && l(t, ["setup", "contextWindowCompression"], P);
  const L = a(e, ["proactivity"]);
  if (t !== void 0 && L != null && l(t, ["setup", "proactivity"], L), a(e, ["explicitVadSignal"]) !== void 0) throw new Error("explicitVadSignal parameter is not supported in Gemini API.");
  const C = a(e, ["avatarConfig"]);
  t !== void 0 && C != null && l(t, ["setup", "avatarConfig"], C);
  const k = a(e, ["safetySettings"]);
  if (t !== void 0 && k != null) {
    let I = k;
    Array.isArray(I) && (I = I.map((x) => DE(x))), l(t, ["setup", "safetySettings"], I);
  }
  return n;
}
function NE(e, t) {
  const n = {}, r = a(t, ["model"]);
  r != null && l(n, ["setup", "model"], K(e, r));
  const o = a(t, ["config"]);
  return o != null && l(n, ["config"], xE(o, n)), n;
}
function kE(e) {
  const t = {}, n = a(e, ["mediaResolution"]);
  n != null && l(t, ["mediaResolution"], n);
  const r = a(e, ["codeExecutionResult"]);
  r != null && l(t, ["codeExecutionResult"], r);
  const o = a(e, ["executableCode"]);
  o != null && l(t, ["executableCode"], o);
  const i = a(e, ["fileData"]);
  i != null && l(t, ["fileData"], bE(i));
  const s = a(e, ["functionCall"]);
  s != null && l(t, ["functionCall"], RE(s));
  const u = a(e, ["functionResponse"]);
  u != null && l(t, ["functionResponse"], u);
  const c = a(e, ["inlineData"]);
  c != null && l(t, ["inlineData"], EE(c));
  const d = a(e, ["text"]);
  d != null && l(t, ["text"], d);
  const h = a(e, ["thought"]);
  h != null && l(t, ["thought"], h);
  const f = a(e, ["thoughtSignature"]);
  f != null && l(t, ["thoughtSignature"], f);
  const p = a(e, ["videoMetadata"]);
  p != null && l(t, ["videoMetadata"], p);
  const m = a(e, ["toolCall"]);
  m != null && l(t, ["toolCall"], m);
  const g = a(e, ["toolResponse"]);
  g != null && l(t, ["toolResponse"], g);
  const _ = a(e, ["partMetadata"]);
  return _ != null && l(t, ["partMetadata"], _), t;
}
function DE(e) {
  const t = {}, n = a(e, ["category"]);
  if (n != null && l(t, ["category"], n), a(e, ["method"]) !== void 0) throw new Error("method parameter is not supported in Gemini API.");
  const r = a(e, ["threshold"]);
  return r != null && l(t, ["threshold"], r), t;
}
function $E(e) {
  const t = {}, n = a(e, ["handle"]);
  if (n != null && l(t, ["handle"], n), a(e, ["transparent"]) !== void 0) throw new Error("transparent parameter is not supported in Gemini API.");
  return t;
}
function LE(e) {
  const t = {};
  if (a(e, ["retrieval"]) !== void 0) throw new Error("retrieval parameter is not supported in Gemini API.");
  const n = a(e, ["computerUse"]);
  n != null && l(t, ["computerUse"], n);
  const r = a(e, ["fileSearch"]);
  r != null && l(t, ["fileSearch"], r);
  const o = a(e, ["googleSearch"]);
  o != null && l(t, ["googleSearch"], ME(o));
  const i = a(e, ["googleMaps"]);
  i != null && l(t, ["googleMaps"], PE(i));
  const s = a(e, ["codeExecution"]);
  if (s != null && l(t, ["codeExecution"], s), a(e, ["enterpriseWebSearch"]) !== void 0) throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");
  const u = a(e, ["functionDeclarations"]);
  if (u != null) {
    let f = u;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["functionDeclarations"], f);
  }
  const c = a(e, ["googleSearchRetrieval"]);
  if (c != null && l(t, ["googleSearchRetrieval"], c), a(e, ["parallelAiSearch"]) !== void 0) throw new Error("parallelAiSearch parameter is not supported in Gemini API.");
  const d = a(e, ["urlContext"]);
  d != null && l(t, ["urlContext"], d);
  const h = a(e, ["mcpServers"]);
  if (h != null) {
    let f = h;
    Array.isArray(f) && (f = f.map((p) => p)), l(t, ["mcpServers"], f);
  }
  return t;
}
function UE(e) {
  const t = [];
  for (const n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
    const r = e[n];
    if (typeof r == "object" && r != null && Object.keys(r).length > 0) {
      const o = Object.keys(r).map((i) => `${n}.${i}`);
      t.push(...o);
    } else t.push(n);
  }
  return t.join(",");
}
function FE(e, t) {
  let n = null;
  const r = e.bidiGenerateContentSetup;
  if (typeof r == "object" && r !== null && "setup" in r) {
    const i = r.setup;
    typeof i == "object" && i !== null ? (e.bidiGenerateContentSetup = i, n = i) : delete e.bidiGenerateContentSetup;
  } else r !== void 0 && delete e.bidiGenerateContentSetup;
  const o = e.fieldMask;
  if (n) {
    const i = UE(n);
    if (Array.isArray(t?.lockAdditionalFields) && t?.lockAdditionalFields.length === 0) i ? e.fieldMask = i : delete e.fieldMask;
    else if (t?.lockAdditionalFields && t.lockAdditionalFields.length > 0 && o !== null && Array.isArray(o) && o.length > 0) {
      const s = [
        "temperature",
        "topK",
        "topP",
        "maxOutputTokens",
        "responseModalities",
        "seed",
        "speechConfig"
      ];
      let u = [];
      o.length > 0 && (u = o.map((d) => s.includes(d) ? `generationConfig.${d}` : d));
      const c = [];
      i && c.push(i), u.length > 0 && c.push(...u), c.length > 0 ? e.fieldMask = c.join(",") : delete e.fieldMask;
    } else delete e.fieldMask;
  } else o !== null && Array.isArray(o) && o.length > 0 ? e.fieldMask = o.join(",") : delete e.fieldMask;
  return e;
}
var OE = class extends dt {
  constructor(e) {
    super(), this.apiClient = e;
  }
  async create(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("The client.tokens.create method is only supported by the Gemini Developer API.");
    {
      const s = IE(this.apiClient, e);
      o = N("auth_tokens", s._url), i = s._query, delete s.config, delete s._url, delete s._query;
      const u = FE(s, e.config);
      return r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(u),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((c) => c.json()), r.then((c) => c);
    }
  }
};
function GE(e, t) {
  const n = {}, r = a(e, ["force"]);
  return t !== void 0 && r != null && l(t, ["_query", "force"], r), n;
}
function BE(e) {
  const t = {}, n = a(e, ["name"]);
  n != null && l(t, ["_url", "name"], n);
  const r = a(e, ["config"]);
  return r != null && GE(r, t), t;
}
function qE(e) {
  const t = {}, n = a(e, ["name"]);
  return n != null && l(t, ["_url", "name"], n), t;
}
function HE(e, t) {
  const n = {}, r = a(e, ["pageSize"]);
  t !== void 0 && r != null && l(t, ["_query", "pageSize"], r);
  const o = a(e, ["pageToken"]);
  return t !== void 0 && o != null && l(t, ["_query", "pageToken"], o), n;
}
function VE(e) {
  const t = {}, n = a(e, ["parent"]);
  n != null && l(t, ["_url", "parent"], n);
  const r = a(e, ["config"]);
  return r != null && HE(r, t), t;
}
function JE(e) {
  const t = {}, n = a(e, ["sdkHttpResponse"]);
  n != null && l(t, ["sdkHttpResponse"], n);
  const r = a(e, ["nextPageToken"]);
  r != null && l(t, ["nextPageToken"], r);
  const o = a(e, ["documents"]);
  if (o != null) {
    let i = o;
    Array.isArray(i) && (i = i.map((s) => s)), l(t, ["documents"], i);
  }
  return t;
}
var KE = class extends dt {
  constructor(e) {
    super(), this.apiClient = e, this.list = async (t) => new qt(ct.PAGED_ITEM_DOCUMENTS, (n) => this.listInternal({
      parent: t.parent,
      config: n.config
    }), await this.listInternal(t), t);
  }
  async get(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = qE(e);
      return o = N("{name}", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => u);
    }
  }
  async delete(e) {
    var t, n;
    let r = "", o = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const i = BE(e);
      r = N("{name}", i._url), o = i._query, delete i._url, delete i._query, await this.apiClient.request({
        path: r,
        queryParams: o,
        body: JSON.stringify(i),
        httpMethod: "DELETE",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      });
    }
  }
  async listInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = VE(e);
      return o = N("{parent}/documents", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = JE(u), d = new ny();
        return Object.assign(d, c), d;
      });
    }
  }
}, WE = class extends dt {
  constructor(e, t = new KE(e)) {
    super(), this.apiClient = e, this.documents = t, this.list = async (n = {}) => new qt(ct.PAGED_ITEM_FILE_SEARCH_STORES, (r) => this.listInternal(r), await this.listInternal(n), n);
  }
  async uploadToFileSearchStore(e) {
    if (this.apiClient.isVertexAI()) throw new Error("Vertex AI does not support uploading files to a file search store.");
    return this.apiClient.uploadFileToFileSearchStore(e.fileSearchStoreName, e.file, e.config);
  }
  async create(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = NS(e);
      return o = N("fileSearchStores", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => u);
    }
  }
  async get(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = $S(e);
      return o = N("{name}", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => u);
    }
  }
  async delete(e) {
    var t, n;
    let r = "", o = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const i = DS(e);
      r = N("{name}", i._url), o = i._query, delete i._url, delete i._query, await this.apiClient.request({
        path: r,
        queryParams: o,
        body: JSON.stringify(i),
        httpMethod: "DELETE",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      });
    }
  }
  async listInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = BS(e);
      return o = N("fileSearchStores", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = qS(u), d = new ry();
        return Object.assign(d, c), d;
      });
    }
  }
  async uploadToFileSearchStoreInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = HS(e);
      return o = N("upload/v1beta/{file_search_store_name}:uploadToFileSearchStore", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = VS(u), d = new oy();
        return Object.assign(d, c), d;
      });
    }
  }
  async importFile(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = FS(e);
      return o = N("{file_search_store_name}:importFile", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json()), r.then((u) => {
        const c = US(u), d = new iy();
        return Object.assign(d, c), d;
      });
    }
  }
}, eh = function() {
  const { crypto: e } = globalThis;
  if (e?.randomUUID)
    return eh = e.randomUUID.bind(e), e.randomUUID();
  const t = new Uint8Array(1), n = e ? () => e.getRandomValues(t)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (r) => (+r ^ n() & 15 >> +r / 4).toString(16));
}, zE = () => eh();
function rs(e) {
  return typeof e == "object" && e !== null && ("name" in e && e.name === "AbortError" || "message" in e && String(e.message).includes("FetchRequestCanceledException"));
}
var os = (e) => {
  if (e instanceof Error) return e;
  if (typeof e == "object" && e !== null) {
    try {
      if (Object.prototype.toString.call(e) === "[object Error]") {
        const t = new Error(e.message, e.cause ? { cause: e.cause } : {});
        return e.stack && (t.stack = e.stack), e.cause && !t.cause && (t.cause = e.cause), e.name && (t.name = e.name), t;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(e));
    } catch {
    }
  }
  return new Error(e);
}, De = class extends Error {
}, Le = class is extends De {
  constructor(t, n, r, o) {
    super(`${is.makeMessage(t, n, r)}`), this.status = t, this.headers = o, this.error = n;
  }
  static makeMessage(t, n, r) {
    const o = n?.message ? typeof n.message == "string" ? n.message : JSON.stringify(n.message) : n ? JSON.stringify(n) : r;
    return t && o ? `${t} ${o}` : t ? `${t} status code (no body)` : o || "(no status code or body)";
  }
  static generate(t, n, r, o) {
    if (!t || !o) return new zo({
      message: r,
      cause: os(n)
    });
    const i = n;
    return t === 400 ? new nh(t, i, r, o) : t === 401 ? new rh(t, i, r, o) : t === 403 ? new oh(t, i, r, o) : t === 404 ? new ih(t, i, r, o) : t === 409 ? new sh(t, i, r, o) : t === 422 ? new ah(t, i, r, o) : t === 429 ? new lh(t, i, r, o) : t >= 500 ? new uh(t, i, r, o) : new is(t, i, r, o);
  }
}, ss = class extends Le {
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}, zo = class extends Le {
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}, th = class extends zo {
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}, nh = class extends Le {
}, rh = class extends Le {
}, oh = class extends Le {
}, ih = class extends Le {
}, sh = class extends Le {
}, ah = class extends Le {
}, lh = class extends Le {
}, uh = class extends Le {
}, YE = /^[a-z][a-z0-9+.-]*:/i, XE = (e) => YE.test(e), as = (e) => (as = Array.isArray, as(e)), ic = as;
function sc(e) {
  if (!e) return !0;
  for (const t in e) return !1;
  return !0;
}
function QE(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var ZE = (e, t) => {
  if (typeof t != "number" || !Number.isInteger(t)) throw new De(`${e} must be an integer`);
  if (t < 0) throw new De(`${e} must be a positive integer`);
  return t;
}, jE = (e) => {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}, eC = (e) => new Promise((t) => setTimeout(t, e));
function tC() {
  if (typeof fetch < "u") return fetch;
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new GeminiNextGenAPIClient({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function ch(...e) {
  const t = globalThis.ReadableStream;
  if (typeof t > "u") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new t(...e);
}
function nC(e) {
  let t = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
  return ch({
    start() {
    },
    async pull(n) {
      const { done: r, value: o } = await t.next();
      r ? n.close() : n.enqueue(o);
    },
    async cancel() {
      var n;
      await ((n = t.return) === null || n === void 0 ? void 0 : n.call(t));
    }
  });
}
function dh(e) {
  if (e[Symbol.asyncIterator]) return e;
  const t = e.getReader();
  return {
    async next() {
      try {
        const n = await t.read();
        return n?.done && t.releaseLock(), n;
      } catch (n) {
        throw t.releaseLock(), n;
      }
    },
    async return() {
      const n = t.cancel();
      return t.releaseLock(), await n, {
        done: !0,
        value: void 0
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function rC(e) {
  var t, n;
  if (e === null || typeof e != "object") return;
  if (e[Symbol.asyncIterator]) {
    await ((n = (t = e[Symbol.asyncIterator]()).return) === null || n === void 0 ? void 0 : n.call(t));
    return;
  }
  const r = e.getReader(), o = r.cancel();
  r.releaseLock(), await o;
}
var oC = ({ headers: e, body: t }) => ({
  bodyHeaders: { "content-type": "application/json" },
  body: JSON.stringify(t)
});
function iC(e) {
  return Object.entries(e).filter(([t, n]) => typeof n < "u").map(([t, n]) => {
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") return `${encodeURIComponent(t)}=${encodeURIComponent(n)}`;
    if (n === null) return `${encodeURIComponent(t)}=`;
    throw new De(`Cannot stringify type ${typeof n}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
  }).join("&");
}
var sC = "0.0.1", fh = () => {
  var e;
  if (typeof File > "u") {
    const { process: t } = globalThis, n = typeof ((e = t?.versions) === null || e === void 0 ? void 0 : e.node) == "string" && parseInt(t.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (n ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
};
function Ti(e, t, n) {
  return fh(), new File(e, t ?? "unknown_file", n);
}
function aC(e) {
  return (typeof e == "object" && e !== null && ("name" in e && e.name && String(e.name) || "url" in e && e.url && String(e.url) || "filename" in e && e.filename && String(e.filename) || "path" in e && e.path && String(e.path)) || "").split(/[\\/]/).pop() || void 0;
}
var lC = (e) => e != null && typeof e == "object" && typeof e[Symbol.asyncIterator] == "function", hh = (e) => e != null && typeof e == "object" && typeof e.size == "number" && typeof e.type == "string" && typeof e.text == "function" && typeof e.slice == "function" && typeof e.arrayBuffer == "function", uC = (e) => e != null && typeof e == "object" && typeof e.name == "string" && typeof e.lastModified == "number" && hh(e), cC = (e) => e != null && typeof e == "object" && typeof e.url == "string" && typeof e.blob == "function";
async function dC(e, t, n) {
  if (fh(), e = await e, uC(e))
    return e instanceof File ? e : Ti([await e.arrayBuffer()], e.name);
  if (cC(e)) {
    const o = await e.blob();
    return t || (t = new URL(e.url).pathname.split(/[\\/]/).pop()), Ti(await ls(o), t, n);
  }
  const r = await ls(e);
  if (t || (t = aC(e)), !n?.type) {
    const o = r.find((i) => typeof i == "object" && "type" in i && i.type);
    typeof o == "string" && (n = Object.assign(Object.assign({}, n), { type: o }));
  }
  return Ti(r, t, n);
}
async function ls(e) {
  var t, n, r, o, i;
  let s = [];
  if (typeof e == "string" || ArrayBuffer.isView(e) || e instanceof ArrayBuffer) s.push(e);
  else if (hh(e)) s.push(e instanceof Blob ? e : await e.arrayBuffer());
  else if (lC(e)) try {
    for (var u = !0, c = Ke(e), d; d = await c.next(), t = d.done, !t; u = !0) {
      o = d.value, u = !1;
      const h = o;
      s.push(...await ls(h));
    }
  } catch (h) {
    n = { error: h };
  } finally {
    try {
      !u && !t && (r = c.return) && await r.call(c);
    } finally {
      if (n) throw n.error;
    }
  }
  else {
    const h = (i = e?.constructor) === null || i === void 0 ? void 0 : i.name;
    throw new Error(`Unexpected data type: ${typeof e}${h ? `; constructor: ${h}` : ""}${fC(e)}`);
  }
  return s;
}
function fC(e) {
  return typeof e != "object" || e === null ? "" : `; props: [${Object.getOwnPropertyNames(e).map((t) => `"${t}"`).join(", ")}]`;
}
var oa = class {
  constructor(e) {
    this._client = e;
  }
};
oa._key = [];
function ph(e) {
  return e.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null)), hC = (e = ph) => (function(n, ...r) {
  if (n.length === 1) return n[0];
  let o = !1;
  const i = [], s = n.reduce((h, f, p) => {
    var m, g, _;
    /[?#]/.test(f) && (o = !0);
    const y = r[p];
    let E = (o ? encodeURIComponent : e)("" + y);
    return p !== r.length && (y == null || typeof y == "object" && y.toString === ((_ = Object.getPrototypeOf((g = Object.getPrototypeOf((m = y.hasOwnProperty) !== null && m !== void 0 ? m : ac)) !== null && g !== void 0 ? g : ac)) === null || _ === void 0 ? void 0 : _.toString)) && (E = y + "", i.push({
      start: h.length + f.length,
      length: E.length,
      error: `Value of type ${Object.prototype.toString.call(y).slice(8, -1)} is not a valid path parameter`
    })), h + f + (p === r.length ? "" : E);
  }, ""), u = s.split(/[?#]/, 1)[0], c = /(^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
  let d;
  for (; (d = c.exec(u)) !== null; ) {
    const h = d[0].startsWith("/"), f = h ? 1 : 0, p = h ? d[0].slice(1) : d[0];
    i.push({
      start: d.index + f,
      length: p.length,
      error: `Value "${p}" can't be safely passed as a path parameter`
    });
  }
  if (i.sort((h, f) => h.start - f.start), i.length > 0) {
    let h = 0;
    const f = i.reduce((p, m) => {
      const g = " ".repeat(m.start - h), _ = "^".repeat(m.length);
      return h = m.start + m.length, p + g + _;
    }, "");
    throw new De(`Path parameters result in path with invalid segments:
${i.map((p) => p.error).join(`
`)}
${s}
${f}`);
  }
  return s;
}), Ge = /* @__PURE__ */ hC(ph), mh = class extends oa {
  create(e, t) {
    var n;
    const { api_version: r = this._client.apiVersion } = e, o = St(e, ["api_version"]);
    if ("model" in o && "agent_config" in o) throw new De("Invalid request: specified `model` and `agent_config`. If specifying `model`, use `generation_config`.");
    if ("agent" in o && "generation_config" in o) throw new De("Invalid request: specified `agent` and `generation_config`. If specifying `agent`, use `agent_config`.");
    return this._client.post(Ge`/${r}/interactions`, Object.assign(Object.assign({ body: o }, t), { stream: (n = e.stream) !== null && n !== void 0 ? n : !1 }));
  }
  delete(e, t = {}, n) {
    const { api_version: r = this._client.apiVersion } = t ?? {};
    return this._client.delete(Ge`/${r}/interactions/${e}`, n);
  }
  cancel(e, t = {}, n) {
    const { api_version: r = this._client.apiVersion } = t ?? {};
    return this._client.post(Ge`/${r}/interactions/${e}/cancel`, n);
  }
  get(e, t = {}, n) {
    var r;
    const o = t ?? {}, { api_version: i = this._client.apiVersion } = o, s = St(o, ["api_version"]);
    return this._client.get(Ge`/${i}/interactions/${e}`, Object.assign(Object.assign({ query: s }, n), { stream: (r = t?.stream) !== null && r !== void 0 ? r : !1 }));
  }
};
mh._key = Object.freeze(["interactions"]);
var gh = class extends mh {
}, _h = class extends oa {
  create(e, t) {
    const { api_version: n = this._client.apiVersion, webhook_id: r } = e, o = St(e, ["api_version", "webhook_id"]);
    return this._client.post(Ge`/${n}/webhooks`, Object.assign({
      query: { webhook_id: r },
      body: o
    }, t));
  }
  update(e, t, n) {
    const { api_version: r = this._client.apiVersion, update_mask: o } = t, i = St(t, ["api_version", "update_mask"]);
    return this._client.patch(Ge`/${r}/webhooks/${e}`, Object.assign({
      query: { update_mask: o },
      body: i
    }, n));
  }
  list(e = {}, t) {
    const n = e ?? {}, { api_version: r = this._client.apiVersion } = n, o = St(n, ["api_version"]);
    return this._client.get(Ge`/${r}/webhooks`, Object.assign({ query: o }, t));
  }
  delete(e, t = {}, n) {
    const { api_version: r = this._client.apiVersion } = t ?? {};
    return this._client.delete(Ge`/${r}/webhooks/${e}`, n);
  }
  get(e, t = {}, n) {
    const { api_version: r = this._client.apiVersion } = t ?? {};
    return this._client.get(Ge`/${r}/webhooks/${e}`, n);
  }
  ping(e, t = void 0, n) {
    const { api_version: r = this._client.apiVersion, body: o } = t ?? {};
    return this._client.post(Ge`/${r}/webhooks/${e}:ping`, Object.assign({ body: o }, n));
  }
  rotateSigningSecret(e, t = {}, n) {
    const r = t ?? {}, { api_version: o = this._client.apiVersion } = r, i = St(r, ["api_version"]);
    return this._client.post(Ge`/${o}/webhooks/${e}:rotateSigningSecret`, Object.assign({ body: i }, n));
  }
};
_h._key = Object.freeze(["webhooks"]);
var yh = class extends _h {
};
function pC(e) {
  let t = 0;
  for (const o of e) t += o.length;
  const n = new Uint8Array(t);
  let r = 0;
  for (const o of e)
    n.set(o, r), r += o.length;
  return n;
}
var Kr;
function ia(e) {
  let t;
  return (Kr ?? (t = new globalThis.TextEncoder(), Kr = t.encode.bind(t)))(e);
}
var Wr;
function lc(e) {
  let t;
  return (Wr ?? (t = new globalThis.TextDecoder(), Wr = t.decode.bind(t)))(e);
}
var Yo = class {
  constructor() {
    this.buffer = new Uint8Array(), this.carriageReturnIndex = null, this.searchIndex = 0;
  }
  decode(e) {
    var t;
    if (e == null) return [];
    const n = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? ia(e) : e;
    this.buffer = pC([this.buffer, n]);
    const r = [];
    let o;
    for (; (o = mC(this.buffer, (t = this.carriageReturnIndex) !== null && t !== void 0 ? t : this.searchIndex)) != null; ) {
      if (o.carriage && this.carriageReturnIndex == null) {
        this.carriageReturnIndex = o.index;
        continue;
      }
      if (this.carriageReturnIndex != null && (o.index !== this.carriageReturnIndex + 1 || o.carriage)) {
        r.push(lc(this.buffer.subarray(0, this.carriageReturnIndex - 1))), this.buffer = this.buffer.subarray(this.carriageReturnIndex), this.carriageReturnIndex = null, this.searchIndex = 0;
        continue;
      }
      const i = this.carriageReturnIndex !== null ? o.preceding - 1 : o.preceding, s = lc(this.buffer.subarray(0, i));
      r.push(s), this.buffer = this.buffer.subarray(o.index), this.carriageReturnIndex = null, this.searchIndex = 0;
    }
    return this.searchIndex = Math.max(0, this.buffer.length - 1), r;
  }
  flush() {
    return this.buffer.length ? this.decode(`
`) : [];
  }
};
Yo.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
Yo.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function mC(e, t) {
  const o = t ?? 0, i = e.indexOf(10, o), s = e.indexOf(13, o);
  if (i === -1 && s === -1) return null;
  let u;
  return i !== -1 && s !== -1 ? u = Math.min(i, s) : u = i !== -1 ? i : s, e[u] === 10 ? {
    preceding: u,
    index: u + 1,
    carriage: !1
  } : {
    preceding: u,
    index: u + 1,
    carriage: !0
  };
}
var Io = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
}, uc = (e, t, n) => {
  if (e) {
    if (QE(Io, e)) return e;
    pe(n).warn(`${t} was set to ${JSON.stringify(e)}, expected one of ${JSON.stringify(Object.keys(Io))}`);
  }
};
function Vn() {
}
function zr(e, t, n) {
  return !t || Io[e] > Io[n] ? Vn : t[e].bind(t);
}
var gC = {
  error: Vn,
  warn: Vn,
  info: Vn,
  debug: Vn
}, cc = /* @__PURE__ */ new WeakMap();
function pe(e) {
  var t;
  const n = e.logger, r = (t = e.logLevel) !== null && t !== void 0 ? t : "off";
  if (!n) return gC;
  const o = cc.get(n);
  if (o && o[0] === r) return o[1];
  const i = {
    error: zr("error", n, r),
    warn: zr("warn", n, r),
    info: zr("info", n, r),
    debug: zr("debug", n, r)
  };
  return cc.set(n, [r, i]), i;
}
var Nt = (e) => (e.options && (e.options = Object.assign({}, e.options), delete e.options.headers), e.headers && (e.headers = Object.fromEntries((e.headers instanceof Headers ? [...e.headers] : Object.entries(e.headers)).map(([t, n]) => [t, t.toLowerCase() === "x-goog-api-key" || t.toLowerCase() === "authorization" || t.toLowerCase() === "cookie" || t.toLowerCase() === "set-cookie" ? "***" : n]))), "retryOfRequestLogID" in e && (e.retryOfRequestLogID && (e.retryOf = e.retryOfRequestLogID), delete e.retryOfRequestLogID), e), _C = class Jn {
  constructor(t, n, r) {
    this.iterator = t, this.controller = n, this.client = r;
  }
  static fromSSEResponse(t, n, r) {
    let o = !1;
    const i = r ? pe(r) : console;
    function s() {
      return Je(this, arguments, function* () {
        var c, d, h, f;
        if (o) throw new De("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        o = !0;
        let p = !1;
        try {
          try {
            for (var m = !0, g = Ke(yC(t, n)), _; _ = yield q(g.next()), c = _.done, !c; m = !0) {
              f = _.value, m = !1;
              const y = f;
              if (!p)
                if (y.data.startsWith("[DONE]")) {
                  p = !0;
                  continue;
                } else try {
                  yield yield q(JSON.parse(y.data));
                } catch (E) {
                  throw i.error("Could not parse message into JSON:", y.data), i.error("From chunk:", y.raw), E;
                }
            }
          } catch (y) {
            d = { error: y };
          } finally {
            try {
              !m && !c && (h = g.return) && (yield q(h.call(g)));
            } finally {
              if (d) throw d.error;
            }
          }
          p = !0;
        } catch (y) {
          if (rs(y)) return yield q(void 0);
          throw y;
        } finally {
          p || n.abort();
        }
      });
    }
    return new Jn(s, n, r);
  }
  static fromReadableStream(t, n, r) {
    let o = !1;
    function i() {
      return Je(this, arguments, function* () {
        var c, d, h, f;
        const p = new Yo(), m = dh(t);
        try {
          for (var g = !0, _ = Ke(m), y; y = yield q(_.next()), c = y.done, !c; g = !0) {
            f = y.value, g = !1;
            const E = f;
            for (const A of p.decode(E)) yield yield q(A);
          }
        } catch (E) {
          d = { error: E };
        } finally {
          try {
            !g && !c && (h = _.return) && (yield q(h.call(_)));
          } finally {
            if (d) throw d.error;
          }
        }
        for (const E of p.flush()) yield yield q(E);
      });
    }
    function s() {
      return Je(this, arguments, function* () {
        var c, d, h, f;
        if (o) throw new De("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        o = !0;
        let p = !1;
        try {
          try {
            for (var m = !0, g = Ke(i()), _; _ = yield q(g.next()), c = _.done, !c; m = !0) {
              f = _.value, m = !1;
              const y = f;
              p || y && (yield yield q(JSON.parse(y)));
            }
          } catch (y) {
            d = { error: y };
          } finally {
            try {
              !m && !c && (h = g.return) && (yield q(h.call(g)));
            } finally {
              if (d) throw d.error;
            }
          }
          p = !0;
        } catch (y) {
          if (rs(y)) return yield q(void 0);
          throw y;
        } finally {
          p || n.abort();
        }
      });
    }
    return new Jn(s, n, r);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  tee() {
    const t = [], n = [], r = this.iterator(), o = (i) => ({ next: () => {
      if (i.length === 0) {
        const s = r.next();
        t.push(s), n.push(s);
      }
      return i.shift();
    } });
    return [new Jn(() => o(t), this.controller, this.client), new Jn(() => o(n), this.controller, this.client)];
  }
  toReadableStream() {
    const t = this;
    let n;
    return ch({
      async start() {
        n = t[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          const { value: o, done: i } = await n.next();
          if (i) return r.close();
          const s = ia(JSON.stringify(o) + `
`);
          r.enqueue(s);
        } catch (o) {
          r.error(o);
        }
      },
      async cancel() {
        var r;
        await ((r = n.return) === null || r === void 0 ? void 0 : r.call(n));
      }
    });
  }
};
function yC(e, t) {
  return Je(this, arguments, function* () {
    var r, o, i, s;
    if (!e.body)
      throw t.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new De("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new De("Attempted to iterate over a response with no body");
    const u = new AC(), c = new Yo(), d = dh(e.body);
    try {
      for (var h = !0, f = Ke(vC(d)), p; p = yield q(f.next()), r = p.done, !r; h = !0) {
        s = p.value, h = !1;
        const m = s;
        for (const g of c.decode(m)) {
          const _ = u.decode(g);
          _ && (yield yield q(_));
        }
      }
    } catch (m) {
      o = { error: m };
    } finally {
      try {
        !h && !r && (i = f.return) && (yield q(i.call(f)));
      } finally {
        if (o) throw o.error;
      }
    }
    for (const m of c.flush()) {
      const g = u.decode(m);
      g && (yield yield q(g));
    }
  });
}
function vC(e) {
  return Je(this, arguments, function* () {
    var n, r, o, i;
    try {
      for (var s = !0, u = Ke(e), c; c = yield q(u.next()), n = c.done, !n; s = !0) {
        i = c.value, s = !1;
        const d = i;
        d != null && (yield yield q(d instanceof ArrayBuffer ? new Uint8Array(d) : typeof d == "string" ? ia(d) : d));
      }
    } catch (d) {
      r = { error: d };
    } finally {
      try {
        !s && !n && (o = u.return) && (yield q(o.call(u)));
      } finally {
        if (r) throw r.error;
      }
    }
  });
}
var AC = class {
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length) return null;
      const o = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], o;
    }
    if (this.chunks.push(e), e.startsWith(":")) return null;
    let [t, n, r] = TC(e, ":");
    return r.startsWith(" ") && (r = r.substring(1)), t === "event" ? this.event = r : t === "data" && this.data.push(r), null;
  }
};
function TC(e, t) {
  const n = e.indexOf(t);
  return n !== -1 ? [
    e.substring(0, n),
    t,
    e.substring(n + t.length)
  ] : [
    e,
    "",
    ""
  ];
}
async function SC(e, t) {
  const { response: n, requestLogID: r, retryOfRequestLogID: o, startTime: i } = t, s = await (async () => {
    var u;
    if (t.options.stream)
      return pe(e).debug("response", n.status, n.url, n.headers, n.body), t.options.__streamClass ? t.options.__streamClass.fromSSEResponse(n, t.controller, e) : _C.fromSSEResponse(n, t.controller, e);
    if (n.status === 204) return null;
    if (t.options.__binaryResponse) return n;
    const c = n.headers.get("content-type"), d = (u = c?.split(";")[0]) === null || u === void 0 ? void 0 : u.trim();
    return d?.includes("application/json") || d?.endsWith("+json") ? n.headers.get("content-length") === "0" ? void 0 : await n.json() : await n.text();
  })();
  return pe(e).debug(`[${r}] response parsed`, Nt({
    retryOfRequestLogID: o,
    url: n.url,
    status: n.status,
    body: s,
    durationMs: Date.now() - i
  })), s;
}
var EC = class vh extends Promise {
  constructor(t, n, r = SC) {
    super((o) => {
      o(null);
    }), this.responsePromise = n, this.parseResponse = r, this.client = t;
  }
  _thenUnwrap(t) {
    return new vh(this.client, this.responsePromise, async (n, r) => t(await this.parseResponse(n, r), r));
  }
  asResponse() {
    return this.responsePromise.then((t) => t.response);
  }
  async withResponse() {
    const [t, n] = await Promise.all([this.parse(), this.asResponse()]);
    return {
      data: t,
      response: n
    };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then((t) => this.parseResponse(this.client, t))), this.parsedPromise;
  }
  then(t, n) {
    return this.parse().then(t, n);
  }
  catch(t) {
    return this.parse().catch(t);
  }
  finally(t) {
    return this.parse().finally(t);
  }
}, Ah = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
function* CC(e) {
  if (!e) return;
  if (Ah in e) {
    const { values: r, nulls: o } = e;
    yield* r.entries();
    for (const i of o) yield [i, null];
    return;
  }
  let t = !1, n;
  e instanceof Headers ? n = e.entries() : ic(e) ? n = e : (t = !0, n = Object.entries(e ?? {}));
  for (let r of n) {
    const o = r[0];
    if (typeof o != "string") throw new TypeError("expected header name to be a string");
    const i = ic(r[1]) ? r[1] : [r[1]];
    let s = !1;
    for (const u of i)
      u !== void 0 && (t && !s && (s = !0, yield [o, null]), yield [o, u]);
  }
}
var Ln = (e) => {
  const t = new Headers(), n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const [i, s] of CC(r)) {
      const u = i.toLowerCase();
      o.has(u) || (t.delete(i), o.add(u)), s === null ? (t.delete(i), n.add(u)) : (t.append(i, s), n.delete(u));
    }
  }
  return {
    [Ah]: !0,
    values: t,
    nulls: n
  };
}, Si = (e) => {
  var t, n, r, o, i;
  if (typeof globalThis.process < "u") return ((n = (t = globalThis.process.env) === null || t === void 0 ? void 0 : t[e]) === null || n === void 0 ? void 0 : n.trim()) || void 0;
  if (typeof globalThis.Deno < "u") return ((i = (o = (r = globalThis.Deno.env) === null || r === void 0 ? void 0 : r.get) === null || o === void 0 ? void 0 : o.call(r, e)) === null || i === void 0 ? void 0 : i.trim()) || void 0;
}, Th, Sh = class Eh {
  constructor(t) {
    var n, r, o, i, s, u, c, { baseURL: d = Si("GEMINI_NEXT_GEN_API_BASE_URL"), apiKey: h = (n = Si("GEMINI_API_KEY")) !== null && n !== void 0 ? n : null, apiVersion: f = "v1beta" } = t, p = St(t, [
      "baseURL",
      "apiKey",
      "apiVersion"
    ]);
    const m = Object.assign(Object.assign({
      apiKey: h,
      apiVersion: f
    }, p), { baseURL: d || "https://generativelanguage.googleapis.com" });
    this.baseURL = m.baseURL, this.timeout = (r = m.timeout) !== null && r !== void 0 ? r : Eh.DEFAULT_TIMEOUT, this.logger = (o = m.logger) !== null && o !== void 0 ? o : console;
    const g = "warn";
    this.logLevel = g, this.logLevel = (s = (i = uc(m.logLevel, "ClientOptions.logLevel", this)) !== null && i !== void 0 ? i : uc(Si("GEMINI_NEXT_GEN_API_LOG"), "process.env['GEMINI_NEXT_GEN_API_LOG']", this)) !== null && s !== void 0 ? s : g, this.fetchOptions = m.fetchOptions, this.maxRetries = (u = m.maxRetries) !== null && u !== void 0 ? u : 2, this.fetch = (c = m.fetch) !== null && c !== void 0 ? c : tC(), this.encoder = oC, this._options = m, this.apiKey = h, this.apiVersion = f, this.clientAdapter = m.clientAdapter;
  }
  withOptions(t) {
    return new this.constructor(Object.assign(Object.assign(Object.assign({}, this._options), {
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      apiVersion: this.apiVersion
    }), t));
  }
  baseURLOverridden() {
    return this.baseURL !== "https://generativelanguage.googleapis.com";
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values: t, nulls: n }) {
    if (!(t.has("authorization") || t.has("x-goog-api-key")) && !(this.apiKey && t.get("x-goog-api-key")) && !n.has("x-goog-api-key"))
      throw new Error('Could not resolve authentication method. Expected the apiKey to be set. Or for the "x-goog-api-key" headers to be explicitly omitted');
  }
  async authHeaders(t) {
    const n = Ln([t.headers]);
    if (!(n.values.has("authorization") || n.values.has("x-goog-api-key"))) {
      if (this.apiKey) return Ln([{ "x-goog-api-key": this.apiKey }]);
      if (this.clientAdapter && this.clientAdapter.isVertexAI()) return Ln([await this.clientAdapter.getAuthHeaders()]);
    }
  }
  stringifyQuery(t) {
    return iC(t);
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${sC}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${zE()}`;
  }
  makeStatusError(t, n, r, o) {
    return Le.generate(t, n, r, o);
  }
  buildURL(t, n, r) {
    const o = !this.baseURLOverridden() && r || this.baseURL, i = XE(t) ? new URL(t) : new URL(o + (o.endsWith("/") && t.startsWith("/") ? t.slice(1) : t)), s = this.defaultQuery(), u = Object.fromEntries(i.searchParams);
    return (!sc(s) || !sc(u)) && (n = Object.assign(Object.assign(Object.assign({}, u), s), n)), typeof n == "object" && n && !Array.isArray(n) && (i.search = this.stringifyQuery(n)), i.toString();
  }
  async prepareOptions(t) {
    if (this.clientAdapter && this.clientAdapter.isVertexAI() && !t.path.startsWith(`/${this.apiVersion}/projects/`)) {
      const n = t.path.slice(this.apiVersion.length + 1);
      t.path = `/${this.apiVersion}/projects/${this.clientAdapter.getProject()}/locations/${this.clientAdapter.getLocation()}${n}`;
    }
  }
  async prepareRequest(t, { url: n, options: r }) {
  }
  get(t, n) {
    return this.methodRequest("get", t, n);
  }
  post(t, n) {
    return this.methodRequest("post", t, n);
  }
  patch(t, n) {
    return this.methodRequest("patch", t, n);
  }
  put(t, n) {
    return this.methodRequest("put", t, n);
  }
  delete(t, n) {
    return this.methodRequest("delete", t, n);
  }
  methodRequest(t, n, r) {
    return this.request(Promise.resolve(r).then((o) => Object.assign({
      method: t,
      path: n
    }, o)));
  }
  request(t, n = null) {
    return new EC(this, this.makeRequest(t, n, void 0));
  }
  async makeRequest(t, n, r) {
    var o, i, s;
    const u = await t, c = (o = u.maxRetries) !== null && o !== void 0 ? o : this.maxRetries;
    n == null && (n = c), await this.prepareOptions(u);
    const { req: d, url: h, timeout: f } = await this.buildRequest(u, { retryCount: c - n });
    await this.prepareRequest(d, {
      url: h,
      options: u
    });
    const p = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0"), m = r === void 0 ? "" : `, retryOf: ${r}`, g = Date.now();
    if (pe(this).debug(`[${p}] sending request`, Nt({
      retryOfRequestLogID: r,
      method: u.method,
      url: h,
      options: u,
      headers: d.headers
    })), !((i = u.signal) === null || i === void 0) && i.aborted) throw new ss();
    const _ = new AbortController(), y = await this.fetchWithTimeout(h, d, f, _).catch(os), E = Date.now();
    if (y instanceof globalThis.Error) {
      const w = `retrying, ${n} attempts remaining`;
      if (!((s = u.signal) === null || s === void 0) && s.aborted) throw new ss();
      const P = rs(y) || /timed? ?out/i.test(String(y) + ("cause" in y ? String(y.cause) : ""));
      if (n)
        return pe(this).info(`[${p}] connection ${P ? "timed out" : "failed"} - ${w}`), pe(this).debug(`[${p}] connection ${P ? "timed out" : "failed"} (${w})`, Nt({
          retryOfRequestLogID: r,
          url: h,
          durationMs: E - g,
          message: y.message
        })), this.retryRequest(u, n, r ?? p);
      throw pe(this).info(`[${p}] connection ${P ? "timed out" : "failed"} - error; no more retries left`), pe(this).debug(`[${p}] connection ${P ? "timed out" : "failed"} (error; no more retries left)`, Nt({
        retryOfRequestLogID: r,
        url: h,
        durationMs: E - g,
        message: y.message
      })), P ? new th() : new zo({ cause: y });
    }
    const A = `[${p}${m}] ${d.method} ${h} ${y.ok ? "succeeded" : "failed"} with status ${y.status} in ${E - g}ms`;
    if (!y.ok) {
      const w = await this.shouldRetry(y);
      if (n && w) {
        const I = `retrying, ${n} attempts remaining`;
        return await rC(y.body), pe(this).info(`${A} - ${I}`), pe(this).debug(`[${p}] response error (${I})`, Nt({
          retryOfRequestLogID: r,
          url: y.url,
          status: y.status,
          headers: y.headers,
          durationMs: E - g
        })), this.retryRequest(u, n, r ?? p, y.headers);
      }
      const P = w ? "error; no more retries left" : "error; not retryable";
      pe(this).info(`${A} - ${P}`);
      const L = await y.text().catch((I) => os(I).message), C = jE(L), k = C ? void 0 : L;
      throw pe(this).debug(`[${p}] response error (${P})`, Nt({
        retryOfRequestLogID: r,
        url: y.url,
        status: y.status,
        headers: y.headers,
        message: k,
        durationMs: Date.now() - g
      })), this.makeStatusError(y.status, C, k, y.headers);
    }
    return pe(this).info(A), pe(this).debug(`[${p}] response start`, Nt({
      retryOfRequestLogID: r,
      url: y.url,
      status: y.status,
      headers: y.headers,
      durationMs: E - g
    })), {
      response: y,
      options: u,
      controller: _,
      requestLogID: p,
      retryOfRequestLogID: r,
      startTime: g
    };
  }
  async fetchWithTimeout(t, n, r, o) {
    const i = n || {}, { signal: s, method: u } = i, c = St(i, ["signal", "method"]), d = this._makeAbort(o);
    s && s.addEventListener("abort", d, { once: !0 });
    const h = setTimeout(d, r), f = globalThis.ReadableStream && c.body instanceof globalThis.ReadableStream || typeof c.body == "object" && c.body !== null && Symbol.asyncIterator in c.body, p = Object.assign(Object.assign(Object.assign({ signal: o.signal }, f ? { duplex: "half" } : {}), { method: "GET" }), c);
    u && (p.method = u.toUpperCase());
    try {
      return await this.fetch.call(void 0, t, p);
    } finally {
      clearTimeout(h);
    }
  }
  async shouldRetry(t) {
    const n = t.headers.get("x-should-retry");
    return n === "true" ? !0 : n === "false" ? !1 : t.status === 408 || t.status === 409 || t.status === 429 || t.status >= 500;
  }
  async retryRequest(t, n, r, o) {
    var i;
    let s;
    const u = o?.get("retry-after-ms");
    if (u) {
      const d = parseFloat(u);
      Number.isNaN(d) || (s = d);
    }
    const c = o?.get("retry-after");
    if (c && !s) {
      const d = parseFloat(c);
      Number.isNaN(d) ? s = Date.parse(c) - Date.now() : s = d * 1e3;
    }
    if (s === void 0) {
      const d = (i = t.maxRetries) !== null && i !== void 0 ? i : this.maxRetries;
      s = this.calculateDefaultRetryTimeoutMillis(n, d);
    }
    return await eC(s), this.makeRequest(t, n - 1, r);
  }
  calculateDefaultRetryTimeoutMillis(t, n) {
    const i = n - t;
    return Math.min(0.5 * Math.pow(2, i), 8) * (1 - Math.random() * 0.25) * 1e3;
  }
  async buildRequest(t, { retryCount: n = 0 } = {}) {
    var r, o, i;
    const s = Object.assign({}, t), { method: u, path: c, query: d, defaultBaseURL: h } = s, f = this.buildURL(c, d, h);
    "timeout" in s && ZE("timeout", s.timeout), s.timeout = (r = s.timeout) !== null && r !== void 0 ? r : this.timeout;
    const { bodyHeaders: p, body: m } = this.buildBody({ options: s }), g = await this.buildHeaders({
      options: t,
      method: u,
      bodyHeaders: p,
      retryCount: n
    });
    return {
      req: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
        method: u,
        headers: g
      }, s.signal && { signal: s.signal }), globalThis.ReadableStream && m instanceof globalThis.ReadableStream && { duplex: "half" }), m && { body: m }), (o = this.fetchOptions) !== null && o !== void 0 ? o : {}), (i = s.fetchOptions) !== null && i !== void 0 ? i : {}),
      url: f,
      timeout: s.timeout
    };
  }
  async buildHeaders({ options: t, method: n, bodyHeaders: r, retryCount: o }) {
    let i = {};
    this.idempotencyHeader && n !== "get" && (t.idempotencyKey || (t.idempotencyKey = this.defaultIdempotencyKey()), i[this.idempotencyHeader] = t.idempotencyKey);
    const s = await this.authHeaders(t);
    let u = Ln([
      i,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent()
      },
      this._options.defaultHeaders,
      r,
      t.headers,
      s
    ]);
    return this.validateHeaders(u), u.values;
  }
  _makeAbort(t) {
    return () => t.abort();
  }
  buildBody({ options: { body: t, headers: n } }) {
    if (!t) return {
      bodyHeaders: void 0,
      body: void 0
    };
    const r = Ln([n]);
    return ArrayBuffer.isView(t) || t instanceof ArrayBuffer || t instanceof DataView || typeof t == "string" && r.values.has("content-type") || globalThis.Blob && t instanceof globalThis.Blob || t instanceof FormData || t instanceof URLSearchParams || globalThis.ReadableStream && t instanceof globalThis.ReadableStream ? {
      bodyHeaders: void 0,
      body: t
    } : typeof t == "object" && (Symbol.asyncIterator in t || Symbol.iterator in t && "next" in t && typeof t.next == "function") ? {
      bodyHeaders: void 0,
      body: nC(t)
    } : typeof t == "object" && r.values.get("content-type") === "application/x-www-form-urlencoded" ? {
      bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
      body: this.stringifyQuery(t)
    } : this.encoder({
      body: t,
      headers: r
    });
  }
};
Sh.DEFAULT_TIMEOUT = 6e4;
var oe = class extends Sh {
  constructor() {
    super(...arguments), this.interactions = new gh(this), this.webhooks = new yh(this);
  }
};
Th = oe;
oe.GeminiNextGenAPIClient = Th;
oe.GeminiNextGenAPIClientError = De;
oe.APIError = Le;
oe.APIConnectionError = zo;
oe.APIConnectionTimeoutError = th;
oe.APIUserAbortError = ss;
oe.NotFoundError = ih;
oe.ConflictError = sh;
oe.RateLimitError = lh;
oe.BadRequestError = nh;
oe.AuthenticationError = rh;
oe.InternalServerError = uh;
oe.PermissionDeniedError = oh;
oe.UnprocessableEntityError = ah;
oe.toFile = dC;
oe.Interactions = gh;
oe.Webhooks = yh;
function wC(e, t) {
  const n = {}, r = a(e, ["name"]);
  return r != null && l(n, ["_url", "name"], r), n;
}
function IC(e, t) {
  const n = {}, r = a(e, ["name"]);
  return r != null && l(n, ["_url", "name"], r), n;
}
function bC(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  return r != null && l(n, ["sdkHttpResponse"], r), n;
}
function RC(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  return r != null && l(n, ["sdkHttpResponse"], r), n;
}
function PC(e, t, n) {
  const r = {};
  if (a(e, ["validationDataset"]) !== void 0) throw new Error("validationDataset parameter is not supported in Gemini API.");
  const o = a(e, ["tunedModelDisplayName"]);
  if (t !== void 0 && o != null && l(t, ["displayName"], o), a(e, ["description"]) !== void 0) throw new Error("description parameter is not supported in Gemini API.");
  const i = a(e, ["epochCount"]);
  t !== void 0 && i != null && l(t, [
    "tuningTask",
    "hyperparameters",
    "epochCount"
  ], i);
  const s = a(e, ["learningRateMultiplier"]);
  if (s != null && l(r, [
    "tuningTask",
    "hyperparameters",
    "learningRateMultiplier"
  ], s), a(e, ["exportLastCheckpointOnly"]) !== void 0) throw new Error("exportLastCheckpointOnly parameter is not supported in Gemini API.");
  if (a(e, ["preTunedModelCheckpointId"]) !== void 0) throw new Error("preTunedModelCheckpointId parameter is not supported in Gemini API.");
  if (a(e, ["adapterSize"]) !== void 0) throw new Error("adapterSize parameter is not supported in Gemini API.");
  if (a(e, ["tuningMode"]) !== void 0) throw new Error("tuningMode parameter is not supported in Gemini API.");
  if (a(e, ["customBaseModel"]) !== void 0) throw new Error("customBaseModel parameter is not supported in Gemini API.");
  const u = a(e, ["batchSize"]);
  t !== void 0 && u != null && l(t, [
    "tuningTask",
    "hyperparameters",
    "batchSize"
  ], u);
  const c = a(e, ["learningRate"]);
  if (t !== void 0 && c != null && l(t, [
    "tuningTask",
    "hyperparameters",
    "learningRate"
  ], c), a(e, ["labels"]) !== void 0) throw new Error("labels parameter is not supported in Gemini API.");
  if (a(e, ["beta"]) !== void 0) throw new Error("beta parameter is not supported in Gemini API.");
  if (a(e, ["baseTeacherModel"]) !== void 0) throw new Error("baseTeacherModel parameter is not supported in Gemini API.");
  if (a(e, ["tunedTeacherModelSource"]) !== void 0) throw new Error("tunedTeacherModelSource parameter is not supported in Gemini API.");
  if (a(e, ["sftLossWeightMultiplier"]) !== void 0) throw new Error("sftLossWeightMultiplier parameter is not supported in Gemini API.");
  if (a(e, ["outputUri"]) !== void 0) throw new Error("outputUri parameter is not supported in Gemini API.");
  if (a(e, ["encryptionSpec"]) !== void 0) throw new Error("encryptionSpec parameter is not supported in Gemini API.");
  return r;
}
function MC(e, t, n) {
  const r = {};
  let o = a(n, ["config", "method"]);
  if (o === void 0 && (o = "SUPERVISED_FINE_TUNING"), o === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["validationDataset"]);
    t !== void 0 && C != null && l(t, ["supervisedTuningSpec"], Ei(C));
  } else if (o === "PREFERENCE_TUNING") {
    const C = a(e, ["validationDataset"]);
    t !== void 0 && C != null && l(t, ["preferenceOptimizationSpec"], Ei(C));
  } else if (o === "DISTILLATION") {
    const C = a(e, ["validationDataset"]);
    t !== void 0 && C != null && l(t, ["distillationSpec"], Ei(C));
  }
  const i = a(e, ["tunedModelDisplayName"]);
  t !== void 0 && i != null && l(t, ["tunedModelDisplayName"], i);
  const s = a(e, ["description"]);
  t !== void 0 && s != null && l(t, ["description"], s);
  let u = a(n, ["config", "method"]);
  if (u === void 0 && (u = "SUPERVISED_FINE_TUNING"), u === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["epochCount"]);
    t !== void 0 && C != null && l(t, [
      "supervisedTuningSpec",
      "hyperParameters",
      "epochCount"
    ], C);
  } else if (u === "PREFERENCE_TUNING") {
    const C = a(e, ["epochCount"]);
    t !== void 0 && C != null && l(t, [
      "preferenceOptimizationSpec",
      "hyperParameters",
      "epochCount"
    ], C);
  } else if (u === "DISTILLATION") {
    const C = a(e, ["epochCount"]);
    t !== void 0 && C != null && l(t, [
      "distillationSpec",
      "hyperParameters",
      "epochCount"
    ], C);
  }
  let c = a(n, ["config", "method"]);
  if (c === void 0 && (c = "SUPERVISED_FINE_TUNING"), c === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["learningRateMultiplier"]);
    t !== void 0 && C != null && l(t, [
      "supervisedTuningSpec",
      "hyperParameters",
      "learningRateMultiplier"
    ], C);
  } else if (c === "PREFERENCE_TUNING") {
    const C = a(e, ["learningRateMultiplier"]);
    t !== void 0 && C != null && l(t, [
      "preferenceOptimizationSpec",
      "hyperParameters",
      "learningRateMultiplier"
    ], C);
  } else if (c === "DISTILLATION") {
    const C = a(e, ["learningRateMultiplier"]);
    t !== void 0 && C != null && l(t, [
      "distillationSpec",
      "hyperParameters",
      "learningRateMultiplier"
    ], C);
  }
  let d = a(n, ["config", "method"]);
  if (d === void 0 && (d = "SUPERVISED_FINE_TUNING"), d === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["exportLastCheckpointOnly"]);
    t !== void 0 && C != null && l(t, ["supervisedTuningSpec", "exportLastCheckpointOnly"], C);
  } else if (d === "PREFERENCE_TUNING") {
    const C = a(e, ["exportLastCheckpointOnly"]);
    t !== void 0 && C != null && l(t, ["preferenceOptimizationSpec", "exportLastCheckpointOnly"], C);
  } else if (d === "DISTILLATION") {
    const C = a(e, ["exportLastCheckpointOnly"]);
    t !== void 0 && C != null && l(t, ["distillationSpec", "exportLastCheckpointOnly"], C);
  }
  let h = a(n, ["config", "method"]);
  if (h === void 0 && (h = "SUPERVISED_FINE_TUNING"), h === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["adapterSize"]);
    t !== void 0 && C != null && l(t, [
      "supervisedTuningSpec",
      "hyperParameters",
      "adapterSize"
    ], C);
  } else if (h === "PREFERENCE_TUNING") {
    const C = a(e, ["adapterSize"]);
    t !== void 0 && C != null && l(t, [
      "preferenceOptimizationSpec",
      "hyperParameters",
      "adapterSize"
    ], C);
  } else if (h === "DISTILLATION") {
    const C = a(e, ["adapterSize"]);
    t !== void 0 && C != null && l(t, [
      "distillationSpec",
      "hyperParameters",
      "adapterSize"
    ], C);
  }
  let f = a(n, ["config", "method"]);
  if (f === void 0 && (f = "SUPERVISED_FINE_TUNING"), f === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["tuningMode"]);
    t !== void 0 && C != null && l(t, ["supervisedTuningSpec", "tuningMode"], C);
  } else if (f === "DISTILLATION") {
    const C = a(e, ["tuningMode"]);
    t !== void 0 && C != null && l(t, ["distillationSpec", "tuningMode"], C);
  }
  const p = a(e, ["customBaseModel"]);
  t !== void 0 && p != null && l(t, ["customBaseModel"], p);
  let m = a(n, ["config", "method"]);
  if (m === void 0 && (m = "SUPERVISED_FINE_TUNING"), m === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["batchSize"]);
    t !== void 0 && C != null && l(t, [
      "supervisedTuningSpec",
      "hyperParameters",
      "batchSize"
    ], C);
  } else if (m === "DISTILLATION") {
    const C = a(e, ["batchSize"]);
    t !== void 0 && C != null && l(t, [
      "distillationSpec",
      "hyperParameters",
      "batchSize"
    ], C);
  }
  let g = a(n, ["config", "method"]);
  if (g === void 0 && (g = "SUPERVISED_FINE_TUNING"), g === "SUPERVISED_FINE_TUNING") {
    const C = a(e, ["learningRate"]);
    t !== void 0 && C != null && l(t, [
      "supervisedTuningSpec",
      "hyperParameters",
      "learningRate"
    ], C);
  } else if (g === "DISTILLATION") {
    const C = a(e, ["learningRate"]);
    t !== void 0 && C != null && l(t, [
      "distillationSpec",
      "hyperParameters",
      "learningRate"
    ], C);
  }
  const _ = a(e, ["labels"]);
  t !== void 0 && _ != null && l(t, ["labels"], _);
  const y = a(e, ["beta"]);
  t !== void 0 && y != null && l(t, [
    "preferenceOptimizationSpec",
    "hyperParameters",
    "beta"
  ], y);
  const E = a(e, ["baseTeacherModel"]);
  t !== void 0 && E != null && l(t, ["distillationSpec", "baseTeacherModel"], E);
  const A = a(e, ["tunedTeacherModelSource"]);
  t !== void 0 && A != null && l(t, ["distillationSpec", "tunedTeacherModelSource"], A);
  const w = a(e, ["sftLossWeightMultiplier"]);
  t !== void 0 && w != null && l(t, [
    "distillationSpec",
    "hyperParameters",
    "sftLossWeightMultiplier"
  ], w);
  const P = a(e, ["outputUri"]);
  t !== void 0 && P != null && l(t, ["outputUri"], P);
  const L = a(e, ["encryptionSpec"]);
  return t !== void 0 && L != null && l(t, ["encryptionSpec"], L), r;
}
function xC(e, t) {
  const n = {}, r = a(e, ["baseModel"]);
  r != null && l(n, ["baseModel"], r);
  const o = a(e, ["preTunedModel"]);
  o != null && l(n, ["preTunedModel"], o);
  const i = a(e, ["trainingDataset"]);
  i != null && qC(i);
  const s = a(e, ["config"]);
  return s != null && PC(s, n), n;
}
function NC(e, t) {
  const n = {}, r = a(e, ["baseModel"]);
  r != null && l(n, ["baseModel"], r);
  const o = a(e, ["preTunedModel"]);
  o != null && l(n, ["preTunedModel"], o);
  const i = a(e, ["trainingDataset"]);
  i != null && HC(i, n, t);
  const s = a(e, ["config"]);
  return s != null && MC(s, n, t), n;
}
function kC(e, t) {
  const n = {}, r = a(e, ["name"]);
  return r != null && l(n, ["_url", "name"], r), n;
}
function DC(e, t) {
  const n = {}, r = a(e, ["name"]);
  return r != null && l(n, ["_url", "name"], r), n;
}
function $C(e, t, n) {
  const r = {}, o = a(e, ["pageSize"]);
  t !== void 0 && o != null && l(t, ["_query", "pageSize"], o);
  const i = a(e, ["pageToken"]);
  t !== void 0 && i != null && l(t, ["_query", "pageToken"], i);
  const s = a(e, ["filter"]);
  return t !== void 0 && s != null && l(t, ["_query", "filter"], s), r;
}
function LC(e, t, n) {
  const r = {}, o = a(e, ["pageSize"]);
  t !== void 0 && o != null && l(t, ["_query", "pageSize"], o);
  const i = a(e, ["pageToken"]);
  t !== void 0 && i != null && l(t, ["_query", "pageToken"], i);
  const s = a(e, ["filter"]);
  return t !== void 0 && s != null && l(t, ["_query", "filter"], s), r;
}
function UC(e, t) {
  const n = {}, r = a(e, ["config"]);
  return r != null && $C(r, n), n;
}
function FC(e, t) {
  const n = {}, r = a(e, ["config"]);
  return r != null && LC(r, n), n;
}
function OC(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["nextPageToken"]);
  o != null && l(n, ["nextPageToken"], o);
  const i = a(e, ["tunedModels"]);
  if (i != null) {
    let s = i;
    Array.isArray(s) && (s = s.map((u) => Ch(u))), l(n, ["tuningJobs"], s);
  }
  return n;
}
function GC(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["nextPageToken"]);
  o != null && l(n, ["nextPageToken"], o);
  const i = a(e, ["tuningJobs"]);
  if (i != null) {
    let s = i;
    Array.isArray(s) && (s = s.map((u) => us(u))), l(n, ["tuningJobs"], s);
  }
  return n;
}
function BC(e, t) {
  const n = {}, r = a(e, ["name"]);
  r != null && l(n, ["model"], r);
  const o = a(e, ["name"]);
  return o != null && l(n, ["endpoint"], o), n;
}
function qC(e, t) {
  const n = {};
  if (a(e, ["gcsUri"]) !== void 0) throw new Error("gcsUri parameter is not supported in Gemini API.");
  if (a(e, ["vertexDatasetResource"]) !== void 0) throw new Error("vertexDatasetResource parameter is not supported in Gemini API.");
  const r = a(e, ["examples"]);
  if (r != null) {
    let o = r;
    Array.isArray(o) && (o = o.map((i) => i)), l(n, ["examples", "examples"], o);
  }
  return n;
}
function HC(e, t, n) {
  const r = {};
  let o = a(n, ["config", "method"]);
  if (o === void 0 && (o = "SUPERVISED_FINE_TUNING"), o === "SUPERVISED_FINE_TUNING") {
    const s = a(e, ["gcsUri"]);
    t !== void 0 && s != null && l(t, ["supervisedTuningSpec", "trainingDatasetUri"], s);
  } else if (o === "PREFERENCE_TUNING") {
    const s = a(e, ["gcsUri"]);
    t !== void 0 && s != null && l(t, ["preferenceOptimizationSpec", "trainingDatasetUri"], s);
  } else if (o === "DISTILLATION") {
    const s = a(e, ["gcsUri"]);
    t !== void 0 && s != null && l(t, ["distillationSpec", "promptDatasetUri"], s);
  }
  let i = a(n, ["config", "method"]);
  if (i === void 0 && (i = "SUPERVISED_FINE_TUNING"), i === "SUPERVISED_FINE_TUNING") {
    const s = a(e, ["vertexDatasetResource"]);
    t !== void 0 && s != null && l(t, ["supervisedTuningSpec", "trainingDatasetUri"], s);
  } else if (i === "PREFERENCE_TUNING") {
    const s = a(e, ["vertexDatasetResource"]);
    t !== void 0 && s != null && l(t, ["preferenceOptimizationSpec", "trainingDatasetUri"], s);
  } else if (i === "DISTILLATION") {
    const s = a(e, ["vertexDatasetResource"]);
    t !== void 0 && s != null && l(t, ["distillationSpec", "promptDatasetUri"], s);
  }
  if (a(e, ["examples"]) !== void 0) throw new Error("examples parameter is not supported in Vertex AI.");
  return r;
}
function Ch(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["name"]);
  o != null && l(n, ["name"], o);
  const i = a(e, ["state"]);
  i != null && l(n, ["state"], kf(i));
  const s = a(e, ["createTime"]);
  s != null && l(n, ["createTime"], s);
  const u = a(e, ["tuningTask", "startTime"]);
  u != null && l(n, ["startTime"], u);
  const c = a(e, ["tuningTask", "completeTime"]);
  c != null && l(n, ["endTime"], c);
  const d = a(e, ["updateTime"]);
  d != null && l(n, ["updateTime"], d);
  const h = a(e, ["description"]);
  h != null && l(n, ["description"], h);
  const f = a(e, ["baseModel"]);
  f != null && l(n, ["baseModel"], f);
  const p = a(e, ["_self"]);
  return p != null && l(n, ["tunedModel"], BC(p)), n;
}
function us(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["name"]);
  o != null && l(n, ["name"], o);
  const i = a(e, ["state"]);
  i != null && l(n, ["state"], kf(i));
  const s = a(e, ["createTime"]);
  s != null && l(n, ["createTime"], s);
  const u = a(e, ["startTime"]);
  u != null && l(n, ["startTime"], u);
  const c = a(e, ["endTime"]);
  c != null && l(n, ["endTime"], c);
  const d = a(e, ["updateTime"]);
  d != null && l(n, ["updateTime"], d);
  const h = a(e, ["error"]);
  h != null && l(n, ["error"], h);
  const f = a(e, ["description"]);
  f != null && l(n, ["description"], f);
  const p = a(e, ["baseModel"]);
  p != null && l(n, ["baseModel"], p);
  const m = a(e, ["tunedModel"]);
  m != null && l(n, ["tunedModel"], m);
  const g = a(e, ["preTunedModel"]);
  g != null && l(n, ["preTunedModel"], g);
  const _ = a(e, ["supervisedTuningSpec"]);
  _ != null && l(n, ["supervisedTuningSpec"], _);
  const y = a(e, ["preferenceOptimizationSpec"]);
  y != null && l(n, ["preferenceOptimizationSpec"], y);
  const E = a(e, ["distillationSpec"]);
  E != null && l(n, ["distillationSpec"], E);
  const A = a(e, ["tuningDataStats"]);
  A != null && l(n, ["tuningDataStats"], A);
  const w = a(e, ["encryptionSpec"]);
  w != null && l(n, ["encryptionSpec"], w);
  const P = a(e, ["partnerModelTuningSpec"]);
  P != null && l(n, ["partnerModelTuningSpec"], P);
  const L = a(e, ["customBaseModel"]);
  L != null && l(n, ["customBaseModel"], L);
  const C = a(e, ["evaluateDatasetRuns"]);
  if (C != null) {
    let Ue = C;
    Array.isArray(Ue) && (Ue = Ue.map((Fe) => Fe)), l(n, ["evaluateDatasetRuns"], Ue);
  }
  const k = a(e, ["experiment"]);
  k != null && l(n, ["experiment"], k);
  const I = a(e, ["fullFineTuningSpec"]);
  I != null && l(n, ["fullFineTuningSpec"], I);
  const x = a(e, ["labels"]);
  x != null && l(n, ["labels"], x);
  const b = a(e, ["outputUri"]);
  b != null && l(n, ["outputUri"], b);
  const F = a(e, ["pipelineJob"]);
  F != null && l(n, ["pipelineJob"], F);
  const X = a(e, ["serviceAccount"]);
  X != null && l(n, ["serviceAccount"], X);
  const J = a(e, ["tunedModelDisplayName"]);
  J != null && l(n, ["tunedModelDisplayName"], J);
  const V = a(e, ["tuningJobState"]);
  V != null && l(n, ["tuningJobState"], V);
  const W = a(e, ["veoTuningSpec"]);
  W != null && l(n, ["veoTuningSpec"], W);
  const ge = a(e, ["distillationSamplingSpec"]);
  ge != null && l(n, ["distillationSamplingSpec"], ge);
  const ze = a(e, ["tuningJobMetadata"]);
  return ze != null && l(n, ["tuningJobMetadata"], ze), n;
}
function VC(e, t) {
  const n = {}, r = a(e, ["sdkHttpResponse"]);
  r != null && l(n, ["sdkHttpResponse"], r);
  const o = a(e, ["name"]);
  o != null && l(n, ["name"], o);
  const i = a(e, ["metadata"]);
  i != null && l(n, ["metadata"], i);
  const s = a(e, ["done"]);
  s != null && l(n, ["done"], s);
  const u = a(e, ["error"]);
  return u != null && l(n, ["error"], u), n;
}
function Ei(e, t) {
  const n = {}, r = a(e, ["gcsUri"]);
  r != null && l(n, ["validationDatasetUri"], r);
  const o = a(e, ["vertexDatasetResource"]);
  return o != null && l(n, ["validationDatasetUri"], o), n;
}
var JC = class extends dt {
  constructor(e) {
    super(), this.apiClient = e, this.list = async (t = {}) => new qt(ct.PAGED_ITEM_TUNING_JOBS, (n) => this.listInternal(n), await this.listInternal(t), t), this.get = async (t) => await this.getInternal(t), this.tune = async (t) => {
      var n;
      if (this.apiClient.isVertexAI()) if (t.baseModel.startsWith("projects/")) {
        const r = { tunedModelName: t.baseModel };
        !((n = t.config) === null || n === void 0) && n.preTunedModelCheckpointId && (r.checkpointId = t.config.preTunedModelCheckpointId);
        const o = Object.assign(Object.assign({}, t), { preTunedModel: r });
        return o.baseModel = void 0, await this.tuneInternal(o);
      } else {
        const r = Object.assign({}, t);
        return await this.tuneInternal(r);
      }
      else {
        const r = Object.assign({}, t), o = await this.tuneMldevInternal(r);
        let i = "";
        return o.metadata !== void 0 && o.metadata.tunedModel !== void 0 ? i = o.metadata.tunedModel : o.name !== void 0 && o.name.includes("/operations/") && (i = o.name.split("/operations/")[0]), {
          name: i,
          state: Yi.JOB_STATE_QUEUED
        };
      }
    };
  }
  async getInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = DC(e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => us(d));
    } else {
      const c = kC(e);
      return s = N("{name}", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => Ch(d));
    }
  }
  async listInternal(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = FC(e);
      return s = N("tuningJobs", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = GC(d), f = new $u();
        return Object.assign(f, h), f;
      });
    } else {
      const c = UC(e);
      return s = N("tunedModels", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "GET",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = OC(d), f = new $u();
        return Object.assign(f, h), f;
      });
    }
  }
  async cancel(e) {
    var t, n, r, o;
    let i, s = "", u = {};
    if (this.apiClient.isVertexAI()) {
      const c = IC(e);
      return s = N("{name}:cancel", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = RC(d), f = new Lu();
        return Object.assign(f, h), f;
      });
    } else {
      const c = wC(e);
      return s = N("{name}:cancel", c._url), u = c._query, delete c._url, delete c._query, i = this.apiClient.request({
        path: s,
        queryParams: u,
        body: JSON.stringify(c),
        httpMethod: "POST",
        httpOptions: (r = e.config) === null || r === void 0 ? void 0 : r.httpOptions,
        abortSignal: (o = e.config) === null || o === void 0 ? void 0 : o.abortSignal
      }).then((d) => d.json().then((h) => {
        const f = h;
        return f.sdkHttpResponse = { headers: d.headers }, f;
      })), i.then((d) => {
        const h = bC(d), f = new Lu();
        return Object.assign(f, h), f;
      });
    }
  }
  async tuneInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) {
      const s = NC(e, e);
      return o = N("tuningJobs", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => us(u));
    } else throw new Error("This method is only supported by the Vertex AI.");
  }
  async tuneMldevInternal(e) {
    var t, n;
    let r, o = "", i = {};
    if (this.apiClient.isVertexAI()) throw new Error("This method is only supported by the Gemini Developer API.");
    {
      const s = xC(e);
      return o = N("tunedModels", s._url), i = s._query, delete s._url, delete s._query, r = this.apiClient.request({
        path: o,
        queryParams: i,
        body: JSON.stringify(s),
        httpMethod: "POST",
        httpOptions: (t = e.config) === null || t === void 0 ? void 0 : t.httpOptions,
        abortSignal: (n = e.config) === null || n === void 0 ? void 0 : n.abortSignal
      }).then((u) => u.json().then((c) => {
        const d = c;
        return d.sdkHttpResponse = { headers: u.headers }, d;
      })), r.then((u) => VC(u));
    }
  }
}, KC = class {
  async download(e, t) {
    throw new Error("Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.");
  }
}, WC = 1024 * 1024 * 8, zC = 3, YC = 1e3, XC = 2, bo = "x-goog-upload-status";
async function QC(e, t, n, r) {
  var o;
  const i = await wh(e, t, n, r), s = await i?.json();
  if (((o = i?.headers) === null || o === void 0 ? void 0 : o[bo]) !== "final") throw new Error("Failed to upload file: Upload status is not finalized.");
  return s.file;
}
async function ZC(e, t, n, r) {
  var o;
  const i = await wh(e, t, n, r), s = await i?.json();
  if (((o = i?.headers) === null || o === void 0 ? void 0 : o[bo]) !== "final") throw new Error("Failed to upload file: Upload status is not finalized.");
  const u = Cf(s), c = new fy();
  return Object.assign(c, u), c;
}
async function wh(e, t, n, r) {
  var o, i, s;
  let u = t;
  const c = r?.baseUrl || ((o = n.clientOptions.httpOptions) === null || o === void 0 ? void 0 : o.baseUrl);
  if (c) {
    const m = new URL(c), g = new URL(t);
    g.protocol = m.protocol, g.host = m.host, g.port = m.port, u = g.toString();
  }
  let d = 0, h = 0, f = new Qi(new Response()), p = "upload";
  for (d = e.size; h < d; ) {
    const m = Math.min(WC, d - h), g = e.slice(h, h + m);
    h + m >= d && (p += ", finalize");
    let _ = 0, y = YC;
    for (; _ < zC; ) {
      const E = Object.assign(Object.assign({}, r?.headers || {}), {
        "X-Goog-Upload-Command": p,
        "X-Goog-Upload-Offset": String(h),
        "Content-Length": String(m)
      });
      if (f = await n.request({
        path: "",
        body: g,
        httpMethod: "POST",
        httpOptions: Object.assign(Object.assign({}, r), {
          apiVersion: "",
          baseUrl: u,
          headers: E
        })
      }), !((i = f?.headers) === null || i === void 0) && i[bo]) break;
      _++, await ew(y), y = y * XC;
    }
    if (h += m, ((s = f?.headers) === null || s === void 0 ? void 0 : s[bo]) !== "active") break;
    if (d <= h) throw new Error("All content has been uploaded, but the upload status is not finalized.");
  }
  return f;
}
async function jC(e) {
  return {
    size: e.size,
    type: e.type
  };
}
function ew(e) {
  return new Promise((t) => setTimeout(t, e));
}
var tw = class {
  async upload(e, t, n, r) {
    if (typeof e == "string") throw new Error("File path is not supported in browser uploader.");
    return await QC(e, t, n, r);
  }
  async uploadToFileSearchStore(e, t, n, r) {
    if (typeof e == "string") throw new Error("File path is not supported in browser uploader.");
    return await ZC(e, t, n, r);
  }
  async stat(e) {
    if (typeof e == "string") throw new Error("File path is not supported in browser uploader.");
    return await jC(e);
  }
}, nw = class {
  create(e, t, n) {
    return new rw(e, t, n);
  }
}, rw = class {
  constructor(e, t, n) {
    this.url = e, this.headers = t, this.callbacks = n;
  }
  connect() {
    this.ws = new WebSocket(this.url), this.ws.onopen = this.callbacks.onopen, this.ws.onerror = this.callbacks.onerror, this.ws.onclose = this.callbacks.onclose, this.ws.onmessage = this.callbacks.onmessage;
  }
  send(e) {
    if (this.ws === void 0) throw new Error("WebSocket is not connected");
    this.ws.send(e);
  }
  close() {
    if (this.ws === void 0) throw new Error("WebSocket is not connected");
    this.ws.close();
  }
}, dc = "x-goog-api-key", ow = class {
  constructor(e) {
    this.apiKey = e;
  }
  async addAuthHeaders(e, t) {
    if (e.get(dc) === null) {
      if (this.apiKey.startsWith("auth_tokens/")) throw new Error("Ephemeral tokens are only supported by the live API.");
      if (!this.apiKey) throw new Error("API key is missing. Please provide a valid API key.");
      e.append(dc, this.apiKey);
    }
  }
}, iw = class {
  getNextGenClient() {
    var e;
    const t = this.httpOptions;
    if (this._nextGenClient === void 0) {
      const n = this.httpOptions;
      this._nextGenClient = new oe({
        baseURL: this.apiClient.getBaseUrl(),
        apiKey: this.apiKey,
        apiVersion: this.apiClient.getApiVersion(),
        clientAdapter: this.apiClient,
        defaultHeaders: this.apiClient.getDefaultHeaders(),
        timeout: n?.timeout,
        maxRetries: (e = n?.retryOptions) === null || e === void 0 ? void 0 : e.attempts
      });
    }
    return t?.extraBody && console.warn("GoogleGenAI.interactions: Client level httpOptions.extraBody is not supported by the interactions client and will be ignored."), this._nextGenClient;
  }
  get interactions() {
    return this._interactions !== void 0 ? this._interactions : (console.warn("GoogleGenAI.interactions: Interactions usage is experimental and may change in future versions."), this._interactions = this.getNextGenClient().interactions, this._interactions);
  }
  get webhooks() {
    return this._webhooks !== void 0 ? this._webhooks : (this._webhooks = this.getNextGenClient().webhooks, this._webhooks);
  }
  constructor(e) {
    var t;
    if (e.apiKey == null) throw new Error("An API Key must be set when running in a browser");
    if (e.project || e.location) throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");
    this.vertexai = (t = e.vertexai) !== null && t !== void 0 ? t : !1, this.apiKey = e.apiKey;
    const n = $_(e.httpOptions, e.vertexai, void 0, void 0);
    n && (e.httpOptions ? e.httpOptions.baseUrl = n : e.httpOptions = { baseUrl: n }), this.apiVersion = e.apiVersion, this.httpOptions = e.httpOptions;
    const r = new ow(this.apiKey);
    this.apiClient = new eE({
      auth: r,
      apiVersion: this.apiVersion,
      apiKey: this.apiKey,
      vertexai: this.vertexai,
      httpOptions: this.httpOptions,
      userAgentExtra: "gl-node/web",
      uploader: new tw(),
      downloader: new KC()
    }), this.models = new AE(this.apiClient), this.live = new pE(this.apiClient, r, new nw()), this.batches = new mv(this.apiClient), this.chats = new jv(this.models, this.apiClient), this.caches = new Xv(this.apiClient), this.files = new dA(this.apiClient), this.operations = new TE(this.apiClient), this.authTokens = new OE(this.apiClient), this.tunings = new JC(this.apiClient), this.fileSearchStores = new WE(this.apiClient);
  }
};
function fc(e) {
  try {
    return JSON.parse(e || "{}");
  } catch {
    return {};
  }
}
function Ro(e) {
  if (e !== void 0)
    try {
      return JSON.parse(JSON.stringify(e));
    } catch {
      return;
    }
}
function Ut(e) {
  return { text: String(e || "") };
}
function sw(e = "") {
  const t = String(e || "").match(/^data:([^;,]+);base64,(.+)$/);
  return t ? { inlineData: {
    mimeType: t[1],
    data: t[2]
  } } : null;
}
function aw(e) {
  if (typeof e == "string") return [Ut(e)];
  if (!Array.isArray(e)) return [Ut("")];
  const t = e.map((n) => !n || typeof n != "object" ? null : n.type === "text" ? Ut(n.text || "") : n.type === "image_url" && n.image_url?.url ? sw(n.image_url.url) : null).filter(Boolean);
  return t.length ? t : [Ut("")];
}
function hc() {
  return {
    role: "user",
    parts: [Ut("")]
  };
}
function Sr(e, t = "model") {
  if (!e?.parts?.length) return null;
  const n = Ro(e);
  return n ? (n.role || (n.role = t), n) : null;
}
function lw(e) {
  return !!e?.parts?.some((t) => typeof t?.thoughtSignature == "string" && t.thoughtSignature);
}
function uw(e) {
  return !!e?.parts?.some((t) => t?.functionCall?.name);
}
function pc(e, t, n = 0) {
  if (!e?.functionCall?.name) return "";
  const r = String(e.functionCall.id || "").trim();
  return r ? `id:${r}` : [
    String(n),
    String(e.functionCall.name || ""),
    String(t)
  ].join("\0");
}
function cw(e, t) {
  const n = e?.functionCall || {}, r = t?.functionCall || {}, o = n.args && typeof n.args == "object" && !Array.isArray(n.args) ? n.args : {}, i = r.args && typeof r.args == "object" && !Array.isArray(r.args) ? r.args : {};
  return {
    ...e,
    ...t,
    ...e?.thoughtSignature && !t?.thoughtSignature ? { thoughtSignature: e.thoughtSignature } : {},
    functionCall: {
      ...n,
      ...r,
      args: {
        ...o,
        ...i
      }
    }
  };
}
function dw(e = [], t = "") {
  const n = e.map((h) => Sr(h, "model")).filter(Boolean);
  if (!n.length) return null;
  const r = [...n].reverse().find((h) => lw(h)) || null, o = [...n].reverse().find((h) => uw(h)) || null, i = r || o || n[n.length - 1], s = n.indexOf(i), u = Ro(i);
  if (!u?.parts?.length) return n[n.length - 1];
  if (o) {
    const h = /* @__PURE__ */ new Map(), f = [];
    n.forEach((m, g) => {
      m.parts.forEach((_, y) => {
        const E = pc(_, y, g);
        if (!E) return;
        h.has(E) || f.push(E);
        const A = h.get(E);
        A ? h.set(E, cw(A, _)) : h.set(E, Ro(_));
      });
    });
    const p = /* @__PURE__ */ new Set();
    u.parts = u.parts.map((m, g) => {
      const _ = pc(m, g, s);
      return _ ? (p.add(_), h.get(_) || m) : m;
    }), f.forEach((m) => {
      p.has(m) || (u.parts.push(h.get(m)), p.add(m));
    });
  }
  const c = String(t || ""), d = u.parts.filter((h) => !(typeof h?.text == "string" && !h?.thought));
  return u.parts = c ? [{ text: c }, ...d] : d, u.parts.length ? u : n[n.length - 1];
}
function mc(e) {
  const t = e?.candidates?.[0]?.content?.parts || [], n = t.filter((r) => !r?.thought && typeof r?.text == "string" && r.text).map((r) => r.text).join(`
`);
  return n || t.length ? n : typeof e?.text == "string" && e.text ? e.text : "";
}
function Ih(e) {
  const t = Array.isArray(e?.functionCalls) ? e.functionCalls : [], n = (e?.candidates?.[0]?.content?.parts || []).map((r) => r?.functionCall || r).filter((r) => r && r.name);
  return t.length ? t : n;
}
function bh(e) {
  try {
    return JSON.stringify(e?.args || {});
  } catch {
    return "{}";
  }
}
function gc(e) {
  try {
    const t = JSON.parse(String(e || "{}"));
    return t && typeof t == "object" && !Array.isArray(t) ? t : null;
  } catch {
    return null;
  }
}
function fw(e, t) {
  const n = gc(e), r = gc(t);
  return n && r ? JSON.stringify({
    ...n,
    ...r
  }) : String(t || "").trim() || String(e || "{}");
}
function hw(e, t = "google-tool") {
  return Ih(e).map((n, r) => {
    const o = String(n.id || "").trim();
    return {
      id: o || `${t}-${r + 1}`,
      name: n.name || "",
      arguments: bh(n),
      ...o ? {} : { providerId: "" }
    };
  }).filter((n) => n.name);
}
function pw(e) {
  const t = [], n = /* @__PURE__ */ new Map();
  let r = 0;
  function o(s, u, c, d) {
    return s.name = String(u.name || s.name || "").trim(), s.arguments = fw(s.arguments, d), c && (n.set(c, s), s.id !== c ? s.providerId = c : delete s.providerId), s;
  }
  function i(s) {
    return Ih(s).forEach((u) => {
      const c = String(u?.name || "").trim();
      if (!c) return;
      const d = String(u?.id || "").trim(), h = bh(u);
      let f = d ? n.get(d) : null;
      f ? o(f, u, d, h) : (f = {
        id: d || `${e}-${++r}`,
        name: c,
        arguments: h,
        ...d ? {} : { providerId: "" }
      }, t.push(f)), d && n.set(d, f);
    }), t.map((u) => ({ ...u }));
  }
  return { append: i };
}
function mw(e = []) {
  return {
    role: "user",
    parts: e.filter((t) => t && t.name).map((t) => {
      const n = Object.prototype.hasOwnProperty.call(t, "providerId") ? String(t.providerId || "").trim() : String(t.id || "").trim();
      return { functionResponse: {
        ...n ? { id: n } : {},
        name: t.name,
        response: t.response || {}
      } };
    })
  };
}
function gw(e) {
  switch (e) {
    case "minimal":
      return tn.MINIMAL;
    case "high":
      return tn.HIGH;
    case "medium":
      return tn.MEDIUM;
    default:
      return tn.LOW;
  }
}
function _c(e) {
  return (e?.candidates?.[0]?.content?.parts || []).filter((t) => t?.thought && typeof t.text == "string" && t.text.trim()).map((t, n) => ({
    label: `思考块 ${n + 1}`,
    text: t.text.trim()
  }));
}
function _w(e) {
  const t = [String(e.systemPrompt || "").trim(), ...(e.messages || []).filter((n) => n.role === "system").map((n) => String(n.content || "").trim())].filter(Boolean);
  if (t.length)
    return [...new Set(t)].join(`

`);
}
function yw(e) {
  const t = e?.providerPayload?.googleContent;
  return Sr(t, "model");
}
function vw(e) {
  const t = e?.providerPayload?.googleContents;
  if (!Array.isArray(t) || !t.length) {
    const n = yw(e);
    return n ? [n] : [];
  }
  return t.map((n) => Sr(n, "model")).filter(Boolean);
}
function sa(e = []) {
  const t = (Array.isArray(e) ? e : []).map((n) => Sr(n, "model")).filter(Boolean);
  if (t.length)
    return {
      googleContent: t[t.length - 1],
      googleContents: t
    };
}
function Aw(e) {
  const t = e?.candidates?.[0]?.content;
  return sa(t ? [t] : []);
}
function Tw(e) {
  return sa(e ? [e] : []);
}
function Rh(e) {
  try {
    if (typeof e?.getHistory == "function") return e.getHistory(!1);
  } catch {
    return [];
  }
  return Array.isArray(e?.history) ? Ro(e.history) || [] : [];
}
function Sw(e, t = 0) {
  return Rh(e).slice(Math.max(0, t)).filter((n) => n?.role === "model").map((n) => Sr(n, "model")).filter(Boolean);
}
function Ew(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = [], o = (e || []).filter((s) => s.role === "user" || s.role === "assistant" || s.role === "tool");
  o.forEach((s) => {
    (s.tool_calls || []).forEach((u) => {
      u.id && u.function?.name && t.set(u.id, u.function.name), u.id && Object.prototype.hasOwnProperty.call(u, "providerToolCallId") && n.set(u.id, String(u.providerToolCallId || "").trim());
    });
  });
  for (let s = 0; s < o.length; s += 1) {
    const u = o[s];
    if (u.role === "tool") {
      const c = [];
      let d = s;
      for (; d < o.length && o[d].role === "tool"; ) {
        const h = o[d], f = String(h.tool_call_id || "").trim(), p = n.has(f) ? n.get(f) : f;
        c.push({ functionResponse: {
          ...p ? { id: p } : {},
          name: String(h.toolName || h.tool_name || "").trim() || t.get(f) || "tool_result",
          response: fc(h.content)
        } }), d += 1;
      }
      r.push({
        role: "user",
        parts: c
      }), s = d - 1;
      continue;
    }
    if (u.role === "assistant") {
      const c = vw(u);
      if (c.length) {
        r.push(...c);
        continue;
      }
    }
    if (u.role === "assistant" && Array.isArray(u.tool_calls) && u.tool_calls.length) {
      r.push({
        role: "model",
        parts: [...u.content ? [Ut(u.content)] : [], ...u.tool_calls.map((c) => ({ functionCall: {
          ...(() => {
            const d = Object.prototype.hasOwnProperty.call(c, "providerToolCallId") ? String(c.providerToolCallId || "").trim() : String(c.id || "").trim();
            return d ? { id: d } : {};
          })(),
          name: c.function.name,
          args: fc(c.function.arguments)
        } }))]
      });
      continue;
    }
    r.push({
      role: u.role === "assistant" ? "model" : "user",
      parts: aw(u.content)
    });
  }
  if (!r.length) return {
    history: [],
    latestMessage: hc().parts
  };
  const i = r[r.length - 1];
  return i.role === "user" && i.parts?.length ? {
    history: r.slice(0, -1),
    latestMessage: i.parts
  } : {
    history: r,
    latestMessage: hc().parts
  };
}
function Cw(e, t) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: t.thoughts } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft ? { toolCallDraft: !0 } : {}
  });
}
function yc(e, t) {
  return `${String(e || "")}${String(t || "")}`;
}
var ww = class {
  constructor(e) {
    this.config = e, this.auth = Bo("google", e.apiKey), this.supportsSessionToolLoop = !0, this.activeChat = null, this.sessionReasoning = null, this.toolCallResponseSequence = 0, this.client = new iw({
      ...this.auth.sdkOptions,
      httpOptions: {
        headers: this.auth.headers,
        baseUrl: String(e.baseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, ""),
        timeout: Number(e.timeoutMs) || 900 * 1e3
      }
    });
  }
  buildChatPayload(e, t = j("google", this.config, e.reasoning)) {
    const n = t, r = Ew(e.messages), o = Array.isArray(e.tools) ? e.tools : [], i = _w(e), s = {
      ...i ? { systemInstruction: i } : {},
      temperature: e.temperature,
      ...e.maxTokens ? { maxOutputTokens: e.maxTokens } : {}
    };
    if (n.mode === "off" ? s.thinkingConfig = {
      includeThoughts: !1,
      thinkingBudget: 0
    } : n.mode === "on" && n.profileId.startsWith("google-gemini-2.5-") ? s.thinkingConfig = {
      includeThoughts: z(n),
      thinkingBudget: n.budgetTokens
    } : n.mode === "on" ? s.thinkingConfig = {
      includeThoughts: z(n),
      thinkingLevel: gw(n.effort)
    } : z(n) && (s.thinkingConfig = { includeThoughts: !0 }), o.length && (s.tools = [{ functionDeclarations: o.map((u) => ({
      name: u.function.name,
      description: u.function.description,
      parameters: u.function.parameters
    })) }]), o.length) {
      const u = String(e.toolChoice || "auto").trim();
      s.toolConfig = { functionCallingConfig: u === "none" ? { mode: en.NONE } : u === "auto" ? { mode: en.AUTO } : u === "required" ? { mode: en.ANY } : {
        mode: en.ANY,
        allowedFunctionNames: [u]
      } };
    }
    return {
      createPayload: {
        model: this.config.model,
        history: r.history,
        config: s
      },
      sendPayload: { message: r.latestMessage }
    };
  }
  inspectRequest(e, t = {}) {
    const n = t.effectiveReasoning || j("google", this.config, e.reasoning), r = t.payload || this.buildChatPayload(e, n), o = String(this.config.baseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
    return cr({
      provider: "google",
      model: this.config.model,
      transport: "google-genai-sdk",
      url: `${o}/models/${encodeURIComponent(this.config.model || "")}:generateContent`,
      headers: {
        "Content-Type": "application/json",
        ...this.auth.headers
      },
      body: {
        chatCreate: r.createPayload,
        sendMessage: r.sendPayload,
        stream: typeof e.onStreamProgress == "function"
      },
      sdk: typeof e.onStreamProgress == "function" ? "client.chats.create(...).sendMessageStream" : "client.chats.create(...).sendMessage",
      effectiveConfig: Ct(e, {
        reasoning: n,
        effort: r.createPayload.config?.thinkingConfig?.thinkingLevel,
        budgetTokens: r.createPayload.config?.thinkingConfig?.thinkingBudget,
        controlFields: r.createPayload.config?.thinkingConfig ? { thinkingConfig: r.createPayload.config.thinkingConfig } : {}
      })
    });
  }
  inspectSendRequest(e, t, n) {
    const r = String(this.config.baseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
    return cr({
      provider: "google",
      model: this.config.model,
      transport: "google-genai-sdk",
      url: `${r}/models/${encodeURIComponent(this.config.model || "")}:generateContent`,
      headers: {
        "Content-Type": "application/json",
        ...this.auth.headers
      },
      body: {
        sendMessage: e,
        stream: typeof t.onStreamProgress == "function"
      },
      sdk: typeof t.onStreamProgress == "function" ? "activeChat.sendMessageStream" : "activeChat.sendMessage",
      effectiveConfig: Ct(t, {
        reasoning: n,
        effort: this.sessionConfig?.thinkingConfig?.thinkingLevel,
        budgetTokens: this.sessionConfig?.thinkingConfig?.thinkingBudget,
        controlFields: this.sessionConfig?.thinkingConfig ? { thinkingConfig: this.sessionConfig.thinkingConfig } : {}
      })
    });
  }
  createChat(e, t) {
    const n = this.buildChatPayload(e, t);
    return {
      chat: this.client.chats.create(n.createPayload),
      sessionConfig: n.createPayload.config,
      sendPayload: n.sendPayload,
      requestInspection: this.inspectRequest(e, {
        payload: n,
        effectiveReasoning: t
      })
    };
  }
  async sendThroughChat(e, t, n, r) {
    let o, i, s, u = [];
    const c = `google-tool-${++this.toolCallResponseSequence}`, d = pw(c);
    let h = null;
    const f = n.signal ? {
      ...this.sessionConfig || {},
      abortSignal: n.signal
    } : void 0, p = {
      ...t,
      ...f ? { config: f } : {}
    }, m = typeof n.onStreamProgress == "function";
    let g;
    const _ = Rh(e).length;
    if (m) {
      const A = await e.sendMessageStream(p), w = /* @__PURE__ */ new Map();
      let P = "", L = null;
      const C = [];
      for await (const k of A) {
        L = k, k?.candidates?.[0]?.finishReason && (g = k.candidates[0].finishReason);
        const I = k?.candidates?.[0]?.content;
        I?.parts?.length && C.push(I), z(r) && _c(k).forEach((b, F) => {
          const X = `${b.label}:${F}`;
          w.set(X, yc(w.get(X) || "", b.text));
        }), u = d.append(k);
        const x = mc(k);
        P = yc(P, x), Cw(n, {
          text: P,
          thoughts: Array.from(w.values()).filter(Boolean).map((b, F) => ({
            label: `思考块 ${F + 1}`,
            text: b
          })),
          ...u.length ? {
            toolCalls: u,
            toolCallDraft: !0
          } : {}
        });
      }
      o = {
        ...L || {},
        functionCalls: u
      }, h = dw(C, P) || o?.candidates?.[0]?.content || null, i = Array.from(w.values()).filter(Boolean).map((k, I) => ({
        label: `思考块 ${I + 1}`,
        text: k
      })), s = P;
    } else
      o = await e.sendMessage(p), g = o?.candidates?.[0]?.finishReason, i = z(r) ? _c(o) : [], s = mc(o);
    const y = m ? u : hw(o, c), E = Sw(e, _);
    return {
      text: s,
      toolCalls: y,
      thoughts: i,
      finishReason: at("google", g, !1, s),
      model: o.modelVersion || this.config.model,
      provider: "google",
      providerPayload: sa(E) || Tw(h) || Aw(o)
    };
  }
  async chat(e) {
    const t = j("google", this.config, e.reasoning), n = (Array.isArray(e.toolResponses) && e.toolResponses.length || String(e.finalAnswerReminderText || "").trim()) && this.sessionReasoning ? this.sessionReasoning : t;
    if (Array.isArray(e.toolResponses) && e.toolResponses.length) {
      if (!this.activeChat) throw new Error("google_chat_session_missing");
      const i = { message: mw(e.toolResponses) };
      return {
        ...await this.sendThroughChat(this.activeChat, i, e, n),
        requestInspection: this.inspectSendRequest(i, e, n)
      };
    }
    const r = String(e.finalAnswerReminderText || "").trim();
    if (r) {
      if (!this.activeChat) throw new Error("google_chat_session_missing");
      const i = { message: [Ut(r)] };
      return {
        ...await this.sendThroughChat(this.activeChat, i, e, n),
        requestInspection: this.inspectSendRequest(i, e, n)
      };
    }
    const o = this.createChat(e, n);
    return this.activeChat = o.chat, this.sessionConfig = o.sessionConfig, this.sessionReasoning = n, {
      ...await this.sendThroughChat(this.activeChat, o.sendPayload, e, n),
      requestInspection: o.requestInspection
    };
  }
};
function G(e, t, n, r, o) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !o) throw new TypeError("Private accessor was defined without a setter");
  if (typeof t == "function" ? e !== t || !o : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? o.call(e, n) : o ? o.value = n : t.set(e, n), n;
}
function S(e, t, n, r) {
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof t == "function" ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return n === "m" ? r : n === "a" ? r.call(e) : r ? r.value : t.get(e);
}
var Ph = function() {
  const { crypto: e } = globalThis;
  if (e?.randomUUID)
    return Ph = e.randomUUID.bind(e), e.randomUUID();
  const t = new Uint8Array(1), n = e ? () => e.getRandomValues(t)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (r) => (+r ^ n() & 15 >> +r / 4).toString(16));
};
function cs(e) {
  return typeof e == "object" && e !== null && ("name" in e && e.name === "AbortError" || "message" in e && String(e.message).includes("FetchRequestCanceledException"));
}
var ds = (e) => {
  if (e instanceof Error) return e;
  if (typeof e == "object" && e !== null) {
    try {
      if (Object.prototype.toString.call(e) === "[object Error]") {
        const t = new Error(e.message, e.cause ? { cause: e.cause } : {});
        return e.stack && (t.stack = e.stack), e.cause && !t.cause && (t.cause = e.cause), e.name && (t.name = e.name), t;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(e));
    } catch {
    }
  }
  return new Error(e);
}, O = class extends Error {
}, de = class fs extends O {
  constructor(t, n, r, o) {
    super(`${fs.makeMessage(t, n, r)}`), this.status = t, this.headers = o, this.requestID = o?.get("x-request-id"), this.error = n;
    const i = n;
    this.code = i?.code, this.param = i?.param, this.type = i?.type;
  }
  static makeMessage(t, n, r) {
    const o = n?.message ? typeof n.message == "string" ? n.message : JSON.stringify(n.message) : n ? JSON.stringify(n) : r;
    return t && o ? `${t} ${o}` : t ? `${t} status code (no body)` : o || "(no status code or body)";
  }
  static generate(t, n, r, o) {
    if (!t || !o) return new Xo({
      message: r,
      cause: ds(n)
    });
    const i = n?.error;
    return t === 400 ? new Mh(t, i, r, o) : t === 401 ? new xh(t, i, r, o) : t === 403 ? new Nh(t, i, r, o) : t === 404 ? new kh(t, i, r, o) : t === 409 ? new Dh(t, i, r, o) : t === 422 ? new $h(t, i, r, o) : t === 429 ? new Lh(t, i, r, o) : t >= 500 ? new Uh(t, i, r, o) : new fs(t, i, r, o);
  }
}, ke = class extends de {
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}, Xo = class extends de {
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}, aa = class extends Xo {
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}, Mh = class extends de {
}, xh = class extends de {
}, Nh = class extends de {
}, kh = class extends de {
}, Dh = class extends de {
}, $h = class extends de {
}, Lh = class extends de {
}, Uh = class extends de {
}, Fh = class extends O {
  constructor() {
    super("Could not parse response content as the length limit was reached");
  }
}, Oh = class extends O {
  constructor() {
    super("Could not parse response content as the request was rejected by the content filter");
  }
}, Kn = class extends Error {
  constructor(e) {
    super(e);
  }
}, Gh = class extends de {
  constructor(e, t, n) {
    let r = "OAuth2 authentication error", o;
    if (t && typeof t == "object") {
      const i = t;
      o = i.error;
      const s = i.error_description;
      s && typeof s == "string" ? r = s : o && (r = o);
    }
    super(e, t, r, n), this.error_code = o;
  }
}, Iw = class extends O {
  constructor(e, t, n) {
    super(e), this.provider = t, this.cause = n;
  }
}, bw = /^[a-z][a-z0-9+.-]*:/i, Rw = (e) => bw.test(e), ye = (e) => (ye = Array.isArray, ye(e)), vc = ye;
function la(e) {
  return typeof e != "object" ? {} : e ?? {};
}
function Ac(e) {
  if (!e) return !0;
  for (const t in e) return !1;
  return !0;
}
function Pw(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function Ci(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
var Mw = (e, t) => {
  if (typeof t != "number" || !Number.isInteger(t)) throw new O(`${e} must be an integer`);
  if (t < 0) throw new O(`${e} must be a positive integer`);
  return t;
}, xw = (e) => {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}, Er = (e) => new Promise((t) => setTimeout(t, e)), Xt = "6.44.0", Nw = () => typeof window < "u" && typeof window.document < "u" && typeof navigator < "u";
function kw() {
  return typeof Deno < "u" && Deno.build != null ? "deno" : typeof EdgeRuntime < "u" ? "edge" : Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]" ? "node" : "unknown";
}
var Dw = () => {
  const e = kw();
  if (e === "deno") return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Xt,
    "X-Stainless-OS": Sc(Deno.build.os),
    "X-Stainless-Arch": Tc(Deno.build.arch),
    "X-Stainless-Runtime": "deno",
    "X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : Deno.version?.deno ?? "unknown"
  };
  if (typeof EdgeRuntime < "u") return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Xt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": `other:${EdgeRuntime}`,
    "X-Stainless-Runtime": "edge",
    "X-Stainless-Runtime-Version": globalThis.process.version
  };
  if (e === "node") return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Xt,
    "X-Stainless-OS": Sc(globalThis.process.platform ?? "unknown"),
    "X-Stainless-Arch": Tc(globalThis.process.arch ?? "unknown"),
    "X-Stainless-Runtime": "node",
    "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
  };
  const t = $w();
  return t ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Xt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${t.browser}`,
    "X-Stainless-Runtime-Version": t.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Xt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
};
function $w() {
  if (typeof navigator > "u" || !navigator) return null;
  for (const { key: e, pattern: t } of [
    {
      key: "edge",
      pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "ie",
      pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "ie",
      pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "chrome",
      pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "firefox",
      pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "safari",
      pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
    }
  ]) {
    const n = t.exec(navigator.userAgent);
    if (n) return {
      browser: e,
      version: `${n[1] || 0}.${n[2] || 0}.${n[3] || 0}`
    };
  }
  return null;
}
var Tc = (e) => e === "x32" ? "x32" : e === "x86_64" || e === "x64" ? "x64" : e === "arm" ? "arm" : e === "aarch64" || e === "arm64" ? "arm64" : e ? `other:${e}` : "unknown", Sc = (e) => (e = e.toLowerCase(), e.includes("ios") ? "iOS" : e === "android" ? "Android" : e === "darwin" ? "MacOS" : e === "win32" ? "Windows" : e === "freebsd" ? "FreeBSD" : e === "openbsd" ? "OpenBSD" : e === "linux" ? "Linux" : e ? `Other:${e}` : "Unknown"), Ec, Lw = () => Ec ?? (Ec = Dw());
function Bh() {
  if (typeof fetch < "u") return fetch;
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function qh(...e) {
  const t = globalThis.ReadableStream;
  if (typeof t > "u") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new t(...e);
}
function Hh(e) {
  let t = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
  return qh({
    start() {
    },
    async pull(n) {
      const { done: r, value: o } = await t.next();
      r ? n.close() : n.enqueue(o);
    },
    async cancel() {
      await t.return?.();
    }
  });
}
function Vh(e) {
  if (e[Symbol.asyncIterator]) return e;
  const t = e.getReader();
  return {
    async next() {
      try {
        const n = await t.read();
        return n?.done && t.releaseLock(), n;
      } catch (n) {
        throw t.releaseLock(), n;
      }
    },
    async return() {
      const n = t.cancel();
      return t.releaseLock(), await n, {
        done: !0,
        value: void 0
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function Cc(e) {
  if (e === null || typeof e != "object") return;
  if (e[Symbol.asyncIterator]) {
    await e[Symbol.asyncIterator]().return?.();
    return;
  }
  const t = e.getReader(), n = t.cancel();
  t.releaseLock(), await n;
}
var Uw = ({ headers: e, body: t }) => ({
  bodyHeaders: { "content-type": "application/json" },
  body: JSON.stringify(t)
}), Jh = "RFC3986", Kh = (e) => String(e), wc = {
  RFC1738: (e) => String(e).replace(/%20/g, "+"),
  RFC3986: Kh
};
var hs = (e, t) => (hs = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), hs(e, t)), Ye = /* @__PURE__ */ (() => {
  const e = [];
  for (let t = 0; t < 256; ++t) e.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
  return e;
})(), wi = 1024, Fw = (e, t, n, r, o) => {
  if (e.length === 0) return e;
  let i = e;
  if (typeof e == "symbol" ? i = Symbol.prototype.toString.call(e) : typeof e != "string" && (i = String(e)), n === "iso-8859-1") return escape(i).replace(/%u[0-9a-f]{4}/gi, function(u) {
    return "%26%23" + parseInt(u.slice(2), 16) + "%3B";
  });
  let s = "";
  for (let u = 0; u < i.length; u += wi) {
    const c = i.length >= wi ? i.slice(u, u + wi) : i, d = [];
    for (let h = 0; h < c.length; ++h) {
      let f = c.charCodeAt(h);
      if (f === 45 || f === 46 || f === 95 || f === 126 || f >= 48 && f <= 57 || f >= 65 && f <= 90 || f >= 97 && f <= 122 || o === "RFC1738" && (f === 40 || f === 41)) {
        d[d.length] = c.charAt(h);
        continue;
      }
      if (f < 128) {
        d[d.length] = Ye[f];
        continue;
      }
      if (f < 2048) {
        d[d.length] = Ye[192 | f >> 6] + Ye[128 | f & 63];
        continue;
      }
      if (f < 55296 || f >= 57344) {
        d[d.length] = Ye[224 | f >> 12] + Ye[128 | f >> 6 & 63] + Ye[128 | f & 63];
        continue;
      }
      h += 1, f = 65536 + ((f & 1023) << 10 | c.charCodeAt(h) & 1023), d[d.length] = Ye[240 | f >> 18] + Ye[128 | f >> 12 & 63] + Ye[128 | f >> 6 & 63] + Ye[128 | f & 63];
    }
    s += d.join("");
  }
  return s;
};
function Ow(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}
function Ic(e, t) {
  if (ye(e)) {
    const n = [];
    for (let r = 0; r < e.length; r += 1) n.push(t(e[r]));
    return n;
  }
  return t(e);
}
var Wh = {
  brackets(e) {
    return String(e) + "[]";
  },
  comma: "comma",
  indices(e, t) {
    return String(e) + "[" + t + "]";
  },
  repeat(e) {
    return String(e);
  }
}, zh = function(e, t) {
  Array.prototype.push.apply(e, ye(t) ? t : [t]);
}, bc, re = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: Fw,
  encodeValuesOnly: !1,
  format: Jh,
  formatter: Kh,
  indices: !1,
  serializeDate(e) {
    return (bc ?? (bc = Function.prototype.call.bind(Date.prototype.toISOString)))(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
};
function Gw(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}
var Ii = {};
function Yh(e, t, n, r, o, i, s, u, c, d, h, f, p, m, g, _, y, E) {
  let A = e, w = E, P = 0, L = !1;
  for (; (w = w.get(Ii)) !== void 0 && !L; ) {
    const b = w.get(e);
    if (P += 1, typeof b < "u") {
      if (b === P) throw new RangeError("Cyclic object value");
      L = !0;
    }
    typeof w.get(Ii) > "u" && (P = 0);
  }
  if (typeof d == "function" ? A = d(t, A) : A instanceof Date ? A = p?.(A) : n === "comma" && ye(A) && (A = Ic(A, function(b) {
    return b instanceof Date ? p?.(b) : b;
  })), A === null) {
    if (i) return c && !_ ? c(t, re.encoder, y, "key", m) : t;
    A = "";
  }
  if (Gw(A) || Ow(A)) {
    if (c) {
      const b = _ ? t : c(t, re.encoder, y, "key", m);
      return [g?.(b) + "=" + g?.(c(A, re.encoder, y, "value", m))];
    }
    return [g?.(t) + "=" + g?.(String(A))];
  }
  const C = [];
  if (typeof A > "u") return C;
  let k;
  if (n === "comma" && ye(A))
    _ && c && (A = Ic(A, c)), k = [{ value: A.length > 0 ? A.join(",") || null : void 0 }];
  else if (ye(d)) k = d;
  else {
    const b = Object.keys(A);
    k = h ? b.sort(h) : b;
  }
  const I = u ? String(t).replace(/\./g, "%2E") : String(t), x = r && ye(A) && A.length === 1 ? I + "[]" : I;
  if (o && ye(A) && A.length === 0) return x + "[]";
  for (let b = 0; b < k.length; ++b) {
    const F = k[b], X = typeof F == "object" && typeof F.value < "u" ? F.value : A[F];
    if (s && X === null) continue;
    const J = f && u ? F.replace(/\./g, "%2E") : F, V = ye(A) ? typeof n == "function" ? n(x, J) : x : x + (f ? "." + J : "[" + J + "]");
    E.set(e, P);
    const W = /* @__PURE__ */ new WeakMap();
    W.set(Ii, E), zh(C, Yh(X, V, n, r, o, i, s, u, n === "comma" && _ && ye(A) ? null : c, d, h, f, p, m, g, _, y, W));
  }
  return C;
}
function Bw(e = re) {
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.encodeDotInKeys < "u" && typeof e.encodeDotInKeys != "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function") throw new TypeError("Encoder has to be a function.");
  const t = e.charset || re.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  let n = Jh;
  if (typeof e.format < "u") {
    if (!hs(wc, e.format)) throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  const r = wc[n];
  let o = re.filter;
  (typeof e.filter == "function" || ye(e.filter)) && (o = e.filter);
  let i;
  if (e.arrayFormat && e.arrayFormat in Wh ? i = e.arrayFormat : "indices" in e ? i = e.indices ? "indices" : "repeat" : i = re.arrayFormat, "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  const s = typeof e.allowDots > "u" ? e.encodeDotInKeys ? !0 : re.allowDots : !!e.allowDots;
  return {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : re.addQueryPrefix,
    allowDots: s,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : re.allowEmptyArrays,
    arrayFormat: i,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : re.charsetSentinel,
    commaRoundTrip: !!e.commaRoundTrip,
    delimiter: typeof e.delimiter > "u" ? re.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : re.encode,
    encodeDotInKeys: typeof e.encodeDotInKeys == "boolean" ? e.encodeDotInKeys : re.encodeDotInKeys,
    encoder: typeof e.encoder == "function" ? e.encoder : re.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : re.encodeValuesOnly,
    filter: o,
    format: n,
    formatter: r,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : re.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : re.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : re.strictNullHandling
  };
}
function qw(e, t = {}) {
  let n = e;
  const r = Bw(t);
  let o, i;
  typeof r.filter == "function" ? (i = r.filter, n = i("", n)) : ye(r.filter) && (i = r.filter, o = i);
  const s = [];
  if (typeof n != "object" || n === null) return "";
  const u = Wh[r.arrayFormat], c = u === "comma" && r.commaRoundTrip;
  o || (o = Object.keys(n)), r.sort && o.sort(r.sort);
  const d = /* @__PURE__ */ new WeakMap();
  for (let p = 0; p < o.length; ++p) {
    const m = o[p];
    r.skipNulls && n[m] === null || zh(s, Yh(n[m], m, u, c, r.allowEmptyArrays, r.strictNullHandling, r.skipNulls, r.encodeDotInKeys, r.encode ? r.encoder : null, r.filter, r.sort, r.allowDots, r.serializeDate, r.format, r.formatter, r.encodeValuesOnly, r.charset, d));
  }
  const h = s.join(r.delimiter);
  let f = r.addQueryPrefix === !0 ? "?" : "";
  return r.charsetSentinel && (r.charset === "iso-8859-1" ? f += "utf8=%26%2310003%3B&" : f += "utf8=%E2%9C%93&"), h.length > 0 ? f + h : "";
}
function Hw(e) {
  return qw(e, { arrayFormat: "brackets" });
}
function Vw(e) {
  let t = 0;
  for (const o of e) t += o.length;
  const n = new Uint8Array(t);
  let r = 0;
  for (const o of e)
    n.set(o, r), r += o.length;
  return n;
}
var Rc;
function ua(e) {
  let t;
  return (Rc ?? (t = new globalThis.TextEncoder(), Rc = t.encode.bind(t)))(e);
}
var Pc;
function Mc(e) {
  let t;
  return (Pc ?? (t = new globalThis.TextDecoder(), Pc = t.decode.bind(t)))(e);
}
var Ce, we, Qo = class {
  constructor() {
    Ce.set(this, void 0), we.set(this, void 0), G(this, Ce, new Uint8Array(), "f"), G(this, we, null, "f");
  }
  decode(e) {
    if (e == null) return [];
    const t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? ua(e) : e;
    G(this, Ce, Vw([S(this, Ce, "f"), t]), "f");
    const n = [];
    let r;
    for (; (r = Jw(S(this, Ce, "f"), S(this, we, "f"))) != null; ) {
      if (r.carriage && S(this, we, "f") == null) {
        G(this, we, r.index, "f");
        continue;
      }
      if (S(this, we, "f") != null && (r.index !== S(this, we, "f") + 1 || r.carriage)) {
        n.push(Mc(S(this, Ce, "f").subarray(0, S(this, we, "f") - 1))), G(this, Ce, S(this, Ce, "f").subarray(S(this, we, "f")), "f"), G(this, we, null, "f");
        continue;
      }
      const o = S(this, we, "f") !== null ? r.preceding - 1 : r.preceding, i = Mc(S(this, Ce, "f").subarray(0, o));
      n.push(i), G(this, Ce, S(this, Ce, "f").subarray(r.index), "f"), G(this, we, null, "f");
    }
    return n;
  }
  flush() {
    return S(this, Ce, "f").length ? this.decode(`
`) : [];
  }
};
Ce = /* @__PURE__ */ new WeakMap(), we = /* @__PURE__ */ new WeakMap();
Qo.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
Qo.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function Jw(e, t) {
  for (let o = t ?? 0; o < e.length; o++) {
    if (e[o] === 10) return {
      preceding: o,
      index: o + 1,
      carriage: !1
    };
    if (e[o] === 13) return {
      preceding: o,
      index: o + 1,
      carriage: !0
    };
  }
  return null;
}
function Kw(e) {
  for (let r = 0; r < e.length - 1; r++) {
    if (e[r] === 10 && e[r + 1] === 10 || e[r] === 13 && e[r + 1] === 13) return r + 2;
    if (e[r] === 13 && e[r + 1] === 10 && r + 3 < e.length && e[r + 2] === 13 && e[r + 3] === 10) return r + 4;
  }
  return -1;
}
var Po = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
}, xc = (e, t, n) => {
  if (e) {
    if (Pw(Po, e)) return e;
    ae(n).warn(`${t} was set to ${JSON.stringify(e)}, expected one of ${JSON.stringify(Object.keys(Po))}`);
  }
};
function Wn() {
}
function Yr(e, t, n) {
  return !t || Po[e] > Po[n] ? Wn : t[e].bind(t);
}
var Ww = {
  error: Wn,
  warn: Wn,
  info: Wn,
  debug: Wn
}, Nc = /* @__PURE__ */ new WeakMap();
function ae(e) {
  const t = e.logger, n = e.logLevel ?? "off";
  if (!t) return Ww;
  const r = Nc.get(t);
  if (r && r[0] === n) return r[1];
  const o = {
    error: Yr("error", t, n),
    warn: Yr("warn", t, n),
    info: Yr("info", t, n),
    debug: Yr("debug", t, n)
  };
  return Nc.set(t, [n, o]), o;
}
var kt = (e) => (e.options && (e.options = { ...e.options }, delete e.options.headers), e.headers && (e.headers = Object.fromEntries((e.headers instanceof Headers ? [...e.headers] : Object.entries(e.headers)).map(([t, n]) => [t, t.toLowerCase() === "authorization" || t.toLowerCase() === "api-key" || t.toLowerCase() === "x-api-key" || t.toLowerCase() === "cookie" || t.toLowerCase() === "set-cookie" ? "***" : n]))), "retryOfRequestLogID" in e && (e.retryOfRequestLogID && (e.retryOf = e.retryOfRequestLogID), delete e.retryOfRequestLogID), e), Un, dr = class zn {
  constructor(t, n, r) {
    this.iterator = t, Un.set(this, void 0), this.controller = n, G(this, Un, r, "f");
  }
  static fromSSEResponse(t, n, r, o) {
    let i = !1;
    const s = r ? ae(r) : console;
    async function* u() {
      if (i) throw new O("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      i = !0;
      let c = !1;
      try {
        for await (const d of zw(t, n))
          if (!c) {
            if (d.data.startsWith("[DONE]")) {
              c = !0;
              continue;
            }
            if (d.event === null || !d.event.startsWith("thread.")) {
              let h;
              try {
                h = JSON.parse(d.data);
              } catch (f) {
                throw s.error("Could not parse message into JSON:", d.data), s.error("From chunk:", d.raw), f;
              }
              if (h && h.error) throw new de(void 0, h.error, void 0, t.headers);
              yield o ? {
                event: d.event,
                data: h
              } : h;
            } else {
              let h;
              try {
                h = JSON.parse(d.data);
              } catch (f) {
                throw console.error("Could not parse message into JSON:", d.data), console.error("From chunk:", d.raw), f;
              }
              if (d.event == "error") throw new de(void 0, h.error, h.message, void 0);
              yield {
                event: d.event,
                data: h
              };
            }
          }
        c = !0;
      } catch (d) {
        if (cs(d)) return;
        throw d;
      } finally {
        c || n.abort();
      }
    }
    return new zn(u, n, r);
  }
  static fromReadableStream(t, n, r) {
    let o = !1;
    async function* i() {
      const u = new Qo(), c = Vh(t);
      for await (const d of c) for (const h of u.decode(d)) yield h;
      for (const d of u.flush()) yield d;
    }
    async function* s() {
      if (o) throw new O("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      o = !0;
      let u = !1;
      try {
        for await (const c of i())
          u || c && (yield JSON.parse(c));
        u = !0;
      } catch (c) {
        if (cs(c)) return;
        throw c;
      } finally {
        u || n.abort();
      }
    }
    return new zn(s, n, r);
  }
  [(Un = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return this.iterator();
  }
  tee() {
    const t = [], n = [], r = this.iterator(), o = (i) => ({ next: () => {
      if (i.length === 0) {
        const s = r.next();
        t.push(s), n.push(s);
      }
      return i.shift();
    } });
    return [new zn(() => o(t), this.controller, S(this, Un, "f")), new zn(() => o(n), this.controller, S(this, Un, "f"))];
  }
  toReadableStream() {
    const t = this;
    let n;
    return qh({
      async start() {
        n = t[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          const { value: o, done: i } = await n.next();
          if (i) return r.close();
          const s = ua(JSON.stringify(o) + `
`);
          r.enqueue(s);
        } catch (o) {
          r.error(o);
        }
      },
      async cancel() {
        await n.return?.();
      }
    });
  }
};
async function* zw(e, t) {
  if (!e.body)
    throw t.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new O("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new O("Attempted to iterate over a response with no body");
  const n = new Xw(), r = new Qo(), o = Vh(e.body);
  for await (const i of Yw(o)) for (const s of r.decode(i)) {
    const u = n.decode(s);
    u && (yield u);
  }
  for (const i of r.flush()) {
    const s = n.decode(i);
    s && (yield s);
  }
}
async function* Yw(e) {
  let t = new Uint8Array();
  for await (const n of e) {
    if (n == null) continue;
    const r = n instanceof ArrayBuffer ? new Uint8Array(n) : typeof n == "string" ? ua(n) : n;
    let o = new Uint8Array(t.length + r.length);
    o.set(t), o.set(r, t.length), t = o;
    let i;
    for (; (i = Kw(t)) !== -1; )
      yield t.slice(0, i), t = t.slice(i);
  }
  t.length > 0 && (yield t);
}
var Xw = class {
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length) return null;
      const o = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], o;
    }
    if (this.chunks.push(e), e.startsWith(":")) return null;
    let [t, n, r] = Qw(e, ":");
    return r.startsWith(" ") && (r = r.substring(1)), t === "event" ? this.event = r : t === "data" && this.data.push(r), null;
  }
};
function Qw(e, t) {
  const n = e.indexOf(t);
  return n !== -1 ? [
    e.substring(0, n),
    t,
    e.substring(n + t.length)
  ] : [
    e,
    "",
    ""
  ];
}
async function Xh(e, t) {
  const { response: n, requestLogID: r, retryOfRequestLogID: o, startTime: i } = t, s = await (async () => {
    if (t.options.stream)
      return ae(e).debug("response", n.status, n.url, n.headers, n.body), t.options.__streamClass ? t.options.__streamClass.fromSSEResponse(n, t.controller, e, t.options.__synthesizeEventData) : dr.fromSSEResponse(n, t.controller, e, t.options.__synthesizeEventData);
    if (n.status === 204) return null;
    if (t.options.__binaryResponse) return n;
    const u = n.headers.get("content-type")?.split(";")[0]?.trim();
    return u?.includes("application/json") || u?.endsWith("+json") ? n.headers.get("content-length") === "0" ? void 0 : Qh(await n.json(), n) : await n.text();
  })();
  return ae(e).debug(`[${r}] response parsed`, kt({
    retryOfRequestLogID: o,
    url: n.url,
    status: n.status,
    body: s,
    durationMs: Date.now() - i
  })), s;
}
function Qh(e, t) {
  return !e || typeof e != "object" || Array.isArray(e) ? e : Object.defineProperty(e, "_request_id", {
    value: t.headers.get("x-request-id"),
    enumerable: !1
  });
}
var Yn, Zh = class jh extends Promise {
  constructor(t, n, r = Xh) {
    super((o) => {
      o(null);
    }), this.responsePromise = n, this.parseResponse = r, Yn.set(this, void 0), G(this, Yn, t, "f");
  }
  _thenUnwrap(t) {
    return new jh(S(this, Yn, "f"), this.responsePromise, async (n, r) => Qh(t(await this.parseResponse(n, r), r), r.response));
  }
  asResponse() {
    return this.responsePromise.then((t) => t.response);
  }
  async withResponse() {
    const [t, n] = await Promise.all([this.parse(), this.asResponse()]);
    return {
      data: t,
      response: n,
      request_id: n.headers.get("x-request-id")
    };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then((t) => this.parseResponse(S(this, Yn, "f"), t))), this.parsedPromise;
  }
  then(t, n) {
    return this.parse().then(t, n);
  }
  catch(t) {
    return this.parse().catch(t);
  }
  finally(t) {
    return this.parse().finally(t);
  }
};
Yn = /* @__PURE__ */ new WeakMap();
var Xr, Zo = class {
  constructor(e, t, n, r) {
    Xr.set(this, void 0), G(this, Xr, e, "f"), this.options = r, this.response = t, this.body = n;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageRequestOptions() != null : !1;
  }
  async getNextPage() {
    const e = this.nextPageRequestOptions();
    if (!e) throw new O("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    return await S(this, Xr, "f").requestAPIList(this.constructor, e);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(Xr = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const e of this.iterPages()) for (const t of e.getPaginatedItems()) yield t;
  }
}, Zw = class extends Zh {
  constructor(e, t, n) {
    super(e, t, async (r, o) => new n(r, o.response, await Xh(r, o), o.options));
  }
  async *[Symbol.asyncIterator]() {
    const e = await this;
    for await (const t of e) yield t;
  }
}, wt = class extends Zo {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.object = n.object;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  nextPageRequestOptions() {
    return null;
  }
}, Q = class extends Zo {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.has_more = n.has_more || !1;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    const e = this.getPaginatedItems(), t = e[e.length - 1]?.id;
    return t ? {
      ...this.options,
      query: {
        ...la(this.options.query),
        after: t
      }
    } : null;
  }
}, ce = class extends Zo {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.has_more = n.has_more || !1, this.last_id = n.last_id || "";
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    const e = this.last_id;
    return e ? {
      ...this.options,
      query: {
        ...la(this.options.query),
        after: e
      }
    } : null;
  }
}, ht = class extends Zo {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.has_more = n.has_more || !1, this.next = n.next || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    const e = this.next;
    return e ? {
      ...this.options,
      query: {
        ...la(this.options.query),
        after: e
      }
    } : null;
  }
}, jw = {
  jwt: "urn:ietf:params:oauth:token-type:jwt",
  id: "urn:ietf:params:oauth:token-type:id_token"
}, eI = "urn:ietf:params:oauth:grant-type:token-exchange", tI = class {
  constructor(e, t) {
    this.cachedToken = null, this.refreshPromise = null, this.tokenExchangeUrl = "https://auth.openai.com/oauth/token", this.config = e, this.fetch = t ?? Bh();
  }
  async getToken() {
    if (!this.cachedToken || this.isTokenExpired(this.cachedToken)) {
      if (this.refreshPromise) return await this.refreshPromise;
      this.refreshPromise = this.refreshToken();
      try {
        return await this.refreshPromise;
      } finally {
        this.refreshPromise = null;
      }
    }
    return this.needsRefresh(this.cachedToken) && !this.refreshPromise && (this.refreshPromise = this.refreshToken().finally(() => {
      this.refreshPromise = null;
    })), this.cachedToken.token;
  }
  async refreshToken() {
    const e = {
      grant_type: eI,
      subject_token: await this.config.provider.getToken(),
      subject_token_type: jw[this.config.provider.tokenType],
      identity_provider_id: this.config.identityProviderId,
      service_account_id: this.config.serviceAccountId
    };
    this.config.clientId && (e.client_id = this.config.clientId);
    const t = await this.fetch(this.tokenExchangeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e)
    });
    if (!t.ok) {
      const i = await t.text();
      let s;
      try {
        s = JSON.parse(i);
      } catch {
      }
      throw t.status === 400 || t.status === 401 || t.status === 403 ? new Gh(t.status, s, t.headers) : de.generate(t.status, s, `Token exchange failed with status ${t.status}`, t.headers);
    }
    const n = await t.json(), r = n.expires_in || 3600, o = Date.now() + r * 1e3;
    return this.cachedToken = {
      token: n.access_token,
      expiresAt: o
    }, n.access_token;
  }
  isTokenExpired(e) {
    return Date.now() >= e.expiresAt;
  }
  needsRefresh(e) {
    const t = (this.config.refreshBufferSeconds ?? 1200) * 1e3;
    return Date.now() >= e.expiresAt - t;
  }
  invalidateToken() {
    this.cachedToken = null, this.refreshPromise = null;
  }
}, ep = () => {
  if (typeof File > "u") {
    const { process: e } = globalThis, t = typeof e?.versions?.node == "string" && parseInt(e.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (t ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
};
function rr(e, t, n) {
  return ep(), new File(e, t ?? "unknown_file", n);
}
function uo(e) {
  return (typeof e == "object" && e !== null && ("name" in e && e.name && String(e.name) || "url" in e && e.url && String(e.url) || "filename" in e && e.filename && String(e.filename) || "path" in e && e.path && String(e.path)) || "").split(/[\\/]/).pop() || void 0;
}
var ca = (e) => e != null && typeof e == "object" && typeof e[Symbol.asyncIterator] == "function", jo = async (e, t) => ps(e.body) ? {
  ...e,
  body: await tp(e.body, t)
} : e, Ze = async (e, t) => ({
  ...e,
  body: await tp(e.body, t)
}), kc = /* @__PURE__ */ new WeakMap();
function nI(e) {
  const t = typeof e == "function" ? e : e.fetch, n = kc.get(t);
  if (n) return n;
  const r = (async () => {
    try {
      const o = "Response" in t ? t.Response : (await t("data:,")).constructor, i = new FormData();
      return i.toString() !== await new o(i).text();
    } catch {
      return !0;
    }
  })();
  return kc.set(t, r), r;
}
var tp = async (e, t) => {
  if (!await nI(t)) throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  const n = new FormData();
  return await Promise.all(Object.entries(e || {}).map(([r, o]) => ms(n, r, o))), n;
}, np = (e) => e instanceof Blob && "name" in e, rI = (e) => typeof e == "object" && e !== null && (e instanceof Response || ca(e) || np(e)), ps = (e) => {
  if (rI(e)) return !0;
  if (Array.isArray(e)) return e.some(ps);
  if (e && typeof e == "object") {
    for (const t in e) if (ps(e[t])) return !0;
  }
  return !1;
}, ms = async (e, t, n) => {
  if (n !== void 0) {
    if (n == null) throw new TypeError(`Received null for "${t}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") e.append(t, String(n));
    else if (n instanceof Response) e.append(t, rr([await n.blob()], uo(n)));
    else if (ca(n)) e.append(t, rr([await new Response(Hh(n)).blob()], uo(n)));
    else if (np(n)) e.append(t, n, uo(n));
    else if (Array.isArray(n)) await Promise.all(n.map((r) => ms(e, t + "[]", r)));
    else if (typeof n == "object") await Promise.all(Object.entries(n).map(([r, o]) => ms(e, `${t}[${r}]`, o)));
    else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${n} instead`);
  }
}, rp = (e) => e != null && typeof e == "object" && typeof e.size == "number" && typeof e.type == "string" && typeof e.text == "function" && typeof e.slice == "function" && typeof e.arrayBuffer == "function", oI = (e) => e != null && typeof e == "object" && typeof e.name == "string" && typeof e.lastModified == "number" && rp(e), iI = (e) => e != null && typeof e == "object" && typeof e.url == "string" && typeof e.blob == "function";
async function sI(e, t, n) {
  if (ep(), e = await e, oI(e))
    return e instanceof File ? e : rr([await e.arrayBuffer()], e.name);
  if (iI(e)) {
    const o = await e.blob();
    return t || (t = new URL(e.url).pathname.split(/[\\/]/).pop()), rr(await gs(o), t, n);
  }
  const r = await gs(e);
  if (t || (t = uo(e)), !n?.type) {
    const o = r.find((i) => typeof i == "object" && "type" in i && i.type);
    typeof o == "string" && (n = {
      ...n,
      type: o
    });
  }
  return rr(r, t, n);
}
async function gs(e) {
  let t = [];
  if (typeof e == "string" || ArrayBuffer.isView(e) || e instanceof ArrayBuffer) t.push(e);
  else if (rp(e)) t.push(e instanceof Blob ? e : await e.arrayBuffer());
  else if (ca(e)) for await (const n of e) t.push(...await gs(n));
  else {
    const n = e?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof e}${n ? `; constructor: ${n}` : ""}${aI(e)}`);
  }
  return t;
}
function aI(e) {
  return typeof e != "object" || e === null ? "" : `; props: [${Object.getOwnPropertyNames(e).map((t) => `"${t}"`).join(", ")}]`;
}
var M = class {
  constructor(e) {
    this._client = e;
  }
};
function op(e) {
  return e.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var Dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null)), lI = (e = op) => function(n, ...r) {
  if (n.length === 1) return n[0];
  let o = !1;
  const i = [], s = n.reduce((h, f, p) => {
    /[?#]/.test(f) && (o = !0);
    const m = r[p];
    let g = (o ? encodeURIComponent : e)("" + m);
    return p !== r.length && (m == null || typeof m == "object" && m.toString === Object.getPrototypeOf(Object.getPrototypeOf(m.hasOwnProperty ?? Dc) ?? Dc)?.toString) && (g = m + "", i.push({
      start: h.length + f.length,
      length: g.length,
      error: `Value of type ${Object.prototype.toString.call(m).slice(8, -1)} is not a valid path parameter`
    })), h + f + (p === r.length ? "" : g);
  }, ""), u = s.split(/[?#]/, 1)[0], c = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
  let d;
  for (; (d = c.exec(u)) !== null; ) i.push({
    start: d.index,
    length: d[0].length,
    error: `Value "${d[0]}" can't be safely passed as a path parameter`
  });
  if (i.sort((h, f) => h.start - f.start), i.length > 0) {
    let h = 0;
    const f = i.reduce((p, m) => {
      const g = " ".repeat(m.start - h), _ = "^".repeat(m.length);
      return h = m.start + m.length, p + g + _;
    }, "");
    throw new O(`Path parameters result in path with invalid segments:
${i.map((p) => p.error).join(`
`)}
${s}
${f}`);
  }
  return s;
}, v = /* @__PURE__ */ lI(op), ip = class extends M {
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/chat/completions/${e}/messages`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
};
function Mo(e) {
  return e !== void 0 && "function" in e && e.function !== void 0;
}
function da(e) {
  return e?.$brand === "auto-parseable-response-format";
}
function Cr(e) {
  return e?.$brand === "auto-parseable-tool";
}
function uI(e, t) {
  return !t || !sp(t) ? {
    ...e,
    choices: e.choices.map((n) => (ap(n.message.tool_calls), {
      ...n,
      message: {
        ...n.message,
        parsed: null,
        ...n.message.tool_calls ? { tool_calls: n.message.tool_calls } : void 0
      }
    }))
  } : fa(e, t);
}
function fa(e, t) {
  const n = e.choices.map((r) => {
    if (r.finish_reason === "length") throw new Fh();
    if (r.finish_reason === "content_filter") throw new Oh();
    return ap(r.message.tool_calls), {
      ...r,
      message: {
        ...r.message,
        ...r.message.tool_calls ? { tool_calls: r.message.tool_calls?.map((o) => dI(t, o)) ?? void 0 } : void 0,
        parsed: r.message.content && !r.message.refusal ? cI(t, r.message.content) : null
      }
    };
  });
  return {
    ...e,
    choices: n
  };
}
function cI(e, t) {
  return e.response_format?.type !== "json_schema" ? null : e.response_format?.type === "json_schema" ? "$parseRaw" in e.response_format ? e.response_format.$parseRaw(t) : JSON.parse(t) : null;
}
function dI(e, t) {
  const n = e.tools?.find((r) => Mo(r) && r.function?.name === t.function.name);
  return {
    ...t,
    function: {
      ...t.function,
      parsed_arguments: Cr(n) ? n.$parseRaw(t.function.arguments) : n?.function.strict ? JSON.parse(t.function.arguments) : null
    }
  };
}
function fI(e, t) {
  if (!e || !("tools" in e) || !e.tools) return !1;
  const n = e.tools?.find((r) => Mo(r) && r.function?.name === t.function.name);
  return Mo(n) && (Cr(n) || n?.function.strict || !1);
}
function sp(e) {
  return da(e.response_format) ? !0 : e.tools?.some((t) => Cr(t) || t.type === "function" && t.function.strict === !0) ?? !1;
}
function ap(e) {
  for (const t of e || []) if (t.type !== "function") throw new O(`Currently only \`function\` tool calls are supported; Received \`${t.type}\``);
}
function hI(e) {
  for (const t of e ?? []) {
    if (t.type !== "function") throw new O(`Currently only \`function\` tool types support auto-parsing; Received \`${t.type}\``);
    if (t.function.strict !== !0) throw new O(`The \`${t.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
  }
}
var xo = (e) => e?.role === "assistant", lp = (e) => e?.role === "tool", _s, co, fo, Xn, Qn, ho, Zn, rt, jn, No, ko, Qt, up, ha = class {
  constructor() {
    _s.add(this), this.controller = new AbortController(), co.set(this, void 0), fo.set(this, () => {
    }), Xn.set(this, () => {
    }), Qn.set(this, void 0), ho.set(this, () => {
    }), Zn.set(this, () => {
    }), rt.set(this, {}), jn.set(this, !1), No.set(this, !1), ko.set(this, !1), Qt.set(this, !1), G(this, co, new Promise((e, t) => {
      G(this, fo, e, "f"), G(this, Xn, t, "f");
    }), "f"), G(this, Qn, new Promise((e, t) => {
      G(this, ho, e, "f"), G(this, Zn, t, "f");
    }), "f"), S(this, co, "f").catch(() => {
    }), S(this, Qn, "f").catch(() => {
    });
  }
  _run(e) {
    setTimeout(() => {
      e().then(() => {
        this._emitFinal(), this._emit("end");
      }, S(this, _s, "m", up).bind(this));
    }, 0);
  }
  _connected() {
    this.ended || (S(this, fo, "f").call(this), this._emit("connect"));
  }
  get ended() {
    return S(this, jn, "f");
  }
  get errored() {
    return S(this, No, "f");
  }
  get aborted() {
    return S(this, ko, "f");
  }
  abort() {
    this.controller.abort();
  }
  on(e, t) {
    return (S(this, rt, "f")[e] || (S(this, rt, "f")[e] = [])).push({ listener: t }), this;
  }
  off(e, t) {
    const n = S(this, rt, "f")[e];
    if (!n) return this;
    const r = n.findIndex((o) => o.listener === t);
    return r >= 0 && n.splice(r, 1), this;
  }
  once(e, t) {
    return (S(this, rt, "f")[e] || (S(this, rt, "f")[e] = [])).push({
      listener: t,
      once: !0
    }), this;
  }
  emitted(e) {
    return new Promise((t, n) => {
      G(this, Qt, !0, "f"), e !== "error" && this.once("error", n), this.once(e, t);
    });
  }
  async done() {
    G(this, Qt, !0, "f"), await S(this, Qn, "f");
  }
  _emit(e, ...t) {
    if (S(this, jn, "f")) return;
    e === "end" && (G(this, jn, !0, "f"), S(this, ho, "f").call(this));
    const n = S(this, rt, "f")[e];
    if (n && (S(this, rt, "f")[e] = n.filter((r) => !r.once), n.forEach(({ listener: r }) => r(...t))), e === "abort") {
      const r = t[0];
      !S(this, Qt, "f") && !n?.length && Promise.reject(r), S(this, Xn, "f").call(this, r), S(this, Zn, "f").call(this, r), this._emit("end");
      return;
    }
    if (e === "error") {
      const r = t[0];
      !S(this, Qt, "f") && !n?.length && Promise.reject(r), S(this, Xn, "f").call(this, r), S(this, Zn, "f").call(this, r), this._emit("end");
    }
  }
  _emitFinal() {
  }
};
co = /* @__PURE__ */ new WeakMap(), fo = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), Qn = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new WeakMap(), Zn = /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ new WeakMap(), jn = /* @__PURE__ */ new WeakMap(), No = /* @__PURE__ */ new WeakMap(), ko = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakMap(), _s = /* @__PURE__ */ new WeakSet(), up = function(t) {
  if (G(this, No, !0, "f"), t instanceof Error && t.name === "AbortError" && (t = new ke()), t instanceof ke)
    return G(this, ko, !0, "f"), this._emit("abort", t);
  if (t instanceof O) return this._emit("error", t);
  if (t instanceof Error) {
    const n = new O(t.message);
    return n.cause = t, this._emit("error", n);
  }
  return this._emit("error", new O(String(t)));
};
function pI(e) {
  return typeof e.parse == "function";
}
var fe, ys, Do, vs, As, Ts, cp, dp, mI = 10, fp = class extends ha {
  constructor() {
    super(...arguments), fe.add(this), this._chatCompletions = [], this.messages = [];
  }
  _addChatCompletion(e) {
    this._chatCompletions.push(e), this._emit("chatCompletion", e);
    const t = e.choices[0]?.message;
    return t && this._addMessage(t), e;
  }
  _addMessage(e, t = !0) {
    if ("content" in e || (e.content = null), this.messages.push(e), t) {
      if (this._emit("message", e), lp(e) && e.content) this._emit("functionToolCallResult", e.content);
      else if (xo(e) && e.tool_calls)
        for (const n of e.tool_calls) n.type === "function" && this._emit("functionToolCall", n.function);
    }
  }
  async finalChatCompletion() {
    await this.done();
    const e = this._chatCompletions[this._chatCompletions.length - 1];
    if (!e) throw new O("stream ended without producing a ChatCompletion");
    return e;
  }
  async finalContent() {
    return await this.done(), S(this, fe, "m", ys).call(this);
  }
  async finalMessage() {
    return await this.done(), S(this, fe, "m", Do).call(this);
  }
  async finalFunctionToolCall() {
    return await this.done(), S(this, fe, "m", vs).call(this);
  }
  async finalFunctionToolCallResult() {
    return await this.done(), S(this, fe, "m", As).call(this);
  }
  async totalUsage() {
    return await this.done(), S(this, fe, "m", Ts).call(this);
  }
  allChatCompletions() {
    return [...this._chatCompletions];
  }
  _emitFinal() {
    const e = this._chatCompletions[this._chatCompletions.length - 1];
    e && this._emit("finalChatCompletion", e);
    const t = S(this, fe, "m", Do).call(this);
    t && this._emit("finalMessage", t);
    const n = S(this, fe, "m", ys).call(this);
    n && this._emit("finalContent", n);
    const r = S(this, fe, "m", vs).call(this);
    r && this._emit("finalFunctionToolCall", r);
    const o = S(this, fe, "m", As).call(this);
    o != null && this._emit("finalFunctionToolCallResult", o), this._chatCompletions.some((i) => i.usage) && this._emit("totalUsage", S(this, fe, "m", Ts).call(this));
  }
  async _createChatCompletion(e, t, n) {
    const r = n?.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), S(this, fe, "m", cp).call(this, t);
    const o = await e.chat.completions.create({
      ...t,
      stream: !1
    }, {
      ...n,
      signal: this.controller.signal
    });
    return this._connected(), this._addChatCompletion(fa(o, t));
  }
  async _runChatCompletion(e, t, n) {
    for (const r of t.messages) this._addMessage(r, !1);
    return await this._createChatCompletion(e, t, n);
  }
  async _runTools(e, t, n) {
    const r = "tool", { tool_choice: o = "auto", stream: i, ...s } = t, u = typeof o != "string" && o.type === "function" && o?.function?.name, { maxChatCompletions: c = mI } = n || {}, d = t.tools.map((p) => {
      if (Cr(p)) {
        if (!p.$callback) throw new O("Tool given to `.runTools()` that does not have an associated function");
        return {
          type: "function",
          function: {
            function: p.$callback,
            name: p.function.name,
            description: p.function.description || "",
            parameters: p.function.parameters,
            parse: p.$parseRaw,
            strict: !0
          }
        };
      }
      return p;
    }), h = {};
    for (const p of d) p.type === "function" && (h[p.function.name || p.function.function.name] = p.function);
    const f = "tools" in t ? d.map((p) => p.type === "function" ? {
      type: "function",
      function: {
        name: p.function.name || p.function.function.name,
        parameters: p.function.parameters,
        description: p.function.description,
        strict: p.function.strict
      }
    } : p) : void 0;
    for (const p of t.messages) this._addMessage(p, !1);
    for (let p = 0; p < c; ++p) {
      const m = (await this._createChatCompletion(e, {
        ...s,
        tool_choice: o,
        tools: f,
        messages: [...this.messages]
      }, n)).choices[0]?.message;
      if (!m) throw new O("missing message in ChatCompletion response");
      if (!m.tool_calls?.length) return;
      for (const g of m.tool_calls) {
        if (g.type !== "function") continue;
        const _ = g.id, { name: y, arguments: E } = g.function, A = h[y];
        if (A) {
          if (u && u !== y) {
            const C = `Invalid tool_call: ${JSON.stringify(y)}. ${JSON.stringify(u)} requested. Please try again`;
            this._addMessage({
              role: r,
              tool_call_id: _,
              content: C
            });
            continue;
          }
        } else {
          const C = `Invalid tool_call: ${JSON.stringify(y)}. Available options are: ${Object.keys(h).map((k) => JSON.stringify(k)).join(", ")}. Please try again`;
          this._addMessage({
            role: r,
            tool_call_id: _,
            content: C
          });
          continue;
        }
        let w;
        try {
          w = pI(A) ? await A.parse(E) : E;
        } catch (C) {
          const k = C instanceof Error ? C.message : String(C);
          this._addMessage({
            role: r,
            tool_call_id: _,
            content: k
          });
          continue;
        }
        const P = await A.function(w, this), L = S(this, fe, "m", dp).call(this, P);
        if (this._addMessage({
          role: r,
          tool_call_id: _,
          content: L
        }), u) return;
      }
    }
  }
};
fe = /* @__PURE__ */ new WeakSet(), ys = function() {
  return S(this, fe, "m", Do).call(this).content ?? null;
}, Do = function() {
  let t = this.messages.length;
  for (; t-- > 0; ) {
    const n = this.messages[t];
    if (xo(n)) return {
      ...n,
      content: n.content ?? null,
      refusal: n.refusal ?? null
    };
  }
  throw new O("stream ended without producing a ChatCompletionMessage with role=assistant");
}, vs = function() {
  for (let t = this.messages.length - 1; t >= 0; t--) {
    const n = this.messages[t];
    if (xo(n) && n?.tool_calls?.length) for (let r = n.tool_calls.length - 1; r >= 0; r--) {
      const o = n.tool_calls[r];
      if (o?.type === "function") return o.function;
    }
  }
}, As = function() {
  for (let t = this.messages.length - 1; t >= 0; t--) {
    const n = this.messages[t];
    if (lp(n) && n.content != null && typeof n.content == "string" && this.messages.some((r) => r.role === "assistant" && r.tool_calls?.some((o) => o.type === "function" && o.id === n.tool_call_id))) return n.content;
  }
}, Ts = function() {
  const t = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  for (const { usage: n } of this._chatCompletions) n && (t.completion_tokens += n.completion_tokens, t.prompt_tokens += n.prompt_tokens, t.total_tokens += n.total_tokens);
  return t;
}, cp = function(t) {
  if (t.n != null && t.n > 1) throw new O("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
}, dp = function(t) {
  return typeof t == "string" ? t : t === void 0 ? "undefined" : JSON.stringify(t);
};
var gI = class hp extends fp {
  static runTools(t, n, r) {
    const o = new hp(), i = {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "runTools"
      }
    };
    return o._run(() => o._runTools(t, n, i)), o;
  }
  _addMessage(t, n = !0) {
    super._addMessage(t, n), xo(t) && t.content && this._emit("content", t.content);
  }
}, ie = {
  STR: 1,
  NUM: 2,
  ARR: 4,
  OBJ: 8,
  NULL: 16,
  BOOL: 32,
  NAN: 64,
  INFINITY: 128,
  MINUS_INFINITY: 256,
  INF: 384,
  SPECIAL: 496,
  ATOM: 499,
  COLLECTION: 12,
  ALL: 511
}, _I = class extends Error {
}, yI = class extends Error {
};
function vI(e, t = ie.ALL) {
  if (typeof e != "string") throw new TypeError(`expecting str, got ${typeof e}`);
  if (!e.trim()) throw new Error(`${e} is empty`);
  return AI(e.trim(), t);
}
var AI = (e, t) => {
  const n = e.length;
  let r = 0;
  const o = (p) => {
    throw new _I(`${p} at position ${r}`);
  }, i = (p) => {
    throw new yI(`${p} at position ${r}`);
  }, s = () => (f(), r >= n && o("Unexpected end of input"), e[r] === '"' ? u() : e[r] === "{" ? c() : e[r] === "[" ? d() : e.substring(r, r + 4) === "null" || ie.NULL & t && n - r < 4 && "null".startsWith(e.substring(r)) ? (r += 4, null) : e.substring(r, r + 4) === "true" || ie.BOOL & t && n - r < 4 && "true".startsWith(e.substring(r)) ? (r += 4, !0) : e.substring(r, r + 5) === "false" || ie.BOOL & t && n - r < 5 && "false".startsWith(e.substring(r)) ? (r += 5, !1) : e.substring(r, r + 8) === "Infinity" || ie.INFINITY & t && n - r < 8 && "Infinity".startsWith(e.substring(r)) ? (r += 8, 1 / 0) : e.substring(r, r + 9) === "-Infinity" || ie.MINUS_INFINITY & t && 1 < n - r && n - r < 9 && "-Infinity".startsWith(e.substring(r)) ? (r += 9, -1 / 0) : e.substring(r, r + 3) === "NaN" || ie.NAN & t && n - r < 3 && "NaN".startsWith(e.substring(r)) ? (r += 3, NaN) : h()), u = () => {
    const p = r;
    let m = !1;
    for (r++; r < n && (e[r] !== '"' || m && e[r - 1] === "\\"); )
      m = e[r] === "\\" ? !m : !1, r++;
    if (e.charAt(r) == '"') try {
      return JSON.parse(e.substring(p, ++r - Number(m)));
    } catch (g) {
      i(String(g));
    }
    else if (ie.STR & t) try {
      return JSON.parse(e.substring(p, r - Number(m)) + '"');
    } catch {
      return JSON.parse(e.substring(p, e.lastIndexOf("\\")) + '"');
    }
    o("Unterminated string literal");
  }, c = () => {
    r++, f();
    const p = {};
    try {
      for (; e[r] !== "}"; ) {
        if (f(), r >= n && ie.OBJ & t) return p;
        const m = u();
        f(), r++;
        try {
          const g = s();
          Object.defineProperty(p, m, {
            value: g,
            writable: !0,
            enumerable: !0,
            configurable: !0
          });
        } catch (g) {
          if (ie.OBJ & t) return p;
          throw g;
        }
        f(), e[r] === "," && r++;
      }
    } catch {
      if (ie.OBJ & t) return p;
      o("Expected '}' at end of object");
    }
    return r++, p;
  }, d = () => {
    r++;
    const p = [];
    try {
      for (; e[r] !== "]"; )
        p.push(s()), f(), e[r] === "," && r++;
    } catch {
      if (ie.ARR & t) return p;
      o("Expected ']' at end of array");
    }
    return r++, p;
  }, h = () => {
    if (r === 0) {
      e === "-" && ie.NUM & t && o("Not sure what '-' is");
      try {
        return JSON.parse(e);
      } catch (m) {
        if (ie.NUM & t) try {
          return e[e.length - 1] === "." ? JSON.parse(e.substring(0, e.lastIndexOf("."))) : JSON.parse(e.substring(0, e.lastIndexOf("e")));
        } catch {
        }
        i(String(m));
      }
    }
    const p = r;
    for (e[r] === "-" && r++; e[r] && !",]}".includes(e[r]); ) r++;
    r == n && !(ie.NUM & t) && o("Unterminated number literal");
    try {
      return JSON.parse(e.substring(p, r));
    } catch {
      e.substring(p, r) === "-" && ie.NUM & t && o("Not sure what '-' is");
      try {
        return JSON.parse(e.substring(p, e.lastIndexOf("e")));
      } catch (g) {
        i(String(g));
      }
    }
  }, f = () => {
    for (; r < n && [
      32,
      10,
      13,
      9
    ].includes(e.charCodeAt(r)); ) r++;
  };
  return s();
}, $c = (e) => vI(e, ie.ALL ^ ie.NUM), te, nt, Kt, _t, bi, Qr, Ri, Pi, Mi, Zr, xi, Lc, pp = class Ss extends fp {
  constructor(t) {
    super(), te.add(this), nt.set(this, void 0), Kt.set(this, void 0), _t.set(this, void 0), G(this, nt, t, "f"), G(this, Kt, [], "f");
  }
  get currentChatCompletionSnapshot() {
    return S(this, _t, "f");
  }
  static fromReadableStream(t) {
    const n = new Ss(null);
    return n._run(() => n._fromReadableStream(t)), n;
  }
  static createChatCompletion(t, n, r) {
    const o = new Ss(n);
    return o._run(() => o._runChatCompletion(t, {
      ...n,
      stream: !0
    }, {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), o;
  }
  async _createChatCompletion(t, n, r) {
    super._createChatCompletion;
    const o = r?.signal;
    o && (o.aborted && this.controller.abort(), o.addEventListener("abort", () => this.controller.abort())), S(this, te, "m", bi).call(this);
    const i = await t.chat.completions.create({
      ...n,
      stream: !0
    }, {
      ...r,
      signal: this.controller.signal
    });
    this._connected();
    for await (const s of i) S(this, te, "m", Ri).call(this, s);
    if (i.controller.signal?.aborted) throw new ke();
    return this._addChatCompletion(S(this, te, "m", Zr).call(this));
  }
  async _fromReadableStream(t, n) {
    const r = n?.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), S(this, te, "m", bi).call(this), this._connected();
    const o = dr.fromReadableStream(t, this.controller);
    let i;
    for await (const s of o)
      i && i !== s.id && this._addChatCompletion(S(this, te, "m", Zr).call(this)), S(this, te, "m", Ri).call(this, s), i = s.id;
    if (o.controller.signal?.aborted) throw new ke();
    return this._addChatCompletion(S(this, te, "m", Zr).call(this));
  }
  [(nt = /* @__PURE__ */ new WeakMap(), Kt = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakSet(), bi = function() {
    this.ended || G(this, _t, void 0, "f");
  }, Qr = function(n) {
    let r = S(this, Kt, "f")[n.index];
    return r || (r = {
      content_done: !1,
      refusal_done: !1,
      logprobs_content_done: !1,
      logprobs_refusal_done: !1,
      done_tool_calls: /* @__PURE__ */ new Set(),
      current_tool_call_index: null
    }, S(this, Kt, "f")[n.index] = r, r);
  }, Ri = function(n) {
    if (this.ended) return;
    const r = S(this, te, "m", Lc).call(this, n);
    this._emit("chunk", n, r);
    for (const o of n.choices) {
      const i = r.choices[o.index];
      o.delta.content != null && i.message?.role === "assistant" && i.message?.content && (this._emit("content", o.delta.content, i.message.content), this._emit("content.delta", {
        delta: o.delta.content,
        snapshot: i.message.content,
        parsed: i.message.parsed
      })), o.delta.refusal != null && i.message?.role === "assistant" && i.message?.refusal && this._emit("refusal.delta", {
        delta: o.delta.refusal,
        snapshot: i.message.refusal
      }), o.logprobs?.content != null && i.message?.role === "assistant" && this._emit("logprobs.content.delta", {
        content: o.logprobs?.content,
        snapshot: i.logprobs?.content ?? []
      }), o.logprobs?.refusal != null && i.message?.role === "assistant" && this._emit("logprobs.refusal.delta", {
        refusal: o.logprobs?.refusal,
        snapshot: i.logprobs?.refusal ?? []
      });
      const s = S(this, te, "m", Qr).call(this, i);
      i.finish_reason && (S(this, te, "m", Mi).call(this, i), s.current_tool_call_index != null && S(this, te, "m", Pi).call(this, i, s.current_tool_call_index));
      for (const u of o.delta.tool_calls ?? [])
        s.current_tool_call_index !== u.index && (S(this, te, "m", Mi).call(this, i), s.current_tool_call_index != null && S(this, te, "m", Pi).call(this, i, s.current_tool_call_index)), s.current_tool_call_index = u.index;
      for (const u of o.delta.tool_calls ?? []) {
        const c = i.message.tool_calls?.[u.index];
        c?.type && (c?.type === "function" ? this._emit("tool_calls.function.arguments.delta", {
          name: c.function?.name,
          index: u.index,
          arguments: c.function.arguments,
          parsed_arguments: c.function.parsed_arguments,
          arguments_delta: u.function?.arguments ?? ""
        }) : c?.type);
      }
    }
  }, Pi = function(n, r) {
    if (S(this, te, "m", Qr).call(this, n).done_tool_calls.has(r)) return;
    const o = n.message.tool_calls?.[r];
    if (!o) throw new Error("no tool call snapshot");
    if (!o.type) throw new Error("tool call snapshot missing `type`");
    if (o.type === "function") {
      const i = S(this, nt, "f")?.tools?.find((s) => Mo(s) && s.function.name === o.function.name);
      this._emit("tool_calls.function.arguments.done", {
        name: o.function.name,
        index: r,
        arguments: o.function.arguments,
        parsed_arguments: Cr(i) ? i.$parseRaw(o.function.arguments) : i?.function.strict ? JSON.parse(o.function.arguments) : null
      });
    } else o.type;
  }, Mi = function(n) {
    const r = S(this, te, "m", Qr).call(this, n);
    if (n.message.content && !r.content_done) {
      r.content_done = !0;
      const o = S(this, te, "m", xi).call(this);
      this._emit("content.done", {
        content: n.message.content,
        parsed: o ? o.$parseRaw(n.message.content) : null
      });
    }
    n.message.refusal && !r.refusal_done && (r.refusal_done = !0, this._emit("refusal.done", { refusal: n.message.refusal })), n.logprobs?.content && !r.logprobs_content_done && (r.logprobs_content_done = !0, this._emit("logprobs.content.done", { content: n.logprobs.content })), n.logprobs?.refusal && !r.logprobs_refusal_done && (r.logprobs_refusal_done = !0, this._emit("logprobs.refusal.done", { refusal: n.logprobs.refusal }));
  }, Zr = function() {
    if (this.ended) throw new O("stream has ended, this shouldn't happen");
    const n = S(this, _t, "f");
    if (!n) throw new O("request ended without sending any chunks");
    return G(this, _t, void 0, "f"), G(this, Kt, [], "f"), TI(n, S(this, nt, "f"));
  }, xi = function() {
    const n = S(this, nt, "f")?.response_format;
    return da(n) ? n : null;
  }, Lc = function(n) {
    var r, o, i, s;
    let u = S(this, _t, "f");
    const { choices: c, ...d } = n;
    u ? Object.assign(u, d) : u = G(this, _t, {
      ...d,
      choices: []
    }, "f");
    for (const { delta: h, finish_reason: f, index: p, logprobs: m = null, ...g } of n.choices) {
      let _ = u.choices[p];
      if (_ || (_ = u.choices[p] = {
        finish_reason: f,
        index: p,
        message: {},
        logprobs: m,
        ...g
      }), m) if (!_.logprobs) _.logprobs = Object.assign({}, m);
      else {
        const { content: C, refusal: k, ...I } = m;
        Object.assign(_.logprobs, I), C && ((r = _.logprobs).content ?? (r.content = []), _.logprobs.content.push(...C)), k && ((o = _.logprobs).refusal ?? (o.refusal = []), _.logprobs.refusal.push(...k));
      }
      if (f && (_.finish_reason = f, S(this, nt, "f") && sp(S(this, nt, "f")))) {
        if (f === "length") throw new Fh();
        if (f === "content_filter") throw new Oh();
      }
      if (Object.assign(_, g), !h) continue;
      const { content: y, refusal: E, function_call: A, role: w, tool_calls: P, ...L } = h;
      if (Object.assign(_.message, L), E && (_.message.refusal = (_.message.refusal || "") + E), w && (_.message.role = w), A && (_.message.function_call ? (A.name && (_.message.function_call.name = A.name), A.arguments && ((i = _.message.function_call).arguments ?? (i.arguments = ""), _.message.function_call.arguments += A.arguments)) : _.message.function_call = A), y && (_.message.content = (_.message.content || "") + y, !_.message.refusal && S(this, te, "m", xi).call(this) && (_.message.parsed = $c(_.message.content))), P) {
        _.message.tool_calls || (_.message.tool_calls = []);
        for (const { index: C, id: k, type: I, function: x, ...b } of P) {
          const F = (s = _.message.tool_calls)[C] ?? (s[C] = {});
          Object.assign(F, b), k && (F.id = k), I && (F.type = I), x && (F.function ?? (F.function = {
            name: x.name ?? "",
            arguments: ""
          })), x?.name && (F.function.name = x.name), x?.arguments && (F.function.arguments += x.arguments, fI(S(this, nt, "f"), F) && (F.function.parsed_arguments = $c(F.function.arguments)));
        }
      }
    }
    return u;
  }, Symbol.asyncIterator)]() {
    const t = [], n = [];
    let r = !1;
    return this.on("chunk", (o) => {
      const i = n.shift();
      i ? i.resolve(o) : t.push(o);
    }), this.on("end", () => {
      r = !0;
      for (const o of n) o.resolve(void 0);
      n.length = 0;
    }), this.on("abort", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), this.on("error", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), {
      next: async () => t.length ? {
        value: t.shift(),
        done: !1
      } : r ? {
        value: void 0,
        done: !0
      } : new Promise((o, i) => n.push({
        resolve: o,
        reject: i
      })).then((o) => o ? {
        value: o,
        done: !1
      } : {
        value: void 0,
        done: !0
      }),
      return: async () => (this.abort(), {
        value: void 0,
        done: !0
      })
    };
  }
  toReadableStream() {
    return new dr(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
};
function TI(e, t) {
  const { id: n, choices: r, created: o, model: i, system_fingerprint: s, ...u } = e;
  return uI({
    ...u,
    id: n,
    choices: r.map(({ message: c, finish_reason: d, index: h, logprobs: f, ...p }) => {
      if (!d) throw new O(`missing finish_reason for choice ${h}`);
      const { content: m = null, function_call: g, tool_calls: _, ...y } = c, E = c.role;
      if (!E) throw new O(`missing role for choice ${h}`);
      if (g) {
        const { arguments: A, name: w } = g;
        if (A == null) throw new O(`missing function_call.arguments for choice ${h}`);
        if (!w) throw new O(`missing function_call.name for choice ${h}`);
        return {
          ...p,
          message: {
            content: m,
            function_call: {
              arguments: A,
              name: w
            },
            role: E,
            refusal: c.refusal ?? null
          },
          finish_reason: d,
          index: h,
          logprobs: f
        };
      }
      return _ ? {
        ...p,
        index: h,
        finish_reason: d,
        logprobs: f,
        message: {
          ...y,
          role: E,
          content: m,
          refusal: c.refusal ?? null,
          tool_calls: _.map((A, w) => {
            const { function: P, type: L, id: C, ...k } = A, { arguments: I, name: x, ...b } = P || {};
            if (C == null) throw new O(`missing choices[${h}].tool_calls[${w}].id
${jr(e)}`);
            if (L == null) throw new O(`missing choices[${h}].tool_calls[${w}].type
${jr(e)}`);
            if (x == null) throw new O(`missing choices[${h}].tool_calls[${w}].function.name
${jr(e)}`);
            if (I == null) throw new O(`missing choices[${h}].tool_calls[${w}].function.arguments
${jr(e)}`);
            return {
              ...k,
              id: C,
              type: L,
              function: {
                ...b,
                name: x,
                arguments: I
              }
            };
          })
        }
      } : {
        ...p,
        message: {
          ...y,
          content: m,
          role: E,
          refusal: c.refusal ?? null
        },
        finish_reason: d,
        index: h,
        logprobs: f
      };
    }),
    created: o,
    model: i,
    object: "chat.completion",
    ...s ? { system_fingerprint: s } : {}
  }, t);
}
function jr(e) {
  return JSON.stringify(e);
}
var SI = class Es extends pp {
  static fromReadableStream(t) {
    const n = new Es(null);
    return n._run(() => n._fromReadableStream(t)), n;
  }
  static runTools(t, n, r) {
    const o = new Es(n), i = {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "runTools"
      }
    };
    return o._run(() => o._runTools(t, n, i)), o;
  }
}, pa = class extends M {
  constructor() {
    super(...arguments), this.messages = new ip(this._client);
  }
  create(e, t) {
    return this._client.post("/chat/completions", {
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/chat/completions/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/chat/completions/${e}`, {
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/chat/completions", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/chat/completions/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  parse(e, t) {
    return hI(e.tools), this._client.chat.completions.create(e, {
      ...t,
      headers: {
        ...t?.headers,
        "X-Stainless-Helper-Method": "chat.completions.parse"
      }
    })._thenUnwrap((n) => fa(n, e));
  }
  runTools(e, t) {
    return e.stream ? SI.runTools(this._client, e, t) : gI.runTools(this._client, e, t);
  }
  stream(e, t) {
    return pp.createChatCompletion(this._client, e, t);
  }
};
pa.Messages = ip;
var ma = class extends M {
  constructor() {
    super(...arguments), this.completions = new pa(this._client);
  }
};
ma.Completions = pa;
var mp = class extends M {
  create(e, t) {
    return this._client.post("/organization/admin_api_keys", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/admin_api_keys/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/admin_api_keys", Q, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/admin_api_keys/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, gp = class extends M {
  list(e = {}, t) {
    return this._client.getAPIList("/organization/audit_logs", ce, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, _p = class extends M {
  create(e, t) {
    return this._client.post("/organization/certificates", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t = {}, n) {
    return this._client.get(v`/organization/certificates/${e}`, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/certificates/${e}`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/certificates", ce, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/certificates/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  activate(e, t) {
    return this._client.getAPIList("/organization/certificates/activate", wt, {
      body: e,
      method: "post",
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  deactivate(e, t) {
    return this._client.getAPIList("/organization/certificates/deactivate", wt, {
      body: e,
      method: "post",
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, yp = class extends M {
  retrieve(e) {
    return this._client.get("/organization/data_retention", {
      ...e,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t) {
    return this._client.post("/organization/data_retention", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, vp = class extends M {
  create(e, t) {
    return this._client.post("/organization/invites", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/invites/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/invites", ce, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/invites/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Ap = class extends M {
  create(e, t) {
    return this._client.post("/organization/roles", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/roles/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/roles/${e}`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/roles", ht, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/roles/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Tp = class extends M {
  create(e, t) {
    return this._client.post("/organization/spend_alerts", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/spend_alerts/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/spend_alerts/${e}`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/spend_alerts", ce, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/spend_alerts/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Sp = class extends M {
  audioSpeeches(e, t) {
    return this._client.get("/organization/usage/audio_speeches", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  audioTranscriptions(e, t) {
    return this._client.get("/organization/usage/audio_transcriptions", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  codeInterpreterSessions(e, t) {
    return this._client.get("/organization/usage/code_interpreter_sessions", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  completions(e, t) {
    return this._client.get("/organization/usage/completions", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  costs(e, t) {
    return this._client.get("/organization/costs", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  embeddings(e, t) {
    return this._client.get("/organization/usage/embeddings", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  fileSearchCalls(e, t) {
    return this._client.get("/organization/usage/file_search_calls", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  images(e, t) {
    return this._client.get("/organization/usage/images", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  moderations(e, t) {
    return this._client.get("/organization/usage/moderations", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  vectorStores(e, t) {
    return this._client.get("/organization/usage/vector_stores", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  webSearchCalls(e, t) {
    return this._client.get("/organization/usage/web_search_calls", {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Ep = class extends M {
  create(e, t, n) {
    return this._client.post(v`/organization/groups/${e}/roles`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { group_id: r } = t;
    return this._client.get(v`/organization/groups/${r}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/groups/${e}/roles`, ht, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { group_id: r } = t;
    return this._client.delete(v`/organization/groups/${r}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Cp = class extends M {
  create(e, t, n) {
    return this._client.post(v`/organization/groups/${e}/users`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { group_id: r } = t;
    return this._client.get(v`/organization/groups/${r}/users/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/groups/${e}/users`, ht, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { group_id: r } = t;
    return this._client.delete(v`/organization/groups/${r}/users/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, ei = class extends M {
  constructor() {
    super(...arguments), this.users = new Cp(this._client), this.roles = new Ep(this._client);
  }
  create(e, t) {
    return this._client.post("/organization/groups", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/groups/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/groups/${e}`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/groups", ht, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/groups/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
};
ei.Users = Cp;
ei.Roles = Ep;
var wp = class extends M {
  retrieve(e, t, n) {
    const { project_id: r } = t;
    return this._client.get(v`/organization/projects/${r}/api_keys/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/api_keys`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r } = t;
    return this._client.delete(v`/organization/projects/${r}/api_keys/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Ip = class extends M {
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/certificates`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  activate(e, t, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/certificates/activate`, wt, {
      body: t,
      method: "post",
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  deactivate(e, t, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/certificates/deactivate`, wt, {
      body: t,
      method: "post",
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, bp = class extends M {
  retrieve(e, t) {
    return this._client.get(v`/organization/projects/${e}/data_retention`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/data_retention`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Rp = class extends M {
  retrieve(e, t) {
    return this._client.get(v`/organization/projects/${e}/hosted_tool_permissions`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/hosted_tool_permissions`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Pp = class extends M {
  retrieve(e, t) {
    return this._client.get(v`/organization/projects/${e}/model_permissions`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/model_permissions`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/projects/${e}/model_permissions`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Mp = class extends M {
  listRateLimits(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/rate_limits`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  updateRateLimit(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/organization/projects/${r}/rate_limits/${e}`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, xp = class extends M {
  create(e, t, n) {
    return this._client.post(v`/projects/${e}/roles`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r } = t;
    return this._client.get(v`/projects/${r}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/projects/${r}/roles/${e}`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/projects/${e}/roles`, ht, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r } = t;
    return this._client.delete(v`/projects/${r}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Np = class extends M {
  create(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/service_accounts`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r } = t;
    return this._client.get(v`/organization/projects/${r}/service_accounts/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/organization/projects/${r}/service_accounts/${e}`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/service_accounts`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r } = t;
    return this._client.delete(v`/organization/projects/${r}/service_accounts/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, kp = class extends M {
  create(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/spend_alerts`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r } = t;
    return this._client.get(v`/organization/projects/${r}/spend_alerts/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/organization/projects/${r}/spend_alerts/${e}`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/spend_alerts`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r } = t;
    return this._client.delete(v`/organization/projects/${r}/spend_alerts/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, Dp = class extends M {
  create(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/projects/${r}/groups/${e}/roles`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r, group_id: o } = t;
    return this._client.get(v`/projects/${r}/groups/${o}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.getAPIList(v`/projects/${r}/groups/${e}/roles`, ht, {
      query: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r, group_id: o } = t;
    return this._client.delete(v`/projects/${r}/groups/${o}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, ga = class extends M {
  constructor() {
    super(...arguments), this.roles = new Dp(this._client);
  }
  create(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/groups`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.get(v`/organization/projects/${r}/groups/${e}`, {
      query: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/groups`, ht, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r } = t;
    return this._client.delete(v`/organization/projects/${r}/groups/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
};
ga.Roles = Dp;
var $p = class extends M {
  create(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/projects/${r}/users/${e}/roles`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r, user_id: o } = t;
    return this._client.get(v`/projects/${r}/users/${o}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.getAPIList(v`/projects/${r}/users/${e}/roles`, ht, {
      query: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r, user_id: o } = t;
    return this._client.delete(v`/projects/${r}/users/${o}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, _a = class extends M {
  constructor() {
    super(...arguments), this.roles = new $p(this._client);
  }
  create(e, t, n) {
    return this._client.post(v`/organization/projects/${e}/users`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { project_id: r } = t;
    return this._client.get(v`/organization/projects/${r}/users/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    const { project_id: r, ...o } = t;
    return this._client.post(v`/organization/projects/${r}/users/${e}`, {
      body: o,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/projects/${e}/users`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { project_id: r } = t;
    return this._client.delete(v`/organization/projects/${r}/users/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
};
_a.Roles = $p;
var Re = class extends M {
  constructor() {
    super(...arguments), this.users = new _a(this._client), this.serviceAccounts = new Np(this._client), this.apiKeys = new wp(this._client), this.rateLimits = new Mp(this._client), this.modelPermissions = new Pp(this._client), this.hostedToolPermissions = new Rp(this._client), this.groups = new ga(this._client), this.roles = new xp(this._client), this.dataRetention = new bp(this._client), this.spendAlerts = new kp(this._client), this.certificates = new Ip(this._client);
  }
  create(e, t) {
    return this._client.post("/organization/projects", {
      body: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/projects/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/projects/${e}`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/projects", ce, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  archive(e, t) {
    return this._client.post(v`/organization/projects/${e}/archive`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
};
Re.Users = _a;
Re.ServiceAccounts = Np;
Re.APIKeys = wp;
Re.RateLimits = Mp;
Re.ModelPermissions = Pp;
Re.HostedToolPermissions = Rp;
Re.Groups = ga;
Re.Roles = xp;
Re.DataRetention = bp;
Re.SpendAlerts = kp;
Re.Certificates = Ip;
var Lp = class extends M {
  create(e, t, n) {
    return this._client.post(v`/organization/users/${e}/roles`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { user_id: r } = t;
    return this._client.get(v`/organization/users/${r}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/organization/users/${e}/roles`, ht, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { user_id: r } = t;
    return this._client.delete(v`/organization/users/${r}/roles/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, ya = class extends M {
  constructor() {
    super(...arguments), this.roles = new Lp(this._client);
  }
  retrieve(e, t) {
    return this._client.get(v`/organization/users/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/organization/users/${e}`, {
      body: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/organization/users", ce, {
      query: e,
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/organization/users/${e}`, {
      ...t,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
};
ya.Roles = Lp;
var Pe = class extends M {
  constructor() {
    super(...arguments), this.auditLogs = new gp(this._client), this.adminAPIKeys = new mp(this._client), this.usage = new Sp(this._client), this.invites = new vp(this._client), this.users = new ya(this._client), this.groups = new ei(this._client), this.roles = new Ap(this._client), this.dataRetention = new yp(this._client), this.spendAlerts = new Tp(this._client), this.certificates = new _p(this._client), this.projects = new Re(this._client);
  }
};
Pe.AuditLogs = gp;
Pe.AdminAPIKeys = mp;
Pe.Usage = Sp;
Pe.Invites = vp;
Pe.Users = ya;
Pe.Groups = ei;
Pe.Roles = Ap;
Pe.DataRetention = yp;
Pe.SpendAlerts = Tp;
Pe.Certificates = _p;
Pe.Projects = Re;
var va = class extends M {
  constructor() {
    super(...arguments), this.organization = new Pe(this._client);
  }
};
va.Organization = Pe;
var Up = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
function* EI(e) {
  if (!e) return;
  if (Up in e) {
    const { values: r, nulls: o } = e;
    yield* r.entries();
    for (const i of o) yield [i, null];
    return;
  }
  let t = !1, n;
  e instanceof Headers ? n = e.entries() : vc(e) ? n = e : (t = !0, n = Object.entries(e ?? {}));
  for (let r of n) {
    const o = r[0];
    if (typeof o != "string") throw new TypeError("expected header name to be a string");
    const i = vc(r[1]) ? r[1] : [r[1]];
    let s = !1;
    for (const u of i)
      u !== void 0 && (t && !s && (s = !0, yield [o, null]), yield [o, u]);
  }
}
var $ = (e) => {
  const t = new Headers(), n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const [i, s] of EI(r)) {
      const u = i.toLowerCase();
      o.has(u) || (t.delete(i), o.add(u)), s === null ? (t.delete(i), n.add(u)) : (t.append(i, s), n.delete(u));
    }
  }
  return {
    [Up]: !0,
    values: t,
    nulls: n
  };
}, Fp = class extends M {
  create(e, t) {
    return this._client.post("/audio/speech", {
      body: e,
      ...t,
      headers: $([{ Accept: "application/octet-stream" }, t?.headers]),
      __security: { bearerAuth: !0 },
      __binaryResponse: !0
    });
  }
}, Op = class extends M {
  create(e, t) {
    return this._client.post("/audio/transcriptions", Ze({
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __metadata: { model: e.model },
      __security: { bearerAuth: !0 }
    }, this._client));
  }
}, Gp = class extends M {
  create(e, t) {
    return this._client.post("/audio/translations", Ze({
      body: e,
      ...t,
      __metadata: { model: e.model },
      __security: { bearerAuth: !0 }
    }, this._client));
  }
}, wr = class extends M {
  constructor() {
    super(...arguments), this.transcriptions = new Op(this._client), this.translations = new Gp(this._client), this.speech = new Fp(this._client);
  }
};
wr.Transcriptions = Op;
wr.Translations = Gp;
wr.Speech = Fp;
var Bp = class extends M {
  create(e, t) {
    return this._client.post("/batches", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/batches/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/batches", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t) {
    return this._client.post(v`/batches/${e}/cancel`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
}, qp = class extends M {
  create(e, t) {
    return this._client.post("/assistants", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/assistants/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/assistants/${e}`, {
      body: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/assistants", Q, {
      query: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/assistants/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, Hp = class extends M {
  create(e, t) {
    return this._client.post("/realtime/sessions", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, Vp = class extends M {
  create(e, t) {
    return this._client.post("/realtime/transcription_sessions", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, ti = class extends M {
  constructor() {
    super(...arguments), this.sessions = new Hp(this._client), this.transcriptionSessions = new Vp(this._client);
  }
};
ti.Sessions = Hp;
ti.TranscriptionSessions = Vp;
var Jp = class extends M {
  create(e, t) {
    return this._client.post("/chatkit/sessions", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "chatkit_beta=v1" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t) {
    return this._client.post(v`/chatkit/sessions/${e}/cancel`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "chatkit_beta=v1" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, Kp = class extends M {
  retrieve(e, t) {
    return this._client.get(v`/chatkit/threads/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "chatkit_beta=v1" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/chatkit/threads", ce, {
      query: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "chatkit_beta=v1" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/chatkit/threads/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "chatkit_beta=v1" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  listItems(e, t = {}, n) {
    return this._client.getAPIList(v`/chatkit/threads/${e}/items`, ce, {
      query: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "chatkit_beta=v1" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, ni = class extends M {
  constructor() {
    super(...arguments), this.sessions = new Jp(this._client), this.threads = new Kp(this._client);
  }
};
ni.Sessions = Jp;
ni.Threads = Kp;
var Wp = class extends M {
  create(e, t, n) {
    return this._client.post(v`/threads/${e}/messages`, {
      body: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { thread_id: r } = t;
    return this._client.get(v`/threads/${r}/messages/${e}`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    const { thread_id: r, ...o } = t;
    return this._client.post(v`/threads/${r}/messages/${e}`, {
      body: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/threads/${e}/messages`, Q, {
      query: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { thread_id: r } = t;
    return this._client.delete(v`/threads/${r}/messages/${e}`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, zp = class extends M {
  retrieve(e, t, n) {
    const { thread_id: r, run_id: o, ...i } = t;
    return this._client.get(v`/threads/${r}/runs/${o}/steps/${e}`, {
      query: i,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t, n) {
    const { thread_id: r, ...o } = t;
    return this._client.getAPIList(v`/threads/${r}/runs/${e}/steps`, Q, {
      query: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, CI = (e) => {
  if (typeof Buffer < "u") {
    const t = Buffer.from(e, "base64");
    return Array.from(new Float32Array(t.buffer, t.byteOffset, t.length / Float32Array.BYTES_PER_ELEMENT));
  } else {
    const t = atob(e), n = t.length, r = new Uint8Array(n);
    for (let o = 0; o < n; o++) r[o] = t.charCodeAt(o);
    return Array.from(new Float32Array(r.buffer));
  }
}, yt = (e) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[e]?.trim() || void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(e)?.trim() || void 0;
}, le, Ft, Cs, Qe, po, Oe, Ot, rn, $t, $o, Ie, mo, go, or, er, tr, Uc, Fc, Oc, Gc, Bc, qc, Hc, ir = class extends ha {
  constructor() {
    super(...arguments), le.add(this), Cs.set(this, []), Qe.set(this, {}), po.set(this, {}), Oe.set(this, void 0), Ot.set(this, void 0), rn.set(this, void 0), $t.set(this, void 0), $o.set(this, void 0), Ie.set(this, void 0), mo.set(this, void 0), go.set(this, void 0), or.set(this, void 0);
  }
  [(Cs = /* @__PURE__ */ new WeakMap(), Qe = /* @__PURE__ */ new WeakMap(), po = /* @__PURE__ */ new WeakMap(), Oe = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new WeakMap(), $t = /* @__PURE__ */ new WeakMap(), $o = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ new WeakMap(), mo = /* @__PURE__ */ new WeakMap(), go = /* @__PURE__ */ new WeakMap(), or = /* @__PURE__ */ new WeakMap(), le = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
    const e = [], t = [];
    let n = !1;
    return this.on("event", (r) => {
      const o = t.shift();
      o ? o.resolve(r) : e.push(r);
    }), this.on("end", () => {
      n = !0;
      for (const r of t) r.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (r) => {
      n = !0;
      for (const o of t) o.reject(r);
      t.length = 0;
    }), this.on("error", (r) => {
      n = !0;
      for (const o of t) o.reject(r);
      t.length = 0;
    }), {
      next: async () => e.length ? {
        value: e.shift(),
        done: !1
      } : n ? {
        value: void 0,
        done: !0
      } : new Promise((r, o) => t.push({
        resolve: r,
        reject: o
      })).then((r) => r ? {
        value: r,
        done: !1
      } : {
        value: void 0,
        done: !0
      }),
      return: async () => (this.abort(), {
        value: void 0,
        done: !0
      })
    };
  }
  static fromReadableStream(e) {
    const t = new Ft();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  async _fromReadableStream(e, t) {
    const n = t?.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort())), this._connected();
    const r = dr.fromReadableStream(e, this.controller);
    for await (const o of r) S(this, le, "m", er).call(this, o);
    if (r.controller.signal?.aborted) throw new ke();
    return this._addRun(S(this, le, "m", tr).call(this));
  }
  toReadableStream() {
    return new dr(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
  static createToolAssistantStream(e, t, n, r) {
    const o = new Ft();
    return o._run(() => o._runToolAssistantStream(e, t, n, {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), o;
  }
  async _createToolAssistantStream(e, t, n, r) {
    const o = r?.signal;
    o && (o.aborted && this.controller.abort(), o.addEventListener("abort", () => this.controller.abort()));
    const i = {
      ...n,
      stream: !0
    }, s = await e.submitToolOutputs(t, i, {
      ...r,
      signal: this.controller.signal
    });
    this._connected();
    for await (const u of s) S(this, le, "m", er).call(this, u);
    if (s.controller.signal?.aborted) throw new ke();
    return this._addRun(S(this, le, "m", tr).call(this));
  }
  static createThreadAssistantStream(e, t, n) {
    const r = new Ft();
    return r._run(() => r._threadAssistantStream(e, t, {
      ...n,
      headers: {
        ...n?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), r;
  }
  static createAssistantStream(e, t, n, r) {
    const o = new Ft();
    return o._run(() => o._runAssistantStream(e, t, n, {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), o;
  }
  currentEvent() {
    return S(this, mo, "f");
  }
  currentRun() {
    return S(this, go, "f");
  }
  currentMessageSnapshot() {
    return S(this, Oe, "f");
  }
  currentRunStepSnapshot() {
    return S(this, or, "f");
  }
  async finalRunSteps() {
    return await this.done(), Object.values(S(this, Qe, "f"));
  }
  async finalMessages() {
    return await this.done(), Object.values(S(this, po, "f"));
  }
  async finalRun() {
    if (await this.done(), !S(this, Ot, "f")) throw Error("Final run was not received.");
    return S(this, Ot, "f");
  }
  async _createThreadAssistantStream(e, t, n) {
    const r = n?.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort()));
    const o = {
      ...t,
      stream: !0
    }, i = await e.createAndRun(o, {
      ...n,
      signal: this.controller.signal
    });
    this._connected();
    for await (const s of i) S(this, le, "m", er).call(this, s);
    if (i.controller.signal?.aborted) throw new ke();
    return this._addRun(S(this, le, "m", tr).call(this));
  }
  async _createAssistantStream(e, t, n, r) {
    const o = r?.signal;
    o && (o.aborted && this.controller.abort(), o.addEventListener("abort", () => this.controller.abort()));
    const i = {
      ...n,
      stream: !0
    }, s = await e.create(t, i, {
      ...r,
      signal: this.controller.signal
    });
    this._connected();
    for await (const u of s) S(this, le, "m", er).call(this, u);
    if (s.controller.signal?.aborted) throw new ke();
    return this._addRun(S(this, le, "m", tr).call(this));
  }
  static accumulateDelta(e, t) {
    for (const [n, r] of Object.entries(t)) {
      if (!e.hasOwnProperty(n)) {
        e[n] = r;
        continue;
      }
      let o = e[n];
      if (o == null) {
        e[n] = r;
        continue;
      }
      if (n === "index" || n === "type") {
        e[n] = r;
        continue;
      }
      if (typeof o == "string" && typeof r == "string") o += r;
      else if (typeof o == "number" && typeof r == "number") o += r;
      else if (Ci(o) && Ci(r)) o = this.accumulateDelta(o, r);
      else if (Array.isArray(o) && Array.isArray(r)) {
        if (o.every((i) => typeof i == "string" || typeof i == "number")) {
          o.push(...r);
          continue;
        }
        for (const i of r) {
          if (!Ci(i)) throw new Error(`Expected array delta entry to be an object but got: ${i}`);
          const s = i.index;
          if (s == null)
            throw console.error(i), new Error("Expected array delta entry to have an `index` property");
          if (typeof s != "number") throw new Error(`Expected array delta entry \`index\` property to be a number but got ${s}`);
          const u = o[s];
          u == null ? o.push(i) : o[s] = this.accumulateDelta(u, i);
        }
        continue;
      } else throw Error(`Unhandled record type: ${n}, deltaValue: ${r}, accValue: ${o}`);
      e[n] = o;
    }
    return e;
  }
  _addRun(e) {
    return e;
  }
  async _threadAssistantStream(e, t, n) {
    return await this._createThreadAssistantStream(t, e, n);
  }
  async _runAssistantStream(e, t, n, r) {
    return await this._createAssistantStream(t, e, n, r);
  }
  async _runToolAssistantStream(e, t, n, r) {
    return await this._createToolAssistantStream(t, e, n, r);
  }
};
Ft = ir, er = function(t) {
  if (!this.ended)
    switch (G(this, mo, t, "f"), S(this, le, "m", Oc).call(this, t), t.event) {
      case "thread.created":
        break;
      case "thread.run.created":
      case "thread.run.queued":
      case "thread.run.in_progress":
      case "thread.run.requires_action":
      case "thread.run.completed":
      case "thread.run.incomplete":
      case "thread.run.failed":
      case "thread.run.cancelling":
      case "thread.run.cancelled":
      case "thread.run.expired":
        S(this, le, "m", Hc).call(this, t);
        break;
      case "thread.run.step.created":
      case "thread.run.step.in_progress":
      case "thread.run.step.delta":
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        S(this, le, "m", Fc).call(this, t);
        break;
      case "thread.message.created":
      case "thread.message.in_progress":
      case "thread.message.delta":
      case "thread.message.completed":
      case "thread.message.incomplete":
        S(this, le, "m", Uc).call(this, t);
        break;
      case "error":
        throw new Error("Encountered an error event in event processing - errors should be processed earlier");
      default:
    }
}, tr = function() {
  if (this.ended) throw new O("stream has ended, this shouldn't happen");
  if (!S(this, Ot, "f")) throw Error("Final run has not been received");
  return S(this, Ot, "f");
}, Uc = function(t) {
  const [n, r] = S(this, le, "m", Bc).call(this, t, S(this, Oe, "f"));
  G(this, Oe, n, "f"), S(this, po, "f")[n.id] = n;
  for (const o of r) {
    const i = n.content[o.index];
    i?.type == "text" && this._emit("textCreated", i.text);
  }
  switch (t.event) {
    case "thread.message.created":
      this._emit("messageCreated", t.data);
      break;
    case "thread.message.in_progress":
      break;
    case "thread.message.delta":
      if (this._emit("messageDelta", t.data.delta, n), t.data.delta.content) for (const o of t.data.delta.content) {
        if (o.type == "text" && o.text) {
          let i = o.text, s = n.content[o.index];
          if (s && s.type == "text") this._emit("textDelta", i, s.text);
          else throw Error("The snapshot associated with this text delta is not text or missing");
        }
        if (o.index != S(this, rn, "f")) {
          if (S(this, $t, "f")) switch (S(this, $t, "f").type) {
            case "text":
              this._emit("textDone", S(this, $t, "f").text, S(this, Oe, "f"));
              break;
            case "image_file":
              this._emit("imageFileDone", S(this, $t, "f").image_file, S(this, Oe, "f"));
              break;
          }
          G(this, rn, o.index, "f");
        }
        G(this, $t, n.content[o.index], "f");
      }
      break;
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (S(this, rn, "f") !== void 0) {
        const o = t.data.content[S(this, rn, "f")];
        if (o) switch (o.type) {
          case "image_file":
            this._emit("imageFileDone", o.image_file, S(this, Oe, "f"));
            break;
          case "text":
            this._emit("textDone", o.text, S(this, Oe, "f"));
            break;
        }
      }
      S(this, Oe, "f") && this._emit("messageDone", t.data), G(this, Oe, void 0, "f");
  }
}, Fc = function(t) {
  const n = S(this, le, "m", Gc).call(this, t);
  switch (G(this, or, n, "f"), t.event) {
    case "thread.run.step.created":
      this._emit("runStepCreated", t.data);
      break;
    case "thread.run.step.delta":
      const r = t.data.delta;
      if (r.step_details && r.step_details.type == "tool_calls" && r.step_details.tool_calls && n.step_details.type == "tool_calls") for (const o of r.step_details.tool_calls) o.index == S(this, $o, "f") ? this._emit("toolCallDelta", o, n.step_details.tool_calls[o.index]) : (S(this, Ie, "f") && this._emit("toolCallDone", S(this, Ie, "f")), G(this, $o, o.index, "f"), G(this, Ie, n.step_details.tool_calls[o.index], "f"), S(this, Ie, "f") && this._emit("toolCallCreated", S(this, Ie, "f")));
      this._emit("runStepDelta", t.data.delta, n);
      break;
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
      G(this, or, void 0, "f"), t.data.step_details.type == "tool_calls" && S(this, Ie, "f") && (this._emit("toolCallDone", S(this, Ie, "f")), G(this, Ie, void 0, "f")), this._emit("runStepDone", t.data, n);
      break;
    case "thread.run.step.in_progress":
      break;
  }
}, Oc = function(t) {
  S(this, Cs, "f").push(t), this._emit("event", t);
}, Gc = function(t) {
  switch (t.event) {
    case "thread.run.step.created":
      return S(this, Qe, "f")[t.data.id] = t.data, t.data;
    case "thread.run.step.delta":
      let n = S(this, Qe, "f")[t.data.id];
      if (!n) throw Error("Received a RunStepDelta before creation of a snapshot");
      let r = t.data;
      if (r.delta) {
        const o = Ft.accumulateDelta(n, r.delta);
        S(this, Qe, "f")[t.data.id] = o;
      }
      return S(this, Qe, "f")[t.data.id];
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
    case "thread.run.step.in_progress":
      S(this, Qe, "f")[t.data.id] = t.data;
      break;
  }
  if (S(this, Qe, "f")[t.data.id]) return S(this, Qe, "f")[t.data.id];
  throw new Error("No snapshot available");
}, Bc = function(t, n) {
  let r = [];
  switch (t.event) {
    case "thread.message.created":
      return [t.data, r];
    case "thread.message.delta":
      if (!n) throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
      let o = t.data;
      if (o.delta.content) for (const i of o.delta.content) if (i.index in n.content) {
        let s = n.content[i.index];
        n.content[i.index] = S(this, le, "m", qc).call(this, i, s);
      } else
        n.content[i.index] = i, r.push(i);
      return [n, r];
    case "thread.message.in_progress":
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (n) return [n, r];
      throw Error("Received thread message event with no existing snapshot");
  }
  throw Error("Tried to accumulate a non-message event");
}, qc = function(t, n) {
  return Ft.accumulateDelta(n, t);
}, Hc = function(t) {
  switch (G(this, go, t.data, "f"), t.event) {
    case "thread.run.created":
      break;
    case "thread.run.queued":
      break;
    case "thread.run.in_progress":
      break;
    case "thread.run.requires_action":
    case "thread.run.cancelled":
    case "thread.run.failed":
    case "thread.run.completed":
    case "thread.run.expired":
    case "thread.run.incomplete":
      G(this, Ot, t.data, "f"), S(this, Ie, "f") && (this._emit("toolCallDone", S(this, Ie, "f")), G(this, Ie, void 0, "f"));
      break;
    case "thread.run.cancelling":
      break;
  }
};
var Aa = class extends M {
  constructor() {
    super(...arguments), this.steps = new zp(this._client);
  }
  create(e, t, n) {
    const { include: r, ...o } = t;
    return this._client.post(v`/threads/${e}/runs`, {
      query: { include: r },
      body: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      stream: t.stream ?? !1,
      __synthesizeEventData: !0,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { thread_id: r } = t;
    return this._client.get(v`/threads/${r}/runs/${e}`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    const { thread_id: r, ...o } = t;
    return this._client.post(v`/threads/${r}/runs/${e}`, {
      body: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/threads/${e}/runs`, Q, {
      query: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t, n) {
    const { thread_id: r } = t;
    return this._client.post(v`/threads/${r}/runs/${e}/cancel`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  async createAndPoll(e, t, n) {
    const r = await this.create(e, t, n);
    return await this.poll(r.id, { thread_id: e }, n);
  }
  createAndStream(e, t, n) {
    return ir.createAssistantStream(e, this._client.beta.threads.runs, t, n);
  }
  async poll(e, t, n) {
    const r = $([n?.headers, {
      "X-Stainless-Poll-Helper": "true",
      "X-Stainless-Custom-Poll-Interval": n?.pollIntervalMs?.toString() ?? void 0
    }]);
    for (; ; ) {
      const { data: o, response: i } = await this.retrieve(e, t, {
        ...n,
        headers: {
          ...n?.headers,
          ...r
        }
      }).withResponse();
      switch (o.status) {
        case "queued":
        case "in_progress":
        case "cancelling":
          let s = 5e3;
          if (n?.pollIntervalMs) s = n.pollIntervalMs;
          else {
            const u = i.headers.get("openai-poll-after-ms");
            if (u) {
              const c = parseInt(u);
              isNaN(c) || (s = c);
            }
          }
          await Er(s);
          break;
        case "requires_action":
        case "incomplete":
        case "cancelled":
        case "completed":
        case "failed":
        case "expired":
          return o;
      }
    }
  }
  stream(e, t, n) {
    return ir.createAssistantStream(e, this._client.beta.threads.runs, t, n);
  }
  submitToolOutputs(e, t, n) {
    const { thread_id: r, ...o } = t;
    return this._client.post(v`/threads/${r}/runs/${e}/submit_tool_outputs`, {
      body: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      stream: t.stream ?? !1,
      __synthesizeEventData: !0,
      __security: { bearerAuth: !0 }
    });
  }
  async submitToolOutputsAndPoll(e, t, n) {
    const r = await this.submitToolOutputs(e, t, n);
    return await this.poll(r.id, t, n);
  }
  submitToolOutputsStream(e, t, n) {
    return ir.createToolAssistantStream(e, this._client.beta.threads.runs, t, n);
  }
};
Aa.Steps = zp;
var ri = class extends M {
  constructor() {
    super(...arguments), this.runs = new Aa(this._client), this.messages = new Wp(this._client);
  }
  create(e = {}, t) {
    return this._client.post("/threads", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/threads/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/threads/${e}`, {
      body: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/threads/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  createAndRun(e, t) {
    return this._client.post("/threads/runs", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      stream: e.stream ?? !1,
      __synthesizeEventData: !0,
      __security: { bearerAuth: !0 }
    });
  }
  async createAndRunPoll(e, t) {
    const n = await this.createAndRun(e, t);
    return await this.runs.poll(n.id, { thread_id: n.thread_id }, t);
  }
  createAndRunStream(e, t) {
    return ir.createThreadAssistantStream(e, this._client.beta.threads, t);
  }
};
ri.Runs = Aa;
ri.Messages = Wp;
var yn = class extends M {
  constructor() {
    super(...arguments), this.realtime = new ti(this._client), this.chatkit = new ni(this._client), this.assistants = new qp(this._client), this.threads = new ri(this._client);
  }
};
yn.Realtime = ti;
yn.ChatKit = ni;
yn.Assistants = qp;
yn.Threads = ri;
var Yp = class extends M {
  create(e, t) {
    return this._client.post("/completions", {
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __security: { bearerAuth: !0 }
    });
  }
}, Xp = class extends M {
  retrieve(e, t, n) {
    const { container_id: r } = t;
    return this._client.get(v`/containers/${r}/files/${e}/content`, {
      ...n,
      headers: $([{ Accept: "application/binary" }, n?.headers]),
      __security: { bearerAuth: !0 },
      __binaryResponse: !0
    });
  }
}, Ta = class extends M {
  constructor() {
    super(...arguments), this.content = new Xp(this._client);
  }
  create(e, t, n) {
    return this._client.post(v`/containers/${e}/files`, jo({
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  retrieve(e, t, n) {
    const { container_id: r } = t;
    return this._client.get(v`/containers/${r}/files/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/containers/${e}/files`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { container_id: r } = t;
    return this._client.delete(v`/containers/${r}/files/${e}`, {
      ...n,
      headers: $([{ Accept: "*/*" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
};
Ta.Content = Xp;
var Sa = class extends M {
  constructor() {
    super(...arguments), this.files = new Ta(this._client);
  }
  create(e, t) {
    return this._client.post("/containers", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/containers/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/containers", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/containers/${e}`, {
      ...t,
      headers: $([{ Accept: "*/*" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
};
Sa.Files = Ta;
var Qp = class extends M {
  create(e, t, n) {
    const { include: r, ...o } = t;
    return this._client.post(v`/conversations/${e}/items`, {
      query: { include: r },
      body: o,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { conversation_id: r, ...o } = t;
    return this._client.get(v`/conversations/${r}/items/${e}`, {
      query: o,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/conversations/${e}/items`, ce, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { conversation_id: r } = t;
    return this._client.delete(v`/conversations/${r}/items/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
}, Ea = class extends M {
  constructor() {
    super(...arguments), this.items = new Qp(this._client);
  }
  create(e = {}, t) {
    return this._client.post("/conversations", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/conversations/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/conversations/${e}`, {
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/conversations/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
};
Ea.Items = Qp;
var Zp = class extends M {
  create(e, t) {
    const n = !!e.encoding_format;
    let r = n ? e.encoding_format : "base64";
    n && ae(this._client).debug("embeddings/user defined encoding_format:", e.encoding_format);
    const o = this._client.post("/embeddings", {
      body: {
        ...e,
        encoding_format: r
      },
      ...t,
      __security: { bearerAuth: !0 }
    });
    return n ? o : (ae(this._client).debug("embeddings/decoding base64 embeddings from base64"), o._thenUnwrap((i) => (i && i.data && i.data.forEach((s) => {
      const u = s.embedding;
      s.embedding = CI(u);
    }), i)));
  }
}, jp = class extends M {
  retrieve(e, t, n) {
    const { eval_id: r, run_id: o } = t;
    return this._client.get(v`/evals/${r}/runs/${o}/output_items/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t, n) {
    const { eval_id: r, ...o } = t;
    return this._client.getAPIList(v`/evals/${r}/runs/${e}/output_items`, Q, {
      query: o,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
}, Ca = class extends M {
  constructor() {
    super(...arguments), this.outputItems = new jp(this._client);
  }
  create(e, t, n) {
    return this._client.post(v`/evals/${e}/runs`, {
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { eval_id: r } = t;
    return this._client.get(v`/evals/${r}/runs/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/evals/${e}/runs`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { eval_id: r } = t;
    return this._client.delete(v`/evals/${r}/runs/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t, n) {
    const { eval_id: r } = t;
    return this._client.post(v`/evals/${r}/runs/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
};
Ca.OutputItems = jp;
var wa = class extends M {
  constructor() {
    super(...arguments), this.runs = new Ca(this._client);
  }
  create(e, t) {
    return this._client.post("/evals", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/evals/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/evals/${e}`, {
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/evals", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/evals/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
};
wa.Runs = Ca;
var em = class extends M {
  create(e, t) {
    return this._client.post("/files", Ze({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  retrieve(e, t) {
    return this._client.get(v`/files/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/files", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/files/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  content(e, t) {
    return this._client.get(v`/files/${e}/content`, {
      ...t,
      headers: $([{ Accept: "application/binary" }, t?.headers]),
      __security: { bearerAuth: !0 },
      __binaryResponse: !0
    });
  }
  async waitForProcessing(e, { pollInterval: t = 5e3, maxWait: n = 1800 * 1e3 } = {}) {
    const r = /* @__PURE__ */ new Set([
      "processed",
      "error",
      "deleted"
    ]), o = Date.now();
    let i = await this.retrieve(e);
    for (; !i.status || !r.has(i.status); )
      if (await Er(t), i = await this.retrieve(e), Date.now() - o > n) throw new aa({ message: `Giving up on waiting for file ${e} to finish processing after ${n} milliseconds.` });
    return i;
  }
}, tm = class extends M {
}, nm = class extends M {
  run(e, t) {
    return this._client.post("/fine_tuning/alpha/graders/run", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  validate(e, t) {
    return this._client.post("/fine_tuning/alpha/graders/validate", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
}, Ia = class extends M {
  constructor() {
    super(...arguments), this.graders = new nm(this._client);
  }
};
Ia.Graders = nm;
var rm = class extends M {
  create(e, t, n) {
    return this._client.getAPIList(v`/fine_tuning/checkpoints/${e}/permissions`, wt, {
      body: t,
      method: "post",
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  retrieve(e, t = {}, n) {
    return this._client.get(v`/fine_tuning/checkpoints/${e}/permissions`, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/fine_tuning/checkpoints/${e}/permissions`, ce, {
      query: t,
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { fine_tuned_model_checkpoint: r } = t;
    return this._client.delete(v`/fine_tuning/checkpoints/${r}/permissions/${e}`, {
      ...n,
      __security: { adminAPIKeyAuth: !0 }
    });
  }
}, ba = class extends M {
  constructor() {
    super(...arguments), this.permissions = new rm(this._client);
  }
};
ba.Permissions = rm;
var om = class extends M {
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/fine_tuning/jobs/${e}/checkpoints`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
}, Ra = class extends M {
  constructor() {
    super(...arguments), this.checkpoints = new om(this._client);
  }
  create(e, t) {
    return this._client.post("/fine_tuning/jobs", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/fine_tuning/jobs/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/fine_tuning/jobs", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t) {
    return this._client.post(v`/fine_tuning/jobs/${e}/cancel`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  listEvents(e, t = {}, n) {
    return this._client.getAPIList(v`/fine_tuning/jobs/${e}/events`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  pause(e, t) {
    return this._client.post(v`/fine_tuning/jobs/${e}/pause`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  resume(e, t) {
    return this._client.post(v`/fine_tuning/jobs/${e}/resume`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
};
Ra.Checkpoints = om;
var vn = class extends M {
  constructor() {
    super(...arguments), this.methods = new tm(this._client), this.jobs = new Ra(this._client), this.checkpoints = new ba(this._client), this.alpha = new Ia(this._client);
  }
};
vn.Methods = tm;
vn.Jobs = Ra;
vn.Checkpoints = ba;
vn.Alpha = Ia;
var im = class extends M {
}, Pa = class extends M {
  constructor() {
    super(...arguments), this.graderModels = new im(this._client);
  }
};
Pa.GraderModels = im;
var sm = class extends M {
  createVariation(e, t) {
    return this._client.post("/images/variations", Ze({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  edit(e, t) {
    return this._client.post("/images/edits", Ze({
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  generate(e, t) {
    return this._client.post("/images/generations", {
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __security: { bearerAuth: !0 }
    });
  }
}, am = class extends M {
  retrieve(e, t) {
    return this._client.get(v`/models/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  list(e) {
    return this._client.getAPIList("/models", wt, {
      ...e,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/models/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
}, lm = class extends M {
  create(e, t) {
    return this._client.post("/moderations", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
}, um = class extends M {
  accept(e, t, n) {
    return this._client.post(v`/realtime/calls/${e}/accept`, {
      body: t,
      ...n,
      headers: $([{ Accept: "*/*" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  hangup(e, t) {
    return this._client.post(v`/realtime/calls/${e}/hangup`, {
      ...t,
      headers: $([{ Accept: "*/*" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  refer(e, t, n) {
    return this._client.post(v`/realtime/calls/${e}/refer`, {
      body: t,
      ...n,
      headers: $([{ Accept: "*/*" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  reject(e, t = {}, n) {
    return this._client.post(v`/realtime/calls/${e}/reject`, {
      body: t,
      ...n,
      headers: $([{ Accept: "*/*" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, cm = class extends M {
  create(e, t) {
    return this._client.post("/realtime/client_secrets", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
}, oi = class extends M {
  constructor() {
    super(...arguments), this.clientSecrets = new cm(this._client), this.calls = new um(this._client);
  }
};
oi.ClientSecrets = cm;
oi.Calls = um;
function wI(e, t) {
  return !t || !bI(t) ? {
    ...e,
    output_parsed: null,
    output: e.output.map((n) => n.type === "function_call" ? {
      ...n,
      parsed_arguments: null
    } : n.type === "message" ? {
      ...n,
      content: n.content.map((r) => ({
        ...r,
        parsed: null
      }))
    } : n)
  } : dm(e, t);
}
function dm(e, t) {
  const n = e.output.map((o) => {
    if (o.type === "function_call") return {
      ...o,
      parsed_arguments: MI(t, o)
    };
    if (o.type === "message") {
      const i = o.content.map((s) => s.type === "output_text" ? {
        ...s,
        parsed: II(t, s.text)
      } : s);
      return {
        ...o,
        content: i
      };
    }
    return o;
  }), r = Object.assign({}, e, { output: n });
  return Object.getOwnPropertyDescriptor(e, "output_text") || ws(r), Object.defineProperty(r, "output_parsed", {
    enumerable: !0,
    get() {
      for (const o of r.output)
        if (o.type === "message") {
          for (const i of o.content) if (i.type === "output_text" && i.parsed !== null) return i.parsed;
        }
      return null;
    }
  }), r;
}
function II(e, t) {
  return e.text?.format?.type !== "json_schema" ? null : "$parseRaw" in e.text?.format ? (e.text?.format).$parseRaw(t) : JSON.parse(t);
}
function bI(e) {
  return !!da(e.text?.format);
}
function RI(e) {
  return e?.$brand === "auto-parseable-tool";
}
function PI(e, t) {
  return e.find((n) => n.type === "function" && n.name === t);
}
function MI(e, t) {
  const n = PI(e.tools ?? [], t.name);
  return {
    ...t,
    ...t,
    parsed_arguments: RI(n) ? n.$parseRaw(t.arguments) : n?.strict ? JSON.parse(t.arguments) : null
  };
}
function ws(e) {
  const t = [];
  for (const n of e.output)
    if (n.type === "message")
      for (const r of n.content) r.type === "output_text" && t.push(r.text);
  e.output_text = t.join("");
}
var Wt, eo, vt, to, Vc, Jc, Kc, Wc, xI = class fm extends ha {
  constructor(t) {
    super(), Wt.add(this), eo.set(this, void 0), vt.set(this, void 0), to.set(this, void 0), G(this, eo, t, "f");
  }
  static createResponse(t, n, r) {
    const o = new fm(n);
    return o._run(() => o._createOrRetrieveResponse(t, n, {
      ...r,
      headers: {
        ...r?.headers,
        "X-Stainless-Helper-Method": "stream"
      }
    })), o;
  }
  async _createOrRetrieveResponse(t, n, r) {
    const o = r?.signal;
    o && (o.aborted && this.controller.abort(), o.addEventListener("abort", () => this.controller.abort())), S(this, Wt, "m", Vc).call(this);
    let i, s = null;
    "response_id" in n ? (i = await t.responses.retrieve(n.response_id, { stream: !0 }, {
      ...r,
      signal: this.controller.signal,
      stream: !0
    }), s = n.starting_after ?? null) : i = await t.responses.create({
      ...n,
      stream: !0
    }, {
      ...r,
      signal: this.controller.signal
    }), this._connected();
    for await (const u of i) S(this, Wt, "m", Jc).call(this, u, s);
    if (i.controller.signal?.aborted) throw new ke();
    return S(this, Wt, "m", Kc).call(this);
  }
  [(eo = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakSet(), Vc = function() {
    this.ended || G(this, vt, void 0, "f");
  }, Jc = function(n, r) {
    if (this.ended) return;
    const o = (s, u) => {
      (r == null || u.sequence_number > r) && this._emit(s, u);
    }, i = S(this, Wt, "m", Wc).call(this, n);
    switch (o("event", n), n.type) {
      case "response.output_text.delta": {
        const s = i.output[n.output_index];
        if (!s) throw new O(`missing output at index ${n.output_index}`);
        if (s.type === "message") {
          const u = s.content[n.content_index];
          if (!u) throw new O(`missing content at index ${n.content_index}`);
          if (u.type !== "output_text") throw new O(`expected content to be 'output_text', got ${u.type}`);
          o("response.output_text.delta", {
            ...n,
            snapshot: u.text
          });
        }
        break;
      }
      case "response.function_call_arguments.delta": {
        const s = i.output[n.output_index];
        if (!s) throw new O(`missing output at index ${n.output_index}`);
        s.type === "function_call" && o("response.function_call_arguments.delta", {
          ...n,
          snapshot: s.arguments
        });
        break;
      }
      default:
        o(n.type, n);
        break;
    }
  }, Kc = function() {
    if (this.ended) throw new O("stream has ended, this shouldn't happen");
    const n = S(this, vt, "f");
    if (!n) throw new O("request ended without sending any events");
    G(this, vt, void 0, "f");
    const r = NI(n, S(this, eo, "f"));
    return G(this, to, r, "f"), r;
  }, Wc = function(n) {
    let r = S(this, vt, "f");
    if (!r) {
      if (n.type !== "response.created") throw new O(`When snapshot hasn't been set yet, expected 'response.created' event, got ${n.type}`);
      return r = G(this, vt, n.response, "f"), r;
    }
    switch (n.type) {
      case "response.output_item.added":
        r.output.push(n.item);
        break;
      case "response.content_part.added": {
        const o = r.output[n.output_index];
        if (!o) throw new O(`missing output at index ${n.output_index}`);
        const i = o.type, s = n.part;
        i === "message" && s.type !== "reasoning_text" ? o.content.push(s) : i === "reasoning" && s.type === "reasoning_text" && (o.content || (o.content = []), o.content.push(s));
        break;
      }
      case "response.output_text.delta": {
        const o = r.output[n.output_index];
        if (!o) throw new O(`missing output at index ${n.output_index}`);
        if (o.type === "message") {
          const i = o.content[n.content_index];
          if (!i) throw new O(`missing content at index ${n.content_index}`);
          if (i.type !== "output_text") throw new O(`expected content to be 'output_text', got ${i.type}`);
          i.text += n.delta;
        }
        break;
      }
      case "response.function_call_arguments.delta": {
        const o = r.output[n.output_index];
        if (!o) throw new O(`missing output at index ${n.output_index}`);
        o.type === "function_call" && (o.arguments += n.delta);
        break;
      }
      case "response.reasoning_text.delta": {
        const o = r.output[n.output_index];
        if (!o) throw new O(`missing output at index ${n.output_index}`);
        if (o.type === "reasoning") {
          const i = o.content?.[n.content_index];
          if (!i) throw new O(`missing content at index ${n.content_index}`);
          if (i.type !== "reasoning_text") throw new O(`expected content to be 'reasoning_text', got ${i.type}`);
          i.text += n.delta;
        }
        break;
      }
      case "response.completed":
        G(this, vt, n.response, "f");
        break;
    }
    return r;
  }, Symbol.asyncIterator)]() {
    const t = [], n = [];
    let r = !1;
    return this.on("event", (o) => {
      const i = n.shift();
      i ? i.resolve(o) : t.push(o);
    }), this.on("end", () => {
      r = !0;
      for (const o of n) o.resolve(void 0);
      n.length = 0;
    }), this.on("abort", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), this.on("error", (o) => {
      r = !0;
      for (const i of n) i.reject(o);
      n.length = 0;
    }), {
      next: async () => t.length ? {
        value: t.shift(),
        done: !1
      } : r ? {
        value: void 0,
        done: !0
      } : new Promise((o, i) => n.push({
        resolve: o,
        reject: i
      })).then((o) => o ? {
        value: o,
        done: !1
      } : {
        value: void 0,
        done: !0
      }),
      return: async () => (this.abort(), {
        value: void 0,
        done: !0
      })
    };
  }
  async finalResponse() {
    await this.done();
    const t = S(this, to, "f");
    if (!t) throw new O("stream ended without producing a ChatCompletion");
    return t;
  }
};
function NI(e, t) {
  return wI(e, t);
}
var hm = class extends M {
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/responses/${e}/input_items`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
}, pm = class extends M {
  count(e = {}, t) {
    return this._client.post("/responses/input_tokens", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
}, ii = class extends M {
  constructor() {
    super(...arguments), this.inputItems = new hm(this._client), this.inputTokens = new pm(this._client);
  }
  create(e, t) {
    return this._client.post("/responses", {
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __security: { bearerAuth: !0 }
    })._thenUnwrap((n) => ("object" in n && n.object === "response" && ws(n), n));
  }
  retrieve(e, t = {}, n) {
    return this._client.get(v`/responses/${e}`, {
      query: t,
      ...n,
      stream: t?.stream ?? !1,
      __security: { bearerAuth: !0 }
    })._thenUnwrap((r) => ("object" in r && r.object === "response" && ws(r), r));
  }
  delete(e, t) {
    return this._client.delete(v`/responses/${e}`, {
      ...t,
      headers: $([{ Accept: "*/*" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  parse(e, t) {
    return this._client.responses.create(e, t)._thenUnwrap((n) => dm(n, e));
  }
  stream(e, t) {
    return xI.createResponse(this._client, e, t);
  }
  cancel(e, t) {
    return this._client.post(v`/responses/${e}/cancel`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  compact(e, t) {
    return this._client.post("/responses/compact", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
};
ii.InputItems = hm;
ii.InputTokens = pm;
var mm = class extends M {
  retrieve(e, t) {
    return this._client.get(v`/skills/${e}/content`, {
      ...t,
      headers: $([{ Accept: "application/binary" }, t?.headers]),
      __security: { bearerAuth: !0 },
      __binaryResponse: !0
    });
  }
}, gm = class extends M {
  retrieve(e, t, n) {
    const { skill_id: r } = t;
    return this._client.get(v`/skills/${r}/versions/${e}/content`, {
      ...n,
      headers: $([{ Accept: "application/binary" }, n?.headers]),
      __security: { bearerAuth: !0 },
      __binaryResponse: !0
    });
  }
}, Ma = class extends M {
  constructor() {
    super(...arguments), this.content = new gm(this._client);
  }
  create(e, t = {}, n) {
    return this._client.post(v`/skills/${e}/versions`, jo({
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  retrieve(e, t, n) {
    const { skill_id: r } = t;
    return this._client.get(v`/skills/${r}/versions/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/skills/${e}/versions`, Q, {
      query: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { skill_id: r } = t;
    return this._client.delete(v`/skills/${r}/versions/${e}`, {
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
};
Ma.Content = gm;
var si = class extends M {
  constructor() {
    super(...arguments), this.content = new mm(this._client), this.versions = new Ma(this._client);
  }
  create(e = {}, t) {
    return this._client.post("/skills", jo({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  retrieve(e, t) {
    return this._client.get(v`/skills/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/skills/${e}`, {
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/skills", Q, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/skills/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
};
si.Content = mm;
si.Versions = Ma;
var _m = class extends M {
  create(e, t, n) {
    return this._client.post(v`/uploads/${e}/parts`, Ze({
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
}, xa = class extends M {
  constructor() {
    super(...arguments), this.parts = new _m(this._client);
  }
  create(e, t) {
    return this._client.post("/uploads", {
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t) {
    return this._client.post(v`/uploads/${e}/cancel`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  complete(e, t, n) {
    return this._client.post(v`/uploads/${e}/complete`, {
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    });
  }
};
xa.Parts = _m;
var kI = async (e) => {
  const t = await Promise.allSettled(e), n = t.filter((o) => o.status === "rejected");
  if (n.length) {
    for (const o of n) console.error(o.reason);
    throw new Error(`${n.length} promise(s) failed - see the above errors`);
  }
  const r = [];
  for (const o of t) o.status === "fulfilled" && r.push(o.value);
  return r;
}, ym = class extends M {
  create(e, t, n) {
    return this._client.post(v`/vector_stores/${e}/file_batches`, {
      body: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { vector_store_id: r } = t;
    return this._client.get(v`/vector_stores/${r}/file_batches/${e}`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  cancel(e, t, n) {
    const { vector_store_id: r } = t;
    return this._client.post(v`/vector_stores/${r}/file_batches/${e}/cancel`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  async createAndPoll(e, t, n) {
    const r = await this.create(e, t);
    return await this.poll(e, r.id, n);
  }
  listFiles(e, t, n) {
    const { vector_store_id: r, ...o } = t;
    return this._client.getAPIList(v`/vector_stores/${r}/file_batches/${e}/files`, Q, {
      query: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  async poll(e, t, n) {
    const r = $([n?.headers, {
      "X-Stainless-Poll-Helper": "true",
      "X-Stainless-Custom-Poll-Interval": n?.pollIntervalMs?.toString() ?? void 0
    }]);
    for (; ; ) {
      const { data: o, response: i } = await this.retrieve(t, { vector_store_id: e }, {
        ...n,
        headers: r
      }).withResponse();
      switch (o.status) {
        case "in_progress":
          let s = 5e3;
          if (n?.pollIntervalMs) s = n.pollIntervalMs;
          else {
            const u = i.headers.get("openai-poll-after-ms");
            if (u) {
              const c = parseInt(u);
              isNaN(c) || (s = c);
            }
          }
          await Er(s);
          break;
        case "failed":
        case "cancelled":
        case "completed":
          return o;
      }
    }
  }
  async uploadAndPoll(e, { files: t, fileIds: n = [] }, r) {
    if (t == null || t.length == 0) throw new Error("No `files` provided to process. If you've already uploaded files you should use `.createAndPoll()` instead");
    const o = r?.maxConcurrency ?? 5, i = Math.min(o, t.length), s = this._client, u = t.values(), c = [...n];
    async function d(h) {
      for (let f of h) {
        const p = await s.files.create({
          file: f,
          purpose: "assistants"
        }, r);
        c.push(p.id);
      }
    }
    return await kI(Array(i).fill(u).map(d)), await this.createAndPoll(e, { file_ids: c });
  }
}, vm = class extends M {
  create(e, t, n) {
    return this._client.post(v`/vector_stores/${e}/files`, {
      body: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t, n) {
    const { vector_store_id: r } = t;
    return this._client.get(v`/vector_stores/${r}/files/${e}`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    const { vector_store_id: r, ...o } = t;
    return this._client.post(v`/vector_stores/${r}/files/${e}`, {
      body: o,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e, t = {}, n) {
    return this._client.getAPIList(v`/vector_stores/${e}/files`, Q, {
      query: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t, n) {
    const { vector_store_id: r } = t;
    return this._client.delete(v`/vector_stores/${r}/files/${e}`, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  async createAndPoll(e, t, n) {
    const r = await this.create(e, t, n);
    return await this.poll(e, r.id, n);
  }
  async poll(e, t, n) {
    const r = $([n?.headers, {
      "X-Stainless-Poll-Helper": "true",
      "X-Stainless-Custom-Poll-Interval": n?.pollIntervalMs?.toString() ?? void 0
    }]);
    for (; ; ) {
      const o = await this.retrieve(t, { vector_store_id: e }, {
        ...n,
        headers: r
      }).withResponse(), i = o.data;
      switch (i.status) {
        case "in_progress":
          let s = 5e3;
          if (n?.pollIntervalMs) s = n.pollIntervalMs;
          else {
            const u = o.response.headers.get("openai-poll-after-ms");
            if (u) {
              const c = parseInt(u);
              isNaN(c) || (s = c);
            }
          }
          await Er(s);
          break;
        case "failed":
        case "completed":
          return i;
      }
    }
  }
  async upload(e, t, n) {
    const r = await this._client.files.create({
      file: t,
      purpose: "assistants"
    }, n);
    return this.create(e, { file_id: r.id }, n);
  }
  async uploadAndPoll(e, t, n) {
    const r = await this.upload(e, t, n);
    return await this.poll(e, r.id, n);
  }
  content(e, t, n) {
    const { vector_store_id: r } = t;
    return this._client.getAPIList(v`/vector_stores/${r}/files/${e}/content`, wt, {
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
}, ai = class extends M {
  constructor() {
    super(...arguments), this.files = new vm(this._client), this.fileBatches = new ym(this._client);
  }
  create(e, t) {
    return this._client.post("/vector_stores", {
      body: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  retrieve(e, t) {
    return this._client.get(v`/vector_stores/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  update(e, t, n) {
    return this._client.post(v`/vector_stores/${e}`, {
      body: t,
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/vector_stores", Q, {
      query: e,
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/vector_stores/${e}`, {
      ...t,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, t?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
  search(e, t, n) {
    return this._client.getAPIList(v`/vector_stores/${e}/search`, wt, {
      body: t,
      method: "post",
      ...n,
      headers: $([{ "OpenAI-Beta": "assistants=v2" }, n?.headers]),
      __security: { bearerAuth: !0 }
    });
  }
};
ai.Files = vm;
ai.FileBatches = ym;
var Am = class extends M {
  create(e, t) {
    return this._client.post("/videos", Ze({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  retrieve(e, t) {
    return this._client.get(v`/videos/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  list(e = {}, t) {
    return this._client.getAPIList("/videos", ce, {
      query: e,
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  delete(e, t) {
    return this._client.delete(v`/videos/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  createCharacter(e, t) {
    return this._client.post("/videos/characters", Ze({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  downloadContent(e, t = {}, n) {
    return this._client.get(v`/videos/${e}/content`, {
      query: t,
      ...n,
      headers: $([{ Accept: "application/binary" }, n?.headers]),
      __security: { bearerAuth: !0 },
      __binaryResponse: !0
    });
  }
  edit(e, t) {
    return this._client.post("/videos/edits", Ze({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  extend(e, t) {
    return this._client.post("/videos/extensions", Ze({
      body: e,
      ...t,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
  getCharacter(e, t) {
    return this._client.get(v`/videos/characters/${e}`, {
      ...t,
      __security: { bearerAuth: !0 }
    });
  }
  remix(e, t, n) {
    return this._client.post(v`/videos/${e}/remix`, jo({
      body: t,
      ...n,
      __security: { bearerAuth: !0 }
    }, this._client));
  }
}, Zt, Tm, _o, Sm = class extends M {
  constructor() {
    super(...arguments), Zt.add(this);
  }
  async unwrap(e, t, n = this._client.webhookSecret, r = 300) {
    return await this.verifySignature(e, t, n, r), JSON.parse(e);
  }
  async verifySignature(e, t, n = this._client.webhookSecret, r = 300) {
    if (typeof crypto > "u" || typeof crypto.subtle.importKey != "function" || typeof crypto.subtle.verify != "function") throw new Error("Webhook signature verification is only supported when the `crypto` global is defined");
    S(this, Zt, "m", Tm).call(this, n);
    const o = $([t]).values, i = S(this, Zt, "m", _o).call(this, o, "webhook-signature"), s = S(this, Zt, "m", _o).call(this, o, "webhook-timestamp"), u = S(this, Zt, "m", _o).call(this, o, "webhook-id"), c = parseInt(s, 10);
    if (isNaN(c)) throw new Kn("Invalid webhook timestamp format");
    const d = Math.floor(Date.now() / 1e3);
    if (d - c > r) throw new Kn("Webhook timestamp is too old");
    if (c > d + r) throw new Kn("Webhook timestamp is too new");
    const h = i.split(" ").map((g) => g.startsWith("v1,") ? g.substring(3) : g), f = n.startsWith("whsec_") ? Buffer.from(n.replace("whsec_", ""), "base64") : Buffer.from(n, "utf-8"), p = u ? `${u}.${s}.${e}` : `${s}.${e}`, m = await crypto.subtle.importKey("raw", f, {
      name: "HMAC",
      hash: "SHA-256"
    }, !1, ["verify"]);
    for (const g of h) try {
      const _ = Buffer.from(g, "base64");
      if (await crypto.subtle.verify("HMAC", m, _, new TextEncoder().encode(p))) return;
    } catch {
      continue;
    }
    throw new Kn("The given webhook signature does not match the expected signature");
  }
};
Zt = /* @__PURE__ */ new WeakSet(), Tm = function(t) {
  if (typeof t != "string" || t.length === 0) throw new Error("The webhook secret must either be set using the env var, OPENAI_WEBHOOK_SECRET, on the client class, OpenAI({ webhookSecret: '123' }), or passed to this function");
}, _o = function(t, n) {
  if (!t) throw new Error("Headers are required");
  const r = t.get(n);
  if (r == null) throw new Error(`Missing required header: ${n}`);
  return r;
};
var Is, Na, yo, Em, DI = "workload-identity-auth", H = class {
  constructor({ baseURL: e = yt("OPENAI_BASE_URL"), apiKey: t = yt("OPENAI_API_KEY") ?? null, adminAPIKey: n = yt("OPENAI_ADMIN_KEY") ?? null, organization: r = yt("OPENAI_ORG_ID") ?? null, project: o = yt("OPENAI_PROJECT_ID") ?? null, webhookSecret: i = yt("OPENAI_WEBHOOK_SECRET") ?? null, workloadIdentity: s, ...u } = {}) {
    Is.add(this), yo.set(this, void 0), this.completions = new Yp(this), this.chat = new ma(this), this.embeddings = new Zp(this), this.files = new em(this), this.images = new sm(this), this.audio = new wr(this), this.moderations = new lm(this), this.models = new am(this), this.fineTuning = new vn(this), this.graders = new Pa(this), this.vectorStores = new ai(this), this.webhooks = new Sm(this), this.beta = new yn(this), this.batches = new Bp(this), this.uploads = new xa(this), this.admin = new va(this), this.responses = new ii(this), this.realtime = new oi(this), this.conversations = new Ea(this), this.evals = new wa(this), this.containers = new Sa(this), this.skills = new si(this), this.videos = new Am(this);
    const c = {
      apiKey: t,
      adminAPIKey: n,
      organization: r,
      project: o,
      webhookSecret: i,
      workloadIdentity: s,
      ...u,
      baseURL: e || "https://api.openai.com/v1"
    };
    if (t && s) throw new O("The `apiKey` and `workloadIdentity` options are mutually exclusive");
    if (!t && !n && !s) throw new O("Missing credentials. Please pass an `apiKey`, `workloadIdentity`, `adminAPIKey`, or set the `OPENAI_API_KEY` or `OPENAI_ADMIN_KEY` environment variable.");
    if (!c.dangerouslyAllowBrowser && Nw()) throw new O(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
`);
    this.baseURL = c.baseURL, this.timeout = c.timeout ?? Na.DEFAULT_TIMEOUT, this.logger = c.logger ?? console;
    const d = "warn";
    this.logLevel = d, this.logLevel = xc(c.logLevel, "ClientOptions.logLevel", this) ?? xc(yt("OPENAI_LOG"), "process.env['OPENAI_LOG']", this) ?? d, this.fetchOptions = c.fetchOptions, this.maxRetries = c.maxRetries ?? 2, this.fetch = c.fetch ?? Bh(), G(this, yo, Uw, "f");
    const h = yt("OPENAI_CUSTOM_HEADERS");
    if (h) {
      const f = {};
      for (const p of h.split(`
`)) {
        const m = p.indexOf(":");
        m >= 0 && (f[p.substring(0, m).trim()] = p.substring(m + 1).trim());
      }
      c.defaultHeaders = $([f, c.defaultHeaders]);
    }
    this._options = c, s && (this._workloadIdentityAuth = new tI(s, this.fetch)), this.apiKey = typeof t == "string" ? t : null, this.adminAPIKey = n, this.organization = r, this.project = o, this.webhookSecret = i;
  }
  withOptions(e) {
    return new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this._options.apiKey,
      adminAPIKey: this.adminAPIKey,
      workloadIdentity: this._options.workloadIdentity,
      organization: this.organization,
      project: this.project,
      webhookSecret: this.webhookSecret,
      ...e
    });
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values: e, nulls: t }, n = {
    bearerAuth: !0,
    adminAPIKeyAuth: !0
  }) {
    if (!(e.get("authorization") || e.get("api-key")) && !(t.has("authorization") || t.has("api-key")) && !(this._workloadIdentityAuth && n.bearerAuth))
      throw new Error('Could not resolve authentication method. Expected either apiKey or adminAPIKey to be set. Or for one of the "Authorization" or "api-key" headers to be explicitly omitted');
  }
  async authHeaders(e, t = {
    bearerAuth: !0,
    adminAPIKeyAuth: !0
  }) {
    return $([t.bearerAuth ? await this.bearerAuth(e) : null, t.adminAPIKeyAuth ? await this.adminAPIKeyAuth(e) : null]);
  }
  async bearerAuth(e) {
    if (this._workloadIdentityAuth) return $([{ Authorization: `Bearer ${await this._workloadIdentityAuth.getToken()}` }]);
    if (this.apiKey != null)
      return $([{ Authorization: `Bearer ${this.apiKey}` }]);
  }
  async adminAPIKeyAuth(e) {
    if (this.adminAPIKey != null)
      return $([{ Authorization: `Bearer ${this.adminAPIKey}` }]);
  }
  stringifyQuery(e) {
    return Hw(e);
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${Xt}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${Ph()}`;
  }
  makeStatusError(e, t, n, r) {
    return de.generate(e, t, n, r);
  }
  async _callApiKey() {
    const e = this._options.apiKey;
    if (typeof e != "function") return !1;
    let t;
    try {
      t = await e();
    } catch (n) {
      throw n instanceof O ? n : new O(`Failed to get token from 'apiKey' function: ${n.message}`, { cause: n });
    }
    if (typeof t != "string" || !t) throw new O(`Expected 'apiKey' function argument to return a string but it returned ${t}`);
    return this.apiKey = t, !0;
  }
  buildURL(e, t, n) {
    const r = !S(this, Is, "m", Em).call(this) && n || this.baseURL, o = Rw(e) ? new URL(e) : new URL(r + (r.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), i = this.defaultQuery(), s = Object.fromEntries(o.searchParams);
    return (!Ac(i) || !Ac(s)) && (t = {
      ...s,
      ...i,
      ...t
    }), typeof t == "object" && t && !Array.isArray(t) && (o.search = this.stringifyQuery(t)), o.toString();
  }
  async prepareOptions(e) {
    (e.__security ?? { bearerAuth: !0 }).bearerAuth && await this._callApiKey();
  }
  async prepareRequest(e, { url: t, options: n }) {
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, n) {
    return this.request(Promise.resolve(n).then((r) => ({
      method: e,
      path: t,
      ...r
    })));
  }
  request(e, t = null) {
    return new Zh(this, this.makeRequest(e, t, void 0));
  }
  async makeRequest(e, t, n) {
    const r = await e, o = r.maxRetries ?? this.maxRetries;
    t == null && (t = o), await this.prepareOptions(r);
    const { req: i, url: s, timeout: u } = await this.buildRequest(r, { retryCount: o - t });
    await this.prepareRequest(i, {
      url: s,
      options: r
    });
    const c = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0"), d = n === void 0 ? "" : `, retryOf: ${n}`, h = Date.now();
    if (ae(this).debug(`[${c}] sending request`, kt({
      retryOfRequestLogID: n,
      method: r.method,
      url: s,
      options: r,
      headers: i.headers
    })), r.signal?.aborted) throw new ke();
    const f = r.__security ?? { bearerAuth: !0 }, p = new AbortController(), m = await this.fetchWithAuth(s, i, u, p, f).catch(ds), g = Date.now();
    if (m instanceof globalThis.Error) {
      const y = `retrying, ${t} attempts remaining`;
      if (r.signal?.aborted) throw new ke();
      const E = cs(m) || /timed? ?out/i.test(String(m) + ("cause" in m ? String(m.cause) : ""));
      if (t)
        return ae(this).info(`[${c}] connection ${E ? "timed out" : "failed"} - ${y}`), ae(this).debug(`[${c}] connection ${E ? "timed out" : "failed"} (${y})`, kt({
          retryOfRequestLogID: n,
          url: s,
          durationMs: g - h,
          message: m.message
        })), this.retryRequest(r, t, n ?? c);
      throw ae(this).info(`[${c}] connection ${E ? "timed out" : "failed"} - error; no more retries left`), ae(this).debug(`[${c}] connection ${E ? "timed out" : "failed"} (error; no more retries left)`, kt({
        retryOfRequestLogID: n,
        url: s,
        durationMs: g - h,
        message: m.message
      })), m instanceof Gh || m instanceof Iw ? m : E ? new aa() : new Xo({
        message: $I(m),
        cause: m
      });
    }
    const _ = `[${c}${d}${[...m.headers.entries()].filter(([y]) => y === "x-request-id").map(([y, E]) => ", " + y + ": " + JSON.stringify(E)).join("")}] ${i.method} ${s} ${m.ok ? "succeeded" : "failed"} with status ${m.status} in ${g - h}ms`;
    if (!m.ok) {
      if (m.status === 401 && this._workloadIdentityAuth && f.bearerAuth && !r.__metadata?.hasStreamingBody && !r.__metadata?.workloadIdentityTokenRefreshed)
        return await Cc(m.body), this._workloadIdentityAuth.invalidateToken(), this.makeRequest({
          ...r,
          __metadata: {
            ...r.__metadata,
            workloadIdentityTokenRefreshed: !0
          }
        }, t, n ?? c);
      const y = await this.shouldRetry(m);
      if (t && y) {
        const L = `retrying, ${t} attempts remaining`;
        return await Cc(m.body), ae(this).info(`${_} - ${L}`), ae(this).debug(`[${c}] response error (${L})`, kt({
          retryOfRequestLogID: n,
          url: m.url,
          status: m.status,
          headers: m.headers,
          durationMs: g - h
        })), this.retryRequest(r, t, n ?? c, m.headers);
      }
      const E = y ? "error; no more retries left" : "error; not retryable";
      ae(this).info(`${_} - ${E}`);
      const A = await m.text().catch((L) => ds(L).message), w = xw(A), P = w ? void 0 : A;
      throw ae(this).debug(`[${c}] response error (${E})`, kt({
        retryOfRequestLogID: n,
        url: m.url,
        status: m.status,
        headers: m.headers,
        message: P,
        durationMs: Date.now() - h
      })), this.makeStatusError(m.status, w, P, m.headers);
    }
    return ae(this).info(_), ae(this).debug(`[${c}] response start`, kt({
      retryOfRequestLogID: n,
      url: m.url,
      status: m.status,
      headers: m.headers,
      durationMs: g - h
    })), {
      response: m,
      options: r,
      controller: p,
      requestLogID: c,
      retryOfRequestLogID: n,
      startTime: h
    };
  }
  getAPIList(e, t, n) {
    return this.requestAPIList(t, n && "then" in n ? n.then((r) => ({
      method: "get",
      path: e,
      ...r
    })) : {
      method: "get",
      path: e,
      ...n
    });
  }
  requestAPIList(e, t) {
    const n = this.makeRequest(t, null, void 0);
    return new Zw(this, n, e);
  }
  async fetchWithAuth(e, t, n, r, o = {
    bearerAuth: !0,
    adminAPIKeyAuth: !0
  }) {
    if (this._workloadIdentityAuth && o.bearerAuth) {
      const i = t.headers, s = i.get("Authorization");
      if (!s || s === `Bearer ${DI}`) {
        const u = await this._workloadIdentityAuth.getToken();
        i.set("Authorization", `Bearer ${u}`);
      }
    }
    return await this.fetchWithTimeout(e, t, n, r);
  }
  async fetchWithTimeout(e, t, n, r) {
    const { signal: o, method: i, ...s } = t || {}, u = this._makeAbort(r);
    o && o.addEventListener("abort", u, { once: !0 });
    const c = setTimeout(u, n), d = globalThis.ReadableStream && s.body instanceof globalThis.ReadableStream || typeof s.body == "object" && s.body !== null && Symbol.asyncIterator in s.body, h = {
      signal: r.signal,
      ...d ? { duplex: "half" } : {},
      method: "GET",
      ...s
    };
    i && (h.method = i.toUpperCase());
    try {
      return await this.fetch.call(void 0, e, h);
    } finally {
      clearTimeout(c);
    }
  }
  async shouldRetry(e) {
    const t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, n, r) {
    let o;
    const i = r?.get("retry-after-ms");
    if (i) {
      const u = parseFloat(i);
      Number.isNaN(u) || (o = u);
    }
    const s = r?.get("retry-after");
    if (s && !o) {
      const u = parseFloat(s);
      Number.isNaN(u) ? o = Date.parse(s) - Date.now() : o = u * 1e3;
    }
    if (o === void 0) {
      const u = e.maxRetries ?? this.maxRetries;
      o = this.calculateDefaultRetryTimeoutMillis(t, u);
    }
    return await Er(o), this.makeRequest(e, t - 1, n);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    const o = t - e;
    return Math.min(0.5 * Math.pow(2, o), 8) * (1 - Math.random() * 0.25) * 1e3;
  }
  async buildRequest(e, { retryCount: t = 0 } = {}) {
    const n = { ...e }, { method: r, path: o, query: i, defaultBaseURL: s } = n, u = this.buildURL(o, i, s);
    "timeout" in n && Mw("timeout", n.timeout), n.timeout = n.timeout ?? this.timeout;
    const { bodyHeaders: c, body: d, isStreamingBody: h } = this.buildBody({ options: n });
    return h && (e.__metadata = {
      ...e.__metadata,
      hasStreamingBody: !0
    }), {
      req: {
        method: r,
        headers: await this.buildHeaders({
          options: e,
          method: r,
          bodyHeaders: c,
          retryCount: t
        }),
        ...n.signal && { signal: n.signal },
        ...globalThis.ReadableStream && d instanceof globalThis.ReadableStream && { duplex: "half" },
        ...d && { body: d },
        ...this.fetchOptions ?? {},
        ...n.fetchOptions ?? {}
      },
      url: u,
      timeout: n.timeout
    };
  }
  async buildHeaders({ options: e, method: t, bodyHeaders: n, retryCount: r }) {
    let o = {};
    this.idempotencyHeader && t !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), o[this.idempotencyHeader] = e.idempotencyKey);
    const i = $([
      o,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(r),
        ...e.timeout ? { "X-Stainless-Timeout": String(Math.trunc(e.timeout / 1e3)) } : {},
        ...Lw(),
        "OpenAI-Organization": this.organization,
        "OpenAI-Project": this.project
      },
      await this.authHeaders(e, e.__security ?? { bearerAuth: !0 }),
      this._options.defaultHeaders,
      n,
      e.headers
    ]);
    return this.validateHeaders(i, e.__security ?? { bearerAuth: !0 }), i.values;
  }
  _makeAbort(e) {
    return () => e.abort();
  }
  buildBody({ options: { body: e, headers: t } }) {
    if (!e) return {
      bodyHeaders: void 0,
      body: void 0,
      isStreamingBody: !1
    };
    const n = $([t]), r = typeof globalThis.ReadableStream < "u" && e instanceof globalThis.ReadableStream, o = !r && (typeof e == "string" || e instanceof ArrayBuffer || ArrayBuffer.isView(e) || typeof globalThis.Blob < "u" && e instanceof globalThis.Blob || e instanceof URLSearchParams || e instanceof FormData);
    return ArrayBuffer.isView(e) || e instanceof ArrayBuffer || e instanceof DataView || typeof e == "string" && n.values.has("content-type") || globalThis.Blob && e instanceof globalThis.Blob || e instanceof FormData || e instanceof URLSearchParams || r ? {
      bodyHeaders: void 0,
      body: e,
      isStreamingBody: !o
    } : typeof e == "object" && (Symbol.asyncIterator in e || Symbol.iterator in e && "next" in e && typeof e.next == "function") ? {
      bodyHeaders: void 0,
      body: Hh(e),
      isStreamingBody: !0
    } : typeof e == "object" && n.values.get("content-type") === "application/x-www-form-urlencoded" ? {
      bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
      body: this.stringifyQuery(e),
      isStreamingBody: !1
    } : {
      ...S(this, yo, "f").call(this, {
        body: e,
        headers: n
      }),
      isStreamingBody: !1
    };
  }
};
Na = H, yo = /* @__PURE__ */ new WeakMap(), Is = /* @__PURE__ */ new WeakSet(), Em = function() {
  return this.baseURL !== "https://api.openai.com/v1";
};
H.OpenAI = Na;
H.DEFAULT_TIMEOUT = 6e5;
H.OpenAIError = O;
H.APIError = de;
H.APIConnectionError = Xo;
H.APIConnectionTimeoutError = aa;
H.APIUserAbortError = ke;
H.NotFoundError = kh;
H.ConflictError = Dh;
H.RateLimitError = Lh;
H.BadRequestError = Mh;
H.AuthenticationError = xh;
H.InternalServerError = Uh;
H.PermissionDeniedError = Nh;
H.UnprocessableEntityError = $h;
H.InvalidWebhookSignatureError = Kn;
H.toFile = sI;
H.Completions = Yp;
H.Chat = ma;
H.Embeddings = Zp;
H.Files = em;
H.Images = sm;
H.Audio = wr;
H.Moderations = lm;
H.Models = am;
H.FineTuning = vn;
H.Graders = Pa;
H.VectorStores = ai;
H.Webhooks = Sm;
H.Beta = yn;
H.Batches = Bp;
H.Uploads = xa;
H.Admin = va;
H.Responses = ii;
H.Realtime = oi;
H.Conversations = Ea;
H.Evals = wa;
H.Containers = Sa;
H.Skills = si;
H.Videos = Am;
function $I(e) {
  if (LI(e)) return "Connection error. This may be caused by passing an undici dispatcher, such as ProxyAgent, that is incompatible with the fetch implementation. If you are using undici's ProxyAgent, pass the fetch implementation from the same undici package: import { fetch, ProxyAgent } from 'undici'; new OpenAI({ fetch, fetchOptions: { dispatcher: new ProxyAgent(...) } });";
}
function LI(e) {
  let t = e;
  for (let n = 0; n < 8 && t && typeof t == "object"; n++) {
    const r = t;
    if (r.code === "UND_ERR_INVALID_ARG" && typeof r.message == "string" && r.message.includes("invalid onRequestStart method")) return !0;
    t = r.cause;
  }
  return !1;
}
function UI(e = {}, t = [], n = To(e, e.reasoning)) {
  return e.provider === "openai-compatible" && e.toolMode !== "tagged-json" && Array.isArray(t) && t.length > 0 && n.profileId === "deepseek-thinking" && n.mode !== "off";
}
function FI(e = []) {
  for (let t = e.length - 1; t >= 0; t -= 1) if (e[t]?.role === "user") return t;
  return -1;
}
function OI(e, t, n) {
  return t > n && Array.isArray(e?.tool_calls) && e.tool_calls.some((r) => String(r?.function?.name || "").trim());
}
function zc(e = "", t = 0) {
  let n = 0;
  for (let r = t - 1; r >= 0 && e[r] === "\\"; r -= 1) n += 1;
  return n % 2 === 1;
}
function GI(e = "") {
  return /^[0-9a-fA-F]{4}$/.test(e);
}
function BI(e = "") {
  return /^[dD][89a-bA-B][0-9a-fA-F]{2}$/.test(e);
}
function qI(e = "") {
  return /^[dD][c-fC-F][0-9a-fA-F]{2}$/.test(e);
}
function HI(e = "") {
  const t = String(e ?? "");
  let n = "", r = 0;
  for (; r < t.length; ) {
    const o = t.slice(r, r + 2), i = t.slice(r + 2, r + 6);
    if (o !== "\\u" || zc(t, r) || !GI(i)) {
      n += t[r] || "", r += 1;
      continue;
    }
    const s = r + 6, u = t.slice(s + 2, s + 6);
    if (BI(i) && t.slice(s, s + 2) === "\\u" && !zc(t, s) && qI(u)) {
      const c = Number.parseInt(i, 16), d = Number.parseInt(u, 16), h = 65536 + (c - 55296 << 10) + (d - 56320);
      n += String.fromCodePoint(h), r += 12;
      continue;
    }
    n += String.fromCharCode(Number.parseInt(i, 16)), r += 6;
  }
  return n;
}
function VI(e = "") {
  let t = String(e ?? "").trim();
  return t.endsWith(",") && (t = t.slice(0, -1).trimEnd()), t.startsWith('\\"') && (t = t.slice(2)), t.endsWith('\\"') && (t = t.slice(0, -2)), t.startsWith('"') && (t = t.slice(1)), t.endsWith('"') && (t = t.slice(0, -1)), HI(t.replace(/\r\n/g, `
`).replace(/\\r/g, "\r").replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\"/g, '"')).replace(/\\\\/g, "\\");
}
function JI(e = "") {
  return String(e || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ka(e = "", t = "", n = 0) {
  const r = new RegExp(`(^|[^A-Za-z0-9_])(?:\\\\?")?${JI(t)}(?:\\\\?")?\\s*:`, "i"), o = String(e || "").slice(Math.max(0, n)).match(r);
  if (!o || o.index === void 0) return null;
  const i = o[1]?.length || 0;
  return {
    key: t,
    index: Math.max(0, n) + o.index + i,
    end: Math.max(0, n) + o.index + o[0].length
  };
}
function KI(e = "", t = [], n = 0) {
  return t.map((r) => ka(e, r, n)).filter(Boolean).sort((r, o) => r.index - o.index)[0] || null;
}
function He(e = "", t = "", n = []) {
  const r = String(e || ""), o = ka(r, t);
  if (!o) return;
  let i = o.end;
  for (; /\s/.test(r[i] || ""); ) i += 1;
  r[i] === '"' && (i += 1);
  const s = KI(r, n.filter((d) => d !== t), i);
  let u = s ? s.index : r.length;
  if (s) {
    const d = r.lastIndexOf(",", s.index);
    d >= i && (u = d);
  }
  let c = r.slice(i, u).trim();
  return s || (c = c.replace(/\}\s*$/, "").trimEnd()), VI(c);
}
function ot(e = "") {
  const t = String(e ?? "").trim();
  return /^-?\d+(?:\.\d+)?$/.test(t) ? Number(t) : /^true$/i.test(t) ? !0 : /^false$/i.test(t) ? !1 : /^null$/i.test(t) ? null : t;
}
var on = {
  Read: [
    "filePath",
    "path",
    "scope",
    "fromLine",
    "toLine",
    "tail",
    "offset",
    "limit",
    "outputMode",
    "contentFormat"
  ],
  Write: [
    "filePath",
    "path",
    "content"
  ],
  Edit: [
    "filePath",
    "path",
    "edits"
  ],
  Delete: ["filePath", "path"],
  Move: [
    "fromPath",
    "toPath",
    "filePath",
    "path"
  ],
  RenameBook: ["title", "name"],
  ImportMaterial: [
    "title",
    "content",
    "source"
  ],
  Glob: [
    "pattern",
    "path",
    "scope"
  ],
  Grep: [
    "pattern",
    "query",
    "path",
    "scope",
    "include",
    "outputMode",
    "limit",
    "offset",
    "contextLines",
    "useRegex"
  ],
  MapDocs: [
    "docType",
    "docId",
    "limit",
    "offset"
  ],
  MapInspect: [
    "docType",
    "docId",
    "mode",
    "elementId",
    "locationKey",
    "actorKey",
    "from",
    "to",
    "kind",
    "status",
    "query",
    "parent",
    "limit",
    "offset"
  ],
  MapPatch: [
    "docType",
    "docId",
    "expectedRevision",
    "activate",
    "dryRun",
    "ops"
  ],
  MemoryRead: [
    "filePath",
    "path",
    "offset",
    "limit",
    "tail"
  ],
  MemoryWrite: [
    "filePath",
    "path",
    "content"
  ],
  MemoryEdit: [
    "filePath",
    "path",
    "edits"
  ],
  MemoryGrep: [
    "pattern",
    "query",
    "filePath",
    "path",
    "scope",
    "outputMode",
    "limit",
    "offset",
    "contextLines",
    "regex",
    "useRegex"
  ],
  ChatHistory: [
    "mode",
    "limit",
    "offset",
    "startOrder",
    "endOrder",
    "pattern",
    "query",
    "regex",
    "useRegex",
    "full"
  ],
  WebSearch: ["query", "maxResults"],
  DelegateRun: ["task"],
  PlanCreate: [
    "title",
    "details",
    "priority",
    "owner",
    "blockedBy"
  ],
  PlanUpdate: [
    "id",
    "status",
    "details",
    "priority",
    "owner",
    "blockedBy"
  ],
  PlanList: ["status"],
  apply_patch: ["patchText"]
};
function Yc(e = "", t = [], n = []) {
  for (const r of t) {
    const o = He(e, r, n);
    if (o !== void 0) return o;
  }
}
function WI(e = "", t = "") {
  if (t === "Read") {
    const n = on.Read, r = {};
    return n.forEach((o, i) => {
      const s = He(e, o, n.slice(i + 1));
      s !== void 0 && (r[o] = ot(s));
    }), r.filePath === void 0 && r.path !== void 0 && (r.filePath = r.path, delete r.path), r.filePath === void 0 && r.scope !== void 0 && (r.filePath = r.scope, delete r.scope), Object.keys(r).length ? r : null;
  }
  if (t === "Write") {
    const n = {}, r = Yc(e, ["filePath", "path"], ["content"]), o = He(e, "content", []);
    return r !== void 0 && (n.filePath = ot(r)), o !== void 0 && (n.content = ot(o)), Object.keys(n).length ? n : null;
  }
  if (t === "Edit") {
    const n = {}, r = Yc(e, ["filePath", "path"], ["edits"]), o = He(e, "edits", []);
    return r !== void 0 && (n.filePath = ot(r)), o !== void 0 && (n.edits = ot(o)), Object.keys(n).length ? n : null;
  }
  if (t === "Grep") {
    const n = on.Grep, r = {};
    return n.forEach((o) => {
      const i = He(e, o, n.filter((s) => s !== o));
      i !== void 0 && (r[o] = ot(i));
    }), r.pattern === void 0 && r.query !== void 0 && (r.pattern = r.query), r.path === void 0 && r.scope !== void 0 && (r.path = r.scope), Object.keys(r).length ? r : null;
  }
  if (t === "MemoryGrep") {
    const n = on.MemoryGrep, r = {};
    return n.forEach((o) => {
      const i = He(e, o, n.filter((s) => s !== o));
      i !== void 0 && (r[o] = ot(i));
    }), r.pattern === void 0 && r.query !== void 0 && (r.pattern = r.query), r.path === void 0 && r.scope !== void 0 && (r.path = r.scope), r.regex === void 0 && r.useRegex !== void 0 && (r.regex = r.useRegex), Object.keys(r).length ? r : null;
  }
  if (t === "ChatHistory") {
    const n = on.ChatHistory, r = {};
    return n.forEach((o) => {
      const i = He(e, o, n.filter((s) => s !== o));
      i !== void 0 && (r[o] = ot(i));
    }), r.pattern === void 0 && r.query !== void 0 && (r.pattern = r.query), r.regex === void 0 && r.useRegex !== void 0 && (r.regex = r.useRegex), Object.keys(r).length ? r : null;
  }
  return null;
}
function zI(e = "", t = "") {
  const n = String(e || "").trim();
  if (!n) return null;
  try {
    const s = JSON.parse(n);
    if (s && typeof s == "object" && !Array.isArray(s)) return s;
  } catch {
  }
  if (!Object.hasOwn(on, t)) return null;
  const r = WI(n, t);
  if (r) return r;
  const o = on[t], i = {};
  return o.forEach((s, u) => {
    const c = He(n, s, o.slice(u + 1));
    c !== void 0 && (i[s] = ot(c));
  }), Object.keys(i).length ? i : null;
}
function Cm(e = "", t = "") {
  const n = zI(e, t);
  return n ? JSON.stringify(n) : "";
}
var YI = /<tool_call\b|<\/?[｜|]+DSML[｜|]+\s*/gi, XI = /<[｜|]+DSML[｜|]+\s*invoke\s+name="([^"]+)"\s*>/iy, QI = /<\/[｜|]+DSML[｜|]+\s*invoke\s*>/iy, ZI = /<[｜|]+DSML[｜|]+\s*(function_calls|calls)\s*>/iy, jI = /<\/[｜|]+DSML[｜|]+\s*(function_calls|calls)\s*>/iy, e0 = /<[｜|]+DSML[｜|]+\s*parameter\s+name="([^"]+)"\s+string="(true|false)"\s*>/iy, t0 = /<(\/?)[｜|]+DSML[｜|]+\s*parameter\b/gi, n0 = /<\/[｜|]+DSML[｜|]+\s*parameter\s*>/iy, Da = /<[^<>"']*(?:"[^"]*"[^<>"']*|'[^']*'[^<>"']*)*>/y;
function ue(e, t, n) {
  return e.lastIndex = n, e.exec(t);
}
function Ir(e, t = 0) {
  return ue(YI, e, t);
}
function $a(e, t) {
  for (; t < e.length && /\s/.test(e[t]); ) t += 1;
  return t;
}
function Be(e, t) {
  const n = /* @__PURE__ */ new SyntaxError(`DSML 工具调用格式无效：${t}（位置 ${e}）。本轮工具未执行。`);
  throw n.code = "DSML_TOOL_CALL_INVALID", n.offset = e, n;
}
function lt(e, t) {
  const n = /* @__PURE__ */ new SyntaxError(`JSON 工具调用格式无效：${t}（位置 ${e}）。本轮工具未执行。`);
  throw n.code = "TAGGED_TOOL_CALL_INVALID", n.offset = e, n;
}
function Xc(e, t) {
  const n = ue(XI, e, t), r = n?.[1].trim();
  r || Be(t, "缺少完整的 invoke 标签或工具名");
  let o = t + n[0].length;
  const i = /* @__PURE__ */ new Set(), s = [];
  for (; o < e.length; ) {
    o = $a(e, o);
    const u = ue(QI, e, o);
    if (u) return {
      end: o + u[0].length,
      calls: [{
        name: r,
        arguments: `{${s.join(",")}}`
      }]
    };
    const c = ue(e0, e, o);
    c || Be(o, "缺少完整的 parameter 标签或 invoke 结束标签");
    const d = c[1];
    i.has(d) && Be(o, "存在重复参数"), i.add(d);
    const h = o + c[0].length, f = ue(t0, e, h);
    (!f || !f[1]) && Be(h, "参数未闭合或参数边界有歧义");
    const p = ue(n0, e, f.index);
    p || Be(f.index, "parameter 结束标签无效");
    const m = e.slice(h, f.index);
    let g = JSON.stringify(m);
    if (c[2].toLowerCase() === "false") {
      g = m.trim();
      try {
        JSON.parse(g);
      } catch {
        Be(h, "非字符串参数不是合法 JSON");
      }
    }
    s.push(`${JSON.stringify(d)}:${g}`), o = f.index + p[0].length;
  }
  Be(o, "invoke 未闭合");
}
function r0(e, t) {
  const n = ue(ZI, e, t);
  if (!n) return Xc(e, t);
  let r = t + n[0].length;
  const o = [];
  for (; r < e.length; ) {
    r = $a(e, r);
    const i = ue(jI, e, r);
    if (i)
      return i[1].toLowerCase() !== n[1].toLowerCase() && Be(r, "调用组结束标签不匹配"), {
        end: r + i[0].length,
        calls: o
      };
    const s = Xc(e, r);
    o.push(...s.calls), r = s.end;
  }
  Be(r, "调用组未闭合");
}
function wm(e, t) {
  const n = [];
  let r = !1, o = !1;
  for (let i = t; i < e.length; i += 1) {
    const s = e[i];
    if (r)
      s === "\\" ? i += 1 : s === '"' && (r = !1);
    else if (s === '"') r = !0;
    else if (s === "{" || s === "[")
      n.length && (o = !0), n.push(s === "{" ? "}" : "]");
    else if (s === "}" || s === "]") {
      if (n.pop() !== s) return {
        end: -1,
        boundary: i,
        mismatched: !0
      };
      if (!n.length) return {
        end: i + 1,
        boundary: i + 1,
        nested: o
      };
    } else if (s === "<") return {
      end: -1,
      boundary: i
    };
  }
  return {
    end: -1,
    boundary: e.length
  };
}
function Im(e, t, n) {
  if (e[t] !== "[" || n.end < 0 || n.nested) return !1;
  try {
    return JSON.parse(e.slice(t, n.end)), !1;
  } catch {
    return !0;
  }
}
function o0(e, t) {
  let n = t, r;
  for (; r = ue(/["<{[]/g, e, n); ) {
    if (n = r.index, r[0] === '"') {
      const i = La(e, n);
      i < 0 && lt(t, "JSON 前的说明文字引号未闭合"), n = i;
      continue;
    }
    if (r[0] === "<") {
      if (ue(/<\/tool_call>/iy, e, n)) return null;
      const i = ue(Da, e, n);
      n += i?.[0].length || 1;
      continue;
    }
    const o = wm(e, n);
    if (Im(e, n, o)) {
      n = o.end;
      continue;
    }
    return {
      start: n,
      ...o
    };
  }
  return null;
}
function La(e, t) {
  for (let n = t + 1; n < e.length; n += 1) if (e[n] === "\\") n += 1;
  else if (e[n] === '"') return n + 1;
  return -1;
}
function Qc(e, t) {
  for (let n = 0; n < e.length; ) {
    const r = e[n], o = r === "<" ? ue(Da, e, n) : null;
    if (o) n += o[0].length;
    else if (r === '"') {
      const i = La(e, n);
      i < 0 && lt(t, "JSON 外的说明文字引号未闭合"), e[$a(e, i)] === ":" && lt(t, "完整 JSON 外出现字段，不能作为杂文剥离"), n = i;
    } else if (r === "{" || r === "[") {
      const i = wm(e, n);
      Im(e, n, i) || lt(t, "同一工具块中存在多个 JSON 结构"), n = i.end;
    } else n += 1;
  }
}
function i0(e, t, n) {
  let r = t, o;
  for (; o = ue(/["<]/g, e, r); )
    if (r = o.index, o[0] === '"') {
      const i = La(e, r);
      i < 0 && lt(n, "JSON 外的说明文字引号未闭合"), r = i;
    } else {
      const i = ue(/<\/tool_call>/iy, e, r);
      if (i) return i;
      const s = ue(Da, e, r);
      r += s?.[0].length || 1;
    }
  return null;
}
function s0(e, t) {
  let n;
  try {
    n = JSON.parse(e);
  } catch {
    return;
  }
  n && typeof n == "object" && !Array.isArray(n) && Object.keys(n).some((r) => ![
    "id",
    "name",
    "arguments"
  ].includes(r)) && lt(t, "工具封装中存在 id、name、arguments 之外的字段，无法确定参数边界");
}
function a0(e, t) {
  const n = ue(/<tool_call>/iy, e, t);
  if (!n) return null;
  const r = t + n[0].length, o = o0(e, r);
  o?.mismatched && lt(t, "JSON 括号不匹配，无法确定调用边界");
  const i = i0(e, o?.boundary ?? r, t);
  if (!i)
    return o && ue(/<\/tool_call>/gi, e, o.start) && lt(t, "未找到 JSON 字符串之外的 tool_call 结束标签"), /<\/[｜|]+DSML[｜|]+/i.test(e.slice(r)) && Be(t, "tool_call 开头与 DSML 结尾混用，无法确定调用边界"), null;
  let s = e.slice(r, i.index);
  const u = e.slice(r, o?.start ?? r), c = e.slice(o?.boundary ?? r, i.index), d = /<tool_call\b|<[｜|]+DSML[｜|]+\s*(?:invoke|function_calls|calls)\b/i;
  return (d.test(u) || d.test(c)) && lt(t, "同一工具块中出现另一条工具调用，不能作为杂文剥离"), o?.end >= 0 && (Qc(u, t), Qc(c, t), s = e.slice(o.start, o.end), s0(s, t)), {
    end: i.index + i[0].length,
    payload: s
  };
}
function l0(e) {
  const t = [];
  let n = 0, r;
  for (; r = Ir(e, n); ) if (/^<tool_call/i.test(r[0])) {
    const i = a0(e, r.index);
    if (!i) break;
    t.push(i), n = i.end;
  } else {
    const i = r0(e, r.index);
    t.push(i), n = i.end;
  }
  const o = bm(e);
  return o >= n && /^<\/?[｜|]/.test(e.slice(o)) && Be(o, "DSML 标记未输出完整"), t;
}
function bm(e) {
  const t = e.lastIndexOf("<");
  if (t < 0) return -1;
  const n = e.slice(t).replace(/[｜|]+/g, "|").toLowerCase();
  return [
    "<tool_call",
    "<|dsml|",
    "</|dsml|"
  ].some((r) => r.startsWith(n)) ? t : -1;
}
function u0(e) {
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function qe(e, t, n) {
  const r = String(n || "").trim();
  r && e.push({
    label: t,
    text: r
  });
}
function me(e) {
  if (e !== void 0)
    try {
      return JSON.parse(JSON.stringify(e));
    } catch {
      return;
    }
}
function dn(e, t) {
  return e.captureRawAssistantMessage === !0 ? { rawAssistantMessage: me(t) } : {};
}
function Y(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Rm(e = "") {
  return !!Ir(String(e || ""));
}
function Pm(e) {
  if (typeof e == "string") return e;
  if (e == null) return "{}";
  try {
    return JSON.stringify(e);
  } catch {
    return "{}";
  }
}
function Mm(e, t = "") {
  const n = Pm(e);
  try {
    return JSON.parse(n), n;
  } catch {
    return Cm(n, t) || n;
  }
}
function c0(e = "") {
  const t = String(e || ""), n = ka(t, "arguments");
  if (!n) return "";
  let r = n.end;
  for (; /\s/.test(t[r] || ""); ) r += 1;
  const o = t[r] || "";
  return o === "{" ? t.slice(r).replace(/\}\s*$/, "").trimEnd() : o === '"' ? t.slice(r + 1).replace(/"\s*\}\s*$/, "").trimEnd() : t.slice(r).replace(/\}\s*$/, "").trimEnd();
}
function d0(e = "") {
  const t = String(e || "").trim(), n = He(t, "name", ["id", "arguments"]) || He(t, "toolName", ["id", "arguments"]) || "", r = He(t, "id", [
    "name",
    "toolName",
    "arguments"
  ]), o = c0(t);
  return !n || !o ? null : {
    id: r,
    name: n,
    arguments: Mm(o, n)
  };
}
function f0(e, t = 0, n = "openai-tool") {
  if (!Y(e)) return null;
  const r = Y(e.function) ? e.function : null, o = String(r?.name || "").trim();
  if (!o) return null;
  const i = me(e) || {};
  return delete i.index, i.id = String(i.id || `${n}-${t + 1}`), i.type = "function", i.function = {
    ...me(r) || {},
    name: o,
    arguments: Pm(r.arguments)
  }, i;
}
function fr(e = [], t = "openai-tool") {
  return (Array.isArray(e) ? e : []).map((n, r) => f0(n, r, t)).filter(Boolean);
}
function hr(e, t) {
  return Array.isArray(e) ? e.some((n) => hr(n, t)) : Y(e) ? Object.entries(e).some(([n, r]) => String(n || "").replace(/[_-]/g, "").toLowerCase() === "thoughtsignature" ? t(r) : (Array.isArray(r) || Y(r)) && hr(r, t)) : !1;
}
function h0(e) {
  return hr(e, (t) => typeof t == "string" && t.length > 0);
}
function bs(e) {
  return hr(e, () => !0);
}
function p0(e) {
  return hr(e, (t) => typeof t != "string" || t.length === 0);
}
function m0(e = {}) {
  return Array.isArray(e?.tool_calls) && e.tool_calls.some((t) => h0(t));
}
var Zc = /* @__PURE__ */ new WeakSet();
function Ua(e) {
  if (!Y(e)) return null;
  const t = me(e) || {};
  if (typeof t.content == "string" && Rm(t.content) && (t.content = Lt(Ne(t.content).cleaned)), Array.isArray(t.tool_calls)) {
    const n = fr(t.tool_calls);
    n.length ? t.tool_calls = n : delete t.tool_calls;
  }
  return t;
}
function Fa(e = [], t = "openai-tool") {
  return fr(e, t).map((n, r) => ({
    id: n.id || `${t}-${Date.now()}-${r + 1}`,
    name: n.function.name,
    arguments: n.function.arguments
  }));
}
function pr(e) {
  return typeof e == "string" ? e : Array.isArray(e) ? e.map((t) => t ? typeof t == "string" ? t : t.text || t.content || "" : "").filter(Boolean).join(`
`) : "";
}
function Ne(e = "") {
  const t = [], n = String(e || "");
  let r = 0, o = "";
  for (const i of n.matchAll(/<think>([\s\S]*?)<\/think>/gi)) {
    const s = Ir(n, r);
    if (s && s.index < i.index) break;
    o += n.slice(r, i.index), qe(t, "思考块", i[1]), r = i.index + i[0].length;
  }
  return o = (o + n.slice(r)).trim(), {
    cleaned: o,
    thoughts: t
  };
}
function Lt(e = "", { streaming: t = !1 } = {}) {
  const n = String(e || ""), r = Ir(n)?.index ?? (t ? bm(n) : -1);
  return r < 0 ? n.trim() : n.slice(0, r).trim();
}
function Rs(e = "") {
  const t = String(e || "");
  if (!Rm(t)) return [];
  const n = Ir(t), r = t.slice(n.index);
  return [{
    id: "tagged-json-draft",
    name: (/^<tool_call/i.test(n[0]) ? r.match(/["']?name["']?\s*:\s*["']([^"']+)/i) : r.match(/<[｜|]+DSML[｜|]+\s*invoke\s+name="([^"]+)"/i))?.[1] || "工具调用",
    arguments: "{}",
    draft: !0
  }];
}
function Dt(e, t, n) {
  if (t) {
    if (typeof t == "string") {
      qe(e, n, t);
      return;
    }
    if (Array.isArray(t)) {
      t.forEach((r) => Dt(e, r, n));
      return;
    }
    typeof t == "object" && (typeof t.text == "string" && qe(e, n, t.text), typeof t.content == "string" && qe(e, n, t.content), typeof t.reasoning_content == "string" && qe(e, n, t.reasoning_content), typeof t.thinking == "string" && qe(e, n, t.thinking), Array.isArray(t.summary) && t.summary.forEach((r) => {
      if (typeof r == "string") {
        qe(e, "推理摘要", r);
        return;
      }
      r && typeof r == "object" && qe(e, "推理摘要", r.text || r.content || "");
    }));
  }
}
function At(e = {}, t = {}) {
  const n = [];
  return Dt(n, e.reasoning_content, "推理文本"), Dt(n, e.reasoning, "推理文本"), Dt(n, e.reasoning_text, "推理文本"), Dt(n, e.thinking, "思考块"), Dt(n, t.reasoning_content, "推理文本"), Dt(n, t.reasoning, "推理文本"), Array.isArray(e.content) && e.content.forEach((r) => {
    if (!(!r || typeof r != "object")) {
      if (r.type === "reasoning_text") {
        qe(n, "推理文本", r.text);
        return;
      }
      if (r.type === "summary_text") {
        qe(n, "推理摘要", r.text);
        return;
      }
      (r.type === "thinking" || r.type === "reasoning" || r.type === "reasoning_content") && qe(n, "思考块", r.text || r.content || r.reasoning || "");
    }
  }), n;
}
function g0(e = "") {
  const t = String(e || ""), n = [];
  l0(t).forEach((i) => {
    if (i.calls) {
      n.push(...i.calls);
      return;
    }
    try {
      const s = JSON.parse(i.payload);
      n.push({
        id: s.id,
        name: String(s.name || ""),
        arguments: Mm(s.arguments, s.name)
      });
    } catch {
      const s = d0(i.payload);
      s && n.push(s);
    }
  });
  const r = n.filter((i) => i.name), o = new Set(r.filter((i) => i.id).map((i) => String(i.id)));
  return r.map((i, s) => {
    if (i.id) return i;
    let u = s + 1;
    for (; o.has(`tool-call-${u}`); ) u += 1;
    const c = `tool-call-${u}`;
    return o.add(c), {
      ...i,
      id: c
    };
  });
}
function sr(e, t, n, r) {
  try {
    return g0(t);
  } catch (o) {
    throw Object.assign(o, dn(e, n)), r && (o.requestInspection = r), o;
  }
}
function Oa(e) {
  const t = e?.providerPayload?.openaiCompatibleMessage;
  return !t || typeof t != "object" || Array.isArray(t) ? null : Ua(t);
}
function _0(e = {}) {
  const t = fr(e?.tool_calls);
  if (t.length) return t;
  const n = fr(Oa(e)?.tool_calls);
  return n.length ? n : [];
}
function y0(e = "") {
  return /deepseek/i.test(String(e || ""));
}
function v0(e = "") {
  return /claude/i.test(String(e || ""));
}
function A0(e = "") {
  return qo(e) === "openai";
}
function xm(e = {}, t = {}) {
  return t.mode !== "on" && t.mode !== "off" ? e : t.profileId === "kimi-k3" ? (e.reasoning_effort = t.mode === "off" ? "off" : t.effort, e) : t.profileId === "deepseek-thinking" ? (e.thinking = { type: t.mode === "off" ? "disabled" : "enabled" }, t.mode === "on" && (e.reasoning_effort = t.effort), e) : (String(t.profileId || "").startsWith("openai-") && (e.reasoning_effort = t.mode === "off" ? "none" : t.effort), e);
}
function Nm(e = [], t = "") {
  if (!v0(t)) return e;
  let n = -1;
  for (let o = e.length - 1; o >= 0; o -= 1) if (typeof e[o]?.role == "string") {
    n = o;
    break;
  }
  const r = e[n]?.role;
  return n < 0 || r === "user" || r !== "system" && r !== "assistant" ? e : e.map((o, i) => i === n ? {
    ...o,
    role: "user"
  } : o);
}
function jc(e, t = "") {
  return !Y(e) || !y0(t) || !Array.isArray(e.tool_calls) || !e.tool_calls.length || Object.prototype.hasOwnProperty.call(e, "reasoning_content") ? e : {
    ...e,
    reasoning_content: ""
  };
}
var Ps = /* @__PURE__ */ new Set([
  "content",
  "refusal",
  "arguments",
  "reasoning_content",
  "reasoning_text",
  "thinking",
  "text"
]);
function T0(e = [], t = []) {
  const n = Array.isArray(e) ? e.map((r) => me(r) || {}) : [];
  return (Array.isArray(t) ? t : []).forEach((r, o) => {
    const i = me(r) || {}, s = Number.isInteger(Number(r?.index)) ? Number(r.index) : o, u = n[s];
    n[s] = Y(u) ? br(u, i, "tool_call") : i;
  }), n.filter((r) => r !== void 0);
}
function br(e, t, n = "") {
  if (t === void 0) return e;
  if (e === void 0) return me(t);
  if (t === null && Ps.has(String(n || ""))) return e;
  if (n === "tool_calls" && Array.isArray(e) && Array.isArray(t)) return T0(e, t);
  if (typeof e == "string" && typeof t == "string")
    return Ps.has(String(n || "")) ? e === t ? e : t.startsWith(e) ? t : e.startsWith(t) ? e : `${e}${t}` : e === t ? e : me(t);
  if (Array.isArray(e) && Array.isArray(t)) return e.concat(me(t) || []);
  if (Y(e) && Y(t)) {
    const r = { ...e };
    return Object.entries(t).forEach(([o, i]) => {
      r[o] = br(r[o], i, o);
    }), r;
  }
  return me(t);
}
function Lo(e = {}, t = {}) {
  const n = Y(e) ? me(e) || {} : {}, r = Y(t) ? me(t) || {} : {};
  return delete r.message, delete r.finish_reason, delete r.index, delete r.logprobs, delete r.delta, Object.entries(r).forEach(([o, i]) => {
    n[o] = br(n[o], i, o);
  }), n.role || (n.role = "assistant"), Ua(n) || { role: "assistant" };
}
function ar(e, t = {}) {
  const n = Ua(Lo(e, t));
  if (!(!n || typeof n != "object" || Array.isArray(n)))
    return { openaiCompatibleMessage: n };
}
function S0(e = {}, t = {}) {
  return Y(e) ? Y(t) ? br(me(e) || {}, t, "") : me(e) : me(t);
}
function Ms(e, t = "", { preserveReasoningContent: n = !1 } = {}) {
  const r = Array.isArray(e.messages) ? e.messages : [], o = FI(r), i = [];
  let s = !1;
  r.forEach((c, d) => {
    if (s) {
      if (c?.role === "tool") return;
      s = !1;
    }
    const h = c?.role === "assistant", f = h ? c?.providerPayload?.openaiCompatibleMessage : null, p = Dm(Array.isArray(f?.tool_calls) && f.tool_calls.some((A) => bs(A)) ? f.tool_calls : h && Array.isArray(c?.tool_calls) && c.tool_calls.some((A) => bs(A)) ? c.tool_calls : null);
    if (p) {
      const A = Y(f) ? f : c;
      (!Y(A) || !Zc.has(A)) && (Y(A) && Zc.add(A), console.warn("[LittleWhiteBox/OpenAI-compatible] skipped corrupted signed tool-call history", {
        code: "openai_compatible_signed_tool_call_history_corrupted",
        toolIndex: p.index,
        toolName: p.toolName,
        reason: p.reason
      })), s = !0;
      return;
    }
    const m = h ? fr(c?.tool_calls) : [], g = h ? Oa(c) : null, _ = Array.isArray(g?.tool_calls) ? g.tool_calls : [], y = _.length > 0 && m0(g);
    if (OI(g, d, o)) {
      i.push(jc({
        ...g,
        ...m.length && !y ? { tool_calls: m } : {}
      }, t));
      return;
    }
    const E = {
      role: c.role,
      content: c.content
    };
    n && typeof g?.reasoning_content == "string" && (E.reasoning_content = g.reasoning_content), c.role === "tool" && c.tool_call_id && (E.tool_call_id = c.tool_call_id), y ? E.tool_calls = _ : m.length && (E.tool_calls = m), i.push(jc(E, t));
  });
  const u = String(e.systemPrompt || "").trim();
  if (u) if (i[0]?.role === "system") {
    const c = String(i[0].content || "").trim();
    i[0] = {
      ...i[0],
      content: [u, c === u ? "" : c].filter(Boolean).join(`

`)
    };
  } else i.unshift({
    role: "system",
    content: u
  });
  return Nm(i, t);
}
function ed(e) {
  const t = (e.tools || []).map((o) => [`- ${o.function.name}: ${o.function.description || ""}`.trim(), `  参数 JSON Schema: ${JSON.stringify(o.function.parameters || {})}`].join(`
`)).join(`
`), n = String(e.toolChoice || "auto").trim() || "auto", r = n === "required" ? "本轮必须调用工具，不得只返回正文。" : n === "none" ? "本轮不得调用工具，不得输出 <tool_call> 标签。" : n === "auto" ? "请根据任务判断是否需要调用工具。" : `本轮必须调用工具 ${n}，不得调用其他工具，也不得只返回正文。`;
  return [
    e.systemPrompt || "",
    "如果你需要调用工具，不要使用原生 tool calling 字段。",
    r,
    "用 <tool_call> 和 </tool_call> 明确 JSON 范围，请严格输出如下边界标记和包裹的 JSON，不要改写边界标记：",
    '<tool_call>{"name":"工具名","arguments":{...}}</tool_call>',
    "如果需要多个工具调用，可以连续输出多段 <tool_call> ... </tool_call>。",
    "在输出第一个 <tool_call> 之前，可根据任务复杂度决定是否需要先说明：简单查询可直接输出 <tool_call>；复杂任务可先简要说明你准备查什么或怎么查。",
    "一旦开始输出第一个 <tool_call>，就不要再继续输出面向用户的正文、解释、总结或补充；把本轮需要的 tool_call 连续输出完就结束。",
    t ? `可用工具:
${t}` : ""
  ].filter(Boolean).join(`

`);
}
function xs(e, t = "") {
  const n = /* @__PURE__ */ new Map(), r = [];
  if ((Array.isArray(e.messages) ? e.messages : []).forEach((o) => {
    if (o.role === "assistant") {
      const i = _0(o);
      if (i.length) {
        const s = Oa(o), u = typeof s?.content == "string" ? s.content : String(o.content || ""), c = i.map((d, h) => {
          const f = d.function?.name || "", p = d.id || `tool-call-${h + 1}`;
          return f && n.set(p, f), `<tool_call>${JSON.stringify({
            id: p,
            name: f,
            arguments: u0(d.function.arguments)
          })}</tool_call>`;
        }).join(`
`);
        r.push({
          role: "assistant",
          content: [u, c].filter(Boolean).join(`

`)
        });
        return;
      }
    }
    if (o.role === "tool") {
      const i = String(o.toolName || o.tool_name || "").trim() || n.get(o.tool_call_id || "") || "unknown_tool";
      o.tool_call_id && n.delete(o.tool_call_id);
      const s = String(o.content || "");
      r.push({
        role: "user",
        content: [
          "<tool_result>",
          "这是系统工具执行结果，不是用户新发言。",
          `name: ${i}`,
          "content:",
          s,
          "</tool_result>"
        ].join(`
`)
      });
      return;
    }
    r.push({
      role: o.role,
      content: o.content
    });
  }), !r.length || r[0].role !== "system") r.unshift({
    role: "system",
    content: ed(e)
  });
  else {
    const o = String(r[0].content || "").trim(), i = String(e.systemPrompt || "").trim();
    r[0] = {
      ...r[0],
      content: [ed(e), o === i ? "" : o].filter(Boolean).join(`

`)
    };
  }
  return Nm(r, t);
}
function td(e, t, n) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: z(n) ? t.thoughts : [] } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft ? { toolCallDraft: !0 } : {}
  });
}
function Fn(e, t = []) {
  return z(e) ? t : [];
}
function km(e, t, n) {
  !e || !t || n === void 0 || (e[t] = br(e[t], n, t));
}
function Uo(e, t, n) {
  if (!(!e || !t || n === void 0)) {
    if (Y(n)) {
      const r = Y(e[t]) ? { ...e[t] } : {};
      Object.entries(n).forEach(([o, i]) => {
        Uo(r, o, i);
      }), e[t] = r;
      return;
    }
    if (typeof n == "string" && Ps.has(t)) {
      e[t] = typeof e[t] == "string" ? `${e[t]}${n}` : n;
      return;
    }
    n === "" && e[t] || km(e, t, n);
  }
}
function E0(e, t = []) {
  !Array.isArray(t) || !t.length || (Array.isArray(e.tool_calls) || (e.tool_calls = []), t.forEach((n) => {
    const r = Number(n?.index ?? 0), o = { ...e.tool_calls[r] || {} };
    Object.entries(n || {}).forEach(([i, s]) => {
      if (i !== "index" && !(i === "function" && s == null)) {
        if (i === "function" && Y(s)) {
          o.function = Y(o.function) ? { ...o.function } : {}, Object.entries(s).forEach(([u, c]) => {
            Uo(o.function, u, c);
          });
          return;
        }
        Uo(o, i, s);
      }
    }), e.tool_calls[r] = o;
  }));
}
function Ns(e, t = {}) {
  if (!e || !t || typeof t != "object") return;
  Object.entries(t).forEach(([r, o]) => {
    r === "delta" || r === "finish_reason" || r === "index" || r === "logprobs" || km(e, r, o);
  });
  const n = Y(t.delta) ? t.delta : {};
  Object.entries(n).forEach(([r, o]) => {
    if (r === "tool_calls") {
      E0(e, o);
      return;
    }
    Uo(e, r, o);
  });
}
function it(e = {}) {
  return pr(e?.content);
}
function sn(e = {}) {
  return Fa(e?.tool_calls || []);
}
function C0(e) {
  if (typeof e != "string" || !e.trim()) return !1;
  try {
    return Y(JSON.parse(e));
  } catch {
    return !1;
  }
}
function Dm(e) {
  if (!Array.isArray(e) || !e.some((t) => bs(t))) return null;
  for (let t = 0; t < e.length; t += 1) {
    const n = e[t], r = Y(n?.function) ? n.function : null, o = String(r?.name || "").trim();
    let i = "";
    if (!Y(n) || !r ? i = "invalid_function_shape" : o ? C0(r.arguments) ? p0(n) && (i = "invalid_thought_signature") : i = "invalid_function_arguments" : i = "missing_function_name", i) return {
      index: t,
      toolName: o,
      reason: i
    };
  }
  return null;
}
function an(e = {}) {
  const t = Dm(e?.tool_calls);
  if (!t) return;
  const n = /* @__PURE__ */ new Error("openai_compatible_signed_tool_call_corrupted");
  throw n.toolIndex = t.index, n.toolName = t.toolName, n.reason = t.reason, n;
}
async function w0(e, t) {
  const n = e.body?.getReader?.();
  if (!n) throw new Error("openai_compatible_stream_missing_body");
  const r = new TextDecoder();
  let o = "";
  const i = /\r?\n\r?\n/, s = (u) => {
    const c = u.split(/\r?\n/).filter((d) => d.startsWith("data:")).map((d) => d.slice(5).trimStart()).join(`
`).trim();
    c && c !== "[DONE]" && t(JSON.parse(c));
  };
  try {
    for (; ; ) {
      const { done: c, value: d } = await n.read();
      if (c) break;
      for (o += r.decode(d, { stream: !0 }); ; ) {
        const h = o.match(i);
        if (!h || typeof h.index != "number") break;
        const f = h.index, p = o.slice(0, f);
        o = o.slice(f + h[0].length), s(p);
      }
    }
    const u = o.trim();
    u && s(u);
  } catch (u) {
    try {
      await n.cancel();
    } catch {
    }
    throw u;
  } finally {
    n.releaseLock();
  }
}
function I0(e, t) {
  const n = String(e || "").trim();
  if (n && (n.startsWith("{") || n.startsWith("["))) try {
    const r = JSON.parse(n), o = r?.error?.message || r?.message;
    if (typeof o == "string" && o.trim()) return o.trim();
  } catch {
  }
  return n || `OpenAI 兼容流式请求失败（HTTP ${t}）`;
}
var b0 = class {
  constructor(e) {
    this.config = e, this.auth = Bo("openai-compatible", e.apiKey), this.client = new H({
      ...this.auth.sdkOptions,
      baseURL: String(e.baseUrl || "https://api.openai.com/v1").replace(/\/$/, ""),
      timeout: Number(e.timeoutMs) || 900 * 1e3,
      maxRetries: 0,
      dangerouslyAllowBrowser: !0
    });
  }
  buildRequestBody(e, t = j("openai-compatible", this.config, e.reasoning)) {
    const n = t, r = (this.config.toolMode || "native") === "tagged-json" && Array.isArray(e.tools) && e.tools.length > 0, o = !r && Array.isArray(e.tools) && e.tools.length ? e.tools : null, i = UI({
      ...this.config,
      provider: "openai-compatible"
    }, o, n), s = {
      model: this.config.model,
      messages: r ? xs(e, this.config.model) : Ms(e, this.config.model, { preserveReasoningContent: i }),
      ...o ? {
        tools: o,
        tool_choice: e.toolChoice || "auto"
      } : {},
      ...e.maxTokens ? A0(this.config.model) ? { max_completion_tokens: e.maxTokens } : { max_tokens: e.maxTokens } : {}
    };
    return i && (s.tool_choice === "required" || s.tool_choice?.type === "function") && (s.tool_choice = "auto"), !gr({
      ...this.config,
      provider: "openai-compatible"
    }, n) && typeof e.temperature == "number" && (s.temperature = e.temperature), xm(s, n);
  }
  inspectRequest(e, t = {}) {
    const n = typeof e.onStreamProgress == "function", r = t.effectiveReasoning || j("openai-compatible", this.config, e.reasoning), o = {
      ...t.body || this.buildRequestBody(e, r),
      ...n ? { stream: !0 } : {}
    }, i = String(this.config.baseUrl || "https://api.openai.com/v1").replace(/\/$/, ""), s = {
      ...Object.hasOwn(o, "reasoning_effort") ? { reasoning_effort: o.reasoning_effort } : {},
      ...Object.hasOwn(o, "thinking") ? { thinking: o.thinking } : {}
    };
    return { ...cr({
      provider: "openai-compatible",
      model: this.config.model,
      transport: "openai-compatible",
      url: `${i}/chat/completions`,
      headers: this.auth.requestHeaders,
      body: o,
      sdk: n ? "client.chat.completions.create(..., { stream: true })" : "client.chat.completions.create",
      effectiveConfig: {
        ...Ct(e, {
          reasoning: r,
          effort: o.reasoning_effort,
          controlFields: s
        }),
        ...o.tool_choice !== void 0 ? { toolChoice: o.tool_choice } : {}
      }
    }) };
  }
  async streamNativeChatCompletions(e, t, n) {
    const r = `${String(this.config.baseUrl || "https://api.openai.com/v1").replace(/\/$/, "")}/chat/completions`, o = await fetch(r, {
      method: "POST",
      headers: this.auth.requestHeaders,
      body: JSON.stringify({
        ...t,
        stream: !0
      }),
      signal: e.signal
    });
    if (!o.ok) {
      const g = await o.text().catch(() => ""), _ = new Error(I0(g, o.status));
      throw _.status = o.status, _.body = g, _;
    }
    const i = { role: "assistant" };
    let s, u = this.config.model;
    await w0(o, (g) => {
      if (g?.error) throw new H.APIError(void 0, g.error, void 0, o.headers);
      u = g?.model || u;
      const _ = g?.choices?.[0];
      Ns(i, _), _?.finish_reason && (s = _.finish_reason);
      const y = Ne(it(i)), E = sn(i), A = E.length ? E : Rs(y.cleaned);
      td(e, {
        text: E.length ? y.cleaned : Lt(y.cleaned, { streaming: !0 }),
        thoughts: Fn(n, At(i, _).concat(y.thoughts)),
        ...A.length ? { toolCalls: A } : {},
        ...!E.length && A.length ? { toolCallDraft: !0 } : {}
      }, n);
    }), at("openai", s, !!i.refusal, Ne(it(i)).cleaned), an(i);
    const c = ar(i), d = sn(i), h = Ne(it(i)), f = At(i, {});
    h.thoughts.forEach((g) => f.push(g));
    const p = d.length ? [] : sr(e, h.cleaned, i), m = [...d, ...p];
    return {
      text: d.length ? h.cleaned : Lt(h.cleaned),
      toolCalls: m,
      thoughts: Fn(n, f),
      finishReason: s,
      model: u,
      provider: "openai-compatible",
      providerPayload: c,
      ...dn(e, i)
    };
  }
  async chat(e) {
    const t = j("openai-compatible", this.config, e.reasoning), n = (this.config.toolMode || "native") === "tagged-json" && Array.isArray(e.tools) && e.tools.length > 0, r = typeof e.onStreamProgress == "function", o = this.buildRequestBody(e, t), i = this.inspectRequest(e, {
      body: o,
      effectiveReasoning: t
    }), s = async (E) => {
      try {
        return await E(o);
      } catch (A) {
        throw A && typeof A == "object" && (A.requestInspection = i), A;
      }
    };
    if (r) {
      if (!n) return {
        ...await s((V) => this.streamNativeChatCompletions(e, V, t)),
        requestInspection: i
      };
      const E = await s((V) => this.client.chat.completions.create({
        ...V,
        stream: !0
      }, { signal: e.signal })), A = { role: "assistant" };
      let w, P = this.config.model, L;
      for await (const V of E) {
        P = V.model || P;
        const W = V.choices?.[0];
        Ns(A, W), W?.finish_reason && (w = W.finish_reason);
        const ge = Ne(it(A)), ze = sn(A), Ue = ze.length ? ze : Rs(ge.cleaned);
        td(e, {
          text: ze.length ? ge.cleaned : Lt(ge.cleaned, { streaming: !0 }),
          thoughts: Fn(t, At(A, W).concat(ge.thoughts)),
          ...Ue.length ? { toolCalls: Ue } : {},
          ...!ze.length && Ue.length ? { toolCallDraft: !0 } : {}
        }, t);
      }
      at("openai", w, !!A.refusal, Ne(it(A)).cleaned);
      const C = (typeof E.finalChatCompletion == "function" ? await E.finalChatCompletion() : null)?.choices?.[0] || null, k = C?.message || A;
      an(k);
      const I = S0(A, Lo(k, C || {}));
      an(I), L = ar(I);
      const x = sn(I), b = Ne(it(I)), F = At(I, C || {});
      b.thoughts.forEach((V) => F.push(V));
      const X = x.length ? [] : sr(e, b.cleaned, k, i), J = [...x, ...X];
      return {
        text: x.length ? b.cleaned : Lt(b.cleaned),
        toolCalls: J,
        thoughts: Fn(t, F),
        finishReason: w,
        model: P,
        provider: "openai-compatible",
        providerPayload: L,
        requestInspection: i,
        ...dn(e, k)
      };
    }
    const u = await s((E) => this.client.chat.completions.create(E, { signal: e.signal })), c = u.choices?.[0] || {}, d = c.message || {};
    at("openai", c.finish_reason, !!d.refusal, Ne(pr(d.content)).cleaned), an(d);
    const h = At(d, c), f = Fa(d.tool_calls || []), p = Ne(pr(d.content));
    p.thoughts.forEach((E) => h.push(E));
    const m = f.length ? [] : sr(e, p.cleaned, d, i), g = [...f, ...m], _ = f.length ? p.cleaned : Lt(p.cleaned), y = Lo(d, c);
    return {
      text: _,
      toolCalls: g,
      thoughts: Fn(t, h),
      finishReason: c.finish_reason,
      model: u.model || this.config.model,
      provider: "openai-compatible",
      providerPayload: ar(y),
      requestInspection: i,
      ...dn(e, d)
    };
  }
};
function R0(e) {
  if (e !== void 0)
    try {
      return JSON.parse(JSON.stringify(e));
    } catch {
      return;
    }
}
function Ga(e) {
  const t = R0(Array.isArray(e) ? e : []);
  return Array.isArray(t) ? (t.forEach((n) => {
    !n || typeof n != "object" || Array.isArray(n) || (n.type === "function_call" && delete n.parsed_arguments, n.type === "message" && Array.isArray(n.content) && n.content.forEach((r) => {
      !r || typeof r != "object" || Array.isArray(r) || delete r.parsed;
    }));
  }), t) : [];
}
function $m(e, t) {
  return {
    type: "message",
    role: e,
    content: P0(t)
  };
}
function Fo(e) {
  return {
    role: "assistant",
    content: typeof e == "string" ? e : ""
  };
}
function P0(e) {
  if (typeof e == "string") return [{
    type: "input_text",
    text: e
  }];
  if (!Array.isArray(e)) return [{
    type: "input_text",
    text: ""
  }];
  const t = e.map((n) => !n || typeof n != "object" ? null : n.type === "image_url" && n.image_url?.url ? {
    type: "input_image",
    image_url: n.image_url.url
  } : n.type === "text" ? {
    type: "input_text",
    text: n.text || ""
  } : null).filter(Boolean);
  return t.length ? t : [{
    type: "input_text",
    text: ""
  }];
}
function Oo(e, t, n) {
  const r = String(n || "").trim();
  r && e.push({
    label: t,
    text: r
  });
}
function nd(e, t = [], n = {}) {
  (t || []).forEach((r) => {
    if (!(!r || typeof r != "object")) {
      if (r.type === "reasoning_text") {
        Oo(e, n.reasoning || "推理文本", r.text);
        return;
      }
      r.type === "summary_text" && Oo(e, n.summary || "推理摘要", r.text);
    }
  });
}
function M0(e = []) {
  const t = [];
  return (e || []).forEach((n) => {
    !n || typeof n != "object" || n.type === "reasoning" && (nd(t, n.content, {
      reasoning: "推理文本",
      summary: "推理摘要"
    }), nd(t, n.summary, {
      reasoning: "推理文本",
      summary: "推理摘要"
    }));
  }), t;
}
function x0(e) {
  const t = [String(e.systemPrompt || "").trim(), ...(e.messages || []).filter((n) => n.role === "system").map((n) => String(n.content || "").trim())].filter(Boolean);
  return t.length ? [...new Set(t)].join(`

`) : "";
}
function Lm(e) {
  if (typeof e?.output_text == "string" && e.output_text.trim()) return e.output_text.trim();
  const t = [];
  return (Array.isArray(e?.output) ? e.output : []).forEach((n) => {
    if (!(!n || typeof n != "object")) {
      if (n.type === "message" && Array.isArray(n.content)) {
        n.content.forEach((r) => {
          if (!(!r || typeof r != "object")) {
            if (r.type === "output_text" && typeof r.text == "string" && r.text.trim()) {
              t.push(r.text.trim());
              return;
            }
            r.type === "refusal" && typeof r.refusal == "string" && r.refusal.trim() && t.push(r.refusal.trim());
          }
        });
        return;
      }
      typeof n.text == "string" && n.text.trim() && t.push(n.text.trim());
    }
  }), t.join(`
`).trim();
}
function N0(e) {
  if (e && typeof e == "object" && !Array.isArray(e) && !Object.prototype.hasOwnProperty.call(e, "choices") && Array.isArray(e.output)) return;
  const t = /* @__PURE__ */ new Error("当前端点返回的不是 Responses API，请改用 OpenAI 兼容。");
  throw t.name = "OpenAIResponsesEndpointMismatchError", t.code = "OPENAI_RESPONSES_ENDPOINT_MISMATCH", t;
}
function Ni(e, t, n) {
  const r = /* @__PURE__ */ new Error(e === "incomplete" ? "Responses 回复未完整生成。" : e === "failed" ? "Responses 生成失败。" : "Responses 未确认生成完成。");
  r.name = "OpenAIResponsesTerminationError", r.code = e === "incomplete" ? "OPENAI_RESPONSES_INCOMPLETE" : e === "failed" ? "OPENAI_RESPONSES_FAILED" : "OPENAI_RESPONSES_UNFINISHED", r.reason = t;
  const o = Lm(n);
  return o && (r.partialResponse = {
    text: o,
    finishReason: t || e,
    truncated: t === "max_output_tokens"
  }), r;
}
function k0(e) {
  const t = [];
  for (const n of e.messages || [])
    if (n.role !== "system") {
      if (n.role === "tool") {
        t.push({
          type: "function_call_output",
          call_id: n.tool_call_id || "missing_tool_call_id",
          output: n.content
        });
        continue;
      }
      if (n.role === "assistant" && Array.isArray(n?.providerPayload?.openAIResponseOutput) && n.providerPayload.openAIResponseOutput.length) {
        t.push(...Ga(n.providerPayload.openAIResponseOutput));
        continue;
      }
      if (n.role === "assistant" && Array.isArray(n.tool_calls) && n.tool_calls.length) {
        n.content?.trim() && t.push(Fo(n.content)), n.tool_calls.forEach((r, o) => {
          t.push({
            type: "function_call",
            call_id: r.id || `function_call_${o + 1}`,
            name: r.function?.name || "",
            arguments: r.function?.arguments || "{}",
            status: "completed"
          });
        });
        continue;
      }
      if (n.role === "assistant") {
        t.push(Fo(n.content || ""));
        continue;
      }
      t.push(n.role === "user" ? $m(n.role, n.content || "") : {
        role: n.role,
        content: typeof n.content == "string" ? n.content : ""
      });
    }
  return t;
}
function D0(e) {
  const t = [];
  for (const n of e.messages || []) {
    if (n.role === "system") {
      t.push({
        role: "system",
        content: typeof n.content == "string" ? n.content : ""
      });
      continue;
    }
    if (n.role === "tool") {
      t.push({
        type: "function_call_output",
        call_id: n.tool_call_id || "missing_tool_call_id",
        output: n.content
      });
      continue;
    }
    if (n.role === "assistant" && Array.isArray(n?.providerPayload?.openAIResponseOutput) && n.providerPayload.openAIResponseOutput.length) {
      t.push(...Ga(n.providerPayload.openAIResponseOutput));
      continue;
    }
    if (n.role === "assistant" && Array.isArray(n.tool_calls) && n.tool_calls.length) {
      n.content?.trim() && t.push(Fo(n.content)), n.tool_calls.forEach((r, o) => {
        t.push({
          type: "function_call",
          call_id: r.id || `function_call_${o + 1}`,
          name: r.function?.name || "",
          arguments: r.function?.arguments || "{}",
          status: "completed"
        });
      });
      continue;
    }
    if (n.role === "assistant") {
      t.push(Fo(n.content || ""));
      continue;
    }
    t.push(n.role === "user" ? $m(n.role, n.content || "") : {
      role: n.role,
      content: typeof n.content == "string" ? n.content : ""
    });
  }
  return t;
}
function $0(e) {
  try {
    return new URL(String(e || "https://api.openai.com/v1")).hostname === "api.openai.com";
  } catch {
    return !1;
  }
}
function L0(e) {
  if (e?.status === 401 || e?.status === 403) return !1;
  const t = String(e?.message || e || "").toLowerCase();
  return t.includes("instructions") || t.includes("unsupported") || t.includes("unknown parameter") || t.includes("invalid input");
}
function U0(e, t) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    activity: t.activity,
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: t.thoughts } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft === !0 ? { toolCallDraft: !0 } : {}
  });
}
function ki(e, t) {
  const [n = "0", r = "0"] = String(e || "").split(":"), [o = "0", i = "0"] = String(t || "").split(":");
  return Number(n) - Number(o) || Number(r) - Number(i);
}
var F0 = class {
  constructor(e) {
    this.config = e, this.auth = Bo("openai-responses", e.apiKey), this.client = new H({
      ...this.auth.sdkOptions,
      baseURL: String(e.baseUrl || "https://api.openai.com/v1").replace(/\/$/, ""),
      timeout: Number(e.timeoutMs) || 900 * 1e3,
      maxRetries: 0,
      dangerouslyAllowBrowser: !0
    });
  }
  buildRequestBody(e, t = !1, n = j("openai-responses", this.config, e.reasoning)) {
    const r = n, o = {
      model: this.config.model,
      instructions: t ? void 0 : x0(e) || void 0,
      input: t ? D0(e) : k0(e),
      ...Array.isArray(e.tools) && e.tools.length ? {
        tools: e.tools.map((i) => ({
          type: "function",
          name: i.function.name,
          description: i.function.description,
          parameters: i.function.parameters
        })),
        tool_choice: e.toolChoice || "auto"
      } : {},
      ...e.maxTokens ? { max_output_tokens: e.maxTokens } : {}
    };
    return !gr({
      ...this.config,
      provider: "openai-responses"
    }, r) && typeof e.temperature == "number" && (o.temperature = e.temperature), r.mode === "on" || r.mode === "off" ? o.reasoning = {
      effort: r.mode === "off" ? "none" : r.effort,
      ...r.mode === "on" && z(r) ? { summary: "auto" } : {}
    } : z(r) && (o.reasoning = { summary: "auto" }), r.mode !== "off" && r.profileId.startsWith("openai-") && (o.include = ["reasoning.encrypted_content"]), o;
  }
  inspectRequest(e, t = {}) {
    const n = typeof e.onStreamProgress == "function", r = t.legacySystemInInput === !0, o = String(this.config.baseUrl || "https://api.openai.com/v1").replace(/\/$/, ""), i = t.effectiveReasoning || j("openai-responses", this.config, e.reasoning), s = t.body || this.buildRequestBody(e, r, i);
    return cr({
      provider: "openai-responses",
      model: this.config.model,
      transport: "openai-responses",
      url: `${o}/responses`,
      headers: this.auth.requestHeaders,
      body: s,
      sdk: n ? "client.responses.stream" : "client.responses.create",
      effectiveConfig: Ct(e, {
        reasoning: i,
        effort: s.reasoning?.effort,
        controlFields: {
          ...s.reasoning ? { reasoning: s.reasoning } : {},
          ...s.include ? { include: s.include } : {}
        }
      })
    });
  }
  async chat(e) {
    const t = j("openai-responses", this.config, e.reasoning), n = [], r = () => ({
      ...n.at(-1)?.inspection || {},
      requestCount: n.length,
      fallbackCount: Math.max(0, n.length - 1),
      requests: n.map(({ reason: m, inspection: g }, _) => ({
        index: _ + 1,
        reason: m,
        request: g.request,
        effectiveConfig: g.effectiveConfig
      }))
    }), o = (m) => (m && typeof m == "object" && (m.requestInspection = r()), m), i = (m) => {
      if (N0(m), m.status !== "completed") throw Ni(m.status, m.incomplete_details?.reason, m);
      const g = m.output;
      return {
        output: g,
        thoughts: z(t) ? M0(g) : [],
        toolCalls: g.filter((_) => _.type === "function_call" && _.name).map((_, y) => ({
          id: _.call_id || `response-tool-${y + 1}`,
          name: _.name || "",
          arguments: _.arguments || "{}"
        })),
        text: Lm(m)
      };
    }, s = (m, g, _) => {
      const y = this.inspectRequest(e, {
        body: m,
        legacySystemInInput: g,
        effectiveReasoning: t
      });
      n.push({
        reason: _,
        inspection: y
      });
    }, u = async (m = !1, g = "initial") => {
      const _ = this.buildRequestBody(e, m, t);
      s(_, m, g);
      try {
        return await this.client.responses.create(_, { signal: e.signal });
      } catch (y) {
        throw o(y);
      }
    }, c = async (m = !1, g = "initial") => {
      const _ = this.buildRequestBody(e, m, t);
      s(_, m, g);
      try {
        const y = this.client.responses.stream(_, { signal: e.signal }), E = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
        let L = "waiting", C, k;
        for (const b of [
          "response.completed",
          "response.incomplete",
          "response.failed"
        ]) y.on(b, (F) => {
          k = F;
        });
        const I = (b, F) => {
          L = b, C = F;
          const X = [];
          z(t) && (Array.from(A.entries()).sort(([J], [V]) => ki(J, V)).forEach(([, J]) => Oo(X, "推理文本", J)), Array.from(w.entries()).sort(([J], [V]) => ki(J, V)).forEach(([, J]) => Oo(X, "推理摘要", J))), U0(e, {
            activity: L,
            text: Array.from(E.entries()).sort(([J], [V]) => ki(J, V)).map(([, J]) => J).join(`
`).trim(),
            thoughts: X,
            ...P.size ? {
              toolCalls: Array.from(P.entries()).sort(([J], [V]) => J - V).map(([, J]) => ({
                id: J.call_id,
                name: J.name,
                arguments: J.arguments
              })),
              toolCallDraft: !0
            } : {}
          });
        };
        y.on("response.output_item.added", (b) => {
          if (b.item.type === "reasoning") {
            I("thinking", b.output_index);
            return;
          }
          b.item.type === "function_call" && (P.set(b.output_index, { ...b.item }), I("tool-call", b.output_index));
        }), y.on("response.output_item.done", (b) => {
          b.item.type === "reasoning" && C === b.output_index && L === "thinking" && I("waiting", b.output_index);
        }), y.on("response.function_call_arguments.delta", (b) => {
          const F = P.get(b.output_index);
          F && (F.arguments += b.delta, I("tool-call", b.output_index));
        }), y.on("response.function_call_arguments.done", (b) => {
          const F = P.get(b.output_index);
          F && (F.arguments = b.arguments, I("tool-call", b.output_index));
        }), y.on("response.output_text.delta", (b) => {
          if (!b.delta) return;
          const F = `${b.output_index}:${b.content_index}`;
          E.set(F, `${E.get(F) || ""}${b.delta}`), I("replying", b.output_index);
        }), y.on("response.reasoning_text.delta", (b) => {
          if (!b.delta) return;
          const F = `${b.output_index}:${b.content_index}`;
          A.set(F, `${A.get(F) || ""}${b.delta}`), I("thinking", b.output_index);
        }), y.on("response.reasoning_summary_text.delta", (b) => {
          if (!b.delta) return;
          const F = `${b.output_index}:${b.summary_index}`;
          w.set(F, `${w.get(F) || ""}${b.delta}`), I("thinking", b.output_index);
        });
        const x = await y.finalResponse();
        if (k?.type !== "response.completed") throw Ni(k?.type?.slice(9), k?.response?.incomplete_details?.reason, x);
        if (x.status !== "completed") throw Ni(x.status, x.incomplete_details?.reason, x);
        return x;
      } catch (y) {
        throw o(y);
      }
    }, d = !$0(this.config.baseUrl), h = typeof e.onStreamProgress == "function" ? c : u;
    let f, p;
    try {
      f = await h(!1, "initial"), p = i(f);
    } catch (m) {
      if (!d || !L0(m)) throw o(m);
      f = await h(!0, "legacy_system_error");
      try {
        p = i(f);
      } catch (g) {
        throw o(g);
      }
    }
    if (d && n.length < 2 && !p.text && !p.toolCalls.length) {
      f = await h(!0, "empty_response");
      try {
        p = i(f);
      } catch (m) {
        throw o(m);
      }
    }
    return {
      text: p.text,
      toolCalls: p.toolCalls,
      thoughts: p.thoughts,
      finishReason: f.incomplete_details?.reason || f.status || "stop",
      refused: p.output.some((m) => m?.type === "message" && Array.isArray(m.content) && m.content.some((g) => g?.type === "refusal")),
      model: f.model || this.config.model,
      provider: "openai-responses",
      providerPayload: p.output.length ? { openAIResponseOutput: Ga(p.output) } : void 0,
      requestInspection: r()
    };
  }
};
async function O0(e, t) {
  const n = e.body?.getReader?.();
  if (!n) throw new Error("host_chat_completions_stream_missing_body");
  const r = new TextDecoder();
  let o = "";
  const i = /\r?\n\r?\n/, s = (c) => {
    const d = c.split(/\r?\n/).filter((h) => h.startsWith("data:")).map((h) => h.slice(5).trimStart()).join(`
`).trim();
    !d || d === "[DONE]" || t(JSON.parse(d));
  };
  for (; ; ) {
    const { done: c, value: d } = await n.read();
    if (c) break;
    for (o += r.decode(d, { stream: !0 }); ; ) {
      const h = o.match(i);
      if (!h || typeof h.index != "number") break;
      const f = o.slice(0, h.index);
      o = o.slice(h.index + h[0].length), s(f);
    }
  }
  const u = o.trim();
  u && s(u);
}
var ks = null;
function cR(e) {
  ks = typeof e == "function" ? e : null;
}
async function Um() {
  if (!ks) throw new Error("宿主请求头未注册，无法调用酒馆后端。");
  return await ks();
}
var bt = "openai", Fm = "claude", Ba = "makersuite";
var G0 = "/api/backends/chat-completions/status", B0 = "/api/backends/chat-completions/generate", q0 = Object.freeze({
  [Fm]: "https://api.anthropic.com/v1",
  [Ba]: "https://generativelanguage.googleapis.com"
}), Rr = Um;
function H0(e) {
  return String(e || "").trim().replace(/\/+$/, "");
}
function V0(e = "") {
  return qo(e) === "openai";
}
function J0(e, t) {
  const n = H0(e);
  return t === "claude" ? !n || /\/v\d[\w.-]*$/i.test(n) ? n : `${n}/v1` : t === "makersuite" ? n.replace(/\/v\d[\w.-]*$/i, "") : n;
}
async function Om(e = Rr) {
  if (typeof e != "function") throw new Error("宿主请求头未注册，无法调用酒馆后端。");
  return {
    "Content-Type": "application/json",
    ...await Promise.resolve(e() || {}),
    Accept: "application/json"
  };
}
function K0(e = {}) {
  const t = {};
  return Object.entries(e || {}).forEach(([n, r]) => {
    t[n] = /authorization|cookie|csrf|token|api[-_]?key/i.test(n) ? "[redacted]" : r;
  }), t;
}
async function qa(e = {}, t = !1, n = Rr) {
  const r = await Om(n), o = {
    url: B0,
    method: "POST",
    headers: K0(r),
    body: {
      ...e,
      stream: !!t
    }
  };
  return Object.defineProperty(o, "rawHeaders", {
    value: r,
    enumerable: !1
  }), o;
}
async function W0(e = {}, t = !1) {
  return await qa(e, t);
}
function z0(e = "") {
  return /^\s*(?:<!DOCTYPE\s+html\b|<html\b)/i.test(String(e || ""));
}
function Y0(e = "") {
  return /invalid csrf token/i.test(String(e || ""));
}
function X0() {
  return "酒馆当前页面的 CSRF token 已失效，请按 F5 刷新并重新进入酒馆后再试。";
}
function rd(e = "", t = 10) {
  const n = Number.parseInt(String(e || ""), t);
  return Number.isInteger(n) && n >= 0 && n <= 1114111 ? String.fromCodePoint(n) : "";
}
function od(e = "") {
  return String(e || "").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&#x([0-9a-f]+);?/gi, (t, n) => rd(n, 16)).replace(/&#([0-9]+);?/g, (t, n) => rd(n));
}
function Q0(e = "") {
  const t = String(e || ""), n = od((t.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").replace(/\s+/g, " ").trim(), r = od(t.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(), o = n || r;
  return o.length > 240 ? `${o.slice(0, 237)}...` : o;
}
function Z0(e = null) {
  const t = Number(e?.status), n = String(e?.statusText || "").trim();
  let r = "";
  try {
    r = String(e?.headers?.get?.("content-type") || "").trim();
  } catch {
    r = "";
  }
  return {
    status: Number.isFinite(t) && t > 0 ? t : 0,
    statusText: n,
    contentType: r
  };
}
function j0(e = {}) {
  return e.status ? `HTTP ${e.status}${e.statusText ? ` ${e.statusText}` : ""}` : "";
}
function eb(e = "") {
  const t = String(e || "").trim();
  if (!t || t[0] !== "{" && t[0] !== "[") return "";
  try {
    const n = JSON.parse(t), r = n?.error?.message;
    if (typeof r == "string" && r.trim()) return r.trim();
    if (typeof n?.message == "string" && n.message.trim()) return n.message.trim();
  } catch {
    return "";
  }
  return "";
}
function fn(e = "", t = "", n = null) {
  if (Y0(e)) return X0();
  const r = Z0(n);
  if (z0(e) || /\btext\/html\b/i.test(r.contentType)) {
    const o = j0(r), i = Q0(e);
    return [
      "酒馆后端返回了非 JSON 的 HTML 页面",
      o ? `（${o}）` : "",
      i ? `：${i}` : ""
    ].join("");
  }
  return eb(e) || String(e || t || "").trim();
}
function Gm(e = {}, t = bt) {
  if (t === "vertexai") return { chat_completion_source: t };
  const n = String(e.reverse_proxy || "").trim(), r = String(e.proxy_password || "").trim();
  if (n || r) {
    const d = { chat_completion_source: t };
    return n && (d.reverse_proxy = n), r && (d.proxy_password = r), d;
  }
  const o = J0(e.baseUrl, t), i = String(e.apiKey || "").trim(), s = q0[t] || "", u = o || (i ? s : ""), c = { chat_completion_source: t || "openai" };
  return u && (c.reverse_proxy = u), i && (c.proxy_password = i), c;
}
function tb(e = {}) {
  return Object.keys(e).forEach((t) => {
    (e[t] === void 0 || e[t] === "") && delete e[t];
  }), e;
}
function nb(e = {}, t = bt) {
  return Gm(e, t);
}
function Ha(e = {}, t = {}, n = [], r = !1, o = bt) {
  const i = t.maxTokens, s = o === "openai" && V0(e.model);
  return tb({
    ...Gm(e, o),
    stream: !!r,
    messages: n,
    model: e.model,
    max_tokens: s ? void 0 : i,
    max_completion_tokens: s ? i : void 0,
    temperature: t.temperature,
    tools: Array.isArray(t.tools) && t.tools.length ? t.tools : void 0,
    tool_choice: Array.isArray(t.tools) && t.tools.length ? t.toolChoice || "auto" : void 0,
    use_sysprompt: o === "openai" ? void 0 : !0
  });
}
function rb(e = {}, t = {}, n = [], r = !1) {
  return Ha(e, t, n, r, bt);
}
function ob(e = {}, t = {}, n = [], r = !1) {
  return Ha(e, t, n, r, Fm);
}
function ib(e = {}, t = {}, n = [], r = !1, o = Ba) {
  return Ha(e, t, n, r, o);
}
function Va(e) {
  const t = e || globalThis.fetch;
  if (typeof t != "function") throw new Error("当前运行环境没有可用的 fetch，无法调用酒馆后端。");
  return t;
}
async function sb(e = {}, t = bt, n = {}, r = {}) {
  const o = await Va(r.fetch)(G0, {
    method: "POST",
    headers: await Om(r.requestHeadersProvider),
    body: JSON.stringify(nb(e, t)),
    signal: n.signal
  }), i = await o.text();
  let s = null;
  try {
    s = i ? JSON.parse(i) : {};
  } catch (c) {
    throw new Error(`酒馆后端模型列表拉取失败：${fn(i, String(c?.message || c), o)}`);
  }
  if (!o.ok || s?.error) {
    const c = fn(s?.message || s?.error?.message || i, `HTTP ${o.status}`, o);
    throw new Error(`酒馆后端模型列表拉取失败：${c}`);
  }
  const u = Array.isArray(s?.data) ? s.data.map((c) => String(c?.id || c?.name || "").trim()).filter(Boolean) : [];
  return [...new Set(u)];
}
async function Bm(e = {}, t = bt, n = {}) {
  return await sb(e, t, n, { requestHeadersProvider: Rr });
}
async function ab(e = {}, t = {}) {
  return await Bm(e, bt, t);
}
async function lb(e = {}, t = {}, n = {}) {
  const r = await qa(e, !1, n.requestHeadersProvider);
  typeof t.onRequest == "function" && t.onRequest(r);
  const o = await Va(n.fetch)(r.url, {
    method: r.method,
    headers: r.rawHeaders || r.headers,
    body: JSON.stringify(r.body),
    signal: t.signal
  }), i = await o.text();
  let s = null;
  try {
    s = i ? JSON.parse(i) : {};
  } catch (u) {
    const c = /* @__PURE__ */ new Error(`酒馆后端生成失败：${fn(i, String(u?.message || u), o)}`);
    throw c.status = o.status, c.body = i, c;
  }
  if (!o.ok || s?.error) {
    const u = fn(s?.error?.message || s?.message || i, `HTTP ${o.status}`, o), c = /* @__PURE__ */ new Error(`酒馆后端生成失败：${u}`);
    throw c.status = o.status, c.error = s?.error, c;
  }
  return s;
}
async function ub(e = {}, t = {}) {
  return await lb(e, t, { requestHeadersProvider: Rr });
}
async function cb(e = {}, t, n = {}, r = {}) {
  const o = await qa(e, !0, r.requestHeadersProvider);
  typeof n.onRequest == "function" && n.onRequest(o);
  const i = Va(r.fetch), s = JSON.stringify(o.body);
  console.debug("[HostLLM] stream request to ST", {
    url: o.url,
    stream: !0,
    chat_completion_source: o.body?.chat_completion_source,
    model: o.body?.model,
    topLevelKeys: Object.keys(o.body || {}),
    messagesRoleKinds: (o.body?.messages || []).map((c) => c?.role),
    bodyPreview: s.slice(0, 300)
  });
  const u = await i(o.url, {
    method: o.method,
    headers: o.rawHeaders || o.headers,
    body: s,
    signal: n.signal
  });
  if (!u.ok) {
    const c = await u.text().catch(() => ""), d = new Error(fn(c, `酒馆后端流式生成失败：HTTP ${u.status}`, u));
    throw d.status = u.status, d.body = c, d;
  }
  typeof n.onResponseAccepted == "function" && n.onResponseAccepted(), await O0(u, (c) => {
    if (c?.error) {
      const d = fn(c.error?.message || c.message || JSON.stringify(c.error), "酒馆后端流式生成失败");
      throw new Error(d);
    }
    console.debug("[HostLLM] stream event", source, {
      model: c?.model || c?.modelVersion,
      finishReason: c?.candidates?.[0]?.finishReason,
      snippet: String(c?.candidates?.[0]?.content?.parts?.[0]?.text || "").slice(0, 60),
      keys: Object.keys(c || {})
    }), t(c);
  });
}
async function db(e = {}, t, n = {}) {
  return await cb(e, t, n, { requestHeadersProvider: Rr });
}
var fb = Object.freeze([
  "buildHostChatCompletionGenerateRequest",
  "createHostChatCompletion",
  "streamHostChatCompletion"
]);
function li(e) {
  if (!e || !fb.every((t) => typeof e[t] == "function")) throw new TypeError("酒馆渠道必须注入有效的 Host Client。");
  return e;
}
var Ja = Object.freeze({
  buildHostChatCompletionGenerateRequest: W0,
  fetchHostChatCompletionsModels: Bm,
  fetchHostOpenAICompatibleModels: ab,
  createHostChatCompletion: ub,
  streamHostChatCompletion: db
});
function Bt(e) {
  if (e !== void 0)
    try {
      return JSON.parse(JSON.stringify(e));
    } catch {
      return;
    }
}
function hb(e) {
  const t = String(e || "").trim();
  if (!t || t === "auto") return "auto";
  if (t === "required") return "any";
  if (t === "none") return "none";
  throw new Error(`酒馆托管 Claude 不支持 tool_choice：${t}。仅支持 auto/required/none。`);
}
function pb(e = {}, t = {}, n = j("sillytavern-claude", e, t.reasoning)) {
  if (!(Array.isArray(t.tools) && t.tools.length > 0)) return {
    toolChoice: void 0,
    reasoningDisabledForForcedTool: !1
  };
  const r = hb(t.toolChoice), o = n.profileId === "sillytavern-claude-manual" || n.profileId === "sillytavern-claude-adaptive-conditional";
  return {
    toolChoice: r,
    reasoningDisabledForForcedTool: r === "any" && n.mode === "on" && o
  };
}
var mb = "当前模型使用手动 thinking，与强制 Tool 调用冲突；本次请求已因强制 Tool 关闭 Reasoning。";
function no(e = {}, t = {}, n = {}, r) {
  const o = r || j("sillytavern-claude", e, t.reasoning);
  return n.reasoningDisabledForForcedTool ? {
    ...o,
    mode: "off",
    output: "hide"
  } : o;
}
function gb(e = {}, t = {}, n = {}) {
  return Ct(e, {
    reasoning: n,
    effort: n.mode === "on" ? n.effort : "",
    controlFields: t.controlFields || {}
  });
}
function _b(e = {}, t = {}) {
  return { toolChoice: String(t.toolChoice || "") };
}
function qm(e = "") {
  try {
    return {
      ok: !0,
      input: JSON.parse(String(e || ""))
    };
  } catch (t) {
    return {
      ok: !1,
      input: {},
      raw: String(e || ""),
      error: t instanceof Error ? t.message : String(t || "invalid_tool_input_json")
    };
  }
}
function yb(e = []) {
  return (Array.isArray(e) ? e : []).map((t) => {
    const n = String(t?.function?.name || "").trim();
    if (!n) return null;
    const r = qm(t.function.arguments || "{}");
    return {
      type: "tool_use",
      id: String(t.id || n),
      name: n,
      input: r.input,
      ...r.ok ? {} : {
        invalidInputJson: r.raw,
        inputParseError: r.error
      }
    };
  }).filter(Boolean);
}
function vb(e = []) {
  const t = Array.isArray(e) ? Bt(e) : null;
  return Array.isArray(t) && t.length ? t : null;
}
function Ab(e = {}) {
  const t = Array.isArray(e.messages) ? e.messages : [], n = [];
  t.forEach((o) => {
    if (!o || typeof o != "object") return;
    const i = Bt(o) || {}, s = vb(i?.providerPayload?.anthropicContent), u = yb(i.tool_calls);
    delete i.providerPayload, i.role === "assistant" && s && u.length ? (delete i.tool_calls, i.content = s.filter((c) => c?.type !== "tool_use").concat(u)) : i.role === "assistant" && s && (delete i.tool_calls, i.content = s), n.push(i);
  });
  const r = typeof e.systemPrompt == "string" ? e.systemPrompt : "";
  return r.trim() && !(n[0]?.role === "system" && n[0]?.content === r) && n.unshift({
    role: "system",
    content: r
  }), n;
}
function Tb(e = []) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!t || typeof t != "object") return null;
    if (t.type === "text") return {
      type: "text",
      text: String(t.text || "")
    };
    if (t.type === "tool_use" && t.name) {
      if (t.inputJson !== void 0) {
        const r = qm(t.inputJson);
        return {
          type: "tool_use",
          id: String(t.id || t.name),
          name: String(t.name),
          input: r.input,
          ...r.ok ? {} : {
            invalidInputJson: r.raw,
            inputParseError: r.error
          }
        };
      }
      const n = Bt(t.input);
      return n !== void 0 ? {
        type: "tool_use",
        id: String(t.id || t.name),
        name: String(t.name),
        input: n
      } : {
        type: "tool_use",
        id: String(t.id || t.name),
        name: String(t.name),
        input: {}
      };
    }
    return t.type === "thinking" ? {
      type: "thinking",
      thinking: String(t.thinking || t.text || ""),
      ...typeof t.signature == "string" ? { signature: t.signature } : {}
    } : t.type === "redacted_thinking" ? {
      type: "redacted_thinking",
      data: String(t.data || "")
    } : Bt(t) || null;
  }).filter(Boolean);
}
function Sb(e = []) {
  return e.map((t) => !t || typeof t != "object" ? null : t.type === "tool_use" && t.name ? {
    type: "tool_use",
    id: t.id,
    name: t.name,
    input: Bt(t.input) || {}
  } : Bt(t) || null).filter(Boolean);
}
function Eb(e = []) {
  const t = Array.isArray(e) ? e : [], n = t.filter((i) => i?.type === "text").map((i) => i.text || "").join(`
`), r = t.filter((i) => i?.type === "thinking" || i?.type === "redacted_thinking").map((i) => ({
    label: i.type === "thinking" ? "思考块" : "已脱敏思考块",
    text: i.type === "thinking" ? i.thinking || "" : i.data || ""
  })).filter((i) => i.text), o = t.filter((i) => i?.type === "tool_use" && i.name).map((i, s) => ({
    id: i.id || `st-claude-tool-${s + 1}`,
    name: i.name,
    arguments: i.inputJson !== void 0 ? i.inputJson : JSON.stringify(i.input || {})
  }));
  return {
    text: n,
    thoughts: r,
    ...o.length ? {
      toolCalls: o,
      toolCallDraft: !0
    } : {}
  };
}
function Cb(e = [], t = {}) {
  const n = Tb(e), r = n.filter((i) => i.type === "tool_use" && i.name).map((i, s) => ({
    id: i.id || `st-claude-tool-${s + 1}`,
    name: i.name,
    arguments: i.invalidInputJson !== void 0 ? i.invalidInputJson : JSON.stringify(i.input || {})
  })), o = n.filter((i) => i.type === "text").map((i) => i.text || "").join(`
`);
  return {
    text: o,
    toolCalls: r,
    thoughts: t.includeReasoningOutput === !1 ? [] : n.filter((i) => i.type === "thinking" || i.type === "redacted_thinking").map((i) => ({
      label: i.type === "thinking" ? "思考块" : "已脱敏思考块",
      text: i.type === "thinking" ? i.thinking || "" : i.data || ""
    })).filter((i) => i.text),
    finishReason: at("anthropic", t.finishReason, !1, o),
    model: t.model || "",
    provider: "sillytavern-claude",
    providerPayload: n.length ? { anthropicContent: Sb(n) } : void 0
  };
}
function wb(e, t) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: t.thoughts } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft ? { toolCallDraft: !0 } : {}
  });
}
function Ib(e, t, n = {}) {
  const r = [];
  let o, i = !1, s = n.model || "";
  const u = (d, h = {}) => {
    const f = Number.isInteger(Number(d)) ? Number(d) : r.length;
    return r[f] ? r[f] = {
      ...r[f],
      ...h
    } : r[f] = { ...h }, r[f];
  }, c = () => {
    const d = Eb(r);
    wb(e, {
      text: d.text,
      thoughts: z(t) ? d.thoughts : [],
      ...Array.isArray(d.toolCalls) ? { toolCalls: d.toolCalls } : {},
      ...d.toolCallDraft ? { toolCallDraft: !0 } : {}
    });
  };
  return {
    accept(d = {}) {
      if (d.type === "message_stop" && (i = !0), d?.message?.model && (s = d.message.model), d.type === "content_block_start") {
        u(d.index, Bt(d.content_block) || {}), c();
        return;
      }
      if (d.type === "content_block_delta") {
        const h = u(d.index), f = d.delta || {};
        f.type === "text_delta" ? (h.type = h.type || "text", h.text = `${h.text || ""}${f.text || ""}`) : f.type === "input_json_delta" ? (h.type = h.type || "tool_use", h.inputJson = `${h.inputJson || ""}${f.partial_json || ""}`) : f.type === "thinking_delta" ? (h.type = h.type || "thinking", h.thinking = `${h.thinking || ""}${f.thinking || ""}`) : f.type === "signature_delta" && (h.signature = `${h.signature || ""}${f.signature || ""}`), c();
        return;
      }
      d.type === "message_delta" && (o = d.delta?.stop_reason || o);
    },
    result() {
      return Cb(r, {
        finishReason: i ? o : void 0,
        model: s,
        includeReasoningOutput: z(t)
      });
    }
  };
}
var bb = class {
  constructor(e, t = Ja) {
    this.config = e, this.hostClient = li(t);
  }
  buildMessages(e) {
    return Ab(e);
  }
  resolveToolProtocol(e, t) {
    return pb(this.config, e, t);
  }
  buildPayload(e, t = this.resolveToolProtocol(e), n = no(this.config, e, t)) {
    const o = this.buildMessages(e), i = {
      ...e,
      toolChoice: t.toolChoice,
      reasoning: n,
      temperature: gr({
        ...this.config,
        provider: "sillytavern-claude"
      }, n) ? void 0 : e.temperature
    }, s = ob(this.config, i, o, !0);
    return n.mode === "on" ? (s.reasoning_effort = n.effort, s.include_reasoning = z(n)) : n.mode === "off" ? (s.reasoning_effort = "auto", s.include_reasoning = !1) : (s.reasoning_effort = "auto", s.include_reasoning = z(n)), s;
  }
  async inspectRequest(e, t = {}) {
    const n = j("sillytavern-claude", this.config, e.reasoning), r = t.protocol || this.resolveToolProtocol(e, n), o = t.effectiveReasoning || no(this.config, e, r, n), i = t.payload || this.buildPayload(e, r, o), s = await this.hostClient.buildHostChatCompletionGenerateRequest(i, !0);
    return this.buildRequestInspection(s, r, e, o);
  }
  buildRequestInspection(e, t = {}, n = {}, r = no(this.config, n, t)) {
    const o = {
      ...Object.hasOwn(e?.body || {}, "reasoning_effort") ? { reasoning_effort: e.body.reasoning_effort } : {},
      ...Object.hasOwn(e?.body || {}, "include_reasoning") ? { include_reasoning: e.body.include_reasoning } : {}
    };
    return {
      provider: "sillytavern-claude",
      model: this.config.model,
      transport: "sillytavern-chat-completions",
      request: Gt(e),
      effectiveConfig: {
        ..._b(n, t),
        ...gb(n, {
          ...t,
          controlFields: o
        }, r)
      },
      ...t.reasoningDisabledForForcedTool ? { notices: [mb] } : {}
    };
  }
  async chat(e) {
    const t = j("sillytavern-claude", this.config, e.reasoning), n = this.resolveToolProtocol(e, t), r = no(this.config, e, n, t), o = this.buildPayload(e, n, r);
    let i = null;
    const s = (u) => {
      i = this.buildRequestInspection(u, n, e, r);
    };
    try {
      const u = Ib(e, r, this.config);
      return await this.hostClient.streamHostChatCompletion(o, (c) => u.accept(c), {
        signal: e.signal,
        onRequest: s
      }), {
        ...u.result(),
        requestInspection: i
      };
    } catch (u) {
      throw i && u && typeof u == "object" && (u.requestInspection = i), u;
    }
  }
};
function Ka(e) {
  if (e !== void 0)
    try {
      return JSON.parse(JSON.stringify(e));
    } catch {
      return;
    }
}
function hn(e) {
  if (typeof e == "string") return {
    role: "model",
    parts: e ? [{ text: e }] : []
  };
  if (!e || typeof e != "object") return {
    role: "model",
    parts: []
  };
  const t = Ka(e) || {};
  return t.role = t.role || "model", t.parts = Array.isArray(t.parts) ? t.parts : [], t;
}
function Rb(e) {
  const t = Array.isArray(e?.providerPayload?.googleContents) ? e.providerPayload.googleContents : [];
  if (t.length) return t.map((o) => hn(o)).filter((o) => Array.isArray(o.parts) && o.parts.length);
  const n = e?.providerPayload?.googleContent, r = hn(n);
  return r.parts.length ? [r] : [];
}
function Pb(e = {}) {
  const t = String(e?.mimeType || "").trim(), n = String(e?.data || "").trim();
  if (!t || !n) return null;
  const r = `data:${t};base64,${n}`;
  return t.startsWith("image/") ? {
    type: "image_url",
    image_url: { url: r }
  } : t.startsWith("video/") ? {
    type: "video_url",
    video_url: { url: r }
  } : t.startsWith("audio/") ? {
    type: "audio_url",
    audio_url: { url: r }
  } : null;
}
function Mb(e = {}, t = 0) {
  const n = hn(e);
  if (!n.parts.length) return null;
  const r = {
    role: n.role === "user" ? "user" : "assistant",
    content: []
  }, o = n.parts.find((s) => !s?.thought && typeof s?.text == "string" && typeof s?.thoughtSignature == "string" && s.thoughtSignature)?.thoughtSignature || "", i = [];
  return n.parts.forEach((s) => {
    if (!s || typeof s != "object") return;
    if (!s.thought && typeof s.text == "string" && s.text) {
      r.content.push({
        type: "text",
        text: s.text
      });
      return;
    }
    if (s.functionCall?.name) {
      i.push({
        id: String(s.functionCall.id || `st-google-tool-${t + 1}-${i.length + 1}`),
        type: "function",
        function: {
          name: String(s.functionCall.name || ""),
          arguments: JSON.stringify(s.functionCall.args || {})
        },
        ...typeof s.thoughtSignature == "string" && s.thoughtSignature ? { signature: s.thoughtSignature } : {}
      });
      return;
    }
    const u = Pb(s.inlineData);
    u && r.content.push(u);
  }), i.length && r.content.push({
    type: "tool_calls",
    tool_calls: i
  }), o && r.content.some((s) => s?.type === "text") && (r.signature = o), r.content.length ? r : null;
}
function xb(e = {}) {
  const t = Array.isArray(e.messages) ? e.messages : [], n = [];
  t.forEach((o) => {
    if (!o || typeof o != "object") return;
    const i = Rb(o);
    if (o.role === "assistant" && i.length) {
      i.forEach((u, c) => {
        const d = Mb(u, c);
        d && n.push(d);
      });
      return;
    }
    const s = Ka(o) || {};
    delete s.providerPayload, n.push(s);
  });
  const r = typeof e.systemPrompt == "string" ? e.systemPrompt : "";
  return r.trim() && !(n[0]?.role === "system" && n[0]?.content === r) && n.unshift({
    role: "system",
    content: r
  }), n;
}
function Nb(e = {}) {
  return hn(e?.responseContent || e?.candidates?.[0]?.content || "");
}
function kb(e = {}) {
  return (e.parts || []).filter((t) => !t?.thought && typeof t?.text == "string" && t.text).map((t) => t.text).join(`
`);
}
function Db(e = {}) {
  return (e.parts || []).filter((t) => t?.thought && typeof t.text == "string" && t.text.trim()).map((t, n) => ({
    label: `思考块 ${n + 1}`,
    text: t.text.trim()
  }));
}
function $b(e = {}) {
  return (e.parts || []).map((t) => t?.functionCall || null).filter((t) => t?.name).map((t, n) => ({
    id: t.id || `st-google-tool-${n + 1}`,
    name: t.name,
    arguments: JSON.stringify(t.args || {})
  }));
}
function Lb(e, t) {
  const n = String(t || ""), r = String(e || "");
  return n ? !r || n.startsWith(r) ? n : r.endsWith(n) ? r : `${r}${n}` : r;
}
function Ub(e = [], t = []) {
  const n = Array.isArray(e) ? [...e] : [];
  return t.forEach((r) => {
    const o = [
      r.id || "",
      r.name || "",
      r.arguments || ""
    ].join("\0");
    n.some((i) => [
      i.id || "",
      i.name || "",
      i.arguments || ""
    ].join("\0") === o) || n.push(r);
  }), n;
}
function Fb(e) {
  const t = hn(e);
  return t.parts.length ? {
    googleContent: t,
    googleContents: [t]
  } : void 0;
}
function Ob(e, t) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: t.thoughts } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft ? { toolCallDraft: !0 } : {}
  });
}
function Gb(e, t, n = {}, r = "sillytavern-google") {
  let o = "", i = [], s = [], u, c = n.model || "";
  const d = [];
  return {
    accept(h = {}) {
      c = h.model || h.modelVersion || c, u = h?.candidates?.[0]?.finishReason || u;
      const f = Nb(h);
      f.parts.length && d.push(...Ka(f.parts) || []), o = Lb(o, kb(f)), i = Ub(i, $b(f));
      const p = z(t) ? Db(f) : [];
      p.length && (s = p), Ob(e, {
        text: o,
        thoughts: s,
        ...i.length ? {
          toolCalls: i,
          toolCallDraft: !0
        } : {}
      });
    },
    result() {
      const h = hn({
        role: "model",
        parts: d.length ? d : o ? [{ text: o }] : []
      });
      return u || console.warn("[SillyTavernGoogle] 流式回應未含 finishReason，事件與累積內容如下", {
        provider: r,
        model: c,
        text: o,
        partsCount: d.length,
        toolCallsCount: i.length,
        thoughtsCount: s.length
      }), {
        text: o,
        toolCalls: i,
        thoughts: s,
        finishReason: at("google", u, !1, o),
        model: c,
        provider: r,
        providerPayload: Fb(h)
      };
    }
  };
}
var Bb = class {
  provider = "sillytavern-google";
  source = Ba;
  constructor(e, t = Ja) {
    this.config = e, this.hostClient = li(t);
  }
  buildMessages(e) {
    return xb(e);
  }
  buildPayload(e, t = j(this.provider, this.config, e.reasoning)) {
    const n = t, r = !0, o = this.buildMessages(e), i = ib(this.config, e, o, r, this.source);
    return n.mode === "on" ? (i.reasoning_effort = n.effort, i.include_reasoning = z(n)) : n.mode === "off" ? (i.reasoning_effort = "min", i.include_reasoning = !1) : (i.reasoning_effort = "auto", i.include_reasoning = z(n)), i;
  }
  async inspectRequest(e, t = {}) {
    const n = t.effectiveReasoning || j(this.provider, this.config, e.reasoning), r = t.payload || this.buildPayload(e, n), o = await this.hostClient.buildHostChatCompletionGenerateRequest(r, !0);
    return this.buildRequestInspection(o, e, n);
  }
  buildRequestInspection(e, t = {}, n = j(this.provider, this.config, t.reasoning)) {
    const r = {
      ...Object.hasOwn(e?.body || {}, "reasoning_effort") ? { reasoning_effort: e.body.reasoning_effort } : {},
      ...Object.hasOwn(e?.body || {}, "include_reasoning") ? { include_reasoning: e.body.include_reasoning } : {}
    };
    return {
      provider: this.provider,
      model: this.config.model,
      transport: "sillytavern-chat-completions",
      request: Gt(e),
      effectiveConfig: Ct(t, {
        reasoning: n,
        effort: e?.body?.reasoning_effort,
        controlFields: r
      })
    };
  }
  async chat(e) {
    const t = j(this.provider, this.config, e.reasoning), n = this.buildPayload(e, t);
    let r = null;
    const o = (i) => {
      r = this.buildRequestInspection(i, e, t);
    };
    try {
      const i = Gb(e, t, this.config, this.provider);
      return await this.hostClient.streamHostChatCompletion(n, (s) => i.accept(s), {
        signal: e.signal,
        onRequest: o
      }), {
        ...i.result(),
        requestInspection: r
      };
    } catch (i) {
      throw r && i && typeof i == "object" && (i.requestInspection = r), i;
    }
  }
};
function qb(e, t, n) {
  typeof e.onStreamProgress == "function" && e.onStreamProgress({
    ...typeof t.text == "string" ? { text: t.text } : {},
    ...Array.isArray(t.thoughts) ? { thoughts: z(n) ? t.thoughts : [] } : {},
    ...Array.isArray(t.toolCalls) ? { toolCalls: t.toolCalls } : {},
    ...t.toolCallDraft ? { toolCallDraft: !0 } : {}
  });
}
function Di(e, t = [], n = !1) {
  const r = Ne(e);
  return {
    thinkTagged: r,
    cleanedText: t.length ? r.cleaned : Lt(r.cleaned, { streaming: n })
  };
}
function Hb(e) {
  const t = String(e?.message || e || "");
  return /Cannot read properties of null \(reading ['"]function['"]\)/i.test(t) || /reading ['"]function['"]/i.test(t) || /badresponsestatuscode/i.test(t);
}
var Hm = class {
  constructor(e, t = Ja) {
    this.config = e, this.hostClient = li(t);
  }
  buildMessages(e) {
    return (this.config.toolMode || "native") === "tagged-json" && Array.isArray(e.tools) && e.tools.length > 0 ? xs(e, this.config.model) : Ms(e, this.config.model);
  }
  buildPayload(e, t = !1, n = j("sillytavern-openai-compatible", this.config, e.reasoning)) {
    const r = n, o = t ? xs(e, this.config.model) : Ms(e, this.config.model), i = {
      ...e,
      temperature: gr({
        ...this.config,
        provider: "sillytavern-openai-compatible"
      }, r) ? void 0 : e.temperature
    };
    return xm(rb(this.config, t ? {
      ...i,
      tools: void 0,
      toolChoice: void 0
    } : i, o, typeof e.onStreamProgress == "function"), r);
  }
  async inspectRequest(e, t = {}) {
    const n = t.effectiveReasoning || j("sillytavern-openai-compatible", this.config, e.reasoning), r = t.payload || this.buildPayload(e, !!t.taggedMode, n), o = await this.hostClient.buildHostChatCompletionGenerateRequest(r, typeof e.onStreamProgress == "function");
    return this.buildRequestInspection(o, e, n);
  }
  buildRequestInspection(e, t = {}, n = j("sillytavern-openai-compatible", this.config, t.reasoning)) {
    const r = {
      ...Object.hasOwn(e?.body || {}, "reasoning_effort") ? { reasoning_effort: e.body.reasoning_effort } : {},
      ...Object.hasOwn(e?.body || {}, "thinking") ? { thinking: e.body.thinking } : {}
    };
    return {
      provider: "sillytavern-openai-compatible",
      model: this.config.model,
      transport: "sillytavern-chat-completions",
      request: Gt(e),
      effectiveConfig: {
        ...Ct(t, {
          reasoning: n,
          effort: e?.body?.reasoning_effort,
          controlFields: r
        }),
        ...e?.body?.tool_choice !== void 0 ? { toolChoice: e.body.tool_choice } : {}
      }
    };
  }
  async streamChat(e, t, n, r = {}) {
    const o = { role: "assistant" };
    let i, s = this.config.model;
    await this.hostClient.streamHostChatCompletion(t, (p) => {
      s = p?.model || s;
      const m = p?.choices?.[0] || {};
      Ns(o, m), m.finish_reason && (i = m.finish_reason);
      const g = sn(o), { thinkTagged: _, cleanedText: y } = Di(it(o), g, !0), E = g.length ? g : Rs(_.cleaned);
      qb(e, {
        text: y,
        thoughts: z(n) ? At(o, m).concat(_.thoughts) : [],
        ...E.length ? { toolCalls: E } : {},
        ...!g.length && E.length ? { toolCallDraft: !0 } : {}
      }, n);
    }, {
      signal: e.signal,
      onRequest: r.onRequest,
      onResponseAccepted: r.onResponseAccepted
    }), at("openai", i, !!o.refusal, Ne(it(o)).cleaned), an(o);
    const u = sn(o), { thinkTagged: c, cleanedText: d } = Di(it(o), u), h = At(o, {});
    c.thoughts.forEach((p) => h.push(p));
    const f = u.length ? [] : sr(e, c.cleaned, o);
    return {
      text: d,
      toolCalls: [...u, ...f],
      thoughts: z(n) ? h : [],
      finishReason: i,
      model: s,
      provider: "sillytavern-openai-compatible",
      providerPayload: ar(o),
      ...dn(e, o)
    };
  }
  async nonStreamingChat(e, t, n, r = {}) {
    const o = await this.hostClient.createHostChatCompletion(t, {
      signal: e.signal,
      onRequest: r.onRequest
    }), i = o.choices?.[0] || {}, s = i.message || {};
    at("openai", i.finish_reason, !!s.refusal, Ne(pr(s.content)).cleaned), an(s);
    const u = At(s, i), c = Fa(s.tool_calls || []), { thinkTagged: d, cleanedText: h } = Di(pr(s.content), c);
    d.thoughts.forEach((m) => u.push(m));
    const f = c.length ? [] : sr(e, d.cleaned, s), p = Lo(s, i);
    return {
      text: h,
      toolCalls: [...c, ...f],
      thoughts: z(n) ? u : [],
      finishReason: i.finish_reason,
      model: o.model || this.config.model,
      provider: "sillytavern-openai-compatible",
      providerPayload: ar(p),
      ...dn(e, s)
    };
  }
  async chat(e) {
    const t = j("sillytavern-openai-compatible", this.config, e.reasoning), n = (this.config.toolMode || "native") === "tagged-json" && Array.isArray(e.tools) && e.tools.length > 0, r = Array.isArray(e.tools) && e.tools.length > 0, o = async (s, u = {}) => {
      let c = null;
      const d = (h) => {
        c = this.buildRequestInspection(h, e, t);
      };
      try {
        return {
          ...typeof e.onStreamProgress == "function" ? await this.streamChat(e, s, t, {
            onRequest: d,
            onResponseAccepted: u.onResponseAccepted
          }) : await this.nonStreamingChat(e, s, t, { onRequest: d }),
          requestInspection: c
        };
      } catch (h) {
        throw c && h && typeof h == "object" && (h.requestInspection = c), h;
      }
    }, i = this.buildPayload(e, n, t);
    try {
      return await o(i);
    } catch (s) {
      if (e.allowToolProtocolFallback === !1 || n || !r || !Hb(s)) throw s;
    }
    return typeof e.onToolProtocolFallback == "function" && e.onToolProtocolFallback({
      provider: "sillytavern-openai-compatible",
      fromToolMode: "native",
      toToolMode: "tagged-json",
      reason: "malformed_native_tool_host_error"
    }), await o(this.buildPayload(e, !0, t));
  }
}, id = /* @__PURE__ */ new Map();
function Vb(e, t) {
  return `${e || ""}::${t || ""}`;
}
function Jb(e) {
  try {
    return new URL(e, document.baseURI || window.location.href).toString();
  } catch {
    return e;
  }
}
var Kb = class extends Hm {
  provider = "sillytavern-vertex";
  source = bt;
  constructor(e, t) {
    super(e, t);
  }
  get _region() {
    const e = String(this.config?.vertexRegion || "us-central1").trim().toLowerCase();
    return !e || e === "global" ? "us-central1" : e;
  }
  get _reverseProxyUrl() {
    return `https://${this._region}-aiplatform.googleapis.com/v1beta/openai`;
  }
  async _ensureToken() {
    const e = String(this.config?.serviceAccountJson || "").trim();
    if (!e) throw new Error("Vertex AI 需要 Service Account JSON（請在 Agent API 配置頁貼 SA JSON）");
    let t = "";
    try {
      t = JSON.parse(e).client_email || "";
    } catch {
      throw new Error("Service Account JSON 格式不正確");
    }
    const n = Math.floor(Date.now() / 1e3), r = Vb(this._region, t), o = id.get(r);
    if (o && o.expiresAt > n) return o.accessToken;
    const i = Jb("/api/plugins/littlewhitebox-server/vertex-exchange-token"), s = await Um().catch(() => ({}));
    console.debug("[VertexAdapter] fetching token", i);
    const u = await fetch(i, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...s
      },
      body: JSON.stringify({ serviceAccountJson: e })
    }), c = await u.text().catch(() => "");
    let d = {};
    try {
      d = c ? JSON.parse(c) : {};
    } catch {
      d = {};
    }
    if (!u.ok)
      throw u.status === 404 ? new Error("換取 Vertex OAuth token 失敗：server-plugin 未啟用（HTTP 404）。請確認已安裝 littlewhitebox-server、config.yaml 開啟 enableServerPlugins、並重啟 SillyTavern。") : new Error(`換取 Vertex OAuth token 失敗：HTTP ${u.status} — ${c.slice(0, 200)}`);
    if (!d.ok || !d.accessToken) throw new Error(`換取 Vertex OAuth token 失敗：${d.error || c.slice(0, 200) || "未知錯誤"}`);
    const h = d.expiresAt || n + 3500;
    return id.set(r, {
      accessToken: d.accessToken,
      expiresAt: h
    }), d.accessToken;
  }
  async chat(e) {
    const t = await this._ensureToken();
    return this.config = {
      ...this.config,
      reverse_proxy: this._reverseProxyUrl,
      proxy_password: t,
      baseUrl: void 0,
      apiKey: void 0
    }, super.chat(e);
  }
};
function ro(e, t, n) {
  return Object.hasOwn(n, "hostClient") ? new e(t, li(n.hostClient)) : new e(t);
}
function dR(e = {}, t = {}) {
  switch (Ed(e.reasoning || {}), e.provider) {
    case "sillytavern-openai-compatible":
      return ro(Hm, e, t);
    case "sillytavern-claude":
      return ro(bb, e, t);
    case "sillytavern-google":
      return ro(Bb, e, t);
    case "sillytavern-vertex":
      return ro(Kb, e, t);
    case "openai-responses":
      return new F0(e);
    case "anthropic":
      return new b_(e);
    case "google":
      return new ww(e);
    default:
      return new b0(e);
  }
}
function Wb(e = {}) {
  const t = String(e?.name || "").trim();
  if (typeof e?.arguments == "string") {
    const n = e.arguments;
    try {
      return JSON.parse(n.trim() || "{}"), n;
    } catch {
      return Cm(n, t) || n;
    }
  }
  try {
    return JSON.stringify(e?.arguments || {});
  } catch {
    return "{}";
  }
}
function Ds(e = [], t = {}) {
  const n = String(t.fallbackPrefix || "agent-tool").trim() || "agent-tool", r = typeof t.createId == "function" ? t.createId : (o) => `${n}-${Date.now()}-${o + 1}`;
  return (Array.isArray(e) ? e : []).map((o, i) => {
    const s = Object.prototype.hasOwnProperty.call(o || {}, "providerId");
    return {
      id: String(o?.id || r(i) || `${n}-${i + 1}`),
      name: String(o?.name || "").trim(),
      arguments: Wb(o),
      ...s ? { providerId: String(o?.providerId || "") } : {}
    };
  }).filter((o) => o.name);
}
function zb(e, t = {}) {
  return (Array.isArray(e?.googleContent?.parts) ? e.googleContent.parts : []).filter((n) => n?.functionCall?.name).map((n, r) => {
    const o = String(n.functionCall.id || "").trim();
    return {
      id: o || `${t.fallbackPrefix || "google-tool"}-${r + 1}`,
      name: String(n.functionCall.name || ""),
      arguments: JSON.stringify(n.functionCall.args || {}),
      ...o ? {} : { providerId: "" }
    };
  }).filter((n) => n.name);
}
function fR(e = {}, t = {}, n = {}) {
  const r = Ds(e?.toolCalls, n);
  return r.length ? r : String(e?.provider || t?.provider || "").toLowerCase() !== "google" ? [] : Ds(zb(e?.providerPayload, n), n);
}
function hR(e = {}, t = [], n = {}) {
  return {
    role: "assistant",
    content: Object.prototype.hasOwnProperty.call(n, "content") ? String(n.content || "") : String(e.text || ""),
    providerPayload: e.providerPayload,
    tool_calls: Ds(t, n).map((r) => ({
      id: r.id,
      type: "function",
      ...Object.prototype.hasOwnProperty.call(r, "providerId") ? { providerToolCallId: r.providerId } : {},
      function: {
        name: r.name,
        arguments: r.arguments
      }
    }))
  };
}
function pR(e = {}) {
  const t = String(e.toolName || e.tool_name || "").trim();
  return {
    role: "tool",
    tool_call_id: String(e.toolCallId || e.tool_call_id || ""),
    ...t ? { toolName: t } : {},
    content: String(e.content || "")
  };
}
export {
  oR as AGENT_REQUEST_TIMEOUT_MS,
  Ag as PROVIDER_OPTIONS,
  Qb as REASONING_MODE_OPTIONS,
  hR as buildProviderAssistantToolCallMessage,
  pR as buildProviderToolResultMessage,
  dR as createAgentAdapter,
  aR as getProviderLabel,
  rR as getReasoningEffortOptions,
  nR as getReasoningModeOptions,
  lR as getToolModeLabel,
  sR as isSillyTavernProvider,
  sg as normalizeAgentConfig,
  tR as normalizeAgentSettings,
  Ls as normalizeReasoningConfig,
  Gt as redactRequestSecrets,
  uR as resolveActiveProviderConfig,
  Vs as resolveReasoningCapability,
  fR as resolveResultToolCalls,
  To as resolveRuntimeReasoning,
  cR as setHostChatCompletionsRequestHeadersProvider
};
