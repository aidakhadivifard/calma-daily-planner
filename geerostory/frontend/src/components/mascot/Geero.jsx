const PALETTE = {
  body: '#faa83a',
  bodyMid: '#f5a02f',
  bodyDark: '#e08624',
  bodyLight: '#ffc868',
  spot: '#c4691b',
  belly: '#fff3da',
  hoof: '#9c5c1c',
  ink: '#3a2a1a',
};

function Ossicones() {
  return (
    <g>
      <rect x="98" y="26" width="13" height="30" rx="6.5" fill={PALETTE.body} />
      <rect x="129" y="26" width="13" height="30" rx="6.5" fill={PALETTE.body} />
      <circle cx="104.5" cy="24" r="10" fill={PALETTE.spot} />
      <circle cx="135.5" cy="24" r="10" fill={PALETTE.spot} />
    </g>
  );
}

function Ears() {
  return (
    <g>
      <ellipse
        cx="64"
        cy="62"
        rx="19"
        ry="27"
        fill={PALETTE.bodyLight}
        transform="rotate(-25 64 62)"
      />
      <ellipse
        cx="67"
        cy="64"
        rx="9"
        ry="15"
        fill={PALETTE.belly}
        transform="rotate(-25 67 64)"
      />
      <ellipse
        cx="176"
        cy="62"
        rx="19"
        ry="27"
        fill={PALETTE.bodyLight}
        transform="rotate(25 176 62)"
      />
      <ellipse
        cx="173"
        cy="64"
        rx="9"
        ry="15"
        fill={PALETTE.belly}
        transform="rotate(25 173 64)"
      />
    </g>
  );
}

function HeadSpots() {
  return (
    <g fill={PALETTE.spot} opacity="0.85">
      <ellipse cx="86" cy="60" rx="7" ry="6" transform="rotate(-10 86 60)" />
      <ellipse cx="158" cy="58" rx="6" ry="5" transform="rotate(15 158 58)" />
      <ellipse cx="150" cy="100" rx="5" ry="4.5" />
    </g>
  );
}

function Snout() {
  return (
    <g>
      <ellipse cx="120" cy="118" rx="34" ry="25" fill={PALETTE.belly} />
      <ellipse cx="110" cy="118" rx="3.2" ry="4.2" fill={PALETTE.spot} />
      <ellipse cx="130" cy="118" rx="3.2" ry="4.2" fill={PALETTE.spot} />
    </g>
  );
}

function Blush() {
  return (
    <g fill={PALETTE.bodyDark} opacity="0.45">
      <ellipse cx="80" cy="112" rx="8" ry="5" />
      <ellipse cx="160" cy="112" rx="8" ry="5" />
    </g>
  );
}

/* ---------------- Faces ---------------- */

function FaceHappy() {
  return (
    <g>
      <ellipse cx="100" cy="84" rx="14" ry="16" fill="#fffaf0" />
      <ellipse cx="140" cy="84" rx="14" ry="16" fill="#fffaf0" />
      <circle cx="103" cy="87" r="6.5" fill={PALETTE.ink} />
      <circle cx="137" cy="87" r="6.5" fill={PALETTE.ink} />
      <circle cx="100.5" cy="83" r="2" fill="#fff" />
      <circle cx="134.5" cy="83" r="2" fill="#fff" />
      <Blush />
      <path
        d="M100 134 Q120 152 140 134"
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function FaceCheer() {
  return (
    <g>
      <path d="M88 80 Q100 66 112 80" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M128 80 Q140 66 152 80" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <Blush />
      <path
        d="M99 130 Q120 158 141 130 Q120 144 99 130 Z"
        fill={PALETTE.ink}
      />
      <ellipse cx="120" cy="140" rx="11" ry="6" fill="#ff9d8a" />
    </g>
  );
}

function FaceWink() {
  return (
    <g>
      <path d="M88 86 Q100 96 112 86" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="140" cy="84" rx="14" ry="16" fill="#fffaf0" />
      <circle cx="137" cy="87" r="6.5" fill={PALETTE.ink} />
      <circle cx="134.5" cy="83" r="2" fill="#fff" />
      <Blush />
      <path
        d="M99 132 Q120 154 141 132 Q120 146 99 132 Z"
        fill={PALETTE.ink}
      />
    </g>
  );
}

function FaceContent() {
  return (
    <g>
      <path d="M87 86 Q100 74 113 86" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M127 86 Q140 74 153 86" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <Blush />
      <path
        d="M103 132 Q120 144 137 132"
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function FaceThinking() {
  return (
    <g>
      <path d="M86 78 Q100 70 114 78" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="140" cy="86" rx="13" ry="15" fill="#fffaf0" />
      <circle cx="143" cy="84" r="6" fill={PALETTE.ink} />
      <circle cx="141" cy="81" r="1.8" fill="#fff" />
      <ellipse cx="100" cy="88" rx="13" ry="6" fill="#fffaf0" />
      <Blush />
      <path
        d="M106 132 Q120 140 134 134"
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function FaceSad() {
  return (
    <g>
      <path d="M86 74 Q99 68 114 78" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M126 78 Q141 68 154 74" fill="none" stroke={PALETTE.ink} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="100" cy="90" rx="13" ry="14" fill="#fffaf0" />
      <ellipse cx="140" cy="90" rx="13" ry="14" fill="#fffaf0" />
      <circle cx="100" cy="94" r="6" fill={PALETTE.ink} />
      <circle cx="140" cy="94" r="6" fill={PALETTE.ink} />
      <circle cx="98" cy="91" r="1.8" fill="#fff" />
      <circle cx="138" cy="91" r="1.8" fill="#fff" />
      <ellipse cx="166" cy="98" rx="4" ry="6" fill="#bfe3ff" opacity="0.85" />
      <path
        d="M104 140 Q120 130 136 140"
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ---------------- Body parts ---------------- */

function Head({ children, spots = true }) {
  return (
    <g>
      <Ears />
      <Ossicones />
      <ellipse cx="120" cy="94" rx="58" ry="54" fill={PALETTE.body} />
      {spots && <HeadSpots />}
      <Snout />
      {children}
    </g>
  );
}

function TorsoStanding() {
  return (
    <g>
      <rect x="72" y="150" width="96" height="84" rx="38" fill={PALETTE.bodyMid} />
      <ellipse cx="120" cy="196" rx="30" ry="36" fill={PALETTE.belly} />
      <ellipse cx="84" cy="168" rx="8" ry="6" fill={PALETTE.spot} opacity="0.85" transform="rotate(-15 84 168)" />
      <ellipse cx="158" cy="218" rx="7" ry="5.5" fill={PALETTE.spot} opacity="0.85" />
    </g>
  );
}

function LegsStanding() {
  return (
    <g>
      <rect x="88" y="222" width="20" height="44" rx="10" fill={PALETTE.bodyDark} />
      <rect x="132" y="222" width="20" height="44" rx="10" fill={PALETTE.bodyDark} />
      <ellipse cx="98" cy="268" rx="15" ry="8" fill={PALETTE.hoof} />
      <ellipse cx="142" cy="268" rx="15" ry="8" fill={PALETTE.hoof} />
    </g>
  );
}

function TorsoSitting() {
  return (
    <g>
      <rect x="66" y="158" width="108" height="78" rx="36" fill={PALETTE.bodyMid} />
      <ellipse cx="120" cy="200" rx="32" ry="34" fill={PALETTE.belly} />
      <ellipse cx="82" cy="174" rx="8" ry="6" fill={PALETTE.spot} opacity="0.85" transform="rotate(-15 82 174)" />
    </g>
  );
}

function LegsSitting() {
  return (
    <g>
      <ellipse cx="84" cy="252" rx="30" ry="18" fill={PALETTE.bodyDark} transform="rotate(-8 84 252)" />
      <ellipse cx="158" cy="252" rx="30" ry="18" fill={PALETTE.bodyDark} transform="rotate(8 158 252)" />
      <ellipse cx="58" cy="258" rx="14" ry="9" fill={PALETTE.hoof} />
      <ellipse cx="184" cy="258" rx="14" ry="9" fill={PALETTE.hoof} />
    </g>
  );
}

function ArmRaised() {
  return (
    <g transform="rotate(-62 166 168)">
      <rect x="157" y="166" width="18" height="56" rx="9" fill={PALETTE.bodyDark} />
      <circle cx="166" cy="228" r="12" fill={PALETTE.body} />
    </g>
  );
}

function ArmDown({ side = 'left' }) {
  const x = side === 'left' ? 64 : 158;
  const cx = side === 'left' ? 73 : 167;
  return (
    <g>
      <rect x={x} y="160" width="18" height="56" rx="9" fill={PALETTE.bodyDark} />
      <circle cx={cx} cy="222" r="11" fill={PALETTE.body} />
    </g>
  );
}

function ArmsCrossed() {
  return (
    <g>
      <rect x="78" y="158" width="84" height="16" rx="8" fill={PALETTE.bodyDark} transform="rotate(14 120 166)" />
      <rect x="78" y="178" width="84" height="16" rx="8" fill={PALETTE.bodyDark} transform="rotate(-14 120 186)" />
      <circle cx="84" cy="172" r="11" fill={PALETTE.body} />
      <circle cx="156" cy="190" r="11" fill={PALETTE.body} />
    </g>
  );
}

function ArmChin() {
  return (
    <g>
      <g transform="rotate(-95 162 178)">
        <rect x="153" y="176" width="17" height="50" rx="8.5" fill={PALETTE.bodyDark} />
        <circle cx="162" cy="230" r="11" fill={PALETTE.body} />
      </g>
      <rect x="66" y="180" width="50" height="16" rx="8" fill={PALETTE.bodyDark} />
      <circle cx="68" cy="188" r="11" fill={PALETTE.body} />
    </g>
  );
}

function ArmsHoldingBook() {
  return (
    <g>
      <rect x="64" y="182" width="56" height="16" rx="8" fill={PALETTE.bodyDark} transform="rotate(-6 92 190)" />
      <rect x="120" y="182" width="56" height="16" rx="8" fill={PALETTE.bodyDark} transform="rotate(6 148 190)" />
      <g transform="translate(120 178) rotate(-3 0 0)">
        <rect x="-34" y="0" width="68" height="46" rx="4" fill="#fbeed2" />
        <rect x="-34" y="0" width="33" height="46" rx="4" fill="#f3dcb4" />
        <rect x="-1.5" y="2" width="3" height="42" fill="#caa776" />
        <line x1="-26" y1="12" x2="-8" y2="12" stroke="#caa776" strokeWidth="2" strokeLinecap="round" />
        <line x1="-26" y1="20" x2="-8" y2="20" stroke="#caa776" strokeWidth="2" strokeLinecap="round" />
        <line x1="-26" y1="28" x2="-8" y2="28" stroke="#caa776" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="12" x2="26" y2="12" stroke="#e3c294" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="20" x2="26" y2="20" stroke="#e3c294" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="28" x2="26" y2="28" stroke="#e3c294" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Balloons() {
  return (
    <g>
      <path d="M168 188 C 150 150, 150 90, 168 56" fill="none" stroke="#d8c9ff" strokeWidth="2.5" opacity="0.8" />
      <path d="M178 190 C 178 150, 196 100, 196 60" fill="none" stroke="#d8c9ff" strokeWidth="2.5" opacity="0.8" />
      <path d="M158 188 C 140 158, 134 110, 142 70" fill="none" stroke="#d8c9ff" strokeWidth="2.5" opacity="0.8" />
      <ellipse cx="142" cy="48" rx="22" ry="27" fill="#9ad6ff" transform="rotate(-12 142 48)" />
      <ellipse cx="196" cy="46" rx="22" ry="27" fill="#ffd166" transform="rotate(10 196 46)" />
      <ellipse cx="170" cy="30" rx="23" ry="28" fill="#ff9dc4" transform="rotate(-2 170 30)" />
      <ellipse cx="134" cy="40" rx="6" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-12 134 40)" />
      <ellipse cx="188" cy="38" rx="6" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(10 188 38)" />
      <ellipse cx="162" cy="22" rx="6" ry="8" fill="#ffffff" opacity="0.35" />
    </g>
  );
}

const POSES = {
  wave: () => (
    <>
      <LegsStanding />
      <TorsoStanding />
      <ArmDown side="left" />
      <ArmRaised />
      <Head>
        <FaceHappy />
      </Head>
    </>
  ),
  wink: () => (
    <>
      <LegsStanding />
      <TorsoStanding />
      <ArmDown side="left" />
      <ArmRaised />
      <Head>
        <FaceWink />
      </Head>
    </>
  ),
  cheer: () => (
    <>
      <LegsStanding />
      <TorsoStanding />
      <ArmRaised />
      <g transform="scale(-1,1) translate(-240,0)">
        <ArmRaised />
      </g>
      <Head>
        <FaceCheer />
      </Head>
    </>
  ),
  balloons: () => (
    <>
      <LegsStanding />
      <Balloons />
      <TorsoStanding />
      <ArmDown side="left" />
      <ArmDown side="right" />
      <Head>
        <FaceCheer />
      </Head>
    </>
  ),
  book: () => (
    <>
      <LegsSitting />
      <TorsoSitting />
      <ArmsHoldingBook />
      <Head>
        <FaceContent />
      </Head>
    </>
  ),
  thinking: () => (
    <>
      <LegsSitting />
      <TorsoSitting />
      <ArmChin />
      <Head>
        <FaceThinking />
      </Head>
    </>
  ),
  sad: () => (
    <>
      <LegsStanding />
      <TorsoStanding />
      <ArmsCrossed />
      <Head>
        <FaceSad />
      </Head>
    </>
  ),
};

export default function Geero({ pose = 'wave', size = 160, className = '' }) {
  const render = POSES[pose] || POSES.wave;
  return (
    <svg
      viewBox="0 0 240 280"
      width={size}
      height={(size * 280) / 240}
      className={className}
      role="img"
      aria-label="Geero the giraffe"
    >
      {render()}
    </svg>
  );
}

export { PALETTE as GEERO_PALETTE };
