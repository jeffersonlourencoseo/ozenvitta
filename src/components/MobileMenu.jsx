import { useState } from 'preact/hooks';

const navItems = [
  { label: "Início", href: "/" },
  { label: "O que é", href: "/o-que-e/" },
  { label: "Composição", href: "/composicao/" },
  { label: "Benefícios", href: "/beneficios/" },
  { label: "Como Usar", href: "/como-usar/" },
  { label: "Contraindicações", href: "/contraindicacoes/" },
  { label: "Depoimentos", href: "/depoimentos/" },
  { label: "Onde Comprar", href: "/onde-comprar/" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const toggle = () => {
    if (isOpen) close();
    else open();
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        onClick={toggle}
        className="relative z-[60] flex flex-col items-center justify-center w-10 h-10 gap-[5px]"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
      >
        <span
          className="block w-6 h-[2px] bg-brand transition-transform duration-300 origin-center"
          style={{
            transform: isOpen ? 'rotate(45deg) translateY(7px)' : '',
          }}
        />
        <span
          className="block w-6 h-[2px] bg-brand transition-opacity duration-300"
          style={{ opacity: isOpen ? 0 : 1 }}
        />
        <span
          className="block w-6 h-[2px] bg-brand transition-transform duration-300 origin-center"
          style={{
            transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : '',
          }}
        />
      </button>

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[55] transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        className="fixed top-[72px] left-0 right-0 bottom-0 z-[56] bg-surface/98 border-b border-brand/5 overflow-y-auto transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
        role="dialog"
        aria-label="Menu de navegação"
        aria-modal="true"
      >
        <div className="container mx-auto px-6 py-8">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="block py-3 px-2 text-brand-dark/80 font-medium hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href="/onde-comprar/"
                onClick={close}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full"
              >
                Oferta Especial
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
