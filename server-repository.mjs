import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { services as seedServices } from "./data.js";
import { getPrisma, prismaEnabled } from "./prisma-client.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const storePath = join(root, "data", "services-store.json");
const auditPath = join(root, "data", "audit-events.jsonl");
const usePrisma = prismaEnabled();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function seedStore() {
  return {
    services: seedServices.map((service) => ({
      ...clone(service),
      currentVersion: 1,
      versions: [
        {
          version: 1,
          status: "draft",
          createdAt: "2026-08-27T00:00:00.000Z",
          createdBy: "system-seed",
          translations: clone(service.translations)
        }
      ]
    }))
  };
}

export async function ensureStore() {
  await mkdir(dirname(storePath), { recursive: true });
  try {
    await readFile(storePath, "utf8");
  } catch {
    await writeFile(storePath, JSON.stringify(seedStore(), null, 2), "utf8");
  }
  try {
    await readFile(auditPath, "utf8");
  } catch {
    await writeFile(auditPath, "", "utf8");
  }
}

async function readStore() {
  await ensureStore();
  return JSON.parse(await readFile(storePath, "utf8"));
}

async function writeStore(store) {
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export async function listServices({ publishedOnly = true } = {}) {
  if (usePrisma) {
    const prisma = await getPrisma();
    const services = await prisma.service.findMany({
      include: {
        versions: {
          where: publishedOnly ? { status: "PUBLISHED" } : undefined,
          orderBy: { version: "desc" },
          include: { translations: true }
        }
      }
    });
    return services.map((service) => {
      const active = service.versions[0];
      const translations = Object.fromEntries(
        (active?.translations ?? []).map((translation) => [
          translation.locale,
          {
            title: translation.title,
            summary: translation.summary,
            audience: translation.audience,
            included: translation.included,
            excluded: translation.excluded
          }
        ])
      );
      return {
        id: service.id,
        category: service.category,
        fixture: service.fixture,
        bookingEnabled: service.bookingEnabled,
        currentVersion: active?.version ?? service.currentVersion,
          status: active?.status?.toLowerCase() ?? "draft",
        translations
      };
    });
  }
  const store = await readStore();
  return store.services
    .filter((service) => !publishedOnly || service.versions.some((version) => version.status === "published"))
    .map((service) => {
      const active = [...service.versions]
        .reverse()
        .find((version) => (publishedOnly ? version.status === "published" : true));
      return {
        id: service.id,
        category: service.category,
        fixture: service.fixture,
        bookingEnabled: service.bookingEnabled,
        currentVersion: active?.version ?? service.currentVersion,
        status: active?.status ?? "draft",
        translations: active?.translations ?? {}
      };
    });
}

export async function listServiceVersions(serviceId) {
  if (usePrisma) {
    const prisma = await getPrisma();
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { versions: { orderBy: { version: "asc" }, include: { translations: true } } }
    });
    return service;
  }
  const store = await readStore();
  const service = store.services.find((item) => item.id === serviceId);
  if (!service) return null;
  return clone(service);
}

export async function createServiceVersion(serviceId, payload, actor) {
  if (usePrisma) {
    const prisma = await getPrisma();
    const result = await prisma.$transaction(async (tx) => {
      const [service] = await tx.$queryRaw`
        SELECT * FROM "Service" WHERE id = ${serviceId} FOR UPDATE
      `;
      if (!service) return null;
      const nextVersion = service.currentVersion + 1;
      const status = payload.status === "published" ? "PUBLISHED" : "DRAFT";
      const version = await tx.serviceVersion.create({
        data: {
          serviceId,
          version: nextVersion,
          status,
          createdById: actor.id,
          translations: {
            create: Object.entries(payload.translations).map(([locale, value]) => ({
              locale,
              title: value.title ?? "",
              summary: value.summary ?? "",
              audience: value.audience ?? null,
              included: value.included ?? null,
              excluded: value.excluded ?? null
            }))
          }
        },
        include: { translations: true }
      });
      await tx.service.update({ where: { id: serviceId }, data: { currentVersion: nextVersion } });
      await tx.auditEvent.create({
        data: {
          action: "service.version.created",
          actorId: actor.id,
          actorRole: actor.role.toUpperCase(),
          targetType: "Service",
          targetId: serviceId,
          metadata: { version: nextVersion, status }
        }
      });
      return { service, createdVersion: version };
    });
    return result;
  }
  const store = await readStore();
  const service = store.services.find((item) => item.id === serviceId);
  if (!service) return null;
  const nextVersion = service.currentVersion + 1;
  const version = {
    version: nextVersion,
    status: payload.status === "published" ? "published" : "draft",
    createdAt: new Date().toISOString(),
    createdBy: actor.id,
    translations: payload.translations
  };
  service.currentVersion = nextVersion;
  service.versions.push(version);
  await writeStore(store);
  await appendAudit({
    id: randomUUID(),
    action: "service.version.created",
    actorId: actor.id,
    actorRole: actor.role,
    targetId: serviceId,
    version: nextVersion,
    status: version.status,
    at: version.createdAt
  });
  return clone({ ...service, createdVersion: version });
}

export async function appendAudit(event) {
  if (usePrisma) {
    const prisma = await getPrisma();
    await prisma.auditEvent.create({
      data: {
        action: event.action,
        actorId: event.actorId ?? null,
        actorRole: event.actorRole ? event.actorRole.toUpperCase() : null,
        targetType: event.targetType ?? null,
        targetId: event.targetId ?? null,
        metadata: event.metadata ?? event,
        correlationId: event.correlationId ?? null,
        createdAt: event.at ? new Date(event.at) : undefined
      }
    });
    return;
  }
  await ensureStore();
  await writeFile(auditPath, `${JSON.stringify(event)}\n`, { encoding: "utf8", flag: "a" });
}

export async function listAuditEvents(filters = {}) {
  if (usePrisma) {
    const prisma = await getPrisma();
    return prisma.auditEvent.findMany({
      where: {
        action: filters.action ? { contains: filters.action, mode: "insensitive" } : undefined,
        actorId: filters.actorId || undefined,
        targetType: filters.targetType || undefined,
        targetId: filters.targetId || undefined,
        createdAt:
          filters.from || filters.to
            ? {
                gte: filters.from ? new Date(filters.from) : undefined,
                lte: filters.to ? new Date(filters.to) : undefined
              }
            : undefined
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }
  await ensureStore();
  const content = await readFile(auditPath, "utf8");
  const events = content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .reverse();
  return events.filter((event) => {
    const createdAt = event.createdAt ?? event.at;
    return (
      (!filters.action || event.action?.toLowerCase().includes(filters.action.toLowerCase())) &&
      (!filters.actorId || event.actorId === filters.actorId) &&
      (!filters.targetType || event.targetType === filters.targetType) &&
      (!filters.targetId || event.targetId === filters.targetId) &&
      (!filters.from || new Date(createdAt) >= new Date(filters.from)) &&
      (!filters.to || new Date(createdAt) <= new Date(filters.to))
    );
  });
}

export function getStorePaths() {
  return { storePath, auditPath };
}
