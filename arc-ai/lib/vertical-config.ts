export const VERTICAL_ICONS: Record<string, string> = {
  ecommerce: "🛒",
  hospital:  "🏥",
  bank:      "🏦",
  hr:        "👥",
  ngo:       "🌍",
  school:    "🏫",
  custom:    "🗄️",
};

export const VERTICAL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  ecommerce: { bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700"  },
  hospital:  { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700"    },
  bank:      { bg: "bg-green-50",   border: "border-green-200",   text: "text-green-700"   },
  hr:        { bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-700"  },
  ngo:       { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700"    },
  school:    { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700"  },
  custom:    { bg: "bg-gray-50",    border: "border-gray-200",    text: "text-gray-700"    },
};

export const RISK_COLORS: Record<string, string> = {
  low:      "bg-green-100 text-green-800",
  medium:   "bg-yellow-100 text-yellow-800",
  high:     "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};
