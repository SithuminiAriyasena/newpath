import Card from "./Card.jsx";

const ext = { target: "_blank", rel: "noopener noreferrer", className: "text-leaf-700 underline" };

export default function Help() {
  return (
    <section>
      <h2 className="mt-1 text-xl font-semibold">Get help now</h2>

      <Card alert>
        <h3 className="font-semibold">In immediate danger or overdose?</h3>
        <p className="mt-1">
          Call your <b>local emergency number</b> right away. If someone is unresponsive or not breathing
          normally, call emergency services and, if you have it, use naloxone for suspected opioid
          overdose.
        </p>
      </Card>

      <Card>
        <h3 className="font-semibold">Find a helpline in your country</h3>
        <p className="mt-1">
          <a href="https://findahelpline.com" {...ext}>findahelpline.com</a> – free, confidential
          support lines worldwide.
        </p>
        <p className="mt-1">
          <a href="https://www.who.int/health-topics/substance-use" {...ext}>
            WHO – substance use information
          </a>
        </p>
      </Card>

      <Card>
        <h3 className="font-semibold">Peer &amp; community support</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><a href="https://www.na.org" {...ext}>Narcotics Anonymous</a></li>
          <li><a href="https://www.smartrecovery.org" {...ext}>SMART Recovery</a></li>
          <li><a href="https://www.aa.org" {...ext}>Alcoholics Anonymous</a></li>
        </ul>
      </Card>

      <Card>
        <h3 className="font-semibold">Important safety note</h3>
        <p className="mt-1">
          Stopping alcohol, benzodiazepines, or heavy opioid use suddenly can be medically dangerous.
          Please speak with a doctor or a treatment service before quitting on your own.
        </p>
      </Card>
    </section>
  );
}
