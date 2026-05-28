import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Carousel.css';

const slides = [
  {
    image: '/Library-main-1024x576.png',
    alt: 'Modern library aisle with shelves and reading tables.',
    eyebrow: 'Reading spaces',
    title: 'Bright shelves, clean lines, and quiet corners.',
    description:
      'Lead with a space that feels calm, premium, and genuinely welcoming.',
  },
  {
    image: '/Document.jpeg',
    alt: 'Student using a computer inside a library resource area.',
    eyebrow: 'Digital access',
    title: 'Study support that feels active and connected.',
    description:
      'Show the platform as a bridge between physical resources and digital work.',
  },
  {
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
    alt: 'Team collaborating around desktop computers in a modern office.',
    eyebrow: 'Collaboration',
    title: 'Built for teamwork, not just storage.',
    description:
      'The darker presentation gives collaboration scenes more focus and depth.',
  },
  {
    image: '/vacant-modern-workspace-with-computers_482257-127194.avif',
    alt: 'Modern workspace with rows of computers.',
    eyebrow: 'Workstations',
    title: 'Flexible rooms for research, editing, and focused sessions.',
    description:
      'Use the carousel to suggest both individual concentration and shared momentum.',
  },
  {
    image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg',
    alt: 'Top-down view of a shared table with laptops and devices.',
    eyebrow: 'Shared workflow',
    title: 'A system designed around connected work.',
    description:
      'The mix of library and collaborative imagery makes the landing page feel alive.',
  },
];

export default function Carousel({ showContent = true }) {
  return (
    <div className="carousel-showcase">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        speed={1200}
        loop
        className="carousel-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.image}>
            <article className="carousel-slide">
              <img src={slide.image} alt={slide.alt} />
              {showContent && (
                <>
                  <div className="carousel-slide-shade"></div>
                  <div className="carousel-slide-copy">
                    <span>{slide.eyebrow}</span>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                </>
              )}
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
