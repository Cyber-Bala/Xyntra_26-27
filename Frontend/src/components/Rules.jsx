import "../styles/Rules.css";

const rules = [
  {
    number: "01",
    title: "Respect the Arena",
    copy: "Treat every participant, organizer and member of the community with respect.",
  },
  {
    number: "02",
    title: "Play Fair",
    copy: "Do not use unauthorized tools, exploits or methods that provide an unfair advantage.",
  },
  {
    number: "03",
    title: "Follow the Challenge Rules",
    copy: "Each challenge may have additional rules. Read the instructions before beginning.",
  },
  {
    number: "04",
    title: "Respect the Time Limit",
    copy: "Submit your work before the competition deadline.",
  },
  {
    number: "05",
    title: "Organizer Decision",
    copy: "Decisions made by the organizers regarding disputes and rule violations are final.",
  },
];

export default function Rules() {
  return (
    <section
  className="rules scene-section"
  id="rules"
  data-last-section="rules"
>
      <div className="rules__topline scene-topline">
        <span>04 / 04</span>
        <span>BEFORE YOU ENTER</span>
        <span>RULES — REGULATIONS</span>
      </div>

      <div className="rules__intro scene-grid">
        <div className="rules__marker scene-marker">A</div>

        <div className="rules__heading-wrap">
          <p className="rules__eyebrow">THE GATES / FINAL PROTOCOL</p>
          <h1 className="rules__heading">
            RULES
            <span>&amp;</span>
            REGULATIONS
          </h1>
        </div>

        <p className="rules__intro-copy">
          Read carefully before entering the gates. Every competitor is expected
          to understand and follow these rules.
        </p>
      </div>

      <div className="rules__list">
        {rules.map((rule) => (
          <article className="rule-row" key={rule.number}>
            <span className="rule-row__number">{rule.number}</span>

            <div className="rule-row__body">
              <h2>{rule.title}</h2>
              <p>{rule.copy}</p>
            </div>

            <span className="rule-row__arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}
