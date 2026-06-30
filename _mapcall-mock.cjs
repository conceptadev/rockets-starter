const http=require("http");
const {McpServer}=require("@modelcontextprotocol/sdk/server/mcp.js");
const {StreamableHTTPServerTransport}=require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const {z}=require("zod");
function logsFor(pid){ const n = pid==="51447000000377349"?3:2; return Array.from({length:n},()=>({logTime:"3600000",projectId:pid})); }
function build(){ const s=new McpServer({name:"m",version:"1.0.0"});
 s.registerTool("ZohoSprints_GetLogHours",{description:"logs",inputSchema:{path_variables:z.any().optional(),query_params:z.any().optional(),headers:z.any().optional()}},
   async(a)=>{ const pid=(a&&a.path_variables&&a.path_variables.projectId)||"?"; return {content:[{type:"text",text:JSON.stringify({status:"success",data:{next:false,logs:logsFor(pid)}})}]}; });
 return s; }
http.createServer((req,res)=>{ if(req.url!=="/mcp"){res.statusCode=404;res.end();return;} let b="";req.on("data",c=>b+=c);req.on("end",async()=>{let p;try{p=b?JSON.parse(b):undefined;}catch{p=undefined;} const srv=build();const t=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});res.on("close",()=>{t.close();srv.close();});await srv.connect(t);await t.handleRequest(req,res,p);});}).listen(7799,()=>console.error("mock on 7799"));
