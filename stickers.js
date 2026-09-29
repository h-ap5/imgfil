"use strict";

(() => {
  // Holo and Y2K stickers are pre-rendered 3D artwork (assets/stickers/*.webp, original designs).
  const file = (id, label, group, aspect) => ({ id, label, group, file: `assets/stickers/${id}.webp`, aspect });

  const pixel = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" shape-rendering="crispEdges">
    <rect width="100" height="100" fill="none"/>${body}</svg>`;
  const spritePalette = {
    k: "#3b2a5c",
    w: "#ffffff",
    l: "#ffd6ec",
    p: "#ffa3d3",
    P: "#ff4fa3",
    v: "#c9a8ff",
    V: "#8a63e0",
    c: "#9ef0ff",
    y: "#ffe36e",
  };

  // Pixel art from text rows: "." is empty, other letters index spritePalette.
  // Adds the white die-cut border (one cell, eight neighbours) and a soft drop shadow.
  const sprite = (rows) => {
    const height = rows.length;
    const width = rows[0].length;
    const filled = (x, y) => y >= 0 && y < height && x >= 0 && x < width && rows[y][x] !== ".";
    let paper = "";
    let art = "";
    for (let y = -1; y <= height; y += 1) {
      for (let x = -1; x <= width; x += 1) {
        const cell = `x="${x + 1}" y="${y + 1}" width="1.04" height="1.04"`;
        if (filled(x, y)) {
          paper += `<rect ${cell}/>`;
          art += `<rect ${cell} fill="${spritePalette[rows[y][x]]}"/>`;
        } else if ([-1, 0, 1].some((dy) => [-1, 0, 1].some((dx) => filled(x + dx, y + dy)))) {
          paper += `<rect ${cell}/>`;
        }
      }
    }
    const boxWidth = width + 2;
    const boxHeight = height + 2.5;
    return {
      aspect: boxWidth / boxHeight,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${boxWidth} ${boxHeight}" shape-rendering="crispEdges"><g fill="#2a1f45" opacity=".24" transform="translate(0 .5)">${paper}</g><g fill="#fff">${paper}</g>${art}</svg>`,
    };
  };

  window.STICKER_CATALOG = [
    file("holo-chrome-heart", "크롬 하트", "holo", 504 / 476),
    file("holo-pearl-heart", "오팔 하트", "holo", 504 / 476),
    file("holo-sparkle", "크롬 반짝이", "holo", 534 / 531),
    file("holo-star", "오로라 별", "holo", 568 / 546),
    file("holo-bow", "크롬 리본", "holo", 516 / 430),
    file("holo-butterfly", "오팔 나비", "holo", 546 / 428),
    file("holo-pearl", "진주", "holo", 484 / 484),
    file("holo-moon", "크롬 달", "holo", 511 / 471),
    file("holo-flower", "오팔 꽃", "holo", 538 / 522),
    file("holo-cherry", "오팔 체리", "holo", 458 / 495),
    file("holo-heart-frame", "별 하트 프레임", "holo", 504 / 476),
    file("holo-angel-heart", "천사 하트", "holo", 570 / 381),
    file("holo-love", "LOVE 크롬", "holo", 528 / 191),
    file("holo-bolt", "크롬 번개", "holo", 372 / 561),
    file("sky-moon-star", "하늘 달", "holo", 505 / 460),
    file("sky-star", "말랑 별", "holo", 574 / 553),
    file("sky-sparkle", "하늘 반짝이", "holo", 534 / 534),
    file("sky-heart", "파랑 하트", "holo", 504 / 476),
    file("sky-milk-heart", "우유 하트", "holo", 504 / 476),
    file("sky-bow", "하늘 리본", "holo", 516 / 430),
    file("sky-butterfly", "유리 나비", "holo", 546 / 428),
    file("sky-flower", "하늘 꽃", "holo", 500 / 488),
    file("sky-shell", "진주 조개", "holo", 528 / 499),
    file("sky-pearl-heart", "진주 하트", "holo", 538 / 501),
    file("sky-gummy", "젤리 곰", "holo", 410 / 534),
    file("sky-strawberry", "하늘 딸기", "holo", 452 / 518),
    file("sky-heart-planet", "하트 행성", "holo", 545 / 385),
    file("sky-cloud", "구름", "holo", 492 / 384),
    file("sky-gem", "하늘 보석", "holo", 484 / 473),
    file("sky-bear", "곰돌이", "holo", 466 / 454),
    file("y2k-jelly-heart", "젤리 하트", "y2k", 504 / 476),
    file("y2k-glitter-heart", "글리터 하트", "y2k", 504 / 476),
    file("y2k-text", "Y2K 글자", "y2k", 521 / 249),
    file("y2k-butterfly", "핑크 나비", "y2k", 546 / 428),
    file("y2k-phone", "폴더폰", "y2k", 464 / 531),
    file("y2k-lips", "글로시 입술", "y2k", 502 / 321),
    file("y2k-cherries", "체리", "y2k", 458 / 495),
    file("y2k-heart-glasses", "하트 선글라스", "y2k", 524 / 271),
    file("y2k-cd", "CD", "y2k", 536 / 536),
    file("y2k-cassette", "카세트테이프", "y2k", 546 / 380),
    file("y2k-angel-heart", "엔젤 하트", "y2k", 570 / 381),
    file("y2k-star-clip", "별 헤어핀", "y2k", 464 / 422),
    file("y2k-pet", "디지털 펫", "y2k", 453 / 552),
    file("y2k-lipgloss", "립글로스", "y2k", 307 / 505),
    file("y2k-daisy", "데이지", "y2k", 534 / 534),
    file("y2k-bag", "미니 백", "y2k", 464 / 417),
    file("y2k-angel-text", "angel 글자", "y2k", 537 / 266),
    file("y2k-smiley", "스마일", "y2k", 504 / 504),
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
    {
      id: "pixel-y2k-phone",
      label: "도트 폴더폰",
      group: "pixel",
      ...sprite([
        "..kkkkkkkkk..",
        ".kwllllllllk.",
        ".klkkkkkkklk.",
        ".klkcPcPcklk.",
        ".klkPPPPPklk.",
        ".klkcPPPcklk.",
        ".klkccPccklk.",
        ".klkcccccklk.",
        ".klkkkkkkklk.",
        ".klllllllllk.",
        "..kkkkkkkkk..",
        "...kVVVVVk...",
        "..kkkkkkkkk..",
        ".kpppppppppk.",
        ".kpwppwppwpk.",
        ".kpppppppppk.",
        ".kpwppwppwpk.",
        ".kpppppppppk.",
        ".kpwppwppwpk.",
        ".kpppppppppk.",
        "..kkkkkkkkk..",
      ]),
    },
    {
      id: "pixel-heart-pet",
      label: "하트 펫",
      group: "pixel",
      ...sprite([
        "...kkk...kkk...",
        "..kvvvk.kvvvk..",
        ".kvwwvvkvvvvvk.",
        "kvwvvvvvvvvvvvk",
        "kvvkkkkkkkkkvvk",
        "kvvkccccccckvvk",
        "kvvkcckckcckvvk",
        "kvvkccccccckvvk",
        "kvvkcckkkcckvvk",
        ".kvkkkkkkkkkvk.",
        "..kvvPvPvPvvk..",
        "...kvvvvvvvk...",
        "....kvvvvvk....",
        ".....kvvvk.....",
        "......kvk......",
        ".......k.......",
      ]),
    },
    {
      id: "pixel-lips",
      label: "도트 입술",
      group: "pixel",
      ...sprite([
        "..kkk...kkk..",
        ".kPPPk.kPPPk.",
        "kPPwPPkPPPPPk",
        "kPPPPPPPPPPPk",
        "kkkkkkkkkkkkk",
        "kpppppppppppk",
        ".kppwwpppppk.",
        "..kpppppppk..",
        "...kkkkkkk...",
      ]),
    },
    {
      id: "pixel-heart",
      label: "도트 하트",
      group: "pixel",
      ...sprite([
        ".kkk...kkk.",
        "kPPPk.kPPPk",
        "kPwwPkPPPPk",
        "kPwPPPPPPPk",
        "kPPPPPPPPPk",
        ".kPPPPPPPk.",
        "..kPPPPPk..",
        "...kPPPk...",
        "....kPk....",
        ".....k.....",
      ]),
    },
    {
      id: "pixel-sparkle",
      label: "도트 반짝이",
      group: "pixel",
      ...sprite([
        ".....k.....",
        "....kyk....",
        "....kyk....",
        "...kywyk...",
        ".kkywwwykk.",
        "kyywwwwwyyk",
        ".kkywwwykk.",
        "...kywyk...",
        "....kyk....",
        "....kyk....",
        ".....k.....",
      ]),
    },
  ];
})();
