import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (typeof window !== 'undefined') {
  const accessControlState = window as Window & { __ANTI_COPY_ALLOW_RENDER__?: boolean };
  accessControlState.__ANTI_COPY_ALLOW_RENDER__ = true;
  const isAdmin = () => window.location.pathname.startsWith('/admin');
  const isIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
  const hostname = window.location.hostname;
  const isLovablePreview = hostname.includes('id-preview--') && (hostname.includes('lovable.app') || hostname.includes('lovableproject.com'));
  const isExempt = () => isIframe || isAdmin() || isLovablePreview;

  // ============================================
  // DEVICE DETECTION — High-precision approach
  // Strategy: allow when there are strong mobile signals
  // Only block when device clearly looks like a computer
  // ============================================
  const ua = navigator.userAgent || '';
  const uaData = (navigator as any).userAgentData;
  const platform = uaData?.platform || navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenWidth = window.screen.width || window.innerWidth;
  const screenHeight = window.screen.height || window.innerHeight;
  const minScreen = Math.min(screenWidth, screenHeight);
  const maxScreen = Math.max(screenWidth, screenHeight);
  const hasCoarsePointer = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)').matches : false;
  const hasAnyFinePointer = typeof window.matchMedia === 'function' ? window.matchMedia('(any-pointer: fine)').matches : false;
  const hasAnyHover = typeof window.matchMedia === 'function' ? window.matchMedia('(any-hover: hover)').matches : false;
  const hasTouch = 'ontouchstart' in window || maxTouchPoints > 0;
  const isSmallViewport = Math.min(window.innerWidth, window.innerHeight) <= 900;

  // Mobile/tablet signals — if any of these are true, allow access
  const mobileUARegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Silk|Kindle|CriOS|FxiOS|EdgiOS|SamsungBrowser|UCBrowser|MiuiBrowser|HuaweiBrowser|OppoBrowser|VivoBrowser|Mobi/i;
  const mobilePlatformRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|arm|aarch64/i;
  const hasMobileUA = mobileUARegex.test(ua);
  const hasMobilePlatform = mobilePlatformRegex.test(platform);
  const uaDataMobile = uaData?.mobile === true;
  const hasMobileViewportProfile = hasTouch && hasCoarsePointer && maxScreen <= 1400;

  // iPadOS may identify itself as Mac; touch makes the distinction
  const isTouchMacLike = /Mac/i.test(platform) && maxTouchPoints > 1;

  // Android desktop mode / tablets should still pass if touch + coarse pointer are present
  const isLikelyMobileOrTablet = hasMobileUA || hasMobilePlatform || uaDataMobile || isTouchMacLike || hasMobileViewportProfile || isSmallViewport;

  // Strong computer signals
  const desktopOSRegex = /Windows NT|Win64|Win32|Macintosh|MacIntel|X11|Linux x86_64|Linux i686|CrOS/i;
  const hasDesktopOS = desktopOSRegex.test(ua) || desktopOSRegex.test(platform);
  const hasDesktopPointerProfile = hasAnyFinePointer && hasAnyHover && !hasCoarsePointer;
  const looksLikeComputerHardware = minScreen >= 900 && maxScreen >= 1200 && hasDesktopPointerProfile;
  const isDesktop = !isLikelyMobileOrTablet && (hasDesktopOS || looksLikeComputerHardware || (hasDesktopPointerProfile && !hasTouch));

  const showBlockScreen = () => {
    accessControlState.__ANTI_COPY_ALLOW_RENDER__ = false;
    const root = document.getElementById('root');
    if (!root) return;

    document.body.style.cssText = 'margin:0;padding:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;';
    const msg = document.createElement('div');
    msg.style.cssText = 'color:#fff;text-align:center;padding:2rem;max-width:500px;';
    msg.innerHTML = '<p style="font-size:3rem;margin-bottom:1rem;">⚠️</p><p style="font-size:1.2rem;font-weight:bold;margin-bottom:0.5rem;">Acesso não autorizado detectado.</p><p style="font-size:0.9rem;opacity:0.8;">Este site é protegido por direitos autorais.</p>';
    root.innerHTML = '';
    root.replaceChildren(msg);
  };

  // === DESKTOP ONLY: Block access ===
  if (isDesktop && !isExempt()) {
    const blockDesktop = () => showBlockScreen();
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', blockDesktop);
    } else {
      blockDesktop();
    }
  }

  // === ALL DEVICES (non-exempt): Light protections ===
  if (!isExempt()) {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
      const k = e.key?.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      if (k === 'f12' || (ctrl && k === 'u') || (ctrl && e.shiftKey && ['i','j','c'].includes(k)) || (ctrl && k === 's')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    document.addEventListener('dragstart', (e) => {
      if ((e.target as HTMLElement)?.tagName === 'IMG') e.preventDefault();
    });

    const style = document.createElement('style');
    style.textContent = `
      * { -webkit-user-select: none !important; -moz-user-select: none !important; user-select: none !important; }
      input, textarea, [contenteditable="true"] { -webkit-user-select: text !important; -moz-user-select: text !important; user-select: text !important; }
      img { -webkit-user-drag: none !important; }
    `;
    document.head.appendChild(style);
  }

  // Console warning
  console.log('%c⚠️ PARE!', 'color:red;font-size:40px;font-weight:bold;');
  console.log('%cEste site é protegido por direitos autorais (Lei 9.610/98). Qualquer tentativa de cópia, reprodução ou engenharia reversa é proibida e poderá resultar em medidas legais.', 'color:red;font-size:14px;');
}

const rootElement = document.getElementById("root");

if (rootElement && (window as Window & { __ANTI_COPY_ALLOW_RENDER__?: boolean }).__ANTI_COPY_ALLOW_RENDER__ !== false) {
  createRoot(rootElement).render(<App />);
}
