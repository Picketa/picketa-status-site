import SmallLogo from "@/assets/small-logo";
import Link from "next/link";

export function Intro() {
  return (
    <section className="flex flex-col md:flex-row items-center md:justify-between mt-16 mb-12 gap-4">
      <Link
        href="/"
        className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-200"
      >
        <SmallLogo />
        <span className="text-3xl font-bold">
          <span className="text-neutral-800 dark:text-white">Picketa</span>
          <span className="text-neutral-600 dark:text-neutral-300"> Status</span>
        </span>
      </Link>
      <h4 className="text-center md:text-right text-lg text-neutral-600 dark:text-neutral-300">
        Live status and incident history for{" "}
        <a
          href="https://www.picketa.com/"
          className="font-bold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 duration-200 transition-colors"
        >
          Picketa
        </a>{" "}
        systems.
      </h4>
    </section>
  );
}
