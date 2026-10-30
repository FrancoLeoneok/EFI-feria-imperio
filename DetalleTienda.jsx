import React from 'react';

export default function DetalleTienda() {
  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased">
    {/* Header (Exact match with index.html) */}
        <header
          className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
        >
          <div
            className="h-16 sm:h-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-margin flex items-center justify-between gap-3 sm:gap-gutter"
          >
            <div className="flex items-center gap-3 sm:gap-space-lg">
              <a
                className="flex items-center gap-2.5 sm:gap-3 shrink-0"
                data-path="explorar-tiendas"
                href="index.html"
              >
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 text-primary rounded-xl shadow-sm shrink-0"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="36" height="36" rx="9" fill="#102817" />
                  <path
                    d="M18 7.5L28 15V27C28 27.5523 27.5523 28 27 28H9C8.44772 28 8 27.5523 8 27V15L18 7.5Z"
                    fill="#263e2b" />
                  <path
                    d="M12 28V18C12 15.7909 13.7909 14 16 14H20C22.2091 14 24 15.7909 24 18V28"
                    stroke="#cdeacf"
                    strokeWidth="2.2"
                    strokeLinecap="round" />
                  <circle cx="18" cy="11.5" r="2" fill="#fd956f" />
                </svg>
                <span
                  className="font-headline-sm text-lg sm:text-headline-sm text-primary font-bold tracking-tight"
                  >EmprendeHub</span
                ></a
              >
              <div className="hidden xl:flex items-center relative w-72">
                <span
                  className="material-symbols-outlined absolute left-3 text-outline text-[20px]"
                  >search</span
                ><input
                  className="w-full bg-surface-container-low pl-10 pr-4 py-2 rounded-full font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Buscar tiendas o productos..."
                  type="text" />
              </div>
            </div>
            <nav
              className="hidden md:flex items-center gap-1.5 lg:gap-2 xl:gap-space-md"
              data-active-classes="bg-primary-container text-on-primary font-title-md"
            >
              <a
                className="px-3 sm:px-3.5 py-1.5 rounded-full font-title-md text-sm sm:text-title-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap"
                data-path="explorar-tiendas"
                href="index.html"
                >Explorar</a
              ><a
                className="px-3 sm:px-3.5 py-1.5 rounded-full font-title-md text-sm sm:text-title-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap"
                data-path="categorias"
                href="index.html"
                >Categorías</a
              ><a
                className="px-3 sm:px-3.5 py-1.5 rounded-full font-title-md text-sm sm:text-title-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap"
                data-path="como-funciona"
                href="index.html"
                >Cómo Funciona</a
              >
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                className="hidden sm:inline-flex items-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-sm sm:text-label-md hover:bg-primary-container transition-colors shadow-sm whitespace-nowrap"
                data-path="registro-de-emprendimiento"
                href="#"
                >Iniciar Sesión</a
              >
              <div className="flex items-center pl-1">
                <img
                  alt="Profile"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-primary/20 shadow-sm hover:ring-primary/40 transition-all cursor-pointer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy8nwhB4njGIpnSMb5Zq163J7X24fWLpkQR_6_sEfiV6mIZR24dBoG97P0yZbuQC6SdPbnnSNBTOLFcMLdWJQMwV4J1Q7sS72alX2xi6ivix6GzDD1RuvaTKtZXmowoJ-BrJhTGdb-AydKPGA-9LQPSN2MqVnuuvd1gkrLhijJh7fvnoymbybJ-Kb-SrDK9dIF6gbbQPAATSIlFvg7u2jnSHTLPdciPNAkXOvKYbShuR3bJ9sIqzy5kw" />
              </div>
              <button
                id="mobile-menu-btn"
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                aria-label="Abrir menú"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
            </div>
          </div>
          {/* Collapsible Mobile Drawer */}
          <div
            id="mobile-menu"
            className="hidden md:hidden border-t border-surface-container-high bg-surface px-4 py-4 space-y-3 shadow-lg"
          >
            <nav className="flex flex-col space-y-1">
              <a
                className="px-3 py-2.5 rounded-lg font-title-md text-title-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-between"
                data-path="explorar-tiendas"
                href="index.html"
                ><span>Explorar</span
                ><span className="material-symbols-outlined text-[18px]"
                  >storefront</span
                ></a
              >
              <a
                className="px-3 py-2.5 rounded-lg font-title-md text-title-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-between"
                data-path="categorias"
                href="index.html"
                ><span>Categorías</span
                ><span className="material-symbols-outlined text-[18px]"
                  >category</span
                ></a
              >
              <a
                className="px-3 py-2.5 rounded-lg font-title-md text-title-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-between"
                data-path="como-funciona"
                href="index.html"
                ><span>Cómo Funciona</span
                ><span className="material-symbols-outlined text-[18px]"
                  >help_outline</span
                ></a
              >
            </nav>
            <div
              className="pt-2 border-t border-surface-container-high flex flex-col gap-2"
            >
              <a
                className="w-full py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md text-center hover:bg-primary-container transition-colors shadow-sm sm:hidden flex items-center justify-center gap-2"
                data-path="registro-de-emprendimiento"
                href="#"
                ><span className="material-symbols-outlined text-[18px]"
                  >add_business</span
                ><span>Iniciar Sesión</span></a
              >
            </div>
          </div>
        </header>

        <main className="w-full pt-16 sm:pt-20 bg-background">
          <div className="flex flex-col w-full">
            {/* Subtle Ambient Top Glow */}
            <div className="relative w-full overflow-hidden">
              <div
                className="absolute top-10 right-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"
              ></div>
              <div
                className="absolute top-80 left-10 w-[500px] h-[500px] bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"
              ></div>

              {/* MAIN PROFILE HEADER & WORKSHOP SHOWCASE */}
              <section
                className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-margin pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-10 w-full"
              >
                {/* Breadcrumb Bar */}
                <nav
                  className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-on-surface-variant font-body-sm text-body-sm mb-4 sm:mb-6"
                >
                  <a
                    className="hover:text-primary transition-colors flex items-center gap-1"
                    data-path="explorar-tiendas"
                    href="index.html"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Tiendas
                  </a>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <a
                    className="hover:text-primary transition-colors"
                    data-path="categorias"
                    href="index.html"
                    >Cerámica &amp; Decoración</a
                  >
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-on-surface font-title-md font-medium"
                    >Cerámicas del Bosque</span
                  >
                </nav>

                {/* Store Header Banner Grid */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-sm bg-surface-container-low mb-6 sm:mb-space-xl"
                >
                  {/* Workshop Master Banner Image */}
                  <div
                    className="w-full h-48 sm:h-72 lg:h-[360px] relative bg-cover bg-center"
                    data-alt="Warm sunlit ceramic artisan workshop in Valdivia surrounded by lush southern rainforest trees."
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtb7rF-EeODvUqfV7W_4Qnu3tQorof4rn4NEvgaDmdM5LUXUPhw8NaTKH_td6VFt8xwxedJEwwSyPXirmT6XNNKXO91vsGbPWRhN3FmOT0ixscwQVyWmbZcA_Uc8Mce-PBlFzl9CsiqDRxW-AdHpkPKpWYmc6xVzrzGjUQWp-QtuNMug89XE3ghm0ji9Bz_Ob1f7YKIyQU2PP3e8d0HCAvKuqmmsxeo8sf_b17s1LokeN3xs0Mh7tszg')" }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent"
                    ></div>
                    <div
                      className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 bg-surface/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm text-primary font-label-md text-xs sm:text-label-md"
                    >
                      <span
                        className="w-2 h-2 rounded-full bg-secondary animate-pulse"
                      ></span>
                      Taller abierto al público
                    </div>
                  </div>

                  {/* Brand Identity Card (below banner) */}
                  <div className="relative px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 pt-0">
                    {/* Logo stamp: still overlaps the banner slightly as visual anchor */}
                    <div className="flex items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 lg:-mt-18 mb-4">
                      <div
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-surface-container p-2 sm:p-3 shadow-lg ring-4 ring-surface-container-low flex items-center justify-center relative overflow-hidden shrink-0"
                      >
                        <div
                          className="w-full h-full rounded-xl bg-primary flex flex-col items-center justify-center text-on-primary text-center p-2"
                        >
                          <span
                            className="material-symbols-outlined text-2xl sm:text-3xl text-secondary-fixed mb-1"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                            >potted_plant</span
                          >
                          <span
                            className="font-display text-[10px] sm:text-[11px] leading-tight uppercase font-bold tracking-widest text-surface-bright"
                            >Bosque</span
                          >
                          <span
                            className="font-label-sm text-[8px] text-on-primary-container tracking-wider uppercase"
                            >Taller 2018</span
                          >
                        </div>
                      </div>
                    </div>

                    {/* Store Name & Tagline â€” fully below the banner image */}
                    <div className="space-y-2 mt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]"
                            >verified</span
                          >
                          Taller Verificado
                        </span>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs sm:text-label-sm shadow-sm"
                        >
                          <span
                            className="material-symbols-outlined text-[15px] text-secondary"
                            >location_on</span
                          >
                          Valdivia, Los Ríos, Chile
                        </span>
                      </div>
                      <h1
                        className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight font-bold"
                      >
                        Cerámicas del Bosque
                      </h1>
                      <p
                        className="font-title-md text-sm sm:text-base text-on-surface-variant italic font-medium"
                      >
                        "Vajilla y decoración artesanal con alma de la tierra"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Maker Story Bento Split Layout */}
                <div
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter mb-8 sm:mb-space-xl items-stretch"
                >
                  {/* Left: Founder Bio & Technique Narrative */}
                  <div
                    className="lg:col-span-8 bg-surface-container-low rounded-2xl p-5 sm:p-8 lg:p-10 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4"
                      >
                        <span
                          className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold"
                          >Historia &amp; Oficio</span
                        >
                        <span className="font-body-sm text-body-sm text-outline"
                          >Desde los bosques australes</span
                        >
                      </div>
                      <h2
                        className="font-headline-md text-xl sm:text-headline-md text-primary font-bold mb-4"
                      >
                        Creando piezas cotidianas que susurran la calma del barro y
                        el bosque
                      </h2>
                      <div
                        className="space-y-4 text-on-surface-variant font-body-md text-body-md leading-relaxed"
                      >
                        <p>
                          Fundado por <strong>Camila San Martín</strong>, ceramista y
                          arquitecta de oficio,
                          <em className="text-on-surface">Cerámicas del Bosque</em> nació
                          en la ribera del río Calle-Calle como un experimento para
                          reconectar con los materiales nobles de la selva valdiviana.
                          Cada taza, fuente y cuenco surge de arcillas patagónicas
                          formuladas en nuestro propio taller y horneadas a 1.240°C
                          en cocción eléctrica de alta eficiencia.
                        </p>
                        <p>
                          No creemos en la producción apresurada. Los esmaltes se
                          formulan a partir de cenizas de madera nativa recuperada y
                          minerales no tóxicos certificados libres de plomo, haciendo
                          que cada vajilla sea completamente segura para uso diario,
                          microondas y lavavajillas, conservando texturas táctiles
                          únicas e irrepetibles.
                        </p>
                      </div>
                    </div>

                    {/* Process Highlights Mini Grid */}
                    <div
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 mt-6 border-t border-surface-container-high/60"
                    >
                      <div className="p-4 rounded-xl bg-surface">
                        <span
                          className="font-display text-headline-sm text-primary font-bold block mb-1"
                          >1.240°C</span
                        >
                        <span className="font-body-sm text-body-sm text-on-surface-variant"
                          >Alta temperatura para resistencia extrema al
                          desportillado.</span
                        >
                      </div>
                      <div className="p-4 rounded-xl bg-surface">
                        <span
                          className="font-display text-headline-sm text-secondary font-bold block mb-1"
                          >0% Tóxicos</span
                        >
                        <span className="font-body-sm text-body-sm text-on-surface-variant"
                          >Esmaltes aptos para consumo y alimentos calientes.</span
                        >
                      </div>
                      <div className="p-4 rounded-xl bg-surface">
                        <span
                          className="font-display text-headline-sm text-primary-container font-bold block mb-1"
                          >Valdivia</span
                        >
                        <span className="font-body-sm text-body-sm text-on-surface-variant"
                          >Inspiración botánica y barro de origen local
                          chileno.</span
                        >
                      </div>
                    </div>
                  </div>

                  {/* Right: Artisan Portrait & Workshop Contact Info */}
                  <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-gutter">
                    {/* Founder Snapshot */}
                    <div
                      className="rounded-2xl overflow-hidden bg-surface-container-high relative shadow-sm h-60 sm:h-72"
                    >
                      <img
                        className="w-full h-full object-cover object-center"
                        data-alt="Portrait of Camila, female artisan ceramist smiling gently inside her sunny rustic studio."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGJuLkQOj_Yg6TT9klB1o0z-Y3bd0buxxwL5tH1B66HPfjIRRAKzHEDERF7bSb-nbpEoC3utIG7qTxlWid159cTsrSLY2ECq8TobJQr_uVuV7XXJ_M5hpAYZz63fQW7m24WkTdGbFdM7nVOp59O7AvZutFlYQqlXXiBum0slFkNQAlkQKpZssE_dP9Yp7-3n3jkzWsVHHKU1eDROKya3nGDurCQEjf0iimUMZWXilC-ONYDAiyMpDTvw" />
                      <div
                        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent p-4 sm:p-5 text-on-primary"
                      >
                        <p
                          className="font-title-md text-title-md font-semibold text-surface-bright"
                        >
                          Camila San Martín
                        </p>
                        <p className="font-body-sm text-body-sm text-on-primary-container">
                          Fundadora &amp; Maestra Tornera
                        </p>
                      </div>
                    </div>

                    {/* Studio Information Panel */}
                    <div
                      className="bg-surface-container rounded-2xl p-5 sm:p-6 shadow-sm flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <h3
                          className="font-title-md text-title-md text-primary font-bold mb-3 flex items-center gap-2"
                        >
                          <span
                            className="material-symbols-outlined text-[20px] text-secondary"
                            >storefront</span
                          >
                          Visitas y Contacto Directo
                        </h3>
                        <ul
                          className="space-y-3 font-body-sm text-body-sm text-on-surface-variant"
                        >
                          <li className="flex items-start gap-2">
                            <span
                              className="material-symbols-outlined text-[18px] text-outline mt-0.5 shrink-0"
                              >place</span
                            >
                            <span>Pasaje Los Coigües 412, Isla Teja, Valdivia</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span
                              className="material-symbols-outlined text-[18px] text-outline mt-0.5 shrink-0"
                              >schedule</span
                            >
                            <span>Mar a Sáb: 10:30 - 18:30 hrs (Previa cita)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span
                              className="material-symbols-outlined text-[18px] text-outline shrink-0"
                              >mail</span
                            >
                            <a
                              className="hover:text-primary transition-colors break-all"
                              href="mailto:taller@ceramicasdelbosque.cl"
                              >taller@ceramicasdelbosque.cl</a
                            >
                          </li>
                        </ul>
                      </div>

                      {/* Social handles & Chat link */}
                      <div
                        className="pt-4 mt-4 border-t border-surface-container-high/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <a
                            aria-label="Instagram"
                            className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                            href="https://instagram.com"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="material-symbols-outlined text-[18px]"
                              >photo_camera</span
                            >
                          </a>
                          <a
                            aria-label="Pinterest"
                            className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                            href="https://pinterest.com"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="material-symbols-outlined text-[18px]"
                              >push_pin</span
                            >
                          </a>
                        </div>
                        <span
                          className="font-label-sm text-xs sm:text-label-sm text-primary font-semibold"
                          >@ceramicasdelbosque</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* PRODUCT CATALOG SECTION */}
            <section
              className="w-full bg-surface-container-low/50 py-8 sm:py-space-xl"
              id="catalogo"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-margin">
                {/* Catalog Section Header */}
                <div
                  className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4"
                >
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm mb-2"
                    >
                      <span className="material-symbols-outlined text-[14px]"
                        >brush</span
                      >
                      Colección Permanente 2025
                    </div>
                    <h2
                      className="font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg text-primary font-bold"
                    >
                      Catálogo de Productos del Taller
                    </h2>
                    <p
                      className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1"
                    >
                      Objetos utilitarios y decorativos moldeados uno a uno.
                      Selecciona una categoría para filtrar los lotes listos para
                      envío y encargos personalizados.
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant self-start md:self-auto"
                  >
                    <span>Mostrando:</span>
                    <span
                      className="px-3 py-1 bg-surface rounded-lg shadow-sm font-semibold text-primary"
                      id="product-count"
                      >8 piezas de autor</span
                    >
                  </div>
                </div>

                {/* Category Filter Tabs (Pills) */}
                <div
                  className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 scrollbar-none touch-pan-x -mx-1 px-1"
                  id="category-filter-container"
                >
                  <button
                    className="category-btn active-category px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-title-md text-sm transition-all whitespace-nowrap bg-primary text-on-primary shadow-sm"
                    data-cat="all"
                  >
                    Todas las Piezas (8)
                  </button>
                  <button
                    className="category-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-title-md text-sm transition-all whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant"
                    data-cat="tazas"
                  >
                    Tazas y Mugs
                  </button>
                  <button
                    className="category-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-title-md text-sm transition-all whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant"
                    data-cat="platos"
                  >
                    Platos &amp; Bowls
                  </button>
                  <button
                    className="category-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-title-md text-sm transition-all whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant"
                    data-cat="floreros"
                  >
                    Floreros &amp; Botellas
                  </button>
                  <button
                    className="category-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-title-md text-sm transition-all whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant"
                    data-cat="sets"
                  >
                    Sets de Regalo
                  </button>
                </div>

                {/* Product Cards Grid */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-gutter"
                  id="products-grid"
                >
                  {/* Product Card 1: Taza Bosque Esmaltada */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="tazas"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Ceramic mug with deep forest green glazed rim, speckled sandy stoneware clay bottom."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7__RMnGH6aGiZO0mPGBMtBP5CJbylgpb2OWdi-OtWPzYJCTaPljl1dfnPxhbBfVQSGCSJqBWJQRUbL-uqBqIu_OgbXbF1CRgIvu_RDzonSr6Va5R0yzPi-FEbuacz_nyrvmi2V4a3_PR4dQfXvnTteotXonghbC9xfTTm45LBSSKam9jk-NAJMsi_qfrnMYHi138rAZBtezWrkh5NTNz2kHkk0vD9-niaVX565s_2Nx5Y0SY8OS51nQ" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          En Stock (5 unid.)
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-md bg-secondary/90 backdrop-blur-md text-on-secondary font-label-sm text-label-sm"
                        >
                          Top Ventas
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Tazas &amp; Mugs</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Taza Bosque Esmaltada 350ml
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Gres esmaltado a mano en tono pino profundo y motas
                          minerales. Agarre ergonómico de 2 dedos.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$30.000</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$30.000 ARS"
                          data-title="Taza Bosque Esmaltada 350ml"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >add_shopping_cart</span
                          >
                          Comprar a la creadora
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 2: Plato Trinche Arcilla Gris */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="platos"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Rustic dinner ceramic plate made with raw gray clay rim and creamy off-white speckled satin glaze."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUqjebepIP3hQ-cFqv_4hgFvJIvddOtVYsmef_6mms-wZP2_6xf10xEaLnQjoV6O-UNfMqU_fjBASoUqPnsKuL9ozMmm5tjSWICORMZ0888zGFQ4171zTudMvlI2jThA3OWlHw7ByXK2ZHzC4t3gOZIr5flYwyhMCFJlEq4m4xmkyqlWq3Bb6phI6E2XXMzLjDYjmKdko-87x4GizwY7KKnhdqhY_dfE39nYnbyyj7sr59CHGdLDR2Mg" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          Pieza Ãšnica
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Platos &amp; Bowls</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Plato Trinche Arcilla Gris 26cm
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Borde alzado con textura acanalada hecha a pulso. Esmalte
                          satinado libre de plomo para alta gastronomía.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$37.500</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                          <span
                            className="font-label-sm text-label-sm text-secondary font-medium"
                            >Solo 2 disp.</span
                          >
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$37.500 ARS"
                          data-title="Plato Trinche Arcilla Gris 26cm"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >add_shopping_cart</span
                          >
                          Comprar a la creadora
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 3: Florero Texturado Terracota */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="floreros"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Artisanal terracotta ceramic vase with organic ridges and natural warm clay texture."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs2DVXDwueYUrts1BD3JGZgqNWUNXcGEgxsqVULh33a4lubRmbPeztKA91-e_Kaf5JpE3HFQyIbSs_dIQYj08sj5HfBg8GSivh7bGJP-59xMC4OT61be4mrxAcqLBRkpcS23yNl7BLkTXi9Lo3NrxXL4Qav0TLcnufNCpTMDccyXXn8TPvZ60P-Xvrjtmj2kbVsTSeQX1zOQx-gfk3HnGgMnFPS7o_NqyfumntP21v3uoHiwluxRVG-Q" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          Bajo Pedido (7 días)
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Floreros &amp; Botellas</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Florero Texturado Terracota
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Acabado mate poroso exterior, interior impermeabilizado
                          para flores frescas o secas.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$56.500</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-tertiary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$56.500 ARS"
                          data-title="Florero Texturado Terracota"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >handshake</span
                          >
                          Encargar al Taller
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 4: Set Desayuno Rústico x4 */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="sets"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Rustic breakfast ceramic set with two espresso cups, one butter dish, and a small oval serving platter."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKOOskCCsZuO2Nf98UrG0VxDwsGOgwAIL1745DHAKPyRfW0PxMfc8AC6bqwvEq-Et9XBuiUk5I7iJrWBCZX3xkJ8JuMDVqtkCIwh6rnAUlWmvo1D_7KSAF0QvEhIi_YpReRRXfEiUbAsHjOpq7530uMeN9Ao-vgIRzJa42AIYclrS8NfsiANtJP5R8cUDuQ3PeY-6jZGCRUisbPS-_AQHOh-02WPsXudt1-Or-Gusqndimjihz-DYpJQ" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          En Stock (3 sets)
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-md bg-primary text-on-primary font-label-sm text-label-sm"
                        >
                          Caja de Regalo
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Sets de Regalo</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Set Desayuno Rústico x4 Piezas
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Incluye 2 tazones medianos, 1 mantequillera con tapa y 1
                          mini bandeja rectangular.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$96.500</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$96.500 ARS"
                          data-title="Set Desayuno Rústico x4 Piezas"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >add_shopping_cart</span
                          >
                          Comprar a la creadora
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 5: Bowl Hondo Ensalada */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="platos"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Ceramic pasta and salad serving bowl with natural raw sand texture exterior."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn5wx9ieLWvQ9mu50Poc2oYOnaFefOxn6aJQBE0h5gq0oMwE5zLwevZxv-CAorLl2YabowT05fiSjv7CBMae1QDMYVhwGHS5OWaQ_9Pht19Ji-N6mYfJ5QSiRwiHpTwx1qGDxf_T95P2QWYlfFZxCUHnpKskWrUkuvpbvFvwFKqVrJ4pYJgzzcd9Swqjj4jv0KL35LcLO6dLPUPqhUFQtCmWxCcVK88RhH-5yjBOWHUd2LeEINq8GIXg" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          En Stock (4 unid.)
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Platos &amp; Bowls</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Bowl Austral Ensaladero 22cm
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Forma orgánica torneada sin molde rígido. Ideal para
                          pastas, ensaladas frescas o centro de mesa.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$40.000</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$40.000 ARS"
                          data-title="Bowl Austral Ensaladero 22cm"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >add_shopping_cart</span
                          >
                          Comprar a la creadora
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 6: Mug Espresso Cónico */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="tazas"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Pair of handcrafted small ceramic espresso cups, cone shaped without handles."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF9l7_P4kkMbUXBPG2uxiPt1Wo-rA7PXg1ZW9RAbYX_2RzH-3f0D4f2Df_NTi-P7M2l3YVtM77PMMczrCt7wt2BnW4mDmq9H-iinYdZisS9Qr0qxzmBaEnpK95_7iow7qgeZUm2PEQYvfYyOxtNdmHHnyiUefKSGCucJJw5-rS0Q7RQeEJE480vRWSz9GUFQuhWSLNWx1K2h9TWx3FeX9n7Q3aC0RwojGBsKe2kbQxJ1G-oaTSEsKYzQ" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          En Stock (8 unid.)
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Tazas &amp; Mugs</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Vaso Espresso Cónico 90ml
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Retención térmica superior por su grosor de gres. Tacto
                          rugoso diseñado para café de especialidad.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$20.000</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$20.000 ARS"
                          data-title="Vaso Espresso Cónico 90ml"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >add_shopping_cart</span
                          >
                          Comprar a la creadora
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 7: Botellón de Aceite Rústico */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="floreros"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Stoneware olive oil ceramic cruet bottle with natural cork stopper and stainless steel pourer."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJRT5b8D5tMoTeuF55Zmjt7EwiEdZgWcbTzw3Y7X9Td56qWm8AXBVTZ6NIVKeYFz9d6iirQiK1xj5-c5bz9YF4tt1DsneDb2FfJ9RscyqD-x5fAJIaElANNK9kfd9zKvI8Zq5dp5A7qmD0LEouwdYrnjqoxwyNmzZ5Wd0bSOxmq-HXCxuM2kV2S-taWwI5Svlseq6RKtZCLlpIGaC_bZlslt24DyMFCKXRggSr6RbfEYUmoWMTDIve6A" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          Bajo Pedido
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Floreros &amp; Botellas</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Aceitera Botellón Gres 500ml
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Protege el aceite de oliva de la luz. Incluye vertedor
                          dosificador de acero inoxidable.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$45.800</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-tertiary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$45.800 ARS"
                          data-title="Aceitera Botellón Gres 500ml"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >handshake</span
                          >
                          Encargar al Taller
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Product Card 8: Kit Ceremonia Té & Reposo */}
                  <article
                    className="product-item group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    data-category="sets"
                  >
                    <div
                      className="relative overflow-hidden aspect-[4/5] bg-surface-container"
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-alt="Ceramic tea ceremony set featuring an artisan teapot with bent bamboo handle and two matching tea bowls."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4HKiD_FNxVazOBeAdkdmUzd5q8XMGm2Y8Bp51oqDdAb9cs4hoyqRvuSYgvpfsMk_H1tGvchzh447aMVIyRtek88zhDptxFmL6Z8eSVkzBK-2ZGeUyI12yMFX0c-RgyuYqgBR-eQlLcp-EocLazMU-VAKpmPdrdeIlaFSYsI4HjDzbj0hRG6hIphGh1_t4M6gEH0SOJjy5z1dbBk55DpeOlqKfJ4YKk1h785oFfesLsPpl5jHp1E51Yw" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span
                          className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs"
                        >
                          Pieza Ãšnica
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm"
                        >
                          Edición Limitada
                        </span>
                      </div>
                      <button
                        aria-label="Favorito"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-secondary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]"
                          >favorite</span
                        >
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider"
                          >Sets de Regalo</span
                        >
                        <h3
                          className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors text-base font-semibold"
                        >
                          Kit Tetera Austral &amp; 2 Cuencos
                        </h3>
                        <p
                          className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2"
                        >
                          Tetera de infusión con asa curva de madera recuperada y
                          filtro cerámico integrado perforado a mano.
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-surface-container-high/60">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span
                              className="font-headline-md text-headline-md text-primary font-bold"
                              >$113.000</span
                            >
                            <span className="text-xs text-outline ml-1 font-body-sm"
                              >ARS</span
                            >
                          </div>
                          <span
                            className="font-label-sm text-label-sm text-secondary font-medium"
                            >Solo 1 en taller</span
                          >
                        </div>
                        <button
                          className="add-to-cart-btn w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                          data-price="$113.000 ARS"
                          data-title="Kit Tetera Austral &amp; 2 Cuencos"
                        >
                          <span className="material-symbols-outlined text-[18px]"
                            >add_shopping_cart</span
                          >
                          Comprar a la creadora
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* MAKER POLICIES & TRANSPARENCY SECTION */}
            <section
              className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-margin py-8 sm:py-space-xl"
            >
              <div
                className="bg-surface-container rounded-2xl p-5 sm:p-8 lg:p-12 shadow-sm"
              >
                <div className="max-w-2xl mb-6 sm:mb-8">
                  <span
                    className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold"
                    >Compromiso y Claridad</span
                  >
                  <h2
                    className="font-headline-md text-xl sm:text-headline-md text-primary font-bold mt-1"
                  >
                    Políticas Directas de Cerámicas del Bosque
                  </h2>
                  <p
                    className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed"
                  >
                    Al comprar aquí, tu pago va directo al taller de Camila. Revisa
                    nuestras condiciones de embalaje especial para cerámica y soporte
                    post-venta.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-gutter">
                  {/* Policy 1 */}
                  <div
                    className="bg-surface rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[24px]"
                          >local_shipping</span
                        >
                      </div>
                      <h3
                        className="font-title-md text-title-md text-on-surface font-semibold"
                      >
                        Envíos Cuidadosos &amp; Embalaje Cero Roturas
                      </h3>
                      <p
                        className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                      >
                        Enviamos a todo Chile mediante transporte certificado.
                        Empleamos cartón corrugado reciclado y viruta de madera natural
                        amortiguante sin plásticos contaminantes.
                      </p>
                    </div>
                    <div
                      className="mt-4 pt-4 border-t border-surface-container-high/60 font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]"
                        >check_circle</span
                      >
                      Seguro de rotura 100% incluido
                    </div>
                  </div>

                  {/* Policy 2 */}
                  <div
                    className="bg-surface rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-secondary-fixed/50 text-secondary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[24px]"
                          >assignment_return</span
                        >
                      </div>
                      <h3
                        className="font-title-md text-title-md text-on-surface font-semibold"
                      >
                        Garantía y Devoluciones
                      </h3>
                      <p
                        className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                      >
                        Si una pieza llega con daños por transporte, te enviamos otra
                        de inmediato o devolvemos el dinero. Dispones de 10 días tras
                        recibirla para cambios.
                      </p>
                    </div>
                    <div
                      className="mt-4 pt-4 border-t border-surface-container-high/60 font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]"
                        >check_circle</span
                      >
                      Trato humano directo con la creadora
                    </div>
                  </div>

                  {/* Policy 3 */}
                  <div
                    className="bg-surface rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[24px]"
                          >wash</span
                        >
                      </div>
                      <h3
                        className="font-title-md text-title-md text-on-surface font-semibold"
                      >
                        Cuidados de la Cerámica Gres
                      </h3>
                      <p
                        className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                      >
                        Apta para lavavajillas y microondas. Evita choques térmicos
                        extremos. Lavar con esponja suave para mantener el brillo
                        satinado intacto por décadas.
                      </p>
                    </div>
                    <div
                      className="mt-4 pt-4 border-t border-surface-container-high/60 font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]"
                        >check_circle</span
                      >
                      Vajilla hecha para durar generaciones
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* WORKSHOP LOCATION MAP PREVIEW */}
            <section
              className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-margin pb-8 sm:pb-space-xl"
            >
              <div
                className="bg-surface rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row items-center gap-6 lg:gap-8"
              >
                <div className="lg:w-1/3 space-y-3">
                  <span
                    className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest"
                    >Encuéntranos en el Sur</span
                  >
                  <h3
                    className="font-headline-md text-xl sm:text-headline-md text-primary font-bold"
                  >
                    Valdivia, Región de Los Ríos
                  </h3>
                  <p
                    className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                  >
                    Nuestro taller físico se encuentra rodeado de vegetación en la
                    Isla Teja. Recibimos visitas con reserva para que puedas probar el
                    torno, elegir tus piezas directamente de las estanterías de secado
                    y conocer el proceso del gres.
                  </p>
                  <div className="pt-2">
                    <a
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors"
                      href="https://maps.google.com"
                      rel="noopener"
                      target="_blank"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        >explore</span
                      >
                      <span>Abrir en Google Maps</span>
                    </a>
                  </div>
                </div>
                <div
                  className="lg:w-2/3 w-full h-56 sm:h-64 lg:h-72 rounded-xl overflow-hidden shadow-xs relative"
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    data-location="Isla Teja, Valdivia, Chile"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAaCuON7P3zlDRkqiHDIIr1O6wp9wtCU8V749B6QvDyqubDW8pGiRMTNccHjz1VwA8xL2upZhhbJKW1PiDdBSDlSNfnUGRbTeMjSSRPg4_64kSVJR4LbGTGE3nno6e2YC2cNBjKqGdVj1A5twQ03JDmXOebobU7rlyboDr55e8cUJEoDTV31CZJnJFLvFuLbAJc1Otacar7KEIQfBYkPV2W-Ovg5XFT8tPNwqqUfmZmTlYouJ4KBBW8ww')" }}
                  ></div>
                  <div
                    className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm font-label-sm text-xs sm:text-label-sm text-primary flex items-center gap-1.5"
                  >
                    <span
                      className="material-symbols-outlined text-[16px] text-secondary"
                      >pin_drop</span
                    >
                    <span>Taller Cerámicas del Bosque, Isla Teja</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* TOAST NOTIFICATION CONTAINER */}
          <div
            className="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none"
            id="cart-toast"
          >
            <div
              className="bg-primary text-on-primary px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-secondary-fixed"
                >check_circle</span
              >
              <div className="text-sm">
                <p className="font-title-md font-semibold text-surface-bright" id="toast-title">
                  Producto agregado
                </p>
                <p className="text-xs text-on-primary-container">
                  Apoyando a Cerámicas del Bosque
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER (Consistent with index.html) */}
        <footer
          className="w-full bg-surface-container-low mt-8 sm:mt-space-xl border-t border-surface-container-high/60 shadow-[0_-1px_6px_rgba(0,0,0,0.02)]"
        >
          <div
            className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-margin py-8 sm:py-space-xl"
          >

            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8 sm:mb-space-xl"
            >
              <div className="sm:col-span-2 space-y-space-md">
                <div className="flex items-center gap-space-sm">
                  <svg
                    className="w-8 h-8 text-primary rounded-xl shadow-sm shrink-0"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="36" height="36" rx="9" fill="#102817" />
                    <path
                      d="M18 7.5L28 15V27C28 27.5523 27.5523 28 27 28H9C8.44772 28 8 27.5523 8 27V15L18 7.5Z"
                      fill="#263e2b" />
                    <path
                      d="M12 28V18C12 15.7909 13.7909 14 16 14H20C22.2091 14 24 15.7909 24 18V28"
                      stroke="#cdeacf"
                      strokeWidth="2.2"
                      strokeLinecap="round" />
                    <circle cx="18" cy="11.5" r="2" fill="#fd956f" />
                  </svg>
                  <span
                    className="font-headline-sm text-headline-sm text-primary font-bold"
                    >EmprendeHub</span
                  >
                </div>
                <p
                  className="font-body-sm text-body-sm text-on-surface-variant max-w-sm"
                >
                  Plataforma colaborativa dedicada al impulso y visibilidad de
                  marcas independientes, talleres familiares y artesanía de origen
                  consciente.
                </p>
                <div className="flex items-center gap-space-sm text-on-surface-variant">
                  <a
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                    href="https://instagram.com"
                    rel="noopener"
                    target="_blank"
                    ><span className="material-symbols-outlined text-[18px]"
                      >photo_camera</span
                    ></a
                  ><a
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                    href="https://facebook.com"
                    rel="noopener"
                    target="_blank"
                    ><span className="material-symbols-outlined text-[18px]"
                      >public</span
                    ></a
                  ><a
                    aria-label="Pinterest"
                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                    href="https://pinterest.com"
                    rel="noopener"
                    target="_blank"
                    ><span className="material-symbols-outlined text-[18px]"
                      >push_pin</span
                    ></a
                  ><a
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                    href="https://linkedin.com"
                    rel="noopener"
                    target="_blank"
                    ><span className="material-symbols-outlined text-[18px]"
                      >work</span
                    ></a
                  >
                </div>
              </div>
              <div className="space-y-space-sm">
                <h4
                  className="font-title-md text-title-md text-on-surface font-semibold"
                >
                  Descubrir
                </h4>
                <ul
                  className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant"
                >
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="explorar-tiendas"
                      href="index.html"
                      >Directorio de Tiendas</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="categorias"
                      href="index.html"
                      >Oficios &amp; Categorías</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="historias"
                      href="index.html"
                      >Historias del Taller</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="explorar-tiendas"
                      href="index.html"
                      >Colecciones de Temporada</a
                    >
                  </li>
                </ul>
              </div>
              <div className="space-y-space-sm">
                <h4
                  className="font-title-md text-title-md text-on-surface font-semibold"
                >
                  Emprendedores
                </h4>
                <ul
                  className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant"
                >
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="como-funciona"
                      href="index.html"
                      >Cómo Empezar</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="preguntas-frecuentes"
                      href="#"
                      >Preguntas Frecuentes</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="guias-para-creadores"
                      href="#"
                      >Guías para Creadores</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="registro-de-emprendimiento"
                      href="#"
                      >Postular Mi Tienda</a
                    >
                  </li>
                </ul>
              </div>
              <div className="space-y-space-sm">
                <h4
                  className="font-title-md text-title-md text-on-surface font-semibold"
                >
                  Legal &amp; Contacto
                </h4>
                <ul
                  className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant"
                >
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="aviso-legal"
                      href="#"
                      >Aviso Legal</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="aviso-legal"
                      href="#"
                      >Términos y Condiciones</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="aviso-legal"
                      href="#"
                      >Privacidad y Datos</a
                    >
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      data-path="preguntas-frecuentes"
                      href="#"
                      >Soporte Comunitario</a
                    >
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="pt-6 sm:pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-label-sm text-label-sm text-outline border-t border-surface-container-high/60"
            >
              <p>
                © 2025 EmprendeHub. Plataforma de comercio local y diseño
                consciente.
              </p>
              <div className="flex items-center gap-space-md justify-center">
                <span className="flex items-center gap-1"
                  ><span className="material-symbols-outlined text-[14px] text-primary"
                    >eco</span
                  >
                  Hecho a mano, impulsado con amor local</span
                >
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}
