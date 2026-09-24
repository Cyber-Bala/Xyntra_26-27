import { useState } from "react";
import "../styles/FAQ.css";

const questions = [
  {
    question: "Who can enter the gates?",
    answer: "Anyone who meets the eligibility requirements can participate.",
  },
  {
    question: "Can I compete alone, or do I need a team?",
    answer: "You can participate individually unless a particular challenge specifies a team requirement.",
  },
  {
    question: "What if I arrive without a plan?",
    answer: "Read the challenge carefully, understand the objective, and work through the problem step by step.",
  },
  {
    question: "What happens if my build is judged unworthy?",
    answer: "The organizers will review the submission according to the published rules and judging criteria.",
  },
  {
    question: "Is there a prize for those who reach the walls?",
    answer: "Prize information will be announced by the organizers.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
  className="faq scene-section"
  id="faq"
  data-last-section="faq"
>
      <div className="faq__topline scene-topline">
        <span>02 / QUESTIONS</span>
        <span>COMMON SIGNALS</span>
        <span>FAQ</span>
      </div>

      <div className="faq__layout">
        <div className="faq__intro">
          <p className="faq__eyebrow">NEED TO KNOW</p>
          <h2>
            QUESTIONS
            <span>ANSWERED</span>
          </h2>
          <p className="faq__copy">
            Before you cross the walls, clear the details that matter.
          </p>
        </div>

        <div className="faq__list">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
                <button
                  className="faq-item__button"
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-item__index">0{index + 1}</span>
                  <span className="faq-item__question">{item.question}</span>
                  <span className="faq-item__icon">{isOpen ? "−" : "+"}</span>
                </button>

                <div className="faq-item__answer" data-open={isOpen}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
