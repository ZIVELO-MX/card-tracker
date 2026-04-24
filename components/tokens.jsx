// Stickio — design tokens
const SK = {
  // Surfaces
  bg: '#0A1628',
  bgSoft: '#0D1E35',
  surface: '#152238',
  surfaceHi: '#1A2B45',
  border: '#1E3A5F',
  // Accents
  gold: '#F5B841',
  goldDeep: '#D99A28',
  green: '#00C853',
  coral: '#FF5A5F',
  // Text
  text: '#F5F5F5',
  textMute: '#8A95A8',
  textDim: '#5A6778',
  // Fonts
  fHead: '"Archivo Narrow", "Arial Narrow", sans-serif',
  fBody: '"DM Sans", ui-sans-serif, sans-serif',
  fMono: '"JetBrains Mono", ui-monospace, monospace',
};

// Subtle hex pattern as background
const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg width='56' height='64' viewBox='0 0 56 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230F1F35' stroke-width='1'%3E%3Cpath d='M28 1L54 16v32L28 63 2 48V16z'/%3E%3Cpath d='M28 17L42 25v16L28 49 14 41V25z'/%3E%3C/g%3E%3C/svg%3E")`;

// 48 countries organized by group — public domain references only
const COUNTRIES = [
  // Group A
  { code: 'MX',  name: 'México',          flag: '🇲🇽', total: 20, have: 18, color: '#006847', group: 'A', dial: 52  },
  { code: 'ZA',  name: 'South Africa',    flag: '🇿🇦', total: 20, have: 4,  color: '#007A4D', group: 'A', dial: 27  },
  { code: 'KR',  name: 'Korea Republic',  flag: '🇰🇷', total: 20, have: 8,  color: '#CD2E3A', group: 'A', dial: 82  },
  { code: 'CZ',  name: 'Czechia',         flag: '🇨🇿', total: 20, have: 6,  color: '#D7141A', group: 'A', dial: 420 },
  // Group B
  { code: 'CA',  name: 'Canada',          flag: '🇨🇦', total: 20, have: 10, color: '#FF0000', group: 'B', dial: 1   },
  { code: 'BA',  name: 'Bosnia Herz.',    flag: '🇧🇦', total: 20, have: 3,  color: '#002395', group: 'B', dial: 387 },
  { code: 'QA',  name: 'Qatar',           flag: '🇶🇦', total: 20, have: 7,  color: '#8D1B3D', group: 'B', dial: 974 },
  { code: 'CH',  name: 'Switzerland',     flag: '🇨🇭', total: 20, have: 9,  color: '#D52B1E', group: 'B', dial: 41  },
  // Group C
  { code: 'BR',  name: 'Brasil',          flag: '🇧🇷', total: 20, have: 16, color: '#009C3B', group: 'C', dial: 55  },
  { code: 'MA',  name: 'Morocco',         flag: '🇲🇦', total: 20, have: 12, color: '#C1272D', group: 'C', dial: 212 },
  { code: 'HT',  name: 'Haiti',           flag: '🇭🇹', total: 20, have: 2,  color: '#00209F', group: 'C', dial: 509 },
  { code: 'SCO', name: 'Scotland',        flag: '🏴󠁧󠁢󠁳󠁣󠁿', total: 20, have: 5,  color: '#0065BF', group: 'C', dial: 44  },
  // Group D
  { code: 'US',  name: 'United States',   flag: '🇺🇸', total: 20, have: 11, color: '#3C3B6E', group: 'D', dial: 1   },
  { code: 'PY',  name: 'Paraguay',        flag: '🇵🇾', total: 20, have: 6,  color: '#D52B1E', group: 'D', dial: 595 },
  { code: 'AU',  name: 'Australia',       flag: '🇦🇺', total: 20, have: 8,  color: '#00843D', group: 'D', dial: 61  },
  { code: 'TR',  name: 'Türkiye',         flag: '🇹🇷', total: 20, have: 7,  color: '#E30A17', group: 'D', dial: 90  },
  // Group E
  { code: 'DE',  name: 'Alemania',        flag: '🇩🇪', total: 20, have: 7,  color: '#DD0000', group: 'E', dial: 49  },
  { code: 'CI',  name: "Côte d'Ivoire",   flag: '🇨🇮', total: 20, have: 5,  color: '#F77F00', group: 'E', dial: 225 },
  { code: 'EC',  name: 'Ecuador',         flag: '🇪🇨', total: 20, have: 9,  color: '#FFD100', group: 'E', dial: 593 },
  { code: 'CW',  name: 'Curaçao',         flag: '🇨🇼', total: 20, have: 3,  color: '#003DA5', group: 'E', dial: 599 },
  // Group F
  { code: 'NL',  name: 'Netherlands',     flag: '🇳🇱', total: 20, have: 13, color: '#FF6B00', group: 'F', dial: 31  },
  { code: 'JP',  name: 'Japan',           flag: '🇯🇵', total: 20, have: 10, color: '#BC002D', group: 'F', dial: 81  },
  { code: 'SE',  name: 'Sweden',          flag: '🇸🇪', total: 20, have: 8,  color: '#006AA7', group: 'F', dial: 46  },
  { code: 'TN',  name: 'Tunisia',         flag: '🇹🇳', total: 20, have: 4,  color: '#E70013', group: 'F', dial: 216 },
  // Group G
  { code: 'BE',  name: 'Belgium',         flag: '🇧🇪', total: 20, have: 11, color: '#F8C300', group: 'G', dial: 32  },
  { code: 'EG',  name: 'Egypt',           flag: '🇪🇬', total: 20, have: 6,  color: '#CE1126', group: 'G', dial: 20  },
  { code: 'IR',  name: 'Iran',            flag: '🇮🇷', total: 20, have: 4,  color: '#239F40', group: 'G', dial: 98  },
  { code: 'NZ',  name: 'New Zealand',     flag: '🇳🇿', total: 20, have: 2,  color: '#00247D', group: 'G', dial: 64  },
  // Group H
  { code: 'ES',  name: 'España',          flag: '🇪🇸', total: 20, have: 11, color: '#C60B1E', group: 'H', dial: 34  },
  { code: 'CV',  name: 'Cabo Verde',      flag: '🇨🇻', total: 20, have: 3,  color: '#003893', group: 'H', dial: 238 },
  { code: 'SA',  name: 'Saudi Arabia',    flag: '🇸🇦', total: 20, have: 5,  color: '#006C35', group: 'H', dial: 966 },
  { code: 'UY',  name: 'Uruguay',         flag: '🇺🇾', total: 20, have: 3,  color: '#74ACDF', group: 'H', dial: 598 },
  // Group I
  { code: 'FR',  name: 'Francia',         flag: '🇫🇷', total: 20, have: 9,  color: '#0055A4', group: 'I', dial: 33  },
  { code: 'SN',  name: 'Senegal',         flag: '🇸🇳', total: 20, have: 7,  color: '#00853F', group: 'I', dial: 221 },
  { code: 'IQ',  name: 'Iraq',            flag: '🇮🇶', total: 20, have: 2,  color: '#007A3D', group: 'I', dial: 964 },
  { code: 'NO',  name: 'Norway',          flag: '🇳🇴', total: 20, have: 6,  color: '#EF2B2D', group: 'I', dial: 47  },
  // Group J
  { code: 'AR',  name: 'Argentina',       flag: '🇦🇷', total: 20, have: 14, color: '#74ACDF', group: 'J', dial: 54  },
  { code: 'DZ',  name: 'Algeria',         flag: '🇩🇿', total: 20, have: 5,  color: '#006233', group: 'J', dial: 213 },
  { code: 'AT',  name: 'Austria',         flag: '🇦🇹', total: 20, have: 7,  color: '#ED2939', group: 'J', dial: 43  },
  { code: 'JO',  name: 'Jordan',          flag: '🇯🇴', total: 20, have: 3,  color: '#007A3D', group: 'J', dial: 962 },
  // Group K
  { code: 'PT',  name: 'Portugal',        flag: '🇵🇹', total: 20, have: 5,  color: '#046A38', group: 'K', dial: 351 },
  { code: 'CD',  name: 'DR Congo',        flag: '🇨🇩', total: 20, have: 4,  color: '#007FFF', group: 'K', dial: 243 },
  { code: 'UZ',  name: 'Uzbekistan',      flag: '🇺🇿', total: 20, have: 2,  color: '#1EB53A', group: 'K', dial: 998 },
  { code: 'CO',  name: 'Colombia',        flag: '🇨🇴', total: 20, have: 10, color: '#FCD116', group: 'K', dial: 57  },
  // Group L
  { code: 'GB',  name: 'England',         flag: '🇬🇧', total: 20, have: 13, color: '#CF142B', group: 'L', dial: 44  },
  { code: 'HR',  name: 'Croatia',         flag: '🇭🇷', total: 20, have: 8,  color: '#FF0000', group: 'L', dial: 385 },
  { code: 'GH',  name: 'Ghana',           flag: '🇬🇭', total: 20, have: 6,  color: '#006B3F', group: 'L', dial: 233 },
  { code: 'PA',  name: 'Panama',          flag: '🇵🇦', total: 20, have: 4,  color: '#DA121A', group: 'L', dial: 507 },
];

// Placeholder player silhouettes — abstract geometric only, no real likenesses
const PLAYERS = [
  'Delantero', 'Portero', 'Defensor', 'Mediocampista', 'Extremo',
  'Central', 'Lateral', 'Volante', 'Capitán', 'Reserva',
];

Object.assign(window, { SK, HEX_PATTERN, COUNTRIES, PLAYERS });
