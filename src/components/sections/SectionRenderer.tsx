import type { SectionType, SectionWithItems } from "@/lib/types";
import CardGridSection from "./card-grid";
import FooterLinksSection from "./footer-links";
import HeroSection from "./hero";
import ListWithBadgesSection from "./list-with-badges";
import MiniCardScrollerSection from "./mini-card-scroller";

const componentMap: Record<SectionType, (props: SectionProps) => JSX.Element> =
  {
    hero: (props) => <HeroSection {...props} />,
    card_grid: (props) => <CardGridSection {...props} />,
    mini_card_scroller: (props) => <MiniCardScrollerSection {...props} />,
    list_with_badges: (props) => <ListWithBadgesSection {...props} />,
    footer_links: (props) => <FooterLinksSection {...props} />,
  };

export type SectionProps = {
  section: SectionWithItems;
  index: number;
};

export default function SectionRenderer({
  sections,
}: {
  sections: SectionWithItems[];
}) {
  return (
    <>
      {sections.map((section, index) => {
        const Component = componentMap[section.type];
        if (!Component) return null;

        return (
          <Component
            key={section.id}
            section={section}
            index={index}
          />
        );
      })}
    </>
  );
}
