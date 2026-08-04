import{r,j as t,t as x,p as w,i as n,s as v}from"./index-Bd1gNHzu.js";const j=`available commands:
  whoami      who is this
  skills      what I work with
  ai          the applied-AI side
  contact     how to reach me
  resume      open the resume pdf
  8583        parse a message
  storm       stir the sky
  clear       clear the screen
  exit        close the terminal`,N=`applied AI, the practical kind:
  TableTalk   LLM agent that turns natural language into SQL,
              gated by an AST guard, a read-only transaction
              and a statement timeout before anything runs
  platform    agent-skills and integration-test scoping for an
              authentication service
  daily kit   Claude, Ollama, Gemini · MLOps · model deployment

rule of thumb: let the model write, never let it run unguarded.`,$=`${n.name.toLowerCase().replace(" ",".")}
backend engineer, payments infrastructure
currently: card payments at razorpay (tokenization, 3-D Secure, routing)
location: ${n.location.toLowerCase()}`,C=`> parsing ISO 8583 message…
  MTI   0100        authorization request
  F2    4532********0001   PAN (masked)
  F3    000000      processing code: purchase
  F4    000000012000       amount: 120.00
  F49   356         currency: INR

fun fact: every card tap you've ever made
became one of these messages.`;function L({open:c,onClose:o}){const[m,l]=r.useState([{type:"out",text:"pratik@portfolio: type 'help' to begin"}]),[d,p]=r.useState(""),u=r.useRef(null),h=r.useRef(null);if(r.useEffect(()=>{if(c){const e=document.activeElement;return setTimeout(()=>h.current?.focus(),30),()=>e?.focus?.()}},[c]),r.useEffect(()=>{u.current?.scrollTo(0,u.current.scrollHeight)},[m]),!c)return null;const k=e=>{const i=e.trim().toLowerCase(),f={type:"cmd",text:`$ ${e}`};let a=null;switch(i){case"":l(s=>[...s,f]);return;case"help":a=j;break;case"whoami":a=$;break;case"skills":a=v.map(s=>`${s.group.toLowerCase()}: ${s.items.map(b=>b.name).join(", ")}`).join(`
`);break;case"ai":a=N;break;case"contact":a=`email:    ${n.email}
github:   ${n.github}
linkedin: ${n.linkedin}`;break;case"resume":window.open(n.resume,"_blank"),a="opening resume…";break;case"8583":a=C;break;case"storm":w()?a="reduced motion is on. the sky stays calm for you.":(window.dispatchEvent(new Event("aurora:storm")),a="storm called. watch the sky for ~9 seconds.");break;case"clear":l([]);return;case"exit":o();return;default:a=`command not found: ${i}. try 'help'`}l(s=>[...s,f,{type:"out",text:a}])},y=e=>{e.preventDefault(),k(d),p("")},g=e=>{e.key==="Escape"&&o()};return t.jsx("div",{className:"term-overlay",onClick:o,onKeyDown:e=>x(e.currentTarget,e),role:"dialog","aria-modal":"true","aria-label":"Terminal",children:t.jsxs("div",{className:"term",onClick:e=>e.stopPropagation(),children:[t.jsxs("div",{className:"term-bar",children:[t.jsxs("span",{className:"dots","aria-hidden":"true",children:[t.jsx("span",{}),t.jsx("span",{}),t.jsx("span",{})]}),"pratik@portfolio: ~",t.jsx("button",{className:"close",onClick:o,"aria-label":"Close terminal",children:"esc ✕"})]}),t.jsx("div",{className:"term-body",ref:u,children:m.map((e,i)=>t.jsx("div",{className:e.type,children:e.text},i))}),t.jsxs("form",{className:"term-input-row",onSubmit:y,children:[t.jsx("span",{className:"prompt","aria-hidden":"true",children:"$"}),t.jsx("input",{ref:h,value:d,onChange:e=>p(e.target.value),onKeyDown:g,"aria-label":"Terminal input",autoCapitalize:"off",autoCorrect:"off",spellCheck:"false"})]})]})})}export{L as default};
