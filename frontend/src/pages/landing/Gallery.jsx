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

  return (
    <div className="space-y-4 pb-20">
      <section className="relative overflow-hidden h-[80vh] min-h-[400px] flex items-center justify-center -mt-16 pt-16 bg-slate-50 dark:bg-slate-900">
        {/* Background Image */}
         <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 dark:border-slate-800/50">
          <img
            src="/hero/img4.jpg"
            alt="Gallery Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-left border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-orange-600 dark:text-orange-500 leading-tight">
            Photo Gallery
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">
            Glimpses of temples, ashrams, tourists, and holy rituals.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-300"
          >
            {/* Clickable Image via <a> tag */}
            <a 
              href={item.fullUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative h-64 overflow-hidden block cursor-pointer"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                 <span className="opacity-0 group-hover:opacity-100 text-white font-bold bg-black/60 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 scale-95 group-hover:scale-100">
                   View Full Image
                 </span>
              </div>
            </a>

            {/* Description */}
            <div className="p-5 flex-grow">
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
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
