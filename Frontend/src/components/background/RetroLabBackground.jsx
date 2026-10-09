import './RetroLabBackground.css'

/**
 * XYNTRA retro-tech environment, rebuilt from native SVG shapes.
 * No source bitmap is used. The illustration is scalable and can be recolored
 * by editing the SVG palette, patterns, gradients, and individual components.
 */
export default function RetroLabBackground() {
  return (
    <div className="retro-lab-background" aria-hidden="true">
      <svg
        className="retro-lab-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          <linearGradient id="lab-wall" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#17130f" />
            <stop offset="0.48" stopColor="#090a09" />
            <stop offset="1" stopColor="#21170f" />
          </linearGradient>
          <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dec39a" />
            <stop offset="0.55" stopColor="#b99b73" />
            <stop offset="1" stopColor="#7f654b" />
          </linearGradient>
          <linearGradient id="red-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ec3149" />
            <stop offset="0.55" stopColor="#b4142a" />
            <stop offset="1" stopColor="#68101b" />
          </linearGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7e674e" />
            <stop offset="0.18" stopColor="#302820" />
            <stop offset="0.62" stopColor="#181716" />
            <stop offset="1" stopColor="#59432f" />
          </linearGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="0.1" y2="1">
            <stop offset="0" stopColor="#050706" />
            <stop offset="0.7" stopColor="#151613" />
            <stop offset="1" stopColor="#030403" />
          </linearGradient>
          <linearGradient id="desk-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#94704a" />
            <stop offset="0.2" stopColor="#4b3523" />
            <stop offset="1" stopColor="#17120d" />
          </linearGradient>
          <radialGradient id="lamp-glow">
            <stop offset="0" stopColor="#ffe2a4" stopOpacity="0.45" />
            <stop offset="0.35" stopColor="#ffad50" stopOpacity="0.13" />
            <stop offset="1" stopColor="#ff982e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="center-vignette">
            <stop offset="0" stopColor="#0a0a08" />
            <stop offset="0.7" stopColor="#0d0c0a" />
            <stop offset="1" stopColor="#030404" />
          </radialGradient>
          <pattern id="halftone" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.7" fill="#edc99b" opacity="0.85" />
            <circle cx="7.5" cy="7.5" r="1.7" fill="#edc99b" opacity="0.55" />
          </pattern>
          <pattern id="small-dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.15" fill="#dcb583" />
          </pattern>
          <pattern id="checker" width="36" height="36" patternUnits="userSpaceOnUse">
            <rect width="36" height="36" fill="#d8c09b" />
            <rect width="18" height="18" fill="#11100e" />
            <rect x="18" y="18" width="18" height="18" fill="#11100e" />
          </pattern>
          <pattern id="scanlines" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="1" fill="#f4cf9c" opacity="0.12" />
          </pattern>
          <filter id="distressed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="17" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono" result="grain">
              <feFuncA type="table" tableValues="0 0.16" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="grain" mode="screen" />
          </filter>
          <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="lamp-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id="panel-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
            <feOffset dy="8" result="offset" />
            <feComponentTransfer><feFuncA type="linear" slope="0.6" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="left-monitor-screen"><rect x="15" y="91" width="129" height="118" rx="4" /></clipPath>
          <clipPath id="main-left-screen"><path d="M18 520 L154 497 L172 624 L33 640 Z" /></clipPath>
          <clipPath id="center-zone"><path d="M505 0 H1093 L1074 705 L565 807 L476 684 Z" /></clipPath>
          <g id="led-row">
            <circle cx="0" cy="0" r="2.5" fill="#ffb14e" />
            <circle cx="12" cy="0" r="2.5" fill="#b72a27" />
            <circle cx="24" cy="0" r="2.5" fill="#eac78c" />
            <circle cx="36" cy="0" r="2.5" fill="#70452d" />
          </g>
          <g id="vent-row" stroke="#a48a6a" strokeWidth="1.5" opacity="0.7">
            <path d="M0 0 H54 M0 5 H54 M0 10 H54 M0 15 H54" />
          </g>
          <g id="knob">
            <circle r="8" fill="#090a09" stroke="#a88a61" strokeWidth="1.5" />
            <circle r="5" fill="#393024" stroke="#181512" strokeWidth="1" />
            <path d="M0 -5 V-2" stroke="#e8c394" strokeWidth="1.5" />
          </g>
          <g id="mini-monitor">
            <rect width="100" height="70" rx="4" fill="#201c17" stroke="#a58b67" strokeWidth="2" />
            <rect x="7" y="7" width="86" height="48" fill="url(#screen)" stroke="#604d37" strokeWidth="2" />
            <rect x="10" y="10" width="80" height="42" fill="url(#scanlines)" opacity="0.55" />
            <circle cx="13" cy="62" r="2" fill="#e4a24c" />
            <path d="M34 58 H77" stroke="#68533c" strokeWidth="2" />
          </g>
        </defs>

        {/* WALL AND DISTRESSED PAPER COLLAGE */}
        <rect width="1600" height="900" fill="url(#lab-wall)" />
        <path d="M0 0H647L621 143L483 206L452 327L530 430L467 559L576 691L535 900H0Z" fill="#17120f" />
        <path d="M0 0H168L216 51L270 0H358L318 112L205 176L0 139Z" fill="url(#red-paper)" />
        <path d="M283 0H629L602 74L563 140L495 157L467 236L390 205L362 132L307 103Z" fill="url(#paper)" />
        <path d="M0 75L88 55L151 118L249 112L298 178L244 222L156 206L113 252L0 226Z" fill="url(#checker)" opacity="0.94" />
        <path d="M189 0L256 0L287 89L272 145L228 162L205 95Z" fill="#13110e" />
        <path d="M370 0L403 0L431 112L405 151L381 100Z" fill="#c7a982" />
        <path d="M429 0H502L532 81L487 118L449 92Z" fill="#0c0d0b" />
        <path d="M516 0L623 0L652 92L613 156L561 131Z" fill="#c2a17a" />
        <path d="M1050 0H1310L1343 66L1289 120L1200 118L1165 170L1077 135Z" fill="url(#paper)" />
        <path d="M1115 0H1285L1337 55L1315 108L1244 78L1201 128L1159 88Z" fill="url(#checker)" />
        <path d="M1318 0H1457L1433 78L1483 126L1432 190L1336 157L1299 77Z" fill="url(#red-paper)" />
        <path d="M1451 0H1600V189L1548 208L1492 170L1470 83Z" fill="#0d0d0c" />
        <path d="M1370 190L1459 147L1512 216L1479 298L1401 303L1350 247Z" fill="url(#paper)" />
        <path d="M1102 120L1182 102L1235 173L1214 244L1134 253L1080 207Z" fill="url(#checker)" />
        <path d="M1239 0L1275 4L1295 54L1261 88L1242 48Z" fill="#10100e" />
        <path d="M0 277L104 250L182 285L169 353L81 375L0 350Z" fill="url(#paper)" />
        <path d="M0 280L91 255L125 293L89 326L0 319Z" fill="url(#checker)" opacity="0.8" />
        <path d="M448 388L493 368L535 393L520 454L480 481L442 448Z" fill="url(#red-paper)" />
        <path d="M1179 307L1250 282L1308 325L1281 392L1208 413L1155 369Z" fill="url(#red-paper)" />
        <path d="M1051 612L1141 591L1191 641L1164 708L1097 728L1043 682Z" fill="url(#checker)" />
        <path d="M0 715L118 693L201 730L188 818L96 848L0 815Z" fill="url(#red-paper)" />
        <path d="M551 747L660 763L705 811L684 900H511L535 841Z" fill="url(#paper)" />
        <path d="M771 797L918 763L1044 798L1064 900H785Z" fill="url(#red-paper)" />
        <path d="M1314 736L1418 716L1502 767L1485 846L1390 877L1328 820Z" fill="url(#paper)" />

        {/* SCREENPRINTED MAPS, DOCUMENTS AND HALFTONE */}
        <g opacity="0.72" filter="url(#distressed)">
          <path d="M290 8L601 0L578 86L529 96L511 130L447 143L419 100L363 82L335 45Z" fill="url(#halftone)" />
          <path d="M1081 92L1281 76L1304 201L1245 224L1209 188L1159 206L1108 163Z" fill="url(#halftone)" />
          <path d="M419 254L501 246L526 319L482 345L437 321Z" fill="url(#small-dots)" />
          <path d="M1070 570L1187 555L1215 628L1147 662L1081 630Z" fill="url(#small-dots)" />
          <path d="M527 781L707 788L686 873L555 893L514 835Z" fill="url(#halftone)" />
          <path d="M785 792L1024 789L1058 878L938 898L817 865Z" fill="url(#halftone)" />
        </g>
        <g fill="none" stroke="#1b1814" strokeWidth="2" opacity="0.7">
          <path d="M326 30L549 23L533 58L482 74L462 107L405 113L382 81L336 74Z" />
          <path d="M1110 109L1254 96L1278 184L1216 203L1186 175L1145 185Z" />
          <path d="M1130 126L1248 120M1129 141L1262 135M1132 157L1267 151M1141 174L1251 168" strokeWidth="1" />
          <path d="M295 41L331 36L338 44L312 51ZM359 27L380 23L387 36L364 40ZM412 51L443 44L452 52L423 60Z" />
        </g>
        <g stroke="#271c13" strokeWidth="1" opacity="0.65">
          {Array.from({ length: 10 }, (_, i) => (
            <path key={`mapline-${i}`} d={`M${308 + i * 24} 0 l${-10 + (i % 3) * 4} ${18 + (i % 4) * 5}`} />
          ))}
        </g>

        {/* CENTRAL PAINTED VOID: intentionally open for foreground typography */}
        <path d="M511 0H1087L1066 155L1100 237L1069 358L1098 482L1044 574L1062 682L1004 750L859 779L733 755L623 800L548 748L567 661L506 593L534 493L494 410L529 305L491 218L522 132Z" fill="url(#center-vignette)" />
        <g clipPath="url(#center-zone)" opacity="0.34">
          <rect x="485" y="0" width="625" height="820" fill="url(#small-dots)" opacity="0.23" />
          <path d="M500 91L661 22L749 67L716 153L584 194L536 294Z" fill="#050605" />
          <path d="M665 222L760 185L847 232L831 307L743 334L674 296Z" fill="#15120e" />
          <path d="M550 408L647 376L688 433L643 489L558 475Z" fill="#17120d" />
          <path d="M857 400L965 353L1026 408L1009 469L904 489L860 451Z" fill="#15120d" />
          <path d="M655 579L750 548L820 595L796 669L692 691L631 641Z" fill="#11100d" />
          <path d="M918 592L1039 559L1089 621L1043 697L950 705L907 653Z" fill="#18130e" />
          <g fill="none" stroke="#3c2f22" strokeWidth="1">
            <path d="M544 174L686 126L777 147M589 321L696 280L783 302M793 489L900 458L1027 482M594 605L701 571L778 586M815 697L919 670L1038 683" />
            <path d="M552 185L551 226M589 321L575 367M796 490L792 527M698 571L690 609M918 670L913 716" />
          </g>
        </g>
        <g fill="#050605" opacity="0.8">
          <circle cx="735" cy="285" r="7" /><circle cx="748" cy="291" r="3" />
          <circle cx="1008" cy="437" r="4" /><circle cx="582" cy="512" r="5" />
          <circle cx="840" cy="619" r="6" /><circle cx="672" cy="713" r="3" />
          <circle cx="1018" cy="153" r="5" /><circle cx="606" cy="260" r="2.5" />
        </g>

        {/* LEFT WALL RACKS AND OLD ELECTRONICS */}
        <g filter="url(#panel-shadow)">
          {/* Upper-left CRT television */}
          <path d="M-12 48L115 24L181 57L173 235L-9 263Z" fill="url(#metal)" stroke="#8d6c49" strokeWidth="4" />
          <path d="M5 67L111 45L157 68L151 194L7 220Z" fill="#080908" stroke="#b2946a" strokeWidth="3" />
          <path d="M14 79L109 58L145 75L141 181L15 203Z" fill="url(#screen)" />
          <path d="M20 86L103 68L137 82L132 175L21 196Z" fill="url(#scanlines)" opacity="0.6" />
          <path d="M27 98L71 90L88 106L53 122L29 117Z" fill="#c7a57c" opacity="0.14" />
          <path d="M13 234L159 210L172 228L11 255Z" fill="#5c4730" stroke="#a0835c" strokeWidth="2" />
          <circle cx="125" cy="229" r="3" fill="#d0a35e" />
          <circle cx="139" cy="227" r="3" fill="#c4352d" />

          {/* Audio receiver at far left */}
          <path d="M-20 284L119 270L176 294L173 400L-14 420Z" fill="url(#metal)" stroke="#957450" strokeWidth="3" />
          <rect x="1" y="302" width="108" height="72" fill="#090a09" stroke="#806445" strokeWidth="3" />
          <rect x="8" y="309" width="94" height="58" fill="#141411" />
          <use href="#led-row" x="17" y="322" />
          <use href="#led-row" x="17" y="337" />
          <use href="#knob" x="130" y="321" />
          <use href="#knob" x="158" y="321" />
          <path d="M122 350H164M122 358H164M122 366H164M14 390H164" stroke="#9d805c" strokeWidth="2" opacity="0.7" />

          {/* Rack column */}
          <path d="M170 181L302 165L313 492L180 511Z" fill="#2a241c" stroke="#a38661" strokeWidth="3" />
          <rect x="184" y="193" width="114" height="56" fill="#0b0c0a" stroke="#987956" strokeWidth="3" />
          <rect x="192" y="201" width="98" height="35" fill="#11120f" />
          <use href="#vent-row" x="197" y="238" />
          <rect x="183" y="265" width="116" height="66" fill="#171714" stroke="#846b4b" strokeWidth="2" />
          <rect x="193" y="274" width="95" height="36" fill="#070807" stroke="#8c704c" strokeWidth="1" />
          <use href="#led-row" x="196" y="319" />
          <rect x="185" y="347" width="116" height="64" fill="#1c1914" stroke="#806748" strokeWidth="2" />
          <use href="#vent-row" x="197" y="362" />
          <use href="#knob" x="209" y="393" />
          <use href="#knob" x="240" y="393" />
          <use href="#knob" x="271" y="393" />
          <rect x="187" y="428" width="114" height="48" fill="#100f0d" stroke="#8e714d" strokeWidth="2" />
          <use href="#led-row" x="200" y="444" />
          <path d="M199 459H286M199 466H276" stroke="#70583d" strokeWidth="2" />
        </g>

        {/* Lower-left CRT */}
        <g filter="url(#panel-shadow)">
          <path d="M-14 492L155 467L200 488L199 650L-7 682Z" fill="url(#metal)" stroke="#aa8b63" strokeWidth="4" />
          <path d="M13 515L151 493L176 509L177 621L22 648Z" fill="#050706" stroke="#735b3e" strokeWidth="4" />
          <path d="M21 523L145 503L166 515L167 609L29 632Z" fill="url(#screen)" />
          <g clipPath="url(#main-left-screen)">
            <rect x="0" y="490" width="190" height="160" fill="url(#scanlines)" />
            <path d="M0 572L56 540L79 557L46 588L0 602Z" fill="#b6a17d" opacity="0.12" />
            <path d="M59 510L152 500L148 511L87 528Z" fill="#d1a46c" opacity="0.1" />
          </g>
          <path d="M36 654L181 630L200 650L35 679Z" fill="#4f3b28" stroke="#8b6d49" strokeWidth="3" />
          <circle cx="164" cy="653" r="3" fill="#ddaa60" />
        </g>

        {/* LEFT desktop mini equipment */}
        <g>
          <path d="M217 483L351 468L371 490L368 568L230 588Z" fill="#171715" stroke="#947653" strokeWidth="3" />
          <rect x="231" y="495" width="121" height="45" fill="#090a08" stroke="#725a3d" strokeWidth="2" />
          <use href="#led-row" x="243" y="507" />
          <use href="#vent-row" x="244" y="526" />
          <use href="#knob" x="335" y="555" />
          <path d="M245 565H312" stroke="#9a7951" strokeWidth="2" />
          <rect x="387" y="454" width="91" height="101" fill="url(#metal)" stroke="#947653" strokeWidth="3" />
          <rect x="395" y="462" width="75" height="48" fill="#090a08" stroke="#57432e" strokeWidth="2" />
          <use href="#led-row" x="399" y="523" />
          <use href="#vent-row" x="398" y="541" />
          <path d="M395 551H470" stroke="#9a7951" strokeWidth="2" />
        </g>

        {/* RIGHT SIDE CONTROL RACKS */}
        <g filter="url(#panel-shadow)">
          {/* Far-right tall console */}
          <path d="M1459 -12L1607 -5L1615 557L1469 572Z" fill="url(#metal)" stroke="#9b7b55" strokeWidth="4" />
          <rect x="1481" y="20" width="116" height="120" fill="#0c0d0b" stroke="#9e815b" strokeWidth="3" />
          <rect x="1491" y="32" width="96" height="92" fill="#11120f" stroke="#624d34" strokeWidth="2" />
          <use href="#led-row" x="1497" y="131" />
          <rect x="1481" y="158" width="116" height="111" fill="#13130f" stroke="#987a54" strokeWidth="2" />
          <use href="#knob" x="1506" y="185" />
          <use href="#knob" x="1541" y="185" />
          <use href="#knob" x="1576" y="185" />
          <path d="M1490 210H1589M1490 219H1589M1490 228H1589M1490 237H1589" stroke="#9c7b51" strokeWidth="2" />
          <use href="#led-row" x="1495" y="253" />
          <rect x="1482" y="288" width="115" height="104" fill="#171612" stroke="#8c714c" strokeWidth="2" />
          <use href="#vent-row" x="1494" y="307" />
          <use href="#knob" x="1507" y="357" />
          <use href="#knob" x="1541" y="357" />
          <use href="#knob" x="1575" y="357" />
          <use href="#led-row" x="1497" y="383" />
          <rect x="1483" y="409" width="113" height="110" fill="#100f0d" stroke="#90734f" strokeWidth="2" />
          <use href="#led-row" x="1493" y="428" />
          <use href="#knob" x="1510" y="463" />
          <use href="#knob" x="1544" y="463" />
          <use href="#knob" x="1578" y="463" />
          <use href="#vent-row" x="1495" y="491" />

          {/* Middle-right tall cabinet */}
          <path d="M1325 14L1449 5L1468 463L1343 476Z" fill="#201b15" stroke="#927451" strokeWidth="4" />
          <rect x="1343" y="32" width="95" height="74" fill="#090a08" stroke="#90734f" strokeWidth="3" />
          <use href="#knob" x="1362" y="126" />
          <use href="#knob" x="1402" y="126" />
          <path d="M1353 150H1437M1353 160H1437M1353 170H1437M1353 180H1437" stroke="#a38a65" strokeWidth="2" />
          <rect x="1354" y="199" width="83" height="86" fill="#11120f" stroke="#735c40" strokeWidth="2" />
          <use href="#led-row" x="1363" y="299" />
          <use href="#vent-row" x="1361" y="319" />
          <rect x="1356" y="344" width="82" height="85" fill="#100f0d" stroke="#846b49" strokeWidth="2" />
          <use href="#knob" x="1374" y="367" />
          <use href="#knob" x="1410" y="367" />
          <use href="#led-row" x="1367" y="403" />
        </g>

        {/* RIGHT CRT TERMINAL */}
        <g filter="url(#panel-shadow)">
          <path d="M1240 441L1390 419L1432 444L1438 592L1263 614L1238 585Z" fill="url(#metal)" stroke="#b2956d" strokeWidth="4" />
          <path d="M1264 457L1380 441L1408 455L1411 554L1282 574L1260 557Z" fill="#080908" stroke="#846b4b" strokeWidth="3" />
          <path d="M1271 463L1377 449L1399 460L1402 546L1287 562L1270 549Z" fill="url(#screen)" />
          <path d="M1279 476L1362 464L1371 469L1291 483ZM1283 489L1379 476M1285 501L1363 491M1290 517L1385 504" stroke="#a48b64" strokeWidth="1.5" opacity="0.26" />
          <circle cx="1400" cy="573" r="3" fill="#e9a34d" />
          <path d="M1280 585L1407 568L1428 585L1290 604Z" fill="#473523" stroke="#98754e" strokeWidth="2" />
        </g>

        {/* PHONE / HANGING CABLE ON THE RIGHT WALL */}
        <g>
          <path d="M1409 0L1414 32L1425 61" fill="none" stroke="#080908" strokeWidth="7" />
          <path d="M1390 47L1426 41L1439 105L1403 113Z" fill="#090a09" stroke="#6c573d" strokeWidth="3" />
          <path d="M1397 51L1420 47L1425 73L1402 78Z" fill="#201e18" />
          <path d="M1392 115C1372 140 1439 143 1411 166C1383 188 1454 193 1413 216C1394 228 1418 248 1434 239" fill="none" stroke="#0b0c0b" strokeWidth="5" />
        </g>

        {/* HANGING LAMP TOP CENTER */}
        <g>
          <path d="M1001 0L1018 47" stroke="#080807" strokeWidth="9" />
          <path d="M968 45L1042 37L1075 69L1064 82L1009 77L978 65Z" fill="#0b0c0b" stroke="#5a4730" strokeWidth="3" />
          <path d="M979 62L1063 59L1051 76L1001 76Z" fill="#f6c578" />
          <ellipse cx="1028" cy="81" rx="180" ry="92" fill="url(#lamp-glow)" filter="url(#lamp-blur)" />
          <ellipse cx="1025" cy="72" rx="38" ry="7" fill="#ffe5b2" opacity="0.65" filter="url(#soft-glow)" />
        </g>

        {/* LEFT DESK LAMP */}
        <g>
          <path d="M0 429L68 389L123 404L157 447" fill="none" stroke="#080908" strokeWidth="10" />
          <path d="M67 389L95 376L132 391L122 411L86 409Z" fill="#171714" stroke="#6e573a" strokeWidth="3" />
          <path d="M78 393L125 394L108 410L86 407Z" fill="#f0c27a" />
          <ellipse cx="102" cy="423" rx="150" ry="95" fill="url(#lamp-glow)" filter="url(#lamp-blur)" />
        </g>

        {/* DESKS AND WORK SURFACES */}
        <g>
          {/* Left desk top */}
          <path d="M0 686L397 651L625 704L590 741L0 773Z" fill="url(#desk-top)" stroke="#b38b59" strokeWidth="3" />
          <path d="M0 699L395 666L598 710" fill="none" stroke="#d4ab73" strokeWidth="3" opacity="0.65" />
          <path d="M34 730L344 696M78 742L388 709M145 750L450 716M215 758L527 724" stroke="#1a130d" strokeWidth="3" opacity="0.8" />
          <path d="M45 767L51 900M540 741L549 900" stroke="#211810" strokeWidth="23" />
          <path d="M44 786L48 900M540 755L547 900" stroke="#886542" strokeWidth="3" />

          {/* Right desk top */}
          <path d="M1000 684L1262 653L1600 680V756L1236 731L1010 741Z" fill="url(#desk-top)" stroke="#b18b5b" strokeWidth="3" />
          <path d="M1005 693L1261 665L1599 690" fill="none" stroke="#d2a56e" strokeWidth="3" opacity="0.6" />
          <path d="M1051 716L1305 687M1132 729L1391 699M1249 731L1515 704" stroke="#1a120b" strokeWidth="3" opacity="0.8" />
          <path d="M1044 744L1046 900M1550 745L1553 900" stroke="#1d1711" strokeWidth="32" />
          <path d="M1044 755L1046 900M1550 755L1553 900" stroke="#7f6040" strokeWidth="3" />

          {/* Right drawer bank */}
          <path d="M1054 739L1223 727L1226 900H1051Z" fill="#171511" stroke="#806343" strokeWidth="3" />
          {[0, 1, 2, 3].map((n) => (
            <g key={`drawer-${n}`}>
              <path d={`M1064 ${753 + n * 35}L1214 ${744 + n * 35}V${777 + n * 35}L1064 ${786 + n * 35}Z`} fill="#292219" stroke="#715537" strokeWidth="2" />
              <path d={`M1113 ${766 + n * 35}L1164 ${763 + n * 35}`} stroke="#ad8858" strokeWidth="3" />
            </g>
          ))}
          <path d="M1260 748L1410 747L1417 900H1268Z" fill="#100f0d" stroke="#6e573b" strokeWidth="3" />
          <rect x="1280" y="770" width="111" height="101" fill="#0a0b09" stroke="#776042" strokeWidth="2" />
          <circle cx="1336" cy="820" r="27" fill="none" stroke="#5a472f" strokeWidth="4" />
          <circle cx="1336" cy="820" r="12" fill="none" stroke="#8a6a43" strokeWidth="3" />
        </g>

        {/* KEYBOARD, PAPERS AND DESK EQUIPMENT */}
        <g>
          {/* Left keyboard */}
          <path d="M82 687L266 668L338 693L154 718Z" fill="#0a0b09" stroke="#a08259" strokeWidth="3" />
          {Array.from({ length: 4 }, (_, row) => (
            <g key={`key-row-${row}`} transform={`translate(${98 + row * 8} ${683 + row * 7}) skewX(22)`}>
              {Array.from({ length: 11 }, (_, col) => (
                <rect key={`key-${row}-${col}`} x={col * 15} y={row * 3} width="11" height="5" fill={row === 0 && col === 3 ? '#c4a06f' : '#30271c'} stroke="#866b47" strokeWidth="0.55" />
              ))}
            </g>
          ))}
          <path d="M180 710L261 701" stroke="#c9a574" strokeWidth="3" />

          {/* Paper stacks and disk boxes */}
          <path d="M353 656L438 649L472 661L387 670Z" fill="#d1b58b" />
          <path d="M354 650L439 643L473 655L388 664Z" fill="#a98b64" stroke="#1c1711" strokeWidth="2" />
          <path d="M374 639L450 633L477 643L400 650Z" fill="#d4bc96" />
          <path d="M403 627L481 622L501 630L425 637Z" fill="#b59b77" />
          <path d="M361 644L439 638M374 652L453 645" stroke="#51402c" strokeWidth="1.5" />

          {/* Right keyboard */}
          <path d="M1260 669L1417 657L1485 677L1323 695Z" fill="#0a0b09" stroke="#8f714b" strokeWidth="3" />
          {Array.from({ length: 3 }, (_, row) => (
            <g key={`right-key-row-${row}`} transform={`translate(${1276 + row * 10} ${670 + row * 5}) skewX(19)`}>
              {Array.from({ length: 10 }, (_, col) => (
                <rect key={`rkey-${row}-${col}`} x={col * 13} y={row * 3} width="9" height="4" fill="#30271c" stroke="#866b47" strokeWidth="0.55" />
              ))}
            </g>
          ))}

          {/* Right paper/terminal stacks */}
          <path d="M1433 652L1504 647L1537 657L1464 664Z" fill="#c4a37a" />
          <path d="M1438 645L1507 640L1540 650L1468 657Z" fill="#e2c39a" stroke="#282017" strokeWidth="2" />
          <path d="M1441 638L1510 633L1543 643L1471 650Z" fill="#8b6b47" />
          <path d="M1446 631L1515 626L1548 636L1476 643Z" fill="#cdb18a" />
          <path d="M1450 635L1513 631M1455 642L1519 638" stroke="#55402a" strokeWidth="1.5" />
        </g>

        {/* FOREGROUND STOOL / CHAIR SILHOUETTE */}
        <g>
          <path d="M293 900L311 794Q321 738 380 710L452 698Q504 697 552 735L580 779L552 900Z" fill="#080908" stroke="#30271d" strokeWidth="4" />
          <path d="M320 900L342 795Q350 750 392 733L451 718Q491 716 524 749L550 790L527 900Z" fill="#11110f" />
          <path d="M342 802L368 780L405 764L449 761L480 779" fill="none" stroke="#4b3a28" strokeWidth="4" opacity="0.5" />
          <path d="M315 900L331 823M536 900L548 816" stroke="#6d5437" strokeWidth="3" opacity="0.45" />
        </g>

        {/* CABLES / RACK SHADOWS / SMALL TECH DETAILS */}
        <g fill="none" strokeLinecap="round">
          <path d="M286 475C305 519 288 544 314 564S336 607 322 647" stroke="#050605" strokeWidth="5" />
          <path d="M308 476C324 515 310 548 340 569S358 612 345 644" stroke="#785a37" strokeWidth="1.5" />
          <path d="M1438 482C1419 529 1451 560 1431 589S1452 625 1437 657" stroke="#050605" strokeWidth="6" />
          <path d="M1447 491C1434 525 1458 550 1442 581S1460 619 1448 650" stroke="#80603b" strokeWidth="1.3" />
          <path d="M13 442L31 437L42 449L28 459Z" stroke="#b48b5a" strokeWidth="2" />
          <path d="M1534 569L1582 562M1534 577L1582 570M1534 585L1582 578" stroke="#ad8959" strokeWidth="2" />
        </g>

        {/* WARM STATUS LIGHTS */}
        <g>
          {[
            [24, 348], [38, 348], [51, 348], [65, 348], [24, 363], [50, 363],
            [1511, 277], [1532, 277], [1553, 277], [1575, 277], [1510, 399], [1550, 399],
            [1361, 304], [1376, 304], [1402, 304], [219, 324], [239, 324], [260, 324],
          ].map(([x, y], i) => (
            <g key={`status-${i}`}>
              <circle cx={x} cy={y} r="8" fill="#ff8d32" opacity="0.18" filter="url(#soft-glow)" />
              <circle cx={x} cy={y} r="2.6" fill={i % 3 === 0 ? '#ffb84f' : i % 3 === 1 ? '#e44a2e' : '#d5b37d'} />
            </g>
          ))}
        </g>

        {/* LIGHT FALL-OFF AND VINTAGE PRINT DISTRESS */}
        <rect width="1600" height="900" fill="url(#lamp-glow)" opacity="0.1" />
        <rect width="1600" height="900" fill="url(#scanlines)" opacity="0.13" />
        <rect width="1600" height="900" fill="#b99a72" filter="url(#distressed)" opacity="0.09" />
        <rect width="1600" height="900" fill="none" stroke="#030303" strokeWidth="44" opacity="0.58" />
        <rect width="1600" height="900" fill="none" stroke="#d2a56b" strokeWidth="2" opacity="0.14" />
      </svg>
    </div>
  )
}
