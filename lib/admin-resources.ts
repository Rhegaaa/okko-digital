import { prisma } from '@/lib/db';
import { str, strOrNull, dateOrNull, intOrNull, bool, enumOf, enumArray, compact } from '@/lib/admin-api';
import { SERVICE_LABELS, CLIENT_STATUS_LABELS, PROSPECT_STATUS_LABELS, PROJECT_STATUS_LABELS, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, QUOTE_STATUS_LABELS, NOTE_TYPE_LABELS, CONTACT_STATUS_LABELS } from '@/lib/constants';

const K = (m: Record<string, string>) => Object.keys(m ?? {});

export type ResourceDef = {
  model: string;
  parse: (body: Record<string, any>, isCreate: boolean) => Record<string, any> | { error: string };
  include?: Record<string, any>;
  orderBy?: Record<string, any> | Record<string, any>[];
  afterCreate?: (row: any) => Promise<void>;
  afterUpdate?: (row: any, prev: any) => Promise<void>;
};

async function nextQuoteReference(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.quote.count({ where: { reference: { startsWith: `DEV-${year}-` } } });
  return `DEV-${year}-${String((count ?? 0) + 1).padStart(3, '0')}`;
}

export const RESOURCES: Record<string, ResourceDef> = {
  clients: {
    model: 'client',
    orderBy: { company: 'asc' },
    parse: (b, c) => {
      const d = compact({
        company: str(b.company, 200),
        contactName: str(b.contactName, 200),
        email: strOrNull(b.email, 200),
        phone: strOrNull(b.phone, 60),
        website: strOrNull(b.website, 300),
        address: strOrNull(b.address, 300),
        city: strOrNull(b.city, 120),
        services: enumArray(b.services, K(SERVICE_LABELS)),
        status: enumOf(b.status, K(CLIENT_STATUS_LABELS), c ? 'ACTIF' : undefined),
        stripeCustomerId: strOrNull(b.stripeCustomerId, 100),
        notes: strOrNull(b.notes, 5000),
      });
      if (c && (!d.company || !d.contactName)) return { error: 'Entreprise et contact obligatoires.' };
      return d;
    },
  },
  prospects: {
    model: 'prospect',
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    parse: (b, c) => {
      const d = compact({
        company: str(b.company, 200),
        contactName: str(b.contactName, 200),
        email: strOrNull(b.email, 200),
        phone: strOrNull(b.phone, 60),
        source: strOrNull(b.source, 120),
        service: enumOf(b.service, K(SERVICE_LABELS), c ? 'AUTRE' : undefined),
        notes: strOrNull(b.notes, 5000),
        nextAction: strOrNull(b.nextAction, 300),
        followUpDate: dateOrNull(b.followUpDate),
        status: enumOf(b.status, K(PROSPECT_STATUS_LABELS), c ? 'NOUVEAU' : undefined),
        estimatedValue: intOrNull(b.estimatedValue),
        position: intOrNull(b.position) ?? undefined,
      });
      if (c && (!d.company || !d.contactName)) return { error: 'Entreprise et contact obligatoires.' };
      return d;
    },
  },
  projects: {
    model: 'project',
    include: { client: { select: { id: true, company: true } } },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    parse: (b, c) => {
      const d = compact({
        name: str(b.name, 200),
        clientId: str(b.clientId, 60),
        service: enumOf(b.service, K(SERVICE_LABELS), c ? 'AUTRE' : undefined),
        status: enumOf(b.status, K(PROJECT_STATUS_LABELS), c ? 'A_PREPARER' : undefined),
        startDate: dateOrNull(b.startDate),
        dueDate: dateOrNull(b.dueDate),
        description: strOrNull(b.description, 5000),
        notes: strOrNull(b.notes, 5000),
        budget: intOrNull(b.budget),
      });
      if (c && (!d.name || !d.clientId)) return { error: 'Nom et client obligatoires.' };
      return d;
    },
  },
  tasks: {
    model: 'task',
    include: { client: { select: { id: true, company: true } }, project: { select: { id: true, name: true } } },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    parse: (b, c) => {
      const status = enumOf(b.status, K(TASK_STATUS_LABELS), c ? 'A_FAIRE' : undefined);
      const d = compact({
        title: str(b.title, 300),
        clientId: strOrNull(b.clientId, 60),
        projectId: strOrNull(b.projectId, 60),
        service: b.service === undefined ? undefined : enumOf(b.service, K(SERVICE_LABELS)) ?? null,
        description: strOrNull(b.description, 5000),
        priority: enumOf(b.priority, K(TASK_PRIORITY_LABELS), c ? 'NORMALE' : undefined),
        dueDate: dateOrNull(b.dueDate),
        status,
        completedAt: status === undefined ? undefined : status === 'TERMINE' ? new Date() : null,
      });
      if (c && !d.title) return { error: 'Titre obligatoire.' };
      return d;
    },
  },
  quotes: {
    model: 'quote',
    include: { client: { select: { id: true, company: true } }, prospect: { select: { id: true, company: true } } },
    orderBy: { issuedAt: 'desc' },
    parse: (b, c) => {
      const d = compact({
        reference: str(b.reference, 60),
        clientId: strOrNull(b.clientId, 60),
        prospectId: strOrNull(b.prospectId, 60),
        title: str(b.title, 300),
        service: enumOf(b.service, K(SERVICE_LABELS), c ? 'AUTRE' : undefined),
        amount: intOrNull(b.amount) ?? (c ? 0 : undefined),
        recurring: bool(b.recurring),
        issuedAt: dateOrNull(b.issuedAt) ?? undefined,
        validUntil: dateOrNull(b.validUntil),
        status: enumOf(b.status, K(QUOTE_STATUS_LABELS), c ? 'BROUILLON' : undefined),
        notes: strOrNull(b.notes, 5000),
      });
      if (c && !d.title) return { error: 'Titre obligatoire.' };
      return d;
    },
  },
  notes: {
    model: 'note',
    orderBy: { createdAt: 'desc' },
    parse: (b, c) => {
      const d = compact({ content: str(b.content, 10000), clientId: str(b.clientId, 60), type: enumOf(b.type, K(NOTE_TYPE_LABELS), c ? 'INTERNE' : undefined) });
      if (c && (!d.content || !d.clientId)) return { error: 'Contenu obligatoire.' };
      return d;
    },
  },
  events: {
    model: 'calendarEvent',
    include: { client: { select: { id: true, company: true } }, prospect: { select: { id: true, company: true } }, project: { select: { id: true, name: true } } },
    orderBy: { startAt: 'asc' },
    parse: (b, c) => {
      const d = compact({
        title: str(b.title, 300),
        description: strOrNull(b.description, 5000),
        startAt: dateOrNull(b.startAt) ?? undefined,
        endAt: dateOrNull(b.endAt),
        allDay: bool(b.allDay),
        kind: str(b.kind, 40),
        clientId: strOrNull(b.clientId, 60),
        prospectId: strOrNull(b.prospectId, 60),
        projectId: strOrNull(b.projectId, 60),
      });
      if (c && (!d.title || !d.startAt)) return { error: 'Titre et date obligatoires.' };
      return d;
    },
  },
  showcase: {
    model: 'showcase',
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    parse: (b, c) => {
      const d = compact({
        title: str(b.title, 200),
        clientName: strOrNull(b.clientName, 200),
        service: enumOf(b.service, K(SERVICE_LABELS), c ? 'AUTRE' : undefined),
        summary: strOrNull(b.summary, 500),
        description: strOrNull(b.description, 5000),
        imageUrl: strOrNull(b.imageUrl, 1000),
        url: strOrNull(b.url, 500),
        year: strOrNull(b.year, 10),
        published: bool(b.published),
        position: intOrNull(b.position) ?? undefined,
      });
      if (c && !d.title) return { error: 'Titre obligatoire.' };
      return d;
    },
  },
  'contact-submissions': {
    model: 'contactSubmission',
    orderBy: { createdAt: 'desc' },
    parse: (b) => compact({ status: enumOf(b.status, K(CONTACT_STATUS_LABELS)) }),
  },
  notifications: {
    model: 'notification',
    orderBy: { createdAt: 'desc' },
    parse: (b) => compact({ read: bool(b.read) }),
  },
};

export async function prepareCreate(resource: string, data: Record<string, any>) {
  if (resource === 'quotes' && !data.reference) data.reference = await nextQuoteReference();
  return data;
}
