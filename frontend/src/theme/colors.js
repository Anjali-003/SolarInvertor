const P = {

  // ── Page backgrounds ──────────────────────────────
  bg:              "#FEF9F0",   // main warm cream page background
  bgGradient:      "linear-gradient(160deg, #FFF8EC 0%, #FEF3E2 100%)", // auth page gradient
  surface:         "#FFFFFF",   // card / panel surface
  surfaceWarm:     "#FFFBF2",   // inner metric card warm tint
  surfaceAmber:    "#FFF8E7",   // icon wrap background, stat card icons
  surfaceForm:     "#F2F4F6",   // form input fill (pill inputs)
  surfaceFaded:    "#F0F0F0",   // logo block background, old form inputs
  surfaceLight:    "#F8F8F8",   // very light neutral surface
  surfaceGreen:    "#F0FDF4",   // ON status badge background
  surfaceRed:      "#FEE2E2",   // error / active fault tint background
  surfaceSuccess:  "#DCFCE7",   // success message background
  surfaceAdmin:    "#F4F6F9",   // admin portal page background
  surfaceAdminRow: "#F9FAFB",   // admin table header row
  surfaceHover:    "#FFF7ED",   // admin table row hover

  // ── Borders ───────────────────────────────────────
  border:          "#F0EBE0",   // default warm neutral border
  borderAmber:     "#FDE68A",   // inner metric card border (warm yellow)
  borderStrong:    "#F59E0B",   // parent card outer border (amber)
  borderDark:      "#D97706",   // darker amber border (parent card accent)
  borderOld:       "#F0E0C0",   // legacy warm amber border (kept for compatibility)
  borderGreen:     "#22C55E",   // ON status badge border
  borderError:     "#FECACA",   // error message border
  borderSuccess:   "#BBF7D0",   // success message border
  borderAdmin:     "#E5E7EB",   // admin table row border, card borders
  borderAdminDark: "#D1D5DB",   // admin stronger border

  // ── Text ──────────────────────────────────────────
  textPrimary:     "#1A1A1A",   // darkest — main headings, values, bold labels
  textSecond:      "#4A4A4A",   // secondary dark text
  textMuted:       "#8A8A8A",   // muted gray — descriptions, subtitles
  textLight:       "#AAAAAA",   // light gray — metadata labels (SERIAL NUMBER etc)
  textHint:        "#999999",   // hint / placeholder text
  textAmber:       "#D97706",   // amber — page titles, section headings, field labels
  textAmberBright: "#F59E0B",   // bright amber — icon colors, link colors
  textGreen:       "#22C55E",   // ON status text
  textSuccessMsg:  "#166534",   // success message text
  textErrorMsg:    "#B91C1C",   // error message text
  textAdmin:       "#1F2937",   // admin portal primary text (dark blue-gray)
  textAdminMuted:  "#374151",   // admin table header text
  textAdminGray:   "#6B7280",   // admin subtitle text
  textAdminFaint:  "#9CA3AF",   // admin empty state, mobile table labels
  textAdminSide:   "#BDBDBD",   // sidebar "ADMIN PANEL" label
  textWhite:       "#FFFFFF",   // white text on colored backgrounds
  textOldBrown:    "#2C1A06",   // legacy dark brown (old portal pages)
  textOldSecond:   "#7A5230",   // legacy secondary brown
  textOldMuted:    "#B08050",   // legacy muted brown
  textOldDim:      "#D4AA80",   // legacy dim text

  // ── Brand / Accent ────────────────────────────────
  amber:           "#F59E0B",   // primary amber — icons, badges, borders
  amberDark:       "#D97706",   // darker amber — headings, active nav, chart line
  amberLight:      "#FFB74D",   // lighter amber — gradient start (old pages)
  amberPale:       "#FFE0A3",   // very pale amber
  amberWarm:       "#FFF8EC",   // warm amber background tint
  orange:          "#F97316",   // orange — gradient end
  orangeDark:      "#EA580C",   // darker orange — admin active sidebar gradient end

  // ── Button gradients ──────────────────────────────
  btnPrimary:      "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",  // main CTA
  btnAdmin:        "linear-gradient(135deg, #F59E0B, #EA580C)",           // admin active link
  btnGreen:        "linear-gradient(135deg, #10B981, #059669)",           // approve button
  btnRed:          "linear-gradient(135deg, #EF4444, #DC2626)",           // reject / logout

  // ── Semantic ──────────────────────────────────────
  green:           "#22C55E",   // success / normal / ON status
  greenDark:       "#16A34A",   // darker green
  red:             "#EF4444",   // fault / error (bold)
  redDark:         "#DC2626",   // darker red
  redLogout:       "#C0392B",   // logout button deep red
  errorRed:        "#B91C1C",   // error text (dark red)

  // ── Admin sidebar ─────────────────────────────────
  sidebarBg:       "#1F2937",   // sidebar / bottom nav background
  sidebarText:     "#374151",   // admin table header color
  sidebarFaint:    "#111827",   // deepest admin dark

  // ── Shadows (as strings) ──────────────────────────
  shadowCard:      "0 2px 8px rgba(0,0,0,0.06)",
  shadowCardAmber: "0 2px 12px rgba(245,158,11,0.10)",
  shadowCardLg:    "0 8px 32px rgba(245,158,11,0.08), 0 2px 8px rgba(0,0,0,0.06)",
  shadowBtn:       "0 4px 14px rgba(249,115,22,0.35)",
  shadowBtnRed:    "0 4px 14px rgba(192,57,43,0.35)",
  shadowNav:       "0 -2px 12px rgba(0,0,0,0.08)",
  shadowAdminNav:  "0 -4px 16px rgba(0,0,0,0.2)",
};

export default P;