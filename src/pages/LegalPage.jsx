import Shell from '../components/Shell'

const UPDATED = 'October 22, 2026'
const EMAIL = 'networkxanadu@gmail.com'

function Legal({ title, children }) {
  return (
    <Shell>
      <article className="deep legal">
        <header className="deep-hero legal-hero">
          <a href="/" className="deep-back" data-cursor="hover">← Back to Xanadu</a>
          <h1 className="display center">{title}</h1>
          <p className="legal-date center">Last updated {UPDATED}</p>
        </header>
        <div className="wrap legal-body">
          {children}
          <p className="legal-q">Questions? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        </div>
      </article>
    </Shell>
  )
}

export function Privacy() {
  return (
    <Legal title="Privacy Policy">
      <p>Xanadu ("we") connects Seekers with retreat spaces (Containers) and guides (Facilitators). This policy explains what we collect, why, and the choices you have. It covers dreamxanadu.com and the Xanadu app.</p>
      <h2>What we collect</h2>
      <ul>
        <li><b>Account details:</b> your email address and, if you sign in with Google or Apple, your name (and, with Google, your profile photo) from that account. With Apple you can choose to hide your email; we then receive a private relay address.</li>
        <li><b>What you share when you join or apply:</b> your name, the stay you designed, and for Containers and Facilitators, your space or practice details, trainings, references, phone number and where you heard about us.</li>
        <li><b>Profile details you add</b> later in the app: photo, region, practices, what you're seeking and offerings.</li>
        <li><b>Messages</b> you send to other members or to the Xanadu team.</li>
        <li><b>Approximate location</b>, only if you join Community in the app. It's rounded to about 1 km on your phone before it's sent, and other members only see a distance in miles, never your location.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To run your account, keep your place on the waitlist and tell you when Xanadu opens.</li>
        <li>To review Container and Facilitator applications. AI may help, but a person makes every decision.</li>
        <li>To match Seekers with spaces and experiences. An AI model reads what you write about what you're seeking and finds the best fits. Your words are not sold or used to advertise to you.</li>
        <li>To keep Xanadu safe, including acting on reports and blocks.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>We don't sell your information. We use trusted providers to run Xanadu: Supabase (database, sign-in and storage), Vercel (hosting), Resend (email), and Google or Apple if you choose to sign in with them. They process data only to provide their service to us.</p>
      <h2>Your choices</h2>
      <ul>
        <li>Ask us at any time to see, correct or delete what you've shared. Write to {EMAIL}.</li>
        <li>Once the app is open: edit your profile, hide yourself from Community, block or report any member, and delete your account and all your data yourself from your profile.</li>
      </ul>
      <h2>Changes</h2>
      <p>If we change this policy, we'll update the date above and tell you by email when the change matters.</p>
    </Legal>
  )
}

export function Terms() {
  return (
    <Legal title="Terms of Service">
      <p>By creating a Xanadu account, on dreamxanadu.com or in the app, you agree to these terms.</p>
      <h2>Who can use Xanadu</h2>
      <p>You must be 18 or older and give accurate information about yourself, your space or your practice.</p>
      <h2>Hosts</h2>
      <ul>
        <li>Containers and Facilitators are independent. They are responsible for their spaces, offerings, safety, permits and insurance.</li>
        <li>Hosts agree to hold space with care and honesty and to make no medical claims or guaranteed outcomes.</li>
        <li>Xanadu reviews hosts before they're listed but does not guarantee any space, offering or person.</li>
      </ul>
      <h2>Community and messages</h2>
      <ul>
        <li>Be kind. No harassment, hate, spam, or pressure of any kind.</li>
        <li>Meet in public and use your own judgment when meeting people through Xanadu.</li>
        <li>We may remove content or accounts that break these terms.</li>
      </ul>
      <h2>Volunteer exchanges and bookings</h2>
      <p>Arrangements are between you and the host. Agree on hours, stay and expectations in writing before you travel.</p>
      <h2>Wellbeing</h2>
      <p>Nothing on Xanadu is medical advice. Talk to a doctor before any practice that could affect your health.</p>
      <h2>Liability</h2>
      <p>Xanadu is provided "as is". To the extent the law allows, we aren't liable for what happens at spaces or experiences found through Xanadu.</p>
      <h2>Changes</h2>
      <p>We may update these terms. If you keep using Xanadu after a change, you accept the new terms.</p>
    </Legal>
  )
}
