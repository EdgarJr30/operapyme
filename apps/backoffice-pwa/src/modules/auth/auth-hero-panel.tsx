import type { ComponentType, ReactNode, SVGProps } from 'react';
import { useState } from 'react';

import {
  Menu,
  ChevronRight,
  CloudUpload,
  Lock,
  RefreshCw,
  Server,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

import { useTranslation } from '@operapyme/i18n';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { backofficeTransition } from '@/lib/motion';

type AuthHeroPanelProps = {
  aside: ReactNode;
};

type FeatureItem = {
  name: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
};

type TestimonialItem = {
  body: string;
  author: {
    name: string;
    handle: string;
  };
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function SocialIconFacebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SocialIconInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SocialIconX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
    </svg>
  );
}

function SocialIconGitHub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SocialIconYoutube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TestimonialCard({
  item,
  featured = false,
}: {
  item: TestimonialItem;
  featured?: boolean;
}) {
  const initials = item.author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <figure
      className={classNames(
        'rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5',
        featured ? 'p-8 sm:p-10' : 'p-6'
      )}
    >
      <blockquote
        className={classNames(
          'text-gray-900',
          featured ? 'text-lg font-semibold tracking-tight sm:text-xl/8' : ''
        )}
      >
        <p>{`“${item.body}”`}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-x-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
          {initials}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{item.author.name}</div>
          <div className="text-gray-600">{`@${item.author.handle}`}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export function AuthHeroPanel({ aside }: AuthHeroPanelProps) {
  const { t } = useTranslation('backoffice');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('auth.landing.navigation.product'), href: '#' },
    { name: t('auth.landing.navigation.features'), href: '#' },
    { name: t('auth.landing.navigation.marketplace'), href: '#' },
    { name: t('auth.landing.navigation.company'), href: '#' },
  ];

  const logoCloud = [
    t('auth.landing.logoCloud.items.0'),
    t('auth.landing.logoCloud.items.1'),
    t('auth.landing.logoCloud.items.2'),
    t('auth.landing.logoCloud.items.3'),
    t('auth.landing.logoCloud.items.4'),
  ];

  const primaryFeatures: FeatureItem[] = [
    {
      name: t('auth.landing.primaryFeatures.items.0.name'),
      description: t('auth.landing.primaryFeatures.items.0.description'),
      icon: CloudUpload,
    },
    {
      name: t('auth.landing.primaryFeatures.items.1.name'),
      description: t('auth.landing.primaryFeatures.items.1.description'),
      icon: Lock,
    },
    {
      name: t('auth.landing.primaryFeatures.items.2.name'),
      description: t('auth.landing.primaryFeatures.items.2.description'),
      icon: Server,
    },
  ];

  const secondaryFeatures: FeatureItem[] = [
    {
      name: t('auth.landing.secondaryFeatures.items.0.name'),
      description: t('auth.landing.secondaryFeatures.items.0.description'),
      href: '#',
      icon: CloudUpload,
    },
    {
      name: t('auth.landing.secondaryFeatures.items.1.name'),
      description: t('auth.landing.secondaryFeatures.items.1.description'),
      href: '#',
      icon: Lock,
    },
    {
      name: t('auth.landing.secondaryFeatures.items.2.name'),
      description: t('auth.landing.secondaryFeatures.items.2.description'),
      href: '#',
      icon: RefreshCw,
    },
  ];

  const featuredTestimonial: TestimonialItem = {
    body: t('auth.landing.testimonials.featured.body'),
    author: {
      name: t('auth.landing.testimonials.featured.author.name'),
      handle: t('auth.landing.testimonials.featured.author.handle'),
    },
  };

  const testimonials: TestimonialItem[][][] = [
    [
      [
        {
          body: t('auth.landing.testimonials.columns.0.0.0.body'),
          author: {
            name: t('auth.landing.testimonials.columns.0.0.0.author.name'),
            handle: t('auth.landing.testimonials.columns.0.0.0.author.handle'),
          },
        },
        {
          body: t('auth.landing.testimonials.columns.0.0.1.body'),
          author: {
            name: t('auth.landing.testimonials.columns.0.0.1.author.name'),
            handle: t('auth.landing.testimonials.columns.0.0.1.author.handle'),
          },
        },
      ],
      [
        {
          body: t('auth.landing.testimonials.columns.0.1.0.body'),
          author: {
            name: t('auth.landing.testimonials.columns.0.1.0.author.name'),
            handle: t('auth.landing.testimonials.columns.0.1.0.author.handle'),
          },
        },
      ],
    ],
    [
      [
        {
          body: t('auth.landing.testimonials.columns.1.0.0.body'),
          author: {
            name: t('auth.landing.testimonials.columns.1.0.0.author.name'),
            handle: t('auth.landing.testimonials.columns.1.0.0.author.handle'),
          },
        },
      ],
      [
        {
          body: t('auth.landing.testimonials.columns.1.1.0.body'),
          author: {
            name: t('auth.landing.testimonials.columns.1.1.0.author.name'),
            handle: t('auth.landing.testimonials.columns.1.1.0.author.handle'),
          },
        },
        {
          body: t('auth.landing.testimonials.columns.1.1.1.body'),
          author: {
            name: t('auth.landing.testimonials.columns.1.1.1.author.name'),
            handle: t('auth.landing.testimonials.columns.1.1.1.author.handle'),
          },
        },
      ],
    ],
  ];

  const footerNavigation = {
    solutions: [
      t('auth.landing.footer.solutions.0'),
      t('auth.landing.footer.solutions.1'),
      t('auth.landing.footer.solutions.2'),
      t('auth.landing.footer.solutions.3'),
      t('auth.landing.footer.solutions.4'),
    ],
    support: [
      t('auth.landing.footer.support.0'),
      t('auth.landing.footer.support.1'),
      t('auth.landing.footer.support.2'),
    ],
    company: [
      t('auth.landing.footer.company.0'),
      t('auth.landing.footer.company.1'),
      t('auth.landing.footer.company.2'),
      t('auth.landing.footer.company.3'),
    ],
    legal: [
      t('auth.landing.footer.legal.0'),
      t('auth.landing.footer.legal.1'),
      t('auth.landing.footer.legal.2'),
    ],
    social: [
      {
        name: t('auth.landing.footer.social.facebook'),
        href: '#',
        icon: SocialIconFacebook,
      },
      {
        name: t('auth.landing.footer.social.instagram'),
        href: '#',
        icon: SocialIconInstagram,
      },
      {
        name: t('auth.landing.footer.social.x'),
        href: '#',
        icon: SocialIconX,
      },
      {
        name: t('auth.landing.footer.social.github'),
        href: '#',
        icon: SocialIconGitHub,
      },
      {
        name: t('auth.landing.footer.social.youtube'),
        href: '#',
        icon: SocialIconYoutube,
      },
    ],
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 flex items-center gap-3 p-1.5">
              <span className="sr-only">OperaPyme</span>
              <img
                alt="OperaPyme"
                src="/favicon.svg"
                className="h-8 w-8 rounded-xl"
              />
              <span className="text-sm font-semibold text-gray-900">
                OperaPyme
              </span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">
                {t('auth.landing.mobileMenu.open')}
              </span>
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#auth-access"
              className="text-sm/6 font-semibold text-gray-900"
            >
              {t('auth.landing.header.login')}
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="right" className="w-full max-w-sm bg-white p-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 flex items-center gap-3 p-1.5">
                  <img
                    alt="OperaPyme"
                    src="/favicon.svg"
                    className="h-8 w-8 rounded-xl"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    OperaPyme
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">
                    {t('auth.landing.mobileMenu.close')}
                  </span>
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>

              <SheetHeader className="sr-only">
                <SheetTitle>{t('auth.landing.mobileMenu.title')}</SheetTitle>
                <SheetDescription>
                  {t('auth.landing.mobileMenu.description')}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-8 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <a
                  href="#auth-access"
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {t('auth.landing.header.login')}
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main>
        <motion.div
          className="relative isolate pt-14"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={backofficeTransition}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="auth-grid-pattern"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#auth-grid-pattern)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>

          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:flex lg:items-start lg:gap-x-10 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
              <div className="flex">
                <div className="relative flex items-center gap-x-4 rounded-full bg-white px-4 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="font-semibold text-indigo-600">
                    {t('auth.landing.hero.eyebrow')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-4 w-px bg-gray-900/10"
                  />
                  <a href="#auth-access" className="flex items-center gap-x-1">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {t('auth.landing.hero.eyebrowLink')}
                    <ChevronRight
                      className="-mr-2 size-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
              <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
                {t('auth.landing.hero.title')}
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                {t('auth.landing.hero.description')}
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="#auth-access"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  {t('auth.landing.hero.primaryCta')}
                </a>
                <a
                  href="#auth-features"
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  {t('auth.landing.hero.secondaryCta')}
                  <span aria-hidden="true"> →</span>
                </a>
              </div>
            </div>

            <div
              id="auth-access"
              className="mt-16 w-full max-w-xl sm:mt-20 lg:mt-0 lg:max-w-md lg:shrink-0"
            >
              {aside}
            </div>
          </div>
        </motion.div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-6 opacity-60 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {logoCloud.map((item) => (
              <div
                key={item}
                className="flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-center text-sm font-semibold text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-32 max-w-7xl sm:mt-44 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 xl:px-24">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
              <div className="lg:row-start-2 lg:max-w-md">
                <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                  {t('auth.landing.primaryFeatures.title')}
                </h2>
                <p className="mt-6 text-lg/8 text-gray-300">
                  {t('auth.landing.primaryFeatures.description')}
                </p>
              </div>
              <div className="relative -z-20 min-h-[26rem] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-6 shadow-xl ring-1 ring-white/10 lg:row-span-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                        {t('auth.preview.pipelineLabel')}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {t('auth.preview.pipelineTitle')}
                      </p>
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                      {t('auth.preview.pipelineBadge')}
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {primaryFeatures.map((feature) => (
                      <div
                        key={feature.name}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <feature.icon
                            className="mt-0.5 size-5 text-indigo-300"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="font-semibold text-white">
                              {feature.name}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">
                <dl className="space-y-8 text-base/7 text-gray-300">
                  {primaryFeatures.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt className="ml-9 inline-block font-semibold text-white">
                        <feature.icon
                          className="absolute left-1 top-1 size-5 text-indigo-400"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div
          id="auth-features"
          className="mx-auto mt-32 max-w-7xl px-6 sm:mt-44 lg:px-8"
        >
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-600">
              {t('auth.landing.secondaryFeatures.eyebrow')}
            </h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              {t('auth.landing.secondaryFeatures.title')}
            </p>
            <p className="mt-6 text-lg/8 text-gray-600">
              {t('auth.landing.secondaryFeatures.description')}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {secondaryFeatures.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900">
                    <feature.icon
                      className="size-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <a
                        href={feature.href}
                        className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        {t('auth.landing.secondaryFeatures.learnMore')}
                        <span aria-hidden="true"> →</span>
                      </a>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mx-auto mt-32 max-w-7xl sm:mt-44 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-3xl text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t('auth.landing.newsletter.title')}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-center text-lg text-gray-300">
              {t('auth.landing.newsletter.description')}
            </p>
            <form className="mx-auto mt-10 flex max-w-md gap-x-4">
              <label htmlFor="auth-newsletter-email" className="sr-only">
                {t('auth.landing.newsletter.emailLabel')}
              </label>
              <input
                id="auth-newsletter-email"
                name="email"
                type="email"
                required
                placeholder={t('auth.landing.newsletter.emailPlaceholder')}
                autoComplete="email"
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100"
              >
                {t('auth.landing.newsletter.cta')}
              </button>
            </form>
          </div>
        </div>

        <div className="relative isolate mt-32 sm:mt-44 sm:pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base/7 font-semibold text-indigo-600">
                {t('auth.landing.testimonials.eyebrow')}
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                {t('auth.landing.testimonials.title')}
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm/6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
              <div className="sm:col-span-2 xl:col-start-2">
                <TestimonialCard item={featuredTestimonial} featured />
              </div>
              {testimonials.map((columnGroup, columnGroupIdx) => (
                <div
                  key={columnGroupIdx}
                  className="space-y-8 xl:contents xl:space-y-0"
                >
                  {columnGroup.map((column, columnIdx) => (
                    <div
                      key={columnIdx}
                      className={classNames(
                        (columnGroupIdx === 0 && columnIdx === 0) ||
                          (columnGroupIdx === testimonials.length - 1 &&
                            columnIdx === columnGroup.length - 1)
                          ? 'xl:row-span-2'
                          : 'xl:row-start-1',
                        'space-y-8'
                      )}
                    >
                      {column.map((testimonial) => (
                        <TestimonialCard
                          key={`${testimonial.author.handle}-${testimonial.body.slice(0, 16)}`}
                          item={testimonial}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 bg-white sm:mt-44">
        <div className="mx-auto max-w-7xl border-t border-gray-200 px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="flex items-center gap-3">
              <img
                alt="OperaPyme"
                src="/favicon.svg"
                className="h-9 w-9 rounded-xl"
              />
              <span className="text-base font-semibold text-gray-900">
                OperaPyme
              </span>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    {t('auth.landing.footer.labels.solutions')}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.solutions.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-sm/6 text-gray-600 hover:text-gray-900"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    {t('auth.landing.footer.labels.support')}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.support.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-sm/6 text-gray-600 hover:text-gray-900"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    {t('auth.landing.footer.labels.company')}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.company.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-sm/6 text-gray-600 hover:text-gray-900"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    {t('auth.landing.footer.labels.legal')}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-sm/6 text-gray-600 hover:text-gray-900"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-900/10 pt-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm/6 font-semibold text-gray-900">
                {t('auth.landing.footer.newsletterTitle')}
              </h3>
              <p className="mt-2 text-sm/6 text-gray-600">
                {t('auth.landing.footer.newsletterDescription')}
              </p>
            </div>
            <form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
              <label htmlFor="auth-footer-email" className="sr-only">
                {t('auth.landing.footer.emailLabel')}
              </label>
              <input
                id="auth-footer-email"
                name="email-address"
                type="email"
                required
                placeholder={t('auth.landing.footer.emailPlaceholder')}
                autoComplete="email"
                className="w-full min-w-0 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus-visible:outline-indigo-600 sm:w-56 sm:text-sm/6"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  {t('auth.landing.footer.subscribe')}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 border-t border-gray-900/10 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex gap-x-6 md:order-2">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="size-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="mt-8 text-sm/6 text-gray-600 md:order-1 md:mt-0">
              {t('auth.landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
