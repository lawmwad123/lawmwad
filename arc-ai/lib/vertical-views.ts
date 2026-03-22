/** Per-vertical entity definitions powering the system UI left panel. */

export type ColType =
  | "text"
  | "number"
  | "currency"       // formatted as $X,XXX.XX
  | "date"           // formatted as MMM D, YYYY
  | "badge"          // coloured pill based on value
  | "boolean"        // Yes / No
  | "id";            // monospace, truncated

export interface ColDef {
  key:     string;
  label:   string;
  type:    ColType;
  /** For badge cols: map value → colour class */
  badges?: Record<string, string>;
  width?:  string;   // Tailwind w-* class override
  /** True if this column holds the primary display name of a row */
  primary?: boolean;
}

export interface EntityView {
  id:          string;
  label:       string;
  icon:        string;
  /** Raw SQL — must be a SELECT, uses schema.table notation */
  sql:         string;
  columns:     ColDef[];
  /** action_types that should trigger a data refresh */
  refreshOn:   string[];
  emptyLabel:  string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge maps (shared across verticals)
// ─────────────────────────────────────────────────────────────────────────────

const ORDER_BADGES: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-indigo-100 text-indigo-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
  flagged:    "bg-orange-100 text-orange-800",
};

const STATUS_BADGES: Record<string, string> = {
  active:     "bg-green-100 text-green-800",
  inactive:   "bg-gray-100 text-gray-600",
  suspended:  "bg-red-100 text-red-800",
  frozen:     "bg-blue-100 text-blue-800",
  pending:    "bg-amber-100 text-amber-800",
  approved:   "bg-green-100 text-green-800",
  rejected:   "bg-red-100 text-red-800",
  discharged: "bg-gray-100 text-gray-600",
  scheduled:  "bg-blue-100 text-blue-800",
  completed:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
  admitted:   "bg-purple-100 text-purple-800",
};

// ─────────────────────────────────────────────────────────────────────────────
// E-commerce
// ─────────────────────────────────────────────────────────────────────────────

const ECOMMERCE_VIEWS: EntityView[] = [
  {
    id:    "products",
    label: "Products",
    icon:  "📦",
    sql:   `SELECT p.id, p.name, cat.name AS category, p.price, p.stock_qty AS stock,
                   CASE WHEN p.is_active THEN 'active' ELSE 'inactive' END AS status
            FROM ecommerce.products p
            LEFT JOIN ecommerce.categories cat ON cat.id = p.category_id
            ORDER BY p.stock_qty ASC
            LIMIT 100`,
    columns: [
      { key: "name",     label: "Product",  type: "text",    primary: true },
      { key: "category", label: "Category", type: "text"     },
      { key: "price",    label: "Price",    type: "currency" },
      { key: "stock",    label: "Stock",    type: "number"   },
      { key: "status",   label: "Status",   type: "badge", badges: STATUS_BADGES },
    ],
    refreshOn:  ["update_stock"],
    emptyLabel: "No products found",
  },
  {
    id:    "orders",
    label: "Orders",
    icon:  "📋",
    sql:   `SELECT o.id, c.name AS customer, o.total,
                   CASE WHEN o.flagged THEN 'flagged' ELSE o.status END AS status,
                   o.created_at
            FROM ecommerce.orders o
            LEFT JOIN ecommerce.customers c ON c.id = o.customer_id
            ORDER BY o.created_at DESC
            LIMIT 100`,
    columns: [
      { key: "id",         label: "Order #",  type: "id"       },
      { key: "customer",   label: "Customer", type: "text", primary: true },
      { key: "total",      label: "Total",    type: "currency" },
      { key: "status",     label: "Status",   type: "badge", badges: ORDER_BADGES },
      { key: "created_at", label: "Date",     type: "date"     },
    ],
    refreshOn:  ["cancel_order", "flag_transaction"],
    emptyLabel: "No orders found",
  },
  {
    id:    "customers",
    label: "Customers",
    icon:  "👤",
    sql:   `SELECT c.id, c.name, c.email, c.city,
                   (SELECT COUNT(*) FROM ecommerce.orders WHERE customer_id = c.id) AS orders,
                   c.created_at
            FROM ecommerce.customers c
            ORDER BY orders DESC
            LIMIT 100`,
    columns: [
      { key: "name",       label: "Name",    type: "text", primary: true },
      { key: "email",      label: "Email",   type: "text" },
      { key: "city",       label: "City",    type: "text" },
      { key: "orders",     label: "Orders",  type: "number" },
      { key: "created_at", label: "Joined",  type: "date"  },
    ],
    refreshOn:  [],
    emptyLabel: "No customers found",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hospital
// ─────────────────────────────────────────────────────────────────────────────

const HOSPITAL_VIEWS: EntityView[] = [
  {
    id:    "patients",
    label: "Patients",
    icon:  "🧑‍⚕️",
    sql:   `SELECT id, name, gender, blood_type, district, registered_at
            FROM hospital.patients
            ORDER BY registered_at DESC
            LIMIT 100`,
    columns: [
      { key: "name",          label: "Patient",    type: "text", primary: true },
      { key: "gender",        label: "Gender",     type: "text" },
      { key: "blood_type",    label: "Blood Type", type: "text" },
      { key: "district",      label: "District",   type: "text" },
      { key: "registered_at", label: "Registered", type: "date" },
    ],
    refreshOn:  ["discharge_patient"],
    emptyLabel: "No patients found",
  },
  {
    id:    "appointments",
    label: "Appointments",
    icon:  "📅",
    sql:   `SELECT a.id, p.name AS patient, d.name AS doctor,
                   a.appointment_date, a.appointment_time, a.status
            FROM hospital.appointments a
            JOIN hospital.patients p ON p.id = a.patient_id
            JOIN hospital.doctors d ON d.id = a.doctor_id
            ORDER BY a.appointment_date DESC
            LIMIT 100`,
    columns: [
      { key: "patient",          label: "Patient", type: "text", primary: true },
      { key: "doctor",           label: "Doctor",  type: "text" },
      { key: "appointment_date", label: "Date",    type: "date" },
      { key: "status",           label: "Status",  type: "badge", badges: STATUS_BADGES },
    ],
    refreshOn:  ["book_appointment"],
    emptyLabel: "No appointments found",
  },
  {
    id:    "doctors",
    label: "Doctors",
    icon:  "👨‍⚕️",
    sql:   `SELECT d.id, d.name, d.specialty, dept.name AS department,
                   COUNT(a.id) AS appointments
            FROM hospital.doctors d
            LEFT JOIN hospital.departments dept ON dept.id = d.department_id
            LEFT JOIN hospital.appointments a ON a.doctor_id = d.id
            GROUP BY d.id, d.name, d.specialty, dept.name
            ORDER BY appointments DESC
            LIMIT 100`,
    columns: [
      { key: "name",         label: "Name",        type: "text", primary: true },
      { key: "specialty",    label: "Specialty",   type: "text" },
      { key: "department",   label: "Department",  type: "text" },
      { key: "appointments", label: "Appts",       type: "number" },
    ],
    refreshOn:  [],
    emptyLabel: "No doctors found",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Bank / SACCO
// ─────────────────────────────────────────────────────────────────────────────

const BANK_VIEWS: EntityView[] = [
  {
    id:    "accounts",
    label: "Accounts",
    icon:  "🏦",
    sql:   `SELECT a.id, m.name AS member, a.type, a.balance, a.status, a.opened_at
            FROM bank.accounts a
            JOIN bank.members m ON m.id = a.member_id
            ORDER BY a.balance DESC
            LIMIT 100`,
    columns: [
      { key: "member",    label: "Member",  type: "text", primary: true },
      { key: "type",      label: "Type",    type: "text" },
      { key: "balance",   label: "Balance", type: "currency" },
      { key: "status",    label: "Status",  type: "badge", badges: STATUS_BADGES },
      { key: "opened_at", label: "Opened",  type: "date" },
    ],
    refreshOn:  ["freeze_account"],
    emptyLabel: "No accounts found",
  },
  {
    id:    "loans",
    label: "Loans",
    icon:  "💳",
    sql:   `SELECT l.id, m.name AS member, l.product_type,
                   l.principal, l.outstanding_balance, l.status, l.due_date
            FROM bank.loans l
            JOIN bank.members m ON m.id = l.member_id
            ORDER BY l.due_date ASC
            LIMIT 100`,
    columns: [
      { key: "member",              label: "Member",      type: "text", primary: true },
      { key: "product_type",        label: "Type",        type: "text" },
      { key: "principal",           label: "Principal",   type: "currency" },
      { key: "outstanding_balance", label: "Outstanding", type: "currency" },
      { key: "status",              label: "Status",      type: "badge", badges: STATUS_BADGES },
      { key: "due_date",            label: "Due",         type: "date" },
    ],
    refreshOn:  ["approve_loan"],
    emptyLabel: "No loans found",
  },
  {
    id:    "members",
    label: "Members",
    icon:  "👥",
    sql:   `SELECT m.id, m.name, m.phone, b.name AS branch, m.joined_at, m.status
            FROM bank.members m
            LEFT JOIN bank.branches b ON b.id = m.branch_id
            ORDER BY m.joined_at DESC
            LIMIT 100`,
    columns: [
      { key: "name",      label: "Name",    type: "text", primary: true },
      { key: "phone",     label: "Phone",   type: "text" },
      { key: "branch",    label: "Branch",  type: "text" },
      { key: "joined_at", label: "Joined",  type: "date" },
      { key: "status",    label: "Status",  type: "badge", badges: STATUS_BADGES },
    ],
    refreshOn:  [],
    emptyLabel: "No members found",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HR
// ─────────────────────────────────────────────────────────────────────────────

const HR_VIEWS: EntityView[] = [
  {
    id:    "employees",
    label: "Employees",
    icon:  "👤",
    sql:   `SELECT e.id, e.name, d.name AS department, e.job_title, e.salary, e.status
            FROM hr.employees e
            LEFT JOIN hr.departments d ON d.id = e.department_id
            ORDER BY d.name, e.name
            LIMIT 100`,
    columns: [
      { key: "name",       label: "Name",       type: "text", primary: true },
      { key: "department", label: "Department", type: "text" },
      { key: "job_title",  label: "Title",      type: "text" },
      { key: "salary",     label: "Salary",     type: "currency" },
      { key: "status",     label: "Status",     type: "badge", badges: STATUS_BADGES },
    ],
    refreshOn:  [],
    emptyLabel: "No employees found",
  },
  {
    id:    "leave_requests",
    label: "Leave Requests",
    icon:  "🏖️",
    sql:   `SELECT lr.id, e.name AS employee, lr.type, lr.start_date,
                   lr.end_date, lr.status
            FROM hr.leave_requests lr
            JOIN hr.employees e ON e.id = lr.employee_id
            ORDER BY lr.applied_at DESC
            LIMIT 100`,
    columns: [
      { key: "employee",   label: "Employee", type: "text", primary: true },
      { key: "type",       label: "Type",     type: "text" },
      { key: "start_date", label: "From",     type: "date" },
      { key: "end_date",   label: "To",       type: "date" },
      { key: "status",     label: "Status",   type: "badge", badges: STATUS_BADGES },
    ],
    refreshOn:  ["approve_leave", "reject_leave"],
    emptyLabel: "No leave requests found",
  },
  {
    id:    "departments",
    label: "Departments",
    icon:  "🏢",
    sql:   `SELECT d.id, d.name, d.head_name,
                   COUNT(e.id) AS headcount,
                   ROUND(AVG(e.salary)::numeric, 0) AS avg_salary
            FROM hr.departments d
            LEFT JOIN hr.employees e ON e.department_id = d.id AND e.status = 'active'
            GROUP BY d.id, d.name, d.head_name
            ORDER BY headcount DESC
            LIMIT 100`,
    columns: [
      { key: "name",       label: "Department", type: "text", primary: true },
      { key: "head_name",  label: "Head",       type: "text" },
      { key: "headcount",  label: "Headcount",  type: "number" },
      { key: "avg_salary", label: "Avg Salary", type: "currency" },
    ],
    refreshOn:  [],
    emptyLabel: "No departments found",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NGO
// ─────────────────────────────────────────────────────────────────────────────

const NGO_VIEWS: EntityView[] = [
  {
    id:    "beneficiaries",
    label: "Beneficiaries",
    icon:  "🌍",
    sql:   `SELECT id, name, district, vulnerability_score, needs_followup, registered_at
            FROM ngo.beneficiaries
            ORDER BY needs_followup DESC, registered_at DESC
            LIMIT 100`,
    columns: [
      { key: "name",                label: "Name",        type: "text", primary: true },
      { key: "district",            label: "District",    type: "text" },
      { key: "vulnerability_score", label: "Vuln. Score", type: "number" },
      { key: "needs_followup",      label: "Follow-up",   type: "badge",
        badges: { "true": "bg-red-100 text-red-800", "false": "bg-gray-100 text-gray-600" } },
      { key: "registered_at",       label: "Registered",  type: "date" },
    ],
    refreshOn:  ["flag_beneficiary"],
    emptyLabel: "No beneficiaries found",
  },
  {
    id:    "projects",
    label: "Projects",
    icon:  "📁",
    sql:   `SELECT id, name, district, budget, spent,
                   ROUND((spent / NULLIF(budget, 0) * 100)::numeric, 0) AS pct_spent,
                   status
            FROM ngo.projects
            ORDER BY status, pct_spent DESC
            LIMIT 100`,
    columns: [
      { key: "name",      label: "Project",  type: "text", primary: true },
      { key: "district",  label: "District", type: "text" },
      { key: "budget",    label: "Budget",   type: "currency" },
      { key: "spent",     label: "Spent",    type: "currency" },
      { key: "pct_spent", label: "% Used",   type: "number" },
      { key: "status",    label: "Status",   type: "badge", badges: STATUS_BADGES },
    ],
    refreshOn:  [],
    emptyLabel: "No projects found",
  },
  {
    id:    "distributions",
    label: "Distributions",
    icon:  "📦",
    sql:   `SELECT d.id, b.name AS beneficiary, p.name AS project, d.item, d.quantity, d.distributed_at
            FROM ngo.distributions d
            JOIN ngo.beneficiaries b ON b.id = d.beneficiary_id
            JOIN ngo.projects p ON p.id = d.project_id
            ORDER BY d.distributed_at DESC
            LIMIT 100`,
    columns: [
      { key: "beneficiary",    label: "Beneficiary", type: "text", primary: true },
      { key: "project",        label: "Project",     type: "text" },
      { key: "item",           label: "Item",        type: "text" },
      { key: "quantity",       label: "Qty",         type: "number" },
      { key: "distributed_at", label: "Date",        type: "date" },
    ],
    refreshOn:  ["log_distribution"],
    emptyLabel: "No distributions found",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const VERTICAL_VIEWS: Record<string, EntityView[]> = {
  ecommerce: ECOMMERCE_VIEWS,
  hospital:  HOSPITAL_VIEWS,
  bank:      BANK_VIEWS,
  hr:        HR_VIEWS,
  ngo:       NGO_VIEWS,
};

export function getViews(vertical: string): EntityView[] {
  return VERTICAL_VIEWS[vertical] ?? [];
}
