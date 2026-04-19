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
  { code: 'MX',  name: 'México',          flag: '🇲🇽', total: 20, have: 18, color: '#006847', group: 'A' },
  { code: 'ZA',  name: 'South Africa',    flag: '🇿🇦', total: 20, have: 4,  color: '#007A4D', group: 'A' },
  { code: 'KR',  name: 'Korea Republic',  flag: '🇰🇷', total: 20, have: 8,  color: '#CD2E3A', group: 'A' },
  { code: 'CZ',  name: 'Czechia',         flag: '🇨🇿', total: 20, have: 6,  color: '#D7141A', group: 'A' },
  // Group B
  { code: 'CA',  name: 'Canada',          flag: '🇨🇦', total: 20, have: 10, color: '#FF0000', group: 'B' },
  { code: 'BA',  name: 'Bosnia Herz.',    flag: '🇧🇦', total: 20, have: 3,  color: '#002395', group: 'B' },
  { code: 'QA',  name: 'Qatar',           flag: '🇶🇦', total: 20, have: 7,  color: '#8D1B3D', group: 'B' },
  { code: 'CH',  name: 'Switzerland',     flag: '🇨🇭', total: 20, have: 9,  color: '#D52B1E', group: 'B' },
  // Group C
  { code: 'BR',  name: 'Brasil',          flag: '🇧🇷', total: 20, have: 16, color: '#009C3B', group: 'C' },
  { code: 'MA',  name: 'Morocco',         flag: '🇲🇦', total: 20, have: 12, color: '#C1272D', group: 'C' },
  { code: 'HT',  name: 'Haiti',           flag: '🇭🇹', total: 20, have: 2,  color: '#00209F', group: 'C' },
  { code: 'SCO', name: 'Scotland',        flag: '🏴󠁧󠁢󠁳󠁣󠁿', total: 20, have: 5,  color: '#0065BF', group: 'C' },
  // Group D
  { code: 'US',  name: 'United States',   flag: '🇺🇸', total: 20, have: 11, color: '#3C3B6E', group: 'D' },
  { code: 'PY',  name: 'Paraguay',        flag: '🇵🇾', total: 20, have: 6,  color: '#D52B1E', group: 'D' },
  { code: 'AU',  name: 'Australia',       flag: '🇦🇺', total: 20, have: 8,  color: '#00843D', group: 'D' },
  { code: 'TR',  name: 'Türkiye',         flag: '🇹🇷', total: 20, have: 7,  color: '#E30A17', group: 'D' },
  // Group E
  { code: 'DE',  name: 'Alemania',        flag: '🇩🇪', total: 20, have: 7,  color: '#DD0000', group: 'E' },
  { code: 'CI',  name: "Côte d'Ivoire",   flag: '🇨🇮', total: 20, have: 5,  color: '#F77F00', group: 'E' },
  { code: 'EC',  name: 'Ecuador',         flag: '🇪🇨', total: 20, have: 9,  color: '#FFD100', group: 'E' },
  { code: 'CW',  name: 'Curaçao',         flag: '🇨🇼', total: 20, have: 3,  color: '#003DA5', group: 'E' },
  // Group F
  { code: 'NL',  name: 'Netherlands',     flag: '🇳🇱', total: 20, have: 13, color: '#FF6B00', group: 'F' },
  { code: 'JP',  name: 'Japan',           flag: '🇯🇵', total: 20, have: 10, color: '#BC002D', group: 'F' },
  { code: 'SE',  name: 'Sweden',          flag: '🇸🇪', total: 20, have: 8,  color: '#006AA7', group: 'F' },
  { code: 'TN',  name: 'Tunisia',         flag: '🇹🇳', total: 20, have: 4,  color: '#E70013', group: 'F' },
  // Group G
  { code: 'BE',  name: 'Belgium',         flag: '🇧🇪', total: 20, have: 11, color: '#F8C300', group: 'G' },
  { code: 'EG',  name: 'Egypt',           flag: '🇪🇬', total: 20, have: 6,  color: '#CE1126', group: 'G' },
  { code: 'IR',  name: 'Iran',            flag: '🇮🇷', total: 20, have: 4,  color: '#239F40', group: 'G' },
  { code: 'NZ',  name: 'New Zealand',     flag: '🇳🇿', total: 20, have: 2,  color: '#00247D', group: 'G' },
  // Group H
  { code: 'ES',  name: 'España',          flag: '🇪🇸', total: 20, have: 11, color: '#C60B1E', group: 'H' },
  { code: 'CV',  name: 'Cabo Verde',      flag: '🇨🇻', total: 20, have: 3,  color: '#003893', group: 'H' },
  { code: 'SA',  name: 'Saudi Arabia',    flag: '🇸🇦', total: 20, have: 5,  color: '#006C35', group: 'H' },
  { code: 'UY',  name: 'Uruguay',         flag: '🇺🇾', total: 20, have: 3,  color: '#74ACDF', group: 'H' },
  // Group I
  { code: 'FR',  name: 'Francia',         flag: '🇫🇷', total: 20, have: 9,  color: '#0055A4', group: 'I' },
  { code: 'SN',  name: 'Senegal',         flag: '🇸🇳', total: 20, have: 7,  color: '#00853F', group: 'I' },
  { code: 'IQ',  name: 'Iraq',            flag: '🇮🇶', total: 20, have: 2,  color: '#007A3D', group: 'I' },
  { code: 'NO',  name: 'Norway',          flag: '🇳🇴', total: 20, have: 6,  color: '#EF2B2D', group: 'I' },
  // Group J
  { code: 'AR',  name: 'Argentina',       flag: '🇦🇷', total: 20, have: 14, color: '#74ACDF', group: 'J' },
  { code: 'DZ',  name: 'Algeria',         flag: '🇩🇿', total: 20, have: 5,  color: '#006233', group: 'J' },
  { code: 'AT',  name: 'Austria',         flag: '🇦🇹', total: 20, have: 7,  color: '#ED2939', group: 'J' },
  { code: 'JO',  name: 'Jordan',          flag: '🇯🇴', total: 20, have: 3,  color: '#007A3D', group: 'J' },
  // Group K
  { code: 'PT',  name: 'Portugal',        flag: '🇵🇹', total: 20, have: 5,  color: '#046A38', group: 'K' },
  { code: 'CD',  name: 'DR Congo',        flag: '🇨🇩', total: 20, have: 4,  color: '#007FFF', group: 'K' },
  { code: 'UZ',  name: 'Uzbekistan',      flag: '🇺🇿', total: 20, have: 2,  color: '#1EB53A', group: 'K' },
  { code: 'CO',  name: 'Colombia',        flag: '🇨🇴', total: 20, have: 10, color: '#FCD116', group: 'K' },
  // Group L
  { code: 'GB',  name: 'England',         flag: '🇬🇧', total: 20, have: 13, color: '#CF142B', group: 'L' },
  { code: 'HR',  name: 'Croatia',         flag: '🇭🇷', total: 20, have: 8,  color: '#FF0000', group: 'L' },
  { code: 'GH',  name: 'Ghana',           flag: '🇬🇭', total: 20, have: 6,  color: '#006B3F', group: 'L' },
  { code: 'PA',  name: 'Panama',          flag: '🇵🇦', total: 20, have: 4,  color: '#DA121A', group: 'L' },
];

// Placeholder player silhouettes — abstract geometric only, no real likenesses
const PLAYERS = [
  'Delantero', 'Portero', 'Defensor', 'Mediocampista', 'Extremo',
  'Central', 'Lateral', 'Volante', 'Capitán', 'Reserva',
];

Object.assign(window, { SK, HEX_PATTERN, COUNTRIES, PLAYERS });
