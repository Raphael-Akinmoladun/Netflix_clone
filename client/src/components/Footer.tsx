const links = [
  'Audio Description', 'Help Centre', 'Gift Cards', 'Media Centre',
  'Investor Relations', 'Jobs', 'Terms of Use', 'Privacy',
  'Legal Notices', 'Cookie Preferences', 'Corporate Information', 'Contact Us',
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 py-12 text-sm text-netflix-gray md:px-8">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {links.map((link) => (
          <li key={link} className="cursor-pointer hover:underline">{link}</li>
        ))}
      </ul>
      <p className="mt-8 text-xs">Netflix Clone — built for learning. Movie data from TMDB.</p>
    </footer>
  );
}
