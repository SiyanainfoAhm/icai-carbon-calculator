import type { AuditLog, Session, UserRole } from "./types";

let counter = 0;

export function createAuditLog(
  session: Session | null,
  action: string,
  module: string,
  details: string,
  overrides?: Partial<AuditLog>
): AuditLog {
  counter += 1;
  return {
    id: `audit-${Date.now()}-${counter}`,
    userId: session?.userId ?? "system",
    userName: session?.name ?? "System",
    role: session?.role ?? ("system_admin" as UserRole),
    action,
    module,
    timestamp: new Date().toISOString(),
    ip: "192.168.1." + Math.floor(Math.random() * 200 + 1),
    details,
    ...overrides,
  };
}

export function createSystemAuditLog(
  action: string,
  module: string,
  details: string
): AuditLog {
  return createAuditLog(null, action, module, details, {
    userId: "system",
    userName: "System",
    role: "system_admin",
  });
}
