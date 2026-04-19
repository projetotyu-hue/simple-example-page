import{j as e}from"./vendor-ui-cQdDygt4.js";import{r as s}from"./vendor-react-MLj_6mGN.js";const u=({show:a,onComplete:r,duration:i=1200})=>{const[o,t]=s.useState(!1),n=s.useRef(r);return n.current=r,s.useEffect(()=>{if(a){t(!0);const l=setTimeout(()=>{t(!1),n.current()},i);return()=>clearTimeout(l)}else t(!1)},[a,i]),o?e.jsxs("div",{className:"fixed inset-0 z-[100] bg-white flex items-center justify-center",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-4 h-4 rounded-full",style:{backgroundColor:"#25F4EE",animation:"tiktokBounceLeft 0.6s ease-in-out infinite alternate"}}),e.jsx("div",{className:"w-4 h-4 rounded-full",style:{backgroundColor:"#FE2C55",animation:"tiktokBounceRight 0.6s ease-in-out infinite alternate"}})]}),e.jsx("style",{children:`
        @keyframes tiktokBounceLeft {
          0% { transform: translateX(8px) scale(1); opacity: 0.7; }
          100% { transform: translateX(-8px) scale(1.2); opacity: 1; }
        }
        @keyframes tiktokBounceRight {
          0% { transform: translateX(-8px) scale(1.2); opacity: 1; }
          100% { transform: translateX(8px) scale(1); opacity: 0.7; }
        }
      `})]}):null};export{u as T};
