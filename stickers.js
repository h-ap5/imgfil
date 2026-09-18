"use strict";

(() => {
  const holoDefs = `
    <defs>
      <linearGradient id="pearl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset=".24" stop-color="#bff8ff"/>
        <stop offset=".5" stop-color="#e8c8ff"/>
        <stop offset=".73" stop-color="#ffbddd"/>
        <stop offset="1" stop-color="#c9fff0"/>
      </linearGradient>
      <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset=".2" stop-color="#9cc8ef"/>
        <stop offset=".42" stop-color="#f9faff"/>
        <stop offset=".63" stop-color="#8a70bd"/>
        <stop offset=".82" stop-color="#e8faff"/>
        <stop offset="1" stop-color="#8dd4d4"/>
      </linearGradient>
      <radialGradient id="jelly" cx="35%" cy="25%" r="75%">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".96"/>
        <stop offset=".22" stop-color="#d9f7ff" stop-opacity=".92"/>
        <stop offset=".6" stop-color="#bda7ff" stop-opacity=".88"/>
        <stop offset="1" stop-color="#ff9ed2" stop-opacity=".8"/>
      </radialGradient>
      <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#37428a" flood-opacity=".28"/>
      </filter>
    </defs>`;

  const holo = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${holoDefs}${body}</svg>`;
  const pixel = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" shape-rendering="crispEdges">
    <rect width="100" height="100" fill="none"/>${body}</svg>`;
  const y2k = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <filter id="y-shadow" x="-30%" y="-30%" width="170%" height="170%">
        <feDropShadow dx="3" dy="4" stdDeviation="1.5" flood-color="#17204f" flood-opacity=".42"/>
      </filter>
      <linearGradient id="y-chrome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff"/><stop offset=".28" stop-color="#9eeeff"/>
        <stop offset=".5" stop-color="#fff"/><stop offset=".72" stop-color="#9b80d2"/>
        <stop offset="1" stop-color="#e7fbff"/>
      </linearGradient>
    </defs>${body}</svg>`;

  window.STICKER_CATALOG = [
    {
      id: "chrome-heart",
      label: "크롬 하트",
      group: "holo",
      svg: holo(`<path d="M50 84C37 72 17 59 17 38c0-13 9-22 21-22 7 0 11 3 16 10 5-7 9-10 16-10 12 0 21 9 21 22 0 21-22 35-41 46Z" fill="url(#chrome)" stroke="#fff" stroke-width="4" filter="url(#soft-shadow)"/><path d="M30 30c7-7 14-3 17 2" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".82"/>`),
    },
    {
      id: "wing-heart",
      label: "날개 하트",
      group: "holo",
      svg: holo(`<path d="M50 74C38 64 28 56 28 43c0-9 6-15 14-15 5 0 8 3 11 7 3-4 6-7 11-7 8 0 14 6 14 15 0 13-13 23-25 31Z" fill="url(#jelly)" stroke="#fff" stroke-width="3"/><path d="M31 37C19 30 9 30 6 35c7 2 10 6 13 11-6-1-11 1-13 5 8 1 15 5 25 11" fill="url(#pearl)" stroke="#fff" stroke-width="3"/><path d="M75 37c12-7 22-7 25-2-7 2-10 6-13 11 6-1 11 1 13 5-8 1-15 5-25 11" fill="url(#pearl)" stroke="#fff" stroke-width="3"/>`),
    },
    {
      id: "jelly-star",
      label: "젤리 별",
      group: "holo",
      svg: holo(`<path d="m50 10 10 26 28 2-22 18 7 28-23-15-24 15 8-28-22-18 28-2Z" fill="url(#jelly)" stroke="#fff" stroke-width="4" filter="url(#soft-shadow)"/><path d="m44 25 4 9 10 1" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".84"/>`),
    },
    {
      id: "glass-moon",
      label: "유리 달",
      group: "holo",
      svg: holo(`<path d="M69 12C42 16 24 36 28 59c3 19 21 31 42 27-17-5-27-21-24-39 2-14 11-26 23-35Z" fill="url(#pearl)" stroke="#fff" stroke-width="4" filter="url(#soft-shadow)"/><path d="m65 29 4 8 8 4-8 4-4 8-4-8-8-4 8-4Z" fill="#fff" opacity=".9"/>`),
    },
    {
      id: "orbit-heart",
      label: "궤도 하트",
      group: "holo",
      svg: holo(`<path d="M50 72C37 61 26 52 26 39c0-9 6-15 14-15 5 0 8 3 11 7 3-4 6-7 11-7 8 0 14 6 14 15 0 13-13 23-26 33Z" fill="url(#jelly)" stroke="#fff" stroke-width="3"/><ellipse cx="50" cy="48" rx="43" ry="17" fill="none" stroke="url(#chrome)" stroke-width="5" transform="rotate(-14 50 48)"/><circle cx="86" cy="34" r="5" fill="#fff" stroke="#b9dfff" stroke-width="2"/>`),
    },
    {
      id: "glass-butterfly",
      label: "유리 나비",
      group: "holo",
      svg: holo(`<path d="M47 48C38 17 12 12 12 32c0 14 15 24 34 25-18 3-28 15-21 25 7 10 20-2 25-19Z" fill="url(#pearl)" stroke="#fff" stroke-width="3"/><path d="M53 48c9-31 35-36 35-16 0 14-15 24-34 25 18 3 28 15 21 25-7 10-20-2-25-19Z" fill="url(#jelly)" stroke="#fff" stroke-width="3"/><path d="M50 40v30" stroke="#75639e" stroke-width="4" stroke-linecap="round"/>`),
    },
    {
      id: "glass-tulip",
      label: "유리 튤립",
      group: "holo",
      svg: holo(`<path d="M30 18c10 1 15 6 20 15 5-9 10-14 20-15 4 24-4 37-20 38-16-1-24-14-20-38Z" fill="url(#jelly)" stroke="#fff" stroke-width="4"/><path d="M50 56v31M49 72c-13-11-24-9-28-3 10 0 18 5 28 15M51 74c12-11 22-10 28-4-11 1-18 6-28 15" fill="none" stroke="url(#chrome)" stroke-width="6" stroke-linecap="round"/>`),
    },
    {
      id: "rain-cloud",
      label: "구름비",
      group: "holo",
      svg: holo(`<path d="M24 55c-10 0-16-7-14-16 2-8 10-12 18-9 3-12 14-19 26-16 9 2 15 9 16 17 11-2 20 4 20 13 0 7-6 11-15 11Z" fill="url(#chrome)" stroke="#fff" stroke-width="4"/><path d="M29 67 24 79M48 67l-5 15M68 67l-5 15" stroke="#7bb8ff" stroke-width="6" stroke-linecap="round"/>`),
    },
    {
      id: "pastel-phone",
      label: "폴더폰",
      group: "holo",
      svg: holo(`<g transform="rotate(-12 50 50)" filter="url(#soft-shadow)"><rect x="28" y="7" width="44" height="42" rx="10" fill="url(#pearl)" stroke="#fff" stroke-width="4"/><rect x="35" y="15" width="30" height="23" rx="4" fill="#8adff1" stroke="#7269a7" stroke-width="2"/><path d="M28 48h44l6 36c1 7-3 10-10 10H32c-7 0-11-3-10-10Z" fill="url(#jelly)" stroke="#fff" stroke-width="4"/><g fill="#fff" stroke="#7c70a8" stroke-width="1.5"><circle cx="37" cy="62" r="4"/><circle cx="50" cy="62" r="4"/><circle cx="63" cy="62" r="4"/><circle cx="37" cy="75" r="4"/><circle cx="50" cy="75" r="4"/><circle cx="63" cy="75" r="4"/></g></g>`),
    },
    {
      id: "pastel-cherries",
      label: "체리",
      group: "holo",
      svg: holo(`<path d="M47 54c0-26 8-34 25-37M54 53c3-21-3-31-19-38M58 20c9 0 16 3 20 10-10 2-18-1-20-10Z" fill="none" stroke="#789c78" stroke-width="5" stroke-linecap="round"/><circle cx="37" cy="66" r="18" fill="url(#jelly)" stroke="#fff" stroke-width="4"/><circle cx="66" cy="68" r="18" fill="url(#pearl)" stroke="#fff" stroke-width="4"/><circle cx="31" cy="59" r="5" fill="#fff" opacity=".7"/><circle cx="60" cy="61" r="5" fill="#fff" opacity=".7"/>`),
    },
    {
      id: "y2k-love-bubble",
      label: "LOVE 말풍선",
      group: "y2k",
      svg: y2k(`<path d="M10 20h80v53H58L45 88l1-15H10Z" fill="#fff8f2" stroke="#151626" stroke-width="4" filter="url(#y-shadow)"/><path d="M18 28h64v36H18Z" fill="#f6b4d4" stroke="#151626" stroke-width="2"/><text x="50" y="53" text-anchor="middle" font-family="monospace" font-size="20" font-weight="900" fill="#161727">LOVE!</text><path d="m76 13 3 7 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#7af0e9" stroke="#151626" stroke-width="2"/>`),
    },
    {
      id: "y2k-checker-flower",
      label: "체커 꽃",
      group: "y2k",
      svg: y2k(`<g filter="url(#y-shadow)" stroke="#151626" stroke-width="3"><circle cx="50" cy="18" r="17" fill="#fff"/><circle cx="78" cy="38" r="17" fill="#151626"/><circle cx="68" cy="71" r="17" fill="#fff"/><circle cx="32" cy="71" r="17" fill="#151626"/><circle cx="22" cy="38" r="17" fill="#fff"/><circle cx="50" cy="48" r="20" fill="#ff77bd"/></g><path d="M42 43h8v8h-8zm8 8h8v8h-8zm0-16h8v8h-8zm-8 24h8v8h-8Z" fill="#fff"/>`),
    },
    {
      id: "y2k-heart-mail",
      label: "하트 메일",
      group: "y2k",
      svg: y2k(`<g filter="url(#y-shadow)"><path d="M8 25h84v56H8Z" fill="#fdfbf4" stroke="#151626" stroke-width="4"/><path d="m10 28 40 31 40-31M10 78l29-29m51 29L61 49" fill="none" stroke="#151626" stroke-width="4"/><path d="M50 64C39 56 28 48 28 37c0-8 6-13 13-13 5 0 8 3 10 7 3-4 6-7 11-7 7 0 13 5 13 13 0 11-13 20-25 27Z" fill="#ff76bc" stroke="#fff" stroke-width="3"/></g>`),
    },
    {
      id: "y2k-mini-camera",
      label: "미니 디카",
      group: "y2k",
      svg: y2k(`<g filter="url(#y-shadow)"><path d="M12 28h76v53H12Z" fill="url(#y-chrome)" stroke="#151626" stroke-width="4"/><path d="M23 20h24l6 10H18Z" fill="#f179bd" stroke="#151626" stroke-width="3"/><circle cx="55" cy="54" r="21" fill="#171827" stroke="#fff" stroke-width="4"/><circle cx="55" cy="54" r="13" fill="#78e5ef" stroke="#6c66a4" stroke-width="4"/><circle cx="51" cy="49" r="5" fill="#fff" opacity=".82"/><path d="M19 37h15v10H19Z" fill="#fff" stroke="#151626" stroke-width="2"/><circle cx="79" cy="37" r="4" fill="#ffed68"/></g>`),
    },
    {
      id: "y2k-drip-star",
      label: "녹는 별",
      group: "y2k",
      svg: y2k(`<path d="m50 8 12 27 29 3-22 19 7 29-17-11-4 18-7-22-17 15 7-29-22-19 29-3Z" fill="#151626" stroke="#fff" stroke-width="5" filter="url(#y-shadow)"/><path d="m50 22 7 18 20 2-15 12 5 19-17-10-16 10 5-19-15-12 20-2Z" fill="#76eee7"/><circle cx="45" cy="46" r="3" fill="#151626"/><circle cx="58" cy="46" r="3" fill="#151626"/><path d="M44 55c5 5 10 5 15 0" fill="none" stroke="#151626" stroke-width="3" stroke-linecap="round"/>`),
    },
    {
      id: "y2k-orbit",
      label: "체커 행성",
      group: "y2k",
      svg: y2k(`<circle cx="50" cy="49" r="26" fill="#ff8bc7" stroke="#151626" stroke-width="4" filter="url(#y-shadow)"/><path d="M27 37h12v12H27zm12 12h12v12H39zm12-12h12v12H51zm12 12h12v12H63zM51 61h12v12H51Z" fill="#fff" opacity=".9"/><ellipse cx="50" cy="50" rx="45" ry="16" fill="none" stroke="#151626" stroke-width="6" transform="rotate(-14 50 50)"/><ellipse cx="50" cy="50" rx="45" ry="16" fill="none" stroke="#fff" stroke-width="2" transform="rotate(-14 50 50)"/>`),
    },
    {
      id: "y2k-ok-window",
      label: "OK 창",
      group: "y2k",
      svg: y2k(`<g filter="url(#y-shadow)"><path d="M8 18h84v66H8Z" fill="#eee9df" stroke="#151626" stroke-width="4"/><path d="M12 22h76v16H12Z" fill="#3259d9"/><text x="18" y="34" font-family="monospace" font-size="11" font-weight="700" fill="#fff">MESSAGE</text><path d="M75 25h10v10H75Z" fill="#fff"/><path d="m77 27 6 6m0-6-6 6" stroke="#151626" stroke-width="2"/><text x="50" y="57" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#151626">ARE U OK?</text><path d="M35 64h30v13H35Z" fill="#fff" stroke="#151626" stroke-width="2"/><text x="50" y="74" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#151626">YES</text></g>`),
    },
    {
      id: "y2k-pink-laptop",
      label: "핑크 노트북",
      group: "y2k",
      svg: y2k(`<g filter="url(#y-shadow)"><path d="M20 13h60v50H20Z" fill="#ff9dce" stroke="#151626" stroke-width="4"/><path d="M27 20h46v35H27Z" fill="#bdf8ff" stroke="#fff" stroke-width="3"/><path d="M11 67h78l-8 19H19Z" fill="#ffc2e1" stroke="#151626" stroke-width="4"/><path d="M39 71h22l4 8H35Z" fill="#fff" stroke="#151626" stroke-width="2"/><path d="m50 27 4 9 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1Z" fill="#fff" stroke="#6c66a4" stroke-width="2"/></g>`),
    },
    {
      id: "pixel-yes",
      label: "YES 버튼",
      group: "pixel",
      svg: pixel(`<path d="M12 22h76v56H12z" fill="#0615ff"/><path d="M16 18h68v4H16zM8 26h4v48H8z" fill="#ff82d8"/><path d="M16 26h68v44H16z" fill="#fff9ef"/><path d="M20 30h60v36H20z" fill="#ffc8ed"/><path d="M24 34h52v28H24z" fill="#fff"/><text x="50" y="54" text-anchor="middle" font-family="monospace" font-size="18" font-weight="700" fill="#062aff">YES</text>`),
    },
    {
      id: "pixel-no",
      label: "NO 버튼",
      group: "pixel",
      svg: pixel(`<path d="M12 22h76v56H12z" fill="#0615ff"/><path d="M16 18h68v4H16zM8 26h4v48H8z" fill="#78fff1"/><path d="M16 26h68v44H16z" fill="#fff9ef"/><path d="M20 30h60v36H20z" fill="#c9fff1"/><path d="M24 34h52v28H24z" fill="#fff"/><text x="50" y="54" text-anchor="middle" font-family="monospace" font-size="18" font-weight="700" fill="#062aff">NO</text>`),
    },
    {
      id: "pixel-cursor",
      label: "픽셀 커서",
      group: "pixel",
      svg: pixel(`<path d="M18 8v72h12V62h12l12 28 14-6-12-27h22V45L18 8Z" fill="#0718ff"/><path d="M24 18v52h6V54h16l11 25 5-2-12-27h20L24 18Z" fill="#fff"/><path d="M68 14h6v12h-6zM62 20h18v6H62zM78 32h6v8h-6z" fill="#00eaff"/><path d="M72 20h6v6h-6z" fill="#ff73d0"/>`),
    },
    {
      id: "pixel-burst",
      label: "별 폭발",
      group: "pixel",
      svg: pixel(`<path d="M45 4h10v25l14-14 7 7-14 15h28v10H68l16 13-7 8-18-14v34H48V62L34 82l-9-6 14-20-27 9-4-10 28-9L9 32l5-9 27 14Z" fill="#0726ff"/><path d="M52 20 61 39h18L64 50l7 20-19-12-18 12 7-20-16-11h20Z" fill="#ff68d2"/><path d="m52 31 5 12h12l-10 7 4 12-11-7-11 7 4-12-10-7h12Z" fill="#fff"/>`),
    },
    {
      id: "pixel-hearts",
      label: "선택 하트",
      group: "pixel",
      svg: pixel(`<path d="M12 9h76v82H12z" fill="#071bff"/><path d="M16 13h68v74H16z" fill="#111426"/><path d="M25 24h8v-8h8v8h8v8h-8v8h-8v-8h-8z" fill="#6ffff0"/><path d="M56 21h12v6h6v12h-6v6H56v-6h-6V27h6Z" fill="#ff83d9"/><path d="M56 52h12v6h6v12h-6v6H56v-6h-6V58h6Z" fill="#70fff1"/><path d="M8 5h8v8H8zM84 5h8v8h-8zM8 87h8v8H8zM84 87h8v8h-8z" fill="#ff76d4"/>`),
    },
    {
      id: "pixel-enter",
      label: "ENTER 키",
      group: "pixel",
      svg: pixel(`<path d="M8 21h84v58H8z" fill="#0920ff"/><path d="M12 17h76v8H12zM4 29h8v46H4z" fill="#71fff0"/><path d="M14 29h68v38H14z" fill="#fff"/><text x="43" y="54" text-anchor="middle" font-family="monospace" font-size="17" font-weight="700" fill="#0a24ff">ENTER</text><path d="M75 38v14H61v-6l-10 10 10 10v-6h22V38Z" fill="#ff71ce"/>`),
    },
    {
      id: "pixel-player",
      label: "픽셀 플레이어",
      group: "pixel",
      svg: pixel(`<path d="M5 21h90v58H5z" fill="#0720ff"/><path d="M9 17h82v8H9z" fill="#79fff2"/><path d="M11 29h78v38H11z" fill="#fff"/><path d="m43 39 20 10-20 10Z" fill="#ff75d2"/><path d="M20 44h6v10h-6zM27 41h5v16h-5zM72 41h5v16h-5zM78 44h6v10h-6z" fill="#0923ff"/><path d="M18 72h64v5H18z" fill="#fff"/><path d="M18 72h31v5H18z" fill="#ff73cf"/><path d="M47 69h6v11h-6z" fill="#72fff1"/>`),
    },
    {
      id: "pixel-error",
      label: "오류창",
      group: "pixel",
      svg: pixel(`<path d="M10 16h72v8h8v60h-8v8H18v-8h-8Z" fill="#0920ff"/><path d="M14 20h64v8H14z" fill="#ff7bd5"/><path d="M18 32h64v48H18z" fill="#fff"/><path d="M72 22h5v5h-5z" fill="#fff"/><path d="M25 43h15v15H25z" fill="#ff6fcf"/><path d="M30 46h5v9h-5zM30 60h5v5h-5z" fill="#fff"/><text x="60" y="58" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="#0920ff">ERROR</text><path d="M22 70h52v5H22z" fill="#74fff2"/>`),
    },
    {
      id: "pixel-waves",
      label: "픽셀 물결",
      group: "pixel",
      svg: pixel(`<path d="M5 24h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v12H85v8H75v-8H65v8H55v-8H45v8H35v-8H25v8H15v-8H5Zm0 32h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v12H85v8H75v-8H65v8H55v-8H45v8H35v-8H25v8H15v-8H5Z" fill="#ff70cf"/><path d="M5 40h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8H85v8H75v-8H65v8H55v-8H45v8H35v-8H25v8H15v-8H5Z" fill="#72fff1"/>`),
    },
    {
      id: "pixel-loader",
      label: "로딩 친구",
      group: "pixel",
      svg: pixel(`<path d="M10 16h80v68H10z" fill="#0820ff"/><path d="M14 20h72v60H14z" fill="#111426"/><path d="M22 29h8v8h-8zM34 29h8v8h-8zM46 29h8v8h-8zM58 29h8v8h-8zM70 29h8v8h-8z" fill="#ff75d2"/><path d="M22 48h56v8H22z" fill="#fff"/><path d="M22 48h34v8H22z" fill="#73fff2"/><path d="M27 65h8v8h-8zM39 65h8v8h-8zM51 65h8v8h-8zM63 65h8v8h-8z" fill="#fff"/><path d="M27 65h8v8h-8zM39 65h8v8h-8z" fill="#ff75d2"/>`),
    },
  ];
})();
