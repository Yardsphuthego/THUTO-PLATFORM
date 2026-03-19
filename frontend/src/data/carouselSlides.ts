export type CampusCarouselSlide = {
  image: string;
  alt: string;
  tag: string;
  title: string;
  description: string;
};

const slideContent: Array<Omit<CampusCarouselSlide, 'image'>> = [
  {
    alt: 'Bus terminal scene in Gaborone, Botswana',
    tag: 'Election cycle 2026',
    title: 'Run student elections from one secure platform.',
    description: 'THUTO now highlights university setup, election operations, and portal access in one landing view.',
  },
  {
    alt: 'Central business district view in Gaborone, Botswana',
    tag: 'University governance',
    title: 'Super admin controls universities and scoped admin roles.',
    description: 'Each university can have its own election manager with permissions limited to their assigned campus.',
  },
  {
    alt: 'Gaborone city image featured in the THUTO voting carousel',
    tag: 'Election setup',
    title: 'Schedule ballots, configure positions, and monitor progress.',
    description: 'Admins create election windows and manage position-level ballots from the dashboard.',
  },
  {
    alt: 'Botswana cityscape featured in the THUTO voting carousel',
    tag: 'Candidate management',
    title: 'Upload candidate photos, party logos, and manifestos.',
    description: 'Every candidate entry captures party identity, position, and campaign messaging before voting starts.',
  },
  {
    alt: 'Illustrated election day voting artwork',
    tag: 'Student access',
    title: 'Students review party slates before casting votes.',
    description: 'The student dashboard groups candidates by election, party, and position with manifesto visibility.',
  },
  {
    alt: 'Red and blue vote banner graphic',
    tag: 'Apple theme',
    title: 'A clean black-and-white interface now frames the experience.',
    description: 'The landing page uses a polished Apple-inspired style with focused hierarchy and analytics highlights.',
  },
  {
    alt: 'Voters placing ballots into a ballot box',
    tag: 'Portal ready',
    title: 'Voting operations and portal access now share one entry point.',
    description: 'Users can move directly from the landing overview into admin or student flows without context switching.',
  },
];

const defaultSlideContent: Omit<CampusCarouselSlide, 'image'> = {
  alt: 'A Botswana campus moment featured on the THUTO landing page',
  tag: 'THUTO elections',
  title: 'University election operations on the THUTO homepage.',
  description: 'A focused view of election governance, candidate publishing, and secure access flows.',
};

const preferredCarouselImageNames = [
  'Sarvesh_Lutchmun_-_Bus_Terminal_in_Gaborone,_Botswana.jpg',
  'Botswana-Gaborone-Central-Business-District.webp',
  '33963bac-56b2-4c5a-8066-8c5e4ef13196.webp',
  '2e7bf3d6-6467-45c5-9bd8-790ac16b67dd.jpg',
  'election-day-voting-cartoon-vector-18406969.avif',
  'Vote_redblue2_LoRes_sttntNm.2e16d0ba.fill-1600x500-c100.jpg',
  'voters-persons-casting-ballots-putting-260nw-2193236489.webp',
] as const;

const fallbackCarouselImages = [
  'carousel1.jpg',
  'carousel2.jpg',
  'carousel3.jpg',
  'carousel4.jpg',
].map((name) => new URL(`../assets/images/${name}`, import.meta.url).href);

const carouselImageModules = import.meta.glob('../assets/images/*.*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const preferredCarouselImages = preferredCarouselImageNames
  .map((name) => carouselImageModules[`../assets/images/${name}`])
  .filter((image): image is string => Boolean(image));

const carouselImages =
  preferredCarouselImages.length > 0
    ? preferredCarouselImages
    : fallbackCarouselImages;

export const campusCarouselSlides: CampusCarouselSlide[] = carouselImages.map((image, index) => ({
  image,
  ...(slideContent[index] ?? defaultSlideContent),
}));
