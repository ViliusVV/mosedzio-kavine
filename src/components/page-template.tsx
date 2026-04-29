import { Locale } from "@/i18n-config";
import Topbar from "./topbar";

export type PageTheme = "dark" | "light";

const surfaces: Record<PageTheme, string> = {
  dark: "bg-[#1d1814] text-[#efe5d3]",
  light: "bg-[#f6efe3] text-[#2b211a]",
};

const footerColors: Record<PageTheme, string> = {
  dark: "text-[#efe5d3]/60",
  light: "text-[#2b211a]/60",
};

export default function PageTemplate(props: {
  lang: Locale;
  theme?: PageTheme;
  children: React.ReactNode[] | React.ReactNode;
}) {
  const theme: PageTheme = props.theme ?? "light";

  return (
    <div className={`${surfaces[theme]} min-h-screen flex flex-col font-sans`}>
      <Topbar lang={props.lang} theme={theme} />
      <main className="flex-1 w-full">{props.children}</main>
      <footer className={`flex flex-wrap items-center justify-center py-8 text-sm ${footerColors[theme]}`}>
        <p>{`UAB "Bartva" ${new Date().getFullYear()}`}</p>
      </footer>
    </div>
  );
}
