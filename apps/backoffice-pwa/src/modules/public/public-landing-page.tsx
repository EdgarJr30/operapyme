import type { ReactNode } from 'react';

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Globe,
  Menu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  'Plataforma',
  'Soluciones',
  'Precios',
  'Casos de uso',
] as const;

const trustItems = [
  'Retail',
  'Distribucion',
  'Servicios',
  'Logistica',
  'Operaciones',
  'Comercial',
] as const;

const clarityPoints = [
  'Cotizaciones, clientes y seguimiento en un mismo lugar',
  'Operacion simple para equipos pequenos y medianos',
  'Implementacion guiada sin complejidad de ERP pesado',
] as const;

function NavLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#"
      className="rounded-full px-4 py-2 text-[15px] font-medium text-[#2D3E50] transition hover:bg-[#F4F7F9]"
    >
      {children}
    </a>
  );
}

export function PublicLandingPage() {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#F4F7F9] text-[#2D3E50] lg:h-dvh">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(75,99,122,0.14),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(255,122,0,0.10),transparent_16%),linear-gradient(180deg,#eef3f7_0%,#f4f7f9_35%,#f4f7f9_100%)]" />
      <div className="absolute left-[-10%] top-[-8%] h-128 w-lg rounded-full bg-[#4B637A]/10 blur-3xl" />
      <div className="absolute right-[-8%] top-[8%] h-88 w-88 rounded-full bg-[#FF7A00]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-dvh max-w-370 flex-col px-4 pb-5 pt-4 sm:px-6 lg:px-8 lg:pb-6 xl:px-10">
        <header className="rounded-[30px] border border-white/60 bg-white/80 px-4 py-3 shadow-[0_14px_40px_rgba(45,62,80,0.08)] backdrop-blur-xl sm:px-5 lg:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="inline-flex h-14 items-center rounded-full bg-[#2D3E50] px-5 text-white shadow-[0_12px_30px_rgba(45,62,80,0.18)]"
              >
                <span className="mr-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-[#2D3E50]">
                  O
                </span>
                <span className="text-[18px] font-semibold tracking-[-0.02em]">
                  OperaPyme
                </span>
              </a>

              <nav className="hidden items-center rounded-full border border-[#D9E1E8] bg-white p-1 lg:flex">
                {navItems.map((item) => (
                  <NavLink key={item}>{item}</NavLink>
                ))}
                <button className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium text-[#2D3E50] transition hover:bg-[#F4F7F9]">
                  <Menu className="h-4 w-4" />
                  Menu
                </button>
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <button className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-[#D9E1E8] bg-white px-4 text-[14px] font-medium text-[#2D3E50] transition hover:bg-[#F4F7F9]">
                <Globe className="h-4 w-4" />
                Espanol
              </button>
              <Link
                to="/auth"
                className="inline-flex h-12 items-center rounded-full bg-white px-5 text-[14px] font-semibold text-[#2D3E50] transition hover:bg-[#F4F7F9]"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/auth"
                className="inline-flex h-12 items-center rounded-full border border-[#D9E1E8] bg-white px-5 text-[14px] font-semibold text-[#2D3E50] transition hover:bg-[#F4F7F9]"
              >
                Solicitar demo
              </Link>
              <Link
                to="/auth"
                className="inline-flex h-12 items-center rounded-full bg-[#FF7A00] px-5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(255,122,0,0.28)] transition hover:-translate-y-px hover:bg-[#ef7300]"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center py-6 lg:py-8 xl:py-10">
          <div className="mx-auto grid w-full max-w-310 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="mx-auto max-w-180 text-center lg:mx-0 lg:max-w-190 lg:pl-6 lg:text-left xl:max-w-200 xl:pl-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D9E1E8] bg-white/85 px-4 py-2 text-[13px] font-medium text-[#4B637A] shadow-[0_10px_24px_rgba(45,62,80,0.04)] backdrop-blur-xl">
                <BriefcaseBusiness className="h-4 w-4 text-[#FF7A00]" />
                SaaS para gestion operativa de PyMEs
              </div>

              <h1 className="mx-auto mt-6 max-w-[11ch] text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#2D3E50] sm:text-[3.45rem] lg:mx-0 lg:max-w-[10.8ch] lg:text-[4.15rem] xl:text-[4.6rem]">
                Control total para operar tu PyME con claridad.
              </h1>

              <p className="mx-auto mt-5 max-w-140 text-[17px] leading-[1.65] tracking-[-0.015em] text-[#5D6E7E] sm:text-[18px] lg:mx-0 lg:max-w-152">
                Centraliza ventas, inventario, tareas, facturacion y seguimiento
                del equipo en una sola plataforma elegante, rapida y facil de
                entender.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  to="/auth"
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-[#2D3E50] px-6 text-[15px] font-semibold text-white shadow-[0_16px_34px_rgba(45,62,80,0.20)] transition hover:-translate-y-px"
                >
                  Empezar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex h-14 items-center gap-3 rounded-full border border-[#D9E1E8] bg-white px-6 text-[15px] font-semibold text-[#2D3E50] shadow-[0_12px_30px_rgba(45,62,80,0.06)] transition hover:bg-[#F8FAFB]"
                >
                  Ver demo interactiva
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[14px] text-[#5D6E7E] lg:justify-start">
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF7A00]" />
                  Implementacion clara y rapida
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF7A00]" />
                  Diseno simple para equipos reales
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF7A00]" />
                  Todo en un solo flujo operativo
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/70 bg-white/82 p-6 text-left shadow-[0_16px_40px_rgba(45,62,80,0.08)] backdrop-blur-xl">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#80909E]">
                Todo claro de inmediato
              </div>

              <div className="mt-4 text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#2D3E50]">
                Una sola pantalla para decidir si OperaPyme es para ti.
              </div>

              <div className="mt-5 space-y-3">
                {clarityPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-[1.55] text-[#4B637A]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF7A00]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] bg-[#F8FAFB] p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#80909E]">
                  Ideal para
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trustItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-[#D9E1E8] bg-white px-3 py-1.5 text-[13px] font-medium text-[#4B637A]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[26px] border border-[#D9E1E8] bg-white px-4 py-4">
                <div className="text-[14px] font-semibold text-[#2D3E50]">
                  Configuracion inicial clara
                </div>
                <div className="mt-2 text-[14px] leading-[1.6] text-[#5D6E7E]">
                  Entras, configuras tu negocio y empiezas a operar sin navegar
                  varias secciones para entender el producto.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
