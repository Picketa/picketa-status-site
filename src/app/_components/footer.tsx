import Container from "@/app/_components/container";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
      <Container>
        <div className="py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-center md:text-left text-neutral-600 dark:text-neutral-400">
            Picketa Status &middot; live status and incident history for Picketa
            systems.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.picketa.com/"
              className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Picketa
            </a>
            <a
              href="/api/get-past-90-days"
              className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              JSON API
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
