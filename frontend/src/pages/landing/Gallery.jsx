export default function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: 'Majestic Temple View',
      description: 'Ancient temple architecture standing tall against the sky.',
      imageUrl: 'https://thumbs.dreamstime.com/b/view-majestic-temple-sri-draupadi-amman-cap-malheureux-mauritius-rivi-re-du-rempart-district-april-435375019.jpg',
      fullUrl: 'https://thumbs.dreamstime.com/b/view-majestic-temple-sri-draupadi-amman-cap-malheureux-mauritius-rivi-re-du-rempart-district-april-435375019.jpg'
    },
    {
      id: 2,
      title: 'Inside the Shrine',
      description: 'Peaceful and divine atmosphere with glowing oil lamps inside the main shrine.',
      imageUrl: 'https://t3.ftcdn.net/jpg/06/81/26/78/360_F_681267803_qTyCLGro0EjL0gOH2PS7Pxd2OA2qfW6V.jpg',
      fullUrl: 'https://t3.ftcdn.net/jpg/06/81/26/78/360_F_681267803_qTyCLGro0EjL0gOH2PS7Pxd2OA2qfW6V.jpg'
    },
    {
      id: 3,
      title: 'Spiritual Camps',
      description: 'Devotees resting at the beautiful riverside spiritual camps during the yatra.',
      imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=800',
      fullUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=100&w=2000'
    },
    {
      id: 4,
      title: 'Receiving Holy Prasad',
      description: 'Devotees gathering to receive the holy prasad after the morning rituals.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrnWoRNYD6Ahl-9C9KLaSGOzrjp8eGhlkiAA&s',
      fullUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrnWoRNYD6Ahl-9C9KLaSGOzrjp8eGhlkiAA&s'
    },
    {
      id: 5,
      title: 'Evening Aarti',
      description: 'Grand evening aarti at the holy river ghats, illuminated by fire.',
      imageUrl: 'https://res.cloudinary.com/purnesh/image/upload/w_1080,f_auto/eveningaartivaranasi.jpg',
      fullUrl: 'https://res.cloudinary.com/purnesh/image/upload/w_1080,f_auto/eveningaartivaranasi.jpg'
    },
    {
      id: 6,
      title: 'Pilgrim Trekking',
      description: 'Tourists and pilgrims trekking through the scenic mountains to reach the shrine.',
      imageUrl: 'https://cdn.trekthehimalayas.com/images/HomePageImages/Desktop/c744ba81-0637-435d-b91f-c638d9d32a78_Route.webp',
      fullUrl: 'https://cdn.trekthehimalayas.com/images/HomePageImages/Desktop/c744ba81-0637-435d-b91f-c638d9d32a78_Route.webp'
    },
  ];

  const gradient = 'from-[#3a0d0a]/90 via-[#791916]/70 to-[#fdfbf7]';

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-[#3a0d0a] font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex flex-col justify-end items-center pt-16">
        <div className="absolute inset-0">
          <img
            src="/hero/img4.jpg"
            alt="Gallery Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl pb-16">
          <h2 className="text-[#d4af37] text-lg sm:text-xl font-serif tracking-widest mb-2">॥ दिव्य दर्शन ॥</h2>
          <h1 className="text-5xl sm:text-7xl font-serif text-white mb-4 drop-shadow-xl uppercase tracking-wider">
            Photo Gallery
          </h1>
          <p className="text-sm sm:text-lg text-[#fdfbf7] max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light italic">
            Glimpses of temples, ashrams, tourists, and holy rituals.
          </p>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-20 mb-10 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mb-24">
        
        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white border border-[#d4af37]/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#791916]/10 transition-all duration-500"
          >
            {/* Clickable Image via <a> tag */}
            <a 
              href={item.fullUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative h-72 overflow-hidden block cursor-pointer"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a0d0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                 <span className="text-[#d4af37] font-serif font-bold tracking-wider uppercase border border-[#d4af37] px-6 py-2 rounded-full backdrop-blur-sm transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                   View Full Image
                 </span>
              </div>
            </a>

            {/* Description */}
            <div className="p-8 flex-grow text-center">
              <h3 className="font-serif font-bold text-2xl text-[#791916] mb-3">{item.title}</h3>
              <p className="text-base text-[#3a0d0a]/70 font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
