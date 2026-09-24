import "../styles/Contact.css";

export default function Contact() {
  return (
    <section
  className="contact scene-section"
  id="contact"
  data-last-section="contact"
>
      <div className="contact__topline scene-topline">
        <span>03 / CONTACT</span>
        <span>OPEN CHANNEL</span>
        <span>GET IN TOUCH</span>
      </div>

      <div className="contact__layout">
        <div className="contact__heading-wrap">
          <p className="contact__eyebrow">NEED ASSISTANCE?</p>
          <h2>
            CONTACT
            <span>THE GATEKEEPERS</span>
          </h2>
        </div>

        <div className="contact__body">
          <p>
            Have a question about the competition, rules or registration?
            Reach out to the organizers and we will point you in the right direction.
          </p>

          <div className="contact__links">
            <a href="mailto:hello@example.com">
              <span>01</span>
              <span>hello@example.com</span>
              <span>↗</span>
            </a>
            <a href="#">
              <span>02</span>
              <span>Discord</span>
              <span>↗</span>
            </a>
            <a href="#">
              <span>03</span>
              <span>Instagram</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="contact__core" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
