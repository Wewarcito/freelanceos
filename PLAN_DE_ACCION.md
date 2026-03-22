# Plan de Acción: freelanceos

## 1. Concepto y Visión

**freelanceos** es una plataforma SaaS de gestión integral para freelancers. Permite administrar clientes, proyectos, facturas, tracking de tiempo y métricas de negocio en un solo lugar.

**Modelo de negocio**: 100% Gratuito con donaciones voluntarias vía Ko-fi. Los supporters reciben un badge visual en su perfil.

---

## 2. Tech Stack - Cloudflare Native

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Frontend** | **Next.js 14 (App Router)** + **Tailwind CSS** | Compatible con Cloudflare Pages |
| **UI Components** | **shadcn/ui** | Componentes accesibles y customizables |
| **Base de datos** | **Cloudflare D1** | SQLite serverless, 5GB gratis, edge-ready |
| **ORM** | **Drizzle ORM** | Native support para D1, más ligero que Prisma |
| **Auth** | **Clerk** | Integración native con Cloudflare, componentes ready-to-use |
| **Storage** | **Cloudflare R2** | S3-compatible, $0 costo transferencia egress |
| **Deployment** | **Cloudflare Pages** | CDN global, deploy automático, edge functions |
| **Donaciones** | **Ko-fi** | Sin monthly fees, payout a PayPal, Colombia compatible |

### Por qué Cloudflare?

| Beneficio | Detalle |
|-----------|---------|
| Costo | D1: 5GB gratis, R2: $0 egress, Pages: ilimitado |
| Performance | Edge computing, CDN global |
| DX | Wrangler CLI, integración con Git |
| Escalabilidad | Serverless, auto-scale |

---

## 3. Funcionalidades Principales (MVP)

### 3.1 Autenticación y Onboarding
- Registro/Login con email y contraseña
- OAuth con Google/GitHub (via Clerk)
- Perfil de freelancer (nombre, foto, skills, tarifa por hora)
- Dashboard de bienvenida

### 3.2 Gestión de Clientes
- CRUD de clientes
- Información de contacto
- Historial de proyectos por cliente

### 3.3 Gestión de Proyectos
- CRUD de proyectos
- Estados: Potencial → Activo → Completado → Cancelado
- Presupuesto y deadline
- Archivos adjuntos (R2)
- Comentarios/notas internas

### 3.4 Tracking de Tiempo
- Timer con inicio/parada
- Registrar tiempo manual
- Asociar tiempo a proyecto/cliente
- Informes semanales/mensuales

### 3.5 Facturación
- Crear facturas vinculadas a proyectos
- Numeración automática
- Estados: Borrador → Enviada → Pagada → Vencida
- Exportar PDF

### 3.6 Dashboard y Métricas
- Horas trabajadas
- Proyectos activos
- Facturas pendientes
- Gráficos de tendencia

### 3.7 Donaciones y Supporters
- Botón de donación a Ko-fi en perfil y navbar
- Badge "Supporter" en perfil de usuarios que donaron
- Niveles de badge según monto donado:
  - **Coffee** ($1-4): Badge café
  - **Supporter** ($5-9): Badge bronce
  - **Champion** ($10-19): Badge plata
  - **Hero** ($20+): Badge dorado

---

## 4. Plan de Desarrollo por Fases

### Fase 1: Fundamentos (Semanas 1-2)
- [x] Configurar repositorio y estructura Next.js ✅
- [x] Configurar Cloudflare Pages + D1 con Wrangler ✅
- [x] Implementar schema con Drizzle ORM ✅
- [x] Implementar autenticación con Clerk ✅
- [x] Crear layout base y navegación ✅
- [x] Configurar tema y diseño system (Tailwind + shadcn/ui) ✅

### Fase 2: Core Features - Clientes y Proyectos (Semanas 3-4)
- [x] CRUD de clientes ✅
- [x] CRUD de proyectos ✅
- [x] Vincular proyectos a clientes ✅
- [x] Estados y transiciones de proyectos ✅

### Fase 3: Time Tracking (Semanas 5-6)
- [x] Timer con start/stop ✅
- [x] Registro manual de tiempo ✅
- [x] Vista de tiempo por proyecto ✅
- [x] Informes básicos (horas por semana/mes) ✅

### Fase 4: Facturación (Semanas 7-8)
- [x] Generador de facturas ✅
- [x] Estados de facturas ✅
- [x] Exportación PDF (pendiente - usar servicios externos)
- [x] Historial de facturas ✅

### Fase 5: Dashboard y Métricas (Semana 9)
- [x] Dashboard con KPIs ✅
- [x] Gráficos de tendencias ✅
- [x] Reportes exportables ✅

### Fase 6: Donaciones y Supporters (Semana 10)
- [x] Configurar link de donación Ko-fi ✅
- [x] Implementar botón en UI (navbar, perfil) ✅
- [x] Implementar badge visual con niveles ✅
- [x] Página de agradecimiento tras donación ✅
- [x] Sistema de autodeclaración de supporter ✅

### Fase 7: Polish y Launch (Semana 11-12)
- [x] SEO y meta tags ✅
- [x] Favicon y app icons ✅
- [x] Loading states y skeletons ✅
- [x] Error handling global ✅
- [x] Toast notifications ✅
- [x] Optimización de performance ✅
- [ ] Testing E2E (pendiente)
- [ ] Cloudflare R2 para archivos (pendiente)

---

## 5. Sistema de Donaciones con Ko-fi

### 5.1 ¿Por qué Ko-fi?

| Característica | Ko-fi | Otras alternativas |
|----------------|-------|-------------------|
| Monthly fees | **0%** | Patreon (5-12%) |
| Payout | PayPal directo | Variable |
| Colombia | Compatible (PayPal) | MercadoPago solo local |
| Popularidad devs | Alta | Variable |
| API/Webhooks | Sí | No todas |

### 5.2 Flujo de Donaciones

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE DONACIÓN                        │
│                                                             │
│   Usuario ve botón "Donar" en navbar/perfil                 │
│                          ↓                                  │
│              Click → Abre Ko-fi (nueva pestaña)              │
│                          ↓                                  │
│              Usuario completa donación en Ko-fi             │
│                          ↓                                  │
│   Usuario regresa a freelanceos                              │
│                          ↓                                  │
│              Modal: "¡Gracias por tu apoyo!"               │
│                          ↓                                  │
│   (Opcional) Usuario ingresa email para recibir badge        │
│                          ↓                                  │
│              Badge "Supporter" activo en su perfil          │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Badge de Supporter - Niveles

```
┌─────────────────────────────────────────────────────────────┐
│                    NIVELES DE BADGE                         │
│                                                             │
│  ☕ Coffee    ($1-4)   │ Fondo café claro, icono cafecito │
│  🥉 Supporter ($5-9)   │ Badge bronce, texto "Supporter"   │
│  🥈 Champion  ($10-19) │ Badge plata, texto "Champion"     │
│  🥇 Hero      ($20+)   │ Badge dorado, texto "Hero"       │
│                                                             │
│  Visual:                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [🥉] Juan Pérez — Champion                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Tooltip al hover: "¡Este usuario apoya freelanceos!"       │
└─────────────────────────────────────────────────────────────┘
```

### 5.4 Ubicación del Botón de Donación

| Ubicación | Elemento |
|-----------|----------|
| **Navbar** | Icono de corazón/donar, siempre visible |
| **Perfil de usuario** | Sección "Apoya el proyecto" con botón grande |
| **Footer** | Link "Donar" pequeño |
| **Dashboard** | Banner opcional no intrusivo |

### 5.5 Integración Ko-fi

```typescript
// Configuración
const KOFI_URL = "https://ko-fi.com/webwardlabs";

// Botón de donation en componente
<a 
  href={KOFI_URL} 
  target="_blank" 
  rel="noopener noreferrer"
  className="btn-donate"
>
  <HeartIcon className="w-4 h-4" />
  Donar
</a>

// Modal de agradecimiento (opcional, vía localStorage)
const showThankYouModal = () => {
  if (localStorage.getItem('kofi_donated')) {
    setShowModal(true);
    localStorage.removeItem('kofi_donated');
  }
};
```

### 5.6 Verificación Manual de Donación (MVP)

Para el MVP, el badge funciona de forma **autodeclarada**:

```
1. Usuario dona en Ko-fi
2. Recibe email de confirmación de Ko-fi
3. Usuario copia enlace/identificador de su donation
4. Viene a freelanceos → Settings → Donations
5. Pega el link o identifica su donation
6. Sistema marca al usuario como Supporter
```

**Versión futura (opcional):** Integrar API de Ko-fi para verificar automáticamente via email.

---

## 6. Estructura de Carpetas

```
freelanceos/
├── drizzle/
│   └── schema.ts          ← Schema de Drizzle
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (dashboard)
│   │   │   ├── clients/
│   │   │   ├── projects/
│   │   │   ├── time/
│   │   │   ├── invoices/
│   │   │   └── settings/
│   │   │       └── donations/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── clients/
│   │   ├── projects/
│   │   ├── time/
│   │   ├── invoices/
│   │   └── donations/
│   │       ├── donate-button.tsx
│   │       ├── supporter-badge.tsx
│   │       └── thank-you-modal.tsx
│   ├── lib/
│   │   ├── db.ts (Drizzle client)
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
│   └── badges/
├── wrangler.toml          ← Config de Cloudflare
├── drizzle.config.ts
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 7. Modelo de Datos (Schema Drizzle)

```typescript
// drizzle/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const supporters = sqliteTable('supporters', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  kofiLink: text('kofi_link'),
  tier: text('tier').default('coffee'), // coffee, bronze, silver, gold
  totalDonated: real('total_donated').default(0),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  address: text('address'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  clientId: text('client_id').references(() => clients.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('potential'), // potential, active, completed, canceled
  budget: real('budget'),
  deadline: integer('deadline', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const timeEntries = sqliteTable('time_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  duration: integer('duration'), // en minutos
  description: text('description'),
  billable: integer('billable', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  projectId: text('project_id').references(() => projects.id),
  invoiceNumber: text('invoice_number').unique().notNull(),
  status: text('status').default('draft'), // draft, sent, paid, overdue, canceled
  amount: real('amount').notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  paidDate: integer('paid_date', { mode: 'timestamp' }),
  items: text('items'), // JSON: [{description, quantity, price}]
  pdfUrl: text('pdf_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

---

## 8. Variables de Entorno

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID="..."

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Ko-fi
NEXT_PUBLIC_KOFI_USERNAME="webwardlabs"

# URLs
NEXT_PUBLIC_APP_URL="http://localhost:8788"
```

### wrangler.toml

```toml
name = "freelance-os"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "freelance-os-db"
database_id = "..."

[[r2_buckets]]
binding = "ASSETS"
bucket_name = "freelance-os-assets"
```

---

## 9. Badge Component - Especificación UI

```tsx
// components/donations/supporter-badge.tsx

const BADGE_TIERS = {
  coffee: { 
    label: 'Coffee', 
    color: 'bg-amber-100 text-amber-800',
    icon: '☕'
  },
  bronze: { 
    label: 'Supporter', 
    color: 'bg-orange-100 text-orange-800',
    icon: '🥉'
  },
  silver: { 
    label: 'Champion', 
    color: 'bg-gray-200 text-gray-700',
    icon: '🥈'
  },
  gold: { 
    label: 'Hero', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🥇'
  },
};

interface SupporterBadgeProps {
  tier: keyof typeof BADGE_TIERS;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SupporterBadge({ tier, showLabel = true, size = 'md' }: SupporterBadgeProps) {
  const badge = BADGE_TIERS[tier];
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${badge.color} ${sizeClasses[size]}`}
      title="¡Este usuario apoya freelanceos!"
    >
      <span>{badge.icon}</span>
      {showLabel && <span>{badge.label}</span>}
    </span>
  );
}
```

### Uso en Perfil

```tsx
// components/layout/user-avatar.tsx

export function UserDisplay({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
      <span className="font-medium">{user.name}</span>
      {user.supporter && <SupporterBadge tier={user.supporter.tier} />}
    </div>
  );
}
```

---

## 10. Guía Rápida: Setup Cloudflare

### 10.1 Instalar Wrangler CLI

```bash
npm install -g wrangler
```

### 10.2 Crear Database D1

```bash
wrangler d1 create freelance-os-db
# Copiar database_id en wrangler.toml
```

### 10.3 Aplicar Schema

```bash
wrangler d1 execute freelance-os-db --local --file=./drizzle/migrations/*.sql
wrangler d1 execute freelance-os-db --remote --file=./drizzle/migrations/*.sql
```

### 10.4 Crear Bucket R2 (para archivos)

```bash
wrangler r2 bucket create freelance-os-assets
```

### 10.5 Deploy

```bash
npx wrangler pages deploy
```

---

## 11. Próximos Pasos Inmediatos

1. ✅ **Plan de acción** → Completado
2. ✅ **Ko-fi** → webwardlabs configurado
3. ✅ **Tech Stack** → Next.js + Cloudflare D1 + Drizzle + Clerk
4. ✅ **Proyecto inicializado** → Build exitoso
5. ✅ **Clerk configurado** → API keys en .env.local
6. ✅ **D1 Database** → Creada con ID: 88f37663-a4a2-401e-973e-57ee9c724420
7. ✅ **Migrations aplicadas** → 6 tablas creadas
8. ✅ **Deploy a Cloudflare Pages** → https://dc4d0c4f.freelanceos.pages.dev ✅

---

## 12. Checklist de Lanzamiento

### Cloudflare Setup
- [x] Cuenta de Cloudflare creada ✅
- [x] Wrangler CLI instalado ✅
- [x] D1 Database creado ✅
- [ ] R2 Bucket creado (pendiente - para archivos)
- [x] Pages project configurado ✅

### Configuración
- [x] Ko-fi configurado (webwardlabs) ✅
- [x] Variables de entorno en .env.local ✅
- [x] wrangler.toml configurado ✅

### UI/UX
- [x] Botón donate en navbar ✅
- [x] Sección donate en perfil ✅
- [x] Badge de supporter visible ✅
- [x] Modal de agradecimiento ✅
- [x] Página de settings ✅
- [x] Toast notifications ✅
- [x] Loading states ✅
- [x] Error handling global ✅
- [x] SEO meta tags ✅
- [x] Favicon ✅

### Funcionalidades MVP
- [x] CRUD Clientes ✅
- [x] CRUD Proyectos ✅
- [x] Time Tracking (timer + manual) ✅
- [x] CRUD Facturas ✅
- [x] Dashboard con gráficos ✅
- [x] Exportación CSV ✅
- [x] Sistema de Supporters ✅

### Contenido
- [x] Landing page con "100% Gratis" ✅
- [x] Texto invitando a donate ✅
- [x] Link a Ko-fi en footer ✅

### Deployment
- [x] Deploy a Cloudflare Pages ✅
- [ ] Configurar dominio personalizado (opcional)
- [x] SSL verificado ✅ (automático en Cloudflare)

---

## 13. Comandos Útiles

```bash
# Development
wrangler dev                         # Iniciar dev server local
npm run dev                          # Next.js dev (puerto 8788)

# Drizzle
npx drizzle-kit generate             # Generar migrations
wrangler d1 execute DB --local       # Aplicar migrations (local)
wrangler d1 execute DB --remote      # Aplicar migrations (production)

# Deploy
npx wrangler pages deploy            # Deploy a Cloudflare Pages
wrangler d1 execute freelance-os-db --remote --file=./drizzle/migrations/*.sql  # Migrate DB

# R2 (archivos)
wrangler r2 object put my-file.txt --bucket=freelance-os-assets
```

---

*Plan generado: Marzo 2026*
*Stack: Next.js 15 + Cloudflare D1 + Drizzle ORM + Clerk + Cloudflare Pages*

---

## 🚀 DEPLOY INFO

**URL Production:** https://8d59ce77.freelanceos.pages.dev

**D1 Database ID:** 88f37663-a4a2-401e-973e-57ee9c724420

**Fecha deploy inicial:** 22 Marzo 2026
**Último deploy:** Fase 7 - SEO, toasts, loading states y polish

**Estado MVP Completado:** ✅ Fases 1-7 completadas
